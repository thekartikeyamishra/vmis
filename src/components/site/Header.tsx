import Link from "next/link";
import { NAV } from "@/content/nav";
import { getDict } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { href } from "@/lib/site";
import { Brand } from "./ui";
import { LanguageSwitcher, MobileMenu } from "./HeaderClient";

export function Header({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const groups = NAV.map((g) => ({ key: g.key, label: g.label[locale], items: g.items.map((i) => ({ label: i.label[locale], href: href(locale, i.path) })) }));
  return (
    <header className="sticky top-0 z-40 border-b border-brand/10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="container-x flex h-[76px] items-center justify-between gap-4">
        <Brand locale={locale} />
        <nav aria-label="Primary" className="hidden xl:block">
          <ul className="flex items-center gap-0.5">
            {groups.map((g) => (
              <li key={g.key} className="group relative">
                <button type="button" aria-haspopup="true" className="whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-semibold text-ink hover:bg-bg hover:text-brand group-focus-within:bg-bg">
                  {g.label} <span aria-hidden className="text-xs">▾</span>
                </button>
                <ul className="invisible absolute left-0 top-full z-50 w-72 translate-y-1 rounded-2xl border border-brand/10 bg-white p-2 opacity-0 shadow-xl transition group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {g.items.map((i) => (
                    <li key={i.href}><Link href={i.href} className="block rounded-xl px-3 py-2 text-sm text-ink hover:bg-bg hover:text-brand">{i.label}</Link></li>
                  ))}
                </ul>
              </li>
            ))}
            <li><Link href={href(locale, "/public-disclosure")} className="whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-semibold text-ink hover:bg-bg hover:text-brand">{d.nav.disclosure}</Link></li>
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <Link href={href(locale, "/search")} className="hidden h-11 w-11 place-items-center rounded-full text-brand hover:bg-bg sm:grid" aria-label={d.nav.search}>
            <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          </Link>
          <LanguageSwitcher locale={locale} />
          <Link href={href(locale, "/admissions/enquiry")} className="btn-sun hidden md:inline-flex">{d.nav.enquire}</Link>
          <MobileMenu locale={locale} groups={groups} labels={{ menu: d.nav.menu, close: d.nav.close, disclosure: d.nav.disclosure, contact: d.nav.contact, enquire: d.nav.enquire, search: d.nav.search }} />
        </div>
      </div>
    </header>
  );
}
