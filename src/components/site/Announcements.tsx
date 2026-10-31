import { EmptyState, JsonLd, PageHeader } from "@/components/site/ui";
import type { Locale } from "@/i18n/config";
import { getAnnouncements } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

export async function AnnouncementsPage({ locale, type, title }: { locale: Locale; type: "news" | "event"; title: string }) {
  const items = await getAnnouncements(type);
  return (
    <>
      <PageHeader locale={locale} title={title} crumbs={[{ label: title }]} />
      <div className="container-x max-w-4xl py-10">
        {items.length === 0 ? <EmptyState locale={locale} /> : (
          <ul className="space-y-5">
            {items.map((n) => (
              <li key={n.id} id={n.id} className="card">
                <time className="text-sm font-semibold text-sun-700" dateTime={n.date}>{n.date}</time>
                <h2 className="mt-1 text-xl font-extrabold">{locale === "hi" ? n.titleHi : n.titleEn}</h2>
                <p className="mt-2 whitespace-pre-line text-muted">{locale === "hi" ? n.bodyHi : n.bodyEn}</p>
                <JsonLd data={type === "event"
                  ? { "@context": "https://schema.org", "@type": "Event", name: locale === "hi" ? n.titleHi : n.titleEn, startDate: n.date, eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode", location: { "@type": "Place", name: "VMIS", address: "Handia, Prayagraj, Uttar Pradesh, IN" }, organizer: { "@id": `${SITE_URL}/#school` } }
                  : { "@context": "https://schema.org", "@type": "Article", headline: locale === "hi" ? n.titleHi : n.titleEn, datePublished: n.date, publisher: { "@id": `${SITE_URL}/#school` } }} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
