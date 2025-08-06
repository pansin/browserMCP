/**
 * Core type definitions for the Browser MCP Server
 */
import { z } from 'zod';
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
//# sourceMappingURL=index.js.map