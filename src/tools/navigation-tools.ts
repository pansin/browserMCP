/**
 * 导航工具实现
 */

import { z } from 'zod';
import { BaseTool } from './base-tool.js';
import { NavigationTools } from '../interfaces/tools.js';
import { NavigationOptions, NavigationOptionsSchema } from '../types/index.js';
import { NavigationError } from '../errors/index.js';
import { ToolExecutionContext } from '../interfaces/mcp.js';

export class NavigateTool extends BaseTool {
  private pageController: any;
  
  constructor(pageController: any) {
    super(
      'navigate',
      '导航到指定URL',
      z.object({
        url: z.string().url('必须提供有效的URL'),
        waitUntil: z.enum(['load', 'domcontentloaded', 'networkidle0', 'networkidle2']).optional(),
        timeout: z.number().positive().optional(),
        referer: z.string().optional()
      })
    );
    
    this.pageController = pageController;
  }
  
  protected async run(args: { url: string } & Partial<NavigationOptions>): Promise<{ success: boolean; url: string }> {
    try {
      const options: NavigationOptions = {
        waitUntil: args.waitUntil,
        timeout: args.timeout,
        referer: args.referer
      };
      
      await this.pageController.navigate(args.url, options);
      
      return {
        success: true,
        url: args.url
      };
    } catch (error) {
      throw new NavigationError(`导航到 ${args.url} 失败: ${(error as Error).message}`, error as Error);
    }
  }
}

export class RefreshTool extends BaseTool {
  private pageController: any;
  
  constructor(pageController: any) {
    super(
      'refresh',
      '刷新当前页面',
      z.object({})
    );
    
    this.pageController = pageController;
  }
  
  protected async run(): Promise<{ success: boolean }> {
    try {
      const page = this.pageController.getCurrentPage();
      this.validatePage(page);
      
      await page.reload({ waitUntil: 'load' });
      
      return { success: true };
    } catch (error) {
      throw new NavigationError(`刷新页面失败: ${(error as Error).message}`, error as Error);
    }
  }
}

export class GoBackTool extends BaseTool {
  private pageController: any;
  
  constructor(pageController: any) {
    super(
      'goBack',
      '返回上一页',
      z.object({})
    );
    
    this.pageController = pageController;
  }
  
  protected async run(): Promise<{ success: boolean }> {
    try {
      const page = this.pageController.getCurrentPage();
      this.validatePage(page);
      
      await page.goBack({ waitUntil: 'load' });
      
      return { success: true };
    } catch (error) {
      throw new NavigationError(`返回上一页失败: ${(error as Error).message}`, error as Error);
    }
  }
}

export class GoForwardTool extends BaseTool {
  private pageController: any;
  
  constructor(pageController: any) {
    super(
      'goForward',
      '前进到下一页',
      z.object({})
    );
    
    this.pageController = pageController;
  }
  
  protected async run(): Promise<{ success: boolean }> {
    try {
      const page = this.pageController.getCurrentPage();
      this.validatePage(page);
      
      await page.goForward({ waitUntil: 'load' });
      
      return { success: true };
    } catch (error) {
      throw new NavigationError(`前进到下一页失败: ${(error as Error).message}`, error as Error);
    }
  }
}