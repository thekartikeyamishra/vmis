import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FaqList, JsonLd, PageHeader } from "@/components/site/ui";
import { FAQS } from "@/content/faqs";
import { getDict } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";
import { alternates } from "@/lib/site";

const CAT = { admissions: { en: "Admissions", hi: "प्रवेश" }, academics: { en: "Academics", hi: "शिक्षा" }, "early-years": { en: "Early Years", hi: "प्रारंभिक वर्ष" }, general: { en: "General", hi: "सामान्य" } } as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/faqs">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: getDict(locale).home.faqTitle, description: locale === "hi" ? "वी.एम.आई.एस. प्रवेश, कक्षाओं और प्रारंभिक वर्षों पर सामान्य प्रश्न।" : "Common questions about admissions, classes and early years at VMIS.", alternates: alternates("/faqs", locale) };
}

export default async function Faqs({ params }: PageProps<"/[locale]/faqs">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDict(locale);
  return (
    <>
      <PageHeader locale={locale} title={d.home.faqTitle} crumbs={[{ label: d.home.faqTitle }]} />
      <div className="container-x max-w-4xl space-y-10 py-10">
        {(Object.keys(CAT) as (keyof typeof CAT)[]).map((c) => (
          <section key={c}>
            <h2 className="mb-4 text-xl font-extrabold">{CAT[c][locale]}</h2>
            <FaqList items={FAQS.filter((f) => f.category === c).map((f) => ({ id: f.id, q: f.q[locale], a: f.a[locale] }))} />
          </section>
        ))}
      </div>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", inLanguage: locale === "hi" ? "hi-IN" : "en-IN", mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q[locale], acceptedAnswer: { "@type": "Answer", text: f.a[locale] } })) }} />
    </>
  );
}
