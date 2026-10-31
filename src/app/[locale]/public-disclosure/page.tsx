import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader, Pending } from "@/components/site/ui";
import { DISCLOSURE_CATEGORIES } from "@/content/disclosure";
import { getDict } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";
import { getPublishedDocuments, getSettings } from "@/lib/data";
import { alternates } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[locale]/public-disclosure">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDict(locale).home;
  return { title: d.disclosureTitle, description: d.disclosureBody, alternates: alternates("/public-disclosure", locale) };
}

const fmt = (iso: string | null, locale: string) => (iso ? new Date(iso).toLocaleDateString(locale === "hi" ? "hi-IN" : "en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—");

export default async function Disclosure({ params }: PageProps<"/[locale]/public-disclosure">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDict(locale);
  const [docs, settings] = await Promise.all([getPublishedDocuments(), getSettings()]);
  const a = settings.affiliation;
  const verified = a.status !== "not_verified" && !!a.verifiedOn;
  return (
    <>
      <PageHeader locale={locale} title={d.home.disclosureTitle} intro={d.home.disclosureBody} crumbs={[{ label: d.home.disclosureTitle }]} />
      <div className="container-x space-y-6 py-10">
        <section className="card">
          <h2 className="text-xl font-extrabold">{locale === "hi" ? "सामान्य जानकारी" : "General information"}</h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              [locale === "hi" ? "विद्यालय का नाम" : "Name of school", locale === "hi" ? "डॉ. वेदपति मिश्र इंस्टीट्यूट ऑफ स्कॉलर्स" : "Dr. VedPati Mishra Institute Of Scholars"],
              [locale === "hi" ? "संबद्धता संख्या" : "Affiliation number", verified ? a.affiliationNumber : null],
              [locale === "hi" ? "विद्यालय कोड" : "School code", verified ? a.schoolCode : null],
              [locale === "hi" ? "पता" : "Address", (locale === "hi" ? settings.addressHi : settings.addressEn)],
              [locale === "hi" ? "ईमेल" : "Email", settings.email],
              [locale === "hi" ? "फ़ोन" : "Phone", settings.phone],
            ].map(([k, v]) => <div key={k} className="rounded-xl bg-bg p-3"><dt className="text-xs font-bold uppercase text-brand">{k}</dt><dd className="mt-1 break-words">{v ?? d.common.tbc}</dd></div>)}
          </dl>
        </section>
        {DISCLOSURE_CATEGORIES.map((c) => {
          const items = docs.filter((x) => x.category === c.id);
          return (
            <section key={c.id} className="card" aria-labelledby={`dc-${c.id}`}>
              <h2 id={`dc-${c.id}`} className="text-lg font-extrabold">{c.name[locale]}</h2>
              {items.length === 0 ? <div className="mt-3"><Pending locale={locale} compact /></div> : (
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full min-w-[560px] text-left text-sm">
                    <thead><tr className="border-b border-brand/15 text-brand-900">
                      <th scope="col" className="py-2 pr-3">{locale === "hi" ? "दस्तावेज़" : "Document"}</th>
                      <th scope="col" className="py-2 pr-3">{locale === "hi" ? "प्रकाशित" : "Published"}</th>
                      <th scope="col" className="py-2 pr-3">{locale === "hi" ? "अद्यतन" : "Updated"}</th>
                      <th scope="col" className="py-2 pr-3">{locale === "hi" ? "वैधता" : "Valid until"}</th>
                      <th scope="col" className="py-2"><span className="sr-only">{d.common.download}</span></th>
                    </tr></thead>
                    <tbody>
                      {items.map((x) => (
                        <tr key={x.id} className="border-b border-brand/5">
                          <td className="py-2.5 pr-3 font-semibold">{(locale === "hi" && x.titleHi) || x.title}{x.verified && <span className="ml-2 rounded-full bg-[#E3F6F3] px-2 py-0.5 text-xs text-[#1B7B73]">{locale === "hi" ? "सत्यापित" : "Verified"}</span>}</td>
                          <td className="py-2.5 pr-3 text-muted">{fmt(x.publishedAt, locale)}</td>
                          <td className="py-2.5 pr-3 text-muted">{fmt(x.updatedAt, locale)}</td>
                          <td className="py-2.5 pr-3 text-muted">{x.validUntil ? fmt(x.validUntil, locale) : "—"}</td>
                          <td className="py-2.5"><a className="font-bold text-brand hover:underline" href={`/api/documents/${x.id}`} rel="noopener">{d.common.download}<span className="sr-only"> {x.title}</span></a></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}
