"use client";

import * as React from "react";
import { useAIAssistant } from "./ai-assistant-context";
import { translations } from "@/lib/ai/translations";
import { testGuides } from "@/lib/ai/test-guide-data";
import { AIVisionIcon } from "@/components/ui/ai-vision-icon";
import { MarkdownMessage } from "./markdown-message";
import {
  EyeIcon,
  RotateCcwIcon,
  SparklesIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
} from "@/components/ui/icons";

export function AIAssistantPopup() {
  const {
    isOpen,
    closeAssistant,
    language,
    setLanguage,
    messages,
    isLoading,
    error,
    activeMode,
    guideTestId,
    guideStepNumber,
    startTestGuide,
    nextGuideStep,
    prevGuideStep,
    exitTestGuide,
    sendMessage,
    retryLastMessage,
    clearConversation,
    activeResult,
    currentDetectedRouteTest,
  } = useAIAssistant();

  const [inputVal, setInputVal] = React.useState("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const popupRef = React.useRef<HTMLDivElement>(null);

  const t = translations[language];
  const isUrdu = language === "ur";

  // Auto-scroll to latest message
  React.useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen, activeMode]);

  // Focus input when opening or switching to chat
  React.useEffect(() => {
    if (isOpen && activeMode === "chat") {
      inputRef.current?.focus();
    }
  }, [isOpen, activeMode]);

  // Close popup on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeAssistant();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeAssistant]);

  if (!isOpen) return null;

  const handleSend = () => {
    if (inputVal.trim() && !isLoading) {
      sendMessage(inputVal);
      setInputVal("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ur" : "en");
  };

  // Quick Action Chip Handlers
  const handleChipVisionGuide = () => {
    sendMessage(t.chips.visionGuide.prompt);
  };

  const handleChipExplainResults = () => {
    if (activeResult) {
      sendMessage(t.chips.explainResults.prompt);
    } else {
      // Add a friendly assistant message directly
      sendMessage(t.chips.explainResults.prompt);
    }
  };

  const handleChipTestGuide = () => {
    startTestGuide(currentDetectedRouteTest || "distance-vision");
  };

  // Active Test Guide data
  const currentSuite = guideTestId
    ? testGuides[language][guideTestId]
    : testGuides[language]["distance-vision"];
  const currentStep = currentSuite.steps[guideStepNumber - 1] || currentSuite.steps[0];
  const isLastGuideStep = guideStepNumber >= currentSuite.totalSteps;

  return (
    <div
      ref={popupRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-assistant-title"
      dir={isUrdu ? "rtl" : "ltr"}
      className="fixed bottom-20 right-4 sm:bottom-22 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[420px] max-w-[420px] h-[580px] max-h-[85vh] bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800/90 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scale-up text-slate-900 dark:text-white"
    >
      {/* 1. Header Bar */}
      <header className="px-4 py-3.5 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/60 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <AIVisionIcon size={20} sparkleColor="#FDE047" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2
                id="ai-assistant-title"
                className="text-sm font-bold text-slate-900 dark:text-white leading-tight"
              >
                {t.assistantName}
              </h2>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            </div>
            <span className="text-[11px] text-teal-600 dark:text-cyan-400 font-medium block">
              {t.statusLabel}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          {/* Language Switch Button */}
          <button
            type="button"
            onClick={toggleLanguage}
            title={t.languageSelector}
            aria-label={t.languageSelector}
            className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 transition"
          >
            {isUrdu ? "English" : "اردو"}
          </button>

          {/* New Chat / Reset */}
          <button
            type="button"
            onClick={clearConversation}
            title={t.clearChat}
            aria-label={t.clearChat}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <RotateCcwIcon size={16} />
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={closeAssistant}
            title={t.closeAssistant}
            aria-label={t.closeAssistant}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      {/* 2. Interactive Body Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
        {/* MODE A: Interactive Step-by-Step Test Guide Mode */}
        {activeMode === "test-guide" && currentSuite && (
          <div className="space-y-4 animate-fade-in">
            {/* Guide Header Banner */}
            <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 flex items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 block">
                  {currentSuite.testTitle}
                </span>
                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                  {t.stepWord} {guideStepNumber} {t.ofWord} {currentSuite.totalSteps}
                </span>
              </div>
              <button
                type="button"
                onClick={exitTestGuide}
                className="text-[11px] font-bold text-teal-700 dark:text-cyan-400 hover:underline"
              >
                {t.exitGuide}
              </button>
            </div>

            {/* Step Card Content */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 font-bold text-xs flex items-center justify-center shrink-0">
                  {guideStepNumber}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {currentStep.title}
                </h3>
              </div>

              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">
                {currentStep.instruction}
              </p>

              {currentStep.tip && (
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                  <span className="text-teal-600 dark:text-teal-400 font-bold" aria-hidden="true">
                    &#9679;
                  </span>
                  <span>{currentStep.tip}</span>
                </div>
              )}
            </div>

            {/* Step Navigation Controls */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={prevGuideStep}
                disabled={guideStepNumber <= 1}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
              >
                <ArrowLeftIcon size={14} className={isUrdu ? "rotate-180" : ""} />
                <span>{t.prevStep}</span>
              </button>

              <button
                type="button"
                onClick={isLastGuideStep ? exitTestGuide : nextGuideStep}
                className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-bold shadow-xs transition flex items-center gap-1.5"
              >
                <span>{isLastGuideStep ? t.exitGuide : t.nextStep}</span>
                <ArrowRightIcon size={14} className={isUrdu ? "rotate-180" : ""} />
              </button>
            </div>
          </div>
        )}

        {/* MODE B: Conversational Chat Mode */}
        {activeMode === "chat" && (
          <>
            {/* 2a. Welcome Screen & Built-in Quick Action Chips */}
            {messages.length === 0 && (
              <div className="space-y-4 animate-fade-in py-1">
                {/* Friendly Greeting Card */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-teal-50/90 to-cyan-50/50 dark:from-teal-950/40 dark:to-cyan-950/20 border border-teal-200/80 dark:border-teal-800/60 text-slate-800 dark:text-slate-200">
                  <p className="font-medium leading-relaxed">{t.welcomeGreeting}</p>
                </div>

                {/* 4 Quick Action Chips */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block px-1">
                    {isUrdu ? "فوری اختیارات" : "Quick Prompts"}
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Chip 1: Vision Guide */}
                    <button
                      type="button"
                      onClick={handleChipVisionGuide}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-teal-500 hover:bg-teal-50/50 dark:hover:bg-slate-800/80 text-left transition group"
                    >
                      <div className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400 mb-1">
                        <EyeIcon size={14} />
                        <span className="font-bold text-slate-900 dark:text-white text-xs group-hover:text-teal-600 dark:group-hover:text-cyan-400">
                          {t.chips.visionGuide.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 block">
                        {t.chips.visionGuide.desc}
                      </span>
                    </button>

                    {/* Chip 2: Explain Results */}
                    <button
                      type="button"
                      onClick={handleChipExplainResults}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-teal-500 hover:bg-teal-50/50 dark:hover:bg-slate-800/80 text-left transition group"
                    >
                      <div className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 mb-1">
                        <CheckCircleIcon size={14} />
                        <span className="font-bold text-slate-900 dark:text-white text-xs group-hover:text-cyan-600 dark:group-hover:text-cyan-300">
                          {t.chips.explainResults.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 block">
                        {t.chips.explainResults.desc}
                      </span>
                    </button>

                    {/* Chip 3: Test Guide */}
                    <button
                      type="button"
                      onClick={handleChipTestGuide}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-teal-500 hover:bg-teal-50/50 dark:hover:bg-slate-800/80 text-left transition group"
                    >
                      <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 mb-1">
                        <SparklesIcon size={14} />
                        <span className="font-bold text-slate-900 dark:text-white text-xs group-hover:text-purple-600 dark:group-hover:text-purple-300">
                          {t.chips.testGuide.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 block">
                        {t.chips.testGuide.desc}
                      </span>
                    </button>

                    {/* Chip 4: Language Switch */}
                    <button
                      type="button"
                      onClick={toggleLanguage}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-teal-500 hover:bg-teal-50/50 dark:hover:bg-slate-800/80 text-left transition group"
                    >
                      <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 mb-1">
                        <span className="font-mono text-xs font-bold" aria-hidden="true">
                          A/آ
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white text-xs group-hover:text-amber-600 dark:group-hover:text-amber-300">
                          {t.chips.languageHelp.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 block">
                        {t.chips.languageHelp.desc}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2b. Message Stream */}
            {messages.map((msg, idx) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={idx}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"} animate-fade-in`}
                >
                  <div
                    className={`${
                      isUser
                        ? "max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap bg-teal-600 dark:bg-cyan-600 text-white rounded-br-xs dark:rounded-br-xs shadow-xs"
                        : "max-w-[92%] sm:max-w-[90%] p-3.5 rounded-2xl text-xs bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 rounded-bl-xs dark:rounded-bl-xs border border-slate-200/60 dark:border-slate-700/60 shadow-xs overflow-hidden"
                    }`}
                  >
                    {isUser ? (
                      msg.content
                    ) : (
                      <MarkdownMessage content={msg.content} />
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 w-fit animate-fade-in">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium ml-1">
                  {t.typingIndicator}
                </span>
              </div>
            )}

            {/* Error Message with Retry */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 space-y-2 animate-fade-in">
                <p className="text-xs">{error}</p>
                <button
                  type="button"
                  onClick={retryLastMessage}
                  className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] transition"
                >
                  {t.retryButton}
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* 3. Footer Input Area */}
      <footer className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/60 shrink-0 space-y-1.5">
        <div className="relative flex items-center">
          <textarea
            ref={inputRef}
            rows={1}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.inputPlaceholder}
            maxLength={1000}
            className="w-full resize-none py-2.5 px-3.5 pr-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-cyan-400 focus:border-transparent transition shadow-2xs"
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={!inputVal.trim() || isLoading}
            title={t.sendButton}
            aria-label={t.sendButton}
            className={`absolute ${isUrdu ? "left-2" : "right-2"} p-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-xs`}
          >
            <ArrowRightIcon size={14} className={isUrdu ? "rotate-180" : ""} />
          </button>
        </div>

        {/* Safety Disclaimer Subtext */}
        <p className="text-[10px] text-slate-500 dark:text-slate-400 text-center line-clamp-1 px-1">
          {t.safetyDisclaimer}
        </p>
      </footer>
    </div>
  );
}
