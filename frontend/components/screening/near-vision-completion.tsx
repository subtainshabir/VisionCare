"use client";

import * as React from "react";
import { NearVisionSummary } from "@/lib/tests/near-vision-scoring";
import { ScreeningResultsSummary } from "./screening-results-summary";
import { CheckCircleIcon, EyeIcon } from "@/components/ui/icons";

export interface NearVisionCompletionProps {
  summary: NearVisionSummary;
  onReset: () => void;
}

export function NearVisionCompletion({
  summary,
  onReset,
}: NearVisionCompletionProps) {
  const isCancelled = summary.status === "cancelled";

  return (
    <ScreeningResultsSummary
      testId="near-vision"
      testTitle="Rosenbaum Near Vision Reading Demonstration"
      status={summary.status}
      totalItems={summary.totalCharacters}
      answeredCount={summary.totalCharacters}
      matchedCount={summary.matchedCount}
      matchPercentage={summary.matchPercentage}
      unclearCount={summary.cannotReadCount}
      summaryNote={summary.summaryNote}
      calibrationDisclaimer={summary.calibrationDisclaimer}
      onReset={onReset}
      backHref="/tests"
    >
      {!isCancelled && (
        <div className="space-y-6">
          {/* Smallest Successfully Read Line Highlight Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-teal-50/80 dark:bg-teal-950/40 border-2 border-teal-500/50 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 flex items-center gap-1.5">
                <CheckCircleIcon size={16} className="text-teal-600 dark:text-teal-400" />
                <span>Smallest Successfully Read Line</span>
              </span>
              <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-300">
                {summary.smallestPassedFraction ? `${summary.smallestPassedFraction} \u2022 ${summary.smallestPassedJaeger}` : "None Passed"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-teal-200 dark:border-teal-800/60">
              <div>
                <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white block">
                  {summary.smallestPassedLineText}
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Passed {summary.linesPassedCount} of {summary.totalItems} Rosenbaum lines &bull; {summary.matchedCount} of {summary.totalCharacters} total numbers correct ({summary.matchPercentage}%)
                </p>
              </div>

              <div className="text-left sm:text-right text-[11px] text-slate-500 dark:text-slate-400">
                <span>Clinical rule: &gt;50% correct digits per line</span>
              </div>
            </div>
          </div>

          {/* Line-by-Line Rosenbaum Breakdown */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <EyeIcon size={14} className="text-teal-600 dark:text-teal-400" />
                <span>Rosenbaum Line-by-Line Breakdown</span>
              </h3>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                {summary.chartName || "8 Standardized Lines (37 Optotype Digits)"}
              </span>
            </div>

            <div className="space-y-2">
              {summary.lineEvaluations.map((line) => (
                <div
                  key={line.lineNumber}
                  className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs transition-colors ${
                    line.isLinePassed
                      ? "border-teal-200 dark:border-teal-900/60 bg-teal-50/40 dark:bg-teal-950/20"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">
                        Line {line.lineNumber} ({line.distanceEquivalent} &bull; {line.jaegerEquivalent})
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        Target: <strong className="text-teal-700 dark:text-teal-300 font-bold tracking-widest">{line.expectedDigits}</strong>
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 dark:text-slate-400">
                      <span>Entered: </span>
                      <strong className="font-mono text-slate-800 dark:text-slate-200 tracking-wider">
                        {line.cannotReadDeclared
                          ? "Marked Unreadable"
                          : line.sanitizedResponse || "No entry"}
                      </strong>
                      <span className="mx-1.5 text-slate-300 dark:text-slate-700">|</span>
                      <span>Accuracy: </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {line.correctDigitCount} of {line.totalDigitsInLine} correct (min. {line.minPassThreshold})
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border shrink-0 self-start sm:self-center ${
                      line.isLinePassed
                        ? "bg-teal-50 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800/80"
                        : line.cannotReadDeclared
                          ? "bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/80"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {line.isLinePassed
                      ? "Line Passed"
                      : line.cannotReadDeclared
                        ? "Marked Unreadable"
                        : "Below Threshold"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Near Vision Screening Responsible-Use Advisory */}
          <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 text-xs space-y-1.5">
            <span className="font-bold block">
              Important Clinical Limitations &amp; Non-Diagnostic Notice
            </span>
            <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
              This digital Rosenbaum screener demonstrates close-reading character legibility at an estimated 14-inch (35 cm) distance. It does <strong>not</strong> provide a medical diagnosis of presbyopia, hyperopia, or astigmatism, nor does it determine an optical prescription. Display resolution, subpixel rendering, viewing distance variations, and ambient lighting directly influence perceived optotype size. For accurate clinical refraction, please consult an eye-care professional.
            </p>
          </div>
        </div>
      )}
    </ScreeningResultsSummary>
  );
}
