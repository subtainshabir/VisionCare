import type { TestMetadata, TestItem, TestItemOption } from "@/types/test-engine";

export type GeometricShape =
  | "CIRCLE"
  | "TRIANGLE"
  | "SQUARE"
  | "DIAMOND"
  | "STAR"
  | "CROSS"
  | "CANNOT_TELL";

export interface ColorVisionStimulusData {
  shape: GeometricShape;
  paletteType:
    | "control"
    | "red-green-protan"
    | "red-green-deutan"
    | "blue-yellow-tritan"
    | "control-blue";
  purposeDescription: string;
  targetPair: string;
  foregroundColors: string[];
  backgroundColors: string[];
}

export const colorVisionMetadata: TestMetadata = {
  id: "color-vision-screening",
  title: "Color Vision Screening Demonstration",
  category: "Color Discrimination (Demonstration)",
  description:
    "An educational demonstration assessing chromatic discernment across red-green and blue-yellow combinations using calibrated geometric shapes.",
  estimatedDurationMinutes: 3,
  allowPrevious: true,
  requireAnswerToAdvance: true,
  instructions: [
    "Use a standard, reasonably calibrated display without heavy color distortion.",
    "Disable Night Mode, f.lux, True Tone, or blue-light filter software that alters screen warmth.",
    "Ensure comfortable, balanced room lighting and avoid direct glare or screen reflections.",
    "Position yourself at a natural viewing distance (~50-70 cm from desktop, ~35-40 cm from mobile).",
    "Inspect the geometric shape embedded in each matrix pattern.",
    "Select the answer choice that best matches what you perceive, or select 'I cannot tell'.",
  ],
};

const standardShapeOptions: Array<TestItemOption<GeometricShape>> = [
  { value: "CIRCLE", label: "Circle" },
  { value: "TRIANGLE", label: "Triangle" },
  { value: "SQUARE", label: "Square" },
  { value: "DIAMOND", label: "Diamond" },
  { value: "STAR", label: "Star" },
  { value: "CROSS", label: "Cross" },
  { value: "CANNOT_TELL", label: "I cannot tell / Indistinct" },
];

export const colorVisionItems: Array<TestItem<GeometricShape>> = [
  {
    id: "cv-item-01",
    title: "Item 1 of 6: High-Contrast Control",
    prompt: "Identify the geometric shape embedded in the circular matrix below:",
    hint: "High-contrast task comprehension control.",
    stimulusData: {
      shape: "CIRCLE",
      paletteType: "control",
      purposeDescription: "High-contrast validation control to verify task comprehension.",
      targetPair: "Deep Teal on Light Slate",
      foregroundColors: ["#0f766e", "#115e59", "#134e4a"],
      backgroundColors: ["#e2e8f0", "#cbd5e1", "#f1f5f9"],
    },
    options: standardShapeOptions,
  },
  {
    id: "cv-item-02",
    title: "Item 2 of 6: Red-Green Discrimination (A)",
    prompt: "Identify the geometric shape embedded in the circular matrix below:",
    hint: "Warm reddish foreground paired against olive-green matrix.",
    stimulusData: {
      shape: "TRIANGLE",
      paletteType: "red-green-protan",
      purposeDescription: "Demonstrates warm-red vs olive-green chromatic discernment.",
      targetPair: "Warm Crimson on Olive Green",
      foregroundColors: ["#dc2626", "#ef4444", "#b91c1c"],
      backgroundColors: ["#65a30d", "#84cc16", "#4d7c0f"],
    },
    options: standardShapeOptions,
  },
  {
    id: "cv-item-03",
    title: "Item 3 of 6: Red-Green Discrimination (B)",
    prompt: "Identify the geometric shape embedded in the circular matrix below:",
    hint: "Emerald green foreground paired against terracotta rust matrix.",
    stimulusData: {
      shape: "SQUARE",
      paletteType: "red-green-deutan",
      purposeDescription: "Demonstrates emerald-green vs terracotta chromatic discernment.",
      targetPair: "Emerald Green on Terracotta Rust",
      foregroundColors: ["#16a34a", "#22c55e", "#15803d"],
      backgroundColors: ["#ea580c", "#c2410c", "#f97316"],
    },
    options: standardShapeOptions,
  },
  {
    id: "cv-item-04",
    title: "Item 4 of 6: Blue-Yellow Discrimination (A)",
    prompt: "Identify the geometric shape embedded in the circular matrix below:",
    hint: "Cobalt blue foreground paired against warm ochre yellow matrix.",
    stimulusData: {
      shape: "DIAMOND",
      paletteType: "blue-yellow-tritan",
      purposeDescription: "Demonstrates blue vs yellow chromatic discernment.",
      targetPair: "Cobalt Blue on Ochre Yellow",
      foregroundColors: ["#2563eb", "#1d4ed8", "#3b82f6"],
      backgroundColors: ["#ca8a04", "#eab308", "#a16207"],
    },
    options: standardShapeOptions,
  },
  {
    id: "cv-item-05",
    title: "Item 5 of 6: Blue-Yellow Discrimination (B)",
    prompt: "Identify the geometric shape embedded in the circular matrix below:",
    hint: "Amber gold foreground paired against cyan-teal matrix.",
    stimulusData: {
      shape: "STAR",
      paletteType: "blue-yellow-tritan",
      purposeDescription: "Demonstrates yellow-amber vs cyan-blue chromatic discernment.",
      targetPair: "Amber Gold on Cyan Teal",
      foregroundColors: ["#d97706", "#f59e0b", "#b45309"],
      backgroundColors: ["#0284c7", "#0369a1", "#0891b2"],
    },
    options: standardShapeOptions,
  },
  {
    id: "cv-item-06",
    title: "Item 6 of 6: High-Contrast Control Verification",
    prompt: "Identify the geometric shape embedded in the circular matrix below:",
    hint: "Secondary high-contrast task verification.",
    stimulusData: {
      shape: "CROSS",
      paletteType: "control-blue",
      purposeDescription: "Secondary task comprehension verification.",
      targetPair: "Deep Navy on Light Sky",
      foregroundColors: ["#1e1b4b", "#1e293b", "#334155"],
      backgroundColors: ["#bae6fd", "#e0f2fe", "#f0f9ff"],
    },
    options: standardShapeOptions,
  },
];
