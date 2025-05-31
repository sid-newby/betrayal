import { useCallback } from 'react';
import { useChatState } from './useChatState';
import { useAIProvider, AIConfig } from '../../ai-provider';
import { speakAssistantMessage } from '../../voice/services/speechSynthesis';

export const useChatWithAI = (config: AIConfig) => {
  const chatState = useChatState();
  const { sendMessage: sendToAI } = useAIProvider();

  const sendMessage = useCallback(async (userMessage: string) => {
    // Add user message
    const userMsg = chatState.addUserMessage(userMessage);
    chatState.setLoading(true);

    try {
      // Convert chat messages to AI format
      const aiMessages = chatState.messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      // Add the new user message
      aiMessages.push({
        role: 'user',
        content: userMessage,
      });

      // Get AI response
      const response = await sendToAI(aiMessages, config);
      
      // Add assistant message
      const assistantMsg = chatState.addAssistantMessage(response.content, response.id);

      // Trigger speech synthesis
      if (response.content) {
        speakAssistantMessage(response.content, config.maxSpokenChars);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      chatState.addAssistantMessage('Sorry, I encountered an error processing your message.');
    } finally {
      chatState.setLoading(false);
    }
  }, [chatState, sendToAI, config]);

  return {
    ...chatState,
    sendMessage,
  };
};
