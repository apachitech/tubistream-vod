import { Title, FastChannel, User, UserProfile, AdBreak, DevicePairingCode, AnalyticsSummary, AdCreative } from '../types';

const API_BASE = (import.meta as any).env?.VITE_API_URL || '/api';

const TOKEN_KEY = 'tubistream_auth_token';
const USER_ID_KEY = 'tubistream_user_id';

export const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setAuthToken = (token: string, userId?: string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    if (userId) localStorage.setItem(USER_ID_KEY, userId);
  } catch {}
};

export const clearAuthToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
  } catch {}
};

export const getAuthHeaders = (userId?: string): Record<string, string> => {
  const headers: Record<string, string> = {};
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const uid = userId || (typeof localStorage !== 'undefined' ? localStorage.getItem(USER_ID_KEY) : null);
  if (uid) {
    headers['x-user-id'] = uid;
  }
  return headers;
};

export const api = {
  // Auth & Profile
  async getMe(userId?: string): Promise<{ success: boolean; user: User }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(userId)
    });
    return res.json();
  },

  async login(email: string, password: string): Promise<{ success: boolean; message?: string; user?: User; token?: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success && data.token) {
      setAuthToken(data.token, data.user?.id);
    }
    return data;
  },

  async register(email: string, password: string, name?: string): Promise<{ success: boolean; message?: string; user?: User; token?: string }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    const data = await res.json();
    if (data.success && data.token) {
      setAuthToken(data.token, data.user?.id);
    }
    return data;
  },

  async logout(): Promise<{ success: boolean }> {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
    } catch {}
    clearAuthToken();
    return { success: true };
  },

  async createGuest(): Promise<{ success: boolean; user: User }> {
    const res = await fetch(`${API_BASE}/auth/guest`, { method: 'POST' });
    const data = await res.json();
    if (data.success && data.user) {
      clearAuthToken();
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(USER_ID_KEY, data.user.id);
      }
    }
    return data;
  },

  async switchProfile(userId: string, profileId: string): Promise<{ success: boolean; profile: UserProfile; user: User }> {
    const res = await fetch(`${API_BASE}/auth/profile/switch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders(userId) },
      body: JSON.stringify({ profileId })
    });
    return res.json();
  },

  async addProfile(userId: string, name: string, avatarUrl?: string, isKids = false): Promise<{ success: boolean; profile?: UserProfile; user?: User; message?: string }> {
    const res = await fetch(`${API_BASE}/auth/profile/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders(userId) },
      body: JSON.stringify({ name, avatarUrl, isKids })
    });
    return res.json();
  },

  async deleteProfile(userId: string, profileId: string): Promise<{ success: boolean; user?: User; message?: string }> {
    const res = await fetch(`${API_BASE}/auth/profile/${profileId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(userId)
    });
    return res.json();
  },

  async updateProgress(userId: string, titleId: string, progressSeconds: number, durationSeconds: number): Promise<void> {
    await fetch(`${API_BASE}/auth/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders(userId) },
      body: JSON.stringify({ titleId, progressSeconds, durationSeconds })
    });
  },

  async toggleMyList(userId: string, titleId: string): Promise<{ success: boolean; inList: boolean; myList: string[] }> {
    const res = await fetch(`${API_BASE}/auth/mylist/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders(userId) },
      body: JSON.stringify({ titleId })
    });
    return res.json();
  },

  async toggleLike(userId: string, titleId: string): Promise<{ success: boolean; liked: boolean }> {
    const res = await fetch(`${API_BASE}/auth/like/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders(userId) },
      body: JSON.stringify({ titleId })
    });
    return res.json();
  },

  async upgradeToVip(userId: string): Promise<{ success: boolean; user: User }> {
    const res = await fetch(`${API_BASE}/auth/upgrade-vip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders(userId) },
    });
    return res.json();
  },

  // Smart TV Activation Flow
  async generateDeviceCode(deviceType = 'smart_tv', deviceName = 'Smart TV 4K OLED'): Promise<{ success: boolean; pairing: DevicePairingCode }> {
    const res = await fetch(`${API_BASE}/auth/device/code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceType, deviceName })
    });
    return res.json();
  },

  async verifyDeviceCode(userId: string, code: string): Promise<{ success: boolean; message: string; deviceName?: string }> {
    const res = await fetch(`${API_BASE}/auth/device/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
      body: JSON.stringify({ code })
    });
    return res.json();
  },

  async pollDeviceCode(code: string): Promise<{ success: boolean; status: string; token?: string; userId?: string }> {
    const res = await fetch(`${API_BASE}/auth/device/poll/${encodeURIComponent(code)}`);
    return res.json();
  },

  // Catalog
  async getTitles(params?: { genre?: string; type?: string; q?: string; rating?: string; sortBy?: string; kids?: boolean; limit?: number }): Promise<{ success: boolean; count: number; titles: Title[] }> {
    const query = new URLSearchParams();
    if (params) {
      if (params.genre) query.set('genre', params.genre);
      if (params.type) query.set('type', params.type);
      if (params.q) query.set('q', params.q);
      if (params.rating) query.set('rating', params.rating);
      if (params.sortBy) query.set('sortBy', params.sortBy);
      if (params.kids) query.set('kids', 'true');
      if (params.limit) query.set('limit', params.limit.toString());
    }
    const res = await fetch(`${API_BASE}/catalog/titles?${query.toString()}`);
    return res.json();
  },

  async getTitleById(id: string): Promise<{ success: boolean; title: Title }> {
    const res = await fetch(`${API_BASE}/catalog/titles/${id}`);
    return res.json();
  },

  async getFeatured(): Promise<{ success: boolean; titles: Title[] }> {
    const res = await fetch(`${API_BASE}/catalog/featured`);
    return res.json();
  },

  async getTrending(): Promise<{ success: boolean; titles: Title[] }> {
    const res = await fetch(`${API_BASE}/catalog/trending`);
    return res.json();
  },

  async getTop10(): Promise<{ success: boolean; titles: Title[] }> {
    const res = await fetch(`${API_BASE}/catalog/top10`);
    return res.json();
  },

  async getGenres(): Promise<{ success: boolean; genres: string[] }> {
    const res = await fetch(`${API_BASE}/catalog/genres`);
    return res.json();
  },

  // ML Recommendations
  async getPersonalizedFeed(userId?: string): Promise<{
    success: boolean;
    feed: {
      topPicksForYou: Title[];
      becauseYouWatched: { sourceTitle: Title; recommendations: Title[] } | null;
      continueWatching: { title: Title; progressSeconds: number; durationSeconds: number }[];
      trendingNow: Title[];
      genreSpotlights: { genre: string; titles: Title[] }[];
    };
  }> {
    const res = await fetch(`${API_BASE}/recommendations/feed`, {
      headers: userId ? { 'x-user-id': userId } : {}
    });
    return res.json();
  },

  async getSimilarTitles(titleId: string, limit = 8): Promise<{ success: boolean; recommendations: { title: Title; similarity: number }[] }> {
    const res = await fetch(`${API_BASE}/recommendations/similar/${titleId}?limit=${limit}`);
    return res.json();
  },

  // AI Natural Language Search
  async searchAi(prompt: string): Promise<{ success: boolean; result: any }> {
    const res = await fetch(`${API_BASE}/ai-search/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    return res.json();
  },

  // Watch Party Co-Watching
  async createWatchParty(hostUserId: string, userName: string, titleId: string, episodeId?: string): Promise<{ success: boolean; room: any }> {
    const res = await fetch(`${API_BASE}/party/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hostUserId, userName, titleId, episodeId })
    });
    return res.json();
  },

  async joinWatchParty(roomId: string, userId: string, userName: string): Promise<{ success: boolean; room?: any; message?: string }> {
    const res = await fetch(`${API_BASE}/party/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId, userId, userName })
    });
    return res.json();
  },

  async syncWatchParty(roomId: string, userId: string, action: 'play' | 'pause' | 'seek', currentTimeSeconds: number): Promise<{ success: boolean; room: any }> {
    const res = await fetch(`${API_BASE}/party/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId, userId, action, currentTimeSeconds })
    });
    return res.json();
  },

  async sendPartyChat(roomId: string, userId: string, userName: string, text: string): Promise<{ success: boolean; message: any }> {
    const res = await fetch(`${API_BASE}/party/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId, userId, userName, text })
    });
    return res.json();
  },

  async pollWatchParty(roomId: string): Promise<{ success: boolean; room: any }> {
    const res = await fetch(`${API_BASE}/party/poll/${encodeURIComponent(roomId)}`);
    return res.json();
  },

  // Ads & Monetization
  async getAdBreaks(titleId: string, userId?: string): Promise<{ success: boolean; count: number; breaks: AdBreak[] }> {
    const res = await fetch(`${API_BASE}/ads/breaks/${titleId}`, {
      headers: userId ? { 'x-user-id': userId } : {}
    });
    return res.json();
  },

  async trackAd(event: string, adId: string, titleId?: string, userId?: string): Promise<void> {
    await fetch(`${API_BASE}/ads/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, adId, titleId, userId })
    });
  },

  // Streaming & QoS
  async reportQos(data: {
    titleId: string;
    eventType: string;
    currentBitrateKbps: number;
    bufferLengthSeconds: number;
    playbackPositionSeconds: number;
    droppedFrames: number;
    resolution: string;
    userId?: string;
  }): Promise<void> {
    await fetch(`${API_BASE}/streams/telemetry/qos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, timestamp: new Date().toISOString() })
    });
  },

  // FAST Channels
  async getFastChannels(): Promise<{ success: boolean; count: number; channels: FastChannel[] }> {
    const res = await fetch(`${API_BASE}/fast/channels`);
    return res.json();
  },

  async getFastChannelById(id: string): Promise<{ success: boolean; channel: FastChannel }> {
    const res = await fetch(`${API_BASE}/fast/channels/${id}`);
    return res.json();
  },

  // Admin CMS & Analytics
  async getAdminDashboard(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/dashboard`);
    return res.json();
  },

  async createTitle(data: Partial<Title>): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/catalog`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateTitle(id: string, data: Partial<Title>): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/catalog/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteTitle(id: string): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/catalog/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  async createAdCreative(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/ads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getAdminAds(): Promise<{ success: boolean; ads: AdCreative[]; config: any; summary: any }> {
    const res = await fetch(`${API_BASE}/admin/ads`);
    return res.json();
  },

  async getAdConfig(): Promise<{ success: boolean; config: any }> {
    const res = await fetch(`${API_BASE}/admin/ads/config`);
    return res.json();
  },

  async updateAdConfig(config: any): Promise<{ success: boolean; config: any }> {
    const res = await fetch(`${API_BASE}/admin/ads/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    return res.json();
  },

  async toggleAdStatus(adId: string): Promise<{ success: boolean; ad: AdCreative }> {
    const res = await fetch(`${API_BASE}/admin/ads/${adId}/status`, {
      method: 'PATCH'
    });
    return res.json();
  },

  async updateAdCpm(adId: string, cpm: number): Promise<{ success: boolean; ad: AdCreative }> {
    const res = await fetch(`${API_BASE}/admin/ads/${adId}/cpm`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpm })
    });
    return res.json();
  },

  async deleteAdCreative(adId: string): Promise<{ success: boolean; deleted: boolean }> {
    const res = await fetch(`${API_BASE}/admin/ads/${adId}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  async createFastChannel(data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/fast/channel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }
};
