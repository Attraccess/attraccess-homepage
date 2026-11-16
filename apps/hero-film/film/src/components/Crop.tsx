import { Img, staticFile } from 'remotion';
import type { CSSProperties } from 'react';

// Shows a CSS-pixel region of a capture. `cssW` is the capture's width in CSS px (image px / dpr).
export type CropSpec = { src: string; cssW: number; cssH: number; x: number; y: number; w: number; h: number };

export function Crop({ spec, width, style }: { spec: CropSpec; width: number; style?: CSSProperties }) {
  const s = width / spec.w;
  return (
    <div style={{ width, height: spec.h * s, overflow: 'hidden', position: 'relative', ...style }}>
      <Img
        src={staticFile(spec.src)}
        style={{
          position: 'absolute',
          left: -spec.x * s,
          top: -spec.y * s,
          width: spec.cssW * s,
          height: spec.cssH * s,
          maxWidth: 'none',
        }}
      />
    </div>
  );
}
