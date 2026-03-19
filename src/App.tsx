import { useState, useEffect, useRef } from 'react';
import { supabase } from './supabase';
import { Navigation } from './components/Navigation';
import { LandingPage } from './components/LandingPage';
import { HistoryPage } from './components/HistoryPage';
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

const AuthToast = ({ type }: { type: 'login' | 'logout' }) => (
  <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: 'rgba(20,16,28,0.95)', border: `1px solid ${type === 'login' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(220, 38, 38, 0.25)'}`, padding: '16px 20px', borderRadius: '14px', backdropFilter: 'blur(12px)', boxShadow: `0 10px 40px ${type === 'login' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(220, 38, 38, 0.15)'}`, display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1000 }}>
    <style>{`
      @keyframes slideInRight {
        from { opacity: 0; transform: translateX(100px); }
        to { opacity: 1; transform: translateX(0); }
      }
    `}</style>
    <div style={{ padding: '8px', background: type === 'login' ? 'rgba(168, 85, 247, 0.12)' : 'rgba(220, 38, 38, 0.12)', borderRadius: '10px', animation: 'slideInRight 0.4s ease-out' }}><Terminal size={20} color={type === 'login' ? '#D8B4FE' : '#fca5a5'} /></div>
    <div style={{ animation: 'slideInRight 0.4s ease-out' }}>
      <h4 style={{ margin: 0, color: '#fff', fontSize: '0.88rem', fontWeight: 700 }}>{type === 'login' ? 'Successfully Logged In' : 'Successfully Logged Out'}</h4>
      <p style={{ margin: '2px 0 0 0', color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>{type === 'login' ? 'Welcome back to NexCode AI' : 'Your session has ended securely'}</p>
    </div>
  </div>
);

function App() {
  const { fire: fireConfetti } = useConfetti();
  const [problems, setProblems] = useState<any[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<any>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [code, setCode] = useState<string>('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<EditorSettings>(DEFAULT_SETTINGS);
  const [runState, setRunState] = useState<RunState>({ status: 'idle' });
  const [submitState, setSubmitState] = useState<RunState>({ status: 'idle' });
  const [isAiAutoEnabled, setIsAiAutoEnabled] = useState(false); // Default to off for quota safety
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [mentorOpen, setMentorOpen] = useState(false);
  const [isMentorFolded, setIsMentorFolded] = useState(false);
  const [isResultsFolded, setIsResultsFolded] = useState(true);
  const [view, setView] = useState<'landing' | 'workspace' | 'history'>('landing');
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [authToast, setAuthToast] = useState<'login' | 'logout' | null>(null);
  const isInitialLoadRef = useRef(true);

  useEffect(() => {
    // Skip if Supabase is not configured yet
    const isPlaceholder = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('placeholder');
    if (isPlaceholder) return;

        // 🚀 Fetcher for problems
    const fetchProblems = async () => {
      const { data } = await supabase.from('problems').select('*');
      if (data && data.length > 0) {
        setProblems(data);
        setSelectedProblem(data[0]);
        if (data[0].templates) {
            setCode(data[0].templates[selectedLanguage?.id || 'python'] || '');
        }
      }
    };
    fetchProblems();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (_event === 'SIGNED_IN') {
        if (!isInitialLoadRef.current) {
          setAuthToast('login');
          setTimeout(() => setAuthToast(null), 4000);
        }
      } else if (_event === 'SIGNED_OUT') {
        setAuthToast('logout');
        setTimeout(() => setAuthToast(null), 4000);
      }
      setSession(session);
      isInitialLoadRef.current = false;
    });

    return () => subscription.unsubscribe();
  }, []);

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
    const problem = (problems || []).find(p => p.id === problemId);
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
  };

  const handleSubmit = async () => {
    if (quotaManager.isBlocked()) return;
    
    const runnerCode = buildRunnerCode(selectedProblem.id, selectedLanguage.id, code);

    if (!runnerCode) {
      setSubmitState({ status: 'unsupported' });
      return;
    }

    setSubmitState({ status: 'running' });
    setIsResultsFolded(false);
    const result = await executeCode(selectedLanguage.id, runnerCode, selectedProblem);
    setSubmitState({ status: 'done', result });

    // 📊 Log submission history to Supabase
    const isSuccess = result.exitCode === 0 && !result.stderr.trim() && result.stdout.includes('passed');
    
    if (session?.user?.id) {
       await supabase.from('submissions').insert({
          user_id: session.user.id,
          problem_id: selectedProblem.id,
          problem_title: selectedProblem.title.replace(/^\d+\.\s*/, ''),
          status: isSuccess ? 'passed' : 'failed',
          language: selectedLanguage.id,
          code: code
       });
    }

    if (isSuccess) {
      fireConfetti();

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


  return (
    <div key={view} style={{ animation: 'viewFadeIn 0.4s cubic-bezier(0.1, 0.9, 0.2, 1)', height: '100dvh', overflow: 'hidden' }}>
      <style>{`
        @keyframes viewFadeIn {
          from { opacity: 0; transform: scale(0.992) translateY(6px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
      
      {view === 'landing' ? (
        <>
          <LandingPage 
            onStart={(problemId) => {
              if (problemId) handleProblemChange(problemId);
              setView('workspace');
            }} 
            session={session}
            problems={problems}
            onHistory={() => setView('history')}
          />
          {authToast && <AuthToast type={authToast} />}
        </>
      ) : view === 'history' ? (
        <HistoryPage onBack={() => setView('landing')} session={session} />
      ) : !selectedProblem ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#fff', fontSize: '1rem', background: '#030009' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, fontWeight: 600 }}>Loading workspace...</p>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>Securing execution sandbox</p>
          </div>
        </div>
      ) : (
        <div className="app-container">
      <Navigation
        onRunCode={handleRunCode}
        onSubmit={handleSubmit}
        onSettings={() => setSettingsOpen(true)}
        onShortcuts={() => setShortcutsOpen(true)}
        onBackToLanding={() => setView('landing')}
        session={session}
        onHistory={() => setView('history')}
        isAnalyzing={analysisState.isAnalyzing}
        isRunning={runState.status === 'running'}
        isSubmitting={submitState.status === 'running'}
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
            problems={problems}
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
                  <OutputPanel runState={submitState.status !== 'idle' ? submitState : runState} problem={selectedProblem} onClose={() => setIsResultsFolded(true)} onDebugWithJarvis={handleDebugWithJarvis} />
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

      {authToast && <AuthToast type={authToast} />}
        </div>
      )}
    </div>
  );
}

export default App;
