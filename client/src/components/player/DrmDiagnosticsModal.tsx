import React from 'react';
import { Title } from '../../types';
import { ShieldCheck, Activity, Cpu, HardDrive, Wifi, X } from 'lucide-react';

interface DrmDiagnosticsModalProps {
  title: Title;
  bitrateKbps: number;
  bufferSeconds: number;
  droppedFrames: number;
  currentResolution: string;
  fps: number;
  onClose: () => void;
}

export const DrmDiagnosticsModal: React.FC<DrmDiagnosticsModalProps> = ({
  title,
  bitrateKbps,
  bufferSeconds,
  droppedFrames,
  currentResolution,
  fps,
  onClose
}) => {
  return (
    <div
      className="glass-heavy animate-fade-in"
      style={{
        position: 'absolute',
        top: '80px',
        right: '32px',
        width: '380px',
        padding: '24px',
        borderRadius: '16px',
        boxShadow: '0 24px 60px rgba(0,0,0,0.95)',
        border: '1px solid rgba(5, 217, 232, 0.4)',
        zIndex: 60,
        color: '#fff'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={18} color="var(--accent-cyan)" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Stream QoS & DRM Inspector</h3>
        </div>
        <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
          <X size={18} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.84rem' }}>
        {/* DRM Status */}
        <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px 14px', borderRadius: '8px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.74rem', textTransform: 'uppercase', fontWeight: 700 }}>
            DRM Protection Scheme
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-green)', fontWeight: 700, marginTop: '2px' }}>
            <ShieldCheck size={16} /> {title.drm.drmType} ({title.drm.securityLevel} Hardware Enclave)
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            License Server: <code style={{ color: 'var(--accent-cyan)' }}>{title.drm.licenseServerUrl}</code>
          </div>
        </div>

        {/* Real-time ABR & Bitrate */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px', borderRadius: '8px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Resolution</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
              {currentResolution} @ {fps}fps
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px', borderRadius: '8px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Bitrate</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ff2a6d' }}>
              {(bitrateKbps / 1000).toFixed(2)} Mbps
            </div>
          </div>
        </div>

        {/* Buffer Health */}
        <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px 14px', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem' }}>Forward Buffer Length</span>
            <span style={{ fontWeight: 700, color: bufferSeconds > 10 ? 'var(--accent-green)' : '#ffb703' }}>
              {bufferSeconds.toFixed(1)}s (Target: 30s)
            </span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
            <div
              style={{
                width: `${Math.min(100, (bufferSeconds / 30) * 100)}%`,
                height: '100%',
                borderRadius: '3px',
                background: bufferSeconds > 10 ? 'var(--accent-green)' : '#ffb703'
              }}
            />
          </div>
        </div>

        {/* Codec & Diagnostics */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.78rem' }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Video Codec: </span>
            <span style={{ fontWeight: 600 }}>H.264 / AVC High</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Audio: </span>
            <span style={{ fontWeight: 600 }}>AAC / Dolby 5.1</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Dropped Frames: </span>
            <span style={{ fontWeight: 600, color: droppedFrames === 0 ? 'var(--accent-green)' : '#ff2a6d' }}>
              {droppedFrames}
            </span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>CDN Protocol: </span>
            <span style={{ fontWeight: 600 }}>HLS v6 (HTTP/2)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
