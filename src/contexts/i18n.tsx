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
    "pricing.contact-sales": "Contact Sales",
    "pricing.yearly-savings": "2 months free",
    "pricing.monthly": "Monthly",
    "pricing.yearly": "Yearly",
    "pricing.max-users": "Max Users",
    "pricing.max-resources": "Max Resources",
    "pricing.features": "Features",
    "pricing.support": "Support",
    "pricing.get-started": "Get Started",
    "pricing.contact-us": "Contact Us",
    
    // Plan names
    "pricing.community.title": "Community",
    "pricing.standard.title": "Standard", 
    "pricing.small-business.title": "Small Business",
    "pricing.business.title": "Business",
    "pricing.enterprise.title": "Enterprise",
    
    // Features
    "pricing.features.sso": "SSO",
    "pricing.features.maintenance": "Maintenance",
    "pricing.features.billing": "Billing",
    "pricing.features.nfc": "NFC Reader + Hardware",
    
    // Support levels
    "pricing.support.basic": "Basic",
    "pricing.support.standard": "Standard",
    "pricing.support.priority": "Priority", 
    "pricing.support.sla": "SLA",
    
    // Support tooltips
    "pricing.support.basic.tooltip": "GitHub Issues only",
    "pricing.support.standard.tooltip": "Email support (response within 48h)",
    "pricing.support.priority.tooltip": "Priority email support (response within 24h)", 
    "pricing.support.sla.tooltip": "Individual SLA agreement",
    
    // Feature tooltips
    "pricing.features.sso.tooltip": "Single Sign-On integration",
    "pricing.features.maintenance.tooltip": "Automated maintenance workflows",
    "pricing.features.billing.tooltip": "Usage-based billing system",
    "pricing.features.nfc.tooltip": "NFC Reader + Hardware rental available",
    
    // Other tooltips
    "pricing.max-resources.tooltip": "Resources with rented hardware don't count towards this quota and are 'free'",
    "pricing.faq.title": "Frequently Asked Questions",
    "pricing.faq.q1": "Is the source code really free?",
    "pricing.faq.a1":
      "Yes, Attraccess is source-available and free for non-profit and individual use.",
    "pricing.faq.q2": "What's included in the commercial pilot?",
    "pricing.faq.a2":
      "Full access to all features, dedicated onboarding support, and usage metrics analysis.",
    "pricing.faq.q3": "When will enterprise features be available?",
    "pricing.faq.a3":
      "Enterprise features including hybrid cloud SaaS are planned, contact us for more details.",
    "pricing.faq.q4": "Can I upgrade or downgrade anytime?",
    "pricing.faq.a4":
      "Yes, you can change your plan at any time. We'll help you migrate your data.",

    // Footer
    "footer.product": "Product",
    "footer.company": "Company",
    "footer.legal": "Legal",
    "footer.impressum": "Imprint",
    "footer.toggle.theme": "Toggle Dark Mode",
    "footer.copyright": "© 2024 Attraccess. All rights reserved.",

    // Impressum
    "impressum.title": "Imprint",
    "impressum.subtitle": "In compliance with German Telemedia Act § 5 TMG / Interstate Media Treaty § 18 MStV:",
    "impressum.owner": "Owner",
    "impressum.address": "Address",
    "impressum.email": "Email",
    "impressum.vat.notice": "Small business operator according to § 19 UStG – no VAT charged.",
    "impressum.owner.value": "Jan Jaap",
    "impressum.address.value": "Platanenallee 2a, 22529 Hamburg, Germany",

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
    "pricing.subtitle": "Wählen Sie den Plan, der zu Ihren Arbeitsplatz-Bedürfnissen passt",
    "pricing.popular": "Beliebteste",
    "pricing.contact-sales": "Vertrieb kontaktieren",
    "pricing.yearly-savings": "2 Monate kostenlos",
    "pricing.monthly": "Monatlich",
    "pricing.yearly": "Jährlich",
    "pricing.max-users": "Max. Benutzer",
    "pricing.max-resources": "Max. Ressourcen",
    "pricing.features": "Funktionen",
    "pricing.support": "Support",
    "pricing.get-started": "Jetzt starten",
    "pricing.contact-us": "Kontakt aufnehmen",
    
    // Plan names
    "pricing.community.title": "Community",
    "pricing.standard.title": "Standard",
    "pricing.small-business.title": "Small Business", 
    "pricing.business.title": "Business",
    "pricing.enterprise.title": "Enterprise",
    
    // Features
    "pricing.features.sso": "SSO",
    "pricing.features.maintenance": "Wartung",
    "pricing.features.billing": "Abrechnung",
    "pricing.features.nfc": "NFC Reader + Hardware",
    
    // Support levels
    "pricing.support.basic": "Basic",
    "pricing.support.standard": "Standard",
    "pricing.support.priority": "Priority",
    "pricing.support.sla": "SLA",
    
    // Support tooltips
    "pricing.support.basic.tooltip": "Nur GitHub Issues",
    "pricing.support.standard.tooltip": "E-Mail Support (Antwort innerhalb von 48h)",
    "pricing.support.priority.tooltip": "Prioritärer E-Mail Support (Antwort innerhalb von 24h)",
    "pricing.support.sla.tooltip": "Individuelles SLA-Agreement",
    
    // Feature tooltips  
    "pricing.features.sso.tooltip": "Single Sign-On Integration",
    "pricing.features.maintenance.tooltip": "Automatisierte Wartungsabläufe",
    "pricing.features.billing.tooltip": "Nutzungsbasierte Abrechnungssystem",
    "pricing.features.nfc.tooltip": "NFC Reader + Hardware-Miete verfügbar",
    
    // Other tooltips
    "pricing.max-resources.tooltip": "Resourcen mit gemieteter Hardware zählen nicht in dieses Kontingent und sind 'umsonst'",
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
    "footer.legal": "Rechtliches",
    "footer.impressum": "Impressum",
    "footer.toggle.theme": "Dunkelmodus umschalten",
    "footer.copyright": "© 2024 Attraccess. Alle Rechte vorbehalten.",

    // Impressum
    "impressum.title": "Impressum",
    "impressum.subtitle": "Angaben gem. § 5 TMG / § 18 MStV:",
    "impressum.owner": "Name",
    "impressum.address": "Anschrift",
    "impressum.email": "E-Mail",
    "impressum.vat.notice": "Kleinunternehmer gemäß § 19 UStG – keine Umsatzsteuer ausgewiesen.",
    "impressum.owner.value": "Jan Jaap",
    "impressum.address.value": "Platanenallee 2a, 22529 Hamburg, Deutschland",

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
