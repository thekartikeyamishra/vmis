// Usage: npm run set-role -- admin@school.in super_admin
// The user must already exist in Firebase Authentication (create it in the Firebase console).
import { init } from "./_admin.mjs";

const ROLES = ["super_admin", "school_management", "principal", "admission_officer", "content_editor", "viewer"];
const [email, role] = process.argv.slice(2);
if (!email || !ROLES.includes(role)) {
  console.error(`Usage: npm run set-role -- <email> <${ROLES.join("|")}>`);
  process.exit(1);
}
const { db, auth } = init();
const user = await auth.getUserByEmail(email.toLowerCase());
await db.collection("users").doc(user.uid).set({ email: email.toLowerCase(), role, active: true, name: user.displayName ?? email, updatedAt: new Date(), updatedBy: "cli" }, { merge: true });
await db.collection("audit_logs").add({ actorUid: "cli", actorEmail: "cli", action: "user.role", target: user.uid, details: { email, role }, at: new Date() });
console.log(`✓ ${email} → ${role}`);
