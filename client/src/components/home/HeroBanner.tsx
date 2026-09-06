import React, { useState, useEffect } from 'react';
import { Title } from '../../types';
import { usePlayer } from '../../context/PlayerContext';
import { useAuth } from '../../context/AuthContext';
import { Play, Plus, Check, Info, Volume2, VolumeX, Sparkles, ChevronRight, ChevronLeft, Crown } from 'lucide-react';

interface HeroBannerProps {
  titles: Title[];
  onOpenDetails: (title: Title) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ titles, onOpenDetails }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1440);
  const { playTitle } = usePlayer();
  const { user, isInMyList, toggleMyList } = useAuth();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (titles.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % titles.length);
    }, 9000);
    return () => clearInterval(interval);
  }, [titles]);

  // Touch Swipe Handlers for mobile gesture navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 45) {
      // Swiped left -> next
      setCurrentIndex((prev) => (prev + 1) % titles.length);
    } else if (diff < -45) {
      // Swiped right -> prev
      setCurrentIndex((prev) => (prev - 1 + titles.length) % titles.length);
    }
    setTouchStartX(null);
  };

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
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        position: 'relative',
        height: 'clamp(440px, 74vh, 600px)',
        width: '100%',
        overflow: 'hidden',
        background: '#090a0f'
      }}
    >
      {/* Background Image / Backdrop with Smooth Vignette Gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
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
              'linear-gradient(180deg, rgba(9,10,15,0.4) 0%, rgba(9,10,15,0.25) 35%, rgba(9,10,15,0.88) 75%, #090a0f 100%)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, #090a0f 0%, rgba(9,10,15,0.85) 35%, rgba(9,10,15,0.3) 70%, transparent 100%)'
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
          padding: '0 clamp(16px, 4vw, 32px)',
          paddingBottom: 'clamp(44px, 7vh, 56px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          zIndex: 10
        }}
      >
        <div style={{ maxWidth: '640px', width: '100%' }}>
          {/* Tubi Original / Exclusive Badge */}
          {currentTitle.accessTier === 'vip_premium' ? (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.25), rgba(255, 140, 0, 0.15))',
                border: '1px solid rgba(255, 215, 0, 0.5)',
                color: '#ffd700',
                padding: '4px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.76rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '12px',
                boxShadow: '0 2px 12px rgba(255, 215, 0, 0.2)'
              }}
            >
              <Crown size={14} fill="#ffd700" /> Tubi+ VIP Exclusive Premiere
            </div>
          ) : currentTitle.isOriginal ? (
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
                fontSize: '0.76rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '12px'
              }}
            >
              <Sparkles size={14} /> Tubi Original Special
            </div>
          ) : null}

          {/* Title Heading */}
          <h1
            style={{
              fontSize: 'clamp(1.75rem, 5.5vw, 3.6rem)',
              lineHeight: 1.1,
              fontWeight: 900,
              color: '#fff',
              marginBottom: '12px',
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
              gap: '10px',
              marginBottom: '14px',
              fontSize: '0.85rem'
            }}
          >
            <span style={{ color: 'var(--accent-green)', fontWeight: 800 }}>
              {currentTitle.matchScore}% Match
            </span>
            <span style={{ color: 'var(--text-secondary)' }}>{currentTitle.releaseYear}</span>
            <span className="badge-rating">{currentTitle.rating}</span>
            <span style={{ color: 'var(--text-secondary)' }}>{currentTitle.durationMinutes}m</span>
            <span className="badge-hd">4K UHD</span>
            <span className="badge-hd hide-on-compact-mobile" style={{ borderColor: 'var(--accent-pink)', color: 'var(--accent-pink)' }}>
              Dolby 5.1
            </span>
          </div>

          {/* Synopsis */}
          <p
            style={{
              color: '#cbd5e1',
              fontSize: 'clamp(0.85rem, 2.2vw, 1rem)',
              lineHeight: 1.45,
              marginBottom: '16px',
              display: '-webkit-box',
              WebkitLineClamp: windowWidth < 640 ? 2 : 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textShadow: '0 2px 10px rgba(0,0,0,0.8)'
            }}
          >
            {currentTitle.synopsis}
          </p>

          {/* Genre Tags */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {(windowWidth < 500 ? currentTitle.genres.slice(0, 3) : currentTitle.genres).map((g) => (
              <span
                key={g}
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  background: 'rgba(255,255,255,0.06)',
                  padding: '3px 9px',
                  borderRadius: '4px'
                }}
              >
                {g}
              </span>
            ))}
          </div>

          {/* Action CTAs - Elevated with zIndex and protected touch padding */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flexWrap: 'wrap',
              position: 'relative',
              zIndex: 15
            }}
          >
            {currentTitle.accessTier === 'vip_premium' && user?.tier !== 'vip_premium' ? (
              <button
                onClick={() => onOpenDetails(currentTitle)}
                style={{
                  padding: '11px clamp(16px, 3.5vw, 26px)',
                  minHeight: '44px',
                  fontSize: 'clamp(0.86rem, 2vw, 1.02rem)',
                  fontWeight: 800,
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #ffd700 0%, #ff9100 100%)',
                  color: '#000',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 20px rgba(255, 215, 0, 0.4)'
                }}
              >
                <Crown size={18} fill="#000" /> Watch with VIP
              </button>
            ) : (
              <button
                onClick={() => playTitle(currentTitle)}
                className="btn-primary"
                style={{
                  padding: '11px clamp(16px, 3.5vw, 28px)',
                  minHeight: '44px',
                  fontSize: 'clamp(0.88rem, 2vw, 1.02rem)',
                  fontWeight: 700,
                  borderRadius: '10px'
                }}
              >
                <Play size={18} fill="#fff" /> Watch Free Now
              </button>
            )}

            {/* My List Button: Prominent, zero-obstruction tap target */}
            <button
              onClick={() => toggleMyList(currentTitle.id)}
              className="btn-secondary"
              style={{
                padding: '11px clamp(14px, 2.5vw, 20px)',
                minHeight: '44px',
                fontSize: 'clamp(0.84rem, 1.8vw, 0.95rem)',
                borderRadius: '10px',
                borderColor: inList ? 'var(--accent-green)' : 'rgba(255,255,255,0.18)',
                background: inList ? 'rgba(0, 240, 118, 0.12)' : 'rgba(255,255,255,0.06)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
              aria-label={inList ? 'Remove from My List' : 'Add to My List'}
            >
              {inList ? <Check size={18} color="var(--accent-green)" /> : <Plus size={18} />}
              <span>{inList ? 'In My List' : 'My List'}</span>
            </button>

            {/* Details Button */}
            <button
              onClick={() => onOpenDetails(currentTitle)}
              className="btn-secondary"
              style={{
                padding: '11px clamp(12px, 2vw, 18px)',
                minHeight: '44px',
                fontSize: 'clamp(0.84rem, 1.8vw, 0.95rem)',
                borderRadius: '10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Info size={18} />
              <span>Details</span>
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Navigation Indicators */}
      <div
        style={{
          position: 'absolute',
          bottom: windowWidth < 768 ? '14px' : '24px',
          ...(windowWidth < 768
            ? { left: '50%', transform: 'translateX(-50%)' }
            : { right: '32px' }),
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 10,
          pointerEvents: 'auto'
        }}
      >
        <button
          onClick={() => setCurrentIndex((prev) => (prev - 1 + titles.length) % titles.length)}
          className="btn-secondary hide-on-mobile"
          style={{ width: '38px', height: '38px', padding: 0, borderRadius: '50%', justifyContent: 'center' }}
          title="Previous Spotlight"
          aria-label="Previous Spotlight"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Indicator Dots */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {titles.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrentIndex(i)}
              style={{
                width: i === currentIndex ? '22px' : '7px',
                height: '7px',
                borderRadius: '4px',
                background: i === currentIndex ? 'var(--accent-pink)' : 'rgba(255,255,255,0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % titles.length)}
          className="btn-secondary hide-on-mobile"
          style={{ width: '38px', height: '38px', padding: 0, borderRadius: '50%', justifyContent: 'center' }}
          title="Next Spotlight"
          aria-label="Next Spotlight"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};
