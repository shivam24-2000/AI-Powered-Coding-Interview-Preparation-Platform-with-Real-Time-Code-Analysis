import React, { useState, useEffect } from 'react';
import { Terminal, Brain, Zap, Shield, LogOut, Award, X, Users, Mic, User } from 'lucide-react';
import { PROBLEMS } from '../problems';
import { supabase } from '../supabase';
import { AuthModal } from './AuthModal';

interface LandingPageProps {
  onStart: (problemId?: string) => void;
  session?: any;
  problems?: any[];
  onHistory?: () => void;
  onEditProfile?: () => void;
}



export const LandingPage: React.FC<LandingPageProps> = ({ onStart, session, onHistory, onEditProfile, problems = PROBLEMS }) => {
  const [textIndex, setTextIndex] = useState(0);
  const words = ["Coding Interviews", "Data Structures", "System Thinking", "Logic Challenges"];

  const [problemIndex, setProblemIndex] = useState(0);
  const [authModal, setAuthModal] = useState<'login' | 'signup' | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = Array.from(new Set((problems || []).flatMap((p: any) => p.tags || []))).sort();

  const handleStartWithTags = () => {
    if (selectedTags.length === 0) return;
    
    let matching = (problems || []).filter((p: any) => 
      selectedTags.every(t => p.tags?.includes(t))
    );
    
    if (matching.length === 0) {
      matching = (problems || []).filter((p: any) => 
        selectedTags.some(t => p.tags?.includes(t))
      );
    }
    
    if (matching.length > 0) {
      const randomIdx = Math.floor(Math.random() * matching.length);
      onStart(matching[randomIdx].id);
    } else {
      alert("No problems found with these tags.");
    }
    setTagModalOpen(false);
    setSelectedTags([]);
  };


  useEffect(() => {
    const id = setInterval(() => {
      setProblemIndex(prev => (prev + 1) % problems.length);
    }, 4000); // Cycle problem lists every 4 seconds
    return () => clearInterval(id);
  }, [problems.length]);

  const [typedCode, setTypedCode] = useState("");
  const fullCode = `def two_sum(nums, target):
    # Friday: "Consider how to check previous items in O(1)!"
    # Your optimal code here...
    
    pass`;

  const [fridayText, setFridayText] = useState("Scanning prompt...");
  const answers = ["Scanning code setups...", "Detected O(N²) potential bottlenecks.", "Optimal optimal Hash Map recommended!", "Diagnostics ready ✅"];

  useEffect(() => {
    const id = setInterval(() => {
      setTextIndex(i => (i + 1) % words.length);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let listIndex = 0;
    const answerId = setInterval(() => {
      setFridayText(answers[listIndex % answers.length]);
      listIndex++;
    }, 3500); // Cycles suggestions interval
    return () => clearInterval(answerId);
  }, []);

  useEffect(() => {
    let index = 0;
    const typingId = setInterval(() => {
      if (index <= fullCode.length) {
        setTypedCode(fullCode.slice(0, index));
        index++;
      } else {
        clearInterval(typingId);
      }
    }, 45); // Buttery smooth typing speed
    return () => clearInterval(typingId);
  }, []);

  return (
    <div style={styles.container}>
      {/* 🌌 Animated background glow structures */}
      <div style={styles.bgMesh}></div>

      <div className="parallax-bg" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
        <div style={{ ...styles.bgGlow, top: '-200px', left: '-100px', background: 'radial-gradient(circle, rgba(219, 39, 119, 0.25) 0%, transparent 70%)', animation: 'pulseGlow 10s infinite ease-in-out' }}></div>
        <div style={{ ...styles.bgGlow, top: '-200px', right: '-100px', left: 'auto', background: 'radial-gradient(circle, rgba(124, 58, 237, 0.25) 0%, transparent 70%)', animation: 'pulseGlow 12s infinite ease-in-out reverse' }}></div>
        <div style={{ ...styles.bgGlow, top: '400px', left: '30%', background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)', animation: 'pulseGlow 15s infinite ease-in-out' }}></div>

        {/* ⚡ Cyberpunk Grid Beams */}
        <div className="grid-beam" style={{ left: '15%', animationDelay: '0s' }}></div>
        <div className="grid-beam" style={{ left: '35%', animationDelay: '4s', background: 'linear-gradient(to bottom, transparent, rgba(6, 182, 212, 0.4), transparent)' }}></div>
        <div className="grid-beam" style={{ left: '60%', animationDelay: '1.5s' }}></div>
        <div className="grid-beam" style={{ left: '85%', animationDelay: '6s', background: 'linear-gradient(to bottom, transparent, rgba(219, 39, 119, 0.3), transparent)' }}></div>
      </div>

      {/* 🧭 Navbar */}
      <header style={styles.header}>
        <style>{`
          .hover-menu-item { transition: all 0.2s ease !important; }
          .hover-menu-item:hover { background: rgba(168, 85, 247, 0.1) !important; color: #D8B4FE !important; }
        `}</style>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div className="glass-panel" style={{ padding: '0', borderRadius: '10px', overflow: 'hidden', width: '36px', height: '36px', border: '1px solid rgba(255,255,255,0.15)' }}>
            <img src={`${(import.meta as any).env.BASE_URL}logo.png`} alt="NexCode AI Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <span className="text-gradient" style={{ fontSize: '1.4rem', fontWeight: 700 }}>NexCode AI</span>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {session ? (
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{ ...styles.logoutBtn, gap: '8px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center' }} 
                className="hover-lift"
              >
                {session?.user?.user_metadata?.avatar_url ? (
                  <img src={session.user.user_metadata.avatar_url} alt="Profile" style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(168, 85, 247, 0.4)' }} />
                ) : (
                  <span>👋</span>
                )}
                <span>Welcome, {session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0] || 'User'}</span>
              </button>

              {showProfileMenu && (
                <div style={{ position: 'absolute', top: '100%', right: 0, paddingTop: '8px', zIndex: 1000 }}>
                  <div style={{
                    background: 'rgba(20, 20, 20, 0.85)', backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px',
                    padding: '8px', minWidth: '150px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', gap: '4px'
                  }}>
                    <button onClick={() => { onEditProfile?.(); setShowProfileMenu(false); }} style={{
                      background: 'transparent', border: 'none', color: '#fff',
                      padding: '8px 12px', borderRadius: '8px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem',
                      textAlign: 'left'
                    }} className="hover-menu-item">
                      <User size={14} color="#10B981" /> Edit Profile
                    </button>

                    <button onClick={onHistory} style={{
                      background: 'transparent', border: 'none', color: '#fff',
                      padding: '8px 12px', borderRadius: '8px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem',
                      textAlign: 'left'
                    }} className="hover-menu-item">
                      <Award size={14} color="#A855F7" /> Dashboard
                    </button>
                    <button onClick={handleLogout} style={{
                      background: 'transparent', border: 'none', color: '#EF4444',
                      padding: '8px 12px', borderRadius: '8px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem',
                      textAlign: 'left'
                    }} className="hover-menu-item">
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <button style={styles.loginBtn} className="hover-lift" onClick={() => setAuthModal('login')}>Log in</button>
              <button style={styles.signUpBtn} className="hover-lift" onClick={() => setAuthModal('signup')}>Sign up</button>
            </>
          )}
        </div>

      </header>

      {/* 🚀 Hero Section */}
      <main style={styles.hero}>
        <div style={styles.badge} className="float-anim">
          <Zap size={14} color="#D8B4FE" /> Now with AI Video Mock Interviews — Try it live
        </div>

        <h1 style={styles.title}>
          Ace Your Technical <br />
          <span style={styles.gradientText} className="text-change-anim">{words[textIndex]}</span>
        </h1>

        <p style={styles.subtitle}>
          Practice with a real-time AI interviewer, get instant complexity analysis from Friday, and receive a detailed hiring scorecard — all in your browser.
        </p>

        <div style={{ display:'flex', gap:'12px', flexWrap:'wrap', justifyContent:'center', marginBottom:'40px', position:'relative' }}>
          <div style={styles.ctaWrapper}>
            <button style={styles.ctaButton} onClick={() => {
              if (!session) { setAuthModal('login'); } else { setTagModalOpen(true); }
            }} className="pulse-btn">
              <span>Start Solving Problems</span>
              <div style={styles.ctaGlow}></div>
            </button>
          </div>
          <button
            onClick={() => { if (!session) { setAuthModal('login'); } else { onStart(); } }}
            style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(168,85,247,0.35)', color:'#D8B4FE', padding:'14px 24px', borderRadius:'12px', fontWeight:700, fontSize:'0.92rem', cursor:'pointer', display:'flex', alignItems:'center', gap:'8px', backdropFilter:'blur(10px)', transition:'all 0.3s' }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(168,85,247,0.12)'; e.currentTarget.style.borderColor='rgba(168,85,247,0.6)'; }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor='rgba(168,85,247,0.35)'; }}
          >
            <Mic size={16} /> Try AI Mock Interview
          </button>
        </div>

        {/* 💻 Floating Glass Preview */}
        <div style={styles.previewContainer} className="preview-float">
          <div className="border-beam"></div>
          <div style={styles.previewHeader}>
            <div style={styles.dots}>
              <div style={{ ...styles.dot, background: '#ef4444' }}></div>
              <div style={{ ...styles.dot, background: '#f59e0b' }}></div>
              <div style={{ ...styles.dot, background: '#10b981' }}></div>
            </div>
            <div style={styles.previewTab}>two_sum.py</div>
          </div>
          <div style={styles.previewContent}>
            <pre style={styles.codeBlock}>
              {typedCode}<span className="cursor">|</span>
            </pre>
          </div>
          <div style={styles.floatingFriday} className="friday-pulse">
            <Brain size={16} className="float-anim" color="#A855F7" />
            <span style={{ animation: 'textFade 3.5s infinite ease-in-out' }}>{fridayText}</span>
          </div>
        </div>

        {/* 🛠️ popular problems grid  */}
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Pick a Challenge to Start</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Jump straight into high-tier problems with dynamic verification assists.</p>
        </div>

        <div style={styles.problemsGrid} className="problems-grid-scroll">
          {problems && problems.length > 0 ? (
            [
              problems[problemIndex % problems.length],
              problems[(problemIndex + 1) % problems.length],
              problems[(problemIndex + 2) % problems.length]
            ].filter(Boolean).map((p) => (
              <div key={p.id} style={styles.problemCard} className="hover-lift" onClick={() => {
                if (!session) {
                  setAuthModal('login');
                } else {
                  onStart(p.id);
                }
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{p.title?.replace(/^\d+\.\s*/, '')}</span>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px', borderRadius: '12px',
                    background: p.difficulty === 'Easy' ? 'rgba(16,185,129,0.08)' : p.difficulty === 'Medium' ? 'rgba(245,158,11,0.08)' : 'rgba(239,68,68,0.08)',
                    color: p.difficulty === 'Easy' ? '#10b981' : p.difficulty === 'Medium' ? '#f59e0b' : '#ef4444',
                    border: `1px solid ${p.difficulty === 'Easy' ? 'rgba(16,185,129,0.2)' : 'rgba(239, 158, 11, 0.2)'}`
                  }}>{p.difficulty}</span>
                </div>
                <div style={{ display: 'flex', gap: '4px', marginTop: '10px' }}>
                  {p.tags?.slice(0, 2).map((t: string) => (
                    <span key={t} style={{ fontSize: '0.65rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)', padding: '2px 6px', borderRadius: '4px' }}>{t}</span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', width: '100%', gridColumn: '1 / -1' }}>Loading curated problems...</p>
          )}
        </div>
        {/* 📈 Timeline Tracks (How It Works) */}
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>How It Works</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>From problem selection to a hiring scorecard — in minutes.</p>
        </div>

        <div className="timeline-track" style={{ display: 'flex', gap: '16px', maxWidth: '1000px', width: '100%', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '60px', position: 'relative' }}>
          <div className="timeline-card hover-lift">
            <div className="timeline-dot">1</div>
            <h4>Pick a Problem</h4>
            <p>Choose from our curated library of Array, DP, Trees, and Graph problems tagged by company & difficulty.</p>
          </div>
          <div className="timeline-card hover-lift">
            <div className="timeline-dot">2</div>
            <h4>Code in Monaco IDE</h4>
            <p>Write solutions with VS Code-grade syntax highlighting in Python, Java, C++, Go, and more.</p>
          </div>
          <div className="timeline-card hover-lift" style={{ borderColor: 'rgba(168,85,247,0.2)' }}>
            <div className="timeline-dot" style={{ background: 'rgba(168,85,247,0.25)', boxShadow: '0 0 16px rgba(168,85,247,0.5)' }}>3</div>
            <h4>🎥 AI Mock Interview</h4>
            <p>Face Alex on a live video call. Speak or type your answers. Get asked follow-up questions live.</p>
          </div>
          <div className="timeline-card hover-lift">
            <div className="timeline-dot">4</div>
            <h4>Get Your Scorecard</h4>
            <p>Receive a hire/no-hire verdict plus detailed feedback on communication, efficiency, and code quality.</p>
          </div>
        </div>
      </main>

      {/* 🎥 AI INTERVIEW SHOWCASE */}
      <section style={{ maxWidth: '1000px', margin: '0 auto 64px auto', padding: '0 24px', position: 'relative', zIndex: 5 }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.25)', padding: '5px 14px', borderRadius: '99px', marginBottom: '16px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#A855F7', boxShadow: '0 0 8px #A855F7' }} />
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#D8B4FE', letterSpacing: '0.06em', textTransform: 'uppercase' }}>New — Now Live</span>
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', marginBottom: '10px' }}>AI Video Mock Interview</h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem', maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>
            Meet Alex — a Senior AI Technical Interviewer who asks real questions, reacts to your code live, and generates a detailed hiring report.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="interview-showcase-grid">
          <div style={{ background: 'rgba(14,10,24,0.95)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '20px', overflow: 'hidden', position: 'relative', minHeight: '340px', boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }} className="hover-lift">
            <img
              src={`${(import.meta as any).env.BASE_URL}assets/interviewers/avatar.png`}
              alt="Alex — AI Interviewer"
              style={{ width: '100%', height: '340px', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.0) 40%, rgba(10,5,20,0.96) 100%)' }} />
            <div style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)', padding: '4px 10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
              <span style={{ fontSize: '0.6rem', color: '#10b981', fontWeight: 800 }}>LIVE SESSION</span>
            </div>
            <div style={{ position: 'absolute', bottom: '20px', left: '16px', right: '16px' }}>
              <p style={{ margin: 0, fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>Alex · NexCode AI Sr. Engineer</p>
              <p style={{ margin: '5px 0 0', fontSize: '0.88rem', fontWeight: 700, color: '#fff', lineHeight: 1.4 }}>"Why did you choose a hash map here? Walk me through your reasoning."</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { icon: '🎙️', title: 'Voice or Type Answers', desc: 'Respond by speaking or typing — live transcription shows your words in real-time.' },
              { icon: '🧠', title: 'AI Reacts to Your Code', desc: 'Alex spots issues in your editor and asks targeted follow-up questions live.' },
              { icon: '📊', title: 'Instant Hiring Scorecard', desc: 'Hire / Waitlist / Reject verdict with per-skill feedback: communication, efficiency, code quality.' },
              { icon: '📷', title: 'Real Video Call Interface', desc: 'Webcam PIP, sound-wave indicators, live subtitles — full interview room pressure.' },
              { icon: '🔒', title: 'Session Proctoring Active', desc: 'Practice under simulated monitoring for authentic interview-day conditions.' },
            ].map((f, i) => (
              <div key={i}
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px', padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: '12px', transition: 'border-color 0.3s, background 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(168,85,247,0.3)'; e.currentTarget.style.background='rgba(168,85,247,0.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.05)'; e.currentTarget.style.background='rgba(255,255,255,0.02)'; }}
              >
                <span style={{ fontSize: '1.3rem', lineHeight: 1, flexShrink: 0 }}>{f.icon}</span>
                <div>
                  <p style={{ margin: '0 0 2px 0', fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>{f.title}</p>
                  <p style={{ margin: 0, fontSize: '0.76rem', color: 'rgba(255,255,255,0.48)', lineHeight: 1.5 }}>{f.desc}</p>
                </div>
              </div>
            ))}
            <button
              onClick={() => { if (!session) { setAuthModal('login'); } else { onStart(); } }}
              style={{ marginTop: '4px', padding: '14px', background: 'linear-gradient(135deg, #7C3AED, #DB2777)', border: 'none', borderRadius: '14px', color: '#fff', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 8px 24px rgba(124,58,237,0.35)', transition: 'transform 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}
            >
              🎥 Launch AI Mock Interview
            </button>
          </div>
        </div>
      </section>

      {/* 🛠️ Features Grid (Bento) */}
      <section className="bento-grid" style={{ maxWidth: '1000px', margin: '0 auto 60px auto', padding: '0 24px' }}>
        {/* 🧠 Card 1: Large (Diagnostics + Gauge) */}
        <div className="bento-item bento-2x1 hover-lift" style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="border-beam"></div>
          <div style={styles.iconBox}><Brain size={20} /></div>
          <div>
            <h3>Real-time Complexity Gauge</h3>
            <p>Evaluate your suboptimal loops into static trace memory parameters fully streamed in live execution bounds.</p>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <div style={{ padding: '8px 16px', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: '12px', fontStyle: 'italic', fontWeight: 700, fontSize: '0.9rem', color: '#D8B4FE' }}>Time: O(N)</div>
              <div style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', fontStyle: 'italic', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Space: O(N)</div>
            </div>
          </div>
        </div>

        {/* 💬 Card 2: Small (Friday Chat) */}
        <div className="bento-item hover-lift" style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="border-beam"></div>
          <div style={styles.iconBox}><Terminal size={20} color="#A855F7" /></div>
          <h3>Friday Assist</h3>
          <p>Get subtle contextual assists like optimal solver maps dynamically framing steps natively.</p>
          <div style={{ marginTop: '12px', padding: '6px 12px', background: 'rgba(168,85,247,0.06)', borderRadius: '8px', fontSize: '0.72rem', border: '1px solid rgba(168,85,247,0.1)', color: '#D8B4FE' }}>
            "Use a Hashmap for O(1) searches!"
          </div>
        </div>

        {/* ✅ Card 3: Small (Testcases) */}
        <div className="bento-item hover-lift" style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="border-beam"></div>
          <div style={styles.iconBox}><Zap size={20} /></div>
          <h3>Simulated Execution Loop</h3>
          <p>Instant verification setups running targets diagnostics instantly inside pane splits.</p>
          <div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
            <span style={{ fontSize: '0.65rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(16,185,129,0.1)', color: '#10b981', fontWeight: 700 }}>PASS #1</span>
            <span style={{ fontSize: '0.65rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(16,185,129,0.1)', color: '#10b981', fontWeight: 700 }}>PASS #2</span>
          </div>
        </div>

        {/* 🛡️ Card 4: Large (Structural Hints) */}
        <div className="bento-item bento-2x1 hover-lift" style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="border-beam"></div>
          <div style={styles.iconBox}><Shield size={20} /></div>
          <div>
            <h3>Structural Clue Tiers</h3>
            <p>Assist unlocks unlocking subtle contextual help models whenever blocked without triggering complete absolute algorithms solver sets setup.</p>
            <div style={{ marginTop: '12px', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)', fontSize: '0.78rem', color: '#B4B4B4' }}>
              💡 <span style={{ filter: 'blur(3px)', userSelect: 'none' }}>Use two pointers converging towards middle target values</span>
            </div>
          </div>
        </div>

        {/* 🎙️ Card 5: Small (Friday Voice) */}
        <div className="bento-item hover-lift" style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="border-beam"></div>
          <div style={styles.iconBox}><Mic size={20} color="#10B981" /></div>
          <h3>Friday Voice AI</h3>
          <p>Formulate hands-free prompts using human-like natural dictation triggers native readout layouts.</p>
          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%', boxShadow: '0 0 8px #10B981' }}></div>
            <span style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 600 }}>Adaptive Listening</span>
          </div>
        </div>

        {/* 👥 Card 6: Large (Live Mock Interviews) */}
        <div className="bento-item bento-2x1 hover-lift" style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="border-beam"></div>
          <div style={styles.iconBox}><Users size={20} color="#3B82F6" /></div>
          <div>
            <h3>Peer-to-Peer Mock Interviews</h3>
            <p>Sync code in real-time with a friend over WebRTC. One codes, one interviews — just like a real FAANG round.</p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', alignItems: 'center' }}>
               <div style={{ padding: '6px 12px', background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '8px', fontSize: '0.7rem', color: '#60A5FA', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  🎥 Live Video
               </div>
               <div style={{ padding: '6px 12px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '8px', fontSize: '0.7rem', color: '#10B981' }}>
                  🤝 Real-time Code Sync
               </div>
            </div>
          </div>
        </div>

        {/* 🤖 Card 7: Wide (AI Video Interviewer) */}
        <div className="bento-item bento-2x1 hover-lift" style={{ position: 'relative', overflow: 'hidden', background: 'rgba(168,85,247,0.04)', border: '1px solid rgba(168,85,247,0.15)' }}>
          <div className="border-beam" style={{ opacity: 0.3 }}></div>
          <div style={{ background: 'rgba(168,85,247,0.15)', padding: '10px', borderRadius: '10px', color: '#D8B4FE', marginBottom: '12px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={`${(import.meta as any).env.BASE_URL}assets/interviewers/avatar.png`} alt="Alex" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
          </div>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', padding: '2px 8px', borderRadius: '99px', marginBottom: '8px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981' }} />
              <span style={{ fontSize: '0.6rem', color: '#10b981', fontWeight: 800 }}>NEW</span>
            </div>
            <h3>AI Video Mock Interview</h3>
            <p>Get interviewed by Alex, your AI Senior Engineer. Speak your answers, get live feedback, and receive a real hiring verdict.</p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.65rem', padding: '3px 10px', borderRadius: '6px', background: 'rgba(168,85,247,0.1)', color: '#D8B4FE', border: '1px solid rgba(168,85,247,0.2)', fontWeight: 700 }}>🎙️ Voice Input</span>
              <span style={{ fontSize: '0.65rem', padding: '3px 10px', borderRadius: '6px', background: 'rgba(168,85,247,0.1)', color: '#D8B4FE', border: '1px solid rgba(168,85,247,0.2)', fontWeight: 700 }}>📊 Scorecard</span>
              <span style={{ fontSize: '0.65rem', padding: '3px 10px', borderRadius: '6px', background: 'rgba(168,85,247,0.1)', color: '#D8B4FE', border: '1px solid rgba(168,85,247,0.2)', fontWeight: 700 }}>🎥 Video Call UI</span>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ marginTop: 'auto', borderTop: '1px solid rgba(255, 255, 255, 0.04)', padding: '20px', textAlign: 'center', width: '100%', zIndex: 10, background: 'rgba(3, 1, 8, 0.4)', backdropFilter: 'blur(10px)' }}>
        <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', fontWeight: 500 }}>
          © {new Date().getFullYear()} Shivam Singhal | NexCode AI. All rights reserved.
        </span>
      </footer>

      {authModal && <AuthModal type={authModal} onClose={() => setAuthModal(null)} />}

      {tagModalOpen && (
        <div style={styles.modalBackdrop}>
          <div style={{ ...styles.tagModal, animation: 'viewScaleUp 0.35s cubic-bezier(0.16,1,0.3,1) both', padding: '36px', maxWidth: '480px', position: 'relative', overflow: 'hidden' }} className="glass-panel">
            {/* ❌ Close Button */}
            <button 
              onClick={() => { setTagModalOpen(false); setSelectedTags([]); }} 
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', backdropFilter: 'blur(4px)', zIndex: 10 }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
            >
              <X size={16} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 900, background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.6) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em', marginBottom: '6px' }}>
                Start Your Simulation
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', maxWidth: '280px', margin: '0 auto' }}>
                Pick up to 2 domains to generate a targeted execution buffer workspace.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
              <div style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: selectedTags.length > 0 ? '#10B981' : '#A855F7', boxShadow: `0 0 10px ${selectedTags.length > 0 ? '#10B981' : '#A855F7'}` }} />
                <span>{selectedTags.length} / 2 Modules Selected</span>
              </div>
            </div>

            <div style={{ ...styles.tagGrid, gap: '12px', maxHeight: '280px', padding: '4px', perspective: '1000px' }}>
              {allTags.length > 0 ? (
                allTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedTags(prev => prev.filter(t => t !== tag));
                        } else if (selectedTags.length < 2) {
                          setSelectedTags(prev => [...prev, tag]);
                        }
                      }}
                      style={{
                        padding: '16px 12px',
                        borderRadius: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.04)',
                        background: isSelected ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.12))' : 'rgba(255, 255, 255, 0.015)',
                        color: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        transition: 'transform 0.1s ease, background 0.25s, box-shadow 0.25s',
                        boxShadow: isSelected ? '0 10px 30px rgba(139, 92, 246, 0.22), inset 0 0 10px rgba(255,255,255,0.05)' : 'none',
                        textAlign: 'center',
                        textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap',
                        transformStyle: 'preserve-3d'
                      }}
                      onMouseMove={e => {
                        const r = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - r.left - r.width/2;
                        const y = e.clientY - r.top - r.height/2;
                        e.currentTarget.style.transform = `scale(1.04) rotateY(${x * 0.12}deg) rotateX(${-y * 0.12}deg)`;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'scale(1) rotateY(0deg) rotateX(0deg)';
                      }}
                    >
                      {tag}
                    </button>
                  );
                })
              ) : (
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', gridColumn: '1 / -1', textAlign: 'center' }}>No tags found</p>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
              <button 
                onClick={() => { setTagModalOpen(false); setSelectedTags([]); }} 
                style={{ flex: 1, padding: '13px', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
              >
                Cancel
              </button>
              <button 
                disabled={selectedTags.length === 0} 
                onClick={handleStartWithTags} 
                style={{ 
                  flex: 2, padding: '13px', 
                  background: selectedTags.length > 0 ? 'linear-gradient(135deg, #7C3AED, #DB2777)' : 'rgba(255,255,255,0.05)', 
                  border: 'none', borderRadius: '14px', 
                  color: selectedTags.length > 0 ? '#fff' : 'rgba(255,255,255,0.3)', 
                  fontWeight: 800, cursor: selectedTags.length > 0 ? 'pointer' : 'not-allowed', 
                  fontSize: '0.85rem', 
                  boxShadow: selectedTags.length > 0 ? '0 10px 30px rgba(124, 58, 237, 0.3)' : 'none',
                  transition: 'background 0.2s'
                }}
              >
                {selectedTags.length === 2 ? "Start Simulation" : "Select 2 Modules"}
              </button>
            </div>
          </div>
        </div>
      )}


      {showLogoutConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(3, 1, 8, 0.75)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, animation: 'fadeIn 0.2s ease-out' }}>
          <div style={{ width: '100%', maxWidth: '340px', background: 'rgba(20, 16, 28, 0.95)', border: '1px solid rgba(220, 38, 38, 0.25)', borderRadius: '16px', padding: '24px', textAlign: 'center', boxShadow: '0 20px 50px rgba(220, 38, 38, 0.15)' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#fca5a5', marginBottom: '8px', fontWeight: 800 }}>Confirm Logout</h3>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '24px' }}>Are you sure you want to log out of your session?</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowLogoutConfirm(false)} style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>Cancel</button>
              <button onClick={() => { supabase.auth.signOut(); setShowLogoutConfirm(false); }} style={{ flex: 1, padding: '10px', background: 'linear-gradient(135deg, #DC2626, #EF4444)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem', boxShadow: '0 4px 15px rgba(220, 38, 38, 0.25)' }}>Logout</button>
            </div>
          </div>
        </div>
      )}

      {/* 🎨 Embed scoped styles to run keyframes */}
      <style>{`
        /* Welcome Greeting Animations */
        .welcome-text {
          animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .wave-emoji {
          display: inline-block;
          animation: wave 1.5s infinite ease-in-out;
          transform-origin: 70% 70%;
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes wave {
          0% { transform: rotate(0deg); }
          10% { transform: rotate(14deg); }
          20% { transform: rotate(-8deg); }
          30% { transform: rotate(14deg); }
          40% { transform: rotate(-4deg); }
          50% { transform: rotate(10deg); }
          60% { transform: rotate(0deg); }
          100% { transform: rotate(0deg); }
        }

        /* Cyberpunk Grid Beams */
        .grid-beam {
          position: absolute;
          width: 1px;
          height: 15vh;
          background: linear-gradient(to bottom, transparent, rgba(168, 85, 247, 0.4), transparent);
          animation: beamTravel 8s infinite linear;
          top: -15vh;
          opacity: 0;
        }
        @keyframes beamTravel {
          0% { top: -15vh; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 115vh; opacity: 0; }
        }

        /* Bento Grid Setup */
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 16px;
          z-index: 5;
          position: relative;
        }
        .bento-item {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-start;
          height: 100%;
          backdrop-filter: blur(12px);
          box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        }
        .bento-item p {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.6);
          line-height: 1.5;
          margin-top: 8px;
        }
        .bento-item h3 {
          font-size: 1rem;
          font-weight: 700;
          color: #fff;
          margin: 0;
        }

        @media (min-width: 850px) {
          .bento-grid { grid-template-columns: repeat(3, 1fr); }
          .bento-2x1 { grid-column: span 2; flex-direction: row !important; align-items: center !important; gap: 20px; }
        }
        .interview-showcase-grid {
          grid-template-columns: 1fr 1fr;
        }
        @media (max-width: 700px) {
          .interview-showcase-grid { grid-template-columns: 1fr !important; }
        }
        
        /* Timeline Tracks Setup */
        .timeline-track {
          position: relative;
        }
        @media (min-width: 600px) {
          .timeline-track::before {
            content: '';
            position: absolute;
            top: 32px;
            left: 50px;
            right: 50px;
            height: 1px;
            border-top: 1px dashed rgba(168, 85, 247, 0.3);
            z-index: 0;
          }
        }
        .timeline-card {
          flex: 1 1 200px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 14px;
          padding: 18px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          backdrop-filter: blur(12px);
          z-index: 1;
        }
        .timeline-card h4 { font-size: 0.88rem; font-weight: 700; color: #fff; margin: 0 0 4px 0; }
        .timeline-card p { font-size: 0.74rem; color: rgba(255,255,255,0.55); line-height: 1.4; margin: 0; }
        .timeline-dot {
          width: 28px; height: 28px; background: rgba(168, 85, 247, 0.15); border: 1px solid rgba(168, 85, 247, 0.3);
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          color: #D8B4FE; font-weight: 800; font-size: 0.8rem; margin-bottom: 12px;
          box-shadow: 0 0 10px rgba(168, 85, 247, 0.3);
        }

        /* Scroll Animations (Modern Scroll Timelines) */
        @keyframes revealOnScroll {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes parallaxSlide {
          from { transform: translateY(0px); }
          to { transform: translateY(180px); } /* Slight slow lag */
        }

        @keyframes sparkleFloat {
          0% { transform: translateY(0px) scale(0.8); opacity: 0; }
          20% { opacity: 0.8; }
          80% { opacity: 0.8; }
          100% { transform: translateY(-30px) scale(1.1); opacity: 0; }
        }

        .parallax-bg {
          animation: parallaxSlide linear both;
          animation-timeline: scroll(nearest);
        }

        .timeline-track, .bento-grid, .problems-grid-scroll {
          animation: revealOnScroll linear both;
          animation-timeline: view();
          animation-range: entry 15% cover 30%;
        }

        .float-anim { animation: float 6s infinite ease-in-out; }
        .preview-float { animation: float 6s infinite ease-in-out; }
        .friday-pulse { animation: pulseGlow 4s infinite ease-in-out; }
        .text-change-anim { animation: textFade 2.8s infinite ease-in-out; }
        
        .hover-lift {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 40px rgba(168, 85, 247, 0.15);
          border-color: rgba(168, 85, 247, 0.4) !important;
          background: rgba(255,255,255,0.03) !important;
        }

        .border-beam {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(135deg, #FF007A 0%, #7000FF 50%, #00E5FF 100%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0.15;
          transition: opacity 0.3s;
        }
        .preview-float:hover .border-beam, .bento-item:hover .border-beam {
          opacity: 0.8;
        }

        .cursor {
          display: inline-block;
          width: 3px;
          height: 14px;
          background: #A855F7;
          margin-left: 3px;
          animation: blink 1s step-end infinite;
          vertical-align: middle;
        }

        @keyframes blink { 50% { opacity: 0; } }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.02); }
        }
        @keyframes textFade {
          0%, 100% { opacity: 0.2; transform: translateY(5px); }
          5%, 95% { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0px); }
        }
        @keyframes viewScaleUp {
          from { opacity: 0; transform: scale(0.94); filter: blur(3px); }
          to { opacity: 1; transform: scale(1); filter: blur(0px); }
        }
      `}</style>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: '100vh',
    background: '#030009',
    color: '#fff',
    fontFamily: '"Outfit", sans-serif',
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
    overflowY: 'auto',
    position: 'relative',
    paddingBottom: '60px'
  },
  bgMesh: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px)',
    backgroundSize: '32px 32px',
    opacity: 0.8,
    zIndex: 0
  },
  bgGlow: {
    position: 'absolute',
    width: '600px',
    height: '600px',
    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, rgba(139, 92, 246, 0.03) 50%, transparent 100%)',
    top: '-150px',
    left: 'calc(50% - 300px)',
    borderRadius: '50%',
    filter: 'blur(50px)',
    zIndex: 1,
    animation: 'pulseGlow 8s infinite ease-in-out'
  },
  header: {
    padding: '14px 40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
    backdropFilter: 'blur(10px)',
    zIndex: 10,
    position: 'sticky',
    top: 0
  },
  logo: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoIcon: { background: 'rgba(168, 85, 247, 0.1)', padding: '6px', borderRadius: '8px', border: '1px solid rgba(168, 85, 247, 0.2)' },
  logoText: { fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em', color: '#fff' },
  navBtn: {
    fontSize: '0.78rem', borderRadius: '20px', padding: '7px 16px',
    background: 'rgba(168, 85, 247, 0.12)', border: '1px solid rgba(168, 85, 247, 0.3)',
    color: '#D8B4FE', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
  },
  loginBtn: {
    background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)',
    padding: '7px 15px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s'
  },
  signUpBtn: {
    background: 'linear-gradient(135deg, #7C3AED, #DB2777)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff',
    padding: '7px 15px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(124, 58, 237, 0.25)', transition: 'all 0.3s'
  },
  logoutBtn: {
    background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#fca5a5',
    padding: '7px 15px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
    transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '6px'
  },
  hero: {
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: '60px 24px 40px 24px', textAlign: 'center', zIndex: 5, animation: 'slideUp 0.8s ease-out'
  },
  badge: {
    background: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.2)',
    color: '#D8B4FE', fontSize: '0.75rem', padding: '4px 12px', borderRadius: '16px',
    display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, marginBottom: '20px'
  },
  title: { fontSize: '3.2rem', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '16px', maxWidth: '800px' },
  gradientText: {
    background: 'linear-gradient(135deg, #FF007A 0%, #7000FF 50%, #00E5FF 100%)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block', minWidth: '400px'
  },
  subtitle: { fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', maxWidth: '540px', lineHeight: 1.6, marginBottom: '26px' },
  ctaWrapper: { position: 'relative', marginBottom: '40px' },
  ctaButton: {
    background: '#7000FF', color: '#fff', border: 'none', padding: '14px 28px', borderRadius: '12px',
    fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', position: 'relative', zIndex: 2,
    boxShadow: '0 8px 30px rgba(112, 0, 255, 0.25)'
  },
  ctaGlow: { position: 'absolute', inset: '-2px', background: 'linear-gradient(90deg, #FF007A, #7000FF, #00E5FF)', borderRadius: '14px', zIndex: 1, filter: 'blur(6px)', opacity: 0.6 },
  previewContainer: {
    width: '100%', maxWidth: '550px', background: 'rgba(3, 1, 8, 0.6)', border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '14px', boxShadow: '0 20px 80px rgba(0,0,0,0.6)', backdropFilter: 'blur(20px)',
    textAlign: 'left', position: 'relative', marginBottom: '50px'
  },
  previewHeader: { padding: '12px 16px', borderBottom: '1px solid rgba(255, 255, 255, 0.04)', display: 'flex', alignItems: 'center', gap: '12px' },
  dots: { display: 'flex', gap: '6px' },
  dot: { width: '8px', height: '8px', borderRadius: '50%' },
  previewTab: { fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)', padding: '4px 10px', borderRadius: '6px' },
  previewContent: { padding: '16px 20px', fontFamily: '"Fira Code", monospace', fontSize: '0.78rem', color: '#D4D4D4' },
  codeBlock: { margin: 0, lineHeight: 1.5 },
  floatingFriday: {
    position: 'absolute', bottom: '-16px', right: '20px', background: 'rgba(168, 85, 247, 0.12)',
    border: '1px solid rgba(168, 85, 247, 0.25)', backdropFilter: 'blur(12px)', padding: '8px 14px',
    borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem', fontWeight: 600
  },
  sectionHeader: { margin: '0 0 20px 0', textAlign: 'center' },
  sectionTitle: { fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: '6px' },
  problemsGrid: {
    display: 'flex', gap: '16px', maxWidth: '800px', width: '100%', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '50px'
  },
  problemCard: {
    flex: '1 1 220px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '12px', padding: '16px', textAlign: 'left', cursor: 'pointer', backdropFilter: 'blur(12px)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
  },
  features: {
    display: 'flex', justifyContent: 'center', gap: '20px', padding: '0 20px', maxWidth: '900px', margin: '0 auto', flexWrap: 'wrap', zIndex: 5
  },
  featureCard: {
    flex: '1 1 260px', background: 'rgba(255, 255, 255, 0.01)', border: '1px solid rgba(255, 255, 255, 0.03)',
    borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start'
  },
  iconBox: { background: 'rgba(168, 85, 247, 0.1)', padding: '10px', borderRadius: '10px', color: '#A855F7', marginBottom: '12px' },
  modalBackdrop: {
    position: 'fixed', inset: 0, background: 'rgba(3, 1, 8, 0.75)', backdropFilter: 'blur(12px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, animation: 'fadeIn 0.2s ease-out'
  },
  tagModal: {
    width: '100%', maxWidth: '440px', background: 'rgba(20, 16, 28, 0.95)',
    border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)'
  },
  tagGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
    gap: '8px', maxHeight: '250px', overflowY: 'auto', padding: '4px'
  },
  tagButton: {
    padding: '8px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)',
    color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontSize: '0.78rem', textAlign: 'center',
    transition: 'all 0.2s ease'
  }
};
