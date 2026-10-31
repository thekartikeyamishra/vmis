import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EmptyState, PageHeader } from "@/components/site/ui";
import { isLocale } from "@/i18n/config";
import { alternates } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[locale]/gallery">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: locale === "hi" ? "चित्र दीर्घा" : "Gallery", alternates: alternates("/gallery", locale) };
}

export default async function Gallery({ params }: PageProps<"/[locale]/gallery">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const title = locale === "hi" ? "चित्र दीर्घा" : "Gallery";
  return (
    <>
      <PageHeader locale={locale} title={title} crumbs={[{ label: title }]} />
      <div className="container-x max-w-3xl py-10">
        <EmptyState locale={locale} text={locale === "hi"
          ? "विद्यालय की वास्तविक तस्वीरें अभिभावकों की सहमति प्राप्त होने के बाद यहाँ प्रकाशित की जाएँगी।"
          : "Genuine school photographs will be published here once parental media consent has been obtained."} />
      </div>
    </>
  );
}
