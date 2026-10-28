import {
  Accordion,
  AccordionBody,
  AccordionHeading,
  AccordionIndicator,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
  buttonVariants,
} from '@heroui/react';
import { ArrowRight, ArrowUpRight, Check, Info, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { DecisionTrace } from '../components/DecisionTrace';
import { REFERENCE_KEYS, ReferenceLogo } from '../components/ReferenceLogo';
import { EASE, Reveal, SectionHeading, keepDash } from '../components/primitives';
import { USE_CASE_ICONS, USE_CASE_STEP_ICONS, SMALL_TEAM_ICONS } from '../components/useCaseIcons';
import { USE_CASE_IDS, pathFor, type UseCaseId } from '../lib/routes';
import { useSite } from '../lib/site';

// Copy strings are widened to `string`, so the status keys are listed here.
type Status = 'available' | 'pilot' | 'planned' | 'notYet';
const STATUS_STYLES: Record<Status, string> = {
  available: 'bg-success-soft text-success-soft-foreground',
  pilot: 'bg-accent-soft text-accent-soft-foreground',
  planned: 'border border-dashed border-border text-muted',
  notYet: 'bg-warning-soft text-warning-soft-foreground',
};

export function UseCasePage({ id }: { id: UseCaseId }) {
  const { copy } = useSite();
  const u = copy.useCases.pages[id];
  return (
    <>
      <UseCaseHero id={id} />
      <Problems id={id} />
      <Scenario id={id} />
      <Capabilities id={id} />
      <section className="py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1fr_1.6fr]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading eyebrow={copy.faq.eyebrow} title={u.faq.title} align="left" />
          </div>
          <Reveal delay={0.1}>
            <Accordion className="w-full">
              {u.faq.items.map((item) => (
                <AccordionItem key={item.q} id={item.q}>
                  <AccordionHeading>
                    <AccordionTrigger className="py-5 text-left text-lg font-semibold">
                      {item.q}
                      <AccordionIndicator />
                    </AccordionTrigger>
                  </AccordionHeading>
                  <AccordionPanel>
                    <AccordionBody className="pb-5 text-base leading-relaxed text-muted">{item.a}</AccordionBody>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>
      <SmallTeam withAnswers />
      <UseCaseCta id={id} />
      <OtherUseCases current={id} />
    </>
  );
}

function UseCaseHero({ id }: { id: UseCaseId }) {
  const { copy, locale } = useSite();
  const h = copy.useCases.pages[id].hero;
  const Icon = USE_CASE_ICONS[id];
  return (
    // Dark like the home hero, so the nav and the neon reader look carry over.
    <section id="top" className="dark relative overflow-hidden bg-ink pb-16 pt-28 text-foreground sm:pb-24 sm:pt-40">
      <img src="/brand/neon-wallpaper.webp" alt="" aria-hidden className="absolute inset-0 size-full object-cover object-[50%_80%] opacity-25" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/75 to-ink" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="flex items-start gap-2 font-mono text-xs uppercase leading-relaxed tracking-[0.15em] text-neon sm:items-center sm:tracking-[0.25em]"
          >
            <Icon className="mt-0.5 size-4 shrink-0 sm:mt-0" aria-hidden />
            {h.eyebrow}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
            className="mt-6 text-[clamp(2.6rem,6vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-white"
          >
            {/* One line per sentence: “No valid permit. / No engine start.” never breaks mid-claim. */}
            {h.title.split(/(?<=\.)\s+/).map((sentence) => (
              <span key={sentence} className="block">
                {sentence}
              </span>
            ))}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.25 }}
            className="mt-7 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg"
          >
            {keepDash(h.lead)}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.4 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <a href={pathFor('contact', locale)} className={`${buttonVariants({ variant: 'primary', size: 'lg' })} group w-full justify-center sm:w-auto`}>
              {h.primary}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </a>
            <a href="#how" className={`${buttonVariants({ variant: 'secondary', size: 'lg' })} w-full justify-center sm:w-auto`}>
              {h.secondary}
            </a>
          </motion.div>
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/60"
          >
            {h.note.map((item) => (
              <li key={item} className="inline-flex items-start gap-1.5">
                <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                {item}
              </li>
            ))}
          </motion.ul>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
          className="w-full max-w-xl lg:max-w-none"
        >
          <DecisionTrace trace={h.trace} />
        </motion.div>
      </div>
      {/* Proof first: the references are outside this sector, but they are in production. */}
      <div className="relative mx-auto mt-14 flex max-w-7xl flex-wrap items-center gap-x-12 gap-y-5 px-6 text-white/80 sm:mt-20">
        <p className="w-full font-mono text-xs uppercase tracking-[0.2em] text-white/50 md:w-auto">{copy.hero.references}</p>
        {REFERENCE_KEYS.map((key) => (
          <span key={key} className="flex items-center gap-3">
            <ReferenceLogo reference={key} className="text-lg" />
            <span className="hidden text-xs text-white/45 md:inline">{copy.references[key].sector}</span>
          </span>
        ))}
      </div>
    </section>
  );
}

function Problems({ id }: { id: UseCaseId }) {
  const { copy } = useSite();
  const p = copy.useCases.pages[id].problems;
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow={p.eyebrow} title={p.title} lead={p.lead} align="left" />
        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 md:grid-cols-3">
          {p.items.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.08}>
              <div className="h-full rounded-2xl border border-border bg-surface p-6">
                <p className="font-mono text-sm text-muted">0{index + 1}</p>
                <h3 className="mt-4 text-xl font-bold">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Scenario({ id }: { id: UseCaseId }) {
  const { copy } = useSite();
  const s = copy.useCases.pages[id].scenario;
  return (
    <section id="how" className="bg-surface-secondary/60 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow={s.eyebrow} title={s.title} lead={s.lead} />
        <ol className="relative mt-12 grid grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2 lg:block lg:space-y-6 lg:before:absolute lg:before:bottom-6 lg:before:left-1/2 lg:before:top-6 lg:before:w-px lg:before:bg-border">
          {s.steps.map((step, index) => {
            const Icon = USE_CASE_STEP_ICONS[step.key];
            const right = index % 2 === 1;
            return (
              <li
                key={step.key}
                className={`relative lg:grid lg:grid-cols-2 lg:gap-16 ${index === s.steps.length - 1 && s.steps.length % 2 ? 'sm:col-span-2' : ''}`}
              >
                {/* Below lg the icon sits inside the card; from lg it marks the centre rail of the alternating timeline. */}
                <span className="absolute left-1/2 top-0 z-10 hidden size-12 -translate-x-1/2 items-center justify-center rounded-xl bg-accent text-accent-foreground lg:flex">
                  <Icon className="size-6" aria-hidden />
                </span>
                <Reveal className={`h-full rounded-2xl border border-border bg-surface p-5 sm:p-6 lg:h-auto ${right ? 'lg:col-start-2' : ''}`}>
                  <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground lg:hidden">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    {step.label}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold tracking-tight">{step.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{keepDash(step.body)}</p>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function Capabilities({ id }: { id: UseCaseId }) {
  const { copy } = useSite();
  const c = copy.useCases.pages[id].capabilities;
  const status = copy.useCases.status;
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} lead={c.lead} align="left" />
        <Reveal delay={0.1} className="mt-12 divide-y divide-border rounded-3xl border border-border bg-surface">
          {c.items.map((item) => (
            <div key={item.title} className="grid gap-3 p-5 sm:p-6 md:grid-cols-[13rem_1fr] md:items-start md:gap-8 md:p-8">
              <div>
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="mt-1.5 text-muted">{keepDash(item.body)}</p>
              </div>
              <span
                className={`order-first justify-self-start whitespace-nowrap rounded-full px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider ${STATUS_STYLES[item.status as Status]}`}
              >
                {status[item.status as Status]}
              </span>
            </div>
          ))}
        </Reveal>
        <div className="mt-6 grid gap-3 text-sm text-muted md:grid-cols-2">
          <p className="flex items-start gap-2 rounded-2xl border border-border p-4">
            <ShieldAlert className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
            {c.note}
          </p>
          <p className="flex items-start gap-2 rounded-2xl border border-border p-4">
            <Info className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
            {status.legend}
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * Why buying from a small team is an advantage. Use-case pages add the procurement questions that come
 * with it; the home page leaves them out for visitors who haven't decided they're interested yet.
 */
export function SmallTeam({ withAnswers = false }: { withAnswers?: boolean }) {
  const { copy } = useSite();
  const t = copy.useCases.smallTeam;
  return (
    <section className="dark bg-ink py-20 text-foreground sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} lead={t.lead} tone="night" />
        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
          {t.items.map((item, index) => {
            const Icon = SMALL_TEAM_ICONS[item.key];
            return (
              <Reveal key={item.key} delay={index * 0.06}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  <Icon className="size-6 text-neon" aria-hidden />
                  <h3 className="mt-5 text-xl font-bold text-white">{item.title}</h3>
                  <p className="mt-2 leading-relaxed text-white/65">{item.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
        {withAnswers && (
          <Reveal delay={0.1} className="mt-6 rounded-2xl border border-dashed border-white/20 p-6 sm:p-8">
            <h3 className="text-lg font-bold text-white">{t.honest.title}</h3>
            <ul className="mt-4 grid gap-4 md:grid-cols-3">
              {t.honest.items.map((item) => (
                <li key={item.q} className="text-white/65">
                  <span className="block font-semibold text-white">{item.q}</span> {item.a}
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </section>
  );
}

function UseCaseCta({ id }: { id: UseCaseId }) {
  const { copy, locale } = useSite();
  const c = copy.useCases.pages[id].cta;
  return (
    <section className="px-4 pb-10 pt-4 sm:pt-10">
      <div className="dark relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-ink px-6 py-14 text-white sm:rounded-[2.5rem] sm:px-16 sm:py-20">
        <img src="/brand/neon-wallpaper.webp" alt="" aria-hidden className="absolute inset-0 size-full object-cover object-[100%_75%] opacity-40 sm:opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/90 to-ink/50 sm:bg-gradient-to-r sm:via-ink/85 sm:to-transparent" aria-hidden />
        <div className="relative max-w-xl">
          <Reveal>
            <h2 className="text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl">{c.title}</h2>
            <p className="mt-5 text-lg text-white/70">{keepDash(c.lead)}</p>
            <ol className="mt-6 space-y-2 text-white/80">
              {c.steps.map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-neon/15 font-mono text-xs text-neon">{index + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href={pathFor('contact', locale)}
                className={`${buttonVariants({ variant: 'primary', size: 'lg' })} group h-auto min-h-12 w-full justify-center whitespace-normal py-3 text-center sm:w-auto`}
              >
                {c.primary}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function OtherUseCases({ current }: { current: UseCaseId }) {
  const { copy } = useSite();
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{copy.useCases.other}</p>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {USE_CASE_IDS.filter((id) => id !== current).map((id) => (
            <UseCaseCard key={id} id={id} compact />
          ))}
        </div>
      </div>
    </section>
  );
}

export function UseCaseCard({ id, compact = false }: { id: UseCaseId; compact?: boolean }) {
  const { copy, locale } = useSite();
  const card = copy.useCases.pages[id].card;
  const Icon = USE_CASE_ICONS[id];
  return (
    <a
      href={pathFor(id, locale)}
      className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent sm:p-7"
    >
      <span className="flex items-center justify-between">
        <span className="flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent-soft-foreground">
          <Icon className="size-5" aria-hidden />
        </span>
        <ArrowUpRight className="size-5 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden />
      </span>
      <span className="mt-5 block text-xl font-bold">{card.title}</span>
      <span className="mt-2 block flex-1 leading-relaxed text-muted">{card.body}</span>
      {!compact && (
        <span className="mt-5 flex flex-wrap gap-1.5">
          {card.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-border px-2.5 py-1 text-xs text-muted">
              {tag}
            </span>
          ))}
        </span>
      )}
    </a>
  );
}

/** Home page entry point to the use-case pages. */
export function UseCases() {
  const { copy } = useSite();
  const o = copy.useCases.overview;
  return (
    <section id="use-cases" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow={o.eyebrow} title={o.title} lead={o.lead} />
        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 lg:grid-cols-3">
          {USE_CASE_IDS.map((id, index) => (
            <Reveal key={id} delay={index * 0.08}>
              <UseCaseCard id={id} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
