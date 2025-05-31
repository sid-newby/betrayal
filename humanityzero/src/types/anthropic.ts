
export interface AnthropicMessage {
  role: 'user' | 'assistant';
  content: Array<{
    type: 'text';
    text: string;
  }>;
}

export interface AnthropicConfig {
  model: 'claude-sonnet-4-20250514' | 'claude-opus-4-20250514';
  thinking: boolean;
  thinkingBudget: number;
  systemPrompt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
