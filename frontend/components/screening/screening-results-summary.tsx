import * as React from "react";
import Link from "next/link";
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
import { CheckCircleIcon, RotateCcwIcon, ArrowRightIcon } from "@/components/ui/icons";
import { ScreeningLimitations } from "./screening-limitations";
import { ScreeningGuidance } from "./screening-guidance";

export interface ScreeningResultsSummaryProps {
  testId: "color-vision" | "distance-vision" | "near-vision";
  testTitle: string;
  status: "completed" | "cancelled";
  totalItems: number;
  answeredCount: number;
  matchedCount: number;
  matchPercentage: number;
  unclearCount?: number;
  summaryNote?: string;
  calibrationDisclaimer?: string;
  onReset: () => void;
  backHref?: string;
  children?: React.ReactNode;
}

export function ScreeningResultsSummary({
  testId,
  testTitle,
  status,
  totalItems,
  answeredCount,
  matchedCount,
  matchPercentage,
  unclearCount,
  calibrationDisclaimer,
  onReset,
  backHref = "/tests",
  children,
}: ScreeningResultsSummaryProps) {
  const isCancelled = status === "cancelled";

  return (
    <Card className="max-w-2xl mx-auto shadow-2xl border-slate-800/80 bg-[#0F172A]/95 text-white">
      <CardHeader className="text-center">
        <div className="mx-auto mb-3">
          {isCancelled ? (
            <div className="w-12 h-12 rounded-2xl bg-amber-950/70 border border-amber-800 text-amber-300 flex items-center justify-center mx-auto shadow-md">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/70 border border-cyan-800 text-cyan-400 flex items-center justify-center mx-auto shadow-md shadow-cyan-500/20">
              <CheckCircleIcon size={24} className="text-cyan-400" />
            </div>
          )}
        </div>

        <Badge variant={isCancelled ? "warning" : "primary"} className="mb-2">
          {isCancelled ? "Session Cancelled" : "Demonstration Complete"}
        </Badge>

        <CardTitle className="text-2xl sm:text-3xl font-extrabold text-white">
          {isCancelled ? `${testTitle} Exited` : `${testTitle} Summary`}
        </CardTitle>

        <CardDescription className="text-sm sm:text-base text-slate-400 mt-1.5 max-w-lg mx-auto leading-relaxed">
          {isCancelled
            ? "You exited the demonstration before completing all items. Incomplete responses were not saved."
            : "Review your demonstration response summary below. Please read the technical limitations and guidance carefully."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-2">
        {!isCancelled && (
          <>
            {/* Score Metrics Grid */}
            <div
              className={`grid gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center ${
                unclearCount !== undefined
                  ? "grid-cols-2 sm:grid-cols-4"
                  : "grid-cols-2 sm:grid-cols-3"
              }`}
            >
              <div>
                <span className="text-xs text-slate-500 block font-normal">Answered</span>
                <span className="font-bold text-white text-base">
                  {answeredCount} of {totalItems}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block font-normal">Target Matches</span>
                <span className="font-bold text-cyan-400 text-base">
                  {matchedCount} of {totalItems}
                </span>
              </div>
              {unclearCount !== undefined && (
                <div>
                  <span className="text-xs text-slate-500 block font-normal">Marked Unclear</span>
                  <span className="font-bold text-amber-400 text-base">
                    {unclearCount}
                  </span>
                </div>
              )}
              <div className={unclearCount === undefined ? "col-span-2 sm:col-span-1" : ""}>
                <span className="text-xs text-slate-500 block font-normal">Agreement Rate</span>
                <span className="font-bold text-slate-200 text-base">
                  {matchPercentage}%
                </span>
              </div>
            </div>

            {/* Test-Specific Item Breakdown */}
            {children}

            {/* Test-Specific Screening Limitations */}
            <ScreeningLimitations
              testType={testId}
              customLimitations={calibrationDisclaimer}
            />

            {/* Reusable Responsible Screening Guidance */}
            <ScreeningGuidance testName={testTitle} />
          </>
        )}
      </CardContent>

      <CardFooter className="pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <Button variant="outline" size="md" onClick={onReset} className="w-full sm:w-auto gap-2">
          <RotateCcwIcon size={16} />
          <span>Retake Test</span>
        </Button>
        <Link href={backHref} className="w-full sm:w-auto">
          <Button variant="primary" size="md" className="w-full shadow-md shadow-cyan-500/25 gap-2 font-bold">
            <span>Back to Tests</span>
            <ArrowRightIcon size={16} />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
