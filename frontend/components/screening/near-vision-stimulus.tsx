"use client";

import * as React from "react";
import {
  rosenbaumChartLines,
  NearDisplayCalibration,
  calculateNearCharacterHeight,
  RosenbaumLineData,
} from "@/lib/tests/near-vision-data";

export interface NearVisionStimulusProps {
  activeLineNumber: number;
  calibration: NearDisplayCalibration;
  className?: string;
  chartLines?: readonly RosenbaumLineData[];
  chartName?: string;
}

/**
 * High-contrast, calibrated Rosenbaum-style near vision reading chart.
 * Renders all 8 standardized Rosenbaum lines (37 optotype digits) with pure black
 * numbers on an isolated, high-contrast white card surface.
 * Highlights the active screening line with focus borders and arrow indicators.
 */
export function NearVisionStimulus({
  activeLineNumber,
  calibration,
  className = "",
  chartLines = rosenbaumChartLines,
  chartName,
}: NearVisionStimulusProps) {
  return (
    <div className={`w-full flex flex-col items-center select-none ${className}`.trim()}>
      {/* High-Contrast Rosenbaum Chart Card */}
      <div
        className="w-full max-w-xl bg-white border-2 border-slate-300 dark:border-slate-700 rounded-2xl shadow-md p-4 sm:p-6 text-slate-950 overflow-hidden"
        role="region"
        aria-label="Rosenbaum-Style Near Vision Reading Chart"
      >
        {/* Chart Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3 text-[10px] sm:text-xs text-slate-500 font-mono tracking-wider uppercase">
          <span className="font-semibold text-slate-700 truncate max-w-[240px] sm:max-w-xs">
            {chartName || "Rosenbaum Near Vision Chart"}
          </span>
          <span className="shrink-0">
            Distance: {calibration.viewingDistanceCm} cm (14 in) |{" "}
            {calibration.isCardCalibrated ? "Calibrated" : "Est. 96 DPI"}
          </span>
        </div>

        {/* 8 Standardized Rosenbaum Lines */}
        <div className="space-y-1.5 sm:space-y-2">
          {chartLines.map((line) => {
            const isActive = line.lineNumber === activeLineNumber;
            const charHeightPx = calculateNearCharacterHeight(
              line.relativeScale,
              calibration
            );

            // Proportional character spacing
            const charGap = Math.max(3, Math.round(charHeightPx * 0.38));

            return (
              <div
                key={line.lineNumber}
                className={`flex items-center justify-between px-2 sm:px-3 py-1.5 rounded-xl transition-all duration-150 ${
                  isActive
                    ? "bg-teal-50 border-2 border-teal-500 shadow-sm ring-2 ring-teal-400/20"
                    : "border border-transparent hover:bg-slate-50/60"
                }`}
                aria-current={isActive ? "true" : undefined}
              >
                {/* Left Line & Notation Indicators */}
                <div className="w-20 sm:w-24 flex items-center gap-1.5 font-mono text-[10px] sm:text-xs shrink-0">
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[10px] ${
                      isActive
                        ? "bg-teal-600 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {line.lineNumber}
                  </span>
                  <span className="text-slate-600 font-medium">
                    {line.distanceEquivalent}
                  </span>
                  <span className="text-slate-400 text-[10px] hidden sm:inline">
                    {line.jaegerEquivalent}
                  </span>
                </div>

                {/* Center Optotype Digits */}
                <div
                  className="flex-1 flex items-center justify-center text-black font-mono font-bold tracking-wider"
                  style={{
                    fontSize: `${charHeightPx}px`,
                    lineHeight: 1.1,
                    gap: `${charGap}px`,
                  }}
                >
                  {line.characters.split("").map((digit, dIdx) => (
                    <span
                      key={dIdx}
                      className="inline-block transition-transform duration-75 text-black"
                      style={{
                        minWidth: `${Math.round(charHeightPx * 0.65)}px`,
                        textAlign: "center",
                      }}
                    >
                      {digit}
                    </span>
                  ))}
                </div>

                {/* Right Focus Pointer */}
                <div className="w-20 sm:w-24 text-right font-mono text-[11px] shrink-0">
                  {isActive ? (
                    <span className="inline-flex items-center gap-1 text-teal-700 font-bold bg-teal-100 px-2 py-0.5 rounded-full text-[10px]">
                      <span>Active</span>
                      <span aria-hidden="true">&#9668;</span>
                    </span>
                  ) : (
                    <span className="text-slate-400 text-[10px]">
                      {line.characters.length} num
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Chart Footer Advisory */}
        <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
          <span>Read with normal reading glasses if used</span>
          <span>Hold device ~14 inches (elbow to knuckles)</span>
        </div>
      </div>
    </div>
  );
}
