import { v4 as uuidv4 } from 'uuid';

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  timestamp: string;
}

export interface WatchPartyRoom {
  id: string; // e.g. "PARTY-8921"
  hostUserId: string;
  titleId: string;
  episodeId?: string;
  playbackState: {
    isPlaying: boolean;
    currentTimeSeconds: number;
    lastUpdated: number; // timestamp
  };
  members: {
    userId: string;
    userName: string;
    userAvatar?: string;
    joinedAt: string;
  }[];
  chatLog: ChatMessage[];
  createdAt: string;
}

export class WatchPartyService {
  private rooms: Map<string, WatchPartyRoom> = new Map();

  public createRoom(hostUserId: string, userName: string, titleId: string, episodeId?: string): WatchPartyRoom {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let codeStr = '';
    for (let i = 0; i < 4; i++) {
      codeStr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const roomId = `PARTY-${codeStr}`;

    const room: WatchPartyRoom = {
      id: roomId,
      hostUserId,
      titleId,
      episodeId,
      playbackState: {
        isPlaying: true,
        currentTimeSeconds: 0,
        lastUpdated: Date.now()
      },
      members: [
        {
          userId: hostUserId,
          userName: userName || 'Host',
          userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
          joinedAt: new Date().toISOString()
        }
      ],
      chatLog: [
        {
          id: `msg-sys-1`,
          userId: 'system',
          userName: 'TubiBot',
          text: `🎉 Watch Party room created! Share code ${roomId} with your friends to co-watch in sync.`,
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString()
    };

    this.rooms.set(roomId, room);
    return room;
  }

  public joinRoom(roomId: string, userId: string, userName: string): { success: boolean; room?: WatchPartyRoom; message?: string } {
    const formattedId = roomId.toUpperCase().trim();
    const room = this.rooms.get(formattedId);
    if (!room) {
      return { success: false, message: 'Watch party room not found' };
    }

    const existing = room.members.find(m => m.userId === userId);
    if (!existing) {
      room.members.push({
        userId,
        userName: userName || 'Attendee',
        userAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200',
        joinedAt: new Date().toISOString()
      });

      room.chatLog.push({
        id: `msg-${uuidv4().substring(0, 6)}`,
        userId: 'system',
        userName: 'TubiBot',
        text: `👋 ${userName} joined the watch party!`,
        timestamp: new Date().toISOString()
      });
    }

    return { success: true, room };
  }

  public syncPlaybackState(roomId: string, userId: string, action: 'play' | 'pause' | 'seek', currentTimeSeconds: number): WatchPartyRoom | null {
    const room = this.rooms.get(roomId.toUpperCase().trim());
    if (!room) return null;

    room.playbackState = {
      isPlaying: action === 'play' ? true : action === 'pause' ? false : room.playbackState.isPlaying,
      currentTimeSeconds,
      lastUpdated: Date.now()
    };

    return room;
  }

  public sendChatMessage(roomId: string, userId: string, userName: string, text: string): ChatMessage | null {
    const room = this.rooms.get(roomId.toUpperCase().trim());
    if (!room) return null;

    const msg: ChatMessage = {
      id: `msg-${uuidv4().substring(0, 8)}`,
      userId,
      userName,
      text,
      timestamp: new Date().toISOString()
    };

    room.chatLog.push(msg);
    if (room.chatLog.length > 200) room.chatLog.shift();

    return msg;
  }

  public getRoom(roomId: string): WatchPartyRoom | undefined {
    return this.rooms.get(roomId.toUpperCase().trim());
  }
}

export const watchPartyService = new WatchPartyService();
