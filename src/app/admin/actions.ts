"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";
import { adminAuth, bucket, db, C } from "@/lib/firebase/admin";
import { assertCan } from "@/lib/auth/session";
import { ROLES } from "@/lib/auth/roles";
import { audit } from "@/lib/audit";
import { ENQUIRY_STATUSES } from "@/lib/validation/enquiry";
import { LEVEL_IDS } from "@/content/levels";
import { isDisclosureCategory } from "@/content/disclosure";

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const nullable = (f: FormData, k: string, max = 2000) => { const v = str(f, k).slice(0, max); return v === "" ? null : v; };
const back = (path: string, q: string): never => redirect(`${path}${path.includes("?") ? "&" : "?"}${q}`);
const refreshPublic = () => revalidatePath("/", "layout");

// ───────── Enquiries ─────────
export async function updateEnquiry(form: FormData) {
  const user = await assertCan("manageEnquiries");
  const id = z.string().min(1).max(64).parse(str(form, "id"));
  const status = z.enum(ENQUIRY_STATUSES).parse(str(form, "status"));
  const note = str(form, "note").slice(0, 1000);
  const ref = db().collection(C.enquiries).doc(id);
  await db().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new Error("NOT_FOUND");
    const from = snap.get("status");
    const patch: Record<string, unknown> = { updatedAt: FieldValue.serverTimestamp(), updatedBy: user.email };
    if (from !== status) {
      patch.status = status;
      tx.create(db().collection(C.statusHistory).doc(), { enquiryId: id, from, to: status, by: user.email, at: FieldValue.serverTimestamp() });
    }
    if (note) patch.notes = FieldValue.arrayUnion({ text: note, by: user.email, at: new Date().toISOString() });
    tx.update(ref, patch);
  });
  await audit(user, "enquiry.update", id, { status, note: !!note });
  revalidatePath(`/admin/enquiries/${id}`);
  back(`/admin/enquiries/${id}`, "ok=1");
}

export async function scheduleVisit(form: FormData) {
  const user = await assertCan("manageEnquiries");
  const id = z.string().min(1).max(64).parse(str(form, "appointmentId"));
  const enquiryId = z.string().min(1).max(64).parse(str(form, "enquiryId"));
  const when = str(form, "scheduledAt");
  const status = z.enum(["requested", "scheduled", "completed", "cancelled", "no_show"]).parse(str(form, "status"));
  await db().collection(C.appointments).doc(id).update({ status, scheduledAt: when ? new Date(when) : null, updatedAt: FieldValue.serverTimestamp(), updatedBy: user.email });
  await audit(user, "appointment.update", id, { status, when });
  back(`/admin/enquiries/${enquiryId}`, "ok=1");
}

/** DPDP: erase an enquiry on the parent's request (keeps a non-personal audit trail). */
export async function eraseEnquiry(form: FormData) {
  const user = await assertCan("exportData");
  const id = z.string().min(1).max(64).parse(str(form, "id"));
  if (str(form, "confirm") !== "ERASE") back(`/admin/enquiries/${id}`, "error=confirm");
  const ref = db().collection(C.enquiries).doc(id);
  await ref.update({ parentName: "[erased]", mobile: null, mobileHash: null, email: null, currentSchool: null, message: null, notes: [], status: "closed", erasedAt: FieldValue.serverTimestamp(), erasedBy: user.email });
  const consents = await db().collection(C.consents).where("enquiryId", "==", id).get();
  await Promise.all(consents.docs.map((d) => d.ref.update({ withdrawnAt: FieldValue.serverTimestamp() })));
  await audit(user, "enquiry.erase", id);
  back(`/admin/enquiries/${id}`, "ok=1");
}

// ───────── Academic levels ─────────
export async function saveLevel(form: FormData) {
  const user = await assertCan("manageContent");
  const id = z.enum(LEVEL_IDS).parse(str(form, "id"));
  const order = z.coerce.number().int().min(1).max(99).parse(str(form, "order"));
  const avail = str(form, "admissionOpen");
  const data = {
    order,
    published: form.get("published") === "on",
    admissionOpen: avail === "open" ? true : avail === "closed" ? false : null,
    eligibilityEn: nullable(form, "eligibilityEn", 300),
    eligibilityHi: nullable(form, "eligibilityHi", 300),
    updatedAt: FieldValue.serverTimestamp(),
    updatedBy: user.email,
  };
  await db().collection(C.levels).doc(id).set(data, { merge: true });
  await audit(user, "level.update", id, { order, published: data.published, admissionOpen: data.admissionOpen });
  refreshPublic();
  back("/admin/levels", `ok=${id}`);
}

// ───────── School settings ─────────
export async function saveSettings(form: FormData) {
  const user = await assertCan("manageSettings");
  const url = (k: string) => { const v = nullable(form, k, 500); if (v && !/^https:\/\//.test(v)) back("/admin/settings", `error=${k}`); return v; };
  const status = z.enum(["not_verified", "applied", "provisional", "regular", "not_affiliated"]).parse(str(form, "affiliationStatus"));
  const transport = str(form, "transportAvailable");
  const data = {
    addressEn: nullable(form, "addressEn", 300), addressHi: nullable(form, "addressHi", 300), postalCode: nullable(form, "postalCode", 10),
    phone: nullable(form, "phone", 20), whatsapp: nullable(form, "whatsapp", 20), email: nullable(form, "email", 120),
    officeHoursEn: nullable(form, "officeHoursEn", 200), officeHoursHi: nullable(form, "officeHoursHi", 200),
    schoolTimingsEn: nullable(form, "schoolTimingsEn", 200), schoolTimingsHi: nullable(form, "schoolTimingsHi", 200),
    mapUrl: url("mapUrl"), academicSession: nullable(form, "academicSession", 20), admissionsOpen: form.get("admissionsOpen") === "on",
    principalName: nullable(form, "principalName", 120), principalMessageEn: nullable(form, "principalMessageEn", 5000), principalMessageHi: nullable(form, "principalMessageHi", 5000),
    feeNoteEn: nullable(form, "feeNoteEn", 3000), feeNoteHi: nullable(form, "feeNoteHi", 3000),
    transportAvailable: transport === "yes" ? true : transport === "no" ? false : null,
    affiliation: {
      status, affiliationNumber: nullable(form, "affiliationNumber", 40), schoolCode: nullable(form, "schoolCode", 40),
      category: nullable(form, "affiliationCategory", 80), validUntil: nullable(form, "validUntil", 20), verifiedOn: nullable(form, "verifiedOn", 20),
    },
    playStoreUrl: url("playStoreUrl"), appStoreUrl: url("appStoreUrl"),
    social: { facebook: url("facebook"), instagram: url("instagram"), youtube: url("youtube") },
    updatedAt: FieldValue.serverTimestamp(), updatedBy: user.email,
  };
  if (data.email && !z.string().email().safeParse(data.email).success) back("/admin/settings", "error=email");
  await db().collection(C.settings).doc("main").set(data, { merge: true });
  await audit(user, "settings.update", "main", { affiliationStatus: status });
  refreshPublic();
  back("/admin/settings", "ok=1");
}

// ───────── Public disclosure documents ─────────
const ALLOWED: Record<string, { ext: string; magic: number[] }> = {
  "application/pdf": { ext: "pdf", magic: [0x25, 0x50, 0x44, 0x46] },
  "image/png": { ext: "png", magic: [0x89, 0x50, 0x4e, 0x47] },
  "image/jpeg": { ext: "jpg", magic: [0xff, 0xd8, 0xff] },
};
const MAX_BYTES = 10 * 1024 * 1024;

export async function uploadDocument(form: FormData) {
  const user = await assertCan("manageContent");
  const file = form.get("file");
  const category = str(form, "category");
  const title = str(form, "title").slice(0, 200);
  if (!(file instanceof File) || file.size === 0 || file.size > MAX_BYTES) back("/admin/documents", "error=file");
  if (!isDisclosureCategory(category) || title.length < 3) back("/admin/documents", "error=fields");
  const f = file as File;
  const type = ALLOWED[f.type];
  const buf = Buffer.from(await f.arrayBuffer());
  if (!type || !type.magic.every((b, i) => buf[i] === b)) back("/admin/documents", "error=type"); // content sniffing, not just the declared MIME
  const id = randomUUID().replace(/-/g, "").slice(0, 20);
  const path = `public-documents/${id}/document.${type!.ext}`;
  await bucket().file(path).save(buf, { contentType: f.type, resumable: false, metadata: { cacheControl: "private, max-age=0", metadata: { uploadedBy: user.email } } });
  await db().collection(C.publicDocuments).doc(id).set({
    title, titleHi: nullable(form, "titleHi", 200), category, storagePath: path,
    fileName: `${title.replace(/[^\w\- ]/g, "").slice(0, 60) || "document"}.${type!.ext}`, size: f.size, contentType: f.type,
    validUntil: nullable(form, "validUntil", 20), verified: false, status: "draft",
    createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp(), uploadedBy: user.email, publishedAt: null,
  });
  await audit(user, "document.upload", id, { category, size: f.size });
  back("/admin/documents", "ok=uploaded");
}

export async function setDocumentStatus(form: FormData) {
  const user = await assertCan("publishDocuments"); // only senior roles can publish official documents
  const id = z.string().regex(/^[A-Za-z0-9]{1,64}$/).parse(str(form, "id"));
  const status = z.enum(["draft", "published", "archived"]).parse(str(form, "status"));
  const patch: Record<string, unknown> = { status, updatedAt: FieldValue.serverTimestamp(), updatedBy: user.email };
  if (status === "published") { patch.publishedAt = FieldValue.serverTimestamp(); patch.verified = form.get("verified") === "on"; patch.verifiedBy = user.email; }
  await db().collection(C.publicDocuments).doc(id).update(patch);
  await audit(user, `document.${status}`, id);
  refreshPublic();
  back("/admin/documents", "ok=1");
}

// ───────── News & events ─────────
export async function saveAnnouncement(form: FormData) {
  const user = await assertCan("manageContent");
  const schema = z.object({
    type: z.enum(["news", "event"]), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    titleEn: z.string().min(3).max(200), titleHi: z.string().min(2).max(200), bodyEn: z.string().max(5000), bodyHi: z.string().max(5000),
  });
  const parsed = schema.safeParse({ type: str(form, "type"), date: str(form, "date"), titleEn: str(form, "titleEn"), titleHi: str(form, "titleHi"), bodyEn: str(form, "bodyEn"), bodyHi: str(form, "bodyHi") });
  if (!parsed.success) back("/admin/announcements", "error=fields");
  const ref = await db().collection(C.announcements).add({ ...parsed.data!, published: form.get("published") === "on", createdAt: FieldValue.serverTimestamp(), createdBy: user.email });
  await audit(user, "announcement.create", ref.id);
  refreshPublic();
  back("/admin/announcements", "ok=1");
}

export async function toggleAnnouncement(form: FormData) {
  const user = await assertCan("manageContent");
  const id = z.string().min(1).max(64).parse(str(form, "id"));
  const published = str(form, "published") === "true";
  await db().collection(C.announcements).doc(id).update({ published, updatedAt: FieldValue.serverTimestamp() });
  await audit(user, published ? "announcement.publish" : "announcement.unpublish", id);
  refreshPublic();
  back("/admin/announcements", "ok=1");
}

// ───────── Users & roles ─────────
export async function setUserRole(form: FormData) {
  const actor = await assertCan("manageUsers");
  const email = z.string().email().parse(str(form, "email").toLowerCase());
  const role = z.enum(ROLES).parse(str(form, "role"));
  const active = form.get("active") === "on";
  let uid: string;
  try { uid = (await adminAuth().getUserByEmail(email)).uid; } catch { return back("/admin/users", "error=nouser"); }
  if (uid === actor.uid && (!active || role !== "super_admin")) back("/admin/users", "error=self");
  await db().collection(C.users).doc(uid).set({ email, role, active, name: nullable(form, "name", 120) ?? email, updatedAt: FieldValue.serverTimestamp(), updatedBy: actor.email }, { merge: true });
  if (!active) await adminAuth().revokeRefreshTokens(uid);
  await audit(actor, "user.role", uid, { email, role, active });
  back("/admin/users", "ok=1");
}
