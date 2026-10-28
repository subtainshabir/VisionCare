import * as React from "react";
import { DistanceVisionStimulusData } from "@/lib/tests/distance-vision-data";

export interface DistanceVisionStimulusProps {
  stimulusData: DistanceVisionStimulusData;
  stepNumber: number;
}

export function DistanceVisionStimulus({
  stimulusData,
  stepNumber,
}: DistanceVisionStimulusProps) {
  return (
    <div className="flex flex-col items-center justify-center p-3 sm:p-5">
      {/* High-Contrast Snellen-Style Chart Display Pane */}
      <div
        className="w-full max-w-sm sm:max-w-md h-56 sm:h-64 rounded-2xl border-2 border-slate-300 bg-white shadow-sm flex flex-col items-center justify-between p-4 relative overflow-hidden"
        aria-label={`Distance vision demonstration chart, Step ${stepNumber}`}
      >
        {/* Top Chart Header Line */}
        <div className="w-full flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
          <span>VisionCare Chart</span>
          <span>{stimulusData.stepLabel}</span>
        </div>

        {/* High-Contrast Single Optotype Glyph */}
        <div className="flex-1 flex items-center justify-center w-full my-auto">
          <span
            className={`font-mono font-black text-slate-950 tracking-normal select-none transition-all duration-150 ${stimulusData.fontClass}`}
            aria-hidden="true"
          >
            {stimulusData.optotype}
          </span>
        </div>

        {/* Bottom Calibration Framing Indicator */}
        <div className="w-full flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 pt-2 font-mono">
          <span>Contrast: 100%</span>
          <span>Target Step {stepNumber}</span>
        </div>
      </div>

      {/* Calibration Limitations Notice */}
      <div className="mt-4 text-center max-w-sm">
        <span className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
          {stimulusData.stepPurpose}
        </span>
        <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
          Uncalibrated browser optotype demonstration. Display dimensions vary by screen DPI and physical distance.
        </p>
      </div>
    </div>
  );
}
