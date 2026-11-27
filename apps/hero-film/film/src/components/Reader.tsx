import { Img, staticFile } from 'remotion';
import { C, FONT } from '../theme';
import { useFilm } from '../lib/context';
import { STRINGS } from '../i18n';
import { clamp01, easeInOut, easeOut } from '../lib/time';

// Attractap hardware render (apps/web/public/hardware/attractap.webp, 900×1622) with genuine LVGL
// screen renders composited into the display window.
// Coordinates in the 900×1622 basis (apps/hero-film/assets/reader/hardware/screen-rectangles.json); the 1880×3388
// original is drawn for resolution.
export const READER_PHOTO = { w: 900, h: 1622, screen: { x: 18, y: 126, w: 864, h: 864, r: 22 }, pad: { x: 450, y: 1312 } };

export type ScreenState = { at: number; src: string };

export function Reader({ x, y, width, screens, tapAt }: { x: number; y: number; width: number; screens: ScreenState[]; tapAt: number[] }) {
  const { t } = useFilm();
  const k = width / READER_PHOTO.w;
  const s = READER_PHOTO.screen;
  const ripple = tapAt.map((a) => t - a).filter((d) => d >= 0 && d < 1.4);
  return (
    <div style={{ position: 'absolute', left: x, top: y, width, height: READER_PHOTO.h * k }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 18 * k, boxShadow: '0 50px 120px rgba(0,0,0,0.55)' }} />
      <Img src={staticFile('brand/attractap-hires.png')} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      <div
        style={{
          position: 'absolute',
          left: s.x * k,
          top: s.y * k,
          width: s.w * k,
          height: s.h * k,
          borderRadius: s.r * k,
          overflow: 'hidden',
          background: '#000',
        }}
      >
        {screens.map((st, i) => {
          const next = screens[i + 1];
          const inP = i === 0 ? 1 : clamp01((t - st.at) / 0.18);
          const outP = next ? clamp01((t - next.at) / 0.18) : 0;
          if (t < st.at && i !== 0) return null;
          if (next && outP >= 1) return null;
          return <Img key={i} src={staticFile(st.src)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: inP }} />;
        })}
        {/* Glass */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(125deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 38%, rgba(255,255,255,0) 60%)',
          }}
        />
      </div>
      {ripple.map((d, i) => {
        const p = easeOut(clamp01(d / 1.2));
        return [0, 0.18, 0.36].map((off, j) => {
          const q = easeOut(clamp01((d - off) / 1.0));
          if (q <= 0) return null;
          const r = (80 + 360 * q) * k;
          return (
            <div
              key={`${i}-${j}`}
              style={{
                position: 'absolute',
                left: READER_PHOTO.pad.x * k - r,
                top: READER_PHOTO.pad.y * k - r,
                width: r * 2,
                height: r * 2,
                borderRadius: '50%',
                border: `${3 * k + 1}px solid ${C.accent}`,
                opacity: (1 - q) * 0.9 * (1 - p * 0.2),
              }}
            />
          );
        });
      })}
    </div>
  );
}

// Campus credential: a plain white NFC card, as handed out by the fictional lab.
export function Card({ x, y, width, tapAt, holder }: { x: number; y: number; width: number; tapAt: number; holder: string }) {
  const { t, locale } = useFilm();
  const copy = STRINGS[locale].card;
  const h = width / 1.586;
  const enter = easeOut(clamp01((t - (tapAt - 0.85)) / 0.85));
  const leave = easeInOut(clamp01((t - (tapAt + 0.55)) / 0.75));
  const press = Math.sin(Math.PI * clamp01((t - tapAt + 0.05) / 0.3)) * (t > tapAt - 0.05 ? 1 : 0);
  if (enter <= 0 || leave >= 1) return null;
  const dx = (1 - enter) * 520 + leave * 620;
  const dy = (1 - enter) * 260 + leave * 180;
  const rot = -14 + 10 * enter - 6 * leave;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - width / 2 + dx,
        top: y - h / 2 + dy,
        width,
        height: h,
        transform: `perspective(1400px) rotateZ(${rot}deg) rotateY(${-22 + 18 * enter}deg) rotateX(${14 - 10 * enter}deg) scale(${1 - 0.03 * press})`,
        borderRadius: 18,
        background: 'linear-gradient(145deg, #FFFFFF 0%, #EEF3F3 55%, #DDE6E7 100%)',
        boxShadow: `0 ${30 - 12 * press}px ${70 - 25 * press}px rgba(0,0,0,0.5)`,
        opacity: 1 - clamp01((leave - 0.7) / 0.3),
        fontFamily: FONT,
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: h * 0.2, background: C.waterBlue }} />
      <div style={{ position: 'absolute', left: width * 0.07, top: h * 0.05, color: '#fff', fontSize: h * 0.075, fontWeight: 700, letterSpacing: 0.4 }}>
        {copy.lab}
      </div>
      <div style={{ position: 'absolute', left: width * 0.07, bottom: h * 0.12, color: '#202729', fontSize: h * 0.11, fontWeight: 700 }}>{holder}</div>
      <div style={{ position: 'absolute', left: width * 0.07, bottom: h * 0.06, color: '#5D6B6E', fontSize: h * 0.06 }}>{copy.member}</div>
      <svg viewBox="0 0 24 24" style={{ position: 'absolute', right: width * 0.07, bottom: h * 0.1, width: h * 0.22, height: h * 0.22 }} fill="none" stroke="#256D7B" strokeWidth={1.8} strokeLinecap="round">
        <path d="M6 8.32a7.43 7.43 0 0 1 0 7.36" />
        <path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58" />
        <path d="M12.91 4.1a15.91 15.91 0 0 1 .01 15.8" />
        <path d="M16.37 2a20.16 20.16 0 0 1 0 20" />
      </svg>
    </div>
  );
}
