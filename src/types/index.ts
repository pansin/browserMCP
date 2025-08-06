/**
 * Core type definitions for the Browser MCP Server
 */

import { z } from 'zod';

// Page metadata interface
export interface PageMetadata {
  title: string;
  description?: string;
  keywords?: string[];
  author?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  viewport?: string;
  charset?: string;
}

// Navigation options
export interface NavigationOptions {
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle0' | 'networkidle2';
  timeout?: number;
  referer?: string;
}

// Screenshot options
export interface ScreenshotOptions {
  fullPage?: boolean;
  clip?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  quality?: number;
  format?: 'png' | 'jpeg' | 'webp';
}

// Browser configuration
export interface BrowserConfig {
  launchOptions: {
    headless: boolean;
    devtools: boolean;
    args: string[];
  };
  defaults: {
    timeout: number;
    viewport: { width: number; height: number };
    userAgent?: string;
  };
  downloads: {
    directory: string;
    behavior: 'allow' | 'deny' | 'allowAndName';
  };
  security: {
    allowedDomains?: string[];
    blockedDomains?: string[];
    maxPages: number;
  };
}

// Test environment configuration
export interface TestEnvironment {
  testServer: {
    port: number;
    staticFiles: string;
  };
  mockSites: {
    [siteName: string]: string;
  };
  browserConfig: BrowserConfig;
}

// Log entry interface
export interface LogEntry {
  timestamp: Date;
  level: 'debug' | 'info' | 'warn' | 'error';
  category: 'navigation' | 'interaction' | 'extraction' | 'system';
  message: string;
  metadata?: Record<string, any>;
}

// Zod schemas for validation
export const NavigationOptionsSchema = z.object({
  waitUntil: z.enum(['load', 'domcontentloaded', 'networkidle0', 'networkidle2']).optional(),
  timeout: z.number().positive().optional(),
  referer: z.string().url().optional()
});

export const ScreenshotOptionsSchema = z.object({
  fullPage: z.boolean().optional(),
  clip: z.object({
    x: z.number().nonnegative(),
    y: z.number().nonnegative(),
    width: z.number().positive(),
    height: z.number().positive()
  }).optional(),
  quality: z.number().min(0).max(100).optional(),
  format: z.enum(['png', 'jpeg', 'webp']).optional()
});

export const BrowserConfigSchema = z.object({
  launchOptions: z.object({
    headless: z.boolean(),
    devtools: z.boolean(),
    args: z.array(z.string())
  }),
  defaults: z.object({
    timeout: z.number().positive(),
    viewport: z.object({
      width: z.number().positive(),
      height: z.number().positive()
    }),
    userAgent: z.string().optional()
  }),
  downloads: z.object({
    directory: z.string(),
    behavior: z.enum(['allow', 'deny', 'allowAndName'])
  }),
  security: z.object({
    allowedDomains: z.array(z.string()).optional(),
    blockedDomains: z.array(z.string()).optional(),
    maxPages: z.number().positive()
  })
});