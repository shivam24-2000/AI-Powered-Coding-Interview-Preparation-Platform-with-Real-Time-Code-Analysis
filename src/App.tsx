import { useState, useEffect, useRef } from 'react';
import { Navigation } from './components/Navigation';
import { LandingPage } from './components/LandingPage';
import { ProblemDescription } from './components/ProblemDescription';
import { CodeEditor } from './components/CodeEditor';
import { AIAnalysis } from './components/AIAnalysis';
import { OutputPanel, type RunState } from './components/OutputPanel';
import { SettingsModal, DEFAULT_SETTINGS, type EditorSettings } from './components/SettingsModal';
import { ResetModal } from './components/ResetModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import type { AnalysisState } from './types';
import { LANGUAGES, DEFAULT_LANGUAGE, type Language } from './languages';
import { PROBLEMS } from './problems';
import { executeCode } from './pistonApi';
import { buildRunnerCode } from './testRunners';
import { PanelResizer } from './components/PanelResizer';
import { analyzeCode as getAIAnalysis, getChatResponse as getAIChatResponse } from './aiService';
import { quotaManager } from './quotaManager';
import { Lock, ChevronLeft, ChevronUp, Terminal } from 'lucide-react';
import type { ChatMessage } from './types';
import { applyAppTheme } from './themes';
import { useConfetti } from './hooks/useConfetti';
import './App.css';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function App() {
  const { fire: fireConfetti } = useConfetti();
  const [selectedProblem, setSelectedProblem] = useState(PROBLEMS[0]);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [code, setCode] = useState(PROBLEMS[0].templates[DEFAULT_LANGUAGE.id] || '');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<EditorSettings>(DEFAULT_SETTINGS);
  const [runState, setRunState] = useState<RunState>({ status: 'idle' });
  const [isAiAutoEnabled, setIsAiAutoEnabled] = useState(false); // Default to off for quota safety
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [mentorOpen, setMentorOpen] = useState(false);
  const [isMentorFolded, setIsMentorFolded] = useState(false);
  const [isResultsFolded, setIsResultsFolded] = useState(true);
  const [view, setView] = useState<'landing' | 'workspace'>('landing');
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  // Panel sizing state
  const [rightWidth, setRightWidth] = useState(300);
  const [bottomHeight, setBottomHeight] = useState(250);
  const [cooldown, setCooldown] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatTyping, setIsChatTyping] = useState(false);
  const [aiTab, setAiTab] = useState<'analysis' | 'chat'>('analysis');

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      const isTyping = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement).isContentEditable;
      if (e.key === '?' && !isTyping) {
        e.preventDefault();
        setShortcutsOpen(prev => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'j') {
        e.preventDefault();
        setMentorOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

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

  // Apply application theme dynamically
  useEffect(() => {
    applyAppTheme(settings.appTheme);
  }, [settings.appTheme]);

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
    setIsResultsFolded(false);
    const result = await executeCode(selectedLanguage.id, runnerCode, selectedProblem);
    setRunState({ status: 'done', result });

    // Check if everything passed
    const isSuccess = result.exitCode === 0 && !result.stderr.trim() && result.stdout.includes('passed');
    if (isSuccess) {
      // 🎉 Fire confetti immediately
      fireConfetti();

      // Then open Jarvis to suggest next problems
      setTimeout(() => {
        setMentorOpen(true);
        setIsMentorFolded(false);
        setIsAiAutoEnabled(true);
        setAiTab('chat');
        
        const suggestionPrompt = `I just solved the problem "${selectedProblem.title}". Can you suggest 3 similar problems from our available problem list that I should try next, and briefly explain why they are good follow-ups?`;
        
        handleSendMessage(suggestionPrompt);
      }, 800);
    }
  };

  const handleSubmit = () => handleRunCode();

  const handleResetCode = () => {
    setResetModalOpen(true);
  };

  const confirmReset = () => {
    setCode(selectedProblem.templates[selectedLanguage.id] || '');
    setRunState({ status: 'idle' });
  };

  const handleSendMessage = async (content: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsChatTyping(true);

    try {
      const response = await getAIChatResponse(
        [...chatMessages, userMsg],
        code,
        selectedProblem,
        selectedLanguage
      );

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      };

      setChatMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Chat failed:', error);
    } finally {
      setIsChatTyping(false);
    }
  };

  const handleDebugWithJarvis = (output: string) => {
    setMentorOpen(true);
    setIsMentorFolded(false);
    setIsAiAutoEnabled(true);
    setAiTab('chat');
    
    // Slight timeout ensures panel opens and tab switches before message starts
    setTimeout(() => {
      const prompt = `My code is failing. Can you help me debug? Here is the execution output:\n\n${output}`;
      handleSendMessage(prompt);
    }, 100);
  };


  if (view === 'landing') {
    return (
      <LandingPage 
        onStart={(problemId) => {
          if (problemId) handleProblemChange(problemId);
          setView('workspace');
        }} 
      />
    );
  }

  return (
    <div className="app-container">
      <Navigation
        onRunCode={handleRunCode}
        onSubmit={handleSubmit}
        onSettings={() => setSettingsOpen(true)}
        onShortcuts={() => setShortcutsOpen(true)}
        isAnalyzing={analysisState.isAnalyzing}
        isRunning={runState.status === 'running'}
        cooldownRemaining={cooldown}
        timer={settings.showTimer ? formatTime(elapsed) : null}
        onMentor={() => {
          if (!mentorOpen) {
            setMentorOpen(true);
            setIsMentorFolded(false);
            setIsAiAutoEnabled(true);
          } else {
            setMentorOpen(false);
          }
        }}
      />

      <main className="main-workspace">
        <div className="description-container">
          <ProblemDescription
            problem={selectedProblem}
            problems={PROBLEMS}
            onProblemChange={handleProblemChange}
          />
        </div>

        <div className="editor-container" style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '8px', overflow: 'hidden' }}>
          <CodeEditor
            code={code}
            onChange={(val) => setCode(val || '')}
            language={selectedLanguage}
            languages={LANGUAGES}
            onLanguageChange={handleLanguageChange}
            onReset={handleResetCode}
            settings={settings}
          />
          <>
            {isResultsFolded ? (
              <div 
                className="glass-panel dock-bar-results"
                onClick={() => setIsResultsFolded(false)}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}
              >
                <Terminal size={14} className="text-gradient" />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-muted)' }}>TEST RESULTS</span>
                <ChevronUp size={14} style={{ marginLeft: 'auto', opacity: 0.6 }} />
              </div>
            ) : (
              <>
                <PanelResizer 
                  direction="vertical" 
                  onResize={(d) => setBottomHeight(h => Math.max(150, Math.min(800, h - d)))} 
                />
                <div style={{ height: bottomHeight, flex: `0 0 ${bottomHeight}px`, display: 'flex', flexDirection: 'column' }}>
                  <OutputPanel runState={runState} problem={selectedProblem} onClose={() => setIsResultsFolded(true)} onDebugWithJarvis={handleDebugWithJarvis} />
                </div>
              </>
            )}
          </>
        </div>

        {mentorOpen && (
          <>
            {isMentorFolded ? (
              <div 
                className="glass-panel dock-bar-mentor"
                onClick={() => setIsMentorFolded(false)}
              >
                <ChevronLeft size={14} className="text-gradient" />
                <span>SUMMON JARVIS</span>
              </div>
            ) : (
              <>
                <PanelResizer 
                  direction="horizontal" 
                  onResize={(d) => setRightWidth(w => Math.max(250, Math.min(600, w - d)))} 
                />
                <div style={{ 
                  flex: `0 0 ${rightWidth}px`, 
                  width: rightWidth, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  minWidth: 250, 
                  maxWidth: 600,
                  position: 'relative',
                  animation: 'fadeIn 0.3s ease-out'
                }}>
                  <AIAnalysis 
                    state={analysisState} 
                    onRefresh={() => triggerAnalysis(code, selectedProblem, selectedLanguage)}
                    isAutoEnabled={isAiAutoEnabled && runState.status !== 'running'}
                    onToggleAuto={setIsAiAutoEnabled}
                    onClose={() => setIsMentorFolded(true)}
                    chatMessages={chatMessages}
                    onSendMessage={handleSendMessage}
                    isChatTyping={isChatTyping}
                    activeTab={aiTab}
                    onTabChange={setAiTab}
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
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: 'rgba(168, 85, 247, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent-primary)',
                        marginBottom: '16px',
                        border: '1px solid rgba(168, 85, 247, 0.2)'
                      }}>
                        <Lock size={20} />
                      </div>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '6px' }}>Jarvis Paused</h3>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                        Execution prioritizes performance. Analysis resumed shortly.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}
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

      <KeyboardShortcutsModal
        isOpen={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />
    </div>
  );
}

export default App;
