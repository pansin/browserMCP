/**
 * 格式化内容测试文件
 */

import { BrowserMCPServer } from '../index.js';
import fs from 'fs/promises';

async function testFormattedContent() {
  console.log('开始测试格式化内容功能...');
  
  const server = new BrowserMCPServer();
  
  try {
    // 启动服务器
    await server.start();
    console.log('服务器状态:', server.getStatus());
    
    // 访问指定网站
    const url = 'https://note.pansin.net';
    console.log(`正在访问网站: ${url}`);
    
    try {
      // 使用导航工具访问网站
      await server.handleToolCall('navigate', { url });
      
      // 等待页面加载完成
      console.log('等待页面加载完成...');
      await new Promise(resolve => setTimeout(resolve, 8000));
      
      // 等待页面稳定
      await server.handleToolCall('waitForElement', { selector: 'body', timeout: 10000 });
      
      // 获取格式化的页面内容
      console.log('正在获取格式化的页面内容...');
      const formattedPageContent = await server.handleToolCall('getFormattedPageContent', { outputFormat: 'markdown' });
      
      // 获取格式化的文本内容
      console.log('正在获取格式化的文本内容...');
      const formattedTextContent = await server.handleToolCall('getFormattedTextContent', { selector: 'body' });
      
      // 保存格式化的页面内容到文件
      if (formattedPageContent && formattedPageContent.content) {
        await fs.writeFile('formatted-page-content.md', formattedPageContent.content, 'utf-8');
        console.log('格式化的页面内容已保存到 formatted-page-content.md');
      } else {
        console.log('无法获取格式化的页面内容');
      }
      
      // 保存格式化的文本内容到文件
      if (formattedTextContent && formattedTextContent.content) {
        await fs.writeFile('formatted-text-content.md', formattedTextContent.content, 'utf-8');
        console.log('格式化的文本内容已保存到 formatted-text-content.md');
      } else {
        console.log('无法获取格式化的文本内容');
      }
      
      // 截取页面截图
      console.log('正在截取页面截图...');
      const screenshot = await server.handleToolCall('takeScreenshot', { fullPage: true });
      
      // 保存截图到文件
      if (screenshot && screenshot.imageBase64) {
        const buffer = Buffer.from(screenshot.imageBase64, 'base64');
        await fs.writeFile('formatted-screenshot.png', buffer);
        console.log('页面截图已保存到 formatted-screenshot.png');
      } else {
        console.log('无法获取页面截图');
      }
      
    } catch (error) {
      console.error('访问网站过程中出错:', error);
    }
    
    console.log('测试完成');
  } catch (error) {
    console.error('测试失败:', error);
  } finally {
    // 停止服务器
    await server.stop();
  }
}

// 运行测试
testFormattedContent().catch(console.error);