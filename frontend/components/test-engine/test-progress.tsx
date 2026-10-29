import * as React from "react";
import { ProgressInfo } from "@/types/test-engine";
import { Button } from "@/components/ui/button";

export interface TestProgressProps {
  progress: ProgressInfo;
  onCancelRequest: () => void;
  className?: string;
}

export function TestProgress({
  progress,
  onCancelRequest,
  className = "",
}: TestProgressProps) {
  return (
    <div className={`w-full space-y-2.5 ${className}`.trim()}>
      <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900 dark:text-white text-sm">
            Question {progress.currentStepDisplay} of {progress.totalItems}
          </span>
          <span className="text-slate-300 dark:text-slate-600">&bull;</span>
          <span className="text-teal-700 dark:text-cyan-400 font-semibold">
            {progress.answeredCount} answered
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onCancelRequest}
          className="text-xs text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-800/60 py-1 px-2.5 h-auto rounded-lg"
          aria-label="Exit or cancel this screening session"
        >
          Exit Test
        </Button>
      </div>

      {/* Accessible progress bar with neon cyan/teal glow */}
      <div
        role="progressbar"
        aria-valuenow={progress.percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={`Question ${progress.currentStepDisplay} of ${progress.totalItems}, ${progress.percentage}% answered`}
        className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-900 overflow-hidden border border-slate-300 dark:border-slate-800"
      >
        <div
          className="h-full bg-gradient-to-r from-teal-600 to-teal-400 dark:from-cyan-500 dark:to-cyan-300 rounded-full transition-all duration-300 motion-reduce:transition-none shadow-sm shadow-teal-500/30 dark:shadow-cyan-400/50"
          style={{ width: `${progress.percentage}%` }}
        />
      </div>
    </div>
  );
}
