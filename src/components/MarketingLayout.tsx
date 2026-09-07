import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Github, Menu, Moon, Sun, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useI18n } from "@/contexts/i18n";
import { useTheme } from "@/contexts/theme";

// eslint-disable-next-line react-refresh/only-export-components
export const marketingCopy = {
  de: {
    nav: ["System", "Ablauf", "Einsatzfelder", "Pilot"],
    cta: "3-Maschinen-Pilot planen",
    eyebrow: "Maschinenfreigabe für gemeinsam genutzte Werkstätten",
    proof: [
      ["Identität", "SAML, OIDC, Passkeys und bestehende Rollen"],
      ["Maschine", "NFC-Leser, HTTP, MQTT und Shelly"],
      ["Betrieb", "Aufsicht, Wartung, Abrechnung und Automationen"],
      ["Infrastruktur", "Self-hosted und quelloffen einsehbar"],
    ],
    boundaryTitle: "Klare Systemgrenze",
    boundary: "Attraccess ist eine betriebliche Autorisierungsschicht. Das System ersetzt keine Schutzvorrichtung, Not-Halt-Einrichtung, Gefährdungsbeurteilung oder vorgeschriebene Unterweisung.",
    pilotText: "Wir wählen drei repräsentative Maschinen, definieren Freigabe- und Fehlerverhalten und testen den vollständigen Ablauf mit Werkstattleitung, IT und Arbeitssicherheit.",
    footer: "Maschinenautorisierung und Nutzungskontrolle für Lehre, Forschung und geteilte Werkstätten.",
    privacy: "Datenschutz", terms: "AGB",
  },
  en: {
    nav: ["System", "Control loop", "Use cases", "Pilot"],
    cta: "Plan a 3-machine pilot",
    eyebrow: "Machine authorization for shared workshops",
    proof: [
      ["Identity", "SAML, OIDC, passkeys and existing roles"],
      ["Machine", "NFC readers, HTTP, MQTT and Shelly"],
      ["Operations", "Supervision, maintenance, billing and automation"],
      ["Infrastructure", "Self-hosted and source-available"],
    ],
    boundaryTitle: "A clear system boundary",
    boundary: "Attraccess is an operational authorization layer. It does not replace guarding, emergency stops, risk assessments or legally required instruction.",
    pilotText: "We select three representative machines, define release and failure behavior, and test the complete workflow with workshop management, IT and safety stakeholders.",
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

  useEffect(() => {
    function close(event: KeyboardEvent) { if (event.key === "Escape") setMenuOpen(false); }
    if (menuOpen) window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menuOpen]);

  return <header className="prototype-header prototype-header--dossier">
    <Link to="/" className="prototype-logo" aria-label="Attraccess home"><Logo /></Link>
    <nav aria-label={language === "de" ? "Hauptnavigation" : "Primary navigation"}>{c.nav.map((item, index) => <a key={item} href={navigationLinks[index]}>{item}</a>)}</nav>
    <div className="prototype-header__tools">
      <button onClick={() => setLanguage(language === "de" ? "en" : "de")} aria-label={language === "de" ? "Switch to English" : "Auf Deutsch wechseln"}>{language === "de" ? "EN" : "DE"}</button>
      <button onClick={() => setTheme(actualTheme === "light" ? "dark" : "light")} aria-pressed={actualTheme === "dark"} aria-label={language === "de" ? "Farbschema ändern" : "Change color scheme"}>{actualTheme === "light" ? <Moon /> : <Sun />}</button>
      <Link className="prototype-header__cta" to="/contact">{c.cta}<ArrowRight /></Link>
      <button className="prototype-menu" aria-controls="home-mobile-navigation" aria-expanded={menuOpen} aria-label={language === "de" ? menuOpen ? "Menü schließen" : "Menü öffnen" : menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
    </div>
    <div id="home-mobile-navigation" className="prototype-mobile-navigation" hidden={!menuOpen}>
      <nav aria-label={language === "de" ? "Mobile Navigation" : "Mobile navigation"}>{c.nav.map((item, index) => <a key={item} href={navigationLinks[index]} onClick={() => setMenuOpen(false)}>{item}</a>)}<Link className="prototype-header__cta" to="/contact" onClick={() => setMenuOpen(false)}>{c.cta}<ArrowRight /></Link></nav>
    </div>
  </header>;
}

export function MarketingFooter({ c }: { c: PageCopy }) {
  return <footer className="prototype-footer prototype-footer--dossier">
    <div className="prototype-footer__mark">AA</div><p>{c.footer}</p>
    <div className="prototype-footer__links"><a href="https://github.com/attraccess/attraccess" target="_blank" rel="noreferrer"><Github /> GitHub</a><Link to="/datenschutz">{c.privacy}</Link><Link to="/agb">{c.terms}</Link><span>Hamburg, DE</span></div>
  </footer>;
}
