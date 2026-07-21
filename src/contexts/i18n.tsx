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
    "nav.cta": "Try 30 days",
    "nav.docs": "Documentation",
    "nav.blog": "Blog",
    // Hero Section
    "hero.badge": "Free for non-profits · Commercial license available",
    "hero.title": "Access & Lifecycle Management for Shared Resources",
    "hero.subtitle":
      "Attraccess gives you fine-grained control over every machine, door, and tool — with usage tracking, maintenance automation, and custom workflows.",
    "hero.cta.primary": "Request Demo",
    "hero.cta.secondary": "View on GitHub",
    "hero.trusted-by": "Trusted by",
    "hero.stat1.number": "3+",
    "hero.stat1.label": "Organizations",
    "hero.stat2.number": "100+",
    "hero.stat2.label": "Resources managed",
    "hero.stat3.number": "0",
    "hero.stat3.label": "Signup sheets",

    // Stats Bar
    "stats.orgs.number": "3+",
    "stats.orgs.label": "Organizations using Attraccess",
    "stats.machines.number": "100+",
    "stats.machines.label": "Resources managed",
    "stats.sheets.number": "0",
    "stats.sheets.label": "Manual signup sheets",
    "stats.selfhosted": "Self-Hosted",
    "stats.selfhosted.label": "Your data, your servers",

    // Customers & Partners Section
    "customers.title": "Trusted by Makerspaces & Labs",
    "customers.subtitle": "Leading hackerspaces and research institutions rely on Attraccess to manage their resources and members.",
    "customers.workinglab.tagline": "Makerspace · Hamburg",
    "customers.workinglab.description": "Managing machines, tools, and member access across the entire facility.",
    "customers.tuhh.tagline": "Hamburg Univ. of Technology",
    "customers.tuhh.description": "Role-based access control and audit trails for university lab compliance.",
    "customers.attraktor.tagline": "Hackerspace · Hamburg",
    "customers.attraktor.description": "Self-hosted access control for a community-run hackerspace.",

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

    // CTA Banner
    "cta.title": "Ready to replace your signup sheets?",
    "cta.subtitle": "Get up and running in minutes. Our team will help you configure the perfect setup for your space.",
    "cta.primary": "Request a Demo",
    "cta.secondary": "View Documentation",

    // How It Works Section
    "how-it-works.label": "How It Works",
    "how-it-works.step-label": "Step",
    "how-it-works.title": "Get up and running in minutes",
    "how-it-works.subtitle":
      "From zero to full resource access control — no custom firmware, no engineering degree required.",
    "how-it-works.step1.title": "Define Resources",
    "how-it-works.step1.description":
      "Add each machine, door, or tool as a resource in the dashboard. Give it a name, description, and upload a photo. Set requirements — like requiring training before access is granted.",
    "how-it-works.step1.bullet1": "Name, photo, documentation link",
    "how-it-works.step1.bullet2": "Training & certification requirements",
    "how-it-works.step1.bullet3": "Group assignment for organization",
    "how-it-works.step2.title": "Assign Access",
    "how-it-works.step2.description":
      "Register NFC cards for each member and grant access to specific resources. Set training completion status and permission levels per resource.",
    "how-it-works.step2.bullet1": "Register NFC cards via tap",
    "how-it-works.step2.bullet2": "Per-resource access grants",
    "how-it-works.step2.bullet3": "Training completion tracking",
    "how-it-works.step3.title": "Deploy & Use",
    "how-it-works.step3.description":
      "Install an NFC reader or Shelly device next to each resource. Members tap their card — access is verified in milliseconds and the relay activates.",
    "how-it-works.step3.bullet1": "Works with AttraTap NFC readers",
    "how-it-works.step3.bullet2": "Shelly device integration for relay control",
    "how-it-works.step3.bullet3": "Also supports QR codes and PWA-based access",
    "how-it-works.step4.title": "Track & Automate",
    "how-it-works.step4.description":
      "Monitor live sessions, export CSV logs, and trigger custom automation flows for notifications, ventilation, or any webhook.",
    "how-it-works.step4.bullet1": "Live session monitoring dashboard",
    "how-it-works.step4.bullet2": "CSV export for usage reporting",
    "how-it-works.step4.bullet3": "Custom automation flows (MQTT, webhook, email)",
    "how-it-works.step5.title": "Maintain & Scale",
    "how-it-works.step5.description":
      "Set maintenance rules, auto-disable resources when maintenance is due, and notify technicians. Roll out firmware updates to NFC readers over the air.",
    "how-it-works.step5.bullet1": "Automated maintenance scheduling",
    "how-it-works.step5.bullet2": "Auto-lockout when maintenance is due",
    "how-it-works.step5.bullet3": "Over-the-air firmware updates for readers",

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
    // Hero Section
    "hero.badge": "Kostenlos für Non-Profits · Kommerzielle Lizenz verfügbar",
    "hero.title": "Zugang & Lifecycle-Management für gemeinsam genutzte Ressourcen",
    "hero.subtitle":
      "Attraccess bietet detaillierte Kontrolle über jede Maschine, Tür und jedes Werkzeug – inklusive Nutzungsverfolgung, Wartungsautomatisierung und individuelle Workflows.",
    "hero.cta.primary": "Demo anfragen",
    "hero.cta.secondary": "Auf GitHub ansehen",
    "hero.trusted-by": "Vertraut von",
    "hero.stat1.number": "3+",
    "hero.stat1.label": "Organisationen",
    "hero.stat2.number": "100+",
    "hero.stat2.label": "Ressourcen verwaltet",
    "hero.stat3.number": "0",
    "hero.stat3.label": "Anmeldelisten",

    // Stats Bar
    "stats.orgs.number": "3+",
    "stats.orgs.label": "Organisationen nutzen Attraccess",
    "stats.machines.number": "100+",
    "stats.machines.label": "Ressourcen verwaltet",
    "stats.sheets.number": "0",
    "stats.sheets.label": "Manuelle Anmeldelisten",
    "stats.selfhosted": "Self-Hosted",
    "stats.selfhosted.label": "Ihre Daten, Ihre Server",

    // Customers & Partners Section
    "customers.title": "Vertraut von Makerspaces & Labs",
    "customers.subtitle": "Führende Hackerspaces und Forschungseinrichtungen nutzen Attraccess zur Verwaltung ihrer Ressourcen und Mitglieder.",
    "customers.workinglab.tagline": "Makerspace · Hamburg",
    "customers.workinglab.description": "Verwaltung von Maschinen, Werkzeugen und Mitgliederzugängen in der gesamten Einrichtung.",
    "customers.tuhh.tagline": "TU Hamburg",
    "customers.tuhh.description": "Rollenbasierte Zugriffskontrolle und Audit-Trails für Compliance-Anforderungen im Universitätslabor.",
    "customers.attraktor.tagline": "Hackerspace · Hamburg",
    "customers.attraktor.description": "Self-hosted Zugangskontrolle für einen gemeinschaftlich betriebenen Hackerspace.",

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

    // CTA Banner
    "cta.title": "Bereit, Ihre Anmeldelisten zu ersetzen?",
    "cta.subtitle": "In wenigen Minuten startklar. Unser Team hilft Ihnen dabei, die perfekte Einrichtung für Ihren Raum zu konfigurieren.",
    "cta.primary": "Demo anfragen",
    "cta.secondary": "Dokumentation ansehen",

    // How It Works Section
    "how-it-works.label": "So funktioniert's",
    "how-it-works.step-label": "Schritt",
    "how-it-works.title": "In wenigen Minuten startklar",
    "how-it-works.subtitle":
      "Von null zur vollständigen Ressourcenzugangskontrolle – ohne eigene Firmware, ohne Ingenieurdiplom.",
    "how-it-works.step1.title": "Ressourcen definieren",
    "how-it-works.step1.description":
      "Fügen Sie jede Maschine, Tür oder jedes Werkzeug als Ressource im Dashboard hinzu. Geben Sie Namen, Beschreibung und Foto an. Legen Sie Anforderungen fest – z. B. dass eine Einweisung erforderlich ist.",
    "how-it-works.step1.bullet1": "Name, Foto, Dokumentationslink",
    "how-it-works.step1.bullet2": "Einweisungs- & Zertifizierungsanforderungen",
    "how-it-works.step1.bullet3": "Gruppenzuweisung für die Organisation",
    "how-it-works.step2.title": "Zugriffe zuweisen",
    "how-it-works.step2.description":
      "Registrieren Sie NFC-Karten für jedes Mitglied und gewähren Sie Zugang zu bestimmten Ressourcen. Legen Sie Einweisungsstatus und Berechtigungsstufen pro Ressource fest.",
    "how-it-works.step2.bullet1": "NFC-Karten per Tap registrieren",
    "how-it-works.step2.bullet2": "Ressourcenspezifische Zugriffsgewährung",
    "how-it-works.step2.bullet3": "Verfolgung des Einweisungsstatus",
    "how-it-works.step3.title": "Ausrollen & Nutzen",
    "how-it-works.step3.description":
      "Installieren Sie einen NFC-Leser oder ein Shelly-Gerät neben jeder Ressource. Mitglieder tippen ihre Karte – der Zugang wird in Millisekunden geprüft und das Relais aktiviert.",
    "how-it-works.step3.bullet1": "Kompatibel mit AttraTap NFC-Lesern",
    "how-it-works.step3.bullet2": "Shelly-Geräte-Integration für Relaissteuerung",
    "how-it-works.step3.bullet3": "Unterstützt auch QR-Codes und PWA-Zugang",
    "how-it-works.step4.title": "Verfolgen & Automatisieren",
    "how-it-works.step4.description":
      "Überwachen Sie Live-Sitzungen, exportieren Sie CSV-Protokolle und lösen Sie Automatisierungs-Flows für Benachrichtigungen, Belüftung oder Webhooks aus.",
    "how-it-works.step4.bullet1": "Live-Sitzungsüberwachung im Dashboard",
    "how-it-works.step4.bullet2": "CSV-Export für Nutzungsberichte",
    "how-it-works.step4.bullet3": "Benutzerdefinierte Flows (MQTT, Webhook, E-Mail)",
    "how-it-works.step5.title": "Warten & Skalieren",
    "how-it-works.step5.description":
      "Legen Sie Wartungsregeln fest, sperren Sie Ressourcen bei Wartungsbedarf automatisch und benachrichtigen Sie Techniker. Verteilen Sie Firmware-Updates OTA an NFC-Leser.",
    "how-it-works.step5.bullet1": "Automatisierte Wartungsplanung",
    "how-it-works.step5.bullet2": "Automatische Sperrung bei Wartungsbedarf",
    "how-it-works.step5.bullet3": "OTA-Firmware-Updates für Leser",
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

    "home.cta.title.line1": "Bereit, wenn",
    "home.cta.title.line2": "Sie es sind.",
    "home.cta.text":
      "Im Browser, ohne Installation – vom Werkstatt-Tablet bis zum Smartphone. On-Premise gehostet und DSGVO-konform.",
    "home.cta.primary": "Jetzt kostenlos starten",
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
