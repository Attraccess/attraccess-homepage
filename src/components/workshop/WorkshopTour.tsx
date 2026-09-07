import { useEffect, useReducer, useRef, useState, type ComponentType } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, Box, Check, ChevronDown, CirclePause, Expand, MoveUpRight, ScanLine, ShieldCheck, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { useI18n } from "@/contexts/i18n";
import { useTheme } from "@/contexts/theme";
import { trackEvent } from "@/lib/analytics";
import type { PageCopy } from "@/components/MarketingLayout";
import { chapters, machines, workshopCopy } from "./content";
import { initialStory, posterKey, storyReducer } from "./story";
import { WorkshopDemo } from "./WorkshopDemo";
import type { MachineId, StoryAction } from "./types";
import type { WorkshopSceneProps } from "./WorkshopScene";
import "./workshop.css";

export function WorkshopTour({ marketing }: { marketing: PageCopy }) {
  const { language } = useI18n();
  const locale = language === "de" ? "de" : "en";
  const { actualTheme } = useTheme();
  const c = workshopCopy[locale];
  const [active, setActive] = useState(0);
  const [mobile, setMobile] = useState(() => window.matchMedia("(max-width: 760px)").matches);
  const [mobileChapter, setMobileChapter] = useState<number | null>(null);
  const previewTrigger = useRef<HTMLButtonElement | null>(null);
  const mobileTitle = useRef<HTMLHeadingElement>(null);
  const mobileControls = useRef<HTMLDivElement>(null);
  const [reportReason, setReportReason] = useState<string | null>(null);
  const displayedChapter = mobileChapter ?? active;
  const [selected, setSelected] = useState<MachineId | null>(null);
  const [storyState, dispatch] = useReducer(storyReducer, initialStory);
  const [animated, setAnimated] = useState(() => !window.__PRERENDER__ && !window.matchMedia("(prefers-reduced-motion: reduce)").matches && !(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
  const [Scene, setScene] = useState<ComponentType<WorkshopSceneProps> | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const story = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLElement>(null);
  const currentChapter = useRef(0);
  const view = selected ?? chapters[displayedChapter].view;
  const sceneState = selected ? initialStory : storyState;
  const enabled = animated && !failed;
  const poster = `/workshop/${posterKey(view, sceneState)}.webp`;
  const cueKey = displayedChapter === 0 ? "overview" : displayedChapter === 1 ? storyState.identity : displayedChapter === 2 ? storyState.preflight : displayedChapter === 3 ? storyState.automation ? "automation" : "manual" : displayedChapter === 4 ? storyState.handoff === "form" && storyState.handoffAnswer ? "form-checked" : storyState.handoff : displayedChapter === 5 ? storyState.maintenance : "pilot";
  const cue = selected ? [c.machine[selected].name, c.machine[selected].description] : c.cue[cueKey];

  useEffect(() => {
    if (mobileChapter === null) return;
    mobileControls.current?.scrollTo({ top: 0 });
    mobileControls.current?.parentElement?.scrollTo({ top: 0 });
    mobileTitle.current?.focus({ preventScroll: true });
  }, [mobileChapter]);

  useEffect(() => {
    if (!enabled || Scene || (mobile && mobileChapter === null)) return;
    let cancelled = false;
    import("./WorkshopScene").then((module) => { if (!cancelled) setScene(() => module.default); }).catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, [enabled, Scene, mobile, mobileChapter]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 760px)");
    function change() { setMobile(media.matches); setMobileChapter(null); setReady(false); }
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    function change() { if (media.matches) { setAnimated(false); setReady(false); } }
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);

  useEffect(() => {
    let frame = 0;
    function measure() {
      frame = 0;
      if (mobileChapter !== null) return;
      const mobile = window.matchMedia("(max-width: 760px)").matches;
      const navigationBottom = document.querySelector(".workshop-chapters")?.getBoundingClientRect().bottom ?? 112;
      const marker = mobile ? navigationBottom + 100 : window.innerHeight * 0.47;
      let next = 0;
      story.current?.querySelectorAll<HTMLElement>("[data-chapter]").forEach((section, index) => { if (section.getBoundingClientRect().top <= marker) next = index; });
      if (currentChapter.current !== next) {
        currentChapter.current = next;
        setActive(next);
        setSelected(null);
      }
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(measure); }
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = new ResizeObserver(schedule);
    if (story.current) observer.observe(story.current);
    measure();
    return () => { window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); observer.disconnect(); cancelAnimationFrame(frame); };
  }, [mobileChapter]);

  function act(action: StoryAction) { setSelected(null); dispatch(action); }
  function chooseChapter(index: number) {
    const { anchor } = chapters[index];
    setSelected(null);
    window.location.hash = anchor;
    // Assigning an unchanged hash does not navigate after the visitor has scrolled elsewhere.
    document.getElementById(anchor)?.scrollIntoView({ block: "start", behavior: "auto" });
  }
  function toggleMotion() {
    setReady(false);
    if (failed) { setFailed(false); setAnimated(true); }
    else setAnimated(!animated);
  }

  function mobilePreview(index: number) {
    return <button className="workshop-mobile-preview" aria-haspopup="dialog" onClick={(event) => {
      previewTrigger.current = event.currentTarget;
      setSelected(null);
      setReady(false);
      setMobileChapter(index);
    }}>
      <img src={`/workshop/${posterKey(chapters[index].view, storyState)}.webp`} width="1100" height="900" loading="lazy" alt="" />
      <span><span>{locale === "de" ? "Diese Station ausprobieren" : "Try this step"}<small>{locale === "de" ? "Große Ansicht mit den passenden Bedienelementen" : "A closer view with the controls for this step"}</small></span><Expand aria-hidden="true" /></span>
    </button>;
  }

  const workshopStage = <aside ref={stage} className="workshop-stage" aria-label={c.tour} data-chapter-view={chapters[displayedChapter].view} data-story-state={posterKey(view, sceneState)}>
    <div className="workshop-stage__heading"><span className="workshop-label"><i />{selected ? c.machine[selected].tag : `${String(displayedChapter + 1).padStart(2, "0")} / ${c.nav[displayedChapter]}`}</span><span className="workshop-stage__mode">{enabled ? ready ? c.live : c.loading : c.still}</span></div>
    <div className={`workshop-visual ${enabled && ready ? "is-ready" : ""}`}>
      <img className="workshop-poster" src={poster} width="1100" height="900" alt={c.scene} />
      {enabled && Scene && <Scene view={view} story={sceneState} onReady={() => setReady(true)} onUnavailable={() => { setFailed(true); setReady(false); }} onSelect={(machine) => { if (displayedChapter === 0 || displayedChapter === 6) setSelected(machine); }} onAction={act} />}
    </div>
    <div className="workshop-stage__bottom">
      <div className="workshop-cue" data-tone={displayedChapter === 5 && storyState.maintenance === "active" ? "danger" : "normal"}><span className="workshop-cue__index">{String(displayedChapter + 1).padStart(2, "0")}</span><div><strong>{cue[0]}</strong><p>{cue[1]}</p></div></div>
      {(displayedChapter === 0 || displayedChapter === 6) && <div className="workshop-machines" role="group" aria-label={c.select}><button className="workshop-reset" aria-label={c.reset} aria-pressed={!selected} onClick={() => setSelected(null)}><MoveUpRight /></button>{machines.map((machine) => <button key={machine} aria-pressed={selected === machine} onClick={() => setSelected(selected === machine ? null : machine)}>{c.machine[machine].name}</button>)}</div>}
      <p className="workshop-stage__note">{enabled ? c.hardware : c.fallback}</p>
    </div>
  </aside>;

  return <>
    <a className="workshop-skip" href="#pilot">{c.skip}</a>
    <nav className="workshop-chapters" aria-label={c.chapter}>
      <div className="workshop-chapters__links">{chapters.map(({ anchor }, index) => <a key={anchor} href={`#${anchor}`} aria-current={active === index ? "step" : undefined} onClick={() => setSelected(null)}><span>{String(index + 1).padStart(2, "0")}</span>{c.nav[index]}</a>)}</div>
      <label className="workshop-chapters__select"><span className="sr-only">{c.chapter}</span><select value={active} onChange={(event) => chooseChapter(Number(event.target.value))}>{chapters.map(({ anchor }, index) => <option key={anchor} value={index}>{String(index + 1).padStart(2, "0")} / {c.nav[index]}</option>)}</select><ChevronDown aria-hidden="true" /></label>
      <button className="workshop-motion" onClick={toggleMotion} aria-pressed={!enabled}>{enabled ? <CirclePause /> : <Box />}<span>{enabled ? c.static : c.animated}</span></button>
    </nav>

    <main>
      <div className="workshop-layout">
        {!mobile && workshopStage}

        <div className="workshop-story" ref={story}>
          <section className="workshop-chapter workshop-intro" id="system" data-chapter="overview" aria-labelledby="workshop-title">
            <p className="workshop-label"><ScanLine />{c.tour}</p>
            <h1 id="workshop-title">{c.hero[0]}<em>{c.hero[1]}</em></h1>
            <p className="workshop-lede">{c.intro}</p><p className="workshop-intro__promise">{c.promise}</p>
            <a href="#loop" className="workshop-button">{c.explore}<ArrowDown /></a>
            {mobile && mobilePreview(0)}
            <div className="workshop-pains">{["loop", "permissions", "sessions", "operations"].map((anchor, index) => <a key={anchor} href={`#${anchor}`}><span>0{index + 1}</span>{c.pain[index]}<ArrowRight /></a>)}</div>
            <span className="workshop-fineprint">{c.duration}</span>
          </section>

          {chapters.slice(1, 6).map(({ view: chapter, anchor }, index) => {
            const text = c[chapter as "identify" | "evaluate" | "apply" | "record" | "connect"];
            return <section key={chapter} className="workshop-chapter" id={anchor} data-chapter={chapter} aria-labelledby={`${chapter}-title`}>
              <p className="workshop-label">{text.kicker}</p><h2 id={`${chapter}-title`}>{text.title}</h2><p className="workshop-lede">{text.text}</p>
              {mobile ? mobilePreview(index + 1) : <WorkshopDemo chapter={chapter} state={storyState} dispatch={act} language={locale} reason={reportReason} onReasonChange={setReportReason} />}
              <p className="workshop-point">{text.point}</p>
              <details className="workshop-details"><summary>{text.more}<ChevronDown /></summary><p>{text.details}</p></details>
            </section>;
          })}

          <section className="workshop-chapter workshop-pilot" id="pilot" data-chapter="pilot" aria-labelledby="pilot-title">
            <p className="workshop-label">{c.pilot.kicker}</p><h2 id="pilot-title">{c.pilot.title[0]}<em>{c.pilot.title[1]}</em></h2>
            <p className="workshop-lede">{c.pilot.text}</p><ul className="workshop-checklist">{c.pilot.points.map((point) => <li key={point}><Check />{point}</li>)}</ul>
            <Link className="workshop-button" to="/contact">{marketing.cta}<ArrowRight /></Link><p className="workshop-fineprint">{c.pilot.note}</p>
            {mobile && mobilePreview(6)}
            <aside className="workshop-safety"><ShieldCheck /><div><strong>{marketing.boundaryTitle}</strong><p>{marketing.boundary}</p></div></aside>
          </section>
        </div>
      </div>

      <section className="workshop-features" id="features" aria-labelledby="features-title">
        <header><div><p className="workshop-label">Attraccess / {locale === "de" ? "Die Bausteine" : "The building blocks"}</p><h2 id="features-title">{c.features.title}</h2><p className="workshop-lede">{c.features.text}</p></div></header>
        <div className="workshop-feature-list">{c.features.cards.map(([title, text], index) => <details className="workshop-details" key={title}><summary><span>0{index + 1}</span>{title}<ChevronDown /></summary><p>{text}</p></details>)}</div>
        <p className="workshop-fineprint">{c.features.caveat}</p>
        <div className="workshop-app-preview"><img src={actualTheme === "dark" ? "/hero/app-screenshot-dark.png" : "/hero/app-screenshot.png"} width="1440" height="1000" loading="lazy" alt={locale === "de" ? "Attraccess Ressourcenübersicht mit Beispieldaten" : "Attraccess equipment overview with sample data"} /><div><h3>{locale === "de" ? "Am Leser einfach. Im Büro den Überblick." : "Simple at the reader. Clear for your team."}</h3><p>{locale === "de" ? "Welche Maschinen sind verfügbar? Wer hat sie genutzt? Was steht als Nächstes an? In der Web-App läuft alles zusammen. Die Vorschau zeigt Beispieldaten." : "Which machines are available? Who used them? What needs attention next? Bring it all together in the web app. This preview shows sample data."}</p><dl>{marketing.proof.map(([title, text]) => <div key={title}><dt>{title}</dt><dd>{text}</dd></div>)}</dl><Link className="workshop-text-link" to="/contact">{locale === "de" ? "Attraccess gemeinsam kennenlernen" : "Let us show you around"}<ArrowRight /></Link></div></div>
      </section>

      <section className="workshop-audiences" id="use-cases" aria-labelledby="use-cases-title"><h2 id="use-cases-title">{c.audiences.title}</h2><div>{c.audiences.cases.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p><Link className="workshop-text-link" to="/contact">{marketing.cta}<ArrowRight /></Link></article>)}</div></section>

      <section className="workshop-newsletter" aria-labelledby="newsletter-title">
        <div><p className="workshop-label">Newsletter / Attraccess</p><h2 id="newsletter-title">{c.newsletter.title}</h2><p>{c.newsletter.text}</p></div>
        <form method="post" action="https://listmonk.attraccess.org/subscription/form" onSubmit={() => trackEvent("newsletter-subscribe")}>
          <input type="hidden" name="nonce" /><label><span>{c.newsletter.email}</span><input type="email" name="email" required autoComplete="email" placeholder="you@workshop.org" /></label><label><span>{c.newsletter.name}</span><input type="text" name="name" autoComplete="name" /></label>
          <input type="hidden" name="l" value={locale === "de" ? "d21f9904-1a25-4ad7-8e7b-24379133163f" : "9764fb4c-fddd-43eb-9eaf-5c7c3265940e"} />
          <label className="workshop-newsletter__consent"><input type="checkbox" required /><span>{c.newsletter.consent} <Link to="/datenschutz" target="_blank" rel="noopener noreferrer">{marketing.privacy} ({locale === "de" ? "neuer Tab" : "new tab"})</Link>.</span></label>
          <button type="submit" className="workshop-button">{c.newsletter.submit}<ArrowRight /></button><p className="workshop-fineprint">{c.newsletter.note}</p>
        </form>
      </section>
    </main>
    <Dialog.Root open={mobile && mobileChapter !== null} onOpenChange={(open) => { if (!open) { setMobileChapter(null); setReady(false); } }}>
      <Dialog.Portal>
        <Dialog.Overlay className="workshop-mobile-overlay" />
        <Dialog.Content className="prototype-homepage workshop-page workshop-mobile-dialog" onCloseAutoFocus={(event) => { event.preventDefault(); previewTrigger.current?.focus({ preventScroll: true }); }}>
          <header className="workshop-mobile-dialog__header"><div><Dialog.Title ref={mobileTitle} tabIndex={-1}>{c.nav[displayedChapter]}</Dialog.Title><Dialog.Description>{locale === "de" ? "Eigenständiges Beispiel. Keine echten Maschinen." : "An independent example. No real machines."}</Dialog.Description></div><Dialog.Close aria-label={locale === "de" ? "Zurück zum Artikel" : "Back to the story"}><X /></Dialog.Close></header>
          <div className="workshop-mobile-dialog__body">
            {mobile && mobileChapter !== null && workshopStage}
            <div ref={mobileControls} className="workshop-mobile-dialog__controls" onClick={(event) => {
              const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
              if (!link) return;
              const index = chapters.findIndex(({ anchor }) => `#${anchor}` === link.getAttribute("href"));
              if (index >= 0) { event.preventDefault(); setSelected(null); setMobileChapter(index); }
            }}>
              {mobileChapter !== null && mobileChapter > 0 && mobileChapter < 6 && <WorkshopDemo key={mobileChapter} chapter={chapters[mobileChapter].view} state={storyState} dispatch={act} language={locale} reason={reportReason} onReasonChange={setReportReason} />}
              <button className="workshop-motion" onClick={toggleMotion} aria-pressed={!enabled}>{enabled ? <CirclePause /> : <Box />}{enabled ? c.static : c.animated}</button>
              <Dialog.Close className="workshop-button">{locale === "de" ? "Zurück zum Artikel" : "Back to the story"}<ArrowRight /></Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  </>;
}
