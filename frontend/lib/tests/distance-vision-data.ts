import type { TestMetadata, TestItem } from "@/types/test-engine";

export type SnellenOptotype =
  | "C"
  | "D"
  | "E"
  | "F"
  | "L"
  | "O"
  | "P"
  | "T"
  | "Z";

export interface SnellenRowData {
  [key: string]: unknown;
  rowNumber: number;
  letters: string;
  snellenFraction: string;
  decimalAcuity: number;
  relativeScale: number;
  minPassCount: number;
  stepPurpose: string;
  defaultPixelHeight: number;
}

export interface DisplayCalibration {
  pixelsPerMm: number;
  viewingDistanceMeters: number;
  isCardCalibrated: boolean;
}

export const DEFAULT_CALIBRATION: DisplayCalibration = {
  pixelsPerMm: 3.7795, // Standard 96 DPI (96 / 25.4)
  viewingDistanceMeters: 1.5,
  isCardCalibrated: false,
};

export const STANDARD_CARD_WIDTH_MM = 85.6; // ISO/IEC 7810 ID-1 standard

export function calculateRowPixelHeight(
  relativeScale: number,
  calibration: DisplayCalibration
): number {
  // 5 arcminutes subtense formula: heightMm = D * 2 * tan(5' * relativeScale / 2)
  const distanceMm = calibration.viewingDistanceMeters * 1000;
  const radians = ((5 * relativeScale) / 60) * (Math.PI / 180);
  const heightMm = distanceMm * Math.tan(radians);
  const calculatedPx = heightMm * calibration.pixelsPerMm;

  // Clamp within reasonable physical bounds for screen presentation
  return Math.max(9, Math.min(130, Math.round(calculatedPx)));
}

export const snellenChartRows: SnellenRowData[] = [
  {
    rowNumber: 1,
    letters: "E",
    snellenFraction: "20/200",
    decimalAcuity: 0.1,
    relativeScale: 10.0,
    minPassCount: 1,
    stepPurpose: "High-magnitude baseline optotype (Row 1)",
    defaultPixelHeight: 88,
  },
  {
    rowNumber: 2,
    letters: "FP",
    snellenFraction: "20/100",
    decimalAcuity: 0.2,
    relativeScale: 5.0,
    minPassCount: 2,
    stepPurpose: "Large scale two-optotype verification (Row 2)",
    defaultPixelHeight: 60,
  },
  {
    rowNumber: 3,
    letters: "TOZ",
    snellenFraction: "20/70",
    decimalAcuity: 0.29,
    relativeScale: 3.5,
    minPassCount: 2,
    stepPurpose: "Moderate scale three-optotype verification (Row 3)",
    defaultPixelHeight: 44,
  },
  {
    rowNumber: 4,
    letters: "LPED",
    snellenFraction: "20/50",
    decimalAcuity: 0.4,
    relativeScale: 2.5,
    minPassCount: 3,
    stepPurpose: "Intermediate scale four-optotype progression (Row 4)",
    defaultPixelHeight: 32,
  },
  {
    rowNumber: 5,
    letters: "PECFD",
    snellenFraction: "20/40",
    decimalAcuity: 0.5,
    relativeScale: 2.0,
    minPassCount: 3,
    stepPurpose: "Standard driving acuity reference threshold (Row 5)",
    defaultPixelHeight: 26,
  },
  {
    rowNumber: 6,
    letters: "EDFCZP",
    snellenFraction: "20/30",
    decimalAcuity: 0.67,
    relativeScale: 1.5,
    minPassCount: 4,
    stepPurpose: "High-resolution six-optotype fine detail line (Row 6)",
    defaultPixelHeight: 20,
  },
  {
    rowNumber: 7,
    letters: "FELOPZD",
    snellenFraction: "20/20",
    decimalAcuity: 1.0,
    relativeScale: 1.0,
    minPassCount: 4,
    stepPurpose: "Standard reference visual acuity line (Row 7)",
    defaultPixelHeight: 14,
  },
];

export const TOTAL_SNELLEN_LETTERS = snellenChartRows.reduce(
  (sum, row) => sum + row.letters.length,
  0
); // 1 + 2 + 3 + 4 + 5 + 6 + 7 = 28 letters

export const distanceVisionMetadata: TestMetadata = {
  id: "distance-vision-screening",
  title: "Snellen-Style Distance Vision Demonstration",
  category: "Visual Acuity (Demonstration)",
  description:
    "An interactive Snellen-style distance vision screening chart with screen calibration, row-by-row letter entry, and visual acuity estimation.",
  estimatedDurationMinutes: 2,
  allowPrevious: true,
  requireAnswerToAdvance: true,
  instructions: [
    "Position your screen directly at eye level in an evenly lit room without window glare or screen reflections.",
    "Maintain standard 100% browser zoom level throughout the screening session.",
    "Position yourself at the intended viewing distance (standard recommended: 1.5 meters / ~5 feet).",
    "Calibrate your screen size using a standard plastic card (credit card / ID card) for accurate physical sizing, or proceed with the standard display estimate.",
    "Keep both eyes open, observe the highlighted row on the Snellen chart, and type the letters you see from left to right.",
    "If a row is too small or unreadable, click 'Cannot read this row' to advance.",
  ],
};

export const distanceVisionItems: Array<TestItem<string>> = snellenChartRows.map(
  (row) => ({
    id: `dv-row-0${row.rowNumber}`,
    title: `Row ${row.rowNumber} of ${snellenChartRows.length} (${row.snellenFraction})`,
    prompt: `Identify the ${row.letters.length} letter${row.letters.length > 1 ? "s" : ""} in Row ${row.rowNumber}:`,
    hint: `Letters displayed at ${row.snellenFraction} equivalent scale.`,
    stimulusData: row,
  })
);
