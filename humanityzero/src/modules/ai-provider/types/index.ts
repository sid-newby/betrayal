export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIConfig {
  model: string;
  thinking: boolean;
  thinkingBudget: number;
  systemPrompt: string;
  maxTokens?: number;
  temperature?: number;
  maxSpokenChars?: number;
}

export interface AIResponse {
  id: string;
  content: string;
  stopReason?: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
}

export interface AIProvider {
  sendMessage(messages: AIMessage[], config: AIConfig): Promise<AIResponse>;
  name: string;
  supportedModels: string[];
}

export type ProviderType = 'anthropic' | 'openai';
