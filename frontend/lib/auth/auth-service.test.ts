import assert from "node:assert";
import {
  normalizeEmail,
  validatePassword,
  registerUser,
  loginUser,
  validateSession,
  revokeSession,
} from "./auth-service";

async function runTests() {
  console.log("Running Authentication Service Tests...");

  // 1. Email Normalization
  assert.strictEqual(normalizeEmail("  USER@Example.COM  "), "user@example.com");

  // 2. Password Validation
  assert.strictEqual(validatePassword("short").isValid, false);
  assert.strictEqual(validatePassword("validpass123").isValid, true);

  // 3. User Registration
  const regResult = await registerUser({
    displayName: "Jane Doe",
    email: "jane.doe@example.com",
    password: "secure_password_123",
  });

  assert.ok(regResult.user.id.startsWith("usr_"));
  assert.strictEqual(regResult.user.displayName, "Jane Doe");
  assert.strictEqual(regResult.user.email, "jane.doe@example.com");
  assert.ok(regResult.sessionToken.startsWith("sess_"));
  // Password hash must not be exposed
  assert.strictEqual((regResult.user as unknown as Record<string, unknown>).password_hash, undefined);

  // 4. Duplicate Email Registration Rejection
  let duplicateThrew = false;
  try {
    await registerUser({
      displayName: "Jane Duplicate",
      email: "JANE.DOE@example.com",
      password: "another_password_123",
    });
  } catch (err: unknown) {
    duplicateThrew = true;
    assert.ok(err instanceof Error && err.message.includes("already exists"));
  }
  assert.strictEqual(duplicateThrew, true, "Duplicate registration should fail");

  // 5. Successful Login
  const loginResult = await loginUser({
    email: "JANE.DOE@example.com",
    password: "secure_password_123",
  });
  assert.strictEqual(loginResult.user.id, regResult.user.id);
  assert.ok(loginResult.sessionToken.startsWith("sess_"));

  // 6. Invalid Password Login Rejection
  let invalidPassThrew = false;
  try {
    await loginUser({
      email: "jane.doe@example.com",
      password: "wrong_password",
    });
  } catch (err: unknown) {
    invalidPassThrew = true;
    assert.ok(err instanceof Error && err.message.includes("Invalid email or password"));
  }
  assert.strictEqual(invalidPassThrew, true);

  // 7. Non-existent User Login Rejection
  let unknownUserThrew = false;
  try {
    await loginUser({
      email: "nobody@example.com",
      password: "secure_password_123",
    });
  } catch (err: unknown) {
    unknownUserThrew = true;
    assert.ok(err instanceof Error && err.message.includes("Invalid email or password"));
  }
  assert.strictEqual(unknownUserThrew, true);

  // 8. Session Validation
  const validatedUser = await validateSession(loginResult.sessionToken);
  assert.ok(validatedUser !== null);
  assert.strictEqual(validatedUser?.id, regResult.user.id);

  // 9. Session Revocation (Logout)
  await revokeSession(loginResult.sessionToken);
  const postRevokeUser = await validateSession(loginResult.sessionToken);
  assert.strictEqual(postRevokeUser, null, "Revoked session should be rejected");

  console.log("All 9 Authentication Service test scenarios passed successfully!");
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
