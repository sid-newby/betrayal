import { ChatMessage as ChatMessageType } from "../types";

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div className={`flex w-full mb-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`
          max-w-[80%] p-4 rounded-lg border border-white
          ${message.role === 'user' 
            ? 'bg-accent text-white' 
            : 'bg-black text-white'
          }
        `}
      >
        <div className="text-sm mb-1 opacity-70">
          {message.role === 'user' ? 'You' : 'Assistant'}
        </div>
        <div className="whitespace-pre-wrap">
          {message.content}
        </div>
        <div className="text-xs opacity-50 mt-2">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};
