import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDeviceMode } from '../../context/DeviceModeContext';
import {
  Search, Tv, Crown, Film, Layers, LayoutDashboard, X, Check, Mic, Users, Download, Menu, ChevronDown
} from 'lucide-react';
import { Title } from '../../types';
import { api } from '../../services/api';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onOpenSubscriptionModal: () => void;
  onSelectTitle: (title: Title) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onOpenSubscriptionModal,
  onSelectTitle
}) => {
  const { user, activeProfile, switchProfile } = useAuth();
  const { deviceMode, setDeviceMode } = useDeviceMode();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Title[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [genres, setGenres] = useState<string[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1440);

  const searchRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    api.getGenres().then((res) => {
      if (res.success) setGenres(res.genres);
    });
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await api.getTitles({ q: searchQuery, limit: 6 });
        if (res.success) {
          setSearchResults(res.titles);
        }
      } catch (err) {
        console.error('Search failed', err);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(e.target as Node)) {
        setIsCategoryMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isCompactScreen = windowWidth < 1120 || deviceMode === 'mobile';

  return (
    <header
      className="glass-panel"
      style={{
        position: 'sticky',
        top: '33px', // below device mode banner
        zIndex: 1000,
        transition: 'all 0.3s ease',
        background: isScrolled ? 'rgba(9, 10, 15, 0.96)' : 'rgba(16, 18, 26, 0.88)',
        borderBottom: isScrolled ? '1px solid rgba(255, 42, 109, 0.2)' : '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: isScrolled ? '0 10px 30px rgba(0,0,0,0.85)' : 'none'
      }}
    >
      <div
        style={{
          maxWidth: '100%',
          width: '100%',
          margin: '0 auto',
          padding: '0 16px',
          height: '62px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          boxSizing: 'border-box'
        }}
      >
        {/* Left: Brand Logo & Desktop Nav Links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            minWidth: 0,
            flex: '1 1 auto'
          }}
        >
          {/* Mobile Menu Toggle Button (shown on compact/mobile screens) */}
          {isCompactScreen && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: isMobileMenuOpen ? 'rgba(255, 42, 109, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                border: isMobileMenuOpen ? '1px solid var(--accent-pink)' : '1px solid rgba(255, 255, 255, 0.1)',
                color: isMobileMenuOpen ? 'var(--accent-pink)' : '#fff',
                flexShrink: 0
              }}
              title="Toggle Navigation Menu"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}

          {/* Brand Logo */}
          <div
            onClick={() => {
              setCurrentView('home');
              setIsMobileMenuOpen(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              userSelect: 'none',
              flexShrink: 0
            }}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '9px',
                background: 'linear-gradient(135deg, #ff2a6d 0%, #ff6e00 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(255, 42, 109, 0.55)'
              }}
            >
              <Film size={18} color="#fff" />
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.3rem',
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  background: 'linear-gradient(90deg, #ffffff 0%, #ff2a6d 70%, #ff6e00 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1
                }}
              >
                tubi<span style={{ fontWeight: 400, color: '#fff' }}>stream</span>
              </div>
              <div
                style={{
                  fontSize: '0.58rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  color: 'var(--accent-cyan)',
                  textTransform: 'uppercase',
                  lineHeight: 1,
                  marginTop: '2px'
                }}
              >
                100% Free VOD & FAST
              </div>
            </div>
          </div>

          {/* Desktop Nav Links (Smooth horizontal scrollable container with hidden scrollbar) */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
              flex: '1 1 auto',
              minWidth: 0,
              padding: '2px 0'
            }}
          >
            {/* 1. Home */}
            <button
              onClick={() => setCurrentView('home')}
              style={{
                padding: '6px 10px',
                borderRadius: '7px',
                fontWeight: 600,
                fontSize: '0.86rem',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                color: currentView === 'home' ? '#fff' : 'var(--text-secondary)',
                background: currentView === 'home' ? 'rgba(255, 42, 109, 0.15)' : 'transparent',
                border: currentView === 'home' ? '1px solid rgba(255, 42, 109, 0.35)' : '1px solid transparent'
              }}
            >
              Home
            </button>

            {/* 2. Movies */}
            <button
              onClick={() => setCurrentView('movies')}
              style={{
                padding: '6px 10px',
                borderRadius: '7px',
                fontWeight: 600,
                fontSize: '0.86rem',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                color: currentView === 'movies' ? '#fff' : 'var(--text-secondary)',
                background: currentView === 'movies' ? 'rgba(255, 42, 109, 0.15)' : 'transparent',
                border: currentView === 'movies' ? '1px solid rgba(255, 42, 109, 0.35)' : '1px solid transparent'
              }}
            >
              Movies
            </button>

            {/* 3. TV Shows */}
            <button
              onClick={() => setCurrentView('series')}
              style={{
                padding: '6px 10px',
                borderRadius: '7px',
                fontWeight: 600,
                fontSize: '0.86rem',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                color: currentView === 'series' ? '#fff' : 'var(--text-secondary)',
                background: currentView === 'series' ? 'rgba(255, 42, 109, 0.15)' : 'transparent',
                border: currentView === 'series' ? '1px solid rgba(255, 42, 109, 0.35)' : '1px solid transparent'
              }}
            >
              TV Shows
            </button>

            {/* 4. Live FAST TV */}
            <button
              onClick={() => setCurrentView('live-fast')}
              style={{
                padding: '6px 11px',
                borderRadius: '7px',
                fontWeight: 700,
                fontSize: '0.86rem',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                color: currentView === 'live-fast' ? '#00f076' : '#fff',
                background: currentView === 'live-fast' ? 'rgba(0, 240, 118, 0.18)' : 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(0, 240, 118, 0.35)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#00f076',
                  boxShadow: '0 0 8px #00f076',
                  display: 'inline-block'
                }}
              />
              Live FAST TV
            </button>

            {/* 5. Categories Dropdown */}
            <div ref={categoryMenuRef} style={{ position: 'relative', flexShrink: 0 }}>
              <button
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '7px',
                  fontWeight: 600,
                  fontSize: '0.86rem',
                  whiteSpace: 'nowrap',
                  color: currentView.startsWith('genre-') ? '#fff' : 'var(--text-secondary)',
                  background: currentView.startsWith('genre-') ? 'rgba(255, 42, 109, 0.15)' : 'transparent',
                  border: currentView.startsWith('genre-') ? '1px solid rgba(255, 42, 109, 0.35)' : '1px solid transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Layers size={15} />
                Categories
                <ChevronDown size={13} style={{ opacity: 0.7 }} />
              </button>

              {isCategoryMenuOpen && (
                <div
                  className="glass-heavy animate-fade-in"
                  style={{
                    position: 'absolute',
                    top: '42px',
                    left: 0,
                    width: '300px',
                    padding: '12px',
                    borderRadius: '12px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.85)',
                    zIndex: 1005,
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '6px'
                  }}
                >
                  {genres.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => {
                        setIsCategoryMenuOpen(false);
                        setCurrentView(`genre-${genre}`);
                      }}
                      style={{
                        padding: '7px 10px',
                        textAlign: 'left',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        borderRadius: '6px',
                        color: currentView === `genre-${genre}` ? '#fff' : 'var(--text-secondary)',
                        background: currentView === `genre-${genre}` ? 'rgba(255, 42, 109, 0.25)' : 'rgba(255,255,255,0.03)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#fff';
                        e.currentTarget.style.background = 'rgba(255, 42, 109, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = currentView === `genre-${genre}` ? '#fff' : 'var(--text-secondary)';
                        e.currentTarget.style.background = currentView === `genre-${genre}` ? 'rgba(255, 42, 109, 0.25)' : 'rgba(255,255,255,0.03)';
                      }}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 6. My List */}
            <button
              onClick={() => setCurrentView('mylist')}
              style={{
                padding: '6px 10px',
                borderRadius: '7px',
                fontWeight: 600,
                fontSize: '0.86rem',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                color: currentView === 'mylist' ? '#fff' : 'var(--text-secondary)',
                background: currentView === 'mylist' ? 'rgba(255, 42, 109, 0.15)' : 'transparent',
                border: currentView === 'mylist' ? '1px solid rgba(255, 42, 109, 0.35)' : '1px solid transparent'
              }}
            >
              My List
            </button>

            {/* 7. Watch Party */}
            <button
              onClick={() => setCurrentView('party')}
              style={{
                padding: '6px 10px',
                borderRadius: '7px',
                fontWeight: 600,
                fontSize: '0.86rem',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                color: currentView === 'party' ? '#ff2a6d' : 'var(--text-secondary)',
                background: currentView === 'party' ? 'rgba(255, 42, 109, 0.15)' : 'transparent',
                border: currentView === 'party' ? '1px solid rgba(255, 42, 109, 0.35)' : '1px solid transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Users size={15} /> Party
            </button>

            {/* 8. Downloads */}
            <button
              onClick={() => setCurrentView('downloads')}
              style={{
                padding: '6px 10px',
                borderRadius: '7px',
                fontWeight: 600,
                fontSize: '0.86rem',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                color: currentView === 'downloads' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                background: currentView === 'downloads' ? 'rgba(5, 217, 232, 0.15)' : 'transparent',
                border: currentView === 'downloads' ? '1px solid rgba(5, 217, 232, 0.35)' : '1px solid transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Download size={15} /> Downloads
            </button>
          </nav>
        </div>

        {/* Right: Search, VIP, Activate TV, Admin, Profile */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexShrink: 0
          }}
        >
          {/* Compact Search Box with Speech Recognition */}
          <div ref={searchRef} style={{ position: 'relative' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.07)',
                borderRadius: 'var(--radius-full)',
                padding: '5px 10px',
                border: isSearchOpen ? '1px solid var(--accent-pink)' : '1px solid rgba(255,255,255,0.12)',
                width: isSearchOpen ? (windowWidth < 768 ? '160px' : '220px') : (windowWidth < 1280 ? '120px' : '150px'),
                transition: 'all 0.25s ease'
              }}
            >
              <Search size={14} color="var(--text-muted)" style={{ marginRight: '6px', flexShrink: 0 }} />
              <input
                type="text"
                placeholder={windowWidth < 1280 ? "Search..." : "Search movies, AI..."}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontSize: '0.80rem',
                  width: '100%',
                  minWidth: 0
                }}
              />
              {/* Voice Search Mic */}
              <button
                onClick={() => {
                  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                    const recognition = new SpeechRec();
                    recognition.onresult = (event: any) => {
                      const transcript = event.results[0][0].transcript;
                      setSearchQuery(transcript);
                      setIsSearchOpen(true);
                    };
                    recognition.start();
                  } else {
                    setSearchQuery('action movies with robots');
                    setIsSearchOpen(true);
                  }
                }}
                style={{ color: 'var(--accent-pink)', padding: '1px 3px', flexShrink: 0 }}
                title="Voice Search"
                aria-label="Voice Search"
              >
                <Mic size={14} />
              </button>
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{ color: 'var(--text-muted)', flexShrink: 0 }} aria-label="Clear search">
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Live Search Autocomplete Drawer */}
            {isSearchOpen && searchResults.length > 0 && (
              <div
                className="glass-heavy animate-fade-in"
                style={{
                  position: 'absolute',
                  top: '42px',
                  right: 0,
                  width: windowWidth < 480 ? '280px' : '340px',
                  padding: '10px',
                  borderRadius: '12px',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.9)',
                  zIndex: 1005,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0 4px' }}>
                  Matching Titles ({searchResults.length})
                </div>
                {searchResults.map((title) => (
                  <div
                    key={title.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                      onSelectTitle(title);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '6px 8px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: 'rgba(255,255,255,0.03)',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 42, 109, 0.15)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                  >
                    <img
                      src={title.posterUrl}
                      alt={title.title}
                      style={{ width: '36px', height: '50px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.84rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {title.title}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {title.releaseYear} • {title.rating} • {title.genres.slice(0, 2).join(', ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activate TV Button */}
          <button
            onClick={() => setCurrentView('activate-tv')}
            style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              padding: '5px 9px',
              borderRadius: '6px',
              background: currentView === 'activate-tv' ? 'rgba(5, 217, 232, 0.2)' : 'rgba(255,255,255,0.06)',
              border: currentView === 'activate-tv' ? '1px solid var(--accent-cyan)' : '1px solid rgba(255,255,255,0.12)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
            title="Link & Activate TV App"
          >
            <Tv size={13} color="var(--accent-cyan)" />
            <span>{windowWidth < 1200 ? 'TV' : 'Activate TV'}</span>
          </button>

          {/* VIP Premium Upgrade Button */}
          {user?.tier === 'vip_premium' ? (
            <span
              className="badge-vip"
              style={{
                fontSize: '0.72rem',
                padding: '4px 8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                flexShrink: 0
              }}
            >
              <Crown size={11} /> VIP
            </span>
          ) : (
            <button
              onClick={onOpenSubscriptionModal}
              className="btn-primary"
              style={{
                padding: '5px 10px',
                fontSize: '0.78rem',
                gap: '5px',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              <Crown size={13} />
              <span>{windowWidth < 1280 ? 'VIP' : 'Go VIP'}</span>
            </button>
          )}

          {/* Admin CMS Studio Button */}
          <button
            onClick={() => setCurrentView('admin')}
            style={{
              padding: '5px 9px',
              borderRadius: '6px',
              background: currentView === 'admin' ? '#9d4edd' : 'rgba(157, 78, 221, 0.16)',
              border: '1px solid rgba(157, 78, 221, 0.45)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '0.78rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
            title="Admin CMS & Ad Engine Studio"
          >
            <LayoutDashboard size={13} />
            <span>{windowWidth < 1200 ? 'Admin' : 'Admin CMS'}</span>
          </button>

          {/* Profile Switcher Menu */}
          <div ref={profileMenuRef} style={{ position: 'relative', flexShrink: 0 }}>
            <div
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                padding: '2px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255,255,255,0.06)'
              }}
              title={`Active Profile: ${activeProfile?.name || 'User'}`}
            >
              <img
                src={activeProfile?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'}
                alt="Profile"
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid var(--accent-pink)'
                }}
              />
            </div>

            {isProfileMenuOpen && (
              <div
                className="glass-heavy animate-fade-in"
                style={{
                  position: 'absolute',
                  top: '42px',
                  right: 0,
                  width: '230px',
                  padding: '14px',
                  borderRadius: '12px',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.9)',
                  zIndex: 1005,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Switch Profile
                </div>
                {user?.profiles.map((prof) => (
                  <div
                    key={prof.id}
                    onClick={() => {
                      switchProfile(prof.id);
                      setIsProfileMenuOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '7px 9px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: prof.id === activeProfile?.id ? 'rgba(255, 42, 109, 0.2)' : 'rgba(255,255,255,0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img
                        src={prof.avatarUrl}
                        alt={prof.name}
                        style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span style={{ fontSize: '0.84rem', fontWeight: 600 }}>{prof.name}</span>
                    </div>
                    {prof.id === activeProfile?.id && <Check size={15} color="var(--accent-pink)" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile/Compact Drawer Menu (shows all links when hamburger is open) */}
      {isMobileMenuOpen && (
        <div
          className="glass-heavy animate-fade-in"
          style={{
            position: 'absolute',
            top: '62px',
            left: 0,
            right: 0,
            padding: '16px 20px 24px',
            background: 'rgba(9, 10, 15, 0.98)',
            borderBottom: '1px solid rgba(255, 42, 109, 0.3)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.9)',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Navigation
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
            <button
              onClick={() => { setCurrentView('home'); setIsMobileMenuOpen(false); }}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                textAlign: 'left',
                fontWeight: 600,
                fontSize: '0.88rem',
                color: currentView === 'home' ? '#fff' : 'var(--text-secondary)',
                background: currentView === 'home' ? 'rgba(255, 42, 109, 0.2)' : 'rgba(255,255,255,0.03)',
                border: currentView === 'home' ? '1px solid var(--accent-pink)' : '1px solid transparent'
              }}
            >
              Home
            </button>

            <button
              onClick={() => { setCurrentView('movies'); setIsMobileMenuOpen(false); }}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                textAlign: 'left',
                fontWeight: 600,
                fontSize: '0.88rem',
                color: currentView === 'movies' ? '#fff' : 'var(--text-secondary)',
                background: currentView === 'movies' ? 'rgba(255, 42, 109, 0.2)' : 'rgba(255,255,255,0.03)',
                border: currentView === 'movies' ? '1px solid var(--accent-pink)' : '1px solid transparent'
              }}
            >
              Movies
            </button>

            <button
              onClick={() => { setCurrentView('series'); setIsMobileMenuOpen(false); }}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                textAlign: 'left',
                fontWeight: 600,
                fontSize: '0.88rem',
                color: currentView === 'series' ? '#fff' : 'var(--text-secondary)',
                background: currentView === 'series' ? 'rgba(255, 42, 109, 0.2)' : 'rgba(255,255,255,0.03)',
                border: currentView === 'series' ? '1px solid var(--accent-pink)' : '1px solid transparent'
              }}
            >
              TV Shows
            </button>

            <button
              onClick={() => { setCurrentView('live-fast'); setIsMobileMenuOpen(false); }}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                textAlign: 'left',
                fontWeight: 700,
                fontSize: '0.88rem',
                color: '#00f076',
                background: currentView === 'live-fast' ? 'rgba(0, 240, 118, 0.2)' : 'rgba(0, 240, 118, 0.08)',
                border: '1px solid rgba(0, 240, 118, 0.35)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00f076' }} />
              Live FAST TV
            </button>

            <button
              onClick={() => { setCurrentView('mylist'); setIsMobileMenuOpen(false); }}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                textAlign: 'left',
                fontWeight: 600,
                fontSize: '0.88rem',
                color: currentView === 'mylist' ? '#fff' : 'var(--text-secondary)',
                background: currentView === 'mylist' ? 'rgba(255, 42, 109, 0.2)' : 'rgba(255,255,255,0.03)',
                border: currentView === 'mylist' ? '1px solid var(--accent-pink)' : '1px solid transparent'
              }}
            >
              My List
            </button>

            <button
              onClick={() => { setCurrentView('party'); setIsMobileMenuOpen(false); }}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                textAlign: 'left',
                fontWeight: 600,
                fontSize: '0.88rem',
                color: currentView === 'party' ? '#ff2a6d' : 'var(--text-secondary)',
                background: currentView === 'party' ? 'rgba(255, 42, 109, 0.2)' : 'rgba(255,255,255,0.03)',
                border: currentView === 'party' ? '1px solid var(--accent-pink)' : '1px solid transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Users size={15} /> Party
            </button>

            <button
              onClick={() => { setCurrentView('downloads'); setIsMobileMenuOpen(false); }}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                textAlign: 'left',
                fontWeight: 600,
                fontSize: '0.88rem',
                color: currentView === 'downloads' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                background: currentView === 'downloads' ? 'rgba(5, 217, 232, 0.2)' : 'rgba(255,255,255,0.03)',
                border: currentView === 'downloads' ? '1px solid var(--accent-cyan)' : '1px solid transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Download size={15} /> Downloads
            </button>
          </div>

          <div style={{ marginTop: '8px', fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Categories
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => {
                  setCurrentView(`genre-${genre}`);
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: currentView === `genre-${genre}` ? '#fff' : 'var(--text-secondary)',
                  background: currentView === `genre-${genre}` ? 'rgba(255, 42, 109, 0.3)' : 'rgba(255,255,255,0.04)',
                  border: currentView === `genre-${genre}` ? '1px solid var(--accent-pink)' : '1px solid rgba(255,255,255,0.08)'
                }}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

