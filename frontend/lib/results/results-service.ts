import crypto from "node:crypto";
import { getDb, isDatabaseConfigured } from "@/lib/db/neon";
import { initAuthSchema, DbTestResult, SavedTestResult } from "@/lib/db/schema";

// In-memory fallback store for development/offline test runs
const memoryTestResults = new Map<string, DbTestResult>();

export function resetMemoryResultsStore(): void {
  memoryTestResults.clear();
}

export interface SaveResultInput {
  testType: "color-vision" | "distance-vision" | "near-vision";
  testTitle: string;
  summaryNote: string;
  totalItems: number;
  answeredCount: number;
  matchedCount: number;
  matchPercentage: number;
  unclearCount?: number;
  metricsJson?: unknown;
  completedAt?: string;
}

function toSavedTestResult(dbResult: DbTestResult): SavedTestResult {
  let parsedMetrics = dbResult.metrics_json;
  if (typeof parsedMetrics === "string") {
    try {
      parsedMetrics = JSON.parse(parsedMetrics);
    } catch {
      // keep as string if unparseable
    }
  }

  return {
    id: dbResult.id,
    userId: dbResult.user_id,
    testType: dbResult.test_type,
    testTitle: dbResult.test_title,
    summaryNote: dbResult.summary_note,
    totalItems: dbResult.total_items,
    answeredCount: dbResult.answered_count,
    matchedCount: dbResult.matched_count,
    matchPercentage: dbResult.match_percentage,
    unclearCount: dbResult.unclear_count ?? undefined,
    metricsJson: parsedMetrics ?? undefined,
    completedAt: dbResult.completed_at,
    createdAt: dbResult.created_at,
  };
}

export async function saveTestResult(
  userId: string,
  input: SaveResultInput
): Promise<SavedTestResult> {
  if (!userId) {
    throw new Error("User ID is required to save a test result.");
  }

  const validTypes = ["color-vision", "distance-vision", "near-vision"];
  if (!validTypes.includes(input.testType)) {
    throw new Error("Invalid screening test type.");
  }

  const resultId = `res_${crypto.randomUUID()}`;
  const now = new Date().toISOString();
  const completedAt = input.completedAt || now;

  // Sanitize and bound string fields
  const safeTitle = (input.testTitle || "Vision Screening Demonstration").trim().slice(0, 128);
  const safeNote = (input.summaryNote || "").trim().slice(0, 2000);

  // Validate and clamp numeric metrics
  const totalItems = Math.min(500, Math.max(0, Math.floor(Number(input.totalItems) || 0)));
  const answeredCount = Math.min(500, Math.max(0, Math.floor(Number(input.answeredCount) || 0)));
  const matchedCount = Math.min(500, Math.max(0, Math.floor(Number(input.matchedCount) || 0)));
  const matchPercentage = Math.min(100, Math.max(0, Math.round(Number(input.matchPercentage) || 0)));
  const unclearCount = Math.min(500, Math.max(0, Math.floor(Number(input.unclearCount) || 0)));

  // Bounded metrics JSON payload (prevent excessive storage payloads)
  let metricsJson = input.metricsJson ?? null;
  if (metricsJson !== null) {
    try {
      const serialized = JSON.stringify(metricsJson);
      if (serialized.length > 32768) {
        metricsJson = { truncated: true, reason: "Payload size limit exceeded" };
      }
    } catch {
      metricsJson = null;
    }
  }

  const dbRow: DbTestResult = {
    id: resultId,
    user_id: userId,
    test_type: input.testType,
    test_title: safeTitle,
    summary_note: safeNote,
    total_items: totalItems,
    answered_count: answeredCount,
    matched_count: matchedCount,
    match_percentage: matchPercentage,
    unclear_count: unclearCount,
    metrics_json: metricsJson,
    completed_at: completedAt,
    created_at: now,
  };

  if (isDatabaseConfigured()) {
    try {
      await initAuthSchema();
      const sql = getDb();
      if (sql) {
        await sql`
          INSERT INTO test_results (
            id, user_id, test_type, test_title, summary_note,
            total_items, answered_count, matched_count, match_percentage,
            unclear_count, metrics_json, completed_at, created_at
          ) VALUES (
            ${dbRow.id}, ${dbRow.user_id}, ${dbRow.test_type}, ${dbRow.test_title}, ${dbRow.summary_note},
            ${dbRow.total_items}, ${dbRow.answered_count}, ${dbRow.matched_count}, ${dbRow.match_percentage},
            ${dbRow.unclear_count}, ${JSON.stringify(dbRow.metrics_json)}, ${dbRow.completed_at}, ${dbRow.created_at}
          )
        `;
      }
    } catch (err) {
      console.error("[VisionCare Results] Database insert error:", err);
      throw new Error("Unable to save screening result to database. Please try again.");
    }
  } else {
    memoryTestResults.set(resultId, dbRow);
  }

  return toSavedTestResult(dbRow);
}

export async function getTestHistory(userId: string): Promise<SavedTestResult[]> {
  if (!userId) return [];

  if (isDatabaseConfigured()) {
    try {
      await initAuthSchema();
      const sql = getDb();
      if (sql) {
        const rows = (await sql`
          SELECT *
          FROM test_results
          WHERE user_id = ${userId}
          ORDER BY completed_at DESC
        `) as DbTestResult[];
        return rows.map(toSavedTestResult);
      }
    } catch (err) {
      console.error("[VisionCare Results] getTestHistory error:", err);
      return [];
    }
  }

  // Memory fallback
  const results: DbTestResult[] = [];
  for (const item of memoryTestResults.values()) {
    if (item.user_id === userId) {
      results.push(item);
    }
  }
  results.sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());
  return results.map(toSavedTestResult);
}

export async function getTestResultById(
  userId: string,
  resultId: string
): Promise<SavedTestResult | null> {
  if (!userId || !resultId) return null;

  if (isDatabaseConfigured()) {
    try {
      await initAuthSchema();
      const sql = getDb();
      if (sql) {
        const rows = (await sql`
          SELECT *
          FROM test_results
          WHERE id = ${resultId} AND user_id = ${userId}
          LIMIT 1
        `) as DbTestResult[];
        return rows[0] ? toSavedTestResult(rows[0]) : null;
      }
    } catch (err) {
      console.error("[VisionCare Results] getTestResultById error:", err);
      return null;
    }
  }

  const found = memoryTestResults.get(resultId);
  if (!found || found.user_id !== userId) {
    return null;
  }
  return toSavedTestResult(found);
}

export async function deleteTestResult(userId: string, resultId: string): Promise<boolean> {
  if (!userId || !resultId) return false;

  if (isDatabaseConfigured()) {
    try {
      await initAuthSchema();
      const sql = getDb();
      if (sql) {
        const existing = (await sql`
          SELECT id FROM test_results
          WHERE id = ${resultId} AND user_id = ${userId}
          LIMIT 1
        `) as { id: string }[];

        if (existing.length === 0) {
          return false;
        }

        await sql`
          DELETE FROM test_results
          WHERE id = ${resultId} AND user_id = ${userId}
        `;
        return true;
      }
    } catch (err) {
      console.error("[VisionCare Results] deleteTestResult error:", err);
      return false;
    }
  }

  const existing = memoryTestResults.get(resultId);
  if (!existing || existing.user_id !== userId) {
    return false;
  }
  return memoryTestResults.delete(resultId);
}
