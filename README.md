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

## i18n

All user-facing strings go through `useI18n()`. Translations live in `src/contexts/i18n.tsx`. Run `pnpm translations:check` to verify all keys are present in both languages.
