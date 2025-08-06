/**
 * MCP服务器处理器实现
 */

import { IMCPServerHandler, IToolRegistry, ToolExecutionContext } from '../interfaces/mcp.js';
import { MCPProtocolError, ToolExecutionError } from '../errors/index.js';
import { v4 as uuidv4 } from 'uuid';

export class MCPServerHandler implements IMCPServerHandler {
  private toolRegistry: IToolRegistry;
  private status: 'stopped' | 'starting' | 'running' | 'stopping' = 'stopped';
  
  constructor(toolRegistry: IToolRegistry) {
    this.toolRegistry = toolRegistry;
  }
  
  /**
   * 初始化MCP服务器
   */
  async initialize(): Promise<void> {
    this.status = 'starting';
    console.log('MCP服务器处理器初始化中...');
    
    // 这里可以添加其他初始化逻辑
    
    this.status = 'running';
    console.log('MCP服务器处理器初始化完成');
  }
  
  /**
   * 启动服务器
   */
  async start(): Promise<void> {
    if (this.status === 'running') {
      console.log('MCP服务器已经在运行中');
      return;
    }
    
    this.status = 'starting';
    console.log('MCP服务器启动中...');
    
    // 这里可以添加启动逻辑
    
    this.status = 'running';
    console.log('MCP服务器已启动');
  }
  
  /**
   * 停止服务器
   */
  async stop(): Promise<void> {
    if (this.status === 'stopped') {
      console.log('MCP服务器已经停止');
      return;
    }
    
    this.status = 'stopping';
    console.log('MCP服务器停止中...');
    
    // 这里可以添加停止逻辑
    
    this.status = 'stopped';
    console.log('MCP服务器已停止');
  }
  
  /**
   * 处理工具调用
   */
  async handleToolCall(name: string, args: any): Promise<any> {
    if (this.status !== 'running') {
      throw new MCPProtocolError(`MCP服务器未运行，当前状态: ${this.status}`);
    }
    
    const tool = this.toolRegistry.getTool(name);
    
    if (!tool) {
      throw new MCPProtocolError(`找不到工具: ${name}`);
    }
    
    const context: ToolExecutionContext = {
      toolName: name,
      args,
      timestamp: new Date(),
      requestId: uuidv4()
    };
    
    try {
      console.log(`执行工具: ${name}`, args);
      const result = await tool.execute(args, context);
      console.log(`工具执行成功: ${name}`);
      return result;
    } catch (error) {
      console.error(`工具执行失败: ${name}`, error);
      
      if (error instanceof ToolExecutionError || error instanceof MCPProtocolError) {
        throw error;
      }
      
      throw new ToolExecutionError(`执行工具 ${name} 失败: ${(error as Error).message}`, error as Error);
    }
  }
  
  /**
   * 获取服务器状态
   */
  getStatus(): 'stopped' | 'starting' | 'running' | 'stopping' {
    return this.status;
  }
}