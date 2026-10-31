import { L, type Localized } from "@/i18n/config";

/**
 * SINGLE SOURCE OF TRUTH for all 12 academic levels.
 * Used by: homepage, academics, class pages, admissions, enquiry form + server validation,
 * admin, analytics, search, FAQs, sitemap and structured data.
 * Display order / availability / eligibility can be overridden from Admin → Academic levels
 * (Firestore `academic_levels`). Nursery/Prep order must be confirmed by the school.
 */
export type StageId = "early-years" | "primary" | "upper-primary";

export const LEVEL_IDS = [
  "nursery", "prep", "lkg", "ukg",
  "class-1", "class-2", "class-3", "class-4", "class-5",
  "class-6", "class-7", "class-8",
] as const;
export type LevelId = (typeof LEVEL_IDS)[number];

export interface AcademicLevel {
  id: LevelId;
  order: number;
  stage: StageId;
  name: Localized;
  short: Localized;
  summary: Localized;
  focus: Localized<string[]>;
  /** School-approved values; null = not yet confirmed (never invent). */
  eligibility: Localized<string | null>;
  admissionOpen: boolean | null;
  published: boolean;
}

const lv = (
  id: LevelId, order: number, stage: StageId, name: Localized, short: Localized,
  summary: Localized, focusEn: string[], focusHi: string[],
): AcademicLevel => ({
  id, order, stage, name, short, summary,
  focus: { en: focusEn, hi: focusHi },
  eligibility: { en: null, hi: null },
  admissionOpen: null,
  published: true,
});

export const DEFAULT_LEVELS: AcademicLevel[] = [
  lv("nursery", 1, "early-years", L("Nursery", "नर्सरी"), L("Nursery", "नर्सरी"),
    L("A gentle first step into a caring learning environment through play, rhymes, colours and stories.",
      "खेल, कविताओं, रंगों और कहानियों के माध्यम से एक स्नेहपूर्ण सीखने के वातावरण में पहला सहज कदम।"),
    ["Early language exposure", "Sensory exploration and play", "Colours, shapes, music and rhymes", "Storytelling", "Fine and gross motor development", "Social and emotional development", "Familiarisation with a learning environment"],
    ["प्रारंभिक भाषा अनुभव", "संवेदी अन्वेषण और खेल", "रंग, आकृतियाँ, संगीत और कविताएँ", "कहानी सुनना-सुनाना", "सूक्ष्म और स्थूल गतिक विकास", "सामाजिक और भावनात्मक विकास", "सीखने के वातावरण से परिचय"]),
  lv("prep", 2, "early-years", L("Prep", "प्रेप"), L("Prep", "प्रेप"),
    L("Building school readiness, communication and confidence through creative, hands-on activities.",
      "रचनात्मक और व्यावहारिक गतिविधियों से विद्यालय-तत्परता, संवाद और आत्मविश्वास का विकास।"),
    ["School readiness", "Communication and listening", "Storytelling", "Early literacy and numeracy", "Pattern recognition", "Creative activities", "Motor coordination", "Social confidence and independent participation"],
    ["विद्यालय-तत्परता", "संवाद और सुनने का कौशल", "कहानी सुनना-सुनाना", "प्रारंभिक साक्षरता और संख्या ज्ञान", "पैटर्न पहचानना", "रचनात्मक गतिविधियाँ", "गतिक समन्वय", "सामाजिक आत्मविश्वास और स्वतंत्र भागीदारी"]),
  lv("lkg", 3, "early-years", L("LKG", "एल.के.जी."), L("LKG", "एल.के.जी."),
    L("Developing language, early reading readiness, numbers and creative expression.",
      "भाषा, प्रारंभिक पठन-तत्परता, संख्याओं और रचनात्मक अभिव्यक्ति का विकास।"),
    ["Language development", "Early reading readiness", "Letter recognition and sound awareness", "Numbers and counting", "Shapes and patterns", "Environmental awareness", "Creative expression", "Hand–eye coordination and social interaction"],
    ["भाषा विकास", "प्रारंभिक पठन-तत्परता", "अक्षर पहचान और ध्वनि जागरूकता", "संख्याएँ और गिनती", "आकृतियाँ और पैटर्न", "पर्यावरण जागरूकता", "रचनात्मक अभिव्यक्ति", "हाथ-आँख समन्वय और सामाजिक मेलजोल"]),
  lv("ukg", 4, "early-years", L("UKG", "यू.के.जी."), L("UKG", "यू.के.जी."),
    L("Preparing children for Class I with foundational literacy, numeracy and independent thinking.",
      "आधारभूत साक्षरता, संख्या ज्ञान और स्वतंत्र चिंतन के साथ कक्षा 1 की तैयारी।"),
    ["School readiness for Class I", "Foundational literacy and numeracy", "Listening and speaking", "Early writing readiness", "Mathematical reasoning and problem-solving", "Creative thinking", "Independence and collaborative learning"],
    ["कक्षा 1 के लिए तत्परता", "आधारभूत साक्षरता और संख्या ज्ञान", "सुनना और बोलना", "प्रारंभिक लेखन-तत्परता", "गणितीय तर्क और समस्या-समाधान", "रचनात्मक चिंतन", "स्वावलंबन और सहयोगात्मक अधिगम"]),
  ...([1, 2, 3, 4, 5] as const).map((n, i) => {
    const roman = ["I", "II", "III", "IV", "V"][i]!;
    const foundational = n <= 2;
    return lv(`class-${n}` as LevelId, 4 + n, "primary", L(`Class ${roman}`, `कक्षा ${n}`), L(roman, `${n}`),
      foundational
        ? L("Strengthening foundational literacy and numeracy through activity-based, joyful learning.",
            "गतिविधि-आधारित, आनंदपूर्ण अधिगम से आधारभूत साक्षरता और संख्या ज्ञान को सुदृढ़ करना।")
        : L("Building confident readers, writers and thinkers through discovery and activity-based learning.",
            "खोज और गतिविधि-आधारित अधिगम से आत्मविश्वासी पाठक, लेखक और विचारक तैयार करना।"),
      foundational
        ? ["Reading and writing", "Foundational numeracy", "Language development", "Environmental awareness", "Communication and creativity", "Learning through activities"]
        : ["Reading, writing and speaking", "Mathematics", "Languages", "Environmental studies and science concepts", "Art and physical education", "Problem-solving and collaboration"],
      foundational
        ? ["पढ़ना और लिखना", "आधारभूत संख्या ज्ञान", "भाषा विकास", "पर्यावरण जागरूकता", "संवाद और रचनात्मकता", "गतिविधियों से सीखना"]
        : ["पढ़ना, लिखना और बोलना", "गणित", "भाषाएँ", "पर्यावरण अध्ययन और विज्ञान अवधारणाएँ", "कला और शारीरिक शिक्षा", "समस्या-समाधान और सहयोग"]);
  }),
  ...([6, 7, 8] as const).map((n, i) => {
    const roman = ["VI", "VII", "VIII"][i]!;
    return lv(`class-${n}` as LevelId, 4 + n, "upper-primary", L(`Class ${roman}`, `कक्षा ${n}`), L(roman, `${n}`),
      L("Subject-based learning with conceptual clarity, experiential projects and critical thinking.",
        "वैचारिक स्पष्टता, अनुभवात्मक परियोजनाओं और आलोचनात्मक चिंतन के साथ विषय-आधारित अधिगम।"),
      ["Mathematics", "Science", "Social Science", "Languages", "Art and physical education", "Project-based and experiential learning", "Critical thinking and communication"],
      ["गणित", "विज्ञान", "सामाजिक विज्ञान", "भाषाएँ", "कला और शारीरिक शिक्षा", "परियोजना-आधारित और अनुभवात्मक अधिगम", "आलोचनात्मक चिंतन और संवाद"]);
  }),
];

export function sortLevels(levels: AcademicLevel[]): AcademicLevel[] {
  return [...levels].sort((a, b) => a.order - b.order);
}

export function isLevelId(v: string): v is LevelId {
  return (LEVEL_IDS as readonly string[]).includes(v);
}

export const STAGES: { id: StageId; name: Localized; range: Localized; tagline: Localized; intro: Localized; tone: string }[] = [
  {
    id: "early-years",
    name: L("Early Years", "प्रारंभिक वर्ष"),
    range: L("Nursery · Prep · LKG · UKG", "नर्सरी · प्रेप · एल.के.जी. · यू.के.जी."),
    tagline: L("Play, wonder and gentle beginnings", "खेल, जिज्ञासा और सहज शुरुआत"),
    intro: L(
      "A warm, child-centred start where children learn through play, stories, music, art and exploration — never through pressure.",
      "एक स्नेहपूर्ण, बाल-केंद्रित शुरुआत जहाँ बच्चे खेल, कहानियों, संगीत, कला और अन्वेषण से सीखते हैं — दबाव से कभी नहीं।",
    ),
    tone: "pink",
  },
  {
    id: "primary",
    name: L("Primary", "प्राथमिक"),
    range: L("Classes I – V", "कक्षा 1 – 5"),
    tagline: L("Strong foundations, curious minds", "मज़बूत नींव, जिज्ञासु मन"),
    intro: L(
      "Foundational literacy and numeracy grow into confident reading, writing, mathematics and discovery-based learning.",
      "आधारभूत साक्षरता और संख्या ज्ञान आत्मविश्वासपूर्ण पठन, लेखन, गणित और खोज-आधारित अधिगम में विकसित होते हैं।",
    ),
    tone: "sky",
  },
  {
    id: "upper-primary",
    name: L("Upper Primary", "उच्च प्राथमिक"),
    range: L("Classes VI – VIII", "कक्षा 6 – 8"),
    tagline: L("Concepts, inquiry and confidence", "अवधारणाएँ, जिज्ञासा और आत्मविश्वास"),
    intro: L(
      "Subject-based learning with conceptual clarity, experiments, projects and critical thinking prepares students for higher classes.",
      "वैचारिक स्पष्टता, प्रयोगों, परियोजनाओं और आलोचनात्मक चिंतन के साथ विषय-आधारित अधिगम विद्यार्थियों को आगे की कक्षाओं के लिए तैयार करता है।",
    ),
    tone: "blue",
  },
];

export function isStageId(v: string): v is StageId {
  return STAGES.some((s) => s.id === v);
}
