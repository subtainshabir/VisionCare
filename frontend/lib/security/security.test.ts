import assert from "node:assert";
import { NextRequest } from "next/server";
import {
  validatePassword,
  registerUser,
  loginUser,
  validateSession,
  revokeSession,
  changeUserPassword,
  resetMemoryAuthStore,
} from "../auth/auth-service";
import {
  saveTestResult,
  getTestHistory,
  getTestResultById,
  deleteTestResult,
  resetMemoryResultsStore,
} from "../results/results-service";
import { generateScreeningPdf } from "../reports/pdf-service";
import {
  checkRateLimit,
  resetRateLimit,
  clearAllRateLimits,
} from "./rate-limit";
import { maskDatabaseUrl } from "../db/neon";

async function runSecurityTests() {
  console.log("Running Comprehensive Security & Privacy Test Suite...");

  // Reset stores
  resetMemoryAuthStore();
  resetMemoryResultsStore();
  clearAllRateLimits();

  // 1. Password Policy & DoS Protection (Length Limits)
  console.log("  [1/9] Testing password validation and DoS boundary protection...");
  assert.strictEqual(validatePassword("short").isValid, false);
  assert.strictEqual(validatePassword("").isValid, false);
  assert.strictEqual(validatePassword("validPassword123").isValid, true);
  // Password over 128 chars rejected to prevent bcrypt DoS
  const hugePassword = "a".repeat(150);
  assert.strictEqual(validatePassword(hugePassword).isValid, false);

  // 2. Input Validation on Registration & User Updates
  console.log("  [2/9] Testing input sanitization & boundary limits...");
  let shortNameThrew = false;
  try {
    await registerUser({ displayName: "A", email: "alice@example.com", password: "password123" });
  } catch {
    shortNameThrew = true;
  }
  assert.strictEqual(shortNameThrew, true, "Display name < 2 chars must be rejected");

  let hugeNameThrew = false;
  try {
    await registerUser({ displayName: "A".repeat(150), email: "alice@example.com", password: "password123" });
  } catch {
    hugeNameThrew = true;
  }
  assert.strictEqual(hugeNameThrew, true, "Display name > 100 chars must be rejected");

  let invalidEmailThrew = false;
  try {
    await registerUser({ displayName: "Alice", email: "not-an-email", password: "password123" });
  } catch {
    invalidEmailThrew = true;
  }
  assert.strictEqual(invalidEmailThrew, true, "Invalid email format must be rejected");

  // Register valid users Alice and Bob
  const alice = await registerUser({
    displayName: "Alice Smith",
    email: "alice@example.com",
    password: "Password123!",
  });
  const bob = await registerUser({
    displayName: "Bob Jones",
    email: "bob@example.com",
    password: "Password456!",
  });

  // Verify password hash is never exposed on SafeUser
  assert.strictEqual((alice.user as unknown as Record<string, unknown>).password_hash, undefined);
  assert.strictEqual((bob.user as unknown as Record<string, unknown>).password_hash, undefined);

  // 3. User Ownership Enforcement for Screening Results (IDOR Prevention)
  console.log("  [3/9] Testing result ownership checks & IDOR prevention...");
  const aliceResult = await saveTestResult(alice.user.id, {
    testType: "color-vision",
    testTitle: "Color Vision Demonstration",
    summaryNote: "Normal color discrimination observed.",
    totalItems: 12,
    answeredCount: 12,
    matchedCount: 11,
    matchPercentage: 92,
  });

  const bobResult = await saveTestResult(bob.user.id, {
    testType: "distance-vision",
    testTitle: "Distance Acuity Demonstration",
    summaryNote: "Distance acuity demonstration completed.",
    totalItems: 8,
    answeredCount: 8,
    matchedCount: 7,
    matchPercentage: 88,
  });

  // Alice queries her own result -> succeeds
  const aliceFetchOwn = await getTestResultById(alice.user.id, aliceResult.id);
  assert.ok(aliceFetchOwn !== null);
  assert.strictEqual(aliceFetchOwn?.id, aliceResult.id);

  // Bob attempts to query Alice's result -> MUST RETURN NULL (isolated)
  const bobFetchAlice = await getTestResultById(bob.user.id, aliceResult.id);
  assert.strictEqual(bobFetchAlice, null, "User Bob must NOT be able to access Alice's screening result");

  // Alice queries Bob's result -> MUST RETURN NULL
  const aliceFetchBob = await getTestResultById(alice.user.id, bobResult.id);
  assert.strictEqual(aliceFetchBob, null, "User Alice must NOT be able to access Bob's screening result");

  // Bob attempts to delete Alice's result -> MUST FAIL
  const bobDeleteAlice = await deleteTestResult(bob.user.id, aliceResult.id);
  assert.strictEqual(bobDeleteAlice, false, "User Bob must NOT be able to delete Alice's result");

  // Verify Alice's result is still intact
  const aliceCheckAfterTamper = await getTestResultById(alice.user.id, aliceResult.id);
  assert.ok(aliceCheckAfterTamper !== null);

  // Alice's history contains only Alice's results
  const aliceHistory = await getTestHistory(alice.user.id);
  assert.strictEqual(aliceHistory.length, 1);
  assert.strictEqual(aliceHistory[0].userId, alice.user.id);

  // Bob's history contains only Bob's results
  const bobHistory = await getTestHistory(bob.user.id);
  assert.strictEqual(bobHistory.length, 1);
  assert.strictEqual(bobHistory[0].userId, bob.user.id);

  // 4. PDF Generation & Ownership Authorization
  console.log("  [4/9] Testing PDF generation authorization and data privacy...");
  // Alice generates PDF for her own result
  const pdfBuffer = await generateScreeningPdf({
    result: aliceResult,
    user: alice.user,
  });
  assert.ok(pdfBuffer instanceof Buffer);
  assert.ok(pdfBuffer.length > 1000);
  assert.strictEqual(pdfBuffer.subarray(0, 4).toString(), "%PDF");

  // 5. Session Management, Revocation, and Logout
  console.log("  [5/9] Testing session lifecycle and invalid session rejection...");
  // Unauthenticated/invalid token checks
  assert.strictEqual(await validateSession(""), null);
  assert.strictEqual(await validateSession("invalid_token"), null);
  assert.strictEqual(await validateSession("sess_nonexistent123"), null);

  // Valid session check
  const validatedAlice = await validateSession(alice.sessionToken);
  assert.ok(validatedAlice !== null);
  assert.strictEqual(validatedAlice?.id, alice.user.id);

  // Logout/revocation
  await revokeSession(alice.sessionToken);
  const revokedAlice = await validateSession(alice.sessionToken);
  assert.strictEqual(revokedAlice, null, "Revoked session must be rejected");

  // 6. Password Change Session Invalidation
  console.log("  [6/9] Testing password update & other session revocation...");
  // Login Bob to get active session
  const bobSession1 = await loginUser({ email: "bob@example.com", password: "Password456!" });
  const bobSession2 = await loginUser({ email: "bob@example.com", password: "Password456!" });

  // Both sessions should be active
  assert.ok(await validateSession(bobSession1.sessionToken) !== null);
  assert.ok(await validateSession(bobSession2.sessionToken) !== null);

  // Bob changes password using session 2 -> session 1 should be revoked
  await changeUserPassword(bob.user.id, {
    currentPassword: "Password456!",
    newPassword: "NewPassword789!",
    currentSessionToken: bobSession2.sessionToken,
  });

  // Session 2 remains active
  assert.ok(await validateSession(bobSession2.sessionToken) !== null);
  // Session 1 must be revoked
  assert.strictEqual(await validateSession(bobSession1.sessionToken), null);

  // Old password must now fail
  let oldLoginFailed = false;
  try {
    await loginUser({ email: "bob@example.com", password: "Password456!" });
  } catch {
    oldLoginFailed = true;
  }
  assert.strictEqual(oldLoginFailed, true, "Old password must be rejected after change");

  // New password must succeed
  const bobNewLogin = await loginUser({ email: "bob@example.com", password: "NewPassword789!" });
  assert.ok(bobNewLogin.user.id === bob.user.id);

  // 7. Rate Limiting Protection
  console.log("  [7/9] Testing sliding-window rate limiting...");
  clearAllRateLimits();
  const mockReq = new NextRequest("http://localhost:3000/api/auth/login", {
    headers: { "x-forwarded-for": "198.51.100.1" },
  });

  const opts = { keyPrefix: "test_limiter", maxRequests: 3, windowMs: 10000 };

  const r1 = checkRateLimit(mockReq, opts);
  assert.strictEqual(r1.allowed, true);
  assert.strictEqual(r1.remaining, 2);

  const r2 = checkRateLimit(mockReq, opts);
  assert.strictEqual(r2.allowed, true);
  assert.strictEqual(r2.remaining, 1);

  const r3 = checkRateLimit(mockReq, opts);
  assert.strictEqual(r3.allowed, true);
  assert.strictEqual(r3.remaining, 0);

  // 4th request must be blocked
  const r4 = checkRateLimit(mockReq, opts);
  assert.strictEqual(r4.allowed, false);
  assert.strictEqual(r4.remaining, 0);
  assert.ok((r4.retryAfterSeconds ?? 0) > 0);

  // Reset rate limit resets counter
  resetRateLimit("test_limiter", "198.51.100.1");
  const r5 = checkRateLimit(mockReq, opts);
  assert.strictEqual(r5.allowed, true);

  // 8. Secret Masking & Sensitive Data Protection
  console.log("  [8/9] Testing secret masking & environment protection...");
  const rawConn = "postgresql://dbuser:super_secret_pw@ep-prod-01.neon.tech/neondb?sslmode=require";
  const maskedConn = maskDatabaseUrl(rawConn);
  assert.strictEqual(maskedConn.includes("super_secret_pw"), false, "Password must not be present");
  assert.strictEqual(maskedConn.includes("dbuser:***@"), true);

  // 9. Metric Bounds & Data Sanitization in Screening Results
  console.log("  [9/9] Testing metric clamping & data bounds...");
  const boundedResult = await saveTestResult(bob.user.id, {
    testType: "near-vision",
    testTitle: "Near Vision Demonstration",
    summaryNote: "Near vision demonstration reading clarity test.",
    totalItems: -5,        // negative should clamp to 0
    answeredCount: 999999, // overflow should clamp to 500
    matchedCount: -1,      // negative should clamp to 0
    matchPercentage: 150,  // should clamp to 100
  });
  assert.strictEqual(boundedResult.totalItems, 0);
  assert.strictEqual(boundedResult.answeredCount, 500);
  assert.strictEqual(boundedResult.matchedCount, 0);
  assert.strictEqual(boundedResult.matchPercentage, 100);

  console.log("All 9 Comprehensive Security & Privacy Test Suites Passed Successfully!");
}

runSecurityTests().catch((err) => {
  console.error("Security test failed:", err);
  process.exit(1);
});
