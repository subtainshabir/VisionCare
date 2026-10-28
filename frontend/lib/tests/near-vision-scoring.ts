import { TestResult, UserResponse } from "@/types/test-engine";
import { NearVisionStimulusData, nearVisionItems } from "./near-vision-data";

export interface NearVisionItemEvaluation {
  itemId: string;
  stepLabel: string;
  passage: string;
  targetWord: string;
  userResponse: string | undefined;
  normalizedResponse: string;
  isMatch: boolean;
  cannotReadDeclared: boolean;
  relativeScale: string;
}

export interface NearVisionSummary {
  testId: string;
  status: "completed" | "cancelled";
  totalItems: number;
  answeredCount: number;
  matchedCount: number;
  cannotReadCount: number;
  matchPercentage: number;
  evaluations: NearVisionItemEvaluation[];
  summaryNote: string;
  calibrationDisclaimer: string;
}

/**
 * Normalizes user reading input by trimming whitespace, converting to lowercase,
 * and stripping trailing punctuation.
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
 * Computes a deterministic response summary for the Near Vision Reading Demonstration.
 * Strictly avoids generating medical diagnoses, Jaeger scores (J1, J2...), Snellen fractions,
 * prescriptions, or clinical visual-acuity classifications.
 */
export function scoreNearVisionDemonstration(
  result: TestResult<string> | null
): NearVisionSummary {
  if (!result) {
    return {
      testId: "near-vision-screening",
      status: "cancelled",
      totalItems: nearVisionItems.length,
      answeredCount: 0,
      matchedCount: 0,
      cannotReadCount: 0,
      matchPercentage: 0,
      evaluations: [],
      summaryNote: "Demonstration session was cancelled before completion.",
      calibrationDisclaimer:
        "Standardized near-point acuity assessment requires calibrated physical print dimensions (such as standard Jaeger or MNREAD charts), controlled physical viewing distance, verified display DPI, and professional clinical refraction.",
    };
  }

  const evaluations: NearVisionItemEvaluation[] = nearVisionItems.map((item) => {
    const stimulus = item.stimulusData as NearVisionStimulusData | undefined;
    const targetWord = stimulus?.targetWord ?? "";
    const passage = stimulus?.passage ?? "";
    const stepLabel = stimulus?.stepLabel ?? item.id;
    const relativeScale = stimulus?.relativeScale ?? "standard";

    const userResp: UserResponse<string> | undefined = result.responses[item.id];
    const userValue = userResp?.value;
    const cannotReadDeclared = userValue === "CANNOT_READ";
    const normalized = normalizeReadingResponse(userValue);
    const isMatch = !cannotReadDeclared && normalized.length > 0 && normalized === targetWord.toLowerCase();

    return {
      itemId: item.id,
      stepLabel,
      passage,
      targetWord,
      userResponse: userValue,
      normalizedResponse: normalized,
      isMatch,
      cannotReadDeclared,
      relativeScale,
    };
  });

  const matchedCount = evaluations.filter((e) => e.isMatch).length;
  const cannotReadCount = evaluations.filter((e) => e.cannotReadDeclared).length;
  const answeredCount = Object.keys(result.responses).length;
  const matchPercentage =
    result.totalItems > 0 ? Math.round((matchedCount / result.totalItems) * 100) : 0;

  return {
    testId: result.testId,
    status: result.status,
    totalItems: result.totalItems,
    answeredCount,
    matchedCount,
    cannotReadCount,
    matchPercentage,
    evaluations,
    summaryNote: `Responses matched ${matchedCount} of ${result.totalItems} demonstration reading targets (${cannotReadCount} marked as unreadable). This summary reflects reading legibility under your current uncalibrated browser setup and does not measure clinical reading acuity.`,
    calibrationDisclaimer:
      "This browser-based demonstration cannot measure clinical near visual acuity or determine near-vision reading levels. True near-point acuity requires physical print dimension calibration against your exact screen DPI, verified viewing distance, and evaluation by an eye-care professional.",
  };
}
