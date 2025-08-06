/**
 * 元素交互工具实现
 */

import { z } from 'zod';
import { BaseTool } from './base-tool.js';
import { ElementNotFoundError, TimeoutError, ToolExecutionError } from '../errors/index.js';
import { ToolExecutionContext } from '../interfaces/mcp.js';

export class ClickTool extends BaseTool {
  private pageController: any;
  
  constructor(pageController: any) {
    super(
      'click',
      '点击页面元素',
      z.object({
        selector: z.string().min(1, '必须提供有效的选择器'),
        timeout: z.number().positive().optional()
      })
    );
    
    this.pageController = pageController;
  }
  
  protected async run(args: { selector: string; timeout?: number }): Promise<{ success: boolean }> {
    try {
      const page = this.pageController.getCurrentPage();
      this.validatePage(page);
      
      const timeout = args.timeout || 5000;
      
      // 等待元素出现
      try {
        await page.waitForSelector(args.selector, { timeout });
      } catch (error) {
        throw new ElementNotFoundError(`找不到元素: ${args.selector}`, error as Error);
      }
      
      // 点击元素
      await page.click(args.selector);
      
      return { success: true };
    } catch (error) {
      if (error instanceof ElementNotFoundError) {
        throw error;
      }
      throw new ToolExecutionError(`点击元素失败: ${(error as Error).message}`, error as Error);
    }
  }
}

export class TypeTool extends BaseTool {
  private pageController: any;
  
  constructor(pageController: any) {
    super(
      'type',
      '在元素中输入文本',
      z.object({
        selector: z.string().min(1, '必须提供有效的选择器'),
        text: z.string(),
        delay: z.number().nonnegative().optional(),
        clear: z.boolean().optional()
      })
    );
    
    this.pageController = pageController;
  }
  
  protected async run(args: { selector: string; text: string; delay?: number; clear?: boolean }): Promise<{ success: boolean }> {
    try {
      const page = this.pageController.getCurrentPage();
      this.validatePage(page);
      
      // 等待元素出现
      try {
        await page.waitForSelector(args.selector, { timeout: 5000 });
      } catch (error) {
        throw new ElementNotFoundError(`找不到元素: ${args.selector}`, error as Error);
      }
      
      // 如果需要清除现有内容
      if (args.clear) {
        await page.evaluate((selector) => {
          const element = document.querySelector(selector) as HTMLInputElement;
          if (element) {
            element.value = '';
          }
        }, args.selector);
      }
      
      // 输入文本
      await page.type(args.selector, args.text, { delay: args.delay || 0 });
      
      return { success: true };
    } catch (error) {
      if (error instanceof ElementNotFoundError) {
        throw error;
      }
      throw new ToolExecutionError(`输入文本失败: ${(error as Error).message}`, error as Error);
    }
  }
}

export class SelectTool extends BaseTool {
  private pageController: any;
  
  constructor(pageController: any) {
    super(
      'select',
      '选择下拉菜单选项',
      z.object({
        selector: z.string().min(1, '必须提供有效的选择器'),
        value: z.string().min(1, '必须提供有效的选项值')
      })
    );
    
    this.pageController = pageController;
  }
  
  protected async run(args: { selector: string; value: string }): Promise<{ success: boolean }> {
    try {
      const page = this.pageController.getCurrentPage();
      this.validatePage(page);
      
      // 等待元素出现
      try {
        await page.waitForSelector(args.selector, { timeout: 5000 });
      } catch (error) {
        throw new ElementNotFoundError(`找不到元素: ${args.selector}`, error as Error);
      }
      
      // 选择选项
      await page.select(args.selector, args.value);
      
      return { success: true };
    } catch (error) {
      if (error instanceof ElementNotFoundError) {
        throw error;
      }
      throw new ToolExecutionError(`选择选项失败: ${(error as Error).message}`, error as Error);
    }
  }
}

export class WaitForElementTool extends BaseTool {
  private pageController: any;
  
  constructor(pageController: any) {
    super(
      'waitForElement',
      '等待元素出现',
      z.object({
        selector: z.string().min(1, '必须提供有效的选择器'),
        timeout: z.number().positive().optional(),
        visible: z.boolean().optional(),
        hidden: z.boolean().optional()
      })
    );
    
    this.pageController = pageController;
  }
  
  protected async run(args: { selector: string; timeout?: number; visible?: boolean; hidden?: boolean }): Promise<{ success: boolean }> {
    try {
      const page = this.pageController.getCurrentPage();
      this.validatePage(page);
      
      const timeout = args.timeout || 30000;
      const options = {
        timeout,
        visible: args.visible,
        hidden: args.hidden
      };
      
      // 等待元素出现
      try {
        await page.waitForSelector(args.selector, options);
      } catch (error) {
        throw new TimeoutError(`等待元素超时: ${args.selector}`, error as Error);
      }
      
      return { success: true };
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw error;
      }
      throw new ToolExecutionError(`等待元素失败: ${(error as Error).message}`, error as Error);
    }
  }
}