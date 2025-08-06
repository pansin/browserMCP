/**
 * Default configuration for Browser MCP Server
 */

import { BrowserConfig } from '../types/index.js';

export const DEFAULT_CONFIG: BrowserConfig = {
  launchOptions: {
    headless: true,
    devtools: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ]
  },
  defaults: {
    timeout: 30000,
    viewport: {
      width: 1280,
      height: 720
    },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  },
  downloads: {
    directory: './downloads',
    behavior: 'allow'
  },
  security: {
    allowedDomains: [],
    blockedDomains: [],
    maxPages: 10
  }
};