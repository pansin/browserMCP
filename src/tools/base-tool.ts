/**
 * 基础工具类
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { Page } from 'puppeteer';
import { ToolExecutionError } from '../errors/index.js';
import { ToolExecutionContext } from '../interfaces/mcp.js';

export abstract class BaseTool {
  protected name: string;
  protected description: string;
  protected schema: any;
  
  constructor(name: string, description: string, schema: any) {
    this.name = name;
    this.description = description;
    this.schema = schema;
  }
  
  /**
   * 获取MCP工具定义
   */
  getMCPTool(): Tool {
    return {
      name: this.name,
      description: this.description,
      inputSchema: this.schema,
      execute: this.execute.bind(this)
    };
  }
  
  /**
   * 执行工具
   */
  async execute(args: any, context: ToolExecutionContext): Promise<any> {
    try {
      const result = await this.run(args, context);
      return result;
    } catch (error) {
      if (error instanceof ToolExecutionError) {
        throw error;
      }
      
      throw new ToolExecutionError(
        `执行工具 ${this.name} 失败: ${(error as Error).message}`,
        error as Error
      );
    }
  }
  
  /**
   * 运行工具（由子类实现）
   */
  protected abstract run(args: any, context: ToolExecutionContext): Promise<any>;
  
  /**
   * 验证页面是否可用
   */
  protected validatePage(page: Page | null): asserts page is Page {
    if (!page) {
      throw new ToolExecutionError('没有活动页面');
    }
  }
}