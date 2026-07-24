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
t("blog.reading-time", { minutes: post.readingMinutes }); // "6 min read"
```

## Media and the demo video

`src/lib/media.ts` is the registry for marketing imagery. Assets that have not been produced yet are declared with `src: null` and render as a labelled placeholder naming what belongs in the slot, so filling one in is a one-line change.

The same file holds `DEMO_VIDEO`. Set its `url` to a YouTube, Vimeo or direct `.mp4` link and the "How it works" page swaps its "book a live demo" fallback for a click-to-load player. No other change is needed.

## Blog

The Ghost feed sends no CORS headers, so it cannot be read from the browser. `pnpm blog:fetch` (also run as part of `pnpm build`) snapshots it into `src/lib/blog-posts.json`, which the Blog page imports. If the feed is unreachable the committed snapshot is kept and the build continues.

Which article leads the page is controlled by `PINNED_SLUGS` in `src/lib/blog.ts`.
