import { useState, useImperativeHandle, forwardRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export interface ChatInputRef {
  appendText: (text: string) => void;
}

export const ChatInput = forwardRef<ChatInputRef, ChatInputProps>(({ onSendMessage, isLoading }, ref) => {
  const [input, setInput] = useState('');

  useImperativeHandle(ref, () => ({
    appendText: (text: string) => {
      setInput(prev => {
        const newText = prev.trim() ? `${prev} ${text}` : text;
        return newText;
      });
    }
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };



  return (
    <form onSubmit={handleSubmit} className="flex gap-2 flex-1">
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message or use the microphone..."
        className="flex-1 bg-black border-white text-white focus:ring-accent resize-none"
        rows={1}
        disabled={isLoading}
      />
      <Button
        type="submit"
        disabled={!input.trim() || isLoading}
        className="bg-accent hover:bg-accent/90 border border-white squish-button"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
});

ChatInput.displayName = 'ChatInput';
