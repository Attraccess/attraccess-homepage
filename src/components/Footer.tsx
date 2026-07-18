import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "@/contexts/i18n";
import { useTheme } from "@/contexts/theme";
import { ImpressumModal } from "@/components/ImpressumModal";
import { Sun, Moon, Github } from "lucide-react";

export function Footer() {
  const { t, language, setLanguage } = useI18n();
  const { actualTheme, setTheme } = useTheme();
  const [impressumOpen, setImpressumOpen] = useState(false);

  return (
    <footer className="border-t border-white/10 bg-brand-ink px-6 py-9 sm:px-8">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-5">
        <Link to="/" className="flex items-center">
          <img
            src="/design/lockup-dark.png"
            alt="Attraccess"
            className="block h-[18px] w-auto opacity-90"
          />
        </Link>
        <div className="flex-1" />
        <span className="flex items-center gap-2 text-[13.5px] font-semibold text-white/60">
          <span className="h-[7px] w-[7px] rounded-full bg-brand-rose" />
          Made in Hamburg · attraccess.org · contact@attraccess.org
        </span>
      </div>

      <div className="mx-auto mt-6 flex max-w-[1200px] flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-6 text-[13px] font-semibold text-white/50">
        <span>{t("footer.copyright")}</span>
        <div className="flex-1" />
        <a
          href="https://github.com/attraccess/attraccess"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
        >
          <Github className="h-4 w-4" />
          GitHub
        </a>
        <Link to="/agb" className="transition-colors hover:text-white">
          AGB
        </Link>
        <button
          onClick={() => setImpressumOpen(true)}
          className="footer-impressum transition-colors hover:text-white"
        >
          {t("footer.impressum")}
        </button>
        <button
          onClick={() => setLanguage(language === "en" ? "de" : "en")}
          className="transition-colors hover:text-white"
        >
          {language === "en" ? "DE" : "EN"}
        </button>
        <button
          onClick={() => setTheme(actualTheme === "light" ? "dark" : "light")}
          aria-label={t("footer.toggle.theme")}
          className="transition-colors hover:text-white"
        >
          {actualTheme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>
      </div>

      <ImpressumModal open={impressumOpen} onOpenChange={setImpressumOpen} />
    </footer>
  );
}
