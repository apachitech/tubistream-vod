import React from 'react';
import { Film, ShieldCheck, Tv, Smartphone, Cast, Globe } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export const Footer: React.FC = () => {
  const { siteName, siteDescription, footerCopyright } = useSiteSettings();

  return (
    <footer
      style={{
        background: '#07080c',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '60px 24px 40px',
        marginTop: '80px'
      }}
    >
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        {/* Top Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '40px',
            marginBottom: '40px'
          }}
        >
          {/* Col 1: Brand & Tagline */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #ff2a6d 0%, #ff6e00 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Film size={18} color="#fff" />
              </div>
              <span style={{ fontSize: '1.3rem', fontWeight: 900, letterSpacing: '-0.02em' }}>{siteName}</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
              {siteDescription}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-green)', fontSize: '0.8rem', fontWeight: 600 }}>
              <ShieldCheck size={16} /> Widevine & ClearKey DRM Certified
            </div>
          </div>

          {/* Col 2: Browse Content */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Browse Catalog
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <li><a href="#" style={{ transition: 'color 0.2s' }}>Action & Blockbusters</a></li>
              <li><a href="#" style={{ transition: 'color 0.2s' }}>Sci-Fi & Cyberpunk</a></li>
              <li><a href="#" style={{ transition: 'color 0.2s' }}>Critically Acclaimed Dramas</a></li>
              <li><a href="#" style={{ transition: 'color 0.2s' }}>24/7 Live FAST TV Channels</a></li>
              <li><a href="#" style={{ transition: 'color 0.2s' }}>Tubi Originals & Exclusives</a></li>
            </ul>
          </div>

          {/* Col 3: Supported Devices */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Watch Everywhere
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Tv size={14} color="var(--accent-pink)" /> Samsung Smart TV & LG webOS</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Tv size={14} color="var(--accent-pink)" /> Roku & Amazon Fire TV</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Cast size={14} color="var(--accent-pink)" /> Apple TV 4K & Google TV</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Smartphone size={14} color="var(--accent-pink)" /> iOS, iPadOS & Android</li>
            </ul>
          </div>

          {/* Col 4: Platform Architecture */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Architecture
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Built with cloud-native microservices, adaptive HLS/DASH streaming with ABR switching, IAB VAST 4.2 / VMAP 1.0 SSAI & CSAI ad engine, and machine learning vector recommendations.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            paddingTop: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}
        >
          <div>{footerCopyright}</div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="#" style={{ color: 'var(--text-muted)' }}>Privacy Policy</a>
            <a href="#" style={{ color: 'var(--text-muted)' }}>Terms of Service</a>
            <a href="#" style={{ color: 'var(--text-muted)' }}>Ad Choices</a>
            <a href="#" style={{ color: 'var(--text-muted)' }}>Do Not Sell My Info</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
