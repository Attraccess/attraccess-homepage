import { Easing, interpolate } from 'remotion';

export const FPS = 60;
export { DURATION_S } from '../timeline';
import { DURATION_S } from '../timeline';
export const DURATION = FPS * DURATION_S;

export const sec = (f: number) => f / FPS;

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

// 0→1 between two times (seconds) with an easing.
export function prog(t: number, a: number, b: number, ease: (n: number) => number = Easing.bezier(0.65, 0, 0.35, 1)) {
  return interpolate(t, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
}

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeIn = Easing.bezier(0.7, 0, 0.84, 0);

// Fast attack, slow decay envelope used for "this node just fired" glows.
export function flash(t: number, at: number, attack = 0.12, decay = 1.6) {
  if (t < at) return 0;
  const d = t - at;
  if (d < attack) return d / attack;
  return Math.exp(-(d - attack) / (decay / 3));
}

export function spring01(t: number, at: number, dur = 0.7) {
  // Critically damped-ish overshoot for snaps.
  const x = clamp01((t - at) / dur);
  if (x <= 0) return 0;
  return 1 - Math.exp(-6 * x) * Math.cos(9 * x * 0.5);
}
