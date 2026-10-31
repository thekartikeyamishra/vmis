import Link from "next/link";
import { FOOTER_POLICIES, FOOTER_QUICK } from "@/content/nav";
import { OFFICIAL, type SchoolSettings } from "@/content/school";
import { getDict } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { href } from "@/lib/site";
import { Logo } from "./ui";

export function AppBadges({ locale, settings }: { locale: Locale; settings: SchoolSettings }) {
  const soon = getDict(locale).common.comingSoon;
  const items = [
    { name: "Google Play", url: settings.playStoreUrl },
    { name: "App Store", url: settings.appStoreUrl },
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((i) =>
        i.url ? (
          <a key={i.name} href={i.url} rel="noopener noreferrer" target="_blank" className="rounded-xl border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10">{i.name}</a>
        ) : (
          <span key={i.name} aria-disabled="true" className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white/70">
            {i.name} · {soon}
          </span>
        ),
      )}
    </div>
  );
}

export function Footer({ locale, settings }: { locale: Locale; settings: SchoolSettings }) {
  const d = getDict(locale);
  const address = locale === "hi" ? settings.addressHi : settings.addressEn;
  return (
    <footer className="mt-24 bg-brand-900 pb-16 text-white md:pb-0">
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <Logo size={64} />
            <div>
              <p className="font-hindi font-bold" lang="hi">{OFFICIAL.nameHi}</p>
              <p className="text-sm text-white/80" lang="en">{OFFICIAL.nameEn}</p>
            </div>
          </div>
          <p className="mt-4 font-hindi text-lg text-sun" lang="hi">{OFFICIAL.motto}</p>
          <address className="mt-3 not-italic text-sm text-white/80">
            {address ?? (locale === "hi" ? "हंडिया, प्रयागराज, उत्तर प्रदेश" : "Handia, Prayagraj, Uttar Pradesh")}
            {settings.phone && <><br /><a className="hover:underline" href={`tel:${settings.phone}`}>{settings.phone}</a></>}
            {settings.email && <><br /><a className="hover:underline" href={`mailto:${settings.email}`}>{settings.email}</a></>}
          </address>
        </div>
        <div>
          <h2 className="text-base font-bold text-white">{d.footer.quick}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {FOOTER_QUICK.map((i) => <li key={i.path}><Link className="text-white/80 hover:text-white hover:underline" href={href(locale, i.path)}>{i.label[locale]}</Link></li>)}
          </ul>
        </div>
        <div>
          <h2 className="text-base font-bold text-white">{d.footer.policies}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {FOOTER_POLICIES.map((i) => <li key={i.path}><Link className="text-white/80 hover:text-white hover:underline" href={href(locale, i.path)}>{i.label[locale]}</Link></li>)}
          </ul>
        </div>
        <div>
          <h2 className="text-base font-bold text-white">{d.footer.apps}</h2>
          <div className="mt-4"><AppBadges locale={locale} settings={settings} /></div>
          <p className="mt-6 text-xs text-white/60">{d.footer.illustrationNote}</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-5 text-xs text-white/70 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {OFFICIAL.nameEn} ({OFFICIAL.acronym}). {d.footer.rights}</p>
          <p lang="hi" className="font-hindi">{OFFICIAL.nameHi}</p>
        </div>
      </div>
    </footer>
  );
}
