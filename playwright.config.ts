import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  use: { baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3000" },
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : { command: "npm run start", port: 3000, reuseExistingServer: true, timeout: 120_000 },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "android", use: { ...devices["Pixel 7"] } },
    { name: "iphone", use: { ...devices["iPhone 14"], browserName: "chromium" } },
  ],
});
