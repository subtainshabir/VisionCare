import { TestResult, UserResponse } from "@/types/test-engine";
import {
  SnellenRowData,
  snellenChartRows,
  TOTAL_SNELLEN_LETTERS,
} from "./distance-vision-data";

export interface DistanceVisionRowEvaluation {
  rowNumber: number;
  snellenFraction: string;
  expectedLetters: string;
  userResponse: string | undefined;
  sanitizedResponse: string;
  correctLetterCount: number;
  totalLettersInRow: number;
  isRowPassed: boolean;
  minPassThreshold: number;
  cannotReadDeclared: boolean;
}

export interface DistanceVisionItemEvaluation {
  itemId: string;
  stepLabel: string;
  expectedOptotype: string;
  userResponse: string | undefined;
  isMatch: boolean;
  relativeScale: string;
  correctCount?: number;
  totalLetters?: number;
}

export interface DistanceVisionSummary {
  testId: string;
  status: "completed" | "cancelled";
  totalItems: number; // 7 rows
  totalLetters: number; // 28 letters
  answeredCount: number; // rows answered
  matchedCount: number; // total correct letters
  matchPercentage: number; // correct letters / 28 * 100
  rowsPassedCount: number; // rows where >50% correct
  smallestPassedRowNumber: number | null;
  smallestPassedFraction: string | null;
  smallestPassedRowText: string;
  rowEvaluations: DistanceVisionRowEvaluation[];
  evaluations: DistanceVisionItemEvaluation[];
  summaryNote: string;
  calibrationDisclaimer: string;
}

/**
 * Evaluates user typed input against the expected Snellen letters for a single row.
 * Returns the number of correctly identified letters and whether the row passes
 * the clinical >50% accuracy threshold.
 */
export function evaluateRowInput(
  expectedLetters: string,
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

  const sanitized = userResponse.toUpperCase().replace(/[^A-Z]/g, "");
  let correctCount = 0;

  // Position-by-position comparison up to expected length
  for (let i = 0; i < expectedLetters.length; i++) {
    if (i < sanitized.length && sanitized[i] === expectedLetters[i]) {
      correctCount++;
    }
  }

  const isPassed = correctCount >= minPassCount;
  return { sanitized, correctCount, isPassed, cannotRead: false };
}

/**
 * Computes a standardized response summary for the Snellen-style distance screening chart.
 * Uses a documented clinical scoring rule (>50% correct letters in a row to pass).
 * Strictly avoids diagnosing refractive errors (e.g. myopia, astigmatism) or generating
 * medical prescriptions.
 */
export function scoreDistanceVisionDemonstration(
  result: TestResult<string> | null
): DistanceVisionSummary {
  const defaultDisclaimer =
    "This browser-based Snellen chart demonstration is an educational screening tool and does not measure clinical visual acuity or replace an examination by an optometrist or ophthalmologist. Display resolution, ambient room lighting, viewing angle, and device scaling directly affect optotype legibility.";

  if (!result) {
    return {
      testId: "distance-vision-screening",
      status: "cancelled",
      totalItems: snellenChartRows.length,
      totalLetters: TOTAL_SNELLEN_LETTERS,
      answeredCount: 0,
      matchedCount: 0,
      matchPercentage: 0,
      rowsPassedCount: 0,
      smallestPassedRowNumber: null,
      smallestPassedFraction: null,
      smallestPassedRowText: "Session exited before completion",
      rowEvaluations: [],
      evaluations: [],
      summaryNote: "Demonstration session was cancelled before completion.",
      calibrationDisclaimer: defaultDisclaimer,
    };
  }

  const rowEvaluations: DistanceVisionRowEvaluation[] = [];
  const evaluations: DistanceVisionItemEvaluation[] = [];
  let totalCorrectLetters = 0;
  let rowsPassedCount = 0;
  let smallestPassedRowNumber: number | null = null;
  let smallestPassedFraction: string | null = null;

  snellenChartRows.forEach((row: SnellenRowData) => {
    const itemId = `dv-row-0${row.rowNumber}`;
    const userResp: UserResponse<string> | undefined = result.responses[itemId];
    const userValue = userResp?.value;

    const { sanitized, correctCount, isPassed, cannotRead } = evaluateRowInput(
      row.letters,
      userValue,
      row.minPassCount
    );

    totalCorrectLetters += correctCount;
    if (isPassed) {
      rowsPassedCount++;
      // Since rows are processed in order 1 to 7 (large to small),
      // the last passed row encountered is the smallest passed line!
      smallestPassedRowNumber = row.rowNumber;
      smallestPassedFraction = row.snellenFraction;
    }

    rowEvaluations.push({
      rowNumber: row.rowNumber,
      snellenFraction: row.snellenFraction,
      expectedLetters: row.letters,
      userResponse: userValue,
      sanitizedResponse: sanitized,
      correctLetterCount: correctCount,
      totalLettersInRow: row.letters.length,
      isRowPassed: isPassed,
      minPassThreshold: row.minPassCount,
      cannotReadDeclared: cannotRead,
    });

    evaluations.push({
      itemId,
      stepLabel: `Row ${row.rowNumber} (${row.snellenFraction})`,
      expectedOptotype: row.letters,
      userResponse: userValue,
      isMatch: isPassed,
      relativeScale: `${row.relativeScale}x`,
      correctCount,
      totalLetters: row.letters.length,
    });
  });

  const answeredCount = Object.keys(result.responses).length;
  const matchPercentage =
    TOTAL_SNELLEN_LETTERS > 0
      ? Math.round((totalCorrectLetters / TOTAL_SNELLEN_LETTERS) * 100)
      : 0;

  const smallestPassedRowText = smallestPassedFraction
    ? `Row ${smallestPassedRowNumber} (${smallestPassedFraction} screening line)`
    : "No row passed (>50% accuracy threshold)";

  const summaryNote = `Completed ${answeredCount} of ${snellenChartRows.length} Snellen rows. Identified ${totalCorrectLetters} of ${TOTAL_SNELLEN_LETTERS} letters correctly (${matchPercentage}%). Smallest successfully identified line: ${smallestPassedRowText}. Educational screening demonstration only; does not measure clinical visual acuity or provide a medical diagnosis.`;

  return {
    testId: result.testId,
    status: result.status,
    totalItems: snellenChartRows.length,
    totalLetters: TOTAL_SNELLEN_LETTERS,
    answeredCount,
    matchedCount: totalCorrectLetters,
    matchPercentage,
    rowsPassedCount,
    smallestPassedRowNumber,
    smallestPassedFraction,
    smallestPassedRowText,
    rowEvaluations,
    evaluations,
    summaryNote,
    calibrationDisclaimer: defaultDisclaimer,
  };
}
