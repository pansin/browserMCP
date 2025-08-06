/**
 * 简单测试文件
 */

import { BrowserMCPServer } from '../index.js';

async function runTest() {
  console.log('开始测试浏览器MCP服务器...');
  
  const server = new BrowserMCPServer();
  
  try {
    // 启动服务器
    await server.start();
    console.log('服务器状态:', server.getStatus());
    
    // 测试导航工具
    console.log('测试导航工具...');
    const navResult = await server.handleToolCall('navigate', { url: 'https://www.example.com' });
    console.log('导航结果:', navResult);
    
    // 测试页面源代码
    console.log('获取页面源代码...');
    const sourceResult = await server.handleToolCall('getPageSource', {});
    console.log('页面源代码长度:', sourceResult.html.length);
    
    console.log('测试完成');
  } catch (error) {
    console.error('测试失败:', error);
  } finally {
    // 停止服务器
    await server.stop();
  }
}

// 运行测试
runTest().catch(console.error);