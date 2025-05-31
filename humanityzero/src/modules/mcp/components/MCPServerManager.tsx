// MCP Server Manager Component - UI for managing MCP servers and proxies
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Play, Square, Settings, Server, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';
import { useMCPProxy } from '../hooks/useMCPProxy';
import type { MCPServer, MCPProxyConfig } from '../types';

interface MCPServerManagerProps {
  className?: string;
}

export function MCPServerManager({ className }: MCPServerManagerProps) {
  const {
    servers,
    instances,
    capabilities,
    isLoading,
    error,
    registerServer,
    startProxy,
    stopProxy,
    clearError
  } = useMCPProxy();

  const [newServer, setNewServer] = useState({
    id: '',
    name: '',
    command: '',
    args: '',
    env: ''
  });

  const [proxyConfig, setProxyConfig] = useState<Partial<MCPProxyConfig>>({
    port: 8081,
    serverType: 'both',
    debug: false
  });

  const handleRegisterServer = () => {
    if (!newServer.id || !newServer.name || !newServer.command) {
      return;
    }

    const server: Omit<MCPServer, 'status'> = {
      id: newServer.id,
      name: newServer.name,
      command: newServer.command,
      args: newServer.args ? newServer.args.split(' ') : undefined,
      env: newServer.env ? JSON.parse(newServer.env) : undefined
    };

    registerServer(server);
    setNewServer({ id: '', name: '', command: '', args: '', env: '' });
  };

  const loadFilesystemPreset = () => {
    setNewServer({
      id: 'filesystem',
      name: 'File System Access',
      command: 'node',
      args: 'mcp-servers/start-filesystem.js',
      env: '{}'
    });
  };

  const handleStartProxy = async () => {
    try {
      await startProxy(proxyConfig);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleStopProxy = async (port: number) => {
    try {
      await stopProxy(port);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const getStatusBadge = (status: MCPServer['status']) => {
    const variants = {
      stopped: 'secondary',
      starting: 'default',
      running: 'default',
      error: 'destructive'
    } as const;

    const colors = {
      stopped: 'text-gray-500',
      starting: 'text-yellow-500',
      running: 'text-green-500',
      error: 'text-red-500'
    };

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status}
      </Badge>
    );
  };

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearError}
                className="ml-2"
              >
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Register New Server */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Register MCP Server
            </CardTitle>
            <CardDescription>
              Add a new Model Context Protocol server configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label htmlFor="server-id">Server ID</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Unique identifier for this MCP server (e.g., "filesystem", "web-search"). Used internally for management and referencing.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="server-id"
                  value={newServer.id}
                  onChange={(e) => setNewServer(prev => ({ ...prev, id: e.target.value }))}
                  placeholder="unique-server-id"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label htmlFor="server-name">Server Name</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Human-readable display name for this server (e.g., "File System Access", "Web Search API"). Shows in the UI.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="server-name"
                  value={newServer.name}
                  onChange={(e) => setNewServer(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="My MCP Server"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="server-command">Command</Label>
              <Input
                id="server-command"
                value={newServer.command}
                onChange={(e) => setNewServer(prev => ({ ...prev, command: e.target.value }))}
                placeholder="npx some-mcp-server"
              />
            </div>
            
            <div>
              <Label htmlFor="server-args">Arguments (space-separated)</Label>
              <Input
                id="server-args"
                value={newServer.args}
                onChange={(e) => setNewServer(prev => ({ ...prev, args: e.target.value }))}
                placeholder="--option value --flag"
              />
            </div>
            
            <div>
              <Label htmlFor="server-env">Environment Variables (JSON)</Label>
              <Input
                id="server-env"
                value={newServer.env}
                onChange={(e) => setNewServer(prev => ({ ...prev, env: e.target.value }))}
                placeholder='{"API_KEY": "value"}'
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleRegisterServer}
                disabled={!newServer.id || !newServer.name || !newServer.command}
              >
                Register Server
              </Button>
              <Button
                onClick={loadFilesystemPreset}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Server className="h-4 w-4" />
                Load Preset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Proxy Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Proxy Configuration
            </CardTitle>
            <CardDescription>
              Configure and manage the MCP proxy server
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="proxy-port">Port</Label>
                <Input
                  id="proxy-port"
                  type="number"
                  value={proxyConfig.port}
                  onChange={(e) => setProxyConfig(prev => ({ ...prev, port: parseInt(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="server-type">Server Type</Label>
                <Select
                  value={proxyConfig.serverType}
                  onValueChange={(value: 'sse' | 'stream' | 'both') => 
                    setProxyConfig(prev => ({ ...prev, serverType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="both">Both (SSE + Stream)</SelectItem>
                    <SelectItem value="sse">SSE Only</SelectItem>
                    <SelectItem value="stream">Stream Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                onClick={handleStartProxy}
                disabled={isLoading || instances.length > 0}
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                Start Proxy
              </Button>
              
              {instances.map(instance => (
                <Button
                  key={instance.config.port}
                  onClick={() => handleStopProxy(instance.config.port)}
                  disabled={isLoading}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Square className="h-4 w-4" />
                  Stop :{instance.config.port}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Registered Servers */}
        <Card>
          <CardHeader>
            <CardTitle>Registered Servers</CardTitle>
            <CardDescription>
              {servers.length} server(s) registered
            </CardDescription>
          </CardHeader>
          <CardContent>
            {servers.length === 0 ? (
              <p className="text-muted-foreground">No servers registered yet.</p>
            ) : (
              <div className="space-y-3">
                {servers.map(server => (
                  <div key={server.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{server.name}</span>
                        {getStatusBadge(server.status)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {server.command} {server.args?.join(' ')}
                      </div>
                      {server.url && (
                        <div className="text-xs text-blue-500">{server.url}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {server.status === 'running' && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Running Instances */}
        {instances.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Running Proxy Instances</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {instances.map(instance => (
                  <div key={instance.config.port} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">Port {instance.config.port}</span>
                        <Badge variant="default" className="ml-2 text-green-500">
                          {instance.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {instance.servers.length} server(s)
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Type: {instance.config.serverType} | 
                      SSE: {instance.config.sseEndpoint} | 
                      Stream: {instance.config.streamEndpoint}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Capabilities */}
        {capabilities.tools && capabilities.tools.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Available Tools</CardTitle>
              <CardDescription>
                {capabilities.tools.length} tool(s) available from running servers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {capabilities.tools.map(tool => (
                  <div key={`${tool.serverId}-${tool.name}`} className="p-2 border rounded">
                    <div className="font-medium">{tool.name}</div>
                    <div className="text-sm text-muted-foreground">{tool.description}</div>
                    <div className="text-xs text-blue-500">From: {tool.serverId}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
