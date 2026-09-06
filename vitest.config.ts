import { defineConfig } from "vitest/config";

// `.test.ts` is reserved for vitest; Playwright e2e specs in `tests/` use `.spec.ts`.
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    exclude: [
      "node_modules",
      "dist",
      ".astro",
      "tests",
      "playwright-report",
      "test-results",
    ],
    environment: "node",
    globals: true,
  },
});
