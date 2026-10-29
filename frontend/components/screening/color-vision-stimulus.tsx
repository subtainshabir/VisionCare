"use client";

import * as React from "react";
import { GeometricShape, ColorVisionStimulusData } from "@/lib/tests/color-vision-data";

export interface ColorVisionStimulusProps {
  stimulusData: ColorVisionStimulusData;
  itemNumber: number;
}

interface MatrixDot {
  id: string;
  cx: number;
  cy: number;
  r: number;
  color: string;
}

// Deterministic check whether point is inside the given shape
function isPointInShape(x: number, y: number, shape: GeometricShape): boolean {
  const cx = 140;
  const cy = 140;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  switch (shape) {
    case "CIRCLE":
      // Annular ring shape
      return dist >= 32 && dist <= 76;

    case "TRIANGLE": {
      // Upward pointing equilateral-style triangle
      // Vertices roughly (140, 65), (75, 195), (205, 195)
      if (y < 65 || y > 195) return false;
      const progress = (y - 65) / 130;
      const halfWidth = progress * 65;
      return x >= cx - halfWidth && x <= cx + halfWidth;
    }

    case "SQUARE":
      // Bounding box centered at 140, 140 with border margin
      return Math.abs(dx) <= 52 && Math.abs(dy) <= 52;

    case "DIAMOND":
      // Manhattan distance diamond
      return Math.abs(dx) + Math.abs(dy) <= 72;

    case "STAR": {
      // 4-pointed optical star
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      return (absX <= 68 && absY <= 18) || (absX <= 18 && absY <= 68) || (dist <= 30);
    }

    case "CROSS":
      // Symmetrical optical cross
      return (Math.abs(dx) <= 20 && Math.abs(dy) <= 72) || (Math.abs(dx) <= 72 && Math.abs(dy) <= 20);

    default:
      return false;
  }
}

// Generate deterministic dot pattern for the stimulus disc
function generateDots(
  shape: GeometricShape,
  fgColors: string[],
  bgColors: string[]
): MatrixDot[] {
  const dots: MatrixDot[] = [];
  const cx = 140;
  const cy = 140;
  const maxRadius = 126;
  const step = 15;

  let counter = 0;
  for (let x = 20; x <= 260; x += step) {
    for (let y = 20; y <= 260; y += step) {
      counter++;
      // Deterministic pseudo-offset
      const jitterX = ((counter * 7) % 7) - 3;
      const jitterY = ((counter * 13) % 7) - 3;
      const posX = x + jitterX;
      const posY = y + jitterY;

      const dist = Math.sqrt((posX - cx) ** 2 + (posY - cy) ** 2);
      if (dist <= maxRadius) {
        const inShape = isPointInShape(posX, posY, shape);
        const colorPalette = inShape ? fgColors : bgColors;
        const color = colorPalette[counter % colorPalette.length];
        // Deterministic dot radius
        const r = 5.2 + ((counter * 11) % 4) * 0.8;

        dots.push({
          id: `dot-${x}-${y}`,
          cx: posX,
          cy: posY,
          r,
          color,
        });
      }
    }
  }

  return dots;
}

export function ColorVisionStimulus({
  stimulusData,
  itemNumber,
}: ColorVisionStimulusProps) {
  const dots = React.useMemo(() => {
    return generateDots(
      stimulusData.shape,
      stimulusData.foregroundColors,
      stimulusData.backgroundColors
    );
  }, [stimulusData]);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Optical Matrix Disc */}
      <div
        className="w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 border-slate-200 dark:border-slate-700 bg-white shadow-md flex items-center justify-center relative overflow-hidden"
        aria-label={`Demonstration pattern for item ${itemNumber}`}
      >
        <svg
          viewBox="0 0 280 280"
          className="w-full h-full"
          role="img"
          aria-hidden="true"
        >
          {/* Subtle background container disc */}
          <circle cx="140" cy="140" r="132" fill="#fafafa" />

          {/* Deterministic matrix dots */}
          {dots.map((dot) => (
            <circle
              key={dot.id}
              cx={dot.cx}
              cy={dot.cy}
              r={dot.r}
              fill={dot.color}
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="0.75"
            />
          ))}
        </svg>
      </div>

      {/* Target Chromatic Pair Notice */}
      <div className="mt-4 text-center">
        <span className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
          Target: {stimulusData.targetPair}
        </span>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 max-w-xs mx-auto">
          Calibrated geometric demonstration pattern. Not a clinical Ishihara plate.
        </p>
      </div>
    </div>
  );
}
