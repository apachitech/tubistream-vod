import { QosEvent, AnalyticsSummary } from '../types';
import { catalogService } from './catalogService';
import { adEngineService } from './adEngineService';

export class AnalyticsService {
  private qosEvents: QosEvent[] = [];
  private baseViewers = 4280;

  public recordQosEvent(event: QosEvent): void {
    this.qosEvents.push(event);
    if (this.qosEvents.length > 5000) {
      this.qosEvents.shift();
    }
  }

  public getLiveDashboardSummary(): AnalyticsSummary {
    const titles = catalogService.getAllTitles();
    const adSummary = adEngineService.getAdMetricsSummary();

    // Fluctuate viewer count slightly to simulate active live streaming
    const randomJitter = Math.floor(Math.random() * 40) - 20;
    const currentViewers = this.baseViewers + randomJitter;

    // Top genres computed from views
    const genreWatchMap: { [key: string]: number } = {};
    titles.forEach(t => {
      t.genres.forEach(g => {
        genreWatchMap[g] = (genreWatchMap[g] || 0) + t.totalViews;
      });
    });

    const topGenres = Object.entries(genreWatchMap)
      .map(([genre, count]) => ({
        genre,
        count,
        watchHours: Math.round((count * 45) / 60)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Hourly revenue trend (last 6 hours)
    const nowHour = new Date().getHours();
    const revenueTrend = [5, 4, 3, 2, 1, 0].map(offset => {
      const h = (nowHour - offset + 24) % 24;
      const hourStr = `${h.toString().padStart(2, '0')}:00`;
      const baseHourRev = 180 + Math.sin(h) * 60 + (h > 18 ? 140 : 0);
      return {
        hour: hourStr,
        revenue: Math.round(baseHourRev),
        impressions: Math.round(baseHourRev * 38)
      };
    });

    return {
      totalViewersNow: currentViewers,
      totalWatchHoursToday: 18420,
      totalAdImpressionsToday: adSummary.totalImpressions,
      totalAdRevenueToday: adSummary.totalRevenue,
      fillRatePercentage: 99.4,
      averageBitrateMbps: 4.8,
      cdnBandwidthGbToday: 1420.5,
      topGenres,
      deviceBreakdown: [
        { device: 'Smart TV / 10-Foot UI', percentage: 44 },
        { device: 'Desktop Web Cinema', percentage: 32 },
        { device: 'Mobile & Tablet PWA', percentage: 18 },
        { device: 'Roku & Apple TV', percentage: 6 }
      ],
      revenueTrend,
      qosMetrics: {
        averageBufferRatio: 0.12, // 0.12% buffer ratio (excellent)
        errorRatePercentage: 0.04,
        avgStartupTimeMs: 420
      }
    };
  }
}

export const analyticsService = new AnalyticsService();
