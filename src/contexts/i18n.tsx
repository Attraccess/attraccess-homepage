import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'de';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.features': 'Features',
    'nav.how-it-works': 'How It Works',
    'nav.pricing': 'Pricing',
    'nav.resources': 'Resources',
    'nav.about': 'About Us',
    'nav.contact': 'Contact',
    'nav.demo': 'Request Demo',
    'nav.language': 'EN',
    
    // Hero Section
    'hero.title': 'Secure, Track & Automate Your Shared Workspace',
    'hero.subtitle': 'Attraccess gives you fine-grained control over every machine, door, and tool—plus usage billing, maintenance automation, and custom workflows.',
    'hero.cta.primary': 'Request Demo',
    'hero.cta.secondary': 'Explore Features',
    
    // Problems Section
    'problems.title': 'Transform Your Workspace Challenges',
    'problems.unauthorized': 'Unauthorized access & tool misuse',
    'problems.billing': 'Manual billing & usage disputes',
    'problems.maintenance': 'Forgotten maintenance & downtime',
    
    // Benefits Section
    'benefits.title': 'Why Choose Attraccess?',
    'benefits.access.title': 'Instant Access Control',
    'benefits.access.description': 'Manage permissions per user, per resource—no more keys or signup sheets.',
    'benefits.revenue.title': 'Usage-Based Revenue',
    'benefits.revenue.description': 'Track every session automatically and bill accurately by the minute.',
    'benefits.maintenance.title': 'Zero Downtime Maintenance',
    'benefits.maintenance.description': 'Auto-lockout on maintenance triggers; notify technicians instantly.',
    'benefits.automation.title': 'Visual Automations',
    'benefits.automation.description': 'Build custom workflows with drag-and-drop logic—no code required.',
    
    // Features Section
    'features.title': 'Complete Workspace Management',
    'features.access.title': 'Access Control',
    'features.access.description': 'Tap an NFC card, scan a QR code, or use the PWA to instantly unlock machines, doors, and lockers. Assign \'introduced\' or \'isIntroducer\' permissions in seconds.',
    'features.tracking.title': 'Usage Tracking & Billing',
    'features.tracking.description': 'Automatically log every session\'s start/end, user, and notes. Export CSV reports or plug in power and count sensors for advanced billing.',
    'features.maintenance.title': 'Maintenance Automation',
    'features.maintenance.description': 'Define multiple maintenance rules per resource—e.g. 5 run-hours or 7 days elapsed. Resources auto-disable and notify maintainers until service is confirmed.',
    'features.flows.title': 'Flow-Based Automations',
    'features.flows.description': 'Use our drag-and-drop builder to send MQTT messages, webhooks, emails, or push notifications. Build loops, variables, and conditionals with ease.',
    'features.security.title': 'Integrations & Security',
    'features.security.description': 'On-prem Docker deployment with optional managed cloud coming soon. OIDC SSO, TLS encryption, auto-updating NFC reader firmware.',
    'features.cta': 'See a Live Walkthrough',
    
    // How It Works Section
    'how-it-works.title': 'Simple Setup, Powerful Results',
    'how-it-works.step1.title': 'Define Resources',
    'how-it-works.step1.description': 'Create machines, doors, and tools in the PWA. Add name, description, image, and documentation link.',
    'how-it-works.step2.title': 'Assign Access',
    'how-it-works.step2.description': 'Grant \'introduced\' or \'isIntroducer\' permissions via PWA, NFC, or OIDC users.',
    'how-it-works.step3.title': 'Deploy & Use',
    'how-it-works.step3.description': 'Install NFC readers, print QR labels, or share PWA links. Users tap, scan, or click to start sessions.',
    'how-it-works.step4.title': 'Track & Automate',
    'how-it-works.step4.description': 'Monitor live sessions, export CSV logs, and trigger custom workflows like ventilation or email alerts.',
    'how-it-works.step5.title': 'Maintain & Scale',
    'how-it-works.step5.description': 'Set maintenance rules, auto-disable resources, notify technicians, and roll out new readers via firmware OTA.',
    'how-it-works.cta': 'Speak to an Engineer',
    
    // Pricing Section
    'pricing.title': 'Flexible Pricing for Every Organization',
    'pricing.nonprofit.title': 'Non-Profit & Individual',
    'pricing.nonprofit.price': '€0 / forever',
    'pricing.nonprofit.feature1': 'Source-available & free',
    'pricing.nonprofit.feature2': 'Unlimited users & resources',
    'pricing.nonprofit.feature3': 'Community support',
    'pricing.pilot.title': 'Commercial Pilot',
    'pricing.pilot.price': 'Free 3-month trial',
    'pricing.pilot.feature1': 'Onboarding support',
    'pricing.pilot.feature2': 'Usage metrics review',
    'pricing.pilot.cta': 'Apply for Pilot',
    'pricing.enterprise.title': 'Enterprise (Coming Soon)',
    'pricing.enterprise.feature1': 'Hybrid cloud SaaS',
    'pricing.enterprise.feature2': 'SLA & premium support',
    'pricing.enterprise.feature3': 'Custom integrations',
    
    // Footer
    'footer.cta.title': 'Ready to transform your workspace?',
    'footer.cta.button': 'Start Your Free Pilot',
    'footer.newsletter.placeholder': 'Your email',
    'footer.newsletter.button': 'Subscribe',
    'footer.toggle.theme': 'Toggle Dark Mode',
    'footer.copyright': '© 2024 Attraccess. All rights reserved.',
    
    // Contact
    'contact.title': 'Get Started Today',
    'contact.subtitle': 'Ready to transform your workspace? Let\'s talk about your specific needs.',
    'contact.form.name': 'Name',
    'contact.form.email': 'Email',
    'contact.form.organization': 'Organization',
    'contact.form.role': 'Role',
    'contact.form.usecase': 'Use Case',
    'contact.form.usecase.placeholder': 'Describe your workspace',
    'contact.form.submit': 'Submit',
    
    // About
    'about.title': 'About Attraccess',
    'about.mission': 'Empowering shared workspaces with enterprise-grade control—without the complexity.',
    'about.team.title': 'Our Team',
    
    // Resources
    'resources.title': 'Resources & Support',
    'resources.case-study.title': 'How Attraccess Streamlined Attraktor e.V.\'s Workshop',
    'resources.case-study.teaser': 'Learn how this Hamburg makerspace reduced unauthorized access by 95% and automated their entire billing process.',
    'resources.downloads.title': 'Downloads',
    'resources.downloads.feature-sheet': 'Download our Feature Sheet',
    'resources.downloads.security': 'Download Security Whitepaper',
    'resources.blog.title': 'Latest Updates',
  },
  de: {
    // Navigation
    'nav.home': 'Startseite',
    'nav.features': 'Funktionen',
    'nav.how-it-works': 'So funktioniert\'s',
    'nav.pricing': 'Preise',
    'nav.resources': 'Ressourcen',
    'nav.about': 'Über uns',
    'nav.contact': 'Kontakt',
    'nav.demo': 'Demo anfragen',
    'nav.language': 'DE',
    
    // Hero Section
    'hero.title': 'Sichern, Verfolgen & Automatisieren Sie Ihren Gemeinschaftsarbeitsplatz',
    'hero.subtitle': 'Attraccess bietet granulare Kontrolle über jede Maschine, Tür und jedes Werkzeug – inklusive Nutzungsabrechnung, Wartungsautomatisierung und individuelle Workflows.',
    'hero.cta.primary': 'Demo anfragen',
    'hero.cta.secondary': 'Funktionen ansehen',
    
    // Problems Section
    'problems.title': 'Lösen Sie Ihre Arbeitsplatz-Herausforderungen',
    'problems.unauthorized': 'Unbefugter Zugriff & Missbrauch von Werkzeugen',
    'problems.billing': 'Manuelle Abrechnung & Nutzungsstreitigkeiten',
    'problems.maintenance': 'Vergessene Wartung & Ausfallzeiten',
    
    // Benefits Section
    'benefits.title': 'Warum Attraccess wählen?',
    'benefits.access.title': 'Sofortige Zugriffssteuerung',
    'benefits.access.description': 'Vergaben Sie Berechtigungen pro Benutzer und Ressource – keine Schlüssel oder Listen mehr.',
    'benefits.revenue.title': 'Umsatz nach Nutzung',
    'benefits.revenue.description': 'Erfassen Sie jede Sitzung automatisch und berechnen Sie minutengenau.',
    'benefits.maintenance.title': 'Keine Ausfallzeiten',
    'benefits.maintenance.description': 'Automatische Sperrung bei Wartungsbedarf; Techniker sofort benachrichtigen.',
    'benefits.automation.title': 'Visuelle Automatisierungen',
    'benefits.automation.description': 'Erstellen Sie individuelle Abläufe per Drag-and-Drop – ganz ohne Code.',
    
    // Features Section
    'features.title': 'Komplette Arbeitsplatz-Verwaltung',
    'features.access.title': 'Zugriffssteuerung',
    'features.access.description': 'Tippen Sie eine NFC-Karte, scannen Sie einen QR-Code oder nutzen Sie die PWA, um Maschinen, Türen und Schränke sofort zu entriegeln. Weisen Sie \'introduced\'- oder \'isIntroducer\'-Berechtigungen in Sekunden zu.',
    'features.tracking.title': 'Nutzungsverfolgung & Abrechnung',
    'features.tracking.description': 'Protokollieren Sie automatisch Beginn/Ende jeder Sitzung, Benutzer und Bemerkungen. Exportieren Sie CSV-Berichte oder integrieren Sie Strom- und Zähler-Sensoren für erweiterte Abrechnung.',
    'features.maintenance.title': 'Wartungsautomatisierung',
    'features.maintenance.description': 'Definieren Sie mehrere Wartungsregeln pro Ressource – z. B. 5 Betriebsstunden oder 7 Tage vergangen. Ressourcen werden automatisch gesperrt und Techniker benachrichtigt, bis die Wartung bestätigt ist.',
    'features.flows.title': 'Visuelle Automatisierungen',
    'features.flows.description': 'Verwenden Sie unseren Drag-and-Drop-Editor, um MQTT-Nachrichten, Webhooks, E-Mails oder Push-Benachrichtigungen zu senden. Erstellen Sie Schleifen, Variablen und Bedingungen ganz einfach.',
    'features.security.title': 'Integrationen & Sicherheit',
    'features.security.description': 'On-Prem-Docker-Bereitstellung mit optionaler Managed-Cloud bald verfügbar. OIDC-SSO, TLS-Verschlüsselung, automatische Firmware-Updates für NFC-Leser.',
    'features.cta': 'Live-Demo ansehen',
    
    // How It Works Section
    'how-it-works.title': 'Einfache Einrichtung, Starke Ergebnisse',
    'how-it-works.step1.title': 'Ressourcen definieren',
    'how-it-works.step1.description': 'Erstellen Sie Maschinen, Türen und Werkzeuge in der PWA. Fügen Sie Name, Beschreibung, Bild und Dokumentationslink hinzu.',
    'how-it-works.step2.title': 'Zugriffe zuweisen',
    'how-it-works.step2.description': 'Weisen Sie \'introduced\'- oder \'isIntroducer\'-Berechtigungen per PWA, NFC oder OIDC-Benutzern zu.',
    'how-it-works.step3.title': 'Ausrollen & Nutzen',
    'how-it-works.step3.description': 'Installieren Sie NFC-Leser, drucken Sie QR-Etiketten aus oder teilen Sie PWA-Links. Nutzer tippen, scannen oder klicken, um Sitzungen zu starten.',
    'how-it-works.step4.title': 'Verfolgen & Automatisieren',
    'how-it-works.step4.description': 'Überwachen Sie Live-Sitzungen, exportieren Sie CSV-Protokolle und lösen Sie benutzerdefinierte Workflows aus, z. B. Belüftung oder E-Mail-Benachrichtigungen.',
    'how-it-works.step5.title': 'Warten & Skalieren',
    'how-it-works.step5.description': 'Legen Sie Wartungsregeln fest, sperren Sie Ressourcen automatisch, benachrichtigen Sie Techniker und verteilen Sie neue Firmware-Updates OTA.',
    'how-it-works.cta': 'Mit einem Ingenieur sprechen',
    
    // Pricing Section
    'pricing.title': 'Flexible Preise für jede Organisation',
    'pricing.nonprofit.title': 'Non-Profit & Privat',
    'pricing.nonprofit.price': '€0 / für immer',
    'pricing.nonprofit.feature1': 'Quelloffen & kostenlos',
    'pricing.nonprofit.feature2': 'Unbegrenzte Benutzer & Ressourcen',
    'pricing.nonprofit.feature3': 'Community-Support',
    'pricing.pilot.title': 'Kommerzieller Pilot',
    'pricing.pilot.price': 'Kostenlose 3-Monats-Testversion',
    'pricing.pilot.feature1': 'Onboarding-Support',
    'pricing.pilot.feature2': 'Nutzungsmetriken-Review',
    'pricing.pilot.cta': 'Pilot beantragen',
    'pricing.enterprise.title': 'Enterprise (Bald)',
    'pricing.enterprise.feature1': 'Hybrid-Cloud-SaaS',
    'pricing.enterprise.feature2': 'SLA & Premium-Support',
    'pricing.enterprise.feature3': 'Individuelle Integrationen',
    
    // Footer
    'footer.cta.title': 'Bereit, Ihren Arbeitsbereich zu transformieren?',
    'footer.cta.button': 'Kostenlosen Pilot starten',
    'footer.newsletter.placeholder': 'Ihre E-Mail',
    'footer.newsletter.button': 'Anmelden',
    'footer.toggle.theme': 'Dunkelmodus umschalten',
    'footer.copyright': '© 2024 Attraccess. Alle Rechte vorbehalten.',
    
    // Contact
    'contact.title': 'Starten Sie noch heute',
    'contact.subtitle': 'Bereit, Ihren Arbeitsbereich zu transformieren? Lassen Sie uns über Ihre spezifischen Bedürfnisse sprechen.',
    'contact.form.name': 'Name',
    'contact.form.email': 'E-Mail',
    'contact.form.organization': 'Organisation',
    'contact.form.role': 'Position',
    'contact.form.usecase': 'Anwendungsfall',
    'contact.form.usecase.placeholder': 'Beschreiben Sie Ihren Arbeitsbereich',
    'contact.form.submit': 'Absenden',
    
    // About
    'about.title': 'Über Attraccess',
    'about.mission': 'Wir ermöglichen Gemeinschaftsarbeitsplätze mit Unternehmens-Kontrolle – ohne Komplexität.',
    'about.team.title': 'Unser Team',
    
    // Resources
    'resources.title': 'Ressourcen & Support',
    'resources.case-study.title': 'Wie Attraccess den Attraktor e.V. Workshop optimierte',
    'resources.case-study.teaser': 'Erfahren Sie, wie dieser Hamburger Makerspace unbefugten Zugang um 95% reduzierte und den gesamten Abrechnungsprozess automatisierte.',
    'resources.downloads.title': 'Downloads',
    'resources.downloads.feature-sheet': 'Unser Datenblatt herunterladen',
    'resources.downloads.security': 'Sicherheits-Whitepaper herunterladen',
    'resources.blog.title': 'Neueste Updates',
  }
};

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Detect browser language
    const browserLang = navigator.language.split('-')[0] as Language;
    if (browserLang === 'de' || browserLang === 'en') {
      setLanguage(browserLang);
    }
  }, []);

  const t = (key: string): string => {
    const translation = translations[language][key as keyof typeof translations[typeof language]];
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
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}