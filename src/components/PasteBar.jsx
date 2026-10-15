import React, { useState, useRef } from 'react';
import { 
  Clipboard, 
  Sparkles, 
  Loader2 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../services/soundService';
import { analyzeClip, CATEGORIES } from '../services/aiService';

export default function PasteBar({ onAddClip }) {
  const [content, setContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('auto');
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef(null);

  // Trigger celebratory confetti burst on successful add
  const triggerConfetti = () => {
    confetti({
      particleCount: 38,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#456d5e', '#cf627d', '#6c66cc', '#52b788', '#ffd166']
    });
  };

  const handleProcessAndSave = async (textToProcess) => {
    const raw = (textToProcess || content).trim();
    if (!raw) return;

    sound.playPop();
    setIsProcessing(true);

    try {
      // Run AI categorization and title generation
      const analysis = await analyzeClip(raw);

      const finalCategory = selectedCategory !== 'auto' 
        ? selectedCategory 
        : analysis.category;

      const clipPayload = {
        content: raw,
        title: analysis.title,
        category: finalCategory,
        contentType: analysis.contentType,
        tags: analysis.tags || [],
        isPinned: false,
        isFavorite: false,
      };

      await onAddClip(clipPayload);

      sound.playCopyChime();
      triggerConfetti();

      setContent('');
      setIsExpanded(false);
      setSelectedCategory('auto');
    } catch (err) {
      console.error('Failed to add clip:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // One-click clipboard paste via browser Clipboard API
  const handleNativePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          setContent(text);
          setIsExpanded(true);
          handleProcessAndSave(text);
          return;
        }
      }
    } catch {
      // Fallback: prompt user or focus textarea
    }
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    // Cmd+Enter or Ctrl+Enter saves immediately
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleProcessAndSave();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-4">
      <div className={`relative bg-theme-surface rounded-3xl border-2 border-theme-border shadow-soft transition-all duration-300 ${
        isExpanded ? 'p-5 ring-2 ring-theme-accent/20 border-theme-accent' : 'p-2 sm:p-2.5'
      }`}>

        {/* Top / Single Line Input */}
        <div className="flex items-center gap-2">
          
          {/* Quick Paste Button with Clipboard Icon */}
          <button
            type="button"
            onClick={handleNativePaste}
            title="Read directly from device clipboard"
            className="flex-shrink-0 flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-theme-accent-light text-theme-accent hover:bg-theme-accent hover:text-white transition-all duration-200 active:scale-95 font-bold text-xs sm:text-sm border border-theme-border shadow-sm group"
          >
            <Clipboard className="w-4 h-4 transition-transform group-hover:rotate-12" />
            <span className="hidden sm:inline">Paste from Device</span>
          </button>

          {/* Text input / preview area */}
          <div className="flex-1 min-w-0">
            {isExpanded ? (
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Paste any snippet, URL, credentials, terminal command, or note here... (Ctrl+Enter to save)"
                rows={4}
                className="w-full bg-transparent border-0 text-theme-main text-sm sm:text-base font-medium placeholder:text-theme-muted/70 focus:outline-none focus:ring-0 resize-y"
                autoFocus
              />
            ) : (
              <input
                ref={textareaRef}
                type="text"
                value={content}
                onFocus={() => setIsExpanded(true)}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste a clip or type here... (AI titles & categorizes automatically)"
                className="w-full bg-transparent border-0 text-theme-main text-sm sm:text-base font-medium placeholder:text-theme-muted/70 focus:outline-none focus:ring-0 px-2"
              />
            )}
          </div>

          {/* Action / Submit Button */}
          {content.trim() && (
            <button
              onClick={() => handleProcessAndSave()}
              disabled={isProcessing}
              className="flex-shrink-0 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-theme-accent hover:bg-theme-accent-hover text-white font-bold text-xs sm:text-sm shadow-button transition-all duration-200 active:scale-95 disabled:opacity-60"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">AI Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Sync Clip</span>
                </>
              )}
            </button>
          )}

        </div>

        {/* Expanded Drawer Options */}
        {isExpanded && (
          <div className="mt-4 pt-3 border-t border-theme-border/60 flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
            
            {/* Category selection */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full text-xs">
              <span className="text-theme-muted font-bold mr-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-theme-accent" /> Category:
              </span>

              <button
                type="button"
                onClick={() => setSelectedCategory('auto')}
                className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
                  selectedCategory === 'auto'
                    ? 'bg-theme-accent text-white shadow-xs'
                    : 'bg-theme-accent-light/50 text-theme-muted hover:text-theme-main'
                }`}
              >
                Auto (AI)
              </button>

              {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-theme-accent text-white shadow-xs'
                      : 'bg-theme-accent-light/50 text-theme-muted hover:text-theme-main'
                  }`}
                >
                  {cat.label.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Character info & Close button */}
            <div className="flex items-center gap-3 text-xs text-theme-muted">
              <span>{content.length} chars</span>
              <button
                type="button"
                onClick={() => {
                  setIsExpanded(false);
                  if (!content.trim()) setContent('');
                }}
                className="text-xs font-semibold hover:text-theme-main transition-colors"
              >
                Collapse
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
