import React, { useEffect, useState } from "react";
import { MapPin, CalendarDays, X } from "lucide-react";
import { useI18n } from "@/contexts/i18n";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "attraccess-banner-makerfaire-hannover-2026";
const EVENT_URL = "https://maker-faire.de/hannover/";
// Banner hides itself once the fair is over (end of 16 Aug 2026).
const EVENT_END = new Date("2026-08-17T00:00:00");

export function AnnouncementBanner() {
  const { t } = useI18n();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (new Date() > EVENT_END) return;
    try {
      setDismissed(localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      setDismissed(false);
    }
  }, []);

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore storage errors (private mode) */
    }
  };

  if (dismissed || new Date() > EVENT_END) return null;

  return (
    <div className="relative bg-brand-blue text-white">
      <a
        href={EVENT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-10 py-2.5 text-center text-sm font-medium sm:text-[15px]"
      >
        <span>{t("banner.makerfaire.lead")}</span>
        <span className="inline-flex items-center gap-1 font-semibold">
          <MapPin className="h-[15px] w-[15px] shrink-0" aria-hidden="true" />
          {t("banner.makerfaire.booth")}
        </span>
        <span className="inline-flex items-center gap-1 text-white/85">
          <CalendarDays className="h-[15px] w-[15px] shrink-0" aria-hidden="true" />
          {t("banner.makerfaire.date")}
        </span>
        <span className="font-semibold underline decoration-white/50 underline-offset-2 transition-colors group-hover:decoration-white">
          {t("banner.makerfaire.cta")}
        </span>
      </a>
      <button
        type="button"
        onClick={handleDismiss}
        aria-label={t("banner.makerfaire.close")}
        className={cn(
          "absolute right-1.5 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-md",
          "text-white/80 transition-colors hover:bg-white/15 hover:text-white",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        )}
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
