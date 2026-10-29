"use client";

import * as React from "react";
import { useTheme } from "@/lib/theme/theme-context";
import { SunIcon, MoonIcon } from "@/components/ui/icons";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className = "", showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme, isMounted } = useTheme();

  // Avoid hydration mismatch by rendering a stable placeholder state until mounted
  const isDark = isMounted ? theme === "dark" : true;
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={`min-w-[44px] min-h-[44px] p-2.5 rounded-xl flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-[#090D16] ${
        isDark
          ? "bg-slate-800/80 text-amber-300 hover:text-amber-200 hover:bg-slate-700/80 border border-slate-700/70"
          : "bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 border border-slate-300 shadow-2xs"
      } ${className}`.trim()}
    >
      {isDark ? (
        <SunIcon size={18} className="text-amber-300 transition-transform hover:rotate-45 duration-200" />
      ) : (
        <MoonIcon size={18} className="text-teal-700 transition-transform hover:-rotate-12 duration-200" />
      )}
      {showLabel && (
        <span className="ml-2 text-xs font-semibold">
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>
      )}
      <span className="sr-only">{label}</span>
    </button>
  );
}
