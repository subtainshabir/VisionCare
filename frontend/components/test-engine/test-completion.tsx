import * as React from "react";
import Link from "next/link";
import { TestResult } from "@/types/test-engine";
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

export interface TestCompletionProps<TResponse = unknown> {
  result: TestResult<TResponse> | null;
  onReset: () => void;
  dashboardHref?: string;
}

export function TestCompletion<TResponse = unknown>({
  result,
  onReset,
  dashboardHref = "/tests",
}: TestCompletionProps<TResponse>) {
  const isCancelled = result?.status === "cancelled";

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
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>

        <Badge variant={isCancelled ? "warning" : "success"} className="mb-2">
          {isCancelled ? "Session Cancelled" : "Session Completed"}
        </Badge>

        <CardTitle className="text-2xl sm:text-3xl font-bold">
          {isCancelled ? "Screening Discarded" : "Screening Session Complete"}
        </CardTitle>

        <CardDescription className="text-base text-slate-600 mt-2 max-w-lg mx-auto">
          {isCancelled
            ? "This test session was exited early. Responses were not saved or processed."
            : "All configured test items have been processed by the shared test engine."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-2">
        {/* Session Stats */}
        {result && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <div>
              <span className="text-xs text-slate-400 block font-normal">Test ID</span>
              <span className="font-semibold text-slate-800 text-sm">{result.testId}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-normal">Responses</span>
              <span className="font-semibold text-slate-800 text-sm">
                {result.answeredCount} / {result.totalItems}
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-xs text-slate-400 block font-normal">Lifecycle</span>
              <span className="font-semibold text-slate-800 text-sm capitalize">
                {result.status}
              </span>
            </div>
          </div>
        )}

        <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-200/80 text-xs text-slate-600 leading-relaxed">
          <strong className="font-semibold text-slate-900 block mb-1">
            Engine State Contract Notice:
          </strong>
          This session data is managed in client memory. Clinical test scoring, result persistence, and medical interpretation modules belong to upcoming development phases.
        </div>
      </CardContent>

      <CardFooter className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <Button variant="outline" size="md" onClick={onReset} className="w-full sm:w-auto">
          Restart Session (Reset)
        </Button>
        <Link href={dashboardHref} className="w-full sm:w-auto">
          <Button variant="primary" size="md" className="w-full">
            Return to Tests Dashboard &rarr;
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
