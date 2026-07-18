import React from "react";
import { CreditCard, Gavel } from "lucide-react";
import { useI18n } from "@/contexts/i18n";
import { Reveal } from "@/components/home/Reveal";
import { WindowFrame } from "@/components/home/WindowFrame";

export function ProblemSection() {
  const { t } = useI18n();

  return (
    <section id="problem" className="relative overflow-hidden bg-muted px-6 py-28 sm:px-8 noise-overlay">
      <div className="relative mx-auto max-w-[1200px]">
        <Reveal className="max-w-[680px]">
          <div className="text-[13px] font-bold uppercase tracking-[.14em] text-brand-rose">
            {t("home.problem.label")}
          </div>
          <h2 className="mt-3.5 font-display text-[clamp(34px,4vw,52px)] font-bold leading-[1.05] tracking-tight text-foreground">
            {t("home.problem.title")}
          </h2>
          <p className="mt-4 text-lg font-medium leading-relaxed text-foreground/75 [text-wrap:pretty]">
            {t("home.problem.subtitle")}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-7 md:grid-cols-2">
          <Reveal className="rounded-[20px] border border-border bg-card p-9 shadow-[0_6px_16px_rgba(24,25,26,.07)] transition-shadow hover:shadow-[0_18px_40px_rgba(24,25,26,.14)]">
            <span className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-brand-red/10">
              <Gavel className="h-7 w-7 text-brand-red" />
            </span>
            <h3 className="mt-5 font-display text-[26px] font-bold text-foreground">
              {t("home.problem.liability.title")}
            </h3>
            <p className="mt-3 font-medium leading-relaxed text-foreground/75 [text-wrap:pretty]">
              {t("home.problem.liability.text")}
            </p>
            <WindowFrame title={t("home.problem.liability.window")} size="sm" className="mt-6">
              <div className="max-h-[230px] overflow-hidden">
                <img
                  src="/design/sc-einweisung.png"
                  alt={t("home.problem.liability.window")}
                  className="block w-full"
                />
              </div>
            </WindowFrame>
          </Reveal>

          <Reveal
            delay={120}
            className="rounded-[20px] border border-border bg-card p-9 shadow-[0_6px_16px_rgba(24,25,26,.07)] transition-shadow hover:shadow-[0_18px_40px_rgba(24,25,26,.14)]"
          >
            <span className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-primary/10">
              <CreditCard className="h-7 w-7 text-primary" />
            </span>
            <h3 className="mt-5 font-display text-[26px] font-bold text-foreground">
              {t("home.problem.revenue.title")}
            </h3>
            <p className="mt-3 font-medium leading-relaxed text-foreground/75 [text-wrap:pretty]">
              {t("home.problem.revenue.text")}
            </p>
            <WindowFrame title={t("home.problem.revenue.window")} size="sm" className="mt-6">
              <div className="max-h-[230px] overflow-hidden bg-muted px-4 py-2.5">
                <img
                  src="/design/sc-abrechnung.png"
                  alt={t("home.problem.revenue.window")}
                  className="block w-full"
                />
              </div>
            </WindowFrame>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
