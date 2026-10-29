import { NextRequest, NextResponse } from "next/server";
import { validateSession, updateUserProfile, SESSION_COOKIE_NAME } from "@/lib/auth/auth-service";
import { checkRateLimit } from "@/lib/security/rate-limit";

export async function GET(request: NextRequest) {
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionToken) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const user = await validateSession(sessionToken);
  if (!user) {
    return NextResponse.json({ error: "Session invalid or expired." }, { status: 401 });
  }

  return NextResponse.json({ user }, { status: 200 });
}

export async function PATCH(request: NextRequest) {
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionToken) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const user = await validateSession(sessionToken);
  if (!user) {
    return NextResponse.json({ error: "Session invalid or expired." }, { status: 401 });
  }

  const rateLimit = checkRateLimit(request, {
    keyPrefix: "update_profile",
    identifier: user.id,
    maxRequests: 10,
    windowMs: 5 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many profile update attempts. Please wait before trying again." },
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

  const { displayName } = body || {};

  if (!displayName || typeof displayName !== "string") {
    return NextResponse.json({ error: "Valid display name is required." }, { status: 400 });
  }

  try {
    const updatedUser = await updateUserProfile(user.id, { displayName });
    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update profile.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
