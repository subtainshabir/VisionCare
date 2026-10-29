import type { TestMetadata, TestItem } from "@/types/test-engine";

export interface RosenbaumLineData {
  [key: string]: unknown;
  lineNumber: number;
  characters: string;
  distanceEquivalent: string;
  jaegerEquivalent: string;
  decimalAcuity: number;
  relativeScale: number;
  minPassCount: number;
  pointSize: number;
  defaultPixelHeight: number;
  linePurpose: string;
}

export interface NearDisplayCalibration {
  pixelsPerMm: number;
  viewingDistanceCm: number;
  isCardCalibrated: boolean;
  wearsReadingGlasses: boolean;
}

export const DEFAULT_NEAR_CALIBRATION: NearDisplayCalibration = {
  pixelsPerMm: 3.7795, // Standard 96 DPI (96 / 25.4)
  viewingDistanceCm: 35, // Standard Rosenbaum distance: 14 inches (~35 cm)
  isCardCalibrated: false,
  wearsReadingGlasses: false,
};

export const STANDARD_CARD_WIDTH_MM = 85.6; // ISO/IEC 7810 ID-1

export function calculateNearCharacterHeight(
  relativeScale: number,
  calibration: NearDisplayCalibration
): number {
  const baseSizeAt35cmPx = 11; // Line 8 (20/20 equiv) baseline size
  const distanceRatio = calibration.viewingDistanceCm / 35;
  const dpiRatio = calibration.pixelsPerMm / 3.7795;

  const scaledPx = Math.round(
    baseSizeAt35cmPx * Math.pow(relativeScale, 0.72) * distanceRatio * dpiRatio
  );

  return Math.max(10, Math.min(84, scaledPx));
}

export const rosenbaumChartLines: RosenbaumLineData[] = [
  {
    lineNumber: 1,
    characters: "95",
    distanceEquivalent: "20/400",
    jaegerEquivalent: "J14",
    decimalAcuity: 0.05,
    relativeScale: 20.0,
    minPassCount: 1,
    pointSize: 20,
    defaultPixelHeight: 72,
    linePurpose: "Large headline print baseline (Line 1)",
  },
  {
    lineNumber: 2,
    characters: "874",
    distanceEquivalent: "20/200",
    jaegerEquivalent: "J10",
    decimalAcuity: 0.1,
    relativeScale: 10.0,
    minPassCount: 2,
    pointSize: 14,
    defaultPixelHeight: 52,
    linePurpose: "Large reading print threshold (Line 2)",
  },
  {
    lineNumber: 3,
    characters: "6385",
    distanceEquivalent: "20/100",
    jaegerEquivalent: "J7",
    decimalAcuity: 0.2,
    relativeScale: 5.0,
    minPassCount: 3,
    pointSize: 10,
    defaultPixelHeight: 38,
    linePurpose: "Moderate print / sub-heading scale (Line 3)",
  },
  {
    lineNumber: 4,
    characters: "87452",
    distanceEquivalent: "20/70",
    jaegerEquivalent: "J5",
    decimalAcuity: 0.29,
    relativeScale: 3.5,
    minPassCount: 3,
    pointSize: 8,
    defaultPixelHeight: 28,
    linePurpose: "Standard newsprint body text (Line 4)",
  },
  {
    lineNumber: 5,
    characters: "42836",
    distanceEquivalent: "20/50",
    jaegerEquivalent: "J3",
    decimalAcuity: 0.4,
    relativeScale: 2.5,
    minPassCount: 3,
    pointSize: 7,
    defaultPixelHeight: 22,
    linePurpose: "Pocket book / magazine text scale (Line 5)",
  },
  {
    lineNumber: 6,
    characters: "374258",
    distanceEquivalent: "20/40",
    jaegerEquivalent: "J2",
    decimalAcuity: 0.5,
    relativeScale: 2.0,
    minPassCount: 4,
    pointSize: 6,
    defaultPixelHeight: 18,
    linePurpose: "Standard comfortable reading acuity (Line 6)",
  },
  {
    lineNumber: 7,
    characters: "937826",
    distanceEquivalent: "20/30",
    jaegerEquivalent: "J1",
    decimalAcuity: 0.67,
    relativeScale: 1.5,
    minPassCount: 4,
    pointSize: 5,
    defaultPixelHeight: 14,
    linePurpose: "Fine documentation print (Line 7)",
  },
  {
    lineNumber: 8,
    characters: "425783",
    distanceEquivalent: "20/20",
    jaegerEquivalent: "J1+",
    decimalAcuity: 1.0,
    relativeScale: 1.0,
    minPassCount: 4,
    pointSize: 4,
    defaultPixelHeight: 11,
    linePurpose: "Reference high-resolution reading line (Line 8)",
  },
];

export const TOTAL_ROSENBAUM_CHARACTERS = rosenbaumChartLines.reduce(
  (sum, line) => sum + line.characters.length,
  0
); // 2 + 3 + 4 + 5 + 5 + 6 + 6 + 6 = 37 characters

export const nearVisionMetadata: TestMetadata = {
  id: "near-vision-screening",
  title: "Rosenbaum Near Vision Reading Chart",
  category: "Near Visual Acuity (Screening)",
  description:
    "An interactive Rosenbaum-style near vision screening chart with calibrated 14-inch (35 cm) viewing distance, progressive character sizing, and Jaeger / distance-equivalent scoring.",
  estimatedDurationMinutes: 2,
  allowPrevious: true,
  requireAnswerToAdvance: true,
  instructions: [
    "Hold or position your screen approximately 14 inches (35 cm) from your eyes — about the distance from your elbow to your knuckles.",
    "Put on your normal reading glasses, bifocals, or contact lenses if you typically wear them for close reading.",
    "Ensure comfortable, even room lighting without direct lamp reflections on the screen.",
    "Keep your browser zoom level set at default 100%.",
    "Calibrate screen scaling using a standard card for physical accuracy, or use the standard display estimate.",
    "Look at the highlighted line on the near chart and type the numbers you see from left to right.",
    "If a line is too small or blurry to read, select 'Cannot read this line' to advance.",
  ],
};

export const nearVisionItems: Array<TestItem<string>> = rosenbaumChartLines.map(
  (line) => ({
    id: `nv-line-0${line.lineNumber}`,
    title: `Line ${line.lineNumber} of ${rosenbaumChartLines.length} (${line.distanceEquivalent} &bull; ${line.jaegerEquivalent})`,
    prompt: `Identify the ${line.characters.length} number${line.characters.length > 1 ? "s" : ""} in Line ${line.lineNumber}:`,
    hint: `Near print line displayed at ${line.distanceEquivalent} (${line.jaegerEquivalent}) equivalent scale.`,
    stimulusData: line,
  })
);
