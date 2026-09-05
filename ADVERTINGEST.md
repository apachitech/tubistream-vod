# 💰 The Complete Video Advertising & Ad Ingestion Guide

This comprehensive guide explains **where to find paying advertisers and ad networks for your streaming platform**, **how video ad pricing (CPM) works**, and **how to ingest paying video ads, VAST tags, and shoppable pause campaigns into TubiStream**.

---

## 📑 Table of Contents
1. [Monetization Architecture & Supported Standards](#1-monetization-architecture--supported-standards)
2. [Where to Get Paying Advertisers (Top Ad Networks & Platforms)](#2-where-to-get-paying-advertisers-top-ad-networks--platforms)
   - [Tier 1: Premium Programmatic Video SSPs (Highest CPMs: $10 - $35+)](#tier-1-premium-programmatic-video-ssps-highest-cpms-10---35)
   - [Tier 2: Instant-Approval Video Networks (Best for New Sites: $3 - $10+)](#tier-2-instant-approval-video-networks-best-for-new-sites-3---10)
   - [Tier 3: Direct Brand Sponsorships (Highest Profit Margin: $25 - $50+ CPM)](#tier-3-direct-brand-sponsorships-highest-profit-margin-25---50-cpm)
   - [Tier 4: Shoppable Affiliate & Dynamic QR Pause Ads (5% - 25% RevShare)](#tier-4-shoppable-affiliate--dynamic-qr-pause-ads-5---25-revshare)
3. [Step-by-Step: How to Ingest Paying Ads into TubiStream](#3-step-by-step-how-to-ingest-paying-ads-into-tubistream)
   - [Method 1: Ingesting Direct Video Ads via Admin CMS Studio (No-Code UI)](#method-1-ingesting-direct-video-ads-via-admin-cms-studio-no-code-ui)
   - [Method 2: Ingesting Programmatic VAST 4.2 Tag URLs](#method-2-ingesting-programmatic-vast-42-tag-urls)
   - [Method 3: Ingesting Campaigns via Backend REST API](#method-3-ingesting-campaigns-via-backend-rest-api)
   - [Method 4: Configuring Shoppable QR Pause Ads](#method-4-configuring-shoppable-qr-pause-ads)
4. [Revenue Calculator & Expected Earnings](#4-revenue-calculator--expected-earnings)
5. [Industry Ad Creative Specifications & Best Practices](#5-industry-ad-creative-specifications--best-practices)

---

## 1. Monetization Architecture & Supported Standards

TubiStream uses a hybrid **AVOD (Advertising-Supported Video on Demand)** and **SVOD (Subscription Video on Demand)** revenue model:
- **Free Members & Visitors**: Stream free movies, series, and 24/7 FAST channels monetized with video commercials.
- **Tubi+ VIP Members ($5.99/mo or $49.99/yr)**: Enjoy completely ad-free streaming with automatic server-side ad bypass.

```
+-------------------------------------------------------------------------------+
|                            TUBISTREAM AD DECISION STACK                       |
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
- **IAB VAST 4.2 (Video Ad Serving Template)**: Delivers video creatives (progressive MP4 or HLS), click-through destination URLs, and tracking beacons.
- **IAB VMAP 1.0 (Video Multiple Ad Playlist)**: Automatically synchronizes pre-roll, mid-roll, and post-roll ad pods with video cue points.
- **SCTE-35 Splice Points**: Coordinates ad pod injection in continuous 24/7 FAST linear broadcasts.

---

## 2. Where to Get Paying Advertisers (Top Ad Networks & Platforms)

### Tier 1: Premium Programmatic Video SSPs (Highest CPMs: $10 - $35+)

These Supply-Side Platforms (SSPs) connect your platform to major ad exchanges where thousands of international brands (Nike, Apple, Coca-Cola, Samsung, Netflix) bid in real-time for your video impressions.

| Network | Website | Average CPM | Approval Requirements | Payout Methods |
| :--- | :--- | :--- | :--- | :--- |
| **Google Ad Manager (GAM) / AdSense for Video (AFV)** | [admanager.google.com](https://admanager.google.com) | **$12 - $28+** | Established site, original content, clean domain | Wire Transfer, Direct Deposit |
| **Magnite (formerly Telaria)** | [magnite.com](https://magnite.com) | **$18 - $35+** | Official streaming platform used by **Tubi**, **Pluto TV**, and **Roku** | Wire Transfer, ACH |
| **SpringServe** | [springserve.com](https://springserve.com) | **$15 - $32+** | CTV / FAST channel publisher traffic | Wire Transfer |
| **PubMatic** | [pubmatic.com](https://pubmatic.com) | **$10 - $24+** | Moderate traffic volume | Wire Transfer, ACH |
| **OpenX** | [openx.com](https://openx.com) | **$10 - $22+** | Video publisher review | Wire Transfer |

#### How to Apply for Google AdSense for Video (AFV):
1. Sign in to your [Google AdSense](https://adsense.google.com) or [Google Ad Manager](https://admanager.google.com) account.
2. Under **Monetization ➔ Video**, enable **AdSense for Video (AFV)**.
3. Google will provide you with a **VAST Ad Tag URL** (e.g., `https://pubads.g.doubleclick.net/gampad/ads?iu=...`).
4. Ingest this VAST tag into TubiStream. Every video play automatically calls Google's live auction!

---

### Tier 2: Instant-Approval Video Networks (Best for New Sites: $3 - $10+)

If your site is new and does not have the massive traffic required by Google or Magnite, use these networks. They have **near-instant approval** with **no minimum traffic requirement**:

#### 1. Adsterra (Video VAST)
- **Website**: [adsterra.com](https://adsterra.com)
- **Ad Formats**: In-Stream Video (VAST pre-roll/mid-roll), Popunder, Native Banners.
- **Approval Time**: ~10 to 30 minutes.
- **Average CPM**: **$3.00 – $10.00+** (depending on viewer country).
- **Payout Frequency**: Bi-monthly (Net-15).
- **Minimum Payout**: $5 (WebMoney, Paxum), $100 (PayPal, Bitcoin, USDT Wire).

#### 2. Monetag (formerly PropellerAds)
- **Website**: [monetag.com](https://monetag.com)
- **Ad Formats**: VAST video pre-rolls, multi-tag banners.
- **Approval Time**: Instant.
- **Average CPM**: **$2.50 – $8.00+**.
- **Payout Methods**: PayPal, Wire transfer, Payoneer, Skrill.

#### 3. Adcash
- **Website**: [adcash.com](https://adcash.com)
- **Ad Formats**: Video in-stream ads, interstitials.
- **Approval Time**: 24 hours.

---

### Tier 3: Direct Brand Sponsorships (Highest Profit Margin: $25 - $50+ CPM)

Direct sponsorships have the **highest profit margin** because there is **no intermediary ad tech taking a 20%–40% commission cut**. You keep 100% of the money.

#### Who to Target:
1. **Fintech & Mobile Money**: Chipper Cash, Wave, OPay, Palmpay, LemFi, WorldRemit.
2. **Telecommunications**: MTN, Orange, Safaricom, Airtel, Vodafone.
3. **Food, Beverage & Quick Service**: Local soft drinks, energy drinks, restaurants.
4. **Entertainment & Gaming**: Film studios, local theatrical releases, sports betting apps.

#### Sponsorship Pricing Models:
- **Flat Monthly Retainer**: Sell exclusive Pre-roll placement on all "Action" movies for $500 – $2,500/month.
- **CPM Basis**: Charge $25.00 – $40.00 per 1,000 video plays.
- **Creative Collection**: The sponsor gives you a 15-second or 30-second `.mp4` video and their website link. You ingest it in the Admin CMS in 60 seconds!

---

### Tier 4: Shoppable Affiliate & Dynamic QR Pause Ads (5% - 25% RevShare)

TubiStream comes equipped with **Shoppable Pause Ads**. When a viewer pauses a movie to grab a snack, an interactive glassmorphic card appears with a **scannable QR code**.

#### Top Affiliate Programs:
- **Amazon Associates**: 3% to 10% commission on any product purchased.
- **Jumia / Konga Affiliates**: 5% to 15% on electronics and fashion.
- **ClickBank & Impact**: 15% to 40% on digital services, streaming subscriptions, or gaming.

---

## 3. Step-by-Step: How to Ingest Paying Ads into TubiStream

### Method 1: Ingesting Direct Video Ads via Admin CMS Studio (No-Code UI)

This is the standard graphical workflow inside your TubiStream management dashboard:

1. **Sign in as Admin**:
   - Go to `http://localhost:3000`.
   - Sign in with `admin@tubistream.com` and `AdminPass123!`.
2. **Open Ad Studio**:
   - Click **"Admin CMS"** in the top navigation bar.
   - Click the **"Ad Studio & Monetization"** tab.
3. **Click "+ Ingest New Campaign"**:
   - A modern ingestion form will open.
4. **Enter Campaign Details**:
   - **Campaign Name**: e.g., `Chipper Cash Summer Transfer Promo`
   - **Advertiser Name**: `Chipper Cash Inc.`
   - **Placement Type**: Choose `pre_roll` (starts before movie), `mid_roll` (interspersed at cue points), or `post_roll`.
   - **Video Creative URL**: Direct HTTPS link to the advertiser's `.mp4` video (e.g., hosted on AWS S3, Cloudinary, or Google Cloud Storage).
   - **Target Click URL**: The landing page when users click (e.g., `https://chippercash.com/promo`).
   - **Agreed CPM ($ USD)**: Enter the agreed price per 1,000 views (e.g., `25.00`).
   - **Skip Offset (Seconds)**: Set to `5` for skippable ads, or `0` for unskippable commercials.
5. **Save & Activate**:
   - Click **"Save & Ingest Creative"**.
   - The ad is immediately active across all free-tier video playback!

---

### Method 2: Ingesting Programmatic VAST 4.2 Tag URLs

When an ad network (like Adsterra, Google, or Magnite) supplies you with a dynamic **VAST Tag URL**:

1. In your backend [`server/src/services/adEngineService.ts`](file:///c:/Users/XPRISTO/Desktop/tva/tv-stream/server/src/services/adEngineService.ts), locate the ad inventory initialization:
```typescript
{
  id: 'ad-programmatic-vast-01',
  title: 'Adsterra Premium Video Feed',
  advertiser: 'Adsterra Global Exchange',
  type: 'pre_roll',
  videoUrl: 'https://storage.googleapis.com/tubistream-ads/fallback-preroll.mp4',
  vastTagUrl: 'https://xml.adsterra.com/vast?id=YOUR_ADSTERRA_PUBLISHER_ID',
  clickThroughUrl: 'https://adsterra.com',
  durationSeconds: 15,
  skipOffsetSeconds: 5,
  cpm: 12.50,
  status: 'active'
}
```
2. When the video player requests an ad, the engine calls the `vastTagUrl` dynamically to fetch the winning programmatic ad in real time!

---

### Method 3: Ingesting Campaigns via Backend REST API

If you want to automate campaign ingestion from an external CRM or ad booking portal:

#### Endpoint: `POST /api/admin/ads/creatives`
- **Headers**:
  - `Content-Type: application/json`
  - `x-user-id: usr-admin-stream` (or `Authorization: Bearer <admin_token>`)

#### cURL Example:
```bash
curl -X POST http://localhost:5000/api/admin/ads/creatives \
  -H "Content-Type: application/json" \
  -H "x-user-id: usr-admin-stream" \
  -d '{
    "title": "Nike Air Max 2026",
    "advertiser": "Nike Global",
    "type": "pre_roll",
    "videoUrl": "https://storage.googleapis.com/tubistream-ads/nike_30s.mp4",
    "clickThroughUrl": "https://nike.com/airmax",
    "durationSeconds": 30,
    "skipOffsetSeconds": 5,
    "cpm": 28.50
  }'
```

#### Successful JSON Response (`201 Created`):
```json
{
  "success": true,
  "creative": {
    "id": "ad-nike-air-max-2026",
    "title": "Nike Air Max 2026",
    "advertiser": "Nike Global",
    "type": "pre_roll",
    "cpm": 28.50,
    "status": "active"
  }
}
```

---

### Method 4: Configuring Shoppable QR Pause Ads

1. In the Admin CMS **Ad Studio**, click **"Pause Ad Campaigns"**.
2. Upload the promotional display card and enter your **affiliate tracking link**.
3. When a user presses **Pause** on web, mobile, or Smart TV:
   - A non-intrusive card appears with the product discount.
   - A high-resolution **QR code** is rendered dynamically.
   - When scanned, the viewer's smartphone loads the product page with your referral code attached.
   - Any purchases generate immediate affiliate commissions (5% to 25%).

---

## 4. Revenue Calculator & Expected Earnings

Video streaming commercials command the highest CPMs across the entire internet. Here is a projected revenue breakdown based on daily active free viewers:

### Formula:
$$\text{Estimated Revenue} = \frac{\text{Total Video Ad Impressions}}{1,000} \times \text{Average CPM}$$

| Daily Active Free Viewers | Video Plays / Day (Avg 2/viewer) | Ad Impressions (Avg 3 ads/movie) | Average CPM | Daily Revenue | Monthly Revenue |
| :---: | :---: | :---: | :---: | :---: | :---: |
| **500 viewers** | 1,000 plays | 3,000 ads | $12.00 CPM | **$36.00** | **$1,080 / month** |
| **2,500 viewers** | 5,000 plays | 15,000 ads | $15.00 CPM | **$225.00** | **$6,750 / month** |
| **10,000 viewers** | 20,000 plays | 60,000 ads | $18.00 CPM | **$1,080.00** | **$32,400 / month** |
| **50,000 viewers** | 100,000 plays | 300,000 ads | $22.00 CPM | **$6,600.00** | **$198,000 / month** |

> [!TIP]
> **Combine AVOD with SVOD**: As free viewers see ads, some will naturally upgrade to the **$5.99/month Tubi+ VIP** plan to remove ads, giving you predictable recurring subscription revenue on top of ad revenue!

---

## 5. Industry Ad Creative Specifications & Best Practices

When requesting video files from sponsors or ad agencies, ensure they match these broadcast specifications:

| Parameter | Recommended Specification |
| :--- | :--- |
| **Video Container** | Progressive MP4 (`.mp4`) or HLS (`.m3u8`) |
| **Video Codec** | H.264 (AVC) Main / High Profile |
| **Resolution** | 1080p (1920x1080) or 720p (1280x720) |
| **Aspect Ratio** | 16:9 widescreen |
| **Framerate** | 24, 25, or 30 fps (constant frame rate) |
| **Audio Codec** | AAC-LC, Stereo 2.0, 128 to 192 kbps, 48 kHz |
| **Loudness Normalization** | -24 LKFS / LUFS (EBU R128 standard to avoid loud commercials) |
| **Ad Duration** | 15 seconds or 30 seconds |
| **Skip Offset** | 5 seconds (standard for 30-second pre-rolls) |

---

## 🚀 Recommended Action Plan: What to Do First

1. **Today**: Sign up on [**Adsterra**](https://adsterra.com) or [**Monetag**](https://monetag.com) to generate your first VAST tag.
2. **Next**: Ingest your VAST tag or test video ads in **Admin CMS ➔ Ad Studio & Monetization**.
3. **Local Brands**: Reach out to 3-5 local businesses or fintech apps with a simple rate card offering them exclusive pre-roll video ads on your platform.
4. **Grow Traffic**: As your daily streaming numbers grow, apply to **Google Ad Manager** and **Magnite** for tier-1 programmatic monetization!
