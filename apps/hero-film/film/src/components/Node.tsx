import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { C, FONT, MONO } from '../theme';
import { useFilm } from '../lib/context';
import { flash } from '../lib/time';

export type NodeProps = {
  x: number;
  y: number;
  w: number;
  title: string;
  meta?: string;
  icon: LucideIcon;
  tint: string;
  fireAt?: number[];
  children?: ReactNode;
  handles?: ('l' | 'r' | 't' | 'b')[];
  opacity?: number;
  scale?: number;
};

// A product UI fragment presented in the flow editor's node language: category chip, bold title,
// thin border, connection handles. When a pulse arrives (`fireAt`) the border lights in the accent.
export function Node({ x, y, w, title, meta, icon: Icon, tint, fireAt = [], children, handles = ['l', 'r'], opacity = 1, scale = 1 }: NodeProps) {
  const { t } = useFilm();
  const glow = Math.max(0, ...fireAt.map((a) => flash(t, a, 0.1, 2.4)));
  const hs = 11;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: 'center',
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: -2,
          borderRadius: 8,
          boxShadow: `0 0 ${40 + 60 * glow}px ${8 * glow}px rgba(130,196,206,${0.32 * glow}), 0 30px 80px rgba(0,0,0,0.45)`,
        }}
      />
      <div
        style={{
          position: 'relative',
          background: C.surface,
          borderRadius: 6,
          border: `1.5px solid ${mix(C.border, C.accent, glow)}`,
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: `1px solid ${C.separator}` }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 4,
              background: hexA(tint, 0.16),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={18} color={tint} strokeWidth={2} />
          </div>
          <div style={{ color: C.text, fontWeight: 650, fontSize: 17, letterSpacing: -0.1, flex: 1, whiteSpace: 'nowrap' }}>{title}</div>
          {meta && <div style={{ color: C.muted, fontFamily: MONO, fontSize: 13 }}>{meta}</div>}
        </div>
        <div style={{ position: 'relative' }}>{children}</div>
      </div>
      {handles.map((h) => (
        <div
          key={h}
          style={{
            position: 'absolute',
            width: hs,
            height: hs,
            borderRadius: '50%',
            background: mix('#DCE6E7', C.accentHover, glow),
            border: `2px solid ${C.page}`,
            ...(h === 'l' && { left: -hs / 2 - 1, top: '50%', marginTop: -hs / 2 }),
            ...(h === 'r' && { right: -hs / 2 - 1, top: '50%', marginTop: -hs / 2 }),
            ...(h === 't' && { top: -hs / 2 - 1, left: '50%', marginLeft: -hs / 2 }),
            ...(h === 'b' && { bottom: -hs / 2 - 1, left: '50%', marginLeft: -hs / 2 }),
          }}
        />
      ))}
    </div>
  );
}

export function hexA(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

export function mix(a: string, b: string, k: number) {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (s: number) => Math.round(((pa >> s) & 255) * (1 - k) + ((pb >> s) & 255) * k);
  return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
}
