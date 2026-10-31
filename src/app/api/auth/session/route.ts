import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { adminAuth, db, C, isFirebaseConfigured } from "@/lib/firebase/admin";
import { SESSION_COOKIE, SESSION_DAYS } from "@/lib/auth/session";
import { isRole } from "@/lib/auth/roles";
import { clientIp, isSameOrigin, memoryRateLimit } from "@/lib/security/guards";
import { audit } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Exchange a fresh Firebase ID token for an httpOnly session cookie (staff only). */
export async function POST(req: Request) {
  if (!isSameOrigin(req)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (!isFirebaseConfigured()) return NextResponse.json({ error: "unavailable" }, { status: 503 });
  if (!memoryRateLimit(`login:${clientIp(req.headers)}`, 10, 15 * 60_000)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const body = z.object({ idToken: z.string().min(20).max(5000) }).safeParse(await req.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: "invalid" }, { status: 400 });

  try {
    const decoded = await adminAuth().verifyIdToken(body.data.idToken, true);
    if (Date.now() / 1000 - decoded.auth_time > 5 * 60) return NextResponse.json({ error: "recent_login_required" }, { status: 401 });
    const user = await db().collection(C.users).doc(decoded.uid).get();
    if (!user.exists || user.get("active") === false || !isRole(user.get("role"))) {
      await audit({ uid: decoded.uid, email: decoded.email ?? "" }, "auth.denied", decoded.uid);
      return NextResponse.json({ error: "not_staff" }, { status: 403 });
    }
    const expiresIn = SESSION_DAYS * 86400_000;
    const session = await adminAuth().createSessionCookie(body.data.idToken, { expiresIn });
    (await cookies()).set(SESSION_COOKIE, session, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: expiresIn / 1000 });
    await db().collection(C.users).doc(decoded.uid).set({ lastLoginAt: new Date(), email: decoded.email ?? user.get("email") }, { merge: true });
    await audit({ uid: decoded.uid, email: decoded.email ?? "" }, "auth.login", decoded.uid);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "invalid_token" }, { status: 401 });
  }
}

/** Logout: clear the cookie and revoke refresh tokens so stolen sessions die too. */
export async function DELETE(req: Request) {
  if (!isSameOrigin(req)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  jar.delete(SESSION_COOKIE);
  if (token && isFirebaseConfigured()) {
    try {
      const d = await adminAuth().verifySessionCookie(token);
      await adminAuth().revokeRefreshTokens(d.sub);
      await audit({ uid: d.sub, email: d.email ?? "" }, "auth.logout", d.sub);
    } catch { /* already invalid */ }
  }
  return NextResponse.json({ ok: true });
}
