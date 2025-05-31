import { ChatMessage as ChatMessageType } from "../types/index";
import { processTextForTTS, ProcessedTextSegment } from "../../voice/utils/textProcessing";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface EnhancedChatMessageProps {
  message: ChatMessageType;
}

export const EnhancedChatMessage = ({ message }: EnhancedChatMessageProps) => {
  // Process the message to identify stripped content
  const processed = processTextForTTS(message.content);
  
  const renderSegment = (segment: ProcessedTextSegment, index: number) => {
    if (segment.type === 'stripped') {
      // Check if it's a code block
      if (segment.originalContent?.startsWith('```')) {
        const codeContent = segment.originalContent.slice(3, -3);
        const [language, ...codeLines] = codeContent.split('\n');
        const code = codeLines.join('\n');
        
        return (
          <div key={index} className="my-2">
            <SyntaxHighlighter
              language={language || 'javascript'}
              style={vscDarkPlus}
              customStyle={{
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                border: '1px solid gold',
                borderRadius: '4px',
                fontSize: '0.875rem',
              }}
            >
              {code}
            </SyntaxHighlighter>
            <span className="text-xs text-yellow-500 opacity-75">
              [code block - not spoken]
            </span>
          </div>
        );
      } else if (segment.originalContent?.startsWith('`')) {
        // Inline code
        const code = segment.originalContent.slice(1, -1);
        return (
          <span key={index} className="inline-block">
            <code className="px-1 py-0.5 bg-yellow-500/20 text-yellow-500 rounded text-sm font-mono">
              {code}
            </code>
            <span className="text-xs text-yellow-500 opacity-75 ml-1">
              [not spoken]
            </span>
          </span>
        );
      } else {
        // Other stripped content (symbols)
        return (
          <span key={index} className="text-yellow-500 opacity-75">
            {segment.content}
          </span>
        );
      }
    }
    
    // Spoken content
    return <span key={index}>{segment.content}</span>;
  };

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
          {processed.segments.map(renderSegment)}
        </div>
        {processed.wasStripped && (
          <div className="text-xs text-yellow-500 opacity-75 mt-2">
            <span className="inline-block px-2 py-1 bg-yellow-500/10 rounded">
              ⚠️ Gold text indicates content stripped from speech
            </span>
          </div>
        )}
        <div className="text-xs opacity-50 mt-2">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};
