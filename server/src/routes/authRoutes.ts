import { Router } from 'express';
import { authService } from '../services/authService';

const router = Router();

router.get('/me', (req, res) => {
  const userId = req.headers['x-user-id'] as string || 'usr-default-tubi-fan';
  const user = authService.getUser(userId) || authService.getOrCreateGuestUser(userId);
  res.json({ success: true, user });
});

router.post('/guest', (req, res) => {
  const user = authService.getOrCreateGuestUser();
  res.json({ success: true, user });
});

router.post('/profile/switch', (req, res) => {
  const userId = (req.headers['x-user-id'] as string) || 'usr-default-tubi-fan';
  const { profileId } = req.body;
  const profile = authService.switchProfile(userId, profileId);
  if (!profile) {
    return res.status(404).json({ success: false, message: 'Profile not found' });
  }
  const user = authService.getUser(userId);
  res.json({ success: true, profile, user });
});

router.post('/progress', (req, res) => {
  const userId = (req.headers['x-user-id'] as string) || 'usr-default-tubi-fan';
  const { titleId, progressSeconds, durationSeconds } = req.body;
  authService.updateWatchProgress(userId, titleId, progressSeconds, durationSeconds);
  res.json({ success: true });
});

router.post('/mylist/toggle', (req, res) => {
  const userId = (req.headers['x-user-id'] as string) || 'usr-default-tubi-fan';
  const { titleId } = req.body;
  const result = authService.toggleMyList(userId, titleId);
  res.json({ success: true, ...result });
});

router.post('/like/toggle', (req, res) => {
  const userId = (req.headers['x-user-id'] as string) || 'usr-default-tubi-fan';
  const { titleId } = req.body;
  const result = authService.toggleLike(userId, titleId);
  res.json({ success: true, ...result });
});

router.post('/upgrade-vip', (req, res) => {
  const userId = (req.headers['x-user-id'] as string) || 'usr-default-tubi-fan';
  const result = authService.upgradeToVip(userId);
  res.json(result);
});

// Smart TV Pairing Code Generation
router.post('/device/code', (req, res) => {
  const { deviceType, deviceName } = req.body;
  const pairing = authService.generateDevicePairingCode(deviceType || 'smart_tv', deviceName);
  res.json({ success: true, pairing });
});

// Authorize Smart TV code from web/mobile
router.post('/device/verify', (req, res) => {
  const userId = (req.headers['x-user-id'] as string) || 'usr-default-tubi-fan';
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ success: false, message: 'Activation code is required' });
  }
  const result = authService.verifyAndAuthorizeDeviceCode(code, userId);
  res.json(result);
});

// TV polling endpoint
router.get('/device/poll/:code', (req, res) => {
  const { code } = req.params;
  const status = authService.pollDeviceActivationStatus(code);
  if (!status) {
    return res.status(404).json({ success: false, status: 'invalid' });
  }
  res.json({ success: true, status: status.status, token: status.token, userId: status.userId });
});

export default router;
