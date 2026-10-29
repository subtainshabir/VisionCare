import { SupportedLanguage } from "./translations";

export interface TestGuideStep {
  stepNumber: number;
  title: string;
  instruction: string;
  tip?: string;
}

export interface TestGuideSuite {
  testId: "distance-vision" | "near-vision" | "color-vision";
  testTitle: string;
  totalSteps: number;
  steps: TestGuideStep[];
}

export const testGuides: Record<SupportedLanguage, Record<string, TestGuideSuite>> = {
  en: {
    "distance-vision": {
      testId: "distance-vision",
      testTitle: "Snellen Distance Vision Screening",
      totalSteps: 5,
      steps: [
        {
          stepNumber: 1,
          title: "Viewing Distance & Posture",
          instruction:
            "Sit back approximately 1.5 meters (~5 feet) away from your display at comfortable eye level. Keep both eyes open.",
          tip: "Position your chair so you are directly facing the screen without tilting your head.",
        },
        {
          stepNumber: 2,
          title: "Room Lighting",
          instruction:
            "Ensure comfortable, balanced room lighting. Avoid strong glare, windows directly behind your screen, or lamp reflections.",
          tip: "Turn off night-shift or screen dimmers if they alter contrast.",
        },
        {
          stepNumber: 3,
          title: "Display Calibration",
          instruction:
            "Use the on-screen card slider to match a physical credit card or driver's license (85.60 mm) to ensure letters are physically scaled to standard angular subtense.",
          tip: "If you don't have a card handy, the default standard 96 DPI estimate is applied.",
        },
        {
          stepNumber: 4,
          title: "Identifying Optotypes",
          instruction:
            "Look at the highlighted row on the Snellen chart (marked with an arrow ◀). Type the letters you see from left to right using your keyboard.",
          tip: "You can press Enter or click 'Submit Line' to advance to the next row.",
        },
        {
          stepNumber: 5,
          title: "Unclear Rows & Finishing",
          instruction:
            "If a row is too small or blurry to distinguish, select 'Cannot read this line'. A row passes if more than 50% of its letters are identified correctly.",
          tip: "You can click 'Finish test here' once you have attempted smaller rows.",
        },
      ],
    },
    "near-vision": {
      testId: "near-vision",
      testTitle: "Rosenbaum Near Vision Reading Chart",
      totalSteps: 5,
      steps: [
        {
          stepNumber: 1,
          title: "14-Inch Viewing Distance",
          instruction:
            "Hold your mobile device or position your laptop screen approximately 14 inches (35 cm) from your eyes.",
          tip: "A handy anatomical guide is the distance from your elbow to your closed knuckles.",
        },
        {
          stepNumber: 2,
          title: "Reading Glasses / Eyewear",
          instruction:
            "If you normally use reading glasses, bifocals, or contacts for close reading, wear them for this test.",
          tip: "Mark the 'Wearing Reading Glasses' option on the setup screen so your result context is clear.",
        },
        {
          stepNumber: 3,
          title: "Screen Calibration",
          instruction:
            "Adjust the calibration slider to match the physical width of an ID or payment card (85.60 mm) for physical print accuracy.",
          tip: "Keep browser zoom at default 100% for crisp character rendering.",
        },
        {
          stepNumber: 4,
          title: "Reading Progressive Numbers",
          instruction:
            "Identify the numbers in the highlighted row on the Rosenbaum chart. Type them into the digit slots using your keyboard or on-screen keypad.",
          tip: "Each row progresses from large headline print down to fine documentation print.",
        },
        {
          stepNumber: 5,
          title: "Unreadable Rows & Scoring",
          instruction:
            "If a line is too small to read clearly, click 'Cannot read this line'. The screener determines the smallest line you successfully read (>50% correct numbers).",
          tip: "Educational screening only; does not diagnose presbyopia, hyperopia, or astigmatism.",
        },
      ],
    },
    "color-vision": {
      testId: "color-vision",
      testTitle: "Ishihara Color Vision Screening",
      totalSteps: 4,
      steps: [
        {
          stepNumber: 1,
          title: "Screen Viewing & Posture",
          instruction:
            "Position yourself comfortably about 50 cm (~20 inches) from your screen, facing it perpendicularly.",
          tip: "Do not view the screen at an extreme angle, as color shifts can occur.",
        },
        {
          stepNumber: 2,
          title: "Lighting & Display Color Settings",
          instruction:
            "Ensure natural or neutral room illumination. Disable Night Light, True Tone, or blue-light filter apps, which alter color spectrums.",
          tip: "Set your monitor brightness to a normal, comfortable level.",
        },
        {
          stepNumber: 3,
          title: "Identifying Hidden Numbers",
          instruction:
            "Examine each circular plate composed of colored dots. Look for a hidden numeral within the mosaic pattern.",
          tip: "Select the number you clearly distinguish within 5 to 7 seconds.",
        },
        {
          stepNumber: 4,
          title: "Uncertain or Invisible Plates",
          instruction:
            "If you do not see any recognizable number in the pattern, select 'Nothing visible'. Do not guess arbitrarily.",
          tip: "Demonstration screener only; clinical diagnosis requires physical daylight illumination and standardized Ishihara booklets.",
        },
      ],
    },
  },
  ur: {
    "distance-vision": {
      testId: "distance-vision",
      testTitle: "سنیلن فاصلاتی بصارت کی اسکریننگ",
      totalSteps: 5,
      steps: [
        {
          stepNumber: 1,
          title: "دیکھنے کا فاصلہ اور نشست",
          instruction:
            "اسکرین سے تقریباً 1.5 میٹر (تقریباً 5 فٹ) کے فاصلے پر سیدھے بیٹھیں۔ دونوں آنکھیں کھلی رکھیں۔",
          tip: "اپنی کرسی اس طرح رکھیں کہ آپ کا چہرہ بالکل اسکرین کے سامنے ہو۔",
        },
        {
          stepNumber: 2,
          title: "کمرے کی روشنی",
          instruction:
            "کمرے میں مناسب اور متوازن روشنی کو یقینی بنائیں۔ اسکرین پر کھڑکی کی تیز دھوپ یا بلب کا عکس نہ پڑنے دیں۔",
          tip: "اگر اسکرین پر نائٹ لائٹ یا رنگ مدہم کرنے والا فلٹر لگا ہے تو اسے بند کر دیں۔",
        },
        {
          stepNumber: 3,
          title: "اسکرین کا سائز درست کرنا (کیلیبریشن)",
          instruction:
            "اسکرین پر دیے گئے سلائیڈر کو کسی عام شناختی کارڈ یا اے ٹی ایم کارڈ (85.60 ملی میٹر) کے برابر ایڈجسٹ کریں۔",
          tip: "اگر کارڈ موجود نہیں ہے تو پہلے سے موجود معیاری تخمینہ استعمال کیا جائے گا۔",
        },
        {
          stepNumber: 4,
          title: "حروف کی شناخت اور درج کرنا",
          instruction:
            "سنیلن چارٹ پر نمایاں کی گئی قطار کو دیکھیں۔ جو حروف آپ کو نظر آئیں انہیں کی بورڈ کی مدد سے بائیں سے دائیں ٹائپ کریں۔",
          tip: "اگلی قطار پر جانے کے لیے انٹر (Enter) دبائیں یا بٹن پر کلک کریں۔",
        },
        {
          stepNumber: 5,
          title: "ناقابلِ قرأت قطار اور اختتام",
          instruction:
            "اگر کوئی قطار بہت چھوٹی ہو اور پڑھی نہ جائے تو 'Cannot read this line' منتخب کریں۔ اگر آدھے سے زیادہ حروف درست ہوں تو قطار کامیاب سمجھی جاتی ہے۔",
          tip: "چھوٹی قطاروں کی کوشش کے بعد آپ ٹیسٹ کو وہیں مکمل بھی کر سکتے ہیں۔",
        },
      ],
    },
    "near-vision": {
      testId: "near-vision",
      testTitle: "روزن بام قریبی بصارت ریڈنگ چارٹ",
      totalSteps: 5,
      steps: [
        {
          stepNumber: 1,
          title: "14 انچ کا قریبی فاصلہ",
          instruction:
            "اپنے موبائل یا اسکرین کو اپنی آنکھوں سے تقریباً 14 انچ (35 سینٹی میٹر) کے فاصلے پر رکھیں۔",
          tip: "آسان پیمانہ یہ ہے کہ کہنی سے لے کر بند مٹھی تک کا فاصلہ تقریباً 14 انچ ہوتا ہے۔",
        },
        {
          stepNumber: 2,
          title: "پڑھنے کا چشمہ",
          instruction:
            "اگر آپ عام طور پر قریب کے مطالعے کے لیے چشمہ استعمال کرتے ہیں تو اس ٹیسٹ کے دوران اپنا چشمہ ضرور پہنیں۔",
          tip: "اسکرین پر چشمے والے آپشن کو منتخب کریں تاکہ نتائج میں یہ بات واضح رہے۔",
        },
        {
          stepNumber: 3,
          title: "اسکرین اسکیلنگ کیلیبریشن",
          instruction:
            "کارڈ سلائیڈر کو اصلی کارڈ کی چوڑائی (85.60 ملی میٹر) کے برابر ایڈجسٹ کریں تاکہ ہندسوں کا سائز درست رہے۔",
          tip: "براؤزر کا زوم 100 فیصد پر رکھیں تاکہ ہندسے بالکل صاف نظر آئیں۔",
        },
        {
          stepNumber: 4,
          title: "ہندسوں کی شناخت",
          instruction:
            "روزن بام چارٹ کی نمایاں قطار میں موجود ہندسوں کو دیکھیں اور کی بورڈ یا اسکرین پیڈ کے ذریعے بائیں سے دائیں درج کریں۔",
          tip: "پہلی قطار سب سے بڑی ہے جبکہ آٹھویں قطار سب سے باریک ہے۔",
        },
        {
          stepNumber: 5,
          title: "ناقابلِ قرأت قطار اور نتیجہ",
          instruction:
            "اگر ہندسے پڑھے نہ جائیں تو 'Cannot read this line' پر کلک کریں۔ سسٹم آپ کی سب سے باریک پڑھی گئی قطار کا تعین کرے گا۔",
          tip: "یہ صرف تعلیمی اسکریننگ ہے؛ یہ ضعیف البصری (Presbyopia) کی طبی تشخیص نہیں ہے۔",
        },
      ],
    },
    "color-vision": {
      testId: "color-vision",
      testTitle: "اشیہارا رنگوں کی بصارت کی اسکریننگ",
      totalSteps: 4,
      steps: [
        {
          stepNumber: 1,
          title: "دیکھنے کا فاصلہ اور پوزیشن",
          instruction:
            "اسکرین سے تقریباً 50 سینٹی میٹر (20 انچ) کے فاصلے پر سیدھے بیٹھ کر دیکھیں۔",
          tip: "اسکرین کو ترچھا نہ دیکھیں کیونکہ زاویہ بدلنے سے رنگ تبدیل ہو سکتے ہیں۔",
        },
        {
          stepNumber: 2,
          title: "روشنی اور نائٹ لائٹ فلٹر",
          instruction:
            "کمرے میں قدرتی یا مناسب روشنی ہو۔ نائٹ موڈ یا بلیو لائٹ فلٹر کو بند کر دیں کیونکہ یہ رنگوں کے توازن کو تبدیل کر دیتے ہیں۔",
          tip: "اسکرین کی چمک (Brightness) کو درمیانے اور آرام دہ درجے پر رکھیں۔",
        },
        {
          stepNumber: 3,
          title: "پوشیدہ ہندسوں کی شناخت",
          instruction:
            "رنگ برنگے نقطوں پر مشتمل دائرے کو دیکھیں۔ نقطوں کے درمیان چھپے ہوئے ہندسے کو پہچاننے کی کوشش کریں۔",
          tip: "پلیٹ دیکھنے کے بعد 5 سے 7 سیکنڈ کے اندر نظر آنے والے ہندسے کا انتخاب کریں۔",
        },
        {
          stepNumber: 4,
          title: "غیر واضح پلیٹ کا جواب",
          instruction:
            "اگر آپ کو کوئی ہندسہ واضح طور پر نظر نہ آئے تو 'Nothing visible' منتخب کریں۔ اندازے سے جواب مت دیں۔",
          tip: "یہ ایک نمائشی اسکریننگ ہے۔ مکمل معائنے کے لیے ماہرِ امراضِ چشم سے رجوع کریں۔",
        },
      ],
    },
  },
};

