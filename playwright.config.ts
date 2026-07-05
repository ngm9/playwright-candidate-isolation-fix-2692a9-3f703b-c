import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:3456',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  webServer: {
    command: 'node server.js',
    url: 'http://localhost:3456/candidates',
    reuseExistingServer: false,
    timeout: 15_000,
  },
});
