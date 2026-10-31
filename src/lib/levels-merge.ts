import { DEFAULT_LEVELS, sortLevels, type AcademicLevel } from "@/content/levels";

export interface LevelOverride {
  order?: number; admissionOpen?: boolean | null; published?: boolean;
  eligibilityEn?: string | null; eligibilityHi?: string | null;
}

export function applyLevelOverrides(overrides: Record<string, LevelOverride>): AcademicLevel[] {
  return sortLevels(DEFAULT_LEVELS.map((l) => {
    const o = overrides[l.id];
    if (!o) return l;
    return {
      ...l,
      order: typeof o.order === "number" ? o.order : l.order,
      admissionOpen: o.admissionOpen === undefined ? l.admissionOpen : o.admissionOpen,
      published: o.published ?? l.published,
      eligibility: { en: o.eligibilityEn ?? l.eligibility.en, hi: o.eligibilityHi ?? l.eligibility.hi },
    };
  }));
}
