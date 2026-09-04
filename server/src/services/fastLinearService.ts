import { FastChannel, FastProgram } from '../types';
import { SEED_FAST_CHANNELS } from '../data/seedCatalog';
import { catalogService } from './catalogService';

export class FastLinearService {
  private channels: FastChannel[] = [];

  constructor() {
    this.channels = [...SEED_FAST_CHANNELS];
    this.refreshSchedule();
  }

  public getChannels(): FastChannel[] {
    this.refreshSchedule();
    return this.channels;
  }

  public getChannelById(id: string): FastChannel | undefined {
    this.refreshSchedule();
    return this.channels.find(c => c.id === id);
  }

  /**
   * Generates a 24-hour dynamic rolling schedule based on the current real-time clock
   */
  public refreshSchedule(): void {
    const allTitles = catalogService.getAllTitles();
    const now = new Date();
    const currentHour = now.getHours();

    this.channels.forEach(channel => {
      // Find titles relevant to this channel category
      let matchingTitles = allTitles.filter(t => 
        t.genres.some(g => g.toLowerCase() === channel.category.toLowerCase())
      );
      if (matchingTitles.length === 0) {
        matchingTitles = allTitles;
      }

      const schedule: FastProgram[] = [];
      const slotDurationMinutes = 60; // 1-hour program slots

      // Build 6 hours: 1 hour past, current hour, and 4 hours future
      for (let offset = -1; offset <= 5; offset++) {
        const slotHour = (currentHour + offset + 24) % 24;
        const slotDate = new Date(now);
        slotDate.setHours(currentHour + offset, 0, 0, 0);

        const endDate = new Date(slotDate);
        endDate.setMinutes(slotDate.getMinutes() + slotDurationMinutes);

        const titleIdx = (channel.channelNumber + slotHour) % matchingTitles.length;
        const programTitle = matchingTitles[titleIdx];

        const program: FastProgram = {
          id: `prog-${channel.id}-${slotHour}`,
          channelId: channel.id,
          title: programTitle.title,
          synopsis: programTitle.synopsis,
          startTime: slotDate.toISOString(),
          endTime: endDate.toISOString(),
          durationMinutes: slotDurationMinutes,
          rating: programTitle.rating,
          genre: channel.category,
          thumbnailUrl: programTitle.backdropUrl,
          streamUrl: channel.streamUrl
        };

        schedule.push(program);

        // If current slot
        if (now >= slotDate && now < endDate) {
          channel.currentProgram = program;
        }
      }

      channel.schedule = schedule;
    });
  }

  // --- Admin FAST Channel CRUD Operations ---

  public getNextChannelNumber(): number {
    if (this.channels.length === 0) return 101;
    const maxNumber = Math.max(...this.channels.map(c => c.channelNumber || 100));
    return maxNumber + 1;
  }

  public addChannel(data: Partial<FastChannel>): FastChannel {
    const rawName = (data.name || 'New FAST Channel').trim();
    const slug = rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = data.id || `fast-${slug || Date.now()}`;
    const channelNumber = typeof data.channelNumber === 'number' && data.channelNumber > 0 
      ? data.channelNumber 
      : this.getNextChannelNumber();

    const channel: FastChannel = {
      id,
      channelNumber,
      name: rawName,
      category: (data.category as any) || 'Movies',
      logoUrl: data.logoUrl || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&auto=format&fit=crop&q=80',
      description: data.description || `24/7 continuous linear streaming broadcast for ${rawName}.`,
      streamUrl: data.streamUrl || 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
      schedule: []
    };

    this.channels.push(channel);
    this.channels.sort((a, b) => a.channelNumber - b.channelNumber);
    this.refreshSchedule();
    return channel;
  }

  public updateChannel(id: string, updates: Partial<FastChannel>): FastChannel | null {
    const channel = this.channels.find(c => c.id === id);
    if (!channel) return null;

    if (updates.name !== undefined) channel.name = updates.name.trim();
    if (updates.channelNumber !== undefined && typeof updates.channelNumber === 'number') {
      channel.channelNumber = updates.channelNumber;
    }
    if (updates.category !== undefined) channel.category = updates.category as any;
    if (updates.logoUrl !== undefined) channel.logoUrl = updates.logoUrl.trim();
    if (updates.description !== undefined) channel.description = updates.description.trim();
    if (updates.streamUrl !== undefined) channel.streamUrl = updates.streamUrl.trim();

    this.channels.sort((a, b) => a.channelNumber - b.channelNumber);
    this.refreshSchedule();
    return channel;
  }

  public deleteChannel(id: string): boolean {
    const idx = this.channels.findIndex(c => c.id === id);
    if (idx === -1) return false;
    this.channels.splice(idx, 1);
    return true;
  }
}

export const fastLinearService = new FastLinearService();
