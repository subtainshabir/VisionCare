"use client";

import * as React from "react";
import { useTestSession } from "@/lib/test-engine/use-test-session";
import {
  NearVisionStimulusData,
  nearVisionMetadata,
  nearVisionItems,
} from "@/lib/tests/near-vision-data";
import { scoreNearVisionDemonstration } from "@/lib/tests/near-vision-scoring";
import { TestInstructions } from "@/components/test-engine/test-instructions";
import { TestSessionShell } from "@/components/test-engine/test-session-shell";
import { TestCancelDialog } from "@/components/test-engine/test-cancel-dialog";
import { NearVisionStimulus } from "./near-vision-stimulus";
import { NearVisionCompletion } from "./near-vision-completion";

export function NearVisionSession() {
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
  } = useTestSession<string>({
    metadata: nearVisionMetadata,
    items: nearVisionItems,
    autoStart: false,
  });

  const stimulusData = currentItem?.stimulusData as NearVisionStimulusData | undefined;
  const summary = React.useMemo(() => {
    return scoreNearVisionDemonstration(result);
  }, [result]);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (currentResponse && currentResponse.trim().length > 0) {
        if (progress.isLast) {
          completeSession();
        } else {
          nextItem();
        }
      }
    }
  };

  const isCannotRead = currentResponse === "CANNOT_READ";
  const textInputValue = isCannotRead ? "" : (currentResponse ?? "");

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
            title="Near Vision Reading Demonstration"
            progress={progress}
            allowPrevious={metadata?.allowPrevious}
            requireAnswerToAdvance={metadata?.requireAnswerToAdvance}
            onCancelRequest={openCancelModal}
            onPrevious={previousItem}
            onNext={nextItem}
            onComplete={completeSession}
          >
            {/* Graded Typographic Stimulus Card */}
            {stimulusData && (
              <NearVisionStimulus
                stimulusData={stimulusData}
                stepNumber={progress.currentStepDisplay}
              />
            )}

            {/* Response Interaction Area */}
            <div className="space-y-5 pt-3 max-w-xl mx-auto w-full">
              <div className="text-center">
                <span className="text-xs text-slate-400 font-medium">
                  Step {progress.currentStepDisplay} of {progress.totalItems}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Which key word appeared in the reading passage above?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Type the word you read, select it from the choices below, or choose &quot;I cannot read this&quot;.
                </p>
              </div>

              {/* Accessible Text Input */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200">
                <label
                  htmlFor="reading-word-input"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Type the word you read:
                </label>
                <div className="relative">
                  <input
                    id="reading-word-input"
                    type="text"
                    value={textInputValue}
                    disabled={isCannotRead}
                    onChange={(e) => recordResponse(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                    placeholder={isCannotRead ? "Marked as unreadable" : "e.g. garden"}
                    autoComplete="off"
                    autoCapitalize="none"
                    spellCheck="false"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-teal-700 transition disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                  />
                  {textInputValue && (
                    <button
                      type="button"
                      onClick={() => recordResponse("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 p-1"
                      aria-label="Clear input"
                    >
                      &times;
                    </button>
                  )}
                </div>
                {isCannotRead && (
                  <p className="text-[11px] text-amber-700 mt-1.5 font-medium">
                    You indicated this text is unreadable at this display size.
                  </p>
                )}
              </div>

              {/* Quick-Select Radio Button Group */}
              {currentItem.options && (
                <div className="space-y-2">
                  <span className="block text-xs font-medium text-slate-500 text-center">
                    Or select from these options:
                  </span>
                  <div
                    role="radiogroup"
                    aria-label="Near vision reading choices"
                    className="grid grid-cols-2 sm:grid-cols-4 gap-2.5"
                  >
                    {currentItem.options.map((option) => {
                      const isOptionCannotRead = option.value === "CANNOT_READ";
                      const isSelected =
                        isOptionCannotRead
                          ? isCannotRead
                          : currentResponse?.toLowerCase().trim() ===
                            option.value.toLowerCase().trim();

                      return (
                        <button
                          key={option.value}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => recordResponse(option.value)}
                          className={`p-3 rounded-xl border text-center transition-all duration-150 flex flex-col items-center justify-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 ${
                            isOptionCannotRead ? "col-span-2 sm:col-span-4" : ""
                          } ${
                            isSelected
                              ? isOptionCannotRead
                                ? "bg-amber-50 border-amber-500 text-amber-950 font-semibold ring-1 ring-amber-500"
                                : "bg-teal-50 border-teal-700 text-teal-950 font-bold shadow-xs ring-1 ring-teal-700"
                              : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 font-medium"
                          }`}
                        >
                          <span
                            className={`text-sm ${
                              isOptionCannotRead ? "font-medium" : "font-serif text-base"
                            }`}
                          >
                            {option.label}
                          </span>
                          {isSelected && (
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isOptionCannotRead ? "bg-amber-600" : "bg-teal-700"
                              }`}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
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
        <NearVisionCompletion summary={summary} onReset={resetSession} />
      )}
    </div>
  );
}
