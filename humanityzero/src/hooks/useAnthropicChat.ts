
import { useState, useCallback } from 'react';
import { AnthropicConfig, ChatMessage, AnthropicMessage } from '@/types/anthropic';
import Anthropic from '@anthropic-ai/sdk';
import { speakAssistantMessage } from '@/services/speech-synthesis';

export const useAnthropicChat = (config: AnthropicConfig) => {
  // Instantiate the Anthropic client. It defaults to process.env.ANTHROPIC_API_KEY
  const anthropic = new Anthropic();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (userMessage: string) => {
    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Convert chat messages to Anthropic format
      const anthropicMessages: AnthropicMessage[] = messages.map(msg => ({
        role: msg.role,
        content: [{ type: 'text', text: msg.content }]
      }));

      // Add the new user message
      anthropicMessages.push({
        role: 'user',
        content: [{ type: 'text', text: userMessage }]
      });

      // TODO: Ensure AnthropicConfig type includes systemPrompt and maxTokens for full configuration.
      // System prompt based on README (line 54, 87).
      const systemPrompt = config.systemPrompt || "You are a helpful AI assistant. Your responses should be concise and informative.";
      // max_tokens based on README example (line 85).
      const maxTokens = config.maxTokens || 32000;

      const apiParams: Anthropic.Beta.Messages.MessageCreateParams = {
        model: config.model,
        max_tokens: maxTokens,
        temperature: config.thinking ? 1 : 0, // As per README line 68
        system: systemPrompt,
        messages: anthropicMessages,
      };

      if (config.thinking && config.thinkingBudget) {
        apiParams.thinking = {
          type: "enabled",
          budget_tokens: config.thinkingBudget,
        };
      }
      // TODO: Tools and Betas (e.g., web_search_20250305) from README (lines 117, 149) can be added in Phase 2.
      // apiParams.tools = []; 
      // apiParams.betas = [];

      const apiResponse = await anthropic.beta.messages.create(apiParams);

      let assistantContent = 'Sorry, I could not get a valid response from the assistant.';
      if (apiResponse.content && apiResponse.content.length > 0) {
        const firstBlock = apiResponse.content[0];
        if (firstBlock.type === 'text') {
          assistantContent = firstBlock.text;
        } else if (firstBlock.type === 'tool_use') {
          assistantContent = `Assistant wants to use the '${firstBlock.name}' tool. Tool handling is not yet fully implemented.`;
          console.log('Tool use requested by assistant:', firstBlock);
        }
      } else if (apiResponse.stop_reason) {
        assistantContent = `Message generation stopped due to: ${apiResponse.stop_reason}.`;
      }

      const assistantResponse: ChatMessage = {
        id: apiResponse.id || (Date.now() + 1).toString(), // Use API response ID
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date(),
        // Optionally, include usage data if needed by the application
        // usage: apiResponse.usage 
      };

      setMessages(prev => [...prev, assistantResponse]);

      // Trigger speech synthesis for assistant response using the new service
      if (assistantResponse.content) {
        speakAssistantMessage(assistantResponse.content);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your message.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, config]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  };
};
