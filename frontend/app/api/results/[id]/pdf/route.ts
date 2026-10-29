import { NextRequest, NextResponse } from "next/server";
import { validateSession, SESSION_COOKIE_NAME } from "@/lib/auth/auth-service";
import { getTestResultById } from "@/lib/results/results-service";
import { generateScreeningPdf } from "@/lib/reports/pdf-service";
import { checkRateLimit } from "@/lib/security/rate-limit";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionToken) {
    return NextResponse.json({ error: "Authentication required to download report." }, { status: 401 });
  }

  const user = await validateSession(sessionToken);
  if (!user) {
    return NextResponse.json({ error: "Session invalid or expired." }, { status: 401 });
  }

  // Rate limit PDF report generation: max 30 per 5 minutes per user
  const rateLimit = checkRateLimit(request, {
    keyPrefix: "download_pdf",
    identifier: user.id,
    maxRequests: 30,
    windowMs: 5 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many PDF download requests. Please wait a moment." },
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

  const result = await getTestResultById(user.id, id);

  if (!result) {
    return NextResponse.json(
      { error: "Screening report not found or unauthorized access." },
      { status: 404 }
    );
  }

  try {
    const pdfBuffer = await generateScreeningPdf({ result, user });

    const safeFilename = `VisionCare-${result.testType}-${result.id.slice(0, 8)}.pdf`;

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeFilename}"`,
        "Content-Length": String(pdfBuffer.length),
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error: unknown) {
    console.error("[VisionCare PDF Generation Error]:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF screening report." },
      { status: 500 }
    );
  }
}
