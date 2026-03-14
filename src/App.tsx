import { useState, useEffect, useRef } from 'react';
import { Navigation } from './components/Navigation';
import { ProblemDescription } from './components/ProblemDescription';
import { CodeEditor } from './components/CodeEditor';
import { AIAnalysis } from './components/AIAnalysis';
import { OutputPanel, type RunState } from './components/OutputPanel';
import { SettingsModal, DEFAULT_SETTINGS, type EditorSettings } from './components/SettingsModal';
import { ResetModal } from './components/ResetModal';
import type { AnalysisState } from './types';
import { LANGUAGES, DEFAULT_LANGUAGE, type Language } from './languages';
import { PROBLEMS } from './problems';
import { executeCode } from './pistonApi';
import { buildRunnerCode } from './testRunners';
import { PanelResizer } from './components/PanelResizer';
import { analyzeCode as getAIAnalysis } from './aiService';
import { quotaManager } from './quotaManager';
import { Lock } from 'lucide-react';
import './App.css';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function App() {
  const [selectedProblem, setSelectedProblem] = useState(PROBLEMS[0]);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [code, setCode] = useState(PROBLEMS[0].templates[DEFAULT_LANGUAGE.id] || '');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<EditorSettings>(DEFAULT_SETTINGS);
  const [runState, setRunState] = useState<RunState>({ status: 'idle' });
  const [isAiAutoEnabled, setIsAiAutoEnabled] = useState(false); // Default to off for quota safety
  const [resetModalOpen, setResetModalOpen] = useState(false);

  // Panel sizing state
  const [rightWidth, setRightWidth] = useState(280);
  const [bottomHeight, setBottomHeight] = useState(250);
  const [cooldown, setCooldown] = useState(0);

  // Poll for quota cooldown
  useEffect(() => {
    const id = setInterval(() => {
      const rem = quotaManager.getRemainingCooldown();
      setCooldown(Math.ceil(rem / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Interview timer
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (settings.showTimer) {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setElapsed(0);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [settings.showTimer]);

  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    isAnalyzing: false,
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    suggestions: [{ id: '1', type: 'info', message: 'Start typing to see real-time analysis.' }],
  });

  const handleLanguageChange = (lang: Language) => {
    setSelectedLanguage(lang);
    setCode(selectedProblem.templates[lang.id] || '');
    setRunState({ status: 'idle' });
  };

  const handleProblemChange = (problemId: string) => {
    const problem = PROBLEMS.find(p => p.id === problemId);
    if (!problem) return;
    setSelectedProblem(problem);
    setCode(problem.templates[selectedLanguage.id] || '');
    setRunState({ status: 'idle' });
    setAnalysisState({
      isAnalyzing: false,
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(1)',
      suggestions: [{ id: 'reset', type: 'info', message: 'Start typing to see real-time analysis.' }],
    });
  };

  // Debounced static analysis
  const lastAnalyzedCodeRef = useRef('');

  useEffect(() => {
    if (!isAiAutoEnabled) return;
    
    // Only analyze if code is meaningfully different
    if (code.trim() === lastAnalyzedCodeRef.current.trim()) return;

    const id = setTimeout(() => {
      triggerAnalysis(code, selectedProblem, selectedLanguage);
      lastAnalyzedCodeRef.current = code;
    }, 3500); 
    return () => clearTimeout(id);
  }, [code, selectedProblem, selectedLanguage, isAiAutoEnabled]);

  const triggerAnalysis = async (currentCode: string, problem: typeof selectedProblem, lang: Language) => {
    if (runState.status === 'running') return; // Prioritize execution over analysis
    
    setAnalysisState(prev => ({ ...prev, isAnalyzing: true }));
    
    try {
      const result = await getAIAnalysis(currentCode, problem, lang);
      setAnalysisState({
        isAnalyzing: false,
        ...result
      });
    } catch (error) {
      console.error('AI Analysis failed:', error);
      setAnalysisState(prev => ({ ...prev, isAnalyzing: false }));
    }
  };

  const handleRunCode = async () => {
    if (quotaManager.isBlocked()) return; // Extra safety
    
    const runnerCode = buildRunnerCode(selectedProblem.id, selectedLanguage.id, code);

    if (!runnerCode) {
      setRunState({ status: 'unsupported' });
      return;
    }

    setRunState({ status: 'running' });
    const result = await executeCode(selectedLanguage.id, runnerCode, selectedProblem);
    setRunState({ status: 'done', result });
  };

  const handleSubmit = () => handleRunCode();

  const handleResetCode = () => {
    setResetModalOpen(true);
  };

  const confirmReset = () => {
    setCode(selectedProblem.templates[selectedLanguage.id] || '');
    setRunState({ status: 'idle' });
  };

  return (
    <div className="app-container">
      <Navigation
        onRunCode={handleRunCode}
        onSubmit={handleSubmit}
        onSettings={() => setSettingsOpen(true)}
        isAnalyzing={analysisState.isAnalyzing}
        isRunning={runState.status === 'running'}
        cooldownRemaining={cooldown}
        timer={settings.showTimer ? formatTime(elapsed) : null}
      />

      <main className="main-workspace">
        <div style={{ flex: '0 0 500px', width: '500px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <ProblemDescription
            problem={selectedProblem}
            problems={PROBLEMS}
            onProblemChange={handleProblemChange}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '350px', gap: '8px', overflow: 'hidden' }}>
          <CodeEditor
            code={code}
            onChange={(val) => setCode(val || '')}
            language={selectedLanguage}
            languages={LANGUAGES}
            onLanguageChange={handleLanguageChange}
            onReset={handleResetCode}
            settings={settings}
          />
          {runState.status !== 'idle' && (
            <>
              <PanelResizer 
                direction="vertical" 
                onResize={(d) => setBottomHeight(h => Math.max(150, Math.min(800, h - d)))} 
              />
              <div style={{ height: bottomHeight, flex: `0 0 ${bottomHeight}px`, display: 'flex', flexDirection: 'column' }}>
                <OutputPanel runState={runState} onClose={() => setRunState({ status: 'idle' })} />
              </div>
            </>
          )}
        </div>

        <PanelResizer 
          direction="horizontal" 
          onResize={(d) => setRightWidth(w => Math.max(200, Math.min(600, w - d)))} 
        />

        <div style={{ flex: `0 0 ${rightWidth}px`, width: rightWidth, display: 'flex', flexDirection: 'column', minWidth: 200, maxWidth: 600, position: 'relative' }}>
          <AIAnalysis 
            state={analysisState} 
            onRefresh={() => triggerAnalysis(code, selectedProblem, selectedLanguage)}
            isAutoEnabled={isAiAutoEnabled && runState.status !== 'running'}
            onToggleAuto={setIsAiAutoEnabled}
          />
          
          {runState.status === 'running' && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(3, 0, 20, 0.7)',
              backdropFilter: 'blur(4px)',
              zIndex: 30,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '24px',
              borderRadius: '12px',
              margin: '0',
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(168, 85, 247, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)',
                marginBottom: '16px',
                border: '1px solid rgba(168, 85, 247, 0.2)'
              }}>
                <Lock size={24} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>AI Mentor Paused</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                Analysis is disabled while code is executing to prioritize performance.
              </p>
            </div>
          )}
        </div>
      </main>

      {settingsOpen && (
        <SettingsModal
          settings={settings}
          onChange={setSettings}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {resetModalOpen && (
        <ResetModal
          onConfirm={confirmReset}
          onClose={() => setResetModalOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
