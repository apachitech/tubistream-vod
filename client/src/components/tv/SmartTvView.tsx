import React, { useState, useEffect } from 'react';
import { Title, FastChannel } from '../../types';
import { api } from '../../services/api';
import { usePlayer } from '../../context/PlayerContext';
import { Play, Info, Tv, Sparkles, Radio, Film, Compass, ChevronRight } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export const SmartTvView: React.FC<{ onOpenDetails: (t: Title) => void }> = ({ onOpenDetails }) => {
  const [titles, setTitles] = useState<Title[]>([]);
  const [channels, setChannels] = useState<FastChannel[]>([]);
  const [activeSection, setActiveSection] = useState<'featured' | 'channels' | 'movies' | 'action'>('featured');
  const [focusedIndex, setFocusedIndex] = useState(0);
  const { playTitle, playFastChannel } = usePlayer();
  const { settings } = useSiteSettings();
  const siteName = settings?.siteName || 'TubiStream';

  useEffect(() => {
    Promise.all([api.getFeatured(), api.getFastChannels(), api.getTitles()]).then(([feat, fast, all]) => {
      if (feat.success) setTitles(feat.titles);
      if (fast.success) setChannels(fast.channels);
    });
  }, []);

  // Keyboard Spatial Navigation (D-Pad)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === 'ArrowRight') {
        setFocusedIndex((prev) => (prev + 1) % (titles.length || 1));
      } else if (e.key === 'ArrowLeft') {
        setFocusedIndex((prev) => (prev - 1 + titles.length) % (titles.length || 1));
      } else if (e.key === 'ArrowDown') {
        if (activeSection === 'featured') setActiveSection('channels');
        else if (activeSection === 'channels') setActiveSection('movies');
      } else if (e.key === 'ArrowUp') {
        if (activeSection === 'movies') setActiveSection('channels');
        else if (activeSection === 'channels') setActiveSection('featured');
      } else if (e.key === 'Enter') {
        const selected = titles[focusedIndex];
        if (selected) playTitle(selected);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [titles, focusedIndex, activeSection]);

  const focusedTitle = titles[focusedIndex] || titles[0];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#06070a',
        padding: '40px 60px',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px'
      }}
    >
      {/* 10-Foot UI Header Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #ff2a6d 0%, #ff6e00 100%)',
              fontWeight: 900,
              fontSize: '1.2rem',
              letterSpacing: '0.05em'
            }}
          >
            {siteName.toUpperCase()} 10-FOOT UI
          </div>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            🎮 Lean-back Spatial Navigation • Use Remote D-Pad
          </span>
        </div>

        <div style={{ display: 'flex', gap: '20px', fontSize: '1.05rem', fontWeight: 700 }}>
          <span style={{ color: activeSection === 'featured' ? '#ff2a6d' : 'var(--text-muted)' }}>FEATURED</span>
          <span style={{ color: activeSection === 'channels' ? '#00f076' : 'var(--text-muted)' }}>LIVE CHANNELS</span>
          <span style={{ color: activeSection === 'movies' ? '#ff2a6d' : 'var(--text-muted)' }}>MOVIES</span>
        </div>
      </div>

      {/* Large 10-Foot Backdrop Hero Focus Stage */}
      {focusedTitle && (
        <div
          style={{
            position: 'relative',
            height: '420px',
            borderRadius: '24px',
            overflow: 'hidden',
            backgroundImage: `url(${focusedTitle.backdropUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.9)',
            border: '2px solid rgba(255, 42, 109, 0.4)'
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, #090a0f 0%, rgba(9,10,15,0.85) 45%, transparent 100%)',
              padding: '48px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              maxWidth: '680px'
            }}
          >
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
              <span className="badge-vip">FEATURED TITLE</span>
              <span style={{ color: 'var(--accent-green)', fontWeight: 800 }}>{focusedTitle.matchScore}% MATCH</span>
              <span className="badge-rating">{focusedTitle.rating}</span>
            </div>
            <h1 style={{ fontSize: '2.8rem', fontWeight: 900, marginBottom: '16px', lineHeight: 1.1 }}>
              {focusedTitle.title}
            </h1>
            <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: 1.5, marginBottom: '24px' }}>
              {focusedTitle.shortDescription || focusedTitle.synopsis}
            </p>

            <div style={{ display: 'flex', gap: '16px' }}>
              <button
                onClick={() => playTitle(focusedTitle)}
                className="btn-primary"
                style={{ padding: '16px 36px', fontSize: '1.15rem', fontWeight: 800 }}
              >
                <Play size={22} fill="#fff" /> Press [OK] to Watch
              </button>
              <button
                onClick={() => onOpenDetails(focusedTitle)}
                className="btn-secondary"
                style={{ padding: '16px 24px', fontSize: '1.05rem' }}
              >
                <Info size={20} /> Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Spatial Horizontal Carousel with Glowing TV Focus */}
      <div>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '16px', color: '#fff' }}>
          Trending On Smart TV
        </h3>
        <div style={{ display: 'flex', gap: '24px', overflowX: 'hidden' }}>
          {titles.map((t, idx) => {
            const isFocused = idx === focusedIndex;
            return (
              <div
                key={t.id}
                onClick={() => {
                  setFocusedIndex(idx);
                  playTitle(t);
                }}
                className={`tv-focusable ${isFocused ? 'is-focused' : ''}`}
                style={{
                  width: '240px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: '#151824',
                  cursor: 'pointer',
                  border: isFocused ? '3px solid #ff2a6d' : '1px solid rgba(255,255,255,0.1)',
                  boxShadow: isFocused ? '0 0 30px rgba(255, 42, 109, 0.8)' : 'none',
                  transform: isFocused ? 'scale(1.08)' : 'scale(1)',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <img
                  src={t.posterUrl}
                  alt={t.title}
                  style={{ width: '100%', height: '320px', objectFit: 'cover' }}
                />
                <div style={{ padding: '12px' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {t.title}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {t.releaseYear} • {t.genres[0]}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
