import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "de";

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.features": "Features",
    "nav.how-it-works": "How It Works",
    "nav.pricing": "Pricing",
    "nav.contact": "Contact",
    "nav.demo": "Request Demo",
    "nav.docs": "Documentation",
    // Hero Section
    "hero.title": "Automate, Track & Secure Your Shared Workspace",
    "hero.subtitle":
      "Attraccess gives you fine-grained control over every machine, door, and tool—plus usage billing, maintenance automation, and custom workflows.",
    "hero.cta.primary": "Request Demo",
    "hero.cta.secondary": "Explore Features",

    // Problems Section
    // Benefits Section
    "benefits.title": "Why Attraccess?",
    "benefits.access.title": "Instant Access Control",
    "benefits.access.description":
      "Manage permissions per user, per resource—no more keys or signup sheets.",
    "benefits.revenue.title": "Usage-Based Revenue",
    "benefits.revenue.description":
      "Track every session automatically and bill accurately by the minute.",
    "benefits.maintenance.title": "Zero Downtime Maintenance",
    "benefits.maintenance.description":
      "Auto-lockout on maintenance triggers; notify technicians instantly.",
    "benefits.automation.title": "Visual Automations",
    "benefits.automation.description":
      "Build custom workflows with drag-and-drop logic—no code required.",

    // Features Section
    "features.title": "Complete Workspace Management",
    "features.access.title": "Access Control",
    "features.access.description":
      "Tap an NFC card, scan a QR code, or use the PWA to instantly unlock machines, doors, and lockers. Assign 'introduced' or 'isIntroducer' permissions in seconds.",
    "features.flows.title": "Flow-Based Automations",
    "features.flows.description":
      "Use our drag-and-drop builder to send MQTT messages, webhooks, emails, or push notifications. Build loops, variables, and conditionals with ease.",
    "features.security.title": "Integrations & Security",
    "features.security.description":
      "On-prem Docker deployment with optional managed cloud coming soon. OIDC SSO, TLS encryption, auto-updating NFC reader firmware.",
    "features.cta": "Request a Demo",

    // How It Works Section
    "how-it-works.title": "Simple Setup, Powerful Results",
    "how-it-works.subtitle":
      "Get your workspace automation running in 5 simple steps",
    "how-it-works.step1.title": "Define Resources",
    "how-it-works.step1.description":
      "Create machines, doors, and tools in the PWA. Add name, description, image, and documentation link.",
    "how-it-works.step2.title": "Assign Access",
    "how-it-works.step2.description":
      "Grant 'introduced' or 'isIntroducer' permissions via PWA, NFC, or OIDC users.",
    "how-it-works.step3.title": "Deploy & Use",
    "how-it-works.step3.description":
      "Install NFC readers, print QR labels, or share PWA links. Users tap, scan, or click to start sessions.",
    "how-it-works.step4.title": "Track & Automate",
    "how-it-works.step4.description":
      "Monitor live sessions, export CSV logs, and trigger custom workflows like ventilation or email alerts.",
    "how-it-works.step5.title": "Maintain & Scale",
    "how-it-works.step5.description":
      "Set maintenance rules, auto-disable resources, notify technicians, and roll out new readers via firmware OTA.",

    // Pricing Section
    "pricing.title": "Flexible Pricing for Every Organization",
    "pricing.subtitle": "Choose the plan that fits your workspace needs",
    "pricing.popular": "Most Popular",
    "pricing.nonprofit.title": "Non-Profit & Individual",
    "pricing.nonprofit.price": "€0 / forever",
    "pricing.nonprofit.feature1": "Source-available & free",
    "pricing.nonprofit.feature2": "Unlimited users & resources",
    "pricing.nonprofit.feature3": "Community support",
    "pricing.pilot.title": "Commercial Pilot",
    "pricing.pilot.price": "Free 3-month trial",
    "pricing.pilot.feature1": "Onboarding support",
    "pricing.pilot.feature2": "Usage metrics review",
    "pricing.pilot.feature3": "Priority bug fixes",
    "pricing.pilot.feature4": "Custom deployment assistance",
    "pricing.pilot.cta": "Apply for Pilot",
    "pricing.enterprise.title": "Enterprise (Coming Soon)",
    "pricing.enterprise.feature1": "Hybrid cloud SaaS",
    "pricing.enterprise.feature2": "SLA & premium support",
    "pricing.enterprise.feature3": "Custom integrations",
    "pricing.enterprise.feature4": "Advanced analytics",

    // Pricing
    "pricing.contact-sales": "Contact Sales",
    "pricing.faq.title": "Frequently Asked Questions",
    "pricing.faq.q1": "Is the source code really free?",
    "pricing.faq.a1":
      "Yes, Attraccess is source-available and free for non-profit and individual use.",
    "pricing.faq.q2": "What's included in the commercial pilot?",
    "pricing.faq.a2":
      "Full access to all features, dedicated onboarding support, and usage metrics analysis.",
    "pricing.faq.q3": "When will enterprise features be available?",
    "pricing.faq.a3":
      "Enterprise features including hybrid cloud SaaS are coming in Q2 2024.",
    "pricing.faq.q4": "Can I upgrade or downgrade anytime?",
    "pricing.faq.a4":
      "Yes, you can change your plan at any time. We'll help you migrate your data.",

    // Footer
    "footer.product": "Product",
    "footer.company": "Company",
    "footer.toggle.theme": "Toggle Dark Mode",
    "footer.copyright": "© 2024 Attraccess. All rights reserved.",

    // Contact
    "contact.title": "Get Started Today",
    "contact.subtitle":
      "Ready to transform your workspace? Let's talk about your specific needs.",
    "contact.form.title": "Get in Touch",
    "contact.form.name": "Name",
    "contact.form.email": "Email",
    "contact.form.organization": "Organization",
    "contact.form.role": "Role",
    "contact.form.usecase": "Use Case",
    "contact.form.usecase.placeholder": "Describe your workspace",
    "contact.form.submit": "Submit",
    "contact.info.title": "Contact Information",
    "contact.info.email": "Email",
    "contact.info.address": "Address",
    "contact.email.subject": "Inquiry about Attraccess",

    // About
    "about.mission":
      "Empowering shared workspaces with enterprise-grade control—without the complexity.",
  },
  de: {
    // Navigation
    "nav.home": "Home",
    "nav.features": "Funktionen",
    "nav.how-it-works": "So funktioniert's",
    "nav.pricing": "Preise",
    "nav.contact": "Kontakt",
    "nav.demo": "Demo anfragen",
    "nav.docs": "Dokumentation",
    // Hero Section
    "hero.title":
      "Automatisieren, Verfolgen & Sichern Sie Ihre Maschinen, Türen und Werkzeuge",
    "hero.subtitle":
      "Attraccess bietet detaillierte Kontrolle über jede Maschine, Tür und jedes Werkzeug – inklusive Nutzungsabrechnung, Wartungsautomatisierung und individuelle Workflows.",
    "hero.cta.primary": "Demo anfragen",
    "hero.cta.secondary": "Funktionen ansehen",

    // Problems Section
    // Benefits Section
    "benefits.title": "Warum Attraccess?",
    "benefits.access.title": "Sofortige Zugriffssteuerung",
    "benefits.access.description":
      "Vergaben Sie Berechtigungen pro Benutzer und Ressource – keine Schlüssel oder Listen mehr.",
    "benefits.revenue.title": "Umsatz nach Nutzung",
    "benefits.revenue.description":
      "Erfassen Sie jede Sitzung automatisch und berechnen Sie minutengenau.",
    "benefits.maintenance.title": "Keine Ausfallzeiten",
    "benefits.maintenance.description":
      "Automatische Sperrung bei Wartungsbedarf; Techniker sofort benachrichtigen.",
    "benefits.automation.title": "Visuelle Automatisierungen",
    "benefits.automation.description":
      "Erstellen Sie individuelle Abläufe per Drag-and-Drop – ganz ohne Code.",

    // Features Section
    "features.title": "Komplette Arbeitsplatz-Verwaltung",
    "features.access.title": "Zugriffssteuerung",
    "features.access.description":
      "Tippen Sie eine NFC-Karte, scannen Sie einen QR-Code oder nutzen Sie die PWA, um Maschinen, Türen und Schränke sofort zu entriegeln. Weisen Sie 'introduced'- oder 'isIntroducer'-Berechtigungen in Sekunden zu.",
    "features.flows.title": "Visuelle Automatisierungen",
    "features.flows.description":
      "Verwenden Sie unseren Drag-and-Drop-Editor, um MQTT-Nachrichten, Webhooks, E-Mails oder Push-Benachrichtigungen zu senden. Erstellen Sie Schleifen, Variablen und Bedingungen ganz einfach.",
    "features.security.title": "Integrationen & Sicherheit",
    "features.security.description":
      "On-Prem-Docker-Bereitstellung mit optionaler Managed-Cloud bald verfügbar. OIDC-SSO, TLS-Verschlüsselung, automatische Firmware-Updates für NFC-Leser.",
    "features.cta": "Demo anfordern",

    // How It Works Section
    "how-it-works.title": "Einfache Einrichtung, Starke Ergebnisse",
    "how-it-works.subtitle":
      "Bringen Sie Ihre Arbeitsplatz-Automatisierung in 5 einfachen Schritten zum Laufen",
    "how-it-works.step1.title": "Ressourcen definieren",
    "how-it-works.step1.description":
      "Erstellen Sie Maschinen, Türen und Werkzeuge in der PWA. Fügen Sie Name, Beschreibung, Bild und Dokumentationslink hinzu.",
    "how-it-works.step2.title": "Zugriffe zuweisen",
    "how-it-works.step2.description":
      "Weisen Sie 'introduced'- oder 'isIntroducer'-Berechtigungen per PWA, NFC oder OIDC-Benutzern zu.",
    "how-it-works.step3.title": "Ausrollen & Nutzen",
    "how-it-works.step3.description":
      "Installieren Sie NFC-Leser, drucken Sie QR-Etiketten aus oder teilen Sie PWA-Links. Nutzer tippen, scannen oder klicken, um Sitzungen zu starten.",
    "how-it-works.step4.title": "Verfolgen & Automatisieren",
    "how-it-works.step4.description":
      "Überwachen Sie Live-Sitzungen, exportieren Sie CSV-Protokolle und lösen Sie benutzerdefinierte Workflows aus, z. B. Belüftung oder E-Mail-Benachrichtigungen.",
    "how-it-works.step5.title": "Warten & Skalieren",
    "how-it-works.step5.description":
      "Legen Sie Wartungsregeln fest, sperren Sie Ressourcen automatisch, benachrichtigen Sie Techniker und verteilen Sie neue Firmware-Updates OTA.",
    "how-it-works.ready.title": "Bereit anzufangen?",
    "how-it-works.ready.subtitle":
      "Unsere Ingenieure helfen Ihnen dabei, Ihre perfekte Arbeitsplatz-Automatisierung einzurichten.",

    // Pricing Section
    "pricing.title": "Flexible Preise für jede Organisation",
    "pricing.subtitle":
      "Wählen Sie den Plan, der zu Ihren Arbeitsplatz-Bedürfnissen passt",
    "pricing.popular": "Beliebteste",
    "pricing.nonprofit.title": "Non-Profit & Privat",
    "pricing.nonprofit.price": "€0 / für immer",
    "pricing.nonprofit.feature1": "Quelloffen & kostenlos",
    "pricing.nonprofit.feature2": "Unbegrenzte Benutzer & Ressourcen",
    "pricing.nonprofit.feature3": "Community-Support",
    "pricing.pilot.title": "Kommerzieller Pilot",
    "pricing.pilot.price": "Kostenlose 3-Monats-Testversion",
    "pricing.pilot.feature1": "Onboarding-Support",
    "pricing.pilot.feature2": "Nutzungsmetriken-Review",
    "pricing.pilot.feature3": "Prioritäre Fehlerbehebung",
    "pricing.pilot.feature4": "Individuelle Bereitstellungshilfe",
    "pricing.pilot.cta": "Pilot beantragen",
    "pricing.enterprise.title": "Enterprise (Bald)",
    "pricing.enterprise.feature1": "Hybrid-Cloud-SaaS",
    "pricing.enterprise.feature2": "SLA & Premium-Support",
    "pricing.enterprise.feature3": "Individuelle Integrationen",
    "pricing.enterprise.feature4": "Erweiterte Analytik",

    // Pricing
    "pricing.contact-sales": "Vertrieb kontaktieren",
    "pricing.faq.title": "Häufig gestellte Fragen",
    "pricing.faq.q1": "Ist das Projekt Open Source?",
    "pricing.faq.a1":
      "Nein, Attraccess ist Source-Available mit einem kostenlosen Lizenzmodell für Non-Profit- und Einzelnutzung.",
    "pricing.faq.q2": "Was ist im kommerziellen Pilot enthalten?",
    "pricing.faq.a2":
      "Vollzugriff auf alle Features, dedizierter Onboarding-Support und Nutzungsmetriken-Analyse.",
    "pricing.faq.q3": "Wann werden Enterprise-Features verfügbar sein?",
    "pricing.faq.a3":
      "Enterprise-Features einschließlich Hybrid-Cloud-SaaS sind in planung, kontaktieren Sie uns für mehr Informationen.",
    "pricing.faq.q4": "Kann ich jederzeit upgraden oder downgraden?",
    "pricing.faq.a4":
      "Ja, Sie können Ihren Plan jederzeit ändern. Wir helfen Ihnen bei der Datenmigration.",

    "footer.product": "Produkt",
    "footer.company": "Unternehmen",
    "footer.toggle.theme": "Dunkelmodus umschalten",
    "footer.copyright": "© 2024 Attraccess. Alle Rechte vorbehalten.",

    // Contact
    "contact.title": "Starten Sie noch heute",
    "contact.subtitle":
      "Bereit, Ihren Arbeitsbereich zu transformieren? Lassen Sie uns über Ihre spezifischen Bedürfnisse sprechen.",
    "contact.form.title": "Kontakt aufnehmen",
    "contact.form.name": "Name",
    "contact.form.email": "E-Mail",
    "contact.form.organization": "Organisation",
    "contact.form.role": "Position",
    "contact.form.usecase": "Anwendungsfall",
    "contact.form.usecase.placeholder": "Beschreiben Sie Ihren Arbeitsbereich",
    "contact.form.submit": "Absenden",
    "contact.info.title": "Kontaktinformationen",
    "contact.info.email": "E-Mail",
    "contact.info.address": "Adresse",
    "contact.email.subject": "Anfrage zu Attraccess",

    // About
    "about.mission":
      "Wir ermöglichen Gemeinschaftsarbeitsplätze mit Zugangs-Kontrolle – ohne Komplexität.",
  },
};

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    // Detect browser language
    const browserLang = navigator.language.split("-")[0] as Language;
    if (browserLang === "de" || browserLang === "en") {
      setLanguage(browserLang);
    }
  }, []);

  const t = (key: string): string => {
    const translation =
      translations[language][
        key as keyof (typeof translations)[typeof language]
      ];
    return translation || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
