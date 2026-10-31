import type { Locale } from "./config";

const en = {
  skip: "Skip to main content",
  nav: {
    home: "Home", about: "About", academics: "Academics", admissions: "Admissions", cbse: "CBSE & Curriculum",
    campus: "Campus Life", updates: "Updates", disclosure: "Public Disclosure", contact: "Contact", search: "Search",
    menu: "Menu", close: "Close", enquire: "Enquire Now",
  },
  common: {
    learnMore: "Learn more", enquire: "Enquire for admission", tbc: "To be confirmed by the school",
    pendingTitle: "Information pending school confirmation",
    pendingBody: "This section will be completed once the school administration approves the official details. We never publish unverified information.",
    illustration: "Illustration", backHome: "Back to home", home: "Home", allLevels: "All levels",
    eligibility: "Age eligibility", availability: "Admission availability", open: "Admissions open", closed: "Not currently open",
    focus: "Educational focus", comingSoon: "Coming soon", download: "Download", none: "Nothing published yet.",
    readMore: "Read more", stage: "Stage", officialRef: "Official reference",
  },
  hero: {
    eyebrow: "CBSE-oriented school · Nursery to Class VIII · Handia, Prayagraj",
    title: "Where Every Little Beginning Leads to a World of Possibilities.",
    subtitle: "From the first steps of early learning to the confidence of middle-school education, discover a journey built around curiosity, knowledge and growth.",
    cta1: "Explore Admissions", cta2: "Discover VMIS", cta3: "Schedule a School Visit",
  },
  home: {
    introTitle: "Welcome to VMIS",
    introBody: "Dr. VedPati Mishra Institute Of Scholars is a CBSE-oriented school in Handia, Prayagraj, offering a continuous learning journey from Nursery to Class VIII in a caring, disciplined and joyful environment.",
    mottoTitle: "Our motto — तत्वमसि",
    mottoBody: "An ancient Upanishadic phrase often rendered as “That thou art”. It reminds us that every child carries immense potential — our role is to help each learner discover it.",
    journeyTitle: "The academic journey", journeySub: "Twelve levels, three stages, one continuous path.",
    whyTitle: "Why parents explore VMIS",
    why: [
      ["A complete journey", "Nursery to Class VIII under one roof, with consistent values and care."],
      ["Child-centred early years", "Play-based, activity-led learning for our youngest children."],
      ["Concept-first teaching", "Understanding, application and curiosity over rote memorisation."],
      ["Bilingual communication", "Information for parents in both English and Hindi."],
      ["Transparent admissions", "Clear process, documents and fee information published by the school."],
      ["Safety and wellbeing", "Child safety and data protection built into how we work."],
    ] as [string, string][],
    processTitle: "Admission in five simple steps",
    process: ["Explore the class levels", "Check eligibility & documents", "Submit an enquiry", "Receive your reference number", "The school contacts you / campus visit"],
    admissionsOpenTitle: "Admissions open", admissionsOpenBody: "Enquiries are welcome for Nursery to Class VIII. Submitting an enquiry does not confirm admission — the school will contact you with next steps.",
    principalTitle: "Principal’s message", newsTitle: "News & events", faqTitle: "Frequently asked questions",
    disclosureTitle: "Mandatory Public Disclosure", disclosureBody: "Statutory documents and school information, published by the school administration.",
    contactTitle: "Visit or contact us",
  },
  form: {
    title: "Admission enquiry", intro: "Share a few details and the admissions team will contact you. Fields marked * are required.",
    parentName: "Parent / guardian name", mobile: "Mobile number", mobileHint: "10-digit Indian mobile number",
    email: "Email (optional)", language: "Preferred language", langEn: "English", langHi: "Hindi",
    level: "Class sought", levelPlaceholder: "Select a class", contactTime: "Preferred contact time",
    morning: "Morning (9–12)", afternoon: "Afternoon (12–4)", evening: "Evening (4–7)", any: "Any time",
    currentSchool: "Current school (optional)", visit: "I would like to schedule a school visit",
    message: "Message (optional)", consent: "I am the parent/guardian and I agree that VMIS may store and use these details only to respond to this admission enquiry, as described in the",
    privacy: "Data Protection Notice", submit: "Submit enquiry", submitting: "Submitting…",
    successTitle: "Thank you — your enquiry has been received.", successRef: "Your reference number",
    successBody: "Please keep this number for future communication. The admissions team will contact you. An enquiry does not confirm admission.",
    another: "Submit another enquiry", errorGeneric: "We could not submit your enquiry. Please try again in a moment.",
    errorRate: "Too many attempts. Please wait a few minutes and try again.", retry: "Try again",
    errors: {
      required: "This field is required.", name: "Please enter a valid name (2–80 characters).", mobile: "Enter a valid 10-digit Indian mobile number.",
      email: "Enter a valid email address.", level: "Please select a class.", consent: "Please confirm consent to continue.", tooLong: "This text is too long.",
    },
  },
  footer: {
    quick: "Quick links", policies: "Policies", apps: "Mobile apps", rights: "All rights reserved.",
    illustrationNote: "Illustrations on this website are artwork, not photographs of the school.",
  },
  search: { title: "Search", placeholder: "Search pages, classes, FAQs…", empty: "No results. Try another word.", label: "Search the website" },
  notFound: { title: "Page not found", body: "The page you are looking for does not exist or has moved." },
};

type Dict = typeof en;

const hi: Dict = {
  skip: "मुख्य सामग्री पर जाएँ",
  nav: {
    home: "मुखपृष्ठ", about: "परिचय", academics: "शिक्षा", admissions: "प्रवेश", cbse: "सीबीएसई व पाठ्यक्रम",
    campus: "विद्यालय जीवन", updates: "सूचनाएँ", disclosure: "सार्वजनिक प्रकटीकरण", contact: "संपर्क", search: "खोजें",
    menu: "मेनू", close: "बंद करें", enquire: "पूछताछ करें",
  },
  common: {
    learnMore: "और जानें", enquire: "प्रवेश हेतु पूछताछ", tbc: "विद्यालय द्वारा पुष्टि होनी है",
    pendingTitle: "जानकारी विद्यालय की पुष्टि हेतु लंबित",
    pendingBody: "विद्यालय प्रशासन द्वारा आधिकारिक विवरण स्वीकृत होने पर यह भाग पूरा किया जाएगा। हम कभी भी असत्यापित जानकारी प्रकाशित नहीं करते।",
    illustration: "चित्रांकन", backHome: "मुखपृष्ठ पर लौटें", home: "मुखपृष्ठ", allLevels: "सभी कक्षाएँ",
    eligibility: "आयु पात्रता", availability: "प्रवेश उपलब्धता", open: "प्रवेश खुले हैं", closed: "अभी प्रवेश बंद",
    focus: "शैक्षिक केंद्र-बिंदु", comingSoon: "शीघ्र उपलब्ध", download: "डाउनलोड", none: "अभी कुछ प्रकाशित नहीं है।",
    readMore: "आगे पढ़ें", stage: "चरण", officialRef: "आधिकारिक संदर्भ",
  },
  hero: {
    eyebrow: "सीबीएसई-उन्मुख विद्यालय · नर्सरी से कक्षा 8 · हंडिया, प्रयागराज",
    title: "जहाँ हर छोटी शुरुआत संभावनाओं के संसार तक ले जाती है।",
    subtitle: "प्रारंभिक शिक्षा के पहले कदम से लेकर माध्यमिक कक्षाओं के आत्मविश्वास तक — जिज्ञासा, ज्ञान और विकास पर आधारित एक यात्रा।",
    cta1: "प्रवेश जानकारी", cta2: "वी.एम.आई.एस. को जानें", cta3: "विद्यालय भ्रमण तय करें",
  },
  home: {
    introTitle: "वी.एम.आई.एस. में आपका स्वागत है",
    introBody: "डॉ. वेदपति मिश्र इंस्टीट्यूट ऑफ स्कॉलर्स हंडिया, प्रयागराज स्थित एक सीबीएसई-उन्मुख विद्यालय है, जो स्नेहपूर्ण, अनुशासित और आनंदमय वातावरण में नर्सरी से कक्षा 8 तक निरंतर शिक्षा प्रदान करता है।",
    mottoTitle: "हमारा ध्येय वाक्य — तत्वमसि",
    mottoBody: "उपनिषदों का महावाक्य, जिसका अर्थ है “वह तुम हो”। यह स्मरण कराता है कि हर बच्चे में अपार संभावनाएँ हैं — हमारा कार्य हर विद्यार्थी को उन्हें खोजने में सहायता करना है।",
    journeyTitle: "शैक्षिक यात्रा", journeySub: "बारह कक्षाएँ, तीन चरण, एक निरंतर पथ।",
    whyTitle: "अभिभावक वी.एम.आई.एस. को क्यों चुनते हैं",
    why: [
      ["संपूर्ण यात्रा", "एक ही परिसर में नर्सरी से कक्षा 8 तक, समान मूल्यों और देखभाल के साथ।"],
      ["बाल-केंद्रित प्रारंभिक वर्ष", "छोटे बच्चों के लिए खेल और गतिविधि-आधारित अधिगम।"],
      ["अवधारणा-प्रथम शिक्षण", "रटने के स्थान पर समझ, अनुप्रयोग और जिज्ञासा।"],
      ["द्विभाषी संवाद", "अभिभावकों के लिए अंग्रेज़ी और हिंदी दोनों में जानकारी।"],
      ["पारदर्शी प्रवेश", "विद्यालय द्वारा प्रकाशित स्पष्ट प्रक्रिया, दस्तावेज़ और शुल्क जानकारी।"],
      ["सुरक्षा और कल्याण", "बाल सुरक्षा और डेटा संरक्षण हमारी कार्यप्रणाली का हिस्सा।"],
    ],
    processTitle: "पाँच सरल चरणों में प्रवेश",
    process: ["कक्षाओं की जानकारी देखें", "पात्रता व दस्तावेज़ जाँचें", "पूछताछ भेजें", "संदर्भ संख्या प्राप्त करें", "विद्यालय संपर्क करेगा / परिसर भ्रमण"],
    admissionsOpenTitle: "प्रवेश खुले हैं", admissionsOpenBody: "नर्सरी से कक्षा 8 तक के लिए पूछताछ आमंत्रित है। पूछताछ भेजने से प्रवेश सुनिश्चित नहीं होता — विद्यालय आगे की प्रक्रिया हेतु संपर्क करेगा।",
    principalTitle: "प्रधानाचार्य का संदेश", newsTitle: "समाचार व कार्यक्रम", faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
    disclosureTitle: "अनिवार्य सार्वजनिक प्रकटीकरण", disclosureBody: "विद्यालय प्रशासन द्वारा प्रकाशित वैधानिक दस्तावेज़ और विद्यालय जानकारी।",
    contactTitle: "हमसे मिलें या संपर्क करें",
  },
  form: {
    title: "प्रवेश पूछताछ", intro: "कुछ विवरण साझा करें, प्रवेश टीम आपसे संपर्क करेगी। * चिह्नित फ़ील्ड अनिवार्य हैं।",
    parentName: "अभिभावक का नाम", mobile: "मोबाइल नंबर", mobileHint: "10 अंकों का भारतीय मोबाइल नंबर",
    email: "ईमेल (वैकल्पिक)", language: "पसंदीदा भाषा", langEn: "अंग्रेज़ी", langHi: "हिंदी",
    level: "वांछित कक्षा", levelPlaceholder: "कक्षा चुनें", contactTime: "संपर्क का पसंदीदा समय",
    morning: "सुबह (9–12)", afternoon: "दोपहर (12–4)", evening: "शाम (4–7)", any: "कोई भी समय",
    currentSchool: "वर्तमान विद्यालय (वैकल्पिक)", visit: "मैं विद्यालय भ्रमण तय करना चाहता/चाहती हूँ",
    message: "संदेश (वैकल्पिक)", consent: "मैं अभिभावक हूँ और सहमति देता/देती हूँ कि वी.एम.आई.एस. इन विवरणों को केवल इस प्रवेश पूछताछ का उत्तर देने हेतु संग्रहीत व उपयोग कर सकता है, जैसा कि इसमें वर्णित है:",
    privacy: "डेटा संरक्षण सूचना", submit: "पूछताछ भेजें", submitting: "भेजा जा रहा है…",
    successTitle: "धन्यवाद — आपकी पूछताछ प्राप्त हो गई है।", successRef: "आपकी संदर्भ संख्या",
    successBody: "कृपया आगे के संवाद हेतु यह संख्या सुरक्षित रखें। प्रवेश टीम आपसे संपर्क करेगी। पूछताछ से प्रवेश सुनिश्चित नहीं होता।",
    another: "एक और पूछताछ भेजें", errorGeneric: "आपकी पूछताछ भेजी नहीं जा सकी। कृपया कुछ क्षण बाद पुनः प्रयास करें।",
    errorRate: "बहुत अधिक प्रयास। कृपया कुछ मिनट प्रतीक्षा कर पुनः प्रयास करें।", retry: "पुनः प्रयास करें",
    errors: {
      required: "यह फ़ील्ड अनिवार्य है।", name: "कृपया मान्य नाम लिखें (2–80 अक्षर)।", mobile: "मान्य 10 अंकों का भारतीय मोबाइल नंबर लिखें।",
      email: "मान्य ईमेल पता लिखें।", level: "कृपया कक्षा चुनें।", consent: "आगे बढ़ने हेतु कृपया सहमति दें।", tooLong: "यह पाठ बहुत लंबा है।",
    },
  },
  footer: {
    quick: "त्वरित लिंक", policies: "नीतियाँ", apps: "मोबाइल ऐप", rights: "सर्वाधिकार सुरक्षित।",
    illustrationNote: "इस वेबसाइट के चित्र कलाकृति हैं, विद्यालय की वास्तविक तस्वीरें नहीं।",
  },
  search: { title: "खोजें", placeholder: "पृष्ठ, कक्षाएँ, प्रश्न खोजें…", empty: "कोई परिणाम नहीं। कोई अन्य शब्द आज़माएँ।", label: "वेबसाइट में खोजें" },
  notFound: { title: "पृष्ठ नहीं मिला", body: "आप जिस पृष्ठ को खोज रहे हैं वह उपलब्ध नहीं है या स्थानांतरित हो गया है।" },
};

export const dictionaries: Record<Locale, Dict> = { en, hi };
export type Dictionary = Dict;
export const getDict = (locale: Locale): Dict => dictionaries[locale];
