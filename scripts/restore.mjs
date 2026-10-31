// Usage: npm run restore -- backups/<timestamp> [--apply]
// Verifies checksums, then restores documents with merge. NEVER deletes existing records
// (so valid admission records created after the backup are preserved). Dry-run by default.
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { init } from "./_admin.mjs";

const [dir, flag] = process.argv.slice(2);
if (!dir) { console.error("Usage: npm run restore -- <backup-dir> [--apply]"); process.exit(1); }
const manifest = JSON.parse(await readFile(`${dir}/manifest.json`, "utf8"));
const des = (v) => v && typeof v === "object" && "__ts" in v ? new Date(v.__ts) : Array.isArray(v) ? v.map(des) : v && typeof v === "object" ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, des(x)])) : v;
for (const c of manifest.collections) {
  const body = await readFile(`${dir}/${c.name}.json`, "utf8");
  if (createHash("sha256").update(body).digest("hex") !== c.sha256) { console.error(`✗ Checksum mismatch: ${c.name}`); process.exit(2); }
}
console.log("✓ All checksums valid");
if (flag !== "--apply") { console.log("Dry run only. Re-run with --apply to write to the project shown below."); }
const { db } = init();
for (const c of manifest.collections) {
  if (["rate_limits", "idempotency_keys"].includes(c.name)) continue;
  const docs = JSON.parse(await readFile(`${dir}/${c.name}.json`, "utf8"));
  if (flag !== "--apply") { console.log(`  would restore ${c.name}: ${docs.length}`); continue; }
  for (let i = 0; i < docs.length; i += 400) {
    const batch = db.batch();
    docs.slice(i, i + 400).forEach((d) => batch.set(db.collection(c.name).doc(d.id), des(d.data), { merge: true }));
    await batch.commit();
  }
  console.log(`  restored ${c.name}: ${docs.length}`);
}
