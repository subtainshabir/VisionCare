import * as React from "react";
import { NearVisionStimulusData } from "@/lib/tests/near-vision-data";
import { Badge } from "@/components/ui/badge";

export interface NearVisionStimulusProps {
  stimulusData: NearVisionStimulusData;
  stepNumber: number;
}

export function NearVisionStimulus({
  stimulusData,
  stepNumber,
}: NearVisionStimulusProps) {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Stimulus Context & Scale Indicator */}
      <div className="w-full max-w-xl flex items-center justify-between gap-2 mb-3 px-1 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5 font-medium">
          <Badge variant="primary" className="text-[11px] py-0 px-2">
            Step {stepNumber}
          </Badge>
          <span className="text-slate-700 dark:text-slate-300">{stimulusData.stepLabel}</span>
        </div>
        <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
          Scale: ~{stimulusData.approximatePixelHeight}px
        </span>
      </div>

      {/* Clean, High-Contrast Reading Area */}
      <div
        className="w-full max-w-xl rounded-2xl bg-white border-2 border-slate-200 dark:border-slate-700 shadow-sm p-6 sm:p-10 text-center flex flex-col items-center justify-center min-h-[160px] sm:min-h-[190px] transition-all duration-150"
        role="region"
        aria-label={`Reading passage for step ${stepNumber}`}
      >
        <p
          className={`${stimulusData.fontClass} font-serif tracking-normal leading-relaxed text-slate-900 max-w-md select-none transition-all`}
        >
          &ldquo;{stimulusData.passage}&rdquo;
        </p>

        <p className="mt-4 text-[11px] text-slate-400 font-sans tracking-wide">
          Read comfortably at your normal close distance without leaning inward.
        </p>
      </div>

      {/* Environmental & Display Notice */}
      <div className="mt-3 text-center">
        <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
          Rendered via CSS font scaling; physical dimensions vary by device screen DPI and browser scaling.
        </span>
      </div>
    </div>
  );
}
