import "server-only";
import { FieldValue } from "firebase-admin/firestore";
import { db, C } from "@/lib/firebase/admin";

export async function audit(actor: { uid: string; email: string } | "system", action: string, target: string, details: Record<string, unknown> = {}) {
  try {
    await db().collection(C.audit).add({
      actorUid: actor === "system" ? "system" : actor.uid,
      actorEmail: actor === "system" ? "system" : actor.email,
      action,
      target,
      details,
      at: FieldValue.serverTimestamp(),
    });
  } catch (e) {
    console.error("[audit] failed", action, target, e);
  }
}
