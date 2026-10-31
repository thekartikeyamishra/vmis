import { z } from "zod";
import { LEVEL_IDS } from "@/content/levels";

/** Normalises Indian mobile input ("+91 98765-43210", "098765 43210") to 10 digits, or returns null. */
export function normalizeIndianMobile(input: string): string | null {
  let d = input.replace(/[^\d]/g, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  else if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  return /^[6-9]\d{9}$/.test(d) ? d : null;
}

const clean = (s: string) => s.replace(/[\u0000-\u001F\u007F<>]/g, "").replace(/\s+/g, " ").trim();
const optionalText = (max: number) =>
  z.string().max(max, "tooLong").transform(clean).optional().or(z.literal("").transform(() => undefined));

export const CONTACT_TIMES = ["morning", "afternoon", "evening", "any"] as const;

export const enquirySchema = z.object({
  parentName: z.string().transform(clean).pipe(z.string().min(2, "name").max(80, "name")),
  mobile: z.string().max(20, "mobile").refine((v) => normalizeIndianMobile(v) !== null, "mobile"),
  email: z.string().trim().max(120, "email").email("email").optional().or(z.literal("")),
  language: z.enum(["en", "hi"]),
  levelId: z.enum(LEVEL_IDS, { message: "level" }),
  contactTime: z.enum(CONTACT_TIMES),
  currentSchool: optionalText(120),
  visitInterest: z.boolean(),
  message: optionalText(600),
  consent: z.literal(true, { message: "consent" }),
});

export type EnquiryInput = z.input<typeof enquirySchema>;
export type EnquiryData = z.output<typeof enquirySchema>;

/** Anti-spam envelope sent alongside the form (not shown to users). */
export const envelopeSchema = z.object({
  idempotencyKey: z.string().uuid(),
  startedAt: z.number().int().positive(),
  website: z.string().max(0).optional().or(z.literal("")), // honeypot — must stay empty
});

export const ENQUIRY_STATUSES = ["new", "contacted", "visit_scheduled", "visited", "application_issued", "admitted", "not_interested", "closed"] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];
