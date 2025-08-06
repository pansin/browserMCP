/**
 * Core type definitions for the Browser MCP Server
 */
import { z } from 'zod';
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
export interface NavigationOptions {
    waitUntil?: 'load' | 'domcontentloaded' | 'networkidle0' | 'networkidle2';
    timeout?: number;
    referer?: string;
}
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
export interface BrowserConfig {
    launchOptions: {
        headless: boolean;
        devtools: boolean;
        args: string[];
    };
    defaults: {
        timeout: number;
        viewport: {
            width: number;
            height: number;
        };
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
export interface LogEntry {
    timestamp: Date;
    level: 'debug' | 'info' | 'warn' | 'error';
    category: 'navigation' | 'interaction' | 'extraction' | 'system';
    message: string;
    metadata?: Record<string, any>;
}
export declare const NavigationOptionsSchema: z.ZodObject<{
    waitUntil: z.ZodOptional<z.ZodEnum<["load", "domcontentloaded", "networkidle0", "networkidle2"]>>;
    timeout: z.ZodOptional<z.ZodNumber>;
    referer: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    waitUntil?: "load" | "domcontentloaded" | "networkidle0" | "networkidle2" | undefined;
    timeout?: number | undefined;
    referer?: string | undefined;
}, {
    waitUntil?: "load" | "domcontentloaded" | "networkidle0" | "networkidle2" | undefined;
    timeout?: number | undefined;
    referer?: string | undefined;
}>;
export declare const ScreenshotOptionsSchema: z.ZodObject<{
    fullPage: z.ZodOptional<z.ZodBoolean>;
    clip: z.ZodOptional<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        width: z.ZodNumber;
        height: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        width: number;
        height: number;
    }, {
        x: number;
        y: number;
        width: number;
        height: number;
    }>>;
    quality: z.ZodOptional<z.ZodNumber>;
    format: z.ZodOptional<z.ZodEnum<["png", "jpeg", "webp"]>>;
}, "strip", z.ZodTypeAny, {
    fullPage?: boolean | undefined;
    clip?: {
        x: number;
        y: number;
        width: number;
        height: number;
    } | undefined;
    quality?: number | undefined;
    format?: "png" | "jpeg" | "webp" | undefined;
}, {
    fullPage?: boolean | undefined;
    clip?: {
        x: number;
        y: number;
        width: number;
        height: number;
    } | undefined;
    quality?: number | undefined;
    format?: "png" | "jpeg" | "webp" | undefined;
}>;
export declare const BrowserConfigSchema: z.ZodObject<{
    launchOptions: z.ZodObject<{
        headless: z.ZodBoolean;
        devtools: z.ZodBoolean;
        args: z.ZodArray<z.ZodString, "many">;
    }, "strip", z.ZodTypeAny, {
        headless: boolean;
        devtools: boolean;
        args: string[];
    }, {
        headless: boolean;
        devtools: boolean;
        args: string[];
    }>;
    defaults: z.ZodObject<{
        timeout: z.ZodNumber;
        viewport: z.ZodObject<{
            width: z.ZodNumber;
            height: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            width: number;
            height: number;
        }, {
            width: number;
            height: number;
        }>;
        userAgent: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        timeout: number;
        viewport: {
            width: number;
            height: number;
        };
        userAgent?: string | undefined;
    }, {
        timeout: number;
        viewport: {
            width: number;
            height: number;
        };
        userAgent?: string | undefined;
    }>;
    downloads: z.ZodObject<{
        directory: z.ZodString;
        behavior: z.ZodEnum<["allow", "deny", "allowAndName"]>;
    }, "strip", z.ZodTypeAny, {
        directory: string;
        behavior: "allow" | "deny" | "allowAndName";
    }, {
        directory: string;
        behavior: "allow" | "deny" | "allowAndName";
    }>;
    security: z.ZodObject<{
        allowedDomains: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        blockedDomains: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        maxPages: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        maxPages: number;
        allowedDomains?: string[] | undefined;
        blockedDomains?: string[] | undefined;
    }, {
        maxPages: number;
        allowedDomains?: string[] | undefined;
        blockedDomains?: string[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    launchOptions: {
        headless: boolean;
        devtools: boolean;
        args: string[];
    };
    defaults: {
        timeout: number;
        viewport: {
            width: number;
            height: number;
        };
        userAgent?: string | undefined;
    };
    downloads: {
        directory: string;
        behavior: "allow" | "deny" | "allowAndName";
    };
    security: {
        maxPages: number;
        allowedDomains?: string[] | undefined;
        blockedDomains?: string[] | undefined;
    };
}, {
    launchOptions: {
        headless: boolean;
        devtools: boolean;
        args: string[];
    };
    defaults: {
        timeout: number;
        viewport: {
            width: number;
            height: number;
        };
        userAgent?: string | undefined;
    };
    downloads: {
        directory: string;
        behavior: "allow" | "deny" | "allowAndName";
    };
    security: {
        maxPages: number;
        allowedDomains?: string[] | undefined;
        blockedDomains?: string[] | undefined;
    };
}>;
//# sourceMappingURL=index.d.ts.map