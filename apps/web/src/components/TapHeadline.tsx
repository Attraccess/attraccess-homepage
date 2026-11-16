import { AnimatePresence, motion, useAnimate, useReducedMotion } from 'motion/react';
import { Wifi } from 'lucide-react';
import { useEffect, useState } from 'react';
import { beep } from '../lib/sound';
import { EASE } from './primitives';

/** An employee badge in the brand colours. Sizes are in em, so the parent's font size scales it. */
export function RfidBadge({ name, role }: { name: string; role: string }) {
  return (
    <span className="relative block aspect-[1.586] overflow-hidden rounded-[0.6rem] bg-gradient-to-br from-[#256d7b] to-[#163f48] p-[8%] text-left font-sans font-normal leading-normal tracking-normal text-white shadow-[0_24px_40px_-14px_rgb(0_0_0/0.6)] ring-1 ring-white/15">
      <span className="absolute -right-[18%] -top-[30%] aspect-square w-[60%] rounded-full bg-white/10" aria-hidden />
      <span className="flex items-start justify-between">
        <img src="/logo.png" alt="" className="h-[1.7em] w-auto opacity-90" draggable={false} />
        <Wifi className="size-[1.3em] rotate-90 opacity-80" aria-hidden />
      </span>
      <span className="absolute inset-x-[8%] bottom-[9%]">
        <span className="block font-display text-[1.25em] font-bold leading-none">{name}</span>
        <span className="mt-[0.3em] block text-[0.7em] text-white/70">{role}</span>
      </span>
    </span>
  );
}

/**
 * The word that gets tapped: a badge flies in, presses onto it, and the word lights up with NFC rings
 * at the moment of contact. Clicking the word replays it, with the reader's beep now that there was a user gesture.
 */
function TapWord({
  word,
  badge,
  replayLabel,
  delay,
  onTap,
}: {
  word: string;
  badge: { name: string; role: string };
  replayLabel: string;
  delay: number;
  onTap?: () => void;
}) {
  const reduce = useReducedMotion();
  const [run, setRun] = useState(0);
  const [tappedRun, setTappedRun] = useState<number | null>(null);
  const tapped = !!reduce || tappedRun === run;
  const [card, animate] = useAnimate<HTMLSpanElement>();

  useEffect(() => {
    if (reduce) {
      onTap?.();
      return;
    }
    const el = card.current;
    if (!el) return;
    let cancelled = false;
    const sequence = async () => {
      await animate(el, { opacity: 0, x: '170%', y: '-190%', rotate: 26, scale: 1.1 }, { duration: 0 });
      await animate(el, { opacity: 1, x: '18%', y: '-14%', rotate: -8, scale: 1 }, { duration: 0.75, ease: EASE, delay: run === 0 ? delay : 0.05 });
      if (cancelled) return;
      await animate(el, { y: '-2%', scale: 0.93 }, { duration: 0.12, ease: 'easeOut' });
      if (cancelled) return;
      setTappedRun(run);
      onTap?.();
      if (run > 0) beep('read');
      await animate(el, { y: '-14%', scale: 1 }, { duration: 0.2, ease: 'easeOut' });
      await animate(el, { y: '-16%' }, { duration: 0.45 });
      if (cancelled) return;
      await animate(el, { x: '230%', y: '-230%', rotate: 30 }, { duration: 0.6, ease: [0.55, 0, 0.9, 0.4] });
      await animate(el, { opacity: 0 }, { duration: 0 });
    };
    void sequence();
    return () => {
      cancelled = true;
    };
    // onTap is a fire-and-forget callback; re-running the sequence when it changes would replay the animation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, reduce, delay, animate, card]);

  return (
    // A mouse-only nicety: the word stays plain text in the heading's accessible name.
    <span onClick={() => setRun((r) => r + 1)} title={replayLabel} className="relative inline-block cursor-pointer">
      <AnimatePresence>
        {tapped &&
          !reduce &&
          [0, 1, 2].map((i) => (
            <motion.span
              key={`${run}-${i}`}
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 -ml-[0.5em] -mt-[0.5em] size-[1em] rounded-full border-[0.035em] border-accent"
              initial={{ scale: 0.3, opacity: 0.9 }}
              animate={{ scale: 3, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, delay: i * 0.16, ease: 'easeOut' }}
            />
          ))}
      </AnimatePresence>

      <motion.span
        className="relative inline-block"
        initial={false}
        animate={
          tapped
            ? { scale: reduce ? 1 : [1, 0.9, 1.06, 1], color: 'var(--accent)', textShadow: '0 0 28px color-mix(in oklab, var(--accent) 45%, transparent)' }
            : { scale: 1, color: 'var(--foreground)', textShadow: '0 0 0px transparent' }
        }
        transition={{ duration: 0.5, ease: EASE }}
      >
        {word}
        <svg viewBox="0 0 300 20" className="absolute -bottom-[0.16em] left-0 h-[0.2em] w-full text-rose" preserveAspectRatio="none" aria-hidden>
          <motion.path
            d="M2 14 C 60 4, 120 4, 160 10 S 260 18, 298 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            initial={false}
            animate={{ pathLength: tapped ? 1 : 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut', delay: tapped ? 0.25 : 0 }}
          />
        </svg>
      </motion.span>

      {!reduce && (
        <span className="pointer-events-none absolute left-1/2 top-1/2 z-10 w-[clamp(7rem,16vw,13rem)] -translate-x-1/2 -translate-y-1/2" aria-hidden>
          <span ref={card} className="block text-[clamp(0.5rem,1.15vw,0.9rem)] opacity-0">
            <RfidBadge {...badge} />
          </span>
        </span>
      )}
    </span>
  );
}

/** "Every machine. / Every operator. / One tap." – the last word is literally tapped with a badge on page load. */
export function TapHeadline({
  lines,
  lead,
  word,
  badge,
  replayLabel,
  className = '',
  delay = 1,
  onTap,
}: {
  lines: readonly string[];
  lead: string;
  word: string;
  badge: { name: string; role: string };
  replayLabel: string;
  className?: string;
  delay?: number;
  onTap?: () => void;
}) {
  return (
    <h1 className={className}>
      {lines.map((line, index) => (
        <span key={line} className="block overflow-hidden pb-[0.06em]">
          <motion.span className="inline-block" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.9, ease: EASE, delay: 0.1 + index * 0.12 }}>
            {line}
          </motion.span>
        </span>
      ))}
      <motion.span
        className="block pb-[0.22em]"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.1 + lines.length * 0.12 }}
      >
        <span className="text-accent">{lead}</span> <TapWord word={word} badge={badge} replayLabel={replayLabel} delay={delay} onTap={onTap} />
      </motion.span>
    </h1>
  );
}
