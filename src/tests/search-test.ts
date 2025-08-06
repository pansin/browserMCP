/**
 * 搜索测试文件
 */

import { BrowserMCPServer } from '../index.js';
import fs from 'fs/promises';

async function runSearchTest() {
  console.log('开始测试AI文章搜索功能...');
  
  const server = new BrowserMCPServer();
  
  try {
    // 启动服务器
    await server.start();
    console.log('服务器状态:', server.getStatus());
    
    // 测试AI文章搜索工具
    console.log('搜索最新AI文章...');
    const searchResult = await server.handleToolCall('getLatestAIArticle', { count: 3 });
    
    console.log('搜索结果:');
    console.log(JSON.stringify(searchResult, null, 2));
    
    // 保存搜索结果到文件
    if (searchResult && searchResult.articles && searchResult.articles.length > 0) {
      const article = searchResult.articles[0];
      
      // 创建文章内容
      const content = `# ${article.title}\n\n${article.date}\n\n## 摘要\n\n${article.summary}\n\n## 全文\n\n${article.fullContent}`;
      
      // 保存到文件
      await fs.writeFile('latest-ai-article.md', content, 'utf-8');
      console.log('文章已保存到 latest-ai-article.md');
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
runSearchTest().catch(console.error);