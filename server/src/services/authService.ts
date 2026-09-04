import { User, UserProfile, DevicePairingCode } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class AuthService {
  private users: Map<string, User> = new Map(); // keyed by id AND by email
  private userPasswords: Map<string, string> = new Map(); // email -> password
  private userTokens: Map<string, string> = new Map(); // token -> userId
  private pairingCodes: Map<string, DevicePairingCode> = new Map();

  constructor() {
    this.seedUsers();
  }

  private seedUsers() {
    // 1. Default Free Viewer (Alex)
    const defaultUser: User = {
      id: 'usr-default-tubi-fan',
      email: 'viewer@tubistream.com',
      name: 'Alex Rivera',
      isGuest: false,
      tier: 'free',
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
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

    // 2. VIP Premium Member (Jordan)
    const vipUser: User = {
      id: 'usr-vip-fan',
      email: 'vip@tubistream.com',
      name: 'Jordan Stone',
      isGuest: false,
      tier: 'vip_premium',
      createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
      activeProfileId: 'prof-vip-main',
      profiles: [
        {
          id: 'prof-vip-main',
          name: 'Jordan VIP',
          avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
          isKids: false,
          watchHistory: [
            {
              titleId: 'vod-ai-chronicles',
              progressSeconds: 2400,
              durationSeconds: 5800,
              completed: false,
              lastWatchedAt: new Date(Date.now() - 1800000).toISOString()
            }
          ],
          myList: ['vod-ai-chronicles', 'vod-shadow-detective'],
          likedTitles: ['vod-ai-chronicles']
        }
      ],
      pairedDevices: []
    };

    // 3. Studio Admin Member
    const adminUser: User = {
      id: 'usr-admin-stream',
      email: 'admin@tubistream.com',
      name: 'Studio Admin',
      isGuest: false,
      tier: 'vip_premium',
      createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
      activeProfileId: 'prof-admin-main',
      profiles: [
        {
          id: 'prof-admin-main',
          name: 'Admin Master',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
          isKids: false,
          watchHistory: [],
          myList: [],
          likedTitles: []
        }
      ],
      pairedDevices: []
    };

    this.saveUser(defaultUser, 'password123');
    this.saveUser(vipUser, 'vip123');
    this.saveUser(adminUser, 'admin123');

    // Create persistent tokens for seed users
    this.userTokens.set('token-demo-viewer', defaultUser.id);
    this.userTokens.set('token-demo-vip', vipUser.id);
    this.userTokens.set('token-demo-admin', adminUser.id);
  }

  private saveUser(user: User, password?: string) {
    this.users.set(user.id, user);
    this.users.set(user.email.toLowerCase(), user);
    if (password) {
      this.userPasswords.set(user.email.toLowerCase(), password);
    }
  }

  public register(email: string, password: string, name?: string): { success: boolean; message?: string; user?: User; token?: string } {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: 'Please enter a valid email address.' };
    }
    if (!password || password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long.' };
    }
    if (this.users.has(cleanEmail)) {
      return { success: false, message: 'An account with this email already exists. Please sign in.' };
    }

    const userId = `usr-${uuidv4().substring(0, 8)}`;
    const displayName = name?.trim() || cleanEmail.split('@')[0];
    const mainProfileId = `prof-${uuidv4().substring(0, 8)}`;
    const kidsProfileId = `prof-${uuidv4().substring(0, 8)}`;

    const newUser: User = {
      id: userId,
      email: cleanEmail,
      name: displayName,
      isGuest: false,
      tier: 'free',
      createdAt: new Date().toISOString(),
      activeProfileId: mainProfileId,
      profiles: [
        {
          id: mainProfileId,
          name: displayName,
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
          isKids: false,
          watchHistory: [],
          myList: [],
          likedTitles: []
        },
        {
          id: kidsProfileId,
          name: 'Kids Zone',
          avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&auto=format&fit=crop&q=80',
          isKids: true,
          watchHistory: [],
          myList: [],
          likedTitles: []
        }
      ],
      pairedDevices: []
    };

    this.saveUser(newUser, password);
    const token = `tok-${uuidv4()}`;
    this.userTokens.set(token, newUser.id);

    return { success: true, user: newUser, token };
  }

  public login(email: string, password: string): { success: boolean; message?: string; user?: User; token?: string } {
    const cleanEmail = email.trim().toLowerCase();
    const user = this.users.get(cleanEmail);
    if (!user) {
      return { success: false, message: 'Account not found. Please check your email or register.' };
    }

    const storedPass = this.userPasswords.get(cleanEmail);
    if (storedPass && storedPass !== password) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }

    const token = `tok-${uuidv4()}`;
    this.userTokens.set(token, user.id);

    return { success: true, user, token };
  }

  public logout(token?: string): { success: boolean } {
    if (token && this.userTokens.has(token)) {
      this.userTokens.delete(token);
    }
    return { success: true };
  }

  public getUserByToken(token: string): User | undefined {
    const userId = this.userTokens.get(token);
    if (userId) {
      return this.users.get(userId);
    }
    return undefined;
  }

  public getOrCreateGuestUser(guestId?: string): User {
    if (guestId && this.users.has(guestId)) {
      return this.users.get(guestId)!;
    }

    const newId = guestId || `usr-guest-${uuidv4().substring(0, 8)}`;
    const guestUser: User = {
      id: newId,
      email: `guest_${newId}@tubistream.local`,
      name: 'Guest Viewer',
      isGuest: true,
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

  public addProfile(userId: string, name: string, avatarUrl?: string, isKids = false): { success: boolean; profile?: UserProfile; user?: User; message?: string } {
    const user = this.users.get(userId);
    if (!user) return { success: false, message: 'User not found' };

    if (user.profiles.length >= 6) {
      return { success: false, message: 'Maximum limit of 6 profiles reached.' };
    }

    const newProfile: UserProfile = {
      id: `prof-${uuidv4().substring(0, 8)}`,
      name: name.trim() || 'New Viewer',
      avatarUrl: avatarUrl || (isKids
        ? 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'),
      isKids: !!isKids,
      watchHistory: [],
      myList: [],
      likedTitles: []
    };

    user.profiles.push(newProfile);
    user.activeProfileId = newProfile.id;
    return { success: true, profile: newProfile, user };
  }

  public deleteProfile(userId: string, profileId: string): { success: boolean; user?: User; message?: string } {
    const user = this.users.get(userId);
    if (!user) return { success: false, message: 'User not found' };

    if (user.profiles.length <= 1) {
      return { success: false, message: 'Cannot delete the only remaining profile.' };
    }

    const idx = user.profiles.findIndex(p => p.id === profileId);
    if (idx === -1) return { success: false, message: 'Profile not found' };

    user.profiles.splice(idx, 1);
    if (user.activeProfileId === profileId) {
      user.activeProfileId = user.profiles[0].id;
    }

    return { success: true, user };
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
      expiresAt: Date.now() + 15 * 60 * 1000,
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
