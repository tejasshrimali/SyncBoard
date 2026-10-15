import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Pin, 
  Heart, 
  Trash2, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  Edit3, 
  Sparkles, 
  Clock, 
  Code2, 
  Globe, 
  FileText, 
  CheckSquare, 
  KeyRound, 
  Quote 
} from 'lucide-react';
import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';
import { sound } from '../services/soundService';

export default function ClipCard({
  clip,
  onCopy,
  onTogglePin,
  onToggleFavorite,
  onDelete,
  onUpdate,
}) {
  const [copied, setCopied] = useState(false);
  const [isMasked, setIsMasked] = useState(clip.category === 'credentials');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(clip.title || '');
  const [editContent, setEditContent] = useState(clip.content || '');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleCopy = () => {
    sound.playCopyChime();
    navigator.clipboard.writeText(clip.content);
    setCopied(true);
    if (onCopy) onCopy(clip);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleSaveEdit = () => {
    sound.playPop();
    onUpdate(clip.id, {
      title: editTitle.trim() || clip.title,
      content: editContent.trim() || clip.content,
      charCount: editContent.length,
      wordCount: editContent.trim().split(/\s+/).filter(Boolean).length,
    });
    setIsEditing(false);
  };

  const formatTimestamp = (ts) => {
    if (!ts) return 'Just now';
    const date = new Date(ts);
    try {
      if (isToday(date)) {
        return `Today at ${format(date, 'h:mm a')}`;
      }
      if (isYesterday(date)) {
        return `Yesterday at ${format(date, 'h:mm a')}`;
      }
      return format(date, 'MMM d, yyyy • h:mm a');
    } catch {
      return formatDistanceToNow(date, { addSuffix: true });
    }
  };

  const getCategoryDetails = (cat) => {
    switch (cat) {
      case 'code':
        return { label: 'Code', icon: <Code2 className="w-3.5 h-3.5" />, badge: 'bg-sky-100 text-sky-800 border-sky-200' };
      case 'links':
        return { label: 'Link', icon: <Globe className="w-3.5 h-3.5" />, badge: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'notes':
        return { label: 'Note', icon: <FileText className="w-3.5 h-3.5" />, badge: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'tasks':
        return { label: 'Task List', icon: <CheckSquare className="w-3.5 h-3.5" />, badge: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'credentials':
        return { label: 'Secret Key', icon: <KeyRound className="w-3.5 h-3.5" />, badge: 'bg-rose-100 text-rose-800 border-rose-200' };
      case 'snippets':
        return { label: 'Quote', icon: <Quote className="w-3.5 h-3.5" />, badge: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
      default:
        return { label: 'Clip', icon: <Sparkles className="w-3.5 h-3.5" />, badge: 'bg-theme-accent-light text-theme-accent border-theme-border' };
    }
  };

  const categoryMeta = getCategoryDetails(clip.category);

  return (
    <div className={`card-interactive group relative flex flex-col justify-between bg-theme-surface rounded-3xl border-2 transition-all p-4 sm:p-5 shadow-card hover:shadow-card-hover ${
      clip.isPinned 
        ? 'border-amber-300 ring-2 ring-amber-100 dark:border-amber-700/60' 
        : 'border-theme-border hover:border-theme-accent/70'
    }`}>
      
      {/* Top Header Row */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          
          {/* Category Badge & Timestamp */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border ${categoryMeta.badge}`}>
              {categoryMeta.icon}
              <span>{categoryMeta.label}</span>
            </span>

            <span className="text-[11px] font-semibold text-theme-muted flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTimestamp(clip.createdAt)}
            </span>
          </div>

          {/* Quick Pin & Favorite Icons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                sound.playPop();
                onTogglePin(clip.id, !clip.isPinned);
              }}
              title={clip.isPinned ? 'Unpin clip' : 'Pin to top'}
              className={`p-1.5 rounded-xl border transition-all active:scale-90 ${
                clip.isPinned 
                  ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-xs' 
                  : 'bg-theme-canvas text-theme-muted border-theme-border/60 hover:text-theme-main hover:bg-theme-accent-light/50'
              }`}
            >
              <Pin className={`w-3.5 h-3.5 ${clip.isPinned ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={() => {
                sound.playPop();
                onToggleFavorite(clip.id, !clip.isFavorite);
              }}
              title={clip.isFavorite ? 'Remove favorite' : 'Add to favorites'}
              className={`p-1.5 rounded-xl border transition-all active:scale-90 ${
                clip.isFavorite 
                  ? 'bg-rose-50 text-rose-500 border-rose-200' 
                  : 'bg-theme-canvas text-theme-muted border-theme-border/60 hover:text-rose-500 hover:bg-rose-50'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${clip.isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

        </div>

        {/* Clip Title (AI Generated or Editable) */}
        {isEditing ? (
          <div className="mb-3 space-y-2">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-theme-canvas border border-theme-accent text-sm font-bold text-theme-main focus:outline-none"
              placeholder="Clip title"
            />
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 rounded-xl bg-theme-canvas border border-theme-accent text-xs font-mono text-theme-main focus:outline-none resize-y"
              placeholder="Clip content"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-2.5 py-1 text-xs font-semibold text-theme-muted hover:text-theme-main"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-3 py-1 rounded-xl bg-theme-accent text-white text-xs font-bold shadow-xs hover:bg-theme-accent-hover"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <h3 className="text-base sm:text-lg font-extrabold text-theme-main mb-2 tracking-tight line-clamp-2 font-['Outfit']">
            {clip.title || 'Untitled Clip'}
          </h3>
        )}

        {/* Content Body Preview */}
        {!isEditing && (
          <div className="relative mb-3">
            {clip.category === 'code' ? (
              <div className="relative p-3 rounded-2xl bg-theme-canvas border border-theme-border font-mono text-xs text-theme-main overflow-x-auto max-h-48 leading-relaxed selection:bg-theme-accent selection:text-white">
                <pre className="whitespace-pre-wrap break-all">{clip.content}</pre>
              </div>
            ) : clip.category === 'links' ? (
              <div className="p-3 rounded-2xl bg-theme-canvas border border-theme-border flex items-center justify-between gap-2 text-xs">
                <span className="font-mono text-theme-accent font-semibold truncate select-all">
                  {clip.content}
                </span>
                <a
                  href={clip.content.startsWith('http') ? clip.content : `https://${clip.content}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 p-1.5 rounded-xl bg-theme-accent-light text-theme-accent hover:bg-theme-accent hover:text-white transition-colors"
                  title="Open link in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ) : clip.category === 'credentials' ? (
              <div className="p-3 rounded-2xl bg-theme-canvas border border-theme-border flex items-center justify-between gap-2 text-xs font-mono">
                <span className="truncate tracking-wider text-theme-main">
                  {isMasked ? '••••••••••••••••••••••••••••••••' : clip.content}
                </span>
                <button
                  onClick={() => setIsMasked(!isMasked)}
                  className="p-1.5 rounded-xl text-theme-muted hover:text-theme-main"
                  title={isMasked ? 'Reveal secret' : 'Hide secret'}
                >
                  {isMasked ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>
            ) : clip.category === 'tasks' ? (
              <div className="p-3 rounded-2xl bg-theme-canvas border border-theme-border text-xs text-theme-main space-y-1.5 max-h-44 overflow-y-auto leading-relaxed">
                {clip.content.split('\n').map((line, idx) => {
                  const isChecked = /^[-*]\s*\[x\]/i.test(line);
                  const isTaskLine = /^[-*]\s*\[[\sx]\]/i.test(line);
                  return (
                    <div key={idx} className="flex items-start gap-2">
                      {isTaskLine ? (
                        <span className={`inline-block w-3.5 h-3.5 mt-0.5 rounded border text-[10px] flex items-center justify-center font-bold ${
                          isChecked ? 'bg-emerald-500 border-emerald-600 text-white' : 'border-theme-border bg-white'
                        }`}>
                          {isChecked ? '✓' : ''}
                        </span>
                      ) : (
                        <span className="text-theme-muted">•</span>
                      )}
                      <span className={isChecked ? 'line-through text-theme-muted' : 'text-theme-main'}>
                        {line.replace(/^[-*]\s*\[[\sx]\]/i, '').replace(/^[-*]\s*/, '')}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-theme-canvas/50 border border-theme-border/60 text-xs sm:text-sm text-theme-main whitespace-pre-wrap break-words max-h-44 overflow-y-auto leading-relaxed">
                {clip.content}
              </div>
            )}
          </div>
        )}

        {/* Tags Row */}
        {clip.tags && clip.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mb-4">
            {clip.tags.slice(0, 4).map((tag, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-theme-canvas text-theme-muted border border-theme-border/70"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

      </div>

      {/* Bottom Action Footer Row */}
      <div className="pt-3 border-t border-theme-border/60 flex items-center justify-between gap-2 mt-auto">
        
        {/* Left: Char & Word count */}
        <span className="text-[11px] font-medium text-theme-muted">
          {clip.charCount || clip.content.length} chars • {clip.wordCount || 1} w
        </span>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1.5">
          
          {/* Edit Button */}
          {!isEditing && (
            <button
              onClick={() => {
                sound.playPop();
                setIsEditing(true);
              }}
              title="Edit title or content"
              className="p-2 rounded-xl text-theme-muted hover:text-theme-main hover:bg-theme-canvas transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Delete Button */}
          {confirmDelete ? (
            <div className="flex items-center gap-1 animate-fadeIn">
              <button
                onClick={() => {
                  sound.playTrash();
                  onDelete(clip.id);
                }}
                className="px-2 py-1 rounded-xl bg-rose-600 text-white text-[11px] font-bold shadow-xs hover:bg-rose-700"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-1.5 py-1 text-[11px] text-theme-muted hover:text-theme-main"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              title="Delete clip"
              className="p-2 rounded-xl text-theme-muted hover:text-rose-500 hover:bg-rose-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Big Juicy Copy Button */}
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-xs ${
              copied
                ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                : 'bg-theme-accent hover:bg-theme-accent-hover text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

        </div>

      </div>

    </div>
  );
}
