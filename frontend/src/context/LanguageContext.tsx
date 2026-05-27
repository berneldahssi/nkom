"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import { defaultLocale, locales } from "@/i18n/config";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Load translations on mount and when locale changes (client-side only)
  useEffect(() => {
    setIsMounted(true);
    const loadTranslations = async () => {
      try {
        // Try to get locale from localStorage
        const savedLocale = typeof window !== "undefined" ? localStorage.getItem("locale") as Locale | null : null;
        const currentLocale = (savedLocale && locales.includes(savedLocale)) ? savedLocale : defaultLocale;

        setLocaleState(currentLocale);

        // Import translations dynamically
        const translationModule = await import(`@/i18n/${currentLocale}.json`);
        setTranslations(translationModule.default || {});
      } catch (error) {
        console.error("Failed to load translations:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadTranslations();
  }, [isMounted]);

  const setLocale = async (newLocale: Locale) => {
    if (!locales.includes(newLocale)) return;

    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);

    try {
      const translationModule = await import(`@/i18n/${newLocale}.json`);
      setTranslations(translationModule.default || {});
    } catch (error) {
      console.error("Failed to load translations:", error);
    }
  };

  // Nested key getter (e.g., "landing.hero.title")
  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return key; // Return key if not found
      }
    }

    return typeof value === "string" ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
