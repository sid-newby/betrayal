import { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MarkdownChatMessage, ChatInput, ChatInputRef, useChatWithAI } from '@/modules/chat';
import { MicrophoneButton } from '@/modules/voice';
import { SettingsDrawer, AppConfig, configStorage } from '@/modules/settings';

const Index = () => {
  // Load config from localStorage on mount
  const [config, setConfig] = useState<AppConfig>(() => configStorage.load());


  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<ChatInputRef>(null);
  
  const { messages, isLoading, sendMessage } = useChatWithAI(config);

  // Save config to localStorage whenever it changes
  useEffect(() => {
    configStorage.save(config);
  }, [config]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleTranscription = (text: string) => {
    if (text.trim() && chatInputRef.current) {
      chatInputRef.current.appendText(text.trim());
    }
  };

  const handleSpeech = (text: string) => {
    console.log('Speaking:', text);
  };

  const getModelDisplayName = (model: string) => {
    return model === 'claude-sonnet-4-20250514' ? 'Sonnet 4' : 'Opus 4';
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-white">
        <div className="flex items-center gap-3">
          <h1 className="font-poppins font-black text-5xl tracking-tighter">BETRAYER.</h1>
          <div className="text-sm text-gray-400">
            {getModelDisplayName(config.model)}
            {config.thinking && ' • Thinking'}
          </div>
        </div>
      </div>

      {/* Settings Drawer */}
      <SettingsDrawer config={config} onConfigChange={setConfig} />

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-4xl mx-auto">
            {messages.map((message) => (
              <MarkdownChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-black border border-white p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse delay-100"></div>
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse delay-200"></div>
                    <span className="ml-2 text-gray-400">Assistant is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Chat Input with Microphone */}
        <div className="flex gap-2 p-4 border-t border-white">
          <ChatInput 
            ref={chatInputRef}
            onSendMessage={sendMessage} 
            isLoading={isLoading}
          />
          <MicrophoneButton
            onTranscription={handleTranscription}
            onSpeech={handleSpeech}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
