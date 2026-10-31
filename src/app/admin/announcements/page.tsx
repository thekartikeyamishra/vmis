import { Shell } from "@/components/admin/Shell";
import { requireStaff } from "@/lib/auth/session";
import { db, C } from "@/lib/firebase/admin";
import { saveAnnouncement, toggleAnnouncement } from "../actions";

export const metadata = { title: "News & events" };

export default async function Announcements({ searchParams }: PageProps<"/admin/announcements">) {
  const user = await requireStaff("manageContent");
  const sp = await searchParams;
  const snap = await db().collection(C.announcements).orderBy("date", "desc").limit(100).get();
  return (
    <Shell user={user} title="News & events" flash={{ ok: sp.ok as string | undefined, error: sp.error as string | undefined }}>
      <form action={saveAnnouncement} className="card grid gap-4 sm:grid-cols-2">
        <div><label htmlFor="type" className="field-label">Type</label><select id="type" name="type" className="field"><option value="news">News</option><option value="event">Event</option></select></div>
        <div><label htmlFor="date" className="field-label">Date</label><input id="date" name="date" type="date" required className="field" /></div>
        <div><label htmlFor="titleEn" className="field-label">Title (English)</label><input id="titleEn" name="titleEn" required maxLength={200} className="field" /></div>
        <div><label htmlFor="titleHi" className="field-label">Title (Hindi)</label><input id="titleHi" name="titleHi" lang="hi" required maxLength={200} className="field" /></div>
        <div><label htmlFor="bodyEn" className="field-label">Details (English)</label><textarea id="bodyEn" name="bodyEn" rows={4} maxLength={5000} className="field" /></div>
        <div><label htmlFor="bodyHi" className="field-label">Details (Hindi)</label><textarea id="bodyHi" name="bodyHi" lang="hi" rows={4} maxLength={5000} className="field" /></div>
        <label className="flex items-center gap-2"><input type="checkbox" name="published" className="h-5 w-5 accent-brand" />Publish now</label>
        <button className="btn-primary sm:w-fit sm:justify-self-end">Save</button>
      </form>
      <ul className="mt-6 space-y-3">
        {snap.docs.map((d) => (
          <li key={d.id} className="card flex flex-wrap items-center justify-between gap-3 !p-4">
            <div><p className="text-xs font-semibold text-sun-700">{d.get("type")} · {d.get("date")}</p><p className="font-bold">{d.get("titleEn")}</p><p className="text-sm text-muted" lang="hi">{d.get("titleHi")}</p></div>
            <form action={toggleAnnouncement}>
              <input type="hidden" name="id" value={d.id} /><input type="hidden" name="published" value={String(!d.get("published"))} />
              <button className={d.get("published") ? "btn-ghost !min-h-9" : "btn-primary !min-h-9"}>{d.get("published") ? "Unpublish" : "Publish"}</button>
            </form>
          </li>
        ))}
      </ul>
    </Shell>
  );
}
