import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { BadgeCheck, CircleCheck, CircleX, Lock, Nfc } from 'lucide-react';
import { useState } from 'react';
import type { Copy } from '../i18n/en';
import { useSite } from '../lib/site';
import { EASE } from './primitives';

type Trace = Copy['useCases']['pages']['kritis']['hero']['trace'];

/**
 * What Attraccess checks between a badge tap and the output it switches, for one resource. Visitors
 * pick a person and watch each check resolve; one person passes, the other is stopped at a check.
 */
export function DecisionTrace({ trace }: { trace: Trace }) {
  const states = useSite().copy.useCases.checkStates;
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  const person = trace.people[index];
  const step = reduce ? 0 : 0.28;
  // Checks after the first failing one are never evaluated.
  const firstFail = person.checks.findIndex((check) => !check.ok);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-left text-white shadow-float backdrop-blur sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-neon sm:tracking-[0.2em]">{trace.label.replace(' · ', '\u00a0· ')}</p>
          <p className="mt-1.5 text-lg font-bold">{trace.resource}</p>
          <p className="text-sm text-white/55">{trace.resourceDetail}</p>
        </div>
        <Nfc className="mt-1 size-6 shrink-0 text-neon" aria-hidden />
      </div>

      <p id="trace-pick" className="mt-5 text-xs text-white/55">
        {trace.pick}
      </p>
      <div role="group" aria-labelledby="trace-pick" className="mt-2 grid grid-cols-2 gap-2">
        {trace.people.map((p, i) => (
          <button
            key={p.name}
            type="button"
            aria-pressed={i === index}
            onClick={() => setIndex(i)}
            className={`rounded-xl border px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon ${
              i === index ? 'border-neon/60 bg-neon/10' : 'border-white/10 hover:border-white/25 hover:bg-white/5'
            }`}
          >
            <span className="block text-sm font-semibold">{p.name}</span>
            <span className="block text-xs text-white/55">{p.role}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={person.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          <ol className="mt-4 space-y-2">
            {person.checks.map((check, i) => {
              const skipped = firstFail !== -1 && i > firstFail;
              const state = skipped ? states.skipped : check.ok ? states.passed : states.failed;
              return (
                <motion.li
                  key={check.label}
                  initial={reduce ? false : { opacity: 0, x: -8 }}
                  whileInView={{ opacity: skipped ? 0.6 : 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, ease: EASE, delay: 0.2 + i * step }}
                  className="flex items-start gap-3 rounded-xl bg-black/20 px-3 py-2.5"
                >
                  {skipped ? (
                    <span className="mt-0.5 size-4 shrink-0 rounded-full border border-white/40" aria-hidden />
                  ) : check.ok ? (
                    <CircleCheck className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                  ) : (
                    <CircleX className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden />
                  )}
                  <span className="min-w-0">
                    <span className="block text-sm font-medium">
                      {check.label}
                      <span className="sr-only">: {state}</span>
                    </span>
                    <span className="block text-xs text-white/60">{skipped ? states.skipped : check.detail}</span>
                  </span>
                </motion.li>
              );
            })}
          </ol>
          <motion.div
            aria-live="polite"
            initial={reduce ? false : { opacity: 0, y: 8, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 20, delay: 0.25 + person.checks.length * step }}
            className={`mt-4 flex items-center gap-3 rounded-2xl p-3 ${person.ok ? 'bg-success/15' : 'bg-danger/15'}`}
          >
            <span className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${person.ok ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>
              {person.ok ? <BadgeCheck className="size-5" aria-hidden /> : <Lock className="size-5" aria-hidden />}
            </span>
            <span>
              <span className="block text-sm font-semibold">{person.result}</span>
              <span className="block text-xs text-white/60">{person.resultDetail}</span>
            </span>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
