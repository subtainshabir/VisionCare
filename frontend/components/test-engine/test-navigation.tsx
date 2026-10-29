import * as React from "react";
import { ProgressInfo } from "@/types/test-engine";
import { Button } from "@/components/ui/button";

export interface TestNavigationProps {
  progress: ProgressInfo;
  allowPrevious?: boolean;
  requireAnswerToAdvance?: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onComplete: () => void;
}

export function TestNavigation({
  progress,
  allowPrevious = true,
  requireAnswerToAdvance = false,
  onPrevious,
  onNext,
  onComplete,
}: TestNavigationProps) {
  const isPreviousDisabled = progress.isFirst || !allowPrevious;
  const isAdvanceDisabled = requireAnswerToAdvance && !progress.hasAnsweredCurrent;

  return (
    <div className="flex items-center justify-between gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
      <Button
        variant="outline"
        size="md"
        onClick={onPrevious}
        disabled={isPreviousDisabled}
        aria-label="Go to previous test item"
      >
        &larr; Previous
      </Button>

      {progress.isLast ? (
        <Button
          variant="primary"
          size="md"
          onClick={onComplete}
          disabled={isAdvanceDisabled}
          aria-label="Complete screening test and view summary"
          className="shadow-sm"
        >
          Complete Screening &rarr;
        </Button>
      ) : (
        <Button
          variant="primary"
          size="md"
          onClick={onNext}
          disabled={isAdvanceDisabled}
          aria-label="Go to next test item"
          className="shadow-sm"
        >
          Next Question &rarr;
        </Button>
      )}
    </div>
  );
}
