import { NextRequest, NextResponse } from "next/server";
import { validateSession, changeUserPassword, SESSION_COOKIE_NAME } from "@/lib/auth/auth-service";
import { checkRateLimit } from "@/lib/security/rate-limit";

export async function POST(request: NextRequest) {
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionToken) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const user = await validateSession(sessionToken);
  if (!user) {
    return NextResponse.json({ error: "Session invalid or expired." }, { status: 401 });
  }

  // Rate limit password change attempts: max 5 per 5 minutes per user
  const rateLimit = checkRateLimit(request, {
    keyPrefix: "change_password",
    identifier: user.id,
    maxRequests: 5,
    windowMs: 5 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many password change attempts. Please wait before trying again." },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds ?? 60),
        },
      }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
  }

  const { currentPassword, newPassword } = body || {};

  if (
    !currentPassword ||
    !newPassword ||
    typeof currentPassword !== "string" ||
    typeof newPassword !== "string"
  ) {
    return NextResponse.json(
      { error: "Both current password and new password are required." },
      { status: 400 }
    );
  }

  try {
    await changeUserPassword(user.id, {
      currentPassword,
      newPassword,
      currentSessionToken: sessionToken,
    });

    return NextResponse.json({ success: true, message: "Password updated successfully." });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to change password.";
    const status = message.includes("Current password is incorrect") ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
