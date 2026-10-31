import "../globals.css";
import Image from "next/image";
import { OFFICIAL } from "@/content/school";

export const metadata = { title: `Maintenance — ${OFFICIAL.acronym}`, robots: { index: false } };

export default function Maintenance() {
  return (
    <main className="grid min-h-screen place-items-center bg-bg p-6 text-center">
      <div>
        <Image src="/brand/vmis-logo-256.webp" alt={OFFICIAL.nameEn} width={120} height={120} className="mx-auto rounded-full" priority />
        <h1 className="mt-6 text-3xl font-extrabold">We’ll be back shortly</h1>
        <p lang="hi" className="mt-2 text-xl font-semibold">वेबसाइट का रखरखाव चल रहा है — शीघ्र उपलब्ध होगी।</p>
        <p className="mt-4 text-muted">{OFFICIAL.nameEn} · <span lang="hi">{OFFICIAL.nameHi}</span></p>
      </div>
    </main>
  );
}
