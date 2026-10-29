import { NextRequest } from "next/server";

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Periodic garbage collection to prevent memory bloat
const GC_INTERVAL_MS = 5 * 60 * 1000;
let lastGcTime = Date.now();

function cleanupStaleEntries(now: number, maxWindowMs: number) {
  if (now - lastGcTime < GC_INTERVAL_MS) return;
  lastGcTime = now;

  for (const [key, record] of rateLimitStore.entries()) {
    const valid = record.timestamps.filter((ts) => now - ts < maxWindowMs);
    if (valid.length === 0) {
      rateLimitStore.delete(key);
    } else {
      record.timestamps = valid;
    }
  }
}

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const firstIp = forwarded.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  return "127.0.0.1";
}

export interface RateLimitOptions {
  keyPrefix: string;
  maxRequests: number;
  windowMs: number;
  identifier?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds?: number;
}

/**
 * Checks in-memory sliding-window rate limit for a given request.
 */
export function checkRateLimit(
  request: NextRequest,
  options: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  const id = options.identifier || getClientIp(request);
  const storeKey = `${options.keyPrefix}:${id}`;

  cleanupStaleEntries(now, options.windowMs);

  let record = rateLimitStore.get(storeKey);
  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(storeKey, record);
  }

  // Filter timestamps within current window
  const validTimestamps = record.timestamps.filter((ts) => now - ts < options.windowMs);
  record.timestamps = validTimestamps;

  if (validTimestamps.length >= options.maxRequests) {
    const oldest = validTimestamps[0] || now;
    const retryAfterSeconds = Math.max(1, Math.ceil((oldest + options.windowMs - now) / 1000));
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds,
    };
  }

  validTimestamps.push(now);
  return {
    allowed: true,
    remaining: options.maxRequests - validTimestamps.length,
  };
}

/**
 * Resets rate limit for a specific key (useful for tests and successful logins).
 */
export function resetRateLimit(keyPrefix: string, ip: string): void {
  rateLimitStore.delete(`${keyPrefix}:${ip}`);
}

/**
 * Clears all active rate limit records (useful for test suites).
 */
export function clearAllRateLimits(): void {
  rateLimitStore.clear();
}
