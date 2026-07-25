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

# Tests
pnpm test
```

## i18n

All user-facing strings go through `useI18n()`. Translations live in `src/contexts/i18n.tsx`. Run `pnpm translations:check` to verify all keys are present in both languages.

`t()` takes optional parameters for `{placeholder}` tokens:

```tsx
t("home.pricing.billed-annually", { total: "€900" });
// "Billed annually · €900 / year — 2 months free"
```

## Media and the demo video

`src/lib/media.ts` is the registry for marketing imagery. Assets that have not been produced yet are declared with `src: null` and render as a labelled placeholder naming what belongs in the slot, so filling one in is a one-line change.

The same file holds `DEMO_VIDEO`. Set its `url` to a YouTube, Vimeo or direct `.mp4` link and the "How it works" page swaps its "book a live demo" fallback for a click-to-load player. No other change is needed.
