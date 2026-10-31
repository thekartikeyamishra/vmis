import Link from "next/link";
import type { SchoolSettings } from "@/content/school";
import type { Locale } from "@/i18n/config";

/** Sticky bottom bar on phones: the fastest path from interest to contact (call / WhatsApp / enquiry). */
export function MobileActionBar({ locale, settings }: { locale: Locale; settings: SchoolSettings }) {
  const hi = locale === "hi";
  const wa = settings.whatsapp?.replace(/\D/g, "");
  const waText = encodeURIComponent(hi ? "नमस्ते, मुझे वी.एम.आई.एस. में प्रवेश की जानकारी चाहिए।" : "Hello, I would like admission information for VMIS.");
  const item = "flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-xs font-bold";
  return (
    <nav aria-label={hi ? "त्वरित संपर्क" : "Quick contact"} className="fixed inset-x-0 bottom-0 z-40 flex border-t border-brand/10 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_-12px_rgba(20,91,152,.25)] backdrop-blur md:hidden">
      {settings.phone && (
        <a href={`tel:${settings.phone}`} className={`${item} text-brand`}>
          <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z" /></svg>
          {hi ? "कॉल करें" : "Call"}
        </a>
      )}
      {wa && (
        <a href={`https://wa.me/${wa.length === 10 ? "91" + wa : wa}?text=${waText}`} target="_blank" rel="noopener noreferrer" className={`${item} text-[#128C4A]`}>
          <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7a11.4 11.4 0 0 1-4.4-3.9 5 5 0 0 1-1-2.7 2.9 2.9 0 0 1 .9-2.1 1 1 0 0 1 .7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.2-.3.3-.1.6a8.3 8.3 0 0 0 1.5 1.9 7.5 7.5 0 0 0 2.2 1.3c.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3a2.4 2.4 0 0 1-.4 1.3z" /></svg>
          WhatsApp
        </a>
      )}
      <Link href={`/${locale}/admissions/enquiry`} className={`${item} bg-sun text-ink`}>
        <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M4 4h16v12H5.2L4 17.2z" /><path d="M8 9h8M8 12h5" /></svg>
        {hi ? "प्रवेश पूछताछ" : "Enquire"}
      </Link>
    </nav>
  );
}
