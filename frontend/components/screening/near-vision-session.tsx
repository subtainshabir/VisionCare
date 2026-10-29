"use client";

import * as React from "react";
import { useTestSession } from "@/lib/test-engine/use-test-session";
import {
  NearDisplayCalibration,
  DEFAULT_NEAR_CALIBRATION,
  nearVisionMetadata,
  nearVisionItems,
  rosenbaumChartLines,
} from "@/lib/tests/near-vision-data";
import { scoreNearVisionDemonstration } from "@/lib/tests/near-vision-scoring";
import { TestSessionShell } from "@/components/test-engine/test-session-shell";
import { TestCancelDialog } from "@/components/test-engine/test-cancel-dialog";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EyeIcon, ArrowRightIcon } from "@/components/ui/icons";
import { NearVisionStimulus } from "./near-vision-stimulus";
import { NearVisionCalibration } from "./near-vision-calibration";
import { NearVisionCompletion } from "./near-vision-completion";

const NEAR_CALIBRATION_STORAGE_KEY = "visioncare_near_calibration";

export function NearVisionSession() {
  const [calibration, setCalibration] = React.useState<NearDisplayCalibration>(DEFAULT_NEAR_CALIBRATION);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(NEAR_CALIBRATION_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        requestAnimationFrame(() => {
          setCalibration(parsed);
        });
      }
    } catch {
      // LocalStorage blocked or invalid
    }
  }, []);

  const inputRef = React.useRef<HTMLInputElement>(null);

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
    resetSession,
  } = useTestSession<string>({
    metadata: nearVisionMetadata,
    items: nearVisionItems,
    autoStart: false,
  });

  // Derived input value from test session response
  const isCannotRead = currentResponse === "CANNOT_READ";
  const activeInput = isCannotRead ? "" : (currentResponse ?? "");

  // Auto-focus input when advancing to a new line
  React.useEffect(() => {
    if (status === "in_progress") {
      inputRef.current?.focus();
    }
  }, [currentItem?.id, status]);

  const handleCalibrationChange = (cal: NearDisplayCalibration) => {
    setCalibration(cal);
    try {
      localStorage.setItem(NEAR_CALIBRATION_STORAGE_KEY, JSON.stringify(cal));
    } catch {
      // LocalStorage blocked
    }
  };

  const currentLineNumber = progress.currentStepDisplay || 1;
  const currentLineData = rosenbaumChartLines[currentLineNumber - 1] || rosenbaumChartLines[0];
  const maxDigits = currentLineData.characters.length;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    const trimmed = raw.slice(0, maxDigits);
    recordResponse(trimmed);
  };

  const handleDigitClick = (digit: string) => {
    if (activeInput.length < maxDigits) {
      recordResponse(activeInput + digit);
    }
  };

  const handleBackspace = () => {
    if (activeInput.length > 0) {
      recordResponse(activeInput.slice(0, -1));
    }
  };

  const handleSubmitLine = () => {
    if (activeInput.length > 0) {
      if (progress.isLast) {
        completeSession();
      } else {
        nextItem();
      }
    }
  };

  const handleCannotReadLine = () => {
    recordResponse("CANNOT_READ");
    if (progress.isLast) {
      completeSession();
    } else {
      nextItem();
    }
  };

  const handleFinishEarly = () => {
    recordResponse("CANNOT_READ");
    completeSession();
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (activeInput.length > 0) {
        handleSubmitLine();
      }
    }
  };

  const summary = React.useMemo(() => {
    return scoreNearVisionDemonstration(result);
  }, [result]);

  return (
    <div className="w-full">
      {/* State 1: Short Instructions & Interactive Calibration Setup */}
      {status === "instructions" && metadata && (
        <Card className="max-w-2xl mx-auto shadow-xl border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0F172A]/95 text-slate-900 dark:text-white">
          <CardHeader>
            <div className="flex items-center justify-between gap-2 mb-2">
              <Badge variant="primary">{metadata.category}</Badge>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                ~2 min screening
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 shadow-xs">
                <EyeIcon size={24} className="text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <CardTitle className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  Rosenbaum Near Vision Reading Chart
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Standardized near visual acuity screening with calibrated 14-inch (35 cm) viewing distance.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-2">
            {/* Quick Setup Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">1. Distance</span>
                <span className="text-slate-600 dark:text-slate-400 block">
                  Hold device ~14 in (35 cm) away (elbow to knuckles).
                </span>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">2. Reading Lenses</span>
                <span className="text-slate-600 dark:text-slate-400 block">
                  Wear your usual reading glasses if you use them.
                </span>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">3. Type Numbers</span>
                <span className="text-slate-600 dark:text-slate-400 block">
                  Identify numbers in each highlighted row.
                </span>
              </div>
            </div>

            {/* Calibration Tool */}
            <NearVisionCalibration
              currentCalibration={calibration}
              onCalibrationChange={handleCalibrationChange}
            />
          </CardContent>

          <CardFooter className="pt-5 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span suppressHydrationWarning className="text-xs text-slate-500 dark:text-slate-400">
              Calibrated for: <strong>{calibration.viewingDistanceCm} cm (14 in)</strong> viewing distance
            </span>

            <Button
              variant="primary"
              size="md"
              onClick={startSession}
              className="w-full sm:w-auto shadow-md shadow-teal-500/20 font-bold gap-2"
            >
              <span>Begin Rosenbaum Screening</span>
              <ArrowRightIcon size={16} />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* State 2: Active Guided Rosenbaum Screening Session */}
      {status === "in_progress" && currentItem && (
        <>
          <TestSessionShell
            title="Near Vision Reading Chart (Rosenbaum)"
            progress={progress}
            allowPrevious={metadata?.allowPrevious}
            requireAnswerToAdvance={metadata?.requireAnswerToAdvance}
            onCancelRequest={openCancelModal}
            onPrevious={previousItem}
            onNext={nextItem}
            onComplete={completeSession}
          >
            {/* The Full Rosenbaum Near Acuity Chart with Active Line Highlight */}
            <NearVisionStimulus
              activeLineNumber={currentLineNumber}
              calibration={calibration}
            />

            {/* Line Interaction & Digit Input Area */}
            <div className="space-y-4 pt-3 max-w-xl mx-auto w-full">
              <div className="text-center">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">
                  Line {currentLineNumber} of {rosenbaumChartLines.length} &bull; {currentLineData.distanceEquivalent} ({currentLineData.jaegerEquivalent}) &bull; {maxDigits} {maxDigits === 1 ? "Digit" : "Digits"}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  What numbers are displayed in Line {currentLineNumber}?
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Type the numbers from left to right using your keyboard or keypad.
                </p>
              </div>

              {/* Digit Slots Visual Indicator */}
              <div
                className="flex items-center justify-center gap-2 pt-1"
                aria-hidden="true"
              >
                {Array.from({ length: maxDigits }).map((_, idx) => {
                  const char = activeInput[idx] || "";
                  const isCurrentSlot = idx === activeInput.length;
                  return (
                    <div
                      key={idx}
                      className={`w-10 h-12 rounded-xl border-2 flex items-center justify-center font-mono font-extrabold text-lg select-none transition-all ${
                        char
                          ? "border-teal-500 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 shadow-xs ring-1 ring-teal-400/30"
                          : isCurrentSlot
                            ? "border-teal-400 dark:border-teal-600 bg-white dark:bg-slate-900 text-slate-400 animate-pulse ring-2 ring-teal-400/20"
                            : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-400"
                      }`}
                    >
                      {char || "\u2022"}
                    </div>
                  );
                })}
              </div>

              {/* Accessible Hidden Input for Physical Keyboard / Autofocus */}
              <div className="flex flex-col items-center">
                <label htmlFor="near-digit-input" className="sr-only">
                  Enter numbers for Line {currentLineNumber}
                </label>
                <div className="relative w-full max-w-xs">
                  <input
                    ref={inputRef}
                    id="near-digit-input"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="off"
                    autoFocus
                    value={activeInput}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    placeholder={`Type ${maxDigits} numbers`}
                    maxLength={maxDigits}
                    className="w-full text-center px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-base tracking-widest focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition shadow-xs"
                  />
                  {activeInput.length > 0 && (
                    <button
                      type="button"
                      onClick={() => recordResponse("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
                      aria-label="Clear entry"
                    >
                      &times;
                    </button>
                  )}
                </div>
              </div>

              {/* Quick On-Screen Numpad for Mobile/Touch Accessibility */}
              <div className="pt-1 flex flex-col items-center">
                <div className="grid grid-cols-5 gap-1.5 max-w-xs w-full">
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleDigitClick(num)}
                      disabled={activeInput.length >= maxDigits}
                      className="h-10 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono font-bold text-sm transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {num}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-1.5 max-w-xs w-full">
                  <button
                    type="button"
                    onClick={handleBackspace}
                    disabled={activeInput.length === 0}
                    className="flex-1 py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
                  >
                    Delete &larr;
                  </button>
                  <button
                    type="button"
                    onClick={() => recordResponse("")}
                    disabled={activeInput.length === 0}
                    className="py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Action Buttons: Submit / Cannot Read / Early Finish */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={handleSubmitLine}
                  disabled={activeInput.length === 0}
                  className="w-full sm:w-auto font-bold min-w-[160px]"
                >
                  {progress.isLast ? "Complete Screening" : "Submit Line \u2192"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={handleCannotReadLine}
                  className="w-full sm:w-auto text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-xs font-semibold"
                >
                  Cannot read this line
                </Button>

                {currentLineNumber >= 4 && (
                  <button
                    type="button"
                    onClick={handleFinishEarly}
                    className="text-xs text-slate-500 dark:text-slate-400 hover:underline pt-1 sm:pt-0"
                  >
                    Finish test here
                  </button>
                )}
              </div>
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
