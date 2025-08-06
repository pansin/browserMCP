/**
 * 内容提取工具实现
 */

import { z } from 'zod';
import { BaseTool } from './base-tool.js';
import { ScreenshotOptions, ScreenshotOptionsSchema, PageMetadata } from '../types/index.js';
import { ToolExecutionError } from '../errors/index.js';
import { ToolExecutionContext } from '../interfaces/mcp.js';

export class GetPageSourceTool extends BaseTool {
  private pageController: any;
  
  constructor(pageController: any) {
    super(
      'getPageSource',
      '获取页面HTML源代码',
      z.object({})
    );
    
    this.pageController = pageController;
  }
  
  protected async run(): Promise<{ html: string }> {
    try {
      const page = this.pageController.getCurrentPage();
      this.validatePage(page);
      
      const html = await page.content();
      
      return { html };
    } catch (error) {
      throw new ToolExecutionError(`获取页面源代码失败: ${(error as Error).message}`, error as Error);
    }
  }
}

export class GetPageMetadataTool extends BaseTool {
  private pageController: any;
  
  constructor(pageController: any) {
    super(
      'getPageMetadata',
      '获取页面元数据',
      z.object({})
    );
    
    this.pageController = pageController;
  }
  
  protected async run(): Promise<{ metadata: PageMetadata }> {
    try {
      const page = this.pageController.getCurrentPage();
      this.validatePage(page);
      
      // 使用更简单的方式获取页面元数据
      const title = await page.title();
      
      // 获取描述
      const description = await page.evaluate(() => {
        const metaDesc = document.querySelector('meta[name="description"]');
        return metaDesc ? metaDesc.getAttribute('content') : null;
      });
      
      // 获取关键词
      const keywords = await page.evaluate(() => {
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        return metaKeywords ? metaKeywords.getAttribute('content') : null;
      });
      
      // 获取作者
      const author = await page.evaluate(() => {
        const metaAuthor = document.querySelector('meta[name="author"]');
        return metaAuthor ? metaAuthor.getAttribute('content') : null;
      });
      
      // 获取规范链接
      const canonical = await page.evaluate(() => {
        const link = document.querySelector('link[rel="canonical"]');
        return link ? link.getAttribute('href') : null;
      });
      
      // 构建元数据对象
      const metadata: PageMetadata = {
        title,
        description: description || undefined,
        keywords: keywords ? keywords.split(',').map(k => k.trim()) : undefined,
        author: author || undefined,
        canonical: canonical || undefined
      };
      
      return { metadata };
    } catch (error) {
      throw new ToolExecutionError(`获取页面元数据失败: ${(error as Error).message}`, error as Error);
    }
  }
}

export class TakeScreenshotTool extends BaseTool {
  private pageController: any;
  
  constructor(pageController: any) {
    super(
      'takeScreenshot',
      '截取页面截图',
      z.object({
        fullPage: z.boolean().optional(),
        clip: z.object({
          x: z.number().nonnegative(),
          y: z.number().nonnegative(),
          width: z.number().positive(),
          height: z.number().positive()
        }).optional(),
        quality: z.number().min(0).max(100).optional(),
        format: z.enum(['png', 'jpeg', 'webp']).optional()
      }).optional()
    );
    
    this.pageController = pageController;
  }
  
  protected async run(args?: ScreenshotOptions): Promise<{ imageBase64: string }> {
    try {
      const page = this.pageController.getCurrentPage();
      this.validatePage(page);
      
      const options: ScreenshotOptions = {
        fullPage: args?.fullPage,
        clip: args?.clip,
        quality: args?.quality,
        format: args?.format || 'png'
      };
      
      const buffer = await page.screenshot(options);
      const imageBase64 = buffer.toString('base64');
      
      return { imageBase64 };
    } catch (error) {
      throw new ToolExecutionError(`截取页面截图失败: ${(error as Error).message}`, error as Error);
    }
  }
}

export class ExtractTextTool extends BaseTool {
  private pageController: any;
  
  constructor(pageController: any) {
    super(
      'extractText',
      '从页面提取文本内容',
      z.object({
        selector: z.string().optional()
      })
    );
    
    this.pageController = pageController;
  }
  
  protected async run(args: { selector?: string }): Promise<{ text: string }> {
    try {
      const page = this.pageController.getCurrentPage();
      this.validatePage(page);
      
      const selector = args.selector || 'body';
      
      const text = await page.evaluate((sel: string) => {
        const element = document.querySelector(sel);
        return element ? element.textContent || '' : '';
      }, selector);
      
      return { text: text.trim() };
    } catch (error) {
      throw new ToolExecutionError(`提取文本内容失败: ${(error as Error).message}`, error as Error);
    }
  }
}