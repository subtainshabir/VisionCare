import { TestResult, UserResponse } from "@/types/test-engine";
import { SnellenOptotype, distanceVisionItems } from "./distance-vision-data";

export interface DistanceVisionItemEvaluation {
  itemId: string;
  stepLabel: string;
  expectedOptotype: SnellenOptotype;
  userResponse: SnellenOptotype | undefined;
  isMatch: boolean;
  relativeScale: string;
}

export interface DistanceVisionSummary {
  testId: string;
  status: "completed" | "cancelled";
  totalItems: number;
  answeredCount: number;
  matchedCount: number;
  matchPercentage: number;
  evaluations: DistanceVisionItemEvaluation[];
  summaryNote: string;
  calibrationDisclaimer: string;
}

/**
 * Computes a deterministic response summary for the Snellen-style distance demonstration.
 * Strictly avoids generating medical diagnoses, Snellen fractions (e.g. 20/20), prescriptions,
 * or clinical visual-acuity classifications.
 */
export function scoreDistanceVisionDemonstration(
  result: TestResult<SnellenOptotype> | null
): DistanceVisionSummary {
  if (!result) {
    return {
      testId: "distance-vision-screening",
      status: "cancelled",
      totalItems: distanceVisionItems.length,
      answeredCount: 0,
      matchedCount: 0,
      matchPercentage: 0,
      evaluations: [],
      summaryNote: "Demonstration session was cancelled before completion.",
      calibrationDisclaimer:
        "Standardized visual acuity assessment requires calibrated physical optotype geometry, controlled physical viewing distance, verified sub-pixel font rendering, and isolated monocular occlusion.",
    };
  }

  const evaluations: DistanceVisionItemEvaluation[] = distanceVisionItems.map((item) => {
    const expectedOptotype = (item.stimulusData?.optotype as SnellenOptotype) ?? "CANNOT_TELL";
    const userResp: UserResponse<SnellenOptotype> | undefined = result.responses[item.id];
    const userValue = userResp?.value;
    const isMatch = userValue === expectedOptotype;
    const stepLabel = (item.stimulusData?.stepLabel as string) ?? item.id;
    const relativeScale = (item.stimulusData?.relativeScale as string) ?? "standard";

    return {
      itemId: item.id,
      stepLabel,
      expectedOptotype,
      userResponse: userValue,
      isMatch,
      relativeScale,
    };
  });

  const matchedCount = evaluations.filter((e) => e.isMatch).length;
  const answeredCount = Object.keys(result.responses).length;
  const matchPercentage =
    result.totalItems > 0 ? Math.round((matchedCount / result.totalItems) * 100) : 0;

  return {
    testId: result.testId,
    status: result.status,
    totalItems: result.totalItems,
    answeredCount,
    matchedCount,
    matchPercentage,
    evaluations,
    summaryNote: `Responses matched ${matchedCount} of ${result.totalItems} demonstration optotype targets. This summary describes letter recognition agreement under current browser conditions only and does not measure clinical visual acuity.`,
    calibrationDisclaimer:
      "This browser-based demonstration cannot measure clinical visual acuity or compute standardized distance acuity fractions. True visual acuity requires physical chart dimension calibration against your exact screen DPI, verified viewing distance, and monocular testing under clinical illumination.",
  };
}
