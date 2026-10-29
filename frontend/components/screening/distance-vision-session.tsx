"use client";

import * as React from "react";
import { useTestSession } from "@/lib/test-engine/use-test-session";
import {
  SnellenOptotype,
  DistanceVisionStimulusData,
  distanceVisionMetadata,
  distanceVisionItems,
} from "@/lib/tests/distance-vision-data";
import { scoreDistanceVisionDemonstration } from "@/lib/tests/distance-vision-scoring";
import { TestInstructions } from "@/components/test-engine/test-instructions";
import { TestSessionShell } from "@/components/test-engine/test-session-shell";
import { TestCancelDialog } from "@/components/test-engine/test-cancel-dialog";
import { DistanceVisionStimulus } from "./distance-vision-stimulus";
import { DistanceVisionCompletion } from "./distance-vision-completion";

export function DistanceVisionSession() {
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
  } = useTestSession<SnellenOptotype>({
    metadata: distanceVisionMetadata,
    items: distanceVisionItems,
    autoStart: false,
  });

  const stimulusData = currentItem?.stimulusData as DistanceVisionStimulusData | undefined;
  const summary = React.useMemo(() => {
    return scoreDistanceVisionDemonstration(result);
  }, [result]);

  return (
    <div className="w-full">
      {/* State 1: Pre-test Instructions View */}
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
            title="Distance Vision Screening (Demo)"
            progress={progress}
            allowPrevious={metadata?.allowPrevious}
            requireAnswerToAdvance={metadata?.requireAnswerToAdvance}
            onCancelRequest={openCancelModal}
            onPrevious={previousItem}
            onNext={nextItem}
            onComplete={completeSession}
          >
            {/* High-Contrast Optotype Stimulus */}
            {stimulusData && (
              <DistanceVisionStimulus
                stimulusData={stimulusData}
                stepNumber={progress.currentStepDisplay}
              />
            )}

            {/* Prompt and Letter Choice Selection */}
            <div className="space-y-4 pt-2">
              <div className="text-center">
                <span className="text-xs text-slate-400 font-medium">
                  Step {progress.currentStepDisplay} of {progress.totalItems}
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  What letter optotype is shown on the chart above?
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Select the letter that matches what you see, or choose &quot;I cannot tell&quot;.
                </p>
              </div>

              {/* Radio Group Selection Grid */}
              {currentItem.options && (
                <div
                  role="radiogroup"
                  aria-label="Distance vision optotype choices"
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
                        className={`p-3 rounded-xl border text-center transition-all duration-150 flex flex-col items-center justify-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                          isCannotTell ? "col-span-2 sm:col-span-4" : ""
                        } ${
                          isSelected
                            ? "bg-cyan-950/80 border-cyan-400 text-cyan-200 font-bold shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400"
                            : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/80 font-medium"
                        }`}
                      >
                        <span className={`text-sm ${isCannotTell ? "font-medium" : "font-mono font-bold text-base"}`}>
                          {option.label}
                        </span>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
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
        <DistanceVisionCompletion summary={summary} onReset={resetSession} />
      )}
    </div>
  );
}
