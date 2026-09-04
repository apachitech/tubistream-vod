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

  // --- Admin FAST Channel CRUD ---
  public addChannel(newChannel: Omit<FastChannel, 'schedule' | 'currentProgram'>): FastChannel {
    const channel: FastChannel = {
      ...newChannel,
      schedule: []
    };
    this.channels.push(channel);
    this.refreshSchedule();
    return channel;
  }
}

export const fastLinearService = new FastLinearService();
