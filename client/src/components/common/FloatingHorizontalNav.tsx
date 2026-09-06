import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MoveHorizontal, X, ArrowLeftRight } from 'lucide-react';

interface FloatingHorizontalNavProps {
  className?: string;
}

export const FloatingHorizontalNav: React.FC<FloatingHorizontalNavProps> = ({ className = '' }) => {
  const [shouldShow, setShouldShow] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Check if viewport is compact or if any layout element is currently wider than the screen
  useEffect(() => {
    const checkOverflow = () => {
      const isMobileOrTablet = window.innerWidth <= 1024;
      const docOverflow = document.documentElement.scrollWidth > window.innerWidth + 5;
      const bodyOverflow = document.body.scrollWidth > window.innerWidth + 5;
      const hasTableWrapper = document.querySelectorAll('.table-responsive-wrapper').length > 0;

      if (isMobileOrTablet || docOverflow || bodyOverflow || hasTableWrapper) {
        setShouldShow(true);
      } else {
        setShouldShow(false);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    // Also periodically check in case dynamic content/tab changed
    const interval = setInterval(checkOverflow, 1500);

    return () => {
      window.removeEventListener('resize', checkOverflow);
      clearInterval(interval);
    };
  }, []);

  const handlePan = (direction: 'left' | 'right') => {
    const delta = direction === 'left' ? -360 : 360;

    // 1. Pan any visible responsive table or horizontal container in the viewport
    const scrollContainers = document.querySelectorAll('.table-responsive-wrapper, .admin-cms-nav-bar > div, .content-row-track');
    let containerScrolled = false;

    scrollContainers.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView && el.scrollWidth > el.clientWidth) {
        el.scrollBy({ left: delta, behavior: 'smooth' });
        containerScrolled = true;
      }
    });

    // 2. Pan document and window horizontally if the page itself has horizontal overflow
    window.scrollBy({ left: delta, behavior: 'smooth' });
    if (document.documentElement.scrollWidth > window.innerWidth) {
      document.documentElement.scrollBy({ left: delta, behavior: 'smooth' });
    }
  };

  if (!shouldShow) return null;

  if (isMinimized) {
    return (
      <button
        type="button"
        onClick={() => setIsMinimized(false)}
        className="floating-horizontal-nav"
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          padding: 0,
          justifyContent: 'center',
          cursor: 'pointer'
        }}
        title="Open Horizontal Pan Controls"
        aria-label="Open Horizontal Pan Controls"
      >
        <ArrowLeftRight size={18} color="#c77dff" />
      </button>
    );
  }

  return (
    <div
      className={`floating-horizontal-nav ${className}`}
      role="toolbar"
      aria-label="Horizontal Page Navigation Controls"
    >
      {/* Pan Left Button */}
      <button
        type="button"
        onClick={() => handlePan('left')}
        className="floating-nav-btn"
        title="Navigate / Pan Left to view preceding columns & content"
        aria-label="Navigate Left"
      >
        <ChevronLeft size={16} />
        <span>Left</span>
      </button>

      {/* Center Label / Swipe Icon */}
      <div className="floating-nav-label" title="Layout extends horizontally — click Left/Right or swipe">
        <MoveHorizontal size={14} />
        <span>Pan Page</span>
      </div>

      {/* Pan Right Button */}
      <button
        type="button"
        onClick={() => handlePan('right')}
        className="floating-nav-btn"
        title="Navigate / Pan Right to view all table actions, status & details"
        aria-label="Navigate Right"
      >
        <span>Right</span>
        <ChevronRight size={16} />
      </button>

      {/* Minimize Toggle */}
      <button
        type="button"
        onClick={() => setIsMinimized(true)}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          padding: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          marginLeft: '2px',
          transition: 'color 0.2s ease'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        title="Minimize controller"
        aria-label="Minimize controller"
      >
        <X size={13} />
      </button>
    </div>
  );
};
