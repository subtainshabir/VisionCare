/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const outputDir = path.join(__dirname, "..", "public", "assets", "color-vision");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Distance to 2D line segment
function distToSegment(px, py, x1, y1, x2, y2) {
  const l2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
  if (l2 === 0) return Math.hypot(px - x1, py - y1);
  let t = Math.max(0, Math.min(1, ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2));
  return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
}

// Distance to circular arc
function distToArc(px, py, cx, cy, r, startAngle, endAngle) {
  let angle = Math.atan2(py - cy, px - cx);
  while (angle < startAngle) angle += Math.PI * 2;
  while (angle > endAngle) angle -= Math.PI * 2;
  if (angle >= startAngle && angle <= endAngle) {
    return Math.abs(Math.hypot(px - cx, py - cy) - r);
  }
  const d1 = Math.hypot(px - (cx + r * Math.cos(startAngle)), py - (cy + r * Math.sin(startAngle)));
  const d2 = Math.hypot(px - (cx + r * Math.cos(endAngle)), py - (cy + r * Math.sin(endAngle)));
  return Math.min(d1, d2);
}

// Check if point is inside a single digit (0-9)
function isPointInSingleDigit(px, py, digit, cx, cy, s = 1) {
  const w = 11 * s;
  switch (String(digit)) {
    case "0":
      return Math.abs(Math.hypot(px - cx, (py - cy) / 1.35) - 22 * s) <= w;
    case "1":
      return (
        distToSegment(px, py, cx, cy - 36 * s, cx, cy + 36 * s) <= w ||
        distToSegment(px, py, cx - 14 * s, cy - 20 * s, cx, cy - 36 * s) <= w ||
        distToSegment(px, py, cx - 14 * s, cy + 36 * s, cx + 14 * s, cy + 36 * s) <= w
      );
    case "2":
      return (
        distToArc(px, py, cx, cy - 16 * s, 18 * s, -Math.PI * 0.85, Math.PI * 0.3) <= w ||
        distToSegment(px, py, cx + 14 * s, cy - 6 * s, cx - 16 * s, cy + 36 * s) <= w ||
        distToSegment(px, py, cx - 16 * s, cy + 36 * s, cx + 18 * s, cy + 36 * s) <= w
      );
    case "3":
      return (
        distToArc(px, py, cx - 2 * s, cy - 16 * s, 16 * s, -Math.PI * 0.75, Math.PI * 0.5) <= w ||
        distToArc(px, py, cx - 2 * s, cy + 16 * s, 18 * s, -Math.PI * 0.5, Math.PI * 0.85) <= w
      );
    case "4":
      return (
        distToSegment(px, py, cx + 10 * s, cy - 36 * s, cx + 10 * s, cy + 36 * s) <= w ||
        distToSegment(px, py, cx + 10 * s, cy - 36 * s, cx - 18 * s, cy + 12 * s) <= w ||
        distToSegment(px, py, cx - 18 * s, cy + 12 * s, cx + 20 * s, cy + 12 * s) <= w
      );
    case "5":
      return (
        distToSegment(px, py, cx - 16 * s, cy - 36 * s, cx + 16 * s, cy - 36 * s) <= w ||
        distToSegment(px, py, cx - 16 * s, cy - 36 * s, cx - 16 * s, cy - 8 * s) <= w ||
        distToArc(px, py, cx - 2 * s, cy + 12 * s, 19 * s, -Math.PI * 0.55, Math.PI * 0.85) <= w
      );
    case "6":
      return (
        distToArc(px, py, cx, cy + 14 * s, 18 * s, 0, Math.PI * 2) <= w ||
        distToArc(px, py, cx + 22 * s, cy - 12 * s, 38 * s, Math.PI * 0.7, Math.PI * 1.15) <= w
      );
    case "7":
      return (
        distToSegment(px, py, cx - 18 * s, cy - 36 * s, cx + 18 * s, cy - 36 * s) <= w ||
        distToSegment(px, py, cx + 18 * s, cy - 36 * s, cx - 10 * s, cy + 36 * s) <= w
      );
    case "8":
      return (
        distToArc(px, py, cx, cy - 17 * s, 16 * s, 0, Math.PI * 2) <= w ||
        distToArc(px, py, cx, cy + 17 * s, 18 * s, 0, Math.PI * 2) <= w
      );
    case "9":
      return (
        distToArc(px, py, cx, cy - 14 * s, 18 * s, 0, Math.PI * 2) <= w ||
        distToArc(px, py, cx - 22 * s, cy + 12 * s, 38 * s, -Math.PI * 0.3, Math.PI * 0.15) <= w
      );
    default:
      return false;
  }
}

// Check if point is inside a letter
function isPointInLetter(px, py, letter, cx, cy, s = 1) {
  const w = 11 * s;
  switch (letter.toUpperCase()) {
    case "A":
      return (
        distToSegment(px, py, cx - 20 * s, cy + 36 * s, cx, cy - 36 * s) <= w ||
        distToSegment(px, py, cx + 20 * s, cy + 36 * s, cx, cy - 36 * s) <= w ||
        distToSegment(px, py, cx - 12 * s, cy + 6 * s, cx + 12 * s, cy + 6 * s) <= w
      );
    case "B":
      return (
        distToSegment(px, py, cx - 18 * s, cy - 36 * s, cx - 18 * s, cy + 36 * s) <= w ||
        distToArc(px, py, cx - 6 * s, cy - 16 * s, 15 * s, -Math.PI * 0.5, Math.PI * 0.5) <= w ||
        distToArc(px, py, cx - 6 * s, cy + 16 * s, 17 * s, -Math.PI * 0.5, Math.PI * 0.5) <= w
      );
    case "C":
      return distToArc(px, py, cx, cy, 26 * s, Math.PI * 0.25, Math.PI * 1.75) <= w;
    case "D":
      return (
        distToSegment(px, py, cx - 16 * s, cy - 36 * s, cx - 16 * s, cy + 36 * s) <= w ||
        distToArc(px, py, cx - 10 * s, cy, 28 * s, -Math.PI * 0.5, Math.PI * 0.5) <= w
      );
    case "E":
      return (
        distToSegment(px, py, cx - 18 * s, cy - 36 * s, cx - 18 * s, cy + 36 * s) <= w ||
        distToSegment(px, py, cx - 18 * s, cy - 36 * s, cx + 18 * s, cy - 36 * s) <= w ||
        distToSegment(px, py, cx - 18 * s, cy, cx + 14 * s, cy) <= w ||
        distToSegment(px, py, cx - 18 * s, cy + 36 * s, cx + 18 * s, cy + 36 * s) <= w
      );
    case "F":
      return (
        distToSegment(px, py, cx - 18 * s, cy - 36 * s, cx - 18 * s, cy + 36 * s) <= w ||
        distToSegment(px, py, cx - 18 * s, cy - 36 * s, cx + 18 * s, cy - 36 * s) <= w ||
        distToSegment(px, py, cx - 18 * s, cy, cx + 14 * s, cy) <= w
      );
    case "G":
      return (
        distToArc(px, py, cx, cy, 26 * s, Math.PI * 0.2, Math.PI * 1.75) <= w ||
        distToSegment(px, py, cx + 4 * s, cy + 4 * s, cx + 22 * s, cy + 4 * s) <= w ||
        distToSegment(px, py, cx + 22 * s, cy + 4 * s, cx + 22 * s, cy + 20 * s) <= w
      );
    case "H":
      return (
        distToSegment(px, py, cx - 18 * s, cy - 36 * s, cx - 18 * s, cy + 36 * s) <= w ||
        distToSegment(px, py, cx + 18 * s, cy - 36 * s, cx + 18 * s, cy + 36 * s) <= w ||
        distToSegment(px, py, cx - 18 * s, cy, cx + 18 * s, cy) <= w
      );
    case "K":
      return (
        distToSegment(px, py, cx - 18 * s, cy - 36 * s, cx - 18 * s, cy + 36 * s) <= w ||
        distToSegment(px, py, cx - 16 * s, cy + 4 * s, cx + 18 * s, cy - 36 * s) <= w ||
        distToSegment(px, py, cx - 2 * s, cy - 10 * s, cx + 18 * s, cy + 36 * s) <= w
      );
    case "L":
      return (
        distToSegment(px, py, cx - 18 * s, cy - 36 * s, cx - 18 * s, cy + 36 * s) <= w ||
        distToSegment(px, py, cx - 18 * s, cy + 36 * s, cx + 18 * s, cy + 36 * s) <= w
      );
    case "M":
      return (
        distToSegment(px, py, cx - 22 * s, cy - 36 * s, cx - 22 * s, cy + 36 * s) <= w ||
        distToSegment(px, py, cx + 22 * s, cy - 36 * s, cx + 22 * s, cy + 36 * s) <= w ||
        distToSegment(px, py, cx - 22 * s, cy - 36 * s, cx, cy + 6 * s) <= w ||
        distToSegment(px, py, cx, cy + 6 * s, cx + 22 * s, cy - 36 * s) <= w
      );
    case "N":
      return (
        distToSegment(px, py, cx - 20 * s, cy - 36 * s, cx - 20 * s, cy + 36 * s) <= w ||
        distToSegment(px, py, cx + 20 * s, cy - 36 * s, cx + 20 * s, cy + 36 * s) <= w ||
        distToSegment(px, py, cx - 20 * s, cy - 36 * s, cx + 20 * s, cy + 36 * s) <= w
      );
    case "O":
      return distToArc(px, py, cx, cy, 26 * s, 0, Math.PI * 2) <= w;
    case "P":
      return (
        distToSegment(px, py, cx - 18 * s, cy - 36 * s, cx - 18 * s, cy + 36 * s) <= w ||
        distToArc(px, py, cx - 6 * s, cy - 14 * s, 17 * s, -Math.PI * 0.5, Math.PI * 0.5) <= w
      );
    case "R":
      return (
        distToSegment(px, py, cx - 18 * s, cy - 36 * s, cx - 18 * s, cy + 36 * s) <= w ||
        distToArc(px, py, cx - 6 * s, cy - 14 * s, 17 * s, -Math.PI * 0.5, Math.PI * 0.5) <= w ||
        distToSegment(px, py, cx - 2 * s, cy + 2 * s, cx + 18 * s, cy + 36 * s) <= w
      );
    case "S":
      return (
        distToArc(px, py, cx, cy - 16 * s, 16 * s, -Math.PI * 0.75, Math.PI * 0.4) <= w ||
        distToArc(px, py, cx, cy + 16 * s, 17 * s, Math.PI * 0.25, Math.PI * 1.4) <= w
      );
    case "T":
      return (
        distToSegment(px, py, cx - 22 * s, cy - 36 * s, cx + 22 * s, cy - 36 * s) <= w ||
        distToSegment(px, py, cx, cy - 36 * s, cx, cy + 36 * s) <= w
      );
    case "U":
      return (
        distToSegment(px, py, cx - 18 * s, cy - 36 * s, cx - 18 * s, cy + 16 * s) <= w ||
        distToSegment(px, py, cx + 18 * s, cy - 36 * s, cx + 18 * s, cy + 16 * s) <= w ||
        distToArc(px, py, cx, cy + 16 * s, 18 * s, 0, Math.PI) <= w
      );
    case "V":
      return (
        distToSegment(px, py, cx - 20 * s, cy - 36 * s, cx, cy + 36 * s) <= w ||
        distToSegment(px, py, cx + 20 * s, cy - 36 * s, cx, cy + 36 * s) <= w
      );
    case "W":
      return (
        distToSegment(px, py, cx - 24 * s, cy - 36 * s, cx - 12 * s, cy + 36 * s) <= w ||
        distToSegment(px, py, cx - 12 * s, cy + 36 * s, cx, cy - 10 * s) <= w ||
        distToSegment(px, py, cx, cy - 10 * s, cx + 12 * s, cy + 36 * s) <= w ||
        distToSegment(px, py, cx + 12 * s, cy + 36 * s, cx + 24 * s, cy - 36 * s) <= w
      );
    case "X":
      return (
        distToSegment(px, py, cx - 20 * s, cy - 36 * s, cx + 20 * s, cy + 36 * s) <= w ||
        distToSegment(px, py, cx + 20 * s, cy - 36 * s, cx - 20 * s, cy + 36 * s) <= w
      );
    case "Y":
      return (
        distToSegment(px, py, cx - 18 * s, cy - 36 * s, cx, cy - 4 * s) <= w ||
        distToSegment(px, py, cx + 18 * s, cy - 36 * s, cx, cy - 4 * s) <= w ||
        distToSegment(px, py, cx, cy - 4 * s, cx, cy + 36 * s) <= w
      );
    case "Z":
      return (
        distToSegment(px, py, cx - 20 * s, cy - 36 * s, cx + 20 * s, cy - 36 * s) <= w ||
        distToSegment(px, py, cx + 20 * s, cy - 36 * s, cx - 20 * s, cy + 36 * s) <= w ||
        distToSegment(px, py, cx - 20 * s, cy + 36 * s, cx + 20 * s, cy + 36 * s) <= w
      );
    default:
      return false;
  }
}

// Check if point is inside a geometric shape
function isPointInShape(px, py, shape, cx, cy) {
  const dx = px - cx;
  const dy = py - cy;
  const dist = Math.hypot(dx, dy);

  switch (shape.toUpperCase()) {
    case "CIRCLE":
      return dist >= 26 && dist <= 62;
    case "RING":
      return dist >= 38 && dist <= 58;
    case "TRIANGLE": {
      if (dy < -50 || dy > 50) return false;
      const progress = (dy + 50) / 100;
      const halfW = progress * 58;
      return Math.abs(dx) <= halfW;
    }
    case "SQUARE":
      return Math.abs(dx) <= 46 && Math.abs(dy) <= 46;
    case "DIAMOND":
      return Math.abs(dx) + Math.abs(dy) <= 62;
    case "STAR": {
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      return (absX <= 64 && absY <= 16) || (absX <= 16 && absY <= 64) || dist <= 26;
    }
    case "CROSS":
      return (Math.abs(dx) <= 18 && Math.abs(dy) <= 64) || (Math.abs(dx) <= 64 && Math.abs(dy) <= 18);
    case "HEART": {
      // Symmetrical optical heart
      const hx = Math.abs(dx);
      if (dy < -10) {
        return Math.hypot(hx - 22, dy + 22) <= 24;
      }
      return hx <= 46 && dy <= 54 && dy >= hx * 1.15 - 50;
    }
    case "HEXAGON":
      return Math.abs(dx) <= 48 && Math.abs(dy) <= 48 && Math.abs(dx) * 0.577 + Math.abs(dy) <= 56;
    case "ARROW":
      return (
        (Math.abs(dx) <= 14 && dy >= -44 && dy <= 48) ||
        (dy <= -10 && Math.abs(dx) <= (dy + 48) * 1.1)
      );
    default:
      return false;
  }
}

// Master point-in-glyph test
function isPointInGlyph(px, py, target, cx = 140, cy = 140) {
  const str = String(target).trim();

  // 1. Two-digit numbers (e.g. "12", "74", "96")
  if (/^\d{2}$/.test(str)) {
    const d1 = str[0];
    const d2 = str[1];
    return (
      isPointInSingleDigit(px, py, d1, cx - 26, cy, 0.88) ||
      isPointInSingleDigit(px, py, d2, cx + 26, cy, 0.88)
    );
  }

  // 2. Single-digit numbers (e.g. "5", "8")
  if (/^\d$/.test(str)) {
    return isPointInSingleDigit(px, py, str, cx, cy, 1.15);
  }

  // 3. Single-letter optotypes (e.g. "E", "C")
  if (/^[A-Za-z]$/.test(str)) {
    return isPointInLetter(px, py, str, cx, cy, 1.12);
  }

  // 4. Geometric shapes (e.g. "Circle", "Triangle", "Star")
  return isPointInShape(px, py, str, cx, cy);
}

// Palettes
const palettes = {
  control: {
    fg: ["#0f766e", "#115e59", "#134e4a", "#0d9488"],
    bg: ["#e2e8f0", "#cbd5e1", "#f1f5f9", "#94a3b8"],
  },
  "control-blue": {
    fg: ["#1e1b4b", "#1e293b", "#334155", "#0f172a"],
    bg: ["#bae6fd", "#e0f2fe", "#f0f9ff", "#7dd3fc"],
  },
  "red-green-protan": {
    fg: ["#dc2626", "#ef4444", "#b91c1c", "#ea580c"],
    bg: ["#65a30d", "#84cc16", "#4d7c0f", "#3f6212"],
  },
  "red-green-deutan": {
    fg: ["#16a34a", "#22c55e", "#15803d", "#10b981"],
    bg: ["#ea580c", "#c2410c", "#f97316", "#9a3412"],
  },
  "blue-yellow-tritan": {
    fg: ["#2563eb", "#1d4ed8", "#3b82f6", "#1e40af"],
    bg: ["#ca8a04", "#eab308", "#a16207", "#854d0e"],
  },
};

// Generate SVG string for a given plate
function generatePlateSvg(plate) {
  const cx = 140;
  const cy = 140;
  const maxRadius = 126;
  const step = 14;
  const palette = palettes[plate.category] || palettes["control"];
  const fgColors = palette.fg;
  const bgColors = palette.bg;

  const dots = [];
  let counter = 0;

  for (let x = 18; x <= 262; x += step) {
    for (let y = 18; y <= 262; y += step) {
      counter++;
      const jitterX = ((counter * 7) % 7) - 3;
      const jitterY = ((counter * 13) % 7) - 3;
      const posX = x + jitterX;
      const posY = y + jitterY;

      const dist = Math.hypot(posX - cx, posY - cy);
      if (dist <= maxRadius) {
        const inGlyph = isPointInGlyph(posX, posY, plate.correctAnswer, cx, cy);
        const colorPalette = inGlyph ? fgColors : bgColors;
        const color = colorPalette[counter % colorPalette.length];
        const r = (4.8 + ((counter * 11) % 4) * 0.9).toFixed(1);

        dots.push(
          `<circle cx="${posX.toFixed(1)}" cy="${posY.toFixed(1)}" r="${r}" fill="${color}" stroke="rgba(255,255,255,0.25)" stroke-width="0.75"/>`
        );
      }
    }
  }

  return `<svg viewBox="0 0 280 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Educational Color Vision Screening Plate ${plate.id}">
  <circle cx="140" cy="140" r="134" fill="#fafafa"/>
  ${dots.join("\n  ")}
</svg>`;
}

module.exports = {
  generatePlateSvg,
  outputDir,
};
