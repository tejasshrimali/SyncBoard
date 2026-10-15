import React, { useState } from 'react';
import { User } from 'lucide-react';

export default function UserAvatar({ user, size = "w-8 h-8", textSize = "text-xs" }) {
  const [imgError, setImgError] = useState(false);

  const getInitial = () => {
    if (!user) return '?';
    if (user.displayName) return user.displayName[0].toUpperCase();
    if (user.email) return user.email[0].toUpperCase();
    return 'U';
  };

  if (user && user.photoURL && !imgError) {
    return (
      <img
        src={user.photoURL}
        alt={user.displayName || user.email || 'User Avatar'}
        onError={() => setImgError(true)}
        className={`${size} rounded-full object-cover border border-theme-border shadow-xs flex-shrink-0`}
      />
    );
  }

  return (
    <div className={`${size} rounded-full bg-theme-accent text-white flex items-center justify-center font-bold ${textSize} shadow-xs flex-shrink-0`}>
      {user ? getInitial() : <User className="w-3.5 h-3.5" />}
    </div>
  );
}
