/**
 * Browser MCP Server entry point
 */

// Export all types and interfaces
export * from './types/index.js';
export * from './interfaces/tools.js';
export * from './interfaces/browser.js';
export * from './interfaces/mcp.js';
export * from './errors/index.js';
export * from './config/default.js';

// 导入管理器和工具
import { BrowserManager } from './managers/browser-manager.js';
import { PageController } from './managers/page-controller.js';
import { ConfigManager } from './managers/config-manager.js';
import { ToolRegistry } from './managers/tool-registry.js';
import { MCPServerHandler } from './managers/mcp-server-handler.js';

// 导入工具类
import { NavigateTool, RefreshTool, GoBackTool, GoForwardTool } from './tools/navigation-tools.js';
import { GetPageSourceTool, GetPageMetadataTool, TakeScreenshotTool, ExtractTextTool } from './tools/content-tools.js';
import { ClickTool, TypeTool, SelectTool, WaitForElementTool } from './tools/interaction-tools.js';
import { ElementExistsTool, TextExistsTool, GetAttributeTool, EvaluateScriptTool } from './tools/testing-tools.js';
import { BaiduSearchTool, AIArticleSearchTool } from './tools/search-tools.js';
import { GetFormattedPageContentTool, GetFormattedTextContentTool } from './tools/formatted-content-tools.js';

// 主服务器类
export class BrowserMCPServer {
  private configManager: ConfigManager;
  private browserManager!: BrowserManager;
  private pageController!: PageController;
  private toolRegistry: ToolRegistry;
  private mcpHandler: MCPServerHandler;
  private defaultPageId: string | null = null;
  
  constructor(configPath?: string) {
    // 初始化配置管理器
    this.configManager = new ConfigManager(configPath);
    
    // 初始化工具注册表
    this.toolRegistry = new ToolRegistry();
    
    // 初始化MCP处理器
    this.mcpHandler = new MCPServerHandler(this.toolRegistry);
  }
  
  /**
   * 启动服务器
   */
  async start(): Promise<void> {
    console.log('浏览器MCP服务器启动中...');
    
    try {
      // 加载配置
      const config = await this.configManager.loadConfig();
      
      // 初始化浏览器管理器
      this.browserManager = new BrowserManager(config);
      await this.browserManager.initialize();
      
      // 初始化页面控制器
      this.pageController = new PageController(
        config.security.allowedDomains,
        config.security.blockedDomains
      );
      
      // 创建默认页面
      this.defaultPageId = await this.browserManager.createPage('default');
      const defaultPage = await this.browserManager.getPage(this.defaultPageId);
      this.pageController.setCurrentPage(defaultPage);
      
      // 注册工具
      this.registerTools();
      
      // 启动MCP处理器
      await this.mcpHandler.initialize();
      await this.mcpHandler.start();
      
      console.log('浏览器MCP服务器已启动');
    } catch (error) {
      console.error('启动服务器失败:', error);
      await this.stop();
      throw error;
    }
  }
  
  /**
   * 停止服务器
   */
  async stop(): Promise<void> {
    console.log('浏览器MCP服务器停止中...');
    
    try {
      // 停止MCP处理器
      await this.mcpHandler.stop();
      
      // 清理浏览器资源
      if (this.browserManager) {
        await this.browserManager.cleanup();
      }
      
      console.log('浏览器MCP服务器已停止');
    } catch (error) {
      console.error('停止服务器失败:', error);
      throw error;
    }
  }
  
  /**
   * 注册工具
   */
  private registerTools(): void {
    // 导航工具
    this.toolRegistry.registerTool(new NavigateTool(this.pageController).getMCPTool());
    this.toolRegistry.registerTool(new RefreshTool(this.pageController).getMCPTool());
    this.toolRegistry.registerTool(new GoBackTool(this.pageController).getMCPTool());
    this.toolRegistry.registerTool(new GoForwardTool(this.pageController).getMCPTool());
    
    // 内容提取工具
    this.toolRegistry.registerTool(new GetPageSourceTool(this.pageController).getMCPTool());
    this.toolRegistry.registerTool(new GetPageMetadataTool(this.pageController).getMCPTool());
    this.toolRegistry.registerTool(new TakeScreenshotTool(this.pageController).getMCPTool());
    this.toolRegistry.registerTool(new ExtractTextTool(this.pageController).getMCPTool());
    
    // 元素交互工具
    this.toolRegistry.registerTool(new ClickTool(this.pageController).getMCPTool());
    this.toolRegistry.registerTool(new TypeTool(this.pageController).getMCPTool());
    this.toolRegistry.registerTool(new SelectTool(this.pageController).getMCPTool());
    this.toolRegistry.registerTool(new WaitForElementTool(this.pageController).getMCPTool());
    
    // 测试和验证工具
    this.toolRegistry.registerTool(new ElementExistsTool(this.pageController).getMCPTool());
    this.toolRegistry.registerTool(new TextExistsTool(this.pageController).getMCPTool());
    this.toolRegistry.registerTool(new GetAttributeTool(this.pageController).getMCPTool());
    this.toolRegistry.registerTool(new EvaluateScriptTool(this.pageController).getMCPTool());
    
    // 搜索工具
    this.toolRegistry.registerTool(new BaiduSearchTool(this.pageController).getMCPTool());
    this.toolRegistry.registerTool(new AIArticleSearchTool(this.pageController).getMCPTool());
    
    // 格式化内容工具
    this.toolRegistry.registerTool(new GetFormattedPageContentTool(this.pageController).getMCPTool());
    this.toolRegistry.registerTool(new GetFormattedTextContentTool(this.pageController).getMCPTool());
    
    console.log(`已注册 ${this.toolRegistry.getTools().length} 个工具`);
  }
  
  /**
   * 处理工具调用
   */
  async handleToolCall(name: string, args: any): Promise<any> {
    return this.mcpHandler.handleToolCall(name, args);
  }
  
  /**
   * 获取服务器状态
   */
  getStatus(): string {
    return this.mcpHandler.getStatus();
  }
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new BrowserMCPServer();
  
  process.on('SIGINT', async () => {
    console.log('\nReceived SIGINT, shutting down gracefully...');
    await server.stop();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    console.log('\nReceived SIGTERM, shutting down gracefully...');
    await server.stop();
    process.exit(0);
  });
  
  server.start().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}