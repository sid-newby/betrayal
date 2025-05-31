import { useState, useCallback } from 'react';
import { Message, ChatState } from '../types';

export const useChatState = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const addUserMessage = useCallback((content: string): Message => {
    const message: Message = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };
    addMessage(message);
    return message;
  }, [addMessage]);

  const addAssistantMessage = useCallback((content: string, id?: string): Message => {
    const message: Message = {
      id: id || `assistant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role: 'assistant',
      content,
      timestamp: new Date(),
    };
    addMessage(message);
    return message;
  }, [addMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const chatState: ChatState = {
    messages,
    isLoading,
  };

  return {
    ...chatState,
    addMessage,
    addUserMessage,
    addAssistantMessage,
    clearMessages,
    setLoading,
  };
};
