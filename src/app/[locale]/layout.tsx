import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource/noto-sans-devanagari/400.css";
import "@fontsource/noto-sans-devanagari/600.css";
import "@fontsource/noto-sans-devanagari/700.css";
import "../globals.css";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { JsonLd } from "@/components/site/ui";
import { MobileActionBar } from "@/components/site/MobileActionBar";
import { OFFICIAL } from "@/content/school";
import { getDict } from "@/i18n/dictionaries";
import { isLocale, locales } from "@/i18n/config";
import { getSettings } from "@/lib/data";
import { SITE_URL, alternates } from "@/lib/site";

export const revalidate = 300;
export const dynamicParams = false;
export const generateStaticParams = () => locales.map((locale) => ({ locale }));

export const viewport: Viewport = { themeColor: "#145B98", width: "device-width", initialScale: 1 };

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const name = locale === "hi" ? OFFICIAL.nameHi : OFFICIAL.nameEn;
  const desc = locale === "hi"
    ? "हंडिया, प्रयागराज स्थित सीबीएसई-उन्मुख विद्यालय — नर्सरी, प्रेप, एल.के.जी., यू.के.जी. एवं कक्षा 1 से 8। प्रवेश पूछताछ आमंत्रित।"
    : "CBSE-oriented school in Handia, Prayagraj offering Nursery, Prep, LKG, UKG and Classes I–VIII. Admission enquiries welcome.";
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: `${name} (${OFFICIAL.acronym}) — Handia, Prayagraj`, template: `%s | ${OFFICIAL.acronym}` },
    description: desc,
    applicationName: OFFICIAL.acronym,
    alternates: alternates("", locale),
    openGraph: { type: "website", siteName: name, locale: locale === "hi" ? "hi_IN" : "en_IN", images: [{ url: "/brand/og-default.jpg", width: 1200, height: 630, alt: name }] },
    twitter: { card: "summary_large_image" },
    manifest: "/manifest.webmanifest",
    formatDetection: { telephone: false },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [settings, d] = [await getSettings(), getDict(locale)];
  const org = {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "School"],
    "@id": `${SITE_URL}/#school`,
    name: OFFICIAL.nameEn,
    alternateName: [OFFICIAL.nameHi, OFFICIAL.acronym],
    slogan: OFFICIAL.motto,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/vmis-logo-512.png`,
    address: { "@type": "PostalAddress", addressLocality: OFFICIAL.locality, addressRegion: OFFICIAL.region, addressCountry: OFFICIAL.country, ...(settings.addressEn ? { streetAddress: settings.addressEn } : {}), ...(settings.postalCode ? { postalCode: settings.postalCode } : {}) },
    ...(settings.phone ? { telephone: settings.phone } : {}),
    ...(settings.email ? { email: settings.email } : {}),
  };
  const site = { "@context": "https://schema.org", "@type": "WebSite", name: OFFICIAL.nameEn, alternateName: OFFICIAL.nameHi, url: SITE_URL, inLanguage: ["en-IN", "hi-IN"], publisher: { "@id": `${SITE_URL}/#school` } };

  return (
    <html lang={locale === "hi" ? "hi-IN" : "en-IN"} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-white">{d.skip}</a>
        <Header locale={locale} />
        <main id="main" tabIndex={-1}>{children}</main>
        <Footer locale={locale} settings={settings} />
        <MobileActionBar locale={locale} settings={settings} />
        <JsonLd data={org} />
        <JsonLd data={site} />
      </body>
    </html>
  );
}
