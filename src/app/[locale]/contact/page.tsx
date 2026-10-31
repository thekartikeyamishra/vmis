import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader, Pending } from "@/components/site/ui";
import { OFFICIAL } from "@/content/school";
import { getDict } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";
import { getSettings } from "@/lib/data";
import { alternates, href } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: locale === "hi" ? "संपर्क — वी.एम.आई.एस., हंडिया, प्रयागराज" : "Contact VMIS — Handia, Prayagraj",
    description: locale === "hi" ? "डॉ. वेदपति मिश्र इंस्टीट्यूट ऑफ स्कॉलर्स, हंडिया, प्रयागराज का पता, फ़ोन और ईमेल।" : "Address, phone and email of Dr. VedPati Mishra Institute Of Scholars, Handia, Prayagraj.",
    alternates: alternates("/contact", locale),
  };
}

export default async function Contact({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDict(locale);
  const s = await getSettings();
  const hi = locale === "hi";
  const rows: [string, React.ReactNode | null][] = [
    [hi ? "पता" : "Address", (hi ? s.addressHi : s.addressEn) ?? null],
    [hi ? "फ़ोन" : "Phone", s.phone ? <a className="text-brand hover:underline" href={`tel:${s.phone}`}>{s.phone}</a> : null],
    ["WhatsApp", s.whatsapp ? <a className="text-brand hover:underline" href={`https://wa.me/${s.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">{s.whatsapp}</a> : null],
    [hi ? "ईमेल" : "Email", s.email ? <a className="text-brand hover:underline" href={`mailto:${s.email}`}>{s.email}</a> : null],
    [hi ? "कार्यालय समय" : "Office hours", (hi ? s.officeHoursHi : s.officeHoursEn) ?? null],
    [hi ? "विद्यालय समय" : "School timings", (hi ? s.schoolTimingsHi : s.schoolTimingsEn) ?? null],
  ];
  return (
    <>
      <PageHeader locale={locale} title={d.home.contactTitle} intro={`${hi ? OFFICIAL.nameHi : OFFICIAL.nameEn} · ${hi ? "हंडिया, प्रयागराज, उत्तर प्रदेश" : "Handia, Prayagraj, Uttar Pradesh"}`} crumbs={[{ label: d.nav.contact }]} />
      <div className="container-x grid gap-6 py-10 lg:grid-cols-2">
        <section className="card">
          <dl className="space-y-4">
            {rows.map(([k, v]) => <div key={k}><dt className="text-xs font-bold uppercase text-brand">{k}</dt><dd className="mt-1">{v ?? <span className="text-muted">{d.common.tbc}</span>}</dd></div>)}
          </dl>
          {!s.phone && !s.email && <div className="mt-5"><Pending locale={locale} compact /></div>}
          {s.mapUrl && <a href={s.mapUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost mt-6">{hi ? "मानचित्र में देखें" : "Open in Maps"} ↗</a>}
        </section>
        <section className="card flex flex-col justify-center bg-brand text-white">
          <h2 className="text-2xl font-extrabold text-white">{d.home.admissionsOpenTitle}</h2>
          <p className="mt-2 text-white/85">{d.form.intro}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={href(locale, "/admissions/enquiry")} className="btn-sun">{d.nav.enquire}</Link>
            <Link href={`${href(locale, "/admissions/enquiry")}?visit=1`} className="btn rounded-full border border-white/40 text-white hover:bg-white/10">{d.hero.cta3}</Link>
          </div>
        </section>
      </div>
    </>
  );
}
