import React from 'react';
import { Activity, AlertTriangle, CheckCircle, Info, Cpu, Zap, RefreshCw, MessageSquareOff, MessageSquare } from 'lucide-react';
import type { AnalysisState } from '../types';

interface AIAnalysisProps {
  state: AnalysisState;
  onRefresh: () => void;
  isAutoEnabled: boolean;
  onToggleAuto: (enabled: boolean) => void;
}

export const AIAnalysis: React.FC<AIAnalysisProps> = ({ 
  state, 
  onRefresh, 
  isAutoEnabled, 
  onToggleAuto 
}) => {
  const [analyzingMessage, setAnalyzingMessage] = React.useState('Analyzing...');
  
  React.useEffect(() => {
    if (!state.isAnalyzing) return;
    
    const messages = [
      'Analyzing...',
      'Optimizing...',
      'Evaluating...',
    ];
    let idx = 0;
    const id = setInterval(() => {
      idx = (idx + 1) % messages.length;
      setAnalyzingMessage(messages[idx]);
    }, 800);
    return () => clearInterval(id);
  }, [state.isAnalyzing]);

  return (
    <div className="panel analysis-panel glass-panel">
      <div className="panel-header" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={16} />
          <span>Feedback Mentor</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => onToggleAuto(!isAutoEnabled)}
            className={`btn btn-icon ${isAutoEnabled ? 'active' : ''}`}
            title={isAutoEnabled ? "Disable Auto-Mentor" : "Enable Auto-Mentor"}
            style={{ 
              background: isAutoEnabled ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
              padding: '4px',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.05)',
              color: isAutoEnabled ? 'var(--accent-primary)' : 'var(--text-muted)'
            }}
          >
            {isAutoEnabled ? <MessageSquare size={14} /> : <MessageSquareOff size={14} />}
          </button>
          
          <button
            onClick={onRefresh}
            disabled={state.isAnalyzing}
            className="btn btn-icon"
            style={{ padding: '4px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <RefreshCw size={14} className={state.isAnalyzing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>
      
      <div className="panel-content">
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

        <div className="analysis-card animate-fade-in" style={{ animationDelay: '0.2s', padding: '12px 16px' }}>
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
                  <div className="feedback-icon">
                    {suggestion.type === 'error' && <AlertTriangle size={16} color="var(--error)" />}
                    {suggestion.type === 'warning' && <AlertTriangle size={16} color="var(--warning)" />}
                    {suggestion.type === 'info' && <Info size={16} color="var(--accent-secondary)" />}
                    {suggestion.type === 'success' && <CheckCircle size={16} color="var(--success)" />}
                  </div>
                  <div className="feedback-content">
                    {suggestion.line && (
                      <span className="badge badge-purple" style={{ marginRight: '8px' }}>
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
      </div>
    </div>
  );
};
