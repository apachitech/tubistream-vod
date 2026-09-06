import fs from 'fs';
import path from 'path';

export interface SiteSettings {
  siteName: string;
  siteTagline: string;
  siteDescription: string;
  footerCopyright: string;
  primaryAccentColor?: string;
  contentRatingPolicy?: 'general' | 'mature_18' | 'family_friendly';
  announcementBanner?: string;
  isAnnouncementActive?: boolean;
  logoStyle?: 'gradient_initial' | 'badge' | 'neon';
  updatedAt?: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'TubiStream',
  siteTagline: '100% Free VOD & FAST',
  siteDescription: 'Watch thousands of free movies and binge-worthy TV series with zero subscriptions. Powered by adaptive streaming, AI recommendations, and 24/7 Live FAST TV channels.',
  footerCopyright: '© 2026 TubiStream Entertainment Inc. All rights reserved. Free VOD & FAST Streaming Platform.',
  primaryAccentColor: '#ff2a6d',
  contentRatingPolicy: 'general',
  announcementBanner: '🚀 Unlimited Free Streaming • Zero Subscriptions Required • Over 5,000+ Movies & Live Channels On Demand',
  isAnnouncementActive: false,
  logoStyle: 'gradient_initial'
};

const SETTINGS_FILE_PATH = path.join(__dirname, '../data/siteSettings.json');

export class SiteSettingsService {
  private settings: SiteSettings;

  constructor() {
    this.settings = this.loadSettings();
  }

  private loadSettings(): SiteSettings {
    try {
      if (fs.existsSync(SETTINGS_FILE_PATH)) {
        const raw = fs.readFileSync(SETTINGS_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed
        };
      }
    } catch (err) {
      console.warn('Could not read siteSettings.json, using defaults:', err);
    }
    return { ...DEFAULT_SETTINGS };
  }

  private saveSettings(): void {
    try {
      const dir = path.dirname(SETTINGS_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(this.settings, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist siteSettings.json:', err);
    }
  }

  public getSettings(): SiteSettings {
    return { ...this.settings };
  }

  public updateSettings(updates: Partial<SiteSettings>): SiteSettings {
    if (updates.siteName !== undefined && updates.siteName.trim()) {
      const oldName = this.settings.siteName;
      const newName = updates.siteName.trim();
      this.settings.siteName = newName;

      // If copyright still uses the old name or default pattern, update it automatically
      if (
        this.settings.footerCopyright.includes(oldName) &&
        (!updates.footerCopyright || !updates.footerCopyright.trim())
      ) {
        this.settings.footerCopyright = this.settings.footerCopyright.replace(
          new RegExp(oldName, 'g'),
          newName
        );
      }
    }

    if (updates.siteTagline !== undefined) {
      this.settings.siteTagline = updates.siteTagline.trim() || DEFAULT_SETTINGS.siteTagline;
    }

    if (updates.siteDescription !== undefined) {
      this.settings.siteDescription = updates.siteDescription.trim() || DEFAULT_SETTINGS.siteDescription;
    }

    if (updates.footerCopyright !== undefined && updates.footerCopyright.trim()) {
      this.settings.footerCopyright = updates.footerCopyright.trim();
    }

    if (updates.primaryAccentColor !== undefined && updates.primaryAccentColor.trim()) {
      this.settings.primaryAccentColor = updates.primaryAccentColor.trim();
    }

    if (updates.contentRatingPolicy !== undefined) {
      this.settings.contentRatingPolicy = updates.contentRatingPolicy;
    }

    if (updates.announcementBanner !== undefined) {
      this.settings.announcementBanner = updates.announcementBanner.trim();
    }

    if (updates.isAnnouncementActive !== undefined) {
      this.settings.isAnnouncementActive = Boolean(updates.isAnnouncementActive);
    }

    if (updates.logoStyle !== undefined) {
      this.settings.logoStyle = updates.logoStyle;
    }

    this.settings.updatedAt = new Date().toISOString();
    this.saveSettings();
    return { ...this.settings };
  }

  public resetToDefaults(): SiteSettings {
    this.settings = { ...DEFAULT_SETTINGS, updatedAt: new Date().toISOString() };
    this.saveSettings();
    return { ...this.settings };
  }
}

export const siteSettingsService = new SiteSettingsService();
