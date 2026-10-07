import { AnimatePresence, motion, type HTMLMotionProps } from 'motion/react';
import type { ReactNode } from 'react';
import { shotSrc, useSite, type ShotName } from '../lib/site';

const EASE = [0.22, 1, 0.36, 1] as const;

/** Fades and lifts its children in once they scroll into view. */
export function Reveal({ delay = 0, y = 24, ...props }: HTMLMotionProps<'div'> & { delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      {...props}
    />
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = 'center',
  tone = 'default',
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  align?: 'center' | 'left';
  tone?: 'default' | 'night';
}) {
  const centered = align === 'center';
  return (
    <Reveal className={centered ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl'}>
      <p className={`font-mono text-xs font-medium uppercase tracking-[0.2em] ${tone === 'night' ? 'text-neon' : 'text-accent'}`}>
        {eyebrow}
      </p>
      <h2 className="mt-4 text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">{title}</h2>
      {lead && (
        <p className={`mt-5 text-lg leading-relaxed ${tone === 'night' ? 'text-white/70' : 'text-muted'}`}>{lead}</p>
      )}
    </Reveal>
  );
}

/** A theme- and locale-aware product screenshot that cross-fades when either changes. */
export function Shot({ name, alt, className = '', priority = false }: { name: ShotName; alt: string; className?: string; priority?: boolean }) {
  const { locale, theme } = useSite();
  const src = shotSrc(name, locale, theme);
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.img
          key={src}
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          className="block h-auto w-full select-none"
        />
      </AnimatePresence>
    </div>
  );
}

/** Minimal browser chrome around a screenshot. */
export function BrowserFrame({ url, children, className = '' }: { url: string; children: ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-xl border border-border bg-surface shadow-float ${className}`}>
      <div className="flex items-center gap-3 border-b border-border bg-surface-secondary px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="mx-auto flex min-w-0 max-w-sm flex-1 items-center justify-center gap-1.5 rounded-md bg-background/70 px-3 py-1 font-mono text-[11px] text-muted">
          <svg viewBox="0 0 16 16" className="size-3" aria-hidden>
            <path fill="currentColor" d="M8 1a3.5 3.5 0 0 0-3.5 3.5V6H4a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-.5V4.5A3.5 3.5 0 0 0 8 1Zm2 5H6V4.5a2 2 0 1 1 4 0V6Z" />
          </svg>
          <span className="truncate">{url}</span>
        </div>
        <div className="hidden w-10 sm:block" aria-hidden />
      </div>
      {children}
    </div>
  );
}

/** A phone silhouette around a mobile screenshot. */
export function PhoneFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative rounded-[2.6rem] border border-black/20 bg-ink p-2.5 shadow-float dark:border-white/10 ${className}`}>
      <div className="absolute left-1/2 top-4 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-ink" aria-hidden />
      <div className="overflow-hidden rounded-[2.1rem]">{children}</div>
    </div>
  );
}

export { EASE };
