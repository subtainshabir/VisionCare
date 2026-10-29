import assert from "node:assert";
import { generateScreeningPdf } from "./pdf-service";
import { SavedTestResult, SafeUser } from "@/lib/db/schema";

async function runTests() {
  console.log("Running PDF Report Generation Tests...");

  const mockUser: SafeUser = {
    id: "usr_pdf_test_123",
    displayName: "Taylor Morgan",
    email: "taylor@example.com",
    createdAt: new Date().toISOString(),
  };

  const testTypes = ["color-vision", "distance-vision", "near-vision"] as const;

  for (const testType of testTypes) {
    const mockResult: SavedTestResult = {
      id: `res_pdf_${testType}_001`,
      userId: mockUser.id,
      testType,
      testTitle: `${testType.replace("-", " ").toUpperCase()} Demonstration`,
      summaryNote: "Matched 4 of 4 targets in demonstration under uncalibrated display.",
      totalItems: 4,
      answeredCount: 4,
      matchedCount: 4,
      matchPercentage: 100,
      completedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    const pdfBuffer = await generateScreeningPdf({
      result: mockResult,
      user: mockUser,
    });

    assert.ok(Buffer.isBuffer(pdfBuffer), "PDF output must be a Buffer");
    assert.ok(pdfBuffer.length > 1000, "PDF buffer must contain content (>1KB)");

    // PDF files must start with %PDF-
    const header = pdfBuffer.subarray(0, 5).toString("utf-8");
    assert.strictEqual(header, "%PDF-", `Generated file must start with %PDF- header for ${testType}`);

    console.log(`✓ Verified PDF generation for ${testType} (${pdfBuffer.length} bytes)`);
  }

  console.log("All PDF Report Generation tests passed successfully!");
}

runTests().catch((err) => {
  console.error("PDF test failed:", err);
  process.exit(1);
});
