import { Img, staticFile } from 'remotion';
import { useFilm } from '../lib/context';

export type SeqSpec = { dir: string; frames: number; fps: number; cssW: number; cssH: number };

// Plays a captured UI frame sequence from `start` (s); holds the first/last frame outside its range.
// `skip` drops a captured frame range [a, b) — used to cut a transient UI glitch from a sequence.
export function Seq({ spec, start, width, from = 0, speed = 1, skip }: { spec: SeqSpec; start: number; width: number; from?: number; speed?: number; skip?: [number, number] }) {
  const { t } = useFilm();
  let i = from + Math.floor((t - start) * spec.fps * speed);
  if (skip && i >= skip[0]) i += skip[1] - skip[0];
  i = Math.max(0, Math.min(spec.frames - 1, i));
  const src = `${spec.dir}/${String(i).padStart(6, '0')}.png`;
  return <Img src={staticFile(src)} style={{ display: 'block', width, height: (width * spec.cssH) / spec.cssW }} />;
}
