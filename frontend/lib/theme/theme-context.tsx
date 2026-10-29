"use client";

import * as React from "react";

export type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isMounted: boolean;
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

export const THEME_STORAGE_KEY = "visioncare_theme";

const themeListeners = new Set<() => void>();

function emitThemeChange() {
  themeListeners.forEach((listener) => listener());
}

function subscribeTheme(listener: () => void) {
  themeListeners.add(listener);
  return () => {
    themeListeners.delete(listener);
  };
}

function getThemeSnapshot(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (stored === "light" || stored === "dark") {
      return stored;
    }
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
  } catch {
    // LocalStorage or matchMedia not available
  }
  return "dark";
}

function getThemeServerSnapshot(): Theme {
  return "dark";
}

function applyTheme(targetTheme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (targetTheme === "dark") {
    root.classList.add("dark");
    root.classList.remove("light");
    root.style.colorScheme = "dark";
    root.setAttribute("data-theme", "dark");
  } else {
    root.classList.remove("dark");
    root.classList.add("light");
    root.style.colorScheme = "light";
    root.setAttribute("data-theme", "light");
  }
}

const emptySubscribe = () => () => {};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = React.useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getThemeServerSnapshot
  );

  const isMounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  React.useEffect(() => {
    applyTheme(getThemeSnapshot());

    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = () => {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (!stored) {
        applyTheme(getThemeSnapshot());
        emitThemeChange();
      }
    };

    mediaQuery.addEventListener?.("change", handleMediaChange);
    return () => {
      mediaQuery.removeEventListener?.("change", handleMediaChange);
    };
  }, []);

  const setTheme = React.useCallback((nextTheme: Theme) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // LocalStorage blocked
    }
    applyTheme(nextTheme);
    emitThemeChange();
  }, []);

  const toggleTheme = React.useCallback(() => {
    const current = getThemeSnapshot();
    const next: Theme = current === "dark" ? "light" : "dark";
    setTheme(next);
  }, [setTheme]);

  const value = React.useMemo(
    () => ({
      theme,
      toggleTheme,
      setTheme,
      isMounted,
    }),
    [theme, toggleTheme, setTheme, isMounted]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
