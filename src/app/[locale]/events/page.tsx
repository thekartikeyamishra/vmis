import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AnnouncementsPage } from "@/components/site/Announcements";
import { isLocale } from "@/i18n/config";
import { alternates } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[locale]/events">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: locale === "hi" ? "कार्यक्रम" : "Events", alternates: alternates("/events", locale) };
}

export default async function Page({ params }: PageProps<"/[locale]/events">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <AnnouncementsPage locale={locale} type="event" title={locale === "hi" ? "कार्यक्रम" : "Events"} />;
}
