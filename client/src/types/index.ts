export type ContentType = 'movie' | 'series' | 'live';

export type MaturityRating = 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17' | 'TV-Y' | 'TV-G' | 'TV-PG' | 'TV-14' | 'TV-MA';

export interface VideoRendition {
  resolution: '240p' | '360p' | '480p' | '720p' | '1080p' | '4K';
  bitrateKbps: number;
  width: number;
  height: number;
  fps: number;
  url: string;
}

export interface SubtitleTrack {
  id: string;
  language: string;
  label: string;
  kind: 'subtitles' | 'captions';
  src: string;
  default?: boolean;
}

export interface AudioTrack {
  id: string;
  language: string;
  label: string;
  codec: string;
  channels: '2.0 Stereo' | '5.1 Dolby Digital' | 'Dolby Atmos';
}

export interface DrmMetadata {
  drmType: 'ClearKey' | 'Widevine' | 'FairPlay' | 'PlayReady';
  licenseServerUrl: string;
  keyId?: string;
  isEncrypted: boolean;
  securityLevel: 'L1' | 'L3';
}

export interface Episode {
  id: string;
  seriesId: string;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  synopsis: string;
  durationSeconds: number;
  thumbnailUrl: string;
  streamUrl: string;
  renditions: VideoRendition[];
  cuePointsSeconds: number[];
}

export interface Season {
  seasonNumber: number;
  title: string;
  episodeCount: number;
  episodes: Episode[];
}

export interface Title {
  id: string;
  title: string;
  slug: string;
  type: ContentType;
  synopsis: string;
  shortDescription: string;
  releaseYear: number;
  durationMinutes: number;
  rating: MaturityRating;
  imdbScore: number;
  matchScore: number;
  posterUrl: string;
  backdropUrl: string;
  logoUrl?: string;
  trailerUrl?: string;
  streamUrl: string;
  dashUrl?: string;
  genres: string[];
  tags: string[];
  cast: string[];
  director: string;
  studio: string;
  audioTracks: AudioTrack[];
  subtitles: SubtitleTrack[];
  renditions: VideoRendition[];
  drm: DrmMetadata;
  cuePointsSeconds: number[];
  isFeatured?: boolean;
  isOriginal?: boolean;
  isTrending?: boolean;
  totalViews: number;
  seasons?: Season[];
  createdAt: string;
}

export interface AdCreative {
  id: string;
  campaignId: string;
  advertiserName: string;
  title: string;
  durationSeconds: number;
  videoUrl: string;
  clickThroughUrl: string;
  category: string;
  cpm: number;
  status?: 'active' | 'paused';
  vastTagUrl?: string;
  tracking: {
    impressionUrl: string;
    startUrl: string;
    firstQuartileUrl: string;
    midpointUrl: string;
    thirdQuartileUrl: string;
    completeUrl: string;
    clickUrl: string;
  };
}

export interface AdEngineConfig {
  prerollEnabled: boolean;
  midrollEnabled: boolean;
  pauseAdsEnabled: boolean;
  maxAdsPerBreak: number;
  minMidrollIntervalMinutes: number;
  vipAdFreeBypass: boolean;
}

export interface AdBreak {
  id: string;
  timeOffsetSeconds: number;
  type: 'preroll' | 'midroll' | 'postroll';
  ads: AdCreative[];
  totalDurationSeconds: number;
}

export interface FastProgram {
  id: string;
  channelId: string;
  title: string;
  synopsis: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  rating: MaturityRating;
  genre: string;
  thumbnailUrl: string;
  streamUrl: string;
}

export interface FastChannel {
  id: string;
  channelNumber: number;
  name: string;
  category: 'News' | 'Movies' | 'Comedy' | 'Action' | 'Sci-Fi' | 'Anime' | 'Documentary' | 'Sports' | 'Kids';
  logoUrl: string;
  description: string;
  streamUrl: string;
  currentProgram?: FastProgram;
  schedule: FastProgram[];
}

export interface UserProfile {
  id: string;
  name: string;
  avatarUrl: string;
  isKids: boolean;
  watchHistory: {
    titleId: string;
    progressSeconds: number;
    durationSeconds: number;
    completed: boolean;
    lastWatchedAt: string;
  }[];
  myList: string[];
  likedTitles: string[];
}

export interface User {
  id: string;
  email: string;
  name?: string;
  isGuest?: boolean;
  tier: 'free' | 'vip_premium';
  profiles: UserProfile[];
  activeProfileId: string;
  createdAt: string;
  pairedDevices: {
    deviceId: string;
    deviceType: 'smart_tv' | 'mobile' | 'web' | 'roku' | 'firetv' | 'apple_tv';
    deviceName: string;
    pairedAt: string;
  }[];
}

export interface DevicePairingCode {
  code: string;
  deviceId: string;
  deviceName: string;
  deviceType: 'smart_tv' | 'roku' | 'firetv' | 'apple_tv';
  expiresAt: number;
  userId?: string;
  token?: string;
  status: 'pending' | 'authorized' | 'expired';
}

export interface AnalyticsSummary {
  totalViewersNow: number;
  totalWatchHoursToday: number;
  totalAdImpressionsToday: number;
  totalAdRevenueToday: number;
  fillRatePercentage: number;
  averageBitrateMbps: number;
  cdnBandwidthGbToday: number;
  topGenres: { genre: string; count: number; watchHours: number }[];
  deviceBreakdown: { device: string; percentage: number }[];
  revenueTrend: { hour: string; revenue: number; impressions: number }[];
  qosMetrics: {
    averageBufferRatio: number;
    errorRatePercentage: number;
    avgStartupTimeMs: number;
  };
}
