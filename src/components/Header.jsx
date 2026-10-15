import React from 'react';
import { 
  ClipboardCheck, 
  Volume2, 
  VolumeX, 
  Download, 
  LogIn, 
  Settings
} from 'lucide-react';
import { THEMES } from '../constants/themes';
import { MatchaIcon, SakuraIcon, LavenderIcon } from './ThemeIcons';
import UserAvatar from './UserAvatar';
import { sound } from '../services/soundService';

export default function Header({
  currentTheme,
  setTheme,
  soundEnabled,
  setSoundEnabled,
  user,
  onOpenAuth,
  onOpenProfileSettings,
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

  const renderDesktopThemeIcon = (type, isActive) => {
    switch (type) {
      case 'matcha':
        return <MatchaIcon className="w-4 h-4" active={isActive} />;
      case 'sakura':
        return <SakuraIcon className="w-4 h-4" active={isActive} />;
      case 'lavender':
        return <LavenderIcon className="w-4 h-4" active={isActive} />;
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-theme-canvas/90 border-b border-theme-border transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="relative group cursor-pointer flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-theme-accent text-white shadow-soft transition-transform duration-300 group-hover:scale-105 flex-shrink-0">
            <ClipboardCheck className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 sm:h-4 sm:w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 bg-emerald-500 border-2 border-white"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight text-theme-main font-['Outfit']">
                Sync<span className="text-theme-accent">Board</span>
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-theme-accent-light text-theme-accent border border-theme-border">
                PWA
              </span>
            </div>
            <p className="hidden md:block text-xs font-medium text-theme-muted">
              Persistent cross-device clipboard sync
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* DESKTOP ONLY: 3 Curated Pastel Themes Switcher with SVG Icons (Hidden on Mobile) */}
          <div className="hidden md:flex items-center p-1 rounded-2xl bg-theme-surface border border-theme-border shadow-sm">
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
                  {renderDesktopThemeIcon(t.type, isActive)}
                  <span>{t.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Sound Toggle (Desktop & Tablet) */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Mute sound effects' : 'Enable cute sound effects'}
            className="hidden sm:flex w-9 h-9 sm:w-10 sm:h-10 rounded-2xl items-center justify-center bg-theme-surface border border-theme-border text-theme-muted hover:text-theme-main hover:border-theme-accent transition-all duration-200 active:scale-95"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-theme-accent" /> : <VolumeX className="w-4 h-4 text-theme-muted" />}
          </button>

          {/* PWA Install Button (If supported/available) */}
          {installPrompt && (
            <button
              onClick={onInstallApp}
              title="Install SyncBoard PWA on Android or Desktop"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-sm transition-all duration-200 active:scale-95 animate-pulse"
            >
              <Download className="w-4 h-4" />
              <span>Install App</span>
            </button>
          )}

          {/* User Profile & Mobile Settings Button (Profile > Settings > Themes) */}
          <button
            onClick={onOpenProfileSettings}
            title="Profile & Theme Settings"
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-theme-surface border border-theme-border hover:border-theme-accent transition-all active:scale-95 shadow-xs"
          >
            <UserAvatar user={user} size="w-7 h-7 sm:w-8 sm:h-8" textSize="text-xs" />
            
            {/* Desktop label */}
            <div className="hidden lg:block text-left pr-1">
              <div className="text-xs font-bold text-theme-main truncate max-w-[100px]">
                {user ? (user.displayName || user.email?.split('@')[0]) : 'Settings'}
              </div>
              <div className="text-[10px] text-theme-muted font-semibold">
                Themes & App
              </div>
            </div>

            {/* Mobile / Settings icon indicator */}
            <Settings className="w-4 h-4 text-theme-muted md:hidden" />
          </button>

          {/* Direct Sign-In button if guest */}
          {!user && (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 rounded-2xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs sm:text-sm font-bold shadow-soft transition-all duration-200 active:scale-95"
            >
              <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Sign In</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
