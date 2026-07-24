import React from "react";
import workingLabLogo from "@/assets/workinglab-logo.png";
import tuhhLogo from "@/assets/tuhh-logo.svg";
import attraktorLogo from "@/assets/attraktor-logo.svg";
import { useI18n } from "@/contexts/i18n";
import { cn } from "@/lib/utils";

const LOGOS = [
  { name: "Working Lab", logo: workingLabLogo, className: "h-7" },
  { name: "TUHH", logo: tuhhLogo, className: "h-9" },
  { name: "Attraktor e.V.", logo: attraktorLogo, className: "h-8" },
] as const;

/** Compact "already using Attraccess" logo row. */
export function TrustLogos({ className }: { className?: string }) {
  const { t } = useI18n();

  return (
    <div className={cn("text-center", className)}>
      <p className="text-xs font-bold uppercase tracking-[.14em] text-muted-foreground">
        {t("contact.trust.label")}
      </p>
      <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
        {LOGOS.map((item) => (
          <li key={item.name}>
            <img
              src={item.logo}
              alt={item.name}
              loading="lazy"
              decoding="async"
              className={cn(
                "w-auto object-contain opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0",
                item.className
              )}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
