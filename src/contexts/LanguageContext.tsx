import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, translations } from "../translations";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations["en"];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem("nxstep_portfolio_lang");
    if (saved === "ru") {
      localStorage.setItem("nxstep_portfolio_lang", "uk");
      return "uk";
    }
    return (saved as Language) || "en";
  });

  const setLang = (newLang: Language) => {
    localStorage.setItem("nxstep_portfolio_lang", newLang);
    setLangState(newLang);
  };

  useEffect(() => {
    document.documentElement.lang = lang === "uk" ? "uk" : "en";
  }, [lang]);

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
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
