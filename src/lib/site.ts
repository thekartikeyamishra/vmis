import type { Locale } from "@/i18n/config";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const href = (locale: Locale, path = "") => `/${locale}${path ? (path.startsWith("/") ? path : `/${path}`) : ""}`;

export function alternates(path: string, locale: Locale) {
  const p = path ? (path.startsWith("/") ? path : `/${path}`) : "";
  return {
    canonical: `${SITE_URL}/${locale}${p}`,
    languages: { "en-IN": `${SITE_URL}/en${p}`, "hi-IN": `${SITE_URL}/hi${p}`, "x-default": `${SITE_URL}/en${p}` },
  };
}
