import { Router } from 'express';
import { authService } from '../services/authService';

const router = Router();

// Helper to extract user ID from headers or Bearer token
function resolveUserId(req: any): string | undefined {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const user = authService.getUserByToken(token);
    if (user) return user.id;
  }
  return (req.headers['x-user-id'] as string) || undefined;
}

// 1. Get current logged in user (or fallback guest)
router.get('/me', (req, res) => {
  const userId = resolveUserId(req);
  let user;
  if (userId) {
    user = authService.getUser(userId);
  }
  if (!user) {
    user = authService.getUser('usr-default-tubi-fan') || authService.getOrCreateGuestUser();
  }
  res.json({ success: true, user });
});

// 2. Register new account
router.post('/register', (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }
  const result = authService.register(email, password, name);
  if (!result.success) {
    return res.status(400).json(result);
  }
  res.json(result);
});

// 3. Sign in to account
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }
  const result = authService.login(email, password);
  if (!result.success) {
    return res.status(401).json(result);
  }
  res.json(result);
});

// 4. Logout
router.post('/logout', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
  const result = authService.logout(token);
  res.json(result);
});

// 5. Create guest session
router.post('/guest', (req, res) => {
  const user = authService.getOrCreateGuestUser();
  res.json({ success: true, user });
});

// 6. Switch Active Profile
router.post('/profile/switch', (req, res) => {
  const userId = resolveUserId(req) || 'usr-default-tubi-fan';
  const { profileId } = req.body;
  const profile = authService.switchProfile(userId, profileId);
  if (!profile) {
    return res.status(404).json({ success: false, message: 'Profile not found' });
  }
  const user = authService.getUser(userId);
  res.json({ success: true, profile, user });
});

// 7. Add Profile
router.post('/profile/add', (req, res) => {
  const userId = resolveUserId(req) || 'usr-default-tubi-fan';
  const { name, avatarUrl, isKids } = req.body;
  const result = authService.addProfile(userId, name, avatarUrl, isKids);
  if (!result.success) {
    return res.status(400).json(result);
  }
  res.json(result);
});

// 8. Delete Profile
router.delete('/profile/:profileId', (req, res) => {
  const userId = resolveUserId(req) || 'usr-default-tubi-fan';
  const { profileId } = req.params;
  const result = authService.deleteProfile(userId, profileId);
  if (!result.success) {
    return res.status(400).json(result);
  }
  res.json(result);
});

// 9. Update Watch Progress
router.post('/progress', (req, res) => {
  const userId = resolveUserId(req) || 'usr-default-tubi-fan';
  const { titleId, progressSeconds, durationSeconds } = req.body;
  authService.updateWatchProgress(userId, titleId, progressSeconds, durationSeconds);
  res.json({ success: true });
});

// 10. Toggle My List
router.post('/mylist/toggle', (req, res) => {
  const userId = resolveUserId(req) || 'usr-default-tubi-fan';
  const { titleId } = req.body;
  const result = authService.toggleMyList(userId, titleId);
  res.json({ success: true, ...result });
});

// 11. Toggle Like
router.post('/like/toggle', (req, res) => {
  const userId = resolveUserId(req) || 'usr-default-tubi-fan';
  const { titleId } = req.body;
  const result = authService.toggleLike(userId, titleId);
  res.json({ success: true, ...result });
});

// 12. Upgrade to VIP (Subscription Payment Required)
router.post('/upgrade-vip', (_req, res) => {
  return res.status(402).json({
    success: false,
    message: 'Payment required: Free members can become VIP members only after paying a subscription. Please subscribe securely via /api/payment/subscribe.'
  });
});

// 13. Smart TV Pairing Code Generation
router.post('/device/code', (req, res) => {
  const { deviceType, deviceName } = req.body;
  const pairing = authService.generateDevicePairingCode(deviceType || 'smart_tv', deviceName);
  res.json({ success: true, pairing });
});

// 14. Authorize Smart TV code from web/mobile
router.post('/device/verify', (req, res) => {
  const userId = resolveUserId(req) || 'usr-default-tubi-fan';
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ success: false, message: 'Activation code is required' });
  }
  const result = authService.verifyAndAuthorizeDeviceCode(code, userId);
  res.json(result);
});

// 15. TV polling endpoint
router.get('/device/poll/:code', (req, res) => {
  const { code } = req.params;
  const status = authService.pollDeviceActivationStatus(code);
  if (!status) {
    return res.status(404).json({ success: false, status: 'invalid' });
  }
  res.json({ success: true, status: status.status, token: status.token, userId: status.userId });
});

export default router;
