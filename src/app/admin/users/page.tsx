import { Shell, fmtDate } from "@/components/admin/Shell";
import { requireStaff } from "@/lib/auth/session";
import { ROLES, ROLE_LABELS } from "@/lib/auth/roles";
import { db, C } from "@/lib/firebase/admin";
import { setUserRole } from "../actions";

export const metadata = { title: "Users & roles" };
const ERR: Record<string, string> = { nouser: "no Firebase Authentication account exists for that email — create it in the Firebase console first", self: "you cannot remove your own Super Admin access" };

export default async function Users({ searchParams }: PageProps<"/admin/users">) {
  const user = await requireStaff("manageUsers");
  const sp = await searchParams;
  const snap = await db().collection(C.users).limit(200).get();
  return (
    <Shell user={user} title="Users & roles" flash={{ ok: sp.ok as string | undefined, error: ERR[sp.error as string] ?? (sp.error as string | undefined) }}>
      <form action={setUserRole} className="card grid items-end gap-4 sm:grid-cols-[1fr_1fr_200px_auto_auto]">
        <div><label htmlFor="email" className="field-label">Staff email</label><input id="email" name="email" type="email" required className="field" /></div>
        <div><label htmlFor="name" className="field-label">Name</label><input id="name" name="name" className="field" /></div>
        <div><label htmlFor="role" className="field-label">Role</label><select id="role" name="role" className="field">{ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}</select></div>
        <label className="flex min-h-11 items-center gap-2"><input type="checkbox" name="active" defaultChecked className="h-5 w-5 accent-brand" />Active</label>
        <button className="btn-primary">Assign</button>
      </form>
      <div className="card mt-6 overflow-x-auto !p-0">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-bg"><tr>{["Email", "Name", "Role", "Active", "Last login"].map((h) => <th key={h} scope="col" className="px-4 py-3">{h}</th>)}</tr></thead>
          <tbody>{snap.docs.map((d) => (
            <tr key={d.id} className="border-t border-brand/5"><td className="px-4 py-3">{d.get("email")}</td><td className="px-4 py-3">{d.get("name")}</td><td className="px-4 py-3">{ROLE_LABELS[d.get("role") as keyof typeof ROLE_LABELS] ?? d.get("role")}</td><td className="px-4 py-3">{d.get("active") === false ? "No" : "Yes"}</td><td className="px-4 py-3 text-muted">{fmtDate(d.get("lastLoginAt"))}</td></tr>
          ))}</tbody>
        </table>
      </div>
    </Shell>
  );
}
