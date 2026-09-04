# TubiStream Authentication Guide & Architecture

This document provides a comprehensive guide to understanding, configuring, and extending the authentication system in **TubiStream**.

---

## 1. Architecture Overview

TubiStream uses a modern, decoupled client-server authentication architecture designed for multi-device streaming (Web, Smart TV, Mobile, and Living Room STBs):

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Layer                          │
│  ┌──────────────────────┐      ┌─────────────────────────┐  │
│  │   AuthContext.tsx    │ ───> │      AuthModal.tsx      │  │
│  │ (State & LocalStorage│      │ (Sign In / Register UI) │  │
│  └──────────────────────┘      └─────────────────────────┘  │
│             │                                               │
│             ▼                                               │
│  ┌──────────────────────┐                                   │
│  │       api.ts         │ (Bearer Token & x-user-id Header) │
│  └──────────────────────┘                                   │
└─────────────┬───────────────────────────────────────────────┘
              │ HTTP / REST API
              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Server Layer                          │
│  ┌──────────────────────┐      ┌─────────────────────────┐  │
│  │   authRoutes.ts      │ ───> │     authService.ts      │  │
│  │ (API Endpoint Router)│      │ (Auth Business Logic)   │  │
│  └──────────────────────┘      └─────────────────────────┘  │
│                                             │               │
│                                             ▼               │
│                                ┌─────────────────────────┐  │
│                                │   In-Memory / Database  │  │
│                                │ (Users, Profiles, Codes)│  │
│                                └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

- **Client**: [`client/src/context/AuthContext.tsx`](client/src/context/AuthContext.tsx) manages reactive auth state, active profile selection, and local persistence in browser `localStorage`.
- **API Transport**: [`client/src/services/api.ts`](client/src/services/api.ts) automatically attaches `Authorization: Bearer <token>` and `x-user-id` headers to all outbound requests.
- **Server Router**: [`server/src/routes/authRoutes.ts`](server/src/routes/authRoutes.ts) exposes endpoints for registration, login, logout, profile management, and device activation.
- **Service Core**: [`server/src/services/authService.ts`](server/src/services/authService.ts) handles user authentication, profile creation, session tokens, and Smart TV pairing codes.

---

## 2. Pre-Configured Demo Accounts

TubiStream comes with three built-in test accounts pre-seeded for development and testing:

| Account Role | Email Address | Password | Subscription Tier | Profiles Included |
| :--- | :--- | :--- | :--- | :--- |
| **Free Viewer** | `viewer@tubistream.com` | `password123` | `free` | `Alex (Main)`, `Kids Zone` |
| **VIP Premium** | `vip@tubistream.com` | `vip123` | `vip_premium` | `Jordan VIP` (Ad-Free, 4K) |
| **Studio Admin** | `admin@tubistream.com` | `admin123` | `vip_premium` | `Admin Master` (Full Studio CMS) |

> [!TIP]
> **Instant 1-Click Login**: Clicking **"Sign In"** on the navbar opens the Auth Modal, where you can click any of the 3 demo buttons at the top to log in instantly without typing.

---

## 3. Environment Variables Configuration

### A. Client Configuration (`client/.env`)

Create or update `client/.env`:

```env
# URL for the backend API service (defaults to /api proxy in development)
VITE_API_URL=http://localhost:5000/api
```

### B. Server Configuration (`server/.env`)

Create or update `server/.env`:

```env
# Server Port
PORT=5000

# Secret key used for signing JWT session tokens
JWT_SECRET=tubistream_production_secret_jwt_key_2026

# Session duration
SESSION_EXPIRY=30d

# Environment mode
NODE_ENV=development
```

---

## 4. How to Customize & Extend

### A. Customizing Default Accounts & Seed Data

Default accounts are initialized in [`server/src/services/authService.ts`](server/src/services/authService.ts) in the `seedUsers()` method. You can modify these or add custom seed accounts:

```typescript
// server/src/services/authService.ts
private seedUsers() {
  const myCustomUser: User = {
    id: 'usr-custom-01',
    email: 'operator@myplatform.com',
    name: 'Platform Operator',
    isGuest: false,
    tier: 'vip_premium', // 'free' or 'vip_premium'
    createdAt: new Date().toISOString(),
    activeProfileId: 'prof-custom-main',
    profiles: [
      {
        id: 'prof-custom-main',
        name: 'Main Profile',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
        isKids: false,
        watchHistory: [],
        myList: [],
        likedTitles: []
      }
    ],
    pairedDevices: []
  };

  this.saveUser(myCustomUser, 'secure_password_123');
  this.userTokens.set('token-custom-op', myCustomUser.id);
}
```

---

### B. Connecting to a Production Database (PostgreSQL / Prisma)

Currently, user records are stored in memory using JavaScript `Map` collections for zero-setup local development. To persist users in a relational database:

#### 1. Install Prisma and Database Driver:
```powershell
npm --prefix server install prisma @prisma/client bcryptjs jsonwebtoken
npm --prefix server install -D @types/bcryptjs @types/jsonwebtoken
```

#### 2. Define Prisma Schema (`server/prisma/schema.prisma`):
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id              String        @id @default(uuid())
  email           String        @unique
  passwordHash    String
  name            String?
  tier            String        @default("free")
  activeProfileId String?
  createdAt       DateTime      @default(now())
  profiles        UserProfile[]
  pairedDevices   Device[]
}

model UserProfile {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  name        String
  avatarUrl   String
  isKids      Boolean  @default(false)
  myList      String[]
  likedTitles String[]
}

model Device {
  id         String   @id @default(uuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  deviceId   String
  deviceName String
  deviceType String
  pairedAt   DateTime @default(now())
}
```

#### 3. Update `AuthService` Methods:
- **`register()`**:
  ```typescript
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, passwordHash, name, profiles: { create: { name, avatarUrl, isKids: false } } },
    include: { profiles: true }
  });
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '30d' });
  ```
- **`login()`**:
  ```typescript
  const user = await prisma.user.findUnique({ where: { email }, include: { profiles: true } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return { success: false, message: 'Invalid email or password' };
  }
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '30d' });
  ```

---

## 5. Multi-Profile & Parental Controls Architecture

Each user account can support up to **6 distinct profiles**:

1. **Switch Profile**: Changing profiles dynamically alters the watchlist, continue-watching row, and recommendations:
   ```typescript
   const { switchProfile } = useAuth();
   await switchProfile('prof-kids');
   ```
2. **Parental Controls PIN Protection**:
   - Profiles flagged with `isKids: true` restrict mature content (`R`, `TV-MA`).
   - When a Kids profile attempts to watch an adult-rated title, the app displays the **`PinLockModal`** requiring parent authorization before playback starts.

---

## 6. Smart TV Device Pairing Flow

TubiStream supports 1-click authentication for Connected TVs (Samsung Tizen, LG webOS, Roku, Fire TV, Apple TV):

```
Smart TV Screen                                Web / Mobile Browser
      │                                                 │
      ├─ 1. POST /api/auth/device/code ─>               │
      │  (Generates code: "TB78X9")                     │
      │                                                 │
      │  [Displays "TB78X9" on TV screen]               │
      │                                                 │
      │                                                 ├─ 2. User navigates to /activate-tv
      │                                                 │     Enters code "TB78X9"
      │                                                 │     POST /api/auth/device/verify
      │                                                 ▼
      │  <── 3. TV Polls /api/auth/device/poll/TB78X9 ──┤
      │  Receives auth token & user credentials         │
      ▼                                                 ▼
[TV Logs in Automatically]                         [TV Activated Confirmation]
```

---

## 7. Authentication API Reference

All routes are prefixed with `/api/auth`:

| Method | Endpoint | Description | Request Payload / Headers | Success Response |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | `{ "email": "user@mail.com", "password": "pass", "name": "Name" }` | `{ "success": true, "token": "...", "user": { ... } }` |
| `POST` | `/api/auth/login` | Sign in with email & password | `{ "email": "user@mail.com", "password": "pass" }` | `{ "success": true, "token": "...", "user": { ... } }` |
| `POST` | `/api/auth/logout` | Revoke current session token | Header: `Authorization: Bearer <token>` | `{ "success": true }` |
| `GET` | `/api/auth/me` | Fetch active user session | Header: `Authorization: Bearer <token>` | `{ "success": true, "user": { ... } }` |
| `POST` | `/api/auth/profile/switch` | Change active profile | `{ "profileId": "prof-123" }` | `{ "success": true, "profile": { ... }, "user": { ... } }` |
| `POST` | `/api/auth/profile/add` | Add a new viewer/kids profile | `{ "name": "Sarah", "avatarUrl": "...", "isKids": false }` | `{ "success": true, "profile": { ... }, "user": { ... } }` |
| `DELETE` | `/api/auth/profile/:id` | Remove a profile | URL param: `:id` | `{ "success": true, "user": { ... } }` |
| `POST` | `/api/auth/device/code` | Generate TV pairing code | `{ "deviceType": "smart_tv", "deviceName": "LG OLED 4K" }` | `{ "success": true, "pairing": { "code": "TB78X9", ... } }` |
| `POST` | `/api/auth/device/verify` | Link TV from web account | `{ "code": "TB78X9" }` | `{ "success": true, "message": "Successfully connected!" }` |
| `GET` | `/api/auth/device/poll/:code` | TV polling endpoint | URL param: `:code` | `{ "success": true, "status": "authorized", "token": "..." }` |

---

## 8. Deploying & Configuring Authentication on Render

When deploying **TubiStream** to [Render](https://render.com), configure authentication according to whether you are running an **All-in-One Fullstack Service** or a **Decoupled Backend Service**.

### Option A: All-in-One Fullstack Web Service (Recommended)

In this architecture, your single Render Web Service builds both the React Vite frontend and the Express backend. The server serves `client/dist` statically alongside `/api/auth/*`.

#### 1. Configure Web Service in Render Dashboard:
- **Build Command**: `npm run install:all && npm run build`
- **Start Command**: `npm start`
- **Root Directory**: *(Leave empty)*

#### 2. Set Environment Variables in Render:
Navigate to your Web Service in [dashboard.render.com](https://dashboard.render.com) ➔ **Environment** tab ➔ **Add Environment Variable**:

| Variable Name | Recommended Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production optimizations & Express static serving |
| `JWT_SECRET` | *(Generate a 64-character random string)* | Cryptographic secret used to sign session auth tokens |
| `SESSION_EXPIRY` | `30d` | Lifetime of issued authentication tokens |
| `PORT` | `10000` | Render assigns `PORT` dynamically, or defaults to 10000 |

> [!TIP]
> **Generate a secure `JWT_SECRET` in PowerShell or Bash**:
> ```bash
> # In Node.js:
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```
> Paste the generated 64-character hash into the `JWT_SECRET` field in Render.

---

### Option B: Decoupled Backend on Render + Frontend on GitHub Pages / Vercel

If you deploy your backend API to Render (`https://tubistream-vod.onrender.com`) and your React client to **GitHub Pages** or **Vercel**:

#### 1. On Render (Backend Web Service):
In Render ➔ **Environment**, configure:
- `NODE_ENV` = `production`
- `JWT_SECRET` = `<your-secure-key>`
- `CORS_ORIGIN` = `https://your-username.github.io` *(or `*` for universal access)*

#### 2. On GitHub Pages / Vercel (Frontend Client):
In your frontend host's environment settings:
- **Variable Name**: `VITE_API_URL`
- **Variable Value**: `https://tubistream-vod.onrender.com/api`

This ensures that the client's `AuthContext` and `api.ts` dispatch `/auth/login`, `/auth/register`, and `/auth/me` requests directly to your live Render backend URL.

---

### Option C: Adding Persistent Database Storage (Render Free PostgreSQL)

By default, in-memory accounts and tokens reset when Render's free tier service spins down after 15 minutes of inactivity. To persist user registrations, watchlists, and Smart TV codes permanently:

1. In Render Dashboard, click **"New +"** (top right) ➔ **"PostgreSQL"**.
2. Settings:
   - **Name**: `tubistream-postgres`
   - **Database**: `tubistream`
   - **Plan**: `Free`
3. Once provisioned, copy the **Internal Database URL** (e.g. `postgres://tubistream_user:pass@dpg-xxx-a:5432/tubistream`).
4. Go back to your **TubiStream Web Service** ➔ **Environment** tab.
5. Click **"Add Environment Variable"**:
   - **Key**: `DATABASE_URL`
   - **Value**: *(Paste the Internal Database URL)*
6. TubiStream will automatically connect to your Render PostgreSQL instance.

---

### Verification: Testing Auth on Render

After deployment, verify that authentication is operational:

1. **API Health & Auth Endpoint Check**:
   ```bash
   curl -X GET https://your-app-name.onrender.com/api/health
   ```
   *Should return `{"status": "healthy", ...}`.*

2. **Test User Login**:
   ```bash
   curl -X POST https://your-app-name.onrender.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "viewer@tubistream.com", "password": "password123"}'
   ```
   *Should return HTTP 200 with an auth token and user profile data.*

3. **In the Web App UI**:
   - Open your Render URL `https://your-app-name.onrender.com`.
   - Click **"Sign In"** in the top navbar.
   - Click the **"Viewer Alex (Free)"** 1-click button or enter credentials.
   - Confirm the navbar shows the user avatar and active profile name!

