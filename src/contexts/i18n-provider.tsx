import React, { useEffect, useState } from "react";
import { I18nContext, languageNames, translations, type Language } from "@/contexts/i18n";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    // Detect browser language
    const browserLang = navigator.language.split("-")[0] as Language;
    if (browserLang in languageNames) {
      setLanguage(browserLang);
    }
  }, []);

  const t = (key: string): string => {
    const translation =
      translations[language][
        key as keyof (typeof translations)[typeof language]
      ];
    return translation || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}
