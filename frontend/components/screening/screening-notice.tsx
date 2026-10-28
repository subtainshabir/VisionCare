import * as React from "react";

export interface ScreeningNoticeProps {
  className?: string;
}

export function ScreeningNotice({ className = "" }: ScreeningNoticeProps) {
  return (
    <aside
      id="responsible-use"
      aria-labelledby="responsible-use-heading"
      className={`rounded-xl border border-teal-200/90 bg-teal-50/50 p-6 sm:p-8 ${className}`.trim()}
    >
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-teal-100/80 border border-teal-200 flex items-center justify-center shrink-0 text-teal-800">
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </div>

        <div>
          <h3
            id="responsible-use-heading"
            className="text-base font-semibold text-slate-900 tracking-tight"
          >
            Responsible-Use Notice &amp; Clinical Advisory
          </h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            VisionCare is designed as an accessible preliminary screening and educational tool. Digital vision screenings are intended to help individuals identify potential visual differences that warrant formal assessment.
          </p>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed font-medium">
            This platform is not a diagnostic medical service, does not replace a comprehensive examination by an optometrist or ophthalmologist, and cannot detect underlying ocular pathologies.
          </p>
        </div>
      </div>
    </aside>
  );
}
