import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold transition-all duration-150 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-[#090D16] disabled:opacity-40 disabled:cursor-not-allowed select-none cursor-pointer";

    const variantStyles = {
      primary:
        "bg-teal-600 text-white shadow-md shadow-teal-600/20 hover:bg-teal-700 active:bg-teal-800 border border-teal-500/40 dark:bg-cyan-500 dark:text-slate-950 dark:shadow-cyan-500/25 dark:hover:bg-cyan-400 dark:active:bg-cyan-600 dark:border-cyan-300/40",
      secondary:
        "bg-teal-50 text-teal-800 hover:bg-teal-100 active:bg-teal-200 border border-teal-200 dark:bg-cyan-950/60 dark:text-cyan-300 dark:hover:bg-cyan-900/70 dark:active:bg-cyan-900/90 dark:border-cyan-700/60 shadow-2xs",
      outline:
        "bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 border border-slate-300 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:bg-slate-800/90 dark:hover:text-white dark:active:bg-slate-700 dark:border-slate-700/80 shadow-2xs",
    };

    const sizeStyles = {
      sm: "text-xs px-3.5 py-1.5 rounded-lg gap-1.5 min-h-[38px]",
      md: "text-sm px-4.5 py-2.5 rounded-xl gap-2 min-h-[44px]",
      lg: "text-base px-6 py-3 rounded-xl gap-2.5 min-h-[48px]",
    };

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.trim();

    return (
      <button ref={ref} className={combinedClassName} disabled={disabled} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
