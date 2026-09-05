# 📺 The Complete Live TV & FAST Streaming Ingestion Guide

This comprehensive guide explains **where to find legal Live TV and FAST (Free Ad-Supported Streaming TV) streams**, **how live stream protocols work**, and **how to ingest them into your TubiStream platform** through the Admin CMS UI, the REST API, and code.

---

## 📑 Table of Contents
1. [Understanding Live Streaming Protocols](#1-understanding-live-streaming-protocols)
2. [Where to Get Free & Legal Live TV Links](#2-where-to-get-free--legal-live-tv-links)
   - [A. IPTV-org: The World's Largest Open-Source Collection](#a-iptv-org-the-worlds-largest-open-source-collection)
   - [B. Official Free-to-Air (FTA) & Public Broadcasters](#b-official-free-to-air-fta--public-broadcasters)
   - [C. FAST Ecosystem (Pluto TV, Samsung TV Plus, Roku Channel)](#c-fast-ecosystem-pluto-tv-samsung-tv-plus-roku-channel)
   - [D. Self-Hosted 24/7 Linear Channels (Creating Your Own Channels)](#d-self-hosted-247-linear-channels-creating-your-own-channels)
3. [Ready-to-Use Tested Working Live Stream Presets](#3-ready-to-use-tested-working-live-stream-presets)
4. [How to Ingest Live TV Links into TubiStream](#4-how-to-ingest-live-tv-links-into-tubistream)
   - [Method 1: Ingestion via the Admin CMS Studio (No-Code UI)](#method-1-ingestion-via-the-admin-cms-studio-no-code-ui)
   - [Method 2: Ingestion via REST API](#method-2-ingestion-via-rest-api)
   - [Method 3: Bulk Permanent Ingestion via Code](#method-3-bulk-permanent-ingestion-via-code)
5. [Critical Gotchas & Troubleshooting](#5-critical-gotchas--troubleshooting)
   - [Handling CORS (Cross-Origin Resource Sharing)](#handling-cors-cross-origin-resource-sharing)
   - [Handling Mixed Content (HTTP vs HTTPS)](#handling-mixed-content-http-vs-https)
   - [Handling Geo-Restrictions & Expiring Tokens](#handling-geo-restrictions--expiring-tokens)

---

## 1. Understanding Live Streaming Protocols

Web browsers (Chrome, Safari, Firefox, Edge, Smart TVs) cannot directly play raw cable feeds or satellite signals. They rely on HTTP-based chunked streaming:

| Protocol | Extension | Browser Support | Best Use Case |
| :--- | :--- | :--- | :--- |
| **HLS (HTTP Live Streaming)** | `.m3u8` | Native on Safari / iOS; All browsers via **Hls.js** *(Built into TubiStream)* | **Industry standard for Live TV & FAST**. 99% of live links are HLS. |
| **MPEG-DASH** | `.mpd` | All browsers via **Shaka Player** / Dash.js | Multi-DRM (Widevine/PlayReady) enterprise broadcasts. |
| **RTMP / RTSP** | `rtmp://` | ❌ Not supported in modern browsers | Ingestion from cameras/OBS into a media server (e.g. MediaMTX/FFmpeg) which converts it to `.m3u8`. |

> [!IMPORTANT]
> Always look for URLs ending in **`.m3u8`** (Master Playlist or Stream Manifest) when searching for Live TV links to ingest into TubiStream.

---

## 2. Where to Get Free & Legal Live TV Links

### A. IPTV-org: The World's Largest Open-Source Collection
[**IPTV-org**](https://github.com/iptv-org/iptv) is a collaborative community project gathering thousands of publicly available, legal, free-to-air (FTA) broadcasts from around the world.

- **GitHub Repository**: [https://github.com/iptv-org/iptv](https://github.com/iptv-org/iptv)
- **Official Web Index**: [https://iptv-org.github.io](https://iptv-org.github.io)

#### Master Category Playlists (Raw `.m3u8` Lists):
You can open any of these playlists in a text editor or browser to copy individual `.m3u8` channel URLs:
- **News**: `https://iptv-org.github.io/iptv/categories/news.m3u8`
- **Movies**: `https://iptv-org.github.io/iptv/categories/movies.m3u8`
- **Documentary**: `https://iptv-org.github.io/iptv/categories/documentary.m3u8`
- **Animation / Kids**: `https://iptv-org.github.io/iptv/categories/animation.m3u8`
- **Music**: `https://iptv-org.github.io/iptv/categories/music.m3u8`
- **Sports**: `https://iptv-org.github.io/iptv/categories/sports.m3u8`
- **Comedy**: `https://iptv-org.github.io/iptv/categories/comedy.m3u8`

#### Country-Specific Channels:
- **United States**: `https://iptv-org.github.io/iptv/countries/us.m3u8`
- **United Kingdom**: `https://iptv-org.github.io/iptv/countries/uk.m3u8`
- **France**: `https://iptv-org.github.io/iptv/countries/fr.m3u8`
- **Germany**: `https://iptv-org.github.io/iptv/countries/de.m3u8`
- **Nigeria**: `https://iptv-org.github.io/iptv/countries/ng.m3u8`
- **Ghana**: `https://iptv-org.github.io/iptv/countries/gh.m3u8`
- **Kenya**: `https://iptv-org.github.io/iptv/countries/ke.m3u8`

---

### B. Official Free-to-Air (FTA) & Public Broadcasters
Many major international news and educational networks provide direct, unencrypted public HLS live streams for web distribution:

- **NASA TV**: Official continuous NASA science, space station missions, and rocket launches.
- **Bloomberg Quicktake / News**: Global financial news and market analysis.
- **Deutsche Welle (DW English)**: Germany's public international broadcaster.
- **France 24 English**: International news round-the-clock from Paris.
- **Al Jazeera English**: Global breaking news and documentaries.
- **Euronews English**: European and world affairs.
- **Red Bull TV**: Extreme sports, live racing events, and outdoor documentaries.
- **PBS Kids**: Family and educational programming.

---

### C. FAST Ecosystem (Pluto TV, Samsung TV Plus, Roku Channel)
FAST (Free Ad-Supported Streaming TV) channels are linear digital streams packaged with scheduled programming and dynamic ad breaks.

There are legal open-source bridge tools that extract public FAST streams:
1. **ErsatzTV / Pluto-for-Channels**:
   - Projects on GitHub (e.g. `pluto-for-channels`, `tubi-m3u`, `samsung-tvplus-m3u`) generate local M3U playlists and EPG XML files from public free streaming services.
2. **Local EPG & Manifest Aggregators**:
   - Tools like [**m3u4u**](https://m3u4u.com) allow you to organize, clean up channel numbering, and filter only high-uptime streams.

---

### D. Self-Hosted 24/7 Linear Channels (Creating Your Own Channels)
You don't just have to rely on external links—you can **broadcast your own 24/7 linear channels** from your own movie files:

#### Option 1: ErsatzTV (Recommended for FAST creation)
[**ErsatzTV**](https://ersatztv.org) is an open-source tool that lets you configure custom live TV channels using your own video library (MP4, MKV).
- You create schedules (e.g., "80s Action Movie Marathon from 8pm - midnight").
- It outputs an **HLS `.m3u8` stream URL** and an XMLTV guide.
- You take that `.m3u8` URL and paste it directly into TubiStream!

#### Option 2: FFmpeg Loop Streaming (Quick & Lightweight)
You can take any MP4 movie and stream it continuously as an HLS live feed with a single command:
```bash
ffmpeg -re -stream_loop -1 -i movie.mp4 \
  -c:v libx264 -preset veryfast -b:v 3000k -maxrate 3000k -bufsize 6000k \
  -c:a aac -b:a 128k -ar 48000 \
  -f hls -hls_time 4 -hls_list_size 5 -hls_flags delete_segments \
  ./public/live/action_channel.m3u8
```

#### Option 3: OBS Studio + MediaMTX
- Stream live from OBS Studio via RTMP (`rtmp://localhost:1935/live/stream`).
- MediaMTX converts the RTMP input into a low-latency HLS stream (`http://localhost:8888/live/stream/index.m3u8`).
- Ingest `http://localhost:8888/live/stream/index.m3u8` into TubiStream as a Live Channel.

---

## 3. Ready-to-Use Tested Working Live Stream Presets

Here is a curated table of reliable, publicly accessible HLS streams you can immediately copy and paste into TubiStream:

| Channel Name | Category | Stream URL (`.m3u8`) | Suggested Logo URL |
| :--- | :--- | :--- | :--- |
| **NASA TV HD** | Documentary | `https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8` | `https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200` |
| **Red Bull TV Live** | Sports | `https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8` | `https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=200` |
| **France 24 English** | News | `https://static.france24.com/live/F24_EN_LO_HLS/live_web.m3u8` | `https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200` |
| **Deutsche Welle (DW English)** | News | `https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8` | `https://images.unsplash.com/photo-1495020689067-958852a7765e?w=200` |
| **Al Jazeera English** | News | `https://live-hls-web-aje.getaj.net/AJE/03.m3u8` | `https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=200` |
| **Big Buck Bunny (24/7 Loop)** | Animation | `https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8` | `https://images.unsplash.com/photo-1534447677768-be436bb09401?w=200` |
| **Sintel Cinema (4K Master)** | Movies | `https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8` | `https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200` |
| **Tears of Steel (Sci-Fi)** | Sci-Fi | `https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8` | `https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200` |

---

## 4. How to Ingest Live TV Links into TubiStream

### Method 1: Ingestion via the Admin CMS Studio (No-Code UI)

This is the easiest and most interactive way to add a live channel.

1. **Log in as Administrator**:
   - Go to `http://localhost:3000` (or your deployed site).
   - Sign in using administrator credentials (`admin@tubistream.com` / `AdminPass123!`).
2. **Open the Admin CMS**:
   - Click the **"Admin CMS"** button in the top navigation bar.
3. **Navigate to the FAST Tab**:
   - In the sidebar or top tab bar, click on **"FAST Channels"** (or Linear Broadcast CMS).
4. **Click "Broadcast New FAST Channel"**:
   - A modern sliding ingestion form will expand.
5. **Fill In Channel Details**:
   - **Channel Display Name**: e.g., `France 24 World News`
   - **Channel Number**: e.g., `107` (The system automatically proposes the next available sequential channel).
   - **Category**: Select from `News`, `Movies`, `Action`, `Comedy`, `Sci-Fi`, `Documentary`, `Sports`, `Kids`.
   - **Logo Image URL**: Direct HTTPS link to a channel logo or banner thumbnail.
   - **Description**: A short description of the channel programming.
   - **Live Transmission Stream URL (`.m3u8`)**: Paste the direct `.m3u8` URL (e.g. `https://static.france24.com/live/F24_EN_LO_HLS/live_web.m3u8`).
6. **Submit**:
   - Click **"Broadcast Channel Live"**.
   - You will see an instant success toast notification.
7. **Verify**:
   - Click **"Live TV"** on the main navigation bar.
   - Your new channel is immediately on-air with an automatically synced 24/7 EPG rolling schedule!

---

### Method 2: Ingestion via REST API

If you have an automated script, scraper, or M3U playlist importer, you can ingest channels programmatically via the backend API.

#### Endpoint: `POST /api/admin/fast/channels`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <admin_token>` (or `x-admin-token: admin-secret-token-12345`)

#### cURL Example:
```bash
curl -X POST http://localhost:5000/api/admin/fast/channels \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin-secret-token-12345" \
  -d '{
    "channelNumber": 108,
    "name": "Red Bull TV Live",
    "category": "Sports",
    "logoUrl": "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=200",
    "description": "24/7 live action sports, racing championships, and global adventure documentaries.",
    "streamUrl": "https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8"
  }'
```

#### Successful JSON Response (`201 Created`):
```json
{
  "id": "fast-red-bull-tv-live",
  "channelNumber": 108,
  "name": "Red Bull TV Live",
  "category": "Sports",
  "logoUrl": "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=200",
  "description": "24/7 live action sports, racing championships, and global adventure documentaries.",
  "streamUrl": "https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8",
  "schedule": [...]
}
```

---

### Method 3: Bulk Permanent Ingestion via Code

To seed channels permanently in your codebase so they persist across every server reboot or deployment:

1. Open [`server/src/data/seedCatalog.ts`](file:///c:/Users/XPRISTO/Desktop/tva/tv-stream/server/src/data/seedCatalog.ts).
2. Scroll to `export const SEED_FAST_CHANNELS: FastChannel[] = [ ... ]` (around line 645).
3. Add your new channel object to the array:
```typescript
{
  id: 'fast-france24-en',
  channelNumber: 107,
  name: 'France 24 English',
  category: 'News',
  logoUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200',
  description: 'Live international news and world coverage 24/7 from Paris in HD.',
  streamUrl: 'https://static.france24.com/live/F24_EN_LO_HLS/live_web.m3u8',
  schedule: []
},
```
4. Save the file. The server will hot-reload and seed the channel automatically.

---

## 5. Critical Gotchas & Troubleshooting

### Handling CORS (Cross-Origin Resource Sharing)
**Symptom**: The channel plays in VLC Media Player, but shows a black screen or console error in the browser:
> `Access to XMLHttpRequest at 'https://example.com/live.m3u8' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Why this happens**:
Web browsers enforce security boundaries. If the external streaming server does not return the HTTP header:
```http
Access-Control-Allow-Origin: *
```
the browser blocks JavaScript from reading the `.m3u8` playlist segments.

**How to solve it**:
1. **Prefer CORS-enabled streams**: Most modern public broadcasters (NASA, France 24, Red Bull, Akamai-hosted streams) already send `Access-Control-Allow-Origin: *`.
2. **Use a Streaming Reverse Proxy**:
   Route the stream through your Node.js server or Cloudflare Worker so your own domain serves the segments with CORS headers:
   ```typescript
   // Example Express proxy endpoint in server:
   app.get('/api/proxy/stream', async (req, res) => {
     const streamUrl = req.query.url as string;
     const response = await fetch(streamUrl);
     res.setHeader('Access-Control-Allow-Origin', '*');
     res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
     response.body.pipe(res);
   });
   ```

---

### Handling Mixed Content (HTTP vs HTTPS)
**Symptom**: When your site is deployed to Render, Vercel, or AWS with SSL (`https://mytubistream.onrender.com`), some channels fail with:
> `Mixed Content: The page at 'https://...' was loaded over HTTPS, but requested an insecure XMLHttpRequest endpoint 'http://...'. This request has been blocked.`

**How to solve it**:
- **Always use `https://` stream URLs** in production.
- If a provider only has `http://`, proxy it through your secure backend API or an SSL-enabled reverse proxy (e.g. Nginx / Cloudflare).

---

### Handling Geo-Restrictions & Expiring Tokens
**Symptom**: A live channel works for 1 hour, then suddenly dies.
- Many commercial streaming providers attach temporary tokens to URLs (e.g., `?token=exp=1690000000~hmac=...`).
- **Rule of Thumb**: For permanent FAST channel listings, use **static master playlist endpoints** (like those listed in Section 3) rather than temporary session URLs.

---

## 🚀 Quick Verification Checklist

When adding any new Live TV channel, run through this 4-step checklist:
1. [ ] Is the URL ending in `.m3u8` or `.mpd`?
2. [ ] Does the URL start with `https://`?
3. [ ] Does the stream allow CORS (plays in Chrome/Firefox without header errors)?
4. [ ] Did you assign a unique channel number (e.g. 101, 102, 103...)?

*Your TubiStream platform is now equipped for 24/7 continuous FAST linear broadcasting!*
