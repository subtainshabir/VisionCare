import { TestResult, UserResponse } from "@/types/test-engine";
import { GeometricShape, colorVisionItems } from "./color-vision-data";

export interface ColorVisionItemEvaluation {
  itemId: string;
  itemTitle: string;
  expectedShape: GeometricShape;
  userResponse: GeometricShape | undefined;
  isMatch: boolean;
  targetPair: string;
}

export interface ColorVisionSummary {
  testId: string;
  status: "completed" | "cancelled";
  totalItems: number;
  answeredCount: number;
  matchedCount: number;
  matchPercentage: number;
  evaluations: ColorVisionItemEvaluation[];
  summaryNote: string;
  displayLimitationsDisclaimer: string;
}

/**
 * Computes deterministic response evaluation for the demonstration items.
 * Strictly avoids medical diagnosis, risk categories, or clinical condition claims.
 */
export function scoreColorVisionDemonstration(
  result: TestResult<GeometricShape> | null
): ColorVisionSummary {
  if (!result) {
    return {
      testId: "color-vision-screening",
      status: "cancelled",
      totalItems: colorVisionItems.length,
      answeredCount: 0,
      matchedCount: 0,
      matchPercentage: 0,
      evaluations: [],
      summaryNote: "No session data available.",
      displayLimitationsDisclaimer:
        "Computer and mobile screens vary greatly in color gamut, panel technology, viewing angles, and brightness calibration.",
    };
  }

  const evaluations: ColorVisionItemEvaluation[] = colorVisionItems.map((item) => {
    const expectedShape = (item.stimulusData?.shape as GeometricShape) ?? "CANNOT_TELL";
    const userResp: UserResponse<GeometricShape> | undefined = result.responses[item.id];
    const userValue = userResp?.value;
    const isMatch = userValue === expectedShape;
    const targetPair = (item.stimulusData?.targetPair as string) ?? "Chromatic pair";

    return {
      itemId: item.id,
      itemTitle: item.title ?? item.id,
      expectedShape,
      userResponse: userValue,
      isMatch,
      targetPair,
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
    summaryNote: `Responses matched ${matchedCount} of ${result.totalItems} demonstration targets. This summary describes response agreement with the demonstration stimuli only and is not a medical diagnosis or clinical interpretation.`,
    displayLimitationsDisclaimer:
      "Consumer display panels vary significantly in color temperature, sRGB gamut coverage, ambient glare, and display angle. These technical variables mean browser-based demonstrations cannot substitute for standardized clinical testing.",
  };
}
