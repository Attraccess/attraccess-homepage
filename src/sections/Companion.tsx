import { motion, useInView, useReducedMotion } from 'motion/react';
import { Check, Lock, LockOpen } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { MonitorFrame } from '../components/DeviceFrames';
import { SectionHeading, Shot } from '../components/primitives';
import { useSite } from '../lib/site';

/** A stand-in for the CAM software on a control PC once the Companion has unlocked it. */
function CamScreen() {
  return (
    <div className="absolute inset-0 flex flex-col bg-[#20262a] text-[1.1cqw] text-white/70" aria-hidden>
      <div className="flex items-center gap-[1.5cqw] border-b border-white/10 bg-[#2a3136] px-[1.5cqw] py-[0.8cqw]">
        <span className="font-semibold text-white/90">CAM Studio</span>
        <span>File</span>
        <span>Edit</span>
        <span>Toolpath</span>
        <span className="ml-auto rounded bg-[#3d6b4f] px-[0.8cqw] py-[0.2cqw] text-white">Send to CNC</span>
      </div>
      <div className="flex flex-1">
        <div className="w-[22%] space-y-[0.9cqw] border-r border-white/10 p-[1.5cqw]">
          {['Stock 600 × 400', 'Pocket · 6 mm', 'Profile · outside', 'Drill · 8 × Ø5'].map((op) => (
            <div key={op} className="truncate rounded bg-white/5 px-[0.8cqw] py-[0.5cqw]">
              {op}
            </div>
          ))}
        </div>
        <svg viewBox="0 0 400 240" className="flex-1">
          <rect x="40" y="30" width="320" height="180" fill="none" stroke="rgb(255 255 255 / 0.25)" />
          <rect x="60" y="50" width="280" height="140" fill="none" stroke="#f5c578" strokeDasharray="4 3" />
          <path d="M70 60 H330 V80 H70 V100 H330 V120 H70 V140 H330 V160 H70 V180 H330" fill="none" stroke="#5ee6f2" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  );
}

export function Companion() {
  const { copy } = useSite();
  const c = copy.companion;
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-20% 0px' });
  const [unlocked, setUnlocked] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!inView || reduce || paused) return;
    const id = window.setInterval(() => setUnlocked((u) => !u), 3200);
    return () => window.clearInterval(id);
  }, [inView, reduce, paused]);

  return (
    <section className="py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <SectionHeading eyebrow={c.eyebrow} title={c.title} lead={c.lead} align="left" />
          <ul className="mt-8 space-y-3">
            {c.points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-muted">
                <Check className="mt-0.5 size-5 shrink-0 text-success" aria-hidden />
                {point}
              </li>
            ))}
          </ul>
        </div>
        <div ref={ref}>
          <MonitorFrame>
            <div className="relative aspect-[16/10]">
              <motion.div animate={{ opacity: unlocked ? 0 : 1 }} transition={{ duration: 0.5 }} className="absolute inset-0">
                <Shot name="kiosk" alt={c.lockedAlt} />
                <div className="absolute inset-x-0 top-0 flex items-center justify-center gap-[1cqw] bg-ink/90 px-[2cqw] py-[1cqw] text-[1.3cqw] font-semibold text-white">
                  <Lock className="size-[1.6cqw] shrink-0" aria-hidden />
                  {c.lockBanner}
                </div>
              </motion.div>
              <motion.div animate={{ opacity: unlocked ? 1 : 0 }} transition={{ duration: 0.5 }} className="absolute inset-0">
                <CamScreen />
                <div className="absolute bottom-[2cqw] right-[2cqw] flex items-center gap-[1cqw] rounded-[1cqw] bg-white px-[1.4cqw] py-[0.9cqw] text-[1.2cqw] text-ink shadow-lg">
                  <span className="size-[0.9cqw] rounded-full bg-success" aria-hidden />
                  <span className="font-semibold">{c.session}</span>
                  <span className="text-[#5d6b6e]">{c.machine}</span>
                </div>
              </motion.div>
            </div>
          </MonitorFrame>
          <div className="mt-6 flex justify-center gap-2 text-sm" role="group">
            {[c.locked, c.running].map((label, index) => {
              const active = unlocked === (index === 1);
              const Icon = index === 0 ? Lock : LockOpen;
              return (
                <button
                  key={label}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setPaused(true);
                    setUnlocked(index === 1);
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold transition-colors ${active ? 'bg-accent text-accent-foreground' : 'bg-default text-muted hover:text-foreground'}`}
                >
                  <Icon className="size-3.5" aria-hidden />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
