import * as React from "react";
import { ShieldCheckIcon, SunIcon, MonitorIcon, EyeIcon } from "@/components/ui/icons";

export interface ScreeningGuidanceProps {
  testName?: string;
  className?: string;
}

export function ScreeningGuidance({
  className = "",
}: ScreeningGuidanceProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-[#0B1120]/90 p-5 space-y-4 text-xs ${className}`.trim()}
    >
      <div className="flex items-center gap-2 text-teal-800 dark:text-teal-400 font-bold text-sm tracking-tight">
        <ShieldCheckIcon size={18} className="text-teal-600 dark:text-teal-400 shrink-0" />
        <span>Responsible Screening Guidance</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/80 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-slate-200">
            <EyeIcon size={14} className="text-teal-600 dark:text-teal-400 shrink-0" />
            <span>Demonstration, Not Diagnosis</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            This module explores visual presentation concepts. It does not produce a medical diagnosis or assess ocular health.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/80 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-slate-200">
            <ShieldCheckIcon size={14} className="text-teal-600 dark:text-teal-400 shrink-0" />
            <span>Consult an Eye Care Specialist</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            If you experience eyestrain, headaches, blur, or changes in sight, visit an optometrist or ophthalmologist for clinical evaluation.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/80 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-slate-200">
            <MonitorIcon size={14} className="text-teal-600 dark:text-teal-400 shrink-0" />
            <span>Display &amp; Scaling Factors</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Screen resolution, pixel density (DPI), operating system scaling, and browser zoom affect displayed optotype and font sizes.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/80 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-slate-200">
            <SunIcon size={14} className="text-teal-600 dark:text-teal-400 shrink-0" />
            <span>Lighting &amp; Distance</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Ambient room glare, display brightness, color temperature filters, and viewing posture directly influence screening responses.
          </p>
        </div>
      </div>
    </div>
  );
}
