import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "muted" | "elevated";
}

export function Card({ className = "", variant = "default", children, ...props }: CardProps) {
  const baseStyles = "rounded-2xl border transition-all duration-150 backdrop-blur-sm";
  const variantStyles = {
    default: "bg-[#0F172A]/90 border-slate-800/80 shadow-xl shadow-black/30 hover:border-slate-700",
    muted: "bg-[#0B1120]/80 border-slate-800/60",
    elevated: "bg-[#131D34] border-slate-700/80 shadow-2xl shadow-cyan-950/20",
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
    <h3 className={`text-xl font-bold tracking-tight text-white ${className}`.trim()} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className = "", children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-sm text-slate-400 mt-1.5 leading-relaxed ${className}`.trim()} {...props}>
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
    <div className={`p-5 sm:p-6 pt-4 border-t border-slate-800/80 mt-3 flex items-center ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}
