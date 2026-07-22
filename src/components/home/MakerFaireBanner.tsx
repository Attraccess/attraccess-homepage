import React from "react";
import { PartyPopper, MapPin, CalendarDays, ArrowRight } from "lucide-react";
import { useI18n } from "@/contexts/i18n";
import { Reveal } from "@/components/home/Reveal";

const EVENT_URL = "https://maker-faire.de/hannover/";
// Band hides itself once the fair is over (end of 16 Aug 2026).
const EVENT_END = new Date("2026-08-17T00:00:00");

export function MakerFaireBanner() {
  const { t } = useI18n();

  if (new Date() > EVENT_END) return null;

  return (
    <section className="bg-background px-6 py-10 sm:px-8">
      <Reveal className="relative mx-auto flex max-w-[1200px] flex-col items-center gap-6 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-amber to-brand-amber-dark px-6 py-14 text-center text-[#3d2a05] shadow-[0_20px_60px_-20px_rgba(181,120,12,.6)] sm:px-10 sm:py-16">
        {/* decorative glow */}
        <div className="pointer-events-none absolute -top-40 -right-24 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.35)_0%,rgba(255,255,255,0)_70%)]" />
        <div className="pointer-events-none absolute -bottom-40 -left-24 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(0,0,0,.12)_0%,rgba(0,0,0,0)_70%)]" />

        <span className="relative inline-flex items-center gap-2 rounded-full bg-[#3d2a05]/10 px-4 py-1.5 text-sm font-bold uppercase tracking-wide">
          <PartyPopper className="h-4 w-4 shrink-0" aria-hidden="true" />
          {t("banner.makerfaire.tagline")}
        </span>

        <h2 className="relative font-display text-[clamp(34px,6vw,58px)] font-bold leading-[1.05] tracking-tight [text-wrap:balance]">
          {t("banner.makerfaire.event")}
        </h2>

        <div className="relative flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-[17px] font-semibold sm:text-lg">
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-5 w-5 shrink-0" aria-hidden="true" />
            {t("banner.makerfaire.booth")}
          </span>
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="h-5 w-5 shrink-0" aria-hidden="true" />
            {t("banner.makerfaire.date")}
          </span>
        </div>

        <a
          href={EVENT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative mt-2 inline-flex items-center gap-2 rounded-full bg-[#3d2a05] px-7 py-3 text-[15px] font-bold text-white shadow-lg transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3d2a05] focus-visible:ring-offset-2 focus-visible:ring-offset-brand-amber"
        >
          {t("banner.makerfaire.cta")}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </a>
      </Reveal>
    </section>
  );
}
