import { AbsoluteFill } from 'remotion';
import { C, FONT, MONO } from './theme';
import { useFilm } from './lib/context';
import { clamp01, easeIn, easeOut } from './lib/time';
import { CAPTIONS } from './timeline';
import { STRINGS } from './i18n';


export function Captions() {
  const { t, portrait, width, locale } = useFilm();
  const s = portrait ? width / 1080 : width / 1920;
  const idx = CAPTIONS.findIndex((x) => t >= x.a - 0.05 && t <= x.b + 0.6);
  const c = idx >= 0 ? { ...CAPTIONS[idx], ...STRINGS[locale].captions[idx] } : undefined;
  const inP = c ? easeOut(clamp01((t - c.a) / 0.55)) : 0;
  const outP = c ? easeIn(clamp01((t - c.b) / 0.45)) : 0;
  const scrim = Math.max(0, ...CAPTIONS.map((x) => clamp01(Math.min((t - x.a + 0.3) / 0.5, (x.b + 0.8 - t) / 0.5))));
  const pad = (portrait ? 64 : 88) * s;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', fontFamily: FONT }}>
      <AbsoluteFill
        style={{
          opacity: scrim,
          background: portrait
            ? 'linear-gradient(0deg, rgba(14,22,24,0.9) 0%, rgba(14,22,24,0.55) 22%, rgba(14,22,24,0) 40%)'
            : 'radial-gradient(ellipse 60% 55% at 0% 100%, rgba(14,22,24,0.88) 0%, rgba(14,22,24,0.5) 45%, rgba(14,22,24,0) 75%)',
        }}
      />
      {c && (
        <div style={{ position: 'absolute', left: pad, bottom: pad * (portrait ? 1.1 : 0.95), right: pad, opacity: 1 - outP }}>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 22 * s, transform: `translateY(${(1 - inP) * 110 + outP * -30}%)` }}>
              {c.i && <span style={{ fontFamily: MONO, color: C.accent, fontSize: 24 * s, letterSpacing: 2 * s }}>{c.i}</span>}
              <span style={{ color: C.text, fontWeight: 760, fontSize: (portrait ? 96 : 84) * s, letterSpacing: -2.6 * s, lineHeight: 1.02 }}>{c.word}</span>
            </div>
          </div>
          <div
            style={{
              marginTop: 10 * s,
              marginLeft: c.i ? 52 * s : 0,
              maxWidth: (portrait ? 900 : 760) * s,
              color: C.muted,
              fontSize: (portrait ? 32 : 27) * s,
              lineHeight: 1.35,
              opacity: easeOut(clamp01((t - c.a - 0.15) / 0.5)),
              transform: `translateY(${(1 - easeOut(clamp01((t - c.a - 0.15) / 0.5))) * 14 * s}px)`,
            }}
          >
            {c.sub}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
}
