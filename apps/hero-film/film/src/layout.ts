import type { CropSpec } from './components/Crop';
import type { Dir, Pt } from './components/Wire';
import { READER_PHOTO } from './components/Reader';
import { SEQ, SHOTS } from './shots';

// World layout: the closed loop runs clockwise around the logo at the origin.
// 1 world unit = 1 CSS px of the product UI.
export const HEADER_H = 58;

export type Box = { x: number; y: number; w: number; h: number };

const node = (cx: number, cy: number, w: number, spec: { w: number; h: number } | CropSpec): Box => {
  const h = HEADER_H + (spec.h * w) / spec.w;
  return { x: cx - w / 2, y: cy - h / 2, w, h };
};

const READER_W = 560;
export const READER_BOX: Box = { x: -2450 - READER_W / 2, y: 60 - (READER_PHOTO.h * READER_W) / READER_PHOTO.w / 2, w: READER_W, h: (READER_PHOTO.h * READER_W) / READER_PHOTO.w };

export const BOX = {
  reader: READER_BOX,
  intro: node(-1650, -1180, 640, SHOTS.intro),
  session: node(-300, -1420, 760, { w: SEQ.start.cssW, h: SEQ.start.cssH }),
  flow: node(1150, -1050, 1180, SHOTS.flow),
  shelly: node(2600, -1600, 760, SHOTS.shelly),
  companion: node(2600, -1180, 620, SHOTS.companionLocked),
  meter: node(2600, -660, 700, SHOTS.meter),
  record: node(2100, 700, 820, SHOTS.billing),
  maintenance: node(300, 1500, 1200, SHOTS.maintSchedule),
  available: node(-1550, 1250, 700, SHOTS.available),
};

export type NodeId = keyof typeof BOX;

export function port(id: NodeId, side: Dir, along = 0.5): Pt {
  const b = BOX[id];
  switch (side) {
    case 'l':
      return { x: b.x, y: b.y + b.h * along };
    case 'r':
      return { x: b.x + b.w, y: b.y + b.h * along };
    case 't':
      return { x: b.x + b.w * along, y: b.y };
    case 'b':
      return { x: b.x + b.w * along, y: b.y + b.h };
  }
}

export const LOGO = { cx: 0, cy: 0, h: 620 };
