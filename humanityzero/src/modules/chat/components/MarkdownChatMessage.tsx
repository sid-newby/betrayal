import { ChatMessage as ChatMessageType } from "../types/index";
import { processTextForTTS } from "../../voice/utils/textProcessing";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

interface MarkdownChatMessageProps {
  message: ChatMessageType;
}

export const MarkdownChatMessage = ({ message }: MarkdownChatMessageProps) => {
  // Process the message to identify what would be stripped for TTS
  const processed = processTextForTTS(message.content);

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
        <div className="prose prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                const language = match ? match[1] : '';
                
                if (!inline && match) {
                  return (
                    <div className="my-2">
                      <SyntaxHighlighter
                        language={language}
                        style={vscDarkPlus}
                        customStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '4px',
                          fontSize: '0.875rem',
                          margin: 0,
                        }}
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                      <span className="text-xs text-yellow-500 opacity-75">
                        [code block - not spoken]
                      </span>
                    </div>
                  );
                }
                
                // Inline code
                return (
                  <span className="inline-block">
                    <code 
                      className="px-1 py-0.5 bg-yellow-500/20 text-yellow-500 rounded text-sm font-mono"
                      {...props}
                    >
                      {children}
                    </code>
                    <span className="text-xs text-yellow-500 opacity-75 ml-1">
                      [not spoken]
                    </span>
                  </span>
                );
              },
              // Style other markdown elements
              p: ({ children }) => <p className="mb-2">{children}</p>,
              h1: ({ children }) => <h1 className="text-2xl font-bold mb-2 mt-4">{children}</h1>,
              h2: ({ children }) => <h2 className="text-xl font-bold mb-2 mt-3">{children}</h2>,
              h3: ({ children }) => <h3 className="text-lg font-bold mb-2 mt-2">{children}</h3>,
              ul: ({ children }) => <ul className="list-disc pl-5 mb-2">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-5 mb-2">{children}</ol>,
              li: ({ children }) => <li className="mb-1">{children}</li>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-gray-500 pl-4 italic my-2">
                  {children}
                </blockquote>
              ),
              a: ({ children, href }) => (
                <a href={href} className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-2">
                  <table className="min-w-full border border-gray-600">{children}</table>
                </div>
              ),
              th: ({ children }) => (
                <th className="border border-gray-600 px-2 py-1 bg-gray-800">{children}</th>
              ),
              td: ({ children }) => (
                <td className="border border-gray-600 px-2 py-1">{children}</td>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        {processed.wasStripped && (
          <div className="text-xs text-yellow-500 opacity-75 mt-2">
            <span className="inline-block px-2 py-1 bg-yellow-500/10 rounded">
              ⚠️ Yellow text indicates content not sent to speech
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
