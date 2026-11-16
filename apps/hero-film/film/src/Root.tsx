import { Composition } from 'remotion';
import { Film } from './Film';
import { DURATION, FPS } from './lib/time';

export function Root() {
  return (
    <>
      <Composition id="HeroLandscape" component={Film} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} defaultProps={{ portrait: false }} />
      <Composition id="HeroPortrait" component={Film} durationInFrames={DURATION} fps={FPS} width={1080} height={1350} defaultProps={{ portrait: true }} />
      <Composition id="HeroLandscapeDE" component={Film} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} defaultProps={{ portrait: false, locale: 'de' as const }} />
      <Composition id="HeroPortraitDE" component={Film} durationInFrames={DURATION} fps={FPS} width={1080} height={1350} defaultProps={{ portrait: true, locale: 'de' as const }} />
    </>
  );
}
