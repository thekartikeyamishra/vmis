import Link from "next/link";
import { Shell, STATUS_LABEL } from "@/components/admin/Shell";
import { requireStaff } from "@/lib/auth/session";
import { can } from "@/lib/auth/roles";
import { db, C } from "@/lib/firebase/admin";
import { getAllLevels } from "@/lib/data";
import { ENQUIRY_STATUSES } from "@/lib/validation/enquiry";

export const metadata = { title: "Dashboard" };

export default async function Dashboard({ searchParams }: PageProps<"/admin">) {
  const user = await requireStaff();
  const sp = await searchParams;
  const levels = await getAllLevels();
  const enq = db().collection(C.enquiries);
  const since30 = new Date(Date.now() - 30 * 86400_000);
  const [total, last30, byStatus, byLevel, visits, docs] = await Promise.all([
    enq.count().get(),
    enq.where("createdAt", ">", since30).count().get(),
    Promise.all(ENQUIRY_STATUSES.map((s) => enq.where("status", "==", s).count().get())),
    Promise.all(levels.map((l) => enq.where("levelId", "==", l.id).count().get())),
    db().collection(C.appointments).where("status", "==", "requested").count().get(),
    db().collection(C.publicDocuments).where("status", "==", "published").get(),
  ]);
  const soon = Date.now() + 60 * 86400_000;
  const expiring = docs.docs.filter((d) => { const v = d.get("validUntil"); return v && new Date(v).getTime() < soon; });
  const maxLevel = Math.max(1, ...byLevel.map((c) => c.data().count));

  return (
    <Shell user={user} title="Dashboard" flash={{ error: sp.denied ? "you do not have permission for that page" : undefined }}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[["Total enquiries", total.data().count], ["Last 30 days", last30.data().count], ["New (unhandled)", byStatus[0]!.data().count], ["Visit requests pending", visits.data().count]].map(([k, v]) => (
          <div key={k as string} className="card !p-5"><p className="text-sm text-muted">{k}</p><p className="mt-1 text-3xl font-extrabold text-brand-900">{v}</p></div>
        ))}
      </div>
      {expiring.length > 0 && (
        <div role="alert" className="mt-6 rounded-2xl border border-sun/50 bg-[#FFF7EC] p-4 text-sm">
          <p className="font-bold text-sun-700">Disclosure documents expiring within 60 days</p>
          <ul className="mt-2 list-disc pl-5">{expiring.map((d) => <li key={d.id}>{d.get("title")} — valid until {d.get("validUntil")}</li>)}</ul>
        </div>
      )}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="card">
          <h2 className="text-lg font-extrabold">Enquiries by class (all 12 levels)</h2>
          <ul className="mt-4 space-y-2">
            {levels.map((l, i) => {
              const n = byLevel[i]!.data().count;
              return (
                <li key={l.id} className="grid grid-cols-[90px_1fr_40px] items-center gap-3 text-sm">
                  <Link href={`/admin/enquiries?level=${l.id}`} className="font-semibold hover:text-brand">{l.name.en}</Link>
                  <span className="h-3 rounded-full bg-bg"><span className="block h-3 rounded-full bg-brand-2" style={{ width: `${(n / maxLevel) * 100}%` }} /></span>
                  <span className="text-right tabular-nums">{n}</span>
                </li>
              );
            })}
          </ul>
        </section>
        <section className="card">
          <h2 className="text-lg font-extrabold">Admission pipeline</h2>
          <ul className="mt-4 divide-y divide-brand/10">
            {ENQUIRY_STATUSES.map((s, i) => (
              <li key={s} className="flex justify-between py-2 text-sm"><Link href={`/admin/enquiries?status=${s}`} className="hover:text-brand">{STATUS_LABEL[s]}</Link><span className="font-bold tabular-nums">{byStatus[i]!.data().count}</span></li>
            ))}
          </ul>
          {can(user.role, "exportData") && (
            <div className="mt-6 flex flex-wrap gap-2">
              <a className="btn-ghost !min-h-9 !text-xs" href="/api/admin/export?collection=admission_enquiries&format=csv">Export enquiries (CSV)</a>
              <a className="btn-ghost !min-h-9 !text-xs" href="/api/admin/export?collection=all">Full backup (JSON + checksums)</a>
            </div>
          )}
        </section>
      </div>
    </Shell>
  );
}
