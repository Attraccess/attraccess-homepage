# Attraccess homepage

Everything behind [attraccess.org](https://attraccess.org), as one pnpm workspace:

| Path | What |
| --- | --- |
| [`apps/web`](apps/web) | The marketing site (Vite + React, prerendered to static HTML). Deployed from `main`. |
| [`apps/hero-film`](apps/hero-film) | The "Closed Loop" hero film: Remotion source, capture tools, source captures and production docs. Its web exports ship in `apps/web/public/hero-film`. |

```sh
pnpm install
pnpm dev                 # site on http://localhost:4400
pnpm build               # static site → apps/web/dist/
pnpm lint && pnpm typecheck && pnpm test
pnpm film:studio         # Remotion Studio for the hero film
```

Hero film media is stored in Git LFS. The site builds without it, so `git lfs pull` is only needed to
work on the film. Deployment and site details: [`apps/web/README.md`](apps/web/README.md).
