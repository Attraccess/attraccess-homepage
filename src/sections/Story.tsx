import { BadgeCheck, ClipboardCheck, Nfc, type LucideIcon } from 'lucide-react';
import { BrowserFrame, Reveal, SectionHeading, Shot } from '../components/primitives';
import { useSite, type ShotName } from '../lib/site';

const VISUALS: Record<string, { icon: LucideIcon; shot: ShotName; url: string }> = {
  qualify: { icon: ClipboardCheck, shot: 'resource-people', url: 'attraccess.your-company.com/resources/5/people' },
  tap: { icon: Nfc, shot: 'resource-flows', url: 'attraccess.your-company.com/resources/1/flows' },
  record: { icon: BadgeCheck, shot: 'resource-history', url: 'attraccess.your-company.com/resources/1/history' },
};

export function Story() {
  const { copy } = useSite();
  const s = copy.story;
  return (
    <section id="features" className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow={s.eyebrow} title={s.title} lead={s.lead} />
        <div className="mt-16 space-y-24">
          {s.steps.map((step, index) => {
            const { icon: Icon, shot, url } = VISUALS[step.key];
            return (
              <Reveal key={step.key}>
                <div className={`grid items-center gap-10 lg:grid-cols-2 ${index % 2 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                  <div>
                    <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                      <Icon className="size-6" aria-hidden />
                    </span>
                    <h3 className="mt-6 text-4xl font-bold tracking-tight">
                      <span className="text-muted">{index + 1} ·</span> {step.title}
                    </h3>
                    <p className="mt-4 max-w-md text-lg leading-relaxed text-muted">{step.body}</p>
                  </div>
                  <BrowserFrame url={url}>
                    <Shot name={shot} alt={step.title} />
                  </BrowserFrame>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
