import "server-only";
import { FieldValue } from "firebase-admin/firestore";
import { db, C } from "@/lib/firebase/admin";

/**
 * Pluggable notification providers. Jobs are queued in `notification_jobs` only AFTER the enquiry is stored,
 * and processed by /api/jobs/notify (idempotent: one job per enquiry+channel, deterministic doc id).
 * Add SMS / authorised WhatsApp Business providers by implementing `NotifyProvider`.
 */
export interface NotifyMessage { to: string; subject: string; text: string }
export interface NotifyProvider { name: string; send(msg: NotifyMessage): Promise<void> }

const logProvider: NotifyProvider = {
  name: "log",
  async send(msg) {
    console.info("[notify:log]", msg.to, msg.subject);
  },
};

const resendProvider: NotifyProvider = {
  name: "resend",
  async send(msg) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env.NOTIFY_FROM_EMAIL, to: [msg.to], subject: msg.subject, text: msg.text }),
    });
    if (!res.ok) throw new Error(`resend ${res.status}`);
  },
};

export function provider(): NotifyProvider {
  return process.env.NOTIFY_PROVIDER === "resend" && process.env.RESEND_API_KEY ? resendProvider : logProvider;
}

export async function queueStaffAlert(enquiryId: string, reference: string, levelName: string) {
  const to = process.env.NOTIFY_ADMISSIONS_EMAIL;
  if (!to) return;
  await db().collection(C.notifications).doc(`${enquiryId}_staff_email`).create({
    enquiryId,
    channel: "email",
    to,
    subject: `New admission enquiry ${reference} — ${levelName}`,
    // No personal data in the notification body: staff open the dashboard to view details.
    text: `A new admission enquiry (${reference}) for ${levelName} was received. Open the VMIS admin dashboard to view it.`,
    status: "pending",
    attempts: 0,
    createdAt: FieldValue.serverTimestamp(),
  }).catch(() => undefined); // already queued → idempotent
}

export async function processPendingJobs(max = 20) {
  const p = provider();
  const snap = await db().collection(C.notifications).where("status", "==", "pending").limit(max).get();
  let sent = 0, failed = 0;
  for (const doc of snap.docs) {
    // Claim the job atomically so concurrent runners never double-send.
    const claimed = await db().runTransaction(async (tx) => {
      const fresh = await tx.get(doc.ref);
      if (fresh.get("status") !== "pending") return false;
      tx.update(doc.ref, { status: "sending", attempts: FieldValue.increment(1), updatedAt: FieldValue.serverTimestamp() });
      return true;
    });
    if (!claimed) continue;
    try {
      await p.send({ to: doc.get("to"), subject: doc.get("subject"), text: doc.get("text") });
      await doc.ref.update({ status: "sent", provider: p.name, sentAt: FieldValue.serverTimestamp() });
      sent++;
    } catch (e) {
      const attempts = (doc.get("attempts") ?? 0) + 1;
      await doc.ref.update({ status: attempts >= 5 ? "failed" : "pending", lastError: String(e).slice(0, 300) });
      failed++;
    }
  }
  return { processed: snap.size, sent, failed };
}
