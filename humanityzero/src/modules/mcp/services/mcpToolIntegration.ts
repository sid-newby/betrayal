// MCP Tool Integration - Bridge between MCP capabilities and AI provider
import { mcpProxyService } from './mcpProxyService';
import type { AITool, AIToolCall, AIToolResult } from '../../ai-provider/types';
import type { MCPCapabilities, MCPTool } from '../types';

class MCPToolIntegration {
  /**
   * Convert MCP tools to AI provider tool format
   */
  convertMCPToolsToAITools(mcpCapabilities: MCPCapabilities): AITool[] {
    const aiTools: AITool[] = [];

    // Convert MCP tools
    if (mcpCapabilities.tools) {
      mcpCapabilities.tools.forEach(mcpTool => {
        aiTools.push({
          name: mcpTool.name,
          description: mcpTool.description,
          input_schema: mcpTool.inputSchema || {
            type: 'object',
            properties: {},
            required: []
          }
        });
      });
    }

    return aiTools;
  }

  /**
   * Execute a tool call via MCP proxy
   */
  async executeToolCall(toolCall: AIToolCall): Promise<AIToolResult> {
    try {
      // Find which server provides this tool
      const capabilities = mcpProxyService.getCapabilities();
      const mcpTool = capabilities.tools?.find(t => t.name === toolCall.name);
      
      if (!mcpTool) {
        return {
          tool_use_id: toolCall.id,
          content: `Error: Tool '${toolCall.name}' not found in MCP capabilities`,
          is_error: true
        };
      }

      // Send the tool call to the appropriate MCP server
      const response = await mcpProxyService.sendMessage(mcpTool.serverId, {
        jsonrpc: '2.0',
        id: toolCall.id,
        method: 'tools/call',
        params: {
          name: toolCall.name,
          arguments: toolCall.input
        }
      });

      // Handle the response
      if (response.error) {
        return {
          tool_use_id: toolCall.id,
          content: `Error executing ${toolCall.name}: ${response.error.message}`,
          is_error: true
        };
      }

      // Format the result as a string
      let resultContent: string;
      if (typeof response.result === 'string') {
        resultContent = response.result;
      } else if (typeof response.result === 'object') {
        resultContent = JSON.stringify(response.result, null, 2);
      } else {
        resultContent = String(response.result);
      }

      return {
        tool_use_id: toolCall.id,
        content: resultContent,
        is_error: false
      };

    } catch (error) {
      console.error('Error executing MCP tool call:', error);
      return {
        tool_use_id: toolCall.id,
        content: `Error executing ${toolCall.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        is_error: true
      };
    }
  }

  /**
   * Execute multiple tool calls in parallel
   */
  async executeToolCalls(toolCalls: AIToolCall[]): Promise<AIToolResult[]> {
    const promises = toolCalls.map(toolCall => this.executeToolCall(toolCall));
    return Promise.all(promises);
  }

  /**
   * Get current available tools for AI provider
   */
  getAvailableAITools(): AITool[] {
    const capabilities = mcpProxyService.getCapabilities();
    return this.convertMCPToolsToAITools(capabilities);
  }

  /**
   * Generate enhanced system prompt with tool descriptions
   */
  generateToolAwareSystemPrompt(basePrompt: string): string {
    const capabilities = mcpProxyService.getCapabilities();
    const tools = capabilities.tools || [];

    if (tools.length === 0) {
      return basePrompt;
    }

    const toolDescriptions = tools.map(tool => {
      const serverId = tool.serverId;
      return `- **${tool.name}** (from ${serverId}): ${tool.description}`;
    }).join('\n');

    const toolPrompt = `

## Available Tools

You have access to the following MCP (Model Context Protocol) tools:

${toolDescriptions}

When you need to use these tools:
1. Use the appropriate tool for the task
2. Provide clear parameters based on the tool's input schema
3. Wait for the tool result before proceeding
4. Interpret and use the tool results in your response

These tools extend your capabilities beyond your training data and allow you to interact with external systems in real-time.`;

    return basePrompt + toolPrompt;
  }

  /**
   * Check if MCP tools are available
   */
  hasAvailableTools(): boolean {
    const capabilities = mcpProxyService.getCapabilities();
    return (capabilities.tools?.length || 0) > 0;
  }

  /**
   * Get tool usage statistics
   */
  getToolStats() {
    const capabilities = mcpProxyService.getCapabilities();
    const servers = mcpProxyService.getServers();
    const runningServers = servers.filter(s => s.status === 'running');
    
    return {
      totalTools: capabilities.tools?.length || 0,
      totalServers: servers.length,
      runningServers: runningServers.length,
      availableResources: capabilities.resources?.length || 0
    };
  }
}

// Export singleton instance
export const mcpToolIntegration = new MCPToolIntegration();
export default mcpToolIntegration;
