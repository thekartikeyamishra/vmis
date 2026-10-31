"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="container-x py-24 text-center">
      <h1 className="text-3xl font-extrabold">Something went wrong · <span lang="hi">कुछ गड़बड़ हुई</span></h1>
      <p className="mt-3 text-muted">Please try again. <span lang="hi">कृपया पुनः प्रयास करें।</span></p>
      <button type="button" onClick={reset} className="btn-primary mt-8">Try again / पुनः प्रयास</button>
    </section>
  );
}
