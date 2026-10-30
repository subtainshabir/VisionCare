/* eslint-disable @typescript-eslint/no-require-imports */
const path = require("path");

const outputDir = path.join(__dirname, "..", "public", "assets", "color-vision");

// 2D distance to segment
function distToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1;
  const l2 = dx * dx + dy * dy;
  if (l2 === 0) return Math.hypot(px - x1, py - y1);
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / l2));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

// 2D distance to circular arc
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
  const w = 9.8 * s;
  switch (String(digit)) {
    case "0":
      return Math.abs(Math.hypot((px - cx) / 1.15, (py - cy) / 1.55) - 26 * s) <= w;
    case "1":
      return (
        distToSegment(px, py, cx + 4 * s, cy - 44 * s, cx + 4 * s, cy + 44 * s) <= w ||
        distToSegment(px, py, cx - 18 * s, cy - 24 * s, cx + 4 * s, cy - 44 * s) <= w ||
        distToSegment(px, py, cx - 18 * s, cy + 44 * s, cx + 26 * s, cy + 44 * s) <= w
      );
    case "2":
      return (
        distToArc(px, py, cx, cy - 18 * s, 22 * s, -Math.PI * 0.85, Math.PI * 0.25) <= w ||
        distToSegment(px, py, cx + 18 * s, cy - 6 * s, cx - 22 * s, cy + 44 * s) <= w ||
        distToSegment(px, py, cx - 22 * s, cy + 44 * s, cx + 24 * s, cy + 44 * s) <= w
      );
    case "3":
      return (
        distToArc(px, py, cx - 2 * s, cy - 20 * s, 20 * s, -Math.PI * 0.75, Math.PI * 0.5) <= w ||
        distToArc(px, py, cx - 2 * s, cy + 20 * s, 22 * s, -Math.PI * 0.5, Math.PI * 0.85) <= w
      );
    case "4":
      return (
        distToSegment(px, py, cx + 12 * s, cy - 44 * s, cx + 12 * s, cy + 44 * s) <= w ||
        distToSegment(px, py, cx - 24 * s, cy + 14 * s, cx + 12 * s, cy - 44 * s) <= w ||
        distToSegment(px, py, cx - 24 * s, cy + 14 * s, cx + 26 * s, cy + 14 * s) <= w
      );
    case "5":
      return (
        distToSegment(px, py, cx - 20 * s, cy - 44 * s, cx + 22 * s, cy - 44 * s) <= w ||
        distToSegment(px, py, cx - 20 * s, cy - 44 * s, cx - 20 * s, cy - 8 * s) <= w ||
        distToSegment(px, py, cx - 20 * s, cy - 8 * s, cx - 2 * s, cy - 8 * s) <= w ||
        distToArc(px, py, cx - 2 * s, cy + 16 * s, 24 * s, -Math.PI * 0.55, Math.PI * 0.85) <= w
      );
    case "6":
      return (
        distToArc(px, py, cx, cy + 16 * s, 24 * s, 0, Math.PI * 2) <= w ||
        distToArc(px, py, cx + 32 * s, cy - 14 * s, 48 * s, Math.PI * 0.65, Math.PI * 1.15) <= w
      );
    case "7":
      return (
        distToSegment(px, py, cx - 22 * s, cy - 44 * s, cx + 24 * s, cy - 44 * s) <= w ||
        distToSegment(px, py, cx + 24 * s, cy - 44 * s, cx - 12 * s, cy + 44 * s) <= w
      );
    case "8":
      return (
        distToArc(px, py, cx, cy - 20 * s, 20 * s, 0, Math.PI * 2) <= w ||
        distToArc(px, py, cx, cy + 20 * s, 24 * s, 0, Math.PI * 2) <= w
      );
    case "9":
      return (
        distToArc(px, py, cx, cy - 16 * s, 24 * s, 0, Math.PI * 2) <= w ||
        distToArc(px, py, cx - 32 * s, cy + 14 * s, 48 * s, -Math.PI * 0.35, Math.PI * 0.15) <= w
      );
    default:
      return false;
  }
}

// Check if point is inside a single letter (A-Z)
function isPointInLetter(px, py, letter, cx, cy, s = 1) {
  const w = 9.8 * s;
  switch (letter.toUpperCase()) {
    case "A":
      return (
        distToSegment(px, py, cx, cy - 44 * s, cx - 24 * s, cy + 44 * s) <= w ||
        distToSegment(px, py, cx, cy - 44 * s, cx + 24 * s, cy + 44 * s) <= w ||
        distToSegment(px, py, cx - 14 * s, cy + 10 * s, cx + 14 * s, cy + 10 * s) <= w
      );
    case "B":
      return (
        distToSegment(px, py, cx - 20 * s, cy - 44 * s, cx - 20 * s, cy + 44 * s) <= w ||
        distToSegment(px, py, cx - 20 * s, cy - 44 * s, cx + 2 * s, cy - 44 * s) <= w ||
        distToSegment(px, py, cx - 20 * s, cy, cx + 4 * s, cy) <= w ||
        distToSegment(px, py, cx - 20 * s, cy + 44 * s, cx + 2 * s, cy + 44 * s) <= w ||
        distToArc(px, py, cx + 2 * s, cy - 22 * s, 22 * s, -Math.PI * 0.5, Math.PI * 0.5) <= w ||
        distToArc(px, py, cx + 2 * s, cy + 22 * s, 22 * s, -Math.PI * 0.5, Math.PI * 0.5) <= w
      );
    case "C":
      return distToArc(px, py, cx + 4 * s, cy, 34 * s, Math.PI * 0.25, Math.PI * 1.75) <= w;
    case "D":
      return (
        distToSegment(px, py, cx - 18 * s, cy - 44 * s, cx - 18 * s, cy + 44 * s) <= w ||
        distToSegment(px, py, cx - 18 * s, cy - 44 * s, cx, cy - 44 * s) <= w ||
        distToSegment(px, py, cx - 18 * s, cy + 44 * s, cx, cy + 44 * s) <= w ||
        distToArc(px, py, cx, cy, 44 * s, -Math.PI * 0.5, Math.PI * 0.5) <= w
      );
    case "E":
      return (
        distToSegment(px, py, cx - 22 * s, cy - 44 * s, cx - 22 * s, cy + 44 * s) <= w ||
        distToSegment(px, py, cx - 22 * s, cy - 44 * s, cx + 22 * s, cy - 44 * s) <= w ||
        distToSegment(px, py, cx - 22 * s, cy, cx + 16 * s, cy) <= w ||
        distToSegment(px, py, cx - 22 * s, cy + 44 * s, cx + 22 * s, cy + 44 * s) <= w
      );
    case "F":
      return (
        distToSegment(px, py, cx - 22 * s, cy - 44 * s, cx - 22 * s, cy + 44 * s) <= w ||
        distToSegment(px, py, cx - 22 * s, cy - 44 * s, cx + 22 * s, cy - 44 * s) <= w ||
        distToSegment(px, py, cx - 22 * s, cy, cx + 16 * s, cy) <= w
      );
    case "G":
      return (
        distToArc(px, py, cx + 4 * s, cy, 34 * s, Math.PI * 0.2, Math.PI * 1.75) <= w ||
        distToSegment(px, py, cx + 6 * s, cy + 6 * s, cx + 28 * s, cy + 6 * s) <= w ||
        distToSegment(px, py, cx + 28 * s, cy + 6 * s, cx + 28 * s, cy + 28 * s) <= w
      );
    case "H":
      return (
        distToSegment(px, py, cx - 22 * s, cy - 44 * s, cx - 22 * s, cy + 44 * s) <= w ||
        distToSegment(px, py, cx + 22 * s, cy - 44 * s, cx + 22 * s, cy + 44 * s) <= w ||
        distToSegment(px, py, cx - 22 * s, cy, cx + 22 * s, cy) <= w
      );
    case "K":
      return (
        distToSegment(px, py, cx - 22 * s, cy - 44 * s, cx - 22 * s, cy + 44 * s) <= w ||
        distToSegment(px, py, cx - 18 * s, cy + 6 * s, cx + 22 * s, cy - 44 * s) <= w ||
        distToSegment(px, py, cx - 2 * s, cy - 8 * s, cx + 22 * s, cy + 44 * s) <= w
      );
    case "L":
      return (
        distToSegment(px, py, cx - 20 * s, cy - 44 * s, cx - 20 * s, cy + 44 * s) <= w ||
        distToSegment(px, py, cx - 20 * s, cy + 44 * s, cx + 24 * s, cy + 44 * s) <= w
      );
    case "M":
      return (
        distToSegment(px, py, cx - 26 * s, cy - 44 * s, cx - 26 * s, cy + 44 * s) <= w ||
        distToSegment(px, py, cx + 26 * s, cy - 44 * s, cx + 26 * s, cy + 44 * s) <= w ||
        distToSegment(px, py, cx - 26 * s, cy - 44 * s, cx, cy + 10 * s) <= w ||
        distToSegment(px, py, cx, cy + 10 * s, cx + 26 * s, cy - 44 * s) <= w
      );
    case "N":
      return (
        distToSegment(px, py, cx - 22 * s, cy - 44 * s, cx - 22 * s, cy + 44 * s) <= w ||
        distToSegment(px, py, cx + 22 * s, cy - 44 * s, cx + 22 * s, cy + 44 * s) <= w ||
        distToSegment(px, py, cx - 22 * s, cy - 44 * s, cx + 22 * s, cy + 44 * s) <= w
      );
    case "O":
      return Math.abs(Math.hypot((px - cx) / 1.15, (py - cy) / 1.55) - 26 * s) <= w;
    case "P":
      return (
        distToSegment(px, py, cx - 20 * s, cy - 44 * s, cx - 20 * s, cy + 44 * s) <= w ||
        distToSegment(px, py, cx - 20 * s, cy - 44 * s, cx, cy - 44 * s) <= w ||
        distToSegment(px, py, cx - 20 * s, cy - 2 * s, cx, cy - 2 * s) <= w ||
        distToArc(px, py, cx, cy - 23 * s, 21 * s, -Math.PI * 0.5, Math.PI * 0.5) <= w
      );
    case "R":
      return (
        distToSegment(px, py, cx - 20 * s, cy - 44 * s, cx - 20 * s, cy + 44 * s) <= w ||
        distToSegment(px, py, cx - 20 * s, cy - 44 * s, cx, cy - 44 * s) <= w ||
        distToSegment(px, py, cx - 20 * s, cy - 2 * s, cx, cy - 2 * s) <= w ||
        distToArc(px, py, cx, cy - 23 * s, 21 * s, -Math.PI * 0.5, Math.PI * 0.5) <= w ||
        distToSegment(px, py, cx - 2 * s, cy - 2 * s, cx + 22 * s, cy + 44 * s) <= w
      );
    case "S":
      return (
        distToArc(px, py, cx - 2 * s, cy - 20 * s, 20 * s, -Math.PI * 0.75, Math.PI * 0.35) <= w ||
        distToSegment(px, py, cx + 12 * s, cy - 8 * s, cx - 12 * s, cy + 8 * s) <= w ||
        distToArc(px, py, cx + 2 * s, cy + 20 * s, 22 * s, Math.PI * 0.25, Math.PI * 1.35) <= w
      );
    case "T":
      return (
        distToSegment(px, py, cx - 26 * s, cy - 44 * s, cx + 26 * s, cy - 44 * s) <= w ||
        distToSegment(px, py, cx, cy - 44 * s, cx, cy + 44 * s) <= w
      );
    case "U":
      return (
        distToSegment(px, py, cx - 22 * s, cy - 44 * s, cx - 22 * s, cy + 18 * s) <= w ||
        distToSegment(px, py, cx + 22 * s, cy - 44 * s, cx + 22 * s, cy + 18 * s) <= w ||
        distToArc(px, py, cx, cy + 18 * s, 22 * s, 0, Math.PI) <= w
      );
    case "V":
      return (
        distToSegment(px, py, cx - 24 * s, cy - 44 * s, cx, cy + 44 * s) <= w ||
        distToSegment(px, py, cx, cy + 44 * s, cx + 24 * s, cy - 44 * s) <= w
      );
    case "W":
      return (
        distToSegment(px, py, cx - 28 * s, cy - 44 * s, cx - 14 * s, cy + 44 * s) <= w ||
        distToSegment(px, py, cx - 14 * s, cy + 44 * s, cx, cy - 10 * s) <= w ||
        distToSegment(px, py, cx, cy - 10 * s, cx + 14 * s, cy + 44 * s) <= w ||
        distToSegment(px, py, cx + 14 * s, cy + 44 * s, cx + 28 * s, cy - 44 * s) <= w
      );
    case "X":
      return (
        distToSegment(px, py, cx - 24 * s, cy - 44 * s, cx + 24 * s, cy + 44 * s) <= w ||
        distToSegment(px, py, cx + 24 * s, cy - 44 * s, cx - 24 * s, cy + 44 * s) <= w
      );
    case "Y":
      return (
        distToSegment(px, py, cx - 24 * s, cy - 44 * s, cx, cy) <= w ||
        distToSegment(px, py, cx + 24 * s, cy - 44 * s, cx, cy) <= w ||
        distToSegment(px, py, cx, cy, cx, cy + 44 * s) <= w
      );
    case "Z":
      return (
        distToSegment(px, py, cx - 24 * s, cy - 44 * s, cx + 24 * s, cy - 44 * s) <= w ||
        distToSegment(px, py, cx + 24 * s, cy - 44 * s, cx - 24 * s, cy + 44 * s) <= w ||
        distToSegment(px, py, cx - 24 * s, cy + 44 * s, cx + 24 * s, cy + 44 * s) <= w
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
      return Math.abs(dist - 52) <= 10;
    case "RING":
      return Math.abs(dist - 48) <= 12;
    case "TRIANGLE": {
      const p1 = [cx, cy - 54];
      const p2 = [cx - 52, cy + 44];
      const p3 = [cx + 52, cy + 44];
      return (
        distToSegment(px, py, p1[0], p1[1], p2[0], p2[1]) <= 10 ||
        distToSegment(px, py, p2[0], p2[1], p3[0], p3[1]) <= 10 ||
        distToSegment(px, py, p3[0], p3[1], p1[0], p1[1]) <= 10
      );
    }
    case "SQUARE": {
      const s = 46;
      return (
        distToSegment(px, py, cx - s, cy - s, cx + s, cy - s) <= 10 ||
        distToSegment(px, py, cx + s, cy - s, cx + s, cy + s) <= 10 ||
        distToSegment(px, py, cx + s, cy + s, cx - s, cy + s) <= 10 ||
        distToSegment(px, py, cx - s, cy + s, cx - s, cy - s) <= 10
      );
    }
    case "DIAMOND": {
      const s = 54;
      return (
        distToSegment(px, py, cx, cy - s, cx + s, cy) <= 10 ||
        distToSegment(px, py, cx + s, cy, cx, cy + s) <= 10 ||
        distToSegment(px, py, cx, cy + s, cx - s, cy) <= 10 ||
        distToSegment(px, py, cx - s, cy, cx, cy - s) <= 10
      );
    }
    case "STAR": {
      const points = [];
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? 56 : 24;
        const a = (i * Math.PI) / 5 - Math.PI / 2;
        points.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
      }
      for (let i = 0; i < 10; i++) {
        const next = (i + 1) % 10;
        if (distToSegment(px, py, points[i][0], points[i][1], points[next][0], points[next][1]) <= 9) {
          return true;
        }
      }
      return false;
    }
    case "CROSS":
      return (
        (Math.abs(dx) <= 12 && Math.abs(dy) <= 56) ||
        (Math.abs(dx) <= 56 && Math.abs(dy) <= 12)
      );
    case "HEART": {
      const hx = Math.abs(dx);
      if (dy < -10) {
        return Math.abs(Math.hypot(hx - 24, dy + 22) - 24) <= 10;
      }
      return (
        distToSegment(px, py, cx - 48, cy - 10, cx, cy + 54) <= 10 ||
        distToSegment(px, py, cx + 48, cy - 10, cx, cy + 54) <= 10
      );
    }
    case "HEXAGON": {
      const points = [];
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3 - Math.PI / 6;
        points.push([cx + 52 * Math.cos(a), cy + 52 * Math.sin(a)]);
      }
      for (let i = 0; i < 6; i++) {
        const next = (i + 1) % 6;
        if (distToSegment(px, py, points[i][0], points[i][1], points[next][0], points[next][1]) <= 10) {
          return true;
        }
      }
      return false;
    }
    case "ARROW":
      return (
        (Math.abs(dx) <= 10 && dy >= -20 && dy <= 52) ||
        distToSegment(px, py, cx - 40, cy - 10, cx, cy - 54) <= 10 ||
        distToSegment(px, py, cx + 40, cy - 10, cx, cy - 54) <= 10
      );
    default:
      return false;
  }
}

// Master point-in-glyph detector
function isPointInGlyph(px, py, target, cx = 140, cy = 140) {
  const str = String(target).trim();

  // 1. Two-digit numbers (e.g. "12", "74", "96")
  if (/^\d{2}$/.test(str)) {
    const d1 = str[0];
    const d2 = str[1];
    return (
      isPointInSingleDigit(px, py, d1, cx - 30, cy, 0.88) ||
      isPointInSingleDigit(px, py, d2, cx + 30, cy, 0.88)
    );
  }

  // 2. Single-digit numbers (e.g. "5", "8")
  if (/^\d$/.test(str)) {
    return isPointInSingleDigit(px, py, str, cx, cy, 1.05);
  }

  // 3. Single-letter optotypes (e.g. "E", "C")
  if (/^[A-Za-z]$/.test(str)) {
    return isPointInLetter(px, py, str, cx, cy, 1.02);
  }

  // 4. Geometric shapes (e.g. "Circle", "Triangle", "Star")
  return isPointInShape(px, py, str, cx, cy);
}

// Refined high-contrast palettes
const palettes = {
  control: {
    fg: ["#0f766e", "#115e59", "#134e4a", "#0e7490"],
    bg: ["#cbd5e1", "#e2e8f0", "#94a3b8", "#f1f5f9"],
  },
  "control-navy": {
    fg: ["#1e1b4b", "#1e293b", "#0f172a", "#172554"],
    bg: ["#bae6fd", "#e0f2fe", "#7dd3fc", "#e2e8f0"],
  },
  "red-green-protan": {
    fg: ["#dc2626", "#ea580c", "#ef4444", "#b91c1c"],
    bg: ["#65a30d", "#84cc16", "#4d7c0f", "#3f6212"],
  },
  "red-green-protan-alt": {
    fg: ["#f43f5e", "#e11d48", "#be123c", "#fb7185"],
    bg: ["#166534", "#15803d", "#22c55e", "#14532d"],
  },
  "red-green-deutan": {
    fg: ["#059669", "#10b981", "#15803d", "#16a34a"],
    bg: ["#c2410c", "#ea580c", "#d97706", "#9a3412"],
  },
  "red-green-deutan-alt": {
    fg: ["#10b981", "#34d399", "#059669", "#047857"],
    bg: ["#78350f", "#92400e", "#b45309", "#854d0e"],
  },
  "blue-yellow-tritan": {
    fg: ["#1d4ed8", "#2563eb", "#1e40af", "#3b82f6"],
    bg: ["#d97706", "#eab308", "#ca8a04", "#b45309"],
  },
  "blue-yellow-tritan-alt": {
    fg: ["#0284c7", "#0369a1", "#0891b2", "#0ea5e9"],
    bg: ["#eab308", "#f59e0b", "#d97706", "#ca8a04"],
  },
};

// Select appropriate palette with visual variety
function getPaletteForPlate(plate, plateIndex = 0) {
  const cat = plate.category;
  if (cat === "control") {
    return plateIndex % 2 === 0 ? palettes["control"] : palettes["control-navy"];
  }
  if (cat === "red-green-protan") {
    return plateIndex % 2 === 0 ? palettes["red-green-protan"] : palettes["red-green-protan-alt"];
  }
  if (cat === "red-green-deutan") {
    return plateIndex % 2 === 0 ? palettes["red-green-deutan"] : palettes["red-green-deutan-alt"];
  }
  if (cat === "blue-yellow-tritan") {
    return plateIndex % 2 === 0 ? palettes["blue-yellow-tritan"] : palettes["blue-yellow-tritan-alt"];
  }
  return palettes["control"];
}

// Generate the complete high-clarity SVG for any given plate
function generatePlateSvg(plate, plateIndex = 0) {
  const cx = 140;
  const cy = 140;
  const maxRadius = 126;
  const spacing = 8.8;
  const rowHeight = spacing * (Math.sqrt(3) / 2);
  const palette = getPaletteForPlate(plate, plateIndex);
  const fgColors = palette.fg;
  const bgColors = palette.bg;

  const dots = [];
  let dotCount = 0;
  let rowIndex = 0;

  for (let y = cy - maxRadius; y <= cy + maxRadius; y += rowHeight) {
    rowIndex++;
    const xOffset = rowIndex % 2 === 1 ? 0 : spacing / 2;
    for (let x = cx - maxRadius - spacing; x <= cx + maxRadius + spacing; x += spacing) {
      dotCount++;
      // Controlled, non-overlapping organic jitter (+/- 1.1px)
      const jitterX = (((dotCount * 7) % 11) - 5) * 0.22;
      const jitterY = (((dotCount * 13) % 11) - 5) * 0.22;
      const posX = x + xOffset + jitterX;
      const posY = y + jitterY;

      const dist = Math.hypot(posX - cx, posY - cy);
      if (dist <= maxRadius) {
        const inGlyph = isPointInGlyph(posX, posY, plate.correctAnswer, cx, cy);
        const colorPalette = inGlyph ? fgColors : bgColors;
        const color = colorPalette[dotCount % colorPalette.length];

        // Controlled natural radius (foreground dots slightly bolder for maximum recognizability)
        const baseR = inGlyph ? 4.3 : 3.8;
        const rVariance = ((dotCount * 17) % 5) * 0.2;
        const r = (baseR + rVariance).toFixed(2);

        dots.push(
          `<circle cx="${posX.toFixed(2)}" cy="${posY.toFixed(2)}" r="${r}" fill="${color}" stroke="rgba(255,255,255,0.4)" stroke-width="0.75"/>`
        );
      }
    }
  }

  return `<svg viewBox="0 0 280 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Color Vision Screening Plate ${plate.id} (${plate.correctAnswer})">
  <circle cx="140" cy="140" r="134" fill="#fafafa"/>
  ${dots.join("\n  ")}
</svg>`;
}

module.exports = {
  generatePlateSvg,
  outputDir,
  isPointInGlyph,
};
