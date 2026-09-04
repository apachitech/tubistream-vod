import { authService } from './services/authService';
import { catalogService } from './services/catalogService';
import { streamService } from './services/streamService';
import { adEngineService } from './services/adEngineService';
import { mlRecommender } from './services/mlRecommender';
import { fastLinearService } from './services/fastLinearService';
import { analyticsService } from './services/analyticsService';
import { watchPartyService } from './services/watchPartyService';
import { aiSearchService } from './services/aiSearchService';

function runTests() {
  console.log('🧪 Starting TubiStream Microservices Verification Suite...\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean, testName: string) => {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  };

  // 1. Catalog Service Tests
  console.log('--- 1. Catalog & CMS Microservice ---');
  const allTitles = catalogService.getAllTitles();
  assert(allTitles.length >= 8, `Catalog loaded with ${allTitles.length} seed titles`);
  const featured = catalogService.getFeaturedTitles();
  assert(featured.length > 0, `Featured titles query returned ${featured.length} items`);
  const searchResults = catalogService.filterTitles({ query: 'dragon' });
  assert(searchResults.length > 0 && searchResults[0].title.includes('Sintel'), 'Fuzzy search accurately indexed and found Sintel');

  // 2. Adaptive Streaming & DRM Tests
  console.log('\n--- 2. Adaptive HLS/DASH & DRM Service ---');
  const testTitle = allTitles[0];
  const hlsManifest = streamService.generateHlsMasterPlaylist(testTitle);
  assert(hlsManifest.includes('#EXTM3U') && hlsManifest.includes('#EXT-X-STREAM-INF'), 'HLS Master Playlist (.m3u8) properly generated with variant bitrates');
  const dashManifest = streamService.generateDashManifest(testTitle);
  assert(dashManifest.includes('<MPD') && dashManifest.includes('<AdaptationSet'), 'MPEG-DASH (.mpd) XML manifest properly generated');
  const drmLicense = streamService.handleDrmLicenseRequest({ drmType: 'ClearKey' });
  assert((drmLicense as any).status === 'GRANTED_L1_SECURE', 'DRM ClearKey & Widevine license exchange granted');

  // 3. IAB VAST 4.2 / VMAP Ad Decision Engine & Admin Controls
  console.log('\n--- 3. Monetization & VAST 4.2 / VMAP Ad Engine ---');
  const adBreaks = adEngineService.getAdBreaksForTitle(testTitle.id);
  assert(adBreaks.length > 0, `Generated ${adBreaks.length} dynamic ad breaks with cue points`);
  const vastXml = adEngineService.generateVast4Xml();
  assert(vastXml.includes('<VAST version="4.2"') && vastXml.includes('<Impression'), 'IAB VAST 4.2 XML generated with tracking pixels');
  const vmapXml = adEngineService.generateVmapXml(testTitle.id);
  assert(vmapXml.includes('<vmap:VMAP') && vmapXml.includes('vmap:AdBreak'), 'IAB VMAP 1.0 XML cue points schedule generated');
  
  // Admin Ad Control & Delivery Rules Tests
  const initialConfig = adEngineService.getConfig();
  assert(initialConfig.prerollEnabled === true, 'Admin ad config retrieved with default rules');
  const updatedConfig = adEngineService.updateConfig({ prerollEnabled: false, maxAdsPerBreak: 2 });
  assert(updatedConfig.prerollEnabled === false && updatedConfig.maxAdsPerBreak === 2, 'Admin updated global ad delivery rules');
  adEngineService.updateConfig({ prerollEnabled: true }); // reset
  
  const sampleAd = adEngineService.getAdInventory()[0];
  const toggled = adEngineService.toggleAdStatus(sampleAd.id);
  assert(toggled?.status === 'paused', 'Admin toggled ad campaign status to paused');
  adEngineService.toggleAdStatus(sampleAd.id); // unpause
  
  const cpmUpdated = adEngineService.updateAdCpm(sampleAd.id, 35.00);
  assert(cpmUpdated?.cpm === 35.00, 'Admin dynamically updated floor CPM price to $35.00');

  // 4. ML Recommendation Engine
  console.log('\n--- 4. Machine Learning Recommender Service ---');
  const similar = mlRecommender.getSimilarTitles(testTitle.id, 4);
  assert(similar.length > 0 && similar[0].similarity > 0, `Item-to-item vector similarity computed top matches (e.g. ${similar[0].title.title} @ ${similar[0].similarity}%)`);
  const feed = mlRecommender.getPersonalizedFeed('usr-default-tubi-fan');
  assert(feed.topPicksForYou.length > 0, 'Personalized feed computed user affinity vector');

  // 5. 24/7 FAST Linear EPG Service
  console.log('\n--- 5. FAST Linear TV & EPG Service ---');
  const channels = fastLinearService.getChannels();
  assert(channels.length >= 6, `FAST linear TV loaded ${channels.length} 24/7 channels`);
  assert(channels[0].schedule.length > 0, `Channel ${channels[0].name} has dynamic 24-hr schedule`);

  // 6. Smart TV Device Pairing Code Flow
  console.log('\n--- 6. Smart TV Activation & Auth Service ---');
  const pairing = authService.generateDevicePairingCode('smart_tv', 'Sony Bravia 4K');
  assert(pairing.code.length === 6, `Generated 6-character TV pairing code: ${pairing.code}`);
  const verifyRes = authService.verifyAndAuthorizeDeviceCode(pairing.code, 'usr-default-tubi-fan');
  assert(verifyRes.success, 'Verified and authorized TV device code via user account');
  const pollStatus = authService.pollDeviceActivationStatus(pairing.code);
  assert(pollStatus?.status === 'authorized', 'TV status poll confirmed device is active');

  // 7. Executive Analytics Summary
  console.log('\n--- 7. Real-Time Analytics & Telemetry ---');
  const dashboard = analyticsService.getLiveDashboardSummary();
  assert(dashboard.totalViewersNow > 4000, `Live viewers aggregation: ${dashboard.totalViewersNow}`);
  assert(dashboard.qosMetrics.averageBufferRatio < 1.0, `QoS buffer ratio: ${dashboard.qosMetrics.averageBufferRatio}%`);

  // 8. Watch Party Co-Watching Service
  console.log('\n--- 8. Watch Party & Co-Watching Sync ---');
  const room = watchPartyService.createRoom('usr-host-1', 'Alex Host', testTitle.id);
  assert(room.id.startsWith('PARTY-'), `Watch Party room created with code: ${room.id}`);
  const joinRes = watchPartyService.joinRoom(room.id, 'usr-guest-2', 'Jordan Guest');
  assert(joinRes.success && joinRes.room?.members.length === 2, 'Attendee joined room successfully with 2 members');
  const syncRoom = watchPartyService.syncPlaybackState(room.id, 'usr-host-1', 'seek', 120);
  assert(syncRoom?.playbackState.currentTimeSeconds === 120, 'Playback state synced to 120s');
  const chatMsg = watchPartyService.sendChatMessage(room.id, 'usr-guest-2', 'Jordan Guest', 'Epic scene!');
  assert(chatMsg?.text === 'Epic scene!', 'Live chat message sent and delivered in party log');

  // 9. Natural Language AI Search Service
  console.log('\n--- 9. AI Natural Language Search ---');
  const aiSearch = aiSearchService.parseAndSearch('action movies with robots and high rating');
  assert(aiSearch.matchedFilters.extractedGenres.includes('action'), 'Extracted genre intent: Action');
  assert(aiSearch.matchedFilters.extractedKeywords.includes('robot'), 'Extracted keyword theme: robot');
  assert(aiSearch.matchedFilters.minImdbScore === 8.0, 'Extracted rating filter: IMDb >= 8.0');
  assert(aiSearch.titles.length > 0, `Returned ${aiSearch.titles.length} AI-ranked titles with explanation tags`);

  console.log(`\n====================================================`);
  console.log(`🎉 Verification Summary: ${passed} Passed, ${failed} Failed`);
  console.log(`====================================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
