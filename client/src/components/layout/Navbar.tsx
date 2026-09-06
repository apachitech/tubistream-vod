import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDeviceMode } from '../../context/DeviceModeContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import {
  Search, Tv, Crown, Film, Layers, LayoutDashboard, X, Check, Mic, Users, Download, Menu, ChevronDown, Heart, LogIn, LogOut, Plus, Flame, Sparkles, Radio
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
  const {
    user,
    activeProfile,
    switchProfile,
    isAuthenticated,
    isGuest,
    isAdmin,
    logout,
    openAuthModal,
    addProfile
  } = useAuth();
  const { deviceMode } = useDeviceMode();
  const { siteName, siteTagline, contentRatingPolicy, announcementBanner, isAnnouncementActive } = useSiteSettings();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Title[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isWatchMenuOpen, setIsWatchMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isLibraryMenuOpen, setIsLibraryMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddingProfile, setIsAddingProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1440);

  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const watchMenuRef = useRef<HTMLDivElement>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);
  const libraryMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 850) {
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
        setIsAddingProfile(false);
      }
      if (watchMenuRef.current && !watchMenuRef.current.contains(e.target as Node)) {
        setIsWatchMenuOpen(false);
      }
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(e.target as Node)) {
        setIsCategoryMenuOpen(false);
      }
      if (libraryMenuRef.current && !libraryMenuRef.current.contains(e.target as Node)) {
        setIsLibraryMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;
    const ok = await addProfile(newProfileName.trim());
    if (ok) {
      setNewProfileName('');
      setIsAddingProfile(false);
    }
  };

  const isMobileScreen = windowWidth < 850 || deviceMode === 'mobile';
  const isCompactDesktop = windowWidth < 1320 && !isMobileScreen;

  return (
    <header
      className="glass-panel"
      style={{
        position: 'sticky',
        top: '33px', // below device mode banner
        zIndex: 1000,
        transition: 'all 0.3s ease',
        background: isScrolled ? 'rgba(9, 10, 15, 0.97)' : 'rgba(16, 18, 26, 0.92)',
        borderBottom: isScrolled ? '1px solid rgba(255, 42, 109, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: isScrolled ? '0 10px 30px rgba(0,0,0,0.85)' : '0 4px 20px rgba(0,0,0,0.4)'
      }}
    >
      {/* Platform Announcement / Maturity Notice Banner */}
      {isAnnouncementActive && announcementBanner && (
        <div
          style={{
            background: 'linear-gradient(90deg, rgba(255, 42, 109, 0.92) 0%, rgba(157, 78, 221, 0.95) 100%)',
            color: '#fff',
            fontSize: '0.76rem',
            fontWeight: 800,
            padding: '5px 16px',
            textAlign: 'center',
            letterSpacing: '0.03em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.35)',
            borderBottom: '1px solid rgba(255,255,255,0.15)'
          }}
        >
          <span>{announcementBanner}</span>
        </div>
      )}

      <div
        style={{
          maxWidth: '100%',
          width: '100%',
          margin: '0 auto',
          padding: '0 clamp(10px, 2.5vw, 20px)',
          height: '62px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'clamp(8px, 1.5vw, 16px)',
          boxSizing: 'border-box'
        }}
      >
        {/* Left: Brand Logo & Desktop Nav Links with Dropdowns */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            minWidth: 0,
            flex: '1 1 auto'
          }}
        >
          {/* Mobile Hamburger Toggle Button */}
          {isMobileScreen && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: isMobileMenuOpen ? 'rgba(255, 42, 109, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                border: isMobileMenuOpen ? '1px solid var(--accent-pink)' : '1px solid rgba(255, 255, 255, 0.15)',
                color: isMobileMenuOpen ? 'var(--accent-pink)' : '#ffffff',
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
              gap: '9px',
              cursor: 'pointer',
              userSelect: 'none',
              flexShrink: 0,
              paddingRight: '4px'
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
                  fontSize: 'clamp(1.05rem, 3.5vw, 1.3rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  background: 'linear-gradient(90deg, #ffffff 0%, #ff2a6d 70%, #ff6e00 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{siteName}</span>
                  {contentRatingPolicy === 'mature_18' && (
                    <span
                      style={{
                        fontSize: '0.60rem',
                        fontWeight: 900,
                        background: 'rgba(255, 42, 109, 0.25)',
                        border: '1px solid var(--accent-pink)',
                        color: 'var(--accent-pink)',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        letterSpacing: '0.05em',
                        WebkitTextFillColor: 'var(--accent-pink)'
                      }}
                      title="18+ Mature Streaming Mode"
                    >
                      18+
                    </span>
                  )}
                  {contentRatingPolicy === 'family_friendly' && (
                    <span
                      style={{
                        fontSize: '0.60rem',
                        fontWeight: 900,
                        background: 'rgba(0, 240, 118, 0.2)',
                        border: '1px solid #00f076',
                        color: '#00f076',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        letterSpacing: '0.05em',
                        WebkitTextFillColor: '#00f076'
                      }}
                      title="Family-Safe Streaming Mode"
                    >
                      FAMILY
                    </span>
                  )}
                </div>
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
                {siteTagline}
              </div>
            </div>
          </div>

          {/* Desktop & Tablet Navigation with Dropdowns */}
          {!isMobileScreen && (
            <nav
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'nowrap',
                overflow: 'visible',
                minWidth: 0,
                padding: '2px 0'
              }}
            >
              {/* 1. Home (Direct link) */}
              <button
                onClick={() => setCurrentView('home')}
                className={`nav-link-item ${currentView === 'home' ? 'active' : ''}`}
              >
                Home
              </button>

              {/* Wide Desktop View (>= 1320px): Show Movies & TV Shows directly */}
              {!isCompactDesktop ? (
                <>
                  <button
                    onClick={() => setCurrentView('movies')}
                    className={`nav-link-item ${currentView === 'movies' ? 'active' : ''}`}
                  >
                    Movies
                  </button>

                  <button
                    onClick={() => setCurrentView('series')}
                    className={`nav-link-item ${currentView === 'series' ? 'active' : ''}`}
                  >
                    TV Shows
                  </button>
                </>
              ) : (
                /* Compact View (< 1320px): Consolidate Movies & TV Shows into 'Browse ▾' Dropdown */
                <div ref={watchMenuRef} style={{ position: 'relative' }}>
                  <button
                    onClick={() => {
                      setIsWatchMenuOpen(!isWatchMenuOpen);
                      setIsCategoryMenuOpen(false);
                      setIsLibraryMenuOpen(false);
                    }}
                    className={`nav-link-item ${['movies', 'series'].includes(currentView) ? 'active' : ''}`}
                    style={{
                      background: isWatchMenuOpen ? 'rgba(255, 42, 109, 0.22)' : undefined,
                      borderColor: isWatchMenuOpen ? 'var(--accent-pink)' : undefined
                    }}
                  >
                    <Film size={14} />
                    Browse
                    <ChevronDown size={13} style={{ opacity: 0.8 }} />
                  </button>

                  {isWatchMenuOpen && (
                    <div
                      className="glass-heavy animate-fade-in"
                      style={{
                        position: 'absolute',
                        top: '46px',
                        left: 0,
                        width: '260px',
                        padding: '10px',
                        borderRadius: '14px',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.95)',
                        border: '1px solid rgba(255, 42, 109, 0.35)',
                        zIndex: 1005,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}
                    >
                      <button
                        onClick={() => {
                          setCurrentView('movies');
                          setIsWatchMenuOpen(false);
                        }}
                        className={`nav-dropdown-item ${currentView === 'movies' ? 'active' : ''}`}
                      >
                        <Film size={16} color="var(--accent-pink)" />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.86rem' }}>All Free Movies</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Feature films & blockbusters</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setCurrentView('series');
                          setIsWatchMenuOpen(false);
                        }}
                        className={`nav-dropdown-item ${currentView === 'series' ? 'active' : ''}`}
                      >
                        <Tv size={16} color="var(--accent-cyan)" />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.86rem' }}>TV Shows</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Binge-worthy series & seasons</div>
                        </div>
                      </button>

                      <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '2px 0' }} />

                      <button
                        onClick={() => {
                          setCurrentView('home');
                          setIsWatchMenuOpen(false);
                        }}
                        className="nav-dropdown-item"
                      >
                        <Flame size={16} color="#ff6e00" />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.86rem' }}>Top 10 Trending</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Most-watched titles today</div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 2. Live FAST TV (Direct Link with Pulsing Green Indicator) */}
              <button
                onClick={() => setCurrentView('live-fast')}
                className={`nav-link-item nav-link-live ${currentView === 'live-fast' ? 'active' : ''}`}
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

              {/* Subtle separator */}
              <div
                style={{
                  width: '1px',
                  height: '20px',
                  background: 'rgba(255, 255, 255, 0.12)',
                  margin: '0 2px',
                  flexShrink: 0
                }}
              />

              {/* 3. Categories ▾ Dropdown (Organized Genres Grid) */}
              <div ref={categoryMenuRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => {
                    setIsCategoryMenuOpen(!isCategoryMenuOpen);
                    setIsWatchMenuOpen(false);
                    setIsLibraryMenuOpen(false);
                  }}
                  className={`nav-link-item ${currentView.startsWith('genre-') ? 'active' : ''}`}
                  style={{
                    background: isCategoryMenuOpen ? 'rgba(255, 42, 109, 0.22)' : undefined,
                    borderColor: isCategoryMenuOpen ? 'var(--accent-pink)' : undefined
                  }}
                >
                  <Layers size={14} />
                  Categories
                  <ChevronDown size={13} style={{ opacity: 0.8 }} />
                </button>

                {isCategoryMenuOpen && (
                  <div
                    className="glass-heavy animate-fade-in"
                    style={{
                      position: 'absolute',
                      top: '46px',
                      left: 0,
                      width: '320px',
                      padding: '12px',
                      borderRadius: '14px',
                      boxShadow: '0 20px 50px rgba(0,0,0,0.95)',
                      border: '1px solid rgba(255, 42, 109, 0.35)',
                      zIndex: 1005,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                        Browse by Genre
                      </span>
                      <span style={{ fontSize: '0.70rem', color: 'var(--accent-pink)', fontWeight: 600 }}>
                        {genres.length} Genres
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', maxHeight: '220px', overflowY: 'auto' }}>
                      {genres.map((genre) => (
                        <button
                          key={genre}
                          onClick={() => {
                            setIsCategoryMenuOpen(false);
                            setCurrentView(`genre-${genre}`);
                          }}
                          style={{
                            padding: '8px 10px',
                            textAlign: 'left',
                            fontSize: '0.80rem',
                            fontWeight: 600,
                            borderRadius: '7px',
                            color: currentView === `genre-${genre}` ? '#fff' : '#e2e8f0',
                            background: currentView === `genre-${genre}` ? 'rgba(255, 42, 109, 0.35)' : 'rgba(255,255,255,0.04)',
                            border: currentView === `genre-${genre}` ? '1px solid var(--accent-pink)' : '1px solid rgba(255,255,255,0.06)',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#fff';
                            e.currentTarget.style.background = 'rgba(255, 42, 109, 0.25)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = currentView === `genre-${genre}` ? '#fff' : '#e2e8f0';
                            e.currentTarget.style.background = currentView === `genre-${genre}` ? 'rgba(255, 42, 109, 0.35)' : 'rgba(255,255,255,0.04)';
                          }}
                        >
                          {genre}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 4. My Library ▾ Dropdown (Watchlist, Watch Party, Downloads, Smart TV) */}
              <div ref={libraryMenuRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => {
                    setIsLibraryMenuOpen(!isLibraryMenuOpen);
                    setIsWatchMenuOpen(false);
                    setIsCategoryMenuOpen(false);
                  }}
                  className={`nav-link-item ${
                    ['mylist', 'party', 'downloads', 'activate-tv'].includes(currentView) ? 'active' : ''
                  }`}
                  style={{
                    background: isLibraryMenuOpen ? 'rgba(255, 42, 109, 0.22)' : undefined,
                    borderColor: isLibraryMenuOpen ? 'var(--accent-pink)' : undefined
                  }}
                >
                  <Heart size={14} color="var(--accent-pink)" />
                  My Library
                  <ChevronDown size={13} style={{ opacity: 0.8 }} />
                </button>

                {isLibraryMenuOpen && (
                  <div
                    className="glass-heavy animate-fade-in"
                    style={{
                      position: 'absolute',
                      top: '46px',
                      left: 0,
                      width: '270px',
                      padding: '12px',
                      borderRadius: '14px',
                      boxShadow: '0 20px 50px rgba(0,0,0,0.95)',
                      border: '1px solid rgba(255, 42, 109, 0.35)',
                      zIndex: 1005,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px'
                    }}
                  >
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', padding: '0 4px' }}>
                      Personal Library & Tools
                    </div>

                    {/* My Watchlist */}
                    <button
                      onClick={() => {
                        setCurrentView('mylist');
                        setIsLibraryMenuOpen(false);
                      }}
                      className={`nav-dropdown-item ${currentView === 'mylist' ? 'active' : ''}`}
                    >
                      <Heart size={16} color="var(--accent-pink)" />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.86rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span>My Watchlist</span>
                          {activeProfile?.myList && activeProfile.myList.length > 0 && (
                            <span style={{ fontSize: '0.68rem', padding: '1px 6px', borderRadius: '999px', background: 'rgba(255, 42, 109, 0.25)', color: 'var(--accent-pink)' }}>
                              {activeProfile.myList.length}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Saved movies & episodes</div>
                      </div>
                    </button>

                    {/* Watch Party */}
                    <button
                      onClick={() => {
                        setCurrentView('party');
                        setIsLibraryMenuOpen(false);
                      }}
                      className={`nav-dropdown-item ${currentView === 'party' ? 'active' : ''}`}
                    >
                      <Users size={16} color="#9d4edd" />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.86rem' }}>Watch Party</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Stream in sync with friends</div>
                      </div>
                    </button>

                    {/* Offline Downloads */}
                    <button
                      onClick={() => {
                        setCurrentView('downloads');
                        setIsLibraryMenuOpen(false);
                      }}
                      className={`nav-dropdown-item ${currentView === 'downloads' ? 'active' : ''}`}
                    >
                      <Download size={16} color="var(--accent-cyan)" />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.86rem' }}>My Downloads</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Offline video cache & media</div>
                      </div>
                    </button>

                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '4px 0' }} />

                    {/* Activate Smart TV */}
                    <button
                      onClick={() => {
                        setCurrentView('activate-tv');
                        setIsLibraryMenuOpen(false);
                      }}
                      className={`nav-dropdown-item ${currentView === 'activate-tv' ? 'active' : ''}`}
                    >
                      <Tv size={16} color="var(--accent-cyan)" />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.86rem' }}>Activate Smart TV</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Pair TV with 6-digit code</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </nav>
          )}
        </div>

        {/* Right Utilities: Search, Activate TV, VIP, Admin, Authentication & Profile */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexShrink: 0
          }}
        >
          {/* Smart Search Button / Expanding Box - Eliminated on mobile navbar, accessible in mobile dropdown */}
          {!isMobileScreen && (
            <div ref={searchRef} className="hide-on-mobile" style={{ position: 'relative' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255,255,255,0.07)',
                  borderRadius: 'var(--radius-full)',
                  padding: isSearchOpen ? '5px 12px' : (windowWidth >= 1350 ? '5px 12px' : '6px 9px'),
                  border: isSearchOpen ? '1px solid var(--accent-pink)' : '1px solid rgba(255,255,255,0.14)',
                  width: isSearchOpen
                    ? (windowWidth < 768 ? '180px' : '220px')
                    : (windowWidth >= 1350 ? '135px' : '36px'),
                  height: '36px',
                  boxSizing: 'border-box',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: !isSearchOpen && windowWidth < 1350 ? 'pointer' : 'default',
                  boxShadow: isSearchOpen ? '0 0 14px rgba(255, 42, 109, 0.25)' : 'none'
                }}
                onClick={() => {
                  if (!isSearchOpen && windowWidth < 1350) {
                    setIsSearchOpen(true);
                    setTimeout(() => searchInputRef.current?.focus(), 50);
                  }
                }}
                title="Search movies, TV shows, and genres"
              >
                <Search
                  size={15}
                  color={isSearchOpen ? 'var(--accent-pink)' : '#e2e8f0'}
                  style={{
                    marginRight: (isSearchOpen || windowWidth >= 1350) ? '8px' : 0,
                    flexShrink: 0
                  }}
                />

                {(isSearchOpen || windowWidth >= 1350) && (
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search movies, AI..."
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
                      fontSize: '0.82rem',
                      width: '100%',
                      minWidth: 0
                    }}
                  />
                )}

                {/* Voice Search Mic */}
                {(isSearchOpen || windowWidth >= 1350) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
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
                )}

                {searchQuery && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSearchQuery('');
                    }}
                    style={{ color: '#cbd5e1', flexShrink: 0 }}
                    aria-label="Clear search"
                  >
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
                    top: '44px',
                    right: 0,
                    width: windowWidth < 480 ? '280px' : '340px',
                    padding: '10px',
                    borderRadius: '12px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.95)',
                    border: '1px solid rgba(255, 42, 109, 0.3)',
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
                        <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '2px' }}>
                          {title.releaseYear} • {title.rating} • {title.genres.slice(0, 2).join(', ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VIP Premium Upgrade Button */}
          {user?.tier === 'vip_premium' ? (
            <span
              className="badge-vip"
              style={{
                fontSize: '0.72rem',
                padding: '0 8px',
                height: '36px',
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
                padding: '0 11px',
                height: '36px',
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

          {/* Admin CMS Studio Button (Visible ONLY to Admin) */}
          {isAdmin && (
            <button
              onClick={() => setCurrentView('admin')}
              style={{
                padding: '0 11px',
                height: '36px',
                borderRadius: '8px',
                background: currentView === 'admin'
                  ? 'linear-gradient(135deg, #9d4edd 0%, #7b2cbf 100%)'
                  : 'rgba(157, 78, 221, 0.18)',
                border: currentView === 'admin'
                  ? '1px solid #c77dff'
                  : '1px solid rgba(157, 78, 221, 0.45)',
                color: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.80rem',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                flexShrink: 0,
                cursor: 'pointer',
                boxShadow: currentView === 'admin'
                  ? '0 0 16px rgba(157, 78, 221, 0.6)'
                  : 'none',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              title="Admin CMS & Ad Engine Studio"
            >
              <LayoutDashboard size={14} color="#e0aaff" />
              <span>{windowWidth < 1250 ? 'Admin' : 'Admin CMS'}</span>
            </button>
          )}

          {/* Authentication & Profile Section */}
          {isGuest ? (
            <button
              onClick={() => openAuthModal('signin')}
              className="btn-primary"
              style={{
                height: '36px',
                padding: '0 12px',
                fontSize: '0.80rem',
                fontWeight: 700,
                borderRadius: '8px',
                gap: '6px',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                boxShadow: '0 0 16px rgba(255, 42, 109, 0.4)'
              }}
            >
              <LogIn size={13} />
              <span>Sign In</span>
            </button>
          ) : null}

          {/* Profile Switcher Menu & User Info */}
          <div ref={profileMenuRef} style={{ position: 'relative', flexShrink: 0 }}>
            <div
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                padding: '2px',
                height: '36px',
                boxSizing: 'border-box',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255,255,255,0.08)',
                border: isAuthenticated ? '1px solid var(--accent-pink)' : '1px solid rgba(255,255,255,0.15)',
                boxShadow: isAuthenticated ? '0 0 10px rgba(255, 42, 109, 0.3)' : 'none',
                position: 'relative'
              }}
              title={isAuthenticated ? `Signed in as ${user?.name || user?.email}` : 'Guest Profile'}
            >
              <img
                src={activeProfile?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'}
                alt="Profile"
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
              {isAuthenticated && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: '2px',
                    right: '2px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#00f076',
                    border: '1.5px solid #10121a'
                  }}
                />
              )}
            </div>

            {isProfileMenuOpen && (
              <div
                className="glass-heavy animate-fade-in"
                style={{
                  position: 'absolute',
                  top: '46px',
                  right: 0,
                  width: '260px',
                  padding: '14px',
                  borderRadius: '14px',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.95)',
                  border: '1px solid rgba(255, 42, 109, 0.35)',
                  zIndex: 1005,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                {/* User Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <img
                    src={activeProfile?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'}
                    alt="Profile"
                    style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-pink)' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {isAuthenticated ? (user?.name || user?.email?.split('@')[0]) : 'Guest Viewer'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {isAuthenticated ? user?.email : 'Viewing in Guest Mode'}
                    </div>
                    <div style={{ marginTop: '3px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      {isAdmin && (
                        <span style={{ fontSize: '0.65rem', padding: '1px 5px', borderRadius: '4px', background: 'rgba(157, 78, 221, 0.3)', color: '#e0aaff', border: '1px solid rgba(157, 78, 221, 0.5)', fontWeight: 700 }}>
                          Studio Admin
                        </span>
                      )}
                      {user?.tier === 'vip_premium' ? (
                        <span className="badge-vip" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
                          <Crown size={9} /> VIP Premium
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.65rem', padding: '1px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.08)', color: '#cbd5e1' }}>
                          Free Member
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Profiles Section */}
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Switch Profile
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '160px', overflowY: 'auto' }}>
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
                        background: prof.id === activeProfile?.id ? 'rgba(255, 42, 109, 0.25)' : 'rgba(255,255,255,0.04)',
                        border: prof.id === activeProfile?.id ? '1px solid var(--accent-pink)' : '1px solid transparent',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img
                          src={prof.avatarUrl}
                          alt={prof.name}
                          style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#fff' }}>{prof.name}</span>
                        {prof.isKids && (
                          <span style={{ fontSize: '0.65rem', background: 'rgba(0, 240, 118, 0.2)', color: '#00f076', padding: '1px 5px', borderRadius: '4px' }}>
                            Kids
                          </span>
                        )}
                      </div>
                      {prof.id === activeProfile?.id && <Check size={14} color="var(--accent-pink)" />}
                    </div>
                  ))}
                </div>

                {/* Add Profile Inline / Action */}
                {isAddingProfile ? (
                  <form onSubmit={handleAddProfile} style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
                    <input
                      type="text"
                      placeholder="Profile name..."
                      value={newProfileName}
                      onChange={(e) => setNewProfileName(e.target.value)}
                      autoFocus
                      style={{
                        flex: 1,
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '6px',
                        padding: '6px 8px',
                        color: '#fff',
                        fontSize: '0.78rem',
                        outline: 'none'
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        background: 'var(--accent-pink)',
                        color: '#fff',
                        borderRadius: '6px',
                        padding: '6px 10px',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Add
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsAddingProfile(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      color: 'var(--accent-pink)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: 'rgba(255, 42, 109, 0.08)',
                      border: '1px dashed rgba(255, 42, 109, 0.3)'
                    }}
                  >
                    <Plus size={13} />
                    <span>Add New Profile</span>
                  </button>
                )}

                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '2px 0' }} />

                {/* Admin Studio shortcut in profile dropdown */}
                {isAdmin && (
                  <button
                    onClick={() => {
                      setCurrentView('admin');
                      setIsProfileMenuOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      color: '#e0aaff',
                      fontSize: '0.80rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      background: 'rgba(157, 78, 221, 0.18)',
                      border: '1px solid rgba(157, 78, 221, 0.45)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <LayoutDashboard size={14} color="#e0aaff" />
                    <span>Open Admin Studio</span>
                  </button>
                )}

                {/* Auth Actions: Sign In vs Sign Out */}
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      logout();
                      setIsProfileMenuOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      color: '#ff6b8b',
                      fontSize: '0.80rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: 'rgba(255, 42, 109, 0.1)',
                      border: '1px solid rgba(255, 42, 109, 0.25)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      openAuthModal('signin');
                      setIsProfileMenuOpen(false);
                    }}
                    className="btn-primary"
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <LogIn size={14} />
                    <span>Sign In or Register</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile / Small Screen Navigation Drawer */}
      {isMobileMenuOpen && (
        <div
          className="glass-heavy animate-fade-in"
          style={{
            position: 'absolute',
            top: '62px',
            left: 0,
            right: 0,
            padding: '18px 20px 28px',
            background: 'rgba(9, 10, 15, 0.98)',
            borderBottom: '2px solid rgba(255, 42, 109, 0.4)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.95)',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            maxHeight: 'calc(100vh - 95px)',
            overflowY: 'auto'
          }}
        >
          {/* 1. Dedicated Search Box with Autocomplete & Voice */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '10px 14px',
                border: searchQuery ? '1px solid var(--accent-pink)' : '1px solid rgba(255, 255, 255, 0.16)',
                boxShadow: searchQuery ? '0 0 16px rgba(255, 42, 109, 0.25)' : 'none',
                gap: '10px',
                transition: 'all 0.2s ease'
              }}
            >
              <Search size={18} color={searchQuery ? 'var(--accent-pink)' : '#94a3b8'} style={{ flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search movies, TV shows, actors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontSize: '0.90rem',
                  width: '100%',
                  minWidth: 0
                }}
              />
              <button
                type="button"
                onClick={() => {
                  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                    const recognition = new SpeechRec();
                    recognition.onresult = (event: any) => {
                      const transcript = event.results[0][0].transcript;
                      setSearchQuery(transcript);
                    };
                    recognition.start();
                  } else {
                    setSearchQuery('action movies');
                  }
                }}
                style={{ color: 'var(--accent-pink)', padding: '2px 4px', cursor: 'pointer', flexShrink: 0 }}
                title="Voice Search"
                aria-label="Voice Search"
              >
                <Mic size={16} />
              </button>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ color: '#94a3b8', cursor: 'pointer', flexShrink: 0 }}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Live Search Autocomplete in Mobile Menu */}
            {searchResults.length > 0 && (
              <div
                className="animate-fade-in"
                style={{
                  marginTop: '8px',
                  background: 'rgba(18, 20, 30, 0.98)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 42, 109, 0.35)',
                  padding: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  maxHeight: '260px',
                  overflowY: 'auto'
                }}
              >
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '4px 8px' }}>
                  Matching Titles ({searchResults.length})
                </div>
                {searchResults.map((title) => (
                  <div
                    key={title.id}
                    onClick={() => {
                      onSelectTitle(title);
                      setIsMobileMenuOpen(false);
                      setSearchQuery('');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: 'rgba(255,255,255,0.04)',
                      transition: 'background 0.2s'
                    }}
                  >
                    <img
                      src={title.posterUrl}
                      alt={title.title}
                      style={{ width: '38px', height: '54px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {title.title}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                        {title.releaseYear} • {title.rating} • {title.genres.slice(0, 2).join(', ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. Featured Action: Activate Smart TV Card */}
          <div
            onClick={() => {
              setCurrentView('activate-tv');
              setIsMobileMenuOpen(false);
            }}
            style={{
              padding: '12px 14px',
              borderRadius: '12px',
              background: currentView === 'activate-tv'
                ? 'linear-gradient(90deg, rgba(5, 217, 232, 0.25) 0%, rgba(5, 217, 232, 0.08) 100%)'
                : 'linear-gradient(90deg, rgba(5, 217, 232, 0.12) 0%, rgba(255, 255, 255, 0.03) 100%)',
              border: currentView === 'activate-tv' ? '1px solid var(--accent-cyan)' : '1px solid rgba(5, 217, 232, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              boxShadow: currentView === 'activate-tv' ? '0 0 16px rgba(5, 217, 232, 0.25)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(5, 217, 232, 0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Tv size={20} color="var(--accent-cyan)" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Activate Smart TV
                  <span style={{ fontSize: '0.66rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(5, 217, 232, 0.2)', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                    10-FOOT APP
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                  Pair your TV app with 6-digit code
                </div>
              </div>
            </div>
            <ChevronDown size={16} color="var(--accent-cyan)" style={{ transform: 'rotate(-90deg)' }} />
          </div>

          {/* User Account / Auth Card in Mobile Drawer */}
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src={activeProfile?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'}
                alt="Profile"
                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-pink)' }}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#fff' }}>
                  {isAuthenticated ? (user?.name || user?.email) : 'Guest Viewer'}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {isAuthenticated ? (user?.tier === 'vip_premium' ? '👑 VIP Member' : 'Free Member') : 'Sign in to sync watchlist'}
                </div>
              </div>
            </div>

            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  background: 'rgba(255, 42, 109, 0.15)',
                  border: '1px solid rgba(255, 42, 109, 0.3)',
                  color: '#ff6b8b',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => {
                  openAuthModal('signin');
                  setIsMobileMenuOpen(false);
                }}
                className="btn-primary"
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Sign In
              </button>
            )}
          </div>

          {/* Section 1: Watch & Stream */}
          <div>
            <div style={{ fontSize: '0.74rem', color: 'var(--accent-pink)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              Watch & Stream
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                onClick={() => { setCurrentView('home'); setIsMobileMenuOpen(false); }}
                className={`nav-link-item ${currentView === 'home' ? 'active' : ''}`}
                style={{ padding: '10px 14px', justifyContent: 'flex-start' }}
              >
                <Film size={15} />
                Home
              </button>

              <button
                onClick={() => { setCurrentView('movies'); setIsMobileMenuOpen(false); }}
                className={`nav-link-item ${currentView === 'movies' ? 'active' : ''}`}
                style={{ padding: '10px 14px', justifyContent: 'flex-start' }}
              >
                <Film size={15} />
                Movies
              </button>

              <button
                onClick={() => { setCurrentView('series'); setIsMobileMenuOpen(false); }}
                className={`nav-link-item ${currentView === 'series' ? 'active' : ''}`}
                style={{ padding: '10px 14px', justifyContent: 'flex-start' }}
              >
                <Tv size={15} />
                TV Shows
              </button>

              <button
                onClick={() => { setCurrentView('live-fast'); setIsMobileMenuOpen(false); }}
                className={`nav-link-item nav-link-live ${currentView === 'live-fast' ? 'active' : ''}`}
                style={{ padding: '10px 14px', justifyContent: 'flex-start' }}
              >
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#00f076', boxShadow: '0 0 8px #00f076' }} />
                Live FAST TV
              </button>
            </div>
          </div>

          {/* Section 2: Library & Social Features */}
          <div>
            <div style={{ fontSize: '0.74rem', color: 'var(--accent-cyan)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              My Library & Tools
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                onClick={() => { setCurrentView('mylist'); setIsMobileMenuOpen(false); }}
                className={`nav-link-item ${currentView === 'mylist' ? 'active' : ''}`}
                style={{ padding: '10px 14px', justifyContent: 'flex-start' }}
              >
                <Heart size={15} color="var(--accent-pink)" />
                My List
              </button>

              <button
                onClick={() => { setCurrentView('party'); setIsMobileMenuOpen(false); }}
                className={`nav-link-item nav-link-party ${currentView === 'party' ? 'active' : ''}`}
                style={{ padding: '10px 14px', justifyContent: 'flex-start' }}
              >
                <Users size={15} />
                Watch Party
              </button>

              <button
                onClick={() => { setCurrentView('downloads'); setIsMobileMenuOpen(false); }}
                className={`nav-link-item nav-link-downloads ${currentView === 'downloads' ? 'active' : ''}`}
                style={{ padding: '10px 14px', justifyContent: 'flex-start' }}
              >
                <Download size={15} />
                Downloads
              </button>

              <button
                onClick={() => { setCurrentView('activate-tv'); setIsMobileMenuOpen(false); }}
                className="nav-link-item"
                style={{ padding: '10px 14px', justifyContent: 'flex-start', color: 'var(--accent-cyan)' }}
              >
                <Tv size={15} />
                Activate TV
              </button>
            </div>
          </div>

          {/* Section 3: Categories & Genres */}
          <div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
              Browse Genres ({genres.length})
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '140px', overflowY: 'auto' }}>
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => {
                    setCurrentView(`genre-${genre}`);
                    setIsMobileMenuOpen(false);
                  }}
                  style={{
                    padding: '6px 11px',
                    borderRadius: '7px',
                    fontSize: '0.80rem',
                    fontWeight: 600,
                    color: currentView === `genre-${genre}` ? '#fff' : '#cbd5e1',
                    background: currentView === `genre-${genre}` ? 'rgba(255, 42, 109, 0.35)' : 'rgba(255,255,255,0.06)',
                    border: currentView === `genre-${genre}` ? '1px solid var(--accent-pink)' : '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Admin Studio shortcut (Visible ONLY to Admin) */}
          {isAdmin && (
            <div style={{ marginTop: '4px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                onClick={() => {
                  setCurrentView('admin');
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '11px',
                  borderRadius: '10px',
                  background: currentView === 'admin'
                    ? 'linear-gradient(135deg, #9d4edd 0%, #7b2cbf 100%)'
                    : 'rgba(157, 78, 221, 0.22)',
                  border: currentView === 'admin'
                    ? '1px solid #c77dff'
                    : '1px solid rgba(157, 78, 221, 0.55)',
                  color: '#fff',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: currentView === 'admin'
                    ? '0 0 18px rgba(157, 78, 221, 0.65)'
                    : 'none',
                  cursor: 'pointer'
                }}
              >
                <LayoutDashboard size={16} color={currentView === 'admin' ? '#fff' : '#c77dff'} />
                Admin CMS & Ad Engine Studio
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
