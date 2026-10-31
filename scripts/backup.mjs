// Full Firestore export to ./backups/<timestamp>/ — one JSON file per collection + manifest with SHA-256 checksums.
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { init } from "./_admin.mjs";

const { db } = init();
const dir = `backups/${new Date().toISOString().replace(/[:.]/g, "-")}`;
await mkdir(dir, { recursive: true });
const ser = (v) => v?.toDate ? { __ts: v.toDate().toISOString() } : Array.isArray(v) ? v.map(ser) : v && typeof v === "object" && !(v instanceof Date) ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, ser(x)])) : v instanceof Date ? { __ts: v.toISOString() } : v;
const manifest = { format: "vmis-backup-dir", version: 1, createdAt: new Date().toISOString(), collections: [] };
for (const col of await db.listCollections()) {
  const docs = [];
  let last;
  for (;;) {
    let q = col.orderBy("__name__").limit(500);
    if (last) q = q.startAfter(last);
    const snap = await q.get();
    snap.docs.forEach((d) => docs.push({ id: d.id, data: ser(d.data()) }));
    if (snap.size < 500) break;
    last = snap.docs.at(-1);
  }
  const body = JSON.stringify(docs, null, 2);
  await writeFile(`${dir}/${col.id}.json`, body);
  manifest.collections.push({ name: col.id, count: docs.length, sha256: createHash("sha256").update(body).digest("hex") });
  console.log(`  ${col.id}: ${docs.length}`);
}
await writeFile(`${dir}/manifest.json`, JSON.stringify(manifest, null, 2));
console.log(`✓ Backup written to ${dir}`);
