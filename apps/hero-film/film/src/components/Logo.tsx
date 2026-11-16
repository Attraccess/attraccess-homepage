import { Img, staticFile } from 'remotion';
import { WORDMARK } from './wordmark';

// Attraccess lockup per libs/ui/src/AttraccessLogo.tsx: raster mascot + vector wordmark in currentColor.

export const LOGO_RATIO = 7038 / 2112;

export function Logo({ height, color, wordmarkOpacity = 1 }: { height: number; color: string; wordmarkOpacity?: number }) {
  const w = height * LOGO_RATIO;
  const k = height / 2112;
  return (
    <div style={{ position: 'relative', width: w, height }}>
      <Img
        src={staticFile('brand/mascot-hires.png')}
        style={{ position: 'absolute', left: 146 * k, top: 146 * k, width: 911 * k, height: 1821 * k, objectFit: 'contain' }}
      />
      <svg viewBox="0 0 7038 2112" style={{ position: 'absolute', inset: 0, width: w, height, opacity: wordmarkOpacity }}>
        <path d={WORDMARK} fill={color} />
      </svg>
    </div>
  );
}
