import assert from "node:assert/strict";
import {
  scoreNearVisionDemonstration,
  evaluateNearLineInput,
  normalizeReadingResponse,
} from "./near-vision-scoring";
import {
  rosenbaumChartLines,
  nearVisionChartBank,
  nearVisionQuestionBank,
  fisherYatesShuffle,
  selectRandomNearChart,
  selectRandomNearCharts,
  createNearTestItems,
  TOTAL_ROSENBAUM_CHARACTERS,
} from "./near-vision-data";
import { TestResult } from "@/types/test-engine";

console.log("Running Rosenbaum Near Vision Bank, Randomization & Scoring Tests...");

// ============================================================================
// 1. Question Bank Integrity & Structure Tests (50+ Charts & 440 Questions)
// ============================================================================
assert.ok(
  nearVisionChartBank.length >= 50,
  `Near vision chart bank must contain at least 50 charts, got ${nearVisionChartBank.length}`
);
assert.equal(nearVisionChartBank.length, 55);

assert.ok(
  nearVisionQuestionBank.length >= 50,
  `Near vision question bank must contain at least 50 questions, got ${nearVisionQuestionBank.length}`
);
assert.equal(nearVisionQuestionBank.length, 55 * 8); // 440

const VALID_DIGITS = new Set(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);
const seenChartIds = new Set<string>();
const seenChartSignatures = new Set<string>();

const expectedLengths = [2, 3, 4, 5, 5, 6, 6, 6];
const expectedFractions = ["20/400", "20/200", "20/100", "20/70", "20/50", "20/40", "20/30", "20/20"];
const expectedJaegers = ["J14", "J10", "J7", "J5", "J3", "J2", "J1", "J1+"];
const expectedMinPass = [1, 2, 3, 3, 3, 4, 4, 4];
const expectedScales = [20.0, 10.0, 5.0, 3.5, 2.5, 2.0, 1.5, 1.0];

nearVisionChartBank.forEach((chart, chartIdx) => {
  // Unique Chart ID and Name
  assert.ok(chart.id, `Chart at index ${chartIdx} missing id`);
  assert.ok(!seenChartIds.has(chart.id), `Duplicate chart id: ${chart.id}`);
  seenChartIds.add(chart.id);
  assert.ok(chart.name.length > 5, `Chart ${chart.id} missing descriptive name`);

  // Exactly 8 lines per chart
  assert.equal(chart.lines.length, 8, `Chart ${chart.id} must have exactly 8 lines`);

  let chartCharCount = 0;
  chart.lines.forEach((line, lineIdx) => {
    assert.equal(line.lineNumber, lineIdx + 1, `Line number mismatch in ${chart.id}`);
    assert.equal(line.characters.length, expectedLengths[lineIdx], `Line ${line.lineNumber} length mismatch in ${chart.id}`);
    assert.equal(line.distanceEquivalent, expectedFractions[lineIdx]);
    assert.equal(line.jaegerEquivalent, expectedJaegers[lineIdx]);
    assert.equal(line.minPassCount, expectedMinPass[lineIdx]);
    assert.equal(line.relativeScale, expectedScales[lineIdx]);

    chartCharCount += line.characters.length;

    // All characters must be digits
    for (let c = 0; c < line.characters.length; c++) {
      const d = line.characters[c];
      assert.ok(
        VALID_DIGITS.has(d),
        `Invalid character '${d}' in ${chart.id} line ${line.lineNumber}`
      );
      // No adjacent identical digits
      if (c > 0) {
        assert.notEqual(
          d,
          line.characters[c - 1],
          `Adjacent duplicate digits in ${chart.id} line ${line.lineNumber}`
        );
      }
    }
  });

  assert.equal(chartCharCount, 37, `Chart ${chart.id} must have exactly 37 characters total`);

  // Verify unique full chart combination
  const sig = chart.lines.map((l) => l.characters).join("|");
  assert.ok(!seenChartSignatures.has(sig), `Duplicate chart pattern found: ${sig}`);
  seenChartSignatures.add(sig);
});

// ============================================================================
// 2. Question Bank Item Mapping Tests
// ============================================================================
const seenQuestionIds = new Set<string>();
nearVisionQuestionBank.forEach((q) => {
  assert.ok(!seenQuestionIds.has(q.id), `Duplicate question id: ${q.id}`);
  seenQuestionIds.add(q.id);
  assert.equal(q.expectedAnswer, q.characters);
  assert.equal(q.stimulusData.characters, q.characters);
  assert.ok(q.prompt.includes(`Line ${q.lineNumber}`));
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

const deterministicChartA = selectRandomNearChart(nearVisionChartBank, testPrng(42));
const deterministicChartB = selectRandomNearChart(nearVisionChartBank, testPrng(42));
assert.equal(deterministicChartA.id, deterministicChartB.id, "PRNG should produce reproducible chart selection");

const deterministicChartC = selectRandomNearChart(nearVisionChartBank, testPrng(999));
assert.ok(deterministicChartA.id, "Chart selection must return valid chart");
assert.ok(deterministicChartC.id, "Chart selection must return valid chart");

// Test selecting a subset of N charts
const sampled3 = selectRandomNearCharts(nearVisionChartBank, 3, testPrng(123));
assert.equal(sampled3.length, 3);
const uniqueSampledIds = new Set(sampled3.map((c) => c.id));
assert.equal(uniqueSampledIds.size, 3, "Sampled charts must be unique");

// ============================================================================
// 4. Session Items Generation Tests
// ============================================================================
const sessionChart = nearVisionChartBank[2]; // High-Contrast Series B
const sessionItems = createNearTestItems(sessionChart.lines, sessionChart.id);
assert.equal(sessionItems.length, 8);
sessionItems.forEach((item, idx) => {
  const line = sessionChart.lines[idx];
  assert.equal(item.id, `nv-line-0${line.lineNumber}`);
  const stimulus = item.stimulusData as { characters?: string; chartId?: string };
  assert.equal(stimulus?.characters, line.characters);
  assert.equal(stimulus?.chartId, sessionChart.id);
});

// ============================================================================
// 5. Normalization & evaluateNearLineInput Tests
// ============================================================================
assert.equal(normalizeReadingResponse("garden"), "garden");
assert.equal(normalizeReadingResponse("  Garden  "), "garden");
assert.equal(normalizeReadingResponse("VALLEY."), "valley");
assert.equal(normalizeReadingResponse("breeze!"), "breeze");
assert.equal(normalizeReadingResponse("  "), "");
assert.equal(normalizeReadingResponse(undefined), "");

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

// ============================================================================
// 6. Scoring with Default / Backward Compatible Chart
// ============================================================================
const nullSummary = scoreNearVisionDemonstration(null);
assert.equal(nullSummary.status, "cancelled");
assert.equal(nullSummary.matchedCount, 0);
assert.equal(nullSummary.cannotReadCount, 0);
assert.equal(nullSummary.totalItems, 8);
assert.equal(nullSummary.totalCharacters, 37);
assert.equal(nullSummary.linesPassedCount, 0);
assert.equal(nullSummary.smallestPassedLineNumber, null);

// Perfect demonstration match (all 8 lines, 37 characters)
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

// ============================================================================
// 7. Scoring with Randomized Chart from Question Bank
// ============================================================================
const randomizedChart = nearVisionChartBank[15]; // Rosenbaum Chart 16
const randResponses: Record<string, { itemId: string; value: string; answeredAt: number }> = {};
randomizedChart.lines.forEach((line) => {
  const itemId = `nv-line-0${line.lineNumber}`;
  randResponses[itemId] = {
    itemId,
    value: line.characters,
    answeredAt: Date.now(),
  };
});

const randResult: TestResult<string> = {
  testId: "near-vision-screening",
  status: "completed",
  startedAt: Date.now() - 40000,
  finishedAt: Date.now(),
  totalItems: 8,
  answeredCount: 8,
  responses: randResponses,
};

const randSummary = scoreNearVisionDemonstration(randResult, randomizedChart);
assert.equal(randSummary.chartId, randomizedChart.id);
assert.equal(randSummary.chartName, randomizedChart.name);
assert.equal(randSummary.matchedCount, 37);
assert.equal(randSummary.matchPercentage, 100);
assert.equal(randSummary.linesPassedCount, 8);
assert.equal(randSummary.smallestPassedLineNumber, 8);
assert.equal(randSummary.smallestPassedFraction, "20/20");
assert.equal(randSummary.smallestPassedJaeger, "J1+");

// Partial match on randomized chart
const partialRandResponses = { ...randResponses };
// Line 6 of Chart 16: "593720" (minPassCount 4). Enter "593799" -> 4 match -> pass
partialRandResponses["nv-line-06"] = {
  itemId: "nv-line-06",
  value: "593799",
  answeredAt: Date.now(),
};
// Line 7: "716385" -> "710000" (2 match -> fail)
partialRandResponses["nv-line-07"] = {
  itemId: "nv-line-07",
  value: "710000",
  answeredAt: Date.now(),
};
// Line 8: CANNOT_READ
partialRandResponses["nv-line-08"] = {
  itemId: "nv-line-08",
  value: "CANNOT_READ",
  answeredAt: Date.now(),
};

const partialRandResult: TestResult<string> = {
  ...randResult,
  responses: partialRandResponses,
};

const partialRandSummary = scoreNearVisionDemonstration(partialRandResult, randomizedChart);
assert.equal(partialRandSummary.linesPassedCount, 6);
assert.equal(partialRandSummary.smallestPassedLineNumber, 6);
assert.equal(partialRandSummary.smallestPassedFraction, "20/40");
assert.equal(partialRandSummary.smallestPassedJaeger, "J2");
assert.equal(partialRandSummary.cannotReadCount, 1);
assert.equal(partialRandSummary.lineEvaluations[5].isLinePassed, true);
assert.equal(partialRandSummary.lineEvaluations[6].isLinePassed, false);
assert.equal(partialRandSummary.lineEvaluations[7].cannotReadDeclared, true);

// Non-clinical disclaimer checks
const summaryString = JSON.stringify(partialRandSummary).toLowerCase();
assert.ok(!summaryString.includes("prescribe lenses"), "Must not claim to prescribe lenses");
assert.ok(partialRandSummary.summaryNote.includes("does not measure clinical reading acuity"));
assert.ok(partialRandSummary.calibrationDisclaimer.includes("calibration"));
assert.ok(partialRandSummary.calibrationDisclaimer.includes("14-inch (35 cm)"));

console.log("All Rosenbaum Near Vision Bank, Randomization & Scoring Tests Passed Successfully!");
