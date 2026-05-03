import React, { useState } from 'react';
import { X, Book, Rocket, Brain, BarChart3, HelpCircle, ChevronRight, Zap, Shield } from 'lucide-react';

interface DocumentationModalProps {
  onClose: () => void;
}

type TabType = 'basics' | 'ai' | 'scoring' | 'faq';

export const DocumentationModal: React.FC<DocumentationModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('basics');

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--landing-glass-dark)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '850px',
        height: '80vh',
        background: 'var(--landing-card-bg)',
        border: '1px solid var(--landing-border)',
        borderRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
        animation: 'viewScaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }} className="glass-panel">
        
        {/* ❌ Close Button */}
        <button
          onClick={onClose}
          className="modal-close-btn"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'var(--landing-text-dim)',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            zIndex: 10
          }}
        >
          <X size={20} />
        </button>

        {/* 📖 Header */}
        <div style={{ padding: '30px 40px 0', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
            <Book size={24} color="var(--landing-accent)" />
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }} className="text-gradient">Platform Documentation</h2>
          </div>
          <p style={{ color: 'var(--landing-text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Master the NexCode AI simulation environment and evaluation engine.
          </p>
        </div>

        {/* 📑 Tab Navigation */}
        <div style={{ display: 'flex', gap: '8px', padding: '0 40px', marginBottom: '20px', borderBottom: '1px solid var(--landing-border-light)' }}>
          <TabButton active={activeTab === 'basics'} onClick={() => setActiveTab('basics')} icon={<Rocket size={16} />} label="Basics" />
          <TabButton active={activeTab === 'ai'} onClick={() => setActiveTab('ai')} icon={<Brain size={16} />} label="AI Engine" />
          <TabButton active={activeTab === 'scoring'} onClick={() => setActiveTab('scoring')} icon={<BarChart3 size={16} />} label="Scoring" />
          <TabButton active={activeTab === 'faq'} onClick={() => setActiveTab('faq')} icon={<HelpCircle size={16} />} label="FAQ" />
        </div>

        {/* 📜 Scrollable Content */}
        <div style={{ padding: '0 40px 40px', overflowY: 'auto', flex: 1 }} className="custom-scrollbar">
          {activeTab === 'basics' && (
            <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
              <SectionTitle>Getting Started</SectionTitle>
              <DocStep step="1" title="Select Your Challenge">
                Browse our problem bank ranging from Easy to Hard. Each problem is selected to test specific technical competencies like Dynamic Programming, Graph Theory, or System Design.
              </DocStep>
              <DocStep step="2" title="The AI Interviewer">
                Once you start, "Friday" will appear on your screen. She will guide you through the problem, ask for your approach, and monitor your progress in real-time.
              </DocStep>
              <DocStep step="3" title="Submit & Score">
                After completing the code, Friday will conduct a behavioral review. You will then receive a comprehensive scorecard detailing your technical and soft-skill performance.
              </DocStep>
              
              <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(124, 58, 237, 0.05)', borderRadius: '16px', border: '1px solid rgba(124, 58, 237, 0.1)' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: 'var(--landing-accent)', fontWeight: 800 }}>Pro Tip: Use the IDE</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--landing-text-muted)', lineHeight: 1.6 }}>
                  Our IDE supports Vim/Emacs modes and advanced autocomplete. Use <kbd style={{ background: 'var(--landing-border)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem', color: 'var(--landing-text-primary)' }}>Ctrl + Space</kbd> for suggestions.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
              <SectionTitle>Understanding Friday AI</SectionTitle>
              <FeatureCard 
                icon={<Zap size={20} color="#FBBF24" />}
                title="Real-time Complexity Analysis"
                desc="As you type, our engine calculates the Big O complexity of your algorithm. Optimized solutions trigger 'Sparkle' events."
              />
              <FeatureCard 
                icon={<Brain size={20} color="#A855F7" />}
                title="Behavioral Logic"
                desc="Friday monitors your 'Think-Time' and 'Revision-Rate'. Asking clarifying questions early in the session significantly boosts your communication score."
              />
              <FeatureCard 
                icon={<Shield size={20} color="#10B981" />}
                title="Hint System"
                desc="If you get stuck, Friday provides context-aware hints. Note: Using multiple hints slightly reduces your 'Independence' score."
              />
            </div>
          )}

          {activeTab === 'scoring' && (
            <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
              <SectionTitle>The Evaluation Framework</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                <ScoreType title="Technical Mastery" weight="40%" desc="Focuses on Time/Space complexity, edge-case handling, and modular code structure." />
                <ScoreType title="Communication" weight="30%" desc="Measured by how well you explain your brute-force vs optimized approaches." />
                <ScoreType title="Problem Solving" weight="20%" desc="Your ability to pivot when hints are given and your speed of iteration." />
                <ScoreType title="Independence" weight="10%" desc="The ratio of solution progress to AI hint intervention." />
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
              <SectionTitle>Frequently Asked Questions</SectionTitle>
              <FAQItem q="Which languages are supported?" a="Currently, we support Python 3.10, Node.js (JavaScript/TypeScript), and Java 17." />
              <FAQItem q="Is my code used to train AI?" a="No. All user code is processed in private, transient sessions and is not added to any public training datasets." />
              <FAQItem q="Can I redo an interview?" a="Yes! You can redo any problem to improve your score, and our dashboard will track your growth over time." />
              <FAQItem q="How do I hide the video feed?" a="You can toggle the video overlay visibility at any time using the camera icon in the session header." />
            </div>
          )}
        </div>

        {/* 🎨 Theme Scoped Styles */}
        <style>{`
          .doc-tab-btn {
            background: transparent;
            border: none;
            border-bottom: 2px solid transparent;
            color: var(--landing-text-muted);
            transition: all 0.2s;
          }
          .doc-tab-btn:hover {
            color: var(--landing-text-primary);
            background: rgba(124, 58, 237, 0.05);
          }
          .doc-tab-btn.active {
            background: rgba(124, 58, 237, 0.1);
            border-bottom-color: var(--landing-accent);
            color: var(--landing-text-primary);
          }
          .landing-light-mode .modal-close-btn {
            background: #f1f5f9 !important;
            border-color: #e2e8f0 !important;
            color: #64748b !important;
          }
          .landing-light-mode .modal-close-btn:hover {
            background: #e2e8f0 !important;
            color: #0f172a !important;
          }
          .landing-light-mode .doc-tab-btn:hover {
            background: #f1f5f9 !important;
          }
          .landing-light-mode .doc-tab-btn.active {
            background: #eff6ff !important;
          }
        `}</style>
      </div>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`doc-tab-btn ${active ? 'active' : ''}`}
    style={{
      padding: '12px 20px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '0.9rem',
      fontWeight: 700,
      borderRadius: '8px 8px 0 0'
    }}
  >
    {icon}
    {label}
  </button>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--landing-text-primary)', marginBottom: '24px', letterSpacing: '-0.01em' }}>{children}</h3>
);

const DocStep: React.FC<{ step: string, title: string, children: React.ReactNode }> = ({ step, title, children }) => (
  <div style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--landing-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, flexShrink: 0 }}>
      {step}
    </div>
    <div>
      <h4 style={{ margin: '0 0 8px 0', fontSize: '1.05rem', color: 'var(--landing-text-primary)', fontWeight: 800 }}>{title}</h4>
      <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--landing-text-muted)', lineHeight: 1.6 }}>{children}</p>
    </div>
  </div>
);

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, desc: string }> = ({ icon, title, desc }) => (
  <div style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--landing-border)', borderRadius: '16px', marginBottom: '16px', display: 'flex', gap: '16px' }} className="glass-panel">
    <div style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', height: 'fit-content' }}>{icon}</div>
    <div>
      <h4 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', color: 'var(--landing-text-primary)', fontWeight: 800 }}>{title}</h4>
      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--landing-text-dim)', lineHeight: 1.5 }}>{desc}</p>
    </div>
  </div>
);

const ScoreType: React.FC<{ title: string, weight: string, desc: string }> = ({ title, weight, desc }) => (
  <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--landing-border)', borderRadius: '16px' }} className="glass-panel">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
      <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--landing-text-primary)', fontWeight: 800 }}>{title}</h4>
      <span style={{ fontSize: '0.8rem', color: 'var(--landing-accent)', fontWeight: 900 }}>{weight}</span>
    </div>
    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--landing-text-muted)', lineHeight: 1.5 }}>{desc}</p>
  </div>
);

const FAQItem: React.FC<{ q: string, a: string }> = ({ q, a }) => (
  <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--landing-border-light)' }}>
    <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: 'var(--landing-text-primary)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
      <ChevronRight size={16} color="var(--landing-accent)" /> {q}
    </h4>
    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--landing-text-muted)', lineHeight: 1.6, paddingLeft: '26px' }}>{a}</p>
  </div>
);
