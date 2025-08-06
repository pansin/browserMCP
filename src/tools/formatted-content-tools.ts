/**
 * 格式化内容提取工具实现
 */

import { z } from 'zod';
import { BaseTool } from './base-tool.js';
import { ToolExecutionError } from '../errors/index.js';
import { WebContentFormatter } from './content-formatter.js';

export class GetFormattedPageContentTool extends BaseTool {
  private pageController: any;
  
  constructor(pageController: any) {
    super(
      'getFormattedPageContent',
      '获取格式化的页面内容',
      z.object({
        outputFormat: z.enum(['markdown', 'html']).optional()
      })
    );
    
    this.pageController = pageController;
  }
  
  protected async run(args: { outputFormat?: 'markdown' | 'html' }): Promise<{ content: string }> {
    try {
      const page = this.pageController.getCurrentPage();
      this.validatePage(page);
      
      // 获取页面URL
      const url = await page.url();
      
      // 获取页面标题
      const title = await page.title();
      
      // 获取页面HTML内容
      const html = await page.content();
      
      // 根据输出格式选择处理方式
      const outputFormat = args.outputFormat || 'markdown';
      
      if (outputFormat === 'markdown') {
        // 将HTML转换为格式化的Markdown
        const markdown = WebContentFormatter.htmlToMarkdown(html, url);
        return { content: markdown };
      } else {
        // 返回原始HTML
        return { content: html };
      }
    } catch (error) {
      throw new ToolExecutionError(`获取格式化页面内容失败: ${(error as Error).message}`, error as Error);
    }
  }
}

export class GetFormattedTextContentTool extends BaseTool {
  private pageController: any;
  
  constructor(pageController: any) {
    super(
      'getFormattedTextContent',
      '获取格式化的文本内容',
      z.object({
        selector: z.string().optional()
      })
    );
    
    this.pageController = pageController;
  }
  
  protected async run(args: { selector?: string }): Promise<{ content: string }> {
    try {
      const page = this.pageController.getCurrentPage();
      this.validatePage(page);
      
      // 获取页面URL
      const url = await page.url();
      
      // 获取页面标题
      const title = await page.title();
      
      // 获取文本内容
      const selector = args.selector || 'body';
      
      const text = await page.evaluate((sel: string) => {
        const element = document.querySelector(sel);
        return element && element.textContent ? element.textContent : '';
      }, selector);
      
      // 将文本转换为结构化的Markdown
      const markdown = WebContentFormatter.textToStructuredMarkdown(text, url, title);
      
      return { content: markdown };
    } catch (error) {
      throw new ToolExecutionError(`获取格式化文本内容失败: ${(error as Error).message}`, error as Error);
    }
  }
}