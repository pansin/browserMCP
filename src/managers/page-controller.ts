/**
 * 页面控制器实现
 */

import { Page } from 'puppeteer';
import { IPageController } from '../interfaces/browser.js';
import { NavigationOptions } from '../types/index.js';
import { NavigationError, SecurityError } from '../errors/index.js';

export class PageController implements IPageController {
  private currentPage: Page | null = null;
  private allowedDomains: string[] | undefined;
  private blockedDomains: string[] | undefined;

  constructor(allowedDomains?: string[], blockedDomains?: string[]) {
    this.allowedDomains = allowedDomains;
    this.blockedDomains = blockedDomains;
  }

  /**
   * 获取当前页面
   */
  getCurrentPage(): Page | null {
    return this.currentPage;
  }

  /**
   * 设置当前页面
   */
  setCurrentPage(page: Page): void {
    this.currentPage = page;
  }

  /**
   * 导航到指定URL
   */
  async navigate(url: string, options?: NavigationOptions): Promise<void> {
    if (!this.currentPage) {
      throw new NavigationError('没有活动页面可导航');
    }

    // 检查URL是否符合安全策略
    this.validateUrl(url);

    try {
      await this.currentPage.goto(url, {
        waitUntil: options?.waitUntil || 'load',
        timeout: options?.timeout,
        referer: options?.referer
      });
    } catch (error) {
      throw new NavigationError(`导航到 ${url} 失败`, error as Error);
    }
  }

  /**
   * 等待页面准备就绪
   */
  async waitForReady(): Promise<void> {
    if (!this.currentPage) {
      throw new NavigationError('没有活动页面可等待');
    }

    try {
      // 等待页面加载完成
      await this.currentPage.waitForFunction(() => {
        return document.readyState === 'complete';
      }, { timeout: 30000 });
    } catch (error) {
      throw new NavigationError('等待页面准备就绪超时', error as Error);
    }
  }

  /**
   * 处理页面错误
   */
  async handleError(error: Error): Promise<void> {
    console.error('页面错误:', error);
    
    // 如果有当前页面，尝试获取当前URL和标题
    if (this.currentPage) {
      try {
        const url = this.currentPage.url();
        const title = await this.currentPage.title();
        console.error(`错误发生在页面: ${title} (${url})`);
      } catch (e) {
        console.error('无法获取页面信息:', e);
      }
    }
  }

  /**
   * 验证URL是否符合安全策略
   */
  private validateUrl(url: string): void {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;

      // 检查是否在阻止列表中
      if (this.blockedDomains && this.blockedDomains.length > 0) {
        if (this.blockedDomains.some(domain => hostname === domain || hostname.endsWith(`.${domain}`))) {
          throw new SecurityError(`域名 ${hostname} 在阻止列表中`);
        }
      }

      // 检查是否在允许列表中（如果有设置）
      if (this.allowedDomains && this.allowedDomains.length > 0) {
        if (!this.allowedDomains.some(domain => hostname === domain || hostname.endsWith(`.${domain}`))) {
          throw new SecurityError(`域名 ${hostname} 不在允许列表中`);
        }
      }
    } catch (error) {
      if (error instanceof SecurityError) {
        throw error;
      }
      throw new NavigationError(`无效的URL: ${url}`, error as Error);
    }
  }
}