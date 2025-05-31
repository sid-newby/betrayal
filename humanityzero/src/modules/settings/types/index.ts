export interface AppConfig {
  model: 'claude-sonnet-4-20250514' | 'claude-opus-4-20250514';
  thinking: boolean;
  thinkingBudget: number;
  systemPrompt: string;
  maxTokens?: number;
}

export interface ConfigUpdateHandler {
  (config: AppConfig): void;
}
