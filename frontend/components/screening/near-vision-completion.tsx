import * as React from "react";
import { NearVisionSummary } from "@/lib/tests/near-vision-scoring";
import { ScreeningResultsSummary } from "./screening-results-summary";

export interface NearVisionCompletionProps {
  summary: NearVisionSummary;
  onReset: () => void;
}

export function NearVisionCompletion({
  summary,
  onReset,
}: NearVisionCompletionProps) {
  return (
    <ScreeningResultsSummary
      testId="near-vision"
      testTitle="Near Vision Reading Demonstration"
      status={summary.status}
      totalItems={summary.totalItems}
      answeredCount={summary.answeredCount}
      matchedCount={summary.matchedCount}
      matchPercentage={summary.matchPercentage}
      unclearCount={summary.cannotReadCount}
      summaryNote={summary.summaryNote}
      calibrationDisclaimer={summary.calibrationDisclaimer}
      onReset={onReset}
      backHref="/tests"
    >
      {/* Reading Step Breakdown */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5">
          Reading Step Breakdown
        </h3>
        <div className="space-y-2">
          {summary.evaluations.map((item, idx) => (
            <div
              key={item.itemId}
              className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">
                    Step {idx + 1}: {item.stepLabel}
                  </span>
                </div>
                <p className="text-slate-400 italic mt-0.5 line-clamp-1">
                  &ldquo;{item.passage}&rdquo;
                </p>
                <span className="text-slate-400 block text-[11px] mt-1">
                  Response:{" "}
                  <strong className="text-slate-200 font-mono">
                    {item.cannotReadDeclared ? "Unreadable" : item.userResponse ?? "None"}
                  </strong>{" "}
                  | Expected Target:{" "}
                  <span className="text-cyan-400 font-mono font-semibold">
                    {item.targetWord}
                  </span>
                </span>
              </div>

              <span
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border shrink-0 self-start sm:self-center ${
                  item.isMatch
                    ? "bg-cyan-950/80 text-cyan-300 border-cyan-800/80"
                    : item.cannotReadDeclared
                    ? "bg-amber-950/80 text-amber-300 border-amber-800/80"
                    : "bg-slate-800 text-slate-400 border-slate-700"
                }`}
              >
                {item.isMatch
                  ? "Matched Target"
                  : item.cannotReadDeclared
                  ? "Could Not Read"
                  : "Different Response"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </ScreeningResultsSummary>
  );
}
