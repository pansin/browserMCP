/**
 * Browser management interfaces
 */

import { Browser, Page } from 'puppeteer';
import { BrowserConfig } from '../types/index.js';

// Browser manager interface
export interface IBrowserManager {
  /**
   * Initialize browser manager
   */
  initialize(): Promise<void>;
  
  /**
   * Create a new page
   */
  createPage(pageId?: string): Promise<string>;
  
  /**
   * Get existing page by ID
   */
  getPage(pageId: string): Promise<Page>;
  
  /**
   * Close page by ID
   */
  closePage(pageId: string): Promise<void>;
  
  /**
   * Cleanup all resources
   */
  cleanup(): Promise<void>;
  
  /**
   * Get browser instance
   */
  getBrowser(): Browser | null;
  
  /**
   * Check if browser is running
   */
  isRunning(): boolean;
}

// Page controller interface
export interface IPageController {
  /**
   * Get current page
   */
  getCurrentPage(): Page | null;
  
  /**
   * Set current page
   */
  setCurrentPage(page: Page): void;
  
  /**
   * Navigate to URL
   */
  navigate(url: string, options?: any): Promise<void>;
  
  /**
   * Wait for page to be ready
   */
  waitForReady(): Promise<void>;
  
  /**
   * Handle page errors
   */
  handleError(error: Error): Promise<void>;
}

// Configuration manager interface
export interface IConfigManager {
  /**
   * Load configuration
   */
  loadConfig(): Promise<BrowserConfig>;
  
  /**
   * Save configuration
   */
  saveConfig(config: BrowserConfig): Promise<void>;
  
  /**
   * Get default configuration
   */
  getDefaultConfig(): BrowserConfig;
  
  /**
   * Validate configuration
   */
  validateConfig(config: any): BrowserConfig;
}