import * as React from "react";
import { DistanceVisionSummary } from "@/lib/tests/distance-vision-scoring";
import { ScreeningResultsSummary } from "./screening-results-summary";
import { CheckCircleIcon, EyeIcon } from "@/components/ui/icons";

export interface DistanceVisionCompletionProps {
  summary: DistanceVisionSummary;
  onReset: () => void;
}

export function DistanceVisionCompletion({
  summary,
  onReset,
}: DistanceVisionCompletionProps) {
  const isCancelled = summary.status === "cancelled";

  return (
    <ScreeningResultsSummary
      testId="distance-vision"
      testTitle="Snellen Distance Vision Demonstration"
      status={summary.status}
      totalItems={summary.totalLetters}
      answeredCount={summary.totalLetters}
      matchedCount={summary.matchedCount}
      matchPercentage={summary.matchPercentage}
      summaryNote={summary.summaryNote}
      calibrationDisclaimer={summary.calibrationDisclaimer}
      onReset={onReset}
      backHref="/tests"
    >
      {!isCancelled && (
        <div className="space-y-6">
          {/* Smallest Successfully Identified Line Highlight Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-teal-50/80 dark:bg-teal-950/40 border-2 border-teal-500/50 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 flex items-center gap-1.5">
                <CheckCircleIcon size={16} className="text-teal-600 dark:text-teal-400" />
                <span>Smallest Successfully Read Row</span>
              </span>
              <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-300">
                {summary.smallestPassedFraction || "None Passed"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-teal-200 dark:border-teal-800/60">
              <div>
                <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white block">
                  {summary.smallestPassedRowText}
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Passed {summary.rowsPassedCount} of {summary.totalItems} Snellen rows &bull; {summary.matchedCount} of {summary.totalLetters} total letters correct
                </p>
              </div>

              <div className="text-left sm:text-right text-[11px] text-slate-500 dark:text-slate-400">
                <span>Rule: &gt;50% correct letters per row</span>
              </div>
            </div>
          </div>

          {/* Row-by-Row Snellen Breakdown */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <EyeIcon size={14} className="text-teal-600 dark:text-teal-400" />
                <span>Snellen Row-by-Row Breakdown</span>
              </h3>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                7 Calibrated Rows (1 to 28 Optotypes)
              </span>
            </div>

            <div className="space-y-2">
              {summary.rowEvaluations.map((row) => (
                <div
                  key={row.rowNumber}
                  className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs transition-colors ${
                    row.isRowPassed
                      ? "border-teal-200 dark:border-teal-900/60 bg-teal-50/40 dark:bg-teal-950/20"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">
                        Row {row.rowNumber} ({row.snellenFraction})
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        Target: <strong className="text-teal-700 dark:text-teal-300 font-bold tracking-widest">{row.expectedLetters}</strong>
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 dark:text-slate-400">
                      <span>Entered: </span>
                      <strong className="font-mono text-slate-800 dark:text-slate-200 tracking-wider">
                        {row.cannotReadDeclared
                          ? "Marked Unreadable"
                          : row.sanitizedResponse || "No entry"}
                      </strong>
                      <span className="mx-1.5 text-slate-300 dark:text-slate-700">|</span>
                      <span>
                        {row.correctLetterCount} of {row.totalLettersInRow} letters correct ({Math.round((row.correctLetterCount / row.totalLettersInRow) * 100)}%)
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border shrink-0 self-start sm:self-center ${
                      row.isRowPassed
                        ? "bg-teal-50 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800/80"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {row.isRowPassed ? "Row Passed" : "Row Missed"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Responsible Advisory Notice */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
            <strong>Important Screening Notice:</strong> This demonstration reflects an educational screening estimate under home browser conditions. It does not determine clinical visual acuity, diagnose myopia, hyperopia, or astigmatism, and cannot be used for optical prescriptions. If you experience difficulty reading distant objects or notice changes in your sight, please consult an optometrist or ophthalmologist for a comprehensive eye examination.
          </div>
        </div>
      )}
    </ScreeningResultsSummary>
  );
}
