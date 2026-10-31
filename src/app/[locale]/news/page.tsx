import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AnnouncementsPage } from "@/components/site/Announcements";
import { isLocale } from "@/i18n/config";
import { alternates } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[locale]/news">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: locale === "hi" ? "समाचार" : "News", alternates: alternates("/news", locale) };
}

export default async function Page({ params }: PageProps<"/[locale]/news">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <AnnouncementsPage locale={locale} type="news" title={locale === "hi" ? "समाचार" : "News"} />;
}
