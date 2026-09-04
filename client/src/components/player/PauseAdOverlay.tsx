import React from 'react';
import { ExternalLink, QrCode, ShoppingBag } from 'lucide-react';

export const PauseAdOverlay: React.FC = () => {
  return (
    <div
      className="glass-heavy animate-fade-in"
      style={{
        position: 'absolute',
        top: '80px',
        left: '40px',
        width: '320px',
        padding: '20px',
        borderRadius: '16px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.9)',
        border: '1px solid rgba(255, 215, 0, 0.4)',
        pointerEvents: 'auto',
        zIndex: 65
      }}
    >
      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ffd700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
        SPONSORED PAUSE AD
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
        <img
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200"
          alt="Nike Air Max"
          style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px' }}
        />
        <div>
          <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#fff' }}>
            Nike Air Max Pulse 2026
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Get 20% off with promo code <strong style={{ color: '#00f076' }}>TUBI20</strong>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.04)', padding: '10px', borderRadius: '10px' }}>
        <div style={{ background: '#fff', padding: '4px', borderRadius: '6px' }}>
          <QrCode size={40} color="#000" />
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          Scan QR code with your phone camera to order directly from Tubi Marketplace.
        </div>
      </div>
    </div>
  );
};
