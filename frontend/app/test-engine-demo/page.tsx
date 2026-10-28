"use client";

import * as React from "react";
import { PageContainer } from "@/components/ui/page-container";
import { Badge } from "@/components/ui/badge";
import { TestMetadata, TestItem } from "@/types/test-engine";
import { useTestSession } from "@/lib/test-engine/use-test-session";
import { TestInstructions } from "@/components/test-engine/test-instructions";
import { TestSessionShell } from "@/components/test-engine/test-session-shell";
import { TestCancelDialog } from "@/components/test-engine/test-cancel-dialog";
import { TestCompletion } from "@/components/test-engine/test-completion";

const demoMetadata: TestMetadata = {
  id: "engine-verification-demo",
  title: "Test Engine Verification Demo",
  category: "Architecture Verification",
  description:
    "An isolated development demonstration designed to verify the shared test engine's state transitions, navigation boundaries, response tracking, and lifecycle states.",
  estimatedDurationMinutes: 2,
  allowPrevious: true,
  requireAnswerToAdvance: true,
  instructions: [
    "This is an engine verification tool demonstrating generic item response capture.",
    "For each item, select one of the available mock response options.",
    "Use 'Previous' and 'Next' navigation controls to move between test items.",
    "Click 'Exit Test' to verify the cancellation modal and state transition.",
    "On the final item, click 'Complete Screening' to verify result aggregation.",
  ],
};

const demoItems: Array<TestItem<string>> = [
  {
    id: "demo-item-01",
    title: "Directional Target Orientation",
    prompt: "Select the mock directional orientation shown below:",
    hint: "Simulates an E-optotype orientation response pattern.",
    options: [
      { value: "UP", label: "Upward Orientation", shortcut: "1" },
      { value: "RIGHT", label: "Rightward Orientation", shortcut: "2" },
      { value: "DOWN", label: "Downward Orientation", shortcut: "3" },
      { value: "LEFT", label: "Leftward Orientation", shortcut: "4" },
    ],
  },
  {
    id: "demo-item-02",
    title: "Contrast Perception Step",
    prompt: "Select which contrast sensitivity threshold step is clearly distinguishable:",
    hint: "Simulates graded contrast discrimination responses.",
    options: [
      { value: "HIGH", label: "High Contrast (100%)", shortcut: "A" },
      { value: "MEDIUM", label: "Medium Contrast (50%)", shortcut: "B" },
      { value: "LOW", label: "Low Contrast (25%)", shortcut: "C" },
      { value: "NONE", label: "Not Clearly Distinguishable", shortcut: "D" },
    ],
  },
  {
    id: "demo-item-03",
    title: "Mock Chromatic Discrimination",
    prompt: "Select the chromatic sample indicator:",
    hint: "Simulates pseudoisochromatic plate selection options.",
    options: [
      { value: "CHROMATIC_A", label: "Sample Option A (Deep Teal)", shortcut: "A" },
      { value: "CHROMATIC_B", label: "Sample Option B (Mint Accent)", shortcut: "B" },
      { value: "CHROMATIC_C", label: "Sample Option C (Slate Neutral)", shortcut: "C" },
      { value: "UNSURE", label: "Uncertain / Unclear", shortcut: "D" },
    ],
  },
  {
    id: "demo-item-04",
    title: "Lifecycle Boundary Verification",
    prompt: "Final verification item — choose your demonstration completion preference:",
    hint: "Verifies the transition to the explicit completed session state.",
    options: [
      { value: "COMPLETE_NOW", label: "Confirm ready to complete session", shortcut: "1" },
      { value: "REVIEW_ANSWERS", label: "Flag for answer review before completion", shortcut: "2" },
    ],
  },
];

export default function TestEngineDemoPage() {
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
    metadata: demoMetadata,
    items: demoItems,
    autoStart: false,
  });

  return (
    <main className="flex-1 py-10 sm:py-16">
      <PageContainer maxWidth="xl">
        {/* Development Demonstration Header Banner */}
        <div className="mb-8 p-4 rounded-xl border border-amber-200 bg-amber-50/70 text-amber-900 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" aria-hidden="true" />
            <span className="font-semibold">Development Demonstration Route:</span>
            <span>Shared test engine lifecycle verification. Not a medical vision test.</span>
          </div>
          <Badge variant="warning" className="shrink-0 text-[11px]">
            Engine Phase 4 Only
          </Badge>
        </div>

        {/* State 1: Instructions view */}
        {status === "instructions" && metadata && (
          <TestInstructions
            metadata={metadata}
            totalItems={items.length}
            onStart={startSession}
            backHref="/tests"
          />
        )}

        {/* State 2: In-progress session view */}
        {status === "in_progress" && currentItem && (
          <>
            <TestSessionShell
              title={metadata?.title ?? "Screening Session"}
              progress={progress}
              allowPrevious={metadata?.allowPrevious}
              requireAnswerToAdvance={metadata?.requireAnswerToAdvance}
              onCancelRequest={openCancelModal}
              onPrevious={previousItem}
              onNext={nextItem}
              onComplete={completeSession}
            >
              {/* Stimulus & Question Display */}
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-slate-400 font-medium">
                    Item ID: {currentItem.id}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                    {currentItem.title}
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
                    {currentItem.prompt}
                  </p>
                </div>

                {currentItem.hint && (
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-500">
                    <strong className="font-semibold text-slate-700">Developer Note: </strong>
                    {currentItem.hint}
                  </div>
                )}

                {/* Multiple choice response options */}
                {currentItem.options && (
                  <div
                    role="radiogroup"
                    aria-label={currentItem.prompt}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2"
                  >
                    {currentItem.options.map((option) => {
                      const isSelected = currentResponse === option.value;
                      return (
                        <button
                          key={String(option.value)}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => recordResponse(option.value)}
                          className={`p-4 rounded-xl border text-left transition-all duration-150 flex items-start justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 ${
                            isSelected
                              ? "bg-teal-50/80 border-teal-600 text-teal-950 shadow-xs"
                              : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/50"
                          }`}
                        >
                          <div>
                            <span className="text-sm font-semibold block">
                              {option.label}
                            </span>
                            {option.description && (
                              <span className="text-xs text-slate-500 mt-1 block">
                                {option.description}
                              </span>
                            )}
                          </div>

                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                              isSelected
                                ? "border-teal-700 bg-teal-700 text-white"
                                : "border-slate-300 bg-white"
                            }`}
                          >
                            {isSelected && (
                              <span className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </TestSessionShell>

            {/* Cancel confirmation dialog */}
            <TestCancelDialog
              isOpen={isCancelModalOpen}
              onClose={closeCancelModal}
              onConfirm={confirmCancel}
            />
          </>
        )}

        {/* State 3: Completed or Cancelled view */}
        {(status === "completed" || status === "cancelled") && (
          <TestCompletion
            result={result}
            onReset={resetSession}
            dashboardHref="/tests"
          />
        )}
      </PageContainer>
    </main>
  );
}
