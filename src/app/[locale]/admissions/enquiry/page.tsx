import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/site/ui";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { STAGES } from "@/content/levels";
import { getDict } from "@/i18n/dictionaries";
import { isLocale } from "@/i18n/config";
import { getLevels } from "@/lib/data";
import { alternates } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[locale]/admissions/enquiry">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDict(locale).form;
  return { title: d.title, description: d.intro, alternates: alternates("/admissions/enquiry", locale) };
}

export default async function EnquiryPage({ params }: PageProps<"/[locale]/admissions/enquiry">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = getDict(locale);
  const levels = await getLevels();
  const options = levels.map((l) => ({ id: l.id, label: l.name[locale], group: STAGES.find((s) => s.id === l.stage)!.name[locale] }));
  return (
    <>
      <PageHeader locale={locale} title={d.form.title} intro={d.form.intro} crumbs={[{ label: d.nav.admissions, path: "/admissions" }, { label: d.form.title }]} />
      <div className="container-x max-w-3xl py-10">
        <Suspense fallback={<div className="card h-96 animate-pulse bg-bg" aria-busy="true" />}>
          <EnquiryForm locale={locale} dict={d.form} levels={options} />
        </Suspense>
        <p className="mt-6 text-sm text-muted">{d.home.admissionsOpenBody}</p>
      </div>
    </>
  );
}
