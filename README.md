# Browser MCP Server

一个基于Model Context Protocol (MCP)的浏览器自动化服务器，使用Puppeteer提供强大的网页浏览、内容提取和交互功能。

<a href="https://glama.ai/mcp/servers/@pansin/browserMCP">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@pansin/browserMCP/badge" alt="Browser Server MCP server" />
</a>

## 功能特点

- **页面导航**：导航到URL、刷新、前进/后退
- **内容提取**：获取页面源代码、元数据、截图和文本
- **格式化内容**：将网页内容转换为结构化的Markdown格式
- **元素交互**：点击、输入、选择和等待元素
- **测试工具**：检查元素存在、验证内容、执行脚本
- **搜索功能**：通过百度搜索获取最新文章和信息
- **安全保障**：沙箱浏览器执行与域名限制
- **配置灵活**：支持自定义配置管理

## 安装

```bash
# 克隆仓库
git clone https://github.com/yourusername/browser-mcp-server.git
cd browser-mcp-server

# 安装依赖
npm install

# 构建项目
npm run build
```

## 开发

```bash
# 启动开发模式
npm run dev
```

## 测试

```bash
# 运行测试
npm test

# 运行特定测试
npx tsx src/tests/simple-test.ts
npx tsx src/tests/search-test.ts
npx tsx src/tests/visit-website-test.ts
npx tsx src/tests/formatted-content-test.ts
```

## 配置

服务器使用配置文件管理浏览器设置、安全选项和默认行为。查看`src/config/default.ts`了解默认配置。

## 使用方法

Browser MCP Server设计为与Kiro IDE一起使用。将其添加到您的MCP配置中：

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

详细使用说明请参考[用户指南](./USER_GUIDE.md)。

## 项目结构

```
browser-mcp-server/
├── src/
│   ├── config/         # 配置文件
│   ├── errors/         # 错误处理类
│   ├── interfaces/     # 接口定义
│   ├── managers/       # 管理器实现
│   ├── tools/          # 工具实现
│   ├── types/          # 类型定义
│   ├── utils/          # 工具函数
│   ├── tests/          # 测试文件
│   └── index.ts        # 入口文件
├── dist/               # 编译后的文件
├── package.json        # 项目配置
└── README.md           # 项目说明
```

## 许可证

本项目采用 [Apache License 2.0](LICENSE) 许可证。

```
Copyright 2025 Browser MCP Server Contributors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.