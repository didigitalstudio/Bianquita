import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

/**
 * Vitest config — splits projects so component tests run in jsdom and
 * server-side tests (helpers, RLS, email) run in node, sharing one CLI.
 *
 * Run modes:
 *   npm run test         → all projects
 *   npm run test:unit    → only the "unit" project (jsdom)
 *   npm run test:server  → only the "server" project (node)
 *   npm run test:db      → only the "db" project (node, against staging)
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Stub Next.js's `server-only` guard so server modules can be imported in tests.
      "server-only": path.resolve(__dirname, "./tests/setup/server-only-stub.ts"),
    },
  },
  test: {
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.d.ts",
        "src/**/*.test.{ts,tsx}",
        "src/lib/supabase/database.types.ts",
        "src/app/**/layout.tsx",
        "src/app/**/page.tsx", // pages exercised by E2E
      ],
    },
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          environment: "jsdom",
          include: ["tests/unit/**/*.test.{ts,tsx}"],
          setupFiles: ["./tests/setup/vitest.setup.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "server",
          environment: "node",
          include: ["tests/server/**/*.test.ts"],
          setupFiles: ["./tests/setup/vitest.server.setup.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "db",
          environment: "node",
          include: ["tests/db/**/*.test.ts"],
          // No global setup — each test loads STAGING env explicitly to
          // avoid accidentally touching prod.
          setupFiles: ["./tests/setup/vitest.db.setup.ts"],
          // Sequential — RLS tests share the staging DB.
          fileParallelism: false,
        },
      },
    ],
  },
});
