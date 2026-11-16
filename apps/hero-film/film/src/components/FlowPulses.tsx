import { C } from '../theme';
import { useFilm } from '../lib/context';
import { clamp01, easeInOut, flash } from '../lib/time';
import type { CropSpec } from './Crop';

// Pulses along the real React Flow edges of a captured flow canvas. Edge endpoints are CSS px in the
// full capture (apps/hero-film/assets/captures/manifest.json); React Flow's default bezier runs from a source's
// bottom handle to a target's top handle.
export type FlowEdge = { sx: number; sy: number; tx: number; ty: number; at: number; dur?: number };

export function edgePath(e: FlowEdge) {
  const off = Math.max(30, Math.abs(e.ty - e.sy) * 0.5);
  return `M ${e.sx} ${e.sy} C ${e.sx} ${e.sy + off} ${e.tx} ${e.ty - off} ${e.tx} ${e.ty}`;
}

function cubic(e: FlowEdge, p: number) {
  const off = Math.max(30, Math.abs(e.ty - e.sy) * 0.5);
  const P = [
    [e.sx, e.sy],
    [e.sx, e.sy + off],
    [e.tx, e.ty - off],
    [e.tx, e.ty],
  ];
  const u = 1 - p;
  const b = [u * u * u, 3 * u * u * p, 3 * u * p * p, p * p * p];
  return { x: b.reduce((s, k, i) => s + k * P[i][0], 0), y: b.reduce((s, k, i) => s + k * P[i][1], 0) };
}

export function FlowPulses({ crop, width, edges }: { crop: CropSpec; width: number; edges: FlowEdge[] }) {
  const { t } = useFilm();
  const k = width / crop.w;
  return (
    <svg
      style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}
      width={width}
      height={crop.h * k}
      viewBox={`${crop.x} ${crop.y} ${crop.w} ${crop.h}`}
    >
      {edges.map((e, i) => {
        const dur = e.dur ?? 0.55;
        const p = clamp01((t - e.at) / dur);
        const lit = t >= e.at ? (t <= e.at + dur ? 1 : Math.exp(-(t - e.at - dur) / 1.2)) : 0;
        if (lit < 0.01) return null;
        const head = cubic(e, easeInOut(p));
        const land = flash(t, e.at + dur, 0.06, 0.8);
        return (
          <g key={i}>
            <path d={edgePath(e)} fill="none" stroke={C.accent} strokeWidth={2.4} strokeOpacity={0.9 * lit} pathLength={1} strokeDasharray={`${easeInOut(p)} 1`} />
            {p < 1 && <circle cx={head.x} cy={head.y} r={9} fill={C.accent} opacity={0.35} style={{ filter: 'blur(4px)' }} />}
            {p < 1 && <circle cx={head.x} cy={head.y} r={3.6} fill="#F2FDFF" />}
            {land > 0.01 && <circle cx={e.tx} cy={e.ty} r={6 + 14 * (1 - land)} fill="none" stroke={C.accent} strokeWidth={2} opacity={land} />}
          </g>
        );
      })}
    </svg>
  );
}
