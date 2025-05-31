// MCP Types - Model Context Protocol types and interfaces

export interface MCPProxyConfig {
  port: number;
  serverType: 'sse' | 'stream' | 'both';
  sseEndpoint?: string;
  streamEndpoint?: string;
  debug?: boolean;
}

export interface MCPServer {
  id: string;
  name: string;
  command: string;
  args?: string[];
  env?: Record<string, string>;
  status: 'stopped' | 'starting' | 'running' | 'error';
  port?: number;
  url?: string;
}

export interface MCPProxyInstance {
  config: MCPProxyConfig;
  servers: MCPServer[];
  status: 'idle' | 'starting' | 'running' | 'error';
  close: () => Promise<void>;
}

export interface MCPMessage {
  id: string;
  method: string;
  params?: any;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: any;
  serverId: string;
}

export interface MCPResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
  serverId: string;
}

export interface MCPCapabilities {
  tools?: MCPTool[];
  resources?: MCPResource[];
  prompts?: any[];
}
