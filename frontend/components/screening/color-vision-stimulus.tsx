"use client";

import * as React from "react";
import Image from "next/image";
import { ColorVisionStimulusData } from "@/lib/tests/color-vision-data";

export interface ColorVisionStimulusProps {
  stimulusData: ColorVisionStimulusData;
  itemNumber: number;
}

export function ColorVisionStimulus({
  stimulusData,
  itemNumber,
}: ColorVisionStimulusProps) {
  const [hasError, setHasError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const imageSrc = stimulusData?.image || "/assets/color-vision/plate-001.svg";

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Optical Matrix Disc Container */}
      <div
        className="w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-md flex items-center justify-center relative overflow-hidden transition-all"
        aria-label={`Color vision screening plate ${itemNumber}`}
      >
        {/* Loading Spinner / Placeholder */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50 dark:bg-slate-900 z-10">
            <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Primary Image Asset - keyed by imageSrc to reset loading/error state naturally */}
        {!hasError ? (
          <Image
            key={imageSrc}
            src={imageSrc}
            alt={`Color vision screening demonstration plate ${itemNumber}`}
            width={280}
            height={280}
            priority
            unoptimized
            className={`w-full h-full object-contain transition-opacity duration-200 ${
              isLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
          />
        ) : (
          /* Graceful Fallback if Local Asset Is Unavailable */
          <div className="flex flex-col items-center justify-center text-center p-4 text-xs text-slate-500 dark:text-slate-400">
            <svg
              className="w-12 h-12 mb-2 text-slate-400 dark:text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" strokeWidth="2" strokeDasharray="4 4" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01" />
            </svg>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Plate Asset Loading
            </span>
            <span className="text-[11px] mt-1 text-slate-500">
              {stimulusData?.plateId ?? `Item ${itemNumber}`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
