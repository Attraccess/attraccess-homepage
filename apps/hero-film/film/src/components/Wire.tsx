import { getLength, getPointAtLength } from '@remotion/paths';
import { useMemo } from 'react';
import { C } from '../theme';
import { useFilm } from '../lib/context';
import { clamp01, easeInOut } from '../lib/time';

export type Pt = { x: number; y: number };
export type Dir = 'l' | 'r' | 't' | 'b';
const V: Record<Dir, Pt> = { l: { x: -1, y: 0 }, r: { x: 1, y: 0 }, t: { x: 0, y: -1 }, b: { x: 0, y: 1 } };

export function bezier(a: Pt, da: Dir, b: Pt, db: Dir, tension = 0.5) {
  const dist = Math.hypot(b.x - a.x, b.y - a.y);
  const k = Math.max(80, dist * tension);
  const c1 = { x: a.x + V[da].x * k, y: a.y + V[da].y * k };
  const c2 = { x: b.x + V[db].x * k, y: b.y + V[db].y * k };
  return `M ${a.x} ${a.y} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${b.x} ${b.y}`;
}

export type WireProps = {
  d: string;
  // Pulse travels between these times (s). Omit for a dormant wire.
  run?: [number, number];
  // Additional ambient pulses (start times), each lasting `run` duration.
  echoes?: number[];
  color?: string;
  baseOpacity?: number;
  appear?: number; // time the dormant wire draws itself in
};

export function Wire({ d, run, echoes = [], color = C.accent, baseOpacity = 0.32, appear }: WireProps) {
  const { t, cam } = useFilm();
  const len = useMemo(() => getLength(d), [d]);
  const sw = 2.2 / Math.pow(cam.zoom, 0.75);

  const drawn = appear === undefined ? 1 : clamp01((t - appear) / 0.9);
  const drawE = easeInOut(drawn);

  const pulses: { p: number; life: number }[] = [];
  const runs = run ? [run, ...echoes.map((e) => [e, e + (run[1] - run[0])] as [number, number])] : [];
  for (const [a, b] of runs) {
    if (t < a || t > b + 2.2) continue;
    const p = easeInOut(clamp01((t - a) / (b - a)));
    pulses.push({ p, life: t - a });
  }

  // Lit stroke: follows the primary pulse, then cools back to the dormant colour.
  let lit = 0;
  let litOpacity = 0;
  if (run) {
    const [a, b] = run;
    if (t >= a) {
      lit = easeInOut(clamp01((t - a) / (b - a)));
      litOpacity = t <= b ? 1 : Math.exp(-(t - b) / 1.1);
    }
  }

  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke={C.muted}
        strokeOpacity={baseOpacity}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeDasharray={`${len * drawE} ${len}`}
      />
      {litOpacity > 0.002 && (
        <>
          <path
            d={d}
            fill="none"
            stroke={color}
            strokeOpacity={0.35 * litOpacity}
            strokeWidth={sw * 4}
            strokeLinecap="round"
            strokeDasharray={`${len * lit} ${len}`}
            style={{ filter: `blur(${4 / cam.zoom}px)` }}
          />
          <path
            d={d}
            fill="none"
            stroke={color}
            strokeOpacity={0.95 * litOpacity}
            strokeWidth={sw * 1.15}
            strokeLinecap="round"
            strokeDasharray={`${len * lit} ${len}`}
          />
        </>
      )}
      {pulses.map(({ p, life }, i) => {
        if (p >= 1 && life > 0) {
          // Arrival: brief bloom at the end point.
          return null;
        }
        const pos = p * len;
        const head = getPointAtLength(d, Math.max(0, Math.min(len, pos))) ?? { x: 0, y: 0 };
        const trail = Math.min(pos, 260 / Math.pow(cam.zoom, 0.5));
        const r = 5.5 / Math.pow(cam.zoom, 0.7);
        return (
          <g key={i}>
            {[1, 0.6, 0.3].map((f, j) => (
              <path
                key={j}
                d={d}
                fill="none"
                stroke={j === 0 ? '#E8FBFF' : color}
                strokeOpacity={0.9 * (1 - j * 0.28)}
                strokeWidth={sw * (2.2 - j * 0.5)}
                strokeLinecap="round"
                strokeDasharray={`${trail * f} ${len + 1000}`}
                strokeDashoffset={-(pos - trail * f)}
              />
            ))}
            <circle cx={head.x} cy={head.y} r={r * 3.2} fill={color} opacity={0.28} style={{ filter: `blur(${6 / cam.zoom}px)` }} />
            <circle cx={head.x} cy={head.y} r={r} fill="#F2FDFF" />
          </g>
        );
      })}
    </g>
  );
}
