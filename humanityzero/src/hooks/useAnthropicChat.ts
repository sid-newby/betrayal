
import { useState, useCallback } from 'react';
import { AnthropicConfig, ChatMessage, AnthropicMessage } from '@/types/anthropic';

export const useAnthropicChat = (config: AnthropicConfig) => {
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

      // This would normally make an API call to Anthropic
      // For now, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const assistantResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I received your message: "${userMessage}". This is a simulated response. In a real implementation, this would be connected to the Anthropic API using the ${config.model} model${config.thinking ? ` with thinking enabled (budget: ${config.thinkingBudget} tokens)` : ''}.`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantResponse]);
      
      // Trigger speech synthesis for assistant response
      if ((window as any).speakText) {
        (window as any).speakText(assistantResponse.content);
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
