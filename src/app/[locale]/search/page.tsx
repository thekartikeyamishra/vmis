import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/site/ui";
import { SearchBox, type SearchItem } from "@/components/site/SearchBox";
import { PAGES } from "@/content/pages";
import { FAQS } from "@/content/faqs";
import { NAV } from "@/content/nav";
import { STAGES } from "@/content/levels";
import { getDict } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";
import { getLevels } from "@/lib/data";
import { alternates, href } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[locale]/search">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDict(locale).search.title, alternates: alternates("/search", locale), robots: { index: false, follow: true } };
}

export default async function Search({ params }: PageProps<"/[locale]/search">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDict(locale);
  const levels = await getLevels();
  const index: SearchItem[] = [
    ...levels.map((l) => ({ title: `${l.name[locale]} (${l.name[locale === "hi" ? "en" : "hi"]})`, text: `${l.summary[locale]} ${l.focus[locale].join(" ")}`, href: href(locale, `/classes/${l.id}`), kind: d.nav.academics })),
    ...STAGES.map((s) => ({ title: s.name[locale], text: `${s.range[locale]} ${s.intro[locale]}`, href: href(locale, `/academics/${s.id}`), kind: d.nav.academics })),
    ...PAGES.map((p) => ({ title: p.title[locale], text: `${p.description[locale]} ${p.sections.map((s) => `${s.heading[locale]} ${s.body?.[locale] ?? ""} ${s.bullets?.[locale].join(" ") ?? ""}`).join(" ")}`, href: href(locale, `/${p.slug}`), kind: "" })),
    ...FAQS.map((f) => ({ title: f.q[locale], text: f.a[locale], href: href(locale, "/faqs"), kind: "FAQ" })),
    ...NAV.flatMap((g) => g.items).filter((i) => !PAGES.some((p) => `/${p.slug}` === i.path)).map((i) => ({ title: i.label[locale], text: "", href: href(locale, i.path), kind: "" })),
  ];
  return (
    <>
      <PageHeader locale={locale} title={d.search.title} crumbs={[{ label: d.search.title }]} />
      <div className="container-x max-w-3xl py-10"><SearchBox items={index} labels={d.search} /></div>
    </>
  );
}
