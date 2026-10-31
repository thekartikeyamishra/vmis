import { Shell, fmtDate } from "@/components/admin/Shell";
import { requireStaff } from "@/lib/auth/session";
import { db, C } from "@/lib/firebase/admin";

export const metadata = { title: "Audit log" };

export default async function Audit() {
  const user = await requireStaff("viewAudit");
  const snap = await db().collection(C.audit).orderBy("at", "desc").limit(200).get();
  return (
    <Shell user={user} title="Audit log (latest 200)">
      <div className="card overflow-x-auto !p-0">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-bg"><tr>{["When", "Who", "Action", "Target"].map((h) => <th key={h} scope="col" className="px-4 py-3">{h}</th>)}</tr></thead>
          <tbody>{snap.docs.map((d) => (
            <tr key={d.id} className="border-t border-brand/5"><td className="px-4 py-2.5 text-muted">{fmtDate(d.get("at"))}</td><td className="px-4 py-2.5">{d.get("actorEmail")}</td><td className="px-4 py-2.5 font-mono text-xs">{d.get("action")}</td><td className="px-4 py-2.5 font-mono text-xs">{d.get("target")}</td></tr>
          ))}</tbody>
        </table>
      </div>
    </Shell>
  );
}
