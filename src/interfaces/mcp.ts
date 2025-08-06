/**
 * MCP server interfaces
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';

// MCP tool registry interface
export interface IToolRegistry {
  /**
   * Register a new tool
   */
  registerTool(tool: Tool): void;
  
  /**
   * Get all registered tools
   */
  getTools(): Tool[];
  
  /**
   * Get tool by name
   */
  getTool(name: string): Tool | undefined;
  
  /**
   * Check if tool exists
   */
  hasTool(name: string): boolean;
  
  /**
   * Unregister tool
   */
  unregisterTool(name: string): void;
}

// MCP server handler interface
export interface IMCPServerHandler {
  /**
   * Initialize MCP server
   */
  initialize(): Promise<void>;
  
  /**
   * Start server
   */
  start(): Promise<void>;
  
  /**
   * Stop server
   */
  stop(): Promise<void>;
  
  /**
   * Handle tool call
   */
  handleToolCall(name: string, args: any): Promise<any>;
  
  /**
   * Get server status
   */
  getStatus(): 'stopped' | 'starting' | 'running' | 'stopping';
}

// Tool execution context
export interface ToolExecutionContext {
  /**
   * Tool name
   */
  toolName: string;
  
  /**
   * Tool arguments
   */
  args: Record<string, any>;
  
  /**
   * Execution timestamp
   */
  timestamp: Date;
  
  /**
   * Request ID
   */
  requestId: string;
}