import React, { createContext, useContext, useState, useEffect } from "react";
import { interpolate, type TranslationParams } from "@/lib/interpolate";

export type Language = "en" | "de";
export type { TranslationParams };

export type Translate = (key: string, params?: TranslationParams) => string;

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translate;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Exported for the translation-parity tests. It has to stay in this file:
// scripts/check-translations.cjs parses this declaration directly.
// eslint-disable-next-line react-refresh/only-export-components
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
    "customers.subtitle":
      "Leading hackerspaces and research institutions rely on Attraccess to manage their resources and members.",
    "customers.workinglab.tagline": "Makerspace · Hamburg",
    "customers.workinglab.description":
      "Managing machines, tools, and member access across the entire facility.",
    "customers.tuhh.tagline": "Hamburg Univ. of Technology",
    "customers.tuhh.description":
      "Role-based access control and audit trails for university lab compliance.",
    "customers.attraktor.tagline": "Hackerspace · Hamburg",
    "customers.attraktor.description":
      "Self-hosted access control for a community-run hackerspace.",

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
    "cta.subtitle":
      "Get up and running in minutes. Our team will help you configure the perfect setup for your space.",
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
    "how-it-works.step4.bullet3":
      "Custom automation flows (MQTT, webhook, email)",
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
    "pricing.billed-annually": "billed annually · {total} / year",
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
    "pricing.support.priority.tooltip":
      "Priority email support (response within 24h)",
    "pricing.support.sla.tooltip": "Individual SLA agreement",

    // Feature tooltips
    "pricing.features.sso.tooltip": "Single Sign-On integration",
    "pricing.features.maintenance.tooltip": "Automated maintenance workflows",
    "pricing.features.billing.tooltip": "Usage-based billing system",
    "pricing.features.nfc.tooltip": "NFC Reader for seamless authentication",

    // Other tooltips
    "pricing.max-resources.tooltip":
      "Resources with rented hardware don't count towards this quota and are 'free'",

    // Footer
    "footer.product": "Product",
    "footer.company": "Company",
    "footer.legal": "Legal",
    "footer.impressum": "Imprint",
    "footer.toggle.theme": "Toggle Dark Mode",
    "footer.copyright": "© 2024 Attraccess. All rights reserved.",

    // Impressum
    "impressum.title": "Imprint",
    "impressum.subtitle":
      "In compliance with German Telemedia Act § 5 TMG / Interstate Media Treaty § 18 MStV:",
    "impressum.owner": "Owner",
    "impressum.address": "Address",
    "impressum.email": "Email",
    "impressum.vat.notice":
      "Small business operator according to § 19 UStG – no VAT charged.",
    "impressum.owner.value": "Jan Jaap",
    "impressum.address.value": "Platanenallee 2a, 22529 Hamburg, Germany",

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
    "contact.form.usecase": "Use Case",
    "contact.form.usecase.placeholder": "Describe your workspace",
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

Use Case:
{usecase}

Best regards,
{name}`,

    // About
    "about.mission":
      "Empowering shared workspaces with enterprise-grade control—without the complexity.",

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
    "home.how.step1.text":
      "Hold your card to the Attractap next to the machine.",
    "home.how.step2.title": "Verify",
    "home.how.step2.text":
      "The system checks in real time: authorized and trained?",
    "home.how.step3.title": "Unlock",
    "home.how.step3.text":
      "The switch box releases the power — the machine starts.",
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
    "home.pricing.subtitle":
      "All prices net. Monthly rates shown, billed annually. Hardware conveniently for rent.",
    "home.pricing.from": "from",
    "home.pricing.per-month": "/ month",
    "home.pricing.billed-annually": "Billed annually · {total} / year",
    "home.pricing.no-card": "No credit card. No time limit.",
    "home.pricing.nonprofit.name": "Non-Profit",
    "home.pricing.nonprofit.period": "forever",
    "home.pricing.nonprofit.desc": "If you're a non-profit, you're in. Period.",
    "home.pricing.nonprofit.item1": "Self-hosted software, free forever",
    "home.pricing.nonprofit.item2": "All features included",
    "home.pricing.nonprofit.item3": "Source available (Prosperity License)",
    "home.pricing.nonprofit.item4": "Hardware & support optional",
    "home.pricing.nonprofit.cta": "Get started for free",
    "home.pricing.community.name": "Community",
    "home.pricing.community.badge": "Popular",
    "home.pricing.community.desc":
      "For small commercial workshops and makerspaces.",
    "home.pricing.community.item1": "All core features",
    "home.pricing.community.item2": "Training & usage records",
    "home.pricing.community.item3": "Guided onboarding included",
    "home.pricing.community.item4": "Hardware conveniently for rent",
    "home.pricing.community.cta": "Try 30 days for free",
    "home.pricing.standard.name": "Standard",
    "home.pricing.standard.desc": "For companies with many machines and users.",
    "home.pricing.standard.item1": "Everything in Community",
    "home.pricing.standard.item2": "Priority support",
    "home.pricing.standard.item3": "Billing & credit",
    "home.pricing.standard.item4": "SLA with guaranteed response time",
    "home.pricing.standard.cta": "Request a consultation",
    "home.pricing.note":
      "Questions about the right license? We're happy to advise, no strings attached.",

    "home.cta.title.line1": "Ready when",
    "home.cta.title.line2": "you are.",
    "home.cta.text":
      "In the browser, no installation — from the workshop tablet to your smartphone. Hosted on-premise and GDPR-compliant.",
    "home.cta.primary": "Start for free now",

    // ==== ATT-780: pages reworked from Rodrigo feedback ====
    "media.placeholder.badge": "Photo coming soon",
    "media.reader-on-machine.alt":
      "An Attractap Touch reader mounted next to a 3D printer, showing a resource list",
    "media.reader-credentials.alt":
      "An Attractap reader beside an NFC key fob and an NFC card",
    "media.training.alt":
      "Attraccess dashboard: training status and roles per member",
    "media.billing.alt":
      "Attraccess dashboard: rates per use and per minute with a credit balance",
    "media.session-log.alt":
      "Attraccess dashboard: usage sessions with start time, end time and duration",
    "media.flow-editor.alt":
      "The Attraccess flow editor with a trigger, wait and MQTT node",
    "media.architecture.alt":
      "Diagram: user, NFC reader, on-premise server and OIDC provider",
    "media.maintenance.alt":
      "Illustration of maintenance scheduling and scaling",
    "media.people-at-machine.alt":
      "Photo needed: a member being trained on a machine",
    "media.people-tapping.alt":
      "Photo needed: someone tapping their card on an Attractap before starting work",
    "media.workshop-floor.alt":
      "Photo needed: a workshop floor with several machines running",
    "media.team.alt": "Photo needed: the Attraccess team",
    "features.overview.title": "The whole product at a glance",
    "features.subtitle":
      "Everything you need to manage access, track usage and automate your workspace — feature by feature, with the screens they run on.",
    "features.jump.label": "Jump to a feature",
    "features.detail.label": "In detail",
    "features.detail.title": "What each feature actually does",
    "features.detail.subtitle":
      "No feature-matrix bingo. Here is what you get, what it looks like, and what people use it for.",
    "features.detail.access.label": "NFC access",
    "features.detail.access.title": "Every machine unlocks with a tap",
    "features.detail.access.description":
      "An Attractap reader sits next to each machine and talks to your Attraccess server. A member taps their card, the server checks whether they are trained and allowed, and the relay closes in well under a second. No shared keys, no signup sheet, no supervisor standing by.",
    "features.detail.access.bullet1.title": "Credentials you already hand out",
    "features.detail.access.bullet1.text":
      "Standard MIFARE and ISO 14443 cards, key fobs and wristbands all work.",
    "features.detail.access.bullet2.title": "More than cards",
    "features.detail.access.bullet2.text":
      "QR codes and the browser-based app cover visitors and anyone who forgot their card.",
    "features.detail.access.bullet3.title": "Real relay control",
    "features.detail.access.bullet3.text":
      "Switch machines through GPIO, HTTP, MQTT or off-the-shelf Shelly devices.",
    "features.detail.access.bullet4.title": "Instant revocation",
    "features.detail.access.bullet4.text":
      "Withdraw access in the dashboard and the next tap is refused. No key to collect.",
    "features.detail.access.usecase":
      "A laser cutter that only runs for members who completed the safety briefing — and stops the moment their training expires.",
    "features.detail.access.caption":
      "An Attractap with an NFC card and key fob",
    "features.detail.permissions.label": "Permissions",
    "features.detail.permissions.title":
      "Training status decides who may start what",
    "features.detail.permissions.description":
      "Access is granted per resource, not per building. Every member is either introduced (may use it), an introducer (may sign others off), or has no access at all. It is one table, with the date of the briefing next to each name.",
    "features.detail.permissions.bullet1.title": "Two clear levels",
    "features.detail.permissions.bullet1.text":
      '"Introduced" may use the machine, "introducer" may authorise others. Nothing in between to misconfigure.',
    "features.detail.permissions.bullet2.title": "The briefing is on record",
    "features.detail.permissions.bullet2.text":
      "Each grant stores who was trained, by whom, and when — ready for an audit.",
    "features.detail.permissions.bullet3.title": "Training that expires",
    "features.detail.permissions.bullet3.text":
      "Set a validity period and access is withdrawn when a refresher is due.",
    "features.detail.permissions.bullet4.title": "Works in bulk",
    "features.detail.permissions.bullet4.text":
      "Group resources and grant access to a whole group in one step.",
    "features.detail.permissions.usecase":
      "A new member joins on Saturday, gets briefed on the 3D printers, and is printing ten minutes later — without an admin touching a keyring.",
    "features.detail.permissions.caption":
      "Training status and roles per member",
    "features.detail.flows.label": "Automation",
    "features.detail.flows.title": "Wire your workshop together, without code",
    "features.detail.flows.description":
      "Flows react to what happens on a resource: session started, session ended, maintenance due, access denied. Drag nodes onto the canvas, connect them, and the chain runs every time the trigger fires.",
    "features.detail.flows.bullet1.title": "Triggers that matter",
    "features.detail.flows.bullet1.text":
      "Start, stop, timeout, denied access and maintenance events all start a flow.",
    "features.detail.flows.bullet2.title": "Actions built in",
    "features.detail.flows.bullet2.text":
      "MQTT publish, HTTP webhook, e-mail and push notification, out of the box.",
    "features.detail.flows.bullet3.title": "Timing included",
    "features.detail.flows.bullet3.text":
      "Wait nodes keep the extraction running for five more minutes after the saw stops.",
    "features.detail.flows.bullet4.title": "Templated payloads",
    "features.detail.flows.bullet4.text":
      "Reference the resource and the user inside topics and message bodies.",
    "features.detail.flows.usecase":
      "Laser cutter starts, the extraction fan switches on over MQTT. Session ends, the fan runs another five minutes, then shuts down.",
    "features.detail.flows.caption": "The flow editor with an MQTT automation",
    "features.detail.analytics.label": "Usage data",
    "features.detail.analytics.title":
      "Every session logged, without anyone writing it down",
    "features.detail.analytics.description":
      "Attraccess records who used which resource, when it started, when it ended, and how long it ran. The history filters by resource or by member and exports to CSV whenever you need it.",
    "features.detail.analytics.bullet1.title": "Automatic",
    "features.detail.analytics.bullet1.text":
      "The tap starts the log. Nobody has to remember to sign in or out.",
    "features.detail.analytics.bullet2.title": "Per resource and per member",
    "features.detail.analytics.bullet2.text":
      'Answer "who was on the CNC last Tuesday" in two clicks.',
    "features.detail.analytics.bullet3.title": "CSV export",
    "features.detail.analytics.bullet3.text":
      "Hand the numbers to accounting, a grant report, or your own spreadsheet.",
    "features.detail.analytics.bullet4.title": "Live view",
    "features.detail.analytics.bullet4.text":
      "See which machines are running right now, and for how long.",
    "features.detail.analytics.usecase":
      "A quarterly utilisation report built from real sessions instead of estimates.",
    "features.detail.analytics.caption": "Usage history for a single resource",
    "features.detail.maintenance.label": "Maintenance",
    "features.detail.maintenance.title":
      "Machines take themselves out of service",
    "features.detail.maintenance.description":
      "Set an interval in uses or hours per resource. When a machine reaches it, Attraccess locks it, tells your technicians, and keeps it locked until someone signs the maintenance off.",
    "features.detail.maintenance.bullet1.title": "Usage-based intervals",
    "features.detail.maintenance.bullet1.text":
      "Count actual runtime or sessions instead of guessing from the calendar.",
    "features.detail.maintenance.bullet2.title": "Automatic lockout",
    "features.detail.maintenance.bullet2.text":
      "The next tap is refused, with the reason shown on the reader.",
    "features.detail.maintenance.bullet3.title": "Technicians notified",
    "features.detail.maintenance.bullet3.text":
      "Whoever is responsible hears about it the moment a machine goes down.",
    "features.detail.maintenance.bullet4.title": "Signed off in the log",
    "features.detail.maintenance.bullet4.text":
      "Completed maintenance stays in the resource history.",
    "features.detail.maintenance.usecase":
      "The filament dryer locks after 200 hours and reopens once someone confirms the desiccant was changed.",
    "features.detail.maintenance.caption":
      "Maintenance and lifecycle rules per resource",
    "features.detail.billing.label": "Billing",
    "features.detail.billing.title":
      "Charge per use or per minute, from the same session data",
    "features.detail.billing.description":
      "Every session is already measured, so billing is a matter of setting a rate. Members carry a credit balance, the cost is deducted when the session ends, and the balance is visible to them and to you.",
    "features.detail.billing.bullet1.title": "Two rate types",
    "features.detail.billing.bullet1.text":
      "A flat fee per use, a rate per minute, or both at once.",
    "features.detail.billing.bullet2.title": "Prepaid credit",
    "features.detail.billing.bullet2.text":
      "Top up a member's balance; sessions draw it down automatically.",
    "features.detail.billing.bullet3.title": "Transparent for members",
    "features.detail.billing.bullet3.text":
      "Members see their balance and what each session cost them.",
    "features.detail.billing.bullet4.title": "Per resource",
    "features.detail.billing.bullet4.text":
      "Different machines can carry completely different rates.",
    "features.detail.billing.usecase":
      "The resin printer bills €0.50 per start plus €0.05 per minute — no envelope of cash next to the machine.",
    "features.detail.billing.caption":
      "Rates and credit balance for a resource",
    "features.detail.selfhosted.label": "Self-hosted",
    "features.detail.selfhosted.title": "Runs on your server, under your rules",
    "features.detail.selfhosted.description":
      "Attraccess is a Docker container you run on your own hardware or your own cloud. Member data, card IDs and usage history never leave your infrastructure, and it plugs into the identity provider you already use.",
    "features.detail.selfhosted.bullet1.title": "One container",
    "features.detail.selfhosted.bullet1.text":
      "docker compose up, on anything from a Raspberry Pi to a rack server.",
    "features.detail.selfhosted.bullet2.title": "OIDC single sign-on",
    "features.detail.selfhosted.bullet2.text":
      "Keycloak, Authentik, Entra ID — whatever your organisation already runs.",
    "features.detail.selfhosted.bullet3.title": "GDPR by construction",
    "features.detail.selfhosted.bullet3.text":
      "Personal data stays on premises, which makes the data-processing conversation short.",
    "features.detail.selfhosted.bullet4.title": "Source available",
    "features.detail.selfhosted.bullet4.text":
      "Prosperity Public License 3.0: free for non-profits, commercial licence for everyone else.",
    "features.detail.selfhosted.usecase":
      "A university lab that cannot send student data to a SaaS vendor runs Attraccess on its own VM.",
    "features.detail.selfhosted.caption":
      "How Attraccess fits into your network",
    "features.extras.title":
      "And the things you only notice when they are missing",
    "features.extras.subtitle":
      "Smaller capabilities that come with every plan.",
    "features.extras.sso.title": "Single sign-on",
    "features.extras.sso.text":
      "Connect any OIDC provider so members log in with the account they already have.",
    "features.extras.pwa.title": "Works on any phone",
    "features.extras.pwa.text":
      "The browser app installs like a native one — no app store, no rollout.",
    "features.extras.qr.title": "QR code access",
    "features.extras.qr.text":
      "Print a code for machines where a reader would be overkill.",
    "features.extras.mqtt.title": "MQTT & webhooks",
    "features.extras.mqtt.text":
      "Talk to the automation stack you already run.",
    "features.extras.notifications.title": "Notifications",
    "features.extras.notifications.text":
      "E-mail and push when a machine locks, a session runs long, or maintenance is due.",
    "features.extras.export.title": "CSV export",
    "features.extras.export.text":
      "Every table exports, so your reporting never depends on us.",
    "features.extras.multitenant.title": "Groups & areas",
    "features.extras.multitenant.text":
      "Organise resources by room, department or site.",
    "features.extras.i18n.title": "German & English",
    "features.extras.i18n.text":
      "The whole interface, including the screens on the readers.",
    "features.extras.audit.title": "Audit trail",
    "features.extras.audit.text": "Who changed which permission, and when.",
    "features.faq.title": "Questions people ask before they book a demo",
    "features.faq.hardware.question": "Do I have to buy your hardware?",
    "features.faq.hardware.answer":
      "No. Attraccess drives standard Shelly relays and generic NFC readers just as well. The Attractap is what we build and rent out because it is the fastest way to get going, but the software does not require it.",
    "features.faq.offline.question": "What happens if the network goes down?",
    "features.faq.offline.answer":
      "Readers keep a running session alive and fall back to their last known state. When the connection returns they sync the sessions they recorded in the meantime.",
    "features.faq.migrate.question":
      "We use spreadsheets and a key cabinet today. How hard is the switch?",
    "features.faq.migrate.answer":
      "Members and resources import from CSV, and you can roll out machine by machine. Most spaces start with the two machines that cause the most arguments and grow from there.",
    "features.faq.license.question": "Is it really free for non-profits?",
    "features.faq.license.answer":
      "Yes. The Prosperity Public License allows non-commercial use free of charge, forever, with every feature included. Hardware and support are optional extras.",
    "features.faq.scale.question":
      "How many machines and members does it handle?",
    "features.faq.scale.answer":
      "The largest installations run well over a hundred resources. There is no hard limit in the software — the plans differ in support and commercial terms, not in capability.",
    "features.closing.title": "See it running on your own machines",
    "features.closing.text":
      "A 30-minute call, your machines on screen, and an honest answer about whether Attraccess fits.",
    "features.closing.secondary": "See how it works",
    "how-it-works.hero.setup.value": "< 1 day",
    "how-it-works.hero.setup.label": "From unboxing to the first tap",
    "how-it-works.hero.tap.value": "< 1 s",
    "how-it-works.hero.tap.label": "From card tap to a running machine",
    "how-it-works.hero.hardware.value": "€0",
    "how-it-works.hero.hardware.label": "Upfront hardware cost — rent instead",
    "how-it-works.demo.label": "Watch it work",
    "how-it-works.demo.title": "The whole thing, end to end",
    "how-it-works.demo.subtitle":
      "Tap a card, start a machine, end the session, read the log. Everything on this page, in a few minutes.",
    "how-it-works.demo.play": "Play the demo",
    "how-it-works.demo.caption":
      "Recorded in a working makerspace, not a mockup.",
    "how-it-works.demo.poster.alt":
      "An Attractap reader mounted next to a 3D printer",
    "how-it-works.demo.pending.title": "The full demo video is in production",
    "how-it-works.demo.pending.text":
      "Until it goes live we will walk you through the whole system on a call — and answer the questions a video could not.",
    "how-it-works.demo.pending.cta": "Book a live demo",
    "how-it-works.gallery.label": "In the workshop",
    "how-it-works.gallery.title": "What it looks like on the shop floor",
    "how-it-works.gallery.subtitle":
      "One small box next to each machine. That is the entire visible footprint.",
    "how-it-works.gallery.reader.caption":
      "An Attractap Touch next to a 3D printer: pick the resource on screen, tap to start.",
    "how-it-works.gallery.tap.caption":
      "A member taps in before starting a job.",
    "how-it-works.gallery.credentials.caption":
      "Any NFC card, fob or wristband your members already carry will work.",
    "how-it-works.gallery.floor.caption":
      "A whole workshop running on Attraccess.",
    "how-it-works.gallery.people.caption":
      "Training a new member on a machine — signed off in the app on the spot.",
    "how-it-works.hardware.label": "The companion gadget",
    "how-it-works.hardware.title":
      "Attractap: the box that sits next to the machine",
    "how-it-works.hardware.text":
      "A small 3D-printed reader with a touch screen. It lists the resources it controls, takes the tap, and switches the machine. Power it over USB, connect it over Wi-Fi, and that is the installation.",
    "how-it-works.hardware.badge.title": "Attractap Touch",
    "how-it-works.hardware.badge.text":
      "Reader, display and relay control in one box",
    "how-it-works.hardware.nfc.title": "NFC & QR",
    "how-it-works.hardware.nfc.text":
      "Reads standard MIFARE and ISO 14443 credentials, with QR as a fallback.",
    "how-it-works.hardware.wifi.title": "Wi-Fi",
    "how-it-works.hardware.wifi.text":
      "Connects over your existing wireless network. No cabling to run.",
    "how-it-works.hardware.relay.title": "Relay control",
    "how-it-works.hardware.relay.text":
      "Switches machines directly, or through Shelly devices over MQTT and HTTP.",
    "how-it-works.hardware.ota.title": "Updates over the air",
    "how-it-works.hardware.ota.text":
      "Firmware rolls out from the dashboard to every reader at once.",
    "how-it-works.hardware.cta": "Ask about renting hardware",
    "how-it-works.steps.label": "Step by step",
    "how-it-works.steps.title":
      "From an empty dashboard to a workshop under control",
    "how-it-works.steps.subtitle": "Five steps. None of them need a developer.",
    "how-it-works.cta.title": "Ready to see it on your machines?",
    "how-it-works.cta.text":
      "Tell us which machines cause the most friction and we will show you exactly how they would run on Attraccess.",
    "how-it-works.cta.primary": "Book a demo",
    "how-it-works.cta.secondary": "Browse the features",
    "blog.label": "Blog",
    "blog.title": "Running a workshop, written down",
    "blog.subtitle":
      "Practical pieces on access management, machine automation, and getting a shared workspace under control.",
    "blog.featured.badge": "Start here",
    "blog.featured.heading": "Featured article",
    "blog.reading-time": "{minutes} min read",
    "blog.read-article": "Read the article",
    "blog.more.heading": "More from the blog",
    "blog.cta.title":
      "Reading about it is one thing. Seeing it run is another.",
    "blog.cta.text":
      "Book a 30-minute demo and we will show you the setup on machines like yours.",
    "blog.cta.primary": "Book a demo",
    "blog.cta.secondary": "See how it works",
    "blog.empty.text":
      "The article list could not be loaded during the last build. The full blog is one click away below.",
    "blog.archive.title": "Every article",
    "blog.archive.text": "The complete archive lives on our Ghost blog.",
    "blog.archive.cta": "Open the blog",
    "contact.badge.response": "A reply within one working day",
    "contact.badge.nosales": "No sales pipeline, no cold calls",
    "contact.badge.german": "Built and hosted in Germany",
    "contact.form.intro":
      "Tell us what you are trying to get under control. The more concrete you are, the more useful the first reply.",
    "contact.form.privacy":
      "Sending opens the message in your own mail program. Nothing is stored on this website.",
    "contact.photo.caption":
      "One Attractap next to each machine is the entire hardware side of a typical setup.",
    "contact.next.title": "What happens after you send it",
    "contact.next.subtitle":
      "No funnel, no drip campaign. Three steps, and you decide after each one.",
    "contact.next.reply.title": "A real reply",
    "contact.next.reply.timing": "within 1 working day",
    "contact.next.reply.text":
      "Written by the people who build Attraccess, answering what you actually asked.",
    "contact.next.call.title": "A 30-minute call",
    "contact.next.call.timing": "whenever suits you",
    "contact.next.call.text":
      "We show the dashboard and a live reader, using machines like the ones you run.",
    "contact.next.pilot.title": "A pilot on two machines",
    "contact.next.pilot.timing": "typically within 2 weeks",
    "contact.next.pilot.text":
      "Rented hardware, your resources, no commitment. If it does not fit, you send it back.",
    "contact.trust.label": "Already running Attraccess",
    "contact.team.label": "Who you are writing to",
    "contact.team.title": "A small team from Hamburg that runs makerspaces too",
    "contact.team.text":
      "Attraccess started because we were tired of paper signup sheets and a key cabinet nobody could keep track of. It runs in our own spaces before it ships to yours.",
    "contact.team.text2":
      "That also means you talk to the people who write the code — not to a reseller who has to check back.",
    "contact.team.cta": "See how it works",
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
    "hero.title":
      "Zugang & Lifecycle-Management für gemeinsam genutzte Ressourcen",
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
    "customers.subtitle":
      "Führende Hackerspaces und Forschungseinrichtungen nutzen Attraccess zur Verwaltung ihrer Ressourcen und Mitglieder.",
    "customers.workinglab.tagline": "Makerspace · Hamburg",
    "customers.workinglab.description":
      "Verwaltung von Maschinen, Werkzeugen und Mitgliederzugängen in der gesamten Einrichtung.",
    "customers.tuhh.tagline": "TU Hamburg",
    "customers.tuhh.description":
      "Rollenbasierte Zugriffskontrolle und Audit-Trails für Compliance-Anforderungen im Universitätslabor.",
    "customers.attraktor.tagline": "Hackerspace · Hamburg",
    "customers.attraktor.description":
      "Self-hosted Zugangskontrolle für einen gemeinschaftlich betriebenen Hackerspace.",

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
    "features.access.bullet1":
      "Kompatibel mit Standard-NFC-Karten & Armbändern",
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
    "cta.subtitle":
      "In wenigen Minuten startklar. Unser Team hilft Ihnen dabei, die perfekte Einrichtung für Ihren Raum zu konfigurieren.",
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
    "how-it-works.step3.bullet2":
      "Shelly-Geräte-Integration für Relaissteuerung",
    "how-it-works.step3.bullet3": "Unterstützt auch QR-Codes und PWA-Zugang",
    "how-it-works.step4.title": "Verfolgen & Automatisieren",
    "how-it-works.step4.description":
      "Überwachen Sie Live-Sitzungen, exportieren Sie CSV-Protokolle und lösen Sie Automatisierungs-Flows für Benachrichtigungen, Belüftung oder Webhooks aus.",
    "how-it-works.step4.bullet1": "Live-Sitzungsüberwachung im Dashboard",
    "how-it-works.step4.bullet2": "CSV-Export für Nutzungsberichte",
    "how-it-works.step4.bullet3":
      "Benutzerdefinierte Flows (MQTT, Webhook, E-Mail)",
    "how-it-works.step5.title": "Warten & Skalieren",
    "how-it-works.step5.description":
      "Legen Sie Wartungsregeln fest, sperren Sie Ressourcen bei Wartungsbedarf automatisch und benachrichtigen Sie Techniker. Verteilen Sie Firmware-Updates OTA an NFC-Leser.",
    "how-it-works.step5.bullet1": "Automatisierte Wartungsplanung",
    "how-it-works.step5.bullet2": "Automatische Sperrung bei Wartungsbedarf",
    "how-it-works.step5.bullet3": "OTA-Firmware-Updates für Leser",

    // Pricing Section
    "pricing.title": "Flexible Preise für jede Organisation",
    "pricing.subtitle":
      "Wählen Sie den Plan, der zu Ihren Arbeitsplatz-Bedürfnissen passt",
    "pricing.popular": "Beliebteste",
    "pricing.contact-sales": "Vertrieb kontaktieren",
    "pricing.yearly-savings": "2 Monate kostenlos",
    "pricing.monthly": "Monatlich",
    "pricing.yearly": "Jährlich",
    "pricing.per-month": "/Monat",
    "pricing.per-year": "/Jahr",
    "pricing.billed-annually": "jährliche Abrechnung · {total} / Jahr",
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
    "pricing.support.standard.tooltip":
      "E-Mail Support (Antwort innerhalb von 48h)",
    "pricing.support.priority.tooltip":
      "Prioritärer E-Mail Support (Antwort innerhalb von 24h)",
    "pricing.support.sla.tooltip": "Individuelles SLA-Agreement",

    // Feature tooltips
    "pricing.features.sso.tooltip": "Single Sign-On Integration",
    "pricing.features.maintenance.tooltip": "Automatisierte Wartungsabläufe",
    "pricing.features.billing.tooltip": "Nutzungsbasierte Abrechnungssystem",
    "pricing.features.nfc.tooltip": "NFC Reader für einfache Authentifizierung",

    // Other tooltips
    "pricing.max-resources.tooltip":
      "Resourcen mit gemieteter Hardware zählen nicht in dieses Kontingent und sind 'umsonst'",

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
    "impressum.vat.notice":
      "Kleinunternehmer gemäß § 19 UStG – keine Umsatzsteuer ausgewiesen.",
    "impressum.owner.value": "Jan Jaap",
    "impressum.address.value": "Platanenallee 2a, 22529 Hamburg, Deutschland",

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
    "contact.form.usecase": "Anwendungsfall",
    "contact.form.usecase.placeholder": "Beschreiben Sie Ihren Arbeitsbereich",
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

Anwendungsfall:
{usecase}

Mit freundlichen Grüßen,
{name}`,

    // About
    "about.mission":
      "Wir ermöglichen Gemeinschaftsarbeitsplätze mit Zugangs-Kontrolle – ohne Komplexität.",

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
    "home.how.step2.text":
      "Das System prüft in Echtzeit: berechtigt und eingewiesen?",
    "home.how.step3.title": "Freigeben",
    "home.how.step3.text":
      "Die Schaltbox gibt den Strom frei – die Maschine startet.",
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
    "home.pricing.subtitle":
      "Alle Preise netto. Monatspreise angegeben, jährliche Abrechnung. Hardware bequem zur Miete.",
    "home.pricing.from": "ab",
    "home.pricing.per-month": "/ Monat",
    "home.pricing.billed-annually": "Jährliche Abrechnung · {total} / Jahr",
    "home.pricing.no-card": "Keine Kreditkarte. Kein Zeitlimit.",
    "home.pricing.nonprofit.name": "Non-Profit",
    "home.pricing.nonprofit.period": "für immer",
    "home.pricing.nonprofit.desc": "Wer gemeinnützig ist, darf. Punkt.",
    "home.pricing.nonprofit.item1":
      "Selbst-gehostete Software, dauerhaft gratis",
    "home.pricing.nonprofit.item2": "Alle Funktionen inklusive",
    "home.pricing.nonprofit.item3": "Source Available (Prosperity License)",
    "home.pricing.nonprofit.item4": "Hardware & Support optional",
    "home.pricing.nonprofit.cta": "Kostenlos loslegen",
    "home.pricing.community.name": "Community",
    "home.pricing.community.badge": "Beliebt",
    "home.pricing.community.desc":
      "Für kleine gewerbliche Werkstätten und Makerspaces.",
    "home.pricing.community.item1": "Alle Kernfunktionen",
    "home.pricing.community.item2": "Einweisungs- & Nutzungsnachweise",
    "home.pricing.community.item3": "Onboarding-Begleitung inklusive",
    "home.pricing.community.item4": "Hardware bequem zur Miete",
    "home.pricing.community.cta": "30 Tage kostenlos testen",
    "home.pricing.standard.name": "Standard",
    "home.pricing.standard.desc":
      "Für Unternehmen mit vielen Maschinen und Nutzern.",
    "home.pricing.standard.item1": "Alles aus Community",
    "home.pricing.standard.item2": "Priorisierter Support",
    "home.pricing.standard.item3": "Abrechnung & Guthaben",
    "home.pricing.standard.item4": "SLA mit garantierter Reaktionszeit",
    "home.pricing.standard.cta": "Beratung anfragen",
    "home.pricing.note":
      "Fragen zur passenden Lizenz? Wir beraten unverbindlich.",

    "home.cta.title.line1": "Bereit, wenn",
    "home.cta.title.line2": "Sie es sind.",
    "home.cta.text":
      "Im Browser, ohne Installation – vom Werkstatt-Tablet bis zum Smartphone. On-Premise gehostet und DSGVO-konform.",
    "home.cta.primary": "Jetzt kostenlos starten",

    // ==== ATT-780: pages reworked from Rodrigo feedback ====
    "media.placeholder.badge": "Foto folgt",
    "media.reader-on-machine.alt":
      "Ein Attractap Touch neben einem 3D-Drucker, auf dem Display eine Ressourcenliste",
    "media.reader-credentials.alt":
      "Ein Attractap neben einem NFC-Schlüsselanhänger und einer NFC-Karte",
    "media.training.alt":
      "Attraccess-Dashboard: Einweisungsstatus und Rollen je Mitglied",
    "media.billing.alt":
      "Attraccess-Dashboard: Preise pro Nutzung und pro Minute mit Guthaben",
    "media.session-log.alt":
      "Attraccess-Dashboard: Nutzungssitzungen mit Start, Ende und Dauer",
    "media.flow-editor.alt":
      "Der Attraccess-Flow-Editor mit Trigger-, Warte- und MQTT-Knoten",
    "media.architecture.alt":
      "Diagramm: Nutzer, NFC-Reader, On-Premise-Server und OIDC-Provider",
    "media.maintenance.alt": "Illustration zu Wartungsplanung und Skalierung",
    "media.people-at-machine.alt":
      "Foto benötigt: Ein Mitglied wird an einer Maschine eingewiesen",
    "media.people-tapping.alt":
      "Foto benötigt: Jemand hält die Karte an einen Attractap, bevor die Arbeit losgeht",
    "media.workshop-floor.alt":
      "Foto benötigt: Eine Werkstatt mit mehreren laufenden Maschinen",
    "media.team.alt": "Foto benötigt: Das Attraccess-Team",
    "features.overview.title": "Das ganze Produkt auf einen Blick",
    "features.subtitle":
      "Alles, was Sie brauchen, um Zugang zu steuern, Nutzung zu erfassen und Ihre Werkstatt zu automatisieren — Funktion für Funktion, mit den Oberflächen dahinter.",
    "features.jump.label": "Direkt zu einer Funktion",
    "features.detail.label": "Im Detail",
    "features.detail.title": "Was jede Funktion tatsächlich macht",
    "features.detail.subtitle":
      "Kein Häkchen-Bingo. Hier steht, was Sie bekommen, wie es aussieht und wofür es in der Praxis genutzt wird.",
    "features.detail.access.label": "NFC-Zugang",
    "features.detail.access.title": "Jede Maschine startet per Tap",
    "features.detail.access.description":
      "Ein Attractap sitzt neben der Maschine und spricht mit Ihrem Attraccess-Server. Ein Mitglied hält die Karte dran, der Server prüft Einweisung und Berechtigung, das Relais schaltet in deutlich unter einer Sekunde. Keine geteilten Schlüssel, keine Papierliste, niemand muss danebenstehen.",
    "features.detail.access.bullet1.title": "Karten, die Sie ohnehin ausgeben",
    "features.detail.access.bullet1.text":
      "Gängige MIFARE- und ISO-14443-Karten, Schlüsselanhänger und Armbänder funktionieren direkt.",
    "features.detail.access.bullet2.title": "Mehr als Karten",
    "features.detail.access.bullet2.text":
      "QR-Codes und die Browser-App decken Gäste ab und alle, die ihre Karte vergessen haben.",
    "features.detail.access.bullet3.title": "Echte Relaissteuerung",
    "features.detail.access.bullet3.text":
      "Maschinen schalten über GPIO, HTTP, MQTT oder handelsübliche Shelly-Geräte.",
    "features.detail.access.bullet4.title": "Sofort entziehbar",
    "features.detail.access.bullet4.text":
      "Berechtigung im Dashboard entziehen — der nächste Tap wird abgelehnt. Kein Schlüssel einzusammeln.",
    "features.detail.access.usecase":
      "Ein Lasercutter, der nur für eingewiesene Mitglieder läuft — und stehen bleibt, sobald die Einweisung abläuft.",
    "features.detail.access.caption":
      "Ein Attractap mit NFC-Karte und Schlüsselanhänger",
    "features.detail.permissions.label": "Berechtigungen",
    "features.detail.permissions.title":
      "Die Einweisung entscheidet, wer was starten darf",
    "features.detail.permissions.description":
      "Zugang gilt pro Ressource, nicht pro Gebäude. Jedes Mitglied ist entweder eingewiesen (darf nutzen), Einweiser (darf andere freigeben) oder hat keinen Zugang. Alles in einer Tabelle, mit dem Datum der Einweisung neben jedem Namen.",
    "features.detail.permissions.bullet1.title": "Zwei klare Stufen",
    "features.detail.permissions.bullet1.text":
      "„Eingewiesen“ darf nutzen, „Einweiser“ darf andere freigeben. Dazwischen gibt es nichts falsch zu konfigurieren.",
    "features.detail.permissions.bullet2.title":
      "Die Einweisung ist dokumentiert",
    "features.detail.permissions.bullet2.text":
      "Jede Freigabe hält fest, wer wann von wem eingewiesen wurde — prüfungsfest.",
    "features.detail.permissions.bullet3.title": "Einweisungen mit Ablaufdatum",
    "features.detail.permissions.bullet3.text":
      "Gültigkeitsdauer setzen, und der Zugang endet automatisch, wenn eine Auffrischung fällig ist.",
    "features.detail.permissions.bullet4.title": "Auch für viele auf einmal",
    "features.detail.permissions.bullet4.text":
      "Ressourcen gruppieren und Zugang für eine ganze Gruppe in einem Schritt vergeben.",
    "features.detail.permissions.usecase":
      "Neues Mitglied kommt am Samstag, wird an den 3D-Druckern eingewiesen und druckt zehn Minuten später — ohne dass jemand an den Schlüsselschrank muss.",
    "features.detail.permissions.caption":
      "Einweisungsstatus und Rollen je Mitglied",
    "features.detail.flows.label": "Automatisierung",
    "features.detail.flows.title":
      "Die Werkstatt verdrahten, ohne zu programmieren",
    "features.detail.flows.description":
      "Flows reagieren auf das, was an einer Ressource passiert: Sitzung gestartet, Sitzung beendet, Wartung fällig, Zugang verweigert. Knoten auf die Fläche ziehen, verbinden — und die Kette läuft bei jedem Auslöser.",
    "features.detail.flows.bullet1.title": "Auslöser, die zählen",
    "features.detail.flows.bullet1.text":
      "Start, Stopp, Timeout, abgelehnter Zugang und Wartungsereignisse starten einen Flow.",
    "features.detail.flows.bullet2.title": "Aktionen an Bord",
    "features.detail.flows.bullet2.text":
      "MQTT-Nachricht, HTTP-Webhook, E-Mail und Push-Benachrichtigung sind eingebaut.",
    "features.detail.flows.bullet3.title": "Zeit inklusive",
    "features.detail.flows.bullet3.text":
      "Warte-Knoten lassen die Absaugung noch fünf Minuten weiterlaufen, nachdem die Säge steht.",
    "features.detail.flows.bullet4.title": "Platzhalter in Nachrichten",
    "features.detail.flows.bullet4.text":
      "Ressource und Nutzer lassen sich direkt in Topics und Nachrichtentexte einsetzen.",
    "features.detail.flows.usecase":
      "Lasercutter startet, die Absaugung geht per MQTT an. Sitzung endet, die Absaugung läuft fünf Minuten nach und schaltet dann ab.",
    "features.detail.flows.caption":
      "Der Flow-Editor mit einer MQTT-Automatisierung",
    "features.detail.analytics.label": "Nutzungsdaten",
    "features.detail.analytics.title":
      "Jede Sitzung protokolliert, ohne dass jemand etwas notiert",
    "features.detail.analytics.description":
      "Attraccess erfasst, wer welche Ressource genutzt hat, wann es losging, wann Schluss war und wie lange sie lief. Die Historie lässt sich nach Ressource oder Mitglied filtern und jederzeit als CSV exportieren.",
    "features.detail.analytics.bullet1.title": "Automatisch",
    "features.detail.analytics.bullet1.text":
      "Der Tap startet das Protokoll. Niemand muss ans Ein- oder Austragen denken.",
    "features.detail.analytics.bullet2.title": "Pro Ressource und pro Mitglied",
    "features.detail.analytics.bullet2.text":
      "„Wer war letzten Dienstag an der CNC?“ ist in zwei Klicks beantwortet.",
    "features.detail.analytics.bullet3.title": "CSV-Export",
    "features.detail.analytics.bullet3.text":
      "Zahlen für die Buchhaltung, den Förderbericht oder die eigene Tabelle.",
    "features.detail.analytics.bullet4.title": "Live-Ansicht",
    "features.detail.analytics.bullet4.text":
      "Sehen, welche Maschinen gerade laufen — und wie lange schon.",
    "features.detail.analytics.usecase":
      "Ein Quartalsbericht zur Maschinenauslastung, gebaut aus echten Sitzungen statt aus Schätzungen.",
    "features.detail.analytics.caption":
      "Nutzungshistorie einer einzelnen Ressource",
    "features.detail.maintenance.label": "Wartung",
    "features.detail.maintenance.title":
      "Maschinen nehmen sich selbst aus dem Betrieb",
    "features.detail.maintenance.description":
      "Intervall pro Ressource in Nutzungen oder Stunden festlegen. Ist es erreicht, sperrt Attraccess die Maschine, informiert die Technik und hält sie gesperrt, bis jemand die Wartung abzeichnet.",
    "features.detail.maintenance.bullet1.title": "Nutzungsbasierte Intervalle",
    "features.detail.maintenance.bullet1.text":
      "Echte Laufzeit oder Sitzungen zählen, statt nach Kalender zu schätzen.",
    "features.detail.maintenance.bullet2.title": "Automatische Sperre",
    "features.detail.maintenance.bullet2.text":
      "Der nächste Tap wird abgelehnt — mit dem Grund direkt auf dem Display.",
    "features.detail.maintenance.bullet3.title": "Technik wird informiert",
    "features.detail.maintenance.bullet3.text":
      "Die zuständige Person erfährt sofort, wenn eine Maschine ausfällt.",
    "features.detail.maintenance.bullet4.title": "Abgezeichnet im Protokoll",
    "features.detail.maintenance.bullet4.text":
      "Erledigte Wartungen bleiben in der Historie der Ressource.",
    "features.detail.maintenance.usecase":
      "Der Filamenttrockner sperrt nach 200 Stunden und öffnet wieder, sobald der Trockenmittelwechsel bestätigt ist.",
    "features.detail.maintenance.caption":
      "Wartungs- und Lifecycle-Regeln je Ressource",
    "features.detail.billing.label": "Abrechnung",
    "features.detail.billing.title":
      "Pro Nutzung oder pro Minute abrechnen — aus denselben Sitzungsdaten",
    "features.detail.billing.description":
      "Jede Sitzung wird ohnehin gemessen, also ist Abrechnung nur eine Frage des Preises. Mitglieder haben ein Guthaben, die Kosten werden am Ende der Sitzung abgezogen, und der Stand ist für beide Seiten sichtbar.",
    "features.detail.billing.bullet1.title": "Zwei Preisarten",
    "features.detail.billing.bullet1.text":
      "Pauschale pro Nutzung, Preis pro Minute — oder beides zusammen.",
    "features.detail.billing.bullet2.title": "Guthaben im Voraus",
    "features.detail.billing.bullet2.text":
      "Guthaben aufladen; Sitzungen buchen automatisch davon ab.",
    "features.detail.billing.bullet3.title": "Transparent für Mitglieder",
    "features.detail.billing.bullet3.text":
      "Mitglieder sehen ihr Guthaben und was jede Sitzung gekostet hat.",
    "features.detail.billing.bullet4.title": "Pro Ressource",
    "features.detail.billing.bullet4.text":
      "Jede Maschine kann völlig eigene Preise haben.",
    "features.detail.billing.usecase":
      "Der Resin-Drucker kostet 0,50 € pro Start plus 0,05 € pro Minute — ohne Kasse des Vertrauens neben der Maschine.",
    "features.detail.billing.caption": "Preise und Guthaben einer Ressource",
    "features.detail.selfhosted.label": "Self-Hosted",
    "features.detail.selfhosted.title":
      "Läuft auf Ihrem Server, nach Ihren Regeln",
    "features.detail.selfhosted.description":
      "Attraccess ist ein Docker-Container auf Ihrer eigenen Hardware oder in Ihrer eigenen Cloud. Mitgliederdaten, Karten-IDs und Nutzungshistorie verlassen Ihre Infrastruktur nicht, und die Anmeldung hängt an dem Identity-Provider, den Sie schon nutzen.",
    "features.detail.selfhosted.bullet1.title": "Ein Container",
    "features.detail.selfhosted.bullet1.text":
      "docker compose up — vom Raspberry Pi bis zum Server im Rack.",
    "features.detail.selfhosted.bullet2.title": "OIDC Single Sign-On",
    "features.detail.selfhosted.bullet2.text":
      "Keycloak, Authentik, Entra ID — was auch immer bei Ihnen läuft.",
    "features.detail.selfhosted.bullet3.title": "DSGVO von Haus aus",
    "features.detail.selfhosted.bullet3.text":
      "Personenbezogene Daten bleiben im Haus, was das Gespräch zur Auftragsverarbeitung kurz hält.",
    "features.detail.selfhosted.bullet4.title": "Source Available",
    "features.detail.selfhosted.bullet4.text":
      "Prosperity Public License 3.0: kostenlos für Non-Profits, kommerzielle Lizenz für alle anderen.",
    "features.detail.selfhosted.usecase":
      "Ein Uni-Labor, das Studierendendaten nicht an einen SaaS-Anbieter geben darf, betreibt Attraccess auf der eigenen VM.",
    "features.detail.selfhosted.caption":
      "Wie sich Attraccess in Ihr Netz einfügt",
    "features.extras.title":
      "Und die Dinge, die erst auffallen, wenn sie fehlen",
    "features.extras.subtitle":
      "Kleinere Funktionen, die in jedem Tarif enthalten sind.",
    "features.extras.sso.title": "Single Sign-On",
    "features.extras.sso.text":
      "Beliebigen OIDC-Provider anbinden, damit sich Mitglieder mit dem vorhandenen Konto anmelden.",
    "features.extras.pwa.title": "Läuft auf jedem Handy",
    "features.extras.pwa.text":
      "Die Browser-App installiert sich wie eine native — ohne App Store, ohne Rollout.",
    "features.extras.qr.title": "Zugang per QR-Code",
    "features.extras.qr.text":
      "Für Maschinen, bei denen ein Reader übertrieben wäre, reicht ein ausgedruckter Code.",
    "features.extras.mqtt.title": "MQTT & Webhooks",
    "features.extras.mqtt.text":
      "Spricht mit der Automatisierung, die bei Ihnen bereits läuft.",
    "features.extras.notifications.title": "Benachrichtigungen",
    "features.extras.notifications.text":
      "E-Mail und Push, wenn eine Maschine sperrt, eine Sitzung zu lange läuft oder Wartung fällig ist.",
    "features.extras.export.title": "CSV-Export",
    "features.extras.export.text":
      "Jede Tabelle lässt sich exportieren — Ihre Auswertung hängt nie an uns.",
    "features.extras.multitenant.title": "Gruppen & Bereiche",
    "features.extras.multitenant.text":
      "Ressourcen nach Raum, Abteilung oder Standort ordnen.",
    "features.extras.i18n.title": "Deutsch & Englisch",
    "features.extras.i18n.text":
      "Die komplette Oberfläche, inklusive der Anzeigen auf den Readern.",
    "features.extras.audit.title": "Änderungsprotokoll",
    "features.extras.audit.text": "Wer wann welche Berechtigung geändert hat.",
    "features.faq.title": "Fragen, die vor einer Demo immer kommen",
    "features.faq.hardware.question": "Muss ich Ihre Hardware kaufen?",
    "features.faq.hardware.answer":
      "Nein. Attraccess steuert genauso gängige Shelly-Relais und generische NFC-Reader an. Den Attractap bauen und vermieten wir, weil er der schnellste Weg zum Start ist — nötig ist er nicht.",
    "features.faq.offline.question": "Was passiert, wenn das Netz ausfällt?",
    "features.faq.offline.answer":
      "Reader halten eine laufende Sitzung am Leben und fallen auf ihren letzten bekannten Stand zurück. Sobald die Verbindung zurück ist, werden die zwischenzeitlich erfassten Sitzungen synchronisiert.",
    "features.faq.migrate.question":
      "Wir arbeiten heute mit Tabellen und Schlüsselschrank. Wie aufwendig ist der Wechsel?",
    "features.faq.migrate.answer":
      "Mitglieder und Ressourcen lassen sich per CSV importieren, und Sie können Maschine für Maschine umstellen. Die meisten starten mit den zwei Maschinen, um die es den meisten Ärger gibt.",
    "features.faq.license.question":
      "Ist es für Non-Profits wirklich kostenlos?",
    "features.faq.license.answer":
      "Ja. Die Prosperity Public License erlaubt die nicht-kommerzielle Nutzung dauerhaft kostenlos, mit allen Funktionen. Hardware und Support sind optional.",
    "features.faq.scale.question":
      "Wie viele Maschinen und Mitglieder verkraftet das?",
    "features.faq.scale.answer":
      "Die größten Installationen betreiben weit über hundert Ressourcen. Eine harte Grenze gibt es in der Software nicht — die Tarife unterscheiden sich in Support und Lizenz, nicht im Funktionsumfang.",
    "features.closing.title": "Sehen Sie es auf Ihren eigenen Maschinen",
    "features.closing.text":
      "30 Minuten Gespräch, Ihre Maschinen auf dem Bildschirm und eine ehrliche Einschätzung, ob Attraccess passt.",
    "features.closing.secondary": "So funktioniert es",
    "how-it-works.hero.setup.value": "< 1 Tag",
    "how-it-works.hero.setup.label": "Vom Auspacken bis zum ersten Tap",
    "how-it-works.hero.tap.value": "< 1 s",
    "how-it-works.hero.tap.label": "Vom Kartentap zur laufenden Maschine",
    "how-it-works.hero.hardware.value": "0 €",
    "how-it-works.hero.hardware.label":
      "Hardware-Investition vorab — Miete statt Kauf",
    "how-it-works.demo.label": "In Aktion",
    "how-it-works.demo.title": "Das Ganze, von vorne bis hinten",
    "how-it-works.demo.subtitle":
      "Karte auflegen, Maschine starten, Sitzung beenden, Protokoll lesen. Alles von dieser Seite in wenigen Minuten.",
    "how-it-works.demo.play": "Demo abspielen",
    "how-it-works.demo.caption":
      "Aufgenommen in einem echten Makerspace, nicht im Mockup.",
    "how-it-works.demo.poster.alt": "Ein Attractap neben einem 3D-Drucker",
    "how-it-works.demo.pending.title":
      "Das vollständige Demo-Video entsteht gerade",
    "how-it-works.demo.pending.text":
      "Bis es online ist, führen wir Sie im Gespräch durch das ganze System — und beantworten die Fragen, die ein Video offenlassen würde.",
    "how-it-works.demo.pending.cta": "Live-Demo vereinbaren",
    "how-it-works.gallery.label": "In der Werkstatt",
    "how-it-works.gallery.title": "So sieht es an der Maschine aus",
    "how-it-works.gallery.subtitle":
      "Eine kleine Box neben jeder Maschine. Mehr ist davon nicht zu sehen.",
    "how-it-works.gallery.reader.caption":
      "Ein Attractap Touch neben einem 3D-Drucker: Ressource am Display wählen, Karte auflegen, los.",
    "how-it-works.gallery.tap.caption":
      "Ein Mitglied meldet sich an, bevor die Arbeit losgeht.",
    "how-it-works.gallery.credentials.caption":
      "Jede NFC-Karte, jeder Anhänger und jedes Armband Ihrer Mitglieder funktioniert.",
    "how-it-works.gallery.floor.caption":
      "Eine ganze Werkstatt, die auf Attraccess läuft.",
    "how-it-works.gallery.people.caption":
      "Einweisung an der Maschine — direkt vor Ort in der App abgezeichnet.",
    "how-it-works.hardware.label": "Das Gerät an der Maschine",
    "how-it-works.hardware.title": "Attractap: die Box neben der Maschine",
    "how-it-works.hardware.text":
      "Ein kleiner 3D-gedruckter Reader mit Touchscreen. Er zeigt die Ressourcen, die er steuert, nimmt den Tap entgegen und schaltet die Maschine. Strom über USB, Verbindung über WLAN — das ist die Installation.",
    "how-it-works.hardware.badge.title": "Attractap Touch",
    "how-it-works.hardware.badge.text":
      "Reader, Display und Relaissteuerung in einem Gehäuse",
    "how-it-works.hardware.nfc.title": "NFC & QR",
    "how-it-works.hardware.nfc.text":
      "Liest gängige MIFARE- und ISO-14443-Medien, QR-Code als Rückfallebene.",
    "how-it-works.hardware.wifi.title": "WLAN",
    "how-it-works.hardware.wifi.text":
      "Verbindet sich über Ihr vorhandenes Funknetz. Kein Kabel zu verlegen.",
    "how-it-works.hardware.relay.title": "Relaissteuerung",
    "how-it-works.hardware.relay.text":
      "Schaltet Maschinen direkt oder über Shelly-Geräte per MQTT und HTTP.",
    "how-it-works.hardware.ota.title": "Updates über die Luft",
    "how-it-works.hardware.ota.text":
      "Firmware wird aus dem Dashboard auf alle Reader gleichzeitig verteilt.",
    "how-it-works.hardware.cta": "Hardware zur Miete anfragen",
    "how-it-works.steps.label": "Schritt für Schritt",
    "how-it-works.steps.title": "Vom leeren Dashboard zur Werkstatt im Griff",
    "how-it-works.steps.subtitle":
      "Fünf Schritte. Für keinen davon brauchen Sie Entwickler.",
    "how-it-works.cta.title": "Bereit, es an Ihren Maschinen zu sehen?",
    "how-it-works.cta.text":
      "Sagen Sie uns, welche Maschinen den meisten Ärger machen — wir zeigen Ihnen genau, wie sie mit Attraccess laufen würden.",
    "how-it-works.cta.primary": "Demo vereinbaren",
    "how-it-works.cta.secondary": "Funktionen ansehen",
    "blog.label": "Blog",
    "blog.title": "Werkstattbetrieb, aufgeschrieben",
    "blog.subtitle":
      "Praxisnahe Texte zu Zugriffsmanagement, Maschinenautomatisierung und dem Alltag in gemeinsam genutzten Werkstätten.",
    "blog.featured.badge": "Hier anfangen",
    "blog.featured.heading": "Empfohlener Artikel",
    "blog.reading-time": "{minutes} Min. Lesezeit",
    "blog.read-article": "Artikel lesen",
    "blog.more.heading": "Mehr aus dem Blog",
    "blog.cta.title": "Darüber lesen ist das eine. Es laufen sehen das andere.",
    "blog.cta.text":
      "Vereinbaren Sie 30 Minuten Demo — wir zeigen den Aufbau an Maschinen wie Ihren.",
    "blog.cta.primary": "Demo vereinbaren",
    "blog.cta.secondary": "So funktioniert es",
    "blog.empty.text":
      "Die Artikelliste konnte beim letzten Build nicht geladen werden. Der vollständige Blog ist unten nur einen Klick entfernt.",
    "blog.archive.title": "Alle Artikel",
    "blog.archive.text": "Das komplette Archiv liegt in unserem Ghost-Blog.",
    "blog.archive.cta": "Blog öffnen",
    "contact.badge.response": "Antwort innerhalb eines Werktags",
    "contact.badge.nosales": "Kein Vertriebstrichter, keine Kaltakquise",
    "contact.badge.german": "Entwickelt und gehostet in Deutschland",
    "contact.form.intro":
      "Schreiben Sie uns, was Sie in den Griff bekommen wollen. Je konkreter, desto brauchbarer die erste Antwort.",
    "contact.form.privacy":
      "Beim Absenden öffnet sich die Nachricht in Ihrem eigenen Mailprogramm. Auf dieser Website wird nichts gespeichert.",
    "contact.photo.caption":
      "Ein Attractap neben jeder Maschine — das ist die komplette Hardware-Seite eines typischen Aufbaus.",
    "contact.next.title": "Was nach dem Absenden passiert",
    "contact.next.subtitle":
      "Kein Funnel, keine Mailstrecke. Drei Schritte, und nach jedem entscheiden Sie neu.",
    "contact.next.reply.title": "Eine echte Antwort",
    "contact.next.reply.timing": "innerhalb 1 Werktags",
    "contact.next.reply.text":
      "Geschrieben von den Leuten, die Attraccess bauen — zu dem, was Sie tatsächlich gefragt haben.",
    "contact.next.call.title": "30 Minuten Gespräch",
    "contact.next.call.timing": "wann es Ihnen passt",
    "contact.next.call.text":
      "Wir zeigen Dashboard und einen echten Reader, anhand von Maschinen wie Ihren.",
    "contact.next.pilot.title": "Ein Pilot an zwei Maschinen",
    "contact.next.pilot.timing": "meist innerhalb von 2 Wochen",
    "contact.next.pilot.text":
      "Hardware zur Miete, Ihre Ressourcen, keine Bindung. Passt es nicht, geht sie zurück.",
    "contact.trust.label": "Nutzen Attraccess bereits",
    "contact.team.label": "An wen Sie schreiben",
    "contact.team.title":
      "Ein kleines Team aus Hamburg, das selbst Makerspaces betreibt",
    "contact.team.text":
      "Attraccess ist entstanden, weil wir Papierlisten und einen Schlüsselschrank satthatten, den niemand im Blick behalten konnte. Es läuft in unseren eigenen Räumen, bevor es zu Ihnen kommt.",
    "contact.team.text2":
      "Das heißt auch: Sie sprechen mit den Leuten, die den Code schreiben — nicht mit einem Händler, der erst rückfragen muss.",
    "contact.team.cta": "So funktioniert es",
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

  const t: Translate = (key, params) => {
    const translation =
      translations[language][
        key as keyof (typeof translations)[typeof language]
      ];
    return interpolate(translation || key, params);
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
