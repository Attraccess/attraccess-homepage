import { Link } from "react-router-dom";
import { MarketingFooter, MarketingHeader, marketingCopy } from "@/pages/Home";
import { useI18n } from "@/contexts/i18n";
import { useSEO } from "@/hooks/use-seo";

const NotFound = () => {
  useSEO({ title: "Page not found", noindex: true });
  const { language } = useI18n();
  const locale = language === "de" ? "de" : "en";
  const c = marketingCopy[locale];
  return <div className="prototype-homepage"><div className="prototype prototype-dossier prototype-dossier-v2">
    <MarketingHeader c={c} />
    <main className="contact-page"><section className="contact-intro"><p className="prototype-eyebrow"><span />404</p><h1>{locale === "de" ? "Diese Seite gibt es nicht." : "This page does not exist."}</h1><p>{locale === "de" ? "Zurück zur Übersicht der Maschinenfreigabe und zum Pilot." : "Return to the machine authorization overview and pilot."}</p><Link className="prototype-button" to="/">{locale === "de" ? "Zur Startseite" : "Back to home"}</Link></section></main>
    <MarketingFooter c={c} />
  </div></div>;
};

export default NotFound;
