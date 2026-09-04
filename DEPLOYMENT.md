# 🚀 TubiStream Cloud Deployment Guide

This guide explains how to deploy the **TubiStream** platform to **GitHub & GitHub Pages**, **Render**, **Vercel**, **Netlify**, or container clouds.

---

## ⚡ Quick Comparison: Which should you choose?

| Platform | Recommended Setup | Free Tier? | Best For |
| :--- | :--- | :--- | :--- |
| **GitHub Pages** | **Automated CI/CD via GitHub Actions** + Backend on Render | ✅ 100% Free | **Direct GitHub integration**. Free static hosting of the React client directly from your repository. |
| **Render** *(Recommended)* | **All-in-One Fullstack** (Frontend + Backend in 1 Web Service) | ✅ Yes | **Easiest setup.** Single URL, zero CORS issues, 1-click Git deployment. |
| **Vercel** | **Frontend on Vercel CDN** + Backend on Render | ✅ Yes | Maximum global CDN speed for React frontend. |
| **Netlify** | **Frontend on Netlify** + Backend on Render | ✅ Yes | Alternate CDN host with automatic preview deploys. |

---

## 🐙 Option 0: GitHub & GitHub Pages (Source Control + Free Client Hosting)

GitHub provides:
1. **Source Code Hosting**: Secure version control and collaborative Git management.
2. **GitHub Actions CI/CD**: Automatically builds your code on every `git push`.
3. **GitHub Pages**: Free high-speed global static hosting for the React web app.

### Part 1: Push Your Code to GitHub

1. Open your terminal or PowerShell in `c:\Users\XPRISTO\Desktop\tva\tv-stream`.
2. Configure your Git name and email (if not already done):
   ```bash
   git config user.name "Your Name"
   git config user.email "your-email@example.com"
   ```
3. Verify your remote origin points to your GitHub repository:
   ```bash
   git remote -v
   # Should display: https://github.com/apachitech/tubistream-vod.git
   ```
   *(If not set, run `git remote add origin https://github.com/apachitech/tubistream-vod.git`)*
4. Push your code to the `main` branch:
   ```bash
   git push -u origin main
   ```
   *(If prompted by Windows, click **"Sign in with your browser"** to authorize.)*

---

### Part 2: Enable Free GitHub Pages Web Hosting

The repository is already equipped with an automated GitHub Actions deployment workflow at [`.github/workflows/deploy-pages.yml`](./.github/workflows/deploy-pages.yml).

1. Go to your repository on GitHub: `https://github.com/apachitech/tubistream-vod`.
2. Click **Settings** (top navigation tab) ➔ **Pages** (in the left sidebar menu).
3. Under **"Build and deployment"**:
   - In the **Source** dropdown menu, select: **`GitHub Actions`**.
4. GitHub will automatically trigger the workflow, install dependencies, compile the React Vite client, and publish the site.
5. Within ~60 seconds, your site will be live at:
   ```
   https://apachitech.github.io/tubistream-vod/
   ```

---

### Part 3: Connecting Your Backend to GitHub Pages

> **Important**: GitHub Pages hosts client-side static web apps (HTML, CSS, JavaScript). Because the streaming catalog, live FAST channel EPG, and ad decision server run on Node.js/Express, the backend should run on **Render** (free) or a VPS.

1. Deploy the backend to **Render** using Option 1 below. You will receive a URL like:
   ```
   https://tubistream-vod.onrender.com
   ```
2. In your GitHub repository:
   - Go to **Settings** ➔ **Secrets and variables** ➔ **Actions**.
   - Click **"New repository secret"**.
   - **Name**: `VITE_API_URL`
   - **Value**: `https://tubistream-vod.onrender.com/api`
3. Click **"Add secret"**.
4. Any future `git push` to `main` will automatically build the React client pointing to your live cloud backend!

---

## 🥇 Option 1: Render (Recommended — All-in-One Fullstack)

Render can run both the **Node.js Express backend** and the **React Vite frontend** under a single free Web Service.

### Step-by-Step Instructions:

1. **Push your code to GitHub / GitLab**.
2. Go to [https://dashboard.render.com](https://dashboard.render.com) and log in.
3. Click **"New +"** -> **"Web Service"**.
4. Connect your GitHub repository (`tv-stream`).
5. Configure the service settings:
   - **Name**: `tubistream-vod` (or your choice)
   - **Region**: Closest to you (e.g., *Frankfurt*, *Oregon*, *Ohio*)
   - **Branch**: `main`
   - **Root Directory**: *(Leave empty — use root)*
   - **Runtime**: `Node`
   - **Build Command**: 
     ```bash
     npm run install:all && npm run build
     ```
   - **Start Command**: 
     ```bash
     npm start
     ```
   - **Plan Type**: `Free`
6. Click **"Advanced"** and add Environment Variables:
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = `(Generate a 64-char key, e.g. using node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")`
   - `SESSION_EXPIRY` = `30d`
   - *(Optional PostgreSQL)* `DATABASE_URL` = `(Internal database URL if using Render Postgres - see AUTH.md)`
   *(See [AUTH.md](./AUTH.md#8-deploying--configuring-authentication-on-render) for the complete authentication setup guide)*
7. Click **"Create Web Service"**.

Render will automatically install dependencies, compile the React frontend into `client/dist`, compile the Express backend into `server/dist`, and launch the unified server. Your platform will be live at:
```
https://tubistream-vod.onrender.com
```

---

## 🥈 Option 2: Vercel (Frontend on Vercel + Backend on Render)

Because Vercel specializes in frontend static edge hosting, the ideal architecture is:
1. **Backend**: Deployed on Render as a Web Service (providing `/api/*` endpoints, VAST XML, and streaming metadata).
2. **Frontend**: Deployed on Vercel (providing ultra-fast global edge caching).

### Step-by-Step:

1. **Deploy Backend to Render first**:
   - Follow the Render instructions above to deploy your backend.
   - Note your Render URL: e.g. `https://tubistream-backend.onrender.com`.

2. **Deploy Frontend to Vercel**:
   - Go to [https://vercel.com](https://vercel.com) and import your Git repository.
   - In **Project Settings**:
     - **Framework Preset**: `Vite`
     - **Root Directory**: `client`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
   - In **Environment Variables**, add:
     - `VITE_API_URL` = `https://tubistream-backend.onrender.com/api`
   - Click **Deploy**.

> Note: The included [`vercel.json`](./vercel.json) file also configures automatic `/api/*` rewrites to proxy API requests to your backend without cross-origin issues.

---

## 🥉 Option 3: Netlify (Frontend on Netlify + Backend on Render)

Similar to Vercel, Netlify hosts the React frontend with proxy redirects to your Render backend.

### Step-by-Step:

1. **Deploy Backend to Render first** (see Option 1).
2. Go to [https://app.netlify.com](https://app.netlify.com) and click **"Add new site"** -> **"Import an existing project"**.
3. Select your GitHub repository.
4. Set build settings:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist`
5. In **Environment variables**, set:
   - `VITE_API_URL` = `https://tubistream-backend.onrender.com/api`
6. Click **"Deploy site"**.

> The included [`netlify.toml`](./netlify.toml) automatically forwards any `/api/*` traffic to your backend.

---

## 🚂 Option 4: Railway.app (Modern PaaS Alternative)

[Railway](https://railway.app) is one of the most popular and developer-friendly alternatives to Render. It natively supports fullstack monorepos, provides automatic GitHub deployments, free trials, and instantaneous SSL.

### How to Deploy on Railway:
1. Push your code to GitHub.
2. Log into [railway.app](https://railway.app) and click **"New Project"** -> **"Deploy from GitHub repo"**.
3. Select your repository. Railway will detect the root `package.json` or the [`Dockerfile`](./Dockerfile).
4. Under **Settings** -> **Deploy**:
   - **Build Command**: `npm run install:all && npm run build`
   - **Start Command**: `npm start`
5. In **Variables**, add:
   - `PORT` = `5000` (or leave default, Railway assigns dynamically)
6. Under **Settings** -> **Networking**, click **"Generate Domain"** to get a public URL like `https://tubistream-production.up.railway.app`.

---

## ✈️ Option 5: Fly.io (Global Edge Containers)

[Fly.io](https://fly.io) converts your application into lightweight microVMs deployed across 30+ data centers worldwide. It is especially powerful for low-latency video streaming APIs and Watch Party synchronization.

### How to Deploy on Fly.io:
1. Install Fly CLI (`powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"`).
2. Run in the project directory:
   ```bash
   fly launch
   ```
   Fly will automatically detect the multi-stage [`Dockerfile`](./Dockerfile).
3. Set your preferred region and click deploy:
   ```bash
   fly deploy
   ```
4. Your service will be instantly accessible at `https://tubistream.fly.dev`.

---

## ☁️ Option 6: Google Cloud Run (Serverless Container with Zero-Scale Cost)

[Google Cloud Run](https://cloud.google.com/run) allows you to deploy containerized web applications that automatically scale up when viewers watch streams, and scale down to **zero** when idle — meaning you only pay for the exact CPU/RAM used per second.

### How to Deploy on Cloud Run:
1. Connect your repository to Google Cloud Build or use the `gcloud` CLI:
   ```bash
   gcloud run deploy tubistream \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --port 5000
   ```
2. Cloud Run builds the [`Dockerfile`](./Dockerfile) in Cloud Build and returns a secure HTTPS URL with an automated SSL certificate.

---

## 🌊 Option 7: DigitalOcean (App Platform or VPS Droplet)

### Option A: App Platform (Managed PaaS)
1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps).
2. Select your GitHub repository.
3. Choose **Node.js**:
   - Build Command: `npm run install:all && npm run build`
   - Run Command: `npm start`
   - HTTP Port: `5000`
4. Cost starts at ~$5/month with 100% uptime SLA.

### Option B: Dedicated VPS Droplet ($4-$6/mo Flat Rate)
If you want complete control, minimum monthly costs, and no platform limits:
1. Spin up a basic Ubuntu Droplet ($4/mo on DigitalOcean, or ~$3.50/mo on **Hetzner**).
2. SSH into your VPS:
   ```bash
   git clone <your-repo-url>
   cd tv-stream
   docker compose up -d --build
   ```
3. Your platform will be running on port 5000 behind Docker!

---

## 🎛️ Option 8: Coolify / CapRover (Self-Hosted Private Vercel/Render)

If you have a Linux VPS (Hetzner, OVH, DigitalOcean, Linode) and want the visual UI of Vercel/Render without paying monthly subscription fees:
1. Install [Coolify](https://coolify.io) on your VPS:
   ```bash
   curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
   ```
2. In the Coolify dashboard, connect your GitHub repo and select the [`Dockerfile`](./Dockerfile) or `render.yaml`.
3. Coolify automatically provides automatic Git webhooks, custom domain management, and free automated Let's Encrypt SSL certificates.

---

## 🔒 Production Checklist: Video Streams & CORS

- **CORS**: The backend Express server in `server/src/index.ts` already has CORS enabled (`cors({ origin: '*' })`), so API calls from external domains (like Vercel, Netlify, or mobile apps) work immediately.
- **HLS Streams**: Any video links (`.m3u8` from Cloudinary, Akamai, Mux, or AWS S3/CloudFront) require standard CORS headers (`Access-Control-Allow-Origin: *`) on the host CDN so the browser player (`hls.js`) can fetch the `.ts` video chunks.

