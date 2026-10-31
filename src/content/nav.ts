import { L, type Localized } from "@/i18n/config";

export interface NavItem { label: Localized; path: string }
export interface NavGroup { key: string; label: Localized; items: NavItem[] }

export const NAV: NavGroup[] = [
  { key: "about", label: L("About", "परिचय"), items: [
    { label: L("About VMIS", "वी.एम.आई.एस. परिचय"), path: "/about" },
    { label: L("Vision and Mission", "दृष्टि और ध्येय"), path: "/vision-mission" },
    { label: L("Leadership", "नेतृत्व"), path: "/leadership" },
    { label: L("Principal’s Message", "प्रधानाचार्य का संदेश"), path: "/principal-message" },
  ] },
  { key: "academics", label: L("Academics", "शिक्षा"), items: [
    { label: L("Academic Journey", "शैक्षिक यात्रा"), path: "/academics" },
    { label: L("Early Years (Nursery–UKG)", "प्रारंभिक वर्ष (नर्सरी–यू.के.जी.)"), path: "/academics/early-years" },
    { label: L("Primary (Classes I–V)", "प्राथमिक (कक्षा 1–5)"), path: "/academics/primary" },
    { label: L("Upper Primary (Classes VI–VIII)", "उच्च प्राथमिक (कक्षा 6–8)"), path: "/academics/upper-primary" },
    { label: L("Teaching and Learning", "शिक्षण और अधिगम"), path: "/teaching-learning" },
  ] },
  { key: "cbse", label: L("CBSE & Curriculum", "सीबीएसई व पाठ्यक्रम"), items: [
    { label: L("CBSE Educational Approach", "सीबीएसई शैक्षिक दृष्टिकोण"), path: "/cbse-approach" },
    { label: L("Curriculum", "पाठ्यक्रम"), path: "/curriculum" },
    { label: L("Assessment", "मूल्यांकन"), path: "/assessment" },
    { label: L("SAFAL", "सफल (SAFAL)"), path: "/safal" },
  ] },
  { key: "admissions", label: L("Admissions", "प्रवेश"), items: [
    { label: L("Admissions Overview", "प्रवेश जानकारी"), path: "/admissions" },
    { label: L("Admission Process", "प्रवेश प्रक्रिया"), path: "/admission-process" },
    { label: L("Eligibility", "पात्रता"), path: "/eligibility" },
    { label: L("Required Documents", "आवश्यक दस्तावेज़"), path: "/documents-required" },
    { label: L("Fee Information", "शुल्क जानकारी"), path: "/fees" },
    { label: L("Admission Enquiry", "प्रवेश पूछताछ"), path: "/admissions/enquiry" },
    { label: L("School Visit", "विद्यालय भ्रमण"), path: "/school-visit" },
    { label: L("Starting School (Early Years)", "विद्यालय की शुरुआत (प्रारंभिक वर्ष)"), path: "/early-years-transition" },
  ] },
  { key: "campus", label: L("Campus Life", "विद्यालय जीवन"), items: [
    { label: L("Student Development", "विद्यार्थी विकास"), path: "/student-development" },
    { label: L("Facilities", "सुविधाएँ"), path: "/facilities" },
    { label: L("Sports and Activities", "खेल और गतिविधियाँ"), path: "/sports-activities" },
    { label: L("News", "समाचार"), path: "/news" },
    { label: L("Events", "कार्यक्रम"), path: "/events" },
    { label: L("Gallery", "चित्र दीर्घा"), path: "/gallery" },
  ] },
];

export const FOOTER_POLICIES: NavItem[] = [
  { label: L("Privacy Policy", "गोपनीयता नीति"), path: "/privacy-policy" },
  { label: L("Data Protection Notice", "डेटा संरक्षण सूचना"), path: "/data-protection" },
  { label: L("Terms and Conditions", "नियम और शर्तें"), path: "/terms" },
  { label: L("Child Safety Policy", "बाल सुरक्षा नीति"), path: "/child-safety" },
  { label: L("Photo and Media Consent", "फ़ोटो एवं मीडिया सहमति"), path: "/media-consent" },
  { label: L("Accessibility", "सुगम्यता"), path: "/accessibility" },
];

export const FOOTER_QUICK: NavItem[] = [
  { label: L("Admission Enquiry", "प्रवेश पूछताछ"), path: "/admissions/enquiry" },
  { label: L("Mandatory Public Disclosure", "अनिवार्य सार्वजनिक प्रकटीकरण"), path: "/public-disclosure" },
  { label: L("FAQs", "प्रश्नोत्तर"), path: "/faqs" },
  { label: L("Digital Services", "डिजिटल सेवाएँ"), path: "/digital-services" },
  { label: L("Contact", "संपर्क"), path: "/contact" },
  { label: L("Search", "खोजें"), path: "/search" },
];
