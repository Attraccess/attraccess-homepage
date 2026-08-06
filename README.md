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

Page views and a couple of conversion events go to a self-hosted [Matomo](https://matomo.org/).
Configuration lives in `src/lib/analytics.ts`; copy `.env.example` to `.env` (or set the
variables in the build environment) to enable it:

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_MATOMO_HOST` | — | Matomo host, e.g. `analytics.attraccess.org`. **Analytics is disabled when unset.** |
| `VITE_MATOMO_SITE_ID` | `1` | Site id in Matomo |
| `VITE_MATOMO_SCRIPT` | `not_matomo.js` | Renamed `matomo.js` on the instance |
| `VITE_MATOMO_TRACKER` | `matomo.php` | Renamed `matomo.php` on the instance |

These are inlined at build time, so they must be set for `pnpm build` — not at runtime.

Notes:

- Cookies are disabled (`disableCookies`), so no consent banner is required.
- Nothing is tracked in dev (`pnpm dev`) or during the prerender crawl, so builds
  don't show up as traffic and the tracker never bakes into the static HTML.
- `trackEvent(category, action)` from `@/lib/analytics` is the way to add further events.

## i18n

All user-facing strings go through `useI18n()`. Translations live in `src/contexts/i18n.tsx`. Run `pnpm translations:check` to verify all keys are present in both languages.
