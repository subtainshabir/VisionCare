import { NextRequest, NextResponse } from "next/server";
import { validateSession, SESSION_COOKIE_NAME } from "@/lib/auth/auth-service";

export async function GET(request: NextRequest) {
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const user = await validateSession(sessionToken);

  if (!user) {
    // If invalid or expired, return 401 and clear stale cookie
    const response = NextResponse.json({ error: "Session invalid or expired" }, { status: 401 });
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

  return NextResponse.json({ user }, { status: 200 });
}
