import "server-only";
import { cache } from "react";
import { db, C, isFirebaseConfigured } from "@/lib/firebase/admin";
import { DEFAULT_SETTINGS, type SchoolSettings } from "@/content/school";
import { DEFAULT_LEVELS, sortLevels } from "@/content/levels";
import { applyLevelOverrides, type LevelOverride } from "@/lib/levels-merge";
export { applyLevelOverrides };

/**
 * Public read layer. Every function falls back to bundled defaults when Firestore is
 * unavailable, so the public site never breaks (and builds without credentials).
 */
async function safe<T>(fn: () => Promise<T>, fallback: T, label: string): Promise<T> {
  if (!isFirebaseConfigured()) return fallback;
  try {
    return await fn();
  } catch (e) {
    console.error(`[data] ${label} failed, using fallback`, e);
    return fallback;
  }
}

function deepMerge<T>(base: T, patch: unknown): T {
  if (!patch || typeof patch !== "object" || Array.isArray(patch)) return base;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [k, v] of Object.entries(patch as Record<string, unknown>)) {
    if (!(k in out)) continue; // ignore unknown keys
    const cur = out[k];
    out[k] = cur && typeof cur === "object" && !Array.isArray(cur) ? deepMerge(cur, v) : v;
  }
  return out as T;
}

export const getSettings = cache(() =>
  safe(async () => {
    const snap = await db().collection(C.settings).doc("main").get();
    return deepMerge(DEFAULT_SETTINGS, snap.data());
  }, DEFAULT_SETTINGS, "settings"),
);

/** All 12 levels (including unpublished) in school-approved order. */
export const getAllLevels = cache(() =>
  safe(async () => {
    const snap = await db().collection(C.levels).get();
    const overrides: Record<string, LevelOverride> = {};
    snap.forEach((d) => (overrides[d.id] = d.data() as LevelOverride));
    return applyLevelOverrides(overrides);
  }, sortLevels(DEFAULT_LEVELS), "levels"),
);

export const getLevels = cache(async () => (await getAllLevels()).filter((l) => l.published));

export interface PublicDocument {
  id: string; title: string; titleHi?: string; category: string; publishedAt: string | null;
  updatedAt: string | null; validUntil: string | null; verified: boolean; fileName: string;
}

const iso = (v: unknown): string | null =>
  v && typeof v === "object" && "toDate" in v ? (v as { toDate(): Date }).toDate().toISOString() : typeof v === "string" ? v : null;

export const getPublishedDocuments = cache(() =>
  safe(async () => {
    const snap = await db().collection(C.publicDocuments).where("status", "==", "published").get();
    return snap.docs.map((d): PublicDocument => ({
      id: d.id, title: d.get("title"), titleHi: d.get("titleHi") || undefined, category: d.get("category"),
      publishedAt: iso(d.get("publishedAt")), updatedAt: iso(d.get("updatedAt")), validUntil: d.get("validUntil") ?? null,
      verified: !!d.get("verified"), fileName: d.get("fileName") ?? "document.pdf",
    }));
  }, [] as PublicDocument[], "documents"),
);

export interface Announcement { id: string; type: "news" | "event"; titleEn: string; titleHi: string; bodyEn: string; bodyHi: string; date: string }

export const getAnnouncements = cache((type?: "news" | "event") =>
  safe(async () => {
    const snap = await db().collection(C.announcements).where("published", "==", true).get();
    return snap.docs
      .map((d) => ({ id: d.id, ...(d.data() as Omit<Announcement, "id">) }))
      .filter((a) => !type || a.type === type)
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 50);
  }, [] as Announcement[], "announcements"),
);
