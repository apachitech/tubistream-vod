import React, { useState } from 'react';
import { Title } from '../../types';
import { usePlayer } from '../../context/PlayerContext';
import { useAuth } from '../../context/AuthContext';
import { Play, Plus, Check, Heart, ChevronDown, Crown, Info, Sparkles } from 'lucide-react';

export type CardVariant = 'portrait' | 'landscape' | 'landscape-large';

interface MediaCardProps {
  title: Title;
  onOpenDetails: (title: Title) => void;
  progressSeconds?: number;
  durationSeconds?: number;
  variant?: CardVariant;
  fullWidth?: boolean;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  title,
  onOpenDetails,
  progressSeconds,
  durationSeconds,
  variant = 'portrait',
  fullWidth = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { playTitle } = usePlayer();
  const { user, isInMyList, toggleMyList, isLiked, toggleLike } = useAuth();

  const inList = isInMyList(title.id);
  const liked = isLiked(title.id);
  const isVipOnly = title.accessTier === 'vip_premium';
  const hasVipAccess = !isVipOnly || user?.tier === 'vip_premium';

  const progressPercent =
    progressSeconds && durationSeconds && durationSeconds > 0
      ? Math.min(100, Math.round((progressSeconds / durationSeconds) * 100))
      : 0;

  const remainingMinutes =
    progressSeconds && durationSeconds && durationSeconds > progressSeconds
      ? Math.max(1, Math.round((durationSeconds - progressSeconds) / 60))
      : 0;

  // Use backdrop for landscape modes with fallback to poster
  const imageSrc =
    variant === 'portrait'
      ? title.posterUrl
      : title.backdropUrl || title.posterUrl;

  // Sizing by variant
  const cardWidth = fullWidth
    ? '100%'
    : variant === 'landscape-large'
    ? '440px'
    : variant === 'landscape'
    ? '310px'
    : '200px';

  const flexSetting = fullWidth ? '1 1 auto' : '0 0 auto';

  const aspectRatio = variant === 'portrait' ? '2/3' : '16/9';

  // Render Plan Badge (VIP Gold vs Free Neon)
  const renderAccessBadge = () => {
    if (isVipOnly) {
      return (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'linear-gradient(135deg, #ffd700 0%, #ff8c00 100%)',
            color: '#000',
            fontSize: '0.62rem',
            fontWeight: 900,
            padding: '2px 7px',
            borderRadius: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            boxShadow: '0 2px 10px rgba(255, 215, 0, 0.5)',
            zIndex: 5
          }}
        >
          <Crown size={11} fill="#000" /> VIP
        </div>
      );
    }
    return (
      <div
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(6px)',
          border: '1px solid rgba(0, 245, 212, 0.4)',
          color: 'var(--accent-green)',
          fontSize: '0.62rem',
          fontWeight: 800,
          padding: '2px 6px',
          borderRadius: '4px',
          letterSpacing: '0.03em',
          zIndex: 5
        }}
      >
        FREE
      </div>
    );
  };

  // -------------------------------------------------------------
  // FORM 1: LANDSCAPE LARGE (Hero / Cinematic Spotlight Card)
  // -------------------------------------------------------------
  if (variant === 'landscape-large') {
    return (
      <div
        className="tv-focusable"
        tabIndex={0}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'relative',
          flex: flexSetting,
          width: cardWidth,
          borderRadius: 'var(--radius-lg)',
          cursor: 'pointer',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
          transform: isHovered ? 'scale(1.03) translateY(-4px)' : 'scale(1)',
          zIndex: isHovered ? 25 : 1
        }}
      >
        <div
          onClick={() => onOpenDetails(title)}
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16/9',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            background: 'var(--bg-card)',
            boxShadow: isHovered
              ? '0 16px 36px rgba(0,0,0,0.8), 0 0 24px rgba(255, 42, 109, 0.3)'
              : 'var(--shadow-card)',
            border: isHovered
              ? isVipOnly
                ? '1px solid #ffd700'
                : '1px solid var(--accent-pink)'
              : '1px solid var(--border-subtle)'
          }}
        >
          <img
            src={imageSrc}
            alt={title.title}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease',
              transform: isHovered ? 'scale(1.06)' : 'scale(1)'
            }}
          />

          {/* Dark Cinema Vignette Gradient Scrim */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, rgba(9, 10, 15, 0.96) 0%, rgba(9, 10, 15, 0.65) 45%, rgba(9, 10, 15, 0.1) 80%, transparent 100%)',
              zIndex: 2
            }}
          />

          {/* Top Left: Badges (Trending / 4K / Original) */}
          <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px', zIndex: 5 }}>
            {title.isOriginal ? (
              <div
                style={{
                  background: 'linear-gradient(135deg, #ff2a6d 0%, #ff6e00 100%)',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '2px 7px',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.6)'
                }}
              >
                Original
              </div>
            ) : (
              <div
                style={{
                  background: 'rgba(255, 42, 109, 0.25)',
                  border: '1px solid rgba(255, 42, 109, 0.5)',
                  color: '#ff8bb0',
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  letterSpacing: '0.04em'
                }}
              >
                SPOTLIGHT
              </div>
            )}
            <div
              style={{
                background: 'rgba(0,0,0,0.7)',
                color: '#fff',
                fontSize: '0.6rem',
                fontWeight: 800,
                padding: '2px 5px',
                borderRadius: '3px',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
            >
              4K UHD
            </div>
          </div>

          {/* Top Right: VIP / Free badge */}
          {renderAccessBadge()}

          {/* Bottom Card Content Info Panel */}
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '14px',
              right: '14px',
              zIndex: 4,
              display: 'flex',
              flexDirection: 'column',
              gap: '5px'
            }}
          >
            {/* Title */}
            <h3
              style={{
                fontSize: '1.12rem',
                fontWeight: 800,
                color: '#fff',
                textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {title.title}
            </h3>

            {/* Synopsis Excerpt (Clamped) */}
            <p
              style={{
                fontSize: '0.74rem',
                color: 'rgba(255,255,255,0.82)',
                lineHeight: 1.35,
                margin: 0,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {title.shortDescription || title.synopsis}
            </p>

            {/* Meta Row & Action Buttons */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '4px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem', color: '#c5c7d0' }}>
                <span style={{ color: 'var(--accent-green)', fontWeight: 800 }}>{title.matchScore}% Match</span>
                <span>•</span>
                <span>{title.releaseYear}</span>
                <span>•</span>
                <span className="badge-rating" style={{ padding: '1px 4px', fontSize: '0.64rem' }}>{title.rating}</span>
                <span>•</span>
                <span>{title.durationMinutes}m</span>
              </div>

              {/* Quick Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isVipOnly && !hasVipAccess) {
                      onOpenDetails(title);
                      return;
                    }
                    playTitle(title, undefined, progressSeconds || 0);
                  }}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: isVipOnly && !hasVipAccess ? 'linear-gradient(135deg, #ffd700, #ff8c00)' : 'var(--accent-pink)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isVipOnly && !hasVipAccess ? '#000' : '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  title={isVipOnly && !hasVipAccess ? 'VIP Only' : 'Play Now'}
                >
                  {isVipOnly && !hasVipAccess ? <Crown size={14} fill="#000" /> : <Play size={14} fill="#fff" />}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMyList(title.id);
                  }}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(6px)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                  title="Add to My List"
                >
                  {inList ? <Check size={13} color="var(--accent-green)" /> : <Plus size={13} />}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(title.id);
                  }}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(6px)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                  title="Like"
                >
                  <Heart size={13} fill={liked ? 'var(--accent-pink)' : 'none'} color={liked ? 'var(--accent-pink)' : '#fff'} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // FORM 2: LANDSCAPE (16:9 Standard Widescreen Card)
  // -------------------------------------------------------------
  if (variant === 'landscape') {
    return (
      <div
        className="tv-focusable"
        tabIndex={0}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'relative',
          flex: flexSetting,
          width: cardWidth,
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          transition: 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s ease',
          transform: isHovered ? 'scale(1.05) translateY(-4px)' : 'scale(1)',
          zIndex: isHovered ? 25 : 1
        }}
      >
        <div
          onClick={() => onOpenDetails(title)}
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16/9',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            background: 'var(--bg-card)',
            boxShadow: isHovered ? 'var(--shadow-glow)' : 'var(--shadow-card)',
            border: isHovered
              ? isVipOnly
                ? '1px solid #ffd700'
                : '1px solid var(--accent-pink)'
              : '1px solid var(--border-subtle)'
          }}
        >
          <img
            src={imageSrc}
            alt={title.title}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)'
            }}
          />

          {/* Dark gradient overlay for bottom info */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, rgba(9, 10, 15, 0.95) 0%, rgba(9, 10, 15, 0.5) 40%, transparent 80%)',
              zIndex: 2
            }}
          />

          {/* Plan Access Badge */}
          {renderAccessBadge()}

          {/* Tubi Original Badge */}
          {title.isOriginal && (
            <div
              style={{
                position: 'absolute',
                top: '8px',
                left: '8px',
                background: 'linear-gradient(135deg, #ff2a6d 0%, #ff6e00 100%)',
                color: '#fff',
                fontSize: '0.62rem',
                fontWeight: 800,
                padding: '2px 6px',
                borderRadius: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
                zIndex: 5
              }}
            >
              Original
            </div>
          )}

          {/* Center Play Button on Hover */}
          {isHovered && (
            <div
              className="animate-fade-in"
              style={{
                position: 'absolute',
                top: '40%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 6,
                pointerEvents: 'none'
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: isVipOnly && !hasVipAccess ? 'linear-gradient(135deg, #ffd700, #ff8c00)' : 'rgba(255, 42, 109, 0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.7)'
                }}
              >
                {isVipOnly && !hasVipAccess ? <Crown size={18} fill="#000" color="#000" /> : <Play size={20} fill="#fff" color="#fff" style={{ marginLeft: '2px' }} />}
              </div>
            </div>
          )}

          {/* Bottom Card Info */}
          <div
            style={{
              position: 'absolute',
              bottom: '8px',
              left: '10px',
              right: '10px',
              zIndex: 4
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: '0.92rem',
                color: '#fff',
                marginBottom: '4px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {title.title}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.72rem',
                color: 'var(--text-secondary)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>{title.matchScore}%</span>
                <span>•</span>
                <span>{title.durationMinutes ? `${title.durationMinutes}m` : title.releaseYear}</span>
                <span>•</span>
                <span className="badge-rating" style={{ padding: '0px 3px', fontSize: '0.62rem' }}>{title.rating}</span>
              </div>

              {/* Remaining time pill if continue watching */}
              {remainingMinutes > 0 && (
                <span style={{ color: 'var(--accent-cyan)', fontSize: '0.68rem', fontWeight: 600 }}>
                  {remainingMinutes}m left
                </span>
              )}
            </div>
          </div>

          {/* Continue Watching Progress Bar */}
          {progressPercent > 0 && (
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '4px',
                background: 'rgba(255,255,255,0.2)',
                zIndex: 6
              }}
            >
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: '100%',
                  background: 'var(--accent-gradient)'
                }}
              />
            </div>
          )}
        </div>

        {/* Hover Action Bar underneath */}
        {isHovered && (
          <div
            className="glass-heavy animate-fade-in"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              width: '100%',
              padding: '8px 10px',
              borderRadius: '0 0 var(--radius-md) var(--radius-md)',
              marginTop: '-2px',
              boxShadow: '0 12px 24px rgba(0,0,0,0.85)',
              border: '1px solid var(--accent-pink)',
              borderTop: 'none',
              zIndex: 35,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (isVipOnly && !hasVipAccess) {
                    onOpenDetails(title);
                    return;
                  }
                  playTitle(title, undefined, progressSeconds || 0);
                }}
                style={{
                  padding: '4px 10px',
                  borderRadius: '4px',
                  background: isVipOnly && !hasVipAccess ? 'linear-gradient(135deg, #ffd700, #ff8c00)' : 'var(--accent-pink)',
                  color: isVipOnly && !hasVipAccess ? '#000' : '#fff',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <Play size={12} fill="currentColor" /> {remainingMinutes > 0 ? 'Resume' : 'Play'}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMyList(title.id);
                }}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '4px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  cursor: 'pointer'
                }}
                title="My List"
              >
                {inList ? <Check size={13} color="var(--accent-green)" /> : <Plus size={13} />}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(title.id);
                }}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '4px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  cursor: 'pointer'
                }}
                title="Like"
              >
                <Heart size={13} fill={liked ? 'var(--accent-pink)' : 'none'} color={liked ? 'var(--accent-pink)' : '#fff'} />
              </button>
            </div>

            <button
              onClick={() => onOpenDetails(title)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: '0.72rem',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                cursor: 'pointer'
              }}
            >
              Info <ChevronDown size={14} />
            </button>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // FORM 3: PORTRAIT (2:3 Standard Classic Poster Card)
  // -------------------------------------------------------------
  return (
    <div
      className="tv-focusable"
      tabIndex={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        flex: flexSetting,
        width: cardWidth,
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        transition: 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s ease',
        transform: isHovered ? 'scale(1.06) translateY(-4px)' : 'scale(1)',
        zIndex: isHovered ? 30 : 1
      }}
    >
      {/* Poster Image Container */}
      <div
        onClick={() => onOpenDetails(title)}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '2/3',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          background: 'var(--bg-card)',
          boxShadow: isHovered ? 'var(--shadow-glow)' : 'var(--shadow-card)',
          border: isHovered
            ? isVipOnly
              ? '1px solid #ffd700'
              : '1px solid var(--accent-pink)'
            : '1px solid var(--border-subtle)'
        }}
      >
        <img
          src={title.posterUrl}
          alt={title.title}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
        />

        {/* Plan Access Badge: VIP Crown vs Free */}
        {renderAccessBadge()}

        {/* Tubi Original Badge */}
        {title.isOriginal && (
          <div
            style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              background: 'linear-gradient(135deg, #ff2a6d 0%, #ff6e00 100%)',
              color: '#fff',
              fontSize: '0.65rem',
              fontWeight: 800,
              padding: '2px 6px',
              borderRadius: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              boxShadow: '0 2px 8px rgba(0,0,0,0.6)'
            }}
          >
            Original
          </div>
        )}

        {/* Match score badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(6px)',
            color: 'var(--accent-green)',
            fontSize: '0.72rem',
            fontWeight: 800,
            padding: '2px 6px',
            borderRadius: '4px'
          }}
        >
          {title.matchScore}%
        </div>

        {/* Continue Watching Progress Bar */}
        {progressPercent > 0 && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '4px',
              background: 'rgba(255,255,255,0.2)'
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: 'var(--accent-gradient)'
              }}
            />
          </div>
        )}
      </div>

      {/* Hover Action Overlay Drawer */}
      {isHovered && (
        <div
          className="glass-heavy animate-fade-in"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            width: '100%',
            padding: '12px',
            borderRadius: '0 0 var(--radius-md) var(--radius-md)',
            marginTop: '-2px',
            boxShadow: '0 16px 32px rgba(0,0,0,0.9)',
            border: '1px solid var(--accent-pink)',
            borderTop: 'none',
            zIndex: 35
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: '0.88rem',
              color: '#fff',
              marginBottom: '6px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {title.title}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (isVipOnly && !hasVipAccess) {
                    onOpenDetails(title);
                    return;
                  }
                  playTitle(title, undefined, progressSeconds || 0);
                }}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: isVipOnly && !hasVipAccess ? 'linear-gradient(135deg, #ffd700, #ff8c00)' : 'var(--accent-pink)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isVipOnly && !hasVipAccess ? '#000' : '#fff',
                  boxShadow: isVipOnly && !hasVipAccess ? '0 2px 10px rgba(255, 215, 0, 0.6)' : '0 2px 10px rgba(255, 42, 109, 0.6)',
                  border: 'none',
                  cursor: 'pointer'
                }}
                title={isVipOnly && !hasVipAccess ? 'Unlock with Tubi+ VIP' : 'Play'}
              >
                {isVipOnly && !hasVipAccess ? <Crown size={15} fill="#000" /> : <Play size={15} fill="#fff" />}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMyList(title.id);
                }}
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                {inList ? <Check size={14} color="var(--accent-green)" /> : <Plus size={14} />}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(title.id);
                }}
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <Heart size={14} fill={liked ? 'var(--accent-pink)' : 'none'} color={liked ? 'var(--accent-pink)' : '#fff'} />
              </button>
            </div>

            <button
              onClick={() => onOpenDetails(title)}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: 'none',
                color: '#fff'
              }}
            >
              <ChevronDown size={16} />
            </button>
          </div>

          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span>{title.releaseYear}</span>
            <span>•</span>
            <span className="badge-rating" style={{ padding: '1px 4px', fontSize: '0.68rem' }}>{title.rating}</span>
            <span>•</span>
            <span>{title.genres[0]}</span>
          </div>
        </div>
      )}
    </div>
  );
};

