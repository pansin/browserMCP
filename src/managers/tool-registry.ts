/**
 * 工具注册管理器实现
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { IToolRegistry } from '../interfaces/mcp.js';

export class ToolRegistry implements IToolRegistry {
  private tools: Map<string, Tool> = new Map();

  /**
   * 注册新工具
   */
  registerTool(tool: Tool): void {
    if (this.tools.has(tool.name)) {
      console.warn(`工具 ${tool.name} 已存在，将被覆盖`);
    }
    
    this.tools.set(tool.name, tool);
    console.log(`已注册工具: ${tool.name}`);
  }

  /**
   * 获取所有已注册工具
   */
  getTools(): Tool[] {
    return Array.from(this.tools.values());
  }

  /**
   * 根据名称获取工具
   */
  getTool(name: string): Tool | undefined {
    return this.tools.get(name);
  }

  /**
   * 检查工具是否存在
   */
  hasTool(name: string): boolean {
    return this.tools.has(name);
  }

  /**
   * 注销工具
   */
  unregisterTool(name: string): void {
    if (this.tools.has(name)) {
      this.tools.delete(name);
      console.log(`已注销工具: ${name}`);
    }
  }
}