import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { assertCan } from "@/lib/auth/session";
import { db, C } from "@/lib/firebase/admin";
import { audit } from "@/lib/audit";
import { toCsv, serialize } from "@/lib/export";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const EXPORTABLE = [C.enquiries, C.statusHistory, C.appointments, C.consents, C.levels, C.settings, C.announcements, C.publicDocuments, C.users, C.audit] as const;
type Exportable = (typeof EXPORTABLE)[number];
const PAGE = 500;

async function readAll(name: Exportable) {
  const rows: Record<string, unknown>[] = [];
  let last: FirebaseFirestore.QueryDocumentSnapshot | undefined;
  // Chunked reads keep memory and Firestore reads bounded per request.
  for (;;) {
    let q = db().collection(name).orderBy("__name__").limit(PAGE);
    if (last) q = q.startAfter(last);
    const snap = await q.get();
    snap.docs.forEach((d) => rows.push({ id: d.id, ...serialize(d.data()) as object }));
    if (snap.size < PAGE) break;
    last = snap.docs[snap.docs.length - 1];
  }
  return rows;
}

/**
 * GET /api/admin/export?collection=admission_enquiries&format=csv|json
 * GET /api/admin/export?collection=all  → full JSON backup with manifest + SHA-256 checksums
 */
export async function GET(req: Request) {
  let user;
  try { user = await assertCan("exportData"); } catch { return NextResponse.json({ error: "forbidden" }, { status: 403 }); }
  const url = new URL(req.url);
  const collection = url.searchParams.get("collection") ?? "all";
  const format = url.searchParams.get("format") === "csv" ? "csv" : "json";
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");

  if (collection === "all") {
    const data: Record<string, Record<string, unknown>[]> = {};
    const manifest: { collection: string; count: number; sha256: string }[] = [];
    for (const name of EXPORTABLE) {
      data[name] = await readAll(name);
      manifest.push({ collection: name, count: data[name].length, sha256: createHash("sha256").update(JSON.stringify(data[name])).digest("hex") });
    }
    const body = JSON.stringify({ format: "vmis-backup", version: 1, exportedAt: new Date().toISOString(), exportedBy: user.email, manifest, data }, null, 2);
    await audit(user, "data.export", "all", { manifest: manifest.map((m) => `${m.collection}:${m.count}`) });
    return new NextResponse(body, { headers: { "Content-Type": "application/json; charset=utf-8", "Content-Disposition": `attachment; filename="vmis-backup-${stamp}.json"`, "X-Content-SHA256": createHash("sha256").update(body).digest("hex") } });
  }

  if (!(EXPORTABLE as readonly string[]).includes(collection)) return NextResponse.json({ error: "unknown_collection" }, { status: 400 });
  const rows = await readAll(collection as Exportable);
  await audit(user, "data.export", collection, { format, count: rows.length });
  if (format === "csv") {
    return new NextResponse("﻿" + toCsv(rows), { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="${collection}-${stamp}.csv"` } });
  }
  return new NextResponse(JSON.stringify(rows, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8", "Content-Disposition": `attachment; filename="${collection}-${stamp}.json"` } });
}
