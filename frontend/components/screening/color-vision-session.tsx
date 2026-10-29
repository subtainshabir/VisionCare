"use client";

import * as React from "react";
import { useTestSession } from "@/lib/test-engine/use-test-session";
import {
  GeometricShape,
  ColorVisionStimulusData,
  colorVisionMetadata,
  colorVisionItems,
} from "@/lib/tests/color-vision-data";
import { scoreColorVisionDemonstration } from "@/lib/tests/color-vision-scoring";
import { TestInstructions } from "@/components/test-engine/test-instructions";
import { TestSessionShell } from "@/components/test-engine/test-session-shell";
import { TestCancelDialog } from "@/components/test-engine/test-cancel-dialog";
import { ColorVisionStimulus } from "./color-vision-stimulus";
import { ColorVisionCompletion } from "./color-vision-completion";

export function ColorVisionSession() {
  const {
    status,
    metadata,
    items,
    currentItem,
    currentResponse,
    progress,
    result,
    isCancelModalOpen,
    startSession,
    recordResponse,
    nextItem,
    previousItem,
    openCancelModal,
    closeCancelModal,
    confirmCancel,
    completeSession,
    resetSession,
  } = useTestSession<GeometricShape>({
    metadata: colorVisionMetadata,
    items: colorVisionItems,
    autoStart: false,
  });

  const stimulusData = currentItem?.stimulusData as ColorVisionStimulusData | undefined;
  const summary = React.useMemo(() => {
    return scoreColorVisionDemonstration(result);
  }, [result]);

  return (
    <div className="w-full">
      {/* State 1: Instructions View */}
      {status === "instructions" && metadata && (
        <TestInstructions
          metadata={metadata}
          totalItems={items.length}
          onStart={startSession}
          backHref="/tests"
        />
      )}

      {/* State 2: Active Screening Session */}
      {status === "in_progress" && currentItem && (
        <>
          <TestSessionShell
            title="Color Vision Screening (Demo)"
            progress={progress}
            allowPrevious={metadata?.allowPrevious}
            requireAnswerToAdvance={metadata?.requireAnswerToAdvance}
            onCancelRequest={openCancelModal}
            onPrevious={previousItem}
            onNext={nextItem}
            onComplete={completeSession}
          >
            {/* Stimulus Presentation */}
            {stimulusData && (
              <ColorVisionStimulus
                stimulusData={stimulusData}
                itemNumber={progress.currentStepDisplay}
              />
            )}

            {/* Prompt and Shape Selection Options */}
            <div className="space-y-4 pt-2">
              <div className="text-center">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Item {progress.currentStepDisplay} of {progress.totalItems}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  What shape do you see in the circular pattern above?
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Select the choice that best matches your visual perception.
                </p>
              </div>

              {/* Radio Group Selection Grid */}
              {currentItem.options && (
                <div
                  role="radiogroup"
                  aria-label="Color vision demonstration answer choices"
                  className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2"
                >
                  {currentItem.options.map((option) => {
                    const isSelected = currentResponse === option.value;
                    const isCannotTell = option.value === "CANNOT_TELL";

                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => recordResponse(option.value)}
                        className={`p-3 min-h-[48px] rounded-xl border text-center transition-all duration-150 flex flex-col items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                          isCannotTell ? "col-span-2 sm:col-span-4" : ""
                        } ${
                          isSelected
                            ? "bg-teal-50 dark:bg-teal-950/80 border-teal-600 dark:border-teal-400 text-teal-900 dark:text-teal-200 font-bold shadow-sm ring-1 ring-teal-600 dark:ring-teal-400"
                            : "bg-white dark:bg-slate-900/80 border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-300 hover:border-teal-500 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80 font-medium"
                        }`}
                      >
                        <span className="text-xs sm:text-sm">
                          {option.label}
                        </span>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </TestSessionShell>

          {/* Cancellation Confirmation Dialog */}
          <TestCancelDialog
            isOpen={isCancelModalOpen}
            onClose={closeCancelModal}
            onConfirm={confirmCancel}
          />
        </>
      )}

      {/* State 3: Completion or Cancellation View */}
      {(status === "completed" || status === "cancelled") && (
        <ColorVisionCompletion summary={summary} onReset={resetSession} />
      )}
    </div>
  );
}
