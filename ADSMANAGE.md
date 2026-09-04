# 📺 TubiStream: Complete Ad Engine Management & Control Guide

Welcome to the **TubiStream Ad Management & Monetization Control Guide**. This document details the entire ad technology architecture, administrative controls, campaign ingestion workflow, delivery pacing rules, and IAB industry standards powering the TubiStream platform.

---

## 📑 Table of Contents
1. [Architectural Overview & Standards](#1-architectural-overview--standards)
2. [Executive Ad Studio: Access & KPI Dashboard](#2-executive-ad-studio-access--kpi-dashboard)
3. [Global Ad Engine Delivery Rules & Pod Controls](#3-global-ad-engine-delivery-rules--pod-controls)
4. [Campaign & Creative Inventory Management (CRUD)](#4-campaign--creative-inventory-management-crud)
5. [IAB VAST 4.2 & VMAP 1.0 Inspection & Testing](#5-iab-vast-42--vmap-10-inspection--testing)
6. [Tracking Beacons, Quartiles & Revenue Attribution](#6-tracking-beacons-quartiles--revenue-attribution)
7. [Shoppable Pause Ads & Dynamic QR Engine](#7-shoppable-pause-ads--dynamic-qr-engine)
8. [Developer REST API Reference](#8-developer-rest-api-reference)

---

## 1. Architectural Overview & Standards

TubiStream implements a hybrid **Server-Side Ad Decisioning (SSAI) & Client-Side Ad Insertion (CSAI)** engine designed to maximize ad fill rate while maintaining broadcast-quality playback.

```
+-------------------------------------------------------------------------------+
|                             TUBISTREAM AD TECH STACK                           |
+-------------------------------------------------------------------------------+
                                        |
                 +----------------------+----------------------+
                 |                                             |
                 v                                             v
     [ IAB VAST 4.2 XML Engine ]                   [ IAB VMAP 1.0 Scheduler ]
  (Linear Creatives, VideoClicks,              (Dynamic Cue Points Timeline:
   Quartile Tracking Beacons)                   Pre-roll @ 0s, Mid-rolls @ Cue Points)
                 |                                             |
                 +----------------------+----------------------+
                                        |
                                        v
                            [ Ad Engine Core Service ]
                       (adEngineService.ts & adRoutes.ts)
                                        |
                 +----------------------+----------------------+
                 |                      |                      |
                 v                      v                      v
         [ VIP Ad Bypass ]       [ Podding Rules ]      [ Tracking Beacons ]
       (Ad-Free for Premium)     (1 or 2 Ads/Break)     (Impression, Q1, Mid,
                                                         Q3, Complete, Click)
```

### Supported Industry Standards:
- **IAB VAST 4.2 (Video Ad Serving Template)**: Delivers standardized XML payloads containing progressive MP4/HLS media files, pricing models (CPM in USD), and tracking pixels.
- **IAB VMAP 1.0 (Video Multiple Ad Playlist)**: Automatically maps content cue points to linear ad breaks across a video timeline.
- **SCTE-35 Cue Point Injection**: Coordinates ad splice points with video durations.

---

## 2. Executive Ad Studio: Access & KPI Dashboard

### How to Access:
1. Open the TubiStream Web Platform at `http://localhost:3000`.
2. In the top navigation bar, click the purple **"Admin CMS"** button.
3. In the studio tabs, click **"Ad Engine & Inventory"** (with the `$` icon).

### Real-Time KPI Telemetry:
At the top of the Admin CMS, the platform tracks real-time monetization metrics:
- **Total Ad Revenue Today ($)**: Calculated continuously from served impressions and floor CPM.
- **Active Ad Impressions**: Live counter of all impression beacon triggers.
- **Click-Through Rate (CTR %)**: Ratio of viewer click-throughs to total impressions (typical benchmark: 4.5% - 5.5%).
- **Fill Rate (%)**: Percentage of ad break opportunities successfully matched with active creatives (consistently >99%).
- **Active Campaigns Count**: Number of currently active and scheduled creatives in the inventory.

---

## 3. Global Ad Engine Delivery Rules & Pod Controls

Admins can adjust delivery rules in real time without restarting backend services. Changes take effect on the very next video play.

| Control Setting | Default | Description | Impact |
| :--- | :--- | :--- | :--- |
| **Pre-Roll Ads (0:00)** | `ON` | Plays an ad immediately before video stream begins. | Turn OFF for binge-watching sessions or immediate playback testing. |
| **Mid-Roll Breaks** | `ON` | Inserts ad breaks at configured cue points (e.g. 5m, 15m, 30m). | Turn OFF to disable all interruptions during long-form feature films. |
| **Shoppable Pause Ads** | `ON` | Displays non-intrusive interactive product cards with QR codes when paused. | Turn OFF to return to clean video pause overlay without sponsor cards. |
| **VIP Ad-Free Bypass** | `ON` | Completely suppresses ads for users with the `vip_premium` subscription tier. | Turn OFF if running platform-wide sponsored promotional events. |
| **Max Ads per Pod** | `1 Ad` | Sets pod density to **1 Ad** (Standard) or **2 Ads** (Double Pod). | Doubling pod size increases monetization per break by up to 90%. |
| **Min Mid-roll Spacing** | `10 Min` | Enforces minimum interval between consecutive mid-roll ad breaks (5m, 10m, 15m). | Prevents ad fatigue and viewer drop-off. |

---

## 4. Campaign & Creative Inventory Management (CRUD)

### ➕ Ingesting a New Ad Campaign:
1. Navigate to **Admin CMS -> Ad Engine & Inventory**.
2. Scroll to the **"Create & Schedule New Ad Campaign"** card.
3. Fill in the creative parameters:
   - **Advertiser Name**: e.g., `Nike`, `Coca-Cola`, `Sony PlayStation`.
   - **Creative Title**: e.g., `Air Max Pulse - Just Do It`.
   - **Category / Genre**: e.g., `Athletic`, `Beverage`, `Tech`, `Automotive`.
   - **Duration**: `15s Spot` or `30s Spot`.
   - **Floor CPM ($)**: Expected revenue per 1,000 impressions (e.g., `28.50`).
   - **Video Media Stream URL**: Direct HLS `.m3u8` or progressive MP4 video link.
   - **VAST 4.2 / 3.0 Tag Endpoint URL (Optional)**: External third-party SSP / DSP / Ad Server VAST XML Tag URL (e.g. Google Ad Manager, Magnite, FreeWheel, SpringServe) with placeholder `e.g. https://securepubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/1234/ad_unit&output=vast`. If left blank, TubiStream serves native SSAI VAST 4.2 XML.
   - **Click-Through Destination URL**: Landing page where users land upon clicking (e.g., `https://nike.com`).
4. Click **"Deploy Ad Campaign"**. The creative is instantly deployed into active inventory.

### ⏸️ One-Click Campaign Pausing & Resuming:
- In the **Active Ad Inventory** table, locate any ad campaign.
- Click the **ACTIVE / PAUSED** status pill in the *Delivery Status* column.
- **Paused** ads are immediately omitted from all VAST and VMAP playlists.

### 💲 Dynamic In-Line CPM Price Adjustment:
- In the **Active Ad Inventory** table, click on the gold CPM price (e.g., `$28.50`).
- Enter the new floor CPM price in the input field.
- Click **Save**. Future impression revenue calculations immediately use the updated rate.

### 🗑️ Retiring / Deleting Campaigns:
- Click the red **Trash Can** icon next to any campaign to permanently retire it from inventory.

---

## 5. IAB VAST 4.2 & VMAP 1.0 Inspection & Testing

TubiStream provides automated IAB endpoints that can be validated using external ad debuggers (e.g., Google Video Suite Inspector).

### Copying VAST 4.2 Endpoint URL:
- In the **Active Ad Inventory** table, click the **"VAST URL"** button next to any ad.
- The direct XML URL is copied to your clipboard:
  ```
  http://localhost:5000/api/ads/vast?adId=ad-coca-cola-zero
  ```

### Live In-Dashboard XML Inspector:
- Click the cyan **"Inspect"** button next to any ad to open the raw XML viewer.
- The modal displays the generated IAB VAST 4.2 XML with syntax coloring, duration formatting (`00:00:15`), linear creative nodes, tracking events, and `<VideoClicks>` nodes.

### Dynamic VMAP 1.0 Timeline Endpoint:
- To inspect all scheduled ad breaks for a specific title:
  ```
  http://localhost:5000/api/ads/vmap/mov-sintel-2010
  ```
- Returns the complete IAB VMAP schedule containing `<vmap:AdBreak>` elements with `timeOffset="start"` (pre-roll) and formatted mid-roll offsets (e.g., `00:05:00`, `00:15:00`).

---

## 6. Tracking Beacons, Quartiles & Revenue Attribution

Every ad creative deployed in TubiStream automatically receives tracking endpoints:

```
[Ad Start] --------> [First Quartile (25%)] --------> [Midpoint (50%)] --------> [Third Quartile (75%)] --------> [Complete (100%)]
     |                           |                            |                           |                          |
/api/ads/track?event=start  /api/ads/track?event=firstQuartile  /api/ads/track?event=midpoint  /api/ads/track?event=thirdQuartile  /api/ads/track?event=complete
```

- **Impression Beacon**: Fired when the first frame of the ad is rendered (`event=impression`).
- **Quartile Beacons**: Fired sequentially as the viewer progresses through the ad video (`start`, `firstQuartile`, `midpoint`, `thirdQuartile`, `complete`).
- **Click-Through Beacon**: Fired when the viewer clicks the ad creative or "Learn More" button (`event=click`).

### Revenue Attribution Formula:
$$\text{Revenue} = \left(\frac{\text{Total Recorded Impressions}}{1000}\right) \times \text{Average Floor CPM}$$

---

## 7. Shoppable Pause Ads & Dynamic QR Engine

When a viewer pauses video playback, TubiStream renders a non-intrusive **Shoppable Pause Ad**:
- Features high-resolution product imagery and promotional discount codes (e.g., `TUBI20`).
- Generates a scannable **QR Code** that viewers can scan directly off television or desktop screens using their mobile phones.
- Completely suppressed for VIP Premium subscribers when `vipAdFreeBypass` is enabled.
- Can be toggled globally in **Admin CMS -> Ad Engine Delivery Rules -> Shoppable Pause Ads**.

---

## 8. Developer REST API Reference

All ad management capabilities are accessible via REST API:

### 1. Get Ad Inventory & Delivery Config
```bash
curl -X GET http://localhost:5000/api/admin/ads
```

### 2. Update Ad Delivery Rules
```bash
curl -X POST http://localhost:5000/api/admin/ads/config \
  -H "Content-Type: application/json" \
  -d '{
    "prerollEnabled": true,
    "midrollEnabled": true,
    "pauseAdsEnabled": true,
    "maxAdsPerBreak": 2,
    "minMidrollIntervalMinutes": 10,
    "vipAdFreeBypass": true
  }'
```

### 3. Deploy New Ad Campaign
```bash
curl -X POST http://localhost:5000/api/admin/ads \
  -H "Content-Type: application/json" \
  -d '{
    "advertiserName": "Nike",
    "campaignId": "camp-nike-2026",
    "title": "Air Max Pulse",
    "category": "Athletic",
    "durationSeconds": 15,
    "cpm": 32.00,
    "videoUrl": "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    "clickThroughUrl": "https://nike.com"
  }'
```

### 4. Toggle Campaign Status (Active/Paused)
```bash
curl -X PATCH http://localhost:5000/api/admin/ads/ad-coca-cola-zero/status
```

### 5. Update Floor CPM Price
```bash
curl -X PATCH http://localhost:5000/api/admin/ads/ad-coca-cola-zero/cpm \
  -H "Content-Type: application/json" \
  -d '{"cpm": 34.50}'
```

### 6. Delete Ad Creative
```bash
curl -X DELETE http://localhost:5000/api/admin/ads/ad-custom-123456789
```

### 7. Fetch IAB Standard VAST 4.2 XML
```bash
curl -X GET "http://localhost:5000/api/ads/vast?adId=ad-coca-cola-zero"
```

### 8. Fetch IAB Standard VMAP 1.0 Schedule
```bash
curl -X GET "http://localhost:5000/api/ads/vmap/mov-sintel-2010"
```

---

*TubiStream Ad Tech Engine &copy; 2026. Enterprise Ad Serving Architecture.*
