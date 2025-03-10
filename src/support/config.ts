import {LaunchOptions} from '@playwright/test';

/**
 * Supported browsers: 'chromium', 'firefox', 'webkit'.
 */
type BrowserType = 'chromium' | 'firefox' | 'webkit';

/**
 * Launch options for the browser.
 */
const launchOptions: LaunchOptions = {
  headless: true,
  tracesDir: 'traces/',
};

/**
 * Reusable project configuration.
 */
export const config = {
  browser: (process.env.BROWSER ?? 'chromium') as BrowserType,
  launchOptions,
  BASE_URL: process.env.BASEURL ?? 'https://www.google.com/travel',
  IMG_THRESHOLD: {threshold: 0.4},
  BASE_API_URI: process.env.APIURL
};
