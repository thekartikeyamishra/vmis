import { Shell } from "@/components/admin/Shell";
import { requireStaff } from "@/lib/auth/session";
import { getSettings } from "@/lib/data";
import { OFFICIAL } from "@/content/school";
import { saveSettings } from "../actions";

export const metadata = { title: "School settings" };

function F({ name, label, value, type = "text", hi = false, area = false }: { name: string; label: string; value: string | null; type?: string; hi?: boolean; area?: boolean }) {
  return (
    <div className={area ? "sm:col-span-2" : undefined}>
      <label htmlFor={name} className="field-label">{label}</label>
      {area ? <textarea id={name} name={name} rows={5} defaultValue={value ?? ""} lang={hi ? "hi" : undefined} className="field" />
        : <input id={name} name={name} type={type} defaultValue={value ?? ""} lang={hi ? "hi" : undefined} className="field" />}
    </div>
  );
}

export default async function Settings({ searchParams }: PageProps<"/admin/settings">) {
  const user = await requireStaff("manageSettings");
  const sp = await searchParams;
  const s = await getSettings();
  const a = s.affiliation;
  return (
    <Shell user={user} title="School settings" flash={{ ok: sp.ok as string | undefined, error: sp.error as string | undefined }}>
      <div className="card mb-6 !p-4 text-sm">
        <p className="font-bold">Official identity (locked in code, not editable here)</p>
        <p className="mt-1">{OFFICIAL.nameEn} · <span lang="hi">{OFFICIAL.nameHi}</span> · {OFFICIAL.acronym} · <span lang="hi">{OFFICIAL.motto}</span></p>
      </div>
      <form action={saveSettings} className="space-y-6">
        <fieldset className="card grid gap-4 sm:grid-cols-2"><legend className="px-2 text-lg font-extrabold">Contact</legend>
          <F name="addressEn" label="Address (English)" value={s.addressEn} /><F name="addressHi" label="Address (Hindi)" value={s.addressHi} hi />
          <F name="postalCode" label="PIN code" value={s.postalCode} /><F name="phone" label="Phone" value={s.phone} type="tel" />
          <F name="whatsapp" label="WhatsApp (official business number)" value={s.whatsapp} type="tel" /><F name="email" label="Email" value={s.email} type="email" />
          <F name="officeHoursEn" label="Office hours (English)" value={s.officeHoursEn} /><F name="officeHoursHi" label="Office hours (Hindi)" value={s.officeHoursHi} hi />
          <F name="schoolTimingsEn" label="School timings (English)" value={s.schoolTimingsEn} /><F name="schoolTimingsHi" label="School timings (Hindi)" value={s.schoolTimingsHi} hi />
          <F name="mapUrl" label="Google Maps link (https://)" value={s.mapUrl} type="url" />
          <div><label htmlFor="transportAvailable" className="field-label">Transport</label>
            <select id="transportAvailable" name="transportAvailable" defaultValue={s.transportAvailable === null ? "" : s.transportAvailable ? "yes" : "no"} className="field"><option value="">To be confirmed</option><option value="yes">Available</option><option value="no">Not available</option></select></div>
        </fieldset>
        <fieldset className="card grid gap-4 sm:grid-cols-2"><legend className="px-2 text-lg font-extrabold">Admissions & fees</legend>
          <F name="academicSession" label="Academic session (e.g. 2027–28)" value={s.academicSession} />
          <label className="flex items-center gap-2 pt-7"><input type="checkbox" name="admissionsOpen" defaultChecked={s.admissionsOpen} className="h-5 w-5 accent-brand" />Show “Admissions open” announcement</label>
          <F name="feeNoteEn" label="Fee information (English)" value={s.feeNoteEn} area /><F name="feeNoteHi" label="Fee information (Hindi)" value={s.feeNoteHi} area hi />
        </fieldset>
        <fieldset className="card grid gap-4 sm:grid-cols-2"><legend className="px-2 text-lg font-extrabold">Principal</legend>
          <F name="principalName" label="Principal’s name" value={s.principalName} />
          <div />
          <F name="principalMessageEn" label="Message (English)" value={s.principalMessageEn} area /><F name="principalMessageHi" label="Message (Hindi)" value={s.principalMessageHi} area hi />
        </fieldset>
        <fieldset className="card grid gap-4 sm:grid-cols-2"><legend className="px-2 text-lg font-extrabold">CBSE affiliation (publish only verified details)</legend>
          <div><label htmlFor="affiliationStatus" className="field-label">Status</label>
            <select id="affiliationStatus" name="affiliationStatus" defaultValue={a.status} className="field">
              <option value="not_verified">Not verified (hidden on site)</option><option value="applied">Applied</option><option value="provisional">Provisional</option><option value="regular">Regular</option><option value="not_affiliated">Not affiliated</option>
            </select></div>
          <F name="verifiedOn" label="Verified on (YYYY-MM-DD) — required to display" value={a.verifiedOn} type="date" />
          <F name="affiliationNumber" label="Affiliation number" value={a.affiliationNumber} /><F name="schoolCode" label="School code" value={a.schoolCode} />
          <F name="affiliationCategory" label="Category" value={a.category} /><F name="validUntil" label="Valid until" value={a.validUntil} type="date" />
        </fieldset>
        <fieldset className="card grid gap-4 sm:grid-cols-2"><legend className="px-2 text-lg font-extrabold">Apps & social (leave empty until live)</legend>
          <F name="playStoreUrl" label="Google Play URL" value={s.playStoreUrl} type="url" /><F name="appStoreUrl" label="App Store URL" value={s.appStoreUrl} type="url" />
          <F name="facebook" label="Facebook URL" value={s.social.facebook} type="url" /><F name="instagram" label="Instagram URL" value={s.social.instagram} type="url" />
          <F name="youtube" label="YouTube URL" value={s.social.youtube} type="url" />
        </fieldset>
        <button className="btn-primary">Save settings</button>
      </form>
    </Shell>
  );
}
