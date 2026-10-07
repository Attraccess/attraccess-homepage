// Screen and NFC pad of the Attractap CAD render, measured on the simulator's 500 × 901 canvas
// (apps/attractap/desktop/src/sdl_display.cpp), as fractions of the render's width and height.
export const SCREEN = { left: 10 / 500, top: 70 / 901, width: 480 / 500, height: 480 / 901 };
export const PAD = { left: 126 / 500, top: 613 / 901, width: 248 / 500, height: 235 / 901 };

export const pct = (value: number) => `${value * 100}%`;

export function rectStyle(rect: typeof SCREEN) {
  return { left: pct(rect.left), top: pct(rect.top), width: pct(rect.width), height: pct(rect.height) };
}
