import Image from "next/image";
import Link from "next/link";
import { OFFICIAL } from "@/content/school";
import { getDict } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { href } from "@/lib/site";
import { SITE_URL } from "@/lib/site";
import { ASSETS, type AssetSlot } from "@/content/assets";
import { StageArt, HeroArt, EmptyArt } from "@/components/art/Art";

export function Logo({ size = 56, priority = false }: { size?: number; priority?: boolean }) {
  // The official emblem is used as-is (no recreation, recolouring or cropping).
  return (
    <Image src="/brand/vmis-logo-256.webp" alt={`${OFFICIAL.nameEn} (${OFFICIAL.nameHi}) — official emblem`}
      width={size} height={size} priority={priority} className="rounded-full" />
  );
}

export function Brand({ locale }: { locale: Locale }) {
  return (
    <Link href={href(locale)} className="flex items-center gap-3 rounded-lg" aria-label={`${OFFICIAL.nameEn} — ${getDict(locale).nav.home}`}>
      <Logo size={52} priority />
      <span className="max-w-[230px] leading-tight sm:max-w-[260px]">
        <span className="block font-hindi text-[15px] font-bold text-brand-900 sm:text-base" lang="hi">{OFFICIAL.nameHi}</span>
        <span className="block text-[11px] font-semibold uppercase tracking-wide text-muted sm:text-xs" lang="en">{OFFICIAL.nameEn}</span>
      </span>
    </Link>
  );
}

export function Pending({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const d = getDict(locale).common;
  return (
    <div role="note" className="rounded-2xl border border-dashed border-sun/60 bg-[#FFF7EC] p-4 text-sm text-ink">
      <p className="font-semibold text-sun-700">{d.pendingTitle}</p>
      {!compact && <p className="mt-1 text-muted">{d.pendingBody}</p>}
    </div>
  );
}

export function Breadcrumbs({ locale, items }: { locale: Locale; items: { label: string; path?: string }[] }) {
  const all = [{ label: getDict(locale).common.home, path: "" }, ...items];
  const ld = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: all.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.label, ...(it.path !== undefined ? { item: `${SITE_URL}${href(locale, it.path)}` } : {}) })),
  };
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        {all.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden>›</span>}
            {it.path !== undefined && i < all.length - 1
              ? <Link className="hover:text-brand hover:underline" href={href(locale, it.path)}>{it.label}</Link>
              : <span aria-current={i === all.length - 1 ? "page" : undefined} className="text-ink">{it.label}</span>}
          </li>
        ))}
      </ol>
      <JsonLd data={ld} />
    </nav>
  );
}

export function PageHeader({ locale, title, intro, crumbs, eyebrow }: { locale: Locale; title: string; intro?: string; crumbs: { label: string; path?: string }[]; eyebrow?: string }) {
  return (
    <header className="relative overflow-hidden bg-gradient-to-b from-bg to-white">
      <div className="container-x py-10 sm:py-14">
        <Breadcrumbs locale={locale} items={crumbs} />
        {eyebrow && <p className="eyebrow mt-6">{eyebrow}</p>}
        <h1 className="mt-3 max-w-4xl text-3xl font-extrabold sm:text-4xl lg:text-5xl">{title}</h1>
        {intro && <p className="mt-4 max-w-3xl text-lg text-muted">{intro}</p>}
      </div>
    </header>
  );
}

export function JsonLd({ data }: { data: object }) {
  // JSON.stringify output with "<" escaped cannot break out of the script element.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function SlotVisual({ slot, locale, className }: { slot: AssetSlot; locale: Locale; className?: string }) {
  const a = ASSETS[slot];
  if (a.photo) return <Image src={a.photo} alt={a.alt[locale]} width={800} height={600} className={className} sizes="(min-width: 1024px) 40vw, 100vw" />;
  const label = getDict(locale).common.illustration;
  if (slot === "hero") return <HeroArt className={className} title={label} />;
  const Art = StageArt[slot];
  return <Art className={className} title={label} />;
}

export function EmptyState({ locale, text }: { locale: Locale; text?: string }) {
  return (
    <div className="card flex flex-col items-center gap-4 py-10 text-center">
      <EmptyArt className="h-28 w-auto" />
      <p className="text-muted">{text ?? getDict(locale).common.none}</p>
    </div>
  );
}

export function FaqList({ items }: { items: { id: string; q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-brand/10 overflow-hidden rounded-2xl border border-brand/10 bg-white">
      {items.map((f) => (
        <details key={f.id} className="group p-5 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-semibold text-brand-900">
            {f.q}
            <span aria-hidden className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-bg text-brand transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="mt-3 text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function SectionTitle({ eyebrow, title, sub, center = false }: { eyebrow?: string; title: string; sub?: string; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">{title}</h2>
      {sub && <p className="mt-3 text-muted">{sub}</p>}
    </div>
  );
}
