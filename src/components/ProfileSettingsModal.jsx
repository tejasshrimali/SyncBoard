import React from 'react';
import { 
  X, 
  Check, 
  Palette, 
  Volume2, 
  VolumeX, 
  LogOut, 
  Cloud, 
  ShieldCheck, 
  Smartphone 
} from 'lucide-react';
import { THEMES } from '../constants/themes';
import { MatchaIcon, SakuraIcon, LavenderIcon } from './ThemeIcons';
import UserAvatar from './UserAvatar';
import { sound } from '../services/soundService';

export default function ProfileSettingsModal({
  isOpen,
  onClose,
  user,
  currentTheme,
  setTheme,
  soundEnabled,
  setSoundEnabled,
  onOpenAuth,
  onLogout,
  installPrompt,
  onInstallApp,
}) {
  if (!isOpen) return null;

  const handleThemeSelect = (themeId) => {
    sound.playPop();
    setTheme(themeId);
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.toggle(next);
    if (next) sound.playPop();
  };

  const renderThemeIcon = (type, isActive) => {
    switch (type) {
      case 'matcha':
        return <MatchaIcon className="w-5 h-5" active={isActive} />;
      case 'sakura':
        return <SakuraIcon className="w-5 h-5" active={isActive} />;
      case 'lavender':
        return <LavenderIcon className="w-5 h-5" active={isActive} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/45 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-theme-surface rounded-t-3xl sm:rounded-3xl border-2 border-theme-border shadow-card p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header with Title and Close Button */}
        <div className="flex items-center justify-between pb-3 border-b border-theme-border/60">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-theme-muted uppercase tracking-wider mb-0.5">
              <span>Profile</span>
              <span>&gt;</span>
              <span>Settings</span>
              <span>&gt;</span>
              <span className="text-theme-accent">Themes</span>
            </div>
            <h3 className="text-lg font-extrabold text-theme-main font-['Outfit']">
              Settings & Themes
            </h3>
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

        {/* User Profile Card */}
        <div className="my-4 p-3.5 rounded-2xl bg-theme-canvas border border-theme-border/70 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <UserAvatar user={user} size="w-10 h-10" textSize="text-sm" />
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-theme-main truncate">
                {user ? (user.displayName || user.email?.split('@')[0]) : 'Guest User'}
              </h4>
              <p className="text-xs text-theme-muted truncate">
                {user ? user.email : 'Local offline mode'}
              </p>
            </div>
          </div>

          <div className="flex-shrink-0">
            {user ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200">
                <Cloud className="w-3 h-3" /> Synced
              </span>
            ) : (
              <button
                onClick={() => {
                  sound.playPop();
                  onClose();
                  onOpenAuth();
                }}
                className="px-3 py-1 rounded-xl bg-theme-accent text-white text-xs font-bold hover:bg-theme-accent-hover transition-colors shadow-xs"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* SECTION: THEMES (Profile > Settings > Themes) */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2.5">
            <Palette className="w-4 h-4 text-theme-accent" />
            <h4 className="text-xs font-extrabold text-theme-main uppercase tracking-wider">
              Theme & Appearance
            </h4>
          </div>

          <div className="space-y-2">
            {THEMES.map((theme) => {
              const isSelected = currentTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => handleThemeSelect(theme.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border-2 transition-all active:scale-98 text-left ${
                    isSelected
                      ? 'border-theme-accent bg-theme-accent-light/40 shadow-xs ring-2 ring-theme-accent/20'
                      : 'border-theme-border bg-theme-canvas/50 hover:bg-theme-canvas hover:border-theme-accent/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Hand-crafted Theme SVG Icon */}
                    <div 
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                        isSelected 
                          ? 'bg-theme-accent text-white shadow-xs' 
                          : 'bg-theme-surface border border-theme-border text-theme-main'
                      }`}
                    >
                      {renderThemeIcon(theme.type, isSelected)}
                    </div>

                    <div>
                      <div className="text-xs sm:text-sm font-extrabold text-theme-main flex items-center gap-2">
                        <span>{theme.name}</span>
                        {/* Mini Color Swatch dot */}
                        <span 
                          className="w-2.5 h-2.5 rounded-full inline-block border border-white shadow-xs" 
                          style={{ backgroundColor: theme.preview }}
                        />
                      </div>
                      <p className="text-[11px] text-theme-muted font-medium">
                        {theme.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex-shrink-0 pl-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${
                      isSelected 
                        ? 'border-theme-accent bg-theme-accent text-white' 
                        : 'border-theme-border bg-theme-surface'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION: PREFERENCES (Sound & PWA) */}
        <div className="mb-5 space-y-2">
          <h4 className="text-xs font-extrabold text-theme-main uppercase tracking-wider mb-2 flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-theme-accent" />
            Preferences
          </h4>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-theme-canvas border border-theme-border/70">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-theme-surface border border-theme-border flex items-center justify-center text-theme-muted">
                {soundEnabled ? <Volume2 className="w-4 h-4 text-theme-accent" /> : <VolumeX className="w-4 h-4" />}
              </div>
              <div>
                <div className="text-xs font-bold text-theme-main">Juicy Sound Effects</div>
                <div className="text-[11px] text-theme-muted">Chimes and pops on copy/paste</div>
              </div>
            </div>

            <button
              onClick={toggleSound}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                soundEnabled ? 'bg-theme-accent justify-end' : 'bg-gray-300 dark:bg-gray-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-xs transform transition-transform" />
            </button>
          </div>

          {/* PWA Install */}
          {installPrompt && (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-theme-main">Install App (PWA)</div>
                  <div className="text-[11px] text-theme-muted">Add to Home Screen</div>
                </div>
              </div>

              <button
                onClick={() => {
                  onInstallApp();
                  onClose();
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
              >
                Install
              </button>
            </div>
          )}
        </div>

        {/* Footer / Account Sign Out */}
        {user && (
          <div className="pt-3 border-t border-theme-border/60 flex items-center justify-between">
            <span className="text-[11px] text-theme-muted font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Secure Firebase Auth
            </span>

            <button
              onClick={() => {
                sound.playPop();
                onLogout();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
