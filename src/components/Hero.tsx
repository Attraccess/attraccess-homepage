import React from "react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/i18n";
import { ArrowRight, Github } from "lucide-react";
import { Link } from "react-router-dom";

function DashboardWireframe() {
  return (
    <div
      style={{
        background: "#0d1f35",
        borderRadius: "12px",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset",
        overflow: "hidden",
      }}
      className="w-full"
    >
      {/* Browser titlebar */}
      <div
        style={{
          background: "#081525",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div className="w-2.5 h-2.5 rounded-full bg-red-400 flex-shrink-0" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 flex-shrink-0" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-400 flex-shrink-0" />
        <div
          style={{
            flex: 1,
            background: "#0a1a2e",
            borderRadius: "6px",
            height: "22px",
            marginLeft: "12px",
            display: "flex",
            alignItems: "center",
            padding: "0 10px",
            fontSize: "10px",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          app.attraccess.org/dashboard
        </div>
      </div>

      {/* Browser content */}
      <div className="p-4">
        <div className="flex gap-3" style={{ minHeight: "260px" }}>
          {/* Sidebar */}
          <div
            style={{
              width: "100px",
              background: "rgba(0,107,166,0.2)",
              borderRadius: "6px",
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <div style={{ fontSize: "7px", color: "rgba(255,255,255,0.2)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px", padding: "0 2px" }}>Menu</div>
            {[true, false, false, false, false].map((active, i) => (
              <div key={i} style={{ height: "14px", borderRadius: "3px", background: active ? "rgba(0,107,166,0.6)" : "rgba(255,255,255,0.08)" }} />
            ))}
            <div style={{ marginTop: "auto", paddingTop: "16px" }}>
              <div style={{ height: "26px", borderRadius: "3px", background: "rgba(242,112,0,0.3)" }} />
            </div>
          </div>

          {/* Main area */}
          <div className="flex-1 flex flex-col gap-2.5">
            <div style={{ fontSize: "9px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "rgba(255,255,255,0.5)", marginBottom: "2px" }}>
              Overview · Working Lab
            </div>

            {/* Stats row */}
            <div className="flex gap-2">
              {[
                { num: "24", label: "Machines" },
                { num: "142", label: "Members" },
                { num: "8", label: "Active Now", highlight: true },
              ].map((stat, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    background: stat.highlight ? "rgba(242,112,0,0.1)" : "rgba(0,107,166,0.15)",
                    border: `1px solid ${stat.highlight ? "rgba(242,112,0,0.4)" : "rgba(0,107,166,0.3)"}`,
                    borderRadius: "6px",
                    padding: "8px 10px",
                  }}
                >
                  <div style={{ fontSize: "14px", fontWeight: 700, color: stat.highlight ? "#f97316" : "#fff" }}>{stat.num}</div>
                  <div style={{ fontSize: "8px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Table */}
            <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: "6px", overflow: "hidden" }}>
              <div style={{ display: "flex", gap: "8px", padding: "6px 10px", background: "rgba(0,107,166,0.2)", fontSize: "8px", color: "rgba(255,255,255,0.5)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                <div style={{ flex: 1 }}>Machine</div>
                <div style={{ flex: 1 }}>User</div>
                <div>Status</div>
              </div>
              {[
                { machine: "Laser Cutter A", user: "Maria S.", status: "Active", active: true },
                { machine: "3D Printer #3", user: "Tobias K.", status: "Active", active: true },
                { machine: "CNC Router B", user: "—", status: "Idle", active: false },
                { machine: "Welding Bay 1", user: "Jonas R.", status: "Active", active: true },
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", gap: "8px", padding: "5px 10px", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: "9px", color: "rgba(255,255,255,0.6)", alignItems: "center" }}>
                  <div style={{ flex: 1 }}>{row.machine}</div>
                  <div style={{ flex: 1 }}>{row.user}</div>
                  <span style={{ padding: "2px 6px", borderRadius: "10px", fontSize: "7px", fontWeight: 600, background: row.active ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.1)", color: row.active ? "#4ade80" : "rgba(255,255,255,0.4)" }}>
                    {row.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Mini chart */}
            <div style={{ padding: "8px", borderRadius: "6px", background: "rgba(0,0,0,0.2)" }}>
              <div style={{ fontSize: "8px", color: "rgba(255,255,255,0.3)", marginBottom: "6px" }}>Weekly Usage</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "32px" }}>
                {[40, 65, 80, 55, 100, 45, 20].map((h, i) => (
                  <div key={i} style={{ flex: 1, borderRadius: "2px 2px 0 0", height: `${h}%`, background: i === 4 ? "rgba(242,112,0,0.7)" : "rgba(0,107,166,0.5)" }} />
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                <span style={{ fontSize: "7px", color: "rgba(255,255,255,0.2)" }}>Mon</span>
                <span style={{ fontSize: "7px", color: "rgba(255,255,255,0.2)" }}>Sun</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const { t } = useI18n();

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden pt-16"
      style={{ background: "linear-gradient(135deg, #003d5c 0%, #006ba6 60%, #004f7c 100%)" }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{ background: "rgba(0,107,166,0.2)" }} />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full blur-3xl" style={{ background: "rgba(242,112,0,0.1)" }} />
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <div className="flex flex-col gap-6">
            {/* License badge */}
            <div className="inline-flex items-center gap-1.5 w-fit px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.8)" }}>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
              {t("hero.badge")}
            </div>

            {/* Headline */}
            <h1 className="text-4xl xl:text-6xl font-black text-white leading-tight tracking-tight">
              {t("hero.title")}
            </h1>

            {/* Subtext */}
            <p className="text-lg leading-relaxed max-w-md" style={{ color: "rgba(255,255,255,0.65)" }}>
              {t("hero.subtitle")}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/contact">
                <Button
                  size="lg"
                  className="gap-2 font-semibold shadow-xl"
                  style={{ background: "hsl(var(--orange-accent))", color: "white", border: "none" }}
                >
                  <ArrowRight className="w-4 h-4" />
                  {t("hero.cta.primary")}
                </Button>
              </Link>
              <a
                href="https://github.com/attraccess/attraccess"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 font-semibold"
                  style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "white" }}
                >
                  <Github className="w-4 h-4" />
                  {t("hero.cta.secondary")}
                </Button>
              </a>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{t("hero.trusted-by")}</span>
              {["Working Lab", "TUHH", "Attraktor e.V."].map((name) => (
                <span key={name} className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>
                  {name}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Dashboard wireframe + floating badges — hidden on mobile */}
          <div className="hidden lg:flex relative justify-center items-center">
            {/* Floating badge 1 */}
            <div className="absolute -top-4 -left-4 z-10 animate-[float_3s_ease-in-out_infinite]">
              <div className="px-4 py-2 rounded-xl flex items-center gap-2 shadow-xl" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.2)" }}>
                <span className="font-black text-lg" style={{ color: "hsl(var(--orange-accent))" }}>{t("hero.stat1.number")}</span>
                <span className="text-xs leading-tight" style={{ color: "rgba(255,255,255,0.7)" }}>{t("hero.stat1.label")}</span>
              </div>
            </div>

            {/* Floating badge 2 */}
            <div className="absolute top-1/2 -right-4 z-10 animate-[float_3s_ease-in-out_1s_infinite]">
              <div className="px-4 py-2 rounded-xl flex items-center gap-2 shadow-xl" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.2)" }}>
                <span className="font-black text-lg text-green-400">{t("hero.stat2.number")}</span>
                <span className="text-xs leading-tight" style={{ color: "rgba(255,255,255,0.7)" }}>{t("hero.stat2.label")}</span>
              </div>
            </div>

            {/* Floating badge 3 */}
            <div className="absolute -bottom-4 left-1/3 z-10 animate-[float_3s_ease-in-out_2s_infinite]">
              <div className="px-4 py-2 rounded-xl flex items-center gap-2 shadow-xl" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.2)" }}>
                <span className="font-black text-lg" style={{ color: "hsl(var(--orange-accent))" }}>{t("hero.stat3.number")}</span>
                <span className="text-xs leading-tight" style={{ color: "rgba(255,255,255,0.7)" }}>{t("hero.stat3.label")}</span>
              </div>
            </div>

            <DashboardWireframe />
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, rgba(10,22,40,0.5))" }} />
    </section>
  );
}
