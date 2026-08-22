import { createContext, useContext } from "react";

export type Language = "de" | "en";

// Marketing copy is colocated with the two public pages. Keep this empty
// registry so translation audit tooling can verify that no stale keys remain.
export const translations = {
  en: {},
  de: {},
};

interface I18nContextType {
  language: Language;
  setLanguage: (language: Language) => void;
}

export const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within an I18nProvider");
  return context;
}
