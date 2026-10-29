import assert from "node:assert/strict";
import {
  scoreDistanceVisionDemonstration,
  evaluateRowInput,
} from "./distance-vision-scoring";
import { snellenChartRows, TOTAL_SNELLEN_LETTERS } from "./distance-vision-data";
import { TestResult } from "@/types/test-engine";

console.log("Running Snellen-Style Distance Vision Scoring & Evaluation Tests...");

// Test 1: Null result handling
const nullSummary = scoreDistanceVisionDemonstration(null);
assert.equal(nullSummary.status, "cancelled");
assert.equal(nullSummary.matchedCount, 0);
assert.equal(nullSummary.totalItems, 7);
assert.equal(nullSummary.totalLetters, 28);
assert.equal(nullSummary.smallestPassedRowNumber, null);

// Test 2: Helper evaluateRowInput
// Row 1: E (1 letter, threshold 1)
assert.deepEqual(evaluateRowInput("E", "E", 1), {
  sanitized: "E",
  correctCount: 1,
  isPassed: true,
  cannotRead: false,
});
// Row 1: Case insensitivity and whitespace trimming
assert.deepEqual(evaluateRowInput("E", " e ", 1), {
  sanitized: "E",
  correctCount: 1,
  isPassed: true,
  cannotRead: false,
});
// Row 3: TOZ (3 letters, threshold 2)
assert.deepEqual(evaluateRowInput("TOZ", "TOZ", 2), {
  sanitized: "TOZ",
  correctCount: 3,
  isPassed: true,
  cannotRead: false,
});
assert.deepEqual(evaluateRowInput("TOZ", "TOX", 2), {
  sanitized: "TOX",
  correctCount: 2,
  isPassed: true,
  cannotRead: false,
});
assert.deepEqual(evaluateRowInput("TOZ", "TXX", 2), {
  sanitized: "TXX",
  correctCount: 1,
  isPassed: false,
  cannotRead: false,
});
// Cannot read response
assert.deepEqual(evaluateRowInput("TOZ", "CANNOT_READ", 2), {
  sanitized: "UNREADABLE",
  correctCount: 0,
  isPassed: false,
  cannotRead: true,
});

// Test 3: Perfect demonstration match (all 7 rows match expected letters)
const perfectResponses: Record<string, { itemId: string; value: string; answeredAt: number }> = {};
snellenChartRows.forEach((row) => {
  const itemId = `dv-row-0${row.rowNumber}`;
  perfectResponses[itemId] = {
    itemId,
    value: row.letters,
    answeredAt: Date.now(),
  };
});

const perfectResult: TestResult<string> = {
  testId: "distance-vision-screening",
  status: "completed",
  startedAt: Date.now() - 45000,
  finishedAt: Date.now(),
  totalItems: 7,
  answeredCount: 7,
  responses: perfectResponses,
};

const perfectSummary = scoreDistanceVisionDemonstration(perfectResult);
assert.equal(perfectSummary.status, "completed");
assert.equal(perfectSummary.answeredCount, 7);
assert.equal(perfectSummary.matchedCount, TOTAL_SNELLEN_LETTERS); // 28
assert.equal(perfectSummary.matchPercentage, 100);
assert.equal(perfectSummary.rowsPassedCount, 7);
assert.equal(perfectSummary.smallestPassedRowNumber, 7);
assert.equal(perfectSummary.smallestPassedFraction, "20/20");
assert.ok(perfectSummary.rowEvaluations.every((r) => r.isRowPassed));

// Test 4: Partial demonstration match (e.g. Rows 1 to 4 passed, Row 5 missed, Rows 6 and 7 unreadable)
const partialResponses = { ...perfectResponses };
// Row 5: expected PECFD (threshold 3). User enters PEZZZ (2 correct -> fail)
partialResponses["dv-row-05"] = {
  itemId: "dv-row-05",
  value: "PEZZZ",
  answeredAt: Date.now(),
};
// Row 6: CANNOT_READ
partialResponses["dv-row-06"] = {
  itemId: "dv-row-06",
  value: "CANNOT_READ",
  answeredAt: Date.now(),
};
// Row 7: CANNOT_READ
partialResponses["dv-row-07"] = {
  itemId: "dv-row-07",
  value: "CANNOT_READ",
  answeredAt: Date.now(),
};

const partialResult: TestResult<string> = {
  ...perfectResult,
  responses: partialResponses,
};

const partialSummary = scoreDistanceVisionDemonstration(partialResult);
// Rows 1 (1), 2 (2), 3 (3), 4 (4) = 10 correct + 2 in Row 5 = 12 correct
assert.equal(partialSummary.matchedCount, 12);
assert.equal(partialSummary.rowsPassedCount, 4);
assert.equal(partialSummary.smallestPassedRowNumber, 4);
assert.equal(partialSummary.smallestPassedFraction, "20/50");
assert.equal(partialSummary.rowEvaluations[0].isRowPassed, true);
assert.equal(partialSummary.rowEvaluations[1].isRowPassed, true);
assert.equal(partialSummary.rowEvaluations[2].isRowPassed, true);
assert.equal(partialSummary.rowEvaluations[3].isRowPassed, true);
assert.equal(partialSummary.rowEvaluations[4].isRowPassed, false);
assert.equal(partialSummary.rowEvaluations[5].isRowPassed, false);
assert.equal(partialSummary.rowEvaluations[6].isRowPassed, false);

// Test 5: Non-clinical language and disclaimer presence
const summaryString = JSON.stringify(partialSummary);
assert.ok(!summaryString.includes("myopia"), "Must not claim refractive diagnosis of myopia");
assert.ok(!summaryString.includes("astigmatism"), "Must not claim astigmatism diagnosis");
assert.ok(partialSummary.summaryNote.includes("Educational screening demonstration"));
assert.ok(partialSummary.calibrationDisclaimer.includes("educational screening tool"));

console.log("All Snellen-Style Distance Vision scoring assertions passed successfully!");
