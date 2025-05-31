// MCP Proxy React Hook - Provides state and actions for MCP proxy management
import { useState, useEffect, useCallback } from 'react';
import { mcpProxyService } from '../services/mcpProxyService';
import type { 
  MCPProxyConfig, 
  MCPServer, 
  MCPProxyInstance, 
  MCPCapabilities 
} from '../types';

interface MCPProxyState {
  servers: MCPServer[];
  instances: MCPProxyInstance[];
  capabilities: MCPCapabilities;
  isLoading: boolean;
  error: string | null;
}

interface MCPProxyActions {
  registerServer: (server: Omit<MCPServer, 'status'>) => void;
  startProxy: (config?: Partial<MCPProxyConfig>, serverIds?: string[]) => Promise<MCPProxyInstance>;
  stopProxy: (port: number) => Promise<void>;
  refreshState: () => void;
  clearError: () => void;
}

export function useMCPProxy(): MCPProxyState & MCPProxyActions {
  const [state, setState] = useState<MCPProxyState>({
    servers: [],
    instances: [],
    capabilities: { tools: [], resources: [], prompts: [] },
    isLoading: false,
    error: null
  });

  // Refresh state from service
  const refreshState = useCallback(() => {
    try {
      const servers = mcpProxyService.getServers();
      const instances = mcpProxyService.getInstances();
      const capabilities = mcpProxyService.getCapabilities();

      setState(prev => ({
        ...prev,
        servers,
        instances,
        capabilities,
        error: null
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }));
    }
  }, []);

  // Register a new MCP server
  const registerServer = useCallback((server: Omit<MCPServer, 'status'>) => {
    try {
      mcpProxyService.registerServer(server);
      refreshState();
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to register server'
      }));
    }
  }, [refreshState]);

  // Start MCP proxy
  const startProxy = useCallback(async (
    config?: Partial<MCPProxyConfig>, 
    serverIds?: string[]
  ): Promise<MCPProxyInstance> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const instance = await mcpProxyService.startProxy(config, serverIds);
      refreshState();
      setState(prev => ({ ...prev, isLoading: false }));
      return instance;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to start proxy'
      }));
      throw error;
    }
  }, [refreshState]);

  // Stop MCP proxy
  const stopProxy = useCallback(async (port: number): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await mcpProxyService.stopProxy(port);
      refreshState();
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to stop proxy'
      }));
      throw error;
    }
  }, [refreshState]);

  // Clear error state
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Load initial state
  useEffect(() => {
    refreshState();
  }, [refreshState]);

  return {
    ...state,
    registerServer,
    startProxy,
    stopProxy,
    refreshState,
    clearError
  };
}

// Hook for getting MCP capabilities
export function useMCPCapabilities(): MCPCapabilities {
  const [capabilities, setCapabilities] = useState<MCPCapabilities>({
    tools: [],
    resources: [],
    prompts: []
  });

  useEffect(() => {
    const updateCapabilities = () => {
      setCapabilities(mcpProxyService.getCapabilities());
    };

    updateCapabilities();
    
    // Update capabilities every 5 seconds when proxy is running
    const interval = setInterval(updateCapabilities, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return capabilities;
}

// Hook for sending messages to MCP servers
export function useMCPMessaging() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (serverId: string, message: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await mcpProxyService.sendMessage(serverId, message);
      setIsLoading(false);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    sendMessage,
    isLoading,
    error,
    clearError
  };
}
