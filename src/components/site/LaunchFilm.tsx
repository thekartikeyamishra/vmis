import { JsonLd, SectionTitle } from "@/components/site/ui";
import type { Locale } from "@/i18n/config";
import { SITE_URL } from "@/lib/site";

/** Launch film (original artwork, score and voiceover). Loaded only on play: preload="none". */
export function LaunchFilm({ locale }: { locale: Locale }) {
  const hi = locale === "hi";
  const src = `/media/vmis-launch-${locale}.mp4`;
  const poster = `/media/vmis-launch-${locale}-poster.webp`;
  const title = hi ? "वी.एम.आई.एस. की कहानी देखें" : "Watch the VMIS story";
  const sub = hi ? "नर्सरी से कक्षा 8 तक की शैक्षिक यात्रा — एक मिनट से कम में।" : "The journey from Nursery to Class VIII — in under a minute.";
  return (
    <section className="container-x py-16" aria-labelledby="film-title">
      <div id="film-title"><SectionTitle eyebrow={hi ? "फ़िल्म" : "Film"} title={title} sub={sub} center /></div>
      <div className="mx-auto mt-8 max-w-4xl overflow-hidden rounded-[1.75rem] border border-brand/10 bg-brand-900 shadow-[0_24px_60px_-24px_rgba(20,91,152,.45)]">
        <video className="aspect-video h-auto w-full" controls playsInline preload="none" poster={poster} aria-label={title}>
          <source src={src} type="video/mp4" />
          <track kind="captions" src={`/media/vmis-launch-${locale}.vtt`} srcLang={locale} label={hi ? "हिंदी" : "English"} default />
        </video>
      </div>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "VideoObject", name: title, description: sub, inLanguage: hi ? "hi-IN" : "en-IN",
        thumbnailUrl: `${SITE_URL}${poster}`, contentUrl: `${SITE_URL}${src}`, uploadDate: "2026-10-31", duration: hi ? "PT53S" : "PT48S",
        publisher: { "@id": `${SITE_URL}/#school` },
      }} />
    </section>
  );
}
