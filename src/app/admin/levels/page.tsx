import { Shell } from "@/components/admin/Shell";
import { requireStaff } from "@/lib/auth/session";
import { getAllLevels } from "@/lib/data";
import { STAGES } from "@/content/levels";
import { saveLevel } from "../actions";

export const metadata = { title: "Academic levels" };

export default async function Levels({ searchParams }: PageProps<"/admin/levels">) {
  const user = await requireStaff("manageContent");
  const sp = await searchParams;
  const levels = await getAllLevels();
  return (
    <Shell user={user} title="Academic levels (12)" flash={{ ok: sp.ok as string | undefined }}>
      <p className="mb-4 max-w-3xl text-sm text-muted">This is the single source for class order, publication, admission availability and age eligibility across the website, enquiry form, analytics and search. Leave eligibility empty until the school confirms it — the site will show “To be confirmed”.</p>
      <div className="space-y-3">
        {levels.map((l) => (
          <form key={l.id} action={saveLevel} className="card grid items-end gap-3 !p-4 md:grid-cols-[150px_80px_150px_1fr_1fr_110px_auto]">
            <input type="hidden" name="id" value={l.id} />
            <div><p className="font-extrabold">{l.name.en} <span className="font-normal text-muted" lang="hi">{l.name.hi}</span></p><p className="text-xs text-muted">{STAGES.find((s) => s.id === l.stage)!.name.en}</p></div>
            <div><label className="field-label" htmlFor={`o-${l.id}`}>Order</label><input id={`o-${l.id}`} name="order" type="number" min={1} max={99} defaultValue={l.order} className="field !min-h-10" /></div>
            <div><label className="field-label" htmlFor={`a-${l.id}`}>Admission</label>
              <select id={`a-${l.id}`} name="admissionOpen" defaultValue={l.admissionOpen === null ? "" : l.admissionOpen ? "open" : "closed"} className="field !min-h-10"><option value="">To be confirmed</option><option value="open">Open</option><option value="closed">Closed</option></select></div>
            <div><label className="field-label" htmlFor={`e-${l.id}`}>Eligibility (English)</label><input id={`e-${l.id}`} name="eligibilityEn" defaultValue={l.eligibility.en ?? ""} maxLength={300} className="field !min-h-10" /></div>
            <div><label className="field-label" htmlFor={`h-${l.id}`}>Eligibility (Hindi)</label><input id={`h-${l.id}`} name="eligibilityHi" lang="hi" defaultValue={l.eligibility.hi ?? ""} maxLength={300} className="field !min-h-10" /></div>
            <label className="flex min-h-10 items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked={l.published} className="h-5 w-5 accent-brand" />Published</label>
            <button className="btn-primary !min-h-10">Save</button>
          </form>
        ))}
      </div>
    </Shell>
  );
}
