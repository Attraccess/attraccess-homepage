import { useEffect, useReducer, useRef, useState, type ComponentType } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, Box, Check, ChevronDown, CirclePause, ExternalLink, Github, MoveUpRight, ScanLine, ShieldCheck } from "lucide-react";
import { useI18n } from "@/contexts/i18n";
import { useTheme } from "@/contexts/theme";
import { trackEvent } from "@/lib/analytics";
import type { PageCopy } from "@/components/MarketingLayout";
import { chapters, docsUrl, machines, workshopCopy } from "./content";
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
  const [selected, setSelected] = useState<MachineId | null>(null);
  const [storyState, dispatch] = useReducer(storyReducer, initialStory);
  const [animated, setAnimated] = useState(() => !window.__PRERENDER__ && !window.matchMedia("(prefers-reduced-motion: reduce)").matches && !(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
  const [Scene, setScene] = useState<ComponentType<WorkshopSceneProps> | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const story = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLElement>(null);
  const currentChapter = useRef(0);
  const view = selected ?? chapters[active].view;
  const sceneState = selected ? initialStory : storyState;
  const enabled = animated && !failed;
  const poster = `/workshop/${posterKey(view, sceneState)}.webp`;
  const cueKey = active === 0 ? "overview" : active === 1 ? storyState.identity : active === 2 ? storyState.preflight : active === 3 ? storyState.automation ? "automation" : "manual" : active === 4 ? storyState.handoff === "form" && storyState.handoffAnswer ? "form-checked" : storyState.handoff : active === 5 ? storyState.maintenance : "pilot";
  const cue = selected ? [c.machine[selected].name, c.machine[selected].description] : c.cue[cueKey];

  useEffect(() => {
    if (!enabled || Scene) return;
    let cancelled = false;
    import("./WorkshopScene").then((module) => { if (!cancelled) setScene(() => module.default); }).catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, [enabled, Scene]);

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
      const mobile = window.matchMedia("(max-width: 760px)").matches;
      const navigationBottom = document.querySelector(".workshop-chapters")?.getBoundingClientRect().bottom ?? 112;
      const marker = mobile ? Math.max(navigationBottom, stage.current?.getBoundingClientRect().bottom ?? 350) + 75 : window.innerHeight * 0.47;
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
  }, []);

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

  return <>
    <a className="workshop-skip" href="#pilot">{c.skip}</a>
    <nav className="workshop-chapters" aria-label={c.chapter}>
      <div className="workshop-chapters__links">{chapters.map(({ anchor }, index) => <a key={anchor} href={`#${anchor}`} aria-current={active === index ? "step" : undefined} onClick={() => setSelected(null)}><span>{String(index + 1).padStart(2, "0")}</span>{c.nav[index]}</a>)}</div>
      <label className="workshop-chapters__select"><span className="sr-only">{c.chapter}</span><select value={active} onChange={(event) => chooseChapter(Number(event.target.value))}>{chapters.map(({ anchor }, index) => <option key={anchor} value={index}>{String(index + 1).padStart(2, "0")} / {c.nav[index]}</option>)}</select><ChevronDown aria-hidden="true" /></label>
      <button className="workshop-motion" onClick={toggleMotion} aria-pressed={!enabled}>{enabled ? <CirclePause /> : <Box />}<span>{enabled ? c.static : c.animated}</span></button>
    </nav>

    <main>
      <div className="workshop-layout">
        <aside ref={stage} className="workshop-stage" aria-label={c.tour} data-chapter-view={chapters[active].view} data-story-state={posterKey(view, sceneState)}>
          <div className="workshop-stage__heading"><span className="workshop-label"><i />{selected ? c.machine[selected].tag : `${String(active + 1).padStart(2, "0")} / ${c.nav[active]}`}</span><span className="workshop-stage__mode">{enabled ? ready ? c.live : c.loading : c.still}</span></div>
          <div className={`workshop-visual ${enabled && ready ? "is-ready" : ""}`}>
            <img className="workshop-poster" src={poster} width="1100" height="900" alt={c.scene} />
            {enabled && Scene && <Scene view={view} story={sceneState} onReady={() => setReady(true)} onUnavailable={() => { setFailed(true); setReady(false); }} onSelect={(machine) => { if (active === 0 || active === 6) setSelected(machine); }} onAction={act} />}
          </div>
          <div className="workshop-stage__bottom">
            <div className="workshop-cue" data-tone={active === 5 && storyState.maintenance === "active" ? "danger" : "normal"}><span className="workshop-cue__index">{String(active + 1).padStart(2, "0")}</span><div><strong>{cue[0]}</strong><p>{cue[1]}</p></div></div>
            {(active === 0 || active === 6) && <div className="workshop-machines" role="group" aria-label={c.select}><button className="workshop-reset" aria-label={c.reset} aria-pressed={!selected} onClick={() => setSelected(null)}><MoveUpRight /></button>{machines.map((machine) => <button key={machine} aria-pressed={selected === machine} onClick={() => setSelected(selected === machine ? null : machine)}>{c.machine[machine].name}</button>)}</div>}
            <p className="workshop-stage__note">{enabled ? c.hardware : c.fallback}</p>
          </div>
        </aside>

        <div className="workshop-story" ref={story}>
          <section className="workshop-chapter workshop-intro" id="system" data-chapter="overview" aria-labelledby="workshop-title">
            <p className="workshop-label"><ScanLine />{c.tour}</p>
            <h1 id="workshop-title">{c.hero[0]}<em>{c.hero[1]}</em></h1>
            <p className="workshop-lede">{c.intro}</p><p className="workshop-intro__promise">{c.promise}</p>
            <a href="#loop" className="workshop-button">{c.explore}<ArrowDown /></a>
            <div className="workshop-pains">{["loop", "permissions", "sessions", "operations"].map((anchor, index) => <a key={anchor} href={`#${anchor}`}><span>0{index + 1}</span>{c.pain[index]}<ArrowRight /></a>)}</div>
            <span className="workshop-fineprint">{c.duration}</span>
          </section>

          {chapters.slice(1, 6).map(({ view: chapter, anchor }) => {
            const text = c[chapter as "identify" | "evaluate" | "apply" | "record" | "connect"];
            return <section key={chapter} className="workshop-chapter" id={anchor} data-chapter={chapter} aria-labelledby={`${chapter}-title`}>
              <p className="workshop-label">{text.kicker}</p><h2 id={`${chapter}-title`}>{text.title}</h2><p className="workshop-lede">{text.text}</p>
              <WorkshopDemo chapter={chapter} state={storyState} dispatch={act} language={locale} />
              <p className="workshop-point">{text.point}</p>
              <details className="workshop-details"><summary>{text.more}<ChevronDown /></summary><p>{text.details}</p></details>
            </section>;
          })}

          <section className="workshop-chapter workshop-pilot" id="pilot" data-chapter="pilot" aria-labelledby="pilot-title">
            <p className="workshop-label">{c.pilot.kicker}</p><h2 id="pilot-title">{c.pilot.title[0]}<em>{c.pilot.title[1]}</em></h2>
            <p className="workshop-lede">{c.pilot.text}</p><ul className="workshop-checklist">{c.pilot.points.map((point) => <li key={point}><Check />{point}</li>)}</ul>
            <Link className="workshop-button" to="/contact">{marketing.cta}<ArrowRight /></Link><p className="workshop-fineprint">{c.pilot.note}</p>
            <aside className="workshop-safety"><ShieldCheck /><div><strong>{marketing.boundaryTitle}</strong><p>{marketing.boundary}</p></div></aside>
          </section>
        </div>
      </div>

      <section className="workshop-features" id="features" aria-labelledby="features-title">
        <header><div><p className="workshop-label">Attraccess / {locale === "de" ? "Die Bausteine" : "The building blocks"}</p><h2 id="features-title">{c.features.title}</h2><p className="workshop-lede">{c.features.text}</p></div><a className="workshop-text-link" href={docsUrl(locale, "home")}>{c.features.source}<ExternalLink /></a></header>
        <div className="workshop-feature-list">{c.features.cards.map(([title, text, path], index) => <details className="workshop-details" key={title}><summary><span>0{index + 1}</span>{title}<ChevronDown /></summary><p>{text}</p><a className="workshop-text-link" href={docsUrl(locale, path)}>{locale === "de" ? "Dokumentation" : "Documentation"}<ArrowRight /></a></details>)}</div>
        <p className="workshop-fineprint">{c.features.caveat}</p>
        <div className="workshop-app-preview"><img src={actualTheme === "dark" ? "/hero/app-screenshot-dark.png" : "/hero/app-screenshot.png"} width="1440" height="1000" loading="lazy" alt={locale === "de" ? "Attraccess Ressourcenübersicht im neuen Design mit Beispieldaten" : "Attraccess resource overview in the new design with example data"} /><div><h3>{locale === "de" ? "Am Leser einfach. Im Betrieb nachvollziehbar." : "Simple at the reader. Traceable in operations."}</h3><p>{locale === "de" ? "Die Web-App verbindet Ihre Ressourcen und die zugehörigen Abläufe. Die Abbildung zeigt Beispieldaten aus dem Design-PR, keine Live-Werkstatt." : "The web app brings your resources and their workflows together. This image shows example data from the design PR, not a live workshop."}</p><dl>{marketing.proof.map(([title, text]) => <div key={title}><dt>{title}</dt><dd>{text}</dd></div>)}</dl><a className="workshop-text-link" href="https://github.com/Attraccess/attraccess" target="_blank" rel="noreferrer"><Github />{locale === "de" ? "Quellcode ansehen" : "Explore the source"}<ArrowRight /></a></div></div>
      </section>

      <section className="workshop-audiences" id="use-cases" aria-labelledby="use-cases-title"><h2 id="use-cases-title">{c.audiences.title}</h2><div>{c.audiences.cases.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p><Link className="workshop-text-link" to="/contact">{marketing.cta}<ArrowRight /></Link></article>)}</div></section>

      <section className="workshop-newsletter" aria-labelledby="newsletter-title">
        <div><p className="workshop-label">Newsletter / Attraccess</p><h2 id="newsletter-title">{c.newsletter.title}</h2><p>{c.newsletter.text}</p></div>
        <form method="post" action="https://listmonk.attraccess.org/subscription/form" onSubmit={() => trackEvent("newsletter-subscribe")}>
          <input type="hidden" name="nonce" /><label><span>{c.newsletter.email}</span><input type="email" name="email" required autoComplete="email" placeholder="you@workshop.org" /></label><label><span>{c.newsletter.name}</span><input type="text" name="name" autoComplete="name" /></label>
          <input type="hidden" name="l" value={locale === "de" ? "d21f9904-1a25-4ad7-8e7b-24379133163f" : "9764fb4c-fddd-43eb-9eaf-5c7c3265940e"} />
          <label className="workshop-newsletter__consent"><input type="checkbox" required /><span>{c.newsletter.consent} <Link to="/datenschutz">{marketing.privacy}</Link>.</span></label>
          <button type="submit" className="workshop-button">{c.newsletter.submit}<ArrowRight /></button><p className="workshop-fineprint">{c.newsletter.note}</p>
        </form>
      </section>
    </main>
  </>;
}
