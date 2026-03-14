import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot } from 'lucide-react';
import type { ChatMessage } from '../types';

interface AIChatProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  isTyping: boolean;
}

export const AIChat: React.FC<AIChatProps> = ({ messages, onSendMessage, isTyping }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    onSendMessage(input.trim());
    setInput('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>
      <div 
        ref={scrollRef}
        className="custom-scrollbar"
        style={{ 
          flex: 1, 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px',
          paddingRight: '4px'
        }}
      >
        {messages.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 20px', 
            color: 'var(--text-muted)',
            fontSize: '0.85rem'
          }}>
            <Bot size={32} style={{ marginBottom: '12px', opacity: 0.3 }} />
            <p>Ask me anything about your logic, time complexity, or how to optimize this solution.</p>
          </div>
        )}

        {messages.map((msg) => (
          <div 
            key={msg.id} 
            style={{ 
              display: 'flex', 
              gap: '12px', 
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              alignItems: 'flex-start'
            }}
          >
            <div style={{ 
              width: '28px', 
              height: '28px', 
              borderRadius: '8px', 
              background: msg.role === 'user' ? 'rgba(255,255,255,0.05)' : 'rgba(168, 85, 247, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: msg.role === 'user' ? 'var(--text-muted)' : 'var(--accent-primary)',
              flexShrink: 0,
              border: msg.role === 'assistant' ? '1px solid rgba(168, 85, 247, 0.2)' : '1px solid rgba(255,255,255,0.1)'
            }}>
              {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            
            <div style={{ 
              maxWidth: '85%',
              padding: '10px 14px',
              borderRadius: '12px',
              fontSize: '0.85rem',
              lineHeight: 1.5,
              background: msg.role === 'user' ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
              border: msg.role === 'user' ? '1px solid rgba(255,255,255,0.05)' : 'none',
              color: msg.role === 'user' ? 'var(--text-primary)' : 'var(--text-muted)',
              whiteSpace: 'pre-wrap'
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ 
              width: '28px', 
              height: '28px', 
              borderRadius: '8px', 
              background: 'rgba(168, 85, 247, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-primary)',
              border: '1px solid rgba(168, 85, 247, 0.2)'
            }}>
              <Bot size={14} />
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <div className="status-dot" style={{ animationDelay: '0s' }}></div>
              <div className="status-dot" style={{ animationDelay: '0.2s' }}></div>
              <div className="status-dot" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
      </div>

      <form 
        onSubmit={handleSubmit}
        style={{ 
          display: 'flex', 
          gap: '8px', 
          padding: '4px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          marginTop: 'auto'
        }}
      >
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          style={{ 
            flex: 1, 
            background: 'transparent', 
            border: 'none', 
            padding: '8px 12px', 
            color: 'var(--text-primary)',
            fontSize: '0.85rem',
            outline: 'none'
          }}
        />
        <button 
          type="submit" 
          disabled={!input.trim() || isTyping}
          className="btn btn-icon"
          style={{ 
            background: input.trim() ? 'var(--accent-primary)' : 'transparent',
            color: input.trim() ? 'white' : 'var(--text-muted)',
            borderRadius: '8px',
            width: '32px',
            height: '32px',
            padding: 0
          }}
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
};
