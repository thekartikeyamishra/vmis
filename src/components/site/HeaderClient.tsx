"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { otherLocale, switchLocalePath, type Locale } from "@/i18n/config";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname() || `/${locale}`;
  const target = otherLocale(locale);
  return (
    <Link
      href={switchLocalePath(pathname, target)}
      hrefLang={target}
      lang={target}
      prefetch={false}
      className="inline-flex h-11 items-center rounded-full border border-brand/20 px-3.5 text-sm font-bold text-brand hover:bg-bg"
      aria-label={target === "hi" ? "हिंदी में देखें" : "View in English"}
    >
      {target === "hi" ? "हिंदी" : "English"}
    </Link>
  );
}

type Group = { key: string; label: string; items: { label: string; href: string }[] };

export function MobileMenu({ locale, groups, labels }: { locale: Locale; groups: Group[]; labels: Record<"menu" | "close" | "disclosure" | "contact" | "enquire" | "search", string> }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const id = useId();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className="xl:hidden">
      <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((v) => !v)}
        className="grid h-11 w-11 place-items-center rounded-full bg-brand text-white" aria-label={open ? labels.close : labels.menu}>
        <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      <div id={id} hidden={!open} className="fixed inset-x-0 bottom-0 top-[76px] z-50 overflow-y-auto bg-white px-4 pb-10 pt-4">
        <nav aria-label="Mobile">
          {groups.map((g) => (
            <details key={g.key} className="border-b border-brand/10 py-1">
              <summary className="flex min-h-12 cursor-pointer items-center justify-between font-semibold text-brand-900">{g.label}<span aria-hidden>▾</span></summary>
              <ul className="pb-3">
                {g.items.map((i) => <li key={i.href}><Link href={i.href} className="block rounded-lg px-3 py-2.5 text-ink hover:bg-bg">{i.label}</Link></li>)}
              </ul>
            </details>
          ))}
          <Link href={`/${locale}/public-disclosure`} className="flex min-h-12 items-center border-b border-brand/10 font-semibold text-brand-900">{labels.disclosure}</Link>
          <Link href={`/${locale}/contact`} className="flex min-h-12 items-center border-b border-brand/10 font-semibold text-brand-900">{labels.contact}</Link>
          <Link href={`/${locale}/search`} className="flex min-h-12 items-center border-b border-brand/10 font-semibold text-brand-900">{labels.search}</Link>
          <Link href={`/${locale}/admissions/enquiry`} className="btn-sun mt-6 w-full">{labels.enquire}</Link>
        </nav>
      </div>
    </div>
  );
}
