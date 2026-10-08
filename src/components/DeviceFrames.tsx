import type { ReactNode } from 'react';
import { SCREEN, rectStyle } from '../lib/device';
import { useSite } from '../lib/site';

/* Device frames with thin, true-to-life bezels. All sizes are in container-query units (cqw),
   so a frame keeps its proportions at any width. */
const BEZEL = 'bg-[#16191b] ring-1 ring-black/50 dark:ring-white/10';

export function LaptopFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`@container ${className}`}>
      <div className={`relative mx-[7cqw] rounded-t-[2.2cqw] p-[1.3cqw] pb-[2cqw] ${BEZEL}`}>
        <span className="absolute left-1/2 top-[0.45cqw] size-[0.5cqw] -translate-x-1/2 rounded-full bg-white/15" aria-hidden />
        <div className="overflow-hidden rounded-[0.4cqw] bg-black">{children}</div>
      </div>
      <div className="relative h-[2.2cqw] rounded-b-[1.4cqw] rounded-t-[0.3cqw] bg-gradient-to-b from-[#dfe3e6] to-[#a7aeb3] shadow-[0_2cqw_3cqw_-1.5cqw_rgb(0_0_0/0.5)] dark:from-[#5a6166] dark:to-[#2c3236]">
        <span className="absolute left-1/2 top-0 h-[0.8cqw] w-[13cqw] -translate-x-1/2 rounded-b-[0.8cqw] bg-black/15" aria-hidden />
      </div>
    </div>
  );
}

export function TabletFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`@container ${className}`}>
      <div className={`relative rounded-[4cqw] p-[2.4cqw] shadow-float ${BEZEL}`}>
        <span className="absolute left-1/2 top-[0.9cqw] size-[0.7cqw] -translate-x-1/2 rounded-full bg-white/15" aria-hidden />
        <div className="overflow-hidden rounded-[1.6cqw] bg-black">{children}</div>
      </div>
    </div>
  );
}

export function PhoneFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`@container ${className}`}>
      <div className={`rounded-[15cqw] p-[3cqw] shadow-float ${BEZEL}`}>
        <div className="relative overflow-hidden rounded-[12cqw] bg-black">
          <span className="absolute left-1/2 top-[2.6cqw] z-10 h-[7.5cqw] w-[27cqw] -translate-x-1/2 rounded-full bg-black" aria-hidden />
          {children}
        </div>
      </div>
    </div>
  );
}

export function MonitorFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`@container ${className}`}>
      <div className={`rounded-[1.2cqw] p-[1.1cqw] pb-[1.6cqw] shadow-float ${BEZEL}`}>
        <div className="relative overflow-hidden rounded-[0.3cqw] bg-black">{children}</div>
      </div>
      <div className="mx-auto h-[6cqw] w-[9cqw] bg-gradient-to-b from-[#7d858a] to-[#b9c0c4] dark:from-[#2c3236] dark:to-[#4a5156]" aria-hidden />
      <div className="mx-auto h-[1.2cqw] w-[28cqw] rounded-t-[0.8cqw] bg-gradient-to-b from-[#c9cfd2] to-[#8e969b] dark:from-[#4a5156] dark:to-[#2c3236]" aria-hidden />
    </div>
  );
}

/** The Attractap Touch render with its lock screen lit up. */
export function AttractapMock({ className = '' }: { className?: string }) {
  const { copy } = useSite();
  return (
    <div className={`@container relative ${className}`}>
      <img src="/hardware/attractap.webp" alt="Attractap Touch" className="block w-full" draggable={false} loading="lazy" />
      <div className="absolute overflow-hidden rounded-[2.5%] bg-fw-bg font-device text-fw-text" style={rectStyle(SCREEN)}>
        <img src="/brand/neon-wallpaper.webp" alt="" className="absolute inset-0 size-full object-cover object-[0%_70%]" loading="lazy" />
        <div className="relative px-[8%] pt-[24%] text-[9cqw] leading-tight">
          <div>{copy.demo.device.lock[0]}</div>
          <div className="pl-[30%]">{copy.demo.device.lock[1]}</div>
        </div>
      </div>
    </div>
  );
}
