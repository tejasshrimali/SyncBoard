import React from 'react';
import { ClipboardCheck, Sparkles } from 'lucide-react';

export default function LoadingScreen({ message = "Synchronizing your board..." }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 animate-fadeIn">
      {/* Cute bouncy badge */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-3xl bg-theme-accent text-white flex items-center justify-center shadow-soft animate-bounce">
          <ClipboardCheck className="w-10 h-10 stroke-[2.5]" />
        </div>
        
        {/* Pulsing glow rings */}
        <div className="absolute -inset-3 rounded-3xl bg-theme-accent/20 animate-ping -z-10" />
        
        {/* Floating sparkle icons */}
        <Sparkles className="w-5 h-5 text-amber-400 absolute -top-2 -right-2 animate-spin" style={{ animationDuration: '4s' }} />
      </div>

      <h3 className="text-lg font-extrabold text-theme-main tracking-tight font-['Outfit'] mb-1">
        SyncBoard
      </h3>
      <p className="text-xs font-semibold text-theme-muted tracking-wide animate-pulse">
        {message}
      </p>

      {/* Skeleton cards preview to look super polished */}
      <div className="w-full max-w-md mt-8 space-y-3 opacity-60">
        <div className="h-16 rounded-2xl bg-theme-surface border border-theme-border animate-pulse" />
        <div className="h-16 rounded-2xl bg-theme-surface border border-theme-border animate-pulse delay-100" />
      </div>
    </div>
  );
}
