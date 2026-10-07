import { buttonVariants } from '@heroui/react';
import { ArrowRight, BadgeCheck, CalendarClock, Check, Nfc, Zap } from 'lucide-react';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { BrowserFrame, EASE, Shot } from '../components/primitives';
import { useSite } from '../lib/site';

function useTicker(startSeconds: number) {
  const [seconds, setSeconds] = useState(startSeconds);
  useEffect(() => {
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, []);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':');
}

function FloatingChip({
  children,
  className,
  delay,
  depth,
  px,
  py,
}: {
  children: ReactNode;
  className: string;
  delay: number;
  depth: number;
  px: MotionValue<number>;
  py: MotionValue<number>;
}) {
  const x = useTransform(px, (v) => v * depth);
  const y = useTransform(py, (v) => v * depth);
  return (
    <motion.div style={{ x, y }} className={`absolute z-20 hidden md:block ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay, type: 'spring', stiffness: 200, damping: 18 }}
        className="flex items-center gap-3 rounded-2xl border border-border bg-surface/90 py-2.5 pl-2.5 pr-4 shadow-float backdrop-blur-md"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  const { copy } = useSite();
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const timer = useTicker(47 * 60 + 12);

  // Pointer parallax for the floating chips.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const px = useSpring(pointerX, { stiffness: 80, damping: 20 });
  const py = useSpring(pointerY, { stiffness: 80, damping: 20 });

  // The screenshot starts tilted back and straightens up as you scroll into it.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const rotateX = useTransform(scrollYProgress, [0, 0.45], reduceMotion ? [0, 0] : [22, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.45], reduceMotion ? [1, 1] : [0.92, 1]);
  const mascotY = useTransform(scrollYProgress, [0, 0.5], ['0%', '-18%']);

  const words = copy.hero.title;

  return (
    <section
      ref={ref}
      id="top"
      className="relative overflow-hidden pb-16 pt-32 sm:pt-40"
      onPointerMove={(event) => {
        if (reduceMotion) return;
        const rect = event.currentTarget.getBoundingClientRect();
        pointerX.set(((event.clientX - rect.left) / rect.width - 0.5) * 40);
        pointerY.set(((event.clientY - rect.top) / rect.height - 0.5) * 40);
      }}
    >
      <div className="mat-grid pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute left-1/2 top-[-10%] h-[700px] w-[1100px] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{ background: 'radial-gradient(closest-side, color-mix(in oklab, var(--accent) 35%, transparent), transparent)' }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 font-mono text-xs uppercase tracking-[0.18em] text-muted backdrop-blur"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-success" />
          </span>
          {copy.hero.eyebrow}
        </motion.p>

        <h1 className="mx-auto mt-7 max-w-5xl text-[clamp(3rem,8.5vw,7rem)] font-extrabold leading-[0.92] tracking-[-0.04em]">
          {words.map((line, index) => (
            <span key={line} className={`block overflow-hidden ${index === words.length - 1 ? 'pb-[0.22em]' : 'pb-[0.06em]'}`}>
              <motion.span
                className={`inline-block ${index === words.length - 1 ? 'text-accent' : ''}`}
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.1 + index * 0.12 }}
              >
                {index === words.length - 1 ? (
                  <span className="relative">
                    {line}
                    <motion.svg
                      viewBox="0 0 300 20"
                      className="absolute -bottom-[0.16em] left-0 h-[0.2em] w-full text-rose"
                      preserveAspectRatio="none"
                      aria-hidden
                    >
                      <motion.path
                        d="M2 14 C 60 4, 120 4, 160 10 S 260 18, 298 6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="5"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.9, duration: 0.8, ease: 'easeInOut' }}
                      />
                    </motion.svg>
                  </span>
                ) : (
                  line
                )}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
          className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl"
        >
          {copy.hero.lead}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.65 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <a href="#pricing" className={`${buttonVariants({ variant: 'primary', size: 'lg' })} group`}>
            {copy.hero.primary}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </a>
          <a href="#reader" className={buttonVariants({ variant: 'secondary', size: 'lg' })}>
            <Nfc className="size-4" aria-hidden />
            {copy.hero.secondary}
          </a>
        </motion.div>
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted"
        >
          {copy.hero.note.map((item) => (
            <li key={item} className="inline-flex items-center gap-1.5">
              <Check className="size-4 text-success" aria-hidden />
              {item}
            </li>
          ))}
        </motion.ul>
      </div>

      <div className="relative mx-auto mt-16 max-w-6xl px-4 sm:px-6" style={{ perspective: 1600 }}>
        <motion.div
          style={{ rotateX, scale, transformOrigin: '50% 0%' }}
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.35 }}
          className="relative"
        >
          <BrowserFrame url="makerspace.example/resources">
            <Shot name="resources" alt={copy.hero.shotAlt} priority />
          </BrowserFrame>

          {/* The mascot peeks over the edge of the app window. */}
          <motion.img
            src="/brand/mascot.webp"
            alt=""
            aria-hidden
            style={{ y: mascotY }}
            initial={{ opacity: 0, x: 40, rotate: 8 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ delay: 1.2, type: 'spring', stiffness: 120, damping: 14 }}
            className="pointer-events-none absolute -right-6 -top-24 z-10 hidden w-28 drop-shadow-xl lg:block xl:-right-16 xl:w-36"
          />
        </motion.div>

        <FloatingChip className="-left-4 top-[18%] xl:-left-16" delay={1.1} depth={1} px={px} py={py}>
          <span className="flex size-9 items-center justify-center rounded-xl bg-warning/15 text-warning">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-warning opacity-70" />
              <span className="relative inline-flex size-2.5 rounded-full bg-warning" />
            </span>
          </span>
          <span className="text-left">
            <span className="block text-sm font-semibold">
              {copy.hero.chips.resource} · <span className="text-warning">{copy.hero.chips.inUse}</span>
            </span>
            <span className="block font-mono text-xs tabular-nums text-muted">{timer}</span>
          </span>
        </FloatingChip>

        <FloatingChip className="-right-2 top-[42%] xl:-right-20" delay={1.35} depth={-1.4} px={px} py={py}>
          <span className="flex size-9 items-center justify-center rounded-xl bg-success/15 text-success">
            <BadgeCheck className="size-5" aria-hidden />
          </span>
          <span className="text-left">
            <span className="block text-sm font-semibold">{copy.hero.chips.granted}</span>
            <span className="block text-xs text-muted">{copy.hero.chips.grantedBy}</span>
          </span>
        </FloatingChip>

        <FloatingChip className="-left-2 bottom-[16%] xl:-left-12" delay={1.6} depth={-0.8} px={px} py={py}>
          <span className="flex size-9 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <Zap className="size-5" aria-hidden />
          </span>
          <span className="text-left">
            <span className="block text-sm font-semibold">{copy.hero.chips.fan}</span>
            <span className="block text-xs text-muted">{copy.hero.chips.fanDetail}</span>
          </span>
        </FloatingChip>

        <FloatingChip className="right-6 bottom-[6%] xl:-right-8" delay={1.85} depth={1.2} px={px} py={py}>
          <span className="flex size-9 items-center justify-center rounded-xl bg-rose/15 text-rose">
            <CalendarClock className="size-5" aria-hidden />
          </span>
          <span className="text-left">
            <span className="block text-sm font-semibold">{copy.hero.chips.maintenance}</span>
            <span className="block text-xs text-muted">{copy.hero.chips.maintenanceDetail}</span>
          </span>
        </FloatingChip>
      </div>
    </section>
  );
}
