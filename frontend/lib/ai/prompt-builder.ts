import { SupportedLanguage } from "./translations";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ScreeningResultContext {
  testType: "distance-vision" | "near-vision" | "color-vision" | string;
  testTitle?: string;
  summaryNote?: string;
  totalItems?: number;
  matchedCount?: number;
  matchPercentage?: number;
  unclearCount?: number;
  smallestPassedLineText?: string;
  rowsPassedCount?: number;
  linesPassedCount?: number;
}

export interface AssistantRequestContext {
  currentPath?: string;
  currentTest?: "distance-vision" | "near-vision" | "color-vision" | null;
  activeResult?: ScreeningResultContext | null;
  language: SupportedLanguage;
}

/**
 * Builds the comprehensive server-side system prompt for VisionCare AI.
 * Enforces strict medical disclaimers, educational framing, non-diagnostic boundaries,
 * and fluent English & Urdu language execution.
 */
export function buildSystemPrompt(context: AssistantRequestContext): string {
  const isUrdu = context.language === "ur";

  return `You are "VisionCare AI", an intelligent, friendly, and supportive educational Vision Guide inside the VisionCare digital eye-screening application.

## Core Identity & Role:
- You help users understand how online vision screening works, guide them through test setups, and explain screening results in plain, accessible language.
- You communicate warmly, concisely, and empathetically.
- You support both English and Urdu (اردو in Arabic script). Always respond in the language requested (${isUrdu ? "Urdu" : "English"}), or match the language used by the user in their prompt.

## VisionCare Tests Knowledge:
1. Distance Vision Screening (Snellen Chart):
   - Row-by-row Snellen optotypes (Lines 1 to 7: 20/200 down to 20/20 equiv).
   - Calibrated viewing distance: 1.5 meters (~5 feet).
   - Passing threshold: >50% correct letters per row.
   - Screen calibration tool uses an 85.60 mm ID/credit card to establish physical optotype height.

2. Near Vision Reading Screener (Rosenbaum Pocket Screener):
   - 8 standardized lines of numbers (Line 1: 9 5 down to Line 8: 4 2 5 7 8 3; Jaeger J14 to J1+).
   - Calibrated viewing distance: 14 inches (~35 cm; approx. elbow to knuckles).
   - Users are prompted to wear their usual reading glasses if they use them.
   - Passing threshold: >50% correct numbers per line.

3. Color Vision Screening (Ishihara-style):
   - Pseudoisochromatic dot plates testing red-green color perception.
   - User identifies numerals hidden within chromatic dot mosaics.

## Strict Medical Safety & Legal Rules:
1. NEVER DIAGNOSE: You are an educational screening assistant, NOT a doctor, optometrist, or ophthalmologist. Never state that a user has myopia (nearsightedness), hyperopia (farsightedness), presbyopia, astigmatism, color blindness, cataracts, glaucoma, or any other ocular disease.
2. NEVER PRESCRIBE: Never recommend optical lens powers (diopters), contact lens prescriptions, medications, or eye drops.
3. DISTINGUISH SCREENING FROM CLINICAL EXAM: Screening demonstrates visual responses on consumer digital displays; it does not replace a comprehensive clinical eye examination, refraction, or dilated fundus check.
4. URGENT SYMPTOM WARNING: If a user reports sudden vision loss, acute eye pain, flashes of light, floating dark curtains, or severe injury, advise them immediately and clearly to seek emergency medical care at an eye emergency clinic or hospital.
5. NO INVENTED DATA: If explaining results, strictly reference only the metrics provided in the user context. Never invent visual acuity scores.

## Formatting & Tone:
- Keep responses concise, clean, and well-structured using short paragraphs and bullet points.
- Avoid overwhelming medical terminology; explain concepts in everyday language.
- When answering in Urdu, write natural, polite Urdu in Arabic script (نستعلیق / نسخ style) with appropriate vocabulary.

${context.currentTest ? `Current User Context: User is viewing the ${context.currentTest} test page.` : ""}
${context.activeResult ? `Active Result Context Available:
- Test: ${context.activeResult.testTitle || context.activeResult.testType}
- Summary: ${context.activeResult.summaryNote || "N/A"}
- Matched Targets: ${context.activeResult.matchedCount ?? "N/A"} of ${context.activeResult.totalItems ?? "N/A"} (${context.activeResult.matchPercentage ?? "N/A"}%)
${context.activeResult.smallestPassedLineText ? `- Smallest Line Read: ${context.activeResult.smallestPassedLineText}` : ""}` : "Active Result Context: No test result has been completed yet in this session."}`;
}

/**
 * Sanitizes and validates user chat messages before submitting to the Groq API.
 */
export function sanitizeMessages(
  messages: Array<{ role: string; content: string }>
): ChatMessage[] {
  if (!Array.isArray(messages)) return [];

  return messages
    .filter((m) => m && typeof m.content === "string" && m.content.trim().length > 0)
    .slice(-6) // Retain last 6 messages to keep context window fast and lean
    .map((m) => ({
      role: m.role === "user" ? "user" : m.role === "assistant" ? "assistant" : "user",
      content: m.content.trim().slice(0, 1000), // Enforce 1000 character limit per message
    }));
}

/**
 * Generates an intelligent, deterministic local fallback response when GROQ_API_KEY
 * is not configured or during local development/offline testing.
 */
export function generateLocalFallbackResponse(
  userMessage: string,
  context: AssistantRequestContext
): string {
  const isUrdu = context.language === "ur";
  const lower = userMessage.toLowerCase();

  // Explain Results intent
  if (
    lower.includes("result") ||
    lower.includes("score") ||
    lower.includes("نتیجہ") ||
    lower.includes("نتائج") ||
    lower.includes("نمبر")
  ) {
    if (context.activeResult) {
      const res = context.activeResult;
      if (isUrdu) {
        return `آپ کا نتیجہ: **${res.testTitle || res.testType}**\n\n- آپ نے **${res.totalItems || 0}** میں سے **${res.matchedCount || 0}** اہداف درست پہچانے (${res.matchPercentage || 0}% درستگی)۔\n${res.smallestPassedLineText ? `- سب سے باریک پڑھی گئی قطار: **${res.smallestPassedLineText}**\n` : ""}\n**اس کا کیا مطلب ہے؟**\nیہ اسکریننگ آپ کی موجودہ اسکرین اور فاصلے پر بصارت کی کارکردگی کو ظاہر کرتی ہے۔ یہ کوئی طبی نسخہ یا بیماری کی تشخیص نہیں ہے۔ اگر آپ کو پڑھنے یا دور دیکھنے میں دشواری محسوس ہو تو مستند ماہرِ امراضِ چشم (Optometrist) سے تفصیلی معائنہ کروائیں۔`;
      }
      return `### Explanation of Your ${res.testTitle || res.testType} Result:\n\n- **Target Accuracy**: You correctly identified **${res.matchedCount || 0} of ${res.totalItems || 0}** targets (${res.matchPercentage || 0}%).\n${res.smallestPassedLineText ? `- **Smallest Read Line**: ${res.smallestPassedLineText}\n` : ""}\n**What this means:**\nThis screening tests visual legibility under your current display dimensions and room lighting. It does not replace a clinical refraction or medical eye exam. If you feel any eye strain or blurriness in daily life, please visit an eye-care professional for a complete evaluation.`;
    }

    if (isUrdu) {
      return "پہلے نظر کی اسکریننگ مکمل کریں، پھر میں آپ کے نتائج کو آسان الفاظ میں سمجھا سکتا ہوں۔ آپ اوپر دیے گئے ٹیسٹ مینو سے فاصلاتی بصارت، قریبی بصارت، یا رنگوں کی بصارت کا ٹیسٹ شروع کر سکتے ہیں۔";
    }
    return "Complete a vision screening test first! Once you finish a screening (Distance, Near, or Color Vision), I can analyze and explain your score in plain language.";
  }

  // Distance Vision intent
  if (lower.includes("distance") || lower.includes("snellen") || lower.includes("فاصلاتی") || lower.includes("دور")) {
    if (isUrdu) {
      return `**سنیلن فاصلاتی بصارت کا ٹیسٹ:**\n- **فاصلہ:** اسکرین سے 1.5 میٹر (5 فٹ) دور بیٹھیں۔\n- **طریقہ:** نمایاں کی گئی قطار کے حروف کو کی بورڈ سے بائیں سے دائیں ٹائپ کریں۔\n- **کامیابی کا اصول:** اگر قطار کے آدھے سے زیادہ (50% سے زائد) حروف درست ہوں تو وہ قطار پاس سمجھی جاتی ہے۔\n- **اہم نکتہ:** اگر کوئی قطار نہ پڑھی جائے تو "Cannot read this line" منتخب کریں۔`;
    }
    return `**Snellen Distance Vision Screening:**\n- **Viewing Distance:** Sit 1.5 meters (~5 feet) away at eye level with both eyes open.\n- **How to Test:** Type the letters in each highlighted row from left to right.\n- **Passing Rule:** A row is passed when more than 50% of its letters are identified correctly.\n- **Need Help?** You can select the **Test Guide** button above for a step-by-step walkthrough!`;
  }

  // Near Vision intent
  if (lower.includes("near") || lower.includes("reading") || lower.includes("قریب") || lower.includes("پڑھنے")) {
    if (isUrdu) {
      return `**روزن بام قریبی بصارت ریڈنگ ٹیسٹ:**\n- **فاصلہ:** اسکرین کو تقریباً 14 انچ (35 سینٹی میٹر) کے فاصلے پر رکھیں (کہنی سے مٹھی تک)۔\n- **پڑھنے کا چشمہ:** اگر آپ پڑھنے کا چشمہ استعمال کرتے ہیں تو اسے پہن کر ٹیسٹ دیں۔\n- **ہندسے درج کرنا:** چارٹ میں دی گئی قطار کے نمبرز کی بورڈ یا اسکرین پیڈ سے ٹائپ کریں۔\n- سب سے باریک پڑھی گئی قطار آپ کی قریبی بصارت کی اسکریننگ لائن کو ظاہر کرتی ہے۔`;
    }
    return `**Rosenbaum Near Vision Reading Chart:**\n- **Viewing Distance:** Position screen approximately 14 inches (35 cm) away (elbow to knuckles).\n- **Reading Glasses:** Wear your normal reading glasses or bifocals if you typically use them.\n- **How to Test:** Type the numbers in each highlighted row using your keyboard or touch keypad.\n- **Scoring:** Identifies the smallest print row you successfully read (>50% correct).`;
  }

  // Color Vision intent
  if (lower.includes("color") || lower.includes("colour") || lower.includes("ishihara") || lower.includes("رنگ")) {
    if (isUrdu) {
      return `**اشیہارا رنگوں کی بصارت کا ٹیسٹ:**\n- رنگ برنگے نقطوں کے دائرے میں چھپے ہندسے کو پہچانیں۔\n- اسکرین پر نائٹ لائٹ یا بلیو لائٹ فلٹر بند رکھیں۔\n- اگر کوئی ہندسہ نظر نہ آئے تو "Nothing visible" منتخب کریں۔`;
    }
    return `**Ishihara Color Vision Screening:**\n- Identifies red-green color perception through mosaic dot plates.\n- View the screen from ~50 cm away in natural room lighting with Night Light/True Tone disabled.\n- Select the number you see or choose 'Nothing visible'.`;
  }

  // Default welcome response
  if (isUrdu) {
    return "میں ویژن کیئر کا تعلیمی اسسٹنٹ ہوں۔ میں آپ کو فاصلاتی بصارت (Snellen)، قریبی بصارت (Rosenbaum)، اور رنگوں کی بصارت (Ishihara) کے ٹیسٹ سمجھانے اور نتائج کی وضاحت میں مدد دے سکتا ہوں۔ آپ کیا جاننا چاہتے ہیں؟";
  }
  return "I am VisionCare AI, your educational vision-screening guide! I can help you with:\n- **Vision Guide**: How our screening tests work and how to position your screen.\n- **Explain Results**: Understand your screening score in plain language.\n- **Test Guide**: Step-by-step instructions for Distance, Near, or Color Vision tests.\n- **Language Support**: Instant answers in English or Urdu.\n\nWhat would you like assistance with today?";
}
