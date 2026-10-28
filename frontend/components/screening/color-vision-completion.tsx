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
import { ColorVisionSummary } from "@/lib/tests/color-vision-scoring";

export interface ColorVisionCompletionProps {
  summary: ColorVisionSummary;
  onReset: () => void;
}

export function ColorVisionCompletion({
  summary,
  onReset,
}: ColorVisionCompletionProps) {
  const isCancelled = summary.status === "cancelled";

  return (
    <Card className="max-w-2xl mx-auto shadow-sm">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
          {isCancelled ? (
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}
        </div>

        <Badge variant={isCancelled ? "warning" : "primary"} className="mb-2">
          {isCancelled ? "Session Cancelled" : "Demonstration Complete"}
        </Badge>

        <CardTitle className="text-2xl sm:text-3xl font-bold">
          {isCancelled ? "Screening Session Exited" : "Color Vision Demonstration Summary"}
        </CardTitle>

        <CardDescription className="text-sm sm:text-base text-slate-600 mt-2 max-w-lg mx-auto">
          {isCancelled
            ? "You exited the demonstration before completing all items. Responses were not saved."
            : "Review your demonstration response summary below. Please read the technical limitations carefully."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-2">
        {!isCancelled && (
          <>
            {/* Score Summary Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div>
                <span className="text-xs text-slate-400 block font-normal">Answered</span>
                <span className="font-bold text-slate-900 text-base">
                  {summary.answeredCount} of {summary.totalItems}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-normal">Expected Matches</span>
                <span className="font-bold text-teal-900 text-base">
                  {summary.matchedCount} of {summary.totalItems}
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-xs text-slate-400 block font-normal">Agreement Rate</span>
                <span className="font-bold text-slate-900 text-base">
                  {summary.matchPercentage}%
                </span>
              </div>
            </div>

            {/* Item-by-item breakdown */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2.5">
                Item Response Breakdown
              </h3>
              <div className="space-y-2">
                {summary.evaluations.map((item, idx) => (
                  <div
                    key={item.itemId}
                    className="p-3 rounded-lg border border-slate-200/80 bg-white flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-800">
                        Item {idx + 1}: {item.targetPair}
                      </span>
                      <span className="text-slate-500 block text-[11px] mt-0.5">
                        Selected: <strong className="text-slate-700">{item.userResponse ?? "None"}</strong> | Target: <span className="text-slate-500">{item.expectedShape}</span>
                      </span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-medium border shrink-0 ${
                        item.isMatch
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      {item.isMatch ? "Target Matched" : "Different Selection"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Plain-Language Clinical & Technical Advisory */}
            <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/60 space-y-2.5 text-xs text-slate-700 leading-relaxed">
              <div className="flex items-center gap-2 text-teal-900 font-bold">
                <svg className="w-4 h-4 text-teal-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>What This Summary Means</span>
              </div>
              <p>
                This summary only documents response agreement with the geometric demonstration patterns under your current browser conditions. It is <strong>NOT a medical diagnosis</strong>, does not predict color deficiency categories, and does not assess visual acuity.
              </p>
              <p className="text-slate-600">
                <strong>Display Limitations:</strong> {summary.displayLimitationsDisclaimer}
              </p>
            </div>

            {/* Eye Care Consultation Recommendation */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs text-slate-600 leading-relaxed">
              <strong className="text-slate-900 block font-semibold">
                Professional Consultation Advisory
              </strong>
              <p>
                If you experience difficulty distinguishing colors in daily activities, at work, or during signals/driving, schedule a comprehensive visual examination with a licensed optometrist or ophthalmologist for validated diagnostic testing (such as the Farnsworth D-15 or Richmond HRR tests).
              </p>
            </div>
          </>
        )}
      </CardContent>

      <CardFooter className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <Button variant="outline" size="md" onClick={onReset} className="w-full sm:w-auto">
          Restart Demonstration
        </Button>
        <Link href="/tests" className="w-full sm:w-auto">
          <Button variant="primary" size="md" className="w-full shadow-xs">
            Return to Tests Dashboard &rarr;
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
