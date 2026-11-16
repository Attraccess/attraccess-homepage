import { Pause, Play } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { useSite } from '../lib/site';
import { EASE } from './primitives';

// Product film (motion/ in the hero workspace). Both cuts share one 52 s timeline, so switching between
// the 16:9 and the 4:5 phone cut keeps the current time.
const BASE = '/hero-film';
// English files carry no suffix, German ones ".de" (motion/film/scripts/export.sh).
const sourcesFor = (suffix: string) => ({
  landscape: [
    { src: `${BASE}/hero-landscape${suffix}.av1.mp4`, type: 'video/mp4; codecs="av01.0.09M.08"' },
    { src: `${BASE}/hero-landscape${suffix}.vp9.webm`, type: 'video/webm; codecs="vp9"' },
    { src: `${BASE}/hero-landscape${suffix}.h264.mp4`, type: 'video/mp4; codecs="avc1.640032"' },
  ],
  portrait: [
    { src: `${BASE}/hero-portrait${suffix}.av1.mp4`, type: 'video/mp4; codecs="av01.0.09M.08"' },
    { src: `${BASE}/hero-portrait${suffix}.vp9.webm`, type: 'video/webm; codecs="vp9"' },
    { src: `${BASE}/hero-portrait${suffix}.h264.mp4`, type: 'video/mp4; codecs="avc1.640028"' },
  ],
});
const NARROW = '(max-width: 640px)';
const REDUCE = '(prefers-reduced-motion: reduce)';

export function HeroFilm() {
  const { copy, locale } = useSite();
  const f = copy.hero.film;
  const suffix = locale === 'de' ? '.de' : '';
  const frame = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [userPaused, setUserPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const paused = useRef(false);

  useEffect(() => {
    const el = video.current;
    const box = frame.current;
    if (!el || !box) return;
    const narrow = matchMedia(NARROW);
    const reduce = matchMedia(REDUCE);
    // WebKit can keep a stale frame after seeking AV1 (orientation switches seek) and decodes H.264 in
    // hardware everywhere, so Safari/iOS take the H.264 cut first.
    const ua = navigator.userAgent;
    const webkit = /AppleWebKit/.test(ua) && !/Chrome|Chromium|Edg|Firefox|FxiOS/.test(ua);
    let visible = true;
    let current = '';

    const sources = sourcesFor(suffix);
    const pick = () => {
      const list = sources[narrow.matches ? 'portrait' : 'landscape'];
      const ordered = webkit ? [list[2], list[0], list[1]] : list;
      return (ordered.find((s) => el.canPlayType(s.type) === 'probably') ?? ordered.find((s) => el.canPlayType(s.type)) ?? list[2]).src;
    };
    const load = () => {
      const next = pick();
      if (next === current) return;
      const t = el.currentTime || 0;
      current = next;
      el.src = next;
      if (t) el.addEventListener('loadedmetadata', () => (el.currentTime = t % (el.duration || 52)), { once: true });
    };
    const sync = () => {
      if (reduce.matches) {
        el.pause();
        setPlaying(false);
        return;
      }
      load();
      if (!paused.current && visible && !document.hidden) {
        el.play().catch((error: DOMException) => {
          if (error.name !== 'AbortError') setUserPaused(true);
        });
      } else {
        el.pause();
      }
    };

    const onPlaying = () => setPlaying(true);
    el.addEventListener('playing', onPlaying);
    narrow.addEventListener('change', sync);
    reduce.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.15 },
    );
    io.observe(box);
    sync();
    return () => {
      el.removeEventListener('playing', onPlaying);
      narrow.removeEventListener('change', sync);
      reduce.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
      io.disconnect();
    };
  }, [suffix]);

  useEffect(() => {
    paused.current = userPaused;
    const el = video.current;
    if (!el || !el.src) return;
    if (userPaused) el.pause();
    else if (!matchMedia(REDUCE).matches) el.play().catch(() => undefined);
  }, [userPaused]);

  return (
    <motion.figure
      ref={frame}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: EASE, delay: 0.75 }}
      aria-label={f.label}
      className="relative mx-auto mt-16 aspect-[4/5] max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-[#162124] shadow-[0_40px_120px_-20px_rgb(0_0_0/0.6),0_0_140px_-40px_rgb(37_109_123/0.55)] sm:mt-20 sm:aspect-video"
    >
      <picture>
        <source media={NARROW} type="image/avif" srcSet={`${BASE}/poster-portrait${suffix}.avif`} />
        <source media={NARROW} type="image/webp" srcSet={`${BASE}/poster-portrait${suffix}.webp`} />
        <source media={NARROW} type="image/jpeg" srcSet={`${BASE}/poster-portrait${suffix}.jpg`} />
        <source type="image/avif" srcSet={`${BASE}/poster-landscape${suffix}.avif`} />
        <source type="image/webp" srcSet={`${BASE}/poster-landscape${suffix}.webp`} />
        <img src={`${BASE}/poster-landscape${suffix}.jpg`} alt="" width={1920} height={1080} decoding="async" className="absolute inset-0 size-full object-cover" />
      </picture>
      <video
        ref={video}
        muted
        playsInline
        loop
        preload="none"
        disablePictureInPicture
        aria-hidden
        tabIndex={-1}
        className={`absolute inset-0 size-full object-cover transition-opacity duration-700 motion-reduce:hidden ${playing ? 'opacity-100' : 'opacity-0'}`}
      />
      <button
        type="button"
        onClick={() => setUserPaused((p) => !p)}
        aria-pressed={userPaused}
        aria-label={userPaused ? f.play : f.pause}
        className="absolute bottom-3 right-3 z-10 flex size-10 items-center justify-center rounded-full border border-white/20 bg-ink/70 text-white/80 backdrop-blur transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon motion-reduce:hidden"
      >
        {userPaused ? <Play className="size-4" aria-hidden /> : <Pause className="size-4" aria-hidden />}
      </button>
    </motion.figure>
  );
}
