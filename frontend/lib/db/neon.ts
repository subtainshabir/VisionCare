import { neon, NeonQueryFunction } from "@neondatabase/serverless";

/**
 * Returns a masked version of the database connection string with password redacted.
 */
export function maskDatabaseUrl(rawUrl?: string): string {
  if (!rawUrl || !rawUrl.trim()) {
    return "Not configured";
  }

  try {
    const parsed = new URL(rawUrl.trim());
    if (parsed.password) {
      parsed.password = "***";
    }
    return parsed.toString();
  } catch {
    return rawUrl.replace(/:([^:@]+)@/, ":***@");
  }
}

/**
 * Checks whether the DATABASE_URL environment variable is set with non-placeholder credentials.
 */
export function isDatabaseConfigured(): boolean {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url || !url.trim()) {
    return false;
  }
  const placeholders = ["USER:PASSWORD", "placeholder", "username:password", "ep-sample-123"];
  return !placeholders.some((ph) => url.includes(ph));
}

let cachedSql: NeonQueryFunction<false, false> | null = null;

/**
 * Returns a reusable Neon SQL client.
 */
export function getDb(): NeonQueryFunction<false, false> | null {
  if (!isDatabaseConfigured()) {
    return null;
  }

  if (!cachedSql) {
    const connectionString = (process.env.DATABASE_URL || process.env.POSTGRES_URL)!.trim();
    cachedSql = neon(connectionString);
  }

  return cachedSql;
}

export interface DatabaseCheckResult {
  connected: boolean;
  message: string;
  target: string;
  dialect?: string;
}

/**
 * Executes a lightweight SELECT 1 query to verify Neon PostgreSQL connectivity.
 * Guarantees zero credential exposure in responses or logs.
 */
export async function checkDatabaseConnectivity(): Promise<DatabaseCheckResult> {
  const rawUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  const target = maskDatabaseUrl(rawUrl);

  if (!isDatabaseConfigured()) {
    return {
      connected: false,
      message: "DATABASE_URL is not configured or contains placeholder credentials.",
      target,
    };
  }

  const sql = getDb();
  if (!sql) {
    return {
      connected: false,
      message: "Failed to initialize Neon database client.",
      target,
    };
  }

  try {
    const result = await sql`SELECT 1 as ping`;
    if (Array.isArray(result) && result[0]?.ping === 1) {
      return {
        connected: true,
        message: "Database connection verified successfully.",
        target,
        dialect: "neon-postgresql",
      };
    }
    return {
      connected: false,
      message: "Unexpected response from database ping query.",
      target,
    };
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Connection failed";
    console.error("[VisionCare DB Check Error]:", errMsg.replace(/:([^:@]+)@/, ":***@"));
    return {
      connected: false,
      message: "Database connection failed (host unreachable, timeout, or invalid credentials).",
      target,
    };
  }
}
