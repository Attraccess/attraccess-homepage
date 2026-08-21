import React from "react";
import { ArrowRight, Cable, GraduationCap, HeartHandshake, Layers3, Mail, ShieldAlert, Wrench, type LucideIcon } from "lucide-react";
import { useI18n, type Language } from "@/contexts/i18n";
import { Reveal } from "@/components/home/Reveal";

type Copy = {
  problem: [string, string, string]; pillars: [string, string, [string, string], [string, string], [string, string], [string, string]]; teaching: [string, string]; progression: [string, string]; deployment: [string, string]; boundary: [string, string]; pilot: [string, string]; pricing: [string, string]; nonprofit: [string, string]; final: [string, string]; email: string;
};

const copy: Record<Language, Copy> = {
  en: {
    problem: ["Disconnected records", "A spreadsheet cannot authorize a machine.", "When permissions live in training records, spreadsheets, or signs, they are separated from the point of use. Attraccess brings the decision to the machine interface."],
    pillars: ["Operational proof", "Control the use, retain the context.", ["Machine-specific authorization", "Check the permission assigned to this machine."], ["Session records", "Keep a traceable operational record of use."], ["Workshop oversight", "Use current sessions to support supervision."], ["Maintenance context", "Use operating history in maintenance workflows."]],
    teaching: ["For teaching workshops", "Give instructors a practical way to connect introductions, machine-specific authorization, and shared equipment without turning the workshop into a generic access-control project."],
    progression: ["Competency progression", "Reflect how people learn: introduce a machine, grant authorization for that machine, and review its operational history as the workshop evolves."],
    deployment: ["Hardware and deployment", "Discuss interfaces, readers, deployment, and integrations in the context of your machines and operating environment."],
    boundary: ["A clear safety boundary", "Attraccess supports operational authorization. It is outside the safety-rated control chain and does not replace required machine safeguarding."],
    pilot: ["90-day pilot", "Start with three to five machines. Together we map the control points, machine interfaces, and workshop routines that matter before a wider rollout."],
    pricing: ["Pricing that fits the deployment", "Pilot, deployment, hardware, and support are scoped around your operating context. Ask for a proposal rather than choosing a generic SaaS tier."],
    nonprofit: ["A path for nonprofits", "If you are a nonprofit workshop or educational organization, talk to us about an appropriate deployment and support path."],
    final: ["Bring authorization to the point of use.", "Tell us about your machines, users, and workshop model. We will help determine whether a focused pilot is the right next step."],
    email: "Open draft email",
  },
  de: {
    problem: ["Getrennte Nachweise", "Eine Tabelle autorisiert keine Maschine.", "Wenn Berechtigungen in Einweisungen, Tabellen oder Aushängen liegen, sind sie vom Ort der Nutzung getrennt. Attraccess bringt die Entscheidung an die Maschinenschnittstelle."],
    pillars: ["Betriebliche Nachweise", "Nutzung steuern, Kontext behalten.", ["Maschinenspezifische Berechtigung", "Prüfen Sie die für diese Maschine hinterlegte Berechtigung."], ["Sitzungsprotokolle", "Erhalten Sie einen nachvollziehbaren betrieblichen Nutzungsnachweis."], ["Werkstattaufsicht", "Aktuelle Sitzungen unterstützen die Aufsicht."], ["Wartungskontext", "Nutzen Sie Betriebshistorien in Wartungsabläufen."]],
    teaching: ["Für Lehrwerkstätten", "Verbinden Sie Einweisungen, maschinenspezifische Berechtigungen und gemeinsam genutzte Geräte, ohne die Werkstatt zu einem allgemeinen Zutrittsprojekt zu machen."],
    progression: ["Kompetenzentwicklung", "Bilden Sie den Lernweg ab: Maschine einweisen, für diese Maschine berechtigen und den Betrieb im Verlauf der Werkstatt nachvollziehen."],
    deployment: ["Hardware und Deployment", "Besprechen Sie Schnittstellen, Leser, Deployment und Integrationen im Kontext Ihrer Maschinen und Betriebsumgebung."],
    boundary: ["Klare Sicherheitsgrenze", "Attraccess unterstützt betriebliche Berechtigungen. Es ist außerhalb der sicherheitsgerichteten Steuerung und ersetzt keine erforderlichen Maschinenschutzmaßnahmen."],
    pilot: ["90-Tage-Pilot", "Starten Sie mit drei bis fünf Maschinen. Gemeinsam erfassen wir Kontrollpunkte, Maschinenschnittstellen und Werkstattabläufe vor einem breiteren Rollout."],
    pricing: ["Preise passend zum Deployment", "Pilot, Deployment, Hardware und Support werden für Ihren Betrieb zugeschnitten. Fragen Sie nach einem Angebot statt einen generischen SaaS-Tarif zu wählen."],
    nonprofit: ["Ein Weg für Non-Profits", "Wenn Sie eine gemeinnützige Werkstatt oder Bildungseinrichtung sind, sprechen Sie mit uns über einen passenden Deployment- und Supportweg."],
    final: ["Berechtigung an den Ort der Nutzung bringen.", "Erzählen Sie uns von Ihren Maschinen, Nutzern und Ihrem Werkstattmodell. Wir klären, ob ein fokussierter Pilot der richtige nächste Schritt ist."],
    email: "E-Mail-Entwurf öffnen",
  },
  fr: {
    problem: ["Des dossiers déconnectés", "Un tableur n'autorise pas une machine.", "Lorsque les autorisations vivent dans des attestations, des tableurs ou des affiches, elles sont séparées du lieu d'utilisation. Attraccess apporte la décision à l'interface machine."],
    pillars: ["Preuve opérationnelle", "Contrôler l'utilisation, conserver le contexte.", ["Autorisation par machine", "Vérifiez l'autorisation attribuée à cette machine."], ["Enregistrements de session", "Conservez une trace opérationnelle de l'utilisation."], ["Supervision de l'atelier", "Utilisez les sessions en cours pour soutenir la supervision."], ["Contexte de maintenance", "Utilisez l'historique de fonctionnement dans les workflows de maintenance."]],
    teaching: ["Pour les ateliers pédagogiques", "Reliez les initiations, les autorisations par machine et les équipements partagés sans transformer l'atelier en projet générique de contrôle d'accès."],
    progression: ["Progression des compétences", "Reflétez le parcours d'apprentissage : initier à une machine, accorder l'autorisation correspondante, puis examiner son historique opérationnel."],
    deployment: ["Matériel et déploiement", "Discutez des interfaces, lecteurs, déploiements et intégrations dans le contexte de vos machines et de votre environnement."],
    boundary: ["Une limite de sécurité claire", "Attraccess prend en charge l'autorisation opérationnelle. Il est hors de la chaîne de contrôle de sécurité et ne remplace pas les protections machine requises."],
    pilot: ["Pilote de 90 jours", "Commencez avec trois à cinq machines. Ensemble, nous cartographions les points de contrôle, interfaces machine et routines importantes avant un déploiement plus large."],
    pricing: ["Une tarification adaptée au déploiement", "Le pilote, le déploiement, le matériel et le support sont définis selon votre contexte. Demandez une proposition plutôt que de choisir un niveau SaaS générique."],
    nonprofit: ["Un parcours pour les associations", "Si vous êtes un atelier ou organisme éducatif à but non lucratif, échangez avec nous sur un déploiement et un support adaptés."],
    final: ["Apportez l'autorisation au point d'utilisation.", "Parlez-nous de vos machines, utilisateurs et modèle d'atelier. Nous déterminerons si un pilote ciblé est la bonne prochaine étape."],
    email: "Ouvrir un brouillon d'e-mail",
  },
  nl: {
    problem: ["Losse registraties", "Een spreadsheet autoriseert geen machine.", "Wanneer autorisaties in instructieregistraties, spreadsheets of bordjes staan, zijn ze losgekoppeld van de plek van gebruik. Attraccess brengt de beslissing naar de machine-interface."],
    pillars: ["Operationeel bewijs", "Gebruik sturen, context behouden.", ["Machinespecifieke autorisatie", "Controleer de toestemming die aan deze machine is gekoppeld."], ["Sessieregistraties", "Bewaar een traceerbaar operationeel gebruiksrecord."], ["Werkplaatsoverzicht", "Gebruik actuele sessies ter ondersteuning van toezicht."], ["Onderhoudscontext", "Gebruik bedrijfshistorie in onderhoudsworkflows."]],
    teaching: ["Voor onderwijswerkplaatsen", "Verbind instructies, machinespecifieke autorisatie en gedeelde apparatuur zonder de werkplaats in een algemeen toegangscontroleproject te veranderen."],
    progression: ["Competentieontwikkeling", "Volg hoe mensen leren: introduceer een machine, verleen autorisatie voor die machine en bekijk de operationele historie terwijl de werkplaats groeit."],
    deployment: ["Hardware en deployment", "Bespreek interfaces, lezers, deployment en integraties in de context van uw machines en bedrijfsomgeving."],
    boundary: ["Een duidelijke veiligheidsgrens", "Attraccess ondersteunt operationele autorisatie. Het valt buiten de veiligheidsgerichte regelketen en vervangt geen vereiste machinebeveiliging."],
    pilot: ["Pilot van 90 dagen", "Start met drie tot vijf machines. Samen brengen we controlepunten, machine-interfaces en relevante werkplaatsroutines in kaart vóór een bredere uitrol."],
    pricing: ["Prijzen passend bij de deployment", "Pilot, deployment, hardware en ondersteuning worden bepaald rond uw situatie. Vraag een voorstel in plaats van een generieke SaaS-laag te kiezen."],
    nonprofit: ["Een route voor non-profits", "Bent u een non-profitwerkplaats of onderwijsorganisatie, bespreek dan een passende deployment- en ondersteuningsroute met ons."],
    final: ["Breng autorisatie naar de plek van gebruik.", "Vertel ons over uw machines, gebruikers en werkplaatsmodel. We bepalen samen of een gerichte pilot de juiste volgende stap is."],
    email: "E-mailconcept openen",
  },
};

export function HomepageSections() {
  const { language } = useI18n();
  const text = copy[language];
  const pillars = text.pillars.slice(2) as readonly (readonly string[])[];
  const mailto = "mailto:contact@attraccess.org?subject=Attraccess%20pilot";

  return <>
    <section id="proof" className="bg-background px-6 py-24 sm:px-8"><div className="mx-auto max-w-[1200px]">
      <Reveal className="max-w-3xl"><p className="text-sm font-bold uppercase tracking-[.14em] text-primary">{text.problem[0]}</p><h2 className="mt-3 text-[clamp(34px,4vw,52px)] font-bold tracking-tight">{text.problem[1]}</h2><p className="mt-5 text-lg leading-relaxed text-foreground/75">{text.problem[2]}</p></Reveal>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{pillars.map(([title, body], index) => <Reveal key={title} delay={index * 60} className="rounded-2xl border border-border bg-muted p-6"><Layers3 className="h-6 w-6 text-primary"/><h3 className="mt-8 text-lg font-bold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-foreground/70">{body}</p></Reveal>)}</div>
    </div></section>
    <section className="bg-muted px-6 py-24 sm:px-8"><div className="mx-auto grid max-w-[1200px] gap-6 lg:grid-cols-2">
      <Narrative icon={GraduationCap} content={text.teaching} /><Narrative icon={Wrench} content={text.progression} />
    </div></section>
    <section className="bg-background px-6 py-24 sm:px-8"><div className="mx-auto grid max-w-[1200px] gap-6 lg:grid-cols-3">
      <Narrative icon={Cable} content={text.deployment} /><Narrative icon={ShieldAlert} content={text.boundary} tone="rose" /><Narrative icon={Mail} content={text.pilot} tone="blue" />
    </div></section>
    <section id="pilot" className="bg-muted px-6 py-24 sm:px-8"><div className="mx-auto grid max-w-[1200px] gap-6 lg:grid-cols-2">
      <Narrative icon={ArrowRight} content={text.pricing} /><Narrative icon={HeartHandshake} content={text.nonprofit} tone="green" />
    </div></section>
    <section className="bg-brand-ink px-6 py-24 text-white sm:px-8"><Reveal className="mx-auto max-w-3xl text-center"><h2 className="text-[clamp(34px,4vw,52px)] font-bold tracking-tight">{text.final[0]}</h2><p className="mt-5 text-lg leading-relaxed text-white/70">{text.final[1]}</p><a href={mailto} className="mt-9 inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 font-bold text-primary-foreground"><Mail className="h-5 w-5" />{text.email}</a></Reveal></section>
  </>;
}

function Narrative({ icon: Icon, content, tone = "blue" }: { icon: LucideIcon; content: readonly string[]; tone?: "blue" | "rose" | "green" }) {
  const colors = { blue: "bg-primary/10 text-primary", rose: "bg-brand-rose/15 text-brand-rose", green: "bg-brand-green/15 text-brand-green-dark" };
  return <Reveal className="rounded-3xl border border-border bg-card p-8 sm:p-10"><span className={`flex h-11 w-11 items-center justify-center rounded-xl ${colors[tone]}`}><Icon className="h-5 w-5" /></span><h2 className="mt-8 text-2xl font-bold tracking-tight">{content[0]}</h2><p className="mt-4 leading-relaxed text-foreground/70">{content[1]}</p></Reveal>;
}
