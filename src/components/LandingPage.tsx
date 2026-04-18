import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Brain, Zap, Shield, LogOut, Award, X, Users, Mic, User, TrendingUp, CheckCircle, Star, ArrowRight, MessageCircle, Sparkles } from 'lucide-react';
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

  // Live activity feed
  const [liveActivity, setLiveActivity] = useState<{ text: string; visible: boolean }>({ text: '', visible: false });
  const activityMessages = [
    { name: 'Aarav', action: 'solved Two Sum', emoji: '✅', time: '2s ago' },
    { name: 'Priya', action: 'started a Mock Interview', emoji: '🎥', time: '5s ago' },
    { name: 'Jake', action: 'passed all test cases', emoji: '🎉', time: '8s ago' },
    { name: 'Sarah', action: 'got a Hire verdict', emoji: '🏆', time: '12s ago' },
    { name: 'Ravi', action: 'solved Merge Intervals', emoji: '⚡', time: '15s ago' },
    { name: 'Emily', action: 'started a Peer Interview', emoji: '👥', time: '20s ago' },
  ];

  useEffect(() => {
    let idx = 0;
    const showNext = () => {
      const msg = activityMessages[idx % activityMessages.length];
      setLiveActivity({ text: `${msg.emoji} ${msg.name} ${msg.action} — ${msg.time}`, visible: true });
      setTimeout(() => setLiveActivity(prev => ({ ...prev, visible: false })), 3500);
      idx++;
    };
    const timer = setInterval(showNext, 5000);
    setTimeout(showNext, 2000);
    return () => clearInterval(timer);
  }, []);

  // Friday AI Companion Logic
  const [fridayBubble, setFridayBubble] = useState<{ text: string; visible: boolean }>({ text: "Hi! I'm Friday. Just here to help you ace those interviews. 🚀", visible: false });
  const fridayQuotes = [
    "Don't forget to talk through your logic out loud!",
    "Alex (the AI Interviewer) is in a good mood today. Good luck!",
    "Did you know? NexCode users pass FAANG rounds 4x faster.",
    "Try the 'Coin Change' problem if you want a challenge!",
    "Your communication score is just as important as your code.",
    "Friday tip: Start with a brute force, then optimize! 💡",
  ];

  useEffect(() => {
    const showFriday = () => {
      const quote = fridayQuotes[Math.floor(Math.random() * fridayQuotes.length)];
      setFridayBubble({ text: quote, visible: true });
      setTimeout(() => setFridayBubble(prev => ({ ...prev, visible: false })), 6000);
    };
    const timer = setInterval(showFriday, 25000); // Show every 25s
    const firstTimer = setTimeout(showFriday, 10000); // First one at 10s
    return () => { clearInterval(timer); clearTimeout(firstTimer); };
  }, []);

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
  const fullCodePreview = `def find_median(arr):
    # Friday: "Remember O(log N) is the goal!"
    arr.sort() 
    n = len(arr)
    mid = n // 2
    if n % 2 == 0:
        return (arr[mid-1] + arr[mid]) / 2
    return arr[mid]`;

  useEffect(() => {
    let current = "";
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullCodePreview.length) {
        current += fullCodePreview[i];
        setTypedCode(current);
        i++;
      } else {
        setTimeout(() => {
          current = "";
          i = 0;
          setTypedCode("");
        }, 5000);
      }
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // 📈 Statistics Logic
  const [statsVisible, setStatsVisible] = useState(false);
  const [counters, setCounters] = useState({ solved: 0, pass: 0, langs: 0, mocks: 0 });
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!statsRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!statsVisible) return;
    const targets = { solved: 2847, pass: 94, langs: 12, mocks: 500 };
    let startTime: number;
    const duration = 2200;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCounters({
        solved: Math.floor(eased * targets.solved),
        pass: Math.floor(eased * targets.pass),
        langs: Math.floor(eased * targets.langs),
        mocks: Math.floor(eased * targets.mocks),
      });
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [statsVisible]);

  // 🖱️ 3D Preview Interaction
  const previewRef = useRef<HTMLDivElement>(null);
  const handlePreviewMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 25;
    const rotateY = (centerX - x) / 25;
    previewRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };
  const handlePreviewMouseLeave = () => {
    if (!previewRef.current) return;
    previewRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.querySelectorAll('.hover-glow').forEach((el: any) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        el.style.setProperty('--mouse-x', `${x}px`);
        el.style.setProperty('--mouse-y', `${y}px`);
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
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

        {/* 🪄 Magical Floating Particles */}
        <div className="particle float-anim" style={{ left: '10%', animationDelay: '0s', animationDuration: '14s' }}>✦</div>
        <div className="particle float-anim" style={{ left: '25%', animationDelay: '2s', animationDuration: '18s', fontSize: '0.8rem', color: '#00E5FF' }}>●</div>
        <div className="particle float-anim" style={{ left: '45%', animationDelay: '1s', animationDuration: '16s', fontSize: '1rem' }}>✖</div>
        <div className="particle float-anim" style={{ left: '70%', animationDelay: '3s', animationDuration: '20s', fontSize: '1.5rem', color: '#FF007A' }}>✧</div>
        <div className="particle float-anim" style={{ left: '85%', animationDelay: '0.5s', animationDuration: '15s' }}>●</div>
        <div className="particle float-anim" style={{ left: '95%', animationDelay: '4s', animationDuration: '19s' }}>✦</div>
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
          <div className="live-dot" />
          <Zap size={14} color="#D8B4FE" /> Now with AI Video Mock Interviews — Try it live
        </div>

        <h1 style={styles.title}>
          Ace Your Technical <br />
          <span style={styles.gradientText} className="text-change-anim">{words[textIndex]}</span>
        </h1>

        <p style={styles.subtitle}>
          Practice with a real-time AI interviewer, get instant complexity analysis from Friday, and receive a detailed hiring scorecard — all in your browser.
        </p>

        <div style={{ display:'flex', gap:'14px', flexWrap:'wrap', justifyContent:'center', alignItems:'center', marginBottom:'44px', position:'relative' }}>
          <div style={{ position: 'relative' }}>
            <button style={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)', color: '#fff', border: 'none', padding: '15px 32px', borderRadius: '14px', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', position: 'relative', zIndex: 2, boxShadow: '0 8px 32px rgba(124,58,237,0.4), inset 0 1px 0 rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.01em' }} onClick={() => {
              setTagModalOpen(true);
            }} className="magic-btn">
              <Zap size={16} /> Start Solving Problems
              <div style={{ position: 'absolute', inset: '-2px', background: 'linear-gradient(90deg, #FF007A, #7000FF, #00E5FF)', borderRadius: '16px', zIndex: -1, filter: 'blur(8px)', opacity: 0.5 }} className="magic-glow"></div>
            </button>
          </div>
          <button
            onClick={() => { onStart(); }}
            style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(168,85,247,0.3)', color:'#D8B4FE', padding:'15px 28px', borderRadius:'14px', fontWeight:700, fontSize:'0.92rem', cursor:'pointer', display:'flex', alignItems:'center', gap:'8px', backdropFilter:'blur(10px)', transition:'all 0.3s' }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(168,85,247,0.12)'; e.currentTarget.style.borderColor='rgba(168,85,247,0.6)'; e.currentTarget.style.transform='translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor='rgba(168,85,247,0.3)'; e.currentTarget.style.transform='translateY(0)'; }}
          >
            <Mic size={16} /> Try AI Mock Interview
          </button>
        </div>

        {/* 💻 Floating Glass Preview with 3D Tilt */}
        <div
          ref={previewRef}
          style={{ ...styles.previewContainer, transition: 'transform 0.15s ease-out', transformStyle: 'preserve-3d', willChange: 'transform' }}
          className="hover-glow"
          onMouseMove={handlePreviewMouseMove}
          onMouseLeave={handlePreviewMouseLeave}
        >
          <div className="border-beam"></div>
          <div style={styles.previewHeader}>
            <div style={styles.dots}>
              <div style={{ ...styles.dot, background: '#ef4444' }}></div>
              <div style={{ ...styles.dot, background: '#f59e0b' }}></div>
              <div style={{ ...styles.dot, background: '#10b981' }}></div>
            </div>
            <div style={styles.previewTab}>
              <span style={{ color: '#10b981', marginRight: '6px' }}>●</span>two_sum.py
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.6rem', color: '#10b981', fontWeight: 700, background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: '4px' }}>Python</span>
            </div>
          </div>
          <div style={{ ...styles.previewContent, position: 'relative' }}>
            <div style={{ position: 'absolute', left: '6px', top: '16px', display: 'flex', flexDirection: 'column', gap: '3.5px', color: 'rgba(255,255,255,0.15)', fontSize: '0.68rem', fontFamily: '"Fira Code", monospace', lineHeight: '1.5', userSelect: 'none' }}>
              {typedCode.split('\n').map((_, i) => <span key={i}>{i + 1}</span>)}
            </div>
            <pre style={{ ...styles.codeBlock, paddingLeft: '28px' }}>
              {typedCode.split('\n').map((line, i) => {
                const highlighted = line
                  .replace(/(def |return |for |in |if )/g, '<kw>$1</kw>')
                  .replace(/(#.*)/g, '<cm>$1</cm>')
                  .replace(/("[^"]*"|'[^']*')/g, '<st>$1</st>')
                  .replace(/\b(\d+)\b/g, '<nm>$1</nm>');
                return (
                  <span key={i} dangerouslySetInnerHTML={{ __html: highlighted }} />
                );
              }).reduce((acc: any[], el, i) => i === 0 ? [el] : [...acc, '\n', el], [])}
              <span className="cursor">|</span>
            </pre>
          </div>
          <div style={styles.floatingFriday} className="friday-pulse">
            <Brain size={16} className="float-anim" color="#A855F7" />
            <span style={{ animation: 'textFade 3.5s infinite ease-in-out' }}>{fridayText}</span>
          </div>
        </div>

        {/* 📊 Social Proof Stats */}
        <div ref={statsRef} className="stagger-in" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '48px', width: '100%', maxWidth: '720px' }}>
          {[
            { count: counters.solved, suffix: '+', label: 'Problems Solved', icon: <CheckCircle size={20} color="#10b981" />, gradient: 'rgba(16,185,129,0.08)' },
            { count: counters.pass, suffix: '%', label: 'Pass Rate', icon: <TrendingUp size={20} color="#A855F7" />, gradient: 'rgba(168,85,247,0.06)' },
            { count: counters.langs, suffix: '+', label: 'Languages', icon: <Terminal size={20} color="#00E5FF" />, gradient: 'rgba(0,229,255,0.05)' },
            { count: counters.mocks, suffix: '+', label: 'Mock Interviews', icon: <Star size={20} color="#f59e0b" />, gradient: 'rgba(245,158,11,0.06)' },
          ].map((s, i) => (
            <div key={i} className="stat-card hover-glow" style={{ flex: '1 1 150px', background: s.gradient, border: '1px solid rgba(255,255,255,0.06)', borderRadius: '18px', padding: '24px 16px', textAlign: 'center', backdropFilter: 'blur(16px)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>{s.icon}</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.04em', background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.65) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>{s.count.toLocaleString()}{s.suffix}</div>
              <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
            </div>
          ))}
        </div>

      {/* ✨ Interactive Playground Preview */}
      <section style={{ maxWidth: '1100px', margin: '0 auto 100px auto', padding: '0 24px', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', marginBottom: '12px' }}>Experience the <span style={{ background: 'linear-gradient(135deg, #00E5FF, #7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>NexCode Magic</span></h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>Watch how Friday provides real-time ambient feedback as you type your solutions.</p>
        </div>

        <div style={{ background: 'rgba(10, 8, 18, 0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', overflow: 'hidden', display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', height: '480px', boxShadow: '0 40px 100px rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)' }} className="hover-glow main-preview-ui">
          {/* Left: Problem Details */}
          <div style={{ padding: '32px', borderRight: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.01)' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <span style={{ fontSize: '0.65rem', padding: '4px 10px', borderRadius: '6px', background: 'rgba(16,185,129,0.1)', color: '#10b981', fontWeight: 800 }}>MEDIUM</span>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>#45 · Array, Math</span>
             </div>
             <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>Find Median from Stream</h3>
             <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: '24px' }}>
                Design a data structure that supports adding integers from a data stream and finding the median of the current elements.
             </p>
             <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Example Input</p>
                <code style={{ fontSize: '0.8rem', color: '#D8B4FE' }}>add(1), add(2), findMedian() {'->'} 1.5</code>
             </div>
          </div>
          
          {/* Right: Mock Editor */}
          <div style={{ position: 'relative', background: '#050408', padding: '24px' }}>
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                   <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }} />
                   <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }} />
                   <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }} />
                </div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>solution.py</div>
             </div>
             <pre style={{ margin: 0, fontSize: '0.9rem', color: '#B4B4B4', lineHeight: 1.6, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', whiteSpace: 'pre-wrap' }}>
                <code style={{ color: '#fff' }}>{typedCode}</code>
                <span style={{ width: '2px', height: '1.2em', background: '#7C3AED', display: 'inline-block', verticalAlign: 'middle', animation: 'blink 1s infinite', marginLeft: '2px' }} />
             </pre>

             {/* Friday Overlay Tooltip */}
             <div style={{ position: 'absolute', top: '90px', right: '30px', maxWidth: '200px', background: 'rgba(124, 58, 237, 0.1)', border: '1px solid rgba(168, 85, 247, 0.4)', padding: '12px', borderRadius: '12px', backdropFilter: 'blur(10px)', animation: 'float 4s ease-in-out infinite' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                   <Sparkles size={14} color="#D8B4FE" />
                   <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#D8B4FE' }}>FRIDAY</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#fff', lineHeight: 1.4 }}>"Your current sort is <b>O(N log N)</b>. Can you optimize this using Heaps?"</p>
             </div>
          </div>
        </div>
      </section>

      {/* 🏢 Trusted By Bar */}
      <div className="stagger-in" style={{ width: '100%', maxWidth: '800px', margin: '0 auto 64px auto', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center', marginBottom: '18px' }}>
          <div style={{ flex: 1, maxWidth: '120px', height: '1px', background: 'linear-gradient(to right, transparent, rgba(168,85,247,0.2))' }} />
          <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 700, margin: 0 }}>Trusted by engineers at</p>
          <div style={{ flex: 1, maxWidth: '120px', height: '1px', background: 'linear-gradient(to left, transparent, rgba(168,85,247,0.2))' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {['Google', 'Meta', 'Amazon', 'Apple', 'Microsoft', 'Netflix', 'Stripe'].map((co, i) => (
            <React.Fragment key={co}>
              <span className="company-name" style={{ fontSize: '1rem', fontWeight: 800, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.01em', transition: 'color 0.3s, text-shadow 0.3s', padding: '4px 8px' }}>{co}</span>
              {i < 6 && <span style={{ color: 'rgba(168,85,247,0.2)', fontSize: '0.5rem' }}>●</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 🛠️ popular problems grid  */}
      <div style={{ margin: '0 0 24px 0', textAlign: 'center' }} className="stagger-in">
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', marginBottom: '8px' }}>
            Pick a <span style={{ background: 'linear-gradient(135deg, #A855F7, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Challenge</span> to Start
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', margin: 0 }}>Jump straight into curated problems with AI-powered verification.</p>
        </div>

        <div style={styles.problemsGrid} className="problems-grid-scroll">
          {problems && problems.length > 0 ? (
            [
              problems[problemIndex % problems.length],
              problems[(problemIndex + 1) % problems.length],
              problems[(problemIndex + 2) % problems.length]
            ].filter(Boolean).map((p) => (
              <div key={p.id} className="problem-card-enhanced hover-glow" onClick={() => {
                if (!session) {
                  onStart(p.id);
                } else {
                  onStart(p.id);
                }
              }} style={{ flex: '1 1 220px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', padding: '20px', textAlign: 'left', cursor: 'pointer', backdropFilter: 'blur(12px)', boxShadow: '0 4px 24px rgba(0,0,0,0.3)', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', borderLeft: `3px solid ${p.difficulty === 'Easy' ? '#10b981' : p.difficulty === 'Medium' ? '#f59e0b' : '#ef4444'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff', lineHeight: 1.3, flex: 1, marginRight: '8px' }}>{p.title?.replace(/^\d+\.\s*/, '')}</span>
                  <span style={{
                    fontSize: '0.62rem', fontWeight: 800, padding: '3px 10px', borderRadius: '20px', flexShrink: 0,
                    background: p.difficulty === 'Easy' ? 'rgba(16,185,129,0.1)' : p.difficulty === 'Medium' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                    color: p.difficulty === 'Easy' ? '#10b981' : p.difficulty === 'Medium' ? '#f59e0b' : '#ef4444',
                    border: `1px solid ${p.difficulty === 'Easy' ? 'rgba(16,185,129,0.25)' : p.difficulty === 'Medium' ? 'rgba(245,158,11,0.25)' : 'rgba(239,68,68,0.25)'}`
                  }}>{p.difficulty}</span>
                </div>
                <div style={{ display: 'flex', gap: '6px', marginTop: '12px', alignItems: 'center' }}>
                  {p.tags?.slice(0, 2).map((t: string) => (
                    <span key={t} style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.04)', padding: '3px 8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>{t}</span>
                  ))}
                  <ArrowRight size={14} color="rgba(168,85,247,0.4)" style={{ marginLeft: 'auto' }} />
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', width: '100%', gridColumn: '1 / -1' }}>Loading curated problems...</p>
          )}
        </div>
        {/* 📈 Timeline Tracks (How It Works) */}
        <div style={{ margin: '0 0 24px 0', textAlign: 'center' }} className="stagger-in">
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', marginBottom: '8px' }}>
            How It <span style={{ background: 'linear-gradient(135deg, #00E5FF, #A855F7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Works</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', margin: 0 }}>From problem selection to a hiring scorecard — in minutes.</p>
        </div>

        <div className="timeline-track" style={{ display: 'flex', gap: '16px', maxWidth: '1000px', width: '100%', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '60px', position: 'relative' }}>
          <div className="timeline-card hover-lift hover-glow">
            <div className="timeline-dot">1</div>
            <h4>Pick a Problem</h4>
            <p>Choose from our curated library of Array, DP, Trees, and Graph problems tagged by company & difficulty.</p>
          </div>
          <div className="timeline-card hover-lift hover-glow">
            <div className="timeline-dot">2</div>
            <h4>Code in Monaco IDE</h4>
            <p>Write solutions with VS Code-grade syntax highlighting in Python, Java, C++, Go, and more.</p>
          </div>
          <div className="timeline-card hover-lift hover-glow" style={{ borderColor: 'rgba(168,85,247,0.2)' }}>
            <div className="timeline-dot" style={{ background: 'rgba(168,85,247,0.25)', boxShadow: '0 0 16px rgba(168,85,247,0.5)' }}>3</div>
            <h4>🎥 AI Mock Interview</h4>
            <p>Face Alex on a live video call. Speak or type your answers. Get asked follow-up questions live.</p>
          </div>
          <div className="timeline-card hover-lift hover-glow">
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
          <div style={{ background: 'rgba(14,10,24,0.95)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '20px', overflow: 'hidden', position: 'relative', boxShadow: '0 24px 60px rgba(0,0,0,0.5)', isolation: 'isolate' }} className="hover-lift hover-glow">
            <img
              src={`${(import.meta as any).env.BASE_URL}assets/interviewers/avatar.png`}
              alt="Alex — AI Interviewer"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block', minHeight: '400px' }}
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
              onClick={() => { onStart(); }}
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
        <div className="bento-item bento-2x1 hover-lift hover-glow">
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
        <div className="bento-item hover-lift hover-glow">
          <div className="border-beam"></div>
          <div style={styles.iconBox}><Terminal size={20} color="#A855F7" /></div>
          <h3>Friday Assist</h3>
          <p>Get subtle contextual assists like optimal solver maps dynamically framing steps natively.</p>
          <div style={{ marginTop: '12px', padding: '6px 12px', background: 'rgba(168,85,247,0.06)', borderRadius: '8px', fontSize: '0.72rem', border: '1px solid rgba(168,85,247,0.1)', color: '#D8B4FE' }}>
            "Use a Hashmap for O(1) searches!"
          </div>
        </div>

        {/* ✅ Card 3: Small (Testcases) */}
        <div className="bento-item hover-lift hover-glow">
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
        <div className="bento-item bento-2x1 hover-lift hover-glow">
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
        <div className="bento-item hover-lift hover-glow">
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
        <div className="bento-item bento-2x1 hover-lift hover-glow">
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
        <div className="bento-item bento-2x1 hover-lift hover-glow" style={{ background: 'rgba(168,85,247,0.04)', border: '1px solid rgba(168,85,247,0.15)' }}>
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

      {/* ⚖️ Comparison Section */}
      <section className="stagger-in" style={{ maxWidth: '900px', margin: '0 auto 80px auto', padding: '0 24px', position: 'relative', zIndex: 5 }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', marginBottom: '10px' }}>Why <span style={{ background: 'linear-gradient(135deg, #00E5FF, #7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>NexCode AI?</span></h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem', margin: 0 }}>See how we fundamentally change interview preparation.</p>
        </div>
        
        <div style={{ background: 'rgba(14, 10, 24, 0.7)', borderRadius: '24px', position: 'relative', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }} className="hover-glow">
          {/* Subtle glow behind the entire table */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', position: 'relative', zIndex: 1, tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '45%' }} />
              <col style={{ width: '27.5%' }} />
              <col style={{ width: '27.5%' }} />
            </colgroup>
            <thead>
              <tr>
                <th style={{ padding: '24px 28px', textAlign: 'left', color: 'rgba(255,255,255,0.5)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Feature</th>
                <th style={{ 
                  padding: '24px 20px', textAlign: 'center', borderBottom: '1px solid rgba(168,85,247,0.3)', 
                  background: 'linear-gradient(to bottom, rgba(168,85,247,0.02), rgba(168,85,247,0.15))',
                  borderLeft: '1px solid rgba(168,85,247,0.3)', borderRight: '1px solid rgba(168,85,247,0.3)',
                  borderTopLeftRadius: '16px', borderTopRightRadius: '16px'
                }}>
                  <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, #fff, #D8B4FE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 900, letterSpacing: '0.02em', fontSize: '1.05rem', textShadow: '0 0 20px rgba(168,85,247,0.4)' }}>NexCode AI</div>
                </th>
                <th style={{ padding: '24px 20px', textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Others</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Live AI Video Mock Interviews', true, false],
                ['Real-time Complexity & Code Analysis', true, false],
                ['Voice & Speech Recognition', true, false],
                ['Detailed Hiring Scorecard', true, false],
                ['Multi-language Support (Python, Java, etc.)', true, true],
                ['Peer-to-Peer Collaborative Sessions', true, false],
                ['Monaco (VS Code) Editor UI', true, true],
                ['Interactive AI Mentor Assistant', true, false],
              ].map(([feature, us, them], i, arr) => {
                const isLast = i === arr.length - 1;
                return (
                  <tr key={i} style={{ transition: 'background 0.2s', background: 'transparent' }} className="table-row-hover">
                    <td style={{ padding: '18px 28px', color: 'rgba(255,255,255,0.85)', borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.04)', fontWeight: 500 }}>{feature as string}</td>
                    
                    {/* The NexCode highlighted column */}
                    <td style={{ 
                      padding: '18px 20px', textAlign: 'center', 
                      background: 'rgba(168,85,247,0.1)', 
                      borderLeft: '1px solid rgba(168,85,247,0.3)', 
                      borderRight: '1px solid rgba(168,85,247,0.3)',
                      borderBottom: isLast ? '1px solid rgba(168,85,247,0.3)' : '1px solid rgba(168,85,247,0.15)',
                      borderBottomLeftRadius: isLast ? '16px' : '0',
                      borderBottomRightRadius: isLast ? '16px' : '0'
                    }}>
                      {us ? <CheckCircle size={22} color="#10b981" style={{ filter: 'drop-shadow(0 0 8px rgba(16,185,129,0.4))' }} /> : <X size={22} color="rgba(255,255,255,0.2)" />}
                    </td>
                    
                    <td style={{ padding: '18px 20px', textAlign: 'center', borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.04)' }}>
                      {them ? <CheckCircle size={22} color="rgba(255,255,255,0.3)" /> : <X size={22} color="rgba(255,255,255,0.15)" />}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 🌟 Infinite Testimonial Marquee */}
      <section style={{ margin: '80px 0', padding: '0 24px', overflow: 'hidden', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '4px 12px', borderRadius: '99px', marginBottom: '12px' }}>
            <Star size={12} color="#FBBF24" fill="#FBBF24" />
            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Join 50,000+ Developers</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>Wall of Love</h2>
        </div>

        <div className="marquee-container">
          <div className="marquee-track">
            {[...Array(2)].map((_, i) => (
              <React.Fragment key={i}>
                {[
                  { name: "Sarah K.", role: "SDE II @ Microsoft", text: "Friday's feedback on my communication was a game-changer for my actual onsite.", color: "#7C3AED" },
                  { name: "David L.", role: "Senior Engineer @ Google", text: "The most realistic interview simulation I've found. Alex is scary good.", color: "#3B82F6" },
                  { name: "Mona R.", role: "Frontend Dev @ Vercel", text: "I went from panicking during live coding to being completely calm.", color: "#EC4899" },
                  { name: "Kevin T.", role: "SDE @ Amazon", text: "The real-time complexity analysis is something I've never seen before.", color: "#10B981" },
                  { name: "Elena P.", role: "UCLA Student", text: "Helped me land my first internship at a top-tier tech firm. Forever grateful!", color: "#F59E0B" },
                ].map((t, idx) => (
                  <div key={idx} className="testimonial-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `linear-gradient(135deg, ${t.color}, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.8rem', color: '#fff' }}>{t.name[0]}</div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: '0.8rem', color: '#fff' }}>{t.name}</p>
                        <p style={{ margin: 0, fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{t.role}</p>
                      </div>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>"{t.text}"</p>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>



      {/* 🚀 Final CTA Banner */}
      <section className="stagger-in" style={{ maxWidth: '900px', margin: '0 auto 100px auto', padding: '0 24px', position: 'relative', zIndex: 5 }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(219,39,119,0.08))', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '24px', padding: '48px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }} className="hover-glow">
          <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(168,85,247,0.2), transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(219,39,119,0.15), transparent 70%)', borderRadius: '50%' }} />
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', marginBottom: '12px', position: 'relative', zIndex: 1 }}>Ready to Ace Your Next Interview?</h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem', maxWidth: '460px', margin: '0 auto 28px', lineHeight: 1.6, position: 'relative', zIndex: 1 }}>Join thousands of developers who improved their interview performance with NexCode AI.</p>
          <button
            onClick={() => { onStart(); }}
            className="magic-btn"
            style={{ padding: '16px 36px', background: 'linear-gradient(135deg, #7C3AED, #DB2777)', border: 'none', borderRadius: '14px', color: '#fff', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 10px 40px rgba(124,58,237,0.35)', display: 'inline-flex', alignItems: 'center', gap: '10px', position: 'relative', zIndex: 1 }}
          >
            Get Started Free <ArrowRight size={18} />
          </button>
        </div>
      </section>

      <footer style={{ marginTop: 'auto', borderTop: '1px solid rgba(255, 255, 255, 0.04)', padding: '20px', textAlign: 'center', width: '100%', zIndex: 10, background: 'rgba(3, 1, 8, 0.4)', backdropFilter: 'blur(10px)' }}>
        <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', fontWeight: 500 }}>
          © {new Date().getFullYear()} Shivam Singhal | NexCode AI. All rights reserved.
        </span>
      </footer>

      {/* 📡 Live Activity Feed Toast */}
      <div className={`live-feed-toast ${liveActivity.visible ? 'live-feed-visible' : ''}`}>
        <span>{liveActivity.text}</span>
      </div>

      {/* 🤖 Friday AI Companion Bubble */}
      <div className={`friday-companion ${fridayBubble.visible ? 'friday-visible' : ''}`}>
        <div className="friday-bubble">
          {fridayBubble.text}
          <div className="friday-arrow"></div>
        </div>
        <div className="friday-avatar">
          <Sparkles size={20} color="#fff" />
          <div className="friday-pulse"></div>
        </div>
      </div>

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

        /* Particles */
        @keyframes drift {
          0% { transform: translateY(110vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-20vh) rotate(360deg); opacity: 0; }
        }
        .particle {
          position: absolute;
          bottom: -5vh;
          color: rgba(168, 85, 247, 0.5);
          font-size: 1.2rem;
          animation: drift 15s infinite linear;
          text-shadow: 0 0 10px currentColor;
        }

        /* Bento Grid Setup */
        .table-row-hover:hover {
          background: rgba(255,255,255,0.03) !important;
        }

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
          transform: translateY(-8px) scale(1.01);
          box-shadow: 0 15px 40px rgba(168, 85, 247, 0.2);
          border-color: rgba(168, 85, 247, 0.5) !important;
          background: rgba(255,255,255,0.04) !important;
        }

        .hover-glow {
          position: relative;
          overflow: hidden;
        }
        .hover-glow::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(800px circle at var(--mouse-x, -1000px) var(--mouse-y, -1000px), rgba(255, 255, 255, 0.04), transparent 40%);
          z-index: 0;
          pointer-events: none;
          transition: background 0.3s;
        }
        .hover-glow:hover::before {
          background: radial-gradient(800px circle at var(--mouse-x, -1000px) var(--mouse-y, -1000px), rgba(168, 85, 247, 0.15), transparent 40%);
        }
        .hover-glow > * { position: relative; z-index: 1; }

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

        /* Syntax highlighting in code preview */
        pre kw { color: #c792ea; font-weight: 700; }
        pre cm { color: #546e7a; font-style: italic; }
        pre st { color: #c3e88d; }
        pre nm { color: #f78c6c; }

        /* Friday Companion Styling */
        .friday-companion {
          position: fixed;
          bottom: 24px;
          right: 24px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
          z-index: 1000;
          pointer-events: none;
          transition: transform 0.3s ease, opacity 0.3s ease;
          opacity: 0;
          transform: translateY(20px);
        }

        .friday-visible {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }

        .friday-avatar {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #7C3AED, #DB2777);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 32px rgba(124, 58, 237, 0.4);
          position: relative;
          cursor: pointer;
          border: 2px solid rgba(255,255,255,0.2);
        }

        .friday-pulse {
          position: absolute;
          inset: -4px;
          border-radius: 18px;
          border: 2px solid #7C3AED;
          animation: pulse-ring 2s infinite;
        }

        @keyframes pulse-ring {
          0% { transform: scale(0.9); opacity: 1; }
          100% { transform: scale(1.3); opacity: 0; }
        }

        .friday-bubble {
          background: rgba(20, 16, 28, 0.95);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(168, 85, 247, 0.3);
          padding: 14px 18px;
          border-radius: 18px;
          color: #fff;
          font-size: 0.85rem;
          font-weight: 500;
          max-width: 240px;
          line-height: 1.4;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
          position: relative;
          animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .friday-arrow {
          position: absolute;
          bottom: -8px;
          right: 20px;
          width: 16px;
          height: 16px;
          background: rgba(20, 16, 28, 0.95);
          border-right: 1px solid rgba(168, 85, 247, 0.3);
          border-bottom: 1px solid rgba(168, 85, 247, 0.3);
          transform: rotate(45deg);
        }

        @keyframes bounce-in {
          0% { transform: scale(0.85); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        /* Marquee Styling */
        .marquee-container {
          width: 100%;
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          padding: 20px 0;
        }

        .marquee-track {
          display: flex;
          gap: 24px;
          width: max-content;
          animation: marquee-scroll 40s linear infinite;
        }

        .marquee-track:hover {
          animation-play-state: paused;
        }

        .testimonial-card {
          width: 300px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 20px;
          padding: 24px;
          flex-shrink: 0;
          transition: border-color 0.3s, background 0.3s;
        }

        .testimonial-card:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(168,85,247,0.3);
        }

        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .main-preview-ui {
          transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        }
        
        .main-preview-ui:hover {
          transform: translateY(-10px) scale(1.01);
          border-color: rgba(168, 85, 247, 0.3);
        }

        .scroll-reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .scroll-reveal-active {
          opacity: 1;
          transform: translateY(0);
        }

        /* Staggered entrance */
        .stagger-in {
          animation: staggerFadeIn 0.8s ease-out both;
          animation-timeline: view();
          animation-range: entry 5% cover 25%;
        }
        @keyframes staggerFadeIn {
          from { opacity: 0; transform: translateY(32px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Stat card pulse on hover */
        .stat-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .stat-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 36px rgba(168, 85, 247, 0.18);
          border-color: rgba(168, 85, 247, 0.3) !important;
        }

        /* Live dot pulse */
        .live-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #10b981;
          box-shadow: 0 0 8px #10b981;
          animation: livePulse 2s infinite ease-in-out;
        }
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }

        /* Live Feed Toast */
        .live-feed-toast {
          position: fixed;
          bottom: 24px;
          left: 24px;
          background: rgba(14, 10, 24, 0.9);
          border: 1px solid rgba(168, 85, 247, 0.25);
          backdrop-filter: blur(16px);
          padding: 12px 18px;
          border-radius: 12px;
          font-size: 0.78rem;
          color: rgba(255,255,255,0.8);
          font-weight: 600;
          z-index: 50;
          transform: translateY(80px);
          opacity: 0;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
          box-shadow: 0 10px 30px rgba(0,0,0,0.4);
        }
        .live-feed-visible {
          transform: translateY(0);
          opacity: 1;
        }

        /* Company trust bar */
        .company-name {
          cursor: default;
        }
        .company-name:hover {
          color: rgba(255,255,255,0.6) !important;
          text-shadow: 0 0 20px rgba(168, 85, 247, 0.3) !important;
        }

        /* Problem card enhanced */
        .problem-card-enhanced {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease;
        }
        .problem-card-enhanced:hover {
          transform: translateY(-6px) scale(1.01);
          box-shadow: 0 12px 36px rgba(0,0,0,0.4);
          background: rgba(255,255,255,0.04) !important;
          border-color: rgba(168, 85, 247, 0.3) !important;
        }

        /* Comparison table styling */
        table th, table td {
          font-family: 'Outfit', sans-serif;
        }

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
          0%, 100% { filter: hue-rotate(0deg); opacity: 0.7; transform: translateY(2px); }
          50% { filter: hue-rotate(45deg); opacity: 1; transform: translateY(0); }
        }
        @keyframes magicGlowSpin {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .magic-btn {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .magic-btn:hover {
          transform: translateY(-4px) scale(1.02);
        }
        .magic-btn:hover .magic-glow {
          opacity: 1 !important;
          filter: blur(12px) !important;
          animation: magicGlowSpin 3s linear infinite;
          background-size: 200% 200% !important;
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
    padding: '48px 24px 32px 24px', textAlign: 'center', zIndex: 5, animation: 'slideUp 0.8s ease-out'
  },
  badge: {
    background: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.2)',
    color: '#D8B4FE', fontSize: '0.75rem', padding: '4px 12px', borderRadius: '16px',
    display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, marginBottom: '20px'
  },
  title: { fontSize: '3.4rem', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.035em', marginBottom: '18px', maxWidth: '800px' },
  gradientText: {
    background: 'linear-gradient(135deg, #FF007A 0%, #7000FF 50%, #00E5FF 100%)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block', minWidth: '400px'
  },
  subtitle: { fontSize: '1rem', color: 'rgba(255,255,255,0.6)', maxWidth: '520px', lineHeight: 1.65, marginBottom: '28px' },
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
