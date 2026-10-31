import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { randomInt } from "node:crypto";
import { z } from "zod";
import { DEFAULT_LEVELS } from "@/content/levels";
import { db, C, isFirebaseConfigured } from "@/lib/firebase/admin";
import { clientIp, hashValue, isSameOrigin, memoryRateLimit, rateLimit } from "@/lib/security/guards";
import { enquirySchema, envelopeSchema, normalizeIndianMobile } from "@/lib/validation/enquiry";
import { queueStaffAlert } from "@/lib/notify";
import { getLevels } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CONSENT_VERSION = "2026-10-enquiry-v1";
const DUPLICATE_WINDOW_MS = 24 * 3600_000;
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I

const bodySchema = z.object({ data: enquirySchema, envelope: envelopeSchema });
const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

function newReference() {
  const year = new Date().getFullYear();
  let s = "";
  for (let i = 0; i < 6; i++) s += ALPHABET[randomInt(ALPHABET.length)];
  return `VMIS-${year}-${s}`;
}

export async function POST(req: Request) {
  if (!isSameOrigin(req)) return json({ error: "forbidden" }, 403);
  if (!isFirebaseConfigured()) return json({ error: "unavailable" }, 503);
  const ip = clientIp(req.headers);
  if (!memoryRateLimit(`enq:${ip}`, 10, 10 * 60_000)) return json({ error: "rate_limited" }, 429);

  const len = Number(req.headers.get("content-length") ?? 0);
  if (len > 8_000) return json({ error: "too_large" }, 413);

  let parsed;
  try {
    parsed = bodySchema.safeParse(await req.json());
  } catch {
    return json({ error: "invalid_json" }, 400);
  }
  if (!parsed.success) return json({ error: "validation", issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), code: i.message })) }, 400);
  const { data, envelope } = parsed.data;

  // Bot heuristics: honeypot filled or submitted implausibly fast → pretend success, store nothing.
  if (envelope.website || Date.now() - envelope.startedAt < 2500) return json({ reference: newReference() });

  try {
    if (!(await rateLimit(`enq:${ip}`, 5, 3600))) return json({ error: "rate_limited" }, 429);

    const level = (await getLevels()).find((l) => l.id === data.levelId) ?? DEFAULT_LEVELS.find((l) => l.id === data.levelId)!;
    const mobile = normalizeIndianMobile(data.mobile)!;
    const mobileHash = hashValue(`m:${mobile}`);
    const firestore = db();
    const idemRef = firestore.collection(C.idempotency).doc(hashValue(`idem:${envelope.idempotencyKey}`));

    const result = await firestore.runTransaction(async (tx) => {
      // 1. Idempotency: a retried request returns the original reference.
      const idem = await tx.get(idemRef);
      if (idem.exists) return { reference: idem.get("reference") as string, enquiryId: idem.get("enquiryId") as string, created: false };

      // 2. Duplicate detection: same mobile + class within 24h → return the existing reference.
      const dup = await tx.get(firestore.collection(C.enquiries).where("mobileHash", "==", mobileHash).where("levelId", "==", data.levelId).where("createdAt", ">", new Date(Date.now() - DUPLICATE_WINDOW_MS)).limit(1));
      const existing = dup.docs[0];
      if (existing) {
        tx.set(idemRef, { reference: existing.get("reference"), enquiryId: existing.id, createdAt: FieldValue.serverTimestamp(), expiresAt: new Date(Date.now() + 7 * 86400_000) });
        return { reference: existing.get("reference") as string, enquiryId: existing.id, created: false };
      }

      const ref = firestore.collection(C.enquiries).doc();
      const reference = newReference();
      tx.create(ref, {
        reference,
        parentName: data.parentName,
        mobile,
        mobileHash,
        email: data.email || null,
        language: data.language,
        levelId: data.levelId,
        levelName: level.name.en,
        stage: level.stage,
        contactTime: data.contactTime,
        currentSchool: data.currentSchool ?? null,
        visitInterest: data.visitInterest,
        message: data.message ?? null,
        status: "new",
        notes: [],
        source: "website",
        consentVersion: CONSENT_VERSION,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      tx.create(firestore.collection(C.consents).doc(), {
        enquiryId: ref.id, purpose: "admission_enquiry", version: CONSENT_VERSION, givenBy: "parent_guardian", ipHash: hashValue(`ip:${ip}`), at: FieldValue.serverTimestamp(), withdrawnAt: null,
      });
      tx.create(firestore.collection(C.statusHistory).doc(), { enquiryId: ref.id, from: null, to: "new", by: "website", at: FieldValue.serverTimestamp() });
      if (data.visitInterest) {
        tx.create(firestore.collection(C.appointments).doc(), { enquiryId: ref.id, reference, type: "school_visit", status: "requested", scheduledAt: null, createdAt: FieldValue.serverTimestamp() });
      }
      tx.set(idemRef, { reference, enquiryId: ref.id, createdAt: FieldValue.serverTimestamp(), expiresAt: new Date(Date.now() + 7 * 86400_000) });
      return { reference, enquiryId: ref.id, created: true };
    });

    // Notifications only after the enquiry is safely stored; failures never affect the parent's response.
    if (result.created) await queueStaffAlert(result.enquiryId, result.reference, level.name.en).catch((e) => console.error("[enquiry] notify queue failed", e));
    return json({ reference: result.reference });
  } catch (e) {
    console.error("[enquiry] failed", e);
    return json({ error: "server_error" }, 500);
  }
}
