import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { usePlayer } from '../../context/PlayerContext';
import { useAuth } from '../../context/AuthContext';
import { AdBreakOverlay } from './AdBreakOverlay';
import { DrmDiagnosticsModal } from './DrmDiagnosticsModal';
import { PauseAdOverlay } from './PauseAdOverlay';
import { InteractiveChoiceOverlay } from './InteractiveChoiceOverlay';
import {
  Play, Pause, Volume2, VolumeX, RotateCcw, RotateCw, Maximize, Minimize,
  Settings, MessageSquare, ShieldCheck, X, ChevronRight, Activity, Radio, AlertCircle, Users
} from 'lucide-react';
import { api } from '../../services/api';

export const VideoPlayer: React.FC = () => {
  const {
    isPlaying,
    activeTitle,
    activeEpisode,
    activeFastChannel,
    initialTimeSeconds,
    adBreaks,
    closePlayer,
    selectedQuality,
    setSelectedQuality,
    selectedSubtitle,
    setSelectedSubtitle,
    selectedAudio,
    setSelectedAudio
  } = usePlayer();

  const { user, updateWatchProgress } = useAuth();

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialTimeSeconds);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showSubtitleMenu, setShowSubtitleMenu] = useState(false);
  const [showDrmModal, setShowDrmModal] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Ad Break States
  const [currentAdBreak, setCurrentAdBreak] = useState<any | null>(null);
  const [triggeredBreakIds, setTriggeredBreakIds] = useState<Set<string>>(new Set());

  // QoS Stats
  const [currentBitrateKbps, setCurrentBitrateKbps] = useState(4500);
  const [bufferSeconds, setBufferSeconds] = useState(15);
  const [droppedFrames, setDroppedFrames] = useState(0);
  const [currentResolution, setCurrentResolution] = useState('1080p');

  const controlsTimeoutRef = useRef<any>(null);

  const isLive = !!activeFastChannel;
  const currentMedia = activeEpisode || activeTitle || activeFastChannel;
  const streamUrl = activeEpisode?.streamUrl || activeTitle?.streamUrl || activeFastChannel?.streamUrl || '';

  // Initialize HLS / HTML5 Video Stream (Supports .m3u8 and direct .mp4, .webm, Cloudinary URLs)
  useEffect(() => {
    if (!videoRef.current || !streamUrl) return;

    const video = videoRef.current;

    // Reset breaks
    setTriggeredBreakIds(new Set());
    setCurrentAdBreak(null);

    // Clean up previous HLS instance if any
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Determine if stream is an HLS playlist or a progressive video file (.mp4, .webm, Cloudinary video)
    const cleanUrl = streamUrl.split('?')[0].toLowerCase();
    const isHlsStream = cleanUrl.endsWith('.m3u8') || streamUrl.includes('/sp_auto/') || streamUrl.includes('.m3u8');

    if (isHlsStream && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: isLive,
        backBufferLength: 30
      });

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (initialTimeSeconds > 0) {
          video.currentTime = initialTimeSeconds;
        }
        video.play().catch(() => setIsPaused(true));
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        const level = hls.levels[data.level];
        if (level) {
          setCurrentBitrateKbps(Math.round(level.bitrate / 1000));
          setCurrentResolution(`${level.height}p`);
        }
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          console.warn('[VideoPlayer] HLS fatal error, falling back to native video tag:', data);
          hls.destroy();
          hlsRef.current = null;
          video.src = streamUrl;
          video.play().catch(() => setIsPaused(true));
        }
      });

      hlsRef.current = hls;
    } else {
      // Direct progressive video playback (.mp4, .webm, Cloudinary, Safari native HLS)
      video.src = streamUrl;

      const handleLoadedMetadata = () => {
        if (initialTimeSeconds > 0) {
          video.currentTime = initialTimeSeconds;
        }
        if (video.videoHeight) {
          setCurrentResolution(`${video.videoHeight}p`);
        }
        video.play().catch(() => setIsPaused(true));
      };

      video.addEventListener('loadedmetadata', handleLoadedMetadata);

      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        if (hlsRef.current) {
          hlsRef.current.destroy();
          hlsRef.current = null;
        }
      };
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [streamUrl, isLive]);

  // Video Time Update & Cue Point Triggers
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const time = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 0;
    setCurrentTime(time);
    setDuration(dur);

    // Calculate forward buffer length
    if (videoRef.current.buffered.length > 0) {
      const bufEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
      setBufferSeconds(Math.max(0, bufEnd - time));
    }

    // Save progress every 5 seconds for VOD
    if (activeTitle && Math.floor(time) % 5 === 0) {
      updateWatchProgress(activeTitle.id, Math.floor(time), Math.floor(dur));
    }

    // Check cue points for mid-roll ads (only if not VIP)
    if (user?.tier !== 'vip_premium' && adBreaks.length > 0 && !currentAdBreak) {
      adBreaks.forEach((brk) => {
        if (!triggeredBreakIds.has(brk.id) && Math.abs(time - brk.timeOffsetSeconds) < 1.5) {
          setTriggeredBreakIds((prev) => new Set(prev).add(brk.id));
          videoRef.current?.pause();
          setCurrentAdBreak(brk);
        }
      });
    }
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        seekRelative(-10);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        seekRelative(10);
      } else if (e.key === 'f') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'm') {
        e.preventDefault();
        toggleMute();
      } else if (e.key === 'd') {
        e.preventDefault();
        setShowDrmModal((prev) => !prev);
      } else if (e.key === 'Escape') {
        if (isFullscreen) {
          document.exitFullscreen();
        } else {
          closePlayer();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isPaused, isFullscreen]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPaused(false);
    } else {
      videoRef.current.pause();
      setIsPaused(true);
    }
  };

  const seekRelative = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
  };

  const handleSeekSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = parseFloat(e.target.value);
    setCurrentTime(target);
    if (videoRef.current) {
      videoRef.current.currentTime = target;
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (!isPaused && !showSettingsMenu && !showSubtitleMenu) {
        setShowControls(false);
      }
    }, 3500);
  };

  const handleAdComplete = () => {
    setCurrentAdBreak(null);
    if (videoRef.current) {
      videoRef.current.play();
      setIsPaused(false);
    }
  };

  if (!isPlaying || !currentMedia) return null;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        zIndex: 3000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none'
      }}
    >
      {/* HTML5 Video Element */}
      <video
        ref={videoRef}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPaused(false)}
        onPause={() => setIsPaused(true)}
        onClick={togglePlay}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        playsInline
      />

      {/* Shoppable Pause Ad Overlay */}
      {isPaused && user?.tier !== 'vip_premium' && !currentAdBreak && (
        <PauseAdOverlay />
      )}

      {/* Interactive Story Choice Overlay (at 40-50s) */}
      {currentTime >= 40 && currentTime <= 50 && (
        <InteractiveChoiceOverlay
          onChoiceMade={(choice) => {
            console.log('User made choice:', choice);
            if (videoRef.current) videoRef.current.currentTime = 55;
          }}
        />
      )}

      {/* Ad Break Overlay Engine */}
      {currentAdBreak && currentAdBreak.ads[0] && (
        <AdBreakOverlay
          ad={currentAdBreak.ads[0]}
          onAdComplete={handleAdComplete}
          titleId={activeTitle?.id}
          userId={user?.id}
        />
      )}

      {/* DRM & QoS Diagnostics Window */}
      {showDrmModal && activeTitle && (
        <DrmDiagnosticsModal
          title={activeTitle}
          bitrateKbps={currentBitrateKbps}
          bufferSeconds={bufferSeconds}
          droppedFrames={droppedFrames}
          currentResolution={currentResolution}
          fps={24}
          onClose={() => setShowDrmModal(false)}
        />
      )}

      {/* Player Control Overlay Layer */}
      {showControls && !currentAdBreak && (
        <div
          className="animate-fade-in"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 20%, transparent 70%, rgba(0,0,0,0.92) 100%)',
            padding: 'clamp(12px, 3vw, 24px) clamp(14px, 4vw, 32px)',
            pointerEvents: 'none'
          }}
        >
          {/* Top Bar: Title, Episode, Close, DRM Badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pointerEvents: 'auto', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
              <button
                onClick={closePlayer}
                style={{
                  width: '38px',
                  height: '38px',
                  minWidth: '38px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff'
                }}
              >
                <X size={20} />
              </button>

              <div style={{ minWidth: 0, overflow: 'hidden' }}>
                <div style={{ fontSize: 'clamp(0.95rem, 3.5vw, 1.25rem)', fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {activeFastChannel ? activeFastChannel.name : activeTitle?.title}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {activeEpisode
                    ? `S${activeEpisode.seasonNumber} E${activeEpisode.episodeNumber}: ${activeEpisode.title}`
                    : isLive
                    ? '🔴 24/7 Live Broadcast Stream'
                    : activeTitle?.genres.join(' • ')}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
              <button
                onClick={() => setShowDrmModal(!showDrmModal)}
                className="btn-secondary hide-on-compact-mobile"
                style={{ padding: '6px 12px', fontSize: '0.8rem', gap: '6px' }}
              >
                <ShieldCheck size={16} color="var(--accent-cyan)" />
                DRM {activeTitle?.drm.drmType || 'Protected'}
              </button>

              {user?.tier === 'vip_premium' && (
                <span className="badge-vip">VIP AD-FREE</span>
              )}
            </div>
          </div>

          {/* Center Play/Pause Large Feedback icon */}
          <div
            onClick={togglePlay}
            style={{
              alignSelf: 'center',
              cursor: 'pointer',
              pointerEvents: 'auto',
              opacity: isPaused ? 1 : 0,
              transition: 'opacity 0.2s',
              background: 'rgba(0,0,0,0.65)',
              padding: '24px',
              borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.3)'
            }}
          >
            <Play size={44} fill="#fff" />
          </div>

          {/* Bottom Bar: Timeline Scrubber + Action Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', pointerEvents: 'auto' }}>
            {/* Scrubber Bar with Yellow Cue Point Markers */}
            {!isLive && (
              <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeekSlider}
                  style={{
                    width: '100%',
                    accentColor: 'var(--accent-pink)',
                    cursor: 'pointer',
                    height: '6px'
                  }}
                />

                {/* Ad Cue Markers */}
                {duration > 0 &&
                  adBreaks.map((b) => {
                    const posPercent = (b.timeOffsetSeconds / duration) * 100;
                    return (
                      <div
                        key={b.id}
                        title={`Ad Break at ${formatTime(b.timeOffsetSeconds)}`}
                        style={{
                          position: 'absolute',
                          left: `${posPercent}%`,
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '6px',
                          height: '10px',
                          background: '#ffb703',
                          borderRadius: '2px',
                          pointerEvents: 'none'
                        }}
                      />
                    );
                  })}
              </div>
            )}

            {/* Bottom Buttons Row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* Left Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button onClick={togglePlay} style={{ color: '#fff' }}>
                  {isPaused ? <Play size={24} fill="#fff" /> : <Pause size={24} fill="#fff" />}
                </button>

                {!isLive && (
                  <>
                    <button onClick={() => seekRelative(-10)} style={{ color: '#fff' }}>
                      <RotateCcw size={20} />
                    </button>
                    <button onClick={() => seekRelative(10)} style={{ color: '#fff' }}>
                      <RotateCw size={20} />
                    </button>
                  </>
                )}

                {/* Volume Slider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button onClick={toggleMute} style={{ color: '#fff' }}>
                    {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  <input
                    type="range"
                    className="hide-on-compact-mobile"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    style={{ width: '80px', accentColor: 'var(--accent-pink)', cursor: 'pointer' }}
                  />
                </div>

                {/* Time Display */}
                <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>
                  {isLive ? (
                    <span style={{ color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Radio size={14} /> LIVE
                    </span>
                  ) : (
                    `${formatTime(currentTime)} / ${formatTime(duration)}`
                  )}
                </div>
              </div>

              {/* Right Controls: Subtitles, Quality, Speed, Fullscreen */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Subtitle Menu Toggle */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setShowSubtitleMenu(!showSubtitleMenu)}
                    style={{ color: selectedSubtitle !== 'none' ? 'var(--accent-pink)' : '#fff' }}
                  >
                    <MessageSquare size={20} />
                  </button>

                  {showSubtitleMenu && (
                    <div
                      className="glass-heavy animate-fade-in"
                      style={{
                        position: 'absolute',
                        bottom: '40px',
                        right: 0,
                        width: '180px',
                        padding: '12px',
                        borderRadius: '10px',
                        zIndex: 50,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}
                    >
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>SUBTITLES</div>
                      {['none', 'en', 'es', 'fr'].map((sub) => (
                        <button
                          key={sub}
                          onClick={() => {
                            setSelectedSubtitle(sub);
                            setShowSubtitleMenu(false);
                          }}
                          style={{
                            padding: '6px 10px',
                            textAlign: 'left',
                            borderRadius: '6px',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            background: selectedSubtitle === sub ? 'rgba(255, 42, 109, 0.2)' : 'transparent',
                            color: selectedSubtitle === sub ? '#ff2a6d' : '#fff'
                          }}
                        >
                          {sub === 'none' ? 'Off' : sub.toUpperCase() + ' (CC)'}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quality Switcher */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                    style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', fontWeight: 700 }}
                  >
                    <Settings size={20} />
                    <span>{selectedQuality}</span>
                  </button>

                  {showSettingsMenu && (
                    <div
                      className="glass-heavy animate-fade-in"
                      style={{
                        position: 'absolute',
                        bottom: '40px',
                        right: 0,
                        width: '180px',
                        padding: '12px',
                        borderRadius: '10px',
                        zIndex: 50,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}
                    >
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>STREAM QUALITY</div>
                      {['Auto', '1080p (6 Mbps)', '720p (3 Mbps)', '480p (1.2 Mbps)'].map((q) => {
                        const label = q.split(' ')[0];
                        return (
                          <button
                            key={q}
                            onClick={() => {
                              setSelectedQuality(label);
                              setShowSettingsMenu(false);
                            }}
                            style={{
                              padding: '6px 10px',
                              textAlign: 'left',
                              borderRadius: '6px',
                              fontSize: '0.82rem',
                              fontWeight: 600,
                              background: selectedQuality === label ? 'rgba(255, 42, 109, 0.2)' : 'transparent',
                              color: selectedQuality === label ? '#ff2a6d' : '#fff'
                            }}
                          >
                            {q}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Fullscreen Button */}
                <button onClick={toggleFullscreen} style={{ color: '#fff' }}>
                  {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
