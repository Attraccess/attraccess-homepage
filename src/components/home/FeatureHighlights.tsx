import React from "react";
import { ScrollText, Smartphone, Wrench, type LucideIcon } from "lucide-react";
import { useI18n } from "@/contexts/i18n";
import { Reveal } from "@/components/home/Reveal";
import { proofChips } from "@/components/home/ProofMarquee";

const features: { icon: LucideIcon; key: string; image: string; imageClass: string }[] = [
  {
    icon: Wrench,
    key: "maintenance",
    image: "/design/sc-kpi.png",
    imageClass: "bg-[length:100%_auto] bg-center",
  },
  {
    icon: ScrollText,
    key: "logs",
    image: "/design/sc-protokoll.png",
    imageClass: "bg-[length:100%_auto] bg-top",
  },
  {
    icon: Smartphone,
    key: "mobile",
    image: "/hero/overview.jpg",
    imageClass: "bg-[length:100%_auto] bg-top",
  },
];

export function FeatureHighlights() {
  const { t } = useI18n();

  return (
    <section id="features" className="relative overflow-hidden bg-muted px-6 py-28 sm:px-8 noise-overlay">
      <div className="relative mx-auto max-w-[1200px]">
        <Reveal className="max-w-[680px]">
          <div className="text-[13px] font-bold uppercase tracking-[.14em] text-primary">
            {t("home.features.label")}
          </div>
          <h2 className="mt-3.5 font-display text-[clamp(34px,4vw,52px)] font-bold leading-[1.05] tracking-tight text-foreground">
            {t("home.features.title")}
          </h2>
          <p className="mt-4 text-lg font-medium leading-relaxed text-foreground/75 [text-wrap:pretty]">
            {t("home.features.subtitle")}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, key, image, imageClass }, i) => (
            <Reveal
              key={key}
              delay={i * 80}
              className="flex flex-col overflow-hidden rounded-[18px] border border-border bg-card shadow-[0_6px_16px_rgba(24,25,26,.07)] transition-shadow hover:shadow-[0_18px_40px_rgba(24,25,26,.14)]"
            >
              <div
                className={`h-[190px] border-b border-muted bg-muted bg-no-repeat ${imageClass}`}
                style={{ backgroundImage: `url(${image})` }}
                role="img"
                aria-label={t(`home.features.${key}.title`)}
              />
              <div className="flex flex-1 flex-col gap-2.5 px-7 pb-8 pt-6">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </span>
                  <span className="font-display text-[19px] font-bold text-foreground">
                    {t(`home.features.${key}.title`)}
                  </span>
                </div>
                <p className="text-[15px] font-medium leading-relaxed text-foreground/70 [text-wrap:pretty]">
                  {t(`home.features.${key}.text`)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-11 flex flex-wrap justify-center gap-2.5">
          {proofChips.slice(0, 5).map(({ icon: Icon, key }) => (
            <span
              key={key}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-bold text-foreground"
            >
              <Icon className="h-[17px] w-[17px] text-primary" />
              {t(key)}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
