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

export interface SnellenChartExample {
  id: string;
  name: string;
  description?: string;
  rows: SnellenRowData[];
}

export interface DistanceVisionQuestion {
  id: string;
  chartId: string;
  chartName: string;
  rowNumber: number;
  snellenFraction: string;
  decimalAcuity: number;
  relativeScale: number;
  minPassCount: number;
  stepPurpose: string;
  letters: string;
  expectedAnswer: string;
  defaultPixelHeight: number;
  prompt: string;
  stimulusData: SnellenRowData;
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

export const STANDARD_ROW_CONFIGS = [
  {
    rowNumber: 1,
    snellenFraction: "20/200",
    decimalAcuity: 0.1,
    relativeScale: 10.0,
    minPassCount: 1,
    stepPurpose: "High-magnitude baseline optotype (Row 1)",
    defaultPixelHeight: 88,
  },
  {
    rowNumber: 2,
    snellenFraction: "20/100",
    decimalAcuity: 0.2,
    relativeScale: 5.0,
    minPassCount: 2,
    stepPurpose: "Large scale two-optotype verification (Row 2)",
    defaultPixelHeight: 60,
  },
  {
    rowNumber: 3,
    snellenFraction: "20/70",
    decimalAcuity: 0.29,
    relativeScale: 3.5,
    minPassCount: 2,
    stepPurpose: "Moderate scale three-optotype verification (Row 3)",
    defaultPixelHeight: 44,
  },
  {
    rowNumber: 4,
    snellenFraction: "20/50",
    decimalAcuity: 0.4,
    relativeScale: 2.5,
    minPassCount: 3,
    stepPurpose: "Intermediate scale four-optotype progression (Row 4)",
    defaultPixelHeight: 32,
  },
  {
    rowNumber: 5,
    snellenFraction: "20/40",
    decimalAcuity: 0.5,
    relativeScale: 2.0,
    minPassCount: 3,
    stepPurpose: "Standard driving acuity reference threshold (Row 5)",
    defaultPixelHeight: 26,
  },
  {
    rowNumber: 6,
    snellenFraction: "20/30",
    decimalAcuity: 0.67,
    relativeScale: 1.5,
    minPassCount: 4,
    stepPurpose: "High-resolution six-optotype fine detail line (Row 6)",
    defaultPixelHeight: 20,
  },
  {
    rowNumber: 7,
    snellenFraction: "20/20",
    decimalAcuity: 1.0,
    relativeScale: 1.0,
    minPassCount: 4,
    stepPurpose: "Standard reference visual acuity line (Row 7)",
    defaultPixelHeight: 14,
  },
] as const;

export function buildChartRows(
  lettersByRow: readonly [string, string, string, string, string, string, string]
): SnellenRowData[] {
  return STANDARD_ROW_CONFIGS.map((config, idx) => ({
    ...config,
    letters: lettersByRow[idx],
  }));
}

// 55 distinct, clinically valid Snellen chart configurations
const RAW_CHART_DEFINITIONS: Array<{
  id: string;
  name: string;
  rows: [string, string, string, string, string, string, string];
}> = [
  { id: "snellen-chart-01", name: "Snellen Chart 01 (Classic Hermann Snellen)", rows: ["E", "FP", "TOZ", "LPED", "PECFD", "EDFCZP", "FELOPZD"] },
  { id: "snellen-chart-02", name: "Snellen Chart 02 (Green Clinical Variant)", rows: ["E", "TO", "LPD", "FECD", "EDTCZ", "FELOPD", "DEFCPOT"] },
  { id: "snellen-chart-03", name: "Snellen Chart 03 (Modern Contrast Variant A)", rows: ["C", "ZL", "PEC", "OPZT", "FZPLO", "TOCZED", "OZLCTDF"] },
  { id: "snellen-chart-04", name: "Snellen Chart 04 (Modern Contrast Variant B)", rows: ["D", "CF", "DFO", "DFLO", "DTOFC", "PLFTDO", "PTLCOED"] },
  { id: "snellen-chart-05", name: "Snellen Chart 05 (High-Acuity Sequence A)", rows: ["E", "ED", "ZTC", "CZPE", "LCPED", "ZCDTEL", "FDCZPLO"] },
  { id: "snellen-chart-06", name: "Snellen Chart 06 (High-Acuity Sequence B)", rows: ["F", "OP", "ELF", "TLED", "ZTEOF", "DOFPCT", "ETOPLDF"] },
  { id: "snellen-chart-07", name: "Snellen Chart 07 (Standard Sloan Variant A)", rows: ["L", "LT", "OPT", "POFC", "CDPLT", "LPTCEF", "CDZFPTE"] },
  { id: "snellen-chart-08", name: "Snellen Chart 08 (Standard Sloan Variant B)", rows: ["O", "DZ", "CDE", "EDTZ", "OEZDF", "CFDZPO", "LTOEDCP"] },
  { id: "snellen-chart-09", name: "Snellen Chart 09 (Balanced Contour Variant A)", rows: ["P", "PE", "ZFL", "CFLP", "TLPCO", "ETDFLZ", "PZDFLTE"] },
  { id: "snellen-chart-10", name: "Snellen Chart 10 (Balanced Contour Variant B)", rows: ["T", "TC", "TOD", "ZODE", "FDCTE", "POECDT", "OCTELFD"] },
  { id: "snellen-chart-11", name: "Snellen Chart 11 (Clinical Screening Set A)", rows: ["Z", "FL", "PLE", "TPCF", "ZPODL", "ZLFOPT", "FLZPDOT"] },
  { id: "snellen-chart-12", name: "Snellen Chart 12 (Clinical Screening Set B)", rows: ["E", "PO", "CFP", "DLEO", "ETCFP", "DCTLEZ", "ECPTLDO"] },
  { id: "snellen-chart-13", name: "Snellen Chart 13 (Acuity Metric Series 01)", rows: ["C", "DT", "DZT", "PFTZ", "LDFTO", "FPOCED", "DFOZLTE"] },
  { id: "snellen-chart-14", name: "Snellen Chart 14 (Acuity Metric Series 02)", rows: ["D", "CE", "ELO", "COED", "POZEC", "TLEZDO", "TPLCZED"] },
  { id: "snellen-chart-15", name: "Snellen Chart 15 (Acuity Metric Series 03)", rows: ["E", "ZF", "TCF", "LFZP", "TCDLZ", "CZFDLP", "ZOFTCLE"] },
  { id: "snellen-chart-16", name: "Snellen Chart 16 (Acuity Metric Series 04)", rows: ["F", "LD", "PDZ", "TDEC", "FEODT", "ETPLOC", "EDFLPZT"] },
  { id: "snellen-chart-17", name: "Snellen Chart 17 (Acuity Metric Series 05)", rows: ["L", "ET", "OLE", "OZPL", "PLFCO", "DFZETO", "CTODPLF"] },
  { id: "snellen-chart-18", name: "Snellen Chart 18 (Visual Baseline Series 01)", rows: ["O", "PZ", "TDF", "FDTO", "ZTEDP", "LCPOFD", "LEZPFTC"] },
  { id: "snellen-chart-19", name: "Snellen Chart 19 (Visual Baseline Series 02)", rows: ["P", "OF", "CPO", "CPLE", "CFLOZ", "TZCDLE", "POETZDF"] },
  { id: "snellen-chart-20", name: "Snellen Chart 20 (Visual Baseline Series 03)", rows: ["T", "LC", "ZET", "ETDZ", "ETDPF", "POFTDZ", "DFLCTPO"] },
  { id: "snellen-chart-21", name: "Snellen Chart 21 (Visual Baseline Series 04)", rows: ["Z", "TD", "FLD", "LFOC", "ODCLT", "CFLEOP", "ZCDELPT"] },
  { id: "snellen-chart-22", name: "Snellen Chart 22 (Visual Baseline Series 05)", rows: ["E", "EZ", "POC", "PTDZ", "FZPTE", "DTZCEF", "TFEOPLZ"] },
  { id: "snellen-chart-23", name: "Snellen Chart 23 (Randomized Acuity Series 01)", rows: ["C", "PF", "ETD", "CELF", "LCOFD", "LDFPZT", "CPTDZLO"] },
  { id: "snellen-chart-24", name: "Snellen Chart 24 (Randomized Acuity Series 02)", rows: ["D", "DO", "LZF", "ODPT", "TPEDZ", "OETCLD", "LFDTECO"] },
  { id: "snellen-chart-25", name: "Snellen Chart 25 (Randomized Acuity Series 03)", rows: ["E", "ZT", "CTE", "ZFEC", "ZCOFT", "PZCFOE", "OPFZTLD"] },
  { id: "snellen-chart-26", name: "Snellen Chart 26 (Randomized Acuity Series 04)", rows: ["F", "CL", "DPL", "LTOD", "ELPDT", "TFDLZP", "ETCDPLF"] },
  { id: "snellen-chart-27", name: "Snellen Chart 27 (Randomized Acuity Series 05)", rows: ["L", "TE", "FTO", "PFCE", "FDTCO", "ECDTOF", "ZFTOLED"] },
  { id: "snellen-chart-28", name: "Snellen Chart 28 (Alternative Optotype Series 01)", rows: ["O", "PD", "ZED", "DZLT", "ZPEFL", "LZPTEC", "PCDEFTO"] },
  { id: "snellen-chart-29", name: "Snellen Chart 29 (Alternative Optotype Series 02)", rows: ["P", "OF", "PLC", "EPCO", "TOCZD", "FDOLCE", "TLOZFPD"] },
  { id: "snellen-chart-30", name: "Snellen Chart 30 (Alternative Optotype Series 03)", rows: ["T", "ZC", "OFT", "TFLD", "DFLPE", "TPZDLO", "DFECPTL"] },
  { id: "snellen-chart-31", name: "Snellen Chart 31 (Alternative Optotype Series 04)", rows: ["Z", "FE", "DEL", "CZOP", "CTZOD", "CFEZDT", "ZPLEOTD"] },
  { id: "snellen-chart-32", name: "Snellen Chart 32 (Alternative Optotype Series 05)", rows: ["E", "LP", "ZPO", "LETF", "PEFTC", "OPLETC", "CTFDZPO"] },
  { id: "snellen-chart-33", name: "Snellen Chart 33 (Extended Range Series 01)", rows: ["C", "TD", "TCF", "DPCZ", "LZDOF", "ZFTDPO", "LEOFPTD"] },
  { id: "snellen-chart-34", name: "Snellen Chart 34 (Extended Range Series 02)", rows: ["D", "OZ", "ELD", "OFTL", "EDPLC", "DCEFLT", "PODZCLE"] },
  { id: "snellen-chart-35", name: "Snellen Chart 35 (Extended Range Series 03)", rows: ["E", "CT", "PZT", "EPZD", "TFOZP", "LTPOEZ", "TFTCLED"] },
  { id: "snellen-chart-36", name: "Snellen Chart 36 (Extended Range Series 04)", rows: ["F", "EF", "CFO", "CFTL", "CDFET", "FDCZTL", "ECDZPTF"] },
  { id: "snellen-chart-37", name: "Snellen Chart 37 (Extended Range Series 05)", rows: ["L", "PO", "TDE", "DOPE", "LPZTO", "EDPFCO", "LOFPTEC"] },
  { id: "snellen-chart-38", name: "Snellen Chart 38 (Verification Protocol Series 01)", rows: ["O", "LD", "LPZ", "ZTLC", "EOCDF", "ZTLEDO", "ZTLDPFO"] },
  { id: "snellen-chart-39", name: "Snellen Chart 39 (Verification Protocol Series 02)", rows: ["P", "ZT", "EOF", "FPED", "PTLDZ", "POFDCT", "DTECFZL"] },
  { id: "snellen-chart-40", name: "Snellen Chart 40 (Verification Protocol Series 03)", rows: ["T", "PE", "CDL", "CLOT", "ZFOTC", "CTZLEP", "PCLTOED"] },
  { id: "snellen-chart-41", name: "Snellen Chart 41 (Verification Protocol Series 04)", rows: ["Z", "FD", "TFP", "DEZP", "DTLEP", "EFLDTO", "FZEOPDT"] },
  { id: "snellen-chart-42", name: "Snellen Chart 42 (Verification Protocol Series 05)", rows: ["E", "CO", "ZOD", "FLCO", "CFEOD", "ZPCOEF", "TCDFPLE"] },
  { id: "snellen-chart-43", name: "Snellen Chart 43 (Precision Acuity Series 01)", rows: ["C", "TL", "PLE", "TZPD", "PLZTF", "TDLEZP", "LDFTOZP"] },
  { id: "snellen-chart-44", name: "Snellen Chart 44 (Precision Acuity Series 02)", rows: ["D", "EZ", "FTC", "CEFT", "ETOCD", "CFDPTO", "OPTCLED"] },
  { id: "snellen-chart-45", name: "Snellen Chart 45 (Precision Acuity Series 03)", rows: ["E", "DP", "DOE", "OPLD", "DFPTL", "OETLFC", "ZFDPETO"] },
  { id: "snellen-chart-46", name: "Snellen Chart 46 (Precision Acuity Series 04)", rows: ["F", "TC", "ZLT", "ZFET", "ZCPEO", "PZDFTO", "ECDFLTZ"] },
  { id: "snellen-chart-47", name: "Snellen Chart 47 (Precision Acuity Series 05)", rows: ["L", "FL", "PCO", "DPLC", "TOFLD", "LCTEZD", "POTZFLE"] },
  { id: "snellen-chart-48", name: "Snellen Chart 48 (Educational Demonstration 01)", rows: ["O", "OE", "TDF", "TFOE", "ECZPT", "FPOTLC", "LTDCOPF"] },
  { id: "snellen-chart-49", name: "Snellen Chart 49 (Educational Demonstration 02)", rows: ["P", "ZP", "EZL", "CPLZ", "LDFOP", "EZDFPO", "ZETDCLP"] },
  { id: "snellen-chart-50", name: "Snellen Chart 50 (Educational Demonstration 03)", rows: ["T", "DT", "PFO", "ETOD", "TCOEZ", "TCDZLE", "FPLTOED"] },
  { id: "snellen-chart-51", name: "Snellen Chart 51 (Educational Demonstration 04)", rows: ["Z", "LF", "CDT", "FLPZ", "PFDTC", "LPFOET", "CDTEFLP"] },
  { id: "snellen-chart-52", name: "Snellen Chart 52 (Educational Demonstration 05)", rows: ["E", "CP", "LEZ", "COET", "ZTEPL", "DCFTZP", "OZPTDFL"] },
  { id: "snellen-chart-53", name: "Snellen Chart 53 (Comprehensive Series A)", rows: ["C", "TO", "OFP", "DFZP", "ODCTE", "ETZCLO", "TECFLOZ"] },
  { id: "snellen-chart-54", name: "Snellen Chart 54 (Comprehensive Series B)", rows: ["D", "ED", "TCD", "TLEC", "FPLZO", "FPEDTZ", "DFPZLET"] },
  { id: "snellen-chart-55", name: "Snellen Chart 55 (Comprehensive Series C)", rows: ["E", "PZ", "ZEL", "POZD", "TLECD", "ZLCDFE", "LOTCDPZ"] },
];

/**
 * Question Bank of 50+ complete, unique Snellen chart examples.
 */
export const distanceVisionChartBank: SnellenChartExample[] = RAW_CHART_DEFINITIONS.map(
  (chart) => ({
    id: chart.id,
    name: chart.name,
    description: `Standard 7-line calibrated Snellen chart (${chart.name})`,
    rows: buildChartRows(chart.rows),
  })
);

/**
 * Question Bank of 385 unique distance-vision chart questions (55 charts x 7 rows).
 * Each question represents a specific acuity line test item.
 */
export const distanceVisionQuestionBank: DistanceVisionQuestion[] = distanceVisionChartBank.flatMap(
  (chart) =>
    chart.rows.map((row) => ({
      id: `${chart.id}-row-${row.rowNumber}`,
      chartId: chart.id,
      chartName: chart.name,
      rowNumber: row.rowNumber,
      snellenFraction: row.snellenFraction,
      decimalAcuity: row.decimalAcuity,
      relativeScale: row.relativeScale,
      minPassCount: row.minPassCount,
      stepPurpose: row.stepPurpose,
      letters: row.letters,
      expectedAnswer: row.letters,
      defaultPixelHeight: row.defaultPixelHeight,
      prompt: `Identify the ${row.letters.length} letter${row.letters.length > 1 ? "s" : ""} in Row ${row.rowNumber}:`,
      stimulusData: row,
    }))
);

/**
 * Fisher-Yates (Knuth) shuffle algorithm.
 * Returns a new shuffled copy of the array without mutating the original.
 */
export function fisherYatesShuffle<T>(
  array: readonly T[],
  randomFn: () => number = Math.random
): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(randomFn() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

/**
 * Selects a random subset of charts from the question bank using Fisher-Yates shuffle.
 */
export function selectRandomDistanceCharts(
  bank: readonly SnellenChartExample[] = distanceVisionChartBank,
  count: number = 1,
  randomFn: () => number = Math.random
): SnellenChartExample[] {
  if (bank.length < count) {
    throw new Error(
      `Chart bank contains only ${bank.length} charts, but ${count} were requested.`
    );
  }
  const shuffled = fisherYatesShuffle(bank, randomFn);
  return shuffled.slice(0, count);
}

/**
 * Selects one random chart example from the question bank.
 */
export function selectRandomDistanceChart(
  bank: readonly SnellenChartExample[] = distanceVisionChartBank,
  randomFn: () => number = Math.random
): SnellenChartExample {
  return selectRandomDistanceCharts(bank, 1, randomFn)[0];
}

// Default 7-row Snellen chart (Chart 01) for backwards compatibility
export const snellenChartRows: SnellenRowData[] = distanceVisionChartBank[0].rows;

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

/**
 * Converts a set of 7 Snellen chart rows into test session items.
 */
export function createDistanceTestItems(
  chartRows: readonly SnellenRowData[] = snellenChartRows,
  chartId: string = "snellen-chart-01"
): Array<TestItem<string>> {
  return chartRows.map((row) => ({
    id: `dv-row-0${row.rowNumber}`,
    title: `Row ${row.rowNumber} of ${chartRows.length} (${row.snellenFraction})`,
    prompt: `Identify the ${row.letters.length} letter${row.letters.length > 1 ? "s" : ""} in Row ${row.rowNumber}:`,
    hint: `Letters displayed at ${row.snellenFraction} equivalent scale.`,
    stimulusData: {
      ...row,
      chartId,
    },
  }));
}

// Initial 7-item distance vision test session for backwards compatibility
export const distanceVisionItems: Array<TestItem<string>> = createDistanceTestItems(
  snellenChartRows,
  "snellen-chart-01"
);
