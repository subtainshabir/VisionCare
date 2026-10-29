import * as React from "react";
import { InfoIcon } from "@/components/ui/icons";

export interface ScreeningLimitationsProps {
  testType: "color-vision" | "distance-vision" | "near-vision";
  customLimitations?: string;
  className?: string;
}

export function ScreeningLimitations({
  testType,
  customLimitations,
  className = "",
}: ScreeningLimitationsProps) {
  const limitationDetails = {
    "color-vision": {
      title: "Color Vision Demonstration Limitations",
      primaryNotice:
        "Matching the demonstration targets does NOT confirm normal color vision or rule out color vision deficiencies (such as red-green or blue-yellow anomalies).",
      calibrationNotice:
        customLimitations ||
        "Consumer displays vary significantly in color gamut coverage (sRGB/DCI-P3), color temperature night-modes, operating system color adjustments, and viewing angle shifts.",
      clinicalNotice:
        "Standardized clinical color testing requires authorized diagnostic materials (such as physical Ishihara plates or Richmond HRR charts) evaluated under standardized illumination.",
    },
    "distance-vision": {
      title: "Distance Acuity Calibration Limitations",
      primaryNotice:
        "This demonstration does NOT measure clinical visual acuity, determine 20/20 vision, or detect refractive errors (such as myopia, hyperopia, or astigmatism).",
      calibrationNotice:
        customLimitations ||
        "True visual acuity measurement requires physical chart dimension calibration against your exact display DPI, verified physical viewing distance, and monocular testing under clinical illumination.",
      clinicalNotice:
        "Standardized visual acuity assessment must be performed under controlled optical conditions with professional refraction by an optometrist or ophthalmologist.",
    },
    "near-vision": {
      title: "Near Reading Scale Limitations",
      primaryNotice:
        "This demonstration does NOT measure clinical near visual acuity, assign standardized reading grades (such as Jaeger J1–J16 or logMAR), or diagnose presbyopia.",
      calibrationNotice:
        customLimitations ||
        "CSS typography scales and pixel densities vary across mobile and desktop displays. Display scaling and habituated reading distances do not constitute a calibrated near-point chart.",
      clinicalNotice:
        "Evaluating reading accommodation and prescribing reading or bifocal lenses requires clinical near-point refraction by an eye-care professional.",
    },
  }[testType];

  return (
    <div
      className={`rounded-2xl border border-teal-200 dark:border-teal-800/50 bg-teal-50/60 dark:bg-teal-950/20 p-5 space-y-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300 ${className}`.trim()}
    >
      <div className="flex items-center gap-2 text-teal-800 dark:text-teal-300 font-bold text-sm tracking-tight">
        <InfoIcon size={18} className="text-teal-600 dark:text-teal-400 shrink-0" />
        <span>{limitationDetails.title}</span>
      </div>

      <p className="font-semibold text-slate-900 dark:text-slate-200">
        {limitationDetails.primaryNotice}
      </p>

      <p className="text-slate-600 dark:text-slate-400">
        <strong className="text-slate-800 dark:text-slate-300">Technical Boundaries: </strong>
        {limitationDetails.calibrationNotice}
      </p>

      <p className="text-slate-600 dark:text-slate-400">
        <strong className="text-slate-800 dark:text-slate-300">Clinical Protocol: </strong>
        {limitationDetails.clinicalNotice}
      </p>
    </div>
  );
}
