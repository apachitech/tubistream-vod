import React, { useState, useEffect } from 'react';
import { Title, FastChannel, AnalyticsSummary, AdCreative } from '../../types';
import { api } from '../../services/api';
import {
  LayoutDashboard, Film, Radio, DollarSign, Activity, Sparkles, Plus, Trash2, Edit3,
  TrendingUp, Users, HardDrive, ShieldCheck, Check, RefreshCw, Layers,
  Sliders, Play, Pause, Copy, ExternalLink, ToggleLeft, ToggleRight, Eye, Code, X
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'catalog' | 'fast' | 'ads' | 'ml'>('overview');
  const [dashboardData, setDashboardData] = useState<any | null>(null);
  const [titles, setTitles] = useState<Title[]>([]);
  const [channels, setChannels] = useState<FastChannel[]>([]);
  const [ads, setAds] = useState<AdCreative[]>([]);
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
      const [dash, tit, chan, adRes] = await Promise.all([
        api.getAdminDashboard(),
        api.getTitles({ limit: 50 }),
        api.getFastChannels(),
        api.getAdminAds()
      ]);
      if (dash.success) setDashboardData(dash);
      if (tit.success) setTitles(tit.titles);
      if (chan.success) setChannels(chan.channels);
      if (adRes.success) {
        setAds(adRes.ads);
        if (adRes.config) setAdConfig(adRes.config);
        if (adRes.summary) setAdSummary(adRes.summary);
      }
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '32px 24px', minHeight: '85vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
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
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff' }}>
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
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
        style={{
          display: 'flex',
          gap: '12px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '16px',
          marginBottom: '32px'
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
            gap: '8px'
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
            gap: '8px'
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
            gap: '8px'
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
            gap: '8px'
          }}
        >
          <DollarSign size={16} /> Ad Engine & Inventory ({ads.length})
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
            gap: '8px'
          }}
        >
          <Sparkles size={16} /> ML Vector Engine Insights
        </button>
      </div>

      {/* Tab 1: Overview Analytics */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
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

            <form onSubmit={handleCreateTitle} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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

      {/* Tab 3: FAST Live Channels */}
      {activeTab === 'fast' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {channels.map((chan) => (
              <div key={chan.id} className="glass-panel" style={{ padding: '20px', borderRadius: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                <img src={chan.logoUrl} alt={chan.name} style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#00f076', fontWeight: 800 }}>CH {chan.channelNumber} • {chan.category}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>{chan.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>{chan.description}</div>
                </div>
              </div>
            ))}
          </div>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '0.88rem' }}>
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
    </div>
  );
};
