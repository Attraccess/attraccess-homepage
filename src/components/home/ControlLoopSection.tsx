import React from "react";
import { BadgeCheck, ClipboardCheck, Cpu, ScanLine, Wrench } from "lucide-react";
import { useI18n } from "@/contexts/i18n";
import { Reveal } from "@/components/home/Reveal";

export function ControlLoopSection() {
  const { t } = useI18n();
  const steps = [
    { icon: ScanLine, title: t("home.loop.step1.title"), text: t("home.loop.step1.text") },
    { icon: ClipboardCheck, title: t("home.loop.step2.title"), text: t("home.loop.step2.text") },
    { icon: BadgeCheck, title: t("home.loop.step3.title"), text: t("home.loop.step3.text") },
    { icon: Cpu, title: t("home.loop.step4.title"), text: t("home.loop.step4.text") },
    { icon: Wrench, title: t("home.loop.step5.title"), text: t("home.loop.step5.text") },
  ];

  return <section id="control-loop" className="bg-brand-ink px-6 py-24 text-white sm:px-8">
    <div className="mx-auto max-w-[1200px]">
      <Reveal className="max-w-2xl">
        <p className="text-[13px] font-bold uppercase tracking-[.15em] text-[#82c8ff]">{t("home.loop.label")}</p>
        <h2 className="mt-4 font-sans text-[clamp(36px,4.5vw,58px)] font-bold leading-[1.02] tracking-[-.045em]">{t("home.loop.title")}</h2>
        <p className="mt-5 text-lg font-medium leading-relaxed text-white/70">{t("home.loop.intro")}</p>
      </Reveal>
      <div className="mt-14 grid overflow-hidden rounded-xl border border-white/15 sm:grid-cols-5">
        {steps.map(({ icon: Icon, title, text }, index) => <Reveal key={title} delay={index * 70} className="border-b border-white/15 p-6 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
          <span className="text-xs font-bold text-white/40">0{index + 1}</span><Icon className="mt-10 h-6 w-6 text-[#82c8ff]" />
          <h3 className="mt-5 text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-white/60">{text}</p>
        </Reveal>)}
      </div>
      <p className="mt-5 text-sm font-medium text-white/50">{t("home.loop.safety")}</p>
    </div>
  </section>;
}
