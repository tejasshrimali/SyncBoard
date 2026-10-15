import React, { useState } from 'react';
import { 
  Search, 
  Calendar, 
  X, 
  Pin, 
  ArrowUpDown, 
  Clock, 
  Check, 
  Code2, 
  Globe, 
  FileText, 
  CheckSquare, 
  KeyRound, 
  Quote, 
  Sparkles 
} from 'lucide-react';
import { CATEGORIES } from '../services/aiService';
import { TIMELINE_FILTERS } from '../constants/filters';
import { sound } from '../services/soundService';

export default function TimelineFilterBar({
  searchQuery,
  setSearchQuery,
  timelineFilter,
  setTimelineFilter,
  customDateRange,
  setCustomDateRange,
  selectedCategory,
  setSelectedCategory,
  sortOrder,
  setSortOrder,
  pinnedOnly,
  setPinnedOnly,
  filteredClipsCount,
}) {
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [tempFromDate, setTempFromDate] = useState(customDateRange.from || '');
  const [tempToDate, setTempToDate] = useState(customDateRange.to || '');

  const handleTimelineClick = (id) => {
    sound.playPop();
    if (id === 'custom') {
      setShowCustomPicker(true);
    } else {
      setShowCustomPicker(false);
      setTimelineFilter(id);
    }
  };

  const handleApplyCustomDates = () => {
    sound.playPop();
    if (tempFromDate && tempToDate) {
      setCustomDateRange({ from: tempFromDate, to: tempToDate });
      setTimelineFilter('custom');
      setShowCustomPicker(false);
    }
  };

  const handleClearCustom = () => {
    sound.playPop();
    setTempFromDate('');
    setTempToDate('');
    setCustomDateRange({ from: '', to: '' });
    setTimelineFilter('all');
    setShowCustomPicker(false);
  };

  const getCategoryIcon = (id) => {
    switch (id) {
      case 'code': return <Code2 className="w-3.5 h-3.5" />;
      case 'links': return <Globe className="w-3.5 h-3.5" />;
      case 'notes': return <FileText className="w-3.5 h-3.5" />;
      case 'tasks': return <CheckSquare className="w-3.5 h-3.5" />;
      case 'credentials': return <KeyRound className="w-3.5 h-3.5" />;
      case 'snippets': return <Quote className="w-3.5 h-3.5" />;
      default: return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-6 space-y-3">
      
      {/* 1. Main Sharp Search Bar */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-theme-muted group-focus-within:text-theme-accent transition-colors">
          <Search className="w-5 h-5 stroke-[2.2]" />
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search clips by title, content, tags, or links..."
          className="w-full pl-11 pr-12 py-3 rounded-2xl bg-theme-surface border-2 border-theme-border text-theme-main font-semibold text-sm sm:text-base placeholder:text-theme-muted/70 focus:outline-none focus:border-theme-accent focus:ring-4 focus:ring-theme-accent/15 transition-all shadow-sm"
        />

        {searchQuery ? (
          <button
            onClick={() => {
              sound.playPop();
              setSearchQuery('');
            }}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-theme-muted hover:text-theme-main"
          >
            <div className="w-6 h-6 rounded-full bg-theme-canvas flex items-center justify-center hover:bg-theme-accent hover:text-white transition-all">
              <X className="w-3.5 h-3.5" />
            </div>
          </button>
        ) : (
          <div className="hidden sm:flex absolute inset-y-0 right-0 pr-3.5 items-center pointer-events-none">
            <kbd className="px-2 py-0.5 text-[11px] font-bold text-theme-muted bg-theme-canvas rounded-lg border border-theme-border shadow-xs">
              /
            </kbd>
          </div>
        )}
      </div>

      {/* 2. Analytics-Style Timeline Toolbar (Positioned directly below search bar) */}
      <div className="bg-theme-surface rounded-2xl border border-theme-border p-2 sm:p-3 shadow-soft flex flex-wrap items-center justify-between gap-3">
        
        {/* Timeline Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 max-w-full">
          <div className="flex items-center gap-1 text-xs font-bold text-theme-muted mr-1">
            <Clock className="w-3.5 h-3.5 text-theme-accent" />
            <span className="hidden sm:inline">Timeline:</span>
          </div>

          {TIMELINE_FILTERS.map((f) => {
            const isSelected = timelineFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => handleTimelineClick(f.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap active:scale-95 ${
                  isSelected
                    ? 'bg-theme-accent text-white shadow-button'
                    : 'bg-theme-canvas text-theme-muted hover:text-theme-main hover:bg-theme-accent-light/50 border border-theme-border/60'
                }`}
              >
                {f.id === 'custom' && <Calendar className="w-3 h-3" />}
                <span>
                  {f.id === 'custom' && customDateRange.from && customDateRange.to
                    ? `${customDateRange.from.slice(5)} to ${customDateRange.to.slice(5)}`
                    : f.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Secondary controls: Pinned toggle & Sort selector */}
        <div className="flex items-center gap-2 text-xs">
          {/* Pinned filter toggle */}
          <button
            onClick={() => {
              sound.playPop();
              setPinnedOnly(!pinnedOnly);
            }}
            title="Filter pinned clips only"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-bold border transition-all active:scale-95 ${
              pinnedOnly
                ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300'
                : 'bg-theme-canvas text-theme-muted border-theme-border hover:text-theme-main'
            }`}
          >
            <Pin className={`w-3.5 h-3.5 ${pinnedOnly ? 'fill-current' : ''}`} />
            <span className="hidden md:inline">Pinned</span>
          </button>

          {/* Sort order toggle */}
          <button
            onClick={() => {
              sound.playPop();
              setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
            }}
            title="Toggle sort direction"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-bold bg-theme-canvas text-theme-muted border border-theme-border hover:text-theme-main transition-all active:scale-95"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
          </button>
        </div>

      </div>

      {/* 3. Custom Date Range Picker Modal/Popover */}
      {showCustomPicker && (
        <div className="p-4 bg-theme-surface rounded-2xl border-2 border-theme-accent shadow-card animate-fadeIn">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-extrabold text-theme-main flex items-center gap-2">
              <Calendar className="w-4 h-4 text-theme-accent" />
              Pick Custom Timeline Window
            </h4>
            <button
              onClick={() => setShowCustomPicker(false)}
              className="text-theme-muted hover:text-theme-main"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-bold text-theme-muted mb-1">
                From Date:
              </label>
              <input
                type="date"
                value={tempFromDate}
                onChange={(e) => setTempFromDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-theme-canvas border border-theme-border text-theme-main font-semibold text-xs focus:outline-none focus:border-theme-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-theme-muted mb-1">
                To Date:
              </label>
              <input
                type="date"
                value={tempToDate}
                onChange={(e) => setTempToDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-theme-canvas border border-theme-border text-theme-main font-semibold text-xs focus:outline-none focus:border-theme-accent"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-2 border-t border-theme-border/60">
            <button
              onClick={handleClearCustom}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-theme-muted hover:text-rose-500 hover:bg-rose-50 transition-colors"
            >
              Reset to All Time
            </button>

            <button
              onClick={handleApplyCustomDates}
              disabled={!tempFromDate || !tempToDate}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-theme-accent text-white text-xs font-bold shadow-button hover:bg-theme-accent-hover transition-all disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" /> Apply Timeline
            </button>
          </div>
        </div>
      )}

      {/* 4. Category Filter Chips Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 max-w-full text-xs scrollbar-none pr-3">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                sound.playPop();
                setSelectedCategory(cat.id);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap active:scale-95 ${
                isSelected
                  ? 'bg-theme-main text-white shadow-sm'
                  : 'bg-theme-surface text-theme-muted hover:text-theme-main border border-theme-border/70 hover:border-theme-accent/50'
              }`}
            >
              {getCategoryIcon(cat.id)}
              <span>{cat.label}</span>
            </button>
          );
        })}

        {/* Counter Pill */}
        <span className="ml-auto text-xs font-bold text-theme-muted whitespace-nowrap pl-2">
          {filteredClipsCount} {filteredClipsCount === 1 ? 'clip' : 'clips'}
        </span>
      </div>

    </div>
  );
}
