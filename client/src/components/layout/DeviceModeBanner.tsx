import React from 'react';
import { useDeviceMode } from '../../context/DeviceModeContext';
import { Tv, Smartphone, Monitor, Gamepad2, X } from 'lucide-react';

export const DeviceModeBanner: React.FC = () => {
  const { deviceMode, setDeviceMode, isVirtualRemoteOpen, toggleVirtualRemote } = useDeviceMode();

  return (
    <div
      style={{
        background: 'linear-gradient(90deg, #101320 0%, #1a1528 50%, #101320 100%)',
        borderBottom: '1px solid rgba(255, 42, 109, 0.3)',
        padding: '6px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.82rem',
        color: '#9da7be',
        position: 'sticky',
        top: 0,
        zIndex: 1100
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            color: '#fff',
            fontWeight: 700,
            background: 'rgba(255, 42, 109, 0.18)',
            padding: '2px 8px',
            borderRadius: '4px',
            border: '1px solid rgba(255, 42, 109, 0.4)'
          }}
        >
          {deviceMode === 'web' && <Monitor size={14} color="#05d9e8" />}
          {deviceMode === 'mobile' && <Smartphone size={14} color="#ff6e00" />}
          {deviceMode === 'tv' && <Tv size={14} color="#ff2a6d" />}
          MODE: {deviceMode.toUpperCase()}
        </span>
        <span>
          {deviceMode === 'tv'
            ? '🎮 10-Foot Smart TV UI (Spatial D-Pad: Use Arrow Keys + Enter / Backspace)'
            : deviceMode === 'mobile'
            ? '📱 Mobile Viewport Simulation'
            : '🖥️ Web Cinema Experience'}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', padding: '2px' }}>
          <button
            onClick={() => setDeviceMode('web')}
            style={{
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 600,
              background: deviceMode === 'web' ? '#ff2a6d' : 'transparent',
              color: '#fff'
            }}
          >
            Web
          </button>
          <button
            onClick={() => setDeviceMode('mobile')}
            style={{
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 600,
              background: deviceMode === 'mobile' ? '#ff2a6d' : 'transparent',
              color: '#fff'
            }}
          >
            Mobile
          </button>
          <button
            onClick={() => setDeviceMode('tv')}
            style={{
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 600,
              background: deviceMode === 'tv' ? '#ff2a6d' : 'transparent',
              color: '#fff'
            }}
          >
            Smart TV
          </button>
        </div>

        {deviceMode === 'tv' && (
          <button
            onClick={toggleVirtualRemote}
            className="btn-secondary"
            style={{ padding: '4px 10px', fontSize: '0.75rem', gap: '4px' }}
          >
            <Gamepad2 size={13} />
            {isVirtualRemoteOpen ? 'Hide Remote' : 'Show Virtual Remote'}
          </button>
        )}
      </div>
    </div>
  );
};
