import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader, Pending, JsonLd } from "@/components/site/ui";
import { AppBadges } from "@/components/site/Footer";
import { PAGES, getPage, type ContentPage } from "@/content/pages";
import { STAGES, type AcademicLevel } from "@/content/levels";
import type { SchoolSettings } from "@/content/school";
import { getDict } from "@/i18n/dictionaries";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getLevels, getSettings } from "@/lib/data";
import { SITE_URL, alternates, href } from "@/lib/site";

export const dynamicParams = false;
export const generateStaticParams = () => locales.flatMap((locale) => PAGES.map((p) => ({ locale, slug: p.slug })));

export async function generateMetadata({ params }: PageProps<"/[locale]/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = getPage(slug);
  if (!page || !isLocale(locale)) return {};
  return { title: page.title[locale], description: page.description[locale], alternates: alternates(`/${slug}`, locale), robots: page.noindex ? { index: false } : undefined };
}

const GROUP_LABEL = {
  about: { en: "About", hi: "परिचय" }, cbse: { en: "CBSE & Curriculum", hi: "सीबीएसई व पाठ्यक्रम" }, campus: { en: "Campus Life", hi: "विद्यालय जीवन" },
  admissions: { en: "Admissions", hi: "प्रवेश" }, policies: { en: "Policies", hi: "नीतियाँ" }, services: { en: "Services", hi: "सेवाएँ" },
} as const;

export default async function ContentPageRoute({ params }: PageProps<"/[locale]/[slug]">) {
  const { locale, slug } = await params;
  const page = getPage(slug);
  if (!page || !isLocale(locale)) notFound();
  const d = getDict(locale);
  const [settings, levels] = await Promise.all([getSettings(), getLevels()]);
  const groupPath = page.group === "admissions" ? "/admissions" : undefined;

  return (
    <article>
      <PageHeader locale={locale} title={page.title[locale]} intro={page.description[locale]} eyebrow={GROUP_LABEL[page.group][locale]}
        crumbs={[{ label: GROUP_LABEL[page.group][locale], path: groupPath }, { label: page.title[locale] }]} />
      <div className="container-x grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-8">
          {page.sections.map((s, i) => (
            <section key={i} className="card">
              <h2 className="text-xl font-extrabold sm:text-2xl">{s.heading[locale]}</h2>
              {s.body && <p className="mt-3 text-muted">{s.body[locale]}</p>}
              {s.bullets && (
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {s.bullets[locale].map((b) => (
                    <li key={b} className="flex gap-2.5"><span aria-hidden className="mt-2 h-2 w-2 shrink-0 rounded-full bg-sun" /><span>{b}</span></li>
                  ))}
                </ul>
              )}
              {s.pending && <div className="mt-4"><Pending locale={locale} /></div>}
              {s.link && (
                <p className="mt-4">
                  {s.link.href.startsWith("http")
                    ? <a className="font-bold text-brand hover:underline" href={s.link.href} target="_blank" rel="noopener noreferrer">{s.link.label[locale]} ↗</a>
                    : <Link className="font-bold text-brand hover:underline" href={href(locale, s.link.href)}>{s.link.label[locale]} →</Link>}
                </p>
              )}
            </section>
          ))}
          <Widget page={page} locale={locale} settings={settings} levels={levels} />
        </div>
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="card bg-brand text-white">
            <p className="text-lg font-bold text-white">{d.home.admissionsOpenTitle}</p>
            <p className="mt-2 text-sm text-white/85">{d.form.intro}</p>
            <Link href={href(locale, "/admissions/enquiry")} className="btn-sun mt-4 w-full">{d.nav.enquire}</Link>
          </div>
          <nav aria-label={GROUP_LABEL[page.group][locale]} className="card !p-4">
            <ul className="space-y-1">
              {PAGES.filter((p) => p.group === page.group).map((p) => (
                <li key={p.slug}>
                  <Link href={href(locale, `/${p.slug}`)} aria-current={p.slug === slug ? "page" : undefined}
                    className={`block rounded-lg px-3 py-2 text-sm ${p.slug === slug ? "bg-bg font-bold text-brand" : "text-ink hover:bg-bg"}`}>{p.title[locale]}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebPage", name: page.title[locale], description: page.description[locale], url: `${SITE_URL}${href(locale, `/${slug}`)}`, inLanguage: locale === "hi" ? "hi-IN" : "en-IN", isPartOf: { "@type": "WebSite", url: SITE_URL } }} />
    </article>
  );
}

function Widget({ page, locale, settings, levels }: { page: ContentPage; locale: Locale; settings: SchoolSettings; levels: AcademicLevel[] }) {
  const d = getDict(locale);
  switch (page.widget) {
    case "eligibility":
      return (
        <section className="card overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <caption className="sr-only">{page.title[locale]}</caption>
            <thead><tr className="border-b border-brand/15 text-brand-900"><th scope="col" className="py-3 pr-4">{locale === "hi" ? "कक्षा" : "Class"}</th><th scope="col" className="py-3 pr-4">{d.common.eligibility}</th><th scope="col" className="py-3">{d.common.availability}</th></tr></thead>
            <tbody>
              {levels.map((l) => (
                <tr key={l.id} className="border-b border-brand/5">
                  <th scope="row" className="py-3 pr-4 font-semibold"><Link className="hover:text-brand hover:underline" href={href(locale, `/classes/${l.id}`)}>{l.name[locale]}</Link></th>
                  <td className="py-3 pr-4 text-muted">{l.eligibility[locale] ?? d.common.tbc}</td>
                  <td className="py-3 text-muted">{l.admissionOpen === null ? d.common.tbc : l.admissionOpen ? d.common.open : d.common.closed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      );
    case "fees": {
      const note = locale === "hi" ? settings.feeNoteHi : settings.feeNoteEn;
      return (
        <section className="card">
          <h2 className="text-xl font-extrabold">{page.title[locale]}</h2>
          {note ? <p className="mt-3 whitespace-pre-line text-muted">{note}</p> : <div className="mt-3"><Pending locale={locale} /></div>}
          <p className="mt-4 text-sm"><Link className="font-bold text-brand hover:underline" href={href(locale, "/public-disclosure")}>{d.home.disclosureTitle} →</Link></p>
        </section>
      );
    }
    case "principal": {
      const msg = locale === "hi" ? settings.principalMessageHi : settings.principalMessageEn;
      return (
        <section className="card">
          {msg ? <><p className="whitespace-pre-line text-lg leading-relaxed">{msg}</p>{settings.principalName && <p className="mt-6 font-bold">— {settings.principalName}</p>}</> : <Pending locale={locale} />}
        </section>
      );
    }
    case "affiliation": {
      const a = settings.affiliation;
      const verified = a.status !== "not_verified" && !!a.verifiedOn;
      const rows: [string, string | null][] = [
        [locale === "hi" ? "संबद्धता स्थिति" : "Affiliation status", verified ? a.status.replace("_", " ") : null],
        [locale === "hi" ? "संबद्धता संख्या" : "Affiliation number", verified ? a.affiliationNumber : null],
        [locale === "hi" ? "विद्यालय कोड" : "School code", verified ? a.schoolCode : null],
        [locale === "hi" ? "श्रेणी" : "Category", verified ? a.category : null],
        [locale === "hi" ? "वैधता" : "Valid until", verified ? a.validUntil : null],
        [locale === "hi" ? "सत्यापन तिथि" : "Verified on", verified ? a.verifiedOn : null],
      ];
      return (
        <section className="card">
          <h2 className="text-xl font-extrabold">{locale === "hi" ? "संस्थागत प्रोफ़ाइल" : "Institutional profile"}</h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            {rows.map(([k, v]) => <div key={k} className="rounded-xl bg-bg p-3"><dt className="text-xs font-bold uppercase text-brand">{k}</dt><dd className="mt-1 capitalize">{v ?? d.common.tbc}</dd></div>)}
          </dl>
        </section>
      );
    }
    case "stages":
      return (
        <section className="grid gap-4 sm:grid-cols-3">
          {STAGES.map((s) => (
            <Link key={s.id} href={href(locale, `/academics/${s.id}`)} className="card block hover:border-brand/40">
              <p className="eyebrow">{s.range[locale]}</p><p className="mt-1 text-lg font-extrabold">{s.name[locale]}</p>
            </Link>
          ))}
        </section>
      );
    case "enquiry-cta":
      return (
        <section className="flex flex-wrap gap-3">
          <Link href={href(locale, "/admissions/enquiry")} className="btn-primary">{d.common.enquire}</Link>
          <Link href={`${href(locale, "/admissions/enquiry")}?visit=1`} className="btn-ghost">{d.hero.cta3}</Link>
        </section>
      );
    case "apps":
      return <section className="card bg-brand-900"><AppBadges locale={locale} settings={settings} /></section>;
    default:
      return null;
  }
}
