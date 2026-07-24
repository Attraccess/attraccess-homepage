import React from "react";
import {
  BarChart,
  Hand,
  Plus,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useI18n } from "@/contexts/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface Step {
  id: number;
  key: string;
  icon: LucideIcon;
  image: string;
  /** Tailwind gradient stops for the step's accent. */
  color: string;
  /** How many `stepN.bulletM` keys exist for this step. */
  bullets: number;
}

export const STEPS: readonly Step[] = [
  {
    id: 1,
    key: "step1",
    icon: Plus,
    image: "/how-it-works/define-resource.webp",
    color: "from-blue-500 to-cyan-500",
    bullets: 3,
  },
  {
    id: 2,
    key: "step2",
    icon: Hand,
    image: "/how-it-works/assign-access.webp",
    color: "from-green-500 to-emerald-500",
    bullets: 3,
  },
  {
    id: 3,
    key: "step3",
    icon: Zap,
    image: "/how-it-works/deploy-use.webp",
    color: "from-orange-500 to-red-500",
    bullets: 3,
  },
  {
    id: 4,
    key: "step4",
    icon: BarChart,
    image: "/how-it-works/track-automate.webp",
    color: "from-purple-500 to-indigo-500",
    bullets: 3,
  },
  {
    id: 5,
    key: "step5",
    icon: Wrench,
    image: "/how-it-works/maintain-scale.webp",
    color: "from-pink-500 to-rose-500",
    bullets: 3,
  },
] as const;

/**
 * The five setup steps, alternating image side on large screens. Each step
 * spells out what actually happens rather than a one-line summary.
 */
export function StepList() {
  const { t } = useI18n();

  return (
    <ol className="space-y-20 lg:space-y-28">
      {STEPS.map((step, index) => {
        const flipped = index % 2 === 1;
        const title = t(`how-it-works.${step.key}.title`);
        return (
          <li
            key={step.id}
            className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14"
          >
            <div className={cn(flipped && "lg:order-2")}>
              <div className="flex items-center gap-4">
                <span
                  className={cn(
                    "flex h-12 w-12 flex-none items-center justify-center rounded-full bg-gradient-to-r text-lg font-bold text-white",
                    step.color
                  )}
                  aria-hidden="true"
                >
                  {step.id}
                </span>
                <span
                  className={cn(
                    "flex h-12 w-12 flex-none items-center justify-center rounded-lg bg-gradient-to-r",
                    step.color
                  )}
                  aria-hidden="true"
                >
                  <step.icon className="h-6 w-6 text-white" />
                </span>
                <div>
                  <span className="text-xs font-bold uppercase tracking-[.14em] text-muted-foreground">
                    {t("how-it-works.step-label")} {step.id}
                  </span>
                  <h3 className="text-2xl font-bold text-foreground">
                    {title}
                  </h3>
                </div>
              </div>

              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                {t(`how-it-works.${step.key}.description`)}
              </p>

              <ul className="mt-6 space-y-3">
                {Array.from({ length: step.bullets }, (_, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className={cn(
                        "mt-2 h-2 w-2 flex-none rounded-full bg-gradient-to-r",
                        step.color
                      )}
                      aria-hidden="true"
                    />
                    <span className="text-[15px] font-medium leading-snug text-foreground/80">
                      {t(`how-it-works.${step.key}.bullet${i + 1}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={cn(flipped && "lg:order-1")}>
              <Card className="overflow-hidden shadow-medium transition-shadow duration-300 hover:shadow-large">
                <CardContent className="p-6 sm:p-8">
                  <div className="aspect-video overflow-hidden rounded-lg bg-gradient-card">
                    <img
                      src={step.image}
                      alt={title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
