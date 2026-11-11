import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  // WebGL capture shares the renderer with canvas and interaction checks.
  workers: 1,
  retries: 0,
  use: {
    baseURL: 'http://127.0.0.1:4327',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4327 --strictPort',
    url: 'http://127.0.0.1:4327',
    reuseExistingServer: false,
  },
});