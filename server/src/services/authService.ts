import { User, UserProfile, DevicePairingCode } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class AuthService {
  private users: Map<string, User> = new Map();
  private pairingCodes: Map<string, DevicePairingCode> = new Map();

  constructor() {
    this.seedDefaultUser();
  }

  private seedDefaultUser() {
    const defaultUser: User = {
      id: 'usr-default-tubi-fan',
      email: 'viewer@tubistream.com',
      tier: 'free',
      createdAt: new Date().toISOString(),
      activeProfileId: 'prof-main',
      profiles: [
        {
          id: 'prof-main',
          name: 'Alex (Main)',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
          isKids: false,
          watchHistory: [
            {
              titleId: 'vod-sintel-01',
              progressSeconds: 420,
              durationSeconds: 3120,
              completed: false,
              lastWatchedAt: new Date(Date.now() - 3600000).toISOString()
            },
            {
              titleId: 'vod-cyber-relic',
              progressSeconds: 1540,
              durationSeconds: 6840,
              completed: false,
              lastWatchedAt: new Date(Date.now() - 7200000).toISOString()
            }
          ],
          myList: ['vod-shadow-detective', 'vod-deep-ocean-secrets', 'vod-chronicles-valoria'],
          likedTitles: ['vod-sintel-01', 'vod-big-buck']
        },
        {
          id: 'prof-kids',
          name: 'Kids Zone',
          avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&auto=format&fit=crop&q=80',
          isKids: true,
          watchHistory: [
            {
              titleId: 'vod-big-buck',
              progressSeconds: 1200,
              durationSeconds: 2880,
              completed: false,
              lastWatchedAt: new Date(Date.now() - 86400000).toISOString()
            }
          ],
          myList: ['vod-big-buck', 'vod-cosmos-laundromat'],
          likedTitles: ['vod-big-buck']
        }
      ],
      pairedDevices: []
    };

    this.users.set(defaultUser.id, defaultUser);
    this.users.set(defaultUser.email, defaultUser);
  }

  public getOrCreateGuestUser(guestId?: string): User {
    if (guestId && this.users.has(guestId)) {
      return this.users.get(guestId)!;
    }

    const newId = guestId || `usr-guest-${uuidv4().substring(0, 8)}`;
    const guestUser: User = {
      id: newId,
      email: `guest_${newId}@tubistream.local`,
      tier: 'free',
      createdAt: new Date().toISOString(),
      activeProfileId: `prof-${newId}`,
      profiles: [
        {
          id: `prof-${newId}`,
          name: 'Guest Viewer',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
          isKids: false,
          watchHistory: [],
          myList: [],
          likedTitles: []
        }
      ],
      pairedDevices: []
    };

    this.users.set(newId, guestUser);
    return guestUser;
  }

  public getUser(userId: string): User | undefined {
    return this.users.get(userId);
  }

  public switchProfile(userId: string, profileId: string): UserProfile | null {
    const user = this.users.get(userId);
    if (!user) return null;
    const profile = user.profiles.find(p => p.id === profileId);
    if (profile) {
      user.activeProfileId = profile.id;
      return profile;
    }
    return null;
  }

  public updateWatchProgress(userId: string, titleId: string, progressSeconds: number, durationSeconds: number): void {
    const user = this.users.get(userId);
    if (!user) return;

    const profile = user.profiles.find(p => p.id === user.activeProfileId);
    if (!profile) return;

    const existingIndex = profile.watchHistory.findIndex(h => h.titleId === titleId);
    const completed = durationSeconds > 0 && (progressSeconds / durationSeconds) >= 0.92;

    const record = {
      titleId,
      progressSeconds,
      durationSeconds,
      completed,
      lastWatchedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      profile.watchHistory[existingIndex] = record;
    } else {
      profile.watchHistory.unshift(record);
    }

    // Keep top 30 most recent
    profile.watchHistory = profile.watchHistory.slice(0, 30);
  }

  public toggleMyList(userId: string, titleId: string): { inList: boolean; myList: string[] } {
    const user = this.users.get(userId);
    if (!user) return { inList: false, myList: [] };

    const profile = user.profiles.find(p => p.id === user.activeProfileId);
    if (!profile) return { inList: false, myList: [] };

    const idx = profile.myList.indexOf(titleId);
    let inList = false;
    if (idx >= 0) {
      profile.myList.splice(idx, 1);
      inList = false;
    } else {
      profile.myList.unshift(titleId);
      inList = true;
    }

    return { inList, myList: profile.myList };
  }

  public toggleLike(userId: string, titleId: string): { liked: boolean } {
    const user = this.users.get(userId);
    if (!user) return { liked: false };

    const profile = user.profiles.find(p => p.id === user.activeProfileId);
    if (!profile) return { liked: false };

    const idx = profile.likedTitles.indexOf(titleId);
    let liked = false;
    if (idx >= 0) {
      profile.likedTitles.splice(idx, 1);
      liked = false;
    } else {
      profile.likedTitles.push(titleId);
      liked = true;
    }

    return { liked };
  }

  public upgradeToVip(userId: string): { success: boolean; user: User } {
    const user = this.users.get(userId) || this.users.get('usr-default-tubi-fan')!;
    user.tier = 'vip_premium';
    return { success: true, user };
  }

  // --- Smart TV Device Pairing Flow ---
  public generateDevicePairingCode(deviceType: 'smart_tv' | 'roku' | 'firetv' | 'apple_tv', deviceName: string): DevicePairingCode {
    // Generate clean readable 6-character code (avoid confusing chars like 0/O, 1/I)
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const pairingRecord: DevicePairingCode = {
      code,
      deviceId: `dev-${uuidv4().substring(0, 8)}`,
      deviceName: deviceName || 'Smart TV 4K OLED',
      deviceType,
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 mins expiry
      status: 'pending'
    };

    this.pairingCodes.set(code, pairingRecord);
    return pairingRecord;
  }

  public verifyAndAuthorizeDeviceCode(code: string, userId: string): { success: boolean; message: string; deviceName?: string } {
    const formattedCode = code.toUpperCase().trim();
    const record = this.pairingCodes.get(formattedCode);

    if (!record) {
      return { success: false, message: 'Invalid activation code. Please check your TV screen.' };
    }

    if (Date.now() > record.expiresAt) {
      record.status = 'expired';
      return { success: false, message: 'Activation code has expired. Please refresh your TV to generate a new code.' };
    }

    const user = this.users.get(userId) || this.users.get('usr-default-tubi-fan')!;
    record.userId = user.id;
    record.token = `jwt_token_${user.id}_${Date.now()}`;
    record.status = 'authorized';

    user.pairedDevices.push({
      deviceId: record.deviceId,
      deviceName: record.deviceName,
      deviceType: record.deviceType,
      pairedAt: new Date().toISOString()
    });

    return { 
      success: true, 
      message: `Successfully connected ${record.deviceName}! Your TV is now active.`,
      deviceName: record.deviceName
    };
  }

  public pollDeviceActivationStatus(code: string): DevicePairingCode | null {
    const formattedCode = code.toUpperCase().trim();
    const record = this.pairingCodes.get(formattedCode);
    if (!record) return null;

    if (Date.now() > record.expiresAt && record.status === 'pending') {
      record.status = 'expired';
    }

    return record;
  }
}

export const authService = new AuthService();
