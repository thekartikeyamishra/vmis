import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader, SlotVisual } from "@/components/site/ui";
import { STAGES } from "@/content/levels";
import { getDict } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";
import { getLevels } from "@/lib/data";
import { alternates, href } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[locale]/academics">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: locale === "hi" ? "शैक्षिक यात्रा — नर्सरी से कक्षा 8" : "Academic Journey — Nursery to Class VIII",
    description: locale === "hi" ? "वी.एम.आई.एस. में प्रारंभिक वर्ष, प्राथमिक और उच्च प्राथमिक चरण की 12 कक्षाएँ।" : "Twelve levels across Early Years, Primary and Upper Primary at VMIS, Handia, Prayagraj.",
    alternates: alternates("/academics", locale),
  };
}

export default async function Academics({ params }: PageProps<"/[locale]/academics">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDict(locale);
  const levels = await getLevels();
  return (
    <>
      <PageHeader locale={locale} title={d.home.journeyTitle} intro={d.home.journeySub} crumbs={[{ label: d.nav.academics }]} />
      <div className="container-x space-y-10 py-10">
        {STAGES.map((s) => (
          <section key={s.id} className="card grid items-center gap-8 md:grid-cols-[280px_1fr]" aria-labelledby={`st-${s.id}`}>
            <SlotVisual slot={s.id} locale={locale} className="h-auto w-full rounded-2xl" />
            <div>
              <p className="eyebrow">{s.range[locale]}</p>
              <h2 id={`st-${s.id}`} className="mt-1 text-2xl font-extrabold">{s.name[locale]}</h2>
              <p className="mt-2 text-muted">{s.intro[locale]}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {levels.filter((l) => l.stage === s.id).map((l) => (
                  <li key={l.id}><Link href={href(locale, `/classes/${l.id}`)} className="inline-flex min-h-10 items-center rounded-full border border-brand/20 px-4 text-sm font-semibold text-brand hover:bg-brand hover:text-white">{l.name[locale]}</Link></li>
                ))}
              </ul>
              <Link href={href(locale, `/academics/${s.id}`)} className="btn-primary mt-6">{d.common.learnMore}</Link>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
