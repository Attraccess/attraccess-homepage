import React from "react";
import { useI18n } from "@/contexts/i18n";

export function StatsBar() {
  const { t } = useI18n();

  const stats = [
    { number: t("stats.orgs.number"), label: t("stats.orgs.label") },
    { number: t("stats.machines.number"), label: t("stats.machines.label") },
    { number: t("stats.sheets.number"), label: t("stats.sheets.label") },
    { number: t("stats.selfhosted"), label: t("stats.selfhosted.label") },
  ];

  return (
    <section style={{ background: "#003d5c", borderTop: "1px solid rgba(255,255,255,0.1)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 sm:flex sm:flex-row items-center justify-around gap-8 sm:gap-4 text-center">
          {stats.map((stat, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl sm:text-4xl font-black text-white">
                  {stat.number === t("stats.selfhosted") ? (
                    <>
                      {stat.number}
                      <span style={{ color: "hsl(var(--orange-accent))" }}>.</span>
                    </>
                  ) : (
                    <>
                      {stat.number.replace("+", "")}
                      {stat.number.includes("+") && (
                        <span style={{ color: "hsl(var(--orange-accent))" }}>+</span>
                      )}
                    </>
                  )}
                </span>
                <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {stat.label}
                </span>
              </div>
              {index < stats.length - 1 && (
                <div className="hidden sm:block w-px h-12" style={{ background: "rgba(255,255,255,0.1)" }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
