import { useState } from "react";
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
  X,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { useI18n } from "@/contexts/i18n";
import { useTheme } from "@/contexts/theme";
import { useSEO } from "@/hooks/use-seo";
import { trackEvent } from "@/lib/analytics";

// eslint-disable-next-line react-refresh/only-export-components
export const marketingCopy = {
  de: {
    nav: ["System", "Ablauf", "Einsatzfelder", "Pilot"],
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
    privacy: "Datenschutz", terms: "AGB",
  },
  en: {
    nav: ["System", "Control loop", "Use cases", "Pilot"],
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
    privacy: "Privacy", terms: "Terms",
  },
} as const;

export type PageCopy = (typeof marketingCopy)[keyof typeof marketingCopy];

export function MarketingHeader({ c }: { c: PageCopy }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { language, setLanguage } = useI18n();
  const { actualTheme, setTheme } = useTheme();
  const navigationLinks = ["/#system", "/#loop", "/#use-cases", "/#pilot"];

  return (
    <header className="prototype-header prototype-header--dossier">
      <Link to="/" className="prototype-logo" aria-label="Attraccess home">
        <Logo />
      </Link>
      <nav aria-label="Primary navigation">
        {c.nav.map((item, index) => (
          <a key={item} href={navigationLinks[index]}>
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
        <button
          className="prototype-menu"
          aria-controls="home-mobile-navigation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>
      <div id="home-mobile-navigation" className="prototype-mobile-navigation" hidden={!menuOpen}>
        <nav aria-label="Mobile navigation">
          {c.nav.map((item, index) => (
            <a key={item} href={navigationLinks[index]} onClick={() => setMenuOpen(false)}>
              {item}
            </a>
          ))}
          <Link className="prototype-header__cta" to="/contact" onClick={() => setMenuOpen(false)}>
            {c.cta}<ArrowRight />
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function MarketingFooter({ c }: { c: PageCopy }) {
  return (
    <footer className="prototype-footer prototype-footer--dossier">
      <div className="prototype-footer__mark">AA</div>
      <p>{c.footer}</p>
      <div className="prototype-footer__links">
        <a href="https://github.com/attraccess/attraccess" target="_blank" rel="noreferrer"><Github /> GitHub</a>
        <Link to="/datenschutz">{c.privacy}</Link>
        <Link to="/agb">{c.terms}</Link>
        <span>Hamburg, DE</span>
      </div>
    </footer>
  );
}

function PilotButton({ c }: { c: PageCopy }) {
  return <Link to="/contact" className="prototype-button">{c.cta}<ArrowRight /></Link>;
}

export function Home() {
  const { language } = useI18n();
  useSEO({
    title: language === "de" ? "Maschinenfreigabe für gemeinsame Werkstätten" : "Machine authorization for shared workshops",
    description: language === "de" ? "Attraccess verbindet Identität, Einweisung und Maschinenfreigabe in einem nachvollziehbaren Ablauf für gemeinsam genutzte Werkstätten." : "Attraccess connects identity, training and machine authorization in a traceable workflow for shared workshops.",
    canonicalPath: "/",
  });
  const c = language === "de" ? marketingCopy.de : marketingCopy.en;

  return (
    <div className="prototype-homepage">
      <div className="prototype prototype-dossier prototype-dossier-v2">
        <MarketingHeader c={c} />
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
              <div className="calm-product-stage__session"><span /><b>{language === "de" ? "Session aktiv" : "Session active"}</b><small>CNC-04 · 00:42:16</small></div>
            </div>
          </section>

          <section className="calm-product-loop" id="loop">
            <div className="calm-section-heading"><p className="prototype-eyebrow"><span />{language === "de" ? "Vom Scan zur Session" : "From scan to session"}</p><h2>{language === "de" ? "Vier Schritte. Ein zusammenhängender Ablauf." : "Four steps. One connected workflow."}</h2></div>
            <div>{c.loop.map(([number, title, text], index) => <article key={number}><span>{index === 0 ? <ScanLine /> : index === 1 ? <ShieldCheck /> : index === 2 ? <CircleDot /> : <Wrench />}</span><b>{number}</b><h3>{title}</h3><p>{text}</p></article>)}</div>
          </section>

          <section className="calm-product-proof" id="operations">
            <div><p className="prototype-eyebrow"><span />{language === "de" ? "Technischer Fit" : "Technical fit"}</p><h2>{c.proofTitle}</h2><p>{c.proofIntro}</p></div>
            <div className="calm-product-proof__list">{c.proof.map(([title, text]) => <article key={title}><Check /><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
          </section>

          <section className="calm-use-cases" id="use-cases" aria-labelledby="use-cases-title">
            <div className="calm-section-heading">
              <p className="prototype-eyebrow"><span />{language === "de" ? "Einsatzfelder" : "Use cases"}</p>
              <h2 id="use-cases-title">{language === "de" ? "Ein Ablauf, passend für verschiedene Werkstattrealitäten." : "One workflow, adapted to different workshop realities."}</h2>
            </div>
            <div className="calm-use-cases__grid">
              {(language === "de" ? [
                ["Hochschulen & Forschung", "Einweisungen, Rollen und Aufsicht bleiben an der Maschine nachvollziehbar - auch bei wechselnden Kursen, Projekten und Nutzergruppen."],
                ["Makerspaces & Fab Labs", "Regeln werden am Einsatzort geprüft. Teams sehen echte Nutzung und organisieren Maschinenbetrieb ohne separate Listen."],
                ["Industrie & Ausbildung", "Maschinenpools und Trainingsflächen erhalten einen klaren Freigabeablauf, der Verantwortlichkeiten und Nutzung zusammenführt."],
              ] : [
                ["Universities & research", "Training, roles and supervision remain traceable at the machine, even with changing courses, projects and user groups."],
                ["Makerspaces & fab labs", "Rules are evaluated at the point of use. Teams see actual usage and operate machines without separate lists."],
                ["Industry & training", "Machine pools and training areas receive a clear release workflow that brings responsibilities and usage together."],
              ]).map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p><a href="#pilot">{language === "de" ? "Pilot besprechen" : "Discuss a pilot"}<ChevronRight /></a></article>)}
            </div>
          </section>

          <section className="calm-boundary"><ShieldCheck /><div><strong>{c.boundaryTitle}</strong><p>{c.boundary}</p></div></section>

          <section className="calm-product-pilot" id="pilot">
            <div><p className="prototype-eyebrow"><span />{language === "de" ? "Gemeinsam prüfen" : "Assess together"}</p><h2>{c.pilotTitle}</h2><p>{c.pilotText}</p></div>
            <div><ul>{c.pilotPoints.map((point) => <li key={point}><Check />{point}</li>)}</ul><PilotButton c={c} /></div>
          </section>

          <section className="calm-newsletter" aria-labelledby="newsletter-title">
            <div><p className="prototype-eyebrow"><span />Newsletter</p><h2 id="newsletter-title">{language === "de" ? "Produkt- und Betriebsupdates erhalten" : "Receive product and operations updates"}</h2><p>{language === "de" ? "Gelegentliche Hinweise zu Verfügbarkeit, Weiterentwicklung und dem Betrieb gemeinsamer Werkstätten. Kein Blog-Abo." : "Occasional notes on availability, product development and operating shared workshops. Not a blog subscription."}</p></div>
            <form method="post" action="https://listmonk.attraccess.org/subscription/form" onSubmit={() => trackEvent("newsletter-subscribe")}>
              <input type="hidden" name="nonce" />
              <label><span>{language === "de" ? "E-Mail-Adresse" : "Email address"}</span><input type="email" name="email" required autoComplete="email" /></label>
              <label><span>{language === "de" ? "Name (optional)" : "Name (optional)"}</span><input type="text" name="name" autoComplete="name" /></label>
              <input type="hidden" name="l" value={language === "de" ? "d21f9904-1a25-4ad7-8e7b-24379133163f" : "9764fb4c-fddd-43eb-9eaf-5c7c3265940e"} />
              <label className="calm-newsletter__consent"><input type="checkbox" required /> <span>{language === "de" ? "Ich willige ein, dass meine Angaben für den Newsletter verarbeitet werden." : "I consent to my details being processed for the newsletter."} <Link to="/datenschutz">{c.privacy}</Link>.</span></label>
              <button type="submit" className="prototype-button">{language === "de" ? "Updates abonnieren" : "Subscribe to updates"}<ArrowRight /></button>
              <p className="calm-newsletter__note">{language === "de" ? "Bestätigung per E-Mail, Abmeldung jederzeit möglich." : "Confirmation by email. Unsubscribe at any time."}</p>
            </form>
          </section>
        </main>
        <MarketingFooter c={c} />
      </div>
    </div>
  );
}
