import React, { useState, useEffect } from 'react';
import { Terminal, Brain, Zap, Shield } from 'lucide-react';
import { PROBLEMS } from '../problems';

interface LandingPageProps {
  onStart: (problemId?: string) => void;
}



export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [textIndex, setTextIndex] = useState(0);
  const words = ["Coding Interviews", "Data Structures", "System Thinking", "Logic Challenges"];
  
  const [typedCode, setTypedCode] = useState("");
  const fullCode = `def two_sum(nums, target):
    # Jarvis: "Consider how to check previous items in O(1)!"
    # Your optimal code here...
    
    pass`;

  const [jarvisText, setJarvisText] = useState("Scanning prompt...");
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
      setJarvisText(answers[listIndex % answers.length]);
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
      </div>

      {/* 🧭 Navbar */}
      <header style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div className="glass-panel" style={{ padding: '0', borderRadius: '10px', overflow: 'hidden', width: '36px', height: '36px', border: '1px solid rgba(255,255,255,0.15)' }}>
            <img src={`${(import.meta as any).env.BASE_URL}logo.png`} alt="NexCode AI Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <span className="text-gradient" style={{ fontSize: '1.4rem', fontWeight: 700 }}>NexCode AI</span>
        </div>

      </header>

      {/* 🚀 Hero Section */}
      <main style={styles.hero}>
        <div style={styles.badge} className="float-anim">
          <Zap size={14} color="#D8B4FE" /> Instant AI Code Analysis & Diagnostics
        </div>
        
        <h1 style={styles.title}>
          Ace Your Technical <br />
          <span style={styles.gradientText} className="text-change-anim">{words[textIndex]}</span>
        </h1>
        
        <p style={styles.subtitle}>
          Master algorithms with real-time AI assistance, optimal complexity trace streaming, and structured simulation diagnostic environments instantly setup.
        </p>

        <div style={styles.ctaWrapper}>
          <button style={styles.ctaButton} onClick={() => onStart()} className="pulse-btn">
            <span>Start Solving Problems</span>
            <div style={styles.ctaGlow}></div>
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
          <div style={styles.floatingJarvis} className="jarvis-pulse">
            <Brain size={16} className="float-anim" color="#A855F7" />
            <span style={{ animation: 'textFade 3.5s infinite ease-in-out' }}>{jarvisText}</span>
          </div>
        </div>

        {/* 🛠️ popular problems grid  */}
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Pick a Challenge to Start</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Jump straight into high-tier problems with dynamic verification assists.</p>
        </div>

        <div style={styles.problemsGrid} className="problems-grid-scroll">
          {PROBLEMS.slice(0, 3).map((p) => (
            <div key={p.id} style={styles.problemCard} className="hover-lift" onClick={() => onStart(p.id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{p.title.replace(/^\d+\.\s*/, '')}</span>
                <span style={{
                  fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px', borderRadius: '12px',
                  background: p.difficulty === 'Easy' ? 'rgba(16,185,129,0.08)' : p.difficulty === 'Medium' ? 'rgba(245,158,11,0.08)' : 'rgba(239,68,68,0.08)',
                  color: p.difficulty === 'Easy' ? '#10b981' : p.difficulty === 'Medium' ? '#f59e0b' : '#ef4444',
                  border: `1px solid ${p.difficulty === 'Easy' ? 'rgba(16,185,129,0.2)' : 'rgba(239, 158, 11, 0.2)'}`
                }}>{p.difficulty}</span>
              </div>
              <div style={{ display: 'flex', gap: '4px', marginTop: '10px' }}>
                {p.tags.slice(0, 2).map(t => (
                  <span key={t} style={{ fontSize: '0.65rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)', padding: '2px 6px', borderRadius: '4px' }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* 📈 Timeline Tracks (How It Works) */}
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>How It Works</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Ace your technical interview diagnostic loops in 4 simple moves.</p>
        </div>

        <div className="timeline-track" style={{ display: 'flex', gap: '16px', maxWidth: '900px', width: '100%', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '60px', position: 'relative' }}>
          <div className="timeline-card hover-lift">
            <div className="timeline-dot">1</div>
            <h4>Pick a Problem</h4>
            <p>Browse curated Array, String, and Dynamic Programming interview questions from top-tier pools.</p>
          </div>
          <div className="timeline-card hover-lift">
            <div className="timeline-dot">2</div>
            <h4>Write Your Code</h4>
            <p>Write solutions in our Monaco IDE dashboard. Select from JS, Python, or Java setups instantly.</p>
          </div>
          <div className="timeline-card hover-lift">
            <div className="timeline-dot">3</div>
            <h4>Summon Jarvis</h4>
            <p>Unblock bottlenecks using real-time prompt analysis suggesting optimal space/time setups.</p>
          </div>
          <div className="timeline-card hover-lift">
            <div className="timeline-dot">4</div>
            <h4>Verify & Submit</h4>
            <p>Execute and verify answer outputs against test configurations fully automated layout setups.</p>
          </div>
        </div>
      </main>

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

        {/* 💬 Card 2: Small (Jarvis Chat) */}
        <div className="bento-item hover-lift" style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="border-beam"></div>
          <div style={styles.iconBox}><Terminal size={20} color="#A855F7" /></div>
          <h3>Jarvis Assist</h3>
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
      </section>

      <footer style={{ marginTop: 'auto', borderTop: '1px solid rgba(255, 255, 255, 0.04)', padding: '20px', textAlign: 'center', width: '100%', zIndex: 10, background: 'rgba(3, 1, 8, 0.4)', backdropFilter: 'blur(10px)' }}>
        <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', fontWeight: 500 }}>
          © {new Date().getFullYear()} NexCode AI. All rights reserved.
        </span>
      </footer>

      {/* 🎨 Embed scoped styles to run keyframes */}
      <style>{`
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
        .jarvis-pulse { animation: pulseGlow 4s infinite ease-in-out; }
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
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 32px',
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
  floatingJarvis: {
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
  iconBox: { background: 'rgba(168, 85, 247, 0.1)', padding: '10px', borderRadius: '10px', color: '#A855F7', marginBottom: '12px' }
};
