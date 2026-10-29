"use client";

import * as React from "react";
import { useAIAssistant } from "./ai-assistant-context";
import { AIVisionIcon } from "@/components/ui/ai-vision-icon";

export function AIAssistantButton() {
  const { isOpen, toggleAssistant, language } = useAIAssistant();
  const [showTooltip, setShowTooltip] = React.useState(false);

  const tooltipLabel =
    language === "ur" ? "ویژن کیئر AI اسسٹنٹ" : "AI Vision Assistant";

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 select-none">
      {/* Accessible Hover Tooltip */}
      {showTooltip && !isOpen && (
        <div
          role="tooltip"
          id="ai-assistant-tooltip"
          className="absolute bottom-full right-0 mb-2.5 px-3 py-1.5 rounded-xl bg-slate-900/95 dark:bg-slate-800/95 text-white text-xs font-semibold shadow-xl border border-slate-700/60 dark:border-slate-700 whitespace-nowrap animate-fade-in pointer-events-none"
        >
          {tooltipLabel}
          <div className="absolute top-full right-5 -mt-1 border-4 border-transparent border-t-slate-900/95 dark:border-t-slate-800/95" />
        </div>
      )}

      {/* Floating Interactive AI Assistant Trigger */}
      <button
        type="button"
        onClick={toggleAssistant}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={tooltipLabel}
        aria-describedby="ai-assistant-tooltip"
        className={`group relative flex items-center justify-center w-14 h-14 rounded-2xl shadow-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-400 dark:focus-visible:ring-cyan-300 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#090D16] active:scale-95 ${
          isOpen
            ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 shadow-teal-500/10 ring-2 ring-teal-500/40"
            : "bg-gradient-to-tr from-teal-600 via-teal-500 to-cyan-500 text-white shadow-teal-600/30 hover:shadow-teal-500/40 hover:-translate-y-0.5 hover:scale-105"
        }`}
      >
        {/* Subtle Ambient Glow Effect on Hover */}
        <span
          className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-400 opacity-0 group-hover:opacity-40 blur-xs transition-opacity duration-300"
          aria-hidden="true"
        />

        {/* Custom AI Eye + Sparkle Icon */}
        <span className="relative z-10 flex items-center justify-center">
          {isOpen ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-200"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <AIVisionIcon
              size={28}
              sparkleColor="#FDE047"
              className="text-white drop-shadow-xs transition-transform duration-200 group-hover:scale-105"
            />
          )}
        </span>

        {/* Small Active Online Notification Dot */}
        {!isOpen && (
          <span
            className="absolute top-1 right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white dark:border-[#090D16] shadow-xs"
            aria-hidden="true"
          />
        )}
      </button>
    </div>
  );
}

