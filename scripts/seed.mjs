// Seeds the 12 academic levels (order/publication only) and an empty settings document.
// Safe to re-run: uses merge and never overwrites values the school has already entered.
import { init } from "./_admin.mjs";

const LEVELS = ["nursery", "prep", "lkg", "ukg", "class-1", "class-2", "class-3", "class-4", "class-5", "class-6", "class-7", "class-8"];
const { db } = init();
const batch = db.batch();
for (const [i, id] of LEVELS.entries()) {
  const ref = db.collection("academic_levels").doc(id);
  const snap = await ref.get();
  if (!snap.exists) batch.set(ref, { order: i + 1, published: true, admissionOpen: null, eligibilityEn: null, eligibilityHi: null, createdAt: new Date() });
}
const settings = db.collection("school_settings").doc("main");
if (!(await settings.get()).exists) batch.set(settings, { admissionsOpen: true, createdAt: new Date() });
await batch.commit();
console.log("✓ Seeded academic_levels (12) and school_settings/main");
