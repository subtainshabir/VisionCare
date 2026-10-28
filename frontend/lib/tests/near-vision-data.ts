import type { TestMetadata, TestItem, TestItemOption } from "@/types/test-engine";

export interface NearVisionStimulusData {
  passage: string;
  targetWord: string;
  stepLabel: string;
  stepPurpose: string;
  relativeScale: "xl" | "lg" | "md" | "sm" | "xs";
  fontClass: string;
  approximatePixelHeight: number;
}

export const nearVisionMetadata: TestMetadata = {
  id: "near-vision-screening",
  title: "Near Vision Reading Demonstration",
  category: "Near-Point Reading (Demonstration)",
  description:
    "An educational demonstration presenting graded typographic passages and character sequences at close reading distance to explore digital reading experiences.",
  estimatedDurationMinutes: 3,
  allowPrevious: true,
  requireAnswerToAdvance: true,
  instructions: [
    "Position your screen at a comfortable, habitual close-reading distance (typically ~35 to 40 cm for smartphones/tablets, or your natural reading distance for laptops/desktops). Note that viewing distance alone does not physically calibrate your screen.",
    "Wear your usual reading glasses, bifocals, or contact lenses if you normally rely on corrective eyewear for close reading.",
    "Ensure comfortable, consistent ambient room lighting without screen glare or direct lamp reflections.",
    "Keep your browser zoom level set at default 100% and avoid changing display scaling during the session.",
    "Read the text passage presented in the reading card, then identify the requested verification word either by typing it or selecting from the choices below, or select 'I cannot read this'.",
    "Stop the demonstration immediately if you experience eyestrain, headache, or visual fatigue.",
  ],
};

const makeOptions = (
  target: string,
  distractors: string[]
): Array<TestItemOption<string>> => {
  const words = [target, ...distractors];
  // Deterministic order based on alphabetical sort so options are stable and reproducible
  const sorted = [...words].sort((a, b) => a.localeCompare(b));

  const options: Array<TestItemOption<string>> = sorted.map((word) => ({
    value: word,
    label: word,
    shortcut: word.charAt(0).toUpperCase(),
  }));

  options.push({
    value: "CANNOT_READ",
    label: "I cannot read this / Text is blurry",
    shortcut: "Unsure",
  });

  return options;
};

export const nearVisionItems: Array<TestItem<string>> = [
  {
    id: "nv-item-01",
    title: "Step 1 of 5: Baseline Reading Print",
    prompt: "Read the passage above, then identify the key word from the text:",
    hint: "High-magnitude baseline reading text.",
    stimulusData: {
      passage: "The morning sun warmed the quiet garden path.",
      targetWord: "garden",
      stepLabel: "Baseline Reading Print (Step 1)",
      stepPurpose: "Verifies high-contrast reading legibility at large print scale.",
      relativeScale: "xl",
      fontClass: "text-2xl sm:text-3xl",
      approximatePixelHeight: 28,
    },
    options: makeOptions("garden", ["harbor", "castle", "bridge"]),
  },
  {
    id: "nv-item-02",
    title: "Step 2 of 5: Moderate Reading Print",
    prompt: "Read the passage above, then identify the key word from the text:",
    hint: "Moderate print scale step.",
    stimulusData: {
      passage: "Clear spring water flowed through the green valley.",
      targetWord: "valley",
      stepLabel: "Moderate Reading Print (Step 2)",
      stepPurpose: "Presents reduced typographic scale simulating large book print.",
      relativeScale: "lg",
      fontClass: "text-xl sm:text-2xl",
      approximatePixelHeight: 22,
    },
    options: makeOptions("valley", ["desert", "island", "forest"]),
  },
  {
    id: "nv-item-03",
    title: "Step 3 of 5: Standard Body Print",
    prompt: "Read the passage above, then identify the key word from the text:",
    hint: "Standard body text reading scale.",
    stimulusData: {
      passage: "A gentle breeze whispered across the open fields.",
      targetWord: "breeze",
      stepLabel: "Standard Body Print (Step 3)",
      stepPurpose: "Simulates typical standard document and website body text scale.",
      relativeScale: "md",
      fontClass: "text-base sm:text-lg",
      approximatePixelHeight: 16,
    },
    options: makeOptions("breeze", ["shadow", "stream", "meadow"]),
  },
  {
    id: "nv-item-04",
    title: "Step 4 of 5: Compact Reading Print",
    prompt: "Read the passage above, then identify the key word from the text:",
    hint: "Compact print scale step.",
    stimulusData: {
      passage: "Silver clouds drifted slowly above the tall pine trees.",
      targetWord: "clouds",
      stepLabel: "Compact Reading Print (Step 4)",
      stepPurpose: "Tests close-range typographic legibility at compact print scale.",
      relativeScale: "sm",
      fontClass: "text-sm sm:text-base",
      approximatePixelHeight: 14,
    },
    options: makeOptions("clouds", ["rivers", "stones", "leaves"]),
  },
  {
    id: "nv-item-05",
    title: "Step 5 of 5: Fine Reading Print",
    prompt: "Read the passage above, then identify the key word from the text:",
    hint: "Smallest demonstration reading step.",
    stimulusData: {
      passage: "Bright stars illuminated the winding stone trail tonight.",
      targetWord: "stars",
      stepLabel: "Fine Reading Print (Step 5)",
      stepPurpose: "Demonstrates reading resolution threshold under browser conditions.",
      relativeScale: "xs",
      fontClass: "text-xs sm:text-sm",
      approximatePixelHeight: 12,
    },
    options: makeOptions("stars", ["sparks", "lights", "trails"]),
  },
];
