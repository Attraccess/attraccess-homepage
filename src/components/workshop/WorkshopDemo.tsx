import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, Brush, Check, Fan, Nfc, RotateCcw, UserRound, Wrench } from "lucide-react";
import type { ChapterId, StoryAction, StoryState } from "./types";
import "./workshop-demo.css";

export interface WorkshopDemoProps {
  chapter: ChapterId;
  state: StoryState;
  dispatch: (action: StoryAction) => void;
  language: "de" | "en";
  reason: string | null;
  onReasonChange: (reason: string | null) => void;
}

const copy = {
  en: {
    example: "Try the workflow", reset: "Try again", sources: "What you need to get started", owner: "Your benefit:",
    localExample: "Each example works independently, only on this page. No equipment is controlled or real data saved.",
    reader: "Illustrated Attractap Touch screen · Labels in German",
    web: "Lea uses the web app for this, not the reader.",
    identifySteps: ["Present a card", "Lea is identified"], evaluateSteps: ["Check the accessories", "Confirm the check", "Session started"],
    applySteps: ["The session is running", "Add extraction control"], recordSteps: ["Clean up", "End the session", "Confirm the handoff", "See the record"],
    connectSteps: ["Spot a problem", "Problem reported", "Under maintenance", "Repair completed"],
    prerequisite: "Lea's briefing is current and her card is registered.",
    tap: "Lea presents her NFC card", tapHint: "At the Attractap Touch", identified: "Lea is identified. Her card hasn't started a session.",
    supervision: "View supervision example", supervisionTitle: "Working with supervision",
    supervisionNote: "An eligible supervisor confirms with their card or in the web app.",
    supervisionCaption: "Example reader screen for Alex, not a device photo.",
    supervisionAlt: "German reader screen for Alex Example: a supervisor can confirm by card or in the web app",
    startConfig: "You choose the start question.",
    checkHelp: "Lea checks the accessories herself; the reader only records her answer.",
    required: "You set up these questions for your workshop. In this example, Lea must confirm the answer before submitting; there is no built-in checklist.", started: "Session started.", next: "See the active session",
    problemLink: "Found a problem? See how to report it in the web app", formBoundary: "A form answer does not create a maintenance request.",
    activeIntro: "Lea's session is already running.",
    automation: "Add automatic extraction control", manual: "Without automation, Lea switches extraction on herself.",
    configured: "Once set up, starting a session also sends the signal to switch on extraction. One less manual step for Lea.",
    integration: "Compatible equipment must be connected and set up first. A signal being sent does not confirm that extraction is running. This example does not start hazardous machine motion or replace physical controls and safety systems.",
    sessionSetup: "The duration is a sample value. The handoff summary assumes Lea confirmed the start question earlier.",
    continueHandoff: "Continue to cleanup and handoff",
    recordIntro: "Lea is finished and makes room for the next person.",
    clean: "Lea cleans the workplace", cleanHelp: "She clears scraps, wipes down and returns accessories. Lea, not the app, checks whether it's clean.",
    cleaned: "Cleaned up. Lea still confirms the handoff herself.",
    retap: "Reader locked again? Lea presents her card once more.",
    endConfig: "You choose the end question. Cleaning up doesn't check the box; Lea confirms herself.",
    recordTitle: "Lea's usage and answers", recordNote: "Summary of example data, not a reader screen.",
    person: "Person", duration: "Duration", startQuestion: "Before use", endQuestion: "At handoff", confirmed: "Confirmed by Lea", handoffDone: "Session ended. Handoff confirmed.",
    member: "Workshop member", maintainer: "Authorized maintainer", observation: "Lea notices:", reasonExample: "Bandsaw blade damaged",
    report: "Report a problem", request: "Request maintenance", reason: "Reason", send: "Send request", cancel: "Cancel",
    localSubmit: "Example only: no real request is sent.",
    reported: "Only reported. New use is not yet blocked.", startMaintenance: "Start maintenance",
    blocked: "New sessions are blocked for ordinary users. Maintainers can still service the machine; existing sessions aren't ended.",
    repair: "Repair the machine first, then mark the work done.",
    completeMaintenance: "After repair: mark done", resolved: "Repair completed. New use is available again.",
    maintenanceCaption: "Preview of maintenance planning with sample data, not the problem report form above.",
    maintenanceAlt: "Attraccess web app with upcoming maintenance and maintenance schedules", maintenanceImage: "See maintenance planning",
    setup: "For a real installation, Lea needs a registered compatible card, current access and an Attractap Touch assigned to the machine with a server connection. Check the installed version and required module licenses. Operators configure forms and integrations; these examples do not control equipment.",
    maintenanceSetup: "Problem reporting requires a supported software version and a license for the maintenance module. Only authorized maintainers start or complete maintenance. Maintenance blocks new ordinary use; it does not stop a running machine or replace safe isolation before repairs.",
    benefits: { identify: "Less help needed at the reader.", evaluate: "Make the check part of starting.", apply: "One less manual step.", record: "Usage and handoff stay easy to follow.", connect: "A clear path from report to completed service." },
  },
  de: {
    example: "So läuft es ab", reset: "Noch einmal", sources: "Was Sie für den Start brauchen", owner: "Ihr Vorteil:",
    localExample: "Jedes Beispiel lässt sich unabhängig ausprobieren, nur auf dieser Seite. Es steuert keine Geräte und speichert keine echten Daten.",
    reader: "Attractap Touch · Nachgestellte Leseransicht",
    web: "Dafür nutzt Lea die Web-App, nicht den Leser.",
    identifySteps: ["Karte vorhalten", "Lea ist erkannt"], evaluateSteps: ["Zubehör prüfen", "Prüfung bestätigen", "Sitzung gestartet"],
    applySteps: ["Die Sitzung läuft", "Absaugung ansteuern"], recordSteps: ["Aufräumen", "Sitzung beenden", "Übergabe bestätigen", "Eintrag ansehen"],
    connectSteps: ["Problem bemerkt", "Problem gemeldet", "In Wartung", "Reparatur erledigt"],
    prerequisite: "Leas Einweisung ist aktuell und ihre Karte registriert.",
    tap: "Lea hält ihre NFC-Karte vor", tapHint: "Am Attractap Touch", identified: "Lea ist erkannt. Die Karte allein startet noch keine Nutzung.",
    supervision: "Aufsichtsbeispiel ansehen", supervisionTitle: "Arbeiten unter Aufsicht",
    supervisionNote: "Eine berechtigte Aufsichtsperson bestätigt per Karte oder in der Web-App.",
    supervisionCaption: "Beispiel einer Leseransicht für Alex, kein Gerätefoto.",
    supervisionAlt: "Leseransicht für Alex Example: Eine Aufsichtsperson kann per Karte oder in der Web-App bestätigen",
    startConfig: "Die Startfrage bestimmen Sie.",
    checkHelp: "Lea prüft das Zubehör selbst, der Leser erfasst nur ihre Antwort.",
    required: "Sie richten die Fragen für Ihre Werkstatt ein. In diesem Beispiel muss Lea die Antwort vor dem Absenden bestätigen; eine fest eingebaute Checkliste gibt es nicht.", started: "Sitzung gestartet.", next: "Zur laufenden Sitzung",
    problemLink: "Problem entdeckt? So melden Sie es in der Web-App", formBoundary: "Eine Formularantwort erstellt keine Wartungsanfrage.",
    activeIntro: "Hier läuft Leas Sitzung bereits.",
    automation: "Automatische Absaugsteuerung ergänzen", manual: "Ohne Automation schaltet Lea die Absaugung selbst ein.",
    configured: "Einmal eingerichtet, sendet der Sitzungsstart auch das Einschaltsignal an die Absaugung. Ein Handgriff weniger für Lea.",
    integration: "Passende Geräte müssen zuerst angebunden und eingerichtet werden. Ein gesendetes Signal bestätigt nicht, dass die Absaugung läuft. Das Beispiel startet keine gefährliche Maschinenbewegung und ersetzt weder Bedienelemente noch Sicherheitssysteme.",
    sessionSetup: "Die Dauer ist ein Beispielwert. Die Zusammenfassung zur Übergabe setzt voraus, dass Lea die Startfrage bereits bestätigt hat.",
    continueHandoff: "Weiter zum Aufräumen und zur Übergabe",
    recordIntro: "Lea ist fertig und macht Platz für die nächste Person.",
    clean: "Lea reinigt den Arbeitsplatz", cleanHelp: "Sie entfernt Reste, wischt die Fläche und legt Zubehör zurück. Ob es sauber ist, prüft sie selbst, nicht die App.",
    cleaned: "Aufgeräumt. Lea bestätigt die Übergabe noch selbst.",
    retap: "Leser wieder gesperrt? Lea hält ihre Karte erneut vor.",
    endConfig: "Auch die Abschlussfrage bestimmen Sie. Aufräumen setzt kein Häkchen; Lea bestätigt selbst.",
    recordTitle: "Leas Nutzung und Antworten", recordNote: "Zusammenfassung der Beispieldaten, kein Leserbildschirm.",
    person: "Person", duration: "Dauer", startQuestion: "Vor dem Start", endQuestion: "Zum Abschluss", confirmed: "Von Lea bestätigt", handoffDone: "Sitzung beendet, Übergabe bestätigt.",
    member: "Werkstattmitglied", maintainer: "Wartungsberechtigte Person", observation: "Lea bemerkt:", reasonExample: "Sägeblatt der Bandsäge beschädigt",
    report: "Problem melden", request: "Wartung anfragen", reason: "Grund", send: "Anfrage senden", cancel: "Abbrechen",
    localSubmit: "Nur ein Beispiel: Es wird keine echte Anfrage gesendet.",
    reported: "Nur gemeldet. Neue Nutzung ist noch nicht gesperrt.", startMaintenance: "Wartung starten",
    blocked: "Neue reguläre Nutzung ist gesperrt. Wartungspersonal kann weiterarbeiten; laufende Sitzungen bleiben bestehen.",
    repair: "Erst die Maschine reparieren, dann die Arbeit als erledigt markieren.",
    completeMaintenance: "Nach Reparatur: als erledigt markieren", resolved: "Reparatur erledigt. Neue Nutzung ist wieder möglich.",
    maintenanceCaption: "Vorschau der Wartungsplanung mit Beispieldaten, nicht das Meldeformular oben.",
    maintenanceAlt: "Attraccess-Web-App mit geplanter Wartung und Wartungsplänen", maintenanceImage: "Wartungsplanung ansehen",
    setup: "Für den Betrieb braucht Lea eine registrierte kompatible Karte, gültigen Ressourcenzugang und einen Attractap Touch, der der Maschine zugeordnet und mit dem Server verbunden ist. Passende Softwareversion und Modullizenzen sind nötig. Betreiber richten Formulare und Anbindungen ein; diese Beispiele steuern keine Geräte.",
    maintenanceSetup: "Die Problemmeldung benötigt eine passende Softwareversion und eine Lizenz für das Wartungsmodul. Nur Wartungsberechtigte starten oder beenden die Wartung. Sie sperrt neue reguläre Nutzung, stoppt aber keine laufende Maschine und ersetzt nicht das sichere Freischalten vor Reparaturen.",
    benefits: { identify: "Weniger Rückfragen am Leser.", evaluate: "Der Check gehört zum Start.", apply: "Ein Handgriff weniger.", record: "Nutzung und Übergabe bleiben nachvollziehbar.", connect: "Ein klarer Weg von der Meldung bis zur erledigten Wartung." },
  },
};

export function WorkshopDemo({ chapter, state, dispatch: dispatchAction, language, reason, onReasonChange: setReason }: WorkshopDemoProps) {
  const t = copy[language];
  const id = useId();
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const actionFocus = useRef<{ element: HTMLElement; chapter: ChapterId } | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const rememberFocus = () => {
    const element = document.activeElement;
    if (element instanceof HTMLElement && rootRef.current?.contains(element)) {
      actionFocus.current = { element, chapter };
    }
  };
  const dispatch = (action: StoryAction) => {
    rememberFocus();
    dispatchAction(action);
  };
  // Only recover focus lost by an action in this instance, never by scrolling or shared state.
  useEffect(() => {
    const pending = actionFocus.current;
    actionFocus.current = null;
    if (!pending || pending.chapter !== chapter || pending.element.isConnected || document.activeElement !== document.body) return;
    const action = pending.element.dataset.action;
    const target = action === "open-report"
      ? rootRef.current?.querySelector<HTMLInputElement>('[data-action="problem-reason"]')
      : action === "cancel-report"
        ? rootRef.current?.querySelector<HTMLButtonElement>('[data-action="open-report"]')
        : titleRef.current;
    target?.focus({ preventScroll: true });
  });
  useEffect(() => {
    setReportOpen(false);
    if (chapter === "connect" && state.maintenance === "observed") setReason(null);
  }, [chapter, state.maintenance, setReason]);
  if (chapter === "overview" || chapter === "pilot") return null;

  const steps = { identify: state.identity === "supervision" ? [t.supervisionTitle] : t.identifySteps, evaluate: t.evaluateSteps, apply: t.applySteps, record: t.recordSteps, connect: t.connectSteps }[chapter];
  const step = { identify: Number(state.identity === "identified"), evaluate: ["pending", "checked", "submitted"].indexOf(state.preflight), apply: Number(state.automation), record: ["dirty", "cleaned", "form", "confirmed"].indexOf(state.handoff), connect: ["observed", "reported", "active", "resolved"].indexOf(state.maintenance) }[chapter];
  const reset = (action: StoryAction) => <button type="button" className="demo-link" data-action={action} onClick={() => dispatch(action)}><RotateCcw aria-hidden="true" />{t.reset}</button>;
  const reportReason = reason ?? t.reasonExample;

  return (
    <section ref={rootRef} className="demo-workflow" lang={language} aria-labelledby={`${id}-title`} data-testid={`demo-${chapter}`}>
      <header className="demo-heading"><span>{t.example}</span><span>{step + 1} / {steps.length}</span></header>
      <div className="demo-bars" aria-hidden="true">{steps.map((label, index) => <span key={label} data-reached={index <= step} />)}</div>
      <h3 ref={titleRef} className="demo-title" id={`${id}-title`} tabIndex={-1}>{steps[step]}</h3>
      <p className="demo-note demo-context-note">{t.localExample}</p>
      {chapter === "connect" && <p className="demo-note">{t.web}</p>}
      {(chapter === "evaluate" || chapter === "apply" || (chapter === "identify" && state.identity === "identified") || (chapter === "record" && (state.handoff === "cleaned" || state.handoff === "form"))) && <p className="demo-note">{t.reader}</p>}

      {chapter === "identify" && <>
        {state.identity === "locked" && <p className="demo-text">{t.prerequisite}</p>}
        {state.identity === "locked" && <button type="button" className="demo-button demo-card" data-action="tap-card" onClick={() => dispatch("tap-card")}>
          <Nfc aria-hidden="true" /><span>{t.tap}<span className="demo-card-hint">{t.tapHint}</span></span><ArrowRight aria-hidden="true" />
        </button>}
        {state.identity === "identified" && <>
          <p className="demo-status" role="status"><Check aria-hidden="true" />{t.identified}</p>
          <div className="demo-reader" lang="de">
            <strong className="demo-reader-name">Attractap Touch</strong><p className="demo-text">Nutzer: <strong>Lea</strong></p>
            <a className="demo-button" href="#permissions" data-action="next-permissions">Ressource verwenden<ArrowRight aria-hidden="true" /></a>
          </div>
        </>}
        {state.identity === "supervision" ? <>
          <p className="demo-text">{t.supervisionNote}</p>
          <figure className="demo-capture"><img src="/reader-ui/firmware-theme-supervision.png" width="480" height="480" alt={t.supervisionAlt} loading="lazy" />
            <figcaption>{t.supervisionCaption}</figcaption>
          </figure>
        </> : <button type="button" className="demo-link" data-action="show-supervision" onClick={() => dispatch("show-supervision")}>{t.supervision}<ArrowRight aria-hidden="true" /></button>}
        {state.identity !== "locked" && reset("reset-identity")}
      </>}

      {chapter === "evaluate" && <>
        {state.preflight !== "submitted" && <p className="demo-text" id={`${id}-check-help`}>{t.startConfig} {t.checkHelp}</p>}
        <form className="demo-reader" lang="de" aria-label="Zubehör geprüft?" onSubmit={(event) => { event.preventDefault(); if (state.preflight === "checked") dispatch("submit-check"); }}>
          <strong className="demo-reader-name">Attractap Touch</strong>
          {state.preflight === "submitted" ? <p className="demo-text">Erfolgreich</p> : <>
            <p className="demo-note">Bitte vor dem Start ausfüllen</p>
            <label className="demo-check"><input type="checkbox" role="switch" required checked={state.preflight === "checked"} aria-describedby={`${id}-check-help`} data-action="check-accessory" onChange={() => dispatch("check-accessory")} /><span>Zubehör geprüft?</span></label>
            <button className="demo-button" type="submit" data-action="submit-check" disabled={state.preflight !== "checked"}>Absenden<ArrowRight aria-hidden="true" /></button>
          </>}
        </form>
        {state.preflight === "submitted" && <><p className="demo-status" role="status"><Check aria-hidden="true" />{t.started}</p><a className="demo-link" href="#release" data-action="next-release">{t.next}<ArrowRight aria-hidden="true" /></a></>}
        <a className="demo-link" href="#operations" data-action="next-operations">{t.problemLink}<ArrowRight aria-hidden="true" /></a>
        {state.preflight !== "pending" && reset("reset-check")}
      </>}

      {chapter === "apply" && <>
        <p className="demo-text">{t.activeIntro}</p>
        <div className="demo-reader" lang="de"><strong className="demo-reader-name">Attractap Touch</strong>
          <p className="demo-text">Nutzer: <strong>Lea</strong></p><p className="demo-text">Dauer: <strong className="demo-time">00:18:42</strong></p>
          <a className="demo-button" lang={language} href="#sessions" data-action="next-sessions">{t.continueHandoff}<ArrowRight aria-hidden="true" /></a>
        </div>
        <label className="demo-check"><input type="checkbox" role="switch" checked={state.automation} data-action="toggle-automation" onChange={() => dispatch("toggle-automation")} /><span>{t.automation}</span></label>
        <div className="demo-flow" data-enabled={state.automation} aria-live="polite">
          {state.automation && <Fan aria-hidden="true" />}<p className="demo-text">{state.automation ? t.configured : t.manual}</p>
        </div>
      </>}

      {chapter === "record" && <>
        {state.handoff === "dirty" && <p className="demo-text">{t.recordIntro}</p>}
        {state.handoff === "dirty" && <><p className="demo-note">{t.cleanHelp}</p><button type="button" className="demo-button" data-action="clean-workspace" onClick={() => dispatch("clean-workspace")}><Brush aria-hidden="true" />{t.clean}</button></>}
        {state.handoff === "cleaned" && <>
          <p className="demo-status" role="status">{t.cleaned}</p><p className="demo-note">{t.retap}</p>
          <div className="demo-reader" lang="de"><strong className="demo-reader-name">Attractap Touch</strong><p className="demo-text">Nutzer: <strong>Lea</strong></p>
            <button type="button" className="demo-button" data-action="end-session" onClick={() => dispatch("end-session")}>Sitzung beenden<ArrowRight aria-hidden="true" /></button>
          </div>
        </>}
        {state.handoff === "form" && <>
          <p className="demo-note" id={`${id}-handoff-help`}>{t.endConfig}</p>
          <form className="demo-reader" lang="de" aria-label="Arbeitsplatz sauber hinterlassen?" onSubmit={(event) => { event.preventDefault(); if (state.handoffAnswer && state.handoff === "form") dispatch("confirm-handoff"); }}>
            <strong className="demo-reader-name">Attractap Touch</strong><p className="demo-note">Bitte vor dem Ende ausfüllen</p>
            <label className="demo-check"><input type="checkbox" role="switch" required checked={state.handoffAnswer} aria-describedby={`${id}-handoff-help`} data-action="handoff-answer" onChange={() => dispatch("answer-handoff")} /><span>Arbeitsplatz sauber hinterlassen?</span></label>
            <button className="demo-button" type="submit" data-action="confirm-handoff" disabled={!state.handoffAnswer}>Absenden<ArrowRight aria-hidden="true" /></button>
          </form>
        </>}
        {state.handoff === "confirmed" && <>
          <p className="demo-status" role="status"><Check aria-hidden="true" />{t.handoffDone}</p>
          <div className="demo-record" data-testid="demo-usage-record"><h4 className="demo-record-title">{t.recordTitle}</h4><p className="demo-note">{t.recordNote}</p>
            <dl className="demo-record-fields"><div><dt>{t.person}</dt><dd>Lea</dd></div><div><dt>{t.duration}</dt><dd className="demo-time">18:42</dd></div>
              <div><dt>{t.startQuestion}</dt><dd><span lang="de">Zubehör geprüft?</span><strong>{t.confirmed}</strong></dd></div>
              <div><dt>{t.endQuestion}</dt><dd><span lang="de">Arbeitsplatz sauber hinterlassen?</span><strong>{t.confirmed}</strong></dd></div>
            </dl>
          </div>
        </>}
        {state.handoff !== "dirty" && reset("reset-handoff")}
      </>}

      {chapter === "connect" && <>
        <div className="demo-web" data-state={state.maintenance}>
          <p className="demo-role">{state.maintenance === "observed" ? <UserRound aria-hidden="true" /> : <Wrench aria-hidden="true" />}{state.maintenance === "observed" ? t.member : t.maintainer}</p>
          {state.maintenance === "observed" && (reportOpen ? <form className="demo-form" aria-label={t.request} onSubmit={(event) => { event.preventDefault(); if (reportReason.trim().length >= 3 && reportReason.length <= 2000) dispatch("report-problem"); }}>
            <strong>{t.request}</strong><label className="demo-field">{t.reason}<input type="text" required minLength={3} maxLength={2000} value={reportReason} data-action="problem-reason" onChange={(event) => setReason(event.target.value)} /></label>
            <p className="demo-note">{t.localSubmit}</p><button className="demo-button" type="submit" data-action="report-problem" disabled={reportReason.trim().length < 3 || reportReason.length > 2000}>{t.send}<ArrowRight aria-hidden="true" /></button>
            <button type="button" className="demo-link" data-action="cancel-report" onClick={() => { rememberFocus(); setReportOpen(false); }}>{t.cancel}</button>
          </form> : <><p className="demo-note">{t.observation}</p><p className="demo-text">{t.reasonExample}</p><button type="button" className="demo-button" data-action="open-report" onClick={() => { rememberFocus(); setReportOpen(true); }}>{t.report}<ArrowRight aria-hidden="true" /></button></>)}
          {state.maintenance !== "observed" && <p className="demo-reason">{reportReason}</p>}
          {state.maintenance === "reported" && <><p className="demo-status" role="status">{t.reported}</p><button type="button" className="demo-button" data-action="start-maintenance" onClick={() => dispatch("start-maintenance")}>{t.startMaintenance}<ArrowRight aria-hidden="true" /></button></>}
          {state.maintenance === "active" && <><p className="demo-status" role="status">{t.blocked}</p><p className="demo-note">{t.repair}</p><button type="button" className="demo-button" data-action="complete-maintenance" onClick={() => dispatch("complete-maintenance")}>{t.completeMaintenance}<Check aria-hidden="true" /></button></>}
          {state.maintenance === "resolved" && <p className="demo-status" role="status"><Check aria-hidden="true" />{t.resolved}</p>}
        </div>
        {state.maintenance !== "observed" && reset("reset-maintenance")}
        <details className="demo-details"><summary className="demo-summary" data-action="show-maintenance-source">{t.maintenanceImage}</summary>
          <figure className="demo-capture"><img src="/reader-ui/brand-resource-maintenance.png" width="1440" height="1000" alt={t.maintenanceAlt} loading="lazy" />
            <figcaption>{t.maintenanceCaption}</figcaption>
          </figure>
        </details>
      </>}

      <p className="demo-benefit"><strong>{t.owner}</strong> {t.benefits[chapter]}</p>
      <details className="demo-details"><summary className="demo-summary" data-action="show-sources">{t.sources}</summary>
        <p className="demo-note">{chapter === "connect" ? t.maintenanceSetup : t.setup}</p>
        {(chapter === "evaluate" || chapter === "record") && <p className="demo-note">{t.required} {t.formBoundary}</p>}
        {chapter === "apply" && <p className="demo-note">{t.integration}</p>}
        {(chapter === "apply" || chapter === "record") && <p className="demo-note">{t.sessionSetup}</p>}
      </details>
    </section>
  );
}
