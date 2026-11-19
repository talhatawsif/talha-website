import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  webServer: { command: "npm run start -- -p 3100", url: "http://localhost:3100", reuseExistingServer: false },
  use: { baseURL: "http://localhost:3100" },
});
