"use client";

import { useState, useEffect } from "react";
import { dictionary, DictionaryType } from "./dictionary";

export type Language = "id" | "en";

export const setGlobalLanguage = (lang: Language) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("smartcomplain_lang", lang);
    window.dispatchEvent(new CustomEvent("languageChanged", { detail: lang }));
  }
};

export const getGlobalLanguage = (): Language => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("smartcomplain_lang");
    if (saved === "id" || saved === "en") return saved as Language;
  }
  return "id";
};

export const useLanguage = () => {
  const [language, setLanguageState] = useState<Language>("id");

  useEffect(() => {
    setLanguageState(getGlobalLanguage());

    const handleLanguageChange = (e: Event) => {
      const customEvent = e as CustomEvent<Language>;
      setLanguageState(customEvent.detail);
    };

    window.addEventListener("languageChanged", handleLanguageChange);
    return () => {
      window.removeEventListener("languageChanged", handleLanguageChange);
    };
  }, []);

  const t: DictionaryType = dictionary[language];

  return { language, setLanguage: setGlobalLanguage, t };
};
