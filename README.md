# Attraccess homepage

The marketing site for [Attraccess](https://github.com/Attraccess/Attraccess) at
[attraccess.org](https://attraccess.org): machine access control for companies, research labs and
universities.

Vite + React + [HeroUI](https://heroui.com) + Tailwind, with [Motion](https://motion.dev) and
[Lenis](https://lenis.darkroom.engineering) for animation. `pnpm build` prerenders every page to static
HTML in `dist/`, so any static web server can host it.

```sh
pnpm install
pnpm dev            # http://localhost:4400
pnpm build          # static site → dist/
pnpm preview        # serve dist/ on http://localhost:4500
pnpm lint && pnpm typecheck && pnpm test
pnpm check:links    # after a build; add --external to also request every outside URL
```

## Deployment

Production runs in the `netcup` Coolify context at `https://coolify.apps.janjaap.de`.
The `attraccess-homepage` application (`fas9ni9lacimviajcp3cjx3a`) deploys this
repository's `main` branch automatically with Railpack, static hosting, and `/dist`
as the publish directory. Keep SPA fallback disabled: all pages are prerendered.
Its custom nginx configuration is versioned in `deployment/nginx.conf`, including
the custom error page and real HTTP 404 responses for missing routes and assets.

```sh
coolify --context netcup app get fas9ni9lacimviajcp3cjx3a
coolify --context netcup app deployments list fas9ni9lacimviajcp3cjx3a
# Only when a main-branch push did not already queue a deployment:
coolify --context netcup deploy uuid fas9ni9lacimviajcp3cjx3a
```

Keep the existing `VITE_UMAMI_*` variables enabled at build time. Deploying only
requires the production build; the screenshot pipeline runs locally when product
captures need refreshing.

## Pages

| Path | Page |
| --- | --- |
| `/`, `/de/` | Home (English, German) |
| `/contact`, `/de/contact` | Contact – prepares an email, nothing is sent to the site |
| `/credits`, `/de/credits` | Image credits & licenses |
| `/datenschutz`, `/agb`, `/impressum` | Legal pages (German only) |
| `/404` | Not found (`dist/404.html`) |

Routes live in `src/lib/routes.ts`; prerendering, the sitemap, the language switch and the language
redirect all read from there.

## Language and theme

- **Language** – on first visit, the pre-paint script in `index.html` sends visitors to the English or
  German version based on their browser's preferred languages. The language switch remembers an
  explicit choice (`?lang=` + `localStorage.language`). Crawlers are never redirected, and every page
  carries `hreflang` alternates.
- **Theme** – follows the operating system (live) until someone uses the toggle
  (`localStorage.theme`).

Both storage keys are documented in the privacy policy (`/datenschutz`, section 3). Keep them in sync.

## Analytics

Self-hosted [Umami](https://umami.is) without cookies, configured at **build time**:

| Variable | Purpose |
| --- | --- |
| `VITE_UMAMI_HOST` | Umami host, e.g. `umami.example.org`. Analytics is off when unset. |
| `VITE_UMAMI_WEBSITE_ID` | Website id from Umami. Analytics is off when unset. |
| `VITE_UMAMI_SCRIPT` | Renamed tracker script (default `script.js`). |

Nothing is tracked in dev builds. Besides page views, only `contact-submit` and `newsletter-subscribe` are
recorded, as listed in the privacy policy (section 4). Update the policy before tracking anything else.

## Product screenshots

Every screenshot is a real capture of the Attraccess app, running against a throw-away database
filled with a fictional makerspace. One command regenerates all of them (both languages and themes,
desktop and mobile) plus the Open Graph images. It needs a bootstrapped checkout of the main repo:

```sh
ATTRACCESS_REPO=../Attraccess pnpm screenshots            # or: --locale de --only resources,kiosk
```

Per language it starts `pnpm serve` in that checkout with `STORAGE_ROOT=storage/website-demo-<locale>`
(gitignored there, the normal dev database is untouched), seeds members, machines, introductions,
maintenance, usage history, projects, billing and the laser cutter's flow (`scripts/seed-demo.mjs`), then
captures with Playwright (`scripts/capture-screenshots.mjs`). Full-size PNGs go to `screenshots-raw/`
(gitignored); `scripts/optimize-screenshots.mjs` writes the WebP files in `public/screenshots/`.
Demo logins: `alex.morgan` (en) / `anna.becker` (de), password `Demo1234!`.

Machine and project photos in the demo data are CC BY 2.0 / CC0 images. Their attribution lives in
`demo/images/credits.json`, which feeds the `/credits` page. A test rejects other licenses (no
ShareAlike, since cropped copies end up inside our screenshots).

## Interactive reader

The "Try the reader" section is an HTML twin of the Attractap firmware: the CAD render and screen
geometry come from the desktop simulator, colours from the firmware's `theme.hpp` and the font is
Montserrat, like on the device. The state machine is `src/lib/reader.ts` (unit-tested). The session
summary screen is being brought to the real firmware in ATT-1139.
