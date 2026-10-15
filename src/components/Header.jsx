import React from 'react';
import { 
  ClipboardCheck, 
  Volume2, 
  VolumeX, 
  Download, 
  LogIn, 
  LogOut, 
  Cloud
} from 'lucide-react';
import { THEMES } from '../constants/themes';
import { sound } from '../services/soundService';

export default function Header({
  currentTheme,
  setTheme,
  soundEnabled,
  setSoundEnabled,
  user,
  onOpenAuth,
  onLogout,
  installPrompt,
  onInstallApp,
}) {
  const handleThemeChange = (themeId) => {
    sound.playPop();
    setTheme(themeId);
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.toggle(next);
    if (next) sound.playPop();
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-theme-canvas/90 border-b border-theme-border transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-theme-accent text-white shadow-soft transition-transform duration-300 group-hover:scale-105">
            <ClipboardCheck className="w-6 h-6 stroke-[2.5]" />
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-theme-main font-['Outfit']">
                Sync<span className="text-theme-accent">Board</span>
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-theme-accent-light text-theme-accent border border-theme-border">
                PWA
              </span>
            </div>
            <p className="hidden sm:block text-xs font-medium text-theme-muted">
              Persistent cross-device clipboard sync
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* 3 Curated Pastel Themes Switcher */}
          <div className="flex items-center p-1 rounded-2xl bg-theme-surface border border-theme-border shadow-sm">
            {THEMES.map((t) => {
              const isActive = currentTheme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleThemeChange(t.id)}
                  title={`${t.name} Theme`}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'bg-theme-accent text-white shadow-sm scale-100' 
                      : 'text-theme-muted hover:text-theme-main hover:bg-theme-accent-light/50'
                  }`}
                >
                  <span className="text-sm">{t.icon}</span>
                  <span className="hidden md:inline">{t.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Mute sound effects' : 'Enable cute sound effects'}
            className="w-10 h-10 rounded-2xl flex items-center justify-center bg-theme-surface border border-theme-border text-theme-muted hover:text-theme-main hover:border-theme-accent transition-all duration-200 active:scale-95"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-theme-accent" /> : <VolumeX className="w-4 h-4 text-theme-muted" />}
          </button>

          {/* PWA Install Button (If supported/available) */}
          {installPrompt && (
            <button
              onClick={onInstallApp}
              title="Install SyncBoard PWA on Android or Desktop"
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-sm transition-all duration-200 active:scale-95 animate-pulse"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Install App</span>
            </button>
          )}

          {/* User Auth Profile / Login */}
          {user ? (
            <div className="flex items-center gap-2 pl-1">
              <div 
                title={`Logged in as ${user.email || 'User'} (Synced to Firestore)`}
                className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-theme-surface border border-theme-border"
              >
                <div className="w-6 h-6 rounded-full bg-theme-accent text-white flex items-center justify-center text-xs font-bold">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="User" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    (user.email ? user.email[0].toUpperCase() : 'U')
                  )}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-bold text-theme-main truncate max-w-[120px]">
                    {user.displayName || user.email?.split('@')[0]}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                    <Cloud className="w-3 h-3" /> Cloud Synced
                  </div>
                </div>
              </div>

              <button
                onClick={onLogout}
                title="Log Out"
                className="w-10 h-10 rounded-2xl flex items-center justify-center bg-theme-surface border border-theme-border text-rose-500 hover:bg-rose-50 hover:border-rose-200 transition-all duration-200 active:scale-95"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs sm:text-sm font-bold shadow-soft transition-all duration-200 active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
