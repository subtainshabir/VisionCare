import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    service: "VisionCare Backend API",
    status: "online",
    runtime: "nodejs",
    version: "0.1.0",
  });
}
