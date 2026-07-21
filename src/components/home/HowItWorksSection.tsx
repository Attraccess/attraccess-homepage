import React from "react";
import { Nfc, ScrollText, ShieldCheck, Zap, type LucideIcon } from "lucide-react";
import { useI18n } from "@/contexts/i18n";
import { Reveal } from "@/components/home/Reveal";
import { WindowFrame } from "@/components/home/WindowFrame";

const steps: { icon: LucideIcon; key: string }[] = [
  { icon: Nfc, key: "step1" },
  { icon: ShieldCheck, key: "step2" },
  { icon: Zap, key: "step3" },
  { icon: ScrollText, key: "step4" },
];

export function HowItWorksSection() {
  const { t } = useI18n();

  return (
    <section id="how" className="relative overflow-hidden bg-background px-6 py-28 sm:px-8">
      <div className="pointer-events-none absolute -top-44 -left-56 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(5,132,247,.08)_0%,rgba(5,132,247,0)_68%)]" />

      <div className="relative mx-auto grid max-w-[1200px] items-center gap-16 lg:grid-cols-[minmax(320px,1fr)_minmax(360px,1.1fr)] lg:gap-[72px]">
        <div>
          <Reveal>
            <div className="text-[13px] font-bold uppercase tracking-[.14em] text-primary">
              {t("home.how.label")}
            </div>
            <h2 className="mt-3.5 font-display text-[clamp(34px,4vw,52px)] font-bold leading-[1.05] tracking-tight text-foreground">
              {t("home.how.title")}
            </h2>
          </Reveal>

          <div className="mt-11 flex flex-col">
            {steps.map(({ icon: Icon, key }, i) => (
              <Reveal key={key} className="relative flex items-start gap-5 pb-8">
                <div className="flex flex-none flex-col items-center self-stretch">
                  <span className="relative flex h-[54px] w-[54px] items-center justify-center rounded-2xl bg-primary/10">
                    <Icon className="h-[27px] w-[27px] text-primary" />
                    <span className="absolute -top-2 -left-2 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-[0_3px_8px_rgba(5,132,247,.4)]">
                      {i + 1}
                    </span>
                  </span>
                  {i < steps.length - 1 && (
                    <span className="mt-2 w-0.5 flex-1 rounded-full bg-gradient-to-b from-primary/35 to-primary/5" />
                  )}
                </div>
                <div className="pt-1">
                  <div className="font-display text-[21px] font-bold text-foreground">
                    {t(`home.how.${key}.title`)}
                  </div>
                  <p className="mt-1.5 max-w-[420px] text-[15.5px] font-medium leading-relaxed text-foreground/70 [text-wrap:pretty]">
                    {t(`home.how.${key}.text`)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={150} className="relative">
          <div className="absolute -top-4 left-6 z-[4] inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-[13px] font-bold text-primary-foreground shadow-[0_6px_16px_rgba(5,132,247,.4)]">
            <Nfc className="h-4 w-4" />
            {t("home.how.chip")}
          </div>
          <WindowFrame title={t("home.how.window")} className="shadow-[0_24px_60px_rgba(24,25,26,.16)]">
            <div className="relative overflow-hidden">
              <img src="/hero/overview.jpg" alt={t("home.how.window")} className="block w-full" />
              <div className="pointer-events-none absolute inset-y-0 left-0 w-[38%] bg-[linear-gradient(100deg,rgba(5,132,247,0)_0%,rgba(5,132,247,.10)_50%,rgba(5,132,247,0)_100%)] animate-scan motion-reduce:animate-none" />
            </div>
          </WindowFrame>
          <div className="absolute -bottom-6 -right-4 z-[4] animate-float-up-slow">
            <div className="flex items-center gap-2.5 rounded-2xl border border-border bg-card px-4 py-3 shadow-[0_12px_30px_rgba(24,25,26,.16)]">
              <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-brand-green/10">
                <Zap className="h-[19px] w-[19px] text-brand-green-dark" />
              </span>
              <div>
                <div className="font-display text-[13.5px] font-bold text-foreground">
                  {t("home.how.float.title")}
                </div>
                <div className="text-xs font-semibold text-muted-foreground">
                  {t("home.how.float.subtitle")}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
