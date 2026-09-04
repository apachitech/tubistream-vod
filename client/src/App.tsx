import React, { useState, useEffect } from 'react';
import { Title, FastChannel } from './types';
import { api } from './services/api';
import { useAuth } from './context/AuthContext';
import { usePlayer } from './context/PlayerContext';
import { useDeviceMode } from './context/DeviceModeContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { DeviceModeBanner } from './components/layout/DeviceModeBanner';
import { HeroBanner } from './components/home/HeroBanner';
import { ContentRow } from './components/home/ContentRow';
import { Top10Row } from './components/home/Top10Row';
import { FastLiveGuide } from './components/fast/FastLiveGuide';
import { SmartTvView } from './components/tv/SmartTvView';
import { VirtualRemoteOverlay } from './components/tv/VirtualRemoteOverlay';
import { TvActivationScreen } from './components/tv/TvActivationScreen';
import { WatchPartyModal } from './components/party/WatchPartyModal';
import { PinLockModal } from './components/modal/PinLockModal';
import { MyDownloadsView } from './components/home/MyDownloadsView';
import { TitleDetailModal } from './components/modal/TitleDetailModal';
import { SubscriptionModal } from './components/modal/SubscriptionModal';
import { AuthModal } from './components/modal/AuthModal';
import { VideoPlayer } from './components/player/VideoPlayer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Film, Radio, Sparkles, Clock, Flame, Heart, Play } from 'lucide-react';

export const App: React.FC = () => {
  const { user, activeProfile } = useAuth();
  const { isPlaying } = usePlayer();
  const { deviceMode } = useDeviceMode();

  const [currentView, setCurrentView] = useState<string>('home');
  const [featuredTitles, setFeaturedTitles] = useState<Title[]>([]);
  const [top10Titles, setTop10Titles] = useState<Title[]>([]);
  const [allTitles, setAllTitles] = useState<Title[]>([]);
  const [personalizedFeed, setPersonalizedFeed] = useState<any | null>(null);
  const [isWatchPartyOpen, setIsWatchPartyOpen] = useState<boolean>(false);
  const [isPinLockOpen, setIsPinLockOpen] = useState<boolean>(false);
  const [pinPendingAction, setPinPendingAction] = useState<(() => void) | null>(null);
  const [pinTitleName, setPinTitleName] = useState<string>('');
  const [selectedTitleModal, setSelectedTitleModal] = useState<Title | null>(null);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkPinAndExecute = (action: () => void, rating?: string, titleName?: string) => {
    if (activeProfile?.isKids && (rating === 'R' || rating === 'TV-MA')) {
      setPinPendingAction(() => action);
      setPinTitleName(titleName || '');
      setIsPinLockOpen(true);
    } else {
      action();
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [feat, top10, all, feed] = await Promise.all([
        api.getFeatured(),
        api.getTop10(),
        api.getTitles(),
        api.getPersonalizedFeed(user?.id)
      ]);

      if (feat.success) setFeaturedTitles(feat.titles);
      if (top10.success) setTop10Titles(top10.titles);
      if (all.success) setAllTitles(all.titles);
      if (feed.success) setPersonalizedFeed(feed.feed);
    } catch (err) {
      console.error('Failed to load catalog data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id, activeProfile?.id]);

  // Handle category / genre view
  let displayedTitles = allTitles;
  let viewHeading = '';

  if (currentView === 'movies') {
    displayedTitles = allTitles.filter((t) => t.type === 'movie');
    viewHeading = 'All Free Movies';
  } else if (currentView === 'series') {
    displayedTitles = allTitles.filter((t) => t.type === 'series');
    viewHeading = 'Binge-Worthy TV Shows';
  } else if (currentView === 'mylist') {
    const listIds = activeProfile?.myList || [];
    displayedTitles = allTitles.filter((t) => listIds.includes(t.id));
    viewHeading = 'My Watchlist';
  } else if (currentView.startsWith('genre-')) {
    const genreName = currentView.replace('genre-', '');
    displayedTitles = allTitles.filter((t) =>
      t.genres.some((g) => g.toLowerCase() === genreName.toLowerCase())
    );
    viewHeading = `${genreName} Movies & TV`;
  }

  // Build progress lookup map for continue watching
  const progressMap: { [id: string]: { progress: number; duration: number } } = {};
  if (activeProfile) {
    activeProfile.watchHistory.forEach((h) => {
      progressMap[h.titleId] = { progress: h.progressSeconds, duration: h.durationSeconds };
    });
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-primary)',
        color: '#fff',
        maxWidth: deviceMode === 'mobile' ? '480px' : '100%',
        margin: deviceMode === 'mobile' ? '0 auto' : '0',
        boxShadow: deviceMode === 'mobile' ? '0 0 50px rgba(0,0,0,0.9)' : 'none'
      }}
    >
      {/* Top Device Presentation Mode Banner */}
      <DeviceModeBanner />

      {/* 10-Foot Smart TV UI (If TV Mode active) */}
      {deviceMode === 'tv' ? (
        <SmartTvView onOpenDetails={(t) => setSelectedTitleModal(t)} />
      ) : (
        <>
          {/* Main Top Navigation Bar */}
          <Navbar
            currentView={currentView}
            setCurrentView={setCurrentView}
            onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
            onSelectTitle={(t) => setSelectedTitleModal(t)}
          />

          {/* Main Content Body */}
          <main style={{ flex: 1 }}>
            {/* View: Admin CMS Studio */}
            {currentView === 'admin' && <AdminDashboard />}

            {/* View: 24/7 Live FAST TV Guide */}
            {currentView === 'live-fast' && <FastLiveGuide />}

            {/* View: VIP Downloads */}
            {currentView === 'downloads' && <MyDownloadsView />}

            {/* View: Watch Party Co-Watching */}
            {currentView === 'party' && (
              <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '40px 32px' }}>
                <WatchPartyModal
                  isOpen={true}
                  onClose={() => setCurrentView('home')}
                  initialTitle={featuredTitles[0] || allTitles[0]}
                />
              </div>
            )}

            {/* View: Smart TV Activation Portal */}
            {currentView === 'activate-tv' && <TvActivationScreen onActivationSuccess={loadData} />}

            {/* View: Home Browse / Catalog */}
            {currentView === 'home' && (
              <>
                {/* Hero Spotlight Carousel */}
                <HeroBanner
                  titles={featuredTitles.length > 0 ? featuredTitles : allTitles.slice(0, 3)}
                  onOpenDetails={(t) => setSelectedTitleModal(t)}
                />

                {/* Continue Watching Row (If user has watch history) */}
                {personalizedFeed?.continueWatching && personalizedFeed.continueWatching.length > 0 && (
                  <ContentRow
                    title="Continue Watching"
                    subtitle="Pick up right where you left off"
                    titles={personalizedFeed.continueWatching.map((c: any) => c.title)}
                    onOpenDetails={(t) => setSelectedTitleModal(t)}
                    icon={<Clock size={22} color="var(--accent-pink)" />}
                    progressData={progressMap}
                  />
                )}

                {/* AI Personalized Recommendations */}
                {personalizedFeed?.topPicksForYou && personalizedFeed.topPicksForYou.length > 0 && (
                  <ContentRow
                    title="Recommended For You"
                    subtitle="Personalized based on your viewing history and preferences"
                    titles={personalizedFeed.topPicksForYou}
                    onOpenDetails={(t) => setSelectedTitleModal(t)}
                    icon={<Sparkles size={22} color="var(--accent-pink)" />}
                  />
                )}

                {/* Top 10 in Movies & TV Today */}
                <Top10Row
                  titles={top10Titles.length > 0 ? top10Titles : allTitles}
                  onOpenDetails={(t) => setSelectedTitleModal(t)}
                />

                {/* "Because You Watched [Title]" */}
                {personalizedFeed?.becauseYouWatched && (
                  <ContentRow
                    title={`Because You Watched "${personalizedFeed.becauseYouWatched.sourceTitle.title}"`}
                    subtitle="Similar cast, genre, and director matches"
                    titles={personalizedFeed.becauseYouWatched.recommendations}
                    onOpenDetails={(t) => setSelectedTitleModal(t)}
                    icon={<Film size={22} color="var(--accent-cyan)" />}
                  />
                )}

                {/* Trending Content Row */}
                <ContentRow
                  title="Trending Blockbusters"
                  subtitle="Most watched titles across TubiStream today"
                  titles={personalizedFeed?.trendingNow || allTitles.slice(0, 8)}
                  onOpenDetails={(t) => setSelectedTitleModal(t)}
                  icon={<Flame size={22} color="#ff6e00" />}
                />

                {/* Genre Spotlight Carousels */}
                {personalizedFeed?.genreSpotlights?.map((spotlight: any) => (
                  <ContentRow
                    key={spotlight.genre}
                    title={`${spotlight.genre} Vault`}
                    titles={spotlight.titles}
                    onOpenDetails={(t) => setSelectedTitleModal(t)}
                  />
                ))}
              </>
            )}

            {/* View: Filtered Categories / Movies / Series / My List */}
            {['movies', 'series', 'mylist'].includes(currentView) || currentView.startsWith('genre-') ? (
              <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '40px 32px' }}>
                <div style={{ marginBottom: '32px' }}>
                  <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff' }}>{viewHeading}</h1>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    Showing {displayedTitles.length} titles available to stream free in high definition.
                  </p>
                </div>

                {displayedTitles.length === 0 ? (
                  <div
                    className="glass-panel"
                    style={{
                      padding: '60px 20px',
                      borderRadius: '16px',
                      textAlign: 'center',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    <Film size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                      No titles found in this category
                    </h3>
                    <p style={{ fontSize: '0.9rem' }}>
                      Browse the main catalog or add movies to your list to see them here.
                    </p>
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
                      gap: '24px'
                    }}
                  >
                    {displayedTitles.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => setSelectedTitleModal(t)}
                        style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      >
                        <img
                          src={t.posterUrl}
                          alt={t.title}
                          style={{
                            width: '100%',
                            aspectRatio: '2/3',
                            objectFit: 'cover',
                            borderRadius: '10px',
                            boxShadow: 'var(--shadow-card)'
                          }}
                        />
                        <div style={{ marginTop: '8px' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {t.title}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            {t.releaseYear} • {t.rating} • {t.genres[0]}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </main>

          {/* Platform Footer */}
          <Footer />
        </>
      )}

      {/* Global Fullscreen Adaptive Video Player Layer */}
      <VideoPlayer />

      {/* Floating Virtual Remote Overlay */}
      <VirtualRemoteOverlay />

      {/* Title Details Modal */}
      <TitleDetailModal
        title={selectedTitleModal}
        onClose={() => setSelectedTitleModal(null)}
      />

      {/* Subscription VIP Upgrade Modal */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
      />

      {/* Parental Controls PIN Lock Modal */}
      <PinLockModal
        isOpen={isPinLockOpen}
        titleName={pinTitleName}
        onClose={() => {
          setIsPinLockOpen(false);
          setPinPendingAction(null);
        }}
        onSuccess={() => {
          if (pinPendingAction) {
            pinPendingAction();
            setPinPendingAction(null);
          }
        }}
      />

      {/* Global Authentication & Register Modal */}
      <AuthModal />
    </div>
  );
};
