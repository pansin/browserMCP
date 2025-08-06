/**
 * 搜索工具实现
 */

import { z } from 'zod';
import { BaseTool } from './base-tool.js';
import { ToolExecutionError } from '../errors/index.js';

export class BaiduSearchTool extends BaseTool {
  private pageController: any;
  
  constructor(pageController: any) {
    super(
      'baiduSearch',
      '使用百度搜索信息',
      z.object({
        query: z.string().min(1, '必须提供搜索关键词'),
        resultCount: z.number().positive().max(10).optional()
      })
    );
    
    this.pageController = pageController;
  }
  
  protected async run(args: { query: string; resultCount?: number }): Promise<{ results: any[] }> {
    try {
      const page = this.pageController.getCurrentPage();
      this.validatePage(page);
      
      // 导航到百度
      await page.goto('https://www.baidu.com', { waitUntil: 'networkidle2' });
      
      // 输入搜索关键词
      await page.type('#kw', args.query);
      
      // 点击搜索按钮
      await page.click('#su');
      
      // 等待搜索结果加载
      await page.waitForSelector('.result', { timeout: 10000 });
      
      // 提取搜索结果
      const resultCount = args.resultCount || 5;
      
      const results = await page.evaluate((count) => {
        const items = Array.from(document.querySelectorAll('.result'));
        return items.slice(0, count).map(item => {
          const titleElement = item.querySelector('.t a');
          const contentElement = item.querySelector('.c-abstract');
          const linkElement = item.querySelector('.t a');
          
          return {
            title: titleElement && titleElement.textContent ? titleElement.textContent.trim() : '',
            content: contentElement && contentElement.textContent ? contentElement.textContent.trim() : '',
            link: linkElement ? linkElement.getAttribute('href') : ''
          };
        });
      }, resultCount);
      
      return { results };
    } catch (error) {
      throw new ToolExecutionError(`百度搜索失败: ${(error as Error).message}`, error as Error);
    }
  }
}

export class AIArticleSearchTool extends BaseTool {
  private pageController: any;
  
  constructor(pageController: any) {
    super(
      'getLatestAIArticle',
      '获取最新的AI文章',
      z.object({
        count: z.number().positive().max(5).optional()
      })
    );
    
    this.pageController = pageController;
  }
  
  protected async run(args: { count?: number }): Promise<{ articles: any[] }> {
    try {
      const page = this.pageController.getCurrentPage();
      this.validatePage(page);
      
      // 导航到百度
      await page.goto('https://www.baidu.com', { waitUntil: 'networkidle2' });
      
      // 输入搜索关键词
      await page.type('#kw', '最新人工智能文章 site:mp.weixin.qq.com');
      
      // 点击搜索按钮
      await page.click('#su');
      
      // 等待搜索结果加载
      await page.waitForSelector('.result', { timeout: 10000 });
      
      // 提取搜索结果
      const count = args.count || 3;
      
      const articles = await page.evaluate((resultCount) => {
        const items = Array.from(document.querySelectorAll('.result'));
        return items.slice(0, resultCount).map(item => {
          const titleElement = item.querySelector('.t a');
          const contentElement = item.querySelector('.c-abstract');
          const linkElement = item.querySelector('.t a');
          const dateElement = item.querySelector('.c-abstract time') || 
                             item.querySelector('.c-abstract span:last-child');
          
          return {
            title: titleElement && titleElement.textContent ? titleElement.textContent.trim() : '',
            summary: contentElement && contentElement.textContent ? contentElement.textContent.trim() : '',
            link: linkElement ? linkElement.getAttribute('href') : '',
            date: dateElement && dateElement.textContent ? dateElement.textContent.trim() : '未知日期',
            fullContent: ''
          };
        });
      }, count);
      
      // 从搜索结果页面提取更多信息
      for (let i = 0; i < articles.length; i++) {
        // 提取更详细的摘要信息
        articles[i].fullContent = `# ${articles[i].title}\n\n${articles[i].date}\n\n${articles[i].summary}\n\n`;
        articles[i].fullContent += "## 搜索结果摘要\n\n";
        articles[i].fullContent += "这是从百度搜索结果中提取的AI相关文章。由于微信公众号文章通常需要登录才能查看完整内容，";
        articles[i].fullContent += "我们只能提供搜索结果中显示的摘要信息。\n\n";
        articles[i].fullContent += "### 文章要点\n\n";
        
        // 从摘要中提取关键句子
        const sentences = articles[i].summary.split(/[。！？.!?]/).filter(s => s.trim().length > 0);
        sentences.forEach((sentence, index) => {
          articles[i].fullContent += `- ${sentence.trim()}\n`;
        });
        
        articles[i].fullContent += "\n### 相关链接\n\n";
        articles[i].fullContent += `[${articles[i].title}](${articles[i].link})\n\n`;
        articles[i].fullContent += "---\n\n";
        articles[i].fullContent += "注：完整文章内容需要在微信公众号中查看。";
      }
      
      return { articles };
    } catch (error) {
      throw new ToolExecutionError(`获取AI文章失败: ${(error as Error).message}`, error as Error);
    }
  }
}