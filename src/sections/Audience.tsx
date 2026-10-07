import { useSite } from '../lib/site';

const GLYPHS = ['✶', '◆', '●', '▲'];

export function Audience() {
  const { copy } = useSite();
  const items = copy.audience.items;
  // Two copies side by side so the -50% marquee loop is seamless.
  const loop = [...items, ...items];
  return (
    <section aria-label={copy.audience.label} className="border-y border-border bg-surface-secondary/60 py-8">
      <p className="mb-5 text-center font-mono text-xs uppercase tracking-[0.2em] text-muted">{copy.audience.label}</p>
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <ul className="flex w-max animate-marquee gap-10 hover:[animation-play-state:paused]">
          {loop.map((item, index) => (
            <li key={`${item}-${index}`} aria-hidden={index >= items.length} className="flex items-center gap-10 whitespace-nowrap">
              <span className="font-display text-2xl font-semibold tracking-tight text-foreground/80 sm:text-3xl">{item}</span>
              <span className="text-accent/60" aria-hidden>
                {GLYPHS[index % GLYPHS.length]}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
