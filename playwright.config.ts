import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config.
 *
 * Local: spins up `npm run dev` and runs against http://localhost:3000.
 * CI:    consumes BASE_URL (set by the workflow to the Vercel preview).
 *
 * Set CI=true to disable retries-on-first-run and force one worker per spec.
 */
const baseURL = process.env.BASE_URL ?? "http://localhost:3000";
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  reporter: isCI
    ? [
        ["github"],
        ["html", { open: "never", outputFolder: "playwright-report" }],
        ["json", { outputFile: "playwright-report/results.json" }],
      ]
    : [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    // Mobile project — verifies the responsive work doesn't regress
    { name: "mobile-chrome", use: { ...devices["Pixel 7"] } },
  ],
  // Only spin up the dev server locally. In CI we test the Vercel preview.
  webServer: isCI
    ? undefined
    : {
        command: "npm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
