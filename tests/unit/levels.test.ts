import { describe, expect, it } from "vitest";
import { DEFAULT_LEVELS, LEVEL_IDS, STAGES, sortLevels } from "@/content/levels";
import { applyLevelOverrides } from "@/lib/levels-merge";

describe("academic levels — single source of truth", () => {
  it("contains exactly the 12 required levels in order", () => {
    expect(LEVEL_IDS).toEqual(["nursery", "prep", "lkg", "ukg", "class-1", "class-2", "class-3", "class-4", "class-5", "class-6", "class-7", "class-8"]);
    expect(sortLevels(DEFAULT_LEVELS).map((l) => l.id)).toEqual([...LEVEL_IDS]);
  });
  it("every level has English + Hindi names, summary and focus", () => {
    for (const l of DEFAULT_LEVELS) {
      expect(l.name.en && l.name.hi && l.summary.en && l.summary.hi).toBeTruthy();
      expect(l.focus.en.length).toBe(l.focus.hi.length);
      expect(l.focus.en.length).toBeGreaterThan(3);
    }
  });
  it("maps levels to the three stages (4 / 5 / 3)", () => {
    const count = (s: string) => DEFAULT_LEVELS.filter((l) => l.stage === s).length;
    expect([count("early-years"), count("primary"), count("upper-primary")]).toEqual([4, 5, 3]);
    expect(STAGES.map((s) => s.id)).toEqual(["early-years", "primary", "upper-primary"]);
  });
  it("never invents eligibility or availability", () => {
    for (const l of DEFAULT_LEVELS) {
      expect(l.eligibility.en).toBeNull();
      expect(l.admissionOpen).toBeNull();
    }
  });
  it("applies admin overrides (e.g. Prep before Nursery) without losing levels", () => {
    const out = applyLevelOverrides({ prep: { order: 0 }, lkg: { eligibilityEn: "3+ years", admissionOpen: true } });
    expect(out).toHaveLength(12);
    expect(out[0]!.id).toBe("prep");
    expect(out.find((l) => l.id === "lkg")!.eligibility.en).toBe("3+ years");
  });
});
