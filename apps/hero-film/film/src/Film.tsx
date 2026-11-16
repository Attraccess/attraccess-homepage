import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Activity, BadgeCheck, CircleDollarSign, Monitor, PlugZap, Workflow, Wrench, Gauge, LayoutGrid } from 'lucide-react';
import { C, CAT } from './theme';
import { FilmCtx, type FilmState } from './lib/context';
import { makeCamera, worldTransform, type CamKey } from './lib/camera';
import { FPS, clamp01, easeOut } from './lib/time';
import { Grid } from './components/Grid';
import { Node } from './components/Node';
import { Crop } from './components/Crop';
import { Wire, bezier } from './components/Wire';
import { Reader, Card } from './components/Reader';
import { Logo } from './components/Logo';
import { BOX, LOGO, port } from './layout';
import { READER, SHOT_SETS } from './shots';
import { STRINGS, type Locale } from './i18n';
import { useFilm } from './lib/context';
import { Seq } from './components/Seq';
import { Swap } from './components/Swap';
import { FlowPulses, type FlowEdge } from './components/FlowPulses';
import { T, cameraKeys } from './timeline';
import { Extensions } from './Extensions';
import { Captions } from './Captions';

export const CAMERA: CamKey[] = cameraKeys();

export function Film({ portrait = false, locale = 'en' }: { portrait?: boolean; locale?: Locale }) {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const t = frame / FPS;
  const cam = makeCamera(CAMERA, width, height, portrait)(t);
  const state: FilmState = { t, cam, portrait, width, height, locale };

  return (
    <FilmCtx.Provider value={state}>
      <AbsoluteFill style={{ backgroundColor: C.page, overflow: 'hidden' }}>
        <Grid />
        <AbsoluteFill style={{ transform: worldTransform(cam, width, height), transformOrigin: '0 0' }}>
          <World />
        </AbsoluteFill>
        <Vignette />
        <Captions />
      </AbsoluteFill>
    </FilmCtx.Provider>
  );
}

function World() {
  const { locale } = useFilm();
  const { shots: SHOTS, seq, flowEdges: edges } = SHOT_SETS[locale];
  const N = STRINGS[locale].nodes;
  // Two waves through the real flow: Usage started → If, then If → each action.
  const flowEdges: FlowEdge[] = T.flowWaves.flatMap((w) =>
    edges.map((e, i) => ({ ...e, at: i === 0 ? w : w + 0.55 + (i - 1) * 0.12, dur: i === 0 ? 0.5 : 0.75 })),
  );
  return (
    <>
      <LogoCore />
      <Wires />
      <Extensions />
      <Reader
        x={BOX.reader.x}
        y={BOX.reader.y}
        width={BOX.reader.w}
        tapAt={[T.tap]}
        screens={[
          { at: 0, src: READER.idle },
          { at: T.tap + 0.08, src: READER.checking },
          { at: T.readerStarted, src: READER.started },
          { at: T.intro, src: READER.inUse },
          { at: T.sessionEnd, src: READER.ended },
          { at: T.sessionEnd + 3, src: READER.idle },
        ]}
      />
      <Card x={BOX.reader.x + BOX.reader.w * 0.5} y={BOX.reader.y + BOX.reader.h * 0.81} width={330} tapAt={T.tap} holder="Mia Chen" />

      <Node {...pos('intro')} {...N.intro} icon={BadgeCheck} tint={CAT.session} fireAt={[T.intro]}>
        <Crop spec={SHOTS.intro} width={BOX.intro.w} />
      </Node>
      <Node {...pos('session')} {...N.session} icon={Activity} tint={CAT.session} fireAt={[T.session]}>
        <Seq spec={seq} start={T.sessionSubmit - seq.submitFrame / seq.fps} skip={seq.skip} width={BOX.session.w} />
      </Node>
      <Node {...pos('flow')} {...N.flow} icon={Workflow} tint={CAT.control} fireAt={[T.flow]}>
        <Crop spec={SHOTS.flow} width={BOX.flow.w} />
        <FlowPulses crop={SHOTS.flow} width={BOX.flow.w} edges={flowEdges} />
      </Node>
      <Node {...pos('shelly')} {...N.shelly} icon={PlugZap} tint={CAT.web} fireAt={[T.effects[0]]} handles={['l', 'r']}>
        <Crop spec={SHOTS.shelly} width={BOX.shelly.w} />
      </Node>
      <Node {...pos('companion')} {...N.companion} icon={Monitor} tint={CAT.companion} fireAt={[T.effects[1]]} handles={['l', 'r']}>
        <Swap states={[{ at: 0, spec: SHOTS.companionLocked }, { at: T.effects[1] + 0.15, spec: SHOTS.companionUnlocked }]} width={BOX.companion.w} />
      </Node>
      <Node {...pos('meter')} {...N.meter} icon={Gauge} tint={CAT.billing} fireAt={[T.effects[2]]} handles={['l', 'b']}>
        <Crop spec={SHOTS.meter} width={BOX.meter.w} />
      </Node>
      <Node {...pos('record')} {...N.record} icon={CircleDollarSign} tint={CAT.billing} fireAt={[T.record]} handles={['t', 'l']}>
        <Crop spec={SHOTS.billing} width={BOX.record.w} />
      </Node>
      <Node {...pos('maintenance')} {...N.maintenance} icon={Wrench} tint={CAT.health} fireAt={[T.maintenance, T.maintActive, T.maintDone]}>
        <Swap
          states={[
            { at: 0, spec: SHOTS.maintSchedule },
            { at: T.maintActive, spec: SHOTS.maintActive },
            { at: T.maintDone, spec: SHOTS.maintDone },
          ]}
          width={BOX.maintenance.w}
        />
      </Node>
      <Node {...pos('available')} {...N.available} icon={LayoutGrid} tint={CAT.session} fireAt={[T.available]} handles={['l', 'r']}>
        <Crop spec={SHOTS.available} width={BOX.available.w} />
      </Node>
    </>
  );
}

const pos = (id: keyof typeof BOX) => ({ x: BOX[id].x, y: BOX[id].y, w: BOX[id].w });

function Wires() {
  const W = [
    { d: bezier(port('reader', 'r', 0.3), 'r', port('intro', 'l'), 'l', 0.55), run: T.w.readerIntro },
    { d: bezier(port('intro', 'r'), 'r', port('session', 'l'), 'l'), run: T.w.introSession },
    { d: bezier(port('session', 'r'), 'r', port('flow', 'l'), 'l'), run: T.w.sessionFlow },
    { d: bezier(port('flow', 'r'), 'r', port('shelly', 'l'), 'l'), run: T.w.effects[0] },
    { d: bezier(port('flow', 'r'), 'r', port('companion', 'l'), 'l'), run: T.w.effects[1] },
    { d: bezier(port('flow', 'r'), 'r', port('meter', 'l'), 'l'), run: T.w.effects[2] },
    { d: bezier(port('meter', 'b'), 'b', port('record', 't', 0.75), 't'), run: T.w.meterRecord },
    { d: bezier(port('record', 'l'), 'l', port('maintenance', 'r'), 'r'), run: T.w.recordMaint },
    { d: bezier(port('maintenance', 'l'), 'l', port('available', 'r'), 'r'), run: T.w.maintAvail },
    { d: bezier(port('available', 'l'), 'l', port('reader', 'b'), 'b', 0.6), run: T.w.availReader },
  ];
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={1} height={1}>
      {W.map((w, i) => (
        <Wire key={i} d={w.d} run={w.run} echoes={T.echoes.map((e) => e + i * 0.32)} />
      ))}
    </svg>
  );
}

function LogoCore() {
  const w = LOGO.h * (7038 / 2112);
  return (
    <div style={{ position: 'absolute', left: LOGO.cx - w / 2, top: LOGO.cy - LOGO.h / 2 }}>
      <div
        style={{
          position: 'absolute',
          left: -LOGO.h * 0.6,
          top: -LOGO.h * 0.9,
          width: LOGO.h * 2.2,
          height: LOGO.h * 2.8,
          background: `radial-gradient(closest-side, rgba(37,109,123,0.38), rgba(37,109,123,0))`,
        }}
      />
      <Logo height={LOGO.h} color={C.text} />
    </div>
  );
}

function Vignette() {
  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(ellipse 75% 70% at 50% 50%, rgba(22,33,36,0) 55%, rgba(12,20,22,0.55) 100%)',
        pointerEvents: 'none',
      }}
    />
  );
}

export { clamp01, easeOut };
