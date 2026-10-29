import { NextResponse } from "next/server";
import { checkDatabaseConnectivity } from "@/lib/db/neon";

export async function GET() {
  const result = await checkDatabaseConnectivity();

  if (result.connected) {
    return NextResponse.json(
      {
        status: "connected",
        database: "neon-postgresql",
        message: result.message,
        target: result.target,
        dialect: result.dialect,
      },
      { status: 200 }
    );
  }

  const isUnconfigured = result.message.includes("not configured");
  return NextResponse.json(
    {
      status: isUnconfigured ? "unconfigured" : "unavailable",
      database: "neon-postgresql",
      message: result.message,
      target: result.target,
    },
    { status: 503 }
  );
}
