import React from 'react';
import { Smartphone, Download, X } from 'lucide-react';
import { sound } from '../services/soundService';

export default function InstallPrompt({ promptEvent, onDismiss }) {
  if (!promptEvent) return null;

  const handleInstall = async () => {
    sound.playPop();
    promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    if (outcome === 'accepted') {
      sound.playCopyChime();
    }
    onDismiss();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 mb-4">
      <div className="flex items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-theme-accent-light to-theme-surface border-2 border-emerald-500/30 shadow-card animate-fadeIn">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-extrabold text-theme-main flex items-center gap-1.5">
              Install SyncBoard
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                Android & Desktop
              </span>
            </h4>
            <p className="text-[11px] sm:text-xs text-theme-muted font-medium">
              Enjoy offline access, instant paste, and fullscreen clipboard superpowers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleInstall}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Install Now</span>
          </button>

          <button
            onClick={() => {
              sound.playPop();
              onDismiss();
            }}
            className="p-1.5 rounded-xl text-theme-muted hover:text-theme-main transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
