// Verifies the official logo asset is present and unmodified (SHA-256 recorded at handover).
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
const EXPECTED = process.argv[2];
const buf = await readFile("public/brand/vmis-logo-original.jpg");
const sha = createHash("sha256").update(buf).digest("hex");
console.log(`vmis-logo-original.jpg sha256=${sha}`);
if (EXPECTED && EXPECTED !== sha) { console.error("✗ Logo differs from the recorded original"); process.exit(1); }
