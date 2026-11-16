import type { CamKey } from './lib/camera';

// The film is a sequence of holds. Each screen gets a real hold (slow push-in only) so it can be read;
// the camera travels between holds while the pulse runs along the connecting wire.
type Frame = { x: number; y: number; w: number };

// Captioned beats: frame the node up and to the right so the caption block (bottom-left) stays clear.
// Portrait captions span the full width under the content, so portrait only lifts the framing.
// `p` overrides the portrait framing for nodes too wide for the default (62% of the landscape width).
const cap = (f: Frame, p: { pw?: number; px?: number; py?: number } = {}): Frame & Partial<CamKey> => {
  const pw = p.pw ?? f.w * 0.62;
  return { ...f, x: f.x - f.w * 0.07, y: f.y + f.w * 0.075, pw, px: p.px ?? f.x, py: (p.py ?? f.y) + pw * 0.16 };
};

export const BEATS = {
  reader: { hold: [0, 3.8], frame: { x: -2450, y: 60, w: 2000 } },
  intro: { hold: [5.4, 8.9], frame: cap({ x: -1660, y: -1170, w: 1300 }) },
  session: { hold: [10.5, 14.5], frame: cap({ x: -330, y: -1420, w: 1380 }, { pw: 920, px: -300 }) },
  flow: { hold: [16.1, 21.1], frame: cap({ x: 1003, y: -1052, w: 1900 }, { pw: 1320, px: 1150, py: -1070 }) },
  effects: { hold: [22.6, 26.6], frame: cap({ x: 2300, y: -1250, w: 2150 }, { pw: 1300, px: 2560, py: -1135 }) },
  record: { hold: [28.2, 32.2], frame: cap({ x: 2100, y: 700, w: 1500 }) },
  maintenance: { hold: [33.8, 37.8], frame: cap({ x: 330, y: 1470, w: 1450 }, { pw: 920, px: 105, py: 1500 }) },
  available: { hold: [39.4, 42.4], frame: cap({ x: -1500, y: 1170, w: 1450 }) },
} as const;

export const DURATION_S = 52;

const H = (k: keyof typeof BEATS) => BEATS[k].hold as readonly [number, number];
const run = (from: keyof typeof BEATS, to: keyof typeof BEATS, lead = 0.1): [number, number] => [H(from)[1] + lead, H(to)[0]];

export const T = {
  tap: 1.2,
  readerStarted: 1.8,
  intro: H('intro')[0],
  session: H('session')[0],
  sessionSubmit: H('session')[0] + 1.3,
  flow: H('flow')[0],
  effects: [0, 1, 2].map((i) => H('effects')[0] - 0.3 + i * 0.15),
  // Pulses through the real flow: trigger → If, then the four actions, twice during the hold.
  flowWaves: [H('flow')[0] + 0.25, H('flow')[0] + 2.9],
  sessionEnd: H('record')[0] - 1.4,
  record: H('record')[0],
  maintenance: H('maintenance')[0],
  maintActive: H('maintenance')[0] + 0.9,
  maintDone: H('maintenance')[0] + 2.5,
  available: H('available')[0],
  loopClose: 44.2,
  w: {
    readerIntro: run('reader', 'intro'),
    introSession: run('intro', 'session'),
    sessionFlow: run('session', 'flow'),
    effects: [0, 1, 2].map((i) => [H('flow')[1] + 0.1 + i * 0.15, H('effects')[0] - 0.3 + i * 0.15] as [number, number]),
    meterRecord: run('effects', 'record'),
    recordMaint: run('record', 'maintenance'),
    maintAvail: run('maintenance', 'available'),
    availReader: [42.6, 44.2] as [number, number],
  },
  wide: { out: 45.2, hold: 49.0, back: 51.6 },
  // Ambient pulses circulating the loop during the wide shot.
  echoes: [45.4, 47.4],
  extensions: 44.6,
};

// Camera: each hold is a slow push-in (≈6%); travels arc slightly wider between neighbours.
export function cameraKeys(): CamKey[] {
  const keys: CamKey[] = [];
  const order = Object.keys(BEATS) as (keyof typeof BEATS)[];
  order.forEach((k, i) => {
    const { hold, frame } = BEATS[k];
    const f = frame as Frame & Partial<CamKey>;
    keys.push({ t: hold[0], ...f });
    keys.push({ t: hold[1], ...f, w: f.w * 0.94, pw: f.pw !== undefined ? f.pw * 0.94 : undefined });
    const next = order[i + 1];
    if (next) {
      const n = BEATS[next].frame as Frame & Partial<CamKey>;
      const mid = (hold[1] + BEATS[next].hold[0]) / 2;
      keys.push({
        t: mid,
        x: (f.x + n.x) / 2,
        y: (f.y + n.y) / 2,
        w: Math.max(f.w, n.w) * 1.28,
        px: ((f.px ?? f.x) + (n.px ?? n.x)) / 2,
        py: ((f.py ?? f.y) + (n.py ?? n.y)) / 2,
      });
    }
  });
  const r = BEATS.reader.frame;
  keys.push({ t: 43.3, x: -1300, y: 450, w: 3700 });
  keys.push({ t: T.wide.out, x: 0, y: 0, w: 7300 });
  keys.push({ t: T.wide.hold, x: 40, y: -20, w: 7950 });
  keys.push({ t: 50.4, x: -2150, y: 30, w: 2650 });
  keys.push({ t: T.wide.back, ...r });
  keys.push({ t: DURATION_S, ...r });
  return keys;
}

// Caption timing per hold; the words live in i18n.ts. Copy stays within verified product behaviour.
export const CAPTIONS = [
  { i: '01', a: 0.5, b: H('reader')[1] - 0.2 },
  { i: '02', a: H('intro')[0] - 0.2, b: H('intro')[1] - 0.3 },
  { i: '03', a: H('session')[0] - 0.2, b: H('session')[1] - 0.3 },
  { i: '04', a: H('flow')[0] - 0.2, b: H('effects')[1] - 0.3 },
  { i: '05', a: H('record')[0] - 0.2, b: H('record')[1] - 0.3 },
  { i: '06', a: H('maintenance')[0] - 0.2, b: H('maintenance')[1] - 0.3 },
  { i: '07', a: H('available')[0] - 0.2, b: H('available')[1] - 0.2 },
];
