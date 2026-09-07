import { useEffect, useId, useState } from "react";
import { ArrowRight, Brush, Check, Fan, Nfc, RotateCcw, UserRound, Wrench } from "lucide-react";
import type { ChapterId, StoryAction, StoryState } from "./types";
import "./workshop-demo.css";

export interface WorkshopDemoProps {
  chapter: ChapterId;
  state: StoryState;
  dispatch: (action: StoryAction) => void;
  language: "de" | "en";
}

const source = "https://github.com/Attraccess/Attraccess/blob/9e0a1c47066d5b103ca09606f26f5d2ace6c3091";
const firmwareComment = "https://github.com/Attraccess/Attraccess/pull/1816#issuecomment-5561397556";
const copy = {
  en: {
    example: "Try the workflow · Example", reset: "Try again", sources: "Sources and setup", owner: "Your benefit:",
    reader: "Illustrated Attractap Touch screen · Labels in German",
    web: "Lea uses the web app for this, not the reader.",
    identifySteps: ["Present a card", "Lea is identified"], evaluateSteps: ["Check the accessories", "Confirm the check", "Session started"],
    applySteps: ["The session is running", "Add extraction control"], recordSteps: ["Clean up", "End the session", "Confirm the handoff", "See the record"],
    connectSteps: ["Spot a problem", "Problem reported", "Under maintenance", "Repair completed"],
    prerequisite: "Lea's briefing is current and her card is registered.",
    tap: "Lea presents her NFC card", tapHint: "At the Attractap Touch", identified: "Lea is identified. Her card hasn't started a session.",
    supervision: "View supervision example", supervisionTitle: "Separate example: Alex Example, not Lea",
    supervisionNote: "An eligible supervisor confirms with their card or in the web app.",
    supervisionCaption: "Original LVGL firmware render from PR #1816 (480 x 480), not a device photo.",
    supervisionAlt: "German firmware supervision prompt for Alex Example, requesting a supervisor card and offering web confirmation",
    firmwareSource: "View the original render",
    startConfig: "You choose the start question.",
    checkHelp: "Lea checks the accessories herself; the reader only records her answer.",
    required: "These questions are operator-configured required Boolean fields, not built-in checklists. A required Boolean must be true before normal submission.", started: "Session started.", next: "See the active session",
    problemLink: "Found a problem? See how to report it in the web app", formBoundary: "A form answer does not create a maintenance request.",
    activeIntro: "Lea's session is already running.",
    automation: "Control extraction automatically", extraction: "Extraction command", manual: "Without a configured flow, Lea switches extraction on herself.",
    configured: "With a configured flow, starting the session sends a command to extraction.",
    integration: "HTTP, MQTT and Shelly interfaces are alternatives that need installation and setup. A sent command is not proof of actuation. This flow controls extraction, not hazardous machine motion; physical controls and safety systems remain separate.",
    sessionSetup: "Each chapter can be tried on its own. The duration is a sample value; the handoff record assumes the start question was confirmed earlier.",
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
    maintenanceCaption: "Original web-app screenshot from PR #1816: maintenance planning with sample data, not the report form above.",
    maintenanceAlt: "Attraccess web app with upcoming maintenance and maintenance schedules", maintenanceImage: "View the original maintenance screen",
    cardsDocs: "Register compatible cards", readerDocs: "Attractap Touch session controls (source)", formsDocs: "Set up forms", formsSource: "Attractap Touch forms (source)",
    useDocs: "Start and end usage", historyDocs: "Usage history", mqttDocs: "MQTT examples", flowDocs: "Flow triggers and actions",
    reportSource: "Web problem request (source)", maintenanceSource: "Request-to-maintenance transition (source)", maintenanceDocs: "Maintenance guide",
    setup: "For a real installation, Lea needs a registered compatible card, current access and an Attractap Touch assigned to the machine with a server connection. Check the installed version and required module licenses. Operators configure forms and integrations; these examples do not control equipment.",
    maintenanceSetup: "Problem reporting is confirmed in source; availability depends on the installed version and maintenance module license. Only authorized maintainers start or complete maintenance. The PR image is a preview. Maintenance restricts new ordinary use; it is not emergency isolation or a stop command for a running machine.",
    benefits: { identify: "Less help needed at the reader.", evaluate: "Make the check part of starting.", apply: "One less manual step.", record: "Usage and handoff stay easy to follow.", connect: "A clear path from report to completed service." },
  },
  de: {
    example: "So läuft es ab · Beispiel", reset: "Noch einmal", sources: "Quellen und Einrichtung", owner: "Ihr Vorteil:",
    reader: "Attractap Touch · Nachgestellte Leseransicht",
    web: "Dafür nutzt Lea die Web-App, nicht den Leser.",
    identifySteps: ["Karte vorhalten", "Lea ist erkannt"], evaluateSteps: ["Zubehör prüfen", "Prüfung bestätigen", "Sitzung gestartet"],
    applySteps: ["Die Sitzung läuft", "Absaugung ansteuern"], recordSteps: ["Aufräumen", "Sitzung beenden", "Übergabe bestätigen", "Eintrag ansehen"],
    connectSteps: ["Problem bemerkt", "Problem gemeldet", "In Wartung", "Reparatur erledigt"],
    prerequisite: "Leas Einweisung ist aktuell und ihre Karte registriert.",
    tap: "Lea hält ihre NFC-Karte vor", tapHint: "Am Attractap Touch", identified: "Lea ist erkannt. Die Karte allein startet noch keine Nutzung.",
    supervision: "Aufsichtsbeispiel ansehen", supervisionTitle: "Anderes Beispiel: Alex Example, nicht Lea",
    supervisionNote: "Eine berechtigte Aufsichtsperson bestätigt per Karte oder in der Web-App.",
    supervisionCaption: "Originaler LVGL-Render der Firmware aus PR #1816 (480 x 480), kein Gerätefoto.",
    supervisionAlt: "Deutsche Firmware-Abfrage für Alex Example mit Aufforderung zur Aufsichtskarte und Hinweis auf die Web-Bestätigung",
    firmwareSource: "Zum Original-Render",
    startConfig: "Die Startfrage bestimmen Sie.",
    checkHelp: "Lea prüft das Zubehör selbst, der Leser erfasst nur ihre Antwort.",
    required: "Die Beispiel-Fragen sind vom Betreiber angelegte Boolean-Pflichtfelder, keine eingebauten Checklisten. Ein solches Pflichtfeld muss vor dem regulären Absenden bestätigt sein.", started: "Sitzung gestartet.", next: "Zur laufenden Sitzung",
    problemLink: "Problem entdeckt? So melden Sie es in der Web-App", formBoundary: "Eine Formularantwort erstellt keine Wartungsanfrage.",
    activeIntro: "Hier läuft Leas Sitzung bereits.",
    automation: "Absaugung automatisch ansteuern", extraction: "Befehl an Absaugung", manual: "Ohne eingerichteten Ablauf schaltet Lea die Absaugung selbst ein.",
    configured: "Wenn eingerichtet, sendet der Sitzungsstart einen Befehl an die Absaugung.",
    integration: "HTTP-, MQTT- und Shelly-Schnittstellen sind Alternativen, die Installation und Einrichtung benötigen. Ein gesendeter Befehl belegt keine Ausführung. Die gezeigte Automation steuert die Absaugung, keine gefährliche Maschinenbewegung; Bedienung und Sicherheitssysteme bleiben getrennt.",
    sessionSetup: "Jedes Kapitel lässt sich einzeln ausprobieren. Die Dauer ist ein Beispielwert; für den Abschlusseintrag wird eine bereits bestätigte Startfrage angenommen.",
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
    maintenanceCaption: "Originalaufnahme der Web-App aus PR #1816: Wartungsplanung mit Beispieldaten, nicht das Meldeformular oben.",
    maintenanceAlt: "Attraccess-Web-App mit geplanter Wartung und Wartungsplänen", maintenanceImage: "Original: Wartungsplanung ansehen",
    cardsDocs: "Kompatible Karten registrieren", readerDocs: "Attractap Touch: Sitzungssteuerung (Quellcode)", formsDocs: "Formulare einrichten", formsSource: "Attractap Touch: Formulare (Quellcode)",
    useDocs: "Nutzung starten und beenden", historyDocs: "Nutzungsverlauf", mqttDocs: "MQTT-Beispiele", flowDocs: "Flow-Auslöser und Aktionen",
    reportSource: "Problem in der Web-App melden (Quellcode)", maintenanceSource: "Von der Anfrage zur Wartung (Quellcode)", maintenanceDocs: "Wartungsanleitung",
    setup: "Für den Betrieb braucht Lea eine registrierte kompatible Karte, gültigen Ressourcenzugang und einen Attractap Touch, der der Maschine zugeordnet und mit dem Server verbunden ist. Passende Softwareversion und Modullizenzen sind nötig. Betreiber richten Formulare und Anbindungen ein; diese Beispiele steuern keine Geräte.",
    maintenanceSetup: "Der Meldeablauf ist im Quellcode belegt; seine Verfügbarkeit hängt von der installierten Version und Wartungsmodullizenz ab. Nur Wartungsberechtigte starten oder beenden die Wartung. Das PR-Bild ist eine Vorschau. Die Wartung sperrt neue reguläre Nutzung, ist aber keine Notabschaltung einer laufenden Maschine.",
    benefits: { identify: "Weniger Rückfragen am Leser.", evaluate: "Der Check gehört zum Start.", apply: "Ein Handgriff weniger.", record: "Nutzung und Übergabe bleiben nachvollziehbar.", connect: "Ein klarer Weg von der Meldung bis zur erledigten Wartung." },
  },
};

export function WorkshopDemo({ chapter, state, dispatch, language }: WorkshopDemoProps) {
  const t = copy[language];
  const id = useId();
  const [reportOpen, setReportOpen] = useState(false);
  const [reason, setReason] = useState<string | null>(null);
  useEffect(() => {
    setReportOpen(false);
    if (state.maintenance === "observed") setReason(null);
  }, [state.maintenance]);
  if (chapter === "overview" || chapter === "pilot") return null;

  const steps = { identify: state.identity === "supervision" ? [t.supervisionTitle] : t.identifySteps, evaluate: t.evaluateSteps, apply: t.applySteps, record: t.recordSteps, connect: t.connectSteps }[chapter];
  const step = { identify: Number(state.identity === "identified"), evaluate: ["pending", "checked", "submitted"].indexOf(state.preflight), apply: Number(state.automation), record: ["dirty", "cleaned", "form", "confirmed"].indexOf(state.handoff), connect: ["observed", "reported", "active", "resolved"].indexOf(state.maintenance) }[chapter];
  const links = {
    identify: [[t.cardsDocs, `https://docs.attraccess.org/#/${language}/attractap/nfc-cards`], [t.readerDocs, `${source}/apps/attractap/firmware/src/display/screens/resourceDetails/resourceDetailsScreen.cpp`]],
    evaluate: [[t.formsDocs, `https://docs.attraccess.org/#/${language}/forms/creating-forms`], [t.formsSource, `${source}/apps/attractap/firmware/src/display/screens/resourceDetails/resourceDetailsForms.cpp`]],
    apply: [[t.useDocs, `https://docs.attraccess.org/#/${language}/end-user/using-resources`], [t.mqttDocs, `https://docs.attraccess.org/#/${language}/devices/mqtt/examples`], [t.flowDocs, `https://docs.attraccess.org/#/${language}/flows/node-types`]],
    record: [[t.historyDocs, `https://docs.attraccess.org/#/${language}/resources/usage-tracking`], [t.formsDocs, `https://docs.attraccess.org/#/${language}/forms/overview`], [t.formsSource, `${source}/apps/attractap/firmware/src/display/screens/resourceDetails/resourceDetailsForms.cpp`]],
    connect: [[t.reportSource, `${source}/apps/frontend/src/app/resources/details/maintenance-management/request/index.tsx`], [t.maintenanceSource, `${source}/apps/api/src/resources/maintenances/maintenance-request.service.ts`], [t.maintenanceDocs, `https://docs.attraccess.org/#/${language}/resources/maintenance`]],
  }[chapter];
  const reset = (action: StoryAction) => <button type="button" className="demo-link" data-action={action} onClick={() => dispatch(action)}><RotateCcw aria-hidden="true" />{t.reset}</button>;
  const reportReason = reason ?? t.reasonExample;

  return (
    <section className="demo-workflow" lang={language} aria-labelledby={`${id}-title`} data-testid={`demo-${chapter}`}>
      <header className="demo-heading"><span>{t.example}</span><span>{step + 1} / {steps.length}</span></header>
      <div className="demo-bars" aria-hidden="true">{steps.map((label, index) => <span key={label} data-reached={index <= step} />)}</div>
      <h3 className="demo-title" id={`${id}-title`}>{steps[step]}</h3>
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
            <figcaption>{t.supervisionCaption}<a className="demo-link" href={firmwareComment}>{t.firmwareSource}</a></figcaption>
          </figure>
        </> : <button type="button" className="demo-link" data-action="show-supervision" onClick={() => dispatch("show-supervision")}>{t.supervision}<ArrowRight aria-hidden="true" /></button>}
        {state.identity !== "locked" && reset("reset-identity")}
      </>}

      {chapter === "evaluate" && <>
        {state.preflight !== "submitted" && <p className="demo-text" id={`${id}-check-help`}>{t.startConfig} {t.checkHelp}</p>}
        <form className="demo-reader" lang="de" aria-label="Zubehör geprüft?" onSubmit={(event) => { event.preventDefault(); if (state.preflight === "checked") dispatch("submit-check"); }}>
          <strong className="demo-reader-name">Attractap Touch</strong>
          {state.preflight === "submitted" ? <p className="demo-text">Erfolgreich</p> : <>
            <p className="demo-note">Bitte vor dem Start ausfuellen</p>
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
          <a className="demo-button" href="#sessions" data-action="next-sessions">Sitzung beenden<ArrowRight aria-hidden="true" /></a>
        </div>
        <label className="demo-check"><input type="checkbox" role="switch" checked={state.automation} data-action="toggle-automation" onChange={() => dispatch("toggle-automation")} /><span>{t.automation}</span></label>
        <div className="demo-flow" data-enabled={state.automation} aria-live="polite">
          {state.automation ? <><span lang="en">Usage Started</span><ArrowRight aria-hidden="true" /><span>MQTT</span><ArrowRight aria-hidden="true" /><span><Fan aria-hidden="true" />{t.extraction}</span></> : <p className="demo-text">{t.manual}</p>}
        </div>
        {state.automation && <p className="demo-note">{t.configured}</p>}
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
            <strong className="demo-reader-name">Attractap Touch</strong><p className="demo-note">Bitte vor dem Ende ausfuellen</p>
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
            <button type="button" className="demo-link" data-action="cancel-report" onClick={() => setReportOpen(false)}>{t.cancel}</button>
          </form> : <><p className="demo-note">{t.observation}</p><p className="demo-text">{t.reasonExample}</p><button type="button" className="demo-button" data-action="open-report" onClick={() => setReportOpen(true)}>{t.report}<ArrowRight aria-hidden="true" /></button></>)}
          {state.maintenance !== "observed" && <p className="demo-reason">{reportReason}</p>}
          {state.maintenance === "reported" && <><p className="demo-status" role="status">{t.reported}</p><button type="button" className="demo-button" data-action="start-maintenance" onClick={() => dispatch("start-maintenance")}>{t.startMaintenance}<ArrowRight aria-hidden="true" /></button></>}
          {state.maintenance === "active" && <><p className="demo-status" role="status">{t.blocked}</p><p className="demo-note">{t.repair}</p><button type="button" className="demo-button" data-action="complete-maintenance" onClick={() => dispatch("complete-maintenance")}>{t.completeMaintenance}<Check aria-hidden="true" /></button></>}
          {state.maintenance === "resolved" && <p className="demo-status" role="status"><Check aria-hidden="true" />{t.resolved}</p>}
        </div>
        {state.maintenance !== "observed" && reset("reset-maintenance")}
        <details className="demo-details"><summary className="demo-summary" data-action="show-maintenance-source">{t.maintenanceImage}</summary>
          <figure className="demo-capture"><img src="/reader-ui/brand-resource-maintenance.png" width="1440" height="1000" alt={t.maintenanceAlt} loading="lazy" />
            <figcaption>{t.maintenanceCaption}<a className="demo-link" href="https://github.com/Attraccess/Attraccess/pull/1816">PR #1816</a></figcaption>
          </figure>
        </details>
      </>}

      <p className="demo-benefit"><strong>{t.owner}</strong> {t.benefits[chapter]}</p>
      <details className="demo-details"><summary className="demo-summary" data-action="show-sources">{t.sources}</summary>
        <p className="demo-note">{chapter === "connect" ? t.maintenanceSetup : t.setup}</p>
        {(chapter === "evaluate" || chapter === "record") && <p className="demo-note">{t.required} {t.formBoundary}</p>}
        {chapter === "apply" && <p className="demo-note">{t.integration}</p>}
        {(chapter === "apply" || chapter === "record") && <p className="demo-note">{t.sessionSetup}</p>}
        <ul className="demo-sources">{links.map(([label, href]) => <li key={href}><a className="demo-link" href={href}>{label}<ArrowRight aria-hidden="true" /></a></li>)}</ul>
      </details>
    </section>
  );
}
