import * as React from "react";
import { ColorVisionSummary } from "@/lib/tests/color-vision-scoring";
import { ScreeningResultsSummary } from "./screening-results-summary";

export interface ColorVisionCompletionProps {
  summary: ColorVisionSummary;
  onReset: () => void;
}

export function ColorVisionCompletion({
  summary,
  onReset,
}: ColorVisionCompletionProps) {
  return (
    <ScreeningResultsSummary
      testId="color-vision"
      testTitle="Color Vision Screening"
      status={summary.status}
      totalItems={summary.totalItems}
      answeredCount={summary.answeredCount}
      matchedCount={summary.matchedCount}
      matchPercentage={summary.matchPercentage}
      summaryNote={summary.summaryNote}
      calibrationDisclaimer={summary.displayLimitationsDisclaimer}
      onReset={onReset}
      backHref="/tests"
    >
      {/* Demonstration Plate Breakdown */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5">
          Screening Plate Breakdown ({summary.matchedCount} of {summary.totalItems} Matched)
        </h3>
        <div className="space-y-2">
          {summary.evaluations.map((item, idx) => (
            <div
              key={item.itemId}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 flex items-center justify-between gap-3 text-xs"
            >
              <div>
                <span className="font-bold text-slate-900 dark:text-white">
                  Plate {idx + 1}: {item.itemTitle}
                </span>
                <span className="text-slate-600 dark:text-slate-400 block text-[11px] mt-0.5">
                  Selected:{" "}
                  <strong className="text-slate-800 dark:text-slate-200">
                    {item.userResponse ?? "None"}
                  </strong>{" "}
                  | Target:{" "}
                  <span className="text-teal-600 dark:text-teal-400 font-semibold">
                    {item.expectedAnswer || item.expectedShape}
                  </span>
                </span>
              </div>

              <span
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border shrink-0 ${
                  item.isMatch
                    ? "bg-teal-50 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800/80"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                }`}
              >
                {item.isMatch ? "Matched Target" : "Different Selection"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </ScreeningResultsSummary>
  );
}
