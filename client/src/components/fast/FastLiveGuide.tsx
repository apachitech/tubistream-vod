import React, { useEffect, useState } from 'react';
import { FastChannel, FastProgram } from '../../types';
import { api } from '../../services/api';
import { usePlayer } from '../../context/PlayerContext';
import { Radio, Play, Clock, Tv, Film, Sparkles, ChevronRight, Info } from 'lucide-react';

export const FastLiveGuide: React.FC = () => {
  const [channels, setChannels] = useState<FastChannel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<FastChannel | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<FastProgram | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const { playFastChannel } = usePlayer();

  useEffect(() => {
    api.getFastChannels().then((res) => {
      if (res.success && res.channels) {
        setChannels(res.channels);
        setSelectedChannel(res.channels[0]);
        setSelectedProgram(res.channels[0].currentProgram || res.channels[0].schedule[0] || null);
      }
    });
  }, []);

  const categories = ['All', 'Action', 'Movies', 'Sci-Fi', 'Comedy', 'News', 'Documentary'];

  const filteredChannels =
    selectedCategory === 'All'
      ? channels
      : channels.filter((c) => c.category.toLowerCase() === selectedCategory.toLowerCase());

  // Generate hourly time slots for the header
  const now = new Date();
  const currentHour = now.getHours();
  const timeSlots = [-1, 0, 1, 2, 3, 4].map((offset) => {
    const h = (currentHour + offset + 24) % 24;
    return `${h.toString().padStart(2, '0')}:00`;
  });

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: 'clamp(20px, 4vw, 36px) clamp(14px, 3vw, 24px)', minHeight: '80vh' }}>
      {/* Header & Spotlight Live Banner */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#00f076',
              boxShadow: '0 0 12px #00f076',
              display: 'inline-block'
            }}
          />
          <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.4rem)', fontWeight: 900, color: '#fff' }}>24/7 Live FAST TV Channels</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Stream continuous live programming across sports, movies, news, anime, and comedies — 100% free with live EPG schedule.
        </p>
      </div>

      {/* Selected Program Live Preview Stage */}
      {selectedChannel && selectedProgram && (
        <div
          className="glass-panel responsive-two-col"
          style={{
            borderRadius: '16px',
            overflow: 'hidden',
            marginBottom: '32px',
            display: 'grid',
            gridTemplateColumns: 'minmax(280px, 460px) 1fr',
            border: '1px solid rgba(0, 240, 118, 0.3)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.6)'
          }}
        >
          {/* Thumbnail / Channel Poster */}
          <div style={{ position: 'relative', minHeight: '220px', background: '#000' }}>
            <img
              src={selectedProgram.thumbnailUrl || selectedChannel.logoUrl}
              alt={selectedProgram.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(6px)',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 800,
                color: '#00f076'
              }}
            >
              <Radio size={14} /> LIVE ON AIR • CH {selectedChannel.channelNumber}
            </div>
          </div>

          {/* Program Info */}
          <div style={{ padding: 'clamp(18px, 3vw, 28px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-pink)', textTransform: 'uppercase', marginBottom: '6px' }}>
              {selectedChannel.name} • {selectedProgram.genre}
            </div>
            <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>
              {selectedProgram.title}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '20px' }}>
              {selectedProgram.synopsis}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={() => playFastChannel(selectedChannel)}
                className="btn-primary"
                style={{
                  padding: '12px 28px',
                  fontSize: '0.98rem',
                  background: 'linear-gradient(135deg, #00f076 0%, #05d9e8 100%)',
                  color: '#000',
                  fontWeight: 800
                }}
              >
                <Play size={18} fill="#000" /> Tune In Live Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Pills Filter */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '24px' }} className="no-scrollbar scroll-touch">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 700,
              background: selectedCategory === cat ? '#00f076' : 'rgba(255,255,255,0.06)',
              color: selectedCategory === cat ? '#000' : 'var(--text-secondary)',
              border: selectedCategory === cat ? 'none' : '1px solid rgba(255,255,255,0.1)',
              transition: 'all 0.2s',
              flexShrink: 0
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Electronic Program Guide (EPG) Timetable Grid */}
      <div
        className="glass-panel scroll-touch"
        style={{
          borderRadius: '16px',
          overflowX: 'auto',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <div style={{ minWidth: '820px' }}>
          {/* Timeline Header Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '240px repeat(6, 1fr)',
              background: 'rgba(9, 10, 15, 0.95)',
              borderBottom: '1px solid var(--border-subtle)',
              padding: '12px 0',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: 'var(--text-muted)'
            }}
          >
          <div style={{ paddingLeft: '24px' }}>CHANNELS</div>
          {timeSlots.map((slot, i) => (
            <div
              key={slot}
              style={{
                textAlign: 'center',
                color: i === 1 ? '#00f076' : 'var(--text-muted)',
                fontWeight: i === 1 ? 800 : 600
              }}
            >
              {slot} {i === 1 && '(NOW)'}
            </div>
          ))}
        </div>

        {/* Channels Schedule Rows */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {filteredChannels.map((channel) => (
            <div
              key={channel.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '240px repeat(6, 1fr)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                minHeight: '80px',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              {/* Channel Header Cell */}
              <div
                onClick={() => {
                  setSelectedChannel(channel);
                  if (channel.currentProgram) setSelectedProgram(channel.currentProgram);
                }}
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  borderRight: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  background: selectedChannel?.id === channel.id ? 'rgba(0, 240, 118, 0.1)' : 'transparent'
                }}
              >
                <img
                  src={channel.logoUrl}
                  alt={channel.name}
                  style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#00f076', fontWeight: 800 }}>
                    CH {channel.channelNumber}
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {channel.name}
                  </div>
                </div>
              </div>

              {/* Programs Slots across timeline */}
              {channel.schedule.map((prog, idx) => (
                <div
                  key={prog.id}
                  onClick={() => {
                    setSelectedChannel(channel);
                    setSelectedProgram(prog);
                  }}
                  style={{
                    padding: '12px 16px',
                    borderRight: '1px solid rgba(255, 255, 255, 0.04)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    background:
                      selectedProgram?.id === prog.id
                        ? 'rgba(0, 240, 118, 0.15)'
                        : idx === 1
                        ? 'rgba(255, 42, 109, 0.08)'
                        : 'transparent',
                    borderLeft: selectedProgram?.id === prog.id ? '2px solid #00f076' : 'none'
                  }}
                >
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {prog.title}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {prog.durationMinutes}m • {prog.genre}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  );
};
