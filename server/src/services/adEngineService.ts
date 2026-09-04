import { AdCreative, AdBreak, AdMetricEvent, AdEngineConfig } from '../types';
import { SEED_ADS } from '../data/seedAds';
import { catalogService } from './catalogService';
import { authService } from './authService';

export class AdEngineService {
  private adInventory: AdCreative[] = [];
  private adMetrics: AdMetricEvent[] = [];
  private config: AdEngineConfig = {
    prerollEnabled: true,
    midrollEnabled: true,
    pauseAdsEnabled: true,
    maxAdsPerBreak: 1,
    minMidrollIntervalMinutes: 10,
    vipAdFreeBypass: true
  };

  constructor() {
    this.adInventory = SEED_ADS.map(ad => ({
      ...ad,
      status: 'active'
    }));
  }

  public getConfig(): AdEngineConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<AdEngineConfig>): AdEngineConfig {
    this.config = { ...this.config, ...newConfig };
    return this.getConfig();
  }

  public getAdInventory(): AdCreative[] {
    return this.adInventory;
  }

  /**
   * Generates ad breaks (Pre-roll, Mid-rolls at cue points) for a given title and user
   */
  public getAdBreaksForTitle(titleId: string, userId?: string): AdBreak[] {
    // Check if user is VIP Premium (Ad-free streaming) and VIP bypass is enabled
    if (userId && this.config.vipAdFreeBypass) {
      const user = authService.getUser(userId);
      if (user && user.tier === 'vip_premium') {
        return []; // VIP users get ZERO ads!
      }
    }

    const title = catalogService.getTitleById(titleId);
    if (!title) return [];

    const activeAds = this.adInventory.filter(a => a.status !== 'paused');
    if (activeAds.length === 0) return [];

    const breaks: AdBreak[] = [];

    // Pre-roll (at 0s) if enabled
    if (this.config.prerollEnabled) {
      const prerollAds = activeAds.slice(0, Math.min(this.config.maxAdsPerBreak, activeAds.length));
      const totalDur = prerollAds.reduce((sum, a) => sum + a.durationSeconds, 0);
      breaks.push({
        id: `break-preroll-${title.id}`,
        timeOffsetSeconds: 0,
        type: 'preroll',
        ads: prerollAds,
        totalDurationSeconds: totalDur
      });
    }

    // Mid-rolls from title cue points if enabled
    if (this.config.midrollEnabled) {
      title.cuePointsSeconds.forEach((cueSeconds, index) => {
        const adIndex = (index + 1) % activeAds.length;
        const midrollAds = [activeAds[adIndex]];
        breaks.push({
          id: `break-midroll-${title.id}-${index}`,
          timeOffsetSeconds: cueSeconds,
          type: 'midroll',
          ads: midrollAds,
          totalDurationSeconds: midrollAds[0].durationSeconds
        });
      });
    }

    return breaks;
  }

  /**
   * Generates IAB Standard VAST 4.2 XML response
   */
  public generateVast4Xml(adId?: string): string {
    const ad = this.adInventory.find(a => a.id === adId) || this.adInventory[0];
    const durationFormatted = `00:00:${ad.durationSeconds.toString().padStart(2, '0')}`;

    if (ad.vastTagUrl && ad.vastTagUrl.startsWith('http') && !ad.vastTagUrl.includes('/api/ads/vast')) {
      return `<?xml version="1.0" encoding="UTF-8"?>
<VAST version="4.2" xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <Ad id="${ad.id}">
    <Wrapper>
      <AdSystem version="1.0">TubiAdServer-DynamicSSAI</AdSystem>
      <VASTAdTagURI><![CDATA[${ad.vastTagUrl}]]></VASTAdTagURI>
      <Impression id="imp-wrap"><![CDATA[${ad.tracking.impressionUrl}]]></Impression>
      <Creatives>
        <Creative id="cr-wrap-${ad.id}">
          <Linear>
            <TrackingEvents>
              <Tracking event="start"><![CDATA[${ad.tracking.startUrl}]]></Tracking>
              <Tracking event="firstQuartile"><![CDATA[${ad.tracking.firstQuartileUrl}]]></Tracking>
              <Tracking event="midpoint"><![CDATA[${ad.tracking.midpointUrl}]]></Tracking>
              <Tracking event="thirdQuartile"><![CDATA[${ad.tracking.thirdQuartileUrl}]]></Tracking>
              <Tracking event="complete"><![CDATA[${ad.tracking.completeUrl}]]></Tracking>
            </TrackingEvents>
            <VideoClicks>
              <ClickThrough><![CDATA[${ad.clickThroughUrl}]]></ClickThrough>
              <ClickTracking><![CDATA[${ad.tracking.clickUrl}]]></ClickTracking>
            </VideoClicks>
          </Linear>
        </Creative>
      </Creatives>
    </Wrapper>
  </Ad>
</VAST>`;
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<VAST version="4.2" xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <Ad id="${ad.id}">
    <InLine>
      <AdSystem version="1.0">TubiAdServer-DynamicSSAI</AdSystem>
      <AdTitle>${ad.title}</AdTitle>
      <Description>${ad.advertiserName} Campaign</Description>
      <Advertiser>${ad.advertiserName}</Advertiser>
      <Pricing model="CPM" currency="USD">${ad.cpm.toFixed(2)}</Pricing>
      <Impression id="imp-1"><![CDATA[${ad.tracking.impressionUrl}]]></Impression>
      <Creatives>
        <Creative id="cr-${ad.id}" sequence="1">
          <Linear>
            <Duration>${durationFormatted}</Duration>
            <TrackingEvents>
              <Tracking event="start"><![CDATA[${ad.tracking.startUrl}]]></Tracking>
              <Tracking event="firstQuartile"><![CDATA[${ad.tracking.firstQuartileUrl}]]></Tracking>
              <Tracking event="midpoint"><![CDATA[${ad.tracking.midpointUrl}]]></Tracking>
              <Tracking event="thirdQuartile"><![CDATA[${ad.tracking.thirdQuartileUrl}]]></Tracking>
              <Tracking event="complete"><![CDATA[${ad.tracking.completeUrl}]]></Tracking>
            </TrackingEvents>
            <VideoClicks>
              <ClickThrough><![CDATA[${ad.clickThroughUrl}]]></ClickThrough>
              <ClickTracking><![CDATA[${ad.tracking.clickUrl}]]></ClickTracking>
            </VideoClicks>
            <MediaFiles>
              <MediaFile id="mf-1080p" delivery="progressive" type="application/x-mpegURL" bitrate="3000" width="1920" height="1080">
                <![CDATA[${ad.videoUrl}]]>
              </MediaFile>
            </MediaFiles>
          </Linear>
        </Creative>
      </Creatives>
    </InLine>
  </Ad>
</VAST>`;
  }

  /**
   * Generates IAB VMAP 1.0 XML describing all ad break cue points
   */
  public generateVmapXml(titleId: string): string {
    const breaks = this.getAdBreaksForTitle(titleId);

    return `<?xml version="1.0" encoding="UTF-8"?>
<vmap:VMAP xmlns:vmap="http://www.iab.net/vmap-1.0" version="1.0">
  ${breaks.map(b => {
    const offset = b.type === 'preroll' ? 'start' : `00:${Math.floor(b.timeOffsetSeconds / 60).toString().padStart(2, '0')}:${(b.timeOffsetSeconds % 60).toString().padStart(2, '0')}`;
    return `
  <vmap:AdBreak timeOffset="${offset}" breakType="linear" breakId="${b.id}">
    <vmap:AdSource id="ad-src-${b.id}" allowMultipleAds="true" followRedirects="true">
      <vmap:AdTagURI templateType="vast3"><![CDATA[/api/ads/vast?adId=${b.ads[0]?.id || ''}]]></vmap:AdTagURI>
    </vmap:AdSource>
  </vmap:AdBreak>`;
  }).join('')}
</vmap:VMAP>`;
  }

  /**
   * Records ad tracking pixel event
   */
  public recordAdEvent(adId: string, event: AdMetricEvent['event'], titleId?: string, userId?: string): void {
    const ad = this.adInventory.find(a => a.id === adId);
    if (!ad) return;

    const metric: AdMetricEvent = {
      timestamp: new Date().toISOString(),
      adId,
      advertiserName: ad.advertiserName,
      campaignId: ad.campaignId,
      event,
      cpm: ad.cpm,
      titleId,
      userId
    };

    this.adMetrics.push(metric);
    // Keep max 2000 metrics in memory
    if (this.adMetrics.length > 2000) {
      this.adMetrics.shift();
    }
  }

  public getAdMetricsSummary() {
    const totalImpressions = this.adMetrics.filter(m => m.event === 'impression').length + 8420;
    const totalClicks = this.adMetrics.filter(m => m.event === 'click').length + 420;
    const totalRevenue = (totalImpressions / 1000) * 26.50; // avg CPM $26.50

    return {
      totalImpressions,
      totalClicks,
      ctrPercentage: totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '4.98',
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      fillRate: '99.4%',
      campaigns: this.adInventory.map(a => ({
        id: a.id,
        advertiser: a.advertiserName,
        title: a.title,
        cpm: a.cpm,
        impressions: Math.floor(totalImpressions / this.adInventory.length)
      }))
    };
  }

  // --- CMS Ad Inventory CRUD & Controls ---
  public addAdCreative(newAd: Omit<AdCreative, 'id' | 'tracking'>): AdCreative {
    const id = `ad-custom-${Date.now()}`;
    const ad: AdCreative = {
      ...newAd,
      id,
      status: newAd.status || 'active',
      vastTagUrl: newAd.vastTagUrl ? newAd.vastTagUrl.trim() : undefined,
      tracking: {
        impressionUrl: `/api/ads/track?event=impression&adId=${id}`,
        startUrl: `/api/ads/track?event=start&adId=${id}`,
        firstQuartileUrl: `/api/ads/track?event=firstQuartile&adId=${id}`,
        midpointUrl: `/api/ads/track?event=midpoint&adId=${id}`,
        thirdQuartileUrl: `/api/ads/track?event=thirdQuartile&adId=${id}`,
        completeUrl: `/api/ads/track?event=complete&adId=${id}`,
        clickUrl: `/api/ads/track?event=click&adId=${id}`
      }
    };
    this.adInventory.unshift(ad);
    return ad;
  }

  public toggleAdStatus(adId: string): AdCreative | null {
    const ad = this.adInventory.find(a => a.id === adId);
    if (!ad) return null;
    ad.status = ad.status === 'paused' ? 'active' : 'paused';
    return ad;
  }

  public updateAdCpm(adId: string, newCpm: number): AdCreative | null {
    const ad = this.adInventory.find(a => a.id === adId);
    if (!ad) return null;
    ad.cpm = Math.max(0, newCpm);
    return ad;
  }

  public deleteAdCreative(adId: string): boolean {
    const initialLen = this.adInventory.length;
    this.adInventory = this.adInventory.filter(a => a.id !== adId);
    return this.adInventory.length < initialLen;
  }
}

export const adEngineService = new AdEngineService();
