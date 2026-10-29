"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { SupportedLanguage, containsUrduScript } from "@/lib/ai/translations";
import { ChatMessage, ScreeningResultContext } from "@/lib/ai/prompt-builder";
import { testGuides } from "@/lib/ai/test-guide-data";

export interface AIAssistantContextValue {
  isOpen: boolean;
  openAssistant: (initialPrompt?: string) => void;
  closeAssistant: () => void;
  toggleAssistant: () => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  activeMode: "chat" | "test-guide";
  setActiveMode: (mode: "chat" | "test-guide") => void;
  guideTestId: "distance-vision" | "near-vision" | "color-vision" | null;
  guideStepNumber: number;
  startTestGuide: (testId?: "distance-vision" | "near-vision" | "color-vision") => void;
  nextGuideStep: () => void;
  prevGuideStep: () => void;
  exitTestGuide: () => void;
  sendMessage: (text: string) => Promise<void>;
  retryLastMessage: () => Promise<void>;
  clearConversation: () => void;
  activeResult: ScreeningResultContext | null;
  setActiveResult: (res: ScreeningResultContext | null) => void;
  currentDetectedRouteTest: "distance-vision" | "near-vision" | "color-vision" | null;
}

const AIAssistantContext = React.createContext<AIAssistantContextValue | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = "visioncare_ai_lang";
const ACTIVE_RESULT_STORAGE_KEY = "visioncare_active_screening_result";

export function AIAssistantProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = React.useState(false);
  const [language, setLanguageState] = React.useState<SupportedLanguage>("en");
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [activeMode, setActiveMode] = React.useState<"chat" | "test-guide">("chat");
  const [guideTestId, setGuideTestId] = React.useState<
    "distance-vision" | "near-vision" | "color-vision" | null
  >(null);
  const [guideStepNumber, setGuideStepNumber] = React.useState<number>(1);
  const [activeResult, setActiveResultState] = React.useState<ScreeningResultContext | null>(null);

  // Sync language from localStorage on client mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored === "en" || stored === "ur") {
        requestAnimationFrame(() => {
          setLanguageState(stored);
        });
      }
    } catch {
      // LocalStorage unavailable
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch {
      // LocalStorage blocked
    }
  };

  // Detect current test context from route
  const currentDetectedRouteTest = React.useMemo<
    "distance-vision" | "near-vision" | "color-vision" | null
  >(() => {
    if (!pathname) return null;
    if (pathname.includes("/tests/distance-vision")) return "distance-vision";
    if (pathname.includes("/tests/near-vision")) return "near-vision";
    if (pathname.includes("/tests/color-vision")) return "color-vision";
    return null;
  }, [pathname]);

  // Read latest test result from sessionStorage if available
  React.useEffect(() => {
    try {
      const stored = sessionStorage.getItem(ACTIVE_RESULT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        requestAnimationFrame(() => {
          setActiveResultState(parsed);
        });
      }
    } catch {
      // Session storage unavailable
    }
  }, [pathname]);

  const setActiveResult = (res: ScreeningResultContext | null) => {
    setActiveResultState(res);
    try {
      if (res) {
        sessionStorage.setItem(ACTIVE_RESULT_STORAGE_KEY, JSON.stringify(res));
      } else {
        sessionStorage.removeItem(ACTIVE_RESULT_STORAGE_KEY);
      }
    } catch {
      //
    }
  };

  const openAssistant = (initialPrompt?: string) => {
    setIsOpen(true);
    if (initialPrompt && initialPrompt.trim().length > 0) {
      sendMessage(initialPrompt);
    }
  };

  const closeAssistant = () => {
    setIsOpen(false);
  };

  const toggleAssistant = () => {
    setIsOpen((prev) => !prev);
  };

  const startTestGuide = (
    testId?: "distance-vision" | "near-vision" | "color-vision"
  ) => {
    const target = testId || currentDetectedRouteTest || "distance-vision";
    setGuideTestId(target);
    setGuideStepNumber(1);
    setActiveMode("test-guide");
  };

  const nextGuideStep = () => {
    if (!guideTestId) return;
    const suite = testGuides[language][guideTestId];
    if (suite && guideStepNumber < suite.totalSteps) {
      setGuideStepNumber((prev) => prev + 1);
    }
  };

  const prevGuideStep = () => {
    if (guideStepNumber > 1) {
      setGuideStepNumber((prev) => prev - 1);
    }
  };

  const exitTestGuide = () => {
    setActiveMode("chat");
  };

  const clearConversation = () => {
    setMessages([]);
    setError(null);
    setActiveMode("chat");
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    // Auto-detect Urdu script if user inputs Urdu
    if (containsUrduScript(trimmed) && language !== "ur") {
      setLanguage("ur");
    }

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];

    setMessages(newMessages);
    setIsLoading(true);
    setError(null);
    setActiveMode("chat");

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          language,
          context: activeResult,
          currentPath: pathname,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to receive response from AI assistant.");
      }

      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: data.content || data.response || "No response received.",
        },
      ]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error. Please try again.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const retryLastMessage = async () => {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    if (lastUserMessage) {
      // Re-send without duplicating
      const filtered = messages.slice(0, -1);
      setMessages(filtered);
      await sendMessage(lastUserMessage.content);
    }
  };

  return (
    <AIAssistantContext.Provider
      value={{
        isOpen,
        openAssistant,
        closeAssistant,
        toggleAssistant,
        language,
        setLanguage,
        messages,
        isLoading,
        error,
        activeMode,
        setActiveMode,
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
        setActiveResult,
        currentDetectedRouteTest,
      }}
    >
      {children}
    </AIAssistantContext.Provider>
  );
}

export function useAIAssistant() {
  const context = React.useContext(AIAssistantContext);
  if (!context) {
    throw new Error("useAIAssistant must be used within an AIAssistantProvider");
  }
  return context;
}
