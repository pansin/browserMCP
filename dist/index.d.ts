/**
 * Browser MCP Server entry point
 */
export * from './types/index.js';
export * from './interfaces/tools.js';
export * from './interfaces/browser.js';
export * from './interfaces/mcp.js';
export * from './errors/index.js';
export * from './config/default.js';
export declare class BrowserMCPServer {
    constructor();
    start(): Promise<void>;
    stop(): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map