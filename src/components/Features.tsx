import React from "react";
import { useI18n } from "@/contexts/i18n";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

function CheckIcon() {
  return (
    <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(74,222,128,0.2)" }}>
      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="3">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  );
}

function NFCReaderWireframe() {
  return (
    <div className="flex justify-center items-center gap-6 my-4">
      <div
        style={{
          width: "72px",
          height: "108px",
          background: "linear-gradient(145deg, #1a3a5c, #0d2540)",
          borderRadius: "10px",
          border: "2px solid rgba(0,107,166,0.5)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          flexShrink: 0,
        }}
      >
        <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "2.5px solid rgba(0,107,166,0.6)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <div style={{ position: "absolute", width: "44px", height: "44px", borderRadius: "50%", border: "1.5px solid rgba(0,107,166,0.25)" }} />
          <div style={{ position: "absolute", width: "56px", height: "56px", borderRadius: "50%", border: "1px solid rgba(0,107,166,0.12)" }} />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,107,166,0.8)" strokeWidth="2">
            <path d="M6 15a6 6 0 1 0 12 0 6 6 0 0 0-12 0M6 9a9 9 0 1 1 0 12M9 6l-3 3 3 3" />
          </svg>
        </div>
        <div className="w-2 h-2 rounded-full" style={{ background: "#22c55e", boxShadow: "0 0 8px #22c55e", animation: "pulse-dot 1.5s ease-in-out infinite" }} />
        <div style={{ fontSize: "7px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>NFC</div>
      </div>

      <div className="flex flex-col items-center gap-1 flex-shrink-0">
        <div style={{ width: "32px", height: "1px", background: "rgba(0,107,166,0.4)" }} />
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(0,107,166,0.5)" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <div style={{ fontSize: "7px", color: "rgba(255,255,255,0.2)" }}>Auth</div>
      </div>

      <div style={{ width: "56px", height: "72px", borderRadius: "8px", border: "2px solid rgba(242,112,0,0.4)", background: "rgba(242,112,0,0.1)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px", flexShrink: 0 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(242,112,0,0.7)" strokeWidth="1.5">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
        </svg>
        <div style={{ fontSize: "7px", color: "rgba(242,112,0,0.7)", fontWeight: 700 }}>Machine</div>
      </div>
    </div>
  );
}

function FlowMiniViz({ t }: { t: (k: string) => string }) {
  return (
    <div className="mt-4 flex items-center gap-2 flex-wrap">
      <div className="px-2 py-1 rounded-md text-xs font-medium" style={{ background: "rgba(196,132,252,0.2)", color: "#c084fc" }}>{t("features.flows.node1")}</div>
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="rgba(196,132,252,0.5)" strokeWidth="1.5"><path d="M1 6h12M9 2l4 4-4 4" /></svg>
      <div className="px-2 py-1 rounded-md text-xs font-medium" style={{ background: "rgba(196,132,252,0.2)", color: "#c084fc" }}>{t("features.flows.node2")}</div>
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="rgba(196,132,252,0.5)" strokeWidth="1.5"><path d="M1 6h12M9 2l4 4-4 4" /></svg>
      <div className="px-2 py-1 rounded-md text-xs font-medium" style={{ background: "rgba(196,132,252,0.3)", color: "#e9d5ff" }}>{t("features.flows.node3")}</div>
    </div>
  );
}

function AnalyticsChart() {
  const bars = [30, 60, 80, 100, 70, 45, 25];
  return (
    <div className="mt-4 flex items-end gap-1" style={{ height: "40px" }}>
      {bars.map((h, i) => (
        <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: `rgba(45,212,191,${0.3 + (i / bars.length) * 0.5})` }} />
      ))}
    </div>
  );
}

function MaintenanceViz({ t }: { t: (k: string) => string }) {
  const items = [
    { key: "features.maintenance.status1", color: "#f97316", bg: "rgba(249,115,22,0.15)", border: "rgba(249,115,22,0.3)" },
    { key: "features.maintenance.status2", color: "#ef4444", bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.3)" },
    { key: "features.maintenance.status3", color: "#4ade80", bg: "rgba(74,222,128,0.1)", border: "rgba(74,222,128,0.2)" },
  ];
  return (
    <div className="flex flex-col gap-2 flex-shrink-0">
      {items.map((item) => (
        <div key={item.key} className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
          <div className="px-2.5 py-1.5 rounded-lg text-xs font-medium" style={{ minWidth: "140px", background: item.bg, border: `1px solid ${item.border}`, color: "rgba(255,255,255,0.6)" }}>
            {t(item.key)}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Features() {
  const { t } = useI18n();

  return (
    <section style={{ background: "#060f1e" }} className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4" style={{ background: "rgba(0,107,166,0.2)", border: "1px solid rgba(0,107,166,0.3)", color: "#60b4e0" }}>
            {t("features.label")}
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white max-w-2xl">
            {t("features.overview.title")}
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="bento-grid">

          {/* Card 1: NFC Access — tall, rows 1-2, col 1 */}
          <div
            className="bento-card-1 p-8 rounded-2xl flex flex-col gap-6 relative overflow-hidden"
            style={{ background: "linear-gradient(145deg, #0a1a2e 0%, #0d2540 100%)", border: "1px solid rgba(0,107,166,0.3)", boxShadow: "0 0 40px rgba(0,107,166,0.2)" }}
          >
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-2xl pointer-events-none" style={{ background: "rgba(0,107,166,0.1)" }} />
            <div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(0,107,166,0.2)" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#006ba6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{t("features.access.title")}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{t("features.access.description")}</p>
            </div>
            <NFCReaderWireframe />
            <div className="flex flex-col gap-2 mt-auto">
              {[t("features.access.bullet1"), t("features.access.bullet2"), t("features.access.bullet3")].map((bullet) => (
                <div key={bullet} className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <CheckIcon />{bullet}
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Automation Flows — row 1, col 2 */}
          <div
            className="bento-card-2 p-6 rounded-2xl relative overflow-hidden"
            style={{ background: "linear-gradient(145deg, #2d1b69 0%, #4c2fa0 100%)", border: "1px solid rgba(165,85,247,0.3)" }}
          >
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-2xl pointer-events-none" style={{ background: "rgba(196,132,252,0.1)" }} />
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: "rgba(196,132,252,0.2)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><path d="M13 6h3a2 2 0 0 1 2 2v7" /><line x1="6" y1="9" x2="6" y2="21" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{t("features.flows.title")}</h3>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{t("features.flows.description")}</p>
            <FlowMiniViz t={t} />
          </div>

          {/* Card 3: Analytics — row 1, col 3 */}
          <div
            className="bento-card-3 p-6 rounded-2xl relative overflow-hidden"
            style={{ background: "linear-gradient(145deg, #0d4f4f 0%, #0e7474 100%)", border: "1px solid rgba(45,212,191,0.3)" }}
          >
            <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full blur-2xl pointer-events-none" style={{ background: "rgba(45,212,191,0.1)" }} />
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: "rgba(45,212,191,0.2)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{t("features.analytics.title")}</h3>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{t("features.analytics.description")}</p>
            <AnalyticsChart />
          </div>

          {/* Card 4: Maintenance Workflows — wide, row 2, cols 2-3 */}
          <div
            className="bento-card-4 p-6 rounded-2xl relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #2a1a00 0%, #5c3800 100%)", border: "1px solid rgba(249,115,22,0.25)" }}
          >
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none" style={{ background: "rgba(242,112,0,0.08)" }} />
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="flex-1">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: "rgba(242,112,0,0.2)" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{t("features.maintenance.title")}</h3>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{t("features.maintenance.description")}</p>
              </div>
              <MaintenanceViz t={t} />
            </div>
          </div>

          {/* Card 5: Per-Resource Permissions — row 3, col 1 */}
          <div
            className="bento-card-5 p-6 rounded-2xl relative overflow-hidden"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: "rgba(156,163,175,0.2)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{t("features.rbac.title")}</h3>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{t("features.rbac.description")}</p>
            <div className="mt-3 flex flex-col gap-1.5">
              {[
                { color: "hsl(var(--orange-accent))", label: t("features.rbac.admin") },
                { color: "#006ba6", label: t("features.rbac.trainer") },
                { color: "#6b7280", label: t("features.rbac.member") },
              ].map((role) => (
                <div key={role.label} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: role.color }} />
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{role.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 6: Self-Hosted & Source-Available — wide, row 3, cols 2-3 */}
          <div
            className="bento-card-6 p-6 rounded-2xl relative overflow-hidden"
            style={{ background: "linear-gradient(145deg, #0f172a 0%, #1e1b4b 100%)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full blur-2xl pointer-events-none" style={{ background: "rgba(99,102,241,0.1)" }} />
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="flex-1">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: "rgba(99,102,241,0.2)" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" /><rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                    <line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{t("features.selfhosted.title")}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{t("features.selfhosted.description")}</p>
              </div>
              <div className="flex-shrink-0 flex flex-col gap-2 mt-1">
                <div className="px-3 py-1.5 rounded-lg" style={{ background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.3)" }}>
                  <code className="text-xs" style={{ color: "#a5b4fc" }}>{t("features.selfhosted.deploy")}</code>
                </div>
                <div className="text-xs text-center" style={{ color: "rgba(255,255,255,0.3)" }}>or deploy to your own infra</div>
                <div className="px-3 py-1.5 rounded-lg text-center" style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
                  <span className="text-xs font-medium" style={{ color: "#a5b4fc" }}>{t("features.selfhosted.license")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link to="/contact">
            <Button size="lg" className="gap-2 font-semibold shadow-xl" style={{ background: "hsl(var(--orange-accent))", color: "white", border: "none" }}>
              {t("features.cta")}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
