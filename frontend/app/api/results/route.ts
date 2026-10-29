import { NextRequest, NextResponse } from "next/server";
import { validateSession, SESSION_COOKIE_NAME } from "@/lib/auth/auth-service";
import { saveTestResult, getTestHistory } from "@/lib/results/results-service";
import { checkRateLimit } from "@/lib/security/rate-limit";

export async function GET(request: NextRequest) {
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionToken) {
    return NextResponse.json({ error: "Authentication required to access test history." }, { status: 401 });
  }

  const user = await validateSession(sessionToken);
  if (!user) {
    const response = NextResponse.json({ error: "Session invalid or expired." }, { status: 401 });
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    return response;
  }

  const results = await getTestHistory(user.id);
  return NextResponse.json({ results });
}

export async function POST(request: NextRequest) {
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionToken) {
    return NextResponse.json({ error: "Authentication required to save screening results." }, { status: 401 });
  }

  const user = await validateSession(sessionToken);
  if (!user) {
    const response = NextResponse.json({ error: "Session invalid or expired." }, { status: 401 });
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    return response;
  }

  const rateLimit = checkRateLimit(request, {
    keyPrefix: "save_results",
    identifier: user.id,
    maxRequests: 30,
    windowMs: 5 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many save requests. Please wait a moment before trying again." },
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

  try {
    const {
      testType,
      testTitle,
      summaryNote,
      totalItems,
      answeredCount,
      matchedCount,
      matchPercentage,
      unclearCount,
      metricsJson,
      completedAt,
    } = body || {};

    if (!testType || typeof summaryNote !== "string") {
      return NextResponse.json({ error: "Missing required screening result data." }, { status: 400 });
    }

    const saved = await saveTestResult(user.id, {
      testType,
      testTitle: typeof testTitle === "string" ? testTitle : "Vision Screening",
      summaryNote,
      totalItems: Number(totalItems) || 0,
      answeredCount: Number(answeredCount) || 0,
      matchedCount: Number(matchedCount) || 0,
      matchPercentage: Number(matchPercentage) || 0,
      unclearCount: unclearCount !== undefined ? Number(unclearCount) : undefined,
      metricsJson,
      completedAt: typeof completedAt === "string" ? completedAt : undefined,
    });

    return NextResponse.json({ success: true, result: saved }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to save result.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
