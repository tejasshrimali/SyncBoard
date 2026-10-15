import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  AlertCircle,
  LogIn,
  UserPlus
} from 'lucide-react';
import { 
  loginWithEmail, 
  registerWithEmail, 
  loginWithGoogle 
} from '../services/firebase';
import { sound } from '../services/soundService';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    sound.playPop();

    try {
      if (isRegister) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
      sound.playCopyChime();
      if (onLoginSuccess) onLoginSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setLoading(true);
    sound.playPop();

    try {
      await loginWithGoogle();
      sound.playCopyChime();
      if (onLoginSuccess) onLoginSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Google Sign-in failed. Please ensure Google Auth is enabled.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm bg-theme-surface rounded-3xl border-2 border-theme-border shadow-card p-6 overflow-hidden">
        
        {/* Header with Close */}
        <div className="flex items-center justify-between pb-3 border-b border-theme-border/60">
          <div>
            <h3 className="text-lg font-extrabold text-theme-main font-['Outfit']">
              {isRegister ? 'Create Account' : 'Welcome to SyncBoard'}
            </h3>
            <p className="text-xs text-theme-muted font-medium">
              Permanent cross-device clipboard sync
            </p>
          </div>

          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="w-8 h-8 rounded-xl bg-theme-canvas flex items-center justify-center text-theme-muted hover:text-theme-main transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Auth Mode Toggle Switch */}
        <div className="flex items-center gap-1 my-4 p-1 rounded-2xl bg-theme-canvas border border-theme-border text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              sound.playPop();
              setIsRegister(false);
              setError('');
            }}
            className={`flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              !isRegister ? 'bg-theme-surface text-theme-main shadow-xs' : 'text-theme-muted hover:text-theme-main'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          
          <button
            type="button"
            onClick={() => {
              sound.playPop();
              setIsRegister(true);
              setError('');
            }}
            className={`flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              isRegister ? 'bg-theme-surface text-theme-main shadow-xs' : 'text-theme-muted hover:text-theme-main'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register</span>
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
            <div className="break-words">{error}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleEmailAuth} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-theme-muted mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-theme-muted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-theme-canvas border border-theme-border text-theme-main text-xs font-semibold focus:outline-none focus:border-theme-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-theme-muted mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-theme-muted" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-theme-canvas border border-theme-border text-theme-main text-xs font-semibold focus:outline-none focus:border-theme-accent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-button transition-all active:scale-98 disabled:opacity-50"
          >
            {loading ? 'Please wait...' : (isRegister ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-theme-border"></div></div>
          <span className="relative px-3 bg-theme-surface text-[11px] font-bold text-theme-muted uppercase tracking-wider">or</span>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-theme-canvas hover:bg-theme-accent-light/50 border border-theme-border text-theme-main text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-98"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.04h3.88c2.27-2.09 3.66-5.17 3.66-9.14z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.04c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.13C3.26 21.36 7.33 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.28c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28V6.59H1.24C.45 8.16 0 9.97 0 12s.45 3.84 1.24 5.41l4.04-3.13z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.59l4.04 3.13c.95-2.83 3.6-4.97 6.72-4.97z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

      </div>
    </div>
  );
}
