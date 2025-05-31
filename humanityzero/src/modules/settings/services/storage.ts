import { AppConfig } from '../types';

const STORAGE_KEY = 'humanityzero_config';

const DEFAULT_CONFIG: AppConfig = {
  model: 'claude-sonnet-4-20250514',
  thinking: false,
  thinkingBudget: 5000,
  systemPrompt: 'You are a helpful AI assistant. Respond concisely and helpfully to user queries.',
  maxTokens: 32000,
};

export const configStorage = {
  /**
   * Load configuration from localStorage
   * @returns Saved configuration or default configuration
   */
  load(): AppConfig {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with defaults to ensure all fields are present
        return { ...DEFAULT_CONFIG, ...parsed };
      }
    } catch (error) {
      console.error('Error loading config from localStorage:', error);
    }
    return DEFAULT_CONFIG;
  },

  /**
   * Save configuration to localStorage
   * @param config Configuration to save
   */
  save(config: AppConfig): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      console.error('Error saving config to localStorage:', error);
    }
  },

  /**
   * Clear saved configuration
   */
  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing config from localStorage:', error);
    }
  },

  /**
   * Get default configuration
   */
  getDefault(): AppConfig {
    return { ...DEFAULT_CONFIG };
  }
};
