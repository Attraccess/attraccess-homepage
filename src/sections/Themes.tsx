import { motion, useMotionValue, useMotionTemplate, animate, useInView } from 'motion/react';
import { ChevronsLeftRight, Moon, Sun } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { BrowserFrame, PhoneFrame, Reveal, SectionHeading } from '../components/primitives';
import { shotSrc, useSite } from '../lib/site';

export function Themes() {
  const { copy, locale } = useSite();
  const frameRef = useRef<HTMLDivElement>(null);
  const split = useMotionValue(50);
  const clip = useMotionTemplate`inset(0 0 0 ${split}%)`;
  const left = useMotionTemplate`${split}%`;
  const inView = useInView(frameRef, { once: true, margin: '-30%' });

  // A little nudge on first view so people notice it's draggable.
  useEffect(() => {
    if (!inView) return;
    const controls = animate(split, [50, 30, 70, 50], { duration: 2.2, ease: 'easeInOut' });
    return () => controls.stop();
  }, [inView, split]);

  const moveTo = (clientX: number) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    split.set(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  };

  return (
    <section className="relative overflow-hidden py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow={copy.themes.eyebrow} title={copy.themes.title} lead={copy.themes.lead} />
        <div className="relative mt-16">
          <Reveal>
            <BrowserFrame url="makerspace.example/resources/1" className="mx-auto max-w-5xl">
              <div
                ref={frameRef}
                className="relative aspect-[1440/900] cursor-ew-resize touch-none select-none"
                onPointerDown={(event) => {
                  event.currentTarget.setPointerCapture(event.pointerId);
                  moveTo(event.clientX);
                }}
                onPointerMove={(event) => {
                  if (event.buttons) moveTo(event.clientX);
                }}
                role="slider"
                aria-label={copy.themes.compare}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(split.get())}
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowLeft') split.set(Math.max(0, split.get() - 5));
                  if (event.key === 'ArrowRight') split.set(Math.min(100, split.get() + 5));
                }}
              >
                <img src={shotSrc('resource-laser', locale, 'light')} alt="" className="absolute inset-0 size-full object-cover object-top" draggable={false} loading="lazy" />
                <motion.img
                  src={shotSrc('resource-laser', locale, 'dark')}
                  alt=""
                  style={{ clipPath: clip }}
                  className="absolute inset-0 size-full object-cover object-top"
                  draggable={false}
                  loading="lazy"
                />
                <motion.div style={{ left }} className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-accent shadow-[0_0_20px_var(--accent)]">
                  <span className="absolute left-1/2 top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg">
                    <ChevronsLeftRight className="size-5" aria-hidden />
                  </span>
                </motion.div>
                <span className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-black shadow">
                  <Sun className="size-3.5" aria-hidden /> Light
                </span>
                <span className="pointer-events-none absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/80 px-3 py-1 text-xs font-semibold text-white shadow">
                  <Moon className="size-3.5" aria-hidden /> Dark
                </span>
              </div>
            </BrowserFrame>
          </Reveal>

          <motion.div
            initial={{ opacity: 0, y: 80, rotate: -6 }}
            whileInView={{ opacity: 1, y: 0, rotate: -6 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ type: 'spring', stiffness: 80, damping: 16 }}
            className="absolute -bottom-16 -left-2 hidden w-52 lg:block xl:left-4"
          >
            <PhoneFrame>
              <img src={shotSrc('mobile-resources', locale, 'light')} alt="" loading="lazy" className="block w-full" />
            </PhoneFrame>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 80, rotate: 6 }}
            whileInView={{ opacity: 1, y: 0, rotate: 6 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ type: 'spring', stiffness: 80, damping: 16, delay: 0.15 }}
            className="absolute -bottom-20 -right-2 hidden w-52 lg:block xl:right-4"
          >
            <PhoneFrame>
              <img src={shotSrc('mobile-resource', locale, 'dark')} alt="" loading="lazy" className="block w-full" />
            </PhoneFrame>
          </motion.div>
        </div>
        <p className="mt-6 text-center text-sm text-muted lg:mt-28">{copy.themes.compare}</p>
      </div>
    </section>
  );
}
