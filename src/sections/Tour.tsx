import { AnimatePresence, motion, useInView } from 'motion/react';
import { BadgeCheck, ClipboardList, FolderKanban, LayoutGrid, Receipt, Wrench, type LucideIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { BrowserFrame, EASE, SectionHeading, Shot } from '../components/primitives';
import { useSite, type ShotName } from '../lib/site';

const META: Record<string, { icon: LucideIcon; url: string }> = {
  resources: { icon: LayoutGrid, url: 'makerspace.example/resources' },
  'resource-people': { icon: BadgeCheck, url: 'makerspace.example/resources/5/people' },
  'resource-maintenance': { icon: Wrench, url: 'makerspace.example/resources/1/maintenance' },
  'resource-history': { icon: ClipboardList, url: 'makerspace.example/resources/1/history' },
  projects: { icon: FolderKanban, url: 'makerspace.example/projects' },
  billing: { icon: Receipt, url: 'makerspace.example/billing' },
};

function Step({
  index,
  title,
  body,
  shot,
  active,
  onActive,
}: {
  index: number;
  title: string;
  body: string;
  shot: ShotName;
  active: boolean;
  onActive: (index: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-45% 0px -45% 0px' });
  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);
  const Icon = META[shot].icon;
  return (
    <div ref={ref} className="flex min-h-[60vh] flex-col justify-center py-10 lg:min-h-[75vh]">
      <motion.div animate={{ opacity: active ? 1 : 0.35 }} transition={{ duration: 0.4 }} className="lg:pr-6">
        <div className="flex items-center gap-3">
          <span className={`flex size-11 items-center justify-center rounded-xl transition-colors ${active ? 'bg-accent text-accent-foreground' : 'bg-default text-muted'}`}>
            <Icon className="size-5" aria-hidden />
          </span>
          <span className="font-mono text-xs text-muted">{String(index + 1).padStart(2, '0')} / 06</span>
        </div>
        <h3 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h3>
        <p className="mt-4 max-w-md text-lg leading-relaxed text-muted">{body}</p>
      </motion.div>
      {/* Small screens get the screenshot inline instead of the sticky frame. */}
      <div className="mt-8 lg:hidden">
        <BrowserFrame url={META[shot].url}>
          <Shot name={shot} alt={title} />
        </BrowserFrame>
      </div>
    </div>
  );
}

export function Tour() {
  const { copy } = useSite();
  const [active, setActive] = useState(0);
  const items = copy.tour.items;
  const current = items[active].key as ShotName;

  return (
    <section id="features" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow={copy.tour.eyebrow} title={copy.tour.title} lead={copy.tour.lead} />
        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="min-w-0">
            {items.map((item, index) => (
              <Step
                key={item.key}
                index={index}
                title={item.title}
                body={item.body}
                shot={item.key as ShotName}
                active={index === active}
                onActive={setActive}
              />
            ))}
          </div>
          <div className="relative hidden lg:block">
            <div className="sticky top-[14vh]">
              <div className="relative">
                <div
                  className="absolute -inset-10 -z-10 rounded-[3rem] opacity-50 blur-3xl"
                  style={{ background: 'radial-gradient(closest-side, color-mix(in oklab, var(--accent) 30%, transparent), transparent)' }}
                  aria-hidden
                />
                <BrowserFrame url={META[current].url}>
                  <div className="relative aspect-[1440/900]">
                    <AnimatePresence initial={false}>
                      <motion.div
                        key={current}
                        initial={{ opacity: 0, scale: 1.02, filter: 'blur(6px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.55, ease: EASE }}
                        className="absolute inset-0"
                      >
                        <Shot name={current} alt={items[active].title} />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </BrowserFrame>
                <div className="mt-5 flex justify-center gap-2" aria-hidden>
                  {items.map((item, index) => (
                    <motion.span
                      key={item.key}
                      animate={{ width: index === active ? 28 : 8 }}
                      className={`h-2 rounded-full ${index === active ? 'bg-accent' : 'bg-border'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
