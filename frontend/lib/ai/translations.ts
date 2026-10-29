export type SupportedLanguage = "en" | "ur";

export interface AssistantTranslations {
  assistantName: string;
  statusLabel: string;
  welcomeGreeting: string;
  inputPlaceholder: string;
  sendButton: string;
  clearChat: string;
  closeAssistant: string;
  languageSelector: string;
  activeLanguageLabel: string;
  retryButton: string;
  typingIndicator: string;
  safetyDisclaimer: string;
  noResultFound: string;
  noResultAction: string;
  stepWord: string;
  ofWord: string;
  nextStep: string;
  prevStep: string;
  exitGuide: string;
  chips: {
    visionGuide: {
      title: string;
      desc: string;
      prompt: string;
    };
    explainResults: {
      title: string;
      desc: string;
      prompt: string;
    };
    testGuide: {
      title: string;
      desc: string;
      prompt: string;
    };
    languageHelp: {
      title: string;
      desc: string;
    };
  };
}

export const translations: Record<SupportedLanguage, AssistantTranslations> = {
  en: {
    assistantName: "VisionCare AI",
    statusLabel: "Vision Guide",
    welcomeGreeting: "Hi! I'm your vision guide. How can I help you today?",
    inputPlaceholder: "Ask about vision screening, tests, or results...",
    sendButton: "Send message",
    clearChat: "New Conversation",
    closeAssistant: "Close Assistant",
    languageSelector: "Change language",
    activeLanguageLabel: "English",
    retryButton: "Try Again",
    typingIndicator: "VisionCare AI is thinking...",
    safetyDisclaimer:
      "Educational AI screening assistant. Does not provide medical diagnoses or optical prescriptions. Consult an optometrist or ophthalmologist for clinical eye care.",
    noResultFound:
      "Complete a vision screening first, and I can help explain the result in simple language.",
    noResultAction: "Go to Screening Tests",
    stepWord: "Step",
    ofWord: "of",
    nextStep: "Next step",
    prevStep: "Previous",
    exitGuide: "Exit guide",
    chips: {
      visionGuide: {
        title: "Vision Guide",
        desc: "Learn how screening works",
        prompt: "Can you explain how vision screening works and what tests are available on VisionCare?",
      },
      explainResults: {
        title: "Explain Results",
        desc: "Understand your score",
        prompt: "Can you explain my vision screening result in simple language?",
      },
      testGuide: {
        title: "Test Guide",
        desc: "Step-by-step instructions",
        prompt: "Can you guide me step-by-step through my vision test?",
      },
      languageHelp: {
        title: "English / اردو",
        desc: "Switch language",
      },
    },
  },
  ur: {
    assistantName: "ویژن کیئر AI",
    statusLabel: "رہنمائے نظر",
    welcomeGreeting: "السلام علیکم! میں آپ کی نظر کی اسکریننگ میں مدد کے لیے حاضر ہوں۔ میں آپ کی کیا مدد کر سکتا ہوں؟",
    inputPlaceholder: "نظر کی اسکریننگ، ٹیسٹ یا نتائج کے بارے میں پوچھیں...",
    sendButton: "پیغام بھیجیں",
    clearChat: "نئی گفتگو",
    closeAssistant: "اسسٹنٹ بند کریں",
    languageSelector: "زبان تبدیل کریں",
    activeLanguageLabel: "اردو",
    retryButton: "دوبارہ کوشش کریں",
    typingIndicator: "ویژن کیئر AI جواب تیار کر رہا ہے...",
    safetyDisclaimer:
      "تعلیمی AI اسکریننگ اسسٹنٹ۔ یہ طبی تشخیص یا چشمے کا نسخہ فراہم نہیں کرتا۔ مکمل معائنے کے لیے ماہرِ امراضِ چشم سے رجوع کریں۔",
    noResultFound:
      "پہلے نظر کی اسکریننگ مکمل کریں، پھر میں نتیجہ آسان الفاظ میں سمجھانے میں آپ کی مدد کر سکتا ہوں۔",
    noResultAction: "اسکریننگ ٹیسٹ شروع کریں",
    stepWord: "مرحلہ",
    ofWord: "از",
    nextStep: "اگلا مرحلہ",
    prevStep: "پچھلا",
    exitGuide: "گائیڈ بند کریں",
    chips: {
      visionGuide: {
        title: "رہنمائے نظر",
        desc: "اسکریننگ کے بارے میں جانیں",
        prompt: "کیا آپ بتا سکتے ہیں کہ نظر کی اسکریننگ کیسے کام کرتی ہے اور ویژن کیئر پر کون سے ٹیسٹ موجود ہیں؟",
      },
      explainResults: {
        title: "نتائج کی وضاحت",
        desc: "اپنے نتائج کو سمجھیں",
        prompt: "کیا آپ میرے اسکریننگ کے نتائج کو آسان الفاظ میں سمجھا سکتے ہیں؟",
      },
      testGuide: {
        title: "ٹیسٹ گائیڈ",
        desc: "مرحلہ وار ہدایات",
        prompt: "کیا آپ مجھے ٹیسٹ کے مراحل کے بارے میں قدم بہ قدم رہنمائی فراہم کر سکتے ہیں؟",
      },
      languageHelp: {
        title: "اردو / English",
        desc: "زبان تبدیل کریں",
      },
    },
  },
};

/**
 * Detects whether an input string contains Urdu/Arabic script characters.
 */
export function containsUrduScript(text: string): boolean {
  // Unicode range for Arabic, Arabic Supplement, and Extended-A (covering Urdu)
  const arabicUrduRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicUrduRegex.test(text);
}

