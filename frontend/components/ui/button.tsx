import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold transition-all duration-150 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090D16] disabled:opacity-40 disabled:cursor-not-allowed select-none";

    const variantStyles = {
      primary:
        "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25 hover:bg-cyan-400 active:bg-cyan-600 border border-cyan-300/40",
      secondary:
        "bg-cyan-950/60 text-cyan-300 hover:bg-cyan-900/70 active:bg-cyan-900/90 border border-cyan-700/60 shadow-2xs",
      outline:
        "bg-slate-900/70 text-slate-200 hover:bg-slate-800/90 hover:text-white active:bg-slate-700 border border-slate-700/80 shadow-2xs",
    };

    const sizeStyles = {
      sm: "text-xs px-3.5 py-1.5 rounded-lg gap-1.5",
      md: "text-sm px-4.5 py-2 rounded-xl gap-2",
      lg: "text-base px-6 py-2.5 rounded-xl gap-2.5",
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
