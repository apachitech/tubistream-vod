import React, { useState, useEffect } from 'react';
import { Title, FastChannel, AnalyticsSummary, AdCreative, User, PlatformPlanSettings, PlanTierConfig, PaymentTransaction, SubscriptionPaymentMethodConfig } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import {
  LayoutDashboard, Film, Radio, DollarSign, Activity, Sparkles, Plus, Trash2, Edit3,
  TrendingUp, Users, HardDrive, ShieldCheck, Check, RefreshCw, Layers,
  Sliders, Play, Pause, Copy, ExternalLink, ToggleLeft, ToggleRight, Eye, Code, X,
  Crown, Search, Shield, Zap, Tv, CreditCard, Smartphone, CheckCircle2, Receipt,
  Wallet, Landmark, Coins, Globe, PlusCircle, Settings, Palette, Monitor
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { isAdmin } = useAuth();
  const { settings, updateSettings, resetSettings } = useSiteSettings();
  const [activeTab, setActiveTab] = useState<'overview' | 'catalog' | 'fast' | 'ads' | 'plans' | 'ml' | 'settings'>('overview');
  const [dashboardData, setDashboardData] = useState<any | null>(null);
  const [titles, setTitles] = useState<Title[]>([]);
  const [channels, setChannels] = useState<FastChannel[]>([]);
  const [ads, setAds] = useState<AdCreative[]>([]);
  const [planSettings, setPlanSettings] = useState<PlatformPlanSettings | null>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [userFilter, setUserFilter] = useState<'all' | 'free' | 'vip_premium'>('all');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [planToast, setPlanToast] = useState<string | null>(null);

  // Site Settings & Platform Branding State
  const [settingsForm, setSettingsForm] = useState({
    siteName: '',
    siteTagline: '',
    siteDescription: '',
    footerCopyright: ''
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsToast, setSettingsToast] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      setSettingsForm({
        siteName: settings.siteName || '',
        siteTagline: settings.siteTagline || '',
        siteDescription: settings.siteDescription || '',
        footerCopyright: settings.footerCopyright || ''
      });
    }
  }, [settings]);

  // Subscription Transactions State
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [txSearchQuery, setTxSearchQuery] = useState('');
  const [txMethodFilter, setTxMethodFilter] = useState<'all' | 'card' | 'mobile_money'>('all');

  // Subscription Payment Methods State (Admin Control)
  const [paymentMethodsList, setPaymentMethodsList] = useState<SubscriptionPaymentMethodConfig[]>([]);
  const [isAddMethodOpen, setIsAddMethodOpen] = useState(false);
  const [newMethodForm, setNewMethodForm] = useState({
    name: '',
    category: 'custom' as 'card' | 'mobile_money' | 'wallet' | 'bank' | 'crypto' | 'custom',
    description: '',
    badge: 'New',
    icon: 'credit-card',
    isEnabled: true,
    supportedCurrencies: 'USD, EUR, GBP',
    instructions: ''
  });

  // FAST TV Channel Management State
  const [isAddChannelOpen, setIsAddChannelOpen] = useState(false);
  const [fastToast, setFastToast] = useState<string | null>(null);
  const [editingChannel, setEditingChannel] = useState<FastChannel | null>(null);
  const [previewChannel, setPreviewChannel] = useState<FastChannel | null>(null);
  const [fastSearchQuery, setFastSearchQuery] = useState('');
  const [fastCategoryFilter, setFastCategoryFilter] = useState('all');
  const [copiedStreamId, setCopiedStreamId] = useState<string | null>(null);

  const [newChannel, setNewChannel] = useState({
    name: '',
    channelNumber: 107,
    category: 'Action' as 'News' | 'Movies' | 'Comedy' | 'Action' | 'Sci-Fi' | 'Anime' | 'Documentary' | 'Sports' | 'Kids',
    logoUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&auto=format&fit=crop&q=80',
    description: '',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
  });
  const [adConfig, setAdConfig] = useState<any>({
    prerollEnabled: true,
    midrollEnabled: true,
    pauseAdsEnabled: true,
    maxAdsPerBreak: 1,
    minMidrollIntervalMinutes: 10,
    vipAdFreeBypass: true
  });
  const [adSummary, setAdSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // New Ad Creative Form State
  const [newAd, setNewAd] = useState({
    advertiserName: '',
    campaignId: 'camp-custom-q1',
    title: '',
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    clickThroughUrl: 'https://tubitv.com',
    category: 'Entertainment',
    cpm: 28.50,
    durationSeconds: 15,
    vastTagUrl: ''
  });
  const [editingCpmId, setEditingCpmId] = useState<string | null>(null);
  const [cpmInput, setCpmInput] = useState<string>('');
  const [adToast, setAdToast] = useState<string | null>(null);
  const [copiedVastId, setCopiedVastId] = useState<string | null>(null);
  const [previewVastXml, setPreviewVastXml] = useState<string | null>(null);

  // New Title Form State
  const [newTitle, setNewTitle] = useState({
    title: '',
    type: 'movie' as 'movie' | 'series',
    synopsis: '',
    shortDescription: '',
    releaseYear: 2025,
    durationMinutes: 90,
    rating: 'PG-13' as any,
    imdbScore: 8.0,
    matchScore: 95,
    accessTier: 'free' as 'free' | 'vip_premium',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600',
    streamUrl: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    genres: 'Action, Sci-Fi',
    director: 'Christopher Nolan',
    cast: 'John David, Robert Pattinson',
    studio: 'Universal Pictures',
    cuePointsSeconds: '300, 900, 1800'
  });

  const [formSuccess, setFormSuccess] = useState(false);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [dash, tit, chan, adRes, plansRes, usersRes, txRes, methodsRes] = await Promise.all([
        api.getAdminDashboard(),
        api.getTitles({ limit: 50 }),
        api.getFastChannels(),
        api.getAdminAds(),
        api.getAdminPlans(),
        api.getAdminUsers(),
        api.getAdminPaymentTransactions(),
        api.getAdminPaymentMethods()
      ]);
      if (dash.success) setDashboardData(dash);
      if (tit.success) setTitles(tit.titles);
      if (chan.success) setChannels(chan.channels);
      if (adRes.success) {
        setAds(adRes.ads);
        if (adRes.config) setAdConfig(adRes.config);
        if (adRes.summary) setAdSummary(adRes.summary);
      }
      if (plansRes?.success) setPlanSettings(plansRes.planSettings);
      if (usersRes?.success) setUsersList(usersRes.users);
      if (txRes?.success) setTransactions(txRes.transactions);
      if (methodsRes?.success) setPaymentMethodsList(methodsRes.methods);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePaymentMethod = async (methodId: string) => {
    try {
      const res = await api.togglePaymentMethod(methodId);
      if (res.success && res.method) {
        setPaymentMethodsList(prev => prev.map(m => m.id === methodId ? res.method : m));
        setPlanToast(`Payment method "${res.method.name}" is now ${res.method.isEnabled ? 'Active & Live on Checkout' : 'Disabled'}`);
        setTimeout(() => setPlanToast(null), 3500);
      }
    } catch (err) {
      console.error('Failed to toggle payment method', err);
    }
  };

  const handleCreatePaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const currencies = newMethodForm.supportedCurrencies
        .split(',')
        .map(c => c.trim().toUpperCase())
        .filter(Boolean);

      const res = await api.createPaymentMethod({
        name: newMethodForm.name,
        category: newMethodForm.category,
        description: newMethodForm.description,
        badge: newMethodForm.badge,
        icon: newMethodForm.icon,
        isEnabled: newMethodForm.isEnabled,
        supportedCurrencies: currencies.length > 0 ? currencies : ['USD'],
        instructions: newMethodForm.instructions
      });

      if (res.success && res.method) {
        setPaymentMethodsList(prev => [...prev, res.method]);
        setIsAddMethodOpen(false);
        setNewMethodForm({
          name: '',
          category: 'custom',
          description: '',
          badge: 'New',
          icon: 'credit-card',
          isEnabled: true,
          supportedCurrencies: 'USD, EUR, GBP',
          instructions: ''
        });
        setPlanToast(`New payment method "${res.method.name}" added successfully!`);
        setTimeout(() => setPlanToast(null), 3500);
      }
    } catch (err) {
      console.error('Failed to create payment method', err);
    }
  };

  const handleDeletePaymentMethod = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete payment method "${name}"?`)) return;
    try {
      const res = await api.deletePaymentMethod(id);
      if (res.success) {
        setPaymentMethodsList(prev => prev.filter(m => m.id !== id));
        setPlanToast(`Payment method "${name}" deleted.`);
        setTimeout(() => setPlanToast(null), 3000);
      }
    } catch (err) {
      console.error('Failed to delete payment method', err);
    }
  };

  const handleToggleUserTier = async (userId: string, targetTier: 'free' | 'vip_premium') => {
    try {
      const res = await api.updateUserTier(userId, targetTier);
      if (res.success) {
        setUsersList(prev => prev.map(u => u.id === userId ? { ...u, tier: targetTier } : u));
        setPlanToast(`User plan updated to ${targetTier === 'vip_premium' ? 'Tubi+ VIP Premium 👑' : 'TubiStream Free'}`);
        setTimeout(() => setPlanToast(null), 3500);
      }
    } catch (err) {
      console.error('Failed to update user tier', err);
    }
  };

  const handleSavePlans = async (updatedSettings: Partial<PlatformPlanSettings>) => {
    try {
      const res = await api.updateAdminPlans(updatedSettings);
      if (res.success) {
        setPlanSettings(res.planSettings);
        setPlanToast('Plan pricing and subscriber rules updated live!');
        setTimeout(() => setPlanToast(null), 3500);
      }
    } catch (err) {
      console.error('Failed to update plans', err);
    }
  };

  const handleToggleTitleAccess = async (titleId: string, accessTier: 'free' | 'vip_premium') => {
    try {
      const res = await api.updateTitleAccessTier(titleId, accessTier);
      if (res.success) {
        setTitles(prev => prev.map(t => t.id === titleId ? { ...t, accessTier } : t));
        setPlanToast(`Title access changed to ${accessTier === 'vip_premium' ? 'VIP Exclusive 👑' : '100% Free for All 🎬'}`);
        setTimeout(() => setPlanToast(null), 3000);
      }
    } catch (err) {
      console.error('Failed to update title access tier', err);
    }
  };

  const handleSaveSiteSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!settingsForm.siteName.trim()) {
      setSettingsToast('Platform name cannot be empty');
      setTimeout(() => setSettingsToast(null), 3000);
      return;
    }
    setIsSavingSettings(true);
    try {
      const res = await updateSettings({
        siteName: settingsForm.siteName.trim(),
        siteTagline: settingsForm.siteTagline.trim(),
        siteDescription: settingsForm.siteDescription.trim(),
        footerCopyright: settingsForm.footerCopyright.trim()
      });
      if (res.success && res.settings) {
        setSettingsToast(`Platform name updated to "${res.settings.siteName}"! Applied live across all screens.`);
      } else {
        setSettingsToast(res.error || 'Failed to update site settings');
      }
    } catch (err: any) {
      setSettingsToast(err?.message || 'Error updating settings');
    } finally {
      setIsSavingSettings(false);
      setTimeout(() => setSettingsToast(null), 4000);
    }
  };

  const handleResetSiteSettings = async () => {
    if (!window.confirm('Reset platform name and branding settings to default?')) return;
    setIsSavingSettings(true);
    try {
      const res = await resetSettings();
      if (res.success && res.settings) {
        setSettingsForm({
          siteName: res.settings.siteName,
          siteTagline: res.settings.siteTagline,
          siteDescription: res.settings.siteDescription,
          footerCopyright: res.settings.footerCopyright
        });
        setSettingsToast(`Settings reset to default ("${res.settings.siteName}")!`);
      }
    } catch (err: any) {
      setSettingsToast('Failed to reset settings');
    } finally {
      setIsSavingSettings(false);
      setTimeout(() => setSettingsToast(null), 3500);
    }
  };

  const handleCreateFastChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannel.name.trim() || !newChannel.streamUrl.trim()) return;

    try {
      const res = await api.createFastChannel({
        name: newChannel.name.trim(),
        channelNumber: Number(newChannel.channelNumber) || undefined,
        category: newChannel.category,
        logoUrl: newChannel.logoUrl.trim(),
        description: newChannel.description.trim() || `24/7 continuous linear streaming for ${newChannel.name}`,
        streamUrl: newChannel.streamUrl.trim()
      });

      if (res.success) {
        setChannels(prev => [...prev, res.channel].sort((a, b) => a.channelNumber - b.channelNumber));
        setFastToast(`FAST Channel "${res.channel.name}" (CH ${res.channel.channelNumber}) launched live!`);
        setIsAddChannelOpen(false);
        setNewChannel({
          name: '',
          channelNumber: res.channel.channelNumber + 1,
          category: 'Action',
          logoUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&auto=format&fit=crop&q=80',
          description: '',
          streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
        });
        setTimeout(() => setFastToast(null), 3500);
      }
    } catch (err) {
      console.error('Create FAST channel failed', err);
    }
  };

  const handleUpdateFastChannel = async (id: string, updates: Partial<FastChannel>) => {
    try {
      const res = await api.updateFastChannel(id, updates);
      if (res.success) {
        setChannels(prev => prev.map(c => c.id === id ? res.channel : c).sort((a, b) => a.channelNumber - b.channelNumber));
        setEditingChannel(null);
        setFastToast(`FAST Channel "${res.channel.name}" updated successfully!`);
        setTimeout(() => setFastToast(null), 3500);
      }
    } catch (err) {
      console.error('Update FAST channel failed', err);
    }
  };

  const handleDeleteFastChannel = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to decommission and delete FAST Channel "${name}"?`)) return;
    try {
      const res = await api.deleteFastChannel(id);
      if (res.success) {
        setChannels(prev => prev.filter(c => c.id !== id));
        setFastToast(`Channel "${name}" deleted from live broadcast lineup.`);
        setTimeout(() => setFastToast(null), 3500);
      }
    } catch (err) {
      console.error('Delete FAST channel failed', err);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAllData();
    }
  }, [isAdmin]);

  const handleUpdateAdConfig = async (partialConfig: any) => {
    try {
      const next = { ...adConfig, ...partialConfig };
      setAdConfig(next);
      const res = await api.updateAdConfig(partialConfig);
      if (res.success) {
        setAdToast('Ad Engine delivery rules updated in real-time!');
        setTimeout(() => setAdToast(null), 3000);
      }
    } catch (err) {
      console.error('Update ad config failed', err);
    }
  };

  const handleCreateAd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.createAdCreative({
        ...newAd,
        durationSeconds: Number(newAd.durationSeconds),
        cpm: Number(newAd.cpm)
      });
      if (res.success) {
        setAdToast(`Ad campaign "${newAd.title}" created & deployed!`);
        setNewAd({
          advertiserName: '',
          campaignId: 'camp-custom-q1',
          title: '',
          videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
          clickThroughUrl: 'https://tubitv.com',
          category: 'Entertainment',
          cpm: 28.50,
          durationSeconds: 15,
          vastTagUrl: ''
        });
        setTimeout(() => setAdToast(null), 3500);
        fetchAllData();
      }
    } catch (err) {
      console.error('Create ad failed', err);
    }
  };

  const handleToggleAdStatus = async (adId: string) => {
    try {
      const res = await api.toggleAdStatus(adId);
      if (res.success) {
        setAdToast(`Ad campaign ${res.ad.status === 'active' ? 'activated' : 'paused'}!`);
        setTimeout(() => setAdToast(null), 2500);
        fetchAllData();
      }
    } catch (err) {
      console.error('Toggle ad status failed', err);
    }
  };

  const handleSaveCpm = async (adId: string) => {
    try {
      const val = parseFloat(cpmInput);
      if (!isNaN(val)) {
        await api.updateAdCpm(adId, val);
        setEditingCpmId(null);
        setAdToast('Ad CPM floor price updated!');
        setTimeout(() => setAdToast(null), 2500);
        fetchAllData();
      }
    } catch (err) {
      console.error('Save CPM failed', err);
    }
  };

  const handleDeleteAd = async (adId: string) => {
    if (!window.confirm('Are you sure you want to remove this ad creative from active inventory?')) return;
    try {
      const res = await api.deleteAdCreative(adId);
      if (res.success) {
        setAdToast('Ad creative removed.');
        setTimeout(() => setAdToast(null), 2500);
        fetchAllData();
      }
    } catch (err) {
      console.error('Delete ad failed', err);
    }
  };

  const handleCopyVastUrl = (adId: string) => {
    const vastUrl = `${window.location.origin}/api/ads/vast?adId=${adId}`;
    navigator.clipboard.writeText(vastUrl);
    setCopiedVastId(adId);
    setTimeout(() => setCopiedVastId(null), 2000);
  };

  const handlePreviewVast = async (adId: string) => {
    try {
      const res = await fetch(`/api/ads/vast?adId=${adId}`);
      const xml = await res.text();
      setPreviewVastXml(xml);
    } catch (err) {
      console.error('Fetch VAST XML failed', err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleCreateTitle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...newTitle,
        genres: newTitle.genres.split(',').map((g) => g.trim()),
        tags: ['Featured', 'New Release'],
        cast: newTitle.cast.split(',').map((c) => c.trim()),
        audioTracks: [{ id: 'en-51', language: 'en', label: 'English (Dolby 5.1)', codec: 'aac', channels: '5.1 Dolby Digital' as any }],
        subtitles: [{ id: 'sub-en', language: 'en', label: 'English [CC]', kind: 'captions' as any, src: '', default: true }],
        renditions: [{ resolution: '1080p' as any, bitrateKbps: 5000, width: 1920, height: 1080, fps: 24, url: newTitle.streamUrl }],
        drm: { drmType: 'ClearKey' as any, licenseServerUrl: '/api/drm/license', isEncrypted: false, securityLevel: 'L3' as any },
        cuePointsSeconds: newTitle.cuePointsSeconds.split(',').map((s) => parseInt(s.trim()) || 0),
        isFeatured: true,
        isOriginal: false,
        isTrending: true
      };

      const res = await api.createTitle(payload);
      if (res.success) {
        setFormSuccess(true);
        setTimeout(() => setFormSuccess(false), 3000);
        fetchAllData();
      }
    } catch (err) {
      console.error('Create title failed', err);
    }
  };

  const handleDeleteTitle = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this title?')) return;
    try {
      const res = await api.deleteTitle(id);
      if (res.success) fetchAllData();
    } catch (err) {
      console.error('Delete title failed', err);
    }
  };

  const summary: AnalyticsSummary = dashboardData?.summary || {
    totalViewersNow: 4280,
    totalWatchHoursToday: 18420,
    totalAdImpressionsToday: 8420,
    totalAdRevenueToday: 223.13,
    fillRatePercentage: 99.4,
    averageBitrateMbps: 4.8,
    cdnBandwidthGbToday: 1420.5,
    topGenres: [
      { genre: 'Action', count: 1200000, watchHours: 8400 },
      { genre: 'Sci-Fi', count: 980000, watchHours: 6200 }
    ],
    deviceBreakdown: [
      { device: 'Smart TV / 10-Foot UI', percentage: 44 },
      { device: 'Desktop Web Cinema', percentage: 32 },
      { device: 'Mobile & Tablet PWA', percentage: 18 },
      { device: 'Roku & Apple TV', percentage: 6 }
    ],
    revenueTrend: [],
    qosMetrics: { averageBufferRatio: 0.12, errorRatePercentage: 0.04, avgStartupTimeMs: 420 }
  };

  if (!isAdmin) {
    return (
      <div style={{ maxWidth: '640px', margin: '80px auto', padding: '40px', textAlign: 'center' }} className="glass-panel">
        <h3 style={{ color: 'var(--accent-pink)', marginBottom: '8px', fontSize: '1.4rem' }}>Admin Access Restricted</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          You must be logged in as an Administrator to view and manage the TubiStream Studio CMS.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: 'clamp(16px, 3vw, 32px) clamp(14px, 2.5vw, 24px)', minHeight: '85vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              style={{
                background: '#9d4edd',
                color: '#fff',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 800
              }}
            >
              EXECUTIVE STUDIO
            </span>
            <h1 style={{ fontSize: 'clamp(1.35rem, 4vw, 2.2rem)', fontWeight: 900, color: '#fff' }}>
              Content Management & Analytics CMS
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Real-time streaming telemetry, IAB VAST ad inventory, FAST channel scheduler, and ML vector recommendations.
          </p>
        </div>

        <button onClick={fetchAllData} className="btn-secondary" style={{ gap: '6px' }}>
          <RefreshCw size={16} /> Refresh Metrics
        </button>
      </div>

      {/* KPI Stats Top Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(150px, 45vw, 220px), 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}
      >
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>ACTIVE VIEWERS</span>
            <Users size={18} color="var(--accent-green)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fff' }}>
            {summary.totalViewersNow.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--accent-green)', marginTop: '4px', fontWeight: 700 }}>
            ● Live Stream Telemetry Active
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>AD REVENUE TODAY</span>
            <DollarSign size={18} color="#ffd700" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ffd700' }}>
            ${summary.totalAdRevenueToday.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {summary.totalAdImpressionsToday.toLocaleString()} Impressions @ $26.50 CPM
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>WATCH HOURS</span>
            <TrendingUp size={18} color="var(--accent-pink)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fff' }}>
            {summary.totalWatchHoursToday.toLocaleString()} hrs
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--accent-pink)', marginTop: '4px', fontWeight: 700 }}>
            Fill Rate: {summary.fillRatePercentage}%
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>CDN EGRESS SAVED</span>
            <HardDrive size={18} color="var(--accent-cyan)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent-cyan)' }}>
            {summary.cdnBandwidthGbToday} GB
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Avg Bitrate: {summary.averageBitrateMbps} Mbps
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div
        className="no-scrollbar scroll-touch"
        style={{
          display: 'flex',
          gap: '12px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '16px',
          marginBottom: '32px',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}
      >
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.92rem',
            background: activeTab === 'overview' ? '#9d4edd' : 'rgba(255,255,255,0.04)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexShrink: 0
          }}
        >
          <Activity size={16} /> QoS & Revenue Analytics
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.92rem',
            background: activeTab === 'catalog' ? '#9d4edd' : 'rgba(255,255,255,0.04)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexShrink: 0
          }}
        >
          <Film size={16} /> Catalog Ingestion & CMS ({titles.length})
        </button>

        <button
          onClick={() => setActiveTab('fast')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.92rem',
            background: activeTab === 'fast' ? '#9d4edd' : 'rgba(255,255,255,0.04)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexShrink: 0
          }}
        >
          <Radio size={16} /> FAST Live Channels ({channels.length})
        </button>

        <button
          onClick={() => setActiveTab('ads')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.92rem',
            background: activeTab === 'ads' ? '#9d4edd' : 'rgba(255,255,255,0.04)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexShrink: 0
          }}
        >
          <DollarSign size={16} /> Ad Engine & Inventory ({ads.length})
        </button>

        <button
          onClick={() => setActiveTab('plans')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.92rem',
            background: activeTab === 'plans' ? '#9d4edd' : 'rgba(255,255,255,0.04)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexShrink: 0
          }}
        >
          <Crown size={16} color="#ffd700" /> Plan & Subscriber Controls ({usersList.length})
        </button>

        <button
          onClick={() => setActiveTab('ml')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.92rem',
            background: activeTab === 'ml' ? '#9d4edd' : 'rgba(255,255,255,0.04)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexShrink: 0
          }}
        >
          <Sparkles size={16} /> ML Vector Engine Insights
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.92rem',
            background: activeTab === 'settings' ? '#9d4edd' : 'rgba(255,255,255,0.04)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexShrink: 0,
            border: activeTab === 'settings' ? '1px solid rgba(255, 42, 109, 0.4)' : '1px solid transparent',
            transition: 'all 0.2s ease'
          }}
        >
          <Settings size={16} color={activeTab === 'settings' ? '#fff' : 'var(--accent-pink)'} /> Site Branding & Identity
        </button>
      </div>

      {/* Tab 1: Overview Analytics */}
      {activeTab === 'overview' && (
        <div className="responsive-two-col" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Device Distribution */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px' }}>
              Multi-Device Audience Breakdown
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {summary.deviceBreakdown.map((dev) => (
                <div key={dev.device}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600, marginBottom: '6px' }}>
                    <span>{dev.device}</span>
                    <span style={{ color: 'var(--accent-pink)', fontWeight: 800 }}>{dev.percentage}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px' }}>
                    <div
                      style={{
                        width: `${dev.percentage}%`,
                        height: '100%',
                        borderRadius: '4px',
                        background: 'var(--accent-gradient)'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quality of Service QoS Health */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px' }}>
              QoS Stream Telemetry
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Average Buffer Ratio:</span>
                <span style={{ fontWeight: 800, color: 'var(--accent-green)' }}>
                  {summary.qosMetrics.averageBufferRatio}% (Optimal)
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Stream Error Rate:</span>
                <span style={{ fontWeight: 800, color: 'var(--accent-green)' }}>
                  {summary.qosMetrics.errorRatePercentage}%
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Avg Player Startup Time:</span>
                <span style={{ fontWeight: 800, color: 'var(--accent-cyan)' }}>
                  {summary.qosMetrics.avgStartupTimeMs} ms
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>DRM Verification Latency:</span>
                <span style={{ fontWeight: 800, color: '#fff' }}>14 ms</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Catalog CMS Ingestion Form & Title List */}
      {activeTab === 'catalog' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
          {/* Add New Title Form */}
          <div className="glass-panel" style={{ padding: '28px', borderRadius: '18px', border: '1px solid var(--border-accent)' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={20} color="var(--accent-pink)" /> Ingest New VOD Title
            </h3>

            {formSuccess && (
              <div style={{ padding: '12px', background: 'rgba(0, 240, 118, 0.15)', color: '#00f076', borderRadius: '8px', marginBottom: '16px', fontWeight: 700 }}>
                ✓ Title successfully ingested into VOD catalog and ML embeddings retrained!
              </div>
            )}

            <form onSubmit={handleCreateTitle} className="responsive-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>TITLE</label>
                <input
                  type="text"
                  required
                  value={newTitle.title}
                  onChange={(e) => setNewTitle({ ...newTitle, title: e.target.value })}
                  placeholder="e.g. Interstellar Odyssey"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>CONTENT TYPE</label>
                <select
                  value={newTitle.type}
                  onChange={(e) => setNewTitle({ ...newTitle, type: e.target.value as any })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#12141d', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', marginTop: '4px' }}
                >
                  <option value="movie">Movie</option>
                  <option value="series">TV Series</option>
                </select>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>SYNOPSIS</label>
                <textarea
                  required
                  rows={2}
                  value={newTitle.synopsis}
                  onChange={(e) => setNewTitle({ ...newTitle, synopsis: e.target.value })}
                  placeholder="Full plot synopsis..."
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>POSTER IMAGE URL (2:3 PORTRAIT)</label>
                <input
                  type="text"
                  required
                  value={newTitle.posterUrl}
                  onChange={(e) => setNewTitle({ ...newTitle, posterUrl: e.target.value })}
                  placeholder="e.g. https://res.cloudinary.com/.../poster.jpg"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>BACKDROP HERO IMAGE URL (16:9 LANDSCAPE)</label>
                <input
                  type="text"
                  required
                  value={newTitle.backdropUrl}
                  onChange={(e) => setNewTitle({ ...newTitle, backdropUrl: e.target.value })}
                  placeholder="e.g. https://res.cloudinary.com/.../backdrop.jpg"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>RELEASE YEAR</label>
                <input
                  type="number"
                  value={newTitle.releaseYear}
                  onChange={(e) => setNewTitle({ ...newTitle, releaseYear: parseInt(e.target.value) || 2025 })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>DURATION (MINUTES)</label>
                <input
                  type="number"
                  value={newTitle.durationMinutes}
                  onChange={(e) => setNewTitle({ ...newTitle, durationMinutes: parseInt(e.target.value) || 90 })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>MATURITY RATING</label>
                <select
                  value={newTitle.rating}
                  onChange={(e) => setNewTitle({ ...newTitle, rating: e.target.value as any })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#12141d', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', marginTop: '4px' }}
                >
                  <option value="G">G (All Audiences)</option>
                  <option value="PG">PG (Parental Guidance)</option>
                  <option value="PG-13">PG-13 (Teens 13+)</option>
                  <option value="R">R (Restricted 17+)</option>
                  <option value="TV-MA">TV-MA (Mature Adults)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>ACCESS PLAN</label>
                <select
                  value={newTitle.accessTier}
                  onChange={(e) => setNewTitle({ ...newTitle, accessTier: e.target.value as any })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#12141d', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', marginTop: '4px' }}
                >
                  <option value="free">TubiStream Free (All Viewers)</option>
                  <option value="vip_premium">Tubi+ VIP Exclusive (Subscribers Only)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>IMDb SCORE (0.0 - 10.0)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="10"
                  value={newTitle.imdbScore}
                  onChange={(e) => setNewTitle({ ...newTitle, imdbScore: parseFloat(e.target.value) || 8.0 })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>GENRES (COMMA SEPARATED)</label>
                <input
                  type="text"
                  value={newTitle.genres}
                  onChange={(e) => setNewTitle({ ...newTitle, genres: e.target.value })}
                  placeholder="Action, Sci-Fi, Thriller"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>HLS STREAM URL (.m3u8 or .mp4)</label>
                <input
                  type="text"
                  required
                  value={newTitle.streamUrl}
                  onChange={(e) => setNewTitle({ ...newTitle, streamUrl: e.target.value })}
                  placeholder="https://res.cloudinary.com/.../stream.m3u8"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>DIRECTOR</label>
                <input
                  type="text"
                  value={newTitle.director}
                  onChange={(e) => setNewTitle({ ...newTitle, director: e.target.value })}
                  placeholder="e.g. Denis Villeneuve"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>CAST (COMMA SEPARATED)</label>
                <input
                  type="text"
                  value={newTitle.cast}
                  onChange={(e) => setNewTitle({ ...newTitle, cast: e.target.value })}
                  placeholder="Actor One, Actor Two"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', marginTop: '4px' }}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>AD BREAK CUE POINTS (SECONDS, COMMA SEPARATED)</label>
                <input
                  type="text"
                  value={newTitle.cuePointsSeconds}
                  onChange={(e) => setNewTitle({ ...newTitle, cuePointsSeconds: e.target.value })}
                  placeholder="300, 900, 1800"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', marginTop: '4px' }}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <button type="submit" className="btn-primary" style={{ padding: '12px 28px', fontWeight: 800 }}>
                  <Plus size={18} /> Ingest & Transcode Title
                </button>
              </div>
            </form>
          </div>

          {/* Catalog Titles Table */}
          <div className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'rgba(9, 10, 15, 0.95)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '16px' }}>POSTER</th>
                  <th style={{ padding: '16px' }}>TITLE</th>
                  <th style={{ padding: '16px' }}>TYPE</th>
                  <th style={{ padding: '16px' }}>GENRES</th>
                  <th style={{ padding: '16px' }}>RATING</th>
                  <th style={{ padding: '16px' }}>VIEWS</th>
                  <th style={{ padding: '16px' }}>ACCESS PLAN</th>
                  <th style={{ padding: '16px' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {titles.map((t) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <img src={t.posterUrl} alt={t.title} style={{ width: '38px', height: '54px', objectFit: 'cover', borderRadius: '4px' }} />
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: '#fff' }}>{t.title}</td>
                    <td style={{ padding: '12px 16px', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700 }}>
                      <span style={{ background: 'rgba(255,255,255,0.08)', padding: '3px 8px', borderRadius: '4px' }}>
                        {t.type}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{t.genres.join(', ')}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className="badge-rating">{t.rating}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--accent-green)' }}>
                      {t.totalViews.toLocaleString()}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        onClick={() => handleToggleTitleAccess(t.id, t.accessTier === 'vip_premium' ? 'free' : 'vip_premium')}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '5px 10px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          background: t.accessTier === 'vip_premium' ? 'rgba(255, 215, 0, 0.15)' : 'rgba(0, 240, 118, 0.12)',
                          border: t.accessTier === 'vip_premium' ? '1px solid rgba(255, 215, 0, 0.5)' : '1px solid rgba(0, 240, 118, 0.4)',
                          color: t.accessTier === 'vip_premium' ? '#ffd700' : '#00f076',
                          transition: 'all 0.15s ease'
                        }}
                        title="Click to toggle access plan between Free and VIP"
                      >
                        {t.accessTier === 'vip_premium' ? (
                          <>
                            <Crown size={12} /> VIP Exclusive
                          </>
                        ) : (
                          <>
                            <Check size={12} /> 100% Free
                          </>
                        )}
                      </button>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        onClick={() => handleDeleteTitle(t.id)}
                        style={{ color: '#ff2a6d', padding: '6px', borderRadius: '4px' }}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: FAST Live Channels Management */}
      {activeTab === 'fast' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* FAST Toast Notification */}
          {fastToast && (
            <div
              className="glass-panel animate-fade-in"
              style={{
                padding: '14px 20px',
                borderRadius: '12px',
                background: 'rgba(0, 240, 118, 0.15)',
                border: '1px solid var(--accent-green)',
                color: '#00f076',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Radio size={18} /> {fastToast}
              </div>
              <button
                onClick={() => setFastToast(null)}
                style={{ color: '#00f076', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* FAST Header & Control Bar */}
          <div
            className="glass-panel"
            style={{
              padding: '28px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '20px'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span
                  style={{
                    background: 'linear-gradient(135deg, #00f076 0%, #00b4d8 100%)',
                    color: '#000',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 900,
                    letterSpacing: '0.04em'
                  }}
                >
                  LINEAR BROADCAST CMS
                </span>
                <span style={{ color: '#00f076', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00f076', display: 'inline-block', boxShadow: '0 0 8px #00f076' }} />
                  24/7 EPG Clock Synced
                </span>
              </div>
              <h2 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#fff', marginBottom: '6px' }}>
                Live FAST TV Channel Operations
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '680px' }}>
                Broadcast live HLS linear streams, configure channel numbering, curate rolling 24-hour EPG schedules, and monitor on-air playback in real time.
              </p>
            </div>

            <button
              onClick={() => setIsAddChannelOpen(!isAddChannelOpen)}
              className="btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 22px',
                fontSize: '0.92rem',
                fontWeight: 800,
                background: isAddChannelOpen ? 'rgba(255,255,255,0.1)' : 'var(--accent-gradient)'
              }}
            >
              {isAddChannelOpen ? <X size={18} /> : <Plus size={18} />}
              {isAddChannelOpen ? 'Close Ingestion Form' : 'Broadcast New FAST Channel'}
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="glass-panel" style={{ padding: '18px 22px', borderRadius: '14px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px' }}>
                ACTIVE LIVE CHANNELS
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff' }}>
                {channels.length}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#00f076', marginTop: '4px', fontWeight: 700 }}>
                ● 100% Broadcast Uptime
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '18px 22px', borderRadius: '14px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px' }}>
                BROADCAST PROTOCOLS
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#00b4d8' }}>
                HLS / DASH
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Low-latency adaptive bitrate
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '18px 22px', borderRadius: '14px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px' }}>
                EPG PROGRAMMING SLOTS
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffd700' }}>
                {channels.reduce((acc, c) => acc + (c.schedule?.length || 0), 0)} Slots
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                6-hr rolling window per channel
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '18px 22px', borderRadius: '14px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px' }}>
                NEXT CHANNEL NUMBER
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent-pink)' }}>
                CH {channels.length > 0 ? Math.max(...channels.map(c => c.channelNumber || 100)) + 1 : 101}
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Auto-assigned sequentially
              </div>
            </div>
          </div>

          {/* Collapsible FAST Channel Ingestion Form */}
          {isAddChannelOpen && (
            <form
              onSubmit={handleCreateFastChannel}
              className="glass-panel animate-fade-in"
              style={{
                padding: '28px',
                borderRadius: '20px',
                border: '1px solid rgba(0, 240, 118, 0.4)',
                background: 'rgba(9, 10, 15, 0.95)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                    New FAST Channel Broadcast Ingestion
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem' }}>
                    Configure the live linear transmission stream, channel metadata, and broadcast schedule.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', alignSelf: 'center', marginRight: '4px' }}>
                    Quick HLS Presets:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setNewChannel(prev => ({
                        ...prev,
                        name: 'NASA TV Live HD',
                        category: 'Documentary',
                        streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
                        logoUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200&auto=format&fit=crop&q=80',
                        description: 'Official 24/7 space exploration, deep astronomy missions, and rocket launches.'
                      }));
                    }}
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    🚀 NASA Live
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewChannel(prev => ({
                        ...prev,
                        name: 'Tubi CineVault HD',
                        category: 'Movies',
                        streamUrl: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
                        logoUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=200&auto=format&fit=crop&q=80',
                        description: '24/7 curated indie masterpieces, festival winners, and Hollywood cinema classics.'
                      }));
                    }}
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    🎬 CineVault
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewChannel(prev => ({
                        ...prev,
                        name: 'Action Velocity TV',
                        category: 'Action',
                        streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
                        logoUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&auto=format&fit=crop&q=80',
                        description: 'Non-stop high-octane car chases, martial arts combat, and explosive blockbusters.'
                      }));
                    }}
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    🔥 Action Velocity
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                {/* Channel Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                    Channel Display Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tubi Crime & Noir 24/7"
                    value={newChannel.name}
                    onChange={(e) => setNewChannel({ ...newChannel, name: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.9rem' }}
                  />
                </div>

                {/* Channel Number */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                    Channel Position (EPG Number) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={999}
                    value={newChannel.channelNumber}
                    onChange={(e) => setNewChannel({ ...newChannel, channelNumber: parseInt(e.target.value) || 101 })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.9rem' }}
                  />
                </div>

                {/* Category */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                    Programming Category *
                  </label>
                  <select
                    value={newChannel.category}
                    onChange={(e) => setNewChannel({ ...newChannel, category: e.target.value as any })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: '#12141d', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.9rem' }}
                  >
                    <option value="Action">Action</option>
                    <option value="Movies">Movies & Cinema</option>
                    <option value="Sci-Fi">Sci-Fi & Fantasy</option>
                    <option value="Comedy">Comedy & Sitcoms</option>
                    <option value="News">Live 24/7 News</option>
                    <option value="Documentary">Documentary & Nature</option>
                    <option value="Sports">Sports & Extreme</option>
                    <option value="Anime">Anime & Animation</option>
                    <option value="Kids">Kids & Family</option>
                  </select>
                </div>

                {/* Logo URL */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                    Channel Logo Artwork URL
                  </label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={newChannel.logoUrl}
                      onChange={(e) => setNewChannel({ ...newChannel, logoUrl: e.target.value })}
                      style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.9rem' }}
                    />
                    {newChannel.logoUrl && (
                      <img
                        src={newChannel.logoUrl}
                        alt="Logo Preview"
                        style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.2)' }}
                      />
                    )}
                  </div>
                </div>

                {/* Live Stream URL */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                    Live HLS / DASH Streaming Manifest URL (.m3u8) *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8"
                    value={newChannel.streamUrl}
                    onChange={(e) => setNewChannel({ ...newChannel, streamUrl: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#00f076', fontFamily: 'monospace', fontSize: '0.86rem' }}
                  />
                </div>

                {/* Description */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                    Channel Slogan & Synopsis
                  </label>
                  <input
                    type="text"
                    placeholder="Brief description of programming broadcast on this channel"
                    value={newChannel.description}
                    onChange={(e) => setNewChannel({ ...newChannel, description: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddChannelOpen(false)}
                  className="btn-secondary"
                  style={{ padding: '10px 20px', fontSize: '0.88rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    padding: '10px 24px',
                    fontSize: '0.92rem',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #00f076 0%, #00b4d8 100%)',
                    color: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Radio size={16} /> Broadcast & Launch Channel 📡
                </button>
              </div>
            </form>
          )}

          {/* Filter Bar & Search */}
          <div
            className="glass-panel"
            style={{
              padding: '16px 20px',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap'
            }}
          >
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1 1 260px' }}>
              <Search
                size={16}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              />
              <input
                type="text"
                placeholder="Search channels by name, category, or CH number..."
                value={fastSearchQuery}
                onChange={(e) => setFastSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#fff',
                  fontSize: '0.88rem'
                }}
              />
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['all', 'Action', 'Movies', 'Sci-Fi', 'Comedy', 'News', 'Documentary'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFastCategoryFilter(cat)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: fastCategoryFilter === cat ? '#00f076' : 'rgba(255,255,255,0.06)',
                    color: fastCategoryFilter === cat ? '#000' : 'var(--text-secondary)',
                    border: 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat === 'all' ? `All (${channels.length})` : cat}
                </button>
              ))}
            </div>
          </div>

          {/* FAST Channels Broadcast Table */}
          <div className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'rgba(9, 10, 15, 0.95)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '16px' }}>CHANNEL</th>
                  <th style={{ padding: '16px' }}>NAME & SYNOPSIS</th>
                  <th style={{ padding: '16px' }}>CATEGORY</th>
                  <th style={{ padding: '16px' }}>ON AIR PROGRAM</th>
                  <th style={{ padding: '16px' }}>LIVE STREAM</th>
                  <th style={{ padding: '16px' }}>STATUS</th>
                  <th style={{ padding: '16px', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {channels
                  .filter((c) => {
                    const matchesSearch =
                      c.name.toLowerCase().includes(fastSearchQuery.toLowerCase()) ||
                      c.category.toLowerCase().includes(fastSearchQuery.toLowerCase()) ||
                      c.channelNumber.toString().includes(fastSearchQuery);
                    const matchesCategory =
                      fastCategoryFilter === 'all' ||
                      c.category.toLowerCase() === fastCategoryFilter.toLowerCase();
                    return matchesSearch && matchesCategory;
                  })
                  .map((chan) => (
                    <tr
                      key={chan.id}
                      style={{
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      {/* Logo & CH Number */}
                      <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={chan.logoUrl}
                            alt={chan.name}
                            style={{ width: '46px', height: '46px', borderRadius: '8px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.15)' }}
                          />
                          <span
                            style={{
                              background: 'rgba(0, 240, 118, 0.15)',
                              border: '1px solid rgba(0, 240, 118, 0.3)',
                              color: '#00f076',
                              fontWeight: 900,
                              fontSize: '0.82rem',
                              padding: '3px 8px',
                              borderRadius: '6px'
                            }}
                          >
                            CH {chan.channelNumber}
                          </span>
                        </div>
                      </td>

                      {/* Name & Synopsis */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.94rem' }}>
                          {chan.name}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '2px', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {chan.description}
                        </div>
                      </td>

                      {/* Category */}
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            background: 'rgba(255, 42, 109, 0.12)',
                            color: '#ff2a6d',
                            border: '1px solid rgba(255, 42, 109, 0.25)',
                            padding: '3px 9px',
                            borderRadius: '5px',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            textTransform: 'uppercase'
                          }}
                        >
                          {chan.category}
                        </span>
                      </td>

                      {/* Current Program */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ color: '#cbd5e1', fontWeight: 700, fontSize: '0.84rem' }}>
                          {chan.currentProgram?.title || 'Live 24/7 Stream'}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '1px' }}>
                          {chan.currentProgram?.rating ? `${chan.currentProgram.rating} • ` : ''} 60m Block
                        </div>
                      </td>

                      {/* Live Stream URL & Copy */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontSize: '0.74rem',
                              color: '#00f076',
                              background: 'rgba(0, 240, 118, 0.08)',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              maxWidth: '160px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            HLS (.m3u8)
                          </span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(chan.streamUrl);
                              setCopiedStreamId(chan.id);
                              setTimeout(() => setCopiedStreamId(null), 2000);
                            }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px' }}
                            title="Copy Live Stream URL"
                          >
                            {copiedStreamId === chan.id ? <Check size={14} color="#00f076" /> : <Copy size={14} />}
                          </button>
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: '#00f076',
                            fontSize: '0.76rem',
                            fontWeight: 800
                          }}
                        >
                          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#00f076', boxShadow: '0 0 6px #00f076' }} />
                          ON AIR
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          {/* Test Stream Button */}
                          <button
                            onClick={() => setPreviewChannel(chan)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              background: 'rgba(0, 240, 118, 0.12)',
                              border: '1px solid rgba(0, 240, 118, 0.3)',
                              color: '#00f076',
                              padding: '5px 10px',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                            title="Test & Preview Live Stream"
                          >
                            <Play size={12} fill="#00f076" /> Preview
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => setEditingChannel(chan)}
                            style={{
                              background: 'rgba(255,255,255,0.06)',
                              border: '1px solid rgba(255,255,255,0.15)',
                              color: '#fff',
                              padding: '5px 8px',
                              borderRadius: '6px',
                              cursor: 'pointer'
                            }}
                            title="Edit Channel Details"
                          >
                            <Edit3 size={14} />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteFastChannel(chan.id, chan.name)}
                            style={{
                              background: 'rgba(255, 42, 109, 0.1)',
                              border: '1px solid rgba(255, 42, 109, 0.3)',
                              color: '#ff2a6d',
                              padding: '5px 8px',
                              borderRadius: '6px',
                              cursor: 'pointer'
                            }}
                            title="Delete FAST Channel"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Live Stream Tester Modal */}
          {previewChannel && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.85)',
                backdropFilter: 'blur(10px)',
                zIndex: 2500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px'
              }}
              onClick={() => setPreviewChannel(null)}
            >
              <div
                className="glass-panel animate-fade-in"
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: '100%',
                  maxWidth: '720px',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  background: '#090a0f',
                  border: '1px solid rgba(0, 240, 118, 0.4)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.9)'
                }}
              >
                {/* Modal Header */}
                <div
                  style={{
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={previewChannel.logoUrl}
                      alt={previewChannel.name}
                      style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.98rem' }}>
                        {previewChannel.name} (CH {previewChannel.channelNumber})
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#00f076', fontWeight: 700 }}>
                        ● Live Linear Stream Preview • {previewChannel.category}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setPreviewChannel(null)}
                    style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '6px' }}
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Video Player */}
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000' }}>
                  <video
                    src={previewChannel.streamUrl}
                    controls
                    autoPlay
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>

                {/* Modal Footer Info */}
                <div style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Stream URL: <span style={{ fontFamily: 'monospace', color: '#00f076' }}>{previewChannel.streamUrl}</span>
                  </div>
                  <button
                    onClick={() => setPreviewChannel(null)}
                    className="btn-secondary"
                    style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Channel Modal */}
          {editingChannel && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.85)',
                backdropFilter: 'blur(10px)',
                zIndex: 2500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px'
              }}
              onClick={() => setEditingChannel(null)}
            >
              <div
                className="glass-panel animate-fade-in"
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: '100%',
                  maxWidth: '580px',
                  borderRadius: '20px',
                  padding: '28px',
                  background: '#090a0f',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.9)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                    Edit FAST Channel: {editingChannel.name}
                  </h3>
                  <button
                    onClick={() => setEditingChannel(null)}
                    style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                      Channel Name
                    </label>
                    <input
                      type="text"
                      value={editingChannel.name}
                      onChange={(e) => setEditingChannel({ ...editingChannel, name: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div className="responsive-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                        Channel Number
                      </label>
                      <input
                        type="number"
                        value={editingChannel.channelNumber}
                        onChange={(e) => setEditingChannel({ ...editingChannel, channelNumber: parseInt(e.target.value) || editingChannel.channelNumber })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.9rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                        Category
                      </label>
                      <select
                        value={editingChannel.category}
                        onChange={(e) => setEditingChannel({ ...editingChannel, category: e.target.value as any })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: '#12141d', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.9rem' }}
                      >
                        <option value="Action">Action</option>
                        <option value="Movies">Movies & Cinema</option>
                        <option value="Sci-Fi">Sci-Fi & Fantasy</option>
                        <option value="Comedy">Comedy & Sitcoms</option>
                        <option value="News">Live 24/7 News</option>
                        <option value="Documentary">Documentary & Nature</option>
                        <option value="Sports">Sports & Extreme</option>
                        <option value="Anime">Anime & Animation</option>
                        <option value="Kids">Kids & Family</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                      Stream URL (.m3u8)
                    </label>
                    <input
                      type="url"
                      value={editingChannel.streamUrl}
                      onChange={(e) => setEditingChannel({ ...editingChannel, streamUrl: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#00f076', fontFamily: 'monospace', fontSize: '0.86rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                      Logo URL
                    </label>
                    <input
                      type="url"
                      value={editingChannel.logoUrl}
                      onChange={(e) => setEditingChannel({ ...editingChannel, logoUrl: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                      Description
                    </label>
                    <input
                      type="text"
                      value={editingChannel.description}
                      onChange={(e) => setEditingChannel({ ...editingChannel, description: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setEditingChannel(null)}
                    className="btn-secondary"
                    style={{ padding: '8px 18px', fontSize: '0.86rem' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateFastChannel(editingChannel.id, editingChannel)}
                    className="btn-primary"
                    style={{ padding: '8px 20px', fontSize: '0.88rem', fontWeight: 800 }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Ad Engine Management & Controls */}
      {activeTab === 'ads' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Ad Toast Notification */}
          {adToast && (
            <div
              className="glass-panel animate-fade-in"
              style={{
                padding: '14px 20px',
                borderRadius: '12px',
                background: 'rgba(0, 240, 118, 0.15)',
                border: '1px solid var(--accent-green)',
                color: '#00f076',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <Check size={18} /> {adToast}
            </div>
          )}

          {/* Ad Engine Global Delivery Controls */}
          <div className="glass-panel" style={{ padding: '28px', borderRadius: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sliders size={22} color="var(--accent-pink)" />
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                  Global Ad Engine Delivery Rules & Pod Controls
                </h3>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                SSAI & CSAI ENGINE: LIVE
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              {/* Pre-roll Toggle */}
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '18px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.95rem' }}>Pre-Roll Ads (0:00)</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Play ad before stream start</div>
                </div>
                <button
                  onClick={() => handleUpdateAdConfig({ prerollEnabled: !adConfig.prerollEnabled })}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: adConfig.prerollEnabled ? 'var(--accent-green)' : 'var(--text-muted)' }}
                >
                  {adConfig.prerollEnabled ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
                </button>
              </div>

              {/* Mid-roll Toggle */}
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '18px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.95rem' }}>Mid-Roll Breaks</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Insert ads at title cue points</div>
                </div>
                <button
                  onClick={() => handleUpdateAdConfig({ midrollEnabled: !adConfig.midrollEnabled })}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: adConfig.midrollEnabled ? 'var(--accent-green)' : 'var(--text-muted)' }}
                >
                  {adConfig.midrollEnabled ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
                </button>
              </div>

              {/* Shoppable Pause Ads Toggle */}
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '18px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.95rem' }}>Shoppable Pause Ads</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Show QR cards on player pause</div>
                </div>
                <button
                  onClick={() => handleUpdateAdConfig({ pauseAdsEnabled: !adConfig.pauseAdsEnabled })}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: adConfig.pauseAdsEnabled ? 'var(--accent-green)' : 'var(--text-muted)' }}
                >
                  {adConfig.pauseAdsEnabled ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
                </button>
              </div>

              {/* VIP Ad-Free Bypass */}
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '18px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 800, color: '#ffd700', fontSize: '0.95rem' }}>VIP Ad-Free Bypass</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Zero ads for paid subscribers</div>
                </div>
                <button
                  onClick={() => handleUpdateAdConfig({ vipAdFreeBypass: !adConfig.vipAdFreeBypass })}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: adConfig.vipAdFreeBypass ? '#ffd700' : 'var(--text-muted)' }}
                >
                  {adConfig.vipAdFreeBypass ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
                </button>
              </div>

              {/* Max Ads Per Pod */}
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '18px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.95rem' }}>Max Ads per Pod</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Consecutive ads per break</div>
                </div>
                <select
                  value={adConfig.maxAdsPerBreak}
                  onChange={(e) => handleUpdateAdConfig({ maxAdsPerBreak: Number(e.target.value) })}
                  style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: '8px', fontWeight: 700 }}
                >
                  <option value={1} style={{ background: '#111' }}>1 Ad (Standard)</option>
                  <option value={2} style={{ background: '#111' }}>2 Ads (Double Pod)</option>
                </select>
              </div>

              {/* Min Mid-roll Interval */}
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '18px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.95rem' }}>Min Mid-roll Spacing</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Frequency between breaks</div>
                </div>
                <select
                  value={adConfig.minMidrollIntervalMinutes}
                  onChange={(e) => handleUpdateAdConfig({ minMidrollIntervalMinutes: Number(e.target.value) })}
                  style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: '8px', fontWeight: 700 }}
                >
                  <option value={5} style={{ background: '#111' }}>5 Minutes</option>
                  <option value={10} style={{ background: '#111' }}>10 Minutes</option>
                  <option value={15} style={{ background: '#111' }}>15 Minutes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Create New Ad Creative Campaign Form */}
          <div className="glass-panel" style={{ padding: '28px', borderRadius: '18px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={20} color="var(--accent-pink)" /> Create & Schedule New Ad Campaign
            </h3>

            <form onSubmit={handleCreateAd} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>ADVERTISER NAME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nike, Apple, Sony"
                  value={newAd.advertiserName}
                  onChange={(e) => setNewAd({ ...newAd, advertiserName: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>CREATIVE TITLE</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer Pulse 2026"
                  value={newAd.title}
                  onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>CATEGORY / GENRE</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Entertainment, Automotive, Tech"
                  value={newAd.category}
                  onChange={(e) => setNewAd({ ...newAd, category: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>DURATION (SECONDS)</label>
                <select
                  value={newAd.durationSeconds}
                  onChange={(e) => setNewAd({ ...newAd, durationSeconds: Number(e.target.value) })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', marginTop: '4px' }}
                >
                  <option value={15} style={{ background: '#111' }}>15s Spot</option>
                  <option value={30} style={{ background: '#111' }}>30s Spot</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>FLOOR CPM ($)</label>
                <input
                  type="number"
                  step="0.50"
                  required
                  value={newAd.cpm}
                  onChange={(e) => setNewAd({ ...newAd, cpm: parseFloat(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', marginTop: '4px' }}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>VIDEO MEDIA STREAM URL (.m3u8 / .mp4)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8 or https://cdn.example.com/ad.mp4"
                  value={newAd.videoUrl}
                  onChange={(e) => setNewAd({ ...newAd, videoUrl: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', marginTop: '4px' }}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Code size={13} color="var(--accent-cyan)" />
                  VAST 4.2 / 3.0 TAG ENDPOINT URL (OPTIONAL / SSP AD SERVER)
                </label>
                <input
                  type="text"
                  placeholder="e.g. https://securepubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/1234/ad_unit&output=vast"
                  value={newAd.vastTagUrl}
                  onChange={(e) => setNewAd({ ...newAd, vastTagUrl: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', marginTop: '4px' }}
                />
                <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', display: 'block', marginTop: '4px' }}>
                  Optional: Paste third-party programmatic SSP / DSP VAST XML tag URL (Google Ad Manager, FreeWheel, SpringServe, Magnite). If left empty, TubiStream serves native SSAI VAST 4.2 XML.
                </span>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>CLICK-THROUGH DESTINATION URL</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. https://www.advertiser.com/landing-page"
                  value={newAd.clickThroughUrl}
                  onChange={(e) => setNewAd({ ...newAd, clickThroughUrl: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', marginTop: '4px' }}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <button type="submit" className="btn-primary" style={{ padding: '12px 28px', fontWeight: 800 }}>
                  <Plus size={18} /> Deploy Ad Campaign
                </button>
              </div>
            </form>
          </div>

          {/* Ad Inventory Table */}
          <div className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                Active Ad Inventory & Campaign Status ({ads.length})
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-green)', fontWeight: 700 }}>
                ● Real-Time IAB VAST 4.2 Endpoints Active
              </span>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'rgba(9, 10, 15, 0.95)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '16px' }}>ADVERTISER & TITLE</th>
                  <th style={{ padding: '16px' }}>CATEGORY</th>
                  <th style={{ padding: '16px' }}>DURATION</th>
                  <th style={{ padding: '16px' }}>FLOOR CPM</th>
                  <th style={{ padding: '16px' }}>DELIVERY STATUS</th>
                  <th style={{ padding: '16px' }}>VAST 4.2 XML</th>
                  <th style={{ padding: '16px' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {ads.map((ad) => {
                  const isEditing = editingCpmId === ad.id;
                  const isActive = ad.status !== 'paused';
                  return (
                    <tr key={ad.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 800, color: '#fff' }}>{ad.advertiserName}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{ad.title}</div>
                        {ad.vastTagUrl && (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.68rem', color: 'var(--accent-cyan)', background: 'rgba(5, 217, 232, 0.12)', padding: '2px 6px', borderRadius: '4px', marginTop: '4px' }}>
                            <ExternalLink size={10} /> Custom VAST Tag
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>{ad.category}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 700 }}>{ad.durationSeconds}s</td>
                      <td style={{ padding: '14px 16px' }}>
                        {isEditing ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <input
                              type="number"
                              step="0.50"
                              value={cpmInput}
                              onChange={(e) => setCpmInput(e.target.value)}
                              style={{ width: '80px', padding: '4px 8px', borderRadius: '6px', background: '#222', border: '1px solid #ffd700', color: '#fff' }}
                            />
                            <button
                              onClick={() => handleSaveCpm(ad.id)}
                              style={{ padding: '4px 8px', background: '#ffd700', color: '#000', borderRadius: '6px', fontWeight: 700 }}
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingCpmId(null)}
                              style={{ padding: '4px 8px', color: 'var(--text-muted)' }}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              setEditingCpmId(ad.id);
                              setCpmInput(ad.cpm.toString());
                            }}
                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: '#ffd700', fontWeight: 800 }}
                            title="Click to edit CPM"
                          >
                            ${ad.cpm.toFixed(2)} <Edit3 size={13} color="var(--text-muted)" />
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <button
                          onClick={() => handleToggleAdStatus(ad.id)}
                          style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer',
                            background: isActive ? 'rgba(0, 240, 118, 0.15)' : 'rgba(255, 170, 0, 0.15)',
                            color: isActive ? 'var(--accent-green)' : '#ffa500',
                            border: isActive ? '1px solid rgba(0, 240, 118, 0.3)' : '1px solid rgba(255, 170, 0, 0.3)'
                          }}
                        >
                          {isActive ? <Play size={12} /> : <Pause size={12} />}
                          {isActive ? 'ACTIVE' : 'PAUSED'}
                        </button>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            onClick={() => handleCopyVastUrl(ad.id)}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '6px',
                              background: 'rgba(255,255,255,0.06)',
                              color: copiedVastId === ad.id ? 'var(--accent-green)' : '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 700
                            }}
                            title="Copy VAST 4.2 Endpoint URL"
                          >
                            {copiedVastId === ad.id ? <Check size={14} /> : <Copy size={14} />}
                            VAST URL
                          </button>
                          <button
                            onClick={() => handlePreviewVast(ad.id)}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '6px',
                              background: 'rgba(255,255,255,0.06)',
                              color: 'var(--accent-cyan)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 700
                            }}
                            title="Inspect Raw VAST XML"
                          >
                            <Code size={14} /> Inspect
                          </button>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <button
                          onClick={() => handleDeleteAd(ad.id)}
                          style={{ color: '#ff2a6d', padding: '6px', borderRadius: '4px' }}
                          title="Delete Ad"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Plans & Subscriber Controls */}
      {activeTab === 'plans' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Toast Notification */}
          {planToast && (
            <div
              className="glass-heavy animate-fade-in"
              style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                zIndex: 3000,
                padding: '12px 20px',
                borderRadius: '10px',
                background: 'rgba(16, 18, 26, 0.95)',
                border: '1px solid #ffd700',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
              }}
            >
              <Crown size={18} color="#ffd700" />
              <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{planToast}</span>
            </div>
          )}

          {/* Quick Metrics Bar */}
          {(() => {
            const freeCount = usersList.filter(u => u.tier !== 'vip_premium').length;
            const vipCount = usersList.filter(u => u.tier === 'vip_premium').length;
            const vipPlan = planSettings?.plans.find(p => p.id === 'vip_premium');
            const estMrr = (vipCount * (vipPlan?.monthlyPrice || 5.99)).toFixed(2);

            return (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '16px'
                }}
              >
                <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px' }}>
                    REGISTERED SUBSCRIBERS
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff' }}>
                    {usersList.length}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Total user accounts in system
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px' }}>
                    TUBISTREAM FREE VIEWERS
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#00f076' }}>
                    {freeCount}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#00f076', marginTop: '4px' }}>
                    Ad-Supported Streaming Active
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px' }}>
                    TUBI+ VIP PREMIUM MEMBERS
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffd700' }}>
                    {vipCount}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#ffd700', marginTop: '4px' }}>
                    100% Ad-Free 4K Cinema Pass
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px' }}>
                    ESTIMATED RECURRING REVENUE
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#9d4edd' }}>
                    ${estMrr} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ mo</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Based on ${vipPlan?.monthlyPrice || 5.99}/mo VIP rate
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Plan Settings Hub: Edit Free vs VIP Rules */}
          {planSettings && (
            <div className="glass-panel" style={{ padding: '28px', borderRadius: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sliders size={20} color="#9d4edd" /> Platform Plan & Feature Configuration
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginTop: '4px' }}>
                    Control commercial ad insertion, 4K quality caps, offline download permissions, and pricing for each tier.
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '24px' }}>
                {/* Free Plan Card */}
                {(() => {
                  const freePlan = planSettings.plans.find(p => p.id === 'free') || planSettings.plans[0];
                  return (
                    <div
                      style={{
                        padding: '24px',
                        borderRadius: '16px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(0, 240, 118, 0.3)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#00f076', background: 'rgba(0, 240, 118, 0.15)', padding: '3px 8px', borderRadius: '4px' }}>
                            DEFAULT TIER
                          </span>
                          <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
                            {freePlan.name}
                          </h4>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#00f076' }}>$0.00</span>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Forever Free</div>
                        </div>
                      </div>

                      <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }} />

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>Commercial Ad Breaks</span>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#00f076', background: 'rgba(0, 240, 118, 0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                            Enabled (Pre-roll & Mid-roll)
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>Maximum Resolution Cap</span>
                          <select
                            value={freePlan.maxResolution}
                            onChange={(e) => {
                              const updatedPlans = planSettings.plans.map(p =>
                                p.id === 'free' ? { ...p, maxResolution: e.target.value as any } : p
                              );
                              handleSavePlans({ plans: updatedPlans });
                            }}
                            style={{ background: '#12141d', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem' }}
                          >
                            <option value="720p">720p HD</option>
                            <option value="1080p">1080p Full HD</option>
                          </select>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>Concurrent Streams</span>
                          <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#fff' }}>2 Devices</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>Offline Downloads</span>
                          <span style={{ fontSize: '0.8rem', color: '#ff2a6d', fontWeight: 600 }}>VIP Exclusive Only</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* VIP Premium Plan Card */}
                {(() => {
                  const vipPlan = planSettings.plans.find(p => p.id === 'vip_premium') || planSettings.plans[1];
                  return (
                    <div
                      style={{
                        padding: '24px',
                        borderRadius: '16px',
                        background: 'rgba(255, 215, 0, 0.03)',
                        border: '1px solid rgba(255, 215, 0, 0.4)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ffd700', background: 'rgba(255, 215, 0, 0.15)', padding: '3px 8px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Crown size={11} /> VIP PREMIUM TIER
                          </span>
                          <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffd700', marginTop: '6px' }}>
                            {vipPlan.name}
                          </h4>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffd700' }}>
                            ${vipPlan.monthlyPrice}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/mo</span>
                        </div>
                      </div>

                      <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }} />

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {/* Price Editors */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <div>
                            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>MONTHLY PRICE ($)</label>
                            <input
                              type="number"
                              step="0.5"
                              value={vipPlan.monthlyPrice}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                const updatedPlans = planSettings.plans.map(p =>
                                  p.id === 'vip_premium' ? { ...p, monthlyPrice: val } : p
                                );
                                setPlanSettings({ ...planSettings, plans: updatedPlans });
                              }}
                              style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,215,0,0.3)', color: '#ffd700', fontWeight: 700, marginTop: '3px' }}
                            />
                          </div>

                          <div>
                            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>ANNUAL PRICE ($)</label>
                            <input
                              type="number"
                              step="1"
                              value={vipPlan.annualPrice}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                const updatedPlans = planSettings.plans.map(p =>
                                  p.id === 'vip_premium' ? { ...p, annualPrice: val } : p
                                );
                                setPlanSettings({ ...planSettings, plans: updatedPlans });
                              }}
                              style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,215,0,0.3)', color: '#ffd700', fontWeight: 700, marginTop: '3px' }}
                            />
                          </div>
                        </div>

                        {/* Perks Toggles */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>100% Ad-Free Bypass</span>
                          <button
                            onClick={() => {
                              const updatedPlans = planSettings.plans.map(p =>
                                p.id === 'vip_premium' ? { ...p, adSupported: !p.adSupported } : p
                              );
                              handleSavePlans({ plans: updatedPlans });
                            }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: !vipPlan.adSupported ? '#00f076' : 'var(--text-muted)' }}
                          >
                            {!vipPlan.adSupported ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                          </button>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>4K Ultra HD & HDR Support</span>
                          <button
                            onClick={() => {
                              const updatedPlans = planSettings.plans.map(p =>
                                p.id === 'vip_premium' ? { ...p, maxResolution: (p.maxResolution === '4K' ? '1080p' : '4K') as '720p' | '1080p' | '4K' } : p
                              );
                              handleSavePlans({ plans: updatedPlans });
                            }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: vipPlan.maxResolution === '4K' ? '#00f076' : 'var(--text-muted)' }}
                          >
                            {vipPlan.maxResolution === '4K' ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                          </button>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>Offline Video Downloads</span>
                          <button
                            onClick={() => {
                              const updatedPlans = planSettings.plans.map(p =>
                                p.id === 'vip_premium' ? { ...p, downloadsEnabled: !p.downloadsEnabled } : p
                              );
                              handleSavePlans({ plans: updatedPlans });
                            }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: vipPlan.downloadsEnabled ? '#00f076' : 'var(--text-muted)' }}
                          >
                            {vipPlan.downloadsEnabled ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                          </button>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>Dolby Atmos Spatial Audio</span>
                          <button
                            onClick={() => {
                              const updatedPlans = planSettings.plans.map(p =>
                                p.id === 'vip_premium' ? { ...p, audioQuality: (p.audioQuality === 'Dolby Atmos' ? '5.1 Surround' : 'Dolby Atmos') as 'Stereo' | '5.1 Surround' | 'Dolby Atmos' } : p
                              );
                              handleSavePlans({ plans: updatedPlans });
                            }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: vipPlan.audioQuality === 'Dolby Atmos' ? '#00f076' : 'var(--text-muted)' }}
                          >
                            {vipPlan.audioQuality === 'Dolby Atmos' ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                          </button>
                        </div>

                        <button
                          onClick={() => handleSavePlans({ plans: planSettings.plans })}
                          className="btn-primary"
                          style={{
                            marginTop: '6px',
                            background: 'linear-gradient(135deg, #ffd700 0%, #ff8800 100%)',
                            color: '#000',
                            fontWeight: 800,
                            padding: '9px 16px',
                            fontSize: '0.84rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                          }}
                        >
                          <Check size={14} /> Save VIP Pricing & Rule Changes
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Subscription Payment Methods & Gateway Control */}
          <div className="glass-panel" style={{ borderRadius: '18px', overflow: 'hidden', padding: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CreditCard size={20} color="#ffd700" />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                    Subscription Payment Gateways & Methods
                  </h3>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#00f076', background: 'rgba(0, 240, 118, 0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                    {paymentMethodsList.filter(m => m.isEnabled).length} ACTIVE CHANNELS
                  </span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginTop: '2px' }}>
                  Manage payment gateways available to viewers during VIP checkout. Toggle methods on/off or add new custom payment providers.
                </p>
              </div>

              <button
                onClick={() => setIsAddMethodOpen(true)}
                className="btn-primary"
                style={{
                  background: 'linear-gradient(135deg, #ffd700 0%, #ff8800 100%)',
                  color: '#000',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  padding: '9px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Plus size={16} /> Add Payment Method
              </button>
            </div>

            {/* Methods Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {paymentMethodsList.map((m) => {
                const getMethodIcon = () => {
                  if (m.category === 'card') return <CreditCard size={20} color="#60a5fa" />;
                  if (m.category === 'mobile_money') return <Smartphone size={20} color="#ffaa00" />;
                  if (m.category === 'wallet') return <Wallet size={20} color="#008cff" />;
                  if (m.category === 'bank') return <Landmark size={20} color="#00f076" />;
                  if (m.category === 'crypto') return <Coins size={20} color="#ffd700" />;
                  return <Globe size={20} color="#9d4edd" />;
                };

                return (
                  <div
                    key={m.id}
                    style={{
                      padding: '18px',
                      borderRadius: '14px',
                      background: m.isEnabled ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.015)',
                      border: m.isEnabled ? '1px solid rgba(255, 215, 0, 0.25)' : '1px solid rgba(255, 255, 255, 0.07)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)' }}>
                            {getMethodIcon()}
                          </div>
                          <div>
                            <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                              {m.name}
                            </h4>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                              {m.category.replace('_', ' ')}
                            </span>
                          </div>
                        </div>

                        {m.badge && (
                          <span style={{ fontSize: '0.70rem', background: 'rgba(255,215,0,0.15)', color: '#ffd700', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                            {m.badge}
                          </span>
                        )}
                      </div>

                      <p style={{ fontSize: '0.80rem', color: 'var(--text-secondary)', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                        {m.description}
                      </p>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' }}>
                        {m.supportedCurrencies.map((cur) => (
                          <span key={cur} style={{ fontSize: '0.68rem', background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)', padding: '2px 6px', borderRadius: '3px', fontWeight: 600 }}>
                            {cur}
                          </span>
                        ))}
                      </div>

                      {m.providers && m.providers.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {m.providers.map(p => (
                            <span key={p.id} style={{ fontSize: '0.68rem', background: 'rgba(255,255,255,0.04)', color: p.color || '#fff', border: `1px solid ${p.color || 'rgba(255,255,255,0.2)'}`, padding: '1px 5px', borderRadius: '3px', fontWeight: 600 }}>
                              {p.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
                      <button
                        onClick={() => handleTogglePaymentMethod(m.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: m.isEnabled ? '#00f076' : 'var(--text-muted)',
                          fontSize: '0.78rem',
                          fontWeight: 700
                        }}
                      >
                        {m.isEnabled ? <ToggleRight size={26} /> : <ToggleLeft size={26} />}
                        {m.isEnabled ? 'Live on Checkout' : 'Disabled'}
                      </button>

                      {!['card', 'mobile_money'].includes(m.id) && (
                        <button
                          onClick={() => handleDeletePaymentMethod(m.id, m.name)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--accent-pink)',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '4px'
                          }}
                          title="Delete custom method"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* User Subscriber Manager Table */}
          <div className="glass-panel" style={{ borderRadius: '18px', overflow: 'hidden', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={20} color="var(--accent-pink)" /> Subscriber Directory & Plan Assignment
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginTop: '2px' }}>
                  Manage individual user subscription plans. 1-click upgrade to VIP or downgrade to Free.
                </p>
              </div>

              {/* Filter Pills & Search */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.06)', borderRadius: '8px', padding: '6px 12px', border: '1px solid rgba(255,255,255,0.12)', width: '220px' }}>
                  <Search size={14} color="var(--text-muted)" style={{ marginRight: '8px' }} />
                  <input
                    type="text"
                    placeholder="Filter by name or email..."
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: '0.80rem', width: '100%' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => setUserFilter('all')}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      background: userFilter === 'all' ? '#9d4edd' : 'rgba(255,255,255,0.05)',
                      color: '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    All ({usersList.length})
                  </button>

                  <button
                    onClick={() => setUserFilter('free')}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      background: userFilter === 'free' ? 'rgba(0, 240, 118, 0.25)' : 'rgba(255,255,255,0.05)',
                      color: userFilter === 'free' ? '#00f076' : '#fff',
                      border: userFilter === 'free' ? '1px solid #00f076' : '1px solid transparent',
                      cursor: 'pointer'
                    }}
                  >
                    Free ({usersList.filter(u => u.tier !== 'vip_premium').length})
                  </button>

                  <button
                    onClick={() => setUserFilter('vip_premium')}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      background: userFilter === 'vip_premium' ? 'rgba(255, 215, 0, 0.25)' : 'rgba(255,255,255,0.05)',
                      color: userFilter === 'vip_premium' ? '#ffd700' : '#fff',
                      border: userFilter === 'vip_premium' ? '1px solid #ffd700' : '1px solid transparent',
                      cursor: 'pointer'
                    }}
                  >
                    VIP Premium ({usersList.filter(u => u.tier === 'vip_premium').length})
                  </button>
                </div>
              </div>
            </div>

            {/* User List Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(9, 10, 15, 0.95)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '14px 16px' }}>VIEWER</th>
                    <th style={{ padding: '14px 16px' }}>EMAIL</th>
                    <th style={{ padding: '14px 16px' }}>ROLE</th>
                    <th style={{ padding: '14px 16px' }}>ACTIVE PLAN</th>
                    <th style={{ padding: '14px 16px' }}>PROFILES</th>
                    <th style={{ padding: '14px 16px' }}>PLAN CONTROLS</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList
                    .filter(u => {
                      if (userFilter === 'free') return u.tier !== 'vip_premium';
                      if (userFilter === 'vip_premium') return u.tier === 'vip_premium';
                      return true;
                    })
                    .filter(u => {
                      if (!userSearchQuery.trim()) return true;
                      const q = userSearchQuery.toLowerCase();
                      return (u.name?.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
                    })
                    .map((viewer) => {
                      const isVip = viewer.tier === 'vip_premium';
                      return (
                        <tr key={viewer.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <img
                                src={viewer.profiles?.[0]?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'}
                                alt={viewer.name || viewer.email}
                                style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
                              />
                              <div>
                                <div style={{ fontWeight: 700, color: '#fff' }}>{viewer.name || 'Viewer'}</div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ID: {viewer.id}</div>
                              </div>
                            </div>
                          </td>

                          <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                            {viewer.email}
                          </td>

                          <td style={{ padding: '14px 16px' }}>
                            {viewer.role === 'admin' ? (
                              <span style={{ fontSize: '0.70rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(157, 78, 221, 0.25)', color: '#e0aaff', border: '1px solid rgba(157, 78, 221, 0.4)', fontWeight: 800 }}>
                                ADMIN
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.70rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: '#cbd5e1' }}>
                                USER
                              </span>
                            )}
                          </td>

                          <td style={{ padding: '14px 16px' }}>
                            {isVip ? (
                              <span className="badge-vip" style={{ fontSize: '0.74rem', padding: '3px 9px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <Crown size={12} /> Tubi+ VIP
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.74rem', padding: '3px 9px', borderRadius: '6px', background: 'rgba(0, 240, 118, 0.12)', color: '#00f076', border: '1px solid rgba(0, 240, 118, 0.3)', fontWeight: 700 }}>
                                TubiStream Free
                              </span>
                            )}
                          </td>

                          <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                            {viewer.profiles?.length || 1} Profile{viewer.profiles?.length === 1 ? '' : 's'}
                          </td>

                          <td style={{ padding: '14px 16px' }}>
                            {isVip ? (
                              <button
                                onClick={() => handleToggleUserTier(viewer.id, 'free')}
                                className="btn-secondary"
                                style={{
                                  padding: '5px 12px',
                                  fontSize: '0.76rem',
                                  borderRadius: '6px',
                                  gap: '5px'
                                }}
                                title="Downgrade user account to standard Free plan"
                              >
                                Downgrade to Free
                              </button>
                            ) : (
                              <button
                                onClick={() => handleToggleUserTier(viewer.id, 'vip_premium')}
                                style={{
                                  padding: '5px 12px',
                                  fontSize: '0.76rem',
                                  borderRadius: '6px',
                                  background: 'linear-gradient(135deg, #ffd700 0%, #ff8800 100%)',
                                  color: '#000',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  boxShadow: '0 2px 8px rgba(255, 215, 0, 0.3)'
                                }}
                                title="Grant user Tubi+ VIP Premium with Ad-Free and 4K perks"
                              >
                                <Crown size={12} /> Upgrade to VIP
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Subscription Billing & Transactions Ledger */}
          <div className="glass-panel" style={{ borderRadius: '18px', overflow: 'hidden', padding: '24px', marginTop: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Receipt size={20} color="#ffd700" />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                    Subscription Transactions & Billing Ledger
                  </h3>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#00f076', background: 'rgba(0, 240, 118, 0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                    LIVE AUDIT
                  </span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginTop: '2px' }}>
                  Real-time payment transactions across Credit/Debit Cards and Mobile Money operators (MTN MoMo, Orange, M-Pesa, Airtel, Wave).
                </p>
              </div>

              {/* Filter Pills & Search */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.06)', borderRadius: '8px', padding: '6px 12px', border: '1px solid rgba(255,255,255,0.12)', width: '220px' }}>
                  <Search size={14} color="var(--text-muted)" style={{ marginRight: '8px' }} />
                  <input
                    type="text"
                    placeholder="Search by ID, email or method..."
                    value={txSearchQuery}
                    onChange={(e) => setTxSearchQuery(e.target.value)}
                    style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: '0.80rem', width: '100%' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => setTxMethodFilter('all')}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      background: txMethodFilter === 'all' ? '#9d4edd' : 'rgba(255,255,255,0.05)',
                      color: '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    All ({transactions.length})
                  </button>

                  <button
                    onClick={() => setTxMethodFilter('card')}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      background: txMethodFilter === 'card' ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255,255,255,0.05)',
                      color: txMethodFilter === 'card' ? '#60a5fa' : '#fff',
                      border: txMethodFilter === 'card' ? '1px solid #3b82f6' : '1px solid transparent',
                      cursor: 'pointer'
                    }}
                  >
                    💳 Card ({transactions.filter(t => t.paymentMethod === 'card').length})
                  </button>

                  <button
                    onClick={() => setTxMethodFilter('mobile_money')}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      background: txMethodFilter === 'mobile_money' ? 'rgba(255, 170, 0, 0.25)' : 'rgba(255,255,255,0.05)',
                      color: txMethodFilter === 'mobile_money' ? '#ffaa00' : '#fff',
                      border: txMethodFilter === 'mobile_money' ? '1px solid #ffaa00' : '1px solid transparent',
                      cursor: 'pointer'
                    }}
                  >
                    📱 Mobile Money ({transactions.filter(t => t.paymentMethod === 'mobile_money').length})
                  </button>
                </div>
              </div>
            </div>

            {/* Quick KPI stats strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '14px 18px' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Invoiced</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#00f076', marginTop: '4px' }}>
                  ${transactions.reduce((sum, t) => sum + (t.status === 'succeeded' ? t.amount : 0), 0).toFixed(2)}
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '14px 18px' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Paid Subscriptions</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffd700', marginTop: '4px' }}>
                  {transactions.filter(t => t.status === 'succeeded').length}
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '14px 18px' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Card Volume</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#60a5fa', marginTop: '4px' }}>
                  ${transactions.filter(t => t.paymentMethod === 'card' && t.status === 'succeeded').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '14px 18px' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mobile Money Volume</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffaa00', marginTop: '4px' }}>
                  ${transactions.filter(t => t.paymentMethod === 'mobile_money' && t.status === 'succeeded').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
                </div>
              </div>
            </div>

            {/* Transactions Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(9, 10, 15, 0.95)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '14px 16px' }}>TX ID</th>
                    <th style={{ padding: '14px 16px' }}>SUBSCRIBER</th>
                    <th style={{ padding: '14px 16px' }}>PLAN & CYCLE</th>
                    <th style={{ padding: '14px 16px' }}>PAYMENT METHOD</th>
                    <th style={{ padding: '14px 16px' }}>AMOUNT</th>
                    <th style={{ padding: '14px 16px' }}>DATE</th>
                    <th style={{ padding: '14px 16px' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions
                    .filter(t => {
                      if (txMethodFilter === 'card') return t.paymentMethod === 'card';
                      if (txMethodFilter === 'mobile_money') return t.paymentMethod === 'mobile_money';
                      return true;
                    })
                    .filter(t => {
                      if (!txSearchQuery.trim()) return true;
                      const q = txSearchQuery.toLowerCase();
                      return (
                        t.id.toLowerCase().includes(q) ||
                        t.userEmail.toLowerCase().includes(q) ||
                        (t.userName && t.userName.toLowerCase().includes(q)) ||
                        (t.providerLabel && t.providerLabel.toLowerCase().includes(q))
                      );
                    })
                    .map((tx) => (
                      <tr key={tx.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ fontFamily: 'monospace', fontSize: '0.80rem', color: '#9d4edd', background: 'rgba(157, 78, 221, 0.1)', padding: '3px 7px', borderRadius: '4px' }}>
                            {tx.id}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 700, color: '#fff' }}>{tx.userName || 'Subscriber'}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{tx.userEmail}</div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#ffd700', fontWeight: 700, fontSize: '0.82rem' }}>
                            <Crown size={12} /> VIP Premium
                          </span>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                            {tx.billingCycle} billing
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                            {tx.paymentMethod === 'card' ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#60a5fa', padding: '4px 8px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600 }}>
                                <CreditCard size={13} /> {tx.providerLabel}
                              </span>
                            ) : (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(255, 170, 0, 0.12)', border: '1px solid rgba(255, 170, 0, 0.3)', color: '#ffaa00', padding: '4px 8px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600 }}>
                                <Smartphone size={13} /> {tx.providerLabel}
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ fontWeight: 800, color: '#fff', fontSize: '0.94rem' }}>
                            ${tx.amount.toFixed(2)}
                          </span>
                          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginLeft: '4px' }}>USD</span>
                        </td>
                        <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '0.80rem' }}>
                          {new Date(tx.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: tx.status === 'succeeded' ? 'rgba(0, 240, 118, 0.15)' : 'rgba(255, 68, 68, 0.15)',
                            color: tx.status === 'succeeded' ? '#00f076' : '#ff4444',
                            border: `1px solid ${tx.status === 'succeeded' ? 'rgba(0, 240, 118, 0.3)' : 'rgba(255, 68, 68, 0.3)'}`,
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            textTransform: 'capitalize'
                          }}>
                            {tx.status === 'succeeded' && <CheckCircle2 size={11} />}
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: ML Recommender Diagnostics */}
      {activeTab === 'ml' && (
        <div className="glass-panel" style={{ padding: '28px', borderRadius: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Sparkles size={20} color="var(--accent-pink)" />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
              AI Recommender & Vector Embedding Architecture
            </h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
            The recommendation pipeline utilizes tokenized TF-IDF feature vocabulary across genres, cast, directors, maturity ratings, and release decades, computing normalized cosine similarity dot products in high-dimensional vector space combined with user implicit feedback watch affinity.
          </p>

          <div className="responsive-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '0.88rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px' }}>
              <h4 style={{ fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Feature Importance Weights</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--text-secondary)' }}>
                <li><strong>Genre Weight:</strong> 3.0x</li>
                <li><strong>Director Affinity:</strong> 2.5x</li>
                <li><strong>Keyword Tag:</strong> 2.0x</li>
                <li><strong>Cast Match:</strong> 1.5x</li>
                <li><strong>Maturity & Decade:</strong> 1.0x</li>
              </ul>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px' }}>
              <h4 style={{ fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Implicit Feedback Scoring</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--text-secondary)' }}>
                <li><strong>User Like Reaction:</strong> +3.5 weight</li>
                <li><strong>Added to My List:</strong> +2.5 weight</li>
                <li><strong>Completion &gt;90%:</strong> +3.0 weight</li>
                <li><strong>Watch Duration %:</strong> Linear scalar (1.0x to 3.0x)</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Site Settings & Global Branding */}
      {activeTab === 'settings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Toast Notification */}
          {settingsToast && (
            <div
              className="animate-fade-in"
              style={{
                padding: '14px 20px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(157, 78, 221, 0.25) 0%, rgba(255, 42, 109, 0.25) 100%)',
                border: '1px solid rgba(255, 42, 109, 0.4)',
                color: '#fff',
                fontSize: '0.95rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
              }}
            >
              <CheckCircle2 size={18} color="#00f076" />
              <span>{settingsToast}</span>
            </div>
          )}

          {/* Header Banner */}
          <div
            className="glass-panel"
            style={{
              padding: '28px 32px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(255, 42, 109, 0.08) 0%, rgba(157, 78, 221, 0.12) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '20px'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #ff2a6d 0%, #9d4edd 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 14px rgba(255, 42, 109, 0.4)'
                  }}
                >
                  <Settings size={20} color="#fff" />
                </div>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#fff' }}>
                  Site Settings & Platform Branding Studio
                </h2>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '4px 10px',
                    borderRadius: '999px',
                    background: 'rgba(0, 240, 118, 0.15)',
                    color: '#00f076',
                    border: '1px solid rgba(0, 240, 118, 0.3)',
                    letterSpacing: '0.05em'
                  }}
                >
                  LIVE MULTI-SCREEN SYNC
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '780px', lineHeight: 1.5 }}>
                Manage the platform's official name, tagline, description, and legal footer notice. Any change saved here is written to persistent backend storage and propagates in real-time to the Navbar logo, browser document title, Smart TV 10-foot UI, Auth modals, and Footer copyright.
              </p>
            </div>

            {/* Quick Presets */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Quick Brand Presets
              </span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { name: 'TubiStream', tagline: '100% Free Streaming, Zero Hassle', desc: 'Stream thousands of free movies and TV shows instantly. 100% legal, no credit card required.' },
                  { name: 'CinemaPulse', tagline: 'Your Premier Free Cinema Universe', desc: 'Watch blockbuster movies, trending series, and 24/7 FAST channels with zero subscription fees.' },
                  { name: 'NightOwl VOD', tagline: 'Free Midnight Thrills & Cult Shows', desc: 'Uncensored cult classics, late-night action, indie cinema, and binge-worthy television.' },
                  { name: 'StreamFlix Max', tagline: 'Next-Gen Free Streaming On Demand', desc: 'High-definition 4K streaming catalog featuring cinema hits and live channels.' }
                ].map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setSettingsForm({
                        siteName: preset.name,
                        siteTagline: preset.tagline,
                        siteDescription: preset.desc,
                        footerCopyright: `© 2026 ${preset.name} Entertainment Corp. All rights reserved.`
                      });
                      setSettingsToast(`Preset "${preset.name}" loaded into form! Click Save to apply.`);
                      setTimeout(() => setSettingsToast(null), 3000);
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#fff',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 42, 109, 0.2)';
                      e.currentTarget.style.borderColor = 'rgba(255, 42, 109, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                    }}
                  >
                    + {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main 2-Column Grid: Form & Live Preview */}
          <div className="responsive-two-col" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '28px', alignItems: 'start' }}>
            {/* Left Column: Form Controls */}
            <form
              onSubmit={handleSaveSiteSettings}
              className="glass-panel"
              style={{
                padding: '28px',
                borderRadius: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '22px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Palette size={18} color="var(--accent-pink)" />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
                    Brand Configuration Fields
                  </h3>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Auto-synced via JSON State
                </span>
              </div>

              {/* Field 1: Site Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
                  Site / Platform Name <span style={{ color: 'var(--accent-pink)' }}>*</span>
                </label>
                <input
                  type="text"
                  value={settingsForm.siteName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, siteName: e.target.value })}
                  placeholder="e.g. TubiStream"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    fontSize: '1rem',
                    fontWeight: 700,
                    outline: 'none',
                    boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.3)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent-pink)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)'}
                />
                <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Primary brand name. Displayed in the Navbar logo, browser tab &lt;title&gt;, Smart TV UI, emails, and CMS access screens.
                </span>
              </div>

              {/* Field 2: Site Tagline */}
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
                  Platform Tagline / Slogan
                </label>
                <input
                  type="text"
                  value={settingsForm.siteTagline}
                  onChange={(e) => setSettingsForm({ ...settingsForm, siteTagline: e.target.value })}
                  placeholder="e.g. 100% Free Streaming, Zero Hassle"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    fontSize: '0.95rem',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent-pink)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)'}
                />
                <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Shown beneath the logo in the Navbar, inside document &lt;title&gt;, and on promotional cards.
                </span>
              </div>

              {/* Field 3: Site Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
                  Site Description & SEO Meta
                </label>
                <textarea
                  rows={3}
                  value={settingsForm.siteDescription}
                  onChange={(e) => setSettingsForm({ ...settingsForm, siteDescription: e.target.value })}
                  placeholder="Stream thousands of free movies and TV shows instantly. 100% legal, no credit card required."
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    lineHeight: 1.4,
                    outline: 'none',
                    resize: 'vertical'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent-pink)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)'}
                />
                <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Used in the footer "About" synopsis, search engine description tags, and social share cards.
                </span>
              </div>

              {/* Field 4: Footer Copyright */}
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
                  Footer Legal & Copyright Text
                </label>
                <input
                  type="text"
                  value={settingsForm.footerCopyright}
                  onChange={(e) => setSettingsForm({ ...settingsForm, footerCopyright: e.target.value })}
                  placeholder="e.g. © 2026 TubiStream Entertainment Corp. All rights reserved."
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    fontSize: '0.92rem',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent-pink)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)'}
                />
                <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Displayed in the footer across every page and device view.
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '10px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="btn-primary"
                  style={{
                    flex: 1,
                    padding: '14px 24px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #ff2a6d 0%, #9d4edd 100%)',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    cursor: isSavingSettings ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 6px 20px rgba(255, 42, 109, 0.35)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Check size={18} />
                  {isSavingSettings ? 'Saving & Applying...' : 'Save & Propagate Everywhere'}
                </button>

                <button
                  type="button"
                  disabled={isSavingSettings}
                  onClick={handleResetSiteSettings}
                  style={{
                    padding: '14px 20px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: isSavingSettings ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  title="Reset to default TubiStream branding"
                >
                  <RefreshCw size={16} />
                  Reset
                </button>
              </div>
            </form>

            {/* Right Column: Live Instant Previews */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div
                className="glass-panel"
                style={{
                  padding: '24px',
                  borderRadius: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '18px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
                  <Monitor size={18} color="#00f076" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>
                    Live Multi-Surface Previews
                  </h3>
                </div>

                {/* Preview 1: Browser Tab Title */}
                <div style={{ background: 'rgba(0, 0, 0, 0.5)', borderRadius: '12px', padding: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
                    1. Browser Window & Tab Title
                  </span>
                  <div
                    style={{
                      background: '#1a1b26',
                      borderRadius: '8px 8px 0 0',
                      padding: '8px 12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      maxWidth: '100%',
                      overflow: 'hidden',
                      borderTop: '2px solid var(--accent-pink)'
                    }}
                  >
                    <Globe size={14} color="#9d4edd" />
                    <span
                      style={{
                        fontSize: '0.8rem',
                        color: '#fff',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {settingsForm.siteName || 'TubiStream'} — Watch Free Movies & TV Shows | {settingsForm.siteTagline || '100% Free Streaming'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '4px' }}>✕</span>
                  </div>
                  <div style={{ height: '4px', background: '#24283b', borderRadius: '0 0 4px 4px' }} />
                </div>

                {/* Preview 2: Navbar Brand Logo */}
                <div style={{ background: 'rgba(0, 0, 0, 0.5)', borderRadius: '12px', padding: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
                    2. Desktop Navigation Bar Logo
                  </span>
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: '1px solid rgba(255, 255, 255, 0.06)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, #ff2a6d 0%, #9d4edd 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 900,
                          fontSize: '1rem',
                          color: '#fff'
                        }}
                      >
                        {(settingsForm.siteName || 'T')[0]}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span
                          style={{
                            fontSize: '1.25rem',
                            fontWeight: 900,
                            letterSpacing: '-0.02em',
                            background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                          }}
                        >
                          {settingsForm.siteName || 'TubiStream'}
                        </span>
                        {settingsForm.siteTagline && (
                          <span style={{ fontSize: '0.68rem', color: 'var(--accent-pink)', fontWeight: 700 }}>
                            {settingsForm.siteTagline}
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                      <span style={{ color: '#fff' }}>MOVIES</span>
                      <span>SERIES</span>
                      <span style={{ color: '#00f076' }}>LIVE FAST</span>
                      <span style={{ color: '#ffd700' }}>👑 VIP</span>
                    </div>
                  </div>
                </div>

                {/* Preview 3: Smart TV 10-Foot UI Header */}
                <div style={{ background: 'rgba(0, 0, 0, 0.5)', borderRadius: '12px', padding: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
                    3. Smart TV 10-Foot Spatial Interface
                  </span>
                  <div
                    style={{
                      background: '#06070a',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      border: '1px solid rgba(255, 42, 109, 0.2)'
                    }}
                  >
                    <div
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: 'linear-gradient(135deg, #ff2a6d 0%, #ff6e00 100%)',
                        fontWeight: 900,
                        fontSize: '0.82rem',
                        color: '#fff',
                        letterSpacing: '0.05em'
                      }}
                    >
                      {(settingsForm.siteName || 'TubiStream').toUpperCase()} 10-FOOT UI
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      🎮 Lean-back Spatial Navigation • Remote D-Pad Ready
                    </span>
                  </div>
                </div>

                {/* Preview 4: Footer Copyright Card */}
                <div style={{ background: 'rgba(0, 0, 0, 0.5)', borderRadius: '12px', padding: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
                    4. Footer & Legal Copyright
                  </span>
                  <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '8px' }}>
                      {settingsForm.siteDescription || 'Stream thousands of free movies and TV shows instantly. 100% legal, no credit card required.'}
                    </p>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '6px' }}>
                      {settingsForm.footerCopyright || `© 2026 ${settingsForm.siteName || 'TubiStream'} Entertainment Corp. All rights reserved.`}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Raw VAST XML Modal Inspector */}
      {previewVastXml && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(12px)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
          onClick={() => setPreviewVastXml(null)}
        >
          <div
            className="glass-heavy animate-fade-in"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '840px',
              maxHeight: '80vh',
              borderRadius: '20px',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 60px rgba(0,0,0,0.95)',
              border: '1px solid var(--accent-cyan)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Code size={20} color="var(--accent-cyan)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>IAB Standard VAST 4.2 XML Response</h3>
              </div>
              <button onClick={() => setPreviewVastXml(null)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <pre
              style={{
                flex: 1,
                overflow: 'auto',
                background: '#090a0f',
                padding: '16px',
                borderRadius: '12px',
                fontSize: '0.82rem',
                color: '#a78bfa',
                border: '1px solid rgba(255,255,255,0.1)',
                fontFamily: 'monospace',
                lineHeight: 1.5
              }}
            >
              {previewVastXml}
            </pre>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(previewVastXml);
                  setAdToast('VAST XML copied to clipboard!');
                  setTimeout(() => setAdToast(null), 2500);
                  setPreviewVastXml(null);
                }}
                className="btn-primary"
                style={{ padding: '10px 20px', fontWeight: 700 }}
              >
                <Copy size={16} /> Copy XML Content
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Subscription Payment Method Modal */}
      {isAddMethodOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setIsAddMethodOpen(false)}
        >
          <div
            className="glass-heavy animate-fade-in"
            style={{
              width: '100%',
              maxWidth: '540px',
              borderRadius: '20px',
              padding: '28px',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              background: 'linear-gradient(180deg, #10121d 0%, #0c0d16 100%)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.9)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PlusCircle size={22} color="#ffd700" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                  Add Subscription Payment Method
                </h3>
              </div>
              <button
                onClick={() => setIsAddMethodOpen(false)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreatePaymentMethod} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.80rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                  Method Display Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flutterwave Checkout, PayPal Express, Binance Pay"
                  value={newMethodForm.name}
                  onChange={(e) => setNewMethodForm({ ...newMethodForm, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.88rem' }}
                />
              </div>

              <div className="responsive-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.80rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    Category
                  </label>
                  <select
                    value={newMethodForm.category}
                    onChange={(e) => setNewMethodForm({ ...newMethodForm, category: e.target.value as any })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: '#12141d', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.88rem' }}
                  >
                    <option value="card">Credit / Debit Card</option>
                    <option value="mobile_money">Mobile Money (MoMo)</option>
                    <option value="wallet">Digital Wallet</option>
                    <option value="bank">Bank Wire / Transfer</option>
                    <option value="crypto">Cryptocurrency</option>
                    <option value="custom">Custom Gateway</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.80rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    Badge Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Instant, Popular, Zero Fee"
                    value={newMethodForm.badge}
                    onChange={(e) => setNewMethodForm({ ...newMethodForm, badge: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.88rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.80rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Short description displayed on viewer checkout"
                  value={newMethodForm.description}
                  onChange={(e) => setNewMethodForm({ ...newMethodForm, description: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.80rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                  Supported Currencies (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="USD, EUR, GBP, GHS, NGN, KES"
                  value={newMethodForm.supportedCurrencies}
                  onChange={(e) => setNewMethodForm({ ...newMethodForm, supportedCurrencies: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.80rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '5px' }}>
                  Checkout Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Account number, routing details, or wallet address instructions"
                  value={newMethodForm.instructions}
                  onChange={(e) => setNewMethodForm({ ...newMethodForm, instructions: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.88rem', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
                <span style={{ fontSize: '0.86rem', color: '#fff', fontWeight: 600 }}>Activate & Enable Immediately</span>
                <button
                  type="button"
                  onClick={() => setNewMethodForm({ ...newMethodForm, isEnabled: !newMethodForm.isEnabled })}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: newMethodForm.isEnabled ? '#00f076' : 'var(--text-muted)' }}
                >
                  {newMethodForm.isEnabled ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddMethodOpen(false)}
                  style={{ padding: '10px 18px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '10px 22px', borderRadius: '8px', background: 'linear-gradient(135deg, #ffd700 0%, #ff8800 100%)', color: '#000', border: 'none', fontWeight: 800, cursor: 'pointer' }}
                >
                  Create Payment Method
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
