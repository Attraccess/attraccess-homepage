import { motion } from 'motion/react';
import { Monitor, Nfc, Smartphone, Tablet, type LucideIcon } from 'lucide-react';
import { AttractapMock, LaptopFrame, PhoneFrame, TabletFrame } from '../components/DeviceFrames';
import { EASE, SectionHeading, Shot } from '../components/primitives';
import { shotSrc, useSite } from '../lib/site';

const ICONS: Record<string, LucideIcon> = { desktop: Monitor, tablet: Tablet, phone: Smartphone, reader: Nfc };
// Widths roughly follow real-world sizes: a 14" laptop, an 11" tablet, a 6" phone and the Attractap.
// Small screens put the laptop on its own row so nothing shrinks to a thumbnail.
const WIDTHS: Record<string, string> = {
  desktop: 'w-full md:w-[41%]',
  tablet: 'w-[58%] md:w-[30%]',
  phone: 'w-[16%] md:w-[8.5%]',
  reader: 'w-[20%] md:w-[10.5%]',
};

function Device({ device, alt }: { device: string; alt: string }) {
  const { locale, theme } = useSite();
  if (device === 'desktop')
    return (
      <LaptopFrame>
        <Shot name="resources" alt={alt} />
      </LaptopFrame>
    );
  if (device === 'tablet')
    return (
      <TabletFrame>
        <Shot name="resource-laser" alt={alt} />
      </TabletFrame>
    );
  if (device === 'phone')
    return (
      <PhoneFrame>
        <img src={shotSrc('mobile-resource', locale, theme)} alt={alt} loading="lazy" className="block w-full" />
      </PhoneFrame>
    );
  return <AttractapMock className="drop-shadow-[0_24px_30px_rgb(0_0_0/0.3)]" />;
}

export function Devices() {
  const { copy } = useSite();
  const d = copy.devices;
  return (
    <section className="bg-surface-secondary/60 py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow={d.eyebrow} title={d.title} lead={d.lead} />
        <div className="mt-16 flex flex-wrap items-end justify-center gap-x-[2.5%] gap-y-10">
          {d.items.map((item, index) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.8, ease: EASE, delay: index * 0.12 }}
              className={WIDTHS[item.key]}
            >
              <Device device={item.key} alt={item.title} />
            </motion.div>
          ))}
        </div>
        <div className="mx-auto h-px max-w-6xl bg-gradient-to-r from-transparent via-border to-transparent" aria-hidden />
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {d.items.map((item) => {
            const Icon = ICONS[item.key];
            return (
              <div key={item.key}>
                <div className="flex items-center gap-2">
                  <Icon className="size-4 text-accent" aria-hidden />
                  <h3 className="text-lg font-bold">{item.title}</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
