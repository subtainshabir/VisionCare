import * as React from "react";

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: "md" | "lg" | "xl" | "full";
}

export function PageContainer({
  className = "",
  maxWidth = "lg",
  children,
  ...props
}: PageContainerProps) {
  const maxWidthStyles = {
    md: "max-w-4xl",
    lg: "max-w-5xl",
    xl: "max-w-6xl",
    full: "max-w-full",
  };

  return (
    <div
      className={`w-full mx-auto px-4 sm:px-6 lg:px-8 ${maxWidthStyles[maxWidth]} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}
