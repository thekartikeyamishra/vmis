import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader, SlotVisual } from "@/components/site/ui";
import { LevelCard } from "@/components/site/LevelCard";
import { STAGES, isStageId } from "@/content/levels";
import { getDict } from "@/i18n/dictionaries";
import { isLocale, locales } from "@/i18n/config";
import { getLevels } from "@/lib/data";
import { alternates, href } from "@/lib/site";

export const dynamicParams = false;
export const generateStaticParams = () => locales.flatMap((locale) => STAGES.map((s) => ({ locale, stage: s.id })));

export async function generateMetadata({ params }: PageProps<"/[locale]/academics/[stage]">): Promise<Metadata> {
  const { locale, stage } = await params;
  const s = STAGES.find((x) => x.id === stage);
  if (!s || !isLocale(locale)) return {};
  return { title: `${s.name[locale]} (${s.range[locale]})`, description: s.intro[locale], alternates: alternates(`/academics/${stage}`, locale) };
}

const EARLY_PEDAGOGY = {
  en: ["Play-based learning", "Activity-based learning", "Storytelling", "Rhymes, music and movement", "Art and craft", "Sensory activities", "Exploration and guided discovery", "Early language and numeracy", "Social-emotional learning"],
  hi: ["खेल-आधारित अधिगम", "गतिविधि-आधारित अधिगम", "कहानी सुनाना", "कविताएँ, संगीत और गति", "कला और शिल्प", "संवेदी गतिविधियाँ", "अन्वेषण और निर्देशित खोज", "प्रारंभिक भाषा और संख्या ज्ञान", "सामाजिक-भावनात्मक अधिगम"],
};

export default async function StagePage({ params }: PageProps<"/[locale]/academics/[stage]">) {
  const { locale, stage } = await params;
  if (!isLocale(locale) || !isStageId(stage)) notFound();
  const s = STAGES.find((x) => x.id === stage)!;
  const d = getDict(locale);
  const levels = (await getLevels()).filter((l) => l.stage === stage);
  const early = stage === "early-years";

  return (
    <div className={early ? "bg-gradient-to-b from-lotus-50/60 to-white" : undefined}>
      <PageHeader locale={locale} title={s.name[locale]} intro={s.intro[locale]} eyebrow={s.range[locale]}
        crumbs={[{ label: d.nav.academics, path: "/academics" }, { label: s.name[locale] }]} />
      <div className="container-x py-10">
        <div className="grid items-center gap-8 md:grid-cols-[1fr_380px]">
          <div>
            <h2 className="text-2xl font-extrabold">{s.tagline[locale]}</h2>
            {early && (
              <>
                <p className="mt-3 text-muted">{locale === "hi"
                  ? "प्रारंभिक वर्ष परीक्षा-केंद्रित नहीं हैं। हम अत्यधिक गृहकार्य या दबावपूर्ण शैक्षणिक लक्ष्यों के बजाय आनंदपूर्ण, आयु-उपयुक्त अनुभवों पर ध्यान देते हैं।"
                  : "The early years are not examination-focused. We emphasise joyful, age-appropriate experiences rather than heavy homework or pressured academic targets."}</p>
                <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                  {EARLY_PEDAGOGY[locale].map((p) => <li key={p} className="flex gap-2.5"><span aria-hidden className="mt-2 h-2 w-2 shrink-0 rounded-full bg-lotus" />{p}</li>)}
                </ul>
                <Link href={href(locale, "/early-years-transition")} className="btn-ghost mt-6">{locale === "hi" ? "अभिभावक मार्गदर्शिका: विद्यालय की शुरुआत" : "Parent guide: starting school"}</Link>
              </>
            )}
            {!early && <p className="mt-3 text-muted">{locale === "hi" ? "पाठ्यक्रम, विषय और अधिगम उद्देश्य विद्यालय द्वारा प्रत्येक सत्र में स्वीकृत किए जाते हैं।" : "Curriculum, subjects and learning objectives are approved by the school for each session."}</p>}
          </div>
          <SlotVisual slot={stage} locale={locale} className="h-auto w-full rounded-3xl" />
        </div>
        <h2 className="mt-14 text-2xl font-extrabold">{d.common.allLevels}</h2>
        <div className={`mt-6 grid gap-5 sm:grid-cols-2 ${levels.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          {levels.map((l) => <LevelCard key={l.id} level={l} locale={locale} detailed />)}
        </div>
        <p className="mt-6 text-xs text-muted">{locale === "hi" ? "शैक्षिक केंद्र-बिंदु सुझावात्मक श्रेणियाँ हैं; वास्तविक अधिगम परिणाम विद्यालय द्वारा स्वीकृत किए जाते हैं।" : "Educational focus areas are indicative categories; actual learning outcomes are approved by the school."}</p>
      </div>
    </div>
  );
}
