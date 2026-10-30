"use client";

import * as React from "react";
import {
  snellenChartRows,
  DisplayCalibration,
  calculateRowPixelHeight,
  SnellenRowData,
} from "@/lib/tests/distance-vision-data";
import { SnellenOptotypeGlyph } from "./snellen-optotype";

export interface DistanceVisionStimulusProps {
  activeRowNumber: number;
  calibration: DisplayCalibration;
  className?: string;
  chartRows?: readonly SnellenRowData[];
  chartName?: string;
}

/**
 * High-contrast, mathematically calibrated Snellen visual acuity chart.
 * Renders all 7 classic Snellen rows (1 to 28 optotypes) in a traditional
 * triangular pyramid formation with pure black 5x5 optotypes on an isolated
 * white chart surface.
 */
export function DistanceVisionStimulus({
  activeRowNumber,
  calibration,
  className = "",
  chartRows = snellenChartRows,
  chartName,
}: DistanceVisionStimulusProps) {
  return (
    <div className={`w-full flex flex-col items-center select-none ${className}`.trim()}>
      {/* High-Contrast Snellen Chart Card */}
      <div
        className="w-full max-w-xl bg-white border-2 border-slate-300 dark:border-slate-700 rounded-2xl shadow-md p-4 sm:p-6 text-slate-950 overflow-hidden"
        role="region"
        aria-label="Snellen-Style Distance Vision Chart"
      >
        {/* Chart Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-4 text-[10px] sm:text-xs text-slate-500 font-mono tracking-wider uppercase">
          <span className="truncate max-w-[240px] sm:max-w-xs">{chartName || "VisionCare Snellen Chart"}</span>
          <span className="shrink-0">
            Distance: {calibration.viewingDistanceMeters.toFixed(1)}m |{" "}
            {calibration.isCardCalibrated ? "Calibrated" : "Est. 96 DPI"}
          </span>
        </div>

        {/* 7 Standardized Snellen Chart Rows */}
        <div className="space-y-2 sm:space-y-3">
          {chartRows.map((row) => {
            const isActive = row.rowNumber === activeRowNumber;
            const letterHeightPx = calculateRowPixelHeight(
              row.relativeScale,
              calibration
            );

            // Standard proportional optotype spacing
            const letterGap = Math.max(3, Math.round(letterHeightPx * 0.35));

            return (
              <div
                key={row.rowNumber}
                className={`flex items-center justify-between px-2 sm:px-3 py-1.5 rounded-xl transition-all duration-150 ${
                  isActive
                    ? "bg-teal-50 border-2 border-teal-500 shadow-sm ring-2 ring-teal-400/20"
                    : "border border-transparent hover:bg-slate-50/60"
                }`}
                aria-current={isActive ? "true" : undefined}
              >
                {/* Left Row Indicator */}
                <div className="w-16 sm:w-20 flex items-center gap-1.5 font-mono text-[10px] sm:text-xs shrink-0">
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[10px] ${
                      isActive
                        ? "bg-teal-600 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {row.rowNumber}
                  </span>
                  <span className="text-slate-500 font-medium">
                    {row.snellenFraction}
                  </span>
                </div>

                {/* Center Optotypes Pyramid */}
                <div
                  className="flex-1 flex items-center justify-center text-black"
                  style={{ gap: `${letterGap}px` }}
                >
                  {row.letters.split("").map((char, charIdx) => (
                    <SnellenOptotypeGlyph
                      key={charIdx}
                      letter={char}
                      sizePx={letterHeightPx}
                      className="text-black"
                    />
                  ))}
                </div>

                {/* Right Focus Pointer */}
                <div className="w-16 sm:w-20 text-right font-mono text-[11px] shrink-0">
                  {isActive ? (
                    <span className="inline-flex items-center gap-1 text-teal-700 font-bold bg-teal-100 px-2 py-0.5 rounded-full text-[10px]">
                      <span>Active</span>
                      <span aria-hidden="true">◀</span>
                    </span>
                  ) : (
                    <span className="text-slate-300 text-[10px]">
                      {row.letters.length} opt
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Chart Footer Calibration Scale Reference */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>Contrast: 100% Black on White</span>
          <span>Row 7 = 5 arcminutes subtense (~20/20)</span>
        </div>
      </div>
    </div>
  );
}
