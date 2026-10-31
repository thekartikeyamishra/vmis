import { L, type Localized } from "@/i18n/config";

/** CBSE Mandatory Public Disclosure (Appendix IX) categories. Verify against the latest CBSE circular. */
export const DISCLOSURE_CATEGORIES: { id: string; name: Localized }[] = [
  { id: "general", name: L("General information", "सामान्य जानकारी") },
  { id: "affiliation", name: L("Affiliation", "संबद्धता") },
  { id: "recognition", name: L("Recognition", "मान्यता") },
  { id: "society-trust", name: L("Society / trust / company registration", "सोसाइटी / ट्रस्ट / कंपनी पंजीकरण") },
  { id: "noc", name: L("No Objection Certificate (where applicable)", "अनापत्ति प्रमाण पत्र (जहाँ लागू)") },
  { id: "building-safety", name: L("Building safety certificate", "भवन सुरक्षा प्रमाण पत्र") },
  { id: "fire-safety", name: L("Fire safety certificate", "अग्नि सुरक्षा प्रमाण पत्र") },
  { id: "water-sanitation", name: L("Water, health and sanitation certificates", "जल, स्वास्थ्य एवं स्वच्छता प्रमाण पत्र") },
  { id: "fee-structure", name: L("Fee structure", "शुल्क संरचना") },
  { id: "academic-calendar", name: L("Annual academic calendar", "वार्षिक शैक्षणिक कैलेंडर") },
  { id: "smc", name: L("School Management Committee", "विद्यालय प्रबंधन समिति") },
  { id: "pta", name: L("Parent Teacher Association", "अभिभावक शिक्षक संघ") },
  { id: "staff", name: L("Teaching staff and qualifications", "शिक्षक एवं योग्यताएँ") },
  { id: "enrolment", name: L("Student enrolment", "विद्यार्थी नामांकन") },
  { id: "infrastructure", name: L("School infrastructure", "विद्यालय अवसंरचना") },
  { id: "annual-report", name: L("Annual report", "वार्षिक प्रतिवेदन") },
  { id: "other", name: L("Other required disclosures", "अन्य आवश्यक प्रकटीकरण") },
];

export const isDisclosureCategory = (id: string) => DISCLOSURE_CATEGORIES.some((c) => c.id === id);
