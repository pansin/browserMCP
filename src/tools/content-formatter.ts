/**
 * 内容格式化工具
 */

import { JSDOM } from 'jsdom';
import TurndownService from 'turndown';
import { ToolExecutionError } from '../errors/index.js';

/**
 * 网页内容格式化器
 */
export class WebContentFormatter {
  /**
   * 将HTML转换为结构化的Markdown
   */
  static htmlToMarkdown(html: string, url: string): string {
    try {
      // 使用JSDOM解析HTML
      const dom = new JSDOM(html);
      const document = dom.window.document;
      
      // 提取页面标题
      const title = document.title || '未知标题';
      
      // 提取页面元数据
      const description = this.getMetaContent(document, 'description') || '无描述';
      const keywords = this.getMetaContent(document, 'keywords') || '无关键词';
      
      // 创建Markdown头部
      let markdown = `# ${title}\n\n`;
      markdown += `> 来源: [${url}](${url})\n\n`;
      markdown += `## 页面信息\n\n`;
      markdown += `- **描述**: ${description}\n`;
      markdown += `- **关键词**: ${keywords}\n\n`;
      
      // 提取主要内容
      const mainContent = this.extractMainContent(document);
      
      // 使用Turndown将HTML转换为Markdown
      const turndownService = new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced'
      });
      
      // 添加自定义规则以保留表格结构
      turndownService.addRule('tableRule', {
        filter: ['table'],
        replacement: function(content, node) {
          return '\n\n' + content + '\n\n';
        }
      });
      
      const contentMarkdown = turndownService.turndown(mainContent);
      markdown += `## 主要内容\n\n${contentMarkdown}\n\n`;
      
      // 提取链接
      const links = this.extractLinks(document);
      if (links.length > 0) {
        markdown += `## 页面链接\n\n`;
        links.forEach(link => {
          markdown += `- [${link.text}](${link.href})\n`;
        });
      }
      
      return markdown;
    } catch (error) {
      console.error('HTML转Markdown失败:', error);
      return `# 格式化失败\n\n无法将HTML转换为结构化Markdown: ${(error as Error).message}`;
    }
  }
  
  /**
   * 从文本内容创建结构化的Markdown
   */
  static textToStructuredMarkdown(text: string, url: string, title?: string): string {
    try {
      // 使用标题或URL作为文档标题
      const documentTitle = title || url;
      
      // 创建Markdown头部
      let markdown = `# ${documentTitle}\n\n`;
      markdown += `> 来源: [${url}](${url})\n\n`;
      
      // 分析文本内容，尝试识别段落和结构
      const paragraphs = this.splitIntoParagraphs(text);
      
      // 创建目录部分
      if (paragraphs.length > 5) {
        markdown += `## 内容概览\n\n`;
        
        // 提取前5个段落作为概览
        const overview = paragraphs.slice(0, 5).join(' ');
        markdown += `${overview}...\n\n`;
      }
      
      // 创建主要内容部分
      markdown += `## 主要内容\n\n`;
      
      // 将段落转换为Markdown格式
      paragraphs.forEach(paragraph => {
        if (paragraph.trim().length > 0) {
          // 检查是否可能是标题
          if (paragraph.length < 100 && !paragraph.endsWith('.') && !paragraph.includes(',')) {
            markdown += `### ${paragraph}\n\n`;
          } else {
            markdown += `${paragraph}\n\n`;
          }
        }
      });
      
      return markdown;
    } catch (error) {
      console.error('文本转结构化Markdown失败:', error);
      return `# 格式化失败\n\n无法将文本转换为结构化Markdown: ${(error as Error).message}`;
    }
  }
  
  /**
   * 获取元标签内容
   */
  private static getMetaContent(document: Document, name: string): string | null {
    const meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
    return meta ? meta.getAttribute('content') : null;
  }
  
  /**
   * 提取主要内容
   */
  private static extractMainContent(document: Document): string {
    // 尝试找到主要内容容器
    const contentSelectors = [
      'article',
      'main',
      '.content',
      '.main-content',
      '#content',
      '.post',
      '.entry',
      '.article'
    ];
    
    for (const selector of contentSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent && element.textContent.trim().length > 100) {
        return element.outerHTML;
      }
    }
    
    // 如果找不到主要内容容器，返回body内容
    return document.body.outerHTML;
  }
  
  /**
   * 提取链接
   */
  private static extractLinks(document: Document): Array<{text: string, href: string}> {
    const links: Array<{text: string, href: string}> = [];
    const anchors = document.querySelectorAll('a[href]');
    
    anchors.forEach(anchor => {
      const href = anchor.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
        links.push({
          text: anchor.textContent?.trim() || href,
          href: href.startsWith('http') ? href : `http://${href}`
        });
      }
    });
    
    // 去重
    const uniqueLinks = links.filter((link, index, self) =>
      index === self.findIndex(l => l.href === link.href)
    );
    
    // 限制链接数量
    return uniqueLinks.slice(0, 20);
  }
  
  /**
   * 将文本分割为段落
   */
  private static splitIntoParagraphs(text: string): string[] {
    // 按照多个换行符分割
    const rawParagraphs = text.split(/\n\s*\n/);
    
    // 处理每个段落
    return rawParagraphs
      .map(p => p.trim())
      .filter(p => p.length > 0);
  }
}