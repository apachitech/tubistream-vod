import { AdCreative } from '../types';

export const SEED_ADS: AdCreative[] = [
  {
    id: 'ad-coca-cola-zero',
    campaignId: 'camp-beverage-q1',
    advertiserName: 'Coca-Cola Zero Sugar',
    title: 'Best Coke Ever? Take the Taste Test',
    durationSeconds: 15,
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    clickThroughUrl: 'https://www.coca-cola.com',
    category: 'Beverages',
    cpm: 24.50,
    tracking: {
      impressionUrl: '/api/ads/track?event=impression&adId=ad-coca-cola-zero',
      startUrl: '/api/ads/track?event=start&adId=ad-coca-cola-zero',
      firstQuartileUrl: '/api/ads/track?event=firstQuartile&adId=ad-coca-cola-zero',
      midpointUrl: '/api/ads/track?event=midpoint&adId=ad-coca-cola-zero',
      thirdQuartileUrl: '/api/ads/track?event=thirdQuartile&adId=ad-coca-cola-zero',
      completeUrl: '/api/ads/track?event=complete&adId=ad-coca-cola-zero',
      clickUrl: '/api/ads/track?event=click&adId=ad-coca-cola-zero'
    }
  },
  {
    id: 'ad-tesla-cyber',
    campaignId: 'camp-auto-ev',
    advertiserName: 'Tesla Cybertruck',
    title: 'Engineered for Any Planet',
    durationSeconds: 20,
    videoUrl: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
    clickThroughUrl: 'https://www.tesla.com/cybertruck',
    category: 'Automotive',
    cpm: 32.00,
    tracking: {
      impressionUrl: '/api/ads/track?event=impression&adId=ad-tesla-cyber',
      startUrl: '/api/ads/track?event=start&adId=ad-tesla-cyber',
      firstQuartileUrl: '/api/ads/track?event=firstQuartile&adId=ad-tesla-cyber',
      midpointUrl: '/api/ads/track?event=midpoint&adId=ad-tesla-cyber',
      thirdQuartileUrl: '/api/ads/track?event=thirdQuartile&adId=ad-tesla-cyber',
      completeUrl: '/api/ads/track?event=complete&adId=ad-tesla-cyber',
      clickUrl: '/api/ads/track?event=click&adId=ad-tesla-cyber'
    }
  },
  {
    id: 'ad-playstation-ps5',
    campaignId: 'camp-gaming-q1',
    advertiserName: 'PlayStation 5 Pro',
    title: 'Play Has No Limits',
    durationSeconds: 15,
    videoUrl: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    clickThroughUrl: 'https://www.playstation.com',
    category: 'Gaming',
    cpm: 28.75,
    tracking: {
      impressionUrl: '/api/ads/track?event=impression&adId=ad-playstation-ps5',
      startUrl: '/api/ads/track?event=start&adId=ad-playstation-ps5',
      firstQuartileUrl: '/api/ads/track?event=firstQuartile&adId=ad-playstation-ps5',
      midpointUrl: '/api/ads/track?event=midpoint&adId=ad-playstation-ps5',
      thirdQuartileUrl: '/api/ads/track?event=thirdQuartile&adId=ad-playstation-ps5',
      completeUrl: '/api/ads/track?event=complete&adId=ad-playstation-ps5',
      clickUrl: '/api/ads/track?event=click&adId=ad-playstation-ps5'
    }
  },
  {
    id: 'ad-doordash-deals',
    campaignId: 'camp-food-delivery',
    advertiserName: 'DoorDash',
    title: 'Craving Midnight Tacos? $0 Delivery Fee',
    durationSeconds: 15,
    videoUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    clickThroughUrl: 'https://www.doordash.com',
    category: 'Delivery & Food',
    cpm: 22.00,
    tracking: {
      impressionUrl: '/api/ads/track?event=impression&adId=ad-doordash-deals',
      startUrl: '/api/ads/track?event=start&adId=ad-doordash-deals',
      firstQuartileUrl: '/api/ads/track?event=firstQuartile&adId=ad-doordash-deals',
      midpointUrl: '/api/ads/track?event=midpoint&adId=ad-doordash-deals',
      thirdQuartileUrl: '/api/ads/track?event=thirdQuartile&adId=ad-doordash-deals',
      completeUrl: '/api/ads/track?event=complete&adId=ad-doordash-deals',
      clickUrl: '/api/ads/track?event=click&adId=ad-doordash-deals'
    }
  }
];
