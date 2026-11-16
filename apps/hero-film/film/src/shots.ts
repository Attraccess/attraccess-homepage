import type { CropSpec } from './components/Crop';
import type { SeqSpec } from './components/Seq';
import type { FlowEdge } from './components/FlowPulses';
import type { Locale } from './i18n';
import { FLOW_START_EDGES, FLOW_START_EDGES_DE } from './flowEdges';

// Real UI captures from the seeded North Campus demo (apps/hero-film/assets/captures, 1600×1000 CSS @2x).
// Regions are CSS px taken from apps/hero-film/assets/captures/manifest.json element bounds.
const CAP = (file: string, x: number, y: number, w: number, h: number): CropSpec => ({
  src: `captures/${file}.png`,
  cssW: 1600,
  cssH: 1000,
  x,
  y,
  w,
  h,
});

const SHOTS_EN = {
  intro: CAP('laser-introduction-history', 544, 314, 512, 330),
  flow: CAP('flow2-start', 340, 235, 1225, 630),
  shelly: CAP('devices-shelly', 444, 172, 772, 57),
  companionLocked: CAP('companion2-locked', 380, 100, 840, 640),
  companionUnlocked: CAP('companion2-unlocked', 380, 100, 840, 640),
  meter: CAP('laser-active', 924, 516, 660, 200),
  billing: CAP('billing-detail', 352, 135, 896, 728),
  history: CAP('history', 292, 302, 1272, 70),
  maintSchedule: CAP('maint2-schedule', 288, 458, 1280, 214),
  maintActive: CAP('maint2-active', 288, 364, 1280, 214),
  maintDone: CAP('maint2-completed', 288, 640, 1280, 214),
  available: CAP('avail2-overview', 288, 180, 632, 485),
} satisfies Record<string, CropSpec>;

export type ShotKey = keyof typeof SHOTS_EN;
type EdgePoints = Omit<FlowEdge, 'at' | 'dur'>;

// Everything the film shows per locale. German crops keep the English aspect ratios so the world layout
// and camera are shared (layout.ts sizes nodes from the English set).
export type ShotSet = {
  shots: Record<ShotKey, CropSpec>;
  // Start form → live timer component sequence (30 fps, 2× DPR); `skip` drops a transient timer glitch.
  seq: SeqSpec & { submitFrame: number; skip?: [number, number] };
  flowEdges: readonly EdgePoints[];
};

export const SHOT_SETS: Record<Locale, ShotSet> = {
  en: {
    shots: SHOTS_EN,
    seq: { dir: 'captures/seq-start', frames: 120, fps: 30, cssW: 672, cssH: 497, submitFrame: 10, skip: [10, 33] },
    flowEdges: FLOW_START_EDGES,
  },
  // German demo instance ("Prototyping-Labor Nordcampus", assets/captures/de). Its layout matches the
  // English captures, so the regions are the same; only the transaction modal sits 10 px lower.
  de: {
    shots: {
      ...(Object.fromEntries(
        Object.entries(SHOTS_EN).map(([k, v]) => [k, { ...v, src: v.src.replace('captures/', 'captures/de/') }]),
      ) as Record<ShotKey, CropSpec>),
      billing: CAP('de/billing-detail', 352, 136, 896, 728),
    },
    seq: { dir: 'captures/de/seq-start', frames: 120, fps: 30, cssW: 672, cssH: 496, submitFrame: 10, skip: [10, 33] },
    flowEdges: FLOW_START_EDGES_DE,
  },
};

// Layout sizing reference.
export const SHOTS = SHOTS_EN;
export const SEQ = { start: SHOT_SETS.en.seq };

// Genuine Attractap Touch LVGL renders (apps/hero-film/assets/reader). The firmware ships German copy only, so the
// untouched production renders are used; 'en' holds capture-only label translations.
export const READER_LANG: 'de' | 'en' = 'de';
const R = (f: string) => `reader/${READER_LANG}/${f}@3x.png`;
export const READER = {
  idle: R('01-idle-ready'),
  checking: R('02-authenticating'),
  started: R('03-session-started'),
  active: R('04-session-active'),
  inUse: R('04b-in-use-lockscreen'),
  ended: R('05-session-ended'),
};
