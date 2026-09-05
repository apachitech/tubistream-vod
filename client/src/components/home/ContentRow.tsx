import React, { useRef } from 'react';
import { Title } from '../../types';
import { MediaCard, CardVariant } from './MediaCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ContentRowProps {
  title: string;
  subtitle?: string;
  titles: Title[];
  onOpenDetails: (title: Title) => void;
  icon?: React.ReactNode;
  progressData?: { [titleId: string]: { progress: number; duration: number } };
  variant?: CardVariant;
}

export const ContentRow: React.FC<ContentRowProps> = ({
  title,
  subtitle,
  titles,
  onOpenDetails,
  icon,
  progressData,
  variant = 'portrait'
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

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
      {/* Row Header */}
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 32px 14px',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {icon && <span style={{ color: 'var(--accent-pink)' }}>{icon}</span>}
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#fff' }}>{title}</h2>
          </div>
          {subtitle && (
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Carousel Container */}
      <div style={{ position: 'relative', width: '100%' }}>
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
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
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.6)'
          }}
        >
          <ChevronLeft size={24} />
        </button>

        {/* Scrollable Track */}
        <div
          ref={rowRef}
          className="no-scrollbar"
          style={{
            display: 'flex',
            gap: '16px',
            overflowX: 'auto',
            padding: '10px 32px 30px',
            maxWidth: '1440px',
            margin: '0 auto',
            scrollSnapType: 'x mandatory'
          }}
        >
          {titles.map((t) => {
            const p = progressData?.[t.id];
            return (
              <MediaCard
                key={t.id}
                title={t}
                onOpenDetails={onOpenDetails}
                progressSeconds={p?.progress}
                durationSeconds={p?.duration}
                variant={variant}
              />
            );
          })}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
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
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.6)'
          }}
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
};
