import React, { useEffect, useState } from "react";
import { I18nContext, type Language } from "@/contexts/i18n";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      return localStorage.getItem("language") === "en" ? "en" : "de";
    } catch {
      return "de";
    }
  });

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      localStorage.setItem("language", language);
    } catch {
      // Storage access can be disabled by browser privacy settings.
    }
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage }}>
      {children}
    </I18nContext.Provider>
  );
}
