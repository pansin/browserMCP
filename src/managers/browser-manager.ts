/**
 * 浏览器管理器实现
 */

import puppeteer, { Browser, Page } from 'puppeteer';
import { IBrowserManager } from '../interfaces/browser.js';
import { BrowserConfig } from '../types/index.js';
import { BrowserCrashError, ConfigurationError } from '../errors/index.js';

export class BrowserManager implements IBrowserManager {
  private browser: Browser | null = null;
  private pages: Map<string, Page> = new Map();
  private config: BrowserConfig;
  private isInitialized = false;

  constructor(config: BrowserConfig) {
    this.config = config;
  }

  /**
   * 初始化浏览器管理器
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      this.browser = await puppeteer.launch(this.config.launchOptions);
      
      // 监听浏览器断开事件
      this.browser.on('disconnected', () => {
        this.browser = null;
        this.pages.clear();
        this.isInitialized = false;
        console.error('浏览器意外断开连接');
      });
      
      this.isInitialized = true;
      console.log('浏览器管理器已初始化');
    } catch (error) {
      throw new BrowserCrashError('无法启动浏览器', error as Error);
    }
  }

  /**
   * 创建新页面
   */
  async createPage(pageId?: string): Promise<string> {
    if (!this.browser) {
      await this.initialize();
    }

    if (!this.browser) {
      throw new BrowserCrashError('浏览器未初始化');
    }

    // 检查是否超过最大页面数量限制
    if (this.pages.size >= this.config.security.maxPages) {
      throw new ConfigurationError(`已达到最大页面数量限制 (${this.config.security.maxPages})`);
    }

    // 生成唯一页面ID
    const id = pageId || `page_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // 创建新页面
    const page = await this.browser.newPage();
    
    // 设置视口大小
    await page.setViewport(this.config.defaults.viewport);
    
    // 设置用户代理（如果配置中有）
    if (this.config.defaults.userAgent) {
      await page.setUserAgent(this.config.defaults.userAgent);
    }
    
    // 设置默认超时
    page.setDefaultTimeout(this.config.defaults.timeout);
    
    // 存储页面引用
    this.pages.set(id, page);
    
    return id;
  }

  /**
   * 根据ID获取页面
   */
  async getPage(pageId: string): Promise<Page> {
    const page = this.pages.get(pageId);
    
    if (!page) {
      throw new ConfigurationError(`找不到ID为 ${pageId} 的页面`);
    }
    
    return page;
  }

  /**
   * 根据ID关闭页面
   */
  async closePage(pageId: string): Promise<void> {
    const page = this.pages.get(pageId);
    
    if (!page) {
      return; // 如果页面不存在，直接返回
    }
    
    try {
      await page.close();
    } catch (error) {
      console.error(`关闭页面 ${pageId} 时出错:`, error);
    } finally {
      this.pages.delete(pageId);
    }
  }

  /**
   * 清理所有资源
   */
  async cleanup(): Promise<void> {
    // 关闭所有页面
    for (const [pageId, page] of this.pages.entries()) {
      try {
        await page.close();
      } catch (error) {
        console.error(`关闭页面 ${pageId} 时出错:`, error);
      }
    }
    
    this.pages.clear();
    
    // 关闭浏览器
    if (this.browser) {
      try {
        await this.browser.close();
      } catch (error) {
        console.error('关闭浏览器时出错:', error);
      }
      
      this.browser = null;
    }
    
    this.isInitialized = false;
    console.log('浏览器管理器已清理');
  }

  /**
   * 获取浏览器实例
   */
  getBrowser(): Browser | null {
    return this.browser;
  }

  /**
   * 检查浏览器是否运行中
   */
  isRunning(): boolean {
    return this.browser !== null && this.isInitialized;
  }
}