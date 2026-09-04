import React, { useState, useEffect } from 'react';
import { downloadEngine, DownloadItem } from '../../services/downloadEngine';
import { usePlayer } from '../../context/PlayerContext';
import { useAuth } from '../../context/AuthContext';
import { Download, Play, Trash2, HardDrive, ShieldCheck, Crown } from 'lucide-react';

export const MyDownloadsView: React.FC = () => {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const { playTitle } = usePlayer();
  const { user } = useAuth();

  useEffect(() => {
    setDownloads(downloadEngine.getDownloads());
  }, []);

  const handleDelete = (titleId: string) => {
    downloadEngine.deleteDownload(titleId);
    setDownloads(downloadEngine.getDownloads());
  };

  const totalMb = downloadEngine.getTotalStorageMb();

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '40px 32px', minHeight: '80vh' }}>
      {/* Header & Storage Gauge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Download size={22} color="var(--accent-pink)" />
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff' }}>VIP Offline Downloads</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Stream downloaded movies and episodes anywhere — even without an internet connection.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '16px 24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <HardDrive size={24} color="var(--accent-cyan)" />
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>OFFLINE STORAGE USED</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff' }}>
              {(totalMb / 1024).toFixed(2)} GB <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>/ 128 GB</span>
            </div>
          </div>
        </div>
      </div>

      {user?.tier !== 'vip_premium' && (
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', background: 'rgba(255, 215, 0, 0.1)', border: '1px solid #ffd700', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Crown size={24} color="#ffd700" />
            <div>
              <div style={{ fontWeight: 800, color: '#ffd700', fontSize: '1rem' }}>Offline Downloads are a VIP Feature</div>
              <div style={{ fontSize: '0.85rem', color: '#fff' }}>Upgrade to Tubi+ VIP to download unlimited movies and watch offline.</div>
            </div>
          </div>
        </div>
      )}

      {downloads.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px 20px', borderRadius: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <Download size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>No Downloads Yet</h3>
          <p style={{ fontSize: '0.9rem' }}>
            Click the download button on any title detail page to save it for offline viewing.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px' }}>
          {downloads.map((item) => (
            <div key={item.titleId} className="glass-panel" style={{ borderRadius: '14px', overflow: 'hidden', padding: '12px' }}>
              <div style={{ position: 'relative', aspectRatio: '2/3', borderRadius: '10px', overflow: 'hidden', marginBottom: '10px' }}>
                <img src={item.title.posterUrl} alt={item.title.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,240,118,0.9)', color: '#000', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 900 }}>
                  OFFLINE READY
                </div>
              </div>

              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.title.title}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px', marginBottom: '12px' }}>
                {item.sizeMb} MB • {item.quality}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => playTitle(item.title)}
                  className="btn-primary"
                  style={{ flex: 1, padding: '8px', fontSize: '0.85rem', justifyContent: 'center' }}
                >
                  <Play size={14} fill="#fff" /> Play Offline
                </button>
                <button
                  onClick={() => handleDelete(item.titleId)}
                  style={{ padding: '8px', background: 'rgba(255,42,109,0.15)', color: '#ff2a6d', borderRadius: '8px' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
