import Link from "next/link";
import type { AcademicLevel } from "@/content/levels";
import { getDict } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { href } from "@/lib/site";

const tone: Record<AcademicLevel["stage"], string> = {
  "early-years": "bg-lotus-50 text-[#9B3D6C] border-lotus/40",
  primary: "bg-[#E9F6FC] text-brand border-sky/50",
  "upper-primary": "bg-[#EAF0F8] text-brand-900 border-brand/20",
};

export function LevelCard({ level, locale, detailed = false }: { level: AcademicLevel; locale: Locale; detailed?: boolean }) {
  const d = getDict(locale).common;
  const other = locale === "hi" ? level.name.en : level.name.hi;
  const elig = level.eligibility[locale];
  return (
    <article className="card flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-extrabold">{level.name[locale]}</h3>
          <p className="text-sm text-muted" lang={locale === "hi" ? "en" : "hi"}>{other}</p>
        </div>
        <span className={`grid h-12 min-w-12 place-items-center rounded-2xl border px-2 text-lg font-extrabold ${tone[level.stage]}`} aria-hidden>{level.short[locale]}</span>
      </div>
      <p className="mt-3 text-sm text-muted">{level.summary[locale]}</p>
      {detailed && (
        <>
          <p className="mt-4 text-xs font-bold uppercase tracking-wide text-brand">{d.focus}</p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {level.focus[locale].slice(0, 5).map((f) => <li key={f} className="rounded-full bg-bg px-2.5 py-1 text-xs text-ink">{f}</li>)}
          </ul>
          <dl className="mt-4 grid gap-1 text-sm">
            <div className="flex gap-2"><dt className="font-semibold">{d.eligibility}:</dt><dd className="text-muted">{elig ?? d.tbc}</dd></div>
            <div className="flex gap-2"><dt className="font-semibold">{d.availability}:</dt><dd className="text-muted">{level.admissionOpen === null ? d.tbc : level.admissionOpen ? d.open : d.closed}</dd></div>
          </dl>
        </>
      )}
      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        <Link href={href(locale, `/classes/${level.id}`)} className="btn-ghost !min-h-10 !px-4">{d.learnMore}<span className="sr-only"> — {level.name[locale]}</span></Link>
        <Link href={`${href(locale, "/admissions/enquiry")}?level=${level.id}`} className="btn-primary !min-h-10 !px-4">{d.enquire}<span className="sr-only"> — {level.name[locale]}</span></Link>
      </div>
    </article>
  );
}
