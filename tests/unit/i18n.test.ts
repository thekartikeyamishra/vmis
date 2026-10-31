import { describe, expect, it } from "vitest";
import { dictionaries } from "@/i18n/dictionaries";
import { switchLocalePath } from "@/i18n/config";
import { PAGES } from "@/content/pages";
import { FAQS } from "@/content/faqs";
import { OFFICIAL } from "@/content/school";
import { toCsv } from "@/lib/export";

function keys(o: unknown, p = ""): string[] {
  if (!o || typeof o !== "object" || Array.isArray(o)) return [p];
  return Object.entries(o).flatMap(([k, v]) => keys(v, p ? `${p}.${k}` : k));
}

describe("bilingual content", () => {
  it("English and Hindi dictionaries have identical keys", () => {
    expect(keys(dictionaries.hi).sort()).toEqual(keys(dictionaries.en).sort());
  });
  it("every content page and FAQ is fully translated", () => {
    for (const p of PAGES) {
      expect(p.title.hi && p.description.hi).toBeTruthy();
      for (const s of p.sections) {
        expect(s.heading.hi).toBeTruthy();
        if (s.bullets) expect(s.bullets.hi.length).toBe(s.bullets.en.length);
      }
    }
    for (const f of FAQS) expect(f.q.hi && f.a.hi).toBeTruthy();
  });
  it("page slugs are unique", () => {
    expect(new Set(PAGES.map((p) => p.slug)).size).toBe(PAGES.length);
  });
  it("official names and motto are exact", () => {
    expect(OFFICIAL.nameHi).toBe("डॉ. वेदपति मिश्र इंस्टीट्यूट ऑफ स्कॉलर्स");
    expect(OFFICIAL.motto).toBe("तत्वमसि");
    expect(OFFICIAL.nameEn).toBe("Dr. VedPati Mishra Institute Of Scholars");
  });
  it("switches locale paths", () => {
    expect(switchLocalePath("/en/classes/ukg", "hi")).toBe("/hi/classes/ukg");
    expect(switchLocalePath("/hi", "en")).toBe("/en");
  });
});

describe("csv export", () => {
  it("escapes quotes and neutralises formulas", () => {
    expect(toCsv([{ a: '=HYPERLINK("x")', b: "x,y" }])).toBe('a,b\r\n"\'=HYPERLINK(""x"")","x,y"');
  });
});
