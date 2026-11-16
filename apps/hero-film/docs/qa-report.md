# Attraccess hero embed technical QA

Tested 2026-10-14T16:31:16.877Z. Scope: `apps/hero-film/preview/index.html` and its existing media. Only that embed file was changed; QA scripts, evidence and screenshots are in `apps/hero-film/out/qa/`. No changes were made to `apps/hero-film/film/` or `apps/hero-film/out/web/`.

## Result

QA is complete, with six embed fixes and one open WebKit AV1 seek/rendering defect. Chromium and Firefox pass the requested playback, loop, reduced-motion, controls and framing checks. WebKit passes autoplay, API timecode preservation, reduced motion, controls and framing; its AV1 playback can retain a pre-seek frame while `currentTime` advances. This also reproduces with a plain video element outside the embed. Do not interpret API-only seek assertions as verified rendered timecode in WebKit.

## Environment and method

- macOS 26.6.2 (25G83), Apple Silicon; Node 24.21.0; Playwright 1.64.1. Headless engines with default autoplay policy; no autoplay-enabling launch flags.
- chromium: 156.0.8078.4, webkit: 27.2, firefox: 157.0. WebKit and Firefox were installed for this QA run; Chromium was installed to match the Playwright version.
- Static server: `http-server` with caching disabled at `http://127.0.0.1:4610`. The main harness starts the same server at port 4612 and instruments response bodies for byte accounting. No remote services or live hardware were used.
- Confirmed actual `Range: bytes=0-1` response: `206 Partial Content`, `Accept-Ranges: bytes`, `Content-Range: bytes 0-1/5213056`, `Content-Length: 2`. WebKit also issued successful two-byte AV1 probes followed by ranged media requests.
- Fresh contexts at 1440×900 and 390×844. The 390px source/autoplay run enables `hasTouch`; Chromium/WebKit also use `isMobile`. Firefox does not support Playwright `isMobile`, so it uses the mobile CSS viewport plus touch. Screenshot matrix uses CSS viewports and device scale 1.
- First-load network measurement: five seconds after playback starts, before seeks/resizes; all selected video bytes had arrived on localhost. Totals count actual HTTP response body bytes written by the server, including range probes, HTML and posters; they exclude HTTP headers/TLS. These are local cold-context measurements, not throttled production benchmarks.
- Poster-before-playback test delays video responses by one second, verifies the loaded picture with video opacity zero, then compares `.film` bounds before and after the playing fade. Main screenshots are full-page PNGs. Chromium/Firefox frame-controlled recaptures record presented media timestamps separately.
- Visibility: opening/activating a second headless tab left the first tab `visible` in all engines. Native tab hiding could not be verified. The `visibilitychange` listener was separately exercised using a temporary `document.hidden` override, then restored.

## Check matrix

PASS = observed passing. OPEN = a reproduced issue remains. N/T = not testable in this environment.

| Check | Chromium | WebKit | Firefox |
|---|---|---|---|
| Muted autoplay, no interaction, 1440×900 / 390×844 | PASS | PASS | PASS |
| Poster loaded/visible before video; stable film box | PASS | PASS | PASS |
| Correct landscape ≥641px / portrait ≤640px source | PASS | PASS | PASS |
| Resize 640 ↔ 641 and 390 ↔ 1440: currentTime ±0.5s, playback continues | PASS | PASS API; see OPEN below | PASS |
| Seeked AV1 image agrees with currentTime | PASS | OPEN: stale pre-seek image | PASS |
| Seek 51.5s, currentTime wraps near 0, playing, no ended event | PASS | PASS API | PASS |
| Loop presented-frame continuity after seek | PASS | OPEN: stale seek frames observed | PASS |
| Seam screenshots 51.9s / 0.1s nearly match | PASS | OPEN: time-aligned frames not verified | PASS |
| Initial reduced motion: paused/hidden, correct poster, zero video bytes | PASS | PASS | PASS |
| Runtime reduced motion on/off and resize while reduced | PASS after fix | PASS after fix | PASS after fix |
| Visible button, keyboard Space/Enter, focus, labels and aria-pressed | PASS | PASS | PASS |
| User pause persists over time, resize, reduced-motion roundtrip | PASS | PASS | PASS |
| Offscreen pause / onscreen resume | PASS | PASS | PASS |
| Native hidden-tab pause / resume | N/T | N/T | N/T |
| Simulated hidden-state listener pause / resume | PASS | PASS | PASS |
| No console errors or uncaught page errors | PASS | PASS | PASS |
| All six video files: no audio stream, 52s duration | PASS | PASS | PASS |
| Posters load, single selected poster on initial load | PASS after fix | PASS after fix | PASS after fix |
| Six responsive sizes: aspect ratio, no overflow, rounded clipping | PASS | PASS | PASS |
| Forced VP9 / H.264 fallback, both cuts | PASS | PASS | PASS |
| Denied-autoplay one-click recovery / portrait JPEG-only fallback | PASS after fix | PASS after fix | PASS after fix |

## Playback, framing and loop evidence

All engines select `media/hero-landscape.av1.mp4` at wide widths and `media/hero-portrait.av1.mp4` at narrow widths in this environment. Decoded dimensions are 1920×1080 / 1080×1350. Forced capability tests suppress higher-priority types but retain each browser’s native `canPlayType` result for the selected VP9 or H.264 fallback; all twelve fallback playback cases pass.

| Browser | Maximum measured resize timecode delta | Film bounds before/after fade at 1440×900 | Layout-shift entries |
|---|---:|---|---|
| chromium | 0.018s | x=80, y=631.578, 1280×720; unchanged | [] |
| webkit | 0.088s | x=80, y=631.578, 1280×720; unchanged | API unavailable; bounds stable |
| firefox | 0.371s | x=80, y=633.600, 1280×720; unchanged | API unavailable; bounds stable |

Film frame sizes at the requested viewports are 1280×720 (1920 and 1440 wide), 976×549 (1024), 720×405 (768), 358×447.5 (390), and 328×410 (360), with subpixel rounding in Firefox. Wide frames retain a 10px radius; narrow frames retain 8px. All have `overflow: hidden`; no document horizontal scrollbar. The film begins around y=632px on desktop, so the pause button is reached by scrolling or keyboard focus. This is the existing preview layout.

Loop probes observe `currentTime` wrapping and continued playback, with zero `ended` events. Chromium emits a short `waiting` / `playing` pair at the wrap; no sustained stall was observed. In the independent timing probe Chromium’s largest presented-frame gap is 50ms; Firefox’s is under 47ms. Browser frame metadata differs: Firefox may return monotonic media timestamps beyond 52s, so wrap detection uses the element’s `currentTime` sampled with requestAnimationFrame. WebKit can return an old decoded frame immediately after seeking, which is recorded rather than treated as a valid tail frame.


| Browser / width | Seam screenshot SSIM (1 = identical) |
|---|---:|
| chromium-1440 | 0.983886 |
| chromium-390 | 0.970196 |
| firefox-1440 | 0.985073 |
| firefox-390 | 0.974637 |
| webkit-1440 | 0.968006 |
| webkit-390 | 1.000000 |

Chromium/Firefox seam images were visually inspected as well as compared quantitatively: minor grid/edge and compression differences remain, with continuous reader framing. WebKit images are diagnostic captures with unverified presented timecodes; their SSIM does not establish a passing seam. Chromium/Firefox screenshot times are recorded in `final-capture-times.json`. WebKit responsive images show the stale post-seek state; their layout assertions remain valid, but they are not claimed to show true t=10s.

Independent FFmpeg extraction of the AV1 exports at 51.9s and 0.1s gives SSIM 0.982427 (landscape) and 0.973730 (portrait), confirming that the encoded film seam closely matches. This does not resolve the WebKit presented-frame verification issue. See `reference-seam-comparison.json` and the four reference PNGs.

## Byte budgets

No product budget was supplied. Values below are observed response payloads, in bytes (decimal MB). One full video is fetched with `preload=auto` on this fast local connection.

| Browser | Viewport | Selected video bytes | Poster bytes | HTML bytes | First-load total |
|---|---|---:|---:|---:|---:|
| chromium | 1440×900 | 4,330,946 | 41,561 | 10,295 | 4,382,802 (4.383 MB) |
| chromium | 390×844 | 3,285,373 | 28,125 | 10,295 | 3,323,793 (3.324 MB) |
| webkit | 1440×900 | 4,330,948 | 41,561 | 10,295 | 4,382,804 (4.383 MB) |
| webkit | 390×844 | 3,285,375 | 28,125 | 10,295 | 3,323,795 (3.324 MB) |
| firefox | 1440×900 | 4,330,946 | 41,561 | 10,295 | 4,382,802 (4.383 MB) |
| firefox | 390×844 | 3,285,373 | 28,125 | 10,295 | 3,323,793 (3.324 MB) |

WebKit totals include a two-byte range probe. Normal initial loads now request only the selected AVIF poster; before the fix all engines requested an additional WebP (60,094 landscape / 37,584 portrait bytes). The HTML grew by 322 bytes, so net body savings are 59,772 / 37,262 bytes per cold load.

| Browser | Reduced-motion viewport | Video requests / bytes | Total initial body bytes |
|---|---|---|---:|
| chromium | 1440px | 0 / 0 | 51,856 |
| chromium | 390px | 0 / 0 | 38,420 |
| webkit | 1440px | 0 / 0 | 51,856 |
| webkit | 390px | 0 / 0 | 38,420 |
| firefox | 1440px | 0 / 0 | 51,856 |
| firefox | 390px | 0 / 0 | 38,420 |

Runtime enabling reduced motion pauses and hides the video. Resizing while reduced requests the correct poster only; no new video request is made. Data already transferred before the preference change cannot be undone; this check does not claim to cancel already buffered bytes.

| Export | Landscape bytes | Portrait bytes |
|---|---:|---:|
| AV1 | 4,330,946 | 3,285,373 |
| VP9 | 4,731,683 | 3,519,629 |
| H.264 | 5,213,056 | 3,661,373 |

## Bugs found and every embed change

1. **Reduced-motion resize downloaded video.** Before: enable reduced motion after playback, cross 640px, and the other video cut is requested despite being hidden. The breakpoint listener now uses `sync()`; source loading runs only after its reduced-motion early return. Each normal sync checks the source, preserving orientation selection when motion is re-enabled. Reproduced and retested in all engines.
2. **Denied autoplay required two clicks and exposed the wrong accessible state.** Before: a rejected `play()` left the label as “Pause film”, and the first click merely set the user-paused flag. Failed play now sets the paused state and synchronizes icon, label and aria-pressed. AbortError and cancellations caused by visibility/preference changes are ignored. A simulated NotAllowedError now exposes “Play film” / pressed=true, and one keyboard/click activation starts playback in all engines.
3. **Duplicate poster download.** Preloads targeted WebP while picture selected AVIF. They now preload the matching AVIF with a MIME type, so unsupported browsers can skip that preload and select their fallback normally. All initial-load network records show one poster.
4. **Portrait JPEG fallback used the landscape image.** Added a portrait JPEG picture source before the landscape candidates. Suppressing AVIF and WebP picture candidates in the test now resolves the 1080×1350 JPEG in all engines. This is a fallback-capability simulation, not a claim that these modern engines lack AVIF/WebP.
5. **Codec declarations disagreed with the files.** AV1 configuration records report level index 9 for both cuts, so both strings are `av01.0.09M.08`. H.264 avcC headers are High@5.0 (`avc1.640032`) landscape and High@4.0 (`avc1.640028`) portrait. The original strings advertised lower levels. Corrected metadata is now used for selection; VP9/H.264 forced playback succeeds in all engines.
6. **Preview favicon 404.** A preliminary full Chromium 153 smoke run emitted a missing-favicon console error. Added an empty data-URI favicon; final runs have zero console or page errors. This does not add a network request.

The complete production diff follows; the same diff is saved as `out/qa/embed-fixes.diff`.

```diff
--- apps/hero-film/out/qa/index.before.html	2026-10-14 18:26:37
+++ apps/hero-film/preview/index.html	2026-10-14 18:31:15
@@ -5,8 +5,9 @@
     <meta name="viewport" content="width=device-width, initial-scale=1" />
     <title>Attraccess — hero film embed preview</title>
     <meta name="color-scheme" content="dark" />
-    <link rel="preload" as="image" href="media/poster-landscape.webp" media="(min-width: 641px)" />
-    <link rel="preload" as="image" href="media/poster-portrait.webp" media="(max-width: 640px)" />
+    <link rel="icon" href="data:," />
+    <link rel="preload" as="image" type="image/avif" href="media/poster-landscape.avif" media="(min-width: 641px)" />
+    <link rel="preload" as="image" type="image/avif" href="media/poster-portrait.avif" media="(max-width: 640px)" />
     <style>
       /* App tokens, dark appearance (libs/ui/src/tokens.css). */
       :root {
@@ -83,6 +84,7 @@
         <picture>
           <source media="(max-width: 640px)" type="image/avif" srcset="media/poster-portrait.avif" />
           <source media="(max-width: 640px)" type="image/webp" srcset="media/poster-portrait.webp" />
+          <source media="(max-width: 640px)" type="image/jpeg" srcset="media/poster-portrait.jpg" />
           <source type="image/avif" srcset="media/poster-landscape.avif" />
           <source type="image/webp" srcset="media/poster-landscape.webp" />
           <img src="media/poster-landscape.jpg" alt="" width="1920" height="1080" decoding="async" />
@@ -110,14 +112,14 @@
         // Both cuts share one timeline, so switching orientation keeps the current time.
         const SOURCES = {
           landscape: [
-            { src: 'media/hero-landscape.av1.mp4', type: 'video/mp4; codecs="av01.0.08M.08"' },
+            { src: 'media/hero-landscape.av1.mp4', type: 'video/mp4; codecs="av01.0.09M.08"' },
             { src: 'media/hero-landscape.vp9.webm', type: 'video/webm; codecs="vp9"' },
-            { src: 'media/hero-landscape.h264.mp4', type: 'video/mp4; codecs="avc1.640028"' },
+            { src: 'media/hero-landscape.h264.mp4', type: 'video/mp4; codecs="avc1.640032"' },
           ],
           portrait: [
-            { src: 'media/hero-portrait.av1.mp4', type: 'video/mp4; codecs="av01.0.05M.08"' },
+            { src: 'media/hero-portrait.av1.mp4', type: 'video/mp4; codecs="av01.0.09M.08"' },
             { src: 'media/hero-portrait.vp9.webm', type: 'video/webm; codecs="vp9"' },
-            { src: 'media/hero-portrait.h264.mp4', type: 'video/mp4; codecs="avc1.64001f"' },
+            { src: 'media/hero-portrait.h264.mp4', type: 'video/mp4; codecs="avc1.640028"' },
           ],
         };
         const narrow = matchMedia('(max-width: 640px)');
@@ -151,9 +153,14 @@
             report();
             return;
           }
-          if (!current) load();
+          load();
           if (shouldPlay()) {
-            video.play().catch(() => film.classList.add('is-paused'));
+            video.play().catch((error) => {
+              // Source changes and visibility pauses can cancel a pending play().
+              if (error.name === 'AbortError' || !shouldPlay()) return;
+              userPaused = true;
+              sync();
+            });
           } else {
             video.pause();
           }
@@ -164,7 +171,7 @@
 
         video.addEventListener('playing', () => { film.classList.add('is-playing'); report(); });
         toggle.addEventListener('click', () => { userPaused = !userPaused; sync(); });
-        narrow.addEventListener('change', () => { if (current) { load(); sync(); } });
+        narrow.addEventListener('change', sync);
         reduce.addEventListener('change', sync);
         document.addEventListener('visibilitychange', sync);
         new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }, { threshold: 0.15 }).observe(film);
```

## Open issue and remaining risks

- **Reproduced: WebKit 27.2 AV1 seek rendering can freeze on the old frame.** After seeking to 10s, a minimal AV1 video retained the pre-seek image for about 2.7s; the next presented callback was near media time 12s while currentTime was already about 12.66s. A canvas draw during that delay also captured the old reader image, so this is not just an incorrect screenshot timestamp. A minimal plain `<video>` reproduces it; VP9 and H.264 in the same minimal test present frames around the requested time. The embed also reproduces it in both cuts. A strict capture requiring a presented frame within 0.5s of t=10s timed out. Natural full-loop capture attempts were also inconclusive in the concurrent headless WebKit pages; their timeout log is retained as webkit-natural-loop.log. This QA does not claim a visually verified WebKit AV1 seam. This can affect the visual result of a responsive source change even though `currentTime` is restored. No browser-specific source preference or export change was made: this evidence does not establish which shipping Safari/device combinations are affected. See `webkit-minimal.json`, `webkit-minimal-av1.png`, `webkit-seek.json`, `webkit-av1-seek10.png`, and the failed strict decoded-frame capture in `final-captures.log`. Native Safari/device verification or a deliberate codec preference decision remains necessary.
- **Native Safari autoplay policy and native tab hiding remain unverified.** Playwright WebKit on this Mac is not an iPhone, Low Power Mode, a user-blocked autoplay setting, or an installed shipping Safari build. The denied-autoplay recovery is explicitly tested; the native visibility transition is not.
- **Codec availability varies by hardware/OS.** This Mac plays all three encodings. H.264 landscape is encoded at High level 5.0, so the “universal” fallback wording in the README should not be interpreted as compatibility with every old device. The embed uses capability claims, not a runtime decoder-failure fallback.
- **Performance is local and unthrottled.** No production CDN, mobile radio, thermal, battery or long-running memory test was performed. The preview fetches the complete selected cut on a fast connection.

## Optional Chromium LCP observation

- 1440×900: [{"startTime": 56, "size": 341226, "tag": "IMG", "url": "http://127.0.0.1:4612/media/poster-landscape.avif"}]
- 390×844: [{"startTime": 56, "size": 88288, "tag": "IMG", "url": "http://127.0.0.1:4612/media/poster-portrait.avif"}]

These are buffered LargestContentfulPaint observations on localhost, not a Lighthouse score or production Core Web Vitals claim.

## Screenshots

All paths below are relative to `apps/hero-film/`. Responsive images are full-page captures; seam images crop the film.

### chromium

- [out/qa/final-chromium-1024x768.png](../out/qa/final-chromium-1024x768.png)
- [out/qa/final-chromium-1440-seam-end.png](../out/qa/final-chromium-1440-seam-end.png)
- [out/qa/final-chromium-1440-seam-start.png](../out/qa/final-chromium-1440-seam-start.png)
- [out/qa/final-chromium-1440x900.png](../out/qa/final-chromium-1440x900.png)
- [out/qa/final-chromium-1920x1080.png](../out/qa/final-chromium-1920x1080.png)
- [out/qa/final-chromium-360x740.png](../out/qa/final-chromium-360x740.png)
- [out/qa/final-chromium-390-seam-end.png](../out/qa/final-chromium-390-seam-end.png)
- [out/qa/final-chromium-390-seam-start.png](../out/qa/final-chromium-390-seam-start.png)
- [out/qa/final-chromium-390x844.png](../out/qa/final-chromium-390x844.png)
- [out/qa/final-chromium-768x1024.png](../out/qa/final-chromium-768x1024.png)
- [out/qa/final-chromium-poster.png](../out/qa/final-chromium-poster.png)

### webkit

- [out/qa/final-webkit-1024x768.png](../out/qa/final-webkit-1024x768.png)
- [out/qa/final-webkit-1440-seam-end.png](../out/qa/final-webkit-1440-seam-end.png)
- [out/qa/final-webkit-1440-seam-start.png](../out/qa/final-webkit-1440-seam-start.png)
- [out/qa/final-webkit-1440x900.png](../out/qa/final-webkit-1440x900.png)
- [out/qa/final-webkit-1920x1080.png](../out/qa/final-webkit-1920x1080.png)
- [out/qa/final-webkit-360x740.png](../out/qa/final-webkit-360x740.png)
- [out/qa/final-webkit-390-seam-end.png](../out/qa/final-webkit-390-seam-end.png)
- [out/qa/final-webkit-390-seam-start.png](../out/qa/final-webkit-390-seam-start.png)
- [out/qa/final-webkit-390x844.png](../out/qa/final-webkit-390x844.png)
- [out/qa/final-webkit-768x1024.png](../out/qa/final-webkit-768x1024.png)
- [out/qa/final-webkit-poster.png](../out/qa/final-webkit-poster.png)

### firefox

- [out/qa/final-firefox-1024x768.png](../out/qa/final-firefox-1024x768.png)
- [out/qa/final-firefox-1440-seam-end.png](../out/qa/final-firefox-1440-seam-end.png)
- [out/qa/final-firefox-1440-seam-start.png](../out/qa/final-firefox-1440-seam-start.png)
- [out/qa/final-firefox-1440x900.png](../out/qa/final-firefox-1440x900.png)
- [out/qa/final-firefox-1920x1080.png](../out/qa/final-firefox-1920x1080.png)
- [out/qa/final-firefox-360x740.png](../out/qa/final-firefox-360x740.png)
- [out/qa/final-firefox-390-seam-end.png](../out/qa/final-firefox-390-seam-end.png)
- [out/qa/final-firefox-390-seam-start.png](../out/qa/final-firefox-390-seam-start.png)
- [out/qa/final-firefox-390x844.png](../out/qa/final-firefox-390x844.png)
- [out/qa/final-firefox-768x1024.png](../out/qa/final-firefox-768x1024.png)
- [out/qa/final-firefox-poster.png](../out/qa/final-firefox-poster.png)

Additional diagnostic images: `reference-{landscape,portrait}-seam-{end,start}.png`, `reference-portrait-t10.png`, `webkit-minimal-av1-canvas.png`, `webkit-{av1,vp9,h264}-seek10.png`, `webkit-minimal-{av1,vp9,h264}.png`. Original pre-fix images remain as `baseline-*.png`.

## Evidence and reproduction

- `out/qa/final-results.json`: states, source reports, bounds, accessibility attributes, performance entries, network bodies and exceptions for the full matrix.
- `baseline-results.json`, `baseline-edges.json`, `final-edges.json`, `final-fallbacks.json`: before/after regressions and codec capability tests.
- `final-server-network.json`, `final-loop-timing.json`, `webkit-natural-loop.json`, `seam-comparison.json`, `final-capture-times.json`, `ffprobe.json`: detailed network, timing, rendered-frame and media evidence.
- Expected cancellations during source replacement, media emulation changes or closing a context are retained in `requestFailures`; no console/page errors or missing media were observed in the final run.
- Media SHA-256 hashes in `media-before.sha256` were checked after QA; all twelve media files match.

```sh
npm install --prefix /tmp/attraccess-hero-qa playwright@1.64.1 http-server@14.1.1
/tmp/attraccess-hero-qa/node_modules/.bin/playwright install chromium webkit firefox
# From workspace root; the main harness owns its range-capable server on 4612:
QA_LABEL=final node apps/hero-film/out/qa/run.cjs
# Supplementary probes use the range-capable server on 4610:
/tmp/attraccess-hero-qa/node_modules/.bin/http-server apps/hero-film/preview -p 4610 -c-1
QA_LABEL=final node apps/hero-film/out/qa/edge-cases.cjs
node apps/hero-film/out/qa/fallbacks.cjs
node apps/hero-film/out/qa/loop-timing.cjs
node apps/hero-film/out/qa/webkit-minimal.cjs
node apps/hero-film/out/qa/webkit-natural-loop.cjs
# Strict frame capture: Chromium/Firefox pass; WebKit AV1 currently times out:
QA_BROWSERS=chromium,firefox node apps/hero-film/out/qa/captures.cjs
python3 apps/hero-film/out/qa/write-report.py
```

## Addendum — final media and Safari source order (Claude)

After this QA run the film was re-rendered with corrected portrait framing and crop margins (same
timeline, 52 s, same codecs and levels: AV1 Main level 9, H.264 High 5.0 landscape / 4.0 portrait),
and `preview/media/` was refreshed. To address the open WebKit AV1 seek issue, the embed now prefers
the H.264 cut on WebKit/Safari/iOS (AV1 → VP9 → H.264 elsewhere). Smoke test with the final media
(`out/qa/smoke-final.mjs`):

| Browser | 1440×900 | 390×844 | Reduced motion | Console |
|---|---|---|---|---|
| Chromium | AV1 landscape, playing | AV1 portrait, playing | paused, no source, AVIF poster | clean |
| WebKit | H.264 landscape, playing | H.264 portrait, playing | paused, no source, AVIF poster | clean |
| Firefox | AV1 landscape, playing | AV1 portrait, playing | paused, no source, AVIF poster | clean |

Final payloads: landscape AV1 4.31 MB / VP9 4.72 MB / H.264 5.20 MB; portrait AV1 3.31 MB /
VP9 3.55 MB / H.264 3.65 MB; posters 28–128 KB.
