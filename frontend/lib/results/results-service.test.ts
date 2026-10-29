import assert from "node:assert";
import {
  saveTestResult,
  getTestHistory,
  getTestResultById,
  deleteTestResult,
} from "./results-service";

async function runTests() {
  console.log("Running Test History & Results Service Tests...");

  const userA = "usr_test_user_a";
  const userB = "usr_test_user_b";

  // 1. User A saves Color Vision result
  const colorResult = await saveTestResult(userA, {
    testType: "color-vision",
    testTitle: "Color Vision Demonstration",
    summaryNote: "Matched 4 of 4 targets.",
    totalItems: 4,
    answeredCount: 4,
    matchedCount: 4,
    matchPercentage: 100,
    metricsJson: { evaluations: [{ item: 1, matched: true }] },
  });

  assert.ok(colorResult.id.startsWith("res_"));
  assert.strictEqual(colorResult.userId, userA);
  assert.strictEqual(colorResult.testType, "color-vision");
  assert.strictEqual(colorResult.matchedCount, 4);
  assert.strictEqual(colorResult.matchPercentage, 100);

  // 2. User A saves Distance and Near Vision results
  await saveTestResult(userA, {
    testType: "distance-vision",
    testTitle: "Distance Vision Demonstration",
    summaryNote: "Matched 5 of 5 targets.",
    totalItems: 5,
    answeredCount: 5,
    matchedCount: 5,
    matchPercentage: 100,
  });

  await saveTestResult(userA, {
    testType: "near-vision",
    testTitle: "Near Vision Reading Demonstration",
    summaryNote: "Matched 4 of 4 reading targets.",
    totalItems: 4,
    answeredCount: 4,
    matchedCount: 4,
    matchPercentage: 100,
    unclearCount: 0,
  });

  // 3. User A retrieves test history (should contain 3 results)
  const historyA = await getTestHistory(userA);
  assert.strictEqual(historyA.length, 3);
  assert.strictEqual(historyA[0].userId, userA);

  // 4. User B retrieves test history (should be empty)
  const historyB = await getTestHistory(userB);
  assert.strictEqual(historyB.length, 0);

  // 5. User A retrieves individual result
  const singleResult = await getTestResultById(userA, colorResult.id);
  assert.ok(singleResult !== null);
  assert.strictEqual(singleResult?.id, colorResult.id);

  // 6. User B attempts to access User A's result (cross-user privacy)
  const unauthorizedFetch = await getTestResultById(userB, colorResult.id);
  assert.strictEqual(unauthorizedFetch, null, "User B must not access User A's result");

  // 7. User B attempts to delete User A's result (cross-user deletion)
  const unauthorizedDelete = await deleteTestResult(userB, colorResult.id);
  assert.strictEqual(unauthorizedDelete, false, "User B must not delete User A's result");

  // 8. User A deletes their own result
  const authorizedDelete = await deleteTestResult(userA, colorResult.id);
  assert.strictEqual(authorizedDelete, true, "User A should successfully delete their own result");

  // 9. History after deletion should have 2 results
  const updatedHistoryA = await getTestHistory(userA);
  assert.strictEqual(updatedHistoryA.length, 2);

  // 10. Fetching deleted result should return null
  const deletedFetch = await getTestResultById(userA, colorResult.id);
  assert.strictEqual(deletedFetch, null);

  console.log("All 10 Test History Service assertions passed successfully!");
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
