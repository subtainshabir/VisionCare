/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const plates = require("./build-plates.js");
const assetsDir = path.join(__dirname, "..", "public", "assets", "color-vision");
const previewHtmlPath = path.join(__dirname, "color-vision-gallery.html");

console.log("==================================================");
console.log("VISIONCARE COLOR VISION QUESTION BANK VALIDATION");
console.log("==================================================");

let totalPassed = 0;
let errors = [];
const galleryCards = [];

for (let i = 0; i < plates.length; i++) {
  const p = plates[i];
  const filename = path.basename(p.image);
  const filePath = path.join(assetsDir, filename);

  // 1. File existence & size
  if (!fs.existsSync(filePath)) {
    errors.push(`Plate ${p.id}: missing asset file ${filePath}`);
    continue;
  }
  const stat = fs.statSync(filePath);
  if (stat.size < 500) {
    errors.push(`Plate ${p.id}: asset file is suspiciously small (${stat.size} bytes)`);
    continue;
  }

  // 2. Read SVG content and parse circles
  const svgContent = fs.readFileSync(filePath, "utf8");
  const circleMatches = [...svgContent.matchAll(/<circle\s+cx="([^"]+)"\s+cy="([^"]+)"\s+r="([^"]+)"\s+fill="([^"]+)"/g)];
  if (circleMatches.length < 500) {
    errors.push(`Plate ${p.id}: only ${circleMatches.length} dots found in SVG (expected ~700+)`);
  }

  // 3. Verify correctAnswer in options
  if (!p.options.includes(p.correctAnswer)) {
    errors.push(`Plate ${p.id}: correctAnswer '${p.correctAnswer}' is NOT in options: ${p.options.join(", ")}`);
  }

  // 4. Verify uniqueness of options
  const uniqueOpts = new Set(p.options);
  if (uniqueOpts.size !== p.options.length) {
    errors.push(`Plate ${p.id}: has duplicate options: ${p.options.join(", ")}`);
  }

  totalPassed++;

  // Add to internal review gallery
  galleryCards.push(`
    <div style="border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; background: #fff; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.06);">
      <div style="width: 240px; height: 240px; margin: 0 auto; border-radius: 50%; overflow: hidden; border: 3px solid #cbd5e1;">
        <img src="../public/assets/color-vision/${filename}" style="width: 100%; height: 100%; display: block;" alt="${p.id}" />
      </div>
      <div style="margin-top: 10px; font-family: system-ui, sans-serif;">
        <div style="font-weight: bold; font-size: 14px; color: #0f172a;">${p.id}</div>
        <div style="font-size: 18px; font-weight: 800; color: #0d9488; margin: 4px 0;">Target: ${p.correctAnswer}</div>
        <div style="font-size: 11px; color: #64748b;">${p.category} | ${p.plateType}</div>
        <div style="font-size: 11px; color: #475569; margin-top: 4px;">Options: ${p.options.join(", ")}</div>
      </div>
    </div>
  `);
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>VisionCare Internal Color Vision Gallery (108 Plates)</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
    h1 { margin-bottom: 8px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 20px; margin-top: 24px; }
  </style>
</head>
<body>
  <h1>VisionCare Color Vision Screening - Plate Verification Gallery</h1>
  <p style="color: #64748b; margin: 0 0 16px 0;">Reviewing all 108 high-clarity screening plates for pattern visibility, centering, and answer key accuracy.</p>
  <div style="background: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; padding: 12px 16px; border-radius: 8px; font-weight: 600;">
    Verification Status: ${totalPassed} / ${plates.length} Plates Passed Full Structural & Asset Integrity Checks.
  </div>
  <div class="grid">
    ${galleryCards.join("\n")}
  </div>
</body>
</html>`;

fs.writeFileSync(previewHtmlPath, html, "utf8");

console.log(`Validated ${totalPassed} of ${plates.length} plates successfully.`);
if (errors.length > 0) {
  console.error("Found errors:", errors);
  process.exit(1);
} else {
  console.log("Generated internal HTML validation gallery at:", previewHtmlPath);
  console.log("ALL 108 PLATES VALIDATED WITH ZERO ERRORS!");
}
