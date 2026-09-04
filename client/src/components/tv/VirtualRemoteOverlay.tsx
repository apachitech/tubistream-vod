import React from 'react';
import { useDeviceMode } from '../../context/DeviceModeContext';
import {
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Circle, ArrowLeft, Home,
  Play, Pause, Volume2, VolumeX, X, Radio
} from 'lucide-react';

export const VirtualRemoteOverlay: React.FC = () => {
  const { isVirtualRemoteOpen, setIsVirtualRemoteOpen } = useDeviceMode();

  if (!isVirtualRemoteOpen) return null;

  const triggerKey = (key: string) => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
  };

  return (
    <div
      className="glass-heavy animate-fade-in"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '210px',
        padding: '18px 14px',
        borderRadius: '28px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.95)',
        border: '2px solid rgba(255, 42, 109, 0.5)',
        zIndex: 4000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '14px',
        userSelect: 'none'
      }}
    >
      {/* Remote Header */}
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 6px' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--accent-pink)', letterSpacing: '0.08em' }}>
          SMART TV REMOTE
        </span>
        <button onClick={() => setIsVirtualRemoteOpen(false)} style={{ color: 'var(--text-muted)' }}>
          <X size={16} />
        </button>
      </div>

      {/* Top Controls: Back & Home */}
      <div style={{ display: 'flex', gap: '16px', width: '100%', justifyContent: 'center' }}>
        <button
          onClick={() => triggerKey('Backspace')}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}
          title="Back"
        >
          <ArrowLeft size={16} />
        </button>
        <button
          onClick={() => triggerKey('Escape')}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}
          title="Home / Close"
        >
          <Home size={16} />
        </button>
      </div>

      {/* D-PAD Nav Wheel */}
      <div
        style={{
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.15)',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* UP */}
        <button
          onClick={() => triggerKey('ArrowUp')}
          style={{
            position: 'absolute',
            top: '6px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#fff',
            padding: '6px'
          }}
        >
          <ChevronUp size={24} />
        </button>

        {/* DOWN */}
        <button
          onClick={() => triggerKey('ArrowDown')}
          style={{
            position: 'absolute',
            bottom: '6px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#fff',
            padding: '6px'
          }}
        >
          <ChevronDown size={24} />
        </button>

        {/* LEFT */}
        <button
          onClick={() => triggerKey('ArrowLeft')}
          style={{
            position: 'absolute',
            left: '6px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#fff',
            padding: '6px'
          }}
        >
          <ChevronLeft size={24} />
        </button>

        {/* RIGHT */}
        <button
          onClick={() => triggerKey('ArrowRight')}
          style={{
            position: 'absolute',
            right: '6px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#fff',
            padding: '6px'
          }}
        >
          <ChevronRight size={24} />
        </button>

        {/* CENTER OK BUTTON */}
        <button
          onClick={() => triggerKey('Enter')}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ff2a6d 0%, #ff6e00 100%)',
            color: '#fff',
            fontWeight: 800,
            fontSize: '0.85rem',
            boxShadow: '0 0 16px rgba(255, 42, 109, 0.6)'
          }}
        >
          OK
        </button>
      </div>

      {/* Play / Pause & Volume Controls */}
      <div style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'center' }}>
        <button
          onClick={() => triggerKey(' ')}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}
          title="Play / Pause"
        >
          <Play size={16} fill="#fff" />
        </button>

        <button
          onClick={() => triggerKey('m')}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}
          title="Mute"
        >
          <Volume2 size={16} />
        </button>
      </div>
    </div>
  );
};
