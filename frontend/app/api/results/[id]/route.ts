import { NextRequest, NextResponse } from "next/server";
import { validateSession, SESSION_COOKIE_NAME } from "@/lib/auth/auth-service";
import { getTestResultById, deleteTestResult } from "@/lib/results/results-service";
import { checkRateLimit } from "@/lib/security/rate-limit";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionToken) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const user = await validateSession(sessionToken);
  if (!user) {
    return NextResponse.json({ error: "Session invalid or expired." }, { status: 401 });
  }

  const { id } = await context.params;
  if (!id || typeof id !== "string" || !id.startsWith("res_")) {
    return NextResponse.json({ error: "Invalid result identifier format." }, { status: 400 });
  }

  const result = await getTestResultById(user.id, id);

  if (!result) {
    return NextResponse.json({ error: "Result not found or unauthorized access." }, { status: 404 });
  }

  return NextResponse.json({ result });
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionToken) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const user = await validateSession(sessionToken);
  if (!user) {
    return NextResponse.json({ error: "Session invalid or expired." }, { status: 401 });
  }

  const rateLimit = checkRateLimit(request, {
    keyPrefix: "delete_result",
    identifier: user.id,
    maxRequests: 20,
    windowMs: 5 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many delete requests. Please wait before trying again." },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds ?? 60),
        },
      }
    );
  }

  const { id } = await context.params;
  if (!id || typeof id !== "string" || !id.startsWith("res_")) {
    return NextResponse.json({ error: "Invalid result identifier format." }, { status: 400 });
  }

  const deleted = await deleteTestResult(user.id, id);

  if (!deleted) {
    return NextResponse.json({ error: "Result not found or unauthorized access." }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: "Screening result removed successfully." });
}
