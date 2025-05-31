import { useCallback } from 'react';
import { AnthropicProvider } from '../adapters/AnthropicProvider';
import { AIProvider, AIMessage, AIConfig, AIResponse } from '../types';

export const useAIProvider = () => {
  const provider: AIProvider = new AnthropicProvider();

  const sendMessage = useCallback(async (messages: AIMessage[], config: AIConfig): Promise<AIResponse> => {
    return await provider.sendMessage(messages, config);
  }, [provider]);

  return {
    sendMessage,
    provider,
  };
};
