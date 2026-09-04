import { Title, VideoRendition } from '../types';
import { catalogService } from './catalogService';

export class StreamService {
  /**
   * Generates a dynamic HLS Master Playlist (.m3u8) for a given title
   */
  public generateHlsMasterPlaylist(title: Title): string {
    const lines: string[] = [
      '#EXTM3U',
      '#EXT-X-VERSION:6',
      '#EXT-X-INDEPENDENT-SEGMENTS'
    ];

    // Audio grouping
    title.audioTracks.forEach((track, index) => {
      lines.push(
        `#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="audio-main",NAME="${track.label}",DEFAULT=${index === 0 ? 'YES' : 'NO'},AUTOSELECT=YES,LANGUAGE="${track.language}",URI="/api/streams/${title.id}/audio/${track.id}.m3u8"`
      );
    });

    // Subtitle grouping
    title.subtitles.forEach((sub) => {
      lines.push(
        `#EXT-X-MEDIA:TYPE=SUBTITLES,GROUP-ID="subs-main",NAME="${sub.label}",DEFAULT=${sub.default ? 'YES' : 'NO'},AUTOSELECT=YES,LANGUAGE="${sub.language}",URI="/api/streams/${title.id}/subs/${sub.id}.vtt"`
      );
    });

    // Video stream variants with bandwidth & resolution
    title.renditions.forEach((rend) => {
      const bandwidth = rend.bitrateKbps * 1000;
      const avgBandwidth = Math.round(bandwidth * 0.9);
      const codecs = rend.resolution === '4K' ? 'hev1.2.4.L153.B0,mp4a.40.2' : 'avc1.640028,mp4a.40.2';
      
      lines.push(
        `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},AVERAGE-BANDWIDTH=${avgBandwidth},RESOLUTION=${rend.width}x${rend.height},FRAME-RATE=${rend.fps}.000,CODECS="${codecs}",AUDIO="audio-main",SUBTITLES="subs-main"`
      );
      lines.push(`/api/streams/${title.id}/variant/${rend.resolution}.m3u8`);
    });

    return lines.join('\n');
  }

  /**
   * Generates dynamic MPEG-DASH (.mpd) XML manifest
   */
  public generateDashManifest(title: Title): string {
    const durationIso = `PT${Math.floor(title.durationMinutes / 60)}H${title.durationMinutes % 60}M0S`;
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<MPD xmlns="urn:mpeg:dash:schema:mpd:2011"
     profiles="urn:mpeg:dash:profile:isoff-live:2011"
     type="static"
     mediaPresentationDuration="${durationIso}"
     minBufferTime="PT2.0S">
  <Period id="P0" start="PT0S">
    <!-- Video Adaptation Set -->
    <AdaptationSet id="0" contentType="video" mimeType="video/mp4" codecs="avc1.640028" maxWidth="1920" maxHeight="1080" maxFrameRate="60" par="16:9">
      ${title.renditions.map((r, i) => `
      <Representation id="${r.resolution}" bandwidth="${r.bitrateKbps * 1000}" width="${r.width}" height="${r.height}" frameRate="${r.fps}">
        <BaseURL>/api/streams/${title.id}/dash/${r.resolution}/</BaseURL>
        <SegmentTemplate media="chunk-$Number$.m4s" initialization="init.mp4" duration="4000" startNumber="1"/>
      </Representation>`).join('')}
    </AdaptationSet>
    <!-- Audio Adaptation Set -->
    <AdaptationSet id="1" contentType="audio" mimeType="audio/mp4" codecs="mp4a.40.2" lang="en">
      <Representation id="audio-en" bandwidth="128000" audioSamplingRate="48000">
        <BaseURL>/api/streams/${title.id}/dash/audio-en/</BaseURL>
        <SegmentTemplate media="chunk-$Number$.m4s" initialization="init.mp4" duration="4000" startNumber="1"/>
      </Representation>
    </AdaptationSet>
  </Period>
</MPD>`;
  }

  /**
   * DRM License Key Exchange (ClearKey & Widevine metadata simulation)
   */
  public handleDrmLicenseRequest(body: { keyIds?: string[]; drmType?: string }): object {
    const defaultKeyId = '6a8f89c4d9e0481283e5a3294318357f';
    const rawKey = '9b2c83ef5012a938c47184209df35182';

    // ClearKey JSON Web Key (JWK) standard response
    return {
      keys: [
        {
          kty: 'oct',
          k: Buffer.from(rawKey, 'hex').toString('base64url'),
          kid: Buffer.from(defaultKeyId, 'hex').toString('base64url')
        }
      ],
      type: 'temporary',
      drmType: body.drmType || 'ClearKey',
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      status: 'GRANTED_L1_SECURE'
    };
  }

  /**
   * Transcoding pipeline simulator: calculates bitrate ladder specs and progress
   */
  public simulateTranscodeStatus(titleId: string): object {
    const title = catalogService.getTitleById(titleId);
    if (!title) return { status: 'not_found' };

    return {
      titleId: title.id,
      title: title.title,
      status: 'COMPLETE',
      inputCodec: 'ProRes 422 HQ 4K',
      outputProfiles: [
        { profile: 'AVC_1080p_6Mbps', status: 'READY', sizeMb: 320 },
        { profile: 'AVC_720p_3Mbps', status: 'READY', sizeMb: 160 },
        { profile: 'AVC_480p_1.2Mbps', status: 'READY', sizeMb: 75 },
        { profile: 'HEVC_4K_12Mbps_HDR10', status: 'READY', sizeMb: 740 },
        { profile: 'AV1_1080p_3.8Mbps', status: 'READY', sizeMb: 210 }
      ],
      audioTracksProcessed: 2,
      vttSubtitlesGenerated: ['en', 'es', 'fr'],
      drmEncryptionStatus: 'CENC_CLEARKEY_PACKAGED',
      cuePointsDetected: title.cuePointsSeconds
    };
  }
}

export const streamService = new StreamService();
