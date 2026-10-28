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
    <Card className="max-w-2xl mx-auto shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant="primary">{metadata.category}</Badge>
          {metadata.estimatedDurationMinutes && (
            <span className="text-xs text-slate-500 font-medium">
              ~{metadata.estimatedDurationMinutes} min
            </span>
          )}
        </div>
        <CardTitle className="text-2xl sm:text-3xl font-bold">
          {metadata.title}
        </CardTitle>
        <CardDescription className="text-base text-slate-600 mt-2">
          {metadata.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-4">
        {/* Test specifications pill */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
          <div>
            <span className="text-slate-400 block font-normal">Questions:</span>
            <span className="font-semibold text-slate-800">{totalItems} items</span>
          </div>
          <div>
            <span className="text-slate-400 block font-normal">Navigation:</span>
            <span className="font-semibold text-slate-800">
              {metadata.allowPrevious ? "Forward & Back" : "Forward only"}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-normal">Storage:</span>
            <span className="font-semibold text-slate-800">In-memory session</span>
          </div>
        </div>

        {/* Instructions list */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-800 mb-3">
            Pre-Test Instructions
          </h3>
          <ol className="space-y-3">
            {metadata.instructions.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-teal-100/70 border border-teal-200 text-teal-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </CardContent>

      <CardFooter className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <Link href={backHref} className="w-full sm:w-auto">
          <Button variant="outline" size="md" className="w-full">
            Cancel &amp; Return
          </Button>
        </Link>
        <Button
          variant="primary"
          size="md"
          onClick={onStart}
          className="w-full sm:w-auto shadow-sm"
        >
          Begin Screening Session &rarr;
        </Button>
      </CardFooter>
    </Card>
  );
}
