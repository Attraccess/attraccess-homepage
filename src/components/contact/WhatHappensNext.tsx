import React from "react";
import {
  CalendarCheck,
  MessageSquare,
  Rocket,
  type LucideIcon,
} from "lucide-react";
import { useI18n } from "@/contexts/i18n";

const STEPS: readonly { key: string; icon: LucideIcon }[] = [
  { key: "reply", icon: MessageSquare },
  { key: "call", icon: CalendarCheck },
  { key: "pilot", icon: Rocket },
] as const;

/**
 * Sets expectations for what sending the form actually triggers — the single
 * biggest reason people hesitate on a contact form.
 */
export function WhatHappensNext() {
  const { t } = useI18n();

  return (
    <div>
      <h3 className="text-2xl font-bold text-foreground">
        {t("contact.next.title")}
      </h3>
      <p className="mt-2 text-base leading-relaxed text-muted-foreground">
        {t("contact.next.subtitle")}
      </p>

      <ol className="mt-8 space-y-6">
        {STEPS.map(({ key, icon: Icon }, index) => (
          <li key={key} className="flex gap-4">
            <div className="flex flex-none flex-col items-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
              </span>
              {index < STEPS.length - 1 && (
                <span
                  className="mt-2 w-0.5 flex-1 rounded-full bg-gradient-to-b from-primary/30 to-primary/5"
                  aria-hidden="true"
                />
              )}
            </div>
            <div className="pb-2">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-base font-bold text-foreground">
                  {t(`contact.next.${key}.title`)}
                </h4>
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                  {t(`contact.next.${key}.timing`)}
                </span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {t(`contact.next.${key}.text`)}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
