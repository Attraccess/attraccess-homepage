// Camera: keyframes frame a world rectangle (centre + visible world width for the landscape cut).
// Channels are interpolated with monotone cubic splines (no overshoot) and zoom is interpolated in log
// space so dollies feel linear. Endpoints have zero velocity, so the loop seam is still.
export type CamKey = { t: number; x: number; y: number; w: number; pw?: number; px?: number; py?: number };
export type Cam = { x: number; y: number; zoom: number };

function monotone(ts: number[], vs: number[]) {
  const n = ts.length;
  const d: number[] = [];
  for (let i = 0; i < n - 1; i++) d.push((vs[i + 1] - vs[i]) / (ts[i + 1] - ts[i]));
  const m: number[] = new Array(n).fill(0);
  for (let i = 1; i < n - 1; i++) {
    if (d[i - 1] * d[i] <= 0) m[i] = 0;
    else {
      const w1 = 2 * (ts[i + 1] - ts[i]) + (ts[i] - ts[i - 1]);
      const w2 = ts[i + 1] - ts[i] + 2 * (ts[i] - ts[i - 1]);
      m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i]);
    }
  }
  return (t: number) => {
    if (t <= ts[0]) return vs[0];
    if (t >= ts[n - 1]) return vs[n - 1];
    let i = 0;
    while (t > ts[i + 1]) i++;
    const h = ts[i + 1] - ts[i];
    const s = (t - ts[i]) / h;
    const s2 = s * s;
    const s3 = s2 * s;
    return (
      (2 * s3 - 3 * s2 + 1) * vs[i] + (s3 - 2 * s2 + s) * h * m[i] + (-2 * s3 + 3 * s2) * vs[i + 1] + (s3 - s2) * h * m[i + 1]
    );
  };
}

export function makeCamera(keys: CamKey[], width: number, height: number, portrait: boolean) {
  const ts = keys.map((k) => k.t);
  const fx = monotone(ts, keys.map((k) => (portrait && k.px !== undefined ? k.px : k.x)));
  const fy = monotone(ts, keys.map((k) => (portrait && k.py !== undefined ? k.py : k.y)));
  const fw = monotone(
    ts,
    keys.map((k) => Math.log(portrait ? (k.pw ?? k.w * 0.62) : k.w)),
  );
  return (t: number): Cam => {
    const w = Math.exp(fw(t));
    return { x: fx(t), y: fy(t), zoom: width / w };
  };
}

export function worldTransform(cam: Cam, width: number, height: number) {
  return `translate(${width / 2}px, ${height / 2}px) scale(${cam.zoom}) translate(${-cam.x}px, ${-cam.y}px)`;
}
