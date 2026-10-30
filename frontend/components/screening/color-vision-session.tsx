"use client";

import * as React from "react";
import type { TestItem } from "@/types/test-engine";
import { useTestSession } from "@/lib/test-engine/use-test-session";
import {
  ColorVisionStimulusData,
  colorVisionMetadata,
  colorVisionQuestionBank,
  prepareSessionQuestions,
} from "@/lib/tests/color-vision-data";
import { scoreColorVisionDemonstration } from "@/lib/tests/color-vision-scoring";
import { TestInstructions } from "@/components/test-engine/test-instructions";
import { TestSessionShell } from "@/components/test-engine/test-session-shell";
import { TestCancelDialog } from "@/components/test-engine/test-cancel-dialog";
import { ColorVisionStimulus } from "./color-vision-stimulus";
import { ColorVisionCompletion } from "./color-vision-completion";

interface ActiveSessionProps {
  items: Array<TestItem<string>>;
  onRestart: () => void;
  onStartSession: () => void;
}

function ColorVisionActiveSession({
  items,
  onRestart,
  onStartSession,
}: ActiveSessionProps) {
  const {
    status,
    metadata,
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
  } = useTestSession<string>({
    metadata: colorVisionMetadata,
    items,
    autoStart: false,
  });

  const handleStart = React.useCallback(() => {
    onStartSession();
    startSession();
  }, [onStartSession, startSession]);

  const stimulusData = currentItem?.stimulusData as ColorVisionStimulusData | undefined;
  const summary = React.useMemo(() => {
    return scoreColorVisionDemonstration(result, items);
  }, [result, items]);

  return (
    <div className="w-full">
      {/* State 1: Instructions View */}
      {status === "instructions" && metadata && (
        <TestInstructions
          metadata={metadata}
          totalItems={items.length}
          onStart={handleStart}
          backHref="/tests"
        />
      )}

      {/* State 2: Active Screening Session */}
      {status === "in_progress" && currentItem && (
        <>
          <TestSessionShell
            title="Color Vision Screening"
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

            {/* Prompt and Shuffled Option Choices */}
            <div className="space-y-4 pt-2">
              <div className="text-center">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Plate {progress.currentStepDisplay} of {progress.totalItems}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  What number, shape, or symbol do you see in the circular plate above?
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Select the choice that best matches your visual perception, or select &quot;Nothing / Unclear&quot;.
                </p>
              </div>

              {/* Radio Group Selection Grid with Shuffled Options */}
              {currentItem.options && (
                <div
                  role="radiogroup"
                  aria-label="Color vision demonstration answer choices"
                  className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2"
                >
                  {currentItem.options.map((option) => {
                    const isSelected = currentResponse === option.value;
                    const isUnclear = option.value.toLowerCase().includes("unclear");

                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => recordResponse(option.value)}
                        className={`p-3 min-h-[48px] rounded-xl border text-center transition-all duration-150 flex flex-col items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                          isUnclear ? "col-span-2 sm:col-span-4" : ""
                        } ${
                          isSelected
                            ? "bg-teal-50 dark:bg-teal-950/80 border-teal-600 dark:border-teal-400 text-teal-900 dark:text-teal-200 font-bold shadow-sm ring-1 ring-teal-600 dark:ring-teal-400"
                            : "bg-white dark:bg-slate-900/80 border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-300 hover:border-teal-500 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80 font-medium"
                        }`}
                      >
                        <span className="text-xs sm:text-sm font-semibold">
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
        <ColorVisionCompletion summary={summary} onReset={onRestart} />
      )}
    </div>
  );
}

// PRNG generator that does not trigger Next.js prerender blocker
function createPrng(seed: number) {
  let state = ((seed + 1) * 1664525 + 1013904223) >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function ColorVisionSession() {
  const [sessionSeed, setSessionSeed] = React.useState(0);

  // Generate a fresh randomized set of 5 unique questions from the bank whenever sessionSeed changes
  const activeItems = React.useMemo(() => {
    const prng = createPrng(sessionSeed);
    return prepareSessionQuestions(colorVisionQuestionBank, 5, prng);
  }, [sessionSeed]);

  // When user clicks Start or Restart, randomize seed on client
  const handleStartSession = React.useCallback(() => {
    // If running with initial static seed 0, generate fresh client seed
    setSessionSeed((prev) => (prev === 0 ? Math.floor(Math.random() * 100000) + 1 : prev));
  }, []);

  const handleRestart = React.useCallback(() => {
    setSessionSeed((prev) => prev + 1 + Math.floor(Math.random() * 1000));
  }, []);

  return (
    <ColorVisionActiveSession
      key={sessionSeed}
      items={activeItems}
      onRestart={handleRestart}
      onStartSession={handleStartSession}
    />
  );
}
