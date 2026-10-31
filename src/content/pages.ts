import { L, type Localized } from "@/i18n/config";

export type PageGroup = "about" | "cbse" | "campus" | "admissions" | "policies" | "services";
export type PageWidget = "eligibility" | "fees" | "principal" | "affiliation" | "enquiry-cta" | "apps" | "stages";

export interface Section {
  heading: Localized;
  body?: Localized;
  bullets?: Localized<string[]>;
  /** Content that must be supplied/approved by the school before it can be published. */
  pending?: boolean;
  link?: { href: string; label: Localized };
}

export interface ContentPage {
  slug: string;
  group: PageGroup;
  title: Localized;
  description: Localized;
  sections: Section[];
  widget?: PageWidget;
  noindex?: boolean;
}

const B = (en: string[], hi: string[]): Localized<string[]> => ({ en, hi });
const CBSE_ACADEMIC = "https://cbseacademic.nic.in/";
const SAFAL = "https://cbseacademic.nic.in/safal/index.html";

export const PAGES: ContentPage[] = [
  // ───────────── ABOUT ─────────────
  {
    slug: "about", group: "about",
    title: L("About VMIS", "वी.एम.आई.एस. परिचय"),
    description: L("About Dr. VedPati Mishra Institute Of Scholars, a CBSE-oriented school for Nursery to Class VIII in Handia, Prayagraj.",
      "डॉ. वेदपति मिश्र इंस्टीट्यूट ऑफ स्कॉलर्स — हंडिया, प्रयागराज में नर्सरी से कक्षा 8 तक का सीबीएसई-उन्मुख विद्यालय।"),
    sections: [
      { heading: L("Who we are", "हम कौन हैं"),
        body: L("Dr. VedPati Mishra Institute Of Scholars (VMIS) is a CBSE-oriented school in Handia, Prayagraj, Uttar Pradesh, offering education from Nursery to Class VIII. Our approach brings together strong foundations, Indian values and modern, concept-first teaching.",
          "डॉ. वेदपति मिश्र इंस्टीट्यूट ऑफ स्कॉलर्स (वी.एम.आई.एस.) हंडिया, प्रयागराज, उत्तर प्रदेश स्थित एक सीबीएसई-उन्मुख विद्यालय है, जो नर्सरी से कक्षा 8 तक शिक्षा प्रदान करता है। हमारा दृष्टिकोण मज़बूत नींव, भारतीय मूल्यों और आधुनिक, अवधारणा-प्रथम शिक्षण को एक साथ लाता है।") },
      { heading: L("Our emblem", "हमारा प्रतीक चिह्न"),
        body: L("The rising sun represents knowledge and energy; the lotus represents purity and growth rooted in our culture; the water and fish represent a living, nurturing environment. The motto तत्वमसि reminds every learner of their inner potential.",
          "उदित सूर्य ज्ञान और ऊर्जा का, कमल हमारी संस्कृति में निहित पवित्रता और विकास का, तथा जल और मछलियाँ एक जीवंत, पोषक वातावरण का प्रतीक हैं। ध्येय वाक्य तत्वमसि प्रत्येक विद्यार्थी को उसकी आंतरिक क्षमता का स्मरण कराता है।") },
      { heading: L("History and founding", "इतिहास और स्थापना"), pending: true },
      { heading: L("Management and trust/society", "प्रबंधन एवं ट्रस्ट/सोसाइटी"), pending: true },
    ],
  },
  {
    slug: "vision-mission", group: "about",
    title: L("Vision and Mission", "दृष्टि और ध्येय"),
    description: L("The vision and mission guiding learning at VMIS.", "वी.एम.आई.एस. में अधिगम का मार्गदर्शन करने वाली दृष्टि और ध्येय।"),
    sections: [
      { heading: L("Proposed vision (for school approval)", "प्रस्तावित दृष्टि (विद्यालय की स्वीकृति हेतु)"),
        body: L("To nurture curious, capable and compassionate learners who know themselves, respect others and contribute to society.",
          "जिज्ञासु, सक्षम और करुणाशील विद्यार्थियों का पोषण करना जो स्वयं को जानें, दूसरों का सम्मान करें और समाज में योगदान दें।"), pending: true },
      { heading: L("Proposed mission (for school approval)", "प्रस्तावित ध्येय (विद्यालय की स्वीकृति हेतु)"),
        bullets: B(["Provide a safe, caring and inclusive learning environment", "Build strong foundational literacy and numeracy", "Encourage understanding, inquiry and application over rote learning", "Develop values, discipline, creativity and physical wellbeing", "Partner closely with parents in every child's growth"],
          ["एक सुरक्षित, स्नेहपूर्ण और समावेशी अधिगम वातावरण देना", "मज़बूत आधारभूत साक्षरता और संख्या ज्ञान विकसित करना", "रटने के स्थान पर समझ, जिज्ञासा और अनुप्रयोग को प्रोत्साहित करना", "मूल्य, अनुशासन, रचनात्मकता और शारीरिक स्वास्थ्य का विकास", "हर बच्चे के विकास में अभिभावकों के साथ घनिष्ठ साझेदारी"]), pending: true },
    ],
  },
  {
    slug: "leadership", group: "about",
    title: L("Leadership", "नेतृत्व"),
    description: L("School leadership and management at VMIS.", "वी.एम.आई.एस. का विद्यालय नेतृत्व और प्रबंधन।"),
    sections: [
      { heading: L("Leadership team", "नेतृत्व दल"), body: L("Profiles of the Chairperson/Manager, Principal and academic coordinators will be published after the school provides approved details and photographs.", "अध्यक्ष/प्रबंधक, प्रधानाचार्य और शैक्षणिक समन्वयकों का परिचय विद्यालय द्वारा स्वीकृत विवरण और फ़ोटो मिलने के बाद प्रकाशित किया जाएगा।"), pending: true },
    ],
  },
  {
    slug: "principal-message", group: "about", widget: "principal",
    title: L("Principal’s Message", "प्रधानाचार्य का संदेश"),
    description: L("A message from the Principal of VMIS.", "वी.एम.आई.एस. के प्रधानाचार्य का संदेश।"),
    sections: [],
  },
  // ───────────── CBSE & CURRICULUM ─────────────
  {
    slug: "cbse-approach", group: "cbse", widget: "affiliation",
    title: L("CBSE Educational Approach", "सीबीएसई शैक्षिक दृष्टिकोण"),
    description: L("How VMIS follows a CBSE-oriented, NCERT-aligned educational approach from the Foundational to the Middle Stage.",
      "वी.एम.आई.एस. आधारभूत से मध्य चरण तक सीबीएसई-उन्मुख, एनसीईआरटी-संरेखित शैक्षिक दृष्टिकोण कैसे अपनाता है।"),
    sections: [
      { heading: L("CBSE-oriented, not an unverified claim", "सीबीएसई-उन्मुख — असत्यापित दावा नहीं"),
        body: L("VMIS follows CBSE-aligned educational practices. Formal CBSE affiliation details (affiliation number, school code, category and validity) are shown below only after they are verified. CBSE-aligned teaching and formal affiliation are different things, and we keep them clearly separate.",
          "वी.एम.आई.एस. सीबीएसई-संरेखित शैक्षिक पद्धतियाँ अपनाता है। औपचारिक सीबीएसई संबद्धता विवरण (संबद्धता संख्या, विद्यालय कोड, श्रेणी और वैधता) सत्यापन के बाद ही नीचे दिखाए जाते हैं। सीबीएसई-संरेखित शिक्षण और औपचारिक संबद्धता अलग बातें हैं, और हम इन्हें स्पष्ट रूप से अलग रखते हैं।") },
      { heading: L("Foundational Stage", "आधारभूत चरण"),
        body: L("The NCERT National Curriculum Framework for the Foundational Stage covers five years of learning — three years of preschool plus Classes I and II — generally for children aged 3 to 8. It emphasises play, activity, stories, conversation and joyful discovery. How the school’s Nursery, Prep, LKG and UKG map onto these preschool years will be confirmed by the school.",
          "एनसीईआरटी का आधारभूत चरण हेतु राष्ट्रीय पाठ्यचर्या ढाँचा पाँच वर्षों के अधिगम को समाहित करता है — तीन वर्ष पूर्व-प्राथमिक तथा कक्षा 1 और 2 — सामान्यतः 3 से 8 वर्ष के बच्चों के लिए। यह खेल, गतिविधि, कहानियों, संवाद और आनंदपूर्ण खोज पर बल देता है। विद्यालय की नर्सरी, प्रेप, एल.के.जी. और यू.के.जी. का इन वर्षों से संबंध विद्यालय द्वारा पुष्ट किया जाएगा।") },
      { heading: L("Preparatory Stage (Classes III–V)", "प्रारंभिक चरण (कक्षा 3–5)"),
        bullets: B(["Reading, writing and speaking", "Mathematics and languages", "Science through discovery and activity", "Art and physical education", "A gradual transition towards more formal subject learning"],
          ["पढ़ना, लिखना और बोलना", "गणित और भाषाएँ", "खोज और गतिविधि से विज्ञान", "कला और शारीरिक शिक्षा", "औपचारिक विषय अधिगम की ओर क्रमिक संक्रमण"]) },
      { heading: L("Middle Stage (Classes VI–VIII)", "मध्य चरण (कक्षा 6–8)"),
        bullets: B(["Subject understanding and conceptual clarity", "Experiential and project-based learning", "Critical thinking and competency development", "Practical application of knowledge"],
          ["विषय की समझ और वैचारिक स्पष्टता", "अनुभवात्मक और परियोजना-आधारित अधिगम", "आलोचनात्मक चिंतन और दक्षता विकास", "ज्ञान का व्यावहारिक अनुप्रयोग"]) },
      { heading: L("Official references", "आधिकारिक संदर्भ"), body: L("The applicable CBSE and NCERT curriculum for each academic session is published by CBSE.", "प्रत्येक शैक्षणिक सत्र हेतु लागू सीबीएसई और एनसीईआरटी पाठ्यक्रम सीबीएसई द्वारा प्रकाशित किया जाता है।"),
        link: { href: CBSE_ACADEMIC, label: L("CBSE Academic website", "सीबीएसई अकादमिक वेबसाइट") } },
    ],
  },
  {
    slug: "curriculum", group: "cbse",
    title: L("Curriculum", "पाठ्यक्रम"),
    description: L("Session-wise curriculum, subjects, learning objectives and textbooks for Nursery to Class VIII at VMIS.", "वी.एम.आई.एस. में नर्सरी से कक्षा 8 तक सत्रवार पाठ्यक्रम, विषय, अधिगम उद्देश्य और पाठ्यपुस्तकें।"),
    sections: [
      { heading: L("Curriculum centre", "पाठ्यक्रम केंद्र"),
        body: L("For every class and subject the school will publish: the academic session, learning objectives, a curriculum description, textbook information and school-approved study resources, with links to official CBSE/NCERT references. This content is updated each academic session.",
          "प्रत्येक कक्षा और विषय के लिए विद्यालय प्रकाशित करेगा: शैक्षणिक सत्र, अधिगम उद्देश्य, पाठ्यक्रम विवरण, पाठ्यपुस्तक जानकारी और विद्यालय-स्वीकृत अध्ययन संसाधन, आधिकारिक सीबीएसई/एनसीईआरटी संदर्भों सहित। यह सामग्री प्रत्येक सत्र में अद्यतन होती है।") },
      { heading: L("Session curriculum and textbooks", "सत्र पाठ्यक्रम और पाठ्यपुस्तकें"), pending: true },
    ],
    widget: "stages",
  },
  {
    slug: "assessment", group: "cbse",
    title: L("Assessment", "मूल्यांकन"),
    description: L("How learning is assessed at VMIS — classroom, periodic, oral, project and practical assessment.", "वी.एम.आई.एस. में अधिगम का मूल्यांकन — कक्षा, आवधिक, मौखिक, परियोजना और प्रायोगिक मूल्यांकन।"),
    sections: [
      { heading: L("Assessment for learning", "अधिगम हेतु मूल्यांकन"),
        bullets: B(["Classroom observation and assessment", "Periodic assessments", "Written work", "Oral activities", "Projects and practical activities", "Regular learning feedback to students and parents"],
          ["कक्षा अवलोकन और मूल्यांकन", "आवधिक मूल्यांकन", "लिखित कार्य", "मौखिक गतिविधियाँ", "परियोजनाएँ और प्रायोगिक गतिविधियाँ", "विद्यार्थियों और अभिभावकों को नियमित प्रतिपुष्टि"]) },
      { heading: L("Early years", "प्रारंभिक वर्ष"),
        body: L("In Nursery, Prep, LKG and UKG, progress is understood through observation, activities and conversations — not through examinations.", "नर्सरी, प्रेप, एल.के.जी. और यू.के.जी. में प्रगति अवलोकन, गतिविधियों और संवाद से समझी जाती है — परीक्षाओं से नहीं।") },
      { heading: L("Evaluation policy, schedule and promotion rules", "मूल्यांकन नीति, समय-सारिणी और उन्नति नियम"), pending: true },
    ],
  },
  {
    slug: "safal", group: "cbse",
    title: L("SAFAL — Structured Assessment for Analysing Learning", "सफल — अधिगम विश्लेषण हेतु संरचित मूल्यांकन"),
    description: L("An explainer on CBSE’s SAFAL competency-based diagnostic assessment.", "सीबीएसई के सफल (SAFAL) दक्षता-आधारित नैदानिक मूल्यांकन की जानकारी।"),
    sections: [
      { heading: L("What is SAFAL?", "सफल क्या है?"),
        body: L("SAFAL (Structured Assessment for Analysing Learning) is a CBSE competency-based assessment designed to diagnose how well students understand core concepts, rather than how much they have memorised. Its results help schools improve teaching and learning.",
          "सफल (Structured Assessment for Analysing Learning) सीबीएसई का दक्षता-आधारित मूल्यांकन है, जो यह जानने हेतु बनाया गया है कि विद्यार्थी मूल अवधारणाओं को कितना समझते हैं, न कि कितना याद किया है। इसके परिणाम विद्यालयों को शिक्षण-अधिगम सुधारने में सहायता करते हैं।") },
      { heading: L("What it focuses on", "इसका केंद्र-बिंदु"),
        bullets: B(["Core concepts", "Application of knowledge", "Higher-order thinking", "Learning outcomes", "Diagnostic feedback", "Improving teaching and learning"], ["मूल अवधारणाएँ", "ज्ञान का अनुप्रयोग", "उच्च-स्तरीय चिंतन", "अधिगम परिणाम", "नैदानिक प्रतिपुष्टि", "शिक्षण-अधिगम में सुधार"]) },
      { heading: L("What it is not", "यह क्या नहीं है"),
        body: L("SAFAL is not a public ranking and not a pass/fail or promotion examination.", "सफल कोई सार्वजनिक रैंकिंग नहीं है और न ही उत्तीर्ण/अनुत्तीर्ण या उन्नति परीक्षा है।") },
      { heading: L("VMIS participation", "वी.एम.आई.एस. की भागीदारी"), pending: true,
        link: { href: SAFAL, label: L("Official SAFAL page (CBSE)", "आधिकारिक सफल पृष्ठ (सीबीएसई)") } },
    ],
  },
  {
    slug: "teaching-learning", group: "cbse",
    title: L("Teaching and Learning", "शिक्षण और अधिगम"),
    description: L("Child-centred, activity-based and concept-first teaching at VMIS.", "वी.एम.आई.एस. में बाल-केंद्रित, गतिविधि-आधारित और अवधारणा-प्रथम शिक्षण।"),
    sections: [
      { heading: L("Our classroom approach", "हमारी कक्षा पद्धति"),
        bullets: B(["Play-based and activity-based learning in the early years", "Storytelling, rhymes, music and movement", "Guided discovery and hands-on exploration", "Concept-first teaching with real-life application", "Projects, collaboration and presentations", "Reading habits and language development in English and Hindi"],
          ["प्रारंभिक वर्षों में खेल और गतिविधि-आधारित अधिगम", "कहानियाँ, कविताएँ, संगीत और गति", "निर्देशित खोज और व्यावहारिक अन्वेषण", "वास्तविक जीवन अनुप्रयोग सहित अवधारणा-प्रथम शिक्षण", "परियोजनाएँ, सहयोग और प्रस्तुतियाँ", "अंग्रेज़ी और हिंदी में पठन-रुचि और भाषा विकास"]) },
    ],
  },
  // ───────────── CAMPUS LIFE ─────────────
  {
    slug: "student-development", group: "campus",
    title: L("Student Development", "विद्यार्थी विकास"),
    description: L("Values, wellbeing, communication and life skills at VMIS.", "वी.एम.आई.एस. में मूल्य, कल्याण, संवाद और जीवन कौशल।"),
    sections: [
      { heading: L("Growing the whole child", "संपूर्ण व्यक्तित्व का विकास"),
        bullets: B(["Values, discipline and respect", "Communication and confidence", "Creativity through art, music and craft", "Physical activity and wellbeing", "Social-emotional learning", "Responsibility and leadership opportunities"],
          ["मूल्य, अनुशासन और सम्मान", "संवाद और आत्मविश्वास", "कला, संगीत और शिल्प से रचनात्मकता", "शारीरिक गतिविधि और कल्याण", "सामाजिक-भावनात्मक अधिगम", "दायित्व और नेतृत्व के अवसर"]) },
      { heading: L("Clubs, houses and programmes", "क्लब, सदन और कार्यक्रम"), pending: true },
    ],
  },
  {
    slug: "facilities", group: "campus",
    title: L("Facilities", "सुविधाएँ"),
    description: L("Campus facilities at VMIS, Handia, Prayagraj.", "वी.एम.आई.एस., हंडिया, प्रयागराज की परिसर सुविधाएँ।"),
    sections: [
      { heading: L("Campus facilities", "परिसर सुविधाएँ"),
        body: L("Only facilities actually available on campus will be listed here (for example classrooms, library, activity areas, play areas, drinking water and sanitation, transport). Each will be published after confirmation by the school.",
          "यहाँ केवल वे सुविधाएँ सूचीबद्ध होंगी जो परिसर में वास्तव में उपलब्ध हैं (जैसे कक्षाएँ, पुस्तकालय, गतिविधि क्षेत्र, खेल क्षेत्र, पेयजल व स्वच्छता, परिवहन)। प्रत्येक सुविधा विद्यालय की पुष्टि के बाद प्रकाशित होगी।"), pending: true },
    ],
  },
  {
    slug: "sports-activities", group: "campus",
    title: L("Sports and Activities", "खेल और गतिविधियाँ"),
    description: L("Sports, games, art, music and co-curricular activities at VMIS.", "वी.एम.आई.एस. में खेल, कला, संगीत और सह-पाठ्यचर्या गतिविधियाँ।"),
    sections: [
      { heading: L("Learning beyond the classroom", "कक्षा से आगे का अधिगम"),
        body: L("Physical education, games, art, music, dance, storytelling and celebrations of Indian festivals help children grow healthy, confident and creative.",
          "शारीरिक शिक्षा, खेल, कला, संगीत, नृत्य, कहानी और भारतीय पर्वों के उत्सव बच्चों को स्वस्थ, आत्मविश्वासी और रचनात्मक बनाते हैं।") },
      { heading: L("Activities offered this session", "इस सत्र में उपलब्ध गतिविधियाँ"), pending: true },
    ],
  },
  // ───────────── ADMISSIONS ─────────────
  {
    slug: "admission-process", group: "admissions", widget: "enquiry-cta",
    title: L("Admission Process", "प्रवेश प्रक्रिया"),
    description: L("Step-by-step admission process at VMIS for Nursery to Class VIII.", "वी.एम.आई.एस. में नर्सरी से कक्षा 8 तक चरणबद्ध प्रवेश प्रक्रिया।"),
    sections: [
      { heading: L("How admission works", "प्रवेश कैसे होता है"),
        bullets: B(["Explore the class levels and choose the class you are seeking", "Review eligibility, required documents and fee information", "Submit an online admission enquiry", "Receive a unique enquiry reference number", "The admissions team contacts you; you may request a campus visit", "Formal admission — forms, any interaction and document verification — is completed by the school"],
          ["कक्षाओं की जानकारी देखें और वांछित कक्षा चुनें", "पात्रता, आवश्यक दस्तावेज़ और शुल्क जानकारी देखें", "ऑनलाइन प्रवेश पूछताछ भेजें", "एक विशिष्ट संदर्भ संख्या प्राप्त करें", "प्रवेश टीम आपसे संपर्क करेगी; आप परिसर भ्रमण का अनुरोध कर सकते हैं", "औपचारिक प्रवेश — फ़ॉर्म, संवाद और दस्तावेज़ सत्यापन — विद्यालय द्वारा पूर्ण किया जाता है"]) },
      { heading: L("Important", "महत्वपूर्ण"), body: L("An online enquiry does not confirm or reserve admission.", "ऑनलाइन पूछताछ से प्रवेश सुनिश्चित या आरक्षित नहीं होता।") },
    ],
  },
  {
    slug: "eligibility", group: "admissions", widget: "eligibility",
    title: L("Eligibility", "पात्रता"),
    description: L("Age and admission eligibility for each class from Nursery to Class VIII at VMIS.", "वी.एम.आई.एस. में नर्सरी से कक्षा 8 तक प्रत्येक कक्षा की आयु एवं प्रवेश पात्रता।"),
    sections: [
      { heading: L("Age eligibility", "आयु पात्रता"),
        body: L("Age criteria and cut-off dates are set by the school in line with applicable regulations. Values appear below only after the school confirms them.",
          "आयु मानदंड और निर्धारित तिथि लागू नियमों के अनुसार विद्यालय द्वारा तय किए जाते हैं। विद्यालय की पुष्टि के बाद ही मान नीचे दिखाई देंगे।") },
    ],
  },
  {
    slug: "documents-required", group: "admissions",
    title: L("Required Documents", "आवश्यक दस्तावेज़"),
    description: L("Documents usually needed for admission at VMIS.", "वी.एम.आई.एस. में प्रवेश हेतु सामान्यतः आवश्यक दस्तावेज़।"),
    sections: [
      { heading: L("Commonly requested documents (final list to be confirmed)", "सामान्यतः माँगे जाने वाले दस्तावेज़ (अंतिम सूची की पुष्टि होनी है)"),
        bullets: B(["Child’s birth certificate", "Recent passport-size photographs", "Address proof", "Transfer certificate and previous report card (Class I onwards, where applicable)"],
          ["बच्चे का जन्म प्रमाण पत्र", "हाल के पासपोर्ट आकार के फ़ोटो", "पते का प्रमाण", "स्थानांतरण प्रमाण पत्र और पिछला रिपोर्ट कार्ड (कक्षा 1 से आगे, जहाँ लागू हो)"]), pending: true },
      { heading: L("Privacy note", "गोपनीयता सूचना"), body: L("Please do not upload or send identity documents through the online enquiry form. Documents are collected only during formal admission at the school.", "कृपया ऑनलाइन पूछताछ फ़ॉर्म में पहचान दस्तावेज़ न भेजें। दस्तावेज़ केवल विद्यालय में औपचारिक प्रवेश के समय लिए जाते हैं।") },
    ],
  },
  {
    slug: "fees", group: "admissions", widget: "fees",
    title: L("Fee Information", "शुल्क जानकारी"),
    description: L("Fee information for Nursery to Class VIII at VMIS.", "वी.एम.आई.एस. में नर्सरी से कक्षा 8 तक शुल्क जानकारी।"),
    sections: [],
  },
  {
    slug: "school-visit", group: "admissions", widget: "enquiry-cta",
    title: L("Schedule a School Visit", "विद्यालय भ्रमण तय करें"),
    description: L("Request a campus visit at VMIS, Handia, Prayagraj.", "वी.एम.आई.एस., हंडिया, प्रयागराज में परिसर भ्रमण का अनुरोध करें।"),
    sections: [
      { heading: L("Visit us", "हमसे मिलें"),
        body: L("Seeing the school in person is the best way to understand it. Submit an enquiry and tick “I would like to schedule a school visit”; the admissions team will contact you to confirm a convenient date and time.",
          "विद्यालय को स्वयं देखना उसे समझने का सर्वोत्तम तरीका है। पूछताछ भेजते समय “मैं विद्यालय भ्रमण तय करना चाहता/चाहती हूँ” चुनें; प्रवेश टीम सुविधाजनक तिथि और समय की पुष्टि हेतु संपर्क करेगी।") },
    ],
  },
  {
    slug: "early-years-transition", group: "admissions",
    title: L("Starting School: A Guide for Early Years Parents", "विद्यालय की शुरुआत: प्रारंभिक वर्षों के अभिभावकों हेतु मार्गदर्शिका"),
    description: L("How young children settle into school at VMIS — orientation, routine, communication and safety.", "वी.एम.आई.एस. में छोटे बच्चे विद्यालय में कैसे घुलते-मिलते हैं — परिचय, दिनचर्या, संवाद और सुरक्षा।"),
    sections: [
      { heading: L("Settling in", "घुलना-मिलना"), body: L("Every child settles at their own pace. A calm routine, a warm goodbye and patience in the first weeks help children feel secure.", "हर बच्चा अपनी गति से घुलता-मिलता है। शांत दिनचर्या, स्नेहपूर्ण विदाई और पहले कुछ सप्ताहों में धैर्य बच्चों को सुरक्षित अनुभव कराते हैं।") },
      { heading: L("Parent orientation", "अभिभावक परिचय सत्र"), body: L("Orientation dates and format will be shared by the school.", "परिचय सत्र की तिथियाँ और स्वरूप विद्यालय द्वारा साझा किए जाएँगे।"), pending: true },
      { heading: L("Daily routine and timings", "दैनिक दिनचर्या और समय"), pending: true },
      { heading: L("School readiness at home", "घर पर विद्यालय-तत्परता"),
        bullets: B(["Talk positively about school", "Read stories and sing rhymes together", "Encourage simple independence — eating, washing hands, packing a bag", "Keep a regular sleep routine"], ["विद्यालय के बारे में सकारात्मक बातें करें", "साथ में कहानियाँ पढ़ें और कविताएँ गाएँ", "छोटे-छोटे स्वावलंबन को प्रोत्साहित करें — खाना, हाथ धोना, बैग रखना", "नियमित सोने की दिनचर्या रखें"]) },
      { heading: L("Safety, health and communication", "सुरक्षा, स्वास्थ्य और संवाद"), body: L("Pick-up authorisation, health and safety policies, uniform, books and transport details will be published once approved.", "बच्चे को ले जाने की अनुमति, स्वास्थ्य व सुरक्षा नीतियाँ, गणवेश, पुस्तकें और परिवहन विवरण स्वीकृति के बाद प्रकाशित होंगे।"), pending: true },
    ],
  },
  // ───────────── SERVICES ─────────────
  {
    slug: "digital-services", group: "services", widget: "apps",
    title: L("Digital Services", "डिजिटल सेवाएँ"),
    description: L("Upcoming VMIS digital services for parents, students and teachers.", "अभिभावकों, विद्यार्थियों और शिक्षकों हेतु आगामी वी.एम.आई.एस. डिजिटल सेवाएँ।"),
    sections: [
      { heading: L("Planned — not yet available", "नियोजित — अभी उपलब्ध नहीं"),
        bullets: B(["Parent portal", "Student portal", "Teacher portal", "Online admission application", "Online fee payment", "Attendance, homework and progress", "Notices and transport updates"],
          ["अभिभावक पोर्टल", "विद्यार्थी पोर्टल", "शिक्षक पोर्टल", "ऑनलाइन प्रवेश आवेदन", "ऑनलाइन शुल्क भुगतान", "उपस्थिति, गृहकार्य और प्रगति", "सूचनाएँ और परिवहन अपडेट"]) },
    ],
  },
  // ───────────── POLICIES ─────────────
  {
    slug: "data-protection", group: "policies",
    title: L("Data Protection Notice", "डेटा संरक्षण सूचना"),
    description: L("How VMIS collects and uses personal data from admission enquiries.", "वी.एम.आई.एस. प्रवेश पूछताछ से व्यक्तिगत डेटा कैसे एकत्र और उपयोग करता है।"),
    sections: [
      { heading: L("What we collect", "हम क्या एकत्र करते हैं"), body: L("Through the admission enquiry form we collect only: parent/guardian name, mobile number, optional email, preferred language, class sought, preferred contact time, optional current school, visit interest and an optional message. We do not collect identity documents or children’s photographs online.", "प्रवेश पूछताछ फ़ॉर्म से हम केवल यह एकत्र करते हैं: अभिभावक का नाम, मोबाइल नंबर, वैकल्पिक ईमेल, पसंदीदा भाषा, वांछित कक्षा, संपर्क का समय, वैकल्पिक वर्तमान विद्यालय, भ्रमण रुचि और वैकल्पिक संदेश। हम ऑनलाइन पहचान दस्तावेज़ या बच्चों की तस्वीरें एकत्र नहीं करते।") },
      { heading: L("Why we use it", "उपयोग का उद्देश्य"), body: L("Solely to respond to your admission enquiry and, if you ask, to arrange a school visit. We do not sell data and do not use it for advertising or behavioural tracking of children.", "केवल आपकी प्रवेश पूछताछ का उत्तर देने और आपके अनुरोध पर विद्यालय भ्रमण तय करने हेतु। हम डेटा नहीं बेचते और बच्चों के विज्ञापन या व्यवहार-ट्रैकिंग हेतु उपयोग नहीं करते।") },
      { heading: L("Retention, access and your rights", "अवधि, पहुँच और आपके अधिकार"), body: L("Access is limited to authorised school staff. You may ask to access, correct or delete your enquiry data or withdraw consent by contacting the school. Enquiries not converted to admission are deleted after the retention period set by the school. This notice is prepared with India’s Digital Personal Data Protection Act, 2023 and its Rules in mind and must be reviewed by a qualified legal adviser before launch.", "पहुँच केवल अधिकृत विद्यालय कर्मियों तक सीमित है। आप विद्यालय से संपर्क कर अपने डेटा तक पहुँच, सुधार, विलोपन या सहमति वापसी का अनुरोध कर सकते हैं। प्रवेश में परिवर्तित न होने वाली पूछताछ विद्यालय द्वारा तय अवधि के बाद हटा दी जाती है। यह सूचना डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम, 2023 और उसके नियमों को ध्यान में रखकर तैयार की गई है तथा प्रारंभ से पहले योग्य विधिक सलाहकार द्वारा समीक्षा आवश्यक है।") },
      { heading: L("Grievance / contact officer", "शिकायत / संपर्क अधिकारी"), pending: true },
    ],
  },
  {
    slug: "privacy-policy", group: "policies",
    title: L("Privacy Policy", "गोपनीयता नीति"),
    description: L("Privacy policy of the VMIS website.", "वी.एम.आई.एस. वेबसाइट की गोपनीयता नीति।"),
    sections: [
      { heading: L("Summary", "सारांश"), body: L("This website uses no advertising trackers and no third-party analytics cookies. Essential security cookies are used only in the staff administration area. Personal data submitted through forms is handled as described in our Data Protection Notice.", "यह वेबसाइट कोई विज्ञापन ट्रैकर या तृतीय-पक्ष विश्लेषण कुकी उपयोग नहीं करती। आवश्यक सुरक्षा कुकी केवल कर्मचारी प्रशासन क्षेत्र में उपयोग होती हैं। फ़ॉर्म से प्राप्त व्यक्तिगत डेटा हमारी डेटा संरक्षण सूचना के अनुसार संभाला जाता है।"),
        link: { href: "/data-protection", label: L("Data Protection Notice", "डेटा संरक्षण सूचना") } },
      { heading: L("Security", "सुरक्षा"), body: L("Data is transmitted over HTTPS and stored with access restricted to authorised staff. Server logs may record technical information (such as a hashed IP address) to prevent abuse.", "डेटा HTTPS से भेजा जाता है और केवल अधिकृत कर्मियों की पहुँच में संग्रहीत होता है। दुरुपयोग रोकने हेतु सर्वर लॉग तकनीकी जानकारी (जैसे हैश किया गया IP) दर्ज कर सकते हैं।") },
      { heading: L("Legal review", "विधिक समीक्षा"), pending: true },
    ],
  },
  {
    slug: "terms", group: "policies",
    title: L("Terms and Conditions", "नियम और शर्तें"),
    description: L("Terms of use of the VMIS website.", "वी.एम.आई.एस. वेबसाइट उपयोग की शर्तें।"),
    sections: [
      { heading: L("Use of this website", "इस वेबसाइट का उपयोग"), body: L("Information on this website is provided for general guidance. Official admission decisions, fees and policies are those communicated in writing by the school. Content, logo and illustrations may not be reused without permission.", "इस वेबसाइट की जानकारी सामान्य मार्गदर्शन हेतु है। आधिकारिक प्रवेश निर्णय, शुल्क और नीतियाँ वे हैं जो विद्यालय द्वारा लिखित रूप में सूचित की जाती हैं। सामग्री, प्रतीक चिह्न और चित्र अनुमति के बिना पुनः उपयोग नहीं किए जा सकते।") },
      { heading: L("Full terms", "पूर्ण शर्तें"), pending: true },
    ],
  },
  {
    slug: "child-safety", group: "policies",
    title: L("Child Safety Policy", "बाल सुरक्षा नीति"),
    description: L("Child safety and safeguarding commitments at VMIS.", "वी.एम.आई.एस. में बाल सुरक्षा और संरक्षण प्रतिबद्धताएँ।"),
    sections: [
      { heading: L("Our commitment", "हमारी प्रतिबद्धता"), body: L("Every child has the right to be safe. VMIS is committed to a safe physical and emotional environment, supervised premises, respectful conduct by all adults, and prompt action on any concern.", "हर बच्चे को सुरक्षित रहने का अधिकार है। वी.एम.आई.एस. सुरक्षित शारीरिक व भावनात्मक वातावरण, निगरानी युक्त परिसर, सभी वयस्कों के सम्मानजनक आचरण और किसी भी चिंता पर त्वरित कार्रवाई हेतु प्रतिबद्ध है।") },
      { heading: L("Policy, committees and reporting contacts", "नीति, समितियाँ और सूचना संपर्क"), pending: true },
    ],
  },
  {
    slug: "media-consent", group: "policies",
    title: L("Student Photo and Media Consent", "विद्यार्थी फ़ोटो एवं मीडिया सहमति"),
    description: L("How VMIS seeks parental consent before publishing student photographs.", "विद्यार्थियों की तस्वीरें प्रकाशित करने से पहले वी.एम.आई.एस. अभिभावकों की सहमति कैसे लेता है।"),
    sections: [
      { heading: L("Our practice", "हमारी पद्धति"), body: L("Photographs or videos of students are published only with documented parental consent. Children are not identified by full name alongside their image. Parents may withdraw consent at any time, and images will be removed.", "विद्यार्थियों की तस्वीरें या वीडियो केवल अभिभावकों की लिखित सहमति से प्रकाशित होते हैं। चित्र के साथ बच्चों का पूरा नाम नहीं दिया जाता। अभिभावक कभी भी सहमति वापस ले सकते हैं और चित्र हटा दिए जाएँगे।") },
    ],
  },
  {
    slug: "accessibility", group: "policies",
    title: L("Accessibility Statement", "सुगम्यता वक्तव्य"),
    description: L("Accessibility commitments of the VMIS website.", "वी.एम.आई.एस. वेबसाइट की सुगम्यता प्रतिबद्धताएँ।"),
    sections: [
      { heading: L("Our goal", "हमारा लक्ष्य"), body: L("This website aims to meet WCAG 2.2 Level AA: keyboard navigation, visible focus, sufficient colour contrast, text alternatives, reduced-motion support and correct language markup for English and Hindi.", "यह वेबसाइट WCAG 2.2 स्तर AA का लक्ष्य रखती है: कीबोर्ड नेविगेशन, स्पष्ट फ़ोकस, पर्याप्त रंग-विरोधाभास, पाठ विकल्प, कम-गति समर्थन और अंग्रेज़ी व हिंदी के लिए सही भाषा चिह्नांकन।") },
      { heading: L("Feedback", "प्रतिपुष्टि"), body: L("If you face any difficulty using this website, please contact the school and we will help.", "यदि वेबसाइट के उपयोग में कोई कठिनाई हो, तो कृपया विद्यालय से संपर्क करें, हम सहायता करेंगे।") },
    ],
  },
];

export const PAGE_SLUGS = PAGES.map((p) => p.slug);
export const getPage = (slug: string) => PAGES.find((p) => p.slug === slug);
