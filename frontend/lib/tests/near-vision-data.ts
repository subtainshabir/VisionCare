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

export interface RosenbaumChartExample {
  id: string;
  name: string;
  description?: string;
  lines: RosenbaumLineData[];
}

export interface NearVisionQuestion {
  id: string;
  chartId: string;
  chartName: string;
  lineNumber: number;
  distanceEquivalent: string;
  jaegerEquivalent: string;
  decimalAcuity: number;
  relativeScale: number;
  minPassCount: number;
  pointSize: number;
  linePurpose: string;
  characters: string;
  expectedAnswer: string;
  defaultPixelHeight: number;
  prompt: string;
  stimulusData: RosenbaumLineData;
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

export const STANDARD_ROSENBAUM_LINE_CONFIGS = [
  {
    lineNumber: 1,
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
    distanceEquivalent: "20/20",
    jaegerEquivalent: "J1+",
    decimalAcuity: 1.0,
    relativeScale: 1.0,
    minPassCount: 4,
    pointSize: 4,
    defaultPixelHeight: 11,
    linePurpose: "Reference high-resolution reading line (Line 8)",
  },
] as const;

export function buildRosenbaumLines(
  digitsByLine: readonly [string, string, string, string, string, string, string, string]
): RosenbaumLineData[] {
  return STANDARD_ROSENBAUM_LINE_CONFIGS.map((config, idx) => ({
    ...config,
    characters: digitsByLine[idx],
  }));
}

// 55 distinct, clinically valid Rosenbaum near vision chart configurations
const RAW_ROSENBAUM_CHART_DEFINITIONS: Array<{
  id: string;
  name: string;
  lines: [string, string, string, string, string, string, string, string];
}> = [
  { id: "rosenbaum-chart-01", name: "Rosenbaum Chart 01 (Classic J.G. Rosenbaum)", lines: ["95", "874", "6385", "87452", "42836", "374258", "937826", "425783"] },
  { id: "rosenbaum-chart-02", name: "Rosenbaum Chart 02 (High-Contrast Series A)", lines: ["68", "392", "7415", "92638", "51740", "482619", "735028", "619475"] },
  { id: "rosenbaum-chart-03", name: "Rosenbaum Chart 03 (High-Contrast Series B)", lines: ["47", "518", "9263", "40817", "63952", "275149", "803614", "927351"] },
  { id: "rosenbaum-chart-04", name: "Rosenbaum Chart 04 (Near Acuity Standard A)", lines: ["39", "746", "1805", "37294", "81506", "941725", "286390", "514837"] },
  { id: "rosenbaum-chart-05", name: "Rosenbaum Chart 05 (Near Acuity Standard B)", lines: ["82", "603", "4971", "61483", "27095", "830571", "491753", "720649"] },
  { id: "rosenbaum-chart-06", name: "Rosenbaum Chart 06 (Screening Protocol 01)", lines: ["51", "937", "8024", "75029", "18436", "592840", "618402", "386194"] },
  { id: "rosenbaum-chart-07", name: "Rosenbaum Chart 07 (Screening Protocol 02)", lines: ["74", "285", "3169", "54918", "70324", "163958", "502847", "849206"] },
  { id: "rosenbaum-chart-08", name: "Rosenbaum Chart 08 (Screening Protocol 03)", lines: ["26", "419", "5738", "28305", "94617", "704192", "379516", "153728"] },
  { id: "rosenbaum-chart-09", name: "Rosenbaum Chart 09 (Screening Protocol 04)", lines: ["18", "562", "9407", "16842", "39570", "628304", "841639", "270583"] },
  { id: "rosenbaum-chart-10", name: "Rosenbaum Chart 10 (Screening Protocol 05)", lines: ["43", "708", "2591", "49063", "81725", "395716", "160472", "941860"] },
  { id: "rosenbaum-chart-11", name: "Rosenbaum Chart 11 (Precision Reading Line A)", lines: ["91", "346", "8270", "83517", "60492", "471603", "925831", "382497"] },
  { id: "rosenbaum-chart-12", name: "Rosenbaum Chart 12 (Precision Reading Line B)", lines: ["75", "189", "4036", "91724", "52860", "852937", "407195", "639082"] },
  { id: "rosenbaum-chart-13", name: "Rosenbaum Chart 13 (Jaeger Reference 01)", lines: ["38", "624", "7159", "20683", "74195", "914082", "638204", "507316"] },
  { id: "rosenbaum-chart-14", name: "Rosenbaum Chart 14 (Jaeger Reference 02)", lines: ["52", "970", "3841", "74290", "16358", "260473", "851740", "491628"] },
  { id: "rosenbaum-chart-15", name: "Rosenbaum Chart 15 (Jaeger Reference 03)", lines: ["84", "235", "6917", "35804", "90721", "738519", "294063", "182954"] },
  { id: "rosenbaum-chart-16", name: "Rosenbaum Chart 16 (Jaeger Reference 04)", lines: ["61", "804", "2573", "60417", "48239", "593720", "716385", "840631"] },
  { id: "rosenbaum-chart-17", name: "Rosenbaum Chart 17 (Jaeger Reference 05)", lines: ["29", "471", "8360", "47158", "35904", "816407", "390527", "753802"] },
  { id: "rosenbaum-chart-18", name: "Rosenbaum Chart 18 (Clinical Demonstration 01)", lines: ["70", "593", "1482", "82936", "07418", "409258", "648173", "269415"] },
  { id: "rosenbaum-chart-19", name: "Rosenbaum Chart 19 (Clinical Demonstration 02)", lines: ["14", "386", "7029", "19542", "86137", "637184", "072946", "917530"] },
  { id: "rosenbaum-chart-20", name: "Rosenbaum Chart 20 (Clinical Demonstration 03)", lines: ["86", "217", "5940", "53071", "24896", "184062", "531804", "308267"] },
  { id: "rosenbaum-chart-21", name: "Rosenbaum Chart 21 (Clinical Demonstration 04)", lines: ["49", "650", "3187", "06489", "71352", "920743", "864291", "672408"] },
  { id: "rosenbaum-chart-22", name: "Rosenbaum Chart 22 (Clinical Demonstration 05)", lines: ["37", "842", "9605", "78310", "59241", "375918", "197350", "046183"] },
  { id: "rosenbaum-chart-23", name: "Rosenbaum Chart 23 (Visual Baseline Set 01)", lines: ["50", "194", "2836", "41695", "03874", "741830", "420689", "853971"] },
  { id: "rosenbaum-chart-24", name: "Rosenbaum Chart 24 (Visual Baseline Set 02)", lines: ["92", "738", "4051", "95274", "61908", "286395", "085137", "174092"] },
  { id: "rosenbaum-chart-25", name: "Rosenbaum Chart 25 (Visual Baseline Set 03)", lines: ["63", "085", "7194", "27138", "45069", "803572", "913724", "498356"] },
  { id: "rosenbaum-chart-26", name: "Rosenbaum Chart 26 (Visual Baseline Set 04)", lines: ["28", "461", "8520", "63841", "92753", "517409", "359206", "720914"] },
  { id: "rosenbaum-chart-27", name: "Rosenbaum Chart 27 (Visual Baseline Set 05)", lines: ["71", "923", "6408", "38096", "14820", "692841", "741085", "385462"] },
  { id: "rosenbaum-chart-28", name: "Rosenbaum Chart 28 (Close-Reading Screener A)", lines: ["15", "370", "9246", "81720", "57394", "049163", "206491", "961805"] },
  { id: "rosenbaum-chart-29", name: "Rosenbaum Chart 29 (Close-Reading Screener B)", lines: ["83", "509", "1738", "50467", "28610", "473085", "827914", "037249"] },
  { id: "rosenbaum-chart-30", name: "Rosenbaum Chart 30 (Close-Reading Screener C)", lines: ["46", "814", "0592", "79183", "60427", "138529", "640382", "582631"] },
  { id: "rosenbaum-chart-31", name: "Rosenbaum Chart 31 (Close-Reading Screener D)", lines: ["90", "257", "4813", "24605", "39581", "951740", "583620", "219574"] },
  { id: "rosenbaum-chart-32", name: "Rosenbaum Chart 32 (Close-Reading Screener E)", lines: ["34", "691", "7350", "96384", "81702", "382604", "174958", "740816"] },
  { id: "rosenbaum-chart-33", name: "Rosenbaum Chart 33 (Acuity Metric Suite 01)", lines: ["57", "048", "3961", "40719", "25048", "720935", "938170", "862703"] },
  { id: "rosenbaum-chart-34", name: "Rosenbaum Chart 34 (Acuity Metric Suite 02)", lines: ["21", "783", "5049", "18502", "73961", "064817", "492706", "351948"] },
  { id: "rosenbaum-chart-35", name: "Rosenbaum Chart 35 (Acuity Metric Suite 03)", lines: ["79", "126", "8470", "62947", "04183", "819462", "260583", "904381"] },
  { id: "rosenbaum-chart-36", name: "Rosenbaum Chart 36 (Acuity Metric Suite 04)", lines: ["08", "435", "1629", "37058", "96824", "537028", "715492", "483067"] },
  { id: "rosenbaum-chart-37", name: "Rosenbaum Chart 37 (Acuity Metric Suite 05)", lines: ["64", "972", "0835", "84163", "52079", "295174", "083715", "127490"] },
  { id: "rosenbaum-chart-38", name: "Rosenbaum Chart 38 (Verification Sequence 01)", lines: ["13", "580", "9472", "05391", "47936", "640839", "351608", "679124"] },
  { id: "rosenbaum-chart-39", name: "Rosenbaum Chart 39 (Verification Sequence 02)", lines: ["87", "204", "6158", "71824", "13508", "982405", "809247", "548239"] },
  { id: "rosenbaum-chart-40", name: "Rosenbaum Chart 40 (Verification Sequence 03)", lines: ["42", "695", "3701", "29470", "80614", "416973", "472851", "096375"] },
  { id: "rosenbaum-chart-41", name: "Rosenbaum Chart 41 (Verification Sequence 04)", lines: ["96", "018", "7524", "56039", "34725", "703816", "916038", "315802"] },
  { id: "rosenbaum-chart-42", name: "Rosenbaum Chart 42 (Verification Sequence 05)", lines: ["35", "847", "2910", "13846", "98160", "059281", "248370", "870419"] },
  { id: "rosenbaum-chart-43", name: "Rosenbaum Chart 43 (Fine Detail Series 01)", lines: ["72", "163", "4085", "80257", "62491", "368140", "693514", "239750"] },
  { id: "rosenbaum-chart-44", name: "Rosenbaum Chart 44 (Fine Detail Series 02)", lines: ["09", "351", "8746", "47913", "19058", "824709", "150492", "761584"] },
  { id: "rosenbaum-chart-45", name: "Rosenbaum Chart 45 (Fine Detail Series 03)", lines: ["58", "920", "6317", "92608", "75382", "175394", "584726", "408261"] },
  { id: "rosenbaum-chart-46", name: "Rosenbaum Chart 46 (Fine Detail Series 04)", lines: ["24", "785", "1903", "35182", "08647", "906428", "027983", "932607"] },
  { id: "rosenbaum-chart-47", name: "Rosenbaum Chart 47 (Fine Detail Series 05)", lines: ["80", "419", "5264", "68430", "41793", "438175", "746109", "185036"] },
  { id: "rosenbaum-chart-48", name: "Rosenbaum Chart 48 (Educational Evaluation A)", lines: ["17", "632", "0489", "04791", "86205", "691052", "391475", "520948"] },
  { id: "rosenbaum-chart-49", name: "Rosenbaum Chart 49 (Educational Evaluation B)", lines: ["69", "074", "3815", "71064", "23918", "257930", "835260", "074193"] },
  { id: "rosenbaum-chart-50", name: "Rosenbaum Chart 50 (Educational Evaluation C)", lines: ["31", "568", "7902", "26953", "90476", "783261", "408937", "653812"] },
  { id: "rosenbaum-chart-51", name: "Rosenbaum Chart 51 (Educational Evaluation D)", lines: ["48", "901", "6257", "83240", "57189", "049518", "972054", "390471"] },
  { id: "rosenbaum-chart-52", name: "Rosenbaum Chart 52 (Educational Evaluation E)", lines: ["03", "276", "4198", "59716", "38042", "516307", "614829", "847250"] },
  { id: "rosenbaum-chart-53", name: "Rosenbaum Chart 53 (Comprehensive Near Set 01)", lines: ["76", "840", "9321", "14805", "06527", "370489", "125740", "209384"] },
  { id: "rosenbaum-chart-54", name: "Rosenbaum Chart 54 (Comprehensive Near Set 02)", lines: ["25", "193", "8046", "60392", "74813", "894170", "780361", "951608"] },
  { id: "rosenbaum-chart-55", name: "Rosenbaum Chart 55 (Comprehensive Near Set 03)", lines: ["98", "427", "5160", "38547", "19264", "462805", "309482", "068417"] },
];

/**
 * Question Bank of 50+ complete, unique Rosenbaum near vision chart examples.
 */
export const nearVisionChartBank: RosenbaumChartExample[] = RAW_ROSENBAUM_CHART_DEFINITIONS.map(
  (chart) => ({
    id: chart.id,
    name: chart.name,
    description: `Standard 8-line calibrated Rosenbaum near vision card (${chart.name})`,
    lines: buildRosenbaumLines(chart.lines),
  })
);

/**
 * Question Bank of 440 unique near-vision chart questions (55 charts x 8 lines).
 * Each question represents a specific near acuity line test item.
 */
export const nearVisionQuestionBank: NearVisionQuestion[] = nearVisionChartBank.flatMap(
  (chart) =>
    chart.lines.map((line) => ({
      id: `${chart.id}-line-${line.lineNumber}`,
      chartId: chart.id,
      chartName: chart.name,
      lineNumber: line.lineNumber,
      distanceEquivalent: line.distanceEquivalent,
      jaegerEquivalent: line.jaegerEquivalent,
      decimalAcuity: line.decimalAcuity,
      relativeScale: line.relativeScale,
      minPassCount: line.minPassCount,
      pointSize: line.pointSize,
      linePurpose: line.linePurpose,
      characters: line.characters,
      expectedAnswer: line.characters,
      defaultPixelHeight: line.defaultPixelHeight,
      prompt: `Identify the ${line.characters.length} number${line.characters.length > 1 ? "s" : ""} in Line ${line.lineNumber}:`,
      stimulusData: line,
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
 * Selects a random subset of near-vision charts from the question bank using Fisher-Yates shuffle.
 */
export function selectRandomNearCharts(
  bank: readonly RosenbaumChartExample[] = nearVisionChartBank,
  count: number = 1,
  randomFn: () => number = Math.random
): RosenbaumChartExample[] {
  if (bank.length < count) {
    throw new Error(
      `Chart bank contains only ${bank.length} charts, but ${count} were requested.`
    );
  }
  const shuffled = fisherYatesShuffle(bank, randomFn);
  return shuffled.slice(0, count);
}

/**
 * Selects one random near-vision chart example from the question bank.
 */
export function selectRandomNearChart(
  bank: readonly RosenbaumChartExample[] = nearVisionChartBank,
  randomFn: () => number = Math.random
): RosenbaumChartExample {
  return selectRandomNearCharts(bank, 1, randomFn)[0];
}

// Default 8-line Rosenbaum chart (Chart 01) for backwards compatibility
export const rosenbaumChartLines: RosenbaumLineData[] = nearVisionChartBank[0].lines;

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

/**
 * Converts a set of 8 Rosenbaum chart lines into test session items.
 */
export function createNearTestItems(
  chartLines: readonly RosenbaumLineData[] = rosenbaumChartLines,
  chartId: string = "rosenbaum-chart-01"
): Array<TestItem<string>> {
  return chartLines.map((line) => ({
    id: `nv-line-0${line.lineNumber}`,
    title: `Line ${line.lineNumber} of ${chartLines.length} (${line.distanceEquivalent} \u2022 ${line.jaegerEquivalent})`,
    prompt: `Identify the ${line.characters.length} number${line.characters.length > 1 ? "s" : ""} in Line ${line.lineNumber}:`,
    hint: `Near print line displayed at ${line.distanceEquivalent} (${line.jaegerEquivalent}) equivalent scale.`,
    stimulusData: {
      ...line,
      chartId,
    },
  }));
}

// Initial 8-item near vision test session for backwards compatibility
export const nearVisionItems: Array<TestItem<string>> = createNearTestItems(
  rosenbaumChartLines,
  "rosenbaum-chart-01"
);
