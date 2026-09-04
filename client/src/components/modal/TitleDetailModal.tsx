import React, { useEffect, useState } from 'react';
import { Title, Episode } from '../../types';
import { usePlayer } from '../../context/PlayerContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  Play, Plus, Check, Heart, X, Sparkles, Star, Film, Clock, ShieldCheck, ChevronRight
} from 'lucide-react';

interface TitleDetailModalProps {
  title: Title | null;
  onClose: () => void;
}

export const TitleDetailModal: React.FC<TitleDetailModalProps> = ({ title, onClose }) => {
  const { playTitle } = usePlayer();
  const { isInMyList, toggleMyList, isLiked, toggleLike } = useAuth();
  const [similarTitles, setSimilarTitles] = useState<{ title: Title; similarity: number }[]>([]);
  const [selectedSeason, setSelectedSeason] = useState(1);

  useEffect(() => {
    if (!title) return;
    api.getSimilarTitles(title.id, 6).then((res) => {
      if (res.success && res.recommendations) {
        setSimilarTitles(res.recommendations);
      }
    });
  }, [title]);

  if (!title) return null;

  const inList = isInMyList(title.id);
  const liked = isLiked(title.id);
  const seasons = title.seasons || [];
  const currentSeason = seasons.find((s) => s.seasonNumber === selectedSeason) || seasons[0];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div
        className="glass-heavy animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '960px',
          maxHeight: '90vh',
          borderRadius: '24px',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 25px 60px rgba(0,0,0,0.95)',
          border: '1px solid rgba(255, 42, 109, 0.3)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            zIndex: 50,
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          <X size={20} />
        </button>

        {/* Hero Backdrop Preview */}
        <div
          style={{
            position: 'relative',
            height: '380px',
            backgroundImage: `url(${title.backdropUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%'
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, transparent 0%, rgba(9,10,15,0.8) 70%, #090a0f 100%)'
            }}
          />

          <div
            style={{
              position: 'absolute',
              bottom: '24px',
              left: '36px',
              right: '36px',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '20px'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="badge-vip">100% FREE STREAM</span>
                <span style={{ color: 'var(--accent-green)', fontWeight: 800 }}>{title.matchScore}% Match</span>
                <span className="badge-rating">{title.rating}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{title.releaseYear}</span>
                <span className="badge-hd">4K UHD</span>
              </div>
              <h1 style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1.1, color: '#fff' }}>
                {title.title}
              </h1>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => {
                  onClose();
                  playTitle(title);
                }}
                className="btn-primary"
                style={{ padding: '14px 28px', fontSize: '1rem', fontWeight: 800 }}
              >
                <Play size={18} fill="#fff" /> Watch Now
              </button>

              <button
                onClick={() => toggleMyList(title.id)}
                className="btn-secondary"
                style={{ width: '46px', height: '46px', padding: 0, borderRadius: '50%', justifyContent: 'center' }}
                title="Add to My List"
              >
                {inList ? <Check size={18} color="var(--accent-green)" /> : <Plus size={18} />}
              </button>

              <button
                onClick={() => toggleLike(title.id)}
                className="btn-secondary"
                style={{ width: '46px', height: '46px', padding: 0, borderRadius: '50%', justifyContent: 'center' }}
                title="Like"
              >
                <Heart size={18} fill={liked ? 'var(--accent-pink)' : 'none'} color={liked ? 'var(--accent-pink)' : '#fff'} />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body Content */}
        <div style={{ padding: '24px 36px 40px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Synopsis & Metadata Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '8px' }}>Synopsis</h3>
              <p style={{ color: '#cbd5e1', fontSize: '0.96rem', lineHeight: 1.6, marginBottom: '16px' }}>
                {title.synopsis}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {title.genres.map((g) => (
                  <span
                    key={g}
                    style={{
                      background: 'rgba(255, 42, 109, 0.15)',
                      border: '1px solid rgba(255, 42, 109, 0.3)',
                      color: '#ff2a6d',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '4px'
                    }}
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <div>
                <strong style={{ color: '#fff' }}>Director:</strong> {title.director}
              </div>
              <div>
                <strong style={{ color: '#fff' }}>Starring:</strong> {title.cast.join(', ')}
              </div>
              <div>
                <strong style={{ color: '#fff' }}>Studio:</strong> {title.studio}
              </div>
              <div>
                <strong style={{ color: '#fff' }}>Audio Channels:</strong> Dolby Digital 5.1 / Atmos
              </div>
              <div>
                <strong style={{ color: '#fff' }}>Subtitles:</strong> English [CC], Spanish, French
              </div>
            </div>
          </div>

          {/* Series Episodes List (If TV Series) */}
          {title.type === 'series' && currentSeason && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Episodes</h3>
                <span style={{ fontSize: '0.88rem', color: 'var(--accent-pink)', fontWeight: 700 }}>
                  {currentSeason.title}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {currentSeason.episodes.map((ep) => (
                  <div
                    key={ep.id}
                    onClick={() => {
                      onClose();
                      playTitle(title, ep);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '12px',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 42, 109, 0.15)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                  >
                    <img
                      src={ep.thumbnailUrl}
                      alt={ep.title}
                      style={{ width: '120px', height: '68px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>
                        {ep.episodeNumber}. {ep.title}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {ep.synopsis}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {Math.floor(ep.durationSeconds / 60)}m
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ML Vector Recommendations: "More Like This" */}
          {similarTitles.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Sparkles size={18} color="var(--accent-pink)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                  More Like This <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>(AI Vector Match)</span>
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '14px' }}>
                {similarTitles.map(({ title: sim, similarity }) => (
                  <div
                    key={sim.id}
                    onClick={() => {
                      onClose();
                      playTitle(sim);
                    }}
                    style={{
                      cursor: 'pointer',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    <img
                      src={sim.posterUrl}
                      alt={sim.title}
                      style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, marginTop: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {sim.title}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--accent-green)', fontWeight: 800 }}>
                      {similarity}% Similarity
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
