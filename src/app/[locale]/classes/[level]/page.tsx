import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader, Pending, SlotVisual } from "@/components/site/ui";
import { LEVEL_IDS, STAGES, isLevelId } from "@/content/levels";
import { getDict } from "@/i18n/dictionaries";
import { isLocale, locales } from "@/i18n/config";
import { getLevels } from "@/lib/data";
import { alternates, href } from "@/lib/site";

export const dynamicParams = false;
export const generateStaticParams = () => locales.flatMap((locale) => LEVEL_IDS.map((level) => ({ locale, level })));

export async function generateMetadata({ params }: PageProps<"/[locale]/classes/[level]">): Promise<Metadata> {
  const { locale, level } = await params;
  if (!isLocale(locale) || !isLevelId(level)) return {};
  const l = (await getLevels()).find((x) => x.id === level);
  if (!l) return {};
  const school = locale === "hi" ? "वी.एम.आई.एस., हंडिया, प्रयागराज" : "VMIS, Handia, Prayagraj";
  return { title: `${l.name[locale]} — ${school}`, description: l.summary[locale], alternates: alternates(`/classes/${level}`, locale) };
}

export default async function LevelPage({ params }: PageProps<"/[locale]/classes/[level]">) {
  const { locale, level } = await params;
  if (!isLocale(locale) || !isLevelId(level)) notFound();
  const levels = await getLevels();
  const idx = levels.findIndex((x) => x.id === level);
  const l = levels[idx];
  if (!l) notFound();
  const d = getDict(locale);
  const stage = STAGES.find((s) => s.id === l.stage)!;
  const prev = levels[idx - 1], next = levels[idx + 1];

  return (
    <>
      <PageHeader locale={locale} title={l.name[locale]} intro={l.summary[locale]} eyebrow={`${stage.name[locale]} · ${stage.range[locale]}`}
        crumbs={[{ label: d.nav.academics, path: "/academics" }, { label: stage.name[locale], path: `/academics/${stage.id}` }, { label: l.name[locale] }]} />
      <div className="container-x grid gap-8 py-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="card">
            <h2 className="text-xl font-extrabold">{d.common.focus}</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {l.focus[locale].map((f) => <li key={f} className="flex gap-2.5"><span aria-hidden className="mt-2 h-2 w-2 shrink-0 rounded-full bg-sun" />{f}</li>)}
            </ul>
            <p className="mt-4 text-xs text-muted">{locale === "hi" ? "ये सुझावात्मक शैक्षिक श्रेणियाँ हैं; विद्यालय का वास्तविक पाठ्यक्रम विद्यालय द्वारा स्वीकृत किया जाता है।" : "These are indicative educational areas; the school’s actual curriculum is approved by the school."}</p>
          </section>
          <section className="card">
            <h2 className="text-xl font-extrabold">{locale === "hi" ? "पाठ्यक्रम, विषय और पाठ्यपुस्तकें" : "Curriculum, subjects and textbooks"}</h2>
            <div className="mt-3"><Pending locale={locale} /></div>
          </section>
          <section className="card">
            <h2 className="text-xl font-extrabold">{d.nav.admissions}</h2>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-bg p-3"><dt className="text-xs font-bold uppercase text-brand">{d.common.eligibility}</dt><dd className="mt-1">{l.eligibility[locale] ?? d.common.tbc}</dd></div>
              <div className="rounded-xl bg-bg p-3"><dt className="text-xs font-bold uppercase text-brand">{d.common.availability}</dt><dd className="mt-1">{l.admissionOpen === null ? d.common.tbc : l.admissionOpen ? d.common.open : d.common.closed}</dd></div>
            </dl>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href={`${href(locale, "/admissions/enquiry")}?level=${l.id}`} className="btn-primary">{d.common.enquire}</Link>
              <Link href={href(locale, "/documents-required")} className="btn-ghost">{locale === "hi" ? "आवश्यक दस्तावेज़" : "Required documents"}</Link>
              <Link href={href(locale, "/fees")} className="btn-ghost">{locale === "hi" ? "शुल्क जानकारी" : "Fee information"}</Link>
            </div>
          </section>
          <nav className="flex justify-between gap-4 text-sm font-bold" aria-label={locale === "hi" ? "कक्षा क्रम" : "Class sequence"}>
            {prev ? <Link className="text-brand hover:underline" href={href(locale, `/classes/${prev.id}`)}>← {prev.name[locale]}</Link> : <span />}
            {next ? <Link className="text-brand hover:underline" href={href(locale, `/classes/${next.id}`)}>{next.name[locale]} →</Link> : <span />}
          </nav>
        </div>
        <aside className="space-y-4">
          <SlotVisual slot={l.stage} locale={locale} className="h-auto w-full rounded-3xl" />
          <div className="card !p-4">
            <p className="mb-2 text-sm font-bold text-brand-900">{d.common.allLevels}</p>
            <ul className="grid grid-cols-3 gap-1.5">
              {levels.map((x) => (
                <li key={x.id}><Link href={href(locale, `/classes/${x.id}`)} aria-current={x.id === l.id ? "page" : undefined}
                  className={`block rounded-lg px-2 py-1.5 text-center text-xs font-semibold ${x.id === l.id ? "bg-brand text-white" : "bg-bg text-brand hover:bg-brand/10"}`}>{x.name[locale]}</Link></li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
