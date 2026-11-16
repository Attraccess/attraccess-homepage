import type { LucideIcon } from 'lucide-react';
import { Boxes, Cable, Fingerprint, Gauge, Globe, MonitorSmartphone, Nfc, PlugZap, Rabbit, Webhook, CreditCard } from 'lucide-react';
import { C, CAT, FONT } from './theme';
import { useFilm } from './lib/context';
import { clamp01, easeOut, spring01 } from './lib/time';
import { Wire, bezier, type Dir, type Pt } from './components/Wire';
import { hexA } from './components/Node';
import { port, type NodeId } from './layout';
import { T } from './timeline';
import { STRINGS } from './i18n';

type Ext = { label: string; key: string; icon: LucideIcon; tint: string; at: Pt; side: Dir; to: NodeId; toSide: Dir; along?: number };

// Integration points, each wired to the part of the loop it extends. Sized to read in the wide shot.
export const EXTS: Ext[] = [
  { label: 'OIDC · SAML', key: 'sso', icon: Fingerprint, tint: CAT.session, at: { x: -2700, y: -1830 }, side: 'b', to: 'intro', toSide: 't' },
  { label: 'WAGO CC100', key: 'wago', icon: Cable, tint: CAT.hardware, at: { x: 450, y: -1990 }, side: 'b', to: 'flow', toSide: 't', along: 0.3 },
  { label: 'Shelly', key: 'shelly', icon: PlugZap, tint: CAT.hardware, at: { x: 3180, y: -1960 }, side: 'l', to: 'shelly', toSide: 'r' },
  { label: 'RabbitMQ', key: 'rabbitmq', icon: Rabbit, tint: CAT.messages, at: { x: 1650, y: -1990 }, side: 'b', to: 'flow', toSide: 't', along: 0.75 },
  { label: 'Companion', key: 'companion', icon: MonitorSmartphone, tint: CAT.companion, at: { x: 3180, y: -1180 }, side: 'l', to: 'companion', toSide: 'r' },
  { label: 'HTTP · Webhooks', key: 'http', icon: Webhook, tint: CAT.web, at: { x: 3180, y: 950 }, side: 'l', to: 'record', toSide: 'r' },
  { label: 'SumUp', key: 'sumup', icon: CreditCard, tint: CAT.billing, at: { x: 2450, y: 1830 }, side: 't', to: 'record', toSide: 'b' },
  { label: 'Prometheus · Grafana', key: 'metrics', icon: Gauge, tint: CAT.health, at: { x: -150, y: 1990 }, side: 't', to: 'maintenance', toSide: 'b' },
  { label: 'REST · OpenAPI', key: 'api', icon: Globe, tint: CAT.web, at: { x: -2100, y: 1900 }, side: 't', to: 'available', toSide: 'b' },
  { label: 'Attractap', key: 'attractap', icon: Nfc, tint: CAT.hardware, at: { x: -3180, y: 1200 }, side: 'r', to: 'reader', toSide: 'l' },
  { label: 'Plugins', key: 'plugins', icon: Boxes, tint: CAT.control, at: { x: -3180, y: -800 }, side: 'r', to: 'reader', toSide: 't' },
];

const CHIP = { w: 820, h: 190 };

function anchor(e: Ext): Pt {
  const { x, y } = e.at;
  switch (e.side) {
    case 'l':
      return { x: x - CHIP.w / 2, y };
    case 'r':
      return { x: x + CHIP.w / 2, y };
    case 't':
      return { x, y: y - CHIP.h / 2 };
    case 'b':
      return { x, y: y + CHIP.h / 2 };
  }
}

export function Extensions() {
  const { t, locale } = useFilm();
  return (
    <>
      <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
        {EXTS.map((e, i) => {
          const at = T.extensions + i * 0.17;
          const run: [number, number] = [at + 0.25, at + 1.15];
          const toPort = port(e.to, e.toSide, e.along ?? (e.to === 'reader' && e.toSide === 'l' ? 0.7 : 0.5));
          return <Wire key={i} d={bezier(anchor(e), e.side, toPort, e.toSide, 0.45)} appear={at} run={run} baseOpacity={0.28} />;
        })}
      </svg>
      {EXTS.map((e, i) => {
        const at = T.extensions + i * 0.17;
        const s = spring01(t, at, 0.8);
        const o = easeOut(clamp01((t - at) / 0.35));
        if (o <= 0) return null;
        const Icon = e.icon;
        return (
          <div
            key={e.label}
            style={{
              position: 'absolute',
              left: e.at.x - CHIP.w / 2,
              top: e.at.y - CHIP.h / 2,
              width: CHIP.w,
              height: CHIP.h,
              opacity: o,
              transform: `scale(${0.7 + 0.3 * s})`,
              display: 'flex',
              alignItems: 'center',
              gap: 36,
              padding: '0 44px',
              boxSizing: 'border-box',
              background: C.surface,
              border: `4px solid ${C.border}`,
              borderRadius: 18,
              fontFamily: FONT,
              boxShadow: '0 40px 90px rgba(0,0,0,0.45)',
            }}
          >
            <div style={{ width: 104, height: 104, borderRadius: 12, background: hexA(e.tint, 0.16), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={60} color={e.tint} strokeWidth={2} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ color: C.text, fontSize: 60, fontWeight: 700, letterSpacing: -1, whiteSpace: 'nowrap' }}>{e.label}</div>
              <div style={{ color: C.muted, fontSize: 38, marginTop: 4, whiteSpace: 'nowrap' }}>{STRINGS[locale].chips[e.key]}</div>
            </div>
          </div>
        );
      })}
    </>
  );
}
