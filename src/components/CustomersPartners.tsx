import React from "react";
import workingLabLogo from "@/assets/workinglab-logo.png";
import tuhhLogo from "@/assets/tuhh-logo.svg";
import attraktorLogo from "@/assets/attraktor-logo.svg";
import { useI18n } from "@/contexts/i18n";

const partners = [
  {
    nameKey: "Working Lab & Sick Makerspace",
    logo: workingLabLogo,
    logoClass: "h-8",
    taglineKey: "customers.workinglab.tagline",
    descriptionKey: "customers.workinglab.description",
    dotColor: "#f27000",
  },
  {
    nameKey: "TUHH",
    logo: tuhhLogo,
    logoClass: "h-10",
    taglineKey: "customers.tuhh.tagline",
    descriptionKey: "customers.tuhh.description",
    dotColor: "#006ba6",
  },
  {
    nameKey: "Attraktor e.V.",
    logo: attraktorLogo,
    logoClass: "h-9",
    taglineKey: "customers.attraktor.tagline",
    descriptionKey: "customers.attraktor.description",
    dotColor: "#a855f7",
  },
];

export function CustomersPartners() {
  const { t } = useI18n();

  return (
    <section style={{ background: "#060f1e" }} className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4"
            style={{ background: "rgba(0,107,166,0.2)", border: "1px solid rgba(0,107,166,0.3)", color: "#60b4e0" }}
          >
            Trusted By
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            {t("customers.title")}
          </h2>
          <p className="max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
            {t("customers.subtitle")}
          </p>
        </div>

        {/* Partner Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {partners.map((partner) => (
            <div
              key={partner.nameKey}
              className="p-6 rounded-2xl transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(0,107,166,0.5)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.1)";
              }}
            >
              {/* Logo + name */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 p-2" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <img
                    src={partner.logo}
                    alt={`${partner.nameKey} logo`}
                    className={`${partner.logoClass} object-contain`}
                    style={{ filter: "brightness(0) invert(1) opacity(0.9)" }}
                  />
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{partner.nameKey}</div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {t(partner.taglineKey)}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                {t(partner.descriptionKey)}
              </p>

              {/* Footer dot */}
              <div className="mt-4 pt-4 flex items-center gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#4ade80" }} />
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Active deployment</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
