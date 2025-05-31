import Anthropic from '@anthropic-ai/sdk';
import { AIProvider, AIMessage, AIConfig, AIResponse, AITool, AIToolCall } from '../types';

export class AnthropicProvider implements AIProvider {
  private client: Anthropic;
  
  name = 'Anthropic';
  supportedModels = ['claude-sonnet-4-20250514', 'claude-opus-4-20250514'];

  constructor() {
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === 'your_anthropic_key_here') {
      console.warn('VITE_ANTHROPIC_API_KEY not found or not set. Please add your Anthropic API key to the .env file.');
    }
    
    this.client = new Anthropic({
      apiKey: apiKey || 'dummy-key',
      dangerouslyAllowBrowser: true,
    });
  }

  async sendMessage(messages: AIMessage[], config: AIConfig): Promise<AIResponse> {
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === 'your_anthropic_key_here') {
      return {
        id: Date.now().toString(),
        content: '🔑 API Key Required: Please add your Anthropic API key to the .env file as VITE_ANTHROPIC_API_KEY to enable AI chat functionality. You can get an API key from https://console.anthropic.com/',
        stopReason: 'no_api_key',
      };
    }
    
    try {
      // Convert to Anthropic format
      const anthropicMessages: Anthropic.Beta.Messages.MessageCreateParams['messages'] = messages.map(msg => {
        if (msg.role === 'tool') {
          // Handle tool result messages
          const toolResults = msg.toolResults || [];
          return {
            role: 'user' as const,
            content: toolResults.map(result => ({
              type: 'tool_result' as const,
              tool_use_id: result.tool_use_id,
              content: result.content,
              is_error: result.is_error
            }))
          };
        } else if (msg.toolCalls && msg.toolCalls.length > 0) {
          // Handle assistant messages with tool calls
          const content: any[] = [];
          if (msg.content) {
            content.push({ type: 'text', text: msg.content });
          }
          msg.toolCalls.forEach(toolCall => {
            content.push({
              type: 'tool_use',
              id: toolCall.id,
              name: toolCall.name,
              input: toolCall.input
            });
          });
          return {
            role: msg.role as 'user' | 'assistant',
            content
          };
        } else {
          return {
            role: msg.role as 'user' | 'assistant',
            content: [{ type: 'text', text: msg.content }]
          };
        }
      });

      const systemPrompt = config.systemPrompt || "You are a helpful AI assistant. Your responses should be concise and informative.";
      const maxTokens = config.maxTokens || 32000;

      const apiParams: Anthropic.Beta.Messages.MessageCreateParams = {
        model: config.model,
        max_tokens: maxTokens,
        temperature: config.thinking ? 1 : 0,
        system: systemPrompt,
        messages: anthropicMessages,
        stream: true,
      };

      // Add tools if available
      if (config.tools && config.tools.length > 0) {
        apiParams.tools = config.tools.map(tool => ({
          name: tool.name,
          description: tool.description,
          input_schema: tool.input_schema
        }));
      }

      if (config.thinking && config.thinkingBudget) {
        apiParams.thinking = {
          type: "enabled",
          budget_tokens: config.thinkingBudget,
        };
      }

      const stream = await this.client.beta.messages.create(apiParams);
      
      let content = '';
      let responseId = '';
      let stopReason: string | undefined;
      let usage: { inputTokens: number; outputTokens: number } | undefined;
      let toolCalls: AIToolCall[] = [];

      for await (const chunk of stream) {
        if (chunk.type === 'message_start') {
          responseId = chunk.message.id;
          if (chunk.message.usage) {
            usage = {
              inputTokens: chunk.message.usage.input_tokens,
              outputTokens: chunk.message.usage.output_tokens,
            };
          }
        } else if (chunk.type === 'content_block_delta') {
          if (chunk.delta.type === 'text_delta') {
            content += chunk.delta.text;
          } else if (chunk.delta.type === 'input_json_delta') {
            // Handle tool input streaming if needed
          }
        } else if (chunk.type === 'content_block_start') {
          if (chunk.content_block.type === 'tool_use') {
            toolCalls.push({
              id: chunk.content_block.id,
              name: chunk.content_block.name,
              input: chunk.content_block.input
            });
          }
        } else if (chunk.type === 'message_delta') {
          stopReason = chunk.delta.stop_reason || undefined;
          if (chunk.usage) {
            usage = {
              inputTokens: usage?.inputTokens || 0,
              outputTokens: chunk.usage.output_tokens,
            };
          }
        }
      }

      if (!content) {
        content = 'Sorry, I could not get a valid response from the assistant.';
      }

      return {
        id: responseId || Date.now().toString(),
        content,
        stopReason,
        usage,
        toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
      };
    } catch (error) {
      console.error('Anthropic API error:', error);
      throw new Error('Failed to get response from Anthropic');
    }
  }
}
