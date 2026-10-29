import { NextRequest, NextResponse } from "next/server";
import { registerUser, SESSION_COOKIE_NAME } from "@/lib/auth/auth-service";
import { checkRateLimit } from "@/lib/security/rate-limit";

export async function POST(request: NextRequest) {
  // Apply rate limiting: max 5 registration attempts per minute per IP
  const rateLimit = checkRateLimit(request, {
    keyPrefix: "register",
    maxRequests: 5,
    windowMs: 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many registration attempts. Please wait before trying again." },
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

  const { displayName, email, password } = body || {};

  if (
    !displayName ||
    !email ||
    !password ||
    typeof displayName !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return NextResponse.json(
      { error: "Display name, email, and password are required." },
      { status: 400 }
    );
  }

  try {
    const { user, sessionToken, expiresAt } = await registerUser({
      displayName,
      email,
      password,
    });

    const response = NextResponse.json({ user }, { status: 201 });

    // Set secure HttpOnly session cookie
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Registration failed.";
    const status = message.includes("already exists") ? 409 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
