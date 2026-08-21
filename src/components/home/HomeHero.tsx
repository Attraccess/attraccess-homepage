import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, PlayCircle } from "lucide-react";
import { useI18n } from "@/contexts/i18n";
import { Reveal } from "@/components/home/Reveal";
import { WindowFrame } from "@/components/home/WindowFrame";

export function HomeHero() {
  const { t } = useI18n();

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-gradient-to-b from-muted to-background px-6 pt-24 pb-24 sm:px-8 noise-overlay"
    >
      <div className="pointer-events-none absolute -top-64 -right-52 h-[640px] w-[640px] rounded-full bg-[radial-gradient(circle,rgba(5,132,247,.13)_0%,rgba(5,132,247,0)_68%)]" />
      <div className="pointer-events-none absolute top-32 -left-64 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(197,120,129,.12)_0%,rgba(197,120,129,0)_68%)]" />

      <div className="relative mx-auto grid max-w-[1200px] items-center gap-14 lg:grid-cols-[.95fr_1.05fr] lg:gap-20">
        <div className="text-left">
        <Reveal className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-[13px] font-bold text-brand-green-dark shadow-sm">
          <span className="h-2 w-2 rounded-full bg-brand-green animate-pulse-ring" />
          {t("home.badge")}
        </Reveal>

        <Reveal delay={80}>
          <h1 className="mt-7 font-sans text-[clamp(48px,5.5vw,78px)] font-bold leading-[0.98] tracking-[-.055em] text-foreground">
            {t("home.hero.title.line1")}
            <br />
            <span className="text-primary">{t("home.hero.title.line2")}</span>
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mt-6 max-w-[580px] text-[clamp(17px,1.6vw,21px)] font-medium leading-relaxed text-foreground/75 [text-wrap:pretty]">
            {t("home.hero.subtitle")}
          </p>
        </Reveal>

        <Reveal delay={240} className="mt-8 flex flex-wrap gap-3.5">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-base font-bold text-primary-foreground shadow-[0_8px_24px_rgba(5,132,247,.38)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(5,132,247,.48)]"
          >
            {t("home.hero.cta.primary")}
            <ArrowRight className="h-[19px] w-[19px]" />
          </Link>
          <a
            href="#control-loop"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-7 py-3.5 text-base font-bold text-foreground transition-all hover:-translate-y-0.5 hover:border-primary"
          >
            <PlayCircle className="h-[19px] w-[19px] text-primary" />
            {t("home.hero.cta.secondary")}
          </a>
        </Reveal>

        <Reveal delay={300} className="mt-4 text-[13px] font-semibold text-muted-foreground">
          {t("home.hero.note")}
        </Reveal>

        </div>
        <Reveal delay={380} className="relative mx-auto w-full max-w-[980px]">
          <div className="absolute -top-5 right-8 z-[4] animate-float-up">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-4 py-2 text-[13px] font-bold text-brand-green-dark shadow-[0_8px_22px_rgba(24,25,26,.16)]">
              <span className="h-2 w-2 rounded-full bg-brand-green" />
              {t("home.hero.chip.available")}
            </span>
          </div>
          <div className="absolute top-14 -left-3.5 z-[4] hidden animate-float-down sm:block">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-4 py-2 text-[13px] font-bold text-brand-amber-dark shadow-[0_8px_22px_rgba(24,25,26,.16)]">
              <span className="h-2 w-2 rounded-full bg-brand-amber" />
              {t("home.hero.chip.maintenance")}
            </span>
          </div>
          <WindowFrame title={t("home.hero.window")} className="border-brand-ink/15 bg-card p-2 shadow-[16px_16px_0_#18191a]">
            <img
              src="/hero/app-screenshot.png"
              alt={t("home.hero.window")}
              className="block w-full"
            />
          </WindowFrame>
        </Reveal>
      </div>
    </section>
  );
}
