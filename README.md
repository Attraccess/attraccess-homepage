# Attraccess Homepage

The marketing homepage for [Attraccess](https://github.com/Attraccess/Attraccess) — Access and Lifecycle management for shared resources like machines, tools and doors.

## Tech Stack

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

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
```

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

All user-facing strings go through `useI18n()`. Translations live in `src/contexts/i18n.tsx`. Run `pnpm translations:check` to verify all keys are present in both languages.
