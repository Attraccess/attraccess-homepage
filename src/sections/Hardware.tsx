import { motion, useScroll, useTransform } from 'motion/react';
import { Cpu, Lock, MonitorSmartphone, Printer, Wifi, type LucideIcon } from 'lucide-react';
import { useRef } from 'react';
import { Reveal, SectionHeading, Shot } from '../components/primitives';
import { useSite, type ShotName } from '../lib/site';
import { SCREEN, rectStyle } from '../lib/device';

const EXTRA_VISUALS: { icon: LucideIcon; shot?: ShotName }[] = [{ icon: Lock }, { icon: MonitorSmartphone, shot: 'kiosk' }, { icon: Printer, shot: 'printables' }];

export function Hardware() {
  const { copy } = useSite();
  const h = copy.hardware;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const rotate = useTransform(scrollYProgress, [0, 1], [-8, 8]);
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section className="relative overflow-hidden py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div ref={ref} className="grid items-center gap-16 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <SectionHeading eyebrow={h.eyebrow} title={h.title} lead={h.lead} align="left" />
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {h.variants.map((variant, index) => (
                <Reveal key={variant.name} delay={0.1 + index * 0.08}>
                  <div className="h-full rounded-2xl border border-border bg-surface p-5">
                    <div className="flex items-center gap-2 text-accent">
                      {index === 0 ? <Cpu className="size-5" aria-hidden /> : <Wifi className="size-5" aria-hidden />}
                      <span className="font-mono text-xs uppercase tracking-[0.15em]">{variant.detail}</span>
                    </div>
                    <h3 className="mt-3 text-xl font-bold">{variant.name}</h3>
                    <p className="mt-2 text-muted">{variant.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <div className="relative flex justify-center">
            <div
              className="absolute inset-x-10 top-1/4 h-1/2 rounded-full opacity-70 blur-3xl"
              style={{ background: 'radial-gradient(closest-side, color-mix(in oklab, var(--color-neon) 45%, transparent), transparent)' }}
              aria-hidden
            />
            <motion.div style={{ rotate, y }} className="relative w-56 drop-shadow-[0_40px_50px_rgb(0_0_0/0.35)] sm:w-64">
              <img src="/hardware/attractap.webp" alt="Attractap Touch" className="block w-full" />
              {/* The reader's lock screen, lit up. */}
              <div className="absolute overflow-hidden rounded-[2.5%] bg-fw-bg font-device text-fw-text" style={rectStyle(SCREEN)}>
                <img src="/brand/neon-wallpaper.webp" alt="" className="absolute inset-0 size-full object-cover object-[0%_70%]" />
                <div className="relative px-[8%] pt-[24%] text-[clamp(0.8rem,1.6vw,1rem)] leading-tight">
                  <div>{copy.demo.device.lock[0]}</div>
                  <div className="pl-[30%]">{copy.demo.device.lock[1]}</div>
                </div>
              </div>
            </motion.div>
            <motion.img
              src="/brand/mascot.webp"
              alt=""
              aria-hidden
              initial={{ x: 60, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-20%' }}
              transition={{ type: 'spring', stiffness: 100, damping: 14, delay: 0.3 }}
              className="absolute bottom-0 right-[8%] w-24 sm:w-28"
            />
          </div>
        </div>

        <div className="mt-20 grid gap-5 md:grid-cols-3">
          {h.extras.map((extra, index) => {
            const { icon: Icon, shot } = EXTRA_VISUALS[index];
            return (
              <Reveal key={extra.title} delay={index * 0.08}>
                <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface">
                  <div className="relative h-44 overflow-hidden border-b border-border bg-surface-secondary">
                    {shot ? (
                      <Shot
                        name={shot}
                        alt={shot === 'kiosk' ? h.kioskAlt : h.printablesAlt}
                        className="absolute inset-x-0 top-0 origin-top scale-[1.35] transition-transform duration-700 group-hover:scale-[1.45]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <div className="relative">
                          <div className="flex h-24 w-36 items-center justify-center rounded-lg border-2 border-foreground/80 bg-background shadow-lg">
                            <motion.span
                              animate={{ scale: [1, 1.15, 1] }}
                              transition={{ repeat: Infinity, duration: 2.4 }}
                              className="text-accent"
                            >
                              <Lock className="size-9" aria-hidden />
                            </motion.span>
                          </div>
                          <div className="mx-auto h-3 w-10 bg-foreground/80" />
                          <div className="mx-auto h-1.5 w-20 rounded-full bg-foreground/80" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2">
                      <Icon className="size-4 text-accent" aria-hidden />
                      <h3 className="text-lg font-bold">{extra.title}</h3>
                    </div>
                    <p className="mt-2 text-muted">{extra.body}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
