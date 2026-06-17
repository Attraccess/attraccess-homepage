import React, { useState } from "react";
import { useI18n } from "@/contexts/i18n";

interface Step {
  key: string;
  image: string;
  bullets: string[];
}

export function HowItWorks() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState(0);

  const steps: Step[] = [
    {
      key: "step1",
      image: "/how-it-works/define-resource.webp",
      bullets: [
        "how-it-works.step1.bullet1",
        "how-it-works.step1.bullet2",
        "how-it-works.step1.bullet3",
      ],
    },
    {
      key: "step2",
      image: "/how-it-works/assign-access.webp",
      bullets: [
        "how-it-works.step2.bullet1",
        "how-it-works.step2.bullet2",
        "how-it-works.step2.bullet3",
      ],
    },
    {
      key: "step3",
      image: "/how-it-works/deploy-use.webp",
      bullets: [
        "how-it-works.step3.bullet1",
        "how-it-works.step3.bullet2",
        "how-it-works.step3.bullet3",
      ],
    },
    {
      key: "step4",
      image: "/how-it-works/track-automate.webp",
      bullets: [
        "how-it-works.step4.bullet1",
        "how-it-works.step4.bullet2",
        "how-it-works.step4.bullet3",
      ],
    },
    {
      key: "step5",
      image: "/how-it-works/maintain-scale.webp",
      bullets: [
        "how-it-works.step5.bullet1",
        "how-it-works.step5.bullet2",
        "how-it-works.step5.bullet3",
      ],
    },
  ];

  const activeStep = steps[activeTab];

  return (
    <section style={{ background: "#0a1525" }} className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4"
            style={{ background: "rgba(242,112,0,0.2)", border: "1px solid rgba(242,112,0,0.3)", color: "#f97316" }}
          >
            {t("how-it-works.label") || "How It Works"}
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            {t("how-it-works.title")}
          </h2>
          <p className="max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
            {t("how-it-works.subtitle")}
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2" role="tablist">
          {steps.map((step, index) => {
            const isActive = index === activeTab;
            return (
              <button
                key={step.key}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(index)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium whitespace-nowrap transition-all duration-200"
                style={{
                  background: isActive ? "#006ba6" : "transparent",
                  borderColor: isActive ? "#006ba6" : "rgba(255,255,255,0.2)",
                  color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
                }}
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: isActive ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)", color: isActive ? "#fff" : "rgba(255,255,255,0.5)" }}
                >
                  {index + 1}
                </span>
                {t(`how-it-works.${step.key}.title`)}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <div className="flex flex-col md:flex-row">
            {/* Left: Description */}
            <div className="flex-1 p-8 flex flex-col justify-center">
              <div className="font-semibold text-sm mb-2" style={{ color: "hsl(var(--orange-accent))" }}>
                {t("how-it-works.step-label") || "Step"} {activeTab + 1}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {t(`how-it-works.${activeStep.key}.title`)}
              </h3>
              <p className="leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.6)" }}>
                {t(`how-it-works.${activeStep.key}.description`)}
              </p>
              <ul className="flex flex-col gap-3">
                {activeStep.bullets.map((bulletKey) => {
                  const text = t(bulletKey);
                  if (!text || text === bulletKey) return null;
                  return (
                    <li key={bulletKey} className="flex items-start gap-3 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                      <div className="w-5 h-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0" style={{ background: "rgba(0,107,166,0.2)" }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#006ba6" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      {text}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Right: Screenshot */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-8" style={{ background: "rgba(0,0,0,0.2)" }}>
              <div className="w-full max-w-md">
                <img
                  src={activeStep.image}
                  alt={t(`how-it-works.${activeStep.key}.title`)}
                  className="w-full rounded-xl shadow-2xl object-cover"
                  style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
