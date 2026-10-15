import React, { useState, useEffect, useMemo } from 'react';
import { 
  subDays, 
  startOfDay, 
  endOfDay, 
  parseISO 
} from 'date-fns';
import Header from './components/Header';
import PasteBar from './components/PasteBar';
import TimelineFilterBar from './components/TimelineFilterBar';
import ClipCard from './components/ClipCard';
import EmptyState from './components/EmptyState';
import AuthModal from './components/AuthModal';
import ProfileSettingsModal from './components/ProfileSettingsModal';
import InstallPrompt from './components/InstallPrompt';
import LoadingScreen from './components/LoadingScreen';
import { subscribeToAuth, logoutUser } from './services/firebase';
import { 
  subscribeClips, 
  addClip, 
  updateClip, 
  deleteClip 
} from './services/clipStorage';
import { sound } from './services/soundService';

export default function App() {
  // 1. Theme State (Matcha Milk, Sakura Petal, Lavender Cloud)
  const [theme, setTheme] = useState(() => {
    return (typeof window !== 'undefined' && window.localStorage.getItem('syncboard_theme')) || 'matcha';
  });

  // 2. Sound Effects State
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return (typeof window !== 'undefined' && window.localStorage.getItem('syncboard_sound') !== 'false');
  });

  // 3. User & Auth State
  const [user, setUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileSettingsOpen, setProfileSettingsOpen] = useState(false);

  // 4. Clips Data
  const [clips, setClips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [referenceTime, setReferenceTime] = useState(() => Date.now());

  // 5. Timeline & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [timelineFilter, setTimelineFilter] = useState('all'); // 'all' | 'today' | 'yesterday' | '7days' | '30days' | 'custom'
  const [customDateRange, setCustomDateRange] = useState({ from: '', to: '' });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' | 'asc'
  const [pinnedOnly, setPinnedOnly] = useState(false);

  // 6. PWA Install Prompt State
  const [installPromptEvent, setInstallPromptEvent] = useState(null);

  // Sync Theme to HTML data-theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('syncboard_theme', theme);
  }, [theme]);

  // Sync Sound Preference
  useEffect(() => {
    window.localStorage.setItem('syncboard_sound', soundEnabled ? 'true' : 'false');
    sound.toggle(soundEnabled);
  }, [soundEnabled]);

  // PWA Install Event Listener
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPromptEvent(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // Subscribe to Firebase Auth
  useEffect(() => {
    const unsubscribeAuth = subscribeToAuth((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribeAuth();
  }, []);

  // Subscribe to Clips (realtime Firestore when user is logged in, else local)
  useEffect(() => {
    const unsubscribeClips = subscribeClips(user, (data) => {
      setClips(data || []);
      setIsLoading(false);
      setReferenceTime(Date.now());
    });

    return () => {
      if (typeof unsubscribeClips === 'function') {
        unsubscribeClips();
      }
    };
  }, [user]);

  // Keyboard Shortcuts: '/' focuses search, 'Escape' clears
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search clips"]');
        searchInput?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // CRUD Handlers
  const handleAddClip = async (clipData) => {
    return await addClip(user, clipData);
  };

  const handleUpdateClip = async (clipId, updates) => {
    return await updateClip(user, clipId, updates);
  };

  const handleDeleteClip = async (clipId) => {
    return await deleteClip(user, clipId);
  };

  const handleTogglePin = async (clipId, isPinned) => {
    return await updateClip(user, clipId, { isPinned });
  };

  const handleToggleFavorite = async (clipId, isFavorite) => {
    return await updateClip(user, clipId, { isFavorite });
  };

  const handleLogout = async () => {
    sound.playPop();
    await logoutUser();
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setTimelineFilter('all');
    setCustomDateRange({ from: '', to: '' });
    setSelectedCategory('all');
    setPinnedOnly(false);
  };

  // Filter & Sort Engine
  const filteredClips = useMemo(() => {
    const todayStart = startOfDay(referenceTime).getTime();
    const yesterdayStart = startOfDay(subDays(referenceTime, 1)).getTime();
    const yesterdayEnd = endOfDay(subDays(referenceTime, 1)).getTime();
    const sevenDaysAgo = startOfDay(subDays(referenceTime, 7)).getTime();
    const thirtyDaysAgo = startOfDay(subDays(referenceTime, 30)).getTime();

    let customStart = null;
    let customEnd = null;
    if (customDateRange.from && customDateRange.to) {
      try {
        customStart = startOfDay(parseISO(customDateRange.from)).getTime();
        customEnd = endOfDay(parseISO(customDateRange.to)).getTime();
      } catch {
        // Ignore date parsing failure
      }
    }

    return clips.filter((clip) => {
      // 1. Timeline Date Filter (Analytics-style)
      if (timelineFilter === 'today') {
        if (clip.createdAt < todayStart) return false;
      } else if (timelineFilter === 'yesterday') {
        if (clip.createdAt < yesterdayStart || clip.createdAt > yesterdayEnd) return false;
      } else if (timelineFilter === '7days') {
        if (clip.createdAt < sevenDaysAgo) return false;
      } else if (timelineFilter === '30days') {
        if (clip.createdAt < thirtyDaysAgo) return false;
      } else if (timelineFilter === 'custom') {
        if (customStart !== null && customEnd !== null) {
          if (clip.createdAt < customStart || clip.createdAt > customEnd) return false;
        }
      }

      // 2. Category Filter
      if (selectedCategory !== 'all' && clip.category !== selectedCategory) {
        return false;
      }

      // 3. Pinned Only Filter
      if (pinnedOnly && !clip.isPinned) {
        return false;
      }

      // 4. Search Query Filter (Title, Content, Tags)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = clip.title?.toLowerCase().includes(q);
        const matchesContent = clip.content?.toLowerCase().includes(q);
        const matchesCategory = clip.category?.toLowerCase().includes(q);
        const matchesTags = clip.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesContent && !matchesCategory && !matchesTags) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // Pinned items always float to the top
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1;
      }

      // Sort by date order
      if (sortOrder === 'asc') {
        return a.createdAt - b.createdAt;
      }
      return b.createdAt - a.createdAt;
    });
  }, [clips, timelineFilter, customDateRange, selectedCategory, pinnedOnly, searchQuery, sortOrder, referenceTime]);

  const hasActiveFilters = searchQuery.trim() !== '' ||
    timelineFilter !== 'all' ||
    selectedCategory !== 'all' ||
    pinnedOnly;

  return (
    <div className="min-h-screen flex flex-col bg-theme-canvas text-theme-main transition-colors duration-200">
      
      {/* 1. Header */}
      <Header
        currentTheme={theme}
        setTheme={setTheme}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenProfileSettings={() => setProfileSettingsOpen(true)}
        installPrompt={installPromptEvent}
        onInstallApp={() => {
          if (installPromptEvent) {
            installPromptEvent.prompt();
            setInstallPromptEvent(null);
          }
        }}
      />

      {/* 2. Optional PWA Android / Desktop Install Banner */}
      <InstallPrompt
        promptEvent={installPromptEvent}
        onDismiss={() => setInstallPromptEvent(null)}
      />

      {/* 3. Main Content Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-4 flex flex-col">
        
        {/* Quick Paste & AI Titling Input Bar */}
        <PasteBar onAddClip={handleAddClip} />

        {/* Analytics Timeline & Search Bar */}
        <TimelineFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          timelineFilter={timelineFilter}
          setTimelineFilter={setTimelineFilter}
          customDateRange={customDateRange}
          setCustomDateRange={setCustomDateRange}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          pinnedOnly={pinnedOnly}
          setPinnedOnly={setPinnedOnly}
          filteredClipsCount={filteredClips.length}
        />

        {/* 4. Clips Grid / Loading / Empty States */}
        {isLoading ? (
          <LoadingScreen message="Loading your synchronized clips..." />
        ) : filteredClips.length === 0 ? (
          <EmptyState
            hasFilters={hasActiveFilters}
            onResetFilters={resetAllFilters}
            onTriggerPaste={() => {
              const input = document.querySelector('input[placeholder*="Paste a clip"]');
              input?.focus();
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 pb-16">
            {filteredClips.map((clip) => (
              <ClipCard
                key={clip.id}
                clip={clip}
                referenceTime={referenceTime}
                onTogglePin={handleTogglePin}
                onToggleFavorite={handleToggleFavorite}
                onDelete={handleDeleteClip}
                onUpdate={handleUpdateClip}
              />
            ))}
          </div>
        )}

      </main>

      {/* 5. Footer */}
      <footer className="py-6 border-t border-theme-border/60 text-center text-xs text-theme-muted">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-semibold">
            SyncBoard • Permanent cross-device persistent clipboard
          </p>
          <div className="flex items-center gap-3 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {user ? 'Firestore Live Sync' : 'Local Storage Mode'}
            </span>
            <span>•</span>
            <button
              onClick={() => setProfileSettingsOpen(true)}
              className="hover:text-theme-main transition-colors underline font-semibold"
            >
              Themes & Preferences
            </button>
          </div>
        </div>
      </footer>

      {/* 6. Auth Modal (Sign In / Register) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={() => {
          // Clips will auto-sync via onAuthStateChanged
        }}
      />

      {/* 7. Profile & Settings Modal (Profile > Settings > Themes for Mobile & Desktop) */}
      <ProfileSettingsModal
        isOpen={profileSettingsOpen}
        onClose={() => setProfileSettingsOpen(false)}
        user={user}
        currentTheme={theme}
        setTheme={setTheme}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        installPrompt={installPromptEvent}
        onInstallApp={() => {
          if (installPromptEvent) {
            installPromptEvent.prompt();
            setInstallPromptEvent(null);
          }
        }}
      />

    </div>
  );
}
