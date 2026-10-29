import assert from "node:assert/strict";
import {
  scoreNearVisionDemonstration,
  evaluateNearLineInput,
  normalizeReadingResponse,
} from "./near-vision-scoring";
import {
  rosenbaumChartLines,
  TOTAL_ROSENBAUM_CHARACTERS,
} from "./near-vision-data";
import { TestResult } from "@/types/test-engine";

console.log("Running Rosenbaum Near Vision Scoring & Evaluation Tests...");

// Test 1: Normalization unit tests
assert.equal(normalizeReadingResponse("garden"), "garden");
assert.equal(normalizeReadingResponse("  Garden  "), "garden");
assert.equal(normalizeReadingResponse("VALLEY."), "valley");
assert.equal(normalizeReadingResponse("breeze!"), "breeze");
assert.equal(normalizeReadingResponse("  "), "");
assert.equal(normalizeReadingResponse(undefined), "");

// Test 2: evaluateNearLineInput unit tests
// Exact digit match
const r1 = evaluateNearLineInput("95", "95", 1);
assert.equal(r1.sanitized, "95");
assert.equal(r1.correctCount, 2);
assert.equal(r1.isPassed, true);
assert.equal(r1.cannotRead, false);

// Strips spaces and non-numeric characters
const r2 = evaluateNearLineInput("6385", "6 3 - 8 5", 3);
assert.equal(r2.sanitized, "6385");
assert.equal(r2.correctCount, 4);
assert.equal(r2.isPassed, true);

// Partial match meeting threshold (>50%)
const r3 = evaluateNearLineInput("87452", "87499", 3); // 3 of 5 match (threshold is 3)
assert.equal(r3.correctCount, 3);
assert.equal(r3.isPassed, true);

// Partial match failing threshold
const r4 = evaluateNearLineInput("87452", "87000", 3); // 2 of 5 match (threshold is 3)
assert.equal(r4.correctCount, 2);
assert.equal(r4.isPassed, false);

// Cannot read flag
const r5 = evaluateNearLineInput("374258", "CANNOT_READ", 4);
assert.equal(r5.cannotRead, true);
assert.equal(r5.correctCount, 0);
assert.equal(r5.isPassed, false);

// Test 3: Null result handling
const nullSummary = scoreNearVisionDemonstration(null);
assert.equal(nullSummary.status, "cancelled");
assert.equal(nullSummary.matchedCount, 0);
assert.equal(nullSummary.cannotReadCount, 0);
assert.equal(nullSummary.totalItems, 8);
assert.equal(nullSummary.totalCharacters, 37);
assert.equal(nullSummary.linesPassedCount, 0);
assert.equal(nullSummary.smallestPassedLineNumber, null);

// Test 4: Perfect demonstration match (all 8 lines, 37 characters)
const perfectResponses: Record<string, { itemId: string; value: string; answeredAt: number }> = {};
rosenbaumChartLines.forEach((line) => {
  const itemId = `nv-line-0${line.lineNumber}`;
  perfectResponses[itemId] = {
    itemId,
    value: line.characters,
    answeredAt: Date.now(),
  };
});

const perfectResult: TestResult<string> = {
  testId: "near-vision-screening",
  status: "completed",
  startedAt: Date.now() - 60000,
  finishedAt: Date.now(),
  totalItems: rosenbaumChartLines.length,
  answeredCount: rosenbaumChartLines.length,
  responses: perfectResponses,
};

const perfectSummary = scoreNearVisionDemonstration(perfectResult);
assert.equal(perfectSummary.status, "completed");
assert.equal(perfectSummary.totalItems, 8);
assert.equal(perfectSummary.totalCharacters, TOTAL_ROSENBAUM_CHARACTERS);
assert.equal(perfectSummary.answeredCount, 8);
assert.equal(perfectSummary.matchedCount, 37);
assert.equal(perfectSummary.cannotReadCount, 0);
assert.equal(perfectSummary.matchPercentage, 100);
assert.equal(perfectSummary.linesPassedCount, 8);
assert.equal(perfectSummary.smallestPassedLineNumber, 8);
assert.equal(perfectSummary.smallestPassedFraction, "20/20");
assert.equal(perfectSummary.smallestPassedJaeger, "J1+");
assert.ok(perfectSummary.smallestPassedLineText.includes("Line 8"));
assert.equal(perfectSummary.lineEvaluations.length, 8);
assert.ok(perfectSummary.lineEvaluations.every((l) => l.isLinePassed));

// Test 5: Partial demonstration match
const partialResponses: Record<string, { itemId: string; value: string; answeredAt: number }> = {};
rosenbaumChartLines.forEach((line) => {
  const itemId = `nv-line-0${line.lineNumber}`;
  if (line.lineNumber <= 5) {
    partialResponses[itemId] = { itemId, value: line.characters, answeredAt: Date.now() };
  } else if (line.lineNumber === 6) {
    // 374258 -> 374200 (4 out of 6 correct, minPass is 4)
    partialResponses[itemId] = { itemId, value: "374200", answeredAt: Date.now() };
  } else if (line.lineNumber === 7) {
    // 937826 -> 930000 (2 out of 6 correct, minPass is 4)
    partialResponses[itemId] = { itemId, value: "930000", answeredAt: Date.now() };
  } else {
    // Line 8 marked CANNOT_READ
    partialResponses[itemId] = { itemId, value: "CANNOT_READ", answeredAt: Date.now() };
  }
});

const partialResult: TestResult<string> = {
  ...perfectResult,
  responses: partialResponses,
};

const partialSummary = scoreNearVisionDemonstration(partialResult);
assert.equal(partialSummary.linesPassedCount, 6);
assert.equal(partialSummary.smallestPassedLineNumber, 6);
assert.equal(partialSummary.smallestPassedFraction, "20/40");
assert.equal(partialSummary.smallestPassedJaeger, "J2");
assert.equal(partialSummary.cannotReadCount, 1);
assert.equal(partialSummary.lineEvaluations[5].isLinePassed, true);
assert.equal(partialSummary.lineEvaluations[6].isLinePassed, false);
assert.equal(partialSummary.lineEvaluations[7].cannotReadDeclared, true);

// Test 6: Strict clinical non-diagnostic disclaimer check
const summaryString = JSON.stringify(partialSummary).toLowerCase();
assert.ok(!summaryString.includes("prescribe lenses"), "Must not claim to prescribe lenses");
assert.ok(partialSummary.summaryNote.includes("does not measure clinical reading acuity"));
assert.ok(partialSummary.calibrationDisclaimer.includes("calibration"));
assert.ok(partialSummary.calibrationDisclaimer.includes("14-inch (35 cm)"));

console.log("All Rosenbaum Near Vision scoring assertions passed successfully!");
