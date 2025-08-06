/**
 * MCP server interfaces
 */
import { Tool } from '@modelcontextprotocol/sdk/types.js';
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
//# sourceMappingURL=mcp.d.ts.map