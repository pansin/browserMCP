/**
 * 测试和验证工具实现
 */

import { z } from 'zod';
import { BaseTool } from './base-tool.js';
import { ToolExecutionError } from '../errors/index.js';
import { ToolExecutionContext } from '../interfaces/mcp.js';

export class ElementExistsTool extends BaseTool {
  private pageController: any;
  
  constructor(pageController: any) {
    super(
      'elementExists',
      '检查元素是否存在',
      z.object({
        selector: z.string().min(1, '必须提供有效的选择器')
      })
    );
    
    this.pageController = pageController;
  }
  
  protected async run(args: { selector: string }): Promise<{ exists: boolean }> {
    try {
      const page = this.pageController.getCurrentPage();
      this.validatePage(page);
      
      const exists = await page.evaluate((selector) => {
        return document.querySelector(selector) !== null;
      }, args.selector);
      
      return { exists };
    } catch (error) {
      throw new ToolExecutionError(`检查元素存在失败: ${(error as Error).message}`, error as Error);
    }
  }
}

export class TextExistsTool extends BaseTool {
  private pageController: any;
  
  constructor(pageController: any) {
    super(
      'textExists',
      '检查文本是否存在于页面',
      z.object({
        text: z.string().min(1, '必须提供有效的文本'),
        caseSensitive: z.boolean().optional()
      })
    );
    
    this.pageController = pageController;
  }
  
  protected async run(args: { text: string; caseSensitive?: boolean }): Promise<{ exists: boolean }> {
    try {
      const page = this.pageController.getCurrentPage();
      this.validatePage(page);
      
      const exists = await page.evaluate((text, caseSensitive) => {
        const pageText = document.body.textContent || '';
        
        if (caseSensitive) {
          return pageText.includes(text);
        } else {
          return pageText.toLowerCase().includes(text.toLowerCase());
        }
      }, args.text, args.caseSensitive || false);
      
      return { exists };
    } catch (error) {
      throw new ToolExecutionError(`检查文本存在失败: ${(error as Error).message}`, error as Error);
    }
  }
}

export class GetAttributeTool extends BaseTool {
  private pageController: any;
  
  constructor(pageController: any) {
    super(
      'getAttribute',
      '获取元素属性值',
      z.object({
        selector: z.string().min(1, '必须提供有效的选择器'),
        attribute: z.string().min(1, '必须提供有效的属性名')
      })
    );
    
    this.pageController = pageController;
  }
  
  protected async run(args: { selector: string; attribute: string }): Promise<{ value: string | null }> {
    try {
      const page = this.pageController.getCurrentPage();
      this.validatePage(page);
      
      const value = await page.evaluate((selector, attribute) => {
        const element = document.querySelector(selector);
        return element ? element.getAttribute(attribute) : null;
      }, args.selector, args.attribute);
      
      return { value };
    } catch (error) {
      throw new ToolExecutionError(`获取元素属性失败: ${(error as Error).message}`, error as Error);
    }
  }
}

export class EvaluateScriptTool extends BaseTool {
  private pageController: any;
  
  constructor(pageController: any) {
    super(
      'evaluateScript',
      '在页面上下文中执行JavaScript代码',
      z.object({
        script: z.string().min(1, '必须提供有效的JavaScript代码'),
        args: z.array(z.any()).optional()
      })
    );
    
    this.pageController = pageController;
  }
  
  protected async run(args: { script: string; args?: any[] }): Promise<{ result: any }> {
    try {
      const page = this.pageController.getCurrentPage();
      this.validatePage(page);
      
      // 在页面上下文中执行脚本
      const result = await page.evaluate(args.script);
      
      return { result };
    } catch (error) {
      throw new ToolExecutionError(`执行脚本失败: ${(error as Error).message}`, error as Error);
    }
  }
}