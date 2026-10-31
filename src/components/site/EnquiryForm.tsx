"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { enquirySchema, type EnquiryData, type EnquiryInput } from "@/lib/validation/enquiry";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";

type LevelOption = { id: string; label: string; group: string };
type Status = { kind: "idle" } | { kind: "success"; reference: string } | { kind: "error"; message: string };

export function EnquiryForm({ locale, dict, levels }: { locale: Locale; dict: Dictionary["form"]; levels: LevelOption[] }) {
  const sp = useSearchParams();
  const initialLevel = levels.some((l) => l.id === sp.get("level")) ? sp.get("level")! : "";
  const idemKey = useRef<string>("");
  const startedAt = useRef<number>(0);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const statusRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<EnquiryInput, unknown, EnquiryData>({
    resolver: zodResolver(enquirySchema),
    mode: "onBlur",
    defaultValues: { parentName: "", mobile: "", email: "", language: locale, levelId: initialLevel as EnquiryInput["levelId"], contactTime: "any", currentSchool: "", visitInterest: sp.get("visit") === "1", message: "" },
  });

  useEffect(() => {
    idemKey.current = crypto.randomUUID();
    startedAt.current = Date.now();
  }, []);
  useEffect(() => { if (status.kind !== "idle") statusRef.current?.focus(); }, [status]);

  const err = (key?: string) => (key ? (dict.errors as Record<string, string>)[key] ?? dict.errors.required : undefined);

  const onSubmit = async (data: EnquiryData) => {
    setStatus({ kind: "idle" });
    const website = (document.getElementById("website") as HTMLInputElement | null)?.value ?? "";
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, envelope: { idempotencyKey: idemKey.current, startedAt: startedAt.current, website } }),
      });
      const json = (await res.json().catch(() => ({}))) as { reference?: string };
      if (res.ok && json.reference) {
        setStatus({ kind: "success", reference: json.reference });
        return;
      }
      setStatus({ kind: "error", message: res.status === 429 ? dict.errorRate : dict.errorGeneric });
    } catch {
      setStatus({ kind: "error", message: dict.errorGeneric }); // same idempotency key on retry → no duplicates
    }
  };

  if (status.kind === "success") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="card border-[#2AA39A]/40 bg-[#F0FBF9] text-center">
        <p className="text-2xl font-extrabold text-brand-900">{dict.successTitle}</p>
        <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-muted">{dict.successRef}</p>
        <p className="mt-1 select-all font-mono text-3xl font-bold text-brand">{status.reference}</p>
        <p className="mx-auto mt-4 max-w-lg text-muted">{dict.successBody}</p>
        <button type="button" className="btn-ghost mt-6" onClick={() => { reset(); idemKey.current = crypto.randomUUID(); startedAt.current = Date.now(); setStatus({ kind: "idle" }); }}>{dict.another}</button>
      </div>
    );
  }

  const groups = [...new Set(levels.map((l) => l.group))];
  const field = (name: keyof EnquiryInput) => ({ "aria-invalid": errors[name] ? true : undefined, "aria-describedby": errors[name] ? `${name}-error` : undefined });
  const Err = ({ name }: { name: keyof EnquiryInput }) => errors[name] ? <p id={`${name}-error`} className="field-error">{err(errors[name]?.message)}</p> : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="card space-y-5" aria-busy={isSubmitting}>
      <div ref={statusRef} tabIndex={-1} aria-live="assertive">
        {status.kind === "error" && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{status.message}</p>}
      </div>
      {/* Honeypot: hidden from people and assistive tech */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="parentName" className="field-label">{dict.parentName} *</label>
          <input id="parentName" className="field" autoComplete="name" {...register("parentName")} {...field("parentName")} />
          <Err name="parentName" />
        </div>
        <div>
          <label htmlFor="mobile" className="field-label">{dict.mobile} *</label>
          <input id="mobile" className="field" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="98XXXXXXXX" {...register("mobile")} {...field("mobile")} aria-describedby={errors.mobile ? "mobile-error" : "mobile-hint"} />
          <p id="mobile-hint" className="mt-1 text-xs text-muted">{dict.mobileHint}</p>
          <Err name="mobile" />
        </div>
        <div>
          <label htmlFor="email" className="field-label">{dict.email}</label>
          <input id="email" className="field" type="email" autoComplete="email" {...register("email")} {...field("email")} />
          <Err name="email" />
        </div>
        <div>
          <label htmlFor="levelId" className="field-label">{dict.level} *</label>
          <select id="levelId" className="field" {...register("levelId")} {...field("levelId")}>
            <option value="">{dict.levelPlaceholder}</option>
            {groups.map((g) => (
              <optgroup key={g} label={g}>
                {levels.filter((l) => l.group === g).map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
              </optgroup>
            ))}
          </select>
          <Err name="levelId" />
        </div>
        <div>
          <label htmlFor="contactTime" className="field-label">{dict.contactTime}</label>
          <select id="contactTime" className="field" {...register("contactTime")}>
            <option value="any">{dict.any}</option><option value="morning">{dict.morning}</option>
            <option value="afternoon">{dict.afternoon}</option><option value="evening">{dict.evening}</option>
          </select>
        </div>
        <fieldset>
          <legend className="field-label">{dict.language}</legend>
          <div className="flex gap-4">
            <label className="flex min-h-11 items-center gap-2"><input type="radio" value="en" {...register("language")} className="h-5 w-5 accent-brand" />{dict.langEn}</label>
            <label className="flex min-h-11 items-center gap-2"><input type="radio" value="hi" {...register("language")} className="h-5 w-5 accent-brand" />{dict.langHi}</label>
          </div>
        </fieldset>
        <div>
          <label htmlFor="currentSchool" className="field-label">{dict.currentSchool}</label>
          <input id="currentSchool" className="field" autoComplete="off" {...register("currentSchool")} {...field("currentSchool")} />
          <Err name="currentSchool" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="message" className="field-label">{dict.message}</label>
          <textarea id="message" rows={3} className="field" {...register("message")} {...field("message")} />
          <Err name="message" />
        </div>
      </div>

      <label className="flex items-start gap-3"><input type="checkbox" {...register("visitInterest")} className="mt-1 h-5 w-5 accent-brand" />{dict.visit}</label>
      <div>
        <label className="flex items-start gap-3">
          <input type="checkbox" {...register("consent")} {...field("consent")} className="mt-1 h-5 w-5 shrink-0 accent-brand" />
          <span className="text-sm">{dict.consent} <Link href={`/${locale}/data-protection`} className="font-semibold text-brand underline" target="_blank">{dict.privacy}</Link>. *</span>
        </label>
        <Err name="consent" />
      </div>
      <button type="submit" className="btn-sun w-full sm:w-auto" disabled={isSubmitting}>{isSubmitting ? dict.submitting : dict.submit}</button>
    </form>
  );
}
