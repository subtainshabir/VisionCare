import * as React from "react";
import Link from "next/link";
import { TestMetadata } from "@/types/test-engine";
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
import { ClockIcon, ArrowRightIcon, InfoIcon } from "@/components/ui/icons";

export interface TestInstructionsProps {
  metadata: TestMetadata;
  totalItems: number;
  onStart: () => void;
  backHref?: string;
}

export function TestInstructions({
  metadata,
  totalItems,
  onStart,
  backHref = "/tests",
}: TestInstructionsProps) {
  return (
    <Card className="max-w-2xl mx-auto shadow-2xl border-slate-800/80 bg-[#0F172A]/95">
      <CardHeader>
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant="primary">{metadata.category}</Badge>
          {metadata.estimatedDurationMinutes && (
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-300 font-medium bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800">
              <ClockIcon size={14} className="text-cyan-400" />
              <span>~{metadata.estimatedDurationMinutes} min</span>
            </span>
          )}
        </div>
        <CardTitle className="text-2xl sm:text-3xl font-extrabold text-white">
          {metadata.title}
        </CardTitle>
        <CardDescription className="text-sm sm:text-base text-slate-400 mt-2 leading-relaxed">
          {metadata.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-2">
        {/* Test Specifications Metrics Pill */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
          <div>
            <span className="text-slate-500 block font-normal">Questions</span>
            <span className="font-bold text-white text-sm">{totalItems} items</span>
          </div>
          <div>
            <span className="text-slate-500 block font-normal">Navigation</span>
            <span className="font-bold text-white text-sm">
              {metadata.allowPrevious ? "Forward & Back" : "Forward only"}
            </span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-slate-500 block font-normal">Privacy</span>
            <span className="font-bold text-cyan-400 text-sm">In-memory only</span>
          </div>
        </div>

        {/* Instructions List */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-2">
            <InfoIcon size={16} className="text-cyan-400" />
            <span>Viewing &amp; Setup Instructions</span>
          </h3>
          <ol className="space-y-2.5">
            {metadata.instructions.map((step, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs sm:text-sm text-slate-200 leading-relaxed"
              >
                <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Safety Note */}
        <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-xs text-amber-200 leading-relaxed">
          <strong>Comfort Notice:</strong> Stop the demonstration immediately if you experience eyestrain, headache, or visual fatigue.
        </div>
      </CardContent>

      <CardFooter className="pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <Link href={backHref} className="w-full sm:w-auto">
          <Button variant="outline" size="md" className="w-full">
            Cancel &amp; Return
          </Button>
        </Link>
        <Button
          variant="primary"
          size="md"
          onClick={onStart}
          className="w-full sm:w-auto shadow-md shadow-cyan-500/25 font-bold gap-2"
        >
          <span>Begin Screening Session</span>
          <ArrowRightIcon size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
}
