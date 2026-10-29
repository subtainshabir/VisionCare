import * as React from "react";

export interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  badge?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  badge,
  align = "center",
  className = "",
}: SectionHeadingProps) {
  const alignmentStyles = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <div className={`flex flex-col mb-8 sm:mb-12 ${alignmentStyles} ${className}`.trim()}>
      {badge && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 border border-teal-200 text-teal-800 dark:bg-cyan-950/70 dark:border-cyan-800/80 dark:text-cyan-300 mb-3 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 dark:bg-cyan-400 animate-pulse" aria-hidden="true" />
          {badge}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
