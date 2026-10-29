import { NextRequest, NextResponse } from "next/server";
import { loginUser, SESSION_COOKIE_NAME } from "@/lib/auth/auth-service";
import { checkRateLimit, resetRateLimit, getClientIp } from "@/lib/security/rate-limit";

export async function POST(request: NextRequest) {
  // Apply rate limiting: max 5 login attempts per minute per IP
  const rateLimit = checkRateLimit(request, {
    keyPrefix: "login",
    maxRequests: 5,
    windowMs: 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Please wait before trying again." },
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

  const { email, password } = body || {};

  if (!email || !password || typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json(
      { error: "Valid email and password are required." },
      { status: 400 }
    );
  }

  try {
    const { user, sessionToken, expiresAt } = await loginUser({ email, password });

    // Reset rate limiter on successful authentication
    resetRateLimit("login", getClientIp(request));

    const response = NextResponse.json({ user }, { status: 200 });

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
    const message = error instanceof Error ? error.message : "Authentication failed.";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
