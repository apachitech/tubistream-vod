# 🌐 100% Free Hosting Alternatives for TubiStream

This document provides a comprehensive guide to **every viable free hosting alternative** for deploying your full-stack TubiStream platform (React Vite frontend + Node.js Express backend API, FAST EPG scheduler, and VAST ad decision engine).

---

## 📋 Architectural Overview

TubiStream consists of:
1. **Frontend**: React 19 Single-Page Application (Vite + TypeScript)
2. **Backend**: Node.js & Express Microservice Core (`server/src/index.ts`)
3. **Media CDN**: Cloudinary, Mux, or public HLS test feeds (external streaming media)

When choosing a free host, you have two architectural strategies:
- **Strategy A: All-in-One Full-Stack** (Frontend + Backend on 1 service). Easiest setup, single URL, zero CORS problems.
- **Strategy B: Split Architecture** (Frontend on a Global CDN + Backend on a Free Container). Maximum global speed and unlimited bandwidth.

---

## ⚡ Comparison Matrix: Free Hosting Providers

| Provider | Architecture | RAM / Compute | Monthly Bandwidth | Cold Starts / Inactivity Sleep? | Best For |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **[Koyeb](#1-koyeb-recommended-all-in-one)** | All-in-One | 512 MB RAM | 55 GB / month | ❌ **No sleep** (Stays responsive) | **Top pick for All-in-One**. Fast, reliable, no credit card required. |
| **[Railway](#2-railwayapp)** | All-in-One | Shared vCPU | $5 monthly free credits | ❌ **No sleep** | Seamless GitHub sync, blazing fast deployment. |
| **[Fly.io](#3-flyio)** | All-in-One | 3x 256MB VMs | 100 GB / month | ❌ **No sleep** | Ultra-low latency microVMs close to users worldwide. |
| **[Render](#4-rendercom)** | All-in-One | 512 MB RAM | 100 GB / month | ⚠️ **Yes** (Sleeps after 15m idle; ~40s cold start) | Simple backup, already supported in `DEPLOYMENT.md`. |
| **[Cloudflare Pages](#5-cloudflare-pages--backend)** | Split (Frontend) | Edge Workers | ♾️ **UNLIMITED** | ❌ **No sleep** | **Top pick for Frontend**. Zero bandwidth limits, fastest global CDN. |
| **[Vercel](#6-vercel--backend)** | Split (Frontend) | Edge CDN | 100 GB / month | ❌ **No sleep** | Instant branch previews and developer experience. |
| **[Netlify](#7-netlify--backend)** | Split (Frontend) | Edge CDN | 100 GB / month | ❌ **No sleep** | 1-click Git builds with easy environment variable setup. |
| **[Oracle Cloud](#8-oracle-cloud-always-free-tier)** | Full Dedicated VPS | **4 Cores, 24 GB RAM** | **10,000 GB (10 TB)** | ❌ **Never sleeps** (24/7 Dedicated Server) | **Most powerful free tier in existence.** Full root access. |

---

## 🚀 Option 1: Koyeb (Recommended All-in-One)

Koyeb offers an actual persistent free web service with **no cold starts**, making it one of the most reliable options for full-stack Node.js streaming backends.

### Why Koyeb?
- ✅ **512 MB RAM** free forever.
- ✅ **55 GB free global transfer** per month.
- ✅ Automatic HTTPS SSL certificates.
- ✅ Direct Git integration (builds automatically on `git push`).

### Step-by-Step Deployment on Koyeb:
1. Sign up for a free account at [koyeb.com](https://www.koyeb.com).
2. Click **Create App** and choose **GitHub**.
3. Select your repository: `apachitech/tubistream-vod`.
4. Configure the build and runtime settings:
   - **Builder**: `Node.js` (or Buildpack)
   - **Build Command**: `npm run build`
   - **Run Command**: `npm start`
   - **Port**: `5000`
5. Click **Deploy**.
6. Once deployed, Koyeb provides a live public URL:
   ```
   https://<your-app-name>.koyeb.app
   ```

---

## 🚂 Option 2: Railway.app

Railway provides $5 of monthly usage on its starter tier, which is more than enough to run the TubiStream all-in-one container 24/7.

### Why Railway?
- ✅ Fast container builds with zero configuration.
- ✅ Automatic branch deployments.
- ✅ No spin-down delays or cold boots.

### Step-by-Step Deployment on Railway:
1. Go to [railway.app](https://railway.app) and sign in with GitHub.
2. Click **New Project** ➔ **Deploy from GitHub repo**.
3. Select `apachitech/tubistream-vod`.
4. Railway will detect the root `package.json` automatically:
   - Build command: `npm run build`
   - Start command: `npm start`
5. Go to **Settings** ➔ **Networking** ➔ Click **Generate Domain**.
6. Your platform is live at `https://<your-app>.up.railway.app`.

---

## 🪰 Option 3: Fly.io

Fly.io turns your code into lightweight microVMs running on bare metal servers in regions closest to your audience.

### Why Fly.io?
- ✅ Up to 3 free shared-CPU microVMs.
- ✅ 100 GB outbound bandwidth included free.
- ✅ Excellent global network routing.

### Step-by-Step Deployment on Fly.io:
1. Install the Fly CLI:
   - **Windows (PowerShell)**:
     ```powershell
     powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
     ```
2. Authenticate:
   ```bash
   fly auth login
   ```
3. Initialize the app in the project root:
   ```bash
   fly launch
   ```
   *(Accept the defaults or select your preferred region).*
4. Deploy:
   ```bash
   fly deploy
   ```

---

## ☁️ Option 4: Cloudflare Pages + Koyeb/Railway (Recommended Split Strategy)

If you anticipate significant user traffic, hosting the frontend on **Cloudflare Pages** gives you **infinite bandwidth** with **zero hosting bills**, while hosting the backend on Koyeb or Railway.

### Why Cloudflare Pages?
- ✅ **Unlimited bandwidth** with no bandwidth caps.
- ✅ Deployed across 300+ edge data centers worldwide.
- ✅ 500 free builds per month.

### Step-by-Step Setup:
1. **Deploy Backend first** on Koyeb or Railway (following the steps above) to get your public API URL (e.g. `https://tubistream-api.koyeb.app`).
2. Go to [dash.cloudflare.com](https://dash.cloudflare.com) ➔ **Workers & Pages** ➔ **Create application** ➔ **Pages** ➔ **Connect to Git**.
3. Select your repository `tubistream-vod`.
4. Configure build settings:
   - **Framework preset**: `Vite`
   - **Root directory**: `client`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Under **Environment variables**, set:
   - `VITE_API_BASE`: `https://tubistream-api.koyeb.app/api`
6. Click **Save and Deploy**. Your frontend will be live on `https://<your-app>.pages.dev`.

---

## ▲ Option 5: Vercel (Frontend CDN)

Vercel is renowned for offering the fastest deployment speeds and global Edge Network routing for React Vite applications.

### Why Vercel?
- ✅ 100 GB monthly bandwidth.
- ✅ Automatic preview deployments on every Git pull request.
- ✅ Instant rollback capability.

### Step-by-Step Setup:
1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **Add New...** ➔ **Project** ➔ Import `tubistream-vod`.
3. Select **Root Directory**: Click Edit and select `client`.
4. Build and Output Settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**.

---

## 🐙 Option 6: Netlify (Frontend CDN)

Netlify is a top-tier alternative to Vercel with identical global CDN capabilities.

### Why Netlify?
- ✅ 100 GB monthly bandwidth.
- ✅ 300 build minutes per month.
- ✅ Generous free custom domains and automatic SSL.

### Step-by-Step Setup:
1. Go to [netlify.com](https://netlify.com) and sign up with GitHub.
2. Click **Add new site** ➔ **Import an existing project**.
3. Select `tubistream-vod`.
4. Set:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist`
5. Click **Deploy site**.

---

## 🏛️ Option 7: Oracle Cloud "Always Free" Tier (Permanent 24GB VPS)

If you want **uncompromised power** with **zero restrictions**, Oracle Cloud offers the most generous free cloud tier in the industry.

### What is 100% Free Forever:
- 🚀 **4 Ampere A1 ARM CPU cores** + **24 GB RAM** (Run multiple heavy services, transcoders, or backends).
- 💾 **200 GB NVMe Storage** block volume.
- 🌐 **10,000 GB (10 TB) outbound traffic per month**.
- 🔒 **Fixed Static IPv4 address**.

### How to use it:
1. Sign up for an [Oracle Cloud Always Free account](https://www.oracle.com/cloud/free/).
2. Create an **Ubuntu 24.04** Compute Instance using the **VM.Standard.A1.Flex** shape (up to 4 OCPUs, 24 GB RAM).
3. SSH into your VM and install Node.js + Git:
   ```bash
   sudo apt update && sudo apt install -y nodejs npm git
   ```
4. Clone your repository:
   ```bash
   git clone https://github.com/apachitech/tubistream-vod.git
   cd tubistream-vod
   npm run install:all
   npm run build
   ```
5. Run the server using PM2 for permanent 24/7 background uptime:
   ```bash
   sudo npm install -g pm2
   pm2 start npm --name "tubistream" -- start
   pm2 startup
   pm2 save
   ```
6. Point your domain directly to your free Oracle VM IP.

---

## 💡 Which Option Should You Choose?

| Your Goal | Recommended Choice |
|---|---|
| **Easiest setup, single URL, zero cold starts** | 👉 **[Koyeb](https://www.koyeb.com)** |
| **Unlimited frontend bandwidth (never worry about traffic spikes)** | 👉 **[Cloudflare Pages](https://pages.cloudflare.com)** + Koyeb Backend |
| **Fastest global CDN loading speeds for posters and hero banners** | 👉 **[Vercel](https://vercel.com)** or **[Netlify](https://netlify.com)** |
| **Maximum control (dedicated 24GB RAM server, run background jobs/FFmpeg)** | 👉 **[Oracle Cloud Always Free](https://www.oracle.com/cloud/free/)** |
| **Quickest deployment directly within GitHub without third-party services** | 👉 **[GitHub Pages](https://pages.github.com)** *(Already configured in `.github/workflows/deploy-pages.yml`)* |
