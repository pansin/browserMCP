/**
 * Custom error classes for Browser MCP Server
 */
export declare abstract class BrowserMCPError extends Error {
    cause?: Error | undefined;
    abstract code: string;
    constructor(message: string, cause?: Error | undefined);
}
export declare class NavigationError extends BrowserMCPError {
    code: string;
}
export declare class ElementNotFoundError extends BrowserMCPError {
    code: string;
}
export declare class TimeoutError extends BrowserMCPError {
    code: string;
}
export declare class BrowserCrashError extends BrowserMCPError {
    code: string;
}
export declare class ConfigurationError extends BrowserMCPError {
    code: string;
}
export declare class ToolExecutionError extends BrowserMCPError {
    code: string;
}
export declare class MCPProtocolError extends BrowserMCPError {
    code: string;
}
export declare class SecurityError extends BrowserMCPError {
    code: string;
}
export declare class ValidationError extends BrowserMCPError {
    code: string;
}
//# sourceMappingURL=index.d.ts.map