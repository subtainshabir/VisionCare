import assert from "node:assert/strict";
import {
  createInitialSessionState,
  testSessionReducer,
  getComputedProgress,
  getTestResult,
} from "./session-reducer";
import { TestMetadata, TestItem } from "@/types/test-engine";

console.log("Running Test Engine State Machine Verification...");

const mockMetadata: TestMetadata = {
  id: "test-meta-01",
  title: "Test Unit",
  category: "Visual Acuity",
  description: "Unit testing test metadata",
  instructions: ["Step 1", "Step 2"],
  allowPrevious: true,
  requireAnswerToAdvance: true,
};

const mockItems: Array<TestItem<string>> = [
  { id: "item-1", prompt: "Question 1" },
  { id: "item-2", prompt: "Question 2" },
  { id: "item-3", prompt: "Question 3" },
];

// Test 1: Initial state
let state = createInitialSessionState<string>();
assert.equal(state.status, "idle");
assert.equal(state.items.length, 0);

// Test 2: Initialize
state = testSessionReducer(state, {
  type: "INITIALIZE",
  payload: { metadata: mockMetadata, items: mockItems },
});
assert.equal(state.status, "instructions");
assert.equal(state.items.length, 3);
assert.equal(state.currentIndex, 0);

// Test 3: Cannot record responses while in instructions
const invalidRecord = testSessionReducer(state, {
  type: "RECORD_RESPONSE",
  payload: { itemId: "item-1", value: "A" },
});
assert.equal(Object.keys(invalidRecord.responses).length, 0);

// Test 4: Start session
state = testSessionReducer(state, { type: "START" });
assert.equal(state.status, "in_progress");
assert.ok(state.startedAt !== null);

// Test 5: Require answer to advance - attempt next without answer
const blockedNext = testSessionReducer(state, { type: "NEXT_ITEM" });
assert.equal(blockedNext.currentIndex, 0, "Should not advance without answering when required");

// Test 6: Record response for item-1
state = testSessionReducer(state, {
  type: "RECORD_RESPONSE",
  payload: { itemId: "item-1", value: "OPTION_UP" },
});
assert.equal(state.responses["item-1"].value, "OPTION_UP");

// Test 7: Progress calculation
const progress = getComputedProgress(state);
assert.equal(progress.currentStepDisplay, 1);
assert.equal(progress.totalItems, 3);
assert.equal(progress.answeredCount, 1);
assert.equal(progress.percentage, 33);
assert.equal(progress.hasAnsweredCurrent, true);
assert.equal(progress.isFirst, true);
assert.equal(progress.isLast, false);

// Test 8: Advance to next item
state = testSessionReducer(state, { type: "NEXT_ITEM" });
assert.equal(state.currentIndex, 1);

// Test 9: Previous item
state = testSessionReducer(state, { type: "PREVIOUS_ITEM" });
assert.equal(state.currentIndex, 0);

// Test 10: Previous item bounds - cannot go below 0
state = testSessionReducer(state, { type: "PREVIOUS_ITEM" });
assert.equal(state.currentIndex, 0);

// Test 11: Advance through items to last
state = testSessionReducer(state, { type: "NEXT_ITEM" }); // index 1
state = testSessionReducer(state, {
  type: "RECORD_RESPONSE",
  payload: { itemId: "item-2", value: "OPTION_DOWN" },
});
state = testSessionReducer(state, { type: "NEXT_ITEM" }); // index 2
assert.equal(state.currentIndex, 2);

// Test 12: Cannot advance past last item
state = testSessionReducer(state, { type: "NEXT_ITEM" });
assert.equal(state.currentIndex, 2, "Should remain on last item");

// Test 13: Being on last item does not automatically complete session
assert.equal(state.status, "in_progress");

// Test 14: Cancel modal flow
state = testSessionReducer(state, { type: "OPEN_CANCEL_MODAL" });
assert.equal(state.isCancelModalOpen, true);
state = testSessionReducer(state, { type: "CLOSE_CANCEL_MODAL" });
assert.equal(state.isCancelModalOpen, false);

// Test 15: Explicit completion
state = testSessionReducer(state, {
  type: "RECORD_RESPONSE",
  payload: { itemId: "item-3", value: "OPTION_LEFT" },
});
state = testSessionReducer(state, { type: "COMPLETE" });
assert.equal(state.status, "completed");
assert.ok(state.finishedAt !== null);

// Test 16: Result extraction
const result = getTestResult(state);
assert.ok(result !== null);
assert.equal(result.testId, "test-meta-01");
assert.equal(result.status, "completed");
assert.equal(result.answeredCount, 3);
assert.equal(result.responses["item-1"].value, "OPTION_UP");
assert.equal(result.responses["item-2"].value, "OPTION_DOWN");
assert.equal(result.responses["item-3"].value, "OPTION_LEFT");

// Test 17: Cannot record responses after completion
const postCompleteRecord = testSessionReducer(state, {
  type: "RECORD_RESPONSE",
  payload: { itemId: "item-1", value: "MUTATED" },
});
assert.equal(postCompleteRecord.responses["item-1"].value, "OPTION_UP");

// Test 18: Reset session
state = testSessionReducer(state, { type: "RESET" });
assert.equal(state.status, "instructions");
assert.equal(state.currentIndex, 0);
assert.equal(Object.keys(state.responses).length, 0);

// Test 19: Cancellation flow
state = testSessionReducer(state, { type: "START" });
state = testSessionReducer(state, { type: "CONFIRM_CANCEL" });
assert.equal(state.status, "cancelled");
const cancelledResult = getTestResult(state);
assert.equal(cancelledResult?.status, "cancelled");

console.log("All 19 test engine state machine assertions passed successfully!");
