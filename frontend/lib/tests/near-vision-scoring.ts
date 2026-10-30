import { TestResult, UserResponse } from "@/types/test-engine";
import {
  RosenbaumLineData,
  RosenbaumChartExample,
  rosenbaumChartLines,
  TOTAL_ROSENBAUM_CHARACTERS,
} from "./near-vision-data";

export interface NearVisionLineEvaluation {
  lineNumber: number;
  distanceEquivalent: string;
  jaegerEquivalent: string;
  expectedDigits: string;
  userResponse: string | undefined;
  sanitizedResponse: string;
  correctDigitCount: number;
  totalDigitsInLine: number;
  isLinePassed: boolean;
  minPassThreshold: number;
  cannotReadDeclared: boolean;
}

export interface NearVisionItemEvaluation {
  itemId: string;
  stepLabel: string;
  passage?: string;
  targetWord?: string;
  expectedDigits?: string;
  userResponse: string | undefined;
  normalizedResponse?: string;
  sanitizedResponse?: string;
  isMatch: boolean;
  cannotReadDeclared: boolean;
  relativeScale: string;
  correctCount?: number;
  totalDigits?: number;
}

export interface NearVisionSummary {
  testId: string;
  status: "completed" | "cancelled";
  totalItems: number; // 8 lines
  totalCharacters: number; // total digits (usually 37)
  answeredCount: number; // lines answered
  matchedCount: number; // total correct digits across all lines
  cannotReadCount: number; // lines marked CANNOT_READ
  matchPercentage: number; // matchedCount / totalCharacters * 100
  linesPassedCount: number; // lines where >50% correct
  smallestPassedLineNumber: number | null;
  smallestPassedFraction: string | null;
  smallestPassedJaeger: string | null;
  smallestPassedLineText: string;
  lineEvaluations: NearVisionLineEvaluation[];
  evaluations: NearVisionItemEvaluation[];
  summaryNote: string;
  calibrationDisclaimer: string;
  chartId?: string;
  chartName?: string;
}

/**
 * Normalizes user reading input by trimming whitespace, converting to lowercase,
 * and stripping trailing punctuation. Maintained for backward compatibility.
 */
export function normalizeReadingResponse(value: string | undefined): string {
  if (!value) return "";
  return value
    .trim()
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"']+$/, "")
    .trim();
}

/**
 * Evaluates user typed digits against the expected Rosenbaum digits for a single line.
 * Compares digit by digit up to the line length.
 * Returns the count of correct digits and whether the line passes the >50% threshold.
 */
export function evaluateNearLineInput(
  expectedDigits: string,
  userResponse: string | undefined,
  minPassCount: number
): {
  sanitized: string;
  correctCount: number;
  isPassed: boolean;
  cannotRead: boolean;
} {
  if (!userResponse) {
    return { sanitized: "", correctCount: 0, isPassed: false, cannotRead: false };
  }

  const cannotRead =
    userResponse === "CANNOT_READ" ||
    userResponse === "UNSURE" ||
    userResponse === "CANNOT_TELL";

  if (cannotRead) {
    return { sanitized: "UNREADABLE", correctCount: 0, isPassed: false, cannotRead: true };
  }

  const sanitized = userResponse.replace(/[^0-9]/g, "");
  let correctCount = 0;

  for (let i = 0; i < expectedDigits.length; i++) {
    if (i < sanitized.length && sanitized[i] === expectedDigits[i]) {
      correctCount++;
    }
  }

  const isPassed = correctCount >= minPassCount;
  return { sanitized, correctCount, isPassed, cannotRead: false };
}

/**
 * Computes a standardized response summary for the Rosenbaum-style near vision reading chart.
 * Uses a documented clinical scoring rule (>50% correct digits per line to pass).
 * Strictly avoids diagnosing refractive conditions (presbyopia, hyperopia, astigmatism) or
 * providing clinical prescriptions.
 */
export function scoreNearVisionDemonstration(
  result: TestResult<string> | null,
  chartOrLines: RosenbaumChartExample | readonly RosenbaumLineData[] = rosenbaumChartLines
): NearVisionSummary {
  const defaultDisclaimer =
    "This browser-based Rosenbaum near-vision demonstration is an educational screening tool and does not measure clinical reading acuity or provide a medical diagnosis. True near-point acuity requires physical print dimension calibration against your exact screen DPI, verified 14-inch (35 cm) viewing distance, and comprehensive evaluation by an optometrist or ophthalmologist.";

  const activeLines: readonly RosenbaumLineData[] = Array.isArray(chartOrLines)
    ? chartOrLines
    : (chartOrLines as RosenbaumChartExample).lines;

  const chartId = Array.isArray(chartOrLines)
    ? undefined
    : (chartOrLines as RosenbaumChartExample).id;
  const chartName = Array.isArray(chartOrLines)
    ? undefined
    : (chartOrLines as RosenbaumChartExample).name;

  const totalCharacters = activeLines.reduce(
    (sum, line) => sum + line.characters.length,
    0
  ) || TOTAL_ROSENBAUM_CHARACTERS;

  if (!result) {
    return {
      testId: "near-vision-screening",
      status: "cancelled",
      totalItems: activeLines.length,
      totalCharacters,
      answeredCount: 0,
      matchedCount: 0,
      cannotReadCount: 0,
      matchPercentage: 0,
      linesPassedCount: 0,
      smallestPassedLineNumber: null,
      smallestPassedFraction: null,
      smallestPassedJaeger: null,
      smallestPassedLineText: "Session exited before completion",
      lineEvaluations: [],
      evaluations: [],
      summaryNote: "Demonstration session was cancelled before completion.",
      calibrationDisclaimer: defaultDisclaimer,
      chartId,
      chartName,
    };
  }

  const lineEvaluations: NearVisionLineEvaluation[] = [];
  const evaluations: NearVisionItemEvaluation[] = [];
  let totalCorrectDigits = 0;
  let linesPassedCount = 0;
  let cannotReadCount = 0;
  let smallestPassedLineNumber: number | null = null;
  let smallestPassedFraction: string | null = null;
  let smallestPassedJaeger: string | null = null;

  activeLines.forEach((line: RosenbaumLineData) => {
    const itemId = `nv-line-0${line.lineNumber}`;
    const userResp: UserResponse<string> | undefined = result.responses[itemId];
    const userValue = userResp?.value;

    const { sanitized, correctCount, isPassed, cannotRead } = evaluateNearLineInput(
      line.characters,
      userValue,
      line.minPassCount
    );

    totalCorrectDigits += correctCount;
    if (cannotRead) {
      cannotReadCount++;
    }

    if (isPassed) {
      linesPassedCount++;
      smallestPassedLineNumber = line.lineNumber;
      smallestPassedFraction = line.distanceEquivalent;
      smallestPassedJaeger = line.jaegerEquivalent;
    }

    lineEvaluations.push({
      lineNumber: line.lineNumber,
      distanceEquivalent: line.distanceEquivalent,
      jaegerEquivalent: line.jaegerEquivalent,
      expectedDigits: line.characters,
      userResponse: userValue,
      sanitizedResponse: sanitized,
      correctDigitCount: correctCount,
      totalDigitsInLine: line.characters.length,
      isLinePassed: isPassed,
      minPassThreshold: line.minPassCount,
      cannotReadDeclared: cannotRead,
    });

    evaluations.push({
      itemId,
      stepLabel: `Line ${line.lineNumber} (${line.distanceEquivalent} \u2022 ${line.jaegerEquivalent})`,
      expectedDigits: line.characters,
      userResponse: userValue,
      sanitizedResponse: sanitized,
      isMatch: isPassed,
      cannotReadDeclared: cannotRead,
      relativeScale: `${line.relativeScale}x`,
      correctCount,
      totalDigits: line.characters.length,
    });
  });

  const answeredCount = Object.keys(result.responses).length;
  const matchPercentage =
    totalCharacters > 0
      ? Math.round((totalCorrectDigits / totalCharacters) * 100)
      : 0;

  const smallestPassedLineText = smallestPassedFraction && smallestPassedJaeger
    ? `Line ${smallestPassedLineNumber} (~${smallestPassedFraction} \u2022 ${smallestPassedJaeger} equivalent)`
    : "No line passed (>50% accuracy threshold)";

  const summaryNote = `Completed ${answeredCount} of ${activeLines.length} Rosenbaum lines. Identified ${totalCorrectDigits} of ${totalCharacters} digits correctly (${matchPercentage}%). Smallest successfully read line: ${smallestPassedLineText}. Educational near-vision screening demonstration only; does not measure clinical reading acuity or replace professional examination.`;

  return {
    testId: result.testId,
    status: result.status,
    totalItems: activeLines.length,
    totalCharacters,
    answeredCount,
    matchedCount: totalCorrectDigits,
    cannotReadCount,
    matchPercentage,
    linesPassedCount,
    smallestPassedLineNumber,
    smallestPassedFraction,
    smallestPassedJaeger,
    smallestPassedLineText,
    lineEvaluations,
    evaluations,
    summaryNote,
    calibrationDisclaimer: defaultDisclaimer,
    chartId,
    chartName,
  };
}
