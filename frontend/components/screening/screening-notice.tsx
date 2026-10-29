import * as React from "react";
import { InfoIcon } from "@/components/ui/icons";

export interface ScreeningNoticeProps {
  className?: string;
}

export function ScreeningNotice({ className = "" }: ScreeningNoticeProps) {
  return (
    <aside
      id="responsible-use"
      aria-labelledby="responsible-use-heading"
      className={`rounded-2xl border border-cyan-500/20 bg-[#0F172A]/90 p-5 sm:p-6 shadow-xl ${className}`.trim()}
    >
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-cyan-950/70 border border-cyan-800/80 flex items-center justify-center shrink-0 text-cyan-400 shadow-md">
          <InfoIcon size={20} className="text-cyan-400" />
        </div>

        <div>
          <h3
            id="responsible-use-heading"
            className="text-base font-bold text-white tracking-tight"
          >
            Responsible Screening Advisory
          </h3>
          <p className="mt-1.5 text-sm text-slate-400 leading-relaxed">
            VisionCare screening demonstrations are educational self-checks designed to explore visual awareness. They are <strong className="text-slate-200">not clinical diagnoses</strong> and cannot replace a comprehensive in-person examination by an optometrist or ophthalmologist.
          </p>
          <p className="mt-1 text-xs text-cyan-400 font-medium">
            If you notice vision blur, eyestrain, or changes in sight, please consult an eye care professional.
          </p>
        </div>
      </div>
    </aside>
  );
}
