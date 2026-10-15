import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

const DEMO_CLIPS_KEY = 'syncboard_demo_clips_v1';

// Initial colorful sample clips for instant out-of-the-box delight
const INITIAL_DEMO_CLIPS = [
  {
    id: 'demo-1',
    title: 'Command: React Vite PWA Scaffold',
    content: 'npm create vite@latest syncboard -- --template react\ncd syncboard\nnpm install vite-plugin-pwa lucide-react framer-motion',
    category: 'code',
    contentType: 'code',
    tags: ['npm', 'terminal', 'vite'],
    isPinned: true,
    isFavorite: true,
    charCount: 122,
    wordCount: 16,
    createdAt: Date.now() - 1000 * 60 * 15, // 15 mins ago
    updatedAt: Date.now() - 1000 * 60 * 15,
  },
  {
    id: 'demo-2',
    title: 'Link: Tailwind CSS Documentation',
    content: 'https://tailwindcss.com/docs/customizing-colors#using-css-variables',
    category: 'links',
    contentType: 'url',
    tags: ['tailwindcss.com', 'bookmark', 'css'],
    isPinned: false,
    isFavorite: true,
    charCount: 65,
    wordCount: 1,
    createdAt: Date.now() - 1000 * 60 * 60 * 3, // 3 hours ago
    updatedAt: Date.now() - 1000 * 60 * 60 * 3,
  },
  {
    id: 'demo-3',
    title: 'Quote: Simplicity in Design',
    content: '“Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away.” — Antoine de Saint-Exupéry',
    category: 'snippets',
    contentType: 'text',
    tags: ['quote', 'inspiration'],
    isPinned: false,
    isFavorite: false,
    charCount: 139,
    wordCount: 22,
    createdAt: Date.now() - 1000 * 60 * 60 * 26, // yesterday
    updatedAt: Date.now() - 1000 * 60 * 60 * 26,
  },
  {
    id: 'demo-4',
    title: 'Tasks: SyncBoard Sprint Goals',
    content: '- [x] Build pastel themes (Matcha, Sakura, Lavender)\n- [x] Implement real-time Firestore sync\n- [ ] Test Android PWA install flow\n- [ ] Configure custom date pickup timeline',
    category: 'tasks',
    contentType: 'markdown',
    tags: ['todo', 'checklist', '4 items'],
    isPinned: true,
    isFavorite: false,
    charCount: 168,
    wordCount: 26,
    createdAt: Date.now() - 1000 * 60 * 60 * 52, // 2 days ago
    updatedAt: Date.now() - 1000 * 60 * 60 * 52,
  },
  {
    id: 'demo-5',
    title: 'API Secret / Access Token',
    content: 'sk_live_51Mza8K2eZvKYlo2CL7mX8qP910jN3vR4w',
    category: 'credentials',
    contentType: 'text',
    tags: ['credentials', 'key', 'security'],
    isPinned: false,
    isFavorite: false,
    charCount: 39,
    wordCount: 1,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 days ago
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
  }
];

function getLocalClips() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(DEMO_CLIPS_KEY);
    if (raw) return JSON.parse(raw);
    window.localStorage.setItem(DEMO_CLIPS_KEY, JSON.stringify(INITIAL_DEMO_CLIPS));
    return INITIAL_DEMO_CLIPS;
  } catch {
    return INITIAL_DEMO_CLIPS;
  }
}

function saveLocalClips(clips) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(DEMO_CLIPS_KEY, JSON.stringify(clips));
  }
}

/**
 * Subscribe to clips:
 * If user is logged in and db is initialized, uses Firestore real-time onSnapshot.
 * Otherwise, uses localStorage with immediate event dispatching.
 */
export function subscribeClips(user, onClipsReceived) {
  if (user && db) {
    const clipsRef = collection(db, 'users', user.uid, 'clips');
    const q = query(clipsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          ...data,
          // Firestore timestamp normalization
          createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : (data.createdAt || Date.now()),
          updatedAt: data.updatedAt?.toMillis ? data.updatedAt.toMillis() : (data.updatedAt || Date.now()),
        });
      });
      onClipsReceived(items);
    }, (err) => {
      console.warn('Firestore subscription error (fallback to local):', err);
      onClipsReceived(getLocalClips());
    });

    return unsubscribe;
  } else {
    // Local / Demo mode
    const handler = () => {
      onClipsReceived(getLocalClips());
    };
    window.addEventListener('syncboard_local_clips_updated', handler);
    // Initial emit
    onClipsReceived(getLocalClips());
    return () => {
      window.removeEventListener('syncboard_local_clips_updated', handler);
    };
  }
}

export async function addClip(user, clipData) {
  const newClip = {
    ...clipData,
    id: clipData.id || `clip_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isPinned: Boolean(clipData.isPinned),
    isFavorite: Boolean(clipData.isFavorite),
    charCount: clipData.content.length,
    wordCount: clipData.content.trim().split(/\s+/).filter(Boolean).length,
  };

  if (user && db) {
    const docRef = doc(db, 'users', user.uid, 'clips', newClip.id);
    await setDoc(docRef, {
      ...newClip,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return newClip;
  } else {
    const list = getLocalClips();
    const updated = [newClip, ...list];
    saveLocalClips(updated);
    window.dispatchEvent(new Event('syncboard_local_clips_updated'));
    return newClip;
  }
}

export async function updateClip(user, clipId, updates) {
  if (user && db) {
    const docRef = doc(db, 'users', user.uid, 'clips', clipId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } else {
    const list = getLocalClips();
    const index = list.findIndex(c => c.id === clipId);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates, updatedAt: Date.now() };
      saveLocalClips(list);
      window.dispatchEvent(new Event('syncboard_local_clips_updated'));
    }
  }
}

export async function deleteClip(user, clipId) {
  if (user && db) {
    const docRef = doc(db, 'users', user.uid, 'clips', clipId);
    await deleteDoc(docRef);
  } else {
    const list = getLocalClips();
    const updated = list.filter(c => c.id !== clipId);
    saveLocalClips(updated);
    window.dispatchEvent(new Event('syncboard_local_clips_updated'));
  }
}

export async function clearAllClips(user) {
  if (user && db) {
    // Not bulk deleting firestore here to prevent accidental total wipe
  } else {
    saveLocalClips([]);
    window.dispatchEvent(new Event('syncboard_local_clips_updated'));
  }
}
