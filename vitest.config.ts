import { fileURLToPath } from "node:url"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    css: true,
    environment: "jsdom",
    exclude: ["node_modules", ".next", "tests/e2e"],
    include: ["tests/**/*.{test,spec}.{ts,tsx}"],
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      include: [
        "src/components/landing/**",
        "src/components/auth/header-auth.tsx",
        "src/components/auth/auth-gate-action.tsx",
        "src/components/auth/sign-in-button.tsx",
        "src/components/auth/user-menu.tsx",
        "src/components/brand/**",
        "src/components/social/**",
        "src/components/marquee/infinite-marquee.tsx",
        "src/components/marquee/infinite-marquee/marquee-track.tsx",
        "src/components/marquee/infinite-marquee/marquee-group.tsx",
        "src/components/marquee/infinite-marquee/constants.tsx",
        "src/components/marquee/infinite-marquee/utils.ts",
        "src/components/effects/madness-text/madness-text.tsx",
        "src/components/ui/button.tsx",
        "src/lib/content/landing.content.ts",
      ],
      thresholds: {
        branches: 80,
        functions: 85,
        lines: 85,
        statements: 85,
      },
    },
  },
})
