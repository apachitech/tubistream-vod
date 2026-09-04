import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserProfile } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  activeProfile: UserProfile | null;
  isLoading: boolean;
  switchProfile: (profileId: string) => Promise<void>;
  updateWatchProgress: (titleId: string, progress: number, duration: number) => Promise<void>;
  toggleMyList: (titleId: string) => Promise<boolean>;
  toggleLike: (titleId: string) => Promise<boolean>;
  upgradeToVip: () => Promise<void>;
  isInMyList: (titleId: string) => boolean;
  isLiked: (titleId: string) => boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUser = async () => {
    try {
      const res = await api.getMe();
      if (res.success && res.user) {
        setUser(res.user);
      }
    } catch (err) {
      console.error('Failed to load user', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const activeProfile = user
    ? user.profiles.find((p) => p.id === user.activeProfileId) || user.profiles[0]
    : null;

  const switchProfile = async (profileId: string) => {
    if (!user) return;
    try {
      const res = await api.switchProfile(user.id, profileId);
      if (res.success && res.user) {
        setUser(res.user);
      }
    } catch (err) {
      console.error('Failed to switch profile', err);
    }
  };

  const updateWatchProgress = async (titleId: string, progress: number, duration: number) => {
    if (!user) return;
    try {
      await api.updateProgress(user.id, titleId, progress, duration);
      // Optimistic update
      if (activeProfile) {
        const existing = activeProfile.watchHistory.find((h) => h.titleId === titleId);
        if (existing) {
          existing.progressSeconds = progress;
          existing.durationSeconds = duration;
        } else {
          activeProfile.watchHistory.unshift({
            titleId,
            progressSeconds: progress,
            durationSeconds: duration,
            completed: false,
            lastWatchedAt: new Date().toISOString()
          });
        }
      }
    } catch (err) {
      console.error('Failed to update progress', err);
    }
  };

  const toggleMyList = async (titleId: string): Promise<boolean> => {
    if (!user) return false;
    try {
      const res = await api.toggleMyList(user.id, titleId);
      if (res.success && activeProfile) {
        activeProfile.myList = res.myList;
        setUser({ ...user });
        return res.inList;
      }
      return false;
    } catch (err) {
      console.error('Failed to toggle myList', err);
      return false;
    }
  };

  const toggleLike = async (titleId: string): Promise<boolean> => {
    if (!user) return false;
    try {
      const res = await api.toggleLike(user.id, titleId);
      if (res.success && activeProfile) {
        if (res.liked) {
          if (!activeProfile.likedTitles.includes(titleId)) activeProfile.likedTitles.push(titleId);
        } else {
          activeProfile.likedTitles = activeProfile.likedTitles.filter((id) => id !== titleId);
        }
        setUser({ ...user });
        return res.liked;
      }
      return false;
    } catch (err) {
      console.error('Failed to toggle like', err);
      return false;
    }
  };

  const upgradeToVip = async () => {
    if (!user) return;
    try {
      const res = await api.upgradeToVip(user.id);
      if (res.success && res.user) {
        setUser(res.user);
      }
    } catch (err) {
      console.error('Failed to upgrade VIP', err);
    }
  };

  const isInMyList = (titleId: string): boolean => {
    return activeProfile ? activeProfile.myList.includes(titleId) : false;
  };

  const isLiked = (titleId: string): boolean => {
    return activeProfile ? activeProfile.likedTitles.includes(titleId) : false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeProfile,
        isLoading,
        switchProfile,
        updateWatchProgress,
        toggleMyList,
        toggleLike,
        upgradeToVip,
        isInMyList,
        isLiked,
        refreshUser: fetchUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
