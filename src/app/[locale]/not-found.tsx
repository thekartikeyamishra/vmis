import Link from "next/link";
import { EmptyArt } from "@/components/art/Art";

// Rendered inside the locale layout; bilingual so it works for /en and /hi.
export default function NotFound() {
  return (
    <section className="container-x flex flex-col items-center py-24 text-center">
      <EmptyArt className="h-40 w-auto" />
      <h1 className="mt-6 text-3xl font-extrabold">Page not found · <span lang="hi">पृष्ठ नहीं मिला</span></h1>
      <p className="mt-3 max-w-xl text-muted">The page you are looking for does not exist or has moved. <span lang="hi">आप जिस पृष्ठ को खोज रहे हैं वह उपलब्ध नहीं है।</span></p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/en" className="btn-primary">Home</Link>
        <Link href="/hi" className="btn-ghost" lang="hi">मुखपृष्ठ</Link>
      </div>
    </section>
  );
}
