import { useFilm } from '../lib/context';
import { clamp01, easeInOut } from '../lib/time';
import { Crop, type CropSpec } from './Crop';

// Crossfades between captured UI states of the same region (e.g. scheduled → active → completed).
export function Swap({ states, width, fade = 0.35 }: { states: { at: number; spec: CropSpec }[]; width: number; fade?: number }) {
  const { t } = useFilm();
  return (
    <div style={{ position: 'relative' }}>
      <Crop spec={states[0].spec} width={width} />
      {states.slice(1).map((s, i) => {
        const o = easeInOut(clamp01((t - s.at) / fade));
        if (o <= 0) return null;
        return (
          <div key={i} style={{ position: 'absolute', inset: 0, opacity: o }}>
            <Crop spec={s.spec} width={width} />
          </div>
        );
      })}
    </div>
  );
}
