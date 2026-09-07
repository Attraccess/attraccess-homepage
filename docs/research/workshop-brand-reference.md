# Workshop Brand Reference

Checked 2026-09-06. This is an asset and palette inventory, not a firmware workflow audit. See [workshop-product-workflows.md](workshop-product-workflows.md) for the separate product investigation.

## Pinned Sources

- [Homepage PR #24][homepage-pr]: **MERGED**, review decision **APPROVED**, branch `t3code/align-website-brand-theme`, head `cd35349c2de206394e9fa2fd34e0de01f0e6cdbf`. The supplied head remains the source, not a moving `main`.
- [Application PR #1816][app-pr]: **OPEN**, no GitHub review decision reported, branch `t3code/ral5021-wago-theme`, head `ceb366969b93da429ba8b8119d1f17c1cecf5972`. These are PR previews, not evidence of a released or deployed application.
- [Firmware render comment][firmware-comment]: pins `d37f3eaa7790588a6d0d49ec2ac6123a2c1c4521`. Its six individual PNGs and overview also have identical Git blob hashes at the supplied PR #1816 head. This comment supersedes earlier comments excluding firmware.
- Remote access used read-only `gh pr view` and `gh api`. Asset bytes were decoded mechanically from the GitHub Contents API and checked against pinned tree blob hashes. Raw PNG streaming through this installed `gh` failed with `transform: short source buffer`; no failed PNG output was written.

## Palette And Behavior

The [application tokens][app-tokens] define white plus RAL 5021, represented in sRGB as **`#256d7b`**. These are digital colors, not a guarantee of physical panel or paint appearance. The [approved homepage CSS][homepage-css] ports them to HSL custom properties; the table gives their 8-bit sRGB equivalents.

| Homepage token | Light | Dark |
| --- | --- | --- |
| `--background` | `#ffffff` | `#162124` |
| `--foreground` | `#202729` | `#f4f8f8` |
| `--card`, `--popover` | `#ffffff` | `#1e2c2f` |
| `--secondary`, `--muted` | `#f5f7f7` | `#26363a` |
| `--tertiary` | `#edf1f1` | `#26363a` |
| `--muted-foreground` | `#5d6b6e` | `#afc0c3` |
| `--primary`, `--accent`, `--ring` | `#256d7b` | `#82c4ce` |
| `--primary-foreground` | `#ffffff` | `#142e34` |
| `--primary-hover` | `#1c5864` | `#a1d5dc` |
| `--primary-soft` | `#eaf3f4` | `#203c42` |
| `--border` | `#d5dede` | `#42575c` |
| `--separator` | `#e0e6e6` | `#34484d` |
| `--input` | `#8a989b` | `#64787c` |

- Exact primary CSS: light `189.767 53.750% 31.373%`; dark `187.895 43.678% 65.882%`, consumed via `hsl(var(--primary))`. Dark primary controls need `#142e34` text, not white. White on light primary has approximately 5.91:1 contrast. [Sources: homepage CSS][homepage-css], [application tokens][app-tokens].
- Contrast caveat from local token checks: the approved light input border `#8a989b` is **2.9807:1 against white**, just below 3:1. It is preserved for source parity, not claimed to pass that threshold. Dark field borders are 3.1029:1; primary text is 5.9119:1 light / 7.3030:1 dark. Focus outlines use the stronger primary color.
- The homepage deliberately retains PR #24's mapping: dark tertiary equals secondary and popover equals card. PR #1816's app instead has dark tertiary `#304348` and overlay `#293639`. Do not silently substitute app-only overlay behavior into the homepage. [Sources: homepage CSS][homepage-css], [application tokens][app-tokens].
- Shared/contact surfaces are flat, with `--radius: 6px`, `--radius-control: 4px`, visible borders and focus outlines. Legacy gradient utility tokens resolve to solid colors, shadow tokens to `none`, and the existing `tech-blue`/`orange-accent` aliases resolve to teal. Success, warning, and danger remain distinct; contact success is `#347b38` light / `#75cf89` dark. [Source: homepage CSS][homepage-css].
- [Theme provider][homepage-theme] and [HTML bootstrap][homepage-html] default to light, even on a dark OS. Explicit saved `dark` and `system` preferences work; invalid/missing/blocked storage falls back to light. The bootstrap sets the root class and `color-scheme` before React, initial React state resolves synchronously, and blocked storage does not prevent session-only appearance changes. System-mode listeners track OS changes.
- The workshop implementation, its CSS/header integration and hardware palette belong to the main task owner and were not edited here. Only the approved shared/contact rules were ported into the existing `src/index.css`; dormant prototype layouts were not replaced.

## Approved Artwork

Use the [PR #24 Logo component][homepage-logo] and the byte-identical assets below. The SVG wordmark inherits surrounding text color; the embedded mascot retains its original colors, shading, coat patches and transparency. The approved export already changes the keyhole to teal. **Do not tint, trace, desaturate, invert, or regenerate the mascot.** The favicon's small white silhouette is an intentional approved exception, not a replacement mascot design. [Source: branding guidance][app-branding].

The SVG remains about 782 kB because it includes the approved raster mascot; it was not re-encoded. The existing `public/design/lockup-color.png` was outside this task's ownership and remains untouched. Updated HTML metadata points to `/logo.svg`, not that legacy lockup.

## Asset Inventory

All 17 files below are unmodified first-party exports: **1,928,280 bytes** total. Dimensions are width x height; SVG dimensions describe its viewBox. No cropping, recoloring, resampling, lossy recompression, live-account capture, firmware execution or device flashing was performed.

### Homepage Assets

Source directory: [PR #24 `public/` at the pinned head][homepage-public].

| Local file | Dimensions | Bytes | Type |
| --- | --- | ---: | --- |
| `public/logo.svg` | 7038 x 2112 viewBox | 781708 | Approved wordmark and full-color mascot |
| `public/logo.png` | 150 x 300 | 40604 | Transparent mascot/keyhole, not the full wordmark |
| `public/favicon.ico` | 32 x 32 | 866 | Approved icon |
| `public/og-image.png` | 1440 x 1000 | 152709 | Light web resource-overview screenshot |
| `public/hero/app-screenshot.png` | 1440 x 1000 | 152709 | Same bytes as OG image |
| `public/hero/app-screenshot-dark.png` | 1440 x 1000 | 155117 | Dark web resource-overview screenshot |

The web overview images show demonstration data, not a live connected workshop. They are not identical state captures: the dark image shows the laser cutter in maintenance while the light image shows it available. Do not present that difference as caused by selecting dark mode. OG metadata now uses the actual 1440 x 1000 dimensions.

### Reader Renders

Source directory: [firmware comment's pinned `docs/_media/`][firmware-media]. All individual images are **real production screen code rendered by LVGL 9.3.0 on the host at 480 x 480 with deterministic example data**, not physical-device photos and not browser mockups. These are the firmware's **light UI only**; a web dark-mode preference does not configure a reader. [Source: firmware comment][firmware-comment].

| Local file under `public/reader-ui/` | Dimensions | Bytes | Available state |
| --- | --- | ---: | --- |
| `firmware-theme-init.png` | 480 x 480 | 18938 | Initialization, network/API status, settings entry |
| `firmware-theme-enrollment.png` | 480 x 480 | 8987 | Register a card; example user and card prompt |
| `firmware-theme-reset.png` | 480 x 480 | 11617 | Reset in progress; keep card still |
| `firmware-theme-supervision.png` | 480 x 480 | 10597 | Supervisor card required; web approval hint |
| `firmware-theme-pin.png` | 480 x 480 | 9981 | Device PIN input with numeric keyboard |
| `firmware-theme-pin-error.png` | 480 x 480 | 10051 | PIN validation/error styling |
| `firmware-theme-overview.png` | 1540 x 1160 | 94869 | First-party labeled contact sheet of these six states |

The complete pinned tree contains no additional published `firmware-theme-*.png` workflows. There are **no imported reader captures** for lockscreen/ordinary card identification, resource selection/details, usage start/active session/stop, resource forms/projects, maintenance denial, payment, settings dialogs or other overlays. Do not invent those states or relabel the web screenshots as reader screens. The comment reports 25 host fixtures but publishes only this selected visual coverage; no large fixture bundle was downloaded. It explicitly leaves physical panel color, touch/DMA behavior and peak ESP32 heap usage for on-device validation. [Sources: pinned tree][firmware-tree], [firmware comment][firmware-comment].

### Web Workflow Screenshots

Source directory: [PR #1816 `docs/_media/` at the current supplied head][app-media]. Kept in `public/reader-ui/` for the workshop asset handoff, but these are **web application screenshots, not NFC reader displays**. Visible descriptions identify demonstration fixtures with no equipment connected.

| Local file under `public/reader-ui/` | Dimensions | Bytes | Visible web UI |
| --- | --- | ---: | --- |
| `brand-resource-details.png` | 1440 x 1000 | 136015 | Laser cutter overview, optional project, start action, billing and documentation |
| `brand-resource-details-mobile.png` | 390 x 844 | 56532 | Mobile version of the resource overview |
| `brand-resource-maintenance.png` | 1440 x 1000 | 90978 | Upcoming demonstration maintenance and schedule controls; not a denial screen |
| `brand-flow-editor.png` | 1440 x 1000 | 196002 | Demo button/condition/wait/payload flow; not evidence of an actual machine actuation |

## Sync And Verification

`node scripts/sync-brand-assets.mjs` downloads only this fixed allowlist through read-only `gh api`, verifies Git blob hashes before each write, and preserves original bytes. `node scripts/sync-brand-assets.mjs --check` verifies the local files offline without writing or contacting GitHub. Source commits and per-file hashes are embedded in the script.

TypeScript app/node checks, repository lint, the three translation checks, asset hashes and `git diff --check` passed. Seven ad hoc VM/hook-harness scenarios checked the actual bootstrap/provider source for synchronous initial state, saved preferences, blocked storage, OS changes, session switches and listener cleanup. Tailwind/PostCSS compiled in memory without warnings; primary/muted text contrast passed, while the light field-border assertion exposed the upstream limitation above. The Logo, theme provider, Tailwind config and HTML files also match PR #24's Git blob hashes exactly.

No browser, dev server or prerender run was started; `scripts/workshop.test.mjs` starts both a server and a browser, so it was intentionally not run. Final desktop/mobile integration verification remains with the main task owner.

[homepage-pr]: https://github.com/Attraccess/attraccess-homepage/pull/24
[app-pr]: https://github.com/Attraccess/Attraccess/pull/1816
[firmware-comment]: https://github.com/Attraccess/Attraccess/pull/1816#issuecomment-5561397556
[homepage-css]: https://github.com/Attraccess/attraccess-homepage/blob/cd35349c2de206394e9fa2fd34e0de01f0e6cdbf/src/index.css
[homepage-theme]: https://github.com/Attraccess/attraccess-homepage/blob/cd35349c2de206394e9fa2fd34e0de01f0e6cdbf/src/contexts/theme-provider.tsx
[homepage-html]: https://github.com/Attraccess/attraccess-homepage/blob/cd35349c2de206394e9fa2fd34e0de01f0e6cdbf/index.html
[homepage-logo]: https://github.com/Attraccess/attraccess-homepage/blob/cd35349c2de206394e9fa2fd34e0de01f0e6cdbf/src/components/Logo.tsx
[homepage-public]: https://github.com/Attraccess/attraccess-homepage/tree/cd35349c2de206394e9fa2fd34e0de01f0e6cdbf/public
[app-tokens]: https://github.com/Attraccess/Attraccess/blob/ceb366969b93da429ba8b8119d1f17c1cecf5972/libs/ui/src/tokens.css
[app-branding]: https://github.com/Attraccess/Attraccess/blob/ceb366969b93da429ba8b8119d1f17c1cecf5972/docs/en/setup/branding.md
[app-media]: https://github.com/Attraccess/Attraccess/tree/ceb366969b93da429ba8b8119d1f17c1cecf5972/docs/_media
[firmware-media]: https://github.com/Attraccess/Attraccess/tree/d37f3eaa7790588a6d0d49ec2ac6123a2c1c4521/docs/_media
[firmware-tree]: https://api.github.com/repos/Attraccess/Attraccess/git/trees/d37f3eaa7790588a6d0d49ec2ac6123a2c1c4521?recursive=1
