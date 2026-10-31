import type { MetadataRoute } from "next";
import { PAGES } from "@/content/pages";
import { LEVEL_IDS, STAGES } from "@/content/levels";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "", "/academics", "/admissions", "/admissions/enquiry", "/faqs", "/news", "/events", "/gallery", "/public-disclosure", "/contact",
    ...STAGES.map((s) => `/academics/${s.id}`),
    ...LEVEL_IDS.map((l) => `/classes/${l}`),
    ...PAGES.filter((p) => !p.noindex).map((p) => `/${p.slug}`),
  ];
  const now = new Date();
  return paths.flatMap((p) => (["en", "hi"] as const).map((loc) => ({
    url: `${SITE_URL}/${loc}${p}`,
    lastModified: now,
    changeFrequency: p === "" || p.startsWith("/admissions") ? "weekly" as const : "monthly" as const,
    priority: p === "" ? 1 : p.startsWith("/admissions") || p.startsWith("/classes") ? 0.8 : 0.6,
    alternates: { languages: { "en-IN": `${SITE_URL}/en${p}`, "hi-IN": `${SITE_URL}/hi${p}` } },
  })));
}
