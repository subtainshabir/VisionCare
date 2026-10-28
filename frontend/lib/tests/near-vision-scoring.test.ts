import assert from "node:assert/strict";
import {
  scoreNearVisionDemonstration,
  normalizeReadingResponse,
} from "./near-vision-scoring";
import { nearVisionItems } from "./near-vision-data";
import { TestResult } from "@/types/test-engine";

console.log("Running Near Vision Scoring & Evaluation Tests...");

// Test 1: Normalization unit tests
assert.equal(normalizeReadingResponse("garden"), "garden");
assert.equal(normalizeReadingResponse("  Garden  "), "garden");
assert.equal(normalizeReadingResponse("VALLEY."), "valley");
assert.equal(normalizeReadingResponse("breeze!"), "breeze");
assert.equal(normalizeReadingResponse("  "), "");
assert.equal(normalizeReadingResponse(undefined), "");

// Test 2: Null result handling
const nullSummary = scoreNearVisionDemonstration(null);
assert.equal(nullSummary.status, "cancelled");
assert.equal(nullSummary.matchedCount, 0);
assert.equal(nullSummary.cannotReadCount, 0);
assert.equal(nullSummary.totalItems, 5);

// Test 3: Perfect demonstration match (including mixed case and whitespace)
const perfectResponses: Record<string, { itemId: string; value: string; answeredAt: number }> = {};
nearVisionItems.forEach((item, idx) => {
  const target = item.stimulusData?.targetWord as string;
  // Mix case on some items to verify robust normalization
  const value = idx % 2 === 0 ? target.toUpperCase() : `  ${target}  `;
  perfectResponses[item.id] = {
    itemId: item.id,
    value,
    answeredAt: Date.now(),
  };
});

const perfectResult: TestResult<string> = {
  testId: "near-vision-screening",
  status: "completed",
  startedAt: Date.now() - 50000,
  finishedAt: Date.now(),
  totalItems: 5,
  answeredCount: 5,
  responses: perfectResponses,
};

const perfectSummary = scoreNearVisionDemonstration(perfectResult);
assert.equal(perfectSummary.status, "completed");
assert.equal(perfectSummary.answeredCount, 5);
assert.equal(perfectSummary.matchedCount, 5);
assert.equal(perfectSummary.cannotReadCount, 0);
assert.equal(perfectSummary.matchPercentage, 100);
assert.equal(perfectSummary.evaluations.length, 5);
assert.ok(perfectSummary.evaluations.every((e) => e.isMatch));

// Test 4: Partial demonstration match (some correct, some cannot read, some wrong)
const partialResponses = { ...perfectResponses };
partialResponses["nv-item-04"] = {
  itemId: "nv-item-04",
  value: "rivers", // wrong choice for clouds
  answeredAt: Date.now(),
};
partialResponses["nv-item-05"] = {
  itemId: "nv-item-05",
  value: "CANNOT_READ", // declared unreadable
  answeredAt: Date.now(),
};

const partialResult: TestResult<string> = {
  ...perfectResult,
  responses: partialResponses,
};

const partialSummary = scoreNearVisionDemonstration(partialResult);
assert.equal(partialSummary.matchedCount, 3);
assert.equal(partialSummary.cannotReadCount, 1);
assert.equal(partialSummary.matchPercentage, 60); // 3/5 = 60%
assert.equal(partialSummary.evaluations[0].isMatch, true);
assert.equal(partialSummary.evaluations[1].isMatch, true);
assert.equal(partialSummary.evaluations[2].isMatch, true);
assert.equal(partialSummary.evaluations[3].isMatch, false);
assert.equal(partialSummary.evaluations[4].isMatch, false);
assert.equal(partialSummary.evaluations[4].cannotReadDeclared, true);

// Test 5: Strict non-clinical language and disclaimer presence
const summaryString = JSON.stringify(partialSummary).toLowerCase();
assert.ok(!summaryString.includes("jaeger"), "Must not invent Jaeger scores (e.g. J1, J2)");
assert.ok(!summaryString.includes("presbyopia"), "Must not diagnose presbyopia");
assert.ok(!summaryString.includes("hyperopia"), "Must not diagnose hyperopia");
assert.ok(!summaryString.includes("normal vision"), "Must not classify clinical normalcy");
assert.ok(partialSummary.summaryNote.includes("does not measure clinical reading acuity"));
assert.ok(partialSummary.calibrationDisclaimer.includes("calibration"));

console.log("All Near Vision scoring assertions passed successfully!");
