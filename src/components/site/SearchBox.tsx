"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";

export type SearchItem = { title: string; text: string; href: string; kind: string };

const norm = (s: string) => s.toLowerCase().normalize("NFC");

export function SearchBox({ items, labels }: { items: SearchItem[]; labels: { placeholder: string; empty: string; label: string } }) {
  const [q, setQ] = useState("");
  const dq = useDeferredValue(q);
  const results = useMemo(() => {
    const terms = norm(dq).split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    return items
      .map((it) => {
        const title = norm(it.title), body = norm(it.text);
        let score = 0;
        for (const t of terms) {
          if (title.includes(t)) score += 5;
          else if (body.includes(t)) score += 1;
          else return null;
        }
        return { it, score };
      })
      .filter((x): x is { it: SearchItem; score: number } => !!x)
      .sort((a, b) => b.score - a.score)
      .slice(0, 25);
  }, [dq, items]);

  return (
    <div role="search">
      <label htmlFor="site-search" className="sr-only">{labels.label}</label>
      <input id="site-search" type="search" className="field !min-h-14 !text-lg" placeholder={labels.placeholder} value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" autoFocus />
      <div aria-live="polite" className="mt-6">
        {q && results.length === 0 && <p className="text-muted">{labels.empty}</p>}
        <ul className="space-y-3">
          {results.map(({ it }) => (
            <li key={it.href + it.title}>
              <Link href={it.href} className="card block !p-4 hover:border-brand/40">
                {it.kind && <span className="text-xs font-bold uppercase text-sun-700">{it.kind}</span>}
                <span className="block font-bold text-brand-900">{it.title}</span>
                {it.text && <span className="mt-1 line-clamp-2 block text-sm text-muted">{it.text}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
