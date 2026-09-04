import React, { useState } from 'react';
import { Title } from '../../types';
import { usePlayer } from '../../context/PlayerContext';
import { useAuth } from '../../context/AuthContext';
import { Play, Plus, Check, Heart, ChevronDown, Sparkles, Crown } from 'lucide-react';

interface MediaCardProps {
  title: Title;
  onOpenDetails: (title: Title) => void;
  progressSeconds?: number;
  durationSeconds?: number;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  title,
  onOpenDetails,
  progressSeconds,
  durationSeconds
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

  return (
    <div
      className="tv-focusable"
      tabIndex={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        flex: '0 0 auto',
        width: '210px',
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
            ? isVipOnly ? '1px solid #ffd700' : '1px solid var(--accent-pink)'
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
        {isVipOnly ? (
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
        ) : (
          <div
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(0, 245, 212, 0.3)',
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
        )}

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
          <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#fff', marginBottom: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
                  boxShadow: isVipOnly && !hasVipAccess ? '0 2px 10px rgba(255, 215, 0, 0.6)' : '0 2px 10px rgba(255, 42, 109, 0.6)'
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
                  justifyContent: 'center'
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
                  justifyContent: 'center'
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
                justifyContent: 'center'
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
