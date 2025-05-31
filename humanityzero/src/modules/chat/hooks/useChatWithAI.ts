import { useCallback } from 'react';
import { useChatState } from './useChatState';
import { useAIProvider, AIConfig, AIMessage } from '../../ai-provider';
import { speakAssistantMessage } from '../../voice/services/speechSynthesis';
import { mcpToolIntegration } from '../../mcp';

export const useChatWithAI = (config: AIConfig) => {
  const chatState = useChatState();
  const { sendMessage: sendToAI } = useAIProvider();

  // Enhance config with MCP tools and system prompt
  const enhancedConfig = {
    ...config,
    tools: mcpToolIntegration.getAvailableAITools(),
    systemPrompt: mcpToolIntegration.generateToolAwareSystemPrompt(config.systemPrompt)
  };

  const sendMessage = useCallback(async (userMessage: string) => {
    // Add user message
    const userMsg = chatState.addUserMessage(userMessage);
    chatState.setLoading(true);

    try {
      // Convert chat messages to AI format
      const aiMessages: AIMessage[] = chatState.messages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      }));

      // Add the new user message
      aiMessages.push({
        role: 'user',
        content: userMessage,
      });

      // Send initial request with MCP tools available
      let response = await sendToAI(aiMessages, enhancedConfig);
      
      // Handle tool calls if present
      if (response.toolCalls && response.toolCalls.length > 0) {
        // Add assistant message with tool calls
        const assistantMsg = chatState.addAssistantMessage(response.content, response.id);
        
        // Execute tool calls via MCP
        const toolResults = await mcpToolIntegration.executeToolCalls(response.toolCalls);
        
        // Add tool results to conversation
        aiMessages.push({
          role: 'assistant',
          content: response.content,
          toolCalls: response.toolCalls
        });
        
        aiMessages.push({
          role: 'tool',
          content: 'Tool execution results',
          toolResults: toolResults
        });
        
        // Get follow-up response with tool results
        const followUpResponse = await sendToAI(aiMessages, enhancedConfig);
        
        // Add the final response
        const finalMsg = chatState.addAssistantMessage(followUpResponse.content, followUpResponse.id);
        
        // Trigger speech synthesis for final response
        if (followUpResponse.content) {
          speakAssistantMessage(followUpResponse.content, config.maxSpokenChars);
        }
      } else {
        // No tool calls, just add the response
        const assistantMsg = chatState.addAssistantMessage(response.content, response.id);
        
        // Trigger speech synthesis
        if (response.content) {
          speakAssistantMessage(response.content, config.maxSpokenChars);
        }
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      chatState.addAssistantMessage('Sorry, I encountered an error processing your message.');
    } finally {
      chatState.setLoading(false);
    }
  }, [chatState, sendToAI, enhancedConfig, config.maxSpokenChars]);

  return {
    ...chatState,
    sendMessage,
  };
};
