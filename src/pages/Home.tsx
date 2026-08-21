import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ChevronRight,
  CircleDot,
  Github,
  Menu,
  Moon,
  ScanLine,
  ShieldCheck,
  Sun,
  Wrench,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { useI18n } from "@/contexts/i18n";
import { useTheme } from "@/contexts/theme";
import { useSEO } from "@/hooks/use-seo";

const copy = {
  de: {
    nav: ["System", "Ablauf", "Einsatz", "Pilot"],
    cta: "3-Maschinen-Pilot planen",
    eyebrow: "Maschinenfreigabe für gemeinsam genutzte Werkstätten",
    headline: "Berechtigung, die bis zur Maschine reicht.",
    intro:
      "Attraccess prüft aktuelle Einweisungen direkt am Einsatzort, steuert die konfigurierte Freigabe und protokolliert die echte Nutzung.",
    secondary: "Regelkreis ansehen",
    loop: [
      ["01", "Identifizieren", "Karte oder Anwendung identifiziert die Person."],
      ["02", "Prüfen", "Einweisung, Aufsicht, Rolle und Wartungsstatus werden geprüft."],
      ["03", "Freigeben", "Die Entscheidung erreicht den konfigurierten Schaltpunkt."],
      ["04", "Dokumentieren", "Nutzung, Projekt, Dauer und Aufsicht werden erfasst."],
    ],
    proofTitle: "Gebaut für den Betrieb, nicht für die Präsentation.",
    proofIntro:
      "Bestehende Identität, reale Maschinennutzung und Werkstattprozesse bleiben in einem nachvollziehbaren System verbunden.",
    proof: [
      ["Identität", "SAML, OIDC, Passkeys und bestehende Rollen"],
      ["Maschine", "NFC-Leser, HTTP, MQTT und Shelly"],
      ["Betrieb", "Aufsicht, Wartung, Abrechnung und Automationen"],
      ["Infrastruktur", "Self-hosted und quelloffen einsehbar"],
    ],
    boundaryTitle: "Klare Systemgrenze",
    boundary:
      "Attraccess ist eine betriebliche Autorisierungsschicht. Das System ersetzt keine Schutzvorrichtung, Not-Halt-Einrichtung, Gefährdungsbeurteilung oder vorgeschriebene Unterweisung.",
    pilotTitle: "Drei Maschinen. 90 Tage. Eine belastbare Entscheidung.",
    pilotText:
      "Wir wählen drei repräsentative Maschinen, definieren Freigabe- und Fehlerverhalten und testen den vollständigen Ablauf mit Werkstattleitung, IT und Arbeitssicherheit.",
    pilotPoints: ["3–5 repräsentative Maschinen", "Technischer Fit vor der Installation", "Auswertung mit vereinbarten Kriterien"],
    footer: "Maschinenautorisierung und Nutzungskontrolle für Lehre, Forschung und geteilte Werkstätten.",
  },
  en: {
    nav: ["System", "Control loop", "Deployment", "Pilot"],
    cta: "Plan a 3-machine pilot",
    eyebrow: "Machine authorization for shared workshops",
    headline: "Authorization that reaches the machine.",
    intro:
      "Attraccess checks current training at the point of use, controls the configured release and records the real session.",
    secondary: "See the control loop",
    loop: [
      ["01", "Identify", "A card or application identifies the person."],
      ["02", "Evaluate", "Training, supervision, role and maintenance state are checked."],
      ["03", "Apply", "The decision reaches the configured control point."],
      ["04", "Record", "Usage, project, duration and supervision are captured."],
    ],
    proofTitle: "Built for operations, not presentations.",
    proofIntro:
      "Existing identity, actual machine use and workshop processes remain connected in one traceable system.",
    proof: [
      ["Identity", "SAML, OIDC, passkeys and existing roles"],
      ["Machine", "NFC readers, HTTP, MQTT and Shelly"],
      ["Operations", "Supervision, maintenance, billing and automation"],
      ["Infrastructure", "Self-hosted and source-available"],
    ],
    boundaryTitle: "A clear system boundary",
    boundary:
      "Attraccess is an operational authorization layer. It does not replace guarding, emergency stops, risk assessments or legally required instruction.",
    pilotTitle: "Three machines. 90 days. One defensible decision.",
    pilotText:
      "We select three representative machines, define release and failure behavior, and test the complete workflow with workshop management, IT and safety stakeholders.",
    pilotPoints: ["3–5 representative machines", "Technical fit before installation", "Review against agreed criteria"],
    footer: "Machine authorization and usage control for teaching, research and shared workshops.",
  },
} as const;

type PageCopy = (typeof copy)[keyof typeof copy];

function HomeHeader({ c }: { c: PageCopy }) {
  const { language, setLanguage } = useI18n();
  const { actualTheme, setTheme } = useTheme();

  return (
    <header className="prototype-header prototype-header--dossier">
      <Link to="/" className="prototype-logo" aria-label="Attraccess home">
        <Logo />
      </Link>
      <nav aria-label="Primary navigation">
        {c.nav.map((item, index) => (
          <a key={item} href={["#system", "#loop", "#deployment", "#pilot"][index]}>
            {item}
          </a>
        ))}
      </nav>
      <div className="prototype-header__tools">
        <button onClick={() => setLanguage(language === "de" ? "en" : "de")} aria-label="Change language">
          {language === "de" ? "EN" : "DE"}
        </button>
        <button onClick={() => setTheme(actualTheme === "light" ? "dark" : "light")} aria-label="Change color scheme">
          {actualTheme === "light" ? <Moon /> : <Sun />}
        </button>
        <Link className="prototype-header__cta" to="/contact">
          {c.cta}<ArrowRight />
        </Link>
        <button className="prototype-menu" aria-label="Open menu"><Menu /></button>
      </div>
    </header>
  );
}

function HomeFooter({ c }: { c: PageCopy }) {
  return (
    <footer className="prototype-footer prototype-footer--dossier">
      <div className="prototype-footer__mark">AA</div>
      <p>{c.footer}</p>
      <div className="prototype-footer__links">
        <a href="https://github.com/attraccess/attraccess" target="_blank" rel="noreferrer"><Github /> GitHub</a>
        <Link to="/datenschutz">Datenschutz</Link>
        <Link to="/agb">AGB</Link>
        <span>Hamburg, DE</span>
      </div>
    </footer>
  );
}

function PilotButton({ c }: { c: PageCopy }) {
  return <Link to="/contact" className="prototype-button">{c.cta}<ArrowRight /></Link>;
}

export function Home() {
  useSEO({ canonicalPath: "/" });
  const { language } = useI18n();
  const c = language === "de" ? copy.de : copy.en;

  return (
    <div className="prototype-homepage">
      <div className="prototype prototype-dossier prototype-dossier-v2">
        <HomeHeader c={c} />
        <main>
          <section className="calm-product-hero" id="system">
            <div className="calm-product-hero__copy">
              <p className="prototype-eyebrow"><span />{c.eyebrow}</p>
              <h1>{c.headline}</h1>
              <p className="prototype-lede">{c.intro}</p>
              <div className="prototype-actions"><PilotButton c={c} /><a href="#loop">{c.secondary}<ChevronRight /></a></div>
            </div>
            <div className="calm-product-stage">
              <div className="calm-product-stage__screen"><img src="/hero/app-screenshot.png" alt="Attraccess resource overview" /></div>
              <div className="calm-product-stage__reader"><img src="/features/reader.webp" alt="Attraccess NFC reader" /></div>
              <div className="calm-product-stage__session"><span /><b>Session aktiv</b><small>CNC-04 · 00:42:16</small></div>
            </div>
          </section>

          <section className="calm-product-loop" id="loop">
            <div className="calm-section-heading"><p className="prototype-eyebrow"><span />Vom Scan zur Session</p><h2>Vier Schritte. Ein zusammenhängender Ablauf.</h2></div>
            <div>{c.loop.map(([number, title, text], index) => <article key={number}><span>{index === 0 ? <ScanLine /> : index === 1 ? <ShieldCheck /> : index === 2 ? <CircleDot /> : <Wrench />}</span><b>{number}</b><h3>{title}</h3><p>{text}</p></article>)}</div>
          </section>

          <section className="calm-product-proof" id="deployment">
            <div><p className="prototype-eyebrow"><span />Technischer Fit</p><h2>{c.proofTitle}</h2><p>{c.proofIntro}</p></div>
            <div className="calm-product-proof__list">{c.proof.map(([title, text]) => <article key={title}><Check /><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
          </section>

          <section className="calm-boundary"><ShieldCheck /><div><strong>{c.boundaryTitle}</strong><p>{c.boundary}</p></div></section>

          <section className="calm-product-pilot" id="pilot">
            <div><p className="prototype-eyebrow"><span />Gemeinsam prüfen</p><h2>{c.pilotTitle}</h2><p>{c.pilotText}</p></div>
            <div><ul>{c.pilotPoints.map((point) => <li key={point}><Check />{point}</li>)}</ul><PilotButton c={c} /></div>
          </section>
        </main>
        <HomeFooter c={c} />
      </div>
    </div>
  );
}
