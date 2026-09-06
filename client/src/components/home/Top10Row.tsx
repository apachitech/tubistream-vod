import React, { useRef } from 'react';
import { Title } from '../../types';
import { usePlayer } from '../../context/PlayerContext';
import { ChevronLeft, ChevronRight, Flame, Play } from 'lucide-react';

interface Top10RowProps {
  titles: Title[];
  onOpenDetails: (title: Title) => void;
}

export const Top10Row: React.FC<Top10RowProps> = ({ titles, onOpenDetails }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const { playTitle } = usePlayer();

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      rowRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!titles || titles.length === 0) return null;

  return (
    <section style={{ margin: '40px 0', position: 'relative' }}>
      <div
        className="content-row-header"
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 32px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <Flame size={24} color="#ff2a6d" />
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#fff' }}>
          Top 10 in Movies & TV Today
        </h2>
      </div>

      <div style={{ position: 'relative', width: '100%' }}>
        <button
          onClick={() => scroll('left')}
          className="hide-on-mobile"
          style={{
            position: 'absolute',
            left: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 40,
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'rgba(9, 10, 15, 0.85)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ChevronLeft size={24} />
        </button>

        <div
          ref={rowRef}
          className="no-scrollbar content-row-track scroll-touch"
          style={{
            display: 'flex',
            gap: '20px',
            overflowX: 'auto',
            padding: '10px 32px 30px',
            maxWidth: '1440px',
            margin: '0 auto',
            scrollSnapType: 'x mandatory'
          }}
        >
          {titles.slice(0, 10).map((t, index) => (
            <div
              key={t.id}
              className="tv-focusable"
              tabIndex={0}
              onClick={() => onOpenDetails(t)}
              style={{
                display: 'flex',
                alignItems: 'center',
                flex: '0 0 auto',
                cursor: 'pointer',
                transition: 'transform 0.25s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              {/* Massive Styled Rank Number */}
              <div
                style={{
                  fontSize: 'clamp(5rem, 14vw, 9rem)',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 900,
                  lineHeight: 0.8,
                  letterSpacing: '-0.08em',
                  marginRight: 'clamp(-20px, -4vw, -28px)',
                  zIndex: 2,
                  WebkitTextStroke: '3px rgba(255, 42, 109, 0.8)',
                  color: '#090a0f',
                  textShadow: '0 0 20px rgba(255, 42, 109, 0.5)',
                  userSelect: 'none'
                }}
              >
                {index + 1}
              </div>

              {/* Poster Card */}
              <div
                style={{
                  position: 'relative',
                  width: 'clamp(120px, 34vw, 180px)',
                  aspectRatio: '2/3',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  background: 'var(--bg-card)',
                  boxShadow: 'var(--shadow-card)',
                  border: '1px solid var(--border-subtle)',
                  zIndex: 1
                }}
              >
                <img
                  src={t.posterUrl}
                  alt={t.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className="hide-on-mobile"
          style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 40,
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'rgba(9, 10, 15, 0.85)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
};
