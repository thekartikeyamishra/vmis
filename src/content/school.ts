/**
 * OFFICIAL SCHOOL IDENTITY — authoritative, do not machine-translate.
 * Everything else marked `null` is an editable placeholder that the school must supply
 * (via Admin → School settings). The website renders "To be confirmed" instead of inventing values.
 */
export const OFFICIAL = {
  nameEn: "Dr. VedPati Mishra Institute Of Scholars",
  nameHi: "डॉ. वेदपति मिश्र इंस्टीट्यूट ऑफ स्कॉलर्स",
  acronym: "VMIS",
  motto: "तत्वमसि",
  locality: "Handia",
  city: "Prayagraj",
  region: "Uttar Pradesh",
  country: "IN",
  logo: "/brand/vmis-logo-original.jpg",
} as const;

export type AffiliationStatus = "not_verified" | "applied" | "provisional" | "regular" | "not_affiliated";

export interface SchoolSettings {
  addressEn: string | null;
  addressHi: string | null;
  postalCode: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  officeHoursEn: string | null;
  officeHoursHi: string | null;
  schoolTimingsEn: string | null;
  schoolTimingsHi: string | null;
  mapUrl: string | null;
  academicSession: string | null;
  admissionsOpen: boolean;
  principalName: string | null;
  principalMessageEn: string | null;
  principalMessageHi: string | null;
  feeNoteEn: string | null;
  feeNoteHi: string | null;
  transportAvailable: boolean | null;
  affiliation: {
    status: AffiliationStatus;
    affiliationNumber: string | null;
    schoolCode: string | null;
    category: string | null;
    validUntil: string | null;
    verifiedOn: string | null;
  };
  playStoreUrl: string | null;
  appStoreUrl: string | null;
  social: { facebook: string | null; instagram: string | null; youtube: string | null };
}

export const DEFAULT_SETTINGS: SchoolSettings = {
  addressEn: null,
  addressHi: null,
  postalCode: null,
  phone: null,
  whatsapp: null,
  email: null,
  officeHoursEn: null,
  officeHoursHi: null,
  schoolTimingsEn: null,
  schoolTimingsHi: null,
  mapUrl: null,
  academicSession: null,
  admissionsOpen: true,
  principalName: null,
  principalMessageEn: null,
  principalMessageHi: null,
  feeNoteEn: null,
  feeNoteHi: null,
  transportAvailable: null,
  affiliation: {
    status: "not_verified",
    affiliationNumber: null,
    schoolCode: null,
    category: null,
    validUntil: null,
    verifiedOn: null,
  },
  playStoreUrl: null,
  appStoreUrl: null,
  social: { facebook: null, instagram: null, youtube: null },
};
