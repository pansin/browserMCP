# Browser MCP Server 用户指南

本指南将帮助您部署和使用Browser MCP Server，一个基于Model Context Protocol (MCP)的浏览器自动化服务器。

## 目录

- [部署指南](#部署指南)
  - [系统要求](#系统要求)
  - [安装步骤](#安装步骤)
  - [配置说明](#配置说明)
- [使用指南](#使用指南)
  - [启动服务器](#启动服务器)
  - [与MCP客户端集成](#与mcp客户端集成)
  - [可用工具列表](#可用工具列表)
- [示例用法](#示例用法)
  - [网页浏览](#网页浏览)
  - [内容提取](#内容提取)
  - [搜索功能](#搜索功能)
- [故障排除](#故障排除)
- [最佳实践](#最佳实践)

## 部署指南

### 系统要求

- Node.js 18.0.0 或更高版本
- npm 7.0.0 或更高版本
- 支持的操作系统：Windows、macOS、Linux

### 安装步骤

1. 克隆仓库：

```bash
git clone https://github.com/yourusername/browser-mcp-server.git
cd browser-mcp-server
```

2. 安装依赖：

```bash
npm install
```

3. 构建项目：

```bash
npm run build
```

### 配置说明

Browser MCP Server使用`src/config/default.ts`中的默认配置。您可以通过创建自定义配置文件来覆盖默认设置。

配置选项包括：

- **launchOptions**：Puppeteer浏览器启动选项
  - `headless`：是否以无头模式运行浏览器（默认：true）
  - `devtools`：是否打开开发者工具（默认：false）
  - `args`：Chrome启动参数

- **defaults**：默认设置
  - `timeout`：操作超时时间（毫秒）
  - `viewport`：视口大小
  - `userAgent`：用户代理字符串

- **downloads**：下载设置
  - `directory`：下载目录
  - `behavior`：下载行为（allow、deny、allowAndName）

- **security**：安全设置
  - `allowedDomains`：允许访问的域名列表
  - `blockedDomains`：禁止访问的域名列表
  - `maxPages`：最大页面数量

示例配置：

```typescript
// custom-config.json
{
  "launchOptions": {
    "headless": false,
    "devtools": true,
    "args": [
      "--no-sandbox",
      "--disable-setuid-sandbox"
    ]
  },
  "defaults": {
    "timeout": 60000,
    "viewport": {
      "width": 1920,
      "height": 1080
    }
  },
  "security": {
    "allowedDomains": ["example.com", "github.com"],
    "maxPages": 5
  }
}
```

## 使用指南

### 启动服务器

1. 开发模式：

```bash
npm run dev
```

2. 生产模式：

```bash
npm run start
```

### 与MCP客户端集成

Browser MCP Server设计为与支持MCP协议的客户端一起使用。在Kiro IDE中配置：

1. 打开Kiro IDE配置文件
2. 添加Browser MCP Server配置：

```json
{
  "mcpServers": {
    "browser": {
      "command": "node",
      "args": ["path/to/browser-mcp-server/dist/index.js"]
    }
  }
}
```

3. 重启Kiro IDE

### 可用工具列表

Browser MCP Server提供以下工具：

#### 导航工具
- `navigate`：导航到指定URL
- `refresh`：刷新当前页面
- `goBack`：返回上一页
- `goForward`：前进到下一页

#### 内容提取工具
- `getPageSource`：获取页面HTML源代码
- `getPageMetadata`：获取页面元数据
- `takeScreenshot`：截取页面截图
- `extractText`：提取页面文本内容
- `getFormattedPageContent`：获取格式化的页面内容
- `getFormattedTextContent`：获取格式化的文本内容

#### 元素交互工具
- `click`：点击元素
- `type`：在元素中输入文本
- `select`：选择下拉选项
- `waitForElement`：等待元素出现

#### 测试工具
- `elementExists`：检查元素是否存在
- `textExists`：检查文本是否存在
- `getAttribute`：获取元素属性
- `evaluateScript`：执行JavaScript代码

#### 搜索工具
- `baiduSearch`：使用百度搜索信息
- `getLatestAIArticle`：获取最新的AI文章

## 示例用法

### 网页浏览

```javascript
// 导航到网站
await server.handleToolCall('navigate', { url: 'https://example.com' });

// 等待页面加载
await server.handleToolCall('waitForElement', { selector: 'body', timeout: 10000 });

// 点击链接
await server.handleToolCall('click', { selector: 'a.login-button' });

// 输入文本
await server.handleToolCall('type', { 
  selector: 'input[name="username"]', 
  text: 'testuser', 
  clear: true 
});
```

### 内容提取

```javascript
// 获取格式化的页面内容
const formattedContent = await server.handleToolCall('getFormattedPageContent', { 
  outputFormat: 'markdown' 
});

// 提取特定元素的文本
const articleText = await server.handleToolCall('extractText', { 
  selector: 'article.main-content' 
});

// 截取页面截图
const screenshot = await server.handleToolCall('takeScreenshot', { 
  fullPage: true 
});
```

### 搜索功能

```javascript
// 使用百度搜索
const searchResults = await server.handleToolCall('baiduSearch', { 
  query: '人工智能最新进展', 
  resultCount: 5 
});

// 获取最新AI文章
const aiArticles = await server.handleToolCall('getLatestAIArticle', { 
  count: 3 
});
```

## 故障排除

### 常见问题

1. **浏览器启动失败**
   - 检查是否安装了Chrome浏览器
   - 尝试使用`--no-sandbox`参数启动

2. **导航超时**
   - 增加超时设置
   - 检查网络连接
   - 确认URL是否正确

3. **元素交互失败**
   - 确保元素存在且可见
   - 使用`waitForElement`等待元素加载
   - 检查选择器是否正确

4. **内容提取为空**
   - 确保页面已完全加载
   - 检查选择器是否正确
   - 尝试增加等待时间

### 日志和调试

启用详细日志：

```bash
DEBUG=browser-mcp-server:* npm run start
```

## 最佳实践

1. **性能优化**
   - 限制同时打开的页面数量
   - 在不需要时关闭页面
   - 使用`headless: true`减少资源消耗

2. **安全建议**
   - 使用`allowedDomains`限制可访问的网站
   - 避免在生产环境中禁用沙箱
   - 定期更新依赖包

3. **稳定性提升**
   - 添加适当的错误处理
   - 实现重试机制
   - 监控浏览器内存使用

---

如需更多帮助或报告问题，请访问我们的[GitHub仓库](https://github.com/yourusername/browser-mcp-server/issues)。