"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Locale, Localized } from "@/content/types";

interface LanguageContextValue {
  lang: Locale;
  setLang: (l: Locale) => void;
  /** Resolve a Localized value to the active language. */
  t: (value: Localized) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "fk-lang";
const DEFAULT_LOCALE: Locale = "de";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Start with the SSR default so the first client render matches the server,
  // then reconcile with the stored preference after mount (no hydration flash).
  const [lang, setLangState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (stored === "de" || stored === "en") {
        setLangState(stored);
      } else {
        const nav = navigator.language?.toLowerCase() ?? "";
        if (nav.startsWith("en")) setLangState("en");
      }
    } catch {
      /* localStorage unavailable — keep default */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Locale) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback((value: Localized) => value[lang], [lang]);

  // Memoised: without this every consumer of the context re-renders on any
  // parent render, and the whole site sits inside this provider.
  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLang must be used within a LanguageProvider");
  }
  return ctx;
}
