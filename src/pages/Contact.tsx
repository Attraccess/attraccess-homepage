import { useState } from "react";
import { ArrowRight, Check, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { MarketingFooter, MarketingHeader, marketingCopy } from "@/pages/Home";
import { useI18n } from "@/contexts/i18n";
import { trackEvent } from "@/lib/analytics";
import { useSEO } from "@/hooks/use-seo";

const copy = {
  de: { eyebrow: "Pilot besprechen", title: "Lassen Sie uns den Einsatz an Ihren Maschinen prüfen.", intro: "Ein Pilot beginnt mit repräsentativen Maschinen, Ihren Rollen und vorhandenen Abläufen. Den technischen Fit klären wir vor einer Installation.", form: "Pilot anfragen", submit: "E-Mail vorbereiten", privacy: "Beim Absenden öffnet sich Ihr E-Mail-Programm. Ihre Eingaben werden nicht an unsere Website übertragen.", sent: "Wir haben Ihr E-Mail-Programm mit einer vorbereiteten Nachricht angefordert. Falls nichts passiert, schreiben Sie direkt an contact@attraccess.org.", next: "Was als Nächstes passiert", steps: ["Sie schildern kurz Ihre Ausgangslage.", "Wir prüfen gemeinsam Maschinen, Schnittstellen und Zuständigkeiten.", "Sie entscheiden anhand vereinbarter Kriterien über den Pilot."] },
  en: { eyebrow: "Discuss a pilot", title: "Let's assess the fit for your machines.", intro: "A pilot starts with representative machines, your roles and existing workflows. We clarify technical fit before any installation.", form: "Request a pilot", submit: "Prepare email", privacy: "Submitting opens your email app. Your entries are not sent to this website.", sent: "We requested your email app with a prepared message. If nothing opens, email contact@attraccess.org directly.", next: "What happens next", steps: ["You briefly describe your starting point.", "Together, we assess machines, interfaces and responsibilities.", "You decide on the pilot against agreed criteria."] },
} as const;

export function Contact() {
  const { language } = useI18n();
  const locale = language === "de" ? "de" : "en";
  useSEO({ title: locale === "de" ? "Pilot planen" : "Plan a pilot", description: locale === "de" ? "Planen Sie einen fokussierten Attraccess-Pilot für gemeinsam genutzte Maschinen und Werkstattabläufe." : "Plan a focused Attraccess pilot for shared machines and workshop operations.", canonicalPath: "/contact" });
  const c = copy[locale];
  const marketing = marketingCopy[locale];
  const [submitted, setSubmitted] = useState(false);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent(locale === "de" ? "Pilotanfrage Attraccess" : "Attraccess pilot inquiry");
    const body = encodeURIComponent(`Name: ${data.get("name")}\nOrganization: ${data.get("organization")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`);
    trackEvent("contact-submit");
    setSubmitted(true);
    window.location.href = `mailto:contact@attraccess.org?subject=${subject}&body=${body}`;
  }

  return <div className="prototype-homepage"><div className="prototype prototype-dossier prototype-dossier-v2">
    <MarketingHeader c={marketing} />
    <main className="contact-page">
      <section className="contact-intro"><p className="prototype-eyebrow"><span />{c.eyebrow}</p><h1>{c.title}</h1><p>{c.intro}</p></section>
      <section className="contact-grid">
        <form className="contact-form" onSubmit={submit} aria-describedby="contact-privacy"><h2>{c.form}</h2>
          <label><span>{locale === "de" ? "Name" : "Name"}</span><input name="name" required autoComplete="name" /></label>
          <label><span>{locale === "de" ? "Organisation" : "Organization"}</span><input name="organization" required autoComplete="organization" /></label>
          <label><span>{locale === "de" ? "E-Mail-Adresse" : "Email address"}</span><input name="email" type="email" required autoComplete="email" /></label>
          <label><span>{locale === "de" ? "Worum geht es?" : "What would you like to discuss?"}</span><textarea name="message" required rows={5} placeholder={locale === "de" ? "Zum Beispiel Maschinen, Nutzergruppen oder bestehende Prozesse." : "For example machines, user groups or existing workflows."} /></label>
          <button className="prototype-button" type="submit">{c.submit}<ArrowRight /></button><p id="contact-privacy">{c.privacy} <Link to="/datenschutz">{marketing.privacy}</Link>.</p>
          {submitted && <p className="contact-form__success" role="status"><Check />{c.sent}</p>}
        </form>
        <aside className="contact-aside"><Mail /><h2>{c.next}</h2><ol>{c.steps.map((step) => <li key={step}>{step}</li>)}</ol><a href="mailto:contact@attraccess.org">contact@attraccess.org</a></aside>
      </section>
    </main>
    <MarketingFooter c={marketing} />
  </div></div>;
}
