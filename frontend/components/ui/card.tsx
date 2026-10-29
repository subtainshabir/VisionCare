import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "muted" | "elevated";
}

export function Card({ className = "", variant = "default", children, ...props }: CardProps) {
  const baseStyles = "rounded-2xl border transition-all duration-150 backdrop-blur-sm";
  const variantStyles = {
    default:
      "bg-white dark:bg-[#0F172A]/90 border-slate-200 dark:border-slate-800/80 shadow-sm dark:shadow-xl dark:shadow-black/30 text-slate-900 dark:text-white hover:border-teal-200 dark:hover:border-slate-700",
    muted: "bg-slate-50 dark:bg-[#0B1120]/80 border-slate-200 dark:border-slate-800/60 text-slate-800 dark:text-slate-200",
    elevated:
      "bg-white dark:bg-[#131D34] border-slate-200/90 dark:border-slate-700/80 shadow-md dark:shadow-2xl dark:shadow-cyan-950/20 text-slate-900 dark:text-white",
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-5 sm:p-6 pb-2 ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className = "", children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`text-xl font-bold tracking-tight text-slate-900 dark:text-white ${className}`.trim()} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className = "", children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-sm text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed ${className}`.trim()} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-5 sm:p-6 pt-2 ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-5 sm:p-6 pt-4 border-t border-slate-200 dark:border-slate-800/80 mt-3 flex items-center ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}
