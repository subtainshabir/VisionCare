import assert from "node:assert/strict";
import { scoreColorVisionDemonstration } from "./color-vision-scoring";
import { colorVisionItems, GeometricShape } from "./color-vision-data";
import { TestResult } from "@/types/test-engine";

console.log("Running Color Vision Scoring & Evaluation Tests...");

// Test 1: Null result handling
const nullSummary = scoreColorVisionDemonstration(null);
assert.equal(nullSummary.status, "cancelled");
assert.equal(nullSummary.matchedCount, 0);
assert.equal(nullSummary.totalItems, 6);

// Test 2: Perfect demonstration match (all 6 items match expected shapes)
const perfectResponses: Record<string, { itemId: string; value: GeometricShape; answeredAt: number }> = {};
colorVisionItems.forEach((item) => {
  perfectResponses[item.id] = {
    itemId: item.id,
    value: item.stimulusData?.shape as GeometricShape,
    answeredAt: Date.now(),
  };
});

const perfectResult: TestResult<GeometricShape> = {
  testId: "color-vision-screening",
  status: "completed",
  startedAt: Date.now() - 60000,
  finishedAt: Date.now(),
  totalItems: 6,
  answeredCount: 6,
  responses: perfectResponses,
};

const perfectSummary = scoreColorVisionDemonstration(perfectResult);
assert.equal(perfectSummary.status, "completed");
assert.equal(perfectSummary.answeredCount, 6);
assert.equal(perfectSummary.matchedCount, 6);
assert.equal(perfectSummary.matchPercentage, 100);
assert.equal(perfectSummary.evaluations.length, 6);
assert.ok(perfectSummary.evaluations.every((e) => e.isMatch));

// Test 3: Partial demonstration match (e.g. Protan/Deutan missed or cannot tell)
const partialResponses = { ...perfectResponses };
// Change item 2 and item 4
partialResponses["cv-item-02"] = {
  itemId: "cv-item-02",
  value: "CANNOT_TELL",
  answeredAt: Date.now(),
};
partialResponses["cv-item-04"] = {
  itemId: "cv-item-04",
  value: "CIRCLE", // incorrect choice for diamond
  answeredAt: Date.now(),
};

const partialResult: TestResult<GeometricShape> = {
  ...perfectResult,
  responses: partialResponses,
};

const partialSummary = scoreColorVisionDemonstration(partialResult);
assert.equal(partialSummary.matchedCount, 4);
assert.equal(partialSummary.matchPercentage, 67); // 4/6 = 66.67% -> 67%
assert.equal(partialSummary.evaluations[1].isMatch, false);
assert.equal(partialSummary.evaluations[3].isMatch, false);
assert.equal(partialSummary.evaluations[0].isMatch, true);

// Test 4: Verification of non-clinical language
assert.ok(!JSON.stringify(partialSummary).includes("color blind"));
assert.ok(!JSON.stringify(partialSummary).includes("protanopia"));
assert.ok(!JSON.stringify(partialSummary).includes("deuteranopia"));
assert.ok(partialSummary.summaryNote.includes("not a medical diagnosis"));
assert.ok(partialSummary.displayLimitationsDisclaimer.includes("display"));

console.log("All Color Vision scoring assertions passed successfully!");
