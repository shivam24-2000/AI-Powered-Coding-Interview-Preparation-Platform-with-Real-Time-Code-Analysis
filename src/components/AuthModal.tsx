import React, { useState } from 'react';
import { supabase } from '../supabase';
import { X, Lock, Mail, Loader, Github, Chrome } from 'lucide-react';

interface AuthModalProps {
  type: 'login' | 'signup';
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ type: initialType, onClose }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>(initialType);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert("Check your email for confirmation link!");
        onClose();
      } else if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onClose();
      } else if (mode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/`,
        });
        if (error) throw error;
        alert("Password reset link sent to your email!");
        setMode('login');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setError('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Social login failed');
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(3, 1, 8, 0.75)',
      backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 100, animation: 'fadeIn 0.2s ease-out'
    }} onClick={onClose}>
      <div style={{
        width: '100%', maxWidth: '380px', background: 'rgba(20, 16, 28, 0.95)',
        border: '1px solid rgba(168, 85, 247, 0.15)', borderRadius: '16px',
        padding: '28px', position: 'relative', boxShadow: '0 20px 50px rgba(124, 58, 237, 0.15)'
      }} onClick={e => e.stopPropagation()}>
        
        <button style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }} onClick={onClose}>
          <X size={18} />
        </button>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '8px', textAlign: 'center' }}>
          {mode === 'signup' ? 'Create Account' : mode === 'login' ? 'Welcome Back' : 'Reset Password'}
        </h2>
        <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginBottom: '24px', textAlign: 'center' }}>
          {mode === 'signup' ? 'Start your AI technical prep journey' : mode === 'login' ? 'Login to resume your analysis sessions' : 'Enter your email to receive a reset link'}
        </p>

        {error && (
          <div style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', color: '#ef4444', fontSize: '0.75rem', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', marginBottom: '4px', display: 'block' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
              <input 
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '10px 12px 10px 36px', color: '#fff', fontSize: '0.85rem' }} 
              />
            </div>
          </div>

          {mode !== 'reset' && (
            <div>
              <label style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', marginBottom: '4px', display: 'block' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                <input 
                  type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '10px 12px 10px 36px', color: '#fff', fontSize: '0.85rem' }} 
                />
              </div>
              {mode === 'login' && (
                <button 
                  type="button" 
                  onClick={() => setMode('reset')}
                  style={{ background: 'transparent', border: 'none', color: '#D8B4FE', fontSize: '0.7rem', padding: '4px 0', cursor: 'pointer', float: 'right' }}
                >
                  Forgot Password?
                </button>
              )}
            </div>
          )}

          <button 
            type="submit" disabled={loading}
            style={{ marginTop: '10px', background: 'linear-gradient(135deg, #7C3AED, #DB2777)', border: 'none', color: '#fff', padding: '11px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(124, 58, 237, 0.25)' }}
          >
            {loading ? <Loader size={16} className="rotate" /> : mode === 'signup' ? 'Create Account' : mode === 'login' ? 'Login' : 'Send Reset Link'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', gap: '10px' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }}></div>
          <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }}></div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => handleSocialLogin('google')} style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', color: '#fff', fontSize: '0.8rem' }}>
            <Chrome size={16} /> Google
          </button>
          <button onClick={() => handleSocialLogin('github')} style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', color: '#fff', fontSize: '0.8rem' }}>
            <Github size={16} /> Github
          </button>
        </div>
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
            {mode === 'signup' ? 'Already have an account?' : mode === 'login' ? "Don't have an account?" : "Remembered your password?"}{' '}
            <button 
              onClick={() => {
                if (mode === 'reset') setMode('login');
                else setMode(mode === 'signup' ? 'login' : 'signup');
                setError('');
              }}
              style={{ background: 'transparent', border: 'none', color: '#D8B4FE', fontWeight: 600, cursor: 'pointer', padding: 0 }}
            >
              {mode === 'signup' ? 'Log in' : mode === 'login' ? 'Sign up' : 'Back to Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
