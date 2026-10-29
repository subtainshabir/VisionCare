import { getDb, isDatabaseConfigured } from "./neon";

export interface DbUser {
  id: string;
  display_name: string;
  email: string;
  password_hash: string;
  created_at: string;
  status: string;
}

export interface SafeUser {
  id: string;
  displayName: string;
  email: string;
  createdAt: string;
}

export interface DbSession {
  id: string;
  user_id: string;
  created_at: string;
  expires_at: string;
  revoked_at: string | null;
}

export interface DbTestResult {
  id: string;
  user_id: string;
  test_type: "color-vision" | "distance-vision" | "near-vision";
  test_title: string;
  summary_note: string;
  total_items: number;
  answered_count: number;
  matched_count: number;
  match_percentage: number;
  unclear_count?: number | null;
  metrics_json?: unknown;
  completed_at: string;
  created_at: string;
}

export interface SavedTestResult {
  id: string;
  userId: string;
  testType: "color-vision" | "distance-vision" | "near-vision";
  testTitle: string;
  summaryNote: string;
  totalItems: number;
  answeredCount: number;
  matchedCount: number;
  matchPercentage: number;
  unclearCount?: number;
  metricsJson?: unknown;
  completedAt: string;
  createdAt: string;
}

let isSchemaInitialized = false;

/**
 * Initializes the Neon PostgreSQL database schema for authentication and saved results.
 * Creates users, sessions, and test_results tables with performance indexes if they do not exist.
 */
export async function initAuthSchema(): Promise<void> {
  if (isSchemaInitialized || !isDatabaseConfigured()) {
    return;
  }

  const sql = getDb();
  if (!sql) return;

  try {
    // 1. Users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        display_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        status VARCHAR(20) NOT NULL DEFAULT 'active'
      );
    `;

    // 2. Sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id VARCHAR(128) PRIMARY KEY,
        user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        expires_at TIMESTAMPTZ NOT NULL,
        revoked_at TIMESTAMPTZ
      );
    `;

    // 3. Saved Test Results table
    await sql`
      CREATE TABLE IF NOT EXISTS test_results (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        test_type VARCHAR(32) NOT NULL,
        test_title VARCHAR(128) NOT NULL,
        summary_note TEXT NOT NULL,
        total_items INT NOT NULL,
        answered_count INT NOT NULL,
        matched_count INT NOT NULL,
        match_percentage INT NOT NULL,
        unclear_count INT DEFAULT 0,
        metrics_json JSONB,
        completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;

    // 4. Performance Indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_test_results_user_id ON test_results(user_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_test_results_completed_at ON test_results(completed_at DESC);`;

    isSchemaInitialized = true;
  } catch (error) {
    console.error("[VisionCare Schema Init Error]:", error);
  }
}
