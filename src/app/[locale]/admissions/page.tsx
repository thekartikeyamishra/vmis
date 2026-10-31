import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/site/ui";
import { LevelCard } from "@/components/site/LevelCard";
import { PAGES } from "@/content/pages";
import { STAGES } from "@/content/levels";
import { getDict } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";
import { getLevels, getSettings } from "@/lib/data";
import { alternates, href } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[locale]/admissions">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: locale === "hi" ? "प्रवेश — नर्सरी से कक्षा 8" : "Admissions — Nursery to Class VIII",
    description: locale === "hi" ? "वी.एम.आई.एस., हंडिया, प्रयागराज में प्रवेश प्रक्रिया, पात्रता, दस्तावेज़, शुल्क जानकारी और ऑनलाइन पूछताछ।" : "Admission process, eligibility, documents, fees and online enquiry at VMIS, Handia, Prayagraj.",
    alternates: alternates("/admissions", locale),
  };
}

export default async function Admissions({ params }: PageProps<"/[locale]/admissions">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDict(locale);
  const [levels, settings] = await Promise.all([getLevels(), getSettings()]);
  return (
    <>
      <PageHeader locale={locale} title={d.nav.admissions + (settings.academicSession ? ` ${settings.academicSession}` : "")} intro={d.home.admissionsOpenBody} crumbs={[{ label: d.nav.admissions }]} />
      <div className="container-x py-10">
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {d.home.process.map((step, i) => (
            <li key={step} className="card !p-5"><span className="text-3xl font-extrabold text-sun">{i + 1}</span><p className="mt-2 font-semibold">{step}</p></li>
          ))}
        </ol>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PAGES.filter((p) => p.group === "admissions").map((p) => (
            <Link key={p.slug} href={href(locale, `/${p.slug}`)} className="card block hover:border-brand/40">
              <p className="font-extrabold text-brand-900">{p.title[locale]} →</p>
              <p className="mt-1 text-sm text-muted">{p.description[locale]}</p>
            </Link>
          ))}
        </div>
        {STAGES.map((s) => (
          <section key={s.id} className="mt-14" aria-labelledby={`adm-${s.id}`}>
            <p className="eyebrow">{s.range[locale]}</p>
            <h2 id={`adm-${s.id}`} className="text-2xl font-extrabold">{s.name[locale]}</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {levels.filter((l) => l.stage === s.id).map((l) => <LevelCard key={l.id} level={l} locale={locale} detailed />)}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
