import assert from "node:assert/strict";
import {
  scoreDistanceVisionDemonstration,
  evaluateRowInput,
} from "./distance-vision-scoring";
import {
  snellenChartRows,
  distanceVisionChartBank,
  distanceVisionQuestionBank,
  fisherYatesShuffle,
  selectRandomDistanceChart,
  selectRandomDistanceCharts,
  createDistanceTestItems,
  TOTAL_SNELLEN_LETTERS,
  SnellenOptotype,
} from "./distance-vision-data";
import { TestResult } from "@/types/test-engine";

console.log("Running Snellen-Style Distance Vision Bank, Randomization & Scoring Tests...");

// ============================================================================
// 1. Question Bank Integrity & Structure Tests (50+ Charts & 385 Questions)
// ============================================================================
assert.ok(
  distanceVisionChartBank.length >= 50,
  `Chart bank must contain at least 50 charts, got ${distanceVisionChartBank.length}`
);
assert.equal(distanceVisionChartBank.length, 55);

assert.ok(
  distanceVisionQuestionBank.length >= 50,
  `Question bank must contain at least 50 questions, got ${distanceVisionQuestionBank.length}`
);
assert.equal(distanceVisionQuestionBank.length, 55 * 7); // 385

const VALID_SNELLEN_OPTOTYPES: Set<SnellenOptotype> = new Set([
  "C", "D", "E", "F", "L", "O", "P", "T", "Z"
]);

const seenChartIds = new Set<string>();
const seenChartSignatures = new Set<string>();

distanceVisionChartBank.forEach((chart, chartIdx) => {
  // Unique Chart ID and Name
  assert.ok(chart.id, `Chart at ${chartIdx} missing id`);
  assert.ok(!seenChartIds.has(chart.id), `Duplicate chart id: ${chart.id}`);
  seenChartIds.add(chart.id);
  assert.ok(chart.name.length > 5, `Chart ${chart.id} missing descriptive name`);

  // Exactly 7 rows per chart
  assert.equal(chart.rows.length, 7, `Chart ${chart.id} must have exactly 7 rows`);

  const expectedFractions = ["20/200", "20/100", "20/70", "20/50", "20/40", "20/30", "20/20"];
  const expectedScales = [10.0, 5.0, 3.5, 2.5, 2.0, 1.5, 1.0];
  const expectedMinPass = [1, 2, 2, 3, 3, 4, 4];

  chart.rows.forEach((row, rowIdx) => {
    assert.equal(row.rowNumber, rowIdx + 1, `Row number mismatch in ${chart.id}`);
    assert.equal(row.letters.length, rowIdx + 1, `Row ${row.rowNumber} length mismatch in ${chart.id}`);
    assert.equal(row.snellenFraction, expectedFractions[rowIdx]);
    assert.equal(row.relativeScale, expectedScales[rowIdx]);
    assert.equal(row.minPassCount, expectedMinPass[rowIdx]);

    // All letters must belong to Hermann Snellen 5x5 optotype glyphs
    for (let c = 0; c < row.letters.length; c++) {
      const char = row.letters[c] as SnellenOptotype;
      assert.ok(
        VALID_SNELLEN_OPTOTYPES.has(char),
        `Invalid optotype '${char}' in ${chart.id} row ${row.rowNumber}`
      );
      // No adjacent identical letters
      if (c > 0) {
        assert.notEqual(
          char,
          row.letters[c - 1],
          `Adjacent duplicate letters in ${chart.id} row ${row.rowNumber}`
        );
      }
    }
  });

  // Verify unique full chart combination
  const sig = chart.rows.map((r) => r.letters).join("|");
  assert.ok(!seenChartSignatures.has(sig), `Duplicate chart pattern found: ${sig}`);
  seenChartSignatures.add(sig);
});

// ============================================================================
// 2. Question Bank Item Mapping Tests
// ============================================================================
const seenQuestionIds = new Set<string>();
distanceVisionQuestionBank.forEach((q) => {
  assert.ok(!seenQuestionIds.has(q.id), `Duplicate question id: ${q.id}`);
  seenQuestionIds.add(q.id);
  assert.equal(q.expectedAnswer, q.letters);
  assert.equal(q.stimulusData.letters, q.letters);
  assert.ok(q.prompt.includes(`Row ${q.rowNumber}`));
});

// ============================================================================
// 3. Fisher-Yates Randomization Tests
// ============================================================================
const sampleArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const shuffled = fisherYatesShuffle(sampleArr);
assert.equal(shuffled.length, sampleArr.length);
assert.equal(sampleArr.length, 10, "Original array must not be mutated");
assert.deepEqual(new Set(shuffled), new Set(sampleArr));

// Deterministic PRNG test
function testPrng(seed: number) {
  let state = ((seed + 1) * 1664525 + 1013904223) >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

const deterministicChartA = selectRandomDistanceChart(distanceVisionChartBank, testPrng(42));
const deterministicChartB = selectRandomDistanceChart(distanceVisionChartBank, testPrng(42));
assert.equal(deterministicChartA.id, deterministicChartB.id, "PRNG should produce reproducible chart selection");

const deterministicChartC = selectRandomDistanceChart(distanceVisionChartBank, testPrng(999));
assert.ok(deterministicChartA.id, "Chart selection must return valid chart");
assert.ok(deterministicChartC.id, "Chart selection must return valid chart");

// Test selecting a subset of N charts
const sampled3 = selectRandomDistanceCharts(distanceVisionChartBank, 3, testPrng(123));
assert.equal(sampled3.length, 3);
const uniqueSampledIds = new Set(sampled3.map((c) => c.id));
assert.equal(uniqueSampledIds.size, 3, "Sampled charts must be unique");

// ============================================================================
// 4. Session Items Generation Tests
// ============================================================================
const sessionChart = distanceVisionChartBank[2]; // Modern Contrast Variant A
const sessionItems = createDistanceTestItems(sessionChart.rows, sessionChart.id);
assert.equal(sessionItems.length, 7);
sessionItems.forEach((item, idx) => {
  const row = sessionChart.rows[idx];
  assert.equal(item.id, `dv-row-0${row.rowNumber}`);
  const stimulus = item.stimulusData as { letters?: string; chartId?: string };
  assert.equal(stimulus?.letters, row.letters);
  assert.equal(stimulus?.chartId, sessionChart.id);
});

// ============================================================================
// 5. Scoring with Default / Backward Compatible Chart
// ============================================================================
const nullSummary = scoreDistanceVisionDemonstration(null);
assert.equal(nullSummary.status, "cancelled");
assert.equal(nullSummary.matchedCount, 0);
assert.equal(nullSummary.totalItems, 7);
assert.equal(nullSummary.totalLetters, 28);
assert.equal(nullSummary.smallestPassedRowNumber, null);

// Helper evaluateRowInput checks
assert.deepEqual(evaluateRowInput("E", "E", 1), {
  sanitized: "E",
  correctCount: 1,
  isPassed: true,
  cannotRead: false,
});
assert.deepEqual(evaluateRowInput("E", " e ", 1), {
  sanitized: "E",
  correctCount: 1,
  isPassed: true,
  cannotRead: false,
});
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
assert.deepEqual(evaluateRowInput("TOZ", "CANNOT_READ", 2), {
  sanitized: "UNREADABLE",
  correctCount: 0,
  isPassed: false,
  cannotRead: true,
});

// Perfect demonstration match with default chart
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
assert.equal(perfectSummary.matchedCount, TOTAL_SNELLEN_LETTERS);
assert.equal(perfectSummary.matchPercentage, 100);
assert.equal(perfectSummary.rowsPassedCount, 7);
assert.equal(perfectSummary.smallestPassedRowNumber, 7);
assert.equal(perfectSummary.smallestPassedFraction, "20/20");

// ============================================================================
// 6. Scoring with Randomized Chart from Question Bank
// ============================================================================
const randomizedChart = distanceVisionChartBank[15]; // Snellen Chart 16
const randResponses: Record<string, { itemId: string; value: string; answeredAt: number }> = {};
randomizedChart.rows.forEach((row) => {
  const itemId = `dv-row-0${row.rowNumber}`;
  randResponses[itemId] = {
    itemId,
    value: row.letters,
    answeredAt: Date.now(),
  };
});

const randResult: TestResult<string> = {
  testId: "distance-vision-screening",
  status: "completed",
  startedAt: Date.now() - 30000,
  finishedAt: Date.now(),
  totalItems: 7,
  answeredCount: 7,
  responses: randResponses,
};

const randSummary = scoreDistanceVisionDemonstration(randResult, randomizedChart);
assert.equal(randSummary.chartId, randomizedChart.id);
assert.equal(randSummary.chartName, randomizedChart.name);
assert.equal(randSummary.matchedCount, 28);
assert.equal(randSummary.matchPercentage, 100);
assert.equal(randSummary.rowsPassedCount, 7);
assert.equal(randSummary.smallestPassedRowNumber, 7);
assert.equal(randSummary.smallestPassedFraction, "20/20");

// Partial match on randomized chart
const partialRandResponses = { ...randResponses };
// Row 5 of Chart 16: "FEODT" (minPassCount 3). Enter "FEZZZ" (2 correct -> fail)
partialRandResponses["dv-row-05"] = {
  itemId: "dv-row-05",
  value: "FEZZZ",
  answeredAt: Date.now(),
};
partialRandResponses["dv-row-06"] = {
  itemId: "dv-row-06",
  value: "CANNOT_READ",
  answeredAt: Date.now(),
};
partialRandResponses["dv-row-07"] = {
  itemId: "dv-row-07",
  value: "CANNOT_READ",
  answeredAt: Date.now(),
};

const partialRandResult: TestResult<string> = {
  ...randResult,
  responses: partialRandResponses,
};

const partialRandSummary = scoreDistanceVisionDemonstration(partialRandResult, randomizedChart);
assert.equal(partialRandSummary.rowsPassedCount, 4);
assert.equal(partialRandSummary.smallestPassedRowNumber, 4);
assert.equal(partialRandSummary.smallestPassedFraction, "20/50");
assert.equal(partialRandSummary.rowEvaluations[0].isRowPassed, true);
assert.equal(partialRandSummary.rowEvaluations[1].isRowPassed, true);
assert.equal(partialRandSummary.rowEvaluations[2].isRowPassed, true);
assert.equal(partialRandSummary.rowEvaluations[3].isRowPassed, true);
assert.equal(partialRandSummary.rowEvaluations[4].isRowPassed, false);
assert.equal(partialRandSummary.rowEvaluations[5].isRowPassed, false);
assert.equal(partialRandSummary.rowEvaluations[6].isRowPassed, false);

// Non-clinical disclaimer checks
const summaryJson = JSON.stringify(partialRandSummary);
assert.ok(!summaryJson.includes("myopia"));
assert.ok(!summaryJson.includes("astigmatism"));
assert.ok(partialRandSummary.summaryNote.includes("Educational screening demonstration"));
assert.ok(partialRandSummary.calibrationDisclaimer.includes("educational screening tool"));

console.log("All Snellen-Style Distance Vision Bank, Randomization & Scoring Tests Passed Successfully!");
