import { describe, expect, it } from "vitest";
import { enquirySchema, normalizeIndianMobile } from "@/lib/validation/enquiry";
import { LEVEL_IDS } from "@/content/levels";

const base = { parentName: "Ramesh Kumar", mobile: "9876543210", email: "", language: "hi", levelId: "nursery", contactTime: "any", currentSchool: "", visitInterest: false, message: "", consent: true };

describe("enquiry validation", () => {
  it.each([["9876543210", "9876543210"], ["+91 98765 43210", "9876543210"], ["098765-43210", "9876543210"], ["919876543210", "9876543210"], ["5876543210", null], ["12345", null]])("normalises %s", (input, out) => {
    expect(normalizeIndianMobile(input)).toBe(out);
  });
  it("accepts all 12 levels", () => {
    for (const levelId of LEVEL_IDS) expect(enquirySchema.safeParse({ ...base, levelId }).success).toBe(true);
  });
  it("rejects unknown levels, missing consent and bad email", () => {
    expect(enquirySchema.safeParse({ ...base, levelId: "class-9" }).success).toBe(false);
    expect(enquirySchema.safeParse({ ...base, consent: false }).success).toBe(false);
    expect(enquirySchema.safeParse({ ...base, email: "nope" }).success).toBe(false);
  });
  it("strips markup/control characters from free text", () => {
    const r = enquirySchema.parse({ ...base, parentName: "  <b>Sita</b>\u0000 Devi ", message: "hello <script>" });
    expect(r.parentName).toBe("bSita/b Devi");
    expect(r.message).toBe("hello script");
  });
  it("rejects overly long input", () => {
    expect(enquirySchema.safeParse({ ...base, message: "x".repeat(601) }).success).toBe(false);
  });
});
