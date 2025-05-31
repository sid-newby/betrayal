export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Message extends ChatMessage {}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}
