import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserProfile, SubscriptionPaymentRequest, PaymentTransaction } from '../types';
import { api, getAuthToken, clearAuthToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  activeProfile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (email: string, password: string, name?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  switchProfile: (profileId: string) => Promise<void>;
  addProfile: (name: string, avatarUrl?: string, isKids?: boolean) => Promise<boolean>;
  deleteProfile: (profileId: string) => Promise<boolean>;
  updateWatchProgress: (titleId: string, progress: number, duration: number) => Promise<void>;
  toggleMyList: (titleId: string) => Promise<boolean>;
  toggleLike: (titleId: string) => Promise<boolean>;
  upgradeToVip: (paymentPayload?: Partial<SubscriptionPaymentRequest>) => Promise<{ success: boolean; message?: string; transaction?: PaymentTransaction }>;
  isInMyList: (titleId: string) => boolean;
  isLiked: (titleId: string) => boolean;
  refreshUser: () => Promise<void>;
  isAuthModalOpen: boolean;
  authModalTab: 'signin' | 'register';
  openAuthModal: (tab?: 'signin' | 'register') => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'register'>('signin');

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

  const isAuthenticated = !!(user && !user.isGuest && user.email && !user.email.includes('@tubistream.local'));
  const isGuest = !isAuthenticated;
  const isAdmin = !!(user && (user.role === 'admin' || user.email === 'admin@tubistream.com'));

  const activeProfile = user
    ? user.profiles.find((p) => p.id === user.activeProfileId) || user.profiles[0]
    : null;

  const openAuthModal = (tab: 'signin' | 'register' = 'signin') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await api.login(email, password);
      if (res.success && res.user) {
        setUser(res.user);
        setIsAuthModalOpen(false);
        return { success: true };
      }
      return { success: false, message: res.message || 'Login failed. Please check credentials.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Connection error. Please try again.' };
    }
  };

  const register = async (email: string, password: string, name?: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await api.register(email, password, name);
      if (res.success && res.user) {
        setUser(res.user);
        setIsAuthModalOpen(false);
        return { success: true };
      }
      return { success: false, message: res.message || 'Registration failed.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Connection error. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await api.logout();
      // Load or create guest session
      const guestRes = await api.createGuest();
      if (guestRes.success && guestRes.user) {
        setUser(guestRes.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Logout failed', err);
      clearAuthToken();
      setUser(null);
    }
  };

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

  const addProfile = async (name: string, avatarUrl?: string, isKids = false): Promise<boolean> => {
    if (!user) return false;
    try {
      const res = await api.addProfile(user.id, name, avatarUrl, isKids);
      if (res.success && res.user) {
        setUser(res.user);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to add profile', err);
      return false;
    }
  };

  const deleteProfile = async (profileId: string): Promise<boolean> => {
    if (!user) return false;
    try {
      const res = await api.deleteProfile(user.id, profileId);
      if (res.success && res.user) {
        setUser(res.user);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to delete profile', err);
      return false;
    }
  };

  const updateWatchProgress = async (titleId: string, progress: number, duration: number) => {
    if (!user) return;
    try {
      await api.updateProgress(user.id, titleId, progress, duration);
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

  const upgradeToVip = async (paymentPayload?: Partial<SubscriptionPaymentRequest>): Promise<{ success: boolean; message?: string; transaction?: PaymentTransaction }> => {
    if (!user) return { success: false, message: 'Please sign in to complete subscription' };
    try {
      if (paymentPayload && paymentPayload.paymentMethod) {
        const payload: SubscriptionPaymentRequest = {
          userId: user.id,
          planTier: 'vip_premium',
          billingCycle: paymentPayload.billingCycle || 'monthly',
          paymentMethod: paymentPayload.paymentMethod,
          cardDetails: paymentPayload.cardDetails,
          mobileMoneyDetails: paymentPayload.mobileMoneyDetails
        };
        const res = await api.subscribeWithPayment(payload);
        if (res.success && res.user) {
          setUser(res.user);
          return { success: true, message: res.message, transaction: res.transaction };
        }
        return { success: false, message: res.message || 'Payment authorization failed' };
      } else {
        const res = await api.upgradeToVip(user.id);
        if (res.success && res.user) {
          setUser(res.user);
          return { success: true };
        }
        return { success: false, message: 'Upgrade failed' };
      }
    } catch (err: any) {
      console.error('Failed to upgrade VIP', err);
      return { success: false, message: err.message || 'Payment processing failed' };
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
        isAuthenticated,
        isGuest,
        isAdmin,
        login,
        register,
        logout,
        switchProfile,
        addProfile,
        deleteProfile,
        updateWatchProgress,
        toggleMyList,
        toggleLike,
        upgradeToVip,
        isInMyList,
        isLiked,
        refreshUser: fetchUser,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal
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
