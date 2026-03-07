"use client";

import { useLanguage } from "@/context/LanguageContext";
import { locales, localeNames } from "@/i18n/config";
import { Globe } from "lucide-react";
import { useState } from "react";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-charcoal/70 transition hover:bg-neutral hover:text-charcoal"
        title="Change language"
      >
        <Globe size={16} />
        <span className="hidden sm:inline uppercase text-xs">{locale}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-1 rounded-lg border border-primary/10 bg-white shadow-lg">
          {locales.map((lang) => (
            <button
              key={lang}
              onClick={() => {
                setLocale(lang);
                setIsOpen(false);
              }}
              className={`block w-full px-4 py-2 text-left text-sm transition ${
                locale === lang
                  ? "bg-primary text-white font-semibold"
                  : "text-charcoal/70 hover:bg-neutral hover:text-charcoal"
              }`}
            >
              {localeNames[lang]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
