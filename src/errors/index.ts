/**
 * Custom error classes for Browser MCP Server
 */

// Base error class
export abstract class BrowserMCPError extends Error {
  abstract code: string;
  
  constructor(message: string, public cause?: Error) {
    super(message);
    this.name = this.constructor.name;
    
    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// Navigation related errors
export class NavigationError extends BrowserMCPError {
  code = 'NAVIGATION_ERROR';
}

// Element interaction errors
export class ElementNotFoundError extends BrowserMCPError {
  code = 'ELEMENT_NOT_FOUND';
}

// Timeout errors
export class TimeoutError extends BrowserMCPError {
  code = 'TIMEOUT_ERROR';
}

// Browser crash errors
export class BrowserCrashError extends BrowserMCPError {
  code = 'BROWSER_CRASH';
}

// Configuration errors
export class ConfigurationError extends BrowserMCPError {
  code = 'CONFIGURATION_ERROR';
}

// Tool execution errors
export class ToolExecutionError extends BrowserMCPError {
  code = 'TOOL_EXECUTION_ERROR';
}

// MCP protocol errors
export class MCPProtocolError extends BrowserMCPError {
  code = 'MCP_PROTOCOL_ERROR';
}

// Security errors
export class SecurityError extends BrowserMCPError {
  code = 'SECURITY_ERROR';
}

// Validation errors
export class ValidationError extends BrowserMCPError {
  code = 'VALIDATION_ERROR';
}