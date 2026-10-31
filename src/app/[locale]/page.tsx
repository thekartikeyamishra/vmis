import Link from "next/link";
import { notFound } from "next/navigation";
import { FaqList, Pending, SectionTitle, SlotVisual, EmptyState } from "@/components/site/ui";
import { LevelCard } from "@/components/site/LevelCard";
import { LaunchFilm } from "@/components/site/LaunchFilm";
import { FAQS } from "@/content/faqs";
import { STAGES } from "@/content/levels";
import { OFFICIAL } from "@/content/school";
import { getDict } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";
import { getAnnouncements, getLevels, getSettings } from "@/lib/data";
import { href } from "@/lib/site";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDict(locale);
  const [levels, settings, news] = await Promise.all([getLevels(), getSettings(), getAnnouncements()]);
  const principalMsg = locale === "hi" ? settings.principalMessageHi : settings.principalMessageEn;

  return (
    <>
      {/* 2. Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-bg via-white to-lotus-50">
        <div className="container-x grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.15fr_.85fr] lg:py-20">
          <div className="reveal">
            <p className="eyebrow">{d.hero.eyebrow}</p>
            <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl lg:text-[3.4rem]">{d.hero.title}</h1>
            <p className="mt-5 max-w-2xl text-lg text-muted">{d.hero.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={href(locale, "/admissions")} className="btn-sun">{d.hero.cta1}</Link>
              <Link href={href(locale, "/about")} className="btn-primary">{d.hero.cta2}</Link>
              <Link href={href(locale, "/school-visit")} className="btn-ghost">{d.hero.cta3}</Link>
            </div>
          </div>
          <div className="mx-auto w-full max-w-md">
            <SlotVisual slot="hero" locale={locale} className="h-auto w-full drop-shadow-xl" />
          </div>
        </div>
      </section>

      {/* 3–4. Introduction & philosophy */}
      <section className="container-x grid gap-8 py-16 md:grid-cols-2">
        <div>
          <SectionTitle eyebrow={OFFICIAL.acronym} title={d.home.introTitle} />
          <p className="mt-4 text-lg text-muted">{d.home.introBody}</p>
        </div>
        <div className="card bg-gradient-to-br from-white to-bg">
          <p lang="hi" className="font-hindi text-4xl font-bold text-sun-700">{OFFICIAL.motto}</p>
          <h2 className="mt-2 text-2xl font-extrabold">{d.home.mottoTitle}</h2>
          <p className="mt-3 text-muted">{d.home.mottoBody}</p>
        </div>
      </section>

      <LaunchFilm locale={locale} />

      {/* 5–8. Academic journey by stage */}
      <section className="bg-bg py-16" aria-labelledby="journey">
        <div className="container-x">
          <div id="journey"><SectionTitle title={d.home.journeyTitle} sub={d.home.journeySub} center /></div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {STAGES.map((s) => {
              const stageLevels = levels.filter((l) => l.stage === s.id);
              return (
                <article key={s.id} className="card flex flex-col">
                  <SlotVisual slot={s.id} locale={locale} className="h-auto w-full rounded-2xl" />
                  <p className="eyebrow mt-5">{s.range[locale]}</p>
                  <h3 className="mt-1 text-2xl font-extrabold">{s.name[locale]}</h3>
                  <p className="mt-1 font-semibold text-brand">{s.tagline[locale]}</p>
                  <p className="mt-3 text-sm text-muted">{s.intro[locale]}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {stageLevels.map((l) => (
                      <li key={l.id}><Link href={href(locale, `/classes/${l.id}`)} className="inline-flex min-h-9 items-center rounded-full border border-brand/20 bg-white px-3 text-sm font-semibold text-brand hover:bg-brand hover:text-white">{l.name[locale]}</Link></li>
                    ))}
                  </ul>
                  <Link href={href(locale, `/academics/${s.id}`)} className="mt-auto pt-6 text-sm font-bold text-brand hover:underline">{d.common.learnMore} →</Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. CBSE approach */}
      <section className="container-x grid items-center gap-8 py-16 md:grid-cols-[1fr_1fr]">
        <SectionTitle eyebrow="CBSE · NCERT" title={locale === "hi" ? "सीबीएसई-उन्मुख शैक्षिक दृष्टिकोण" : "A CBSE-oriented educational approach"}
          sub={locale === "hi" ? "आधारभूत, प्रारंभिक और मध्य चरण — एनसीईआरटी ढाँचे के अनुरूप समझ, अनुप्रयोग और दक्षता पर केंद्रित अधिगम।" : "Foundational, Preparatory and Middle stages — learning focused on understanding, application and competencies in line with the NCERT frameworks."} />
        <div className="flex flex-wrap gap-3">
          {[["/cbse-approach", d.nav.cbse], ["/curriculum", locale === "hi" ? "पाठ्यक्रम" : "Curriculum"], ["/assessment", locale === "hi" ? "मूल्यांकन" : "Assessment"], ["/safal", "SAFAL"]].map(([p, l]) => (
            <Link key={p} href={href(locale, p!)} className="btn-ghost">{l}</Link>
          ))}
        </div>
      </section>

      {/* 10–13. Why VMIS / facilities / development / activities */}
      <section className="bg-gradient-to-b from-white to-bg py-16">
        <div className="container-x">
          <SectionTitle title={d.home.whyTitle} center />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {d.home.why.map(([title, body], i) => (
              <div key={title} className="card">
                <span aria-hidden className={`grid h-10 w-10 place-items-center rounded-xl text-lg font-extrabold text-white ${["bg-brand", "bg-lotus", "bg-sun", "bg-brand-2", "bg-[#2AA39A]", "bg-brand-900"][i]}`}>{i + 1}</span>
                <h3 className="mt-4 text-lg font-bold">{title}</h3>
                <p className="mt-1 text-sm text-muted">{body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={href(locale, "/facilities")} className="btn-ghost">{locale === "hi" ? "सुविधाएँ" : "Facilities"}</Link>
            <Link href={href(locale, "/student-development")} className="btn-ghost">{locale === "hi" ? "विद्यार्थी विकास" : "Student development"}</Link>
            <Link href={href(locale, "/sports-activities")} className="btn-ghost">{locale === "hi" ? "खेल और गतिविधियाँ" : "Sports & activities"}</Link>
          </div>
        </div>
      </section>

      {/* 14–15. Admission process + admissions open */}
      <section className="container-x py-16">
        <SectionTitle title={d.home.processTitle} />
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {d.home.process.map((step, i) => (
            <li key={step} className="card !p-5">
              <span className="text-3xl font-extrabold text-sun">{String(i + 1).padStart(2, "0")}</span>
              <p className="mt-2 font-semibold">{step}</p>
            </li>
          ))}
        </ol>
        {settings.admissionsOpen && (
          <div className="mt-10 flex flex-col items-start justify-between gap-6 rounded-[1.75rem] bg-brand p-8 text-white sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-extrabold text-white">{d.home.admissionsOpenTitle}{settings.academicSession ? ` · ${settings.academicSession}` : ""}</h2>
              <p className="mt-2 max-w-2xl text-white/85">{d.home.admissionsOpenBody}</p>
            </div>
            <Link href={href(locale, "/admissions/enquiry")} className="btn-sun shrink-0">{d.nav.enquire}</Link>
          </div>
        )}
      </section>

      {/* All 12 levels quick view */}
      <section className="container-x pb-4">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {levels.map((l) => <LevelCard key={l.id} level={l} locale={locale} />)}
        </div>
      </section>

      {/* 16–17. Principal + News */}
      <section className="container-x grid gap-6 py-16 lg:grid-cols-2">
        <div className="card">
          <h2 className="text-2xl font-extrabold">{d.home.principalTitle}</h2>
          {principalMsg ? (
            <>
              <p className="mt-4 line-clamp-6 text-muted">{principalMsg}</p>
              {settings.principalName && <p className="mt-3 font-semibold">— {settings.principalName}</p>}
              <Link href={href(locale, "/principal-message")} className="mt-4 inline-block font-bold text-brand hover:underline">{d.common.readMore} →</Link>
            </>
          ) : <div className="mt-4"><Pending locale={locale} compact /></div>}
        </div>
        <div>
          <h2 className="text-2xl font-extrabold">{d.home.newsTitle}</h2>
          <div className="mt-4">
            {news.length === 0 ? <EmptyState locale={locale} /> : (
              <ul className="space-y-3">
                {news.slice(0, 4).map((n) => (
                  <li key={n.id} className="card !p-5">
                    <time className="text-xs font-semibold text-sun-700" dateTime={n.date}>{n.date}</time>
                    <p className="mt-1 font-bold">{locale === "hi" ? n.titleHi : n.titleEn}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* 18. FAQs */}
      <section className="bg-bg py-16">
        <div className="container-x max-w-4xl">
          <SectionTitle title={d.home.faqTitle} center />
          <div className="mt-8"><FaqList items={FAQS.slice(0, 6).map((f) => ({ id: f.id, q: f.q[locale], a: f.a[locale] }))} /></div>
          <p className="mt-6 text-center"><Link className="font-bold text-brand hover:underline" href={href(locale, "/faqs")}>{d.common.learnMore} →</Link></p>
        </div>
      </section>

      {/* 19–20. Disclosure + contact */}
      <section className="container-x grid gap-6 py-16 md:grid-cols-2">
        <Link href={href(locale, "/public-disclosure")} className="card group block hover:border-brand/40">
          <h2 className="text-xl font-extrabold group-hover:text-brand">{d.home.disclosureTitle} →</h2>
          <p className="mt-2 text-muted">{d.home.disclosureBody}</p>
        </Link>
        <Link href={href(locale, "/contact")} className="card group block hover:border-brand/40">
          <h2 className="text-xl font-extrabold group-hover:text-brand">{d.home.contactTitle} →</h2>
          <p className="mt-2 text-muted">{locale === "hi" ? (settings.addressHi ?? "हंडिया, प्रयागराज, उत्तर प्रदेश") : (settings.addressEn ?? "Handia, Prayagraj, Uttar Pradesh")}</p>
        </Link>
      </section>
    </>
  );
}
