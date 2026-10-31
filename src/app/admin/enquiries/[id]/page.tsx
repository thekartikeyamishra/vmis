import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell, STATUS_LABEL, fmtDate } from "@/components/admin/Shell";
import { requireStaff } from "@/lib/auth/session";
import { can } from "@/lib/auth/roles";
import { db, C } from "@/lib/firebase/admin";
import { audit } from "@/lib/audit";
import { ENQUIRY_STATUSES } from "@/lib/validation/enquiry";
import { eraseEnquiry, scheduleVisit, updateEnquiry } from "../../actions";

export const metadata = { title: "Enquiry" };

export default async function EnquiryDetail({ params, searchParams }: PageProps<"/admin/enquiries/[id]">) {
  const user = await requireStaff("viewEnquiries");
  const { id } = await params;
  const sp = await searchParams;
  if (!/^[A-Za-z0-9]{1,64}$/.test(id)) notFound();
  const doc = await db().collection(C.enquiries).doc(id).get();
  if (!doc.exists) notFound();
  const [history, appts] = await Promise.all([
    db().collection(C.statusHistory).where("enquiryId", "==", id).orderBy("at", "desc").limit(50).get(),
    db().collection(C.appointments).where("enquiryId", "==", id).get(),
  ]);
  await audit(user, "enquiry.view", id); // access to personal data is logged
  const e = doc.data()!;
  const manage = can(user.role, "manageEnquiries");
  const fields: [string, React.ReactNode][] = [
    ["Parent / guardian", e.parentName], ["Mobile", e.mobile ? <a className="text-brand hover:underline" href={`tel:+91${e.mobile}`}>+91 {e.mobile}</a> : "—"],
    ["Email", e.email ?? "—"], ["Preferred language", e.language === "hi" ? "Hindi" : "English"], ["Class sought", e.levelName],
    ["Contact time", e.contactTime], ["Current school", e.currentSchool ?? "—"], ["Visit interest", e.visitInterest ? "Yes" : "No"],
    ["Message", e.message ?? "—"], ["Received", fmtDate(e.createdAt)], ["Consent version", e.consentVersion],
  ];

  return (
    <Shell user={user} title={`Enquiry ${e.reference}`} flash={{ ok: sp.ok as string | undefined, error: sp.error as string | undefined }}>
      <Link href="/admin/enquiries" className="text-sm font-semibold text-brand hover:underline">← All enquiries</Link>
      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_380px]">
        <section className="card">
          <dl className="grid gap-4 sm:grid-cols-2">{fields.map(([k, v]) => <div key={k}><dt className="text-xs font-bold uppercase text-brand">{k}</dt><dd className="mt-1 whitespace-pre-line break-words">{v}</dd></div>)}</dl>
          <h2 className="mt-8 text-lg font-extrabold">Notes</h2>
          <ul className="mt-2 space-y-2 text-sm">
            {(e.notes ?? []).length === 0 && <li className="text-muted">No notes yet.</li>}
            {(e.notes ?? []).map((n: { text: string; by: string; at: string }, i: number) => <li key={i} className="rounded-xl bg-bg p-3"><p>{n.text}</p><p className="mt-1 text-xs text-muted">{n.by} · {fmtDate(n.at)}</p></li>)}
          </ul>
        </section>
        <div className="space-y-6">
          {manage && (
            <form action={updateEnquiry} className="card space-y-3">
              <input type="hidden" name="id" value={id} />
              <h2 className="text-lg font-extrabold">Update</h2>
              <div><label htmlFor="st" className="field-label">Status</label>
                <select id="st" name="status" defaultValue={e.status} className="field">{ENQUIRY_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}</select></div>
              <div><label htmlFor="note" className="field-label">Add note</label><textarea id="note" name="note" rows={3} maxLength={1000} className="field" /></div>
              <button className="btn-primary w-full">Save</button>
            </form>
          )}
          {appts.docs.map((a) => (
            <form key={a.id} action={scheduleVisit} className="card space-y-3">
              <input type="hidden" name="appointmentId" value={a.id} /><input type="hidden" name="enquiryId" value={id} />
              <h2 className="text-lg font-extrabold">School visit</h2>
              <p className="text-sm text-muted">Current: {a.get("status")} {a.get("scheduledAt") ? `· ${fmtDate(a.get("scheduledAt"))}` : ""}</p>
              {manage && <>
                <div><label htmlFor={`w-${a.id}`} className="field-label">Date & time (IST)</label><input id={`w-${a.id}`} type="datetime-local" name="scheduledAt" className="field" /></div>
                <div><label htmlFor={`s-${a.id}`} className="field-label">Status</label>
                  <select id={`s-${a.id}`} name="status" defaultValue={a.get("status")} className="field">{["requested", "scheduled", "completed", "cancelled", "no_show"].map((s) => <option key={s}>{s}</option>)}</select></div>
                <button className="btn-ghost w-full">Update visit</button>
              </>}
            </form>
          ))}
          <section className="card">
            <h2 className="text-lg font-extrabold">Status history</h2>
            <ol className="mt-3 space-y-2 text-sm">{history.docs.map((h) => <li key={h.id}><span className="font-semibold">{STATUS_LABEL[h.get("to")] ?? h.get("to")}</span> <span className="text-muted">· {h.get("by")} · {fmtDate(h.get("at"))}</span></li>)}</ol>
          </section>
          {can(user.role, "exportData") && e.parentName !== "[erased]" && (
            <form action={eraseEnquiry} className="card space-y-3 border-red-200">
              <input type="hidden" name="id" value={id} />
              <h2 className="text-lg font-extrabold text-red-800">Erase personal data</h2>
              <p className="text-xs text-muted">Use only on a verified parent request (DPDP). Type ERASE to confirm.</p>
              <input name="confirm" className="field" aria-label="Type ERASE to confirm" autoComplete="off" />
              <button className="btn w-full bg-red-700 text-white hover:bg-red-800">Erase</button>
            </form>
          )}
        </div>
      </div>
    </Shell>
  );
}
