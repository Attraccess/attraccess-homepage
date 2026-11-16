# Attractap production screen assets

Rendered from the current, unchanged firmware at software commit
`a4d5e3b772686164dc353f2449edf0617a3509f5` (firmware version 1.6.4).
These are **real LVGL 9.3.0 software-rendered production screen classes**, not
browser mockups, redrawn screens or AI-generated images. Every screen has a
480 × 480 native PNG and a 1440 × 1440 `@3x.png` nearest-neighbour upscale.
The upscale adds no detail; it is not a higher-DPI render. Increasing LVGL's
logical resolution would change these pixel-sized layouts, rather than render
the same physical screen at higher DPI, so the production resolution is retained.

## Theme and English copy

The current `firmware/src/display/theme.hpp` / `theme.cpp` ships **one dark
theme**: `#162124` background, `#82C4CE` accent, matching the app dark palette.
The idle screen retains its actual production background artwork. There is no
selectable white/RAL 5021 theme in this checkout, so none has been invented.

- `dark-production-de/`: untouched production label copy. These are the
  authoritative, genuine production UI captures, with fictional fixture data.
- `dark-en/`: the same production screen/layout/font/image/theme code rendered
  by LVGL, with **capture-only English label substitution in memory**. The
  firmware hardcodes German strings and has no English locale selector. These
  are genuine production-code renders with translated copy, **not evidence of
  an English firmware release**. Only label strings change; no layouts, colors,
  fonts, widget positions or image assets are overridden. Production numeric
  date/time formatting is retained. Use these for the English film with this
  limitation understood.

## Screen files

Each filename below exists in **both** folders, at 480 × 480, with a matching
`@3x.png` at 1440 × 1440. All belong to the **Attractap Touch, WiFi** display
configuration; the same screen classes and 480 × 480 layout serve Touch V2 and
Touch Ethernet. The summary footer explicitly says WiFi.

| Filename | Production screen / state |
| --- | --- |
| `01-idle-ready.png` | `Lockscreen`, Laser cutter available; wall clock 14:32, Wednesday 14 October 2026; card prompt |
| `02-authenticating.png` | `Lockscreen::showActionProgress()`, genuine full-screen dimmed card-check overlay and LVGL spinner |
| `03-session-started.png` | `ResourceDetailsScreen`, Mia Chen owns the Laser cutter session, start at 14:32, duration 00:00; real success toast with application message `Nutzung gestartet` / “Session started” |
| `04-session-active.png` | Same details screen, 24:00 elapsed, energy 0.125 kWh, 12:00 operating time / running; real meter/status panel |
| `04b-in-use-lockscreen.png` | Reader returned to idle while Laser cutter is in use by Mia Chen; clock 14:32 |
| `05-session-ended.png` | `SessionSummaryScreen`, actual green check graphic, thank-you message, 00:24:00 duration; unbilled variant |
| `06-access-denied-no-introduction.png` | `ResourceDetailsScreen`, no introduction and no supervision permission; actual warning/trainer panel; session controls absent. Production does not add a separate “Access denied” headline |
| `07-supervision-required.png` | `SupervisionScreen::STATUS_WAITING`, Mia Chen, supervisor card prompt, web approval hint, full 30-second countdown bar and cancel button |
| `08-init-logo.png` | `InitScreen`, genuine embedded mascot/wordmark, pending connection stages, settings button; reserved/unconfigured network fixture, no credentials |
| `08b-boot-title.png` | `BootScreen`, production Attraccess title and “Attractap Touch v1.6.4”. The earliest boot screen has text rather than the mascot; the logo appears on init |

Fixture names, resource data, usage statistics, wall clock and network state are
simulated; there is no real NFC, ESP32, API, database or hardware access. The
session starts at 14:32 and the active details frame represents 14:56. The two
idle frames represent the start moment. The 30 s bar in details is the **reader
login timeout**, not the allowed machine-session duration.

## Reproduce

Run from the workspace root:

```sh
bash apps/hero-film/tools/reader/render.sh
```

This configures `/tmp/attraccess-hero-reader-build`, builds the original
`firmware/tests/display-theme` harness plus `reader-film-host`, runs the upstream
CTest suite, renders both languages twice and compares every raw framebuffer
byte-for-byte, then exports PNGs with the installed Sharp dependency in
`software/node_modules`. Set `READER_BUILD_DIR` to another external build path
if needed. Requirements: CMake, C/C++20 compiler, assembler with `.incbin`, Node,
installed software dependencies, curl/npx and initial dependency-download access.
No firmware or desktop source files are edited. No generated C, binaries or raw
framebuffers are saved in tracked source paths.

The build reuses the original harness's pinned LVGL source, configuration,
production screen C++, generated Montserrat fonts, production raw RGB565+A8
logos and RGB565 background. Its RGB565 framebuffer is expanded to opaque RGBA
by bit replication, then losslessly encoded to PNG. The two duration/time
formatters are extracted verbatim from production `utils.cpp` during configure;
hardware-only host shims supply the controlled clock and state getters. The
screen classes run directly; the global display router/device-name/network
overlays are not instantiated, matching the original headless harness scope.

`manifest.json` records screen dimensions, copy provenance and raw-frame SHA-256
hashes. `qa/{en,de}/*.labels.txt` contains visible label strings and their LVGL
bounding boxes (`x1,y1,x2,y2`, inclusive), captured after layout for inspection.

## Genuine hardware imagery and compositing

| File in `hardware/` | Resolution | Provenance / purpose |
| --- | --- | --- |
| `attractap-homepage.webp` | 900 × 1622, alpha | Exact copy of `apps/web/public/hardware/attractap.webp`, existing front-view CAD artwork |
| `attractap-homepage.png` | 900 × 1622, alpha | Lossless PNG conversion of that WebP; no added detail |
| `attractap-front-original.png` | 1880 × 3388, alpha | Exact copy of `software/apps/attractap/desktop/assets/attractap.png`; simulator's original front-view CAD render, best source for film |
| `composite-idle-en.png` | 1880 × 3388, alpha | QA/example composite of the English idle framebuffer into the original hardware artwork; no repainting of the enclosure |
| `screen-rectangles.json` | JSON | Machine-readable placement rectangles and rounded-corner radii |

These are existing genuine project CAD renders, **not photographs**. The
production simulator itself measures the display as `{x:10,y:70,w:480,h:480}`
with radius 12 on a 500 × 901 device canvas (`desktop/src/sdl_display.cpp`).
Scaling that rectangle to each source image gives the following placements
(origin top left; width/height extents; no perspective warp):

- Homepage 900 × 1622: **x 18, y 126, width 864, height 864**, radius ≈22 px.
- Original 1880 × 3388: **x 38, y 263, width 1805, height 1805**, radius ≈45 px.

Clip the screen to the rounded rectangle. The blank black/grey gradient in the
source is display placeholder artwork; the framebuffer replaces it. Coordinates
are rounded from the production simulator's transforms, with its small inset
inside the black window. Alpha outside the hardware silhouette is preserved.

The searched docs/apps contain UI screenshots and this front-view CAD source,
not an additional assembled-reader photograph. `software/reference/` contains
board reference sheets, not enclosure photography. The public OpenSCAD folder
contains the WebAssembly runtime/fonts; it is not a collection of enclosure
`.scad` files. `openscad` is not installed (`which openscad` returned not found),
so the optional 2000 px front-three-quarter render was skipped as requested.

## Hardware variants and Lite LED animation reference

- **Touch WiFi (V3)**: ST7701 480 × 480 RGB panel, GT911 touch.
- **Touch V2 WiFi (V4)**: same 480 × 480 display/UI; different IO expander and
  NFC address. Demo variants retain their corresponding display hardware.
- **Touch Ethernet**: TL040WVS03 480 × 480 RGB panel on Qualia S3, FT6206-protocol
  capacitive touch. Same production screen classes.
- **Lite Ethernet**: **no display**; 24 WS2812 LEDs in a circular ring. There are
  no Lite screen renders. The collected enclosure art is the Touch display
  enclosure; do not present it as Lite hardware.

Verified against `firmware/variants/*.cmake`, display driver constants,
`firmware/src/led/led.{hpp,cpp}` and `docs/en/attractap/led-guide.md`. For the film,
the **code** gives these precise circular-ring states (RGB before the configured
global LED brightness; update every 50 ms):

| State | Code color(s) | Timing / animation |
| --- | --- | --- |
| Configuration required | Red `#FF0000`, orange `#FFA500` | Three evenly spaced dots at indices 0/8/16; every 600 ms alternate to orange dots at 4/12/20 |
| Initializing | Blue `#0000FF` | Moving head advances 1 LED per 50 ms; eight total tail samples `[255,180,100,50,25,10,4,1]`; 1.2 s lap |
| Ready / wait for card | Green `#00FF00` | Six segments of four LEDs; adjacent segments breathe in opposite phases. Triangular brightness 8→38→8 over 60 ticks / 3 s |
| Authenticating | Pale cyan `#64C8FF` | Head advances 2 LEDs per 50 ms; six tail samples `[255,180,100,50,20,8]`; 0.6 s lap |
| No resources | Orange `#FFA500` / off | Whole ring 500 ms on, 500 ms off |
| Firmware update | Blue `#0000FF`, white `#FFFFFF` | Static alternating pixels |
| Success trigger | Green `#00FF00` | Solid full ring for 400 ms, then restore prior persistent state |
| Error trigger | Red `#FF0000` / off | Three red flashes: 100 ms on + 100 ms off, total 600 ms, then restore state |
| Indicate trigger | Yellow `#FFFF00` / off | 100 ms on/off/on/off, total 400 ms, then restore state: **two lit pulses**, four phases. The LED guide calls these “4 pulses”; code takes precedence |

The `dim()` helper scales channels with integer `(channel * factor) / 255`;
configured global brightness applies after that (default 255). There is no separate persistent
“session active”, “session ended”, “no introduction” or “supervision” LED enum:
show the actual state/trigger appropriate to the reader flow, rather than assign
an invented color meaning. Only Lite Ethernet defines `HAS_WS2812_LED` in these
shipped variants.

## QA

The original display-theme CTest suite passes all three tests, including its
independent repeatability test. The film harness renders ten frames per language
with zero LVGL errors, verifies real nonblank full-frame flushes and idempotent
screen initialization, and compares two fresh-process renders byte-for-byte.
Native images, 3× exports and the enclosure composite were visually reviewed for
readability, clipping and placement. Firmware/desktop sources remain untouched.
