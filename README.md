# Attraccess Homepage

The marketing homepage for [Attraccess](https://github.com/Attraccess/Attraccess) — Access and Lifecycle management for shared resources like machines, tools and doors.

## Tech Stack

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Three.js](https://threejs.org/) (lazy-loaded workshop scene)

## Development

```sh
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Lint
pnpm lint

# Unit and browser regression tests
pnpm test
```

## Workshop Tour

The homepage is a seven-chapter, native-scroll story about shared-workshop operation:
arrive, identify, check, use, clean up, confirm the handoff, and handle maintenance.
The table saw, bandsaw, CNC router, Attractap Touch readers, and control boxes are
procedural illustrations, not CAD models or installation/wiring instructions.
Machine operation is never animated as an automatic consequence of authorization.

- `src/components/workshop/WorkshopTour.tsx`: accessible HTML, chapter selection,
  machine inspection, and the authorization examples.
- `src/components/workshop/content.ts`: operator-focused German and English copy.
- `src/components/workshop/WorkshopDemo.tsx` and `story.ts`: local workflow examples
  and guarded transitions, shared with the scene. They never contact the product API.
- `src/components/workshop/scene-model.ts`: geometry, materials, and camera views.
- `src/components/workshop/WorkshopScene.tsx`: on-demand rendering, camera
  transitions, bounded pixel ratio, and GPU cleanup.
- `public/workshop/`: generated WebP stills for loading, reduced motion, data-saving,
  prerendering, explicit illustrated mode, and WebGL failures.

The scene is downloaded only when enabled. Rendering stops when settled, hidden,
or offscreen; stalled startup falls back to illustrations. All marketing content
remains HTML, and the complete interactive story works without WebGL. On short
phone screens the illustration stops sticking so it cannot cover the reading area.

Examples are self-contained so readers can skip chapters. Physical cleanup is
performed by the example person and does not automatically check the closing form.
Reporting a fault is a separate web-app workflow; it does not block new usage until
authorized personnel start maintenance. Source/capability boundaries and the PR
artwork provenance are recorded in `docs/research/` and linked from the UI.

White/RAL 5021 branding uses the approved assets from homepage PR #24. The original
supervision image is an LVGL host render from app PR #1816, not a device photo.
Other interactive reader views are labeled illustrations. Reader screens remain
light when the website uses dark mode. Verify the pinned, unmodified brand assets
with `node scripts/sync-brand-assets.mjs --check`.

After changing geometry, lighting, or camera framing, regenerate the stills:

```sh
pnpm workshop:posters
```

This starts a temporary Vite server on port 4191 and captures the real scene with
Puppeteer. Browser tests use port 4193 and never submit forms or contact external
services. Both support `PUPPETEER_EXECUTABLE_PATH` for a system Chromium installation.

## Analytics

Page views and a couple of conversion events go to a self-hosted [Umami](https://umami.is/).
Configuration lives in `src/lib/analytics.ts`; copy `.env.example` to `.env` (or set the
variables in the build environment) to enable it:

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_UMAMI_HOST` | — | Umami host, e.g. `umami.apps.janjaap.de`. **Analytics is disabled when unset.** |
| `VITE_UMAMI_WEBSITE_ID` | — | Website id (uuid) from Umami's *Settings → Websites*. **Analytics is disabled when unset.** |
| `VITE_UMAMI_SCRIPT` | `script.js` | Renamed `script.js` on the instance (adblock evasion) |

These are inlined at build time, so they must be set for `pnpm build` — not at runtime.

Notes:

- Umami stores no cookies and no IP addresses, so no consent banner is required.
- Do Not Track is honoured (`data-do-not-track`), as promised on the Datenschutz page.
- Umami's own SPA auto-tracking is off (`data-auto-track="false"`); `<AnalyticsTracker />`
  reports each route change itself, after `useSEO()` has set the page title.
- Nothing is tracked in dev (`pnpm dev`) or during the prerender crawl, so builds
  don't show up as traffic and the tracker never bakes into the static HTML.
- `trackEvent(name, data?)` from `@/lib/analytics` is the way to add further events.

## i18n

`useI18n()` selects the language. Marketing copy is in
`src/components/MarketingLayout.tsx`, workshop copy in
`src/components/workshop/content.ts`, and contact copy in `src/pages/Contact.tsx`.
The browser tests exercise both languages. `pnpm translations:check` checks the
legacy translation dictionaries, not the page-local marketing copy.
