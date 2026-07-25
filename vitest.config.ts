import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: [
      "src/**/*.{test,spec}.{ts,tsx}",
      "scripts/**/*.{test,spec}.{ts,mjs}",
    ],
    css: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: [
        "src/lib/**",
        "src/components/**",
        "src/pages/**",
        "src/contexts/**",
      ],
      exclude: ["src/components/ui/**"],
    },
  },
});
