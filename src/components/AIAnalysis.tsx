import React from 'react';
import { Activity, AlertTriangle, CheckCircle, Info, Cpu, Zap, RefreshCw, MessageSquareOff, MessageSquare, ChevronRight, BookOpen, ShieldAlert, MessagesSquare } from 'lucide-react';
import type { AnalysisState, ChatMessage } from '../types';
import { AIChat } from './AIChat';

interface AIAnalysisProps {
  state: AnalysisState;
  onRefresh: () => void;
  isAutoEnabled: boolean;
  onToggleAuto: (enabled: boolean) => void;
  onClose?: () => void;
  chatMessages: ChatMessage[];
  onSendMessage: (content: string) => void;
  isChatTyping: boolean;
}

export const AIAnalysis: React.FC<AIAnalysisProps> = ({ 
  state, 
  onRefresh, 
  isAutoEnabled, 
  onToggleAuto,
  onClose,
  chatMessages,
  onSendMessage,
  isChatTyping
}) => {
  const [analyzingMessage, setAnalyzingMessage] = React.useState('Analyzing...');
  const [activeTab, setActiveTab] = React.useState<'analysis' | 'chat'>('analysis');
  
  React.useEffect(() => {
    if (!state.isAnalyzing) return;
    
    const messages = ['Analyzing...', 'Optimizing...', 'Evaluating...'];
    let idx = 0;
    const id = setInterval(() => {
      idx = (idx + 1) % messages.length;
      setAnalyzingMessage(messages[idx]);
    }, 800);
    return () => clearInterval(id);
  }, [state.isAnalyzing]);

  return (
    <div className="panel analysis-panel glass-panel animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="panel-header" style={{ justifyContent: 'space-between', paddingLeft: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={16} className="text-gradient" />
          <span style={{ fontWeight: 600 }}>Jarvis</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => onToggleAuto(!isAutoEnabled)}
            className={`btn btn-icon ${isAutoEnabled ? 'active' : ''}`}
            title={isAutoEnabled ? "Disable Auto-Jarvis" : "Enable Auto-Jarvis"}
            style={{ 
              background: isAutoEnabled ? 'rgba(168, 85, 247, 0.1)' : 'transparent',
              padding: '4px',
              borderRadius: '6px',
              color: isAutoEnabled ? 'var(--accent-primary)' : 'var(--text-muted)'
            }}
          >
            {isAutoEnabled ? <MessageSquare size={14} /> : <MessageSquareOff size={14} />}
          </button>
          
          <button
            onClick={onRefresh}
            disabled={state.isAnalyzing}
            className="btn btn-icon"
            style={{ padding: '4px', borderRadius: '6px' }}
          >
            <RefreshCw size={14} className={state.isAnalyzing ? 'animate-spin' : ''} />
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="btn btn-icon"
              style={{ padding: '4px', opacity: 0.6 }}
              title="Fold Panel"
            >
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
      
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.01)' }}>
        <button 
          onClick={() => setActiveTab('analysis')}
          style={{ 
            flex: 1, 
            padding: '10px', 
            fontSize: '0.75rem', 
            fontWeight: 600,
            color: activeTab === 'analysis' ? 'var(--accent-primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'analysis' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            background: 'transparent',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Activity size={14} />
            AI REVIEW
          </div>
        </button>
        <button 
          onClick={() => setActiveTab('chat')}
          style={{ 
            flex: 1, 
            padding: '10px', 
            fontSize: '0.75rem', 
            fontWeight: 600,
            color: activeTab === 'chat' ? 'var(--accent-primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'chat' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            background: 'transparent',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <MessagesSquare size={14} />
            DIRECT CHAT
          </div>
        </button>
      </div>
      
      <div className="panel-content custom-scrollbar" style={{ flex: 1, padding: '16px' }}>
        {activeTab === 'analysis' ? (
          <>
            <div className="analysis-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="analysis-header">
                <Cpu size={18} className="text-gradient" />
                <span>Complexity Estimation</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Time:</span>
                <span className="stat-value">{state.timeComplexity}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Space:</span>
                <span className="stat-value">{state.spaceComplexity}</span>
              </div>
            </div>

            <div className="analysis-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="analysis-header" style={{ marginBottom: '8px' }}>
                <Zap size={18} className="text-gradient" />
                <span>AI Feedback</span>
              </div>
              
              {state.isAnalyzing && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 0', color: 'var(--accent-primary)', fontSize: '0.85rem' }}>
                  <div className="status-dot"></div>
                  <span>{analyzingMessage}</span>
                </div>
              )}
              
              {!state.isAnalyzing && state.suggestions.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '16px 0' }}>
                  No issues detected. Looking good!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {state.suggestions.map((suggestion) => (
                    <div key={suggestion.id} className="feedback-item">
                      <div className="feedback-icon" style={{ marginTop: '2px' }}>
                        {suggestion.type === 'error' && <AlertTriangle size={14} color="var(--error)" />}
                        {suggestion.type === 'warning' && <AlertTriangle size={14} color="var(--warning)" />}
                        {suggestion.type === 'info' && <Info size={14} color="var(--accent-secondary)" />}
                        {suggestion.type === 'success' && <CheckCircle size={14} color="var(--success)" />}
                      </div>
                      <div className="feedback-content" style={{ fontSize: '0.8rem' }}>
                        {suggestion.line && (
                          <span className="badge badge-purple" style={{ marginRight: '8px', padding: '1px 6px', fontSize: '0.65rem' }}>
                            Line {suggestion.line}
                          </span>
                        )}
                        <span>{suggestion.message}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {state.explanation && state.explanation.length > 0 && (
              <div className="analysis-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="analysis-header" style={{ marginBottom: '12px' }}>
                  <BookOpen size={18} className="text-gradient" />
                  <span>Logic Walkthrough</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {state.explanation.map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', lineHeight: 1.5 }}>
                      <div style={{ 
                        flexShrink: 0, 
                        width: '20px', 
                        height: '20px', 
                        borderRadius: '50%', 
                        background: 'rgba(168, 85, 247, 0.1)', 
                        color: 'var(--accent-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        border: '1px solid rgba(168, 85, 247, 0.2)'
                      }}>
                        {idx + 1}
                      </div>
                      <div style={{ color: 'var(--text-muted)' }}>{step}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {state.edgeCases && state.edgeCases.length > 0 && (
              <div className="analysis-card animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="analysis-header" style={{ marginBottom: '12px' }}>
                  <ShieldAlert size={18} className="text-gradient" />
                  <span>Edge Case Discovery</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {state.edgeCases.map((edge) => (
                    <div key={edge.id} style={{ padding: '10px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{edge.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{edge.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <AIChat 
            messages={chatMessages} 
            onSendMessage={onSendMessage} 
            isTyping={isChatTyping} 
          />
        )}
      </div>
    </div>
  );
};
