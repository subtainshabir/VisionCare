import PDFDocument from "pdfkit";
import { SavedTestResult, SafeUser } from "@/lib/db/schema";

export interface GeneratePdfOptions {
  result: SavedTestResult;
  user: SafeUser;
}

/**
 * Generates an A4 medical-inspired PDF screening report buffer using PDFKit.
 * Uses only standard built-in fonts to ensure fast, reliable serverless execution.
 */
export async function generateScreeningPdf(options: GeneratePdfOptions): Promise<Buffer> {
  const { result, user } = options;

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 45,
        info: {
          Title: `VisionCare Screening Report - ${result.testTitle}`,
          Author: "VisionCare Digital Screening Platform",
          Subject: "Demonstration Vision Screening Summary",
          CreationDate: new Date(),
        },
      });

      const chunks: Buffer[] = [];
      doc.on("data", (chunk: Buffer) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", (err: Error) => reject(err));

      const primaryColor = "#0891B2"; // Cyan-600
      const slateDark = "#0F172A";    // Slate-900
      const slateText = "#334155";    // Slate-700
      const slateLight = "#64748B";   // Slate-500
      const boxBg = "#F8FAFC";        // Slate-50
      const boxBorder = "#E2E8F0";    // Slate-200

      // 1. Header Banner
      doc.rect(45, 45, 505, 54).fill(slateDark);

      // VisionCare Logo & Title
      doc
        .fillColor("#06B6D4")
        .fontSize(20)
        .font("Helvetica-Bold")
        .text("VisionCare", 60, 56);

      doc
        .fillColor("#94A3B8")
        .fontSize(9)
        .font("Helvetica")
        .text("DIGITAL VISION SCREENING DEMONSTRATION REPORT", 60, 80);

      const genDateStr = new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      doc
        .fillColor("#94A3B8")
        .fontSize(8)
        .font("Helvetica")
        .text(`Report Generated: ${genDateStr}`, 320, 68, { align: "right", width: 215 });

      // 2. Participant & Test Metadata Box
      let y = 115;
      doc.rect(45, y, 505, 68).fillAndStroke(boxBg, boxBorder);

      doc.fillColor(slateDark).fontSize(10).font("Helvetica-Bold").text("SESSION DETAILS", 60, y + 10);

      // Left Column
      doc.fillColor(slateLight).fontSize(9).font("Helvetica").text("Participant Name:", 60, y + 28);
      doc.fillColor(slateDark).font("Helvetica-Bold").text(user.displayName, 155, y + 28);

      doc.fillColor(slateLight).font("Helvetica").text("Account Email:", 60, y + 44);
      doc.fillColor(slateDark).font("Helvetica").text(user.email, 155, y + 44);

      // Right Column
      const completedDateStr = new Date(result.completedAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      doc.fillColor(slateLight).font("Helvetica").text("Completed Date:", 310, y + 28);
      doc.fillColor(slateDark).font("Helvetica").text(completedDateStr, 400, y + 28);

      doc.fillColor(slateLight).font("Helvetica").text("Result Record ID:", 310, y + 44);
      doc.fillColor(slateDark).font("Helvetica").text(result.id, 400, y + 44);

      // 3. Test Identification
      y = 198;
      doc.fillColor(primaryColor).fontSize(14).font("Helvetica-Bold").text(result.testTitle, 45, y);

      y += 22;
      // 4. Metrics Cards Row
      const cardWidth = 118;
      const cardHeight = 52;
      const cardSpacing = 11;
      let cardX = 45;

      const metrics = [
        { label: "Total Items", value: `${result.totalItems}` },
        { label: "Items Answered", value: `${result.answeredCount} of ${result.totalItems}` },
        { label: "Target Matches", value: `${result.matchedCount}` },
        { label: "Agreement Rate", value: `${result.matchPercentage}%` },
      ];

      for (const m of metrics) {
        doc.rect(cardX, y, cardWidth, cardHeight).fillAndStroke(boxBg, boxBorder);
        doc.fillColor(slateLight).fontSize(8).font("Helvetica").text(m.label.toUpperCase(), cardX, y + 10, {
          width: cardWidth,
          align: "center",
        });
        doc.fillColor(slateDark).fontSize(15).font("Helvetica-Bold").text(m.value, cardX, y + 24, {
          width: cardWidth,
          align: "center",
        });
        cardX += cardWidth + cardSpacing;
      }

      // 5. Summary Observation
      y += 66;
      doc.rect(45, y, 505, 55).fillAndStroke("#F0FDF4", "#BBF7D0"); // Soft light green border
      doc.fillColor("#166534").fontSize(9).font("Helvetica-Bold").text("DEMONSTRATION OBSERVATION", 58, y + 10);
      doc
        .fillColor("#14532D")
        .fontSize(9)
        .font("Helvetica")
        .text(result.summaryNote, 58, y + 24, { width: 480, lineGap: 3 });

      // 6. Test Nature Explanation
      y += 68;
      doc.fillColor(slateDark).fontSize(10).font("Helvetica-Bold").text("WHAT THIS DEMONSTRATION REPRESENTS", 45, y);

      y += 16;
      let testExplanation = "";
      if (result.testType === "color-vision") {
        testExplanation =
          "This demonstration presented color-contrast stimuli to explore digital chromatic discrimination under typical consumer screen conditions. Matching demonstration patterns indicates your response aligned with the test answer key, but does not test for all forms or degrees of color vision deficiency.";
      } else if (result.testType === "distance-vision") {
        testExplanation =
          "This demonstration evaluated high-contrast letter optotype recognition across standardized steps. Because display pixel densities (DPI) and physical viewing distances are uncalibrated in consumer browsers, this test does not determine 20/20 vision or clinical distance acuity.";
      } else {
        testExplanation =
          "This demonstration presented graded typographic reading passages to assess close-range reading clarity. Operating system font smoothing and device scaling directly affect text rendering and legibility; this does not assign standardized reading grades or diagnose presbyopia.";
      }

      doc.fillColor(slateText).fontSize(9).font("Helvetica").text(testExplanation, 45, y, {
        width: 505,
        lineGap: 4,
      });

      // 7. Responsible Screening Guidance & Clinical Limitations Notice
      y += 58;
      doc.rect(45, y, 505, 110).fillAndStroke("#FFFBEB", "#FDE68A"); // Amber notice box

      doc
        .fillColor("#92400E")
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("RESPONSIBLE SCREENING & MEDICAL LIMITATION NOTICE", 58, y + 12);

      const limitationsText =
        "• NOT A MEDICAL DIAGNOSIS: VisionCare is an educational visual demonstration tool. It does not measure clinical visual acuity, diagnose eye diseases, or evaluate ocular health.\n" +
        "• TECHNICAL BOUNDARIES: Display brightness, ambient lighting, color temperature filters, viewing posture, and browser scaling significantly influence test presentation.\n" +
        "• CONSULT AN EYE CARE SPECIALIST: If you experience vision changes, headaches, eyestrain, or blurring, consult a licensed optometrist or ophthalmologist for a comprehensive clinical eye examination.";

      doc
        .fillColor("#78350F")
        .fontSize(8.5)
        .font("Helvetica")
        .text(limitationsText, 58, y + 28, { width: 480, lineGap: 3.5 });

      // 8. Footer
      const footerY = 750;
      doc.rect(45, footerY, 505, 1).fill("#CBD5E1");

      doc
        .fillColor(slateLight)
        .fontSize(8)
        .font("Helvetica")
        .text("VisionCare Digital Vision Screening Demonstration  |  https://visioncare.app", 45, footerY + 8);

      doc
        .fillColor(slateLight)
        .fontSize(8)
        .font("Helvetica")
        .text("Page 1 of 1", 45, footerY + 8, { align: "right", width: 505 });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
