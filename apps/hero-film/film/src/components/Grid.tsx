import { AbsoluteFill } from 'remotion';
import { C } from '../theme';
import { useFilm } from '../lib/context';

// Flow-editor canvas: dot grid locked to world space, with a coarser grid fading in when zoomed out
// so the texture never turns to noise.
export function Grid() {
  const { cam, width, height } = useFilm();
  const layer = (gap: number, dot: number, opacity: number) => {
    const size = gap * cam.zoom;
    const ox = width / 2 - cam.x * cam.zoom;
    const oy = height / 2 - cam.y * cam.zoom;
    const r = Math.max(0.6, dot * Math.sqrt(cam.zoom));
    return (
      <AbsoluteFill
        style={{
          opacity,
          backgroundImage: `radial-gradient(circle, ${C.border} ${r}px, transparent ${r + 0.6}px)`,
          backgroundSize: `${size}px ${size}px`,
          backgroundPosition: `${ox - size / 2}px ${oy - size / 2}px`,
        }}
      />
    );
  };
  const fine = Math.min(1, Math.max(0, (cam.zoom - 0.32) / 0.35));
  return (
    <AbsoluteFill style={{ backgroundColor: C.page }}>
      {layer(28, 1.15, 0.55 * fine)}
      {layer(140, 1.6, 0.45 * (1 - fine) + 0.12)}
    </AbsoluteFill>
  );
}
