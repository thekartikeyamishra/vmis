import { Shell, fmtDate } from "@/components/admin/Shell";
import { requireStaff } from "@/lib/auth/session";
import { can } from "@/lib/auth/roles";
import { db, C } from "@/lib/firebase/admin";
import { DISCLOSURE_CATEGORIES } from "@/content/disclosure";
import { setDocumentStatus, uploadDocument } from "../actions";

export const metadata = { title: "Public disclosure" };

export default async function Documents({ searchParams }: PageProps<"/admin/documents">) {
  const user = await requireStaff("manageContent");
  const sp = await searchParams;
  const snap = await db().collection(C.publicDocuments).orderBy("createdAt", "desc").limit(200).get();
  const publish = can(user.role, "publishDocuments");
  const soon = Date.now() + 60 * 86400_000;
  return (
    <Shell user={user} title="Mandatory Public Disclosure" flash={{ ok: sp.ok as string | undefined, error: sp.error as string | undefined }}>
      <form action={uploadDocument} encType="multipart/form-data" className="card grid gap-4 sm:grid-cols-2">
        <h2 className="text-lg font-extrabold sm:col-span-2">Upload document (PDF, JPG or PNG · max 10 MB)</h2>
        <div><label htmlFor="category" className="field-label">Category</label>
          <select id="category" name="category" required className="field">{DISCLOSURE_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name.en}</option>)}</select></div>
        <div><label htmlFor="validUntil" className="field-label">Valid until (optional)</label><input id="validUntil" name="validUntil" type="date" className="field" /></div>
        <div><label htmlFor="title" className="field-label">Title (English)</label><input id="title" name="title" required minLength={3} maxLength={200} className="field" /></div>
        <div><label htmlFor="titleHi" className="field-label">Title (Hindi)</label><input id="titleHi" name="titleHi" lang="hi" maxLength={200} className="field" /></div>
        <div className="sm:col-span-2"><label htmlFor="file" className="field-label">File</label><input id="file" name="file" type="file" required accept="application/pdf,image/png,image/jpeg" className="field" /></div>
        <p className="text-xs text-muted sm:col-span-2">Uploads are saved as drafts. Only Super Admin, School Management or Principal can publish. Never upload invented or unverified documents.</p>
        <button className="btn-primary sm:col-span-2 sm:w-fit">Upload as draft</button>
      </form>
      <div className="card mt-6 overflow-x-auto !p-0">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-bg"><tr>{["Title", "Category", "Status", "Valid until", "Updated", ""].map((h) => <th key={h} scope="col" className="px-4 py-3">{h}</th>)}</tr></thead>
          <tbody>
            {snap.empty && <tr><td colSpan={6} className="px-4 py-8 text-center text-muted">No documents yet.</td></tr>}
            {snap.docs.map((d) => {
              const exp = d.get("validUntil") && new Date(d.get("validUntil")).getTime() < soon;
              return (
                <tr key={d.id} className="border-t border-brand/5">
                  <td className="px-4 py-3 font-semibold">{d.get("title")}{d.get("verified") && <span className="ml-2 text-xs text-[#1B7B73]">verified</span>}</td>
                  <td className="px-4 py-3">{DISCLOSURE_CATEGORIES.find((c) => c.id === d.get("category"))?.name.en}</td>
                  <td className="px-4 py-3">{d.get("status")}</td>
                  <td className={`px-4 py-3 ${exp ? "font-bold text-red-700" : ""}`}>{d.get("validUntil") ?? "—"}{exp && " ⚠"}</td>
                  <td className="px-4 py-3 text-muted">{fmtDate(d.get("updatedAt"))}</td>
                  <td className="px-4 py-3">
                    {publish && (
                      <form action={setDocumentStatus} className="flex flex-wrap items-center gap-2">
                        <input type="hidden" name="id" value={d.id} />
                        <label className="flex items-center gap-1 text-xs"><input type="checkbox" name="verified" defaultChecked={d.get("verified")} />verified</label>
                        <select name="status" defaultValue={d.get("status")} aria-label="Status" className="field !min-h-9 !w-auto !py-1 text-sm"><option>draft</option><option>published</option><option>archived</option></select>
                        <button className="btn-ghost !min-h-9 !px-3 !text-xs">Apply</button>
                      </form>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}
