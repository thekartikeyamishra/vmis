import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource/noto-sans-devanagari/400.css";
import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { EmptyArt } from "@/components/art/Art";

export const metadata: Metadata = { title: "Page not found · पृष्ठ नहीं मिला | VMIS", robots: { index: false } };

export default function GlobalNotFound() {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <main className="container-x flex min-h-screen flex-col items-center justify-center py-16 text-center">
          <EmptyArt className="h-40 w-auto" />
          <h1 className="mt-6 text-3xl font-extrabold">Page not found · <span lang="hi">पृष्ठ नहीं मिला</span></h1>
          <p className="mt-3 max-w-xl text-muted">The page you are looking for does not exist or has moved. <span lang="hi">आप जिस पृष्ठ को खोज रहे हैं वह उपलब्ध नहीं है।</span></p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/en" className="btn-primary">Home</Link>
            <Link href="/hi" className="btn-ghost" lang="hi">मुखपृष्ठ</Link>
          </div>
        </main>
      </body>
    </html>
  );
}
