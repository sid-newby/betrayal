export interface AIMessage {
  role: 'user' | 'assistant' | 'tool';
  content: string;
  toolCalls?: AIToolCall[];
  toolResults?: AIToolResult[];
}

export interface AITool {
  name: string;
  description: string;
  input_schema: any;
}

export interface AIToolCall {
  id: string;
  name: string;
  input: any;
}

export interface AIToolResult {
  tool_use_id: string;
  content: string;
  is_error?: boolean;
}

export interface AIConfig {
  model: string;
  thinking: boolean;
  thinkingBudget: number;
  systemPrompt: string;
  maxTokens?: number;
  temperature?: number;
  maxSpokenChars?: number;
  tools?: AITool[];
}

export interface AIResponse {
  id: string;
  content: string;
  stopReason?: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
  toolCalls?: AIToolCall[];
}

export interface AIProvider {
  sendMessage(messages: AIMessage[], config: AIConfig): Promise<AIResponse>;
  name: string;
  supportedModels: string[];
}

export type ProviderType = 'anthropic' | 'openai';
