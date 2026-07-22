import React from "react";
import { Link } from "react-router-dom";
import { MapPin, CalendarDays, ArrowRight } from "lucide-react";
import { useI18n } from "@/contexts/i18n";
import { Reveal } from "@/components/home/Reveal";

// Band hides itself once the fair is over (end of 16 Aug 2026).
const EVENT_END = new Date("2026-08-17T00:00:00");

export function MakerFaireBanner() {
  const { t } = useI18n();

  if (new Date() > EVENT_END) return null;

  return (
    <section className="bg-background px-4 pt-5 pb-3 sm:px-6">
      <Reveal className="relative mx-auto flex max-w-[1200px] flex-col items-center gap-4 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-blue to-[#0366c4] px-6 py-8 text-center text-white shadow-[0_16px_44px_-18px_rgba(5,132,247,.6)] sm:py-10">
        {/* decorative glow */}
        <div className="pointer-events-none absolute -top-40 -right-24 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.25)_0%,rgba(255,255,255,0)_70%)]" />
        <div className="pointer-events-none absolute -bottom-40 -left-24 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(0,0,0,.16)_0%,rgba(0,0,0,0)_70%)]" />

        <h2 className="relative font-display text-[clamp(22px,3.2vw,34px)] font-bold leading-[1.15] tracking-tight [text-wrap:balance]">
          <span aria-hidden="true">📢 </span>
          {t("banner.makerfaire.visit")}{" "}
          <span className="whitespace-nowrap underline decoration-white/40 decoration-2 underline-offset-4">
            {t("banner.makerfaire.event")}
          </span>
          !
        </h2>

        <div className="relative flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-[17px] font-semibold text-white/95 sm:text-lg">
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="h-5 w-5 shrink-0" aria-hidden="true" />
            {t("banner.makerfaire.when")}
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-5 w-5 shrink-0" aria-hidden="true" />
            {t("banner.makerfaire.where")}
          </span>
        </div>

        <Link
          to="/contact"
          className="group relative mt-2 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-[15px] font-bold text-brand-blue shadow-lg transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-blue"
        >
          {t("banner.makerfaire.cta")}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </Reveal>
    </section>
  );
}
