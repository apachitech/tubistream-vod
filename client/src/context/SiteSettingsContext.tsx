import React, { createContext, useContext, useState, useEffect } from 'react';
import { SiteSettings } from '../types';
import { api } from '../services/api';

interface SiteSettingsContextType {
  settings: SiteSettings;
  siteName: string;
  siteTagline: string;
  siteDescription: string;
  footerCopyright: string;
  isLoading: boolean;
  updateSettings: (updates: Partial<SiteSettings>) => Promise<{ success: boolean; message: string; settings?: SiteSettings; error?: string }>;
  resetSettings: () => Promise<{ success: boolean; message: string; settings?: SiteSettings; error?: string }>;
  refreshSettings: () => Promise<void>;
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'TubiStream',
  siteTagline: '100% Free VOD & FAST',
  siteDescription: 'Watch thousands of free movies and binge-worthy TV series with zero subscriptions. Powered by adaptive streaming, AI recommendations, and 24/7 Live FAST TV channels.',
  footerCopyright: '© 2026 TubiStream Entertainment Inc. All rights reserved. Free VOD & FAST Streaming Platform.'
};

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshSettings = async () => {
    try {
      const res = await api.getSiteSettings();
      if (res && res.success && res.settings) {
        setSettings(res.settings);
      }
    } catch (err) {
      console.error('Error fetching site branding settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  // Update browser tab title dynamically whenever site name or tagline updates
  useEffect(() => {
    if (typeof document !== 'undefined' && settings.siteName) {
      document.title = `${settings.siteName} — Watch Free Movies & TV Shows | ${settings.siteTagline}`;
    }
  }, [settings.siteName, settings.siteTagline]);

  const updateSettings = async (updates: Partial<SiteSettings>): Promise<{ success: boolean; message: string; settings?: SiteSettings; error?: string }> => {
    try {
      const res = await api.updateSiteSettings(updates);
      if (res && res.success && res.settings) {
        setSettings(res.settings);
        return { success: true, message: res.message || 'Platform branding updated successfully', settings: res.settings };
      }
      return { success: false, message: (res as any)?.message || 'Failed to update settings', error: (res as any)?.error || (res as any)?.message };
    } catch (err: any) {
      console.error('Failed to update settings:', err);
      return { success: false, message: err.message || 'Network error updating settings', error: err.message };
    }
  };

  const resetSettings = async (): Promise<{ success: boolean; message: string; settings?: SiteSettings; error?: string }> => {
    try {
      const res = await api.resetSiteSettings();
      if (res && res.success && res.settings) {
        setSettings(res.settings);
        return { success: true, message: res.message || 'Settings reset to default', settings: res.settings };
      }
      return { success: false, message: (res as any)?.message || 'Failed to reset settings', error: (res as any)?.error || (res as any)?.message };
    } catch (err: any) {
      console.error('Failed to reset settings:', err);
      return { success: false, message: err.message || 'Network error resetting settings', error: err.message };
    }
  };

  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        siteName: settings.siteName || DEFAULT_SETTINGS.siteName,
        siteTagline: settings.siteTagline || DEFAULT_SETTINGS.siteTagline,
        siteDescription: settings.siteDescription || DEFAULT_SETTINGS.siteDescription,
        footerCopyright: settings.footerCopyright || DEFAULT_SETTINGS.footerCopyright,
        isLoading,
        updateSettings,
        resetSettings,
        refreshSettings
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = (): SiteSettingsContextType => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};
