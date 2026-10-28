import assert from "node:assert/strict";
import { scoreDistanceVisionDemonstration } from "./distance-vision-scoring";
import { distanceVisionItems, SnellenOptotype } from "./distance-vision-data";
import { TestResult } from "@/types/test-engine";

console.log("Running Distance Vision Scoring & Evaluation Tests...");

// Test 1: Null result handling
const nullSummary = scoreDistanceVisionDemonstration(null);
assert.equal(nullSummary.status, "cancelled");
assert.equal(nullSummary.matchedCount, 0);
assert.equal(nullSummary.totalItems, 5);

// Test 2: Perfect demonstration match (all 5 items match expected optotypes)
const perfectResponses: Record<string, { itemId: string; value: SnellenOptotype; answeredAt: number }> = {};
distanceVisionItems.forEach((item) => {
  perfectResponses[item.id] = {
    itemId: item.id,
    value: item.stimulusData?.optotype as SnellenOptotype,
    answeredAt: Date.now(),
  };
});

const perfectResult: TestResult<SnellenOptotype> = {
  testId: "distance-vision-screening",
  status: "completed",
  startedAt: Date.now() - 45000,
  finishedAt: Date.now(),
  totalItems: 5,
  answeredCount: 5,
  responses: perfectResponses,
};

const perfectSummary = scoreDistanceVisionDemonstration(perfectResult);
assert.equal(perfectSummary.status, "completed");
assert.equal(perfectSummary.answeredCount, 5);
assert.equal(perfectSummary.matchedCount, 5);
assert.equal(perfectSummary.matchPercentage, 100);
assert.equal(perfectSummary.evaluations.length, 5);
assert.ok(perfectSummary.evaluations.every((e) => e.isMatch));

// Test 3: Partial demonstration match (e.g. smaller optotypes missed or cannot tell)
const partialResponses = { ...perfectResponses };
// Change step 4 and step 5
partialResponses["dv-item-04"] = {
  itemId: "dv-item-04",
  value: "O", // incorrect choice for Z
  answeredAt: Date.now(),
};
partialResponses["dv-item-05"] = {
  itemId: "dv-item-05",
  value: "CANNOT_TELL",
  answeredAt: Date.now(),
};

const partialResult: TestResult<SnellenOptotype> = {
  ...perfectResult,
  responses: partialResponses,
};

const partialSummary = scoreDistanceVisionDemonstration(partialResult);
assert.equal(partialSummary.matchedCount, 3);
assert.equal(partialSummary.matchPercentage, 60); // 3/5 = 60%
assert.equal(partialSummary.evaluations[0].isMatch, true);
assert.equal(partialSummary.evaluations[1].isMatch, true);
assert.equal(partialSummary.evaluations[2].isMatch, true);
assert.equal(partialSummary.evaluations[3].isMatch, false);
assert.equal(partialSummary.evaluations[4].isMatch, false);

// Test 4: Verification of strict non-clinical language and disclaimer presence
const summaryString = JSON.stringify(partialSummary);
assert.ok(!summaryString.includes("20/20"), "Must not invent 20/20 clinical fraction");
assert.ok(!summaryString.includes("6/6"), "Must not invent 6/6 metric fraction");
assert.ok(!summaryString.includes("myopia"), "Must not claim refractive diagnosis");
assert.ok(!summaryString.includes("normal vision"), "Must not classify clinical normalcy");
assert.ok(partialSummary.summaryNote.includes("does not measure clinical visual acuity"));
assert.ok(partialSummary.calibrationDisclaimer.includes("calibration"));

console.log("All Distance Vision scoring assertions passed successfully!");
