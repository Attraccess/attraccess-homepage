// The <I18nProvider> lives in ./i18n-provider so this module exports no
// components — that keeps react-refresh happy and lets consumers import
// useI18n() without pulling the whole dictionary through a component module.
import { createContext, useContext } from "react";

export type Language = "en" | "de" | "fr" | "nl";

export const languageNames: Record<Language, string> = {
  en: "English",
  de: "Deutsch",
  fr: "Français",
  nl: "Nederlands",
};

export interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const I18nContext = createContext<I18nContextType | undefined>(undefined);

// NOTE: scripts/check-translations.cjs and scripts/i18n-complete.test.mjs slice
// this object out of the file by matching its declaration line and closing
// brace as raw text — keep both formatted exactly as they are.
export const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.features": "Features",
    "nav.how-it-works": "How It Works",
    "nav.pricing": "Pricing",
    "nav.contact": "Contact",
    "nav.demo": "Request Demo",
    "nav.cta": "Try 30 days",
    "nav.docs": "Documentation",
    "nav.blog": "Blog",

    // Features Section — Bento Grid
    "features.title": "Everything you need to manage resource access",
    "features.label": "Features",
    "features.access.title": "NFC Access Control",
    "features.access.description":
      "Tap any NFC card or badge to unlock machines instantly. Works with standard MIFARE and ISO 14443 cards. Also supports QR codes and PWA-based access.",
    "features.access.bullet1": "Works with standard NFC cards & wristbands",
    "features.access.bullet2": "Real-time relay control (GPIO, HTTP, MQTT)",
    "features.access.bullet3": "Shelly device integration supported",
    "features.flows.title": "Automation Flows",
    "features.flows.description":
      "Trigger actions when resources start, stop, or are accessed. Send MQTT messages, webhooks, emails, or push notifications with a visual flow builder.",
    "features.flows.node1": "NFC Tap",
    "features.flows.node2": "Notify",
    "features.flows.node3": "Log",
    "features.analytics.title": "Session Logs & CSV Export",
    "features.analytics.description":
      "Every resource session is logged automatically. Export usage history to CSV at any time for reporting or billing.",
    "features.maintenance.title": "Maintenance Workflows",
    "features.maintenance.description":
      "Set usage-based maintenance intervals per resource. Attraccess auto-locks resources when maintenance is due and notifies your technicians.",
    "features.maintenance.status1": "Laser Cutter — due in 3 uses",
    "features.maintenance.status2": "3D Printer — locked for maintenance",
    "features.maintenance.status3": "CNC Router — OK",
    "features.rbac.title": "Per-Resource Permissions",
    "features.rbac.description":
      "Grant per-resource access with two permission levels: introduced (can use) and isIntroducer (can authorize others). Controlled individually per resource.",
    "features.rbac.admin": "isIntroducer — can authorize others",
    "features.rbac.trainer": "introduced — can use the resource",
    "features.rbac.member": "no access — blocked",
    "features.selfhosted.title": "Self-Hosted & Source-Available",
    "features.selfhosted.description":
      "Your data never leaves your servers. Deploy with Docker on any hardware. The Prosperity Public License means free for non-profits, with commercial licensing available.",
    "features.selfhosted.deploy": "docker compose up",
    "features.selfhosted.license": "Prosperity Public License 3.0",
    "features.cta": "Request a Demo",

    // How It Works Section
    "how-it-works.title": "Get up and running in minutes",
    "how-it-works.subtitle":
      "From zero to full resource access control — no custom firmware, no engineering degree required.",
    "how-it-works.step1.title": "Define Resources",
    "how-it-works.step1.description":
      "Add each machine, door, or tool as a resource in the dashboard. Give it a name, description, and upload a photo. Set requirements — like requiring training before access is granted.",
    "how-it-works.step2.title": "Assign Access",
    "how-it-works.step2.description":
      "Register NFC cards for each member and grant access to specific resources. Set training completion status and permission levels per resource.",
    "how-it-works.step3.title": "Deploy & Use",
    "how-it-works.step3.description":
      "Install an NFC reader or Shelly device next to each resource. Members tap their card — access is verified in milliseconds and the relay activates.",
    "how-it-works.step4.title": "Track & Automate",
    "how-it-works.step4.description":
      "Monitor live sessions, export CSV logs, and trigger custom automation flows for notifications, ventilation, or any webhook.",
    "how-it-works.step5.title": "Maintain & Scale",
    "how-it-works.step5.description":
      "Set maintenance rules, auto-disable resources when maintenance is due, and notify technicians. Roll out firmware updates to NFC readers over the air.",

    // Pricing Section
    "pricing.title": "Flexible Pricing for Every Organization",
    "pricing.subtitle": "Choose the plan that fits your workspace needs",
    "pricing.popular": "Most Popular",
    "pricing.contact-sales": "Contact Sales",
    "pricing.yearly-savings": "2 months free",
    "pricing.monthly": "Monthly",
    "pricing.yearly": "Yearly",
    "pricing.per-month": "/month",
    "pricing.per-year": "/year",
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
    "pricing.features.nfc": "NFC Reader",
    
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
    "pricing.features.nfc.tooltip": "NFC Reader for seamless authentication",
    
    // Other tooltips
    "pricing.max-resources.tooltip": "Resources with rented hardware don't count towards this quota and are 'free'",

    // Footer
    "footer.impressum": "Imprint",
    "footer.privacy": "Privacy",
    "footer.toggle.theme": "Toggle Dark Mode",
    "footer.copyright": "© 2024 Attraccess. All rights reserved.",

    // Impressum
    "impressum.title": "Imprint",

    // Contact
    "contact.title": "Get Started Today",
    "contact.subtitle":
      "Ready to transform your workspace? Let's talk about your specific needs.",
    "contact.form.title": "Get in Touch",
    "contact.form.name": "Name",
    "contact.form.name.placeholder": "Your name",
    "contact.form.email": "Email",
    "contact.form.email.placeholder": "you@example.com",
    "contact.form.organization": "Organization",
    "contact.form.organization.placeholder": "Your organization",
    "contact.form.role": "Role",
    "contact.form.role.placeholder": "Your role",
    "contact.form.message": "Your Message",
    "contact.form.message.placeholder":
      "How can we help? Tell us about your inquiry.",
    "contact.form.submit": "Submit",
    "contact.info.title": "Contact Information",
    "contact.info.email": "Email",
    "contact.info.address": "Address",
    "contact.email.subject": "Inquiry about Attraccess",
    "contact.email.body": `Hello,

I'm interested in learning more about Attraccess. Here are my details:

Name: {name}
Email: {email}
Organization: {organization}
Role: {role}

Message:
{message}

Best regards,
{name}`,

    // MakerFaire Hannover announcement banner
    "banner.makerfaire.visit": "Visit us at",
    "banner.makerfaire.event": "Maker Faire Hannover",
    "banner.makerfaire.when": "August 15–16, 2026 · Hannover",
    "banner.makerfaire.where": "Eilenriedehalle, booth 135",
    "banner.makerfaire.cta": "Book an appointment",
    "banner.makerfaire.close": "Close",

    // Homepage (brand redesign)
    "home.badge": "Source available · Free for non-profits",
    "home.hero.title.line1": "No permission,",
    "home.hero.title.line2": "no power.",
    "home.hero.subtitle":
      "Physical access control for shared machines. A machine only starts once an authorized, trained person scans their card. Impossible to bypass. Fully documented.",
    "home.hero.cta.primary": "Try 30 days for free",
    "home.hero.cta.secondary": "How it works",
    "home.hero.note": "No credit card · GDPR-compliant · Made in Hamburg",
    "home.hero.chip.available": "Available",
    "home.hero.chip.maintenance": "In maintenance",
    "home.hero.window": "Resources · Live status",

    "home.chips.lock": "Impossible to bypass",
    "home.chips.simple": "No IT skills needed",
    "home.chips.onprem": "On-premise & GDPR-compliant",
    "home.chips.source": "Source available",
    "home.chips.hardware": "Hardware for rent",
    "home.chips.dguv": "DGUV-compliant records",
    "home.chips.logs": "Complete usage logs",
    "home.chips.nonprofit": "Free for non-profits",

    "home.problem.label": "The problem",
    "home.problem.title": "A sign doesn't stop a machine.",
    "home.problem.subtitle":
      "Notices, trust and spreadsheets protect neither people nor revenue. Attraccess makes authorization physically enforceable.",
    "home.problem.liability.title": "Cover your liability",
    "home.problem.liability.text":
      "When an accident happens, only one question matters: was the person verifiably trained? Attraccess documents every safety briefing automatically — DGUV-compliant and court-proof. Anyone without training can't even start the machine.",
    "home.problem.liability.window": "Training records",
    "home.problem.revenue.title": "Protect your revenue",
    "home.problem.revenue.text":
      "Paid machines only run for authorized users. No free rides, no arguments — every session is recorded and can be billed.",
    "home.problem.revenue.window": "Usage session with billing",

    "home.how.label": "How it works",
    "home.how.title": "Scan your card. Machine runs. Done.",
    "home.how.step1.title": "Scan",
    "home.how.step1.text": "Hold your card to the Attractap next to the machine.",
    "home.how.step2.title": "Verify",
    "home.how.step2.text": "The system checks in real time: authorized and trained?",
    "home.how.step3.title": "Unlock",
    "home.how.step3.text": "The switch box releases the power — the machine starts.",
    "home.how.step4.title": "Log",
    "home.how.step4.text": "Every use is fully recorded in the dashboard.",
    "home.how.chip": "Attractap · Card scanned",
    "home.how.window": "Resource · Overview",
    "home.how.float.title": "Power released",
    "home.how.float.subtitle": "Session is being logged",

    "home.features.label": "Everything in view",
    "home.features.title": "From the workshop tablet to your smartphone.",
    "home.features.subtitle":
      "Runs in the browser, no installation — administration, maintenance and billing in one place.",
    "home.features.maintenance.title": "Plan maintenance",
    "home.features.maintenance.text":
      "Maintenance KPIs and intervals at a glance — before a machine breaks down.",
    "home.features.logs.title": "Document everything",
    "home.features.logs.text":
      "Every session in the usage log — who, when, how long, court-proof.",
    "home.features.mobile.title": "In your pocket",
    "home.features.mobile.text":
      "Book resources, end sessions and check credit — from your phone, no app install required.",

    "home.nonprofit.title": "Non-profit? Free.",
    "home.nonprofit.text":
      "Non-profit organizations use the self-hosted software free of charge, forever — source available under the Prosperity Public License. Only commercial use is paid. Hardware and support can be added optionally.",

    "home.pricing.label": "Pricing",
    "home.pricing.title": "Fair. Transparent. No upfront investment.",
    "home.pricing.subtitle": "All prices net, per year. Hardware conveniently for rent.",
    "home.pricing.nonprofit.name": "Non-Profit",
    "home.pricing.nonprofit.price": "€0",
    "home.pricing.nonprofit.period": "forever",
    "home.pricing.nonprofit.desc": "If you're a non-profit, you're in. Period.",
    "home.pricing.nonprofit.item1": "Self-hosted software, free forever",
    "home.pricing.nonprofit.item2": "All features included",
    "home.pricing.nonprofit.item3": "Source available (Prosperity License)",
    "home.pricing.nonprofit.item4": "Hardware & support optional",
    "home.pricing.nonprofit.cta": "Get started for free",
    "home.pricing.community.name": "Community",
    "home.pricing.community.price": "from €900",
    "home.pricing.community.period": "/ year",
    "home.pricing.community.badge": "Popular",
    "home.pricing.community.desc": "For small commercial workshops and makerspaces.",
    "home.pricing.community.item1": "All core features",
    "home.pricing.community.item2": "Training & usage records",
    "home.pricing.community.item3": "Guided onboarding included",
    "home.pricing.community.item4": "Hardware conveniently for rent",
    "home.pricing.community.cta": "Try 30 days for free",
    "home.pricing.standard.name": "Standard",
    "home.pricing.standard.price": "€3,500",
    "home.pricing.standard.period": "/ year",
    "home.pricing.standard.desc": "For companies with many machines and users.",
    "home.pricing.standard.item1": "Everything in Community",
    "home.pricing.standard.item2": "Priority support",
    "home.pricing.standard.item3": "Billing & credit",
    "home.pricing.standard.item4": "SLA with guaranteed response time",
    "home.pricing.standard.cta": "Request a consultation",
    "home.pricing.note": "Questions about the right license? We're happy to advise, no strings attached.",

    "home.newsletter.title": "Stay in the loop",
    "home.newsletter.text":
      "General news about Attraccess — a few times a year, no spam. Pick the language you want to hear from us in.",
    "home.newsletter.email": "E-mail",
    "home.newsletter.name": "Name (optional)",
    "home.newsletter.lists": "Languages",
    "home.newsletter.submit": "Subscribe",
    "home.newsletter.note": "You'll receive a confirmation e-mail. Unsubscribe anytime with one click.",

    "home.cta.title.line1": "Ready when",
    "home.cta.title.line2": "you are.",
    "home.cta.text":
      "In the browser, no installation — from the workshop tablet to your smartphone. Hosted on-premise and GDPR-compliant.",
    "home.cta.primary": "Start for free now",
  },
  de: {
    // Navigation
    "nav.home": "Home",
    "nav.features": "Funktionen",
    "nav.how-it-works": "So funktioniert's",
    "nav.pricing": "Preise",
    "nav.contact": "Kontakt",
    "nav.demo": "Demo anfragen",
    "nav.cta": "30 Tage testen",
    "nav.docs": "Dokumentation",
    "nav.blog": "Blog",

    // Features Section — Bento Grid
    "features.title": "Alles, was Sie zur Ressourcenverwaltung brauchen",
    "features.label": "Funktionen",
    "features.access.title": "NFC-Zugangskontrolle",
    "features.access.description":
      "Tippen Sie eine NFC-Karte oder ein Armband, um Maschinen sofort zu entsperren. Kompatibel mit Standard MIFARE- und ISO 14443-Karten. Unterstützt auch QR-Codes und PWA-Zugang.",
    "features.access.bullet1": "Kompatibel mit Standard-NFC-Karten & Armbändern",
    "features.access.bullet2": "Echtzeit-Relaissteuerung (GPIO, HTTP, MQTT)",
    "features.access.bullet3": "Shelly-Geräte-Integration unterstützt",
    "features.flows.title": "Automatisierungs-Flows",
    "features.flows.description":
      "Aktionen auslösen, wenn Ressourcen gestartet, gestoppt oder abgerufen werden. MQTT, Webhooks, E-Mails oder Push-Benachrichtigungen mit einem visuellen Flow-Builder.",
    "features.flows.node1": "NFC-Tap",
    "features.flows.node2": "Benachrichtigen",
    "features.flows.node3": "Protokollieren",
    "features.analytics.title": "Sitzungsprotokolle & CSV-Export",
    "features.analytics.description":
      "Jede Ressourcennutzung wird automatisch protokolliert. Exportieren Sie den Verlauf jederzeit als CSV für Berichte oder Abrechnung.",
    "features.maintenance.title": "Wartungs-Workflows",
    "features.maintenance.description":
      "Legen Sie nutzungsbasierte Wartungsintervalle pro Ressource fest. Attraccess sperrt Ressourcen automatisch bei Wartungsbedarf und benachrichtigt Techniker.",
    "features.maintenance.status1": "Lasercutter — in 3 Nutzungen fällig",
    "features.maintenance.status2": "3D-Drucker — für Wartung gesperrt",
    "features.maintenance.status3": "CNC-Fräse — OK",
    "features.rbac.title": "Ressourcenbezogene Berechtigungen",
    "features.rbac.description":
      "Gewähren Sie ressourcenbezogenen Zugang mit zwei Ebenen: introduced (kann nutzen) und isIntroducer (kann andere autorisieren). Individuell pro Ressource steuerbar.",
    "features.rbac.admin": "isIntroducer — kann andere autorisieren",
    "features.rbac.trainer": "introduced — kann die Ressource nutzen",
    "features.rbac.member": "kein Zugang — gesperrt",
    "features.selfhosted.title": "Self-Hosted & Source-Available",
    "features.selfhosted.description":
      "Ihre Daten verlassen nie Ihre Server. Mit Docker auf beliebiger Hardware deployen. Die Prosperity Public License bedeutet: kostenlos für Non-Profits, kommerzielle Lizenzierung verfügbar.",
    "features.selfhosted.deploy": "docker compose up",
    "features.selfhosted.license": "Prosperity Public License 3.0",
    "features.cta": "Demo anfordern",

    // How It Works Section
    "how-it-works.title": "In wenigen Minuten startklar",
    "how-it-works.subtitle":
      "Von null zur vollständigen Ressourcenzugangskontrolle – ohne eigene Firmware, ohne Ingenieurdiplom.",
    "how-it-works.step1.title": "Ressourcen definieren",
    "how-it-works.step1.description":
      "Fügen Sie jede Maschine, Tür oder jedes Werkzeug als Ressource im Dashboard hinzu. Geben Sie Namen, Beschreibung und Foto an. Legen Sie Anforderungen fest – z. B. dass eine Einweisung erforderlich ist.",
    "how-it-works.step2.title": "Zugriffe zuweisen",
    "how-it-works.step2.description":
      "Registrieren Sie NFC-Karten für jedes Mitglied und gewähren Sie Zugang zu bestimmten Ressourcen. Legen Sie Einweisungsstatus und Berechtigungsstufen pro Ressource fest.",
    "how-it-works.step3.title": "Ausrollen & Nutzen",
    "how-it-works.step3.description":
      "Installieren Sie einen NFC-Leser oder ein Shelly-Gerät neben jeder Ressource. Mitglieder tippen ihre Karte – der Zugang wird in Millisekunden geprüft und das Relais aktiviert.",
    "how-it-works.step4.title": "Verfolgen & Automatisieren",
    "how-it-works.step4.description":
      "Überwachen Sie Live-Sitzungen, exportieren Sie CSV-Protokolle und lösen Sie Automatisierungs-Flows für Benachrichtigungen, Belüftung oder Webhooks aus.",
    "how-it-works.step5.title": "Warten & Skalieren",
    "how-it-works.step5.description":
      "Legen Sie Wartungsregeln fest, sperren Sie Ressourcen bei Wartungsbedarf automatisch und benachrichtigen Sie Techniker. Verteilen Sie Firmware-Updates OTA an NFC-Leser.",

    // Pricing Section
    "pricing.title": "Flexible Preise für jede Organisation",
    "pricing.subtitle": "Wählen Sie den Plan, der zu Ihren Arbeitsplatz-Bedürfnissen passt",
    "pricing.popular": "Beliebteste",
    "pricing.contact-sales": "Vertrieb kontaktieren",
    "pricing.yearly-savings": "2 Monate kostenlos",
    "pricing.monthly": "Monatlich",
    "pricing.yearly": "Jährlich",
    "pricing.per-month": "/Monat",
    "pricing.per-year": "/Jahr",
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
    "pricing.features.nfc": "NFC Reader",
    
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
    "pricing.features.nfc.tooltip": "NFC Reader für einfache Authentifizierung",
    
    // Other tooltips
    "pricing.max-resources.tooltip": "Resourcen mit gemieteter Hardware zählen nicht in dieses Kontingent und sind 'umsonst'",

    "footer.impressum": "Impressum",
    "footer.privacy": "Datenschutz",
    "footer.toggle.theme": "Dunkelmodus umschalten",
    "footer.copyright": "© 2024 Attraccess. Alle Rechte vorbehalten.",

    // Impressum
    "impressum.title": "Impressum",

    // Contact
    "contact.title": "Starten Sie noch heute",
    "contact.subtitle":
      "Bereit, Ihren Arbeitsbereich zu transformieren? Lassen Sie uns über Ihre spezifischen Bedürfnisse sprechen.",
    "contact.form.title": "Kontakt aufnehmen",
    "contact.form.name": "Name",
    "contact.form.name.placeholder": "Ihr Name",
    "contact.form.email": "E-Mail",
    "contact.form.email.placeholder": "sie@beispiel.de",
    "contact.form.organization": "Organisation",
    "contact.form.organization.placeholder": "Ihre Organisation",
    "contact.form.role": "Position",
    "contact.form.role.placeholder": "Ihre Position",
    "contact.form.message": "Ihre Nachricht",
    "contact.form.message.placeholder":
      "Wie können wir helfen? Beschreiben Sie Ihre Anfrage.",
    "contact.form.submit": "Absenden",
    "contact.info.title": "Kontaktinformationen",
    "contact.info.email": "E-Mail",
    "contact.info.address": "Adresse",
    "contact.email.subject": "Anfrage zu Attraccess",
    "contact.email.body": `Hallo,

ich interessiere mich für Attraccess und würde gerne mehr erfahren. Hier sind meine Angaben:

Name: {name}
E-Mail: {email}
Organisation: {organization}
Position: {role}

Nachricht:
{message}

Mit freundlichen Grüßen,
{name}`,

    // MakerFaire Hannover announcement banner
    "banner.makerfaire.visit": "Besuchen Sie uns auf der",
    "banner.makerfaire.event": "Maker Faire Hannover",
    "banner.makerfaire.when": "15.–16. August 2026 in Hannover",
    "banner.makerfaire.where": "Eilenriedehalle, Stand 135",
    "banner.makerfaire.cta": "Jetzt Termin vereinbaren",
    "banner.makerfaire.close": "Schließen",

    // Homepage (brand redesign)
    "home.badge": "Source Available · für Non-Profits kostenlos",
    "home.hero.title.line1": "Nur wer darf,",
    "home.hero.title.line2": "kann.",
    "home.hero.subtitle":
      "Physische Zugangskontrolle für geteilte Maschinen. Die Maschine startet erst, wenn eine berechtigte, eingewiesene Person ihre Karte scannt. Nicht umgehbar. Lückenlos dokumentiert.",
    "home.hero.cta.primary": "30 Tage kostenlos testen",
    "home.hero.cta.secondary": "So funktioniert's",
    "home.hero.note": "Ohne Kreditkarte · DSGVO-konform · Made in Hamburg",
    "home.hero.chip.available": "Verfügbar",
    "home.hero.chip.maintenance": "In Wartung",
    "home.hero.window": "Ressourcen · Live-Status",

    "home.chips.lock": "Nicht umgehbar",
    "home.chips.simple": "Kein IT-Wissen nötig",
    "home.chips.onprem": "On-Premise & DSGVO-konform",
    "home.chips.source": "Source Available",
    "home.chips.hardware": "Hardware zur Miete",
    "home.chips.dguv": "DGUV-konforme Nachweise",
    "home.chips.logs": "Lückenlose Protokolle",
    "home.chips.nonprofit": "Für Non-Profits kostenlos",

    "home.problem.label": "Das Problem",
    "home.problem.title": "Ein Zettel hält keine Maschine an.",
    "home.problem.subtitle":
      "Aushänge, Vertrauen und Excel-Listen schützen weder Menschen noch Umsatz. Attraccess macht Berechtigung physisch durchsetzbar.",
    "home.problem.liability.title": "Haftung absichern",
    "home.problem.liability.text":
      "Kommt es zum Unfall, zählt nur eine Frage: War die Person nachweislich eingewiesen? Attraccess dokumentiert jede Einweisung automatisch – DGUV-konform und gerichtsfest. Wer nicht eingewiesen ist, bekommt die Maschine gar nicht erst an.",
    "home.problem.liability.window": "Einweisungsnachweis",
    "home.problem.revenue.title": "Umsatz schützen",
    "home.problem.revenue.text":
      "Kostenpflichtige Maschinen laufen nur für berechtigte Nutzer. Keine Gratis-Nutzung, keine Diskussionen – jede Sitzung wird erfasst und lässt sich abrechnen.",
    "home.problem.revenue.window": "Nutzungssitzung mit Abrechnung",

    "home.how.label": "So funktioniert's",
    "home.how.title": "Karte scannen. Maschine läuft. Fertig.",
    "home.how.step1.title": "Scannen",
    "home.how.step1.text": "Karte an den Attractap neben der Maschine halten.",
    "home.how.step2.title": "Prüfen",
    "home.how.step2.text": "Das System prüft in Echtzeit: berechtigt und eingewiesen?",
    "home.how.step3.title": "Freigeben",
    "home.how.step3.text": "Die Schaltbox gibt den Strom frei – die Maschine startet.",
    "home.how.step4.title": "Protokollieren",
    "home.how.step4.text": "Jede Nutzung landet lückenlos im Dashboard.",
    "home.how.chip": "Attractap · Karte gescannt",
    "home.how.window": "Ressource · Übersicht",
    "home.how.float.title": "Strom freigegeben",
    "home.how.float.subtitle": "Sitzung wird protokolliert",

    "home.features.label": "Alles im Blick",
    "home.features.title": "Vom Werkstatt-Tablet bis zum Smartphone.",
    "home.features.subtitle":
      "Läuft im Browser, ohne Installation – Verwaltung, Wartung und Abrechnung an einem Ort.",
    "home.features.maintenance.title": "Wartung planen",
    "home.features.maintenance.text":
      "Wartungs-KPIs und Intervalle auf einen Blick – bevor eine Maschine ausfällt.",
    "home.features.logs.title": "Lückenlos dokumentieren",
    "home.features.logs.text":
      "Jede Sitzung im Nutzungsprotokoll – wer, wann, wie lange, gerichtsfest.",
    "home.features.mobile.title": "In der Hosentasche",
    "home.features.mobile.text":
      "Ressourcen buchen, Sitzungen beenden und Guthaben prüfen – vom Smartphone, ganz ohne App-Installation.",

    "home.nonprofit.title": "Gemeinnützig? Kostenlos.",
    "home.nonprofit.text":
      "Wer gemeinnützig arbeitet, nutzt die selbst-gehostete Software dauerhaft gratis – Source Available unter der Prosperity Public License. Bezahlt wird nur die gewerbliche Nutzung. Hardware und Support optional dazubuchbar.",

    "home.pricing.label": "Preise",
    "home.pricing.title": "Fair. Transparent. Ohne Kapitaleinsatz.",
    "home.pricing.subtitle": "Alle Preise netto, pro Jahr. Hardware bequem zur Miete.",
    "home.pricing.nonprofit.name": "Non-Profit",
    "home.pricing.nonprofit.price": "0 €",
    "home.pricing.nonprofit.period": "für immer",
    "home.pricing.nonprofit.desc": "Wer gemeinnützig ist, darf. Punkt.",
    "home.pricing.nonprofit.item1": "Selbst-gehostete Software, dauerhaft gratis",
    "home.pricing.nonprofit.item2": "Alle Funktionen inklusive",
    "home.pricing.nonprofit.item3": "Source Available (Prosperity License)",
    "home.pricing.nonprofit.item4": "Hardware & Support optional",
    "home.pricing.nonprofit.cta": "Kostenlos loslegen",
    "home.pricing.community.name": "Community",
    "home.pricing.community.price": "ab 900 €",
    "home.pricing.community.period": "/ Jahr",
    "home.pricing.community.badge": "Beliebt",
    "home.pricing.community.desc": "Für kleine gewerbliche Werkstätten und Makerspaces.",
    "home.pricing.community.item1": "Alle Kernfunktionen",
    "home.pricing.community.item2": "Einweisungs- & Nutzungsnachweise",
    "home.pricing.community.item3": "Onboarding-Begleitung inklusive",
    "home.pricing.community.item4": "Hardware bequem zur Miete",
    "home.pricing.community.cta": "30 Tage kostenlos testen",
    "home.pricing.standard.name": "Standard",
    "home.pricing.standard.price": "3.500 €",
    "home.pricing.standard.period": "/ Jahr",
    "home.pricing.standard.desc": "Für Unternehmen mit vielen Maschinen und Nutzern.",
    "home.pricing.standard.item1": "Alles aus Community",
    "home.pricing.standard.item2": "Priorisierter Support",
    "home.pricing.standard.item3": "Abrechnung & Guthaben",
    "home.pricing.standard.item4": "SLA mit garantierter Reaktionszeit",
    "home.pricing.standard.cta": "Beratung anfragen",
    "home.pricing.note": "Fragen zur passenden Lizenz? Wir beraten unverbindlich.",

    "home.newsletter.title": "Bleib auf dem Laufenden",
    "home.newsletter.text":
      "Allgemeine News rund um Attraccess – ein paar Mal im Jahr, kein Spam. Wähle die Sprache, in der du von uns hören möchtest.",
    "home.newsletter.email": "E-Mail",
    "home.newsletter.name": "Name (optional)",
    "home.newsletter.lists": "Sprachen",
    "home.newsletter.submit": "Abonnieren",
    "home.newsletter.note": "Du erhältst eine Bestätigungs-E-Mail. Abmeldung jederzeit mit einem Klick.",

    "home.cta.title.line1": "Bereit, wenn",
    "home.cta.title.line2": "Sie es sind.",
    "home.cta.text":
      "Im Browser, ohne Installation – vom Werkstatt-Tablet bis zum Smartphone. On-Premise gehostet und DSGVO-konform.",
    "home.cta.primary": "Jetzt kostenlos starten",
  },
  fr: {
    // Navigation
    "nav.home": "Accueil",
    "nav.features": "Fonctionnalités",
    "nav.how-it-works": "Comment ça marche",
    "nav.pricing": "Tarifs",
    "nav.contact": "Contact",
    "nav.demo": "Demander une démo",
    "nav.cta": "Essayer 30 jours",
    "nav.docs": "Documentation",
    "nav.blog": "Blog",

    // Features Section — Bento Grid
    "features.title": "Tout ce qu'il vous faut pour gérer l'accès aux ressources",
    "features.label": "Fonctionnalités",
    "features.access.title": "Contrôle d'accès NFC",
    "features.access.description":
      "Passez une carte ou un badge NFC pour déverrouiller une machine instantanément. Compatible avec les cartes MIFARE et ISO 14443 standard. Prend aussi en charge les QR codes et l'accès via PWA.",
    "features.access.bullet1": "Compatible avec les cartes et bracelets NFC standard",
    "features.access.bullet2": "Commande de relais en temps réel (GPIO, HTTP, MQTT)",
    "features.access.bullet3": "Intégration des appareils Shelly prise en charge",
    "features.flows.title": "Flux d'automatisation",
    "features.flows.description":
      "Déclenchez des actions au démarrage, à l'arrêt ou à l'accès d'une ressource. Envoyez des messages MQTT, des webhooks, des e-mails ou des notifications push depuis un éditeur de flux visuel.",
    "features.flows.node1": "Tap NFC",
    "features.flows.node2": "Notifier",
    "features.flows.node3": "Journaliser",
    "features.analytics.title": "Journaux de session & export CSV",
    "features.analytics.description":
      "Chaque session est enregistrée automatiquement. Exportez l'historique d'utilisation en CSV à tout moment pour vos rapports ou votre facturation.",
    "features.maintenance.title": "Workflows de maintenance",
    "features.maintenance.description":
      "Définissez des intervalles de maintenance basés sur l'usage pour chaque ressource. Attraccess verrouille automatiquement les ressources concernées et prévient vos techniciens.",
    "features.maintenance.status1": "Découpeuse laser — maintenance dans 3 utilisations",
    "features.maintenance.status2": "Imprimante 3D — verrouillée pour maintenance",
    "features.maintenance.status3": "Défonceuse CNC — OK",
    "features.rbac.title": "Permissions par ressource",
    "features.rbac.description":
      "Accordez l'accès ressource par ressource avec deux niveaux : introduced (peut utiliser) et isIntroducer (peut autoriser d'autres personnes). Réglable individuellement pour chaque ressource.",
    "features.rbac.admin": "isIntroducer — peut autoriser d'autres personnes",
    "features.rbac.trainer": "introduced — peut utiliser la ressource",
    "features.rbac.member": "aucun accès — bloqué",
    "features.selfhosted.title": "Auto-hébergé & code source disponible",
    "features.selfhosted.description":
      "Vos données ne quittent jamais vos serveurs. Déployez avec Docker sur le matériel de votre choix. La Prosperity Public License rend le logiciel gratuit pour les associations, avec une licence commerciale disponible.",
    "features.selfhosted.deploy": "docker compose up",
    "features.selfhosted.license": "Prosperity Public License 3.0",
    "features.cta": "Demander une démo",

    // How It Works Section
    "how-it-works.title": "Opérationnel en quelques minutes",
    "how-it-works.subtitle":
      "De zéro au contrôle d'accès complet — sans firmware sur mesure ni diplôme d'ingénieur.",
    "how-it-works.step1.title": "Définir les ressources",
    "how-it-works.step1.description":
      "Ajoutez chaque machine, porte ou outil comme ressource dans le tableau de bord. Donnez-lui un nom, une description et une photo. Définissez les prérequis — par exemple une formation obligatoire avant l'accès.",
    "how-it-works.step2.title": "Attribuer les accès",
    "how-it-works.step2.description":
      "Enregistrez une carte NFC pour chaque membre et accordez l'accès à des ressources précises. Définissez le statut de formation et le niveau de permission pour chaque ressource.",
    "how-it-works.step3.title": "Déployer & utiliser",
    "how-it-works.step3.description":
      "Installez un lecteur NFC ou un appareil Shelly à côté de chaque ressource. Les membres passent leur carte — l'accès est vérifié en quelques millisecondes et le relais s'active.",
    "how-it-works.step4.title": "Suivre & automatiser",
    "how-it-works.step4.description":
      "Surveillez les sessions en direct, exportez les journaux en CSV et déclenchez des flux d'automatisation pour les notifications, la ventilation ou n'importe quel webhook.",
    "how-it-works.step5.title": "Entretenir & passer à l'échelle",
    "how-it-works.step5.description":
      "Définissez des règles de maintenance, désactivez automatiquement les ressources concernées et prévenez les techniciens. Déployez les mises à jour firmware des lecteurs NFC à distance.",

    // Pricing Section
    "pricing.title": "Des tarifs flexibles pour chaque organisation",
    "pricing.subtitle": "Choisissez la formule adaptée à votre espace de travail",
    "pricing.popular": "Le plus populaire",
    "pricing.contact-sales": "Contacter le service commercial",
    "pricing.yearly-savings": "2 mois offerts",
    "pricing.monthly": "Mensuel",
    "pricing.yearly": "Annuel",
    "pricing.per-month": "/mois",
    "pricing.per-year": "/an",
    "pricing.max-users": "Utilisateurs max.",
    "pricing.max-resources": "Ressources max.",
    "pricing.features": "Fonctionnalités",
    "pricing.support": "Support",
    "pricing.get-started": "Commencer",
    "pricing.contact-us": "Nous contacter",

    // Plan names
    "pricing.community.title": "Community",
    "pricing.standard.title": "Standard",
    "pricing.small-business.title": "Small Business",
    "pricing.business.title": "Business",
    "pricing.enterprise.title": "Enterprise",

    // Features
    "pricing.features.sso": "SSO",
    "pricing.features.maintenance": "Maintenance",
    "pricing.features.billing": "Facturation",
    "pricing.features.nfc": "Lecteur NFC",

    // Support levels
    "pricing.support.basic": "Basique",
    "pricing.support.standard": "Standard",
    "pricing.support.priority": "Prioritaire",
    "pricing.support.sla": "SLA",

    // Support tooltips
    "pricing.support.basic.tooltip": "Uniquement via les issues GitHub",
    "pricing.support.standard.tooltip": "Support par e-mail (réponse sous 48 h)",
    "pricing.support.priority.tooltip": "Support e-mail prioritaire (réponse sous 24 h)",
    "pricing.support.sla.tooltip": "Accord de niveau de service individuel",

    // Feature tooltips
    "pricing.features.sso.tooltip": "Intégration de l'authentification unique (SSO)",
    "pricing.features.maintenance.tooltip": "Workflows de maintenance automatisés",
    "pricing.features.billing.tooltip": "Système de facturation basé sur l'usage",
    "pricing.features.nfc.tooltip": "Lecteur NFC pour une authentification fluide",

    // Other tooltips
    "pricing.max-resources.tooltip": "Les ressources équipées de matériel loué ne comptent pas dans ce quota et sont « gratuites »",

    // Footer
    "footer.impressum": "Mentions légales",
    "footer.privacy": "Confidentialité",
    "footer.toggle.theme": "Basculer le mode sombre",
    "footer.copyright": "© 2024 Attraccess. Tous droits réservés.",

    // Impressum
    "impressum.title": "Mentions légales",

    // Contact
    "contact.title": "Commencez dès aujourd'hui",
    "contact.subtitle":
      "Prêt à transformer votre espace de travail ? Parlons de vos besoins spécifiques.",
    "contact.form.title": "Nous contacter",
    "contact.form.name": "Nom",
    "contact.form.name.placeholder": "Votre nom",
    "contact.form.email": "E-mail",
    "contact.form.email.placeholder": "vous@exemple.fr",
    "contact.form.organization": "Organisation",
    "contact.form.organization.placeholder": "Votre organisation",
    "contact.form.role": "Fonction",
    "contact.form.role.placeholder": "Votre fonction",
    "contact.form.message": "Votre message",
    "contact.form.message.placeholder":
      "Comment pouvons-nous vous aider ? Décrivez votre demande.",
    "contact.form.submit": "Envoyer",
    "contact.info.title": "Coordonnées",
    "contact.info.email": "E-mail",
    "contact.info.address": "Adresse",
    "contact.email.subject": "Demande d'informations sur Attraccess",
    "contact.email.body": `Bonjour,

je souhaite en savoir plus sur Attraccess. Voici mes coordonnées :

Nom : {name}
E-mail : {email}
Organisation : {organization}
Fonction : {role}

Message :
{message}

Cordialement,
{name}`,

    // MakerFaire Hannover announcement banner
    "banner.makerfaire.visit": "Retrouvez-nous à la",
    "banner.makerfaire.event": "Maker Faire Hannover",
    "banner.makerfaire.when": "15–16 août 2026 · Hanovre",
    "banner.makerfaire.where": "Eilenriedehalle, stand 135",
    "banner.makerfaire.cta": "Prendre rendez-vous",
    "banner.makerfaire.close": "Fermer",

    // Homepage (brand redesign)
    "home.badge": "Code source disponible · Gratuit pour les associations",
    "home.hero.title.line1": "Pas d'autorisation,",
    "home.hero.title.line2": "pas de courant.",
    "home.hero.subtitle":
      "Contrôle d'accès physique pour les machines partagées. Une machine ne démarre que lorsqu'une personne autorisée et formée scanne sa carte. Impossible à contourner. Entièrement documenté.",
    "home.hero.cta.primary": "Essayer 30 jours gratuitement",
    "home.hero.cta.secondary": "Comment ça marche",
    "home.hero.note": "Sans carte bancaire · Conforme au RGPD · Made in Hamburg",
    "home.hero.chip.available": "Disponible",
    "home.hero.chip.maintenance": "En maintenance",
    "home.hero.window": "Ressources · État en direct",

    "home.chips.lock": "Impossible à contourner",
    "home.chips.simple": "Aucune compétence informatique requise",
    "home.chips.onprem": "On-premise & conforme au RGPD",
    "home.chips.source": "Code source disponible",
    "home.chips.hardware": "Matériel en location",
    "home.chips.dguv": "Preuves conformes DGUV",
    "home.chips.logs": "Journaux d'utilisation complets",
    "home.chips.nonprofit": "Gratuit pour les associations",

    "home.problem.label": "Le problème",
    "home.problem.title": "Une pancarte n'arrête pas une machine.",
    "home.problem.subtitle":
      "Les affiches, la confiance et les tableurs ne protègent ni les personnes ni le chiffre d'affaires. Attraccess rend l'autorisation physiquement contraignante.",
    "home.problem.liability.title": "Couvrez votre responsabilité",
    "home.problem.liability.text":
      "En cas d'accident, une seule question compte : la personne avait-elle été formée de manière vérifiable ? Attraccess documente chaque formation automatiquement — conforme DGUV et opposable devant un tribunal. Sans formation, impossible même de démarrer la machine.",
    "home.problem.liability.window": "Preuves de formation",
    "home.problem.revenue.title": "Protégez votre chiffre d'affaires",
    "home.problem.revenue.text":
      "Les machines payantes ne fonctionnent que pour les utilisateurs autorisés. Aucune utilisation gratuite, aucune discussion — chaque session est enregistrée et peut être facturée.",
    "home.problem.revenue.window": "Session d'utilisation avec facturation",

    "home.how.label": "Comment ça marche",
    "home.how.title": "Scannez votre carte. La machine démarre. C'est tout.",
    "home.how.step1.title": "Scanner",
    "home.how.step1.text": "Présentez votre carte à l'Attractap installé à côté de la machine.",
    "home.how.step2.title": "Vérifier",
    "home.how.step2.text": "Le système vérifie en temps réel : autorisé et formé ?",
    "home.how.step3.title": "Déverrouiller",
    "home.how.step3.text": "Le boîtier de commande libère le courant — la machine démarre.",
    "home.how.step4.title": "Journaliser",
    "home.how.step4.text": "Chaque utilisation est enregistrée intégralement dans le tableau de bord.",
    "home.how.chip": "Attractap · Carte scannée",
    "home.how.window": "Ressource · Vue d'ensemble",
    "home.how.float.title": "Courant libéré",
    "home.how.float.subtitle": "La session est enregistrée",

    "home.features.label": "Tout sous contrôle",
    "home.features.title": "De la tablette de l'atelier à votre smartphone.",
    "home.features.subtitle":
      "Fonctionne dans le navigateur, sans installation — administration, maintenance et facturation au même endroit.",
    "home.features.maintenance.title": "Planifier la maintenance",
    "home.features.maintenance.text":
      "Indicateurs et intervalles de maintenance en un coup d'œil — avant qu'une machine ne tombe en panne.",
    "home.features.logs.title": "Tout documenter",
    "home.features.logs.text":
      "Chaque session dans le journal d'utilisation — qui, quand, combien de temps, opposable devant un tribunal.",
    "home.features.mobile.title": "Dans votre poche",
    "home.features.mobile.text":
      "Réservez des ressources, terminez des sessions et consultez votre crédit — depuis votre téléphone, sans installer d'application.",

    "home.nonprofit.title": "Association ? Gratuit.",
    "home.nonprofit.text":
      "Les organisations à but non lucratif utilisent le logiciel auto-hébergé gratuitement, pour toujours — code source disponible sous la Prosperity Public License. Seul l'usage commercial est payant. Matériel et support en option.",

    "home.pricing.label": "Tarifs",
    "home.pricing.title": "Juste. Transparent. Sans investissement initial.",
    "home.pricing.subtitle": "Tous les prix HT, par an. Matériel disponible en location.",
    "home.pricing.nonprofit.name": "Association",
    "home.pricing.nonprofit.price": "0 €",
    "home.pricing.nonprofit.period": "pour toujours",
    "home.pricing.nonprofit.desc": "Si vous êtes une association, c'est pour vous. Point.",
    "home.pricing.nonprofit.item1": "Logiciel auto-hébergé, gratuit pour toujours",
    "home.pricing.nonprofit.item2": "Toutes les fonctionnalités incluses",
    "home.pricing.nonprofit.item3": "Code source disponible (Prosperity License)",
    "home.pricing.nonprofit.item4": "Matériel & support en option",
    "home.pricing.nonprofit.cta": "Commencer gratuitement",
    "home.pricing.community.name": "Community",
    "home.pricing.community.price": "à partir de 900 €",
    "home.pricing.community.period": "/ an",
    "home.pricing.community.badge": "Populaire",
    "home.pricing.community.desc": "Pour les petits ateliers commerciaux et les makerspaces.",
    "home.pricing.community.item1": "Toutes les fonctions essentielles",
    "home.pricing.community.item2": "Preuves de formation & d'utilisation",
    "home.pricing.community.item3": "Accompagnement à la mise en route inclus",
    "home.pricing.community.item4": "Matériel disponible en location",
    "home.pricing.community.cta": "Essayer 30 jours gratuitement",
    "home.pricing.standard.name": "Standard",
    "home.pricing.standard.price": "3 500 €",
    "home.pricing.standard.period": "/ an",
    "home.pricing.standard.desc": "Pour les entreprises avec de nombreuses machines et utilisateurs.",
    "home.pricing.standard.item1": "Tout ce que contient Community",
    "home.pricing.standard.item2": "Support prioritaire",
    "home.pricing.standard.item3": "Facturation & crédit",
    "home.pricing.standard.item4": "SLA avec temps de réponse garanti",
    "home.pricing.standard.cta": "Demander un conseil",
    "home.pricing.note": "Des questions sur la licence adaptée ? Nous vous conseillons sans engagement.",

    "home.newsletter.title": "Restez informé",
    "home.newsletter.text":
      "Des nouvelles générales sur Attraccess — quelques fois par an, sans spam. Choisissez la langue dans laquelle vous souhaitez nous lire.",
    "home.newsletter.email": "E-mail",
    "home.newsletter.name": "Nom (facultatif)",
    "home.newsletter.lists": "Langues",
    "home.newsletter.submit": "S'abonner",
    "home.newsletter.note": "Vous recevrez un e-mail de confirmation. Désabonnement à tout moment en un clic.",

    "home.cta.title.line1": "Prêt quand",
    "home.cta.title.line2": "vous l'êtes.",
    "home.cta.text":
      "Dans le navigateur, sans installation — de la tablette de l'atelier à votre smartphone. Hébergé on-premise et conforme au RGPD.",
    "home.cta.primary": "Commencer gratuitement",
  },
  nl: {
    // Navigation
    "nav.home": "Home",
    "nav.features": "Functies",
    "nav.how-it-works": "Zo werkt het",
    "nav.pricing": "Prijzen",
    "nav.contact": "Contact",
    "nav.demo": "Demo aanvragen",
    "nav.cta": "30 dagen proberen",
    "nav.docs": "Documentatie",
    "nav.blog": "Blog",

    // Features Section — Bento Grid
    "features.title": "Alles wat je nodig hebt om toegang tot resources te beheren",
    "features.label": "Functies",
    "features.access.title": "NFC-toegangscontrole",
    "features.access.description":
      "Houd een NFC-kaart of badge voor de lezer om machines direct te ontgrendelen. Werkt met standaard MIFARE- en ISO 14443-kaarten. Ondersteunt ook QR-codes en toegang via PWA.",
    "features.access.bullet1": "Werkt met standaard NFC-kaarten & polsbandjes",
    "features.access.bullet2": "Realtime relaisaansturing (GPIO, HTTP, MQTT)",
    "features.access.bullet3": "Integratie met Shelly-apparaten ondersteund",
    "features.flows.title": "Automatiseringsflows",
    "features.flows.description":
      "Start acties wanneer resources beginnen, stoppen of worden gebruikt. Verstuur MQTT-berichten, webhooks, e-mails of pushmeldingen via een visuele flow-builder.",
    "features.flows.node1": "NFC-tap",
    "features.flows.node2": "Melden",
    "features.flows.node3": "Loggen",
    "features.analytics.title": "Sessielogboeken & CSV-export",
    "features.analytics.description":
      "Elke sessie wordt automatisch gelogd. Exporteer de gebruiksgeschiedenis op elk moment naar CSV voor rapportage of facturatie.",
    "features.maintenance.title": "Onderhoudsworkflows",
    "features.maintenance.description":
      "Stel gebruiksgebaseerde onderhoudsintervallen in per resource. Attraccess vergrendelt resources automatisch wanneer onderhoud nodig is en waarschuwt je technici.",
    "features.maintenance.status1": "Lasersnijder — onderhoud over 3 sessies",
    "features.maintenance.status2": "3D-printer — vergrendeld voor onderhoud",
    "features.maintenance.status3": "CNC-frees — OK",
    "features.rbac.title": "Rechten per resource",
    "features.rbac.description":
      "Verleen toegang per resource met twee niveaus: introduced (mag gebruiken) en isIntroducer (mag anderen autoriseren). Per resource afzonderlijk instelbaar.",
    "features.rbac.admin": "isIntroducer — mag anderen autoriseren",
    "features.rbac.trainer": "introduced — mag de resource gebruiken",
    "features.rbac.member": "geen toegang — geblokkeerd",
    "features.selfhosted.title": "Self-hosted & source available",
    "features.selfhosted.description":
      "Je data verlaat nooit je eigen servers. Deploy met Docker op elke hardware. De Prosperity Public License betekent gratis voor non-profits, met commerciële licenties beschikbaar.",
    "features.selfhosted.deploy": "docker compose up",
    "features.selfhosted.license": "Prosperity Public License 3.0",
    "features.cta": "Demo aanvragen",

    // How It Works Section
    "how-it-works.title": "Binnen enkele minuten aan de slag",
    "how-it-works.subtitle":
      "Van nul naar volledige toegangscontrole — zonder eigen firmware of technische opleiding.",
    "how-it-works.step1.title": "Resources definiëren",
    "how-it-works.step1.description":
      "Voeg elke machine, deur of elk gereedschap toe als resource in het dashboard. Geef een naam, beschrijving en foto op. Stel voorwaarden in — bijvoorbeeld een verplichte instructie vóór toegang.",
    "how-it-works.step2.title": "Toegang toewijzen",
    "how-it-works.step2.description":
      "Registreer NFC-kaarten voor elk lid en verleen toegang tot specifieke resources. Leg de instructiestatus en het rechtenniveau per resource vast.",
    "how-it-works.step3.title": "Uitrollen & gebruiken",
    "how-it-works.step3.description":
      "Installeer een NFC-lezer of Shelly-apparaat naast elke resource. Leden houden hun kaart voor de lezer — de toegang wordt in milliseconden gecontroleerd en het relais schakelt in.",
    "how-it-works.step4.title": "Volgen & automatiseren",
    "how-it-works.step4.description":
      "Volg live sessies, exporteer CSV-logboeken en start automatiseringsflows voor meldingen, ventilatie of elke webhook.",
    "how-it-works.step5.title": "Onderhouden & opschalen",
    "how-it-works.step5.description":
      "Stel onderhoudsregels in, schakel resources automatisch uit wanneer onderhoud nodig is en waarschuw technici. Rol firmware-updates voor NFC-lezers draadloos uit.",

    // Pricing Section
    "pricing.title": "Flexibele prijzen voor elke organisatie",
    "pricing.subtitle": "Kies het plan dat bij jouw werkplek past",
    "pricing.popular": "Populairst",
    "pricing.contact-sales": "Neem contact op met sales",
    "pricing.yearly-savings": "2 maanden gratis",
    "pricing.monthly": "Maandelijks",
    "pricing.yearly": "Jaarlijks",
    "pricing.per-month": "/maand",
    "pricing.per-year": "/jaar",
    "pricing.max-users": "Max. gebruikers",
    "pricing.max-resources": "Max. resources",
    "pricing.features": "Functies",
    "pricing.support": "Support",
    "pricing.get-started": "Aan de slag",
    "pricing.contact-us": "Neem contact op",

    // Plan names
    "pricing.community.title": "Community",
    "pricing.standard.title": "Standard",
    "pricing.small-business.title": "Small Business",
    "pricing.business.title": "Business",
    "pricing.enterprise.title": "Enterprise",

    // Features
    "pricing.features.sso": "SSO",
    "pricing.features.maintenance": "Onderhoud",
    "pricing.features.billing": "Facturatie",
    "pricing.features.nfc": "NFC-lezer",

    // Support levels
    "pricing.support.basic": "Basis",
    "pricing.support.standard": "Standaard",
    "pricing.support.priority": "Prioriteit",
    "pricing.support.sla": "SLA",

    // Support tooltips
    "pricing.support.basic.tooltip": "Alleen via GitHub Issues",
    "pricing.support.standard.tooltip": "E-mailsupport (reactie binnen 48 uur)",
    "pricing.support.priority.tooltip": "Prioritaire e-mailsupport (reactie binnen 24 uur)",
    "pricing.support.sla.tooltip": "Individuele SLA-overeenkomst",

    // Feature tooltips
    "pricing.features.sso.tooltip": "Single sign-on-integratie",
    "pricing.features.maintenance.tooltip": "Geautomatiseerde onderhoudsworkflows",
    "pricing.features.billing.tooltip": "Facturatiesysteem op basis van gebruik",
    "pricing.features.nfc.tooltip": "NFC-lezer voor moeiteloze authenticatie",

    // Other tooltips
    "pricing.max-resources.tooltip": "Resources met gehuurde hardware tellen niet mee voor dit quotum en zijn 'gratis'",

    // Footer
    "footer.impressum": "Colofon",
    "footer.privacy": "Privacy",
    "footer.toggle.theme": "Donkere modus wisselen",
    "footer.copyright": "© 2024 Attraccess. Alle rechten voorbehouden.",

    // Impressum
    "impressum.title": "Colofon",

    // Contact
    "contact.title": "Begin vandaag nog",
    "contact.subtitle":
      "Klaar om je werkplek te transformeren? Laten we het over jouw specifieke wensen hebben.",
    "contact.form.title": "Neem contact op",
    "contact.form.name": "Naam",
    "contact.form.name.placeholder": "Je naam",
    "contact.form.email": "E-mail",
    "contact.form.email.placeholder": "jij@voorbeeld.nl",
    "contact.form.organization": "Organisatie",
    "contact.form.organization.placeholder": "Je organisatie",
    "contact.form.role": "Functie",
    "contact.form.role.placeholder": "Je functie",
    "contact.form.message": "Je bericht",
    "contact.form.message.placeholder":
      "Hoe kunnen we helpen? Beschrijf je vraag.",
    "contact.form.submit": "Versturen",
    "contact.info.title": "Contactgegevens",
    "contact.info.email": "E-mail",
    "contact.info.address": "Adres",
    "contact.email.subject": "Vraag over Attraccess",
    "contact.email.body": `Hallo,

ik wil graag meer weten over Attraccess. Hier zijn mijn gegevens:

Naam: {name}
E-mail: {email}
Organisatie: {organization}
Functie: {role}

Bericht:
{message}

Met vriendelijke groet,
{name}`,

    // MakerFaire Hannover announcement banner
    "banner.makerfaire.visit": "Bezoek ons op de",
    "banner.makerfaire.event": "Maker Faire Hannover",
    "banner.makerfaire.when": "15–16 augustus 2026 · Hannover",
    "banner.makerfaire.where": "Eilenriedehalle, stand 135",
    "banner.makerfaire.cta": "Maak een afspraak",
    "banner.makerfaire.close": "Sluiten",

    // Homepage (brand redesign)
    "home.badge": "Source available · Gratis voor non-profits",
    "home.hero.title.line1": "Geen toestemming,",
    "home.hero.title.line2": "geen stroom.",
    "home.hero.subtitle":
      "Fysieke toegangscontrole voor gedeelde machines. Een machine start pas als een bevoegd, geïnstrueerd persoon zijn kaart scant. Onmogelijk te omzeilen. Volledig gedocumenteerd.",
    "home.hero.cta.primary": "30 dagen gratis proberen",
    "home.hero.cta.secondary": "Zo werkt het",
    "home.hero.note": "Zonder creditcard · AVG-proof · Made in Hamburg",
    "home.hero.chip.available": "Beschikbaar",
    "home.hero.chip.maintenance": "In onderhoud",
    "home.hero.window": "Resources · Live status",

    "home.chips.lock": "Onmogelijk te omzeilen",
    "home.chips.simple": "Geen IT-kennis nodig",
    "home.chips.onprem": "On-premise & AVG-proof",
    "home.chips.source": "Source available",
    "home.chips.hardware": "Hardware te huur",
    "home.chips.dguv": "DGUV-conforme registratie",
    "home.chips.logs": "Volledige gebruikslogboeken",
    "home.chips.nonprofit": "Gratis voor non-profits",

    "home.problem.label": "Het probleem",
    "home.problem.title": "Een bordje houdt geen machine tegen.",
    "home.problem.subtitle":
      "Aanplakbiljetten, vertrouwen en spreadsheets beschermen mensen noch omzet. Attraccess maakt autorisatie fysiek afdwingbaar.",
    "home.problem.liability.title": "Dek je aansprakelijkheid af",
    "home.problem.liability.text":
      "Als er een ongeluk gebeurt, telt maar één vraag: was de persoon aantoonbaar geïnstrueerd? Attraccess documenteert elke instructie automatisch — DGUV-conform en juridisch houdbaar. Wie geen instructie heeft, krijgt de machine niet eens aan.",
    "home.problem.liability.window": "Instructiebewijzen",
    "home.problem.revenue.title": "Bescherm je omzet",
    "home.problem.revenue.text":
      "Betaalde machines draaien alleen voor bevoegde gebruikers. Geen gratis gebruik, geen discussies — elke sessie wordt vastgelegd en kan worden gefactureerd.",
    "home.problem.revenue.window": "Gebruikssessie met facturatie",

    "home.how.label": "Zo werkt het",
    "home.how.title": "Kaart scannen. Machine draait. Klaar.",
    "home.how.step1.title": "Scannen",
    "home.how.step1.text": "Houd je kaart voor de Attractap naast de machine.",
    "home.how.step2.title": "Controleren",
    "home.how.step2.text": "Het systeem controleert realtime: bevoegd en geïnstrueerd?",
    "home.how.step3.title": "Vrijgeven",
    "home.how.step3.text": "De schakelkast geeft de stroom vrij — de machine start.",
    "home.how.step4.title": "Loggen",
    "home.how.step4.text": "Elk gebruik wordt volledig vastgelegd in het dashboard.",
    "home.how.chip": "Attractap · Kaart gescand",
    "home.how.window": "Resource · Overzicht",
    "home.how.float.title": "Stroom vrijgegeven",
    "home.how.float.subtitle": "Sessie wordt gelogd",

    "home.features.label": "Alles in beeld",
    "home.features.title": "Van de werkplaatstablet tot je smartphone.",
    "home.features.subtitle":
      "Draait in de browser, zonder installatie — beheer, onderhoud en facturatie op één plek.",
    "home.features.maintenance.title": "Onderhoud plannen",
    "home.features.maintenance.text":
      "Onderhouds-KPI's en intervallen in één oogopslag — voordat een machine uitvalt.",
    "home.features.logs.title": "Alles documenteren",
    "home.features.logs.text":
      "Elke sessie in het gebruikslogboek — wie, wanneer, hoe lang, juridisch houdbaar.",
    "home.features.mobile.title": "In je broekzak",
    "home.features.mobile.text":
      "Reserveer resources, beëindig sessies en check je tegoed — vanaf je telefoon, zonder app-installatie.",

    "home.nonprofit.title": "Non-profit? Gratis.",
    "home.nonprofit.text":
      "Non-profitorganisaties gebruiken de self-hosted software voor altijd gratis — source available onder de Prosperity Public License. Alleen commercieel gebruik is betaald. Hardware en support optioneel bij te boeken.",

    "home.pricing.label": "Prijzen",
    "home.pricing.title": "Eerlijk. Transparant. Zonder investering vooraf.",
    "home.pricing.subtitle": "Alle prijzen exclusief btw, per jaar. Hardware eenvoudig te huur.",
    "home.pricing.nonprofit.name": "Non-profit",
    "home.pricing.nonprofit.price": "€ 0",
    "home.pricing.nonprofit.period": "voor altijd",
    "home.pricing.nonprofit.desc": "Ben je non-profit, dan mag je. Punt.",
    "home.pricing.nonprofit.item1": "Self-hosted software, voor altijd gratis",
    "home.pricing.nonprofit.item2": "Alle functies inbegrepen",
    "home.pricing.nonprofit.item3": "Source available (Prosperity License)",
    "home.pricing.nonprofit.item4": "Hardware & support optioneel",
    "home.pricing.nonprofit.cta": "Gratis aan de slag",
    "home.pricing.community.name": "Community",
    "home.pricing.community.price": "vanaf € 900",
    "home.pricing.community.period": "/ jaar",
    "home.pricing.community.badge": "Populair",
    "home.pricing.community.desc": "Voor kleine commerciële werkplaatsen en makerspaces.",
    "home.pricing.community.item1": "Alle kernfuncties",
    "home.pricing.community.item2": "Instructie- & gebruiksbewijzen",
    "home.pricing.community.item3": "Begeleide onboarding inbegrepen",
    "home.pricing.community.item4": "Hardware eenvoudig te huur",
    "home.pricing.community.cta": "30 dagen gratis proberen",
    "home.pricing.standard.name": "Standard",
    "home.pricing.standard.price": "€ 3.500",
    "home.pricing.standard.period": "/ jaar",
    "home.pricing.standard.desc": "Voor bedrijven met veel machines en gebruikers.",
    "home.pricing.standard.item1": "Alles uit Community",
    "home.pricing.standard.item2": "Prioritaire support",
    "home.pricing.standard.item3": "Facturatie & tegoed",
    "home.pricing.standard.item4": "SLA met gegarandeerde reactietijd",
    "home.pricing.standard.cta": "Adviesgesprek aanvragen",
    "home.pricing.note": "Vragen over de juiste licentie? We adviseren je vrijblijvend.",

    "home.newsletter.title": "Blijf op de hoogte",
    "home.newsletter.text":
      "Algemeen nieuws over Attraccess — een paar keer per jaar, geen spam. Kies de taal waarin je van ons wilt horen.",
    "home.newsletter.email": "E-mail",
    "home.newsletter.name": "Naam (optioneel)",
    "home.newsletter.lists": "Talen",
    "home.newsletter.submit": "Abonneren",
    "home.newsletter.note": "Je ontvangt een bevestigingsmail. Afmelden kan altijd met één klik.",

    "home.cta.title.line1": "Klaar wanneer",
    "home.cta.title.line2": "jij dat bent.",
    "home.cta.text":
      "In de browser, zonder installatie — van de werkplaatstablet tot je smartphone. On-premise gehost en AVG-proof.",
    "home.cta.primary": "Nu gratis starten",
  },
};

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
