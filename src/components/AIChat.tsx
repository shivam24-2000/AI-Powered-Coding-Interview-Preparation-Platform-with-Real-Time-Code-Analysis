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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px' }}>
      <div 
        ref={scrollRef}
        className="custom-scrollbar"
        style={{ 
          flex: 1, 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '20px',
          paddingRight: '6px',
          paddingTop: '4px'
        }}
      >
        {messages.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px', 
            color: 'var(--text-muted)',
            fontSize: '0.85rem'
          }}>
              <div style={{
                width: '50px', height: '50px', borderRadius: '16px',
                background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px', color: 'var(--accent-primary)',
                boxShadow: '0 8px 16px rgba(168, 85, 247, 0.15)'
              }}>
                <Bot size={24} />
              </div>
            <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>Jarvis logic stream</p>
            <p style={{ fontSize: '0.78rem', opacity: 0.8 }}>Ask me anything about your logic, time complexity, or how to optimize this solution.</p>
          </div>
        )}

        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className="animate-fade-in"
            style={{ 
              display: 'flex', 
              gap: '10px', 
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              alignItems: 'flex-start'
            }}
          >
            <div style={{ 
              width: '30px', 
              height: '30px', 
              borderRadius: '10px', 
              background: msg.role === 'user' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(168, 85, 247, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: msg.role === 'user' ? 'white' : 'var(--accent-primary)',
              flexShrink: 0,
              border: msg.role === 'assistant' ? '1px solid rgba(168, 85, 247, 0.2)' : '1px solid rgba(255,255,255,0.05)',
              boxShadow: msg.role === 'assistant' ? '0 2px 8px rgba(168, 85, 247, 0.1)' : 'none'
            }}>
              {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            
            <div style={{ 
              maxWidth: '85%',
              padding: '11px 15px',
              borderRadius: '12px',
              fontSize: '0.82rem',
              lineHeight: 1.55,
              background: msg.role === 'user' 
                ? 'var(--accent-secondary)' 
                : 'rgba(255, 255, 255, 0.03)',
              border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.04)',
              color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
              boxShadow: msg.role === 'user' ? '0 4px 12px rgba(99, 102, 241, 0.2)' : 'none',
              whiteSpace: 'pre-wrap',
              borderTopRightRadius: msg.role === 'user' ? '2px' : '12px',
              borderTopLeftRadius: msg.role === 'user' ? '12px' : '2px',
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }} className="animate-fade-in">
            <div style={{ 
              width: '30px', 
              height: '30px', 
              borderRadius: '10px', 
              background: 'rgba(168, 85, 247, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-primary)',
              border: '1px solid rgba(168, 85, 247, 0.2)'
            }}>
              <Bot size={14} />
            </div>
            <div style={{ display: 'flex', gap: '5px', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)', borderTopLeftRadius: '2px' }}>
              <div className="status-dot" style={{ animationDelay: '0s', background: 'var(--accent-primary)', width: '6px', height: '6px' }}></div>
              <div className="status-dot" style={{ animationDelay: '0.2s', background: 'var(--accent-primary)', width: '6px', height: '6px' }}></div>
              <div className="status-dot" style={{ animationDelay: '0.4s', background: 'var(--accent-primary)', width: '6px', height: '6px' }}></div>
            </div>
          </div>
        )}
      </div>

      <form 
        onSubmit={handleSubmit}
        style={{ 
          display: 'flex', 
          gap: '8px', 
          padding: '6px 6px 6px 14px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '12px',
          marginTop: 'auto',
          alignItems: 'center',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}
      >
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Jarvis..."
          style={{ 
            flex: 1, 
            background: 'transparent', 
            border: 'none', 
            color: 'var(--text-primary)',
            fontSize: '0.82rem',
            outline: 'none',
            padding: '4px 0'
          }}
        />
        <button 
          type="submit" 
          disabled={!input.trim() || isTyping}
          className="btn btn-icon"
          style={{ 
            background: input.trim() ? 'var(--accent-primary)' : 'rgba(255,255,255,0.03)',
            color: 'white',
            borderRadius: '10px',
            width: '32px',
            height: '32px',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            boxShadow: input.trim() ? '0 4px 12px var(--glow-primary)' : 'none'
          }}
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
};

