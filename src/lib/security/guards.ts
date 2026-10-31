import "server-only";
import { createHash } from "node:crypto";
import { FieldValue } from "firebase-admin/firestore";
import { db, C } from "@/lib/firebase/admin";

export function hashValue(value: string): string {
  const salt = process.env.HASH_SALT;
  if (!salt && process.env.NODE_ENV === "production") throw new Error("HASH_SALT is required in production");
  return createHash("sha256").update(`${salt ?? "dev-salt"}:${value}`).digest("hex");
}

export function clientIp(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
}

/** CSRF defence for JSON POST endpoints: require same-origin Origin header. */
export function isSameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/**
 * Fixed-window rate limiter persisted in Firestore (works across serverless instances).
 * Returns true when the request is allowed.
 */
export async function rateLimit(key: string, limit: number, windowSec: number): Promise<boolean> {
  const windowId = Math.floor(Date.now() / 1000 / windowSec);
  const ref = db().collection(C.rateLimits).doc(`${hashValue(key)}_${windowSec}_${windowId}`);
  return db().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const count = (snap.exists ? (snap.get("count") as number) : 0) + 1;
    if (count > limit) return false;
    tx.set(ref, { count, expiresAt: new Date((windowId + 1) * windowSec * 1000 + 3600_000) }, { merge: true });
    return true;
  });
}

/** In-memory fallback limiter (per instance) used before touching the database. */
const memory = new Map<string, { n: number; reset: number }>();
export function memoryRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const e = memory.get(key);
  if (!e || e.reset < now) {
    memory.set(key, { n: 1, reset: now + windowMs });
    if (memory.size > 5000) for (const [k, v] of memory) if (v.reset < now) memory.delete(k);
    return true;
  }
  e.n += 1;
  return e.n <= limit;
}

export const serverTimestamp = () => FieldValue.serverTimestamp();
