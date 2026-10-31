import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { adminAuth, db, C, isFirebaseConfigured } from "@/lib/firebase/admin";
import { can, isRole, type Capability, type Role } from "./roles";

/** `__session` is the only cookie name Firebase Hosting forwards to the backend. */
export const SESSION_COOKIE = "__session";
export const SESSION_DAYS = 5;

export interface StaffUser { uid: string; email: string; name: string; role: Role }

/** Verifies the session cookie (with revocation check) and loads the role from Firestore — never from the client. */
export const getStaffUser = cache(async (): Promise<StaffUser | null> => {
  if (!isFirebaseConfigured()) return null;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const decoded = await adminAuth().verifySessionCookie(token, true);
    const snap = await db().collection(C.users).doc(decoded.uid).get();
    const role = snap.get("role");
    if (!snap.exists || snap.get("active") === false || !isRole(role)) return null;
    return { uid: decoded.uid, email: decoded.email ?? snap.get("email") ?? "", name: snap.get("name") ?? decoded.email ?? "Staff", role };
  } catch {
    return null;
  }
});

export async function requireStaff(cap?: Capability): Promise<StaffUser> {
  const user = await getStaffUser();
  if (!user) redirect("/admin/login");
  if (cap && !can(user.role, cap)) redirect("/admin?denied=1");
  return user;
}

/** For server actions / route handlers: throws instead of redirecting. */
export async function assertCan(cap: Capability): Promise<StaffUser> {
  const user = await getStaffUser();
  if (!user || !can(user.role, cap)) throw new Error("FORBIDDEN");
  return user;
}
