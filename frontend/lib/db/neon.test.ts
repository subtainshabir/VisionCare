import assert from "node:assert";
import { maskDatabaseUrl, isDatabaseConfigured } from "./neon";

console.log("Running Neon Database Integration Tests...");

// 1. Password masking test
const testUrl = "postgresql://myuser:super_secret_password@ep-sample-123.us-east-2.aws.neon.tech/neondb?sslmode=require";
const masked = maskDatabaseUrl(testUrl);
assert.strictEqual(masked.includes("super_secret_password"), false, "Password must not be in masked string");
assert.strictEqual(masked.includes("myuser:***@"), true, "Password should be replaced with ***");

// 2. Unconfigured handling
assert.strictEqual(maskDatabaseUrl(undefined), "Not configured");
assert.strictEqual(maskDatabaseUrl(""), "Not configured");

// 3. Placeholder detection
process.env.DATABASE_URL = "postgresql://USER:PASSWORD@ep-sample-123.neon.tech/neondb?sslmode=require";
assert.strictEqual(isDatabaseConfigured(), false, "Placeholder credentials should be detected as unconfigured");

// 4. Valid configuration detection
process.env.DATABASE_URL = "postgresql://alex_prod:secret999@ep-prod-01.neon.tech/neondb?sslmode=require";
assert.strictEqual(isDatabaseConfigured(), true, "Valid credentials should be detected as configured");

console.log("All Neon database integration assertions passed successfully!");
