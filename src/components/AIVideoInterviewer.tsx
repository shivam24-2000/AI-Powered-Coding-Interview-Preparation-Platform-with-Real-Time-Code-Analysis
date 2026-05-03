import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Mic, MicOff, Video as VideoIcon, VideoOff,
  Shield, Activity, Send, ChevronDown, ChevronUp, X
} from 'lucide-react';
import type { ChatMessage, InterviewPhase } from '../types';

interface AIVideoInterviewerProps {
  messages: ChatMessage[];
  phase: InterviewPhase;
  isInterviewMode: boolean;
  isChatTyping?: boolean;
  onEndInterview: () => void;
  onSendMessage: (text: string) => void;
}

// Minimal SpeechRecognition type shim for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const AIVideoInterviewer: React.FC<AIVideoInterviewerProps> = ({
  messages,
  phase,
  isInterviewMode,
  isChatTyping = false,
  onEndInterview,
  onSendMessage,
}) => {
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const lastSpokenMessageId = useRef<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);       // AI speaking
  const [isListening, setIsListening] = useState(false);     // User mic active
  const [transcript, setTranscript] = useState('');          // Live partial transcript
  const [textInput, setTextInput] = useState('');
  const [showTranscript, setShowTranscript] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isHidden, setIsHidden] = useState(false);           // panel hidden but interview active

  // ─── Camera stream ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isInterviewMode || !isVideoOn) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      if (userVideoRef.current) userVideoRef.current.srcObject = null;
      return;
    }
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(stream => {
        streamRef.current = stream;
        if (userVideoRef.current) userVideoRef.current.srcObject = stream;
      })
      .catch(err => console.warn('Camera access denied:', err));

    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, [isInterviewMode, isVideoOn]);

  // ─── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      recognitionRef.current?.stop();
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  // ─── Scroll transcript to bottom ──────────────────────────────────────────
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isChatTyping]);

  // ─── Voice Synthesis (AI speaking) ────────────────────────────────────────
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (!lastMsg || lastMsg.role !== 'assistant' || lastMsg.id === lastSpokenMessageId.current) return;
    lastSpokenMessageId.current = lastMsg.id;

    // Clean markdown, strip list markers, and hard-cap at 280 chars so the AI
    // never reads a full problem description or a long wall of text aloud.
    let text = lastMsg.content
      .replace(/```[\s\S]*?```/g, 'I can see your code on screen.')
      .replace(/^\s*[-*•]\s+/gm, '')   // strip bullet list starters
      .replace(/[*_#`~]/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();

    // Only speak the first sentence-ish — keep it brief for a video call feel
    const firstBreak = text.search(/[.!?]\s/);
    if (firstBreak > 60 && firstBreak < 280) {
      text = text.slice(0, firstBreak + 1);
    } else if (text.length > 280) {
      text = text.slice(0, 280).replace(/\s\S+$/, '') + '…';
    }

    const trySpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v =>
        (v.name.includes('Samantha') || v.name.includes('Google US English') || v.name.includes('Karen')) && v.lang.startsWith('en')
      ) || voices.find(v => v.lang.startsWith('en'));

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice || null;
      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    };

    // Voices may not yet be loaded
    if (window.speechSynthesis.getVoices().length > 0) {
      trySpeak();
    } else {
      window.speechSynthesis.onvoiceschanged = trySpeak;
    }
  }, [messages]);

  // ─── Speech Recognition (user speaking) ───────────────────────────────────
  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (e: any) => {
      let interim = '';
      let final = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      setTranscript(interim);
      if (final.trim()) {
        setTextInput(prev => (prev ? prev + ' ' : '') + final.trim());
        setTranscript('');
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
    setTranscript('');
  }, []);

  // Stop everything, then hand off to parent for scorecard generation
  const handleEndInterview = useCallback(() => {
    window.speechSynthesis.cancel();   // kill any in-flight TTS immediately
    recognitionRef.current?.stop();    // stop mic recognition
    streamRef.current?.getTracks().forEach(t => t.stop()); // release camera
    setIsListening(false);
    setIsSpeaking(false);
    setTranscript('');
    onEndInterview();
  }, [onEndInterview]);

  const toggleMic = () => {
    if (isListening) {
      stopListening();
      setIsMicOn(false);
    } else {
      setIsMicOn(true);
      startListening();
    }
  };

  const handleSend = () => {
    const msg = (textInput + ' ' + transcript).trim();
    if (!msg) return;
    setTextInput('');
    setTranscript('');
    stopListening();
    onSendMessage(msg);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isInterviewMode) return null;

  const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant');

  // When hidden, show a small pill so user can reopen
  if (isHidden) {
    return (
      <button
        onClick={() => setIsHidden(false)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 1500,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px',
          background: 'var(--bg-panel-solid)',
          border: '1px solid var(--border-color)',
          borderRadius: '99px',
          color: 'var(--accent-primary)',
          cursor: 'pointer',
          fontSize: '0.78rem',
          fontWeight: 700,
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
          animation: 'slideUp 0.3s ease',
        }}
      >
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#A855F7', boxShadow: '0 0 8px #A855F7' }} />
        Interview in Progress
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: isMinimized ? '260px' : '360px',
        zIndex: 1500,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        animation: 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        transition: 'width 0.3s ease',
      }}
    >
      {/* Close (hide) button — top-right corner of the whole panel */}
      <button
        onClick={() => setIsHidden(true)}
        title="Hide panel (interview stays active)"
        style={{
          position: 'absolute',
          top: '-10px',
          right: '-10px',
          zIndex: 10,
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: 'var(--bg-panel-solid)',
          border: '1px solid var(--border-color)',
          color: 'rgba(255,255,255,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(60,40,90,0.95)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.background = 'rgba(30,20,50,0.95)'; }}
      >
        <X size={13} />
      </button>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        @keyframes soundWave {
          0%, 100% { height: 4px;  opacity: 0.4; }
          50%       { height: 16px; opacity: 1;   }
        }
        @keyframes spin360 {
          to { transform: rotate(360deg); }
        }
        @keyframes typingDot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40%            { transform: scale(1);   opacity: 1;   }
        }
        @keyframes micPulse {
          0%   { box-shadow: 0 0 0 0   rgba(239,68,68,0.6); }
          70%  { box-shadow: 0 0 0 12px rgba(239,68,68,0);   }
          100% { box-shadow: 0 0 0 0   rgba(239,68,68,0);    }
        }
        @keyframes aiAvatarBreath {
          0%,100% { transform: scale(1);    }
          50%     { transform: scale(1.015); }
        }
        @keyframes aiAvatarSpeak {
          0%,100% { filter: brightness(1) saturate(1);   }
          50%     { filter: brightness(1.08) saturate(1.2); }
        }
        .vid-ctrl-btn {
          width: 38px; height: 38px; border-radius: 12px;
          border: 1px solid var(--border-color);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s;
          color: var(--text-primary);
        }
        .vid-ctrl-btn:hover { transform: scale(1.1); filter: brightness(1.2); }
        .vid-send-btn {
          width: 38px; height: 38px; border-radius: 12px;
          background: linear-gradient(135deg, #7c3aed, #3b82f6);
          border: none; display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s; color: #fff;
          flex-shrink: 0;
        }
        .vid-send-btn:hover { transform: scale(1.08); filter: brightness(1.15); }
        .vid-send-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
        .vid-input {
          flex: 1; background: var(--bg-panel-light);
          border: 1px solid var(--border-color);
          border-radius: 10px; padding: 10px 14px; color: var(--text-primary);
          font-size: 0.82rem; outline: none; resize: none;
          font-family: inherit; line-height: 1.4;
          transition: border-color 0.2s;
        }
        .vid-input:focus { border-color: var(--accent-primary); }
        .vid-input::placeholder { color: var(--text-muted); opacity: 0.5; }
        .msg-bubble-ai {
          background: var(--bg-panel-light);
          border: 1px solid var(--border-color);
          border-radius: 14px 14px 14px 4px;
          padding: 10px 13px; font-size: 0.78rem;
          line-height: 1.5; color: var(--text-primary); max-width: 90%;
          align-self: flex-start;
        }
        .msg-bubble-user {
          background: var(--bg-panel-light);
          border: 1px solid var(--border-color);
          border-radius: 14px 14px 4px 14px;
          padding: 10px 13px; font-size: 0.78rem;
          line-height: 1.5; color: var(--text-primary); max-width: 90%;
          align-self: flex-end;
          opacity: 0.9;
        }
        .typing-indicator {
          display: flex; gap: 4px; align-items: center; padding: 2px 0;
        }
        .typing-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: rgba(168,85,247,0.7);
          animation: typingDot 1.2s infinite ease-in-out;
        }
      `}</style>

      {/* ── TOP: Avatar card ── */}
      <div style={{
        background: 'var(--bg-panel-solid)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${isSpeaking ? 'var(--accent-primary)' : 'var(--border-color)'}`,
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: isSpeaking
          ? '0 24px 60px rgba(0,0,0,0.2), 0 0 40px rgba(168,85,247,0.1)'
          : '0 24px 60px rgba(0,0,0,0.2)',
        position: 'relative',
        transition: 'border-color 0.4s, box-shadow 0.4s',
      }}>

        {/* Avatar */}
        <div style={{ position: 'relative', height: isMinimized ? '100px' : '230px', overflow: 'hidden', transition: 'height 0.3s ease' }}>
          <img
            src={`${import.meta.env.BASE_URL}assets/interviewers/avatar.png`}
            alt="AI Interviewer"
            style={{
              width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top',
              animation: isSpeaking
                ? 'aiAvatarSpeak 1.2s infinite ease-in-out'
                : 'aiAvatarBreath 4s infinite ease-in-out',
              transition: 'filter 0.3s',
            }}
          />
          {/* Gradient overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 50%, rgba(10,6,20,0.95) 100%)' }} />

          {/* LIVE badge */}
          <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)', padding: '3px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', animation: 'micPulse 1.5s infinite' }} />
            <span style={{ fontSize: '0.58rem', color: '#10b981', fontWeight: 800, letterSpacing: '0.06em' }}>LIVE</span>
          </div>

          {/* Sound bars */}
          <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', alignItems: 'center', gap: '3px', background: 'var(--bg-panel-solid)', opacity: 0.9, padding: '5px 10px', borderRadius: '99px', backdropFilter: 'blur(6px)', border: '1px solid var(--border-color)' }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{
                width: '3px',
                borderRadius: '2px',
                background: isSpeaking ? 'var(--accent-primary)' : 'rgba(255,255,255,0.25)',
                animation: isSpeaking ? `soundWave 0.9s ${i * 0.12}s infinite ease-in-out` : 'none',
                height: isSpeaking ? '10px' : '4px',
                transition: 'height 0.2s, background 0.3s',
              }} />
            ))}
            <span style={{ fontSize: '0.6rem', color: 'var(--text-primary)', fontWeight: 700, marginLeft: '5px', letterSpacing: '0.05em' }}>
              {isSpeaking ? 'SPEAKING' : 'LISTENING'}
            </span>
          </div>

          {/* Minimize toggle */}
          <button onClick={() => setIsMinimized(p => !p)} style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'var(--bg-panel-solid)', opacity: 0.7, border: 'none', color: 'var(--text-muted)', cursor: 'pointer', borderRadius: '6px', padding: '4px', display: 'flex' }}>
            {isMinimized ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>

        {!isMinimized && (
          <>
            {/* Subtitle / last message */}
            <div style={{ padding: '12px 14px 8px', minHeight: '52px' }}>
              {isChatTyping ? (
                <div className="typing-indicator">
                  {[0, 0.2, 0.4].map((d, i) => (
                    <div key={i} className="typing-dot" style={{ animationDelay: `${d}s` }} />
                  ))}
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '6px' }}>Thinking...</span>
                </div>
              ) : lastAssistantMsg ? (
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-primary)', opacity: 0.8, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {lastAssistantMsg.content.replace(/```[\s\S]*?```/g, '[code]').replace(/[*_#`]/g, '')}
                </p>
              ) : null}
            </div>

            {/* User PIP */}
            <div style={{ position: 'absolute', bottom: '70px', right: '10px', width: '80px', height: '104px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', background: 'var(--bg-panel-solid)', boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
              {isVideoOn
                ? <video ref={userVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><VideoOff size={20} color="var(--text-muted)" /></div>
              }
              <div style={{ position: 'absolute', bottom: '4px', left: '4px', background: 'var(--bg-panel-solid)', opacity: 0.8, borderRadius: '4px', padding: '1px 4px', fontSize: '0.55rem', color: 'var(--text-primary)', fontWeight: 700 }}>YOU</div>
            </div>

            {/* Controls row */}
            <div style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-panel-light)' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="vid-ctrl-btn" style={{ background: isMicOn ? 'var(--bg-panel-light)' : 'rgba(239,68,68,0.1)', animation: isListening ? 'micPulse 1s infinite' : 'none' }} onClick={toggleMic} title={isMicOn ? 'Mute' : 'Unmute'}>
                  {isMicOn ? <Mic size={16} /> : <MicOff size={16} color="#ef4444" />}
                </button>
                <button className="vid-ctrl-btn" style={{ background: isVideoOn ? 'var(--bg-panel-light)' : 'rgba(239,68,68,0.1)' }} onClick={() => setIsVideoOn(p => !p)} title={isVideoOn ? 'Stop Video' : 'Start Video'}>
                  {isVideoOn ? <VideoIcon size={16} /> : <VideoOff size={16} color="#ef4444" />}
                </button>
                <button className="vid-ctrl-btn" onClick={() => setShowTranscript(p => !p)} style={{ background: showTranscript ? 'rgba(168,85,247,0.1)' : 'var(--bg-panel-light)' }} title="Toggle transcript">
                  <Activity size={16} color={showTranscript ? 'var(--accent-primary)' : undefined} />
                </button>
              </div>

              <button onClick={handleEndInterview} style={{ padding: '8px 16px', borderRadius: '10px', background: 'rgba(239,68,68,0.85)', border: 'none', color: '#fff', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,1)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.85)')}
              >
                <X size={13} /> End Interview
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── TRANSCRIPT PANEL ── */}
      {showTranscript && !isMinimized && (
        <div style={{
          background: 'var(--bg-panel-solid)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${isListening ? '#ef4444' : 'var(--border-color)'}`,
          borderRadius: '18px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
          transition: 'border-color 0.3s',
        }}>

          {/* ── STICKY AI PROMPT CARD (always visible) ── */}
          {lastAssistantMsg && (
            <div style={{
              padding: '12px 14px',
              background: 'var(--bg-panel-light)',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start',
            }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--border-color)' }}>
                <img src={`${import.meta.env.BASE_URL}assets/interviewers/avatar.png`} alt="AI" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: '0 0 3px 0', fontSize: '0.6rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Interviewer asks</p>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-primary)', opacity: 0.9, lineHeight: 1.5, wordBreak: 'break-word' }}>
                  {lastAssistantMsg.content.replace(/```[\s\S]*?```/g, '[code]').replace(/[*_#`]/g, '').slice(0, 200)}
                  {lastAssistantMsg.content.length > 200 ? '…' : ''}
                </p>
              </div>
            </div>
          )}

          {/* Header */}
          <div style={{ padding: '8px 14px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={12} color="var(--accent-primary)" />
            <span style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', flex: 1 }}>Conversation · {phase} phase</span>
            {isChatTyping && <span style={{ fontSize: '0.62rem', color: 'var(--accent-primary)', fontWeight: 700, animation: 'typingDot 1s infinite' }}>AI thinking…</span>}
          </div>

          {/* Message feed */}
          <div style={{ padding: '10px 12px', maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {messages.length === 0 && (
              <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', margin: '12px 0' }}>Interview starting…</p>
            )}
            {messages.map(msg => (
              <div key={msg.id} className={msg.role === 'assistant' ? 'msg-bubble-ai' : 'msg-bubble-user'}>
                {msg.content.replace(/```[\s\S]*?```/g, '[code block]').replace(/[*_#`]/g, '').slice(0, 220)}{msg.content.length > 220 ? '…' : ''}
              </div>
            ))}
            {isChatTyping && (
              <div className="msg-bubble-ai">
                <div className="typing-indicator">
                  {[0, 0.2, 0.4].map((d, i) => <div key={i} className="typing-dot" style={{ animationDelay: `${d}s` }} />)}
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* ── LIVE SPEECH CAPTION ── shown above the input when speaking */}
          {isListening && (
            <div style={{
              margin: '0 12px',
              padding: '10px 13px',
              background: 'rgba(239,68,68,0.05)',
              border: '1px dashed rgba(239,68,68,0.3)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              animation: 'micPulse 1.5s infinite',
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', flexShrink: 0, marginTop: '4px', boxShadow: '0 0 6px #ef4444' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: '0 0 2px 0', fontSize: '0.6rem', fontWeight: 800, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.06em' }}>You are speaking…</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: transcript ? 'var(--text-primary)' : 'var(--text-muted)', fontStyle: transcript ? 'normal' : 'italic', lineHeight: 1.4 }}>
                  {transcript || 'Listening for speech…'}
                </p>
              </div>
            </div>
          )}

          {/* Input row */}
          <div style={{ padding: '10px 12px', marginTop: '6px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
            <textarea
              className="vid-input"
              rows={2}
              placeholder="Type your response here, or use the mic…"
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <button
                className="vid-ctrl-btn"
                style={{
                  background: isListening ? 'rgba(239,68,68,0.1)' : 'var(--bg-panel-light)',
                  border: isListening ? '1px solid #ef4444' : '1px solid var(--border-color)',
                  animation: isListening ? 'micPulse 1s infinite' : 'none',
                }}
                onClick={isListening ? stopListening : startListening}
                title={isListening ? 'Stop — confirm speech' : 'Speak your answer'}
              >
                {isListening ? <MicOff size={15} color="#fca5a5" /> : <Mic size={15} />}
              </button>
              <button
                className="vid-send-btn"
                onClick={handleSend}
                disabled={!(textInput.trim() || transcript.trim()) || isChatTyping}
                title="Send response"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
