import React from 'react';
import { Clipboard, FilterX, Plus } from 'lucide-react';
import { sound } from '../services/soundService';

export default function EmptyState({ 
  hasFilters, 
  onResetFilters, 
  onTriggerPaste 
}) {
  return (
    <div className="max-w-md mx-auto my-12 p-8 text-center rounded-3xl bg-theme-surface border-2 border-dashed border-theme-border animate-fadeIn">
      <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-theme-accent-light text-theme-accent flex items-center justify-center shadow-xs">
        {hasFilters ? (
          <FilterX className="w-8 h-8" />
        ) : (
          <Clipboard className="w-8 h-8 stroke-[2]" />
        )}
      </div>

      <h3 className="text-base sm:text-lg font-extrabold text-theme-main font-['Outfit'] mb-1">
        {hasFilters ? 'No matching clips found' : 'Your SyncBoard is ready'}
      </h3>

      <p className="text-xs text-theme-muted font-medium mb-6 leading-relaxed">
        {hasFilters
          ? 'No clipboard items match your current timeline or search query. Try clearing filters or expanding your date window.'
          : 'Copy any code, link, credentials, or note on this device and paste it above to automatically categorize and sync it across all your devices.'}
      </p>

      <div className="flex items-center justify-center gap-3">
        {hasFilters ? (
          <button
            onClick={() => {
              sound.playPop();
              onResetFilters();
            }}
            className="px-4 py-2 rounded-xl bg-theme-canvas border border-theme-border text-theme-main text-xs font-bold hover:bg-theme-accent-light/50 transition-all active:scale-95"
          >
            Clear Active Filters
          </button>
        ) : (
          <button
            onClick={() => {
              sound.playPop();
              if (onTriggerPaste) onTriggerPaste();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-button transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Paste First Clip</span>
          </button>
        )}
      </div>
    </div>
  );
}
