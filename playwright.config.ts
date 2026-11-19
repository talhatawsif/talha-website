import { defineConfig } from "@playwright/test";

// BASE_URL=https://… runs the suite against a live site instead of a local build.
const base = process.env.BASE_URL;

export default defineConfig({
  testDir: "tests/e2e",
  webServer: base ? undefined : { command: "npm run start -- -p 3100", url: "http://localhost:3100", reuseExistingServer: false },
  use: { baseURL: base ?? "http://localhost:3100" },
});
