import Anthropic from '@anthropic-ai/sdk';
import { AIProvider, AIMessage, AIConfig, AIResponse } from '../types';

export class AnthropicProvider implements AIProvider {
  private client: Anthropic;
  
  name = 'Anthropic';
  supportedModels = ['claude-sonnet-4-20250514', 'claude-opus-4-20250514'];

  constructor() {
    this.client = new Anthropic({
      apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
      dangerouslyAllowBrowser: true,
    });
  }

  async sendMessage(messages: AIMessage[], config: AIConfig): Promise<AIResponse> {
    try {
      // Convert to Anthropic format
      const anthropicMessages: Anthropic.Beta.Messages.MessageCreateParams['messages'] = messages.map(msg => ({
        role: msg.role,
        content: [{ type: 'text', text: msg.content }]
      }));

      const systemPrompt = config.systemPrompt || "You are a helpful AI assistant. Your responses should be concise and informative.";
      const maxTokens = config.maxTokens || 32000;

      const apiParams: Anthropic.Beta.Messages.MessageCreateParams = {
        model: config.model,
        max_tokens: maxTokens,
        temperature: config.thinking ? 1 : 0,
        system: systemPrompt,
        messages: anthropicMessages,
      };

      if (config.thinking && config.thinkingBudget) {
        apiParams.thinking = {
          type: "enabled",
          budget_tokens: config.thinkingBudget,
        };
      }

      const response = await this.client.beta.messages.create({
        ...apiParams,
        stream: false,
      });

      let content = 'Sorry, I could not get a valid response from the assistant.';
      if (response.content && response.content.length > 0) {
        const firstBlock = response.content[0];
        if (firstBlock.type === 'text') {
          content = firstBlock.text;
        } else if (firstBlock.type === 'tool_use') {
          content = `Assistant wants to use the '${firstBlock.name}' tool. Tool handling is not yet fully implemented.`;
          console.log('Tool use requested by assistant:', firstBlock);
        }
      } else if (response.stop_reason) {
        content = `Message generation stopped due to: ${response.stop_reason}.`;
      }

      return {
        id: response.id || Date.now().toString(),
        content,
        stopReason: response.stop_reason || undefined,
        usage: response.usage ? {
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
        } : undefined,
      };
    } catch (error) {
      console.error('Anthropic API error:', error);
      throw new Error('Failed to get response from Anthropic');
    }
  }
}
