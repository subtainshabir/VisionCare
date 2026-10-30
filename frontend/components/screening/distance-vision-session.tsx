"use client";

import * as React from "react";
import type { TestItem } from "@/types/test-engine";
import { useTestSession } from "@/lib/test-engine/use-test-session";
import {
  DisplayCalibration,
  DEFAULT_CALIBRATION,
  distanceVisionMetadata,
  distanceVisionChartBank,
  createDistanceTestItems,
  selectRandomDistanceChart,
  SnellenChartExample,
} from "@/lib/tests/distance-vision-data";
import { scoreDistanceVisionDemonstration } from "@/lib/tests/distance-vision-scoring";
import { TestSessionShell } from "@/components/test-engine/test-session-shell";
import { TestCancelDialog } from "@/components/test-engine/test-cancel-dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EyeIcon, ArrowRightIcon } from "@/components/ui/icons";
import { DistanceVisionStimulus } from "./distance-vision-stimulus";
import { DistanceVisionCalibration } from "./distance-vision-calibration";
import { DistanceVisionCompletion } from "./distance-vision-completion";

const CALIBRATION_STORAGE_KEY = "visioncare_distance_calibration";

interface DistanceVisionActiveSessionProps {
  chart: SnellenChartExample;
  items: Array<TestItem<string>>;
  calibration: DisplayCalibration;
  onCalibrationChange: (cal: DisplayCalibration) => void;
  onRestart: () => void;
  onStartSession: () => void;
}

function DistanceVisionActiveSession({
  chart,
  items,
  calibration,
  onCalibrationChange,
  onRestart,
  onStartSession,
}: DistanceVisionActiveSessionProps) {
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
  } = useTestSession<string>({
    metadata: distanceVisionMetadata,
    items,
    autoStart: false,
  });

  const handleStart = React.useCallback(() => {
    onStartSession();
    startSession();
  }, [onStartSession, startSession]);

  // Derived input value from test session response
  const isCannotRead = currentResponse === "CANNOT_READ";
  const activeInput = isCannotRead ? "" : currentResponse ?? "";

  // Auto-focus input when advancing to a new row
  React.useEffect(() => {
    if (status === "in_progress") {
      inputRef.current?.focus();
    }
  }, [currentItem?.id, status]);

  const currentRowNumber = progress.currentStepDisplay || 1;
  const currentRowData =
    chart.rows[currentRowNumber - 1] || chart.rows[0];
  const maxLetters = currentRowData.letters.length;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.toUpperCase().replace(/[^A-Z]/g, "");
    const trimmed = raw.slice(0, maxLetters);
    recordResponse(trimmed);
  };

  const handleSubmitRow = () => {
    if (activeInput.length > 0) {
      if (progress.isLast) {
        completeSession();
      } else {
        nextItem();
      }
    }
  };

  const handleCannotReadRow = () => {
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
        handleSubmitRow();
      }
    }
  };

  const summary = React.useMemo(() => {
    return scoreDistanceVisionDemonstration(result, chart);
  }, [result, chart]);

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
                  Snellen Distance Vision Screening
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Guided row-by-row distance screening using standard Snellen optotypes.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-2">
            {/* Quick Setup Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">1. Distance</span>
                <span suppressHydrationWarning className="text-slate-600 dark:text-slate-400 block">
                  Sit {calibration.viewingDistanceMeters}m (~5 ft) away at eye level.
                </span>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">2. Both Eyes</span>
                <span className="text-slate-600 dark:text-slate-400 block">
                  Keep both eyes open in even room lighting.
                </span>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">3. Type Letters</span>
                <span className="text-slate-600 dark:text-slate-400 block">
                  Enter the letters in each highlighted row.
                </span>
              </div>
            </div>

            {/* Calibration Tool */}
            <DistanceVisionCalibration
              currentCalibration={calibration}
              onCalibrationChange={onCalibrationChange}
            />
          </CardContent>

          <CardFooter className="pt-5 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span suppressHydrationWarning className="text-xs text-slate-500 dark:text-slate-400">
              Calibrated for: <strong>{calibration.viewingDistanceMeters}m</strong> viewing distance
            </span>

            <Button
              variant="primary"
              size="md"
              onClick={handleStart}
              className="w-full sm:w-auto shadow-md shadow-teal-500/20 font-bold gap-2"
            >
              <span>Begin Snellen Screening</span>
              <ArrowRightIcon size={16} />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* State 2: Active Guided Snellen Screening Session */}
      {status === "in_progress" && currentItem && (
        <>
          <TestSessionShell
            title="Distance Vision Screening (Snellen Chart)"
            progress={progress}
            allowPrevious={metadata?.allowPrevious}
            requireAnswerToAdvance={metadata?.requireAnswerToAdvance}
            onCancelRequest={openCancelModal}
            onPrevious={previousItem}
            onNext={nextItem}
            onComplete={completeSession}
          >
            {/* The Full Snellen Visual Acuity Chart with Active Row Highlight */}
            <DistanceVisionStimulus
              activeRowNumber={currentRowNumber}
              calibration={calibration}
              chartRows={chart.rows}
              chartName={chart.name}
            />

            {/* Row Interaction & Keyboard Input Area */}
            <div className="space-y-4 pt-3 max-w-xl mx-auto w-full">
              <div className="text-center">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">
                  Row {currentRowNumber} of {chart.rows.length} &bull; {currentRowData.snellenFraction} Line &bull; {maxLetters} {maxLetters === 1 ? "Letter" : "Letters"}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  What letters are displayed in Row {currentRowNumber}?
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Type the letters from left to right using your keyboard.
                </p>
              </div>

              {/* Letter Slots Visual Indicator */}
              <div
                className="flex items-center justify-center gap-2 pt-1"
                aria-hidden="true"
              >
                {Array.from({ length: maxLetters }).map((_, idx) => {
                  const char = activeInput[idx] || "";
                  const isCurrentSlot = idx === activeInput.length;
                  return (
                    <div
                      key={idx}
                      className={`w-10 h-12 rounded-xl border-2 flex items-center justify-center font-mono font-extrabold text-lg select-none transition-all ${
                        char
                          ? "border-teal-600 dark:border-teal-400 bg-teal-50 dark:bg-teal-950/80 text-teal-900 dark:text-teal-200"
                          : isCurrentSlot
                          ? "border-teal-400 dark:border-teal-500 bg-white dark:bg-slate-900 text-slate-400 animate-pulse"
                          : "border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-400"
                      }`}
                    >
                      {char || "_"}
                    </div>
                  );
                })}
              </div>

              {/* Accessible Text Input Field */}
              <div className="space-y-2">
                <div className="relative">
                  <input
                    ref={inputRef}
                    id="snellen-row-input"
                    type="text"
                    value={activeInput}
                    maxLength={maxLetters}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    placeholder={`Type ${maxLetters} letter${maxLetters > 1 ? "s" : ""}`}
                    autoComplete="off"
                    autoCapitalize="characters"
                    spellCheck="false"
                    className="w-full text-center tracking-widest font-mono font-bold text-xl px-4 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 uppercase"
                    aria-label={`Enter the ${maxLetters} letters shown in Row ${currentRowNumber}`}
                  />
                  {activeInput.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        recordResponse("");
                        inputRef.current?.focus();
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 font-bold"
                      aria-label="Clear input"
                    >
                      &times;
                    </button>
                  )}
                </div>

                {/* Row Action Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCannotReadRow}
                    className="w-full sm:w-auto text-xs text-slate-600 dark:text-slate-300"
                  >
                    Cannot read this row
                  </Button>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {currentRowNumber >= 3 && (
                      <button
                        type="button"
                        onClick={handleFinishEarly}
                        className="text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 underline"
                      >
                        Smaller rows unreadable (Finish)
                      </button>
                    )}

                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={handleSubmitRow}
                      disabled={activeInput.length === 0}
                      className="w-full sm:w-auto font-bold gap-1.5 shadow-sm text-xs"
                    >
                      <span>{progress.isLast ? "Submit & Complete" : "Submit Row"}</span>
                      <ArrowRightIcon size={14} />
                    </Button>
                  </div>
                </div>
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

      {/* State 3: Completion Results View */}
      {(status === "completed" || status === "cancelled") && (
        <DistanceVisionCompletion summary={summary} onReset={onRestart} />
      )}
    </div>
  );
}

// PRNG generator that avoids hydration mismatches
function createPrng(seed: number) {
  let state = ((seed + 1) * 1664525 + 1013904223) >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function DistanceVisionSession() {
  const [calibration, setCalibration] = React.useState<DisplayCalibration>(DEFAULT_CALIBRATION);
  const [sessionSeed, setSessionSeed] = React.useState(0);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(CALIBRATION_STORAGE_KEY);
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

  const handleCalibrationChange = React.useCallback((cal: DisplayCalibration) => {
    setCalibration(cal);
    try {
      localStorage.setItem(CALIBRATION_STORAGE_KEY, JSON.stringify(cal));
    } catch {
      // LocalStorage blocked
    }
  }, []);

  // Select a randomized chart example from the 50+ question bank
  const activeChart = React.useMemo(() => {
    const prng = createPrng(sessionSeed);
    return selectRandomDistanceChart(distanceVisionChartBank, prng);
  }, [sessionSeed]);

  const activeItems = React.useMemo(() => {
    return createDistanceTestItems(activeChart.rows, activeChart.id);
  }, [activeChart]);

  // When user clicks Start or Restart, randomize seed on client
  const handleStartSession = React.useCallback(() => {
    setSessionSeed((prev) => (prev === 0 ? Math.floor(Math.random() * 100000) + 1 : prev));
  }, []);

  const handleRestart = React.useCallback(() => {
    setSessionSeed((prev) => prev + 1 + Math.floor(Math.random() * 1000));
  }, []);

  return (
    <DistanceVisionActiveSession
      key={sessionSeed}
      chart={activeChart}
      items={activeItems}
      calibration={calibration}
      onCalibrationChange={handleCalibrationChange}
      onRestart={handleRestart}
      onStartSession={handleStartSession}
    />
  );
}
