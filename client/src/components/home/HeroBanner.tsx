import React, { useState, useEffect } from 'react';
import { Title } from '../../types';
import { usePlayer } from '../../context/PlayerContext';
import { useAuth } from '../../context/AuthContext';
import { Play, Plus, Check, Info, Volume2, VolumeX, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';

interface HeroBannerProps {
  titles: Title[];
  onOpenDetails: (title: Title) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ titles, onOpenDetails }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const { playTitle } = usePlayer();
  const { isInMyList, toggleMyList } = useAuth();

  useEffect(() => {
    if (titles.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % titles.length);
    }, 9000);
    return () => clearInterval(interval);
  }, [titles]);

  if (titles.length === 0) {
    return (
      <div style={{ height: '540px', width: '100%', background: '#12141d' }} className="skeleton-loading" />
    );
  }

  const safeIndex = (currentIndex >= 0 && currentIndex < titles.length) ? currentIndex : 0;
  const currentTitle = titles[safeIndex] || titles[0];

  if (!currentTitle) {
    return (
      <div style={{ height: '540px', width: '100%', background: '#12141d' }} className="skeleton-loading" />
    );
  }

  const inList = isInMyList(currentTitle.id);

  return (
    <div
      style={{
        position: 'relative',
        height: '620px',
        width: '100%',
        overflow: 'hidden',
        background: '#090a0f'
      }}
    >
      {/* Background Image / Backdrop with Smooth Vignette Gradient */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${currentTitle.backdropUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
          transition: 'background-image 0.8s ease-in-out',
          transform: 'scale(1.02)'
        }}
      >
        {/* Cinematic Vignette Overlays */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(9,10,15,0.4) 0%, rgba(9,10,15,0.2) 40%, rgba(9,10,15,0.85) 85%, #090a0f 100%)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, #090a0f 0%, rgba(9,10,15,0.85) 30%, rgba(9,10,15,0.3) 70%, transparent 100%)'
          }}
        />
      </div>

      {/* Hero Content Container */}
      <div
        style={{
          position: 'relative',
          maxWidth: '1440px',
          margin: '0 auto',
          height: '100%',
          padding: '0 32px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          zIndex: 10
        }}
      >
        <div style={{ maxWidth: '640px' }}>
          {/* Tubi Original / Exclusive Badge */}
          {currentTitle.isOriginal && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 42, 109, 0.2)',
                border: '1px solid rgba(255, 42, 109, 0.4)',
                color: '#ff2a6d',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '16px'
              }}
            >
              <Sparkles size={14} /> Tubi Original Special
            </div>
          )}

          {/* Title Heading */}
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              lineHeight: 1.08,
              fontWeight: 900,
              color: '#fff',
              marginBottom: '16px',
              textShadow: '0 4px 20px rgba(0,0,0,0.8)'
            }}
          >
            {currentTitle.title}
          </h1>

          {/* Metadata Row: Match Score, Year, Rating, Duration, Badges */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: '18px',
              fontSize: '0.9rem'
            }}
          >
            <span style={{ color: 'var(--accent-green)', fontWeight: 800 }}>
              {currentTitle.matchScore}% Match
            </span>
            <span style={{ color: 'var(--text-secondary)' }}>{currentTitle.releaseYear}</span>
            <span className="badge-rating">{currentTitle.rating}</span>
            <span style={{ color: 'var(--text-secondary)' }}>{currentTitle.durationMinutes}m</span>
            <span className="badge-hd">4K UHD</span>
            <span className="badge-hd" style={{ borderColor: 'var(--accent-pink)', color: 'var(--accent-pink)' }}>
              Dolby 5.1
            </span>
          </div>

          {/* Synopsis */}
          <p
            style={{
              color: '#cbd5e1',
              fontSize: '1.02rem',
              lineHeight: 1.55,
              marginBottom: '28px',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textShadow: '0 2px 10px rgba(0,0,0,0.8)'
            }}
          >
            {currentTitle.synopsis}
          </p>

          {/* Genre Tags */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
            {currentTitle.genres.map((g) => (
              <span
                key={g}
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  background: 'rgba(255,255,255,0.06)',
                  padding: '3px 10px',
                  borderRadius: '4px'
                }}
              >
                {g}
              </span>
            ))}
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => playTitle(currentTitle)}
              className="btn-primary"
              style={{ padding: '14px 32px', fontSize: '1.05rem', fontWeight: 700 }}
            >
              <Play size={20} fill="#fff" /> Watch Free Now
            </button>

            <button
              onClick={() => toggleMyList(currentTitle.id)}
              className="btn-secondary"
              style={{ padding: '14px 22px', fontSize: '0.95rem' }}
            >
              {inList ? <Check size={18} color="var(--accent-green)" /> : <Plus size={18} />}
              {inList ? 'In My List' : 'My List'}
            </button>

            <button
              onClick={() => onOpenDetails(currentTitle)}
              className="btn-secondary"
              style={{ padding: '14px 18px', fontSize: '0.95rem' }}
            >
              <Info size={18} /> Details
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Navigation Arrows & Indicators */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          right: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 20
        }}
      >
        <button
          onClick={() => setCurrentIndex((prev) => (prev - 1 + titles.length) % titles.length)}
          className="btn-secondary"
          style={{ width: '40px', height: '40px', padding: 0, borderRadius: '50%', justifyContent: 'center' }}
        >
          <ChevronLeft size={20} />
        </button>

        {/* Dots */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {titles.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrentIndex(i)}
              style={{
                width: i === currentIndex ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: i === currentIndex ? 'var(--accent-pink)' : 'rgba(255,255,255,0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % titles.length)}
          className="btn-secondary"
          style={{ width: '40px', height: '40px', padding: 0, borderRadius: '50%', justifyContent: 'center' }}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};
