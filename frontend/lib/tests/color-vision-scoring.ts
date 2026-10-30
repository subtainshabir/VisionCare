import { TestResult, UserResponse, TestItem } from "@/types/test-engine";
import {
  GeometricShape,
  colorVisionQuestionBank,
  colorVisionItems,
} from "./color-vision-data";

export interface ColorVisionItemEvaluation {
  itemId: string;
  itemTitle: string;
  expectedAnswer: string;
  userResponse: string | undefined;
  isMatch: boolean;
  category: string;
  description: string;
  // Backward compatibility fields
  expectedShape: GeometricShape;
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
 * Evaluates user responses against the active session's screening plates.
 * Each correct match awards 1 point; incorrect answers award 0 points.
 * Strictly non-diagnostic and non-clinical.
 */
export function scoreColorVisionDemonstration(
  result: TestResult<string | GeometricShape> | null,
  activeItems?: Array<TestItem<string | GeometricShape>>
): ColorVisionSummary {
  const displayLimitationsDisclaimer =
    "Consumer display panels vary significantly in color temperature, sRGB gamut coverage, ambient glare, and viewing angle. These hardware variables mean browser-based demonstrations cannot substitute for standardized clinical testing with physical pseudoisochromatic plates.";

  if (!result) {
    const totalCount = activeItems?.length ?? 5;
    return {
      testId: "color-vision-screening",
      status: "cancelled",
      totalItems: totalCount,
      answeredCount: 0,
      matchedCount: 0,
      matchPercentage: 0,
      evaluations: [],
      summaryNote: "No session data available.",
      displayLimitationsDisclaimer,
    };
  }

  // Determine items to evaluate: activeItems if provided, or lookup from bank by response IDs
  let itemsToScore: Array<{
    id: string;
    title: string;
    correctAnswer: string;
    category: string;
    description: string;
  }> = [];

  if (activeItems && activeItems.length > 0) {
    itemsToScore = activeItems.map((item) => {
      const bankEntry = colorVisionQuestionBank.find((p) => p.id === item.id);
      const correctAnswer =
        (item.stimulusData?.correctAnswer as string) ??
        bankEntry?.correctAnswer ??
        (item.stimulusData?.shape as string) ??
        "";
      return {
        id: item.id,
        title: item.title ?? bankEntry?.id ?? item.id,
        correctAnswer,
        category: (item.stimulusData?.category as string) ?? bankEntry?.category ?? "screening",
        description: (item.stimulusData?.description as string) ?? bankEntry?.description ?? "Screening Plate",
      };
    });
  } else {
    // If activeItems was not explicitly passed, inspect the responses or fallback to default items
    const responseKeys = Object.keys(result.responses);
    if (responseKeys.length > 0) {
      itemsToScore = responseKeys.map((itemId, idx) => {
        const bankEntry = colorVisionQuestionBank.find((p) => p.id === itemId);
        return {
          id: itemId,
          title: bankEntry ? `Plate ${idx + 1}` : itemId,
          correctAnswer: bankEntry?.correctAnswer ?? "",
          category: bankEntry?.category ?? "screening",
          description: bankEntry?.description ?? "Screening Plate",
        };
      });
    } else {
      itemsToScore = colorVisionItems.map((item) => {
        const bankEntry = colorVisionQuestionBank.find((p) => p.id === item.id);
        return {
          id: item.id,
          title: item.title ?? item.id,
          correctAnswer: bankEntry?.correctAnswer ?? (item.stimulusData?.shape as string) ?? "",
          category: bankEntry?.category ?? "screening",
          description: bankEntry?.description ?? "Screening Plate",
        };
      });
    }
  }

  const evaluations: ColorVisionItemEvaluation[] = itemsToScore.map((item) => {
    const userResp: UserResponse<string | GeometricShape> | undefined = result.responses[item.id];
    const userValue = userResp?.value ? String(userResp.value).trim() : undefined;
    const expected = item.correctAnswer.trim();
    const isMatch = Boolean(userValue && userValue.toLowerCase() === expected.toLowerCase());

    return {
      itemId: item.id,
      itemTitle: item.title,
      expectedAnswer: item.correctAnswer,
      userResponse: userValue,
      isMatch,
      category: item.category,
      description: item.description,
      // Backward compatibility aliases
      expectedShape: (expected.toUpperCase() as GeometricShape) || "CANNOT_TELL",
      targetPair: item.description,
    };
  });

  const matchedCount = evaluations.filter((e) => e.isMatch).length;
  const answeredCount = Object.keys(result.responses).length;
  const totalItems = itemsToScore.length > 0 ? itemsToScore.length : result.totalItems || 5;
  const matchPercentage = totalItems > 0 ? Math.round((matchedCount / totalItems) * 100) : 0;

  return {
    testId: result.testId,
    status: result.status,
    totalItems,
    answeredCount,
    matchedCount,
    matchPercentage,
    evaluations,
    summaryNote: `Responses matched ${matchedCount} of ${totalItems} demonstration targets. This screening summary describes response agreement with the demonstration stimuli only and is not a medical diagnosis or clinical interpretation.`,
    displayLimitationsDisclaimer,
  };
}
