/**
 * Tool interfaces for MCP browser automation
 */
import { NavigationOptions, ScreenshotOptions, PageMetadata } from '../types/index.js';
export interface NavigationTools {
    /**
     * Navigate to specified URL
     */
    navigate(url: string, options?: NavigationOptions): Promise<void>;
    /**
     * Refresh current page
     */
    refresh(): Promise<void>;
    /**
     * Go back to previous page
     */
    goBack(): Promise<void>;
    /**
     * Go forward to next page
     */
    goForward(): Promise<void>;
}
export interface ContentTools {
    /**
     * Get page HTML source code
     */
    getPageSource(): Promise<string>;
    /**
     * Get page metadata
     */
    getPageMetadata(): Promise<PageMetadata>;
    /**
     * Take page screenshot
     */
    takeScreenshot(options?: ScreenshotOptions): Promise<Buffer>;
    /**
     * Extract text content from page
     */
    extractText(selector?: string): Promise<string>;
}
export interface InteractionTools {
    /**
     * Click on element
     */
    click(selector: string): Promise<void>;
    /**
     * Type text into element
     */
    type(selector: string, text: string): Promise<void>;
    /**
     * Select dropdown option
     */
    select(selector: string, value: string): Promise<void>;
    /**
     * Wait for element to appear
     */
    waitForElement(selector: string, timeout?: number): Promise<void>;
}
export interface TestingTools {
    /**
     * Check if element exists
     */
    elementExists(selector: string): Promise<boolean>;
    /**
     * Check if text exists on page
     */
    textExists(text: string): Promise<boolean>;
    /**
     * Get element attribute value
     */
    getAttribute(selector: string, attribute: string): Promise<string>;
    /**
     * Execute JavaScript code in page context
     */
    evaluateScript(script: string): Promise<any>;
}
export interface BrowserTools extends NavigationTools, ContentTools, InteractionTools, TestingTools {
}
//# sourceMappingURL=tools.d.ts.map