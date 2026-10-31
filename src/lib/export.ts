/** Converts Firestore values (Timestamps, nested objects) into JSON-safe data. */
export function serialize(v: unknown): unknown {
  if (v === null || v === undefined) return null;
  if (typeof v === "object" && v && "toDate" in v && typeof (v as { toDate: unknown }).toDate === "function") return (v as { toDate(): Date }).toDate().toISOString();
  if (v instanceof Date) return v.toISOString();
  if (Array.isArray(v)) return v.map(serialize);
  if (typeof v === "object") return Object.fromEntries(Object.entries(v as object).map(([k, x]) => [k, serialize(x)]));
  return v;
}

/** RFC 4180 CSV with spreadsheet formula-injection protection. */
export function toCsv(rows: Record<string, unknown>[]): string {
  const cols = [...new Set(rows.flatMap((r) => Object.keys(r)))];
  const cell = (v: unknown) => {
    let s = v === null || v === undefined ? "" : typeof v === "object" ? JSON.stringify(v) : String(v);
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(","), ...rows.map((r) => cols.map((c) => cell(r[c])).join(","))].join("\r\n");
}
