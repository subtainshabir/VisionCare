import type { TestMetadata, TestItem, TestItemOption } from "@/types/test-engine";

export type SnellenOptotype =
  | "E"
  | "F"
  | "P"
  | "T"
  | "O"
  | "Z"
  | "L"
  | "D"
  | "C"
  | "CANNOT_TELL";

export interface DistanceVisionStimulusData {
  optotype: SnellenOptotype;
  stepLabel: string;
  stepPurpose: string;
  relativeScale: "xl" | "lg" | "md" | "sm" | "xs";
  fontClass: string;
  pixelHeightEstimate: number;
}

export const distanceVisionMetadata: TestMetadata = {
  id: "distance-vision-screening",
  title: "Snellen-Style Distance Vision Demonstration",
  category: "Visual Acuity (Demonstration)",
  description:
    "An educational demonstration presenting high-contrast letter optotypes to explore the user experience of browser-based distance screening.",
  estimatedDurationMinutes: 3,
  allowPrevious: true,
  requireAnswerToAdvance: true,
  instructions: [
    "Sit in a comfortable, upright seated position with your display positioned directly ahead at eye level.",
    "Keep your browser zoom level set at standard 100% and avoid changing display scaling during the session.",
    "Ensure comfortable, even room lighting without direct screen reflections or lamp glare.",
    "Position yourself at a natural viewing distance (~1.5 to 2 meters if using a desktop/laptop, or as far as practical). Note that viewing distance alone does not physically calibrate consumer displays.",
    "Test with both eyes open. (This demonstration evaluates binocular optotype recognition and does not independently test each eye).",
    "Carefully observe the letter optotype presented on the chart and select the matching choice, or select 'I cannot tell'.",
    "Stop the demonstration immediately if you experience eyestrain or physical discomfort.",
  ],
};

const makeOptions = (
  letters: SnellenOptotype[]
): Array<TestItemOption<SnellenOptotype>> => {
  const options: Array<TestItemOption<SnellenOptotype>> = letters.map((l) => ({
    value: l,
    label: `Letter ${l}`,
    shortcut: l,
  }));
  options.push({
    value: "CANNOT_TELL",
    label: "I cannot tell / Unclear",
    shortcut: "Unsure",
  });
  return options;
};

export const distanceVisionItems: Array<TestItem<SnellenOptotype>> = [
  {
    id: "dv-item-01",
    title: "Step 1 of 5: Baseline High-Magnitude Optotype",
    prompt: "Identify the letter optotype displayed on the chart above:",
    hint: "High-magnitude baseline optotype presentation.",
    stimulusData: {
      optotype: "E",
      stepLabel: "Baseline Optotype (Step 1)",
      stepPurpose: "Verifies high-contrast optotype recognition at large scale.",
      relativeScale: "xl",
      fontClass: "text-7xl sm:text-8xl",
      pixelHeightEstimate: 88,
    },
    options: makeOptions(["E", "F", "P", "T"]),
  },
  {
    id: "dv-item-02",
    title: "Step 2 of 5: Moderate-Scale Optotype",
    prompt: "Identify the letter optotype displayed on the chart above:",
    hint: "Moderate-scale optotype step.",
    stimulusData: {
      optotype: "F",
      stepLabel: "Moderate Scale (Step 2)",
      stepPurpose: "Presents reduced optotype geometry.",
      relativeScale: "lg",
      fontClass: "text-5xl sm:text-6xl",
      pixelHeightEstimate: 60,
    },
    options: makeOptions(["F", "P", "E", "T"]),
  },
  {
    id: "dv-item-03",
    title: "Step 3 of 5: Intermediate-Scale Optotype",
    prompt: "Identify the letter optotype displayed on the chart above:",
    hint: "Intermediate optotype step.",
    stimulusData: {
      optotype: "P",
      stepLabel: "Intermediate Scale (Step 3)",
      stepPurpose: "Demonstrates letter clarity at intermediate scale.",
      relativeScale: "md",
      fontClass: "text-3xl sm:text-4xl",
      pixelHeightEstimate: 40,
    },
    options: makeOptions(["P", "F", "T", "O"]),
  },
  {
    id: "dv-item-04",
    title: "Step 4 of 5: Compact-Scale Optotype",
    prompt: "Identify the letter optotype displayed on the chart above:",
    hint: "Compact-scale optotype step.",
    stimulusData: {
      optotype: "Z",
      stepLabel: "Compact Scale (Step 4)",
      stepPurpose: "Tests angular resolution at reduced screen scale.",
      relativeScale: "sm",
      fontClass: "text-2xl sm:text-3xl",
      pixelHeightEstimate: 28,
    },
    options: makeOptions(["Z", "O", "T", "L"]),
  },
  {
    id: "dv-item-05",
    title: "Step 5 of 5: High-Precision Optotype",
    prompt: "Identify the letter optotype displayed on the chart above:",
    hint: "Smallest demonstration optotype step.",
    stimulusData: {
      optotype: "D",
      stepLabel: "High-Precision Scale (Step 5)",
      stepPurpose: "Demonstrates acuity threshold boundary under browser conditions.",
      relativeScale: "xs",
      fontClass: "text-lg sm:text-xl",
      pixelHeightEstimate: 18,
    },
    options: makeOptions(["D", "O", "C", "P"]),
  },
];
