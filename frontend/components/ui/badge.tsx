import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "primary" | "success" | "warning" | "sky" | "lavender";
}

export function Badge({
  className = "",
  variant = "neutral",
  children,
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-xs";

  const variantStyles = {
    neutral: "bg-slate-100 border-slate-200 text-slate-700 dark:bg-slate-900/80 dark:border-slate-700/80 dark:text-slate-300",
    primary: "bg-teal-50 border-teal-200 text-teal-800 dark:bg-cyan-950/70 dark:border-cyan-800/80 dark:text-cyan-300",
    success: "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/70 dark:border-emerald-800/80 dark:text-emerald-300",
    warning: "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/70 dark:border-amber-800/80 dark:text-amber-300",
    sky: "bg-sky-50 border-sky-200 text-sky-800 dark:bg-sky-950/70 dark:border-sky-800/80 dark:text-sky-300",
    lavender: "bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-950/70 dark:border-purple-800/80 dark:text-purple-300",
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`.trim()} {...props}>
      {children}
    </span>
  );
}
