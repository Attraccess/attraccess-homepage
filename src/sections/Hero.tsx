import { buttonVariants } from '@heroui/react';
import { ArrowRight, BadgeCheck, Check, Nfc } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { EASE } from '../components/primitives';
import { REFERENCE_KEYS, ReferenceLogo } from '../components/ReferenceLogo';
import { TapHeadline } from '../components/TapHeadline';
import { pathFor } from '../lib/routes';
import { useSite } from '../lib/site';

export function Hero() {
  const { copy, locale } = useSite();
  const h = copy.hero;
  const [granted, setGranted] = useState(false);

  return (
    // Always dark: the night-shift look carries the neon of the reader.
    <section id="top" className="dark relative overflow-hidden bg-ink pb-20 pt-36 text-foreground sm:pt-44">
      <img src="/brand/neon-wallpaper.webp" alt="" aria-hidden className="absolute inset-0 size-full object-cover object-[50%_80%] opacity-35" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/70 to-ink" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="font-mono text-xs uppercase tracking-[0.25em] text-neon"
        >
          {h.eyebrow}
        </motion.p>
        <TapHeadline
          lines={h.title}
          lead={h.tapLead}
          word={h.tapWord}
          badge={h.badge}
          replayLabel={h.replay}
          onTap={() => setGranted(true)}
          className="mx-auto mt-8 max-w-5xl text-[clamp(3.2rem,9vw,8rem)] font-extrabold leading-[0.9] tracking-[-0.045em] text-white"
        />
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={granted ? { opacity: 1, y: 0, scale: 1 } : undefined}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="mx-auto mt-2 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 py-2.5 pl-2.5 pr-4 text-left backdrop-blur"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-success/20 text-success">
            <BadgeCheck className="size-5" aria-hidden />
          </span>
          <span>
            <span className="block text-sm font-semibold text-white">{h.granted}</span>
            <span className="block text-xs text-white/60">{h.grantedDetail}</span>
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
          className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl"
        >
          {h.lead}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.65 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <a href={pathFor('contact', locale)} className={`${buttonVariants({ variant: 'primary', size: 'lg' })} group`}>
            {h.primary}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </a>
          <a href="#reader" className={buttonVariants({ variant: 'secondary', size: 'lg' })}>
            <Nfc className="size-4" aria-hidden />
            {h.secondary}
          </a>
        </motion.div>
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/60"
        >
          {h.note.map((item) => (
            <li key={item} className="inline-flex items-center gap-1.5">
              <Check className="size-4 text-success" aria-hidden />
              {item}
            </li>
          ))}
        </motion.ul>
      </div>

      <div className="relative mx-auto mt-20 max-w-5xl px-6">
        <p className="text-center font-mono text-xs uppercase tracking-[0.2em] text-white/50">{h.references}</p>
        <ul className="mt-6 flex flex-wrap items-start justify-center gap-x-16 gap-y-8 text-white/80">
          {REFERENCE_KEYS.map((key) => (
            <li key={key} className="flex flex-col items-center gap-2">
              <ReferenceLogo reference={key} className="text-2xl" />
              <span className="text-xs text-white/45">{copy.references[key].sector}</span>
            </li>
          ))}
        </ul>
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
          {h.outcomes.map((outcome) => (
            <div key={outcome.label} className="bg-ink/90 p-6 text-left">
              <p className="font-display text-4xl font-extrabold text-neon">{outcome.value}</p>
              <p className="mt-2 text-sm text-white/60">{outcome.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
