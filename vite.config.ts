/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ isSsrBuild }) => ({
  // Any Host header is accepted so the dev server can be previewed over LAN/Tailscale hostnames.
  server: { port: Number(process.env.PORT) || 4400, host: '0.0.0.0', allowedHosts: true },
  preview: { port: Number(process.env.PORT) || 4500, host: '0.0.0.0', allowedHosts: true },
  plugins: [tailwindcss(), react()],
  build: {
    // The SSR bundle only exists to prerender HTML; it doesn't need its own copy of the assets.
    copyPublicDir: !isSsrBuild,
    target: 'es2022',
  },
  test: {
    environment: 'node',
    include: ['src/**/*.spec.ts', 'scripts/**/*.spec.mjs'],
  },
}));
