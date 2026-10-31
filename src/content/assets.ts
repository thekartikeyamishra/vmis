/**
 * ASSET REPLACEMENT SYSTEM
 * Every visual slot on the site renders an original illustration until a genuine,
 * consent-cleared school photograph is supplied. To replace an illustration:
 *   1. Put an optimised .webp/.avif in /public/photos/ (max ~1600px wide, < 250 KB).
 *   2. Set `photo` and bilingual `alt` for the slot below. Ensure media consent for any child shown.
 */
export type AssetSlot = "hero" | "early-years" | "primary" | "upper-primary";

export const ASSETS: Record<AssetSlot, { photo: string | null; alt: { en: string; hi: string } }> = {
  hero: { photo: null, alt: { en: "", hi: "" } },
  "early-years": { photo: null, alt: { en: "", hi: "" } },
  primary: { photo: null, alt: { en: "", hi: "" } },
  "upper-primary": { photo: null, alt: { en: "", hi: "" } },
};
