import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Terminal, Loader, WifiOff, ChevronDown } from 'lucide-react';
import type { RunResult } from '../pistonApi';

export type RunState =
  | { status: 'idle' }
  | { status: 'running' }
  | { status: 'done'; result: RunResult }
  | { status: 'unsupported' };

interface OutputPanelProps {
  runState: RunState;
  onClose: () => void;
  onDebugWithJarvis?: (outputStr: string) => void;
}

interface ParsedLine {
  type: 'pass' | 'fail' | 'error' | 'summary' | 'detail' | 'other';
  text: string;
}

function parseOutput(stdout: string): ParsedLine[] {
  return stdout.split('\n').filter(l => l.trim() !== '').map(line => {
    const t = line.trim();
    if (/✓ PASS/.test(t))         return { type: 'pass',    text: t };
    if (/✗ FAIL|✗ ERROR/.test(t)) return { type: 'fail',    text: t };
    if (/tests passed/.test(t))   return { type: 'summary', text: t };
    if (/Expected:|Got:/.test(t)) return { type: 'detail',  text: t };
    if (/ERROR/.test(t))          return { type: 'error',   text: t };
    return { type: 'other', text: t };
  });
}

export const OutputPanel: React.FC<OutputPanelProps> = ({ runState, onClose, onDebugWithJarvis }) => {
  const renderContent = () => {
    if (runState.status === 'idle') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px', color: 'var(--text-muted)' }}>
          <Terminal size={32} strokeWidth={1.5} style={{ opacity: 0.4 }} />
          <p style={{ fontSize: '0.875rem', textAlign: 'center' }}>Click <strong>Run</strong> to execute your solution against test cases.</p>
        </div>
      );
    }

    if (runState.status === 'running') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '14px', color: 'var(--accent-primary)' }}>
          <Loader size={32} strokeWidth={1.5} style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ fontSize: '0.875rem' }}>Running against test cases…</p>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Sending to execution engine</p>
        </div>
      );
    }

    if (runState.status === 'unsupported') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px', color: 'var(--warning)' }}>
          <AlertTriangle size={32} strokeWidth={1.5} />
          <p style={{ fontSize: '0.875rem', textAlign: 'center' }}>No test runner available for this problem + language combination yet.</p>
        </div>
      );
    }

    const { result } = runState;

    if (result.networkError) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px', color: 'var(--error)' }}>
          <WifiOff size={32} strokeWidth={1.5} />
          <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>Connection Error</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>{result.networkError}</p>
        </div>
      );
    }

    const hasStderr = result.stderr.trim().length > 0;
    const lines = parseOutput(result.stdout);
    const summaryLine = lines.find(l => l.type === 'summary');
    const passed = summaryLine ? parseInt(summaryLine.text) : 0;
    const total  = summaryLine ? parseInt(summaryLine.text.split('/')[1]) : 0;
    const allPassed = passed === total && total > 0;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Summary badge */}
        {summaryLine && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 14px', borderRadius: '10px',
            background: allPassed ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.08)',
            border: `1px solid ${allPassed ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
          }}>
            {allPassed
              ? <CheckCircle size={18} color="var(--success)" />
              : <XCircle size={18} color="var(--error)" />}
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: allPassed ? 'var(--success)' : 'var(--error)' }}>
              {summaryLine.text}
            </span>
          </div>
        )}

        {/* Per-test lines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {lines.filter(l => l.type !== 'summary').map((line, i) => {
            const color =
              line.type === 'pass'   ? 'var(--success)' :
              line.type === 'fail'   ? 'var(--error)'   :
              line.type === 'error'  ? 'var(--error)'   :
              line.type === 'detail' ? 'var(--text-muted)' :
              'var(--text-primary)';
            return (
              <div key={i} style={{
                fontSize: '0.82rem', fontFamily: '"Fira Code", monospace',
                color, padding: line.type === 'detail' ? '0 0 0 12px' : '0',
                borderLeft: line.type === 'detail' ? '2px solid rgba(255,255,255,0.08)' : 'none',
              }}>
                {line.text}
              </div>
            );
          })}
        </div>

        {/* Stderr / compile errors */}
        {hasStderr && (
          <div style={{ marginTop: '8px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--error)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={13} /> Compiler / Runtime Error
            </div>
            <pre style={{
              fontSize: '0.78rem', fontFamily: '"Fira Code", monospace',
              color: 'var(--error)', background: 'rgba(239,68,68,0.06)',
              border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px',
              padding: '10px', overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all',
            }}>
              {result.stderr}
            </pre>
          </div>
        )}

        {/* Debug with Jarvis Action Button */}
        {(!allPassed || hasStderr) && onDebugWithJarvis && (
          <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              className="btn btn-secondary"
              onClick={() => onDebugWithJarvis(`Stdout:\n${result.stdout}\n\nStderr:\n${result.stderr}`)}
              style={{ padding: '6px 12px', fontSize: '0.8rem', gap: '6px', color: 'var(--accent-primary)', borderColor: 'rgba(168, 85, 247, 0.3)', background: 'rgba(168, 85, 247, 0.05)' }}
            >
              <AlertTriangle size={14} /> Debug with Jarvis
            </button>
          </div>
        )}
      </div>
    );
  };


  return (
    <div className="panel output-panel glass-panel" style={{ flex: '1 1 auto', height: '100%', animation: 'slideUp 0.2s ease' }}>
      <div className="panel-header">
        <div className="panel-title">
          <Terminal size={16} />
          <span>Test Results</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onClose}
            className="btn btn-icon"
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--text-muted)', 
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '6px'
            }}
            title="Fold Panel"
          >
            <ChevronDown size={18} />
          </button>
        </div>
      </div>
      <div className="panel-content">
        {renderContent()}
      </div>
    </div>
  );
};
