import React from "react";
import { HeartHandshake } from "lucide-react";
import { useI18n } from "@/contexts/i18n";
import { Reveal } from "@/components/home/Reveal";

export function NonProfitBanner() {
  const { t } = useI18n();

  return (
    <section className="bg-background px-6 py-28 sm:px-8">
      <Reveal className="relative mx-auto grid max-w-[1200px] items-center gap-10 overflow-hidden rounded-3xl border-2 border-brand-green bg-brand-green/[.07] p-10 sm:p-14 lg:grid-cols-[1fr_auto] lg:gap-14">
        <div className="pointer-events-none absolute -top-36 -right-36 h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,rgba(23,201,100,.14)_0%,rgba(23,201,100,0)_70%)]" />
        <div className="relative">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-green/15">
              <HeartHandshake className="h-[26px] w-[26px] text-brand-green-dark" />
            </span>
            <h2 className="font-display text-[clamp(28px,3.2vw,40px)] font-bold tracking-tight text-brand-green-dark">
              {t("home.nonprofit.title")}
            </h2>
          </div>
          <p className="mt-4 text-[17px] font-medium leading-relaxed text-foreground/80 [text-wrap:pretty]">
            {t("home.nonprofit.text")}
          </p>
        </div>
        <img
          src="/design/mascot.png"
          alt=""
          aria-hidden="true"
          className="relative h-[210px] w-auto justify-self-center animate-float-up-slow motion-reduce:animate-none"
        />
      </Reveal>
    </section>
  );
}
