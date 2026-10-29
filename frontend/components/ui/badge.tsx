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
    neutral: "bg-slate-900/80 border-slate-700/80 text-slate-300",
    primary: "bg-cyan-950/70 border-cyan-800/80 text-cyan-300",
    success: "bg-emerald-950/70 border-emerald-800/80 text-emerald-300",
    warning: "bg-amber-950/70 border-amber-800/80 text-amber-300",
    sky: "bg-sky-950/70 border-sky-800/80 text-sky-300",
    lavender: "bg-purple-950/70 border-purple-800/80 text-purple-300",
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`.trim()} {...props}>
      {children}
    </span>
  );
}
