import assert from "node:assert";
import {
  registerUser,
  loginUser,
  updateUserProfile,
  changeUserPassword,
} from "./auth-service";

async function runTests() {
  console.log("Running User Settings & Profile Service Tests...");

  // 1. Create a test user
  const regResult = await registerUser({
    displayName: "Original Name",
    email: "settings_test@example.com",
    password: "initial_password_123",
  });

  const userId = regResult.user.id;
  assert.strictEqual(regResult.user.displayName, "Original Name");

  // 2. Update display name successfully
  const updatedUser = await updateUserProfile(userId, {
    displayName: "Updated Name",
  });
  assert.strictEqual(updatedUser.displayName, "Updated Name");
  assert.strictEqual(updatedUser.email, "settings_test@example.com");

  // 3. Reject invalid short display name
  let shortNameThrew = false;
  try {
    await updateUserProfile(userId, { displayName: "A" });
  } catch (err: unknown) {
    shortNameThrew = true;
    assert.ok(err instanceof Error && err.message.includes("at least 2 characters"));
  }
  assert.strictEqual(shortNameThrew, true);

  // 4. Change password with correct current password
  await changeUserPassword(userId, {
    currentPassword: "initial_password_123",
    newPassword: "brand_new_password_456",
  });

  // 5. Old password no longer works
  let oldLoginThrew = false;
  try {
    await loginUser({
      email: "settings_test@example.com",
      password: "initial_password_123",
    });
  } catch {
    oldLoginThrew = true;
  }
  assert.strictEqual(oldLoginThrew, true, "Login with old password must fail");

  // 6. New password works successfully
  const newLogin = await loginUser({
    email: "settings_test@example.com",
    password: "brand_new_password_456",
  });
  assert.strictEqual(newLogin.user.id, userId);

  // 7. Reject password change with incorrect current password
  let wrongCurrentThrew = false;
  try {
    await changeUserPassword(userId, {
      currentPassword: "completely_wrong_password",
      newPassword: "third_password_789",
    });
  } catch (err: unknown) {
    wrongCurrentThrew = true;
    assert.ok(err instanceof Error && err.message.includes("Current password is incorrect"));
  }
  assert.strictEqual(wrongCurrentThrew, true);

  // 8. Reject new password that is too short
  let shortNewPassThrew = false;
  try {
    await changeUserPassword(userId, {
      currentPassword: "brand_new_password_456",
      newPassword: "short",
    });
  } catch (err: unknown) {
    shortNewPassThrew = true;
    assert.ok(err instanceof Error && err.message.includes("at least 8 characters"));
  }
  assert.strictEqual(shortNewPassThrew, true);

  console.log("All 8 User Settings & Profile Service test assertions passed successfully!");
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
