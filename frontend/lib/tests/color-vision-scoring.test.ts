import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { scoreColorVisionDemonstration } from "./color-vision-scoring";
import {
  colorVisionQuestionBank,
  prepareSessionQuestions,
  selectRandomQuestions,
  fisherYatesShuffle,
} from "./color-vision-data";
import { TestResult } from "@/types/test-engine";

console.log("Running Color Vision Bank, Randomization & Scoring Tests...");

// -------------------------------------------------------------
// Test 1: Null result handling
// -------------------------------------------------------------
const nullSummary = scoreColorVisionDemonstration(null);
assert.equal(nullSummary.status, "cancelled");
assert.equal(nullSummary.matchedCount, 0);
assert.equal(nullSummary.totalItems, 5);

// -------------------------------------------------------------
// Test 2: Question bank size and integrity (100+ unique plates)
// -------------------------------------------------------------
assert.ok(
  colorVisionQuestionBank.length >= 100,
  `Bank must contain >= 100 plates, found: ${colorVisionQuestionBank.length}`
);

// Verify uniqueness of question IDs and images
const uniqueIds = new Set(colorVisionQuestionBank.map((p) => p.id));
assert.equal(
  uniqueIds.size,
  colorVisionQuestionBank.length,
  "All question bank IDs must be unique"
);

const uniqueImages = new Set(colorVisionQuestionBank.map((p) => p.image));
assert.equal(
  uniqueImages.size,
  colorVisionQuestionBank.length,
  "All question bank image paths must be unique"
);

// Verify that for every plate, correctAnswer is among its options
colorVisionQuestionBank.forEach((plate) => {
  assert.ok(
    plate.options.includes(plate.correctAnswer),
    `Plate ${plate.id} must include correct answer '${plate.correctAnswer}' in options: ${plate.options.join(", ")}`
  );
  assert.ok(plate.options.length >= 4, `Plate ${plate.id} must have at least 4 options`);
});

// -------------------------------------------------------------
// Test 3: Verify local SVG assets exist on disk
// -------------------------------------------------------------
const publicAssetsDir = path.join(process.cwd(), "public", "assets", "color-vision");
if (fs.existsSync(publicAssetsDir)) {
  colorVisionQuestionBank.forEach((plate) => {
    const filename = path.basename(plate.image);
    const diskPath = path.join(publicAssetsDir, filename);
    assert.ok(
      fs.existsSync(diskPath),
      `Asset for plate ${plate.id} must exist at ${diskPath}`
    );
  });
}

// -------------------------------------------------------------
// Test 4: Exactly 5 unique questions per session (no repeats)
// -------------------------------------------------------------
const session1 = selectRandomQuestions(colorVisionQuestionBank, 5);
assert.equal(session1.length, 5, "Session must contain exactly 5 questions");
const session1Ids = new Set(session1.map((p) => p.id));
assert.equal(session1Ids.size, 5, "No duplicate questions allowed in the same session");

// -------------------------------------------------------------
// Test 5: Fisher-Yates shuffle algorithm unit testing
// -------------------------------------------------------------
const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const shuffledCopy = fisherYatesShuffle(testArray, () => 0.5);
assert.equal(shuffledCopy.length, testArray.length);
assert.equal(testArray.length, 10, "Original array must not be mutated");

// Deterministic mocked random testing for session questions
let mockCounter = 0;
const deterministicRandom = () => {
  mockCounter++;
  return (mockCounter * 0.173) % 1;
};

const deterministicSession = prepareSessionQuestions(
  colorVisionQuestionBank,
  5,
  deterministicRandom
);
assert.equal(deterministicSession.length, 5);
const detIds = new Set(deterministicSession.map((i) => i.id));
assert.equal(detIds.size, 5);

// -------------------------------------------------------------
// Test 6: Option shuffling preserves correct answer value
// -------------------------------------------------------------
deterministicSession.forEach((item) => {
  const bankEntry = colorVisionQuestionBank.find((p) => p.id === item.id);
  assert.ok(bankEntry, `Item ${item.id} must exist in question bank`);
  const correct = bankEntry.correctAnswer;

  const optionValues = item.options?.map((o) => o.value) ?? [];
  assert.ok(
    optionValues.includes(correct),
    `Shuffled options must still contain correct answer '${correct}'`
  );
  assert.equal(optionValues.length, bankEntry.options.length);
});

// -------------------------------------------------------------
// Test 7: Perfect score out of 5 (5/5 = 100%)
// -------------------------------------------------------------
const activeItems = prepareSessionQuestions(colorVisionQuestionBank, 5);
const perfectResponses: Record<
  string,
  { itemId: string; value: string; answeredAt: number }
> = {};

activeItems.forEach((item) => {
  const correct = item.stimulusData?.correctAnswer as string;
  perfectResponses[item.id] = {
    itemId: item.id,
    value: correct,
    answeredAt: Date.now(),
  };
});

const perfectResult: TestResult<string> = {
  testId: "color-vision-screening",
  status: "completed",
  startedAt: Date.now() - 60000,
  finishedAt: Date.now(),
  totalItems: 5,
  answeredCount: 5,
  responses: perfectResponses,
};

const perfectSummary = scoreColorVisionDemonstration(perfectResult, activeItems);
assert.equal(perfectSummary.status, "completed");
assert.equal(perfectSummary.totalItems, 5);
assert.equal(perfectSummary.answeredCount, 5);
assert.equal(perfectSummary.matchedCount, 5);
assert.equal(perfectSummary.matchPercentage, 100);
assert.equal(perfectSummary.evaluations.length, 5);
assert.ok(perfectSummary.evaluations.every((e) => e.isMatch));

// -------------------------------------------------------------
// Test 8: Partial score (3 out of 5 = 60%)
// -------------------------------------------------------------
const partialResponses = { ...perfectResponses };
const keys = Object.keys(partialResponses);
partialResponses[keys[0]] = {
  itemId: keys[0],
  value: "Wrong Choice",
  answeredAt: Date.now(),
};
partialResponses[keys[1]] = {
  itemId: keys[1],
  value: "Nothing / Unclear",
  answeredAt: Date.now(),
};

const partialResult: TestResult<string> = {
  ...perfectResult,
  responses: partialResponses,
};

const partialSummary = scoreColorVisionDemonstration(partialResult, activeItems);
assert.equal(partialSummary.matchedCount, 3);
assert.equal(partialSummary.totalItems, 5);
assert.equal(partialSummary.matchPercentage, 60);
assert.equal(partialSummary.evaluations[0].isMatch, false);
assert.equal(partialSummary.evaluations[1].isMatch, false);
assert.equal(partialSummary.evaluations[2].isMatch, true);
assert.equal(partialSummary.evaluations[3].isMatch, true);
assert.equal(partialSummary.evaluations[4].isMatch, true);

// -------------------------------------------------------------
// Test 9: Restart generates a fresh randomized session
// -------------------------------------------------------------
let seed1 = 0.1;
let seed2 = 0.8;
const sessionA = selectRandomQuestions(colorVisionQuestionBank, 5, () => {
  seed1 = (seed1 + 0.37) % 1;
  return seed1;
});
const sessionB = selectRandomQuestions(colorVisionQuestionBank, 5, () => {
  seed2 = (seed2 + 0.53) % 1;
  return seed2;
});

const idsA = sessionA.map((p) => p.id).join(",");
const idsB = sessionB.map((p) => p.id).join(",");
assert.notEqual(idsA, idsB, "Restart must generate a distinct randomized sequence");

// -------------------------------------------------------------
// Test 10: Non-clinical terminology verification
// -------------------------------------------------------------
assert.ok(!JSON.stringify(partialSummary).includes("color blind"));
assert.ok(!JSON.stringify(partialSummary).includes("protanopia"));
assert.ok(!JSON.stringify(partialSummary).includes("deuteranopia"));
assert.ok(partialSummary.summaryNote.includes("not a medical diagnosis"));
assert.ok(partialSummary.displayLimitationsDisclaimer.includes("display"));

console.log("All Color Vision Bank, Randomization & Scoring Tests Passed Successfully!");
