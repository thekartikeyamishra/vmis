import Link from "next/link";
import { Shell, STATUS_LABEL, fmtDate } from "@/components/admin/Shell";
import { requireStaff } from "@/lib/auth/session";
import { db, C } from "@/lib/firebase/admin";
import { getAllLevels } from "@/lib/data";
import { ENQUIRY_STATUSES } from "@/lib/validation/enquiry";
import { isLevelId } from "@/content/levels";

export const metadata = { title: "Enquiries" };
const PAGE = 50;

export default async function Enquiries({ searchParams }: PageProps<"/admin/enquiries">) {
  const user = await requireStaff("viewEnquiries");
  const sp = await searchParams;
  const status = typeof sp.status === "string" && (ENQUIRY_STATUSES as readonly string[]).includes(sp.status) ? sp.status : "";
  const level = typeof sp.level === "string" && isLevelId(sp.level) ? sp.level : "";
  const after = typeof sp.after === "string" ? sp.after : "";
  const levels = await getAllLevels();

  let q: FirebaseFirestore.Query = db().collection(C.enquiries);
  if (status) q = q.where("status", "==", status);
  if (level) q = q.where("levelId", "==", level);
  q = q.orderBy("createdAt", "desc").limit(PAGE + 1);
  if (after) { const cur = await db().collection(C.enquiries).doc(after).get(); if (cur.exists) q = q.startAfter(cur); }
  const snap = await q.get();
  const rows = snap.docs.slice(0, PAGE);
  const next = snap.size > PAGE ? rows[rows.length - 1]?.id : null;
  const qs = (extra: Record<string, string>) => "?" + new URLSearchParams({ ...(status && { status }), ...(level && { level }), ...extra }).toString();

  return (
    <Shell user={user} title="Admission enquiries">
      <form className="card flex flex-wrap items-end gap-3 !p-4" method="get">
        <div><label htmlFor="status" className="field-label">Status</label>
          <select id="status" name="status" defaultValue={status} className="field !min-h-10"><option value="">All</option>{ENQUIRY_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}</select></div>
        <div><label htmlFor="level" className="field-label">Class</label>
          <select id="level" name="level" defaultValue={level} className="field !min-h-10"><option value="">All 12 levels</option>{levels.map((l) => <option key={l.id} value={l.id}>{l.name.en}</option>)}</select></div>
        <button className="btn-primary !min-h-10">Filter</button>
      </form>
      <div className="card mt-4 overflow-x-auto !p-0">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-bg text-brand-900"><tr>{["Reference", "Received", "Parent", "Class", "Visit", "Status"].map((h) => <th key={h} scope="col" className="px-4 py-3">{h}</th>)}</tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-muted">No enquiries match these filters.</td></tr>}
            {rows.map((d) => (
              <tr key={d.id} className="border-t border-brand/5 hover:bg-bg/60">
                <td className="px-4 py-3 font-mono"><Link className="font-bold text-brand hover:underline" href={`/admin/enquiries/${d.id}`}>{d.get("reference")}</Link></td>
                <td className="px-4 py-3 text-muted">{fmtDate(d.get("createdAt"))}</td>
                <td className="px-4 py-3">{d.get("parentName")}</td>
                <td className="px-4 py-3">{d.get("levelName")}</td>
                <td className="px-4 py-3">{d.get("visitInterest") ? "Yes" : "—"}</td>
                <td className="px-4 py-3"><span className="rounded-full bg-bg px-2.5 py-1 text-xs font-semibold">{STATUS_LABEL[d.get("status")] ?? d.get("status")}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex gap-3">
        {after && <Link className="btn-ghost !min-h-9" href={qs({})}>← First page</Link>}
        {next && <Link className="btn-ghost !min-h-9" href={qs({ after: next })}>Next page →</Link>}
      </div>
    </Shell>
  );
}
