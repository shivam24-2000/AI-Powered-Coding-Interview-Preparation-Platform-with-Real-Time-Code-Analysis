import React, { useState } from 'react';
import { CheckCircle, XCircle, Terminal, Loader, WifiOff, ChevronDown } from 'lucide-react';
import type { RunResult } from '../pistonApi';
import type { Problem } from '../types';

export type RunState =
  | { status: 'idle' }
  | { status: 'running' }
  | { status: 'done'; result: RunResult }
  | { status: 'unsupported' };

interface OutputPanelProps {
  runState: RunState;
  problem: Problem;
  onClose: () => void;
  onDebugWithFriday?: (outputStr: string) => void;
}

interface TestcaseData {
  id: number;
  status: 'pass' | 'fail' | 'error';
  input?: string;
  expected?: string;
  actual?: string;
  error?: string;
}

function parseTestCases(stdout: string): TestcaseData[] {
  const cases: TestcaseData[] = [];
  const lines = stdout.split('\n');
  let currentCase: TestcaseData | null = null;

  for (const line of lines) {
    const t = line.trim();
    const match = t.match(/Test (\d+): (✓ PASS|✗ FAIL|✗ ERROR)/);

    if (match) {
      const num = parseInt(match[1]);
      const statusStr = match[2];
      const status: 'pass' | 'fail' | 'error' =
        statusStr.includes('PASS') ? 'pass' :
        statusStr.includes('ERROR') ? 'error' : 'fail';

      currentCase = { id: num, status };
      cases.push(currentCase);
    } else if (currentCase) {
      if (t.includes('Expected:')) {
        currentCase.expected = t.split('Expected:')[1].trim();
      } else if (t.includes('Got:')) {
        currentCase.actual = t.split('Got:')[1].trim();
      } else if (t.includes('Input:')) {
        currentCase.input = t.split('Input:')[1].trim();
      } else if (currentCase.status === 'error' && !t.startsWith('Test')) {
         currentCase.error = (currentCase.error ? currentCase.error + '\n' : '') + t;
      }
    }
  }
  return cases;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({ runState, problem, onClose, onDebugWithFriday }) => {
  const [activeTab, setActiveTab] = useState<'console' | 'testcases'>('testcases'); // Default to testcase tab

  React.useEffect(() => {
    if (runState.status === 'running' || runState.status === 'done') {
      setActiveTab('console');
    }
  }, [runState.status]);

  const renderConsole = () => {
    if (runState.status === 'idle') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px', color: 'var(--text-muted)' }}>
          <Terminal size={32} strokeWidth={1.5} style={{ opacity: 0.4 }} />
          <p style={{ fontSize: '0.875rem', textAlign: 'center' }}>Click <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Run</span> to execute your solution against test cases.</p>
        </div>
      );
    }

    if (runState.status === 'running') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '14px', color: 'var(--accent-primary)' }}>
          <Loader size={32} strokeWidth={1.5} style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ fontSize: '0.875rem' }}>Running against test cases…</p>
        </div>
      );
    }

    if (runState.status === 'unsupported') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px', color: 'var(--text-muted)' }}>
          <Terminal size={32} strokeWidth={1.5} style={{ opacity: 0.4 }} />
          <p style={{ fontSize: '0.875rem', textAlign: 'center' }}>Auto-execution is <span style={{ color: '#ef4444', fontWeight: 600 }}>not available</span> for this language or problem yet.</p>
          <p style={{ fontSize: '0.75rem', opacity: 0.6, maxWidth: '300px', textAlign: 'center' }}>You can still use Friday for manual code reviews!</p>
        </div>
      );
    }

    const { result } = runState as { result: RunResult };
    if (!result) return null;

    if (result.networkError) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px', color: 'var(--error)' }}>
          <WifiOff size={32} strokeWidth={1.5} />
          <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>Connection Error</p>
        </div>
      );
    }

    const hasStderr = result.stderr.trim().length > 0;
    const testCases = parseTestCases(result.stdout);
    const summaryMatch = result.stdout.match(/(\d+)\/(\d+) tests passed/);
    const passed = summaryMatch ? parseInt(summaryMatch[1]) : testCases.filter(c => c.status === 'pass').length;
    const total = summaryMatch ? parseInt(summaryMatch[2]) : testCases.length;
    const allPassed = passed === total && total > 0;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {(testCases.length > 0 || summaryMatch) && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '12px 16px', borderRadius: '12px',
            background: allPassed ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.04)',
            border: `1px solid ${allPassed ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
          }}>
            {allPassed ? <CheckCircle size={20} color="#10b981" /> : <XCircle size={20} color="#ef4444" />}
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: allPassed ? '#10b981' : '#ef4444' }}>
              {allPassed ? 'All Tests Passed 🎉' : `${passed} / ${total} Tests Passed`}
            </span>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
          {result.stdout.split('\n').filter(l => l.length > 0).map((line, i) => (
            <div key={i} style={{ fontSize: '0.82rem', fontFamily: '"Fira Code", monospace', color: 'var(--text-muted)', whiteSpace: 'pre-wrap' }}>{line}</div>
          ))}
        </div>

        {hasStderr && (
          <pre style={{ fontSize: '0.78rem', color: '#ef4444', background: 'rgba(239,68,68,0.04)', padding: '12px', borderRadius: '8px' }}>{result.stderr}</pre>
        )}

        {onDebugWithFriday && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary" onClick={() => onDebugWithFriday(`Stdout:\n${result.stdout}\nStderr:\n${result.stderr}`)}>
              Debug with Friday
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderTestcases = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {problem.examples.map((ex, i) => (
          <div key={i} style={{ padding: '14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Testcase {i + 1}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Input</div>
                <pre style={{ margin: 0, padding: '8px 12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '8px', color: 'var(--text-main)', fontFamily: '"Fira Code", monospace', fontSize: '0.8rem' }}>
                  {ex.input}
                </pre>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Expected Output</div>
                <pre style={{ margin: 0, padding: '8px 12px', background: 'rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '8px', color: 'var(--text-main)', fontFamily: '"Fira Code", monospace', fontSize: '0.8rem' }}>
                  {ex.output}
                </pre>
              </div>
            </div>
          </div>
        ))}
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Note: These test cases will run upon submission or verification.</p>
      </div>
    );
  };

  return (
    <div className="panel output-panel glass-panel" style={{ flex: '1 1 auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="panel-header" style={{ justifyContent: 'space-between', padding: '0 16px', minHeight: '42px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: '16px', height: '100%' }}>
          <button
            onClick={() => setActiveTab('testcases')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
              color: activeTab === 'testcases' ? '#fff' : 'var(--text-muted)',
              borderBottom: activeTab === 'testcases' ? '2px solid var(--accent-primary)' : '2px solid transparent',
              transition: 'all 0.2s', padding: '12px 0'
            }}
          >
            Testcases
          </button>
          <button
            onClick={() => setActiveTab('console')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
              color: activeTab === 'console' ? '#fff' : 'var(--text-muted)',
              borderBottom: activeTab === 'console' ? '2px solid var(--accent-primary)' : '2px solid transparent',
              transition: 'all 0.2s', padding: '12px 0'
            }}
          >
            Console
          </button>
        </div>

        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
          <ChevronDown size={18} />
        </button>
      </div>
      
      <div className="panel-content" style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        {activeTab === 'testcases' ? renderTestcases() : renderConsole()}
      </div>
    </div>
  );
};
