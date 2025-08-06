/**
 * 访问指定网站测试文件
 */

import { BrowserMCPServer } from '../index.js';
import fs from 'fs/promises';

async function visitWebsiteTest() {
  console.log('开始测试网站访问功能...');
  
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
      
      // 等待页面加载完成 - 增加等待时间
      console.log('等待页面加载完成...');
      await new Promise(resolve => setTimeout(resolve, 8000));
      
      // 等待页面稳定
      await server.handleToolCall('waitForElement', { selector: 'body', timeout: 10000 });
      
      // 截取页面截图
      console.log('正在截取页面截图...');
      const screenshot = await server.handleToolCall('takeScreenshot', { fullPage: true });
      
      // 提取页面内容
      console.log('正在提取页面内容...');
      const textContent = await server.handleToolCall('extractText', { selector: 'body' });
      
      // 获取页面源代码
      console.log('正在获取页面源代码...');
      let pageSource;
      try {
        pageSource = await server.handleToolCall('getPageSource', {});
      } catch (error) {
        console.log('获取页面源代码失败，继续执行其他操作');
        pageSource = { html: '无法获取页面源代码' };
      }
    
      // 保存页面内容到文件
      if (textContent && textContent.text) {
        await fs.writeFile('website-content.md', `# 网站内容: ${url}\n\n## 页面文本\n\n${textContent.text.substring(0, 5000)}...`, 'utf-8');
        console.log('页面内容已保存到 website-content.md');
      } else {
        console.log('无法提取页面文本内容');
      }
      
      // 保存截图到文件
      if (screenshot && screenshot.imageBase64) {
        const buffer = Buffer.from(screenshot.imageBase64, 'base64');
        await fs.writeFile('website-screenshot.png', buffer);
        console.log('页面截图已保存到 website-screenshot.png');
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
visitWebsiteTest().catch(console.error);