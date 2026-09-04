import { Router } from 'express';
import { analyticsService } from '../services/analyticsService';
import { catalogService } from '../services/catalogService';
import { adEngineService } from '../services/adEngineService';
import { fastLinearService } from '../services/fastLinearService';
import { mlRecommender } from '../services/mlRecommender';
import { authService } from '../services/authService';

const router = Router();

// Authorization middleware: Restrict access to authenticated Admins only
const requireAdmin = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  let user;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    user = authService.getUserByToken(token);
  }

  if (!user) {
    const userId = req.headers['x-user-id'] as string;
    if (userId) {
      user = authService.getUser(userId);
    }
  }

  const isAdmin = user && (user.role === 'admin' || user.email === 'admin@tubistream.com');
  if (!isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Administrator privileges required to access TubiStream Studio CMS.'
    });
  }

  req.user = user;
  next();
};

// Guard all admin routes
router.use(requireAdmin);

// Dashboard Overview Metrics
router.get('/dashboard', (req, res) => {
  const summary = analyticsService.getLiveDashboardSummary();
  const adSummary = adEngineService.getAdMetricsSummary();
  const mlDiagnostics = mlRecommender.getModelDiagnostics();
  const catalogCount = catalogService.getAllTitles().length;
  const channelCount = fastLinearService.getChannels().length;

  res.json({
    success: true,
    summary,
    adSummary,
    mlDiagnostics,
    systemStats: {
      catalogCount,
      channelCount,
      adCampaignsCount: adSummary.campaigns.length,
      uptimeSeconds: process.uptime(),
      memoryUsageMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
    }
  });
});

// CMS: Create Title
router.post('/catalog', (req, res) => {
  try {
    const title = catalogService.createTitle(req.body);
    // Retrain ML model with new title
    mlRecommender.trainModel();
    res.json({ success: true, title });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// CMS: Update Title
router.put('/catalog/:id', (req, res) => {
  const updated = catalogService.updateTitle(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Title not found' });
  }
  mlRecommender.trainModel();
  res.json({ success: true, title: updated });
});

// CMS: Delete Title
router.delete('/catalog/:id', (req, res) => {
  const deleted = catalogService.deleteTitle(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Title not found' });
  }
  mlRecommender.trainModel();
  res.json({ success: true, deleted: true });
});

// Ad Inventory & Engine Controls
router.get('/ads', (req, res) => {
  res.json({
    success: true,
    ads: adEngineService.getAdInventory(),
    config: adEngineService.getConfig(),
    summary: adEngineService.getAdMetricsSummary()
  });
});

router.get('/ads/config', (req, res) => {
  res.json({ success: true, config: adEngineService.getConfig() });
});

router.post('/ads/config', (req, res) => {
  try {
    const updated = adEngineService.updateConfig(req.body);
    res.json({ success: true, config: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.post('/ads', (req, res) => {
  try {
    const ad = adEngineService.addAdCreative(req.body);
    res.json({ success: true, ad });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.patch('/ads/:id/status', (req, res) => {
  const ad = adEngineService.toggleAdStatus(req.params.id);
  if (!ad) {
    return res.status(404).json({ success: false, message: 'Ad creative not found' });
  }
  res.json({ success: true, ad });
});

router.patch('/ads/:id/cpm', (req, res) => {
  const { cpm } = req.body;
  const ad = adEngineService.updateAdCpm(req.params.id, parseFloat(cpm));
  if (!ad) {
    return res.status(404).json({ success: false, message: 'Ad creative not found' });
  }
  res.json({ success: true, ad });
});

router.delete('/ads/:id', (req, res) => {
  const deleted = adEngineService.deleteAdCreative(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Ad creative not found' });
  }
  res.json({ success: true, deleted: true });
});

// FAST Channels: Create Channel
router.post('/fast/channel', (req, res) => {
  try {
    const channel = fastLinearService.addChannel(req.body);
    res.json({ success: true, channel });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// --- Subscription Plans & User Tier Management ---

// 1. Get current plan configurations & platform pricing
router.get('/plans', (req, res) => {
  const planSettings = authService.getPlanSettings();
  res.json({ success: true, planSettings });
});

// 2. Update plan configurations (pricing, perks, feature flags)
router.put('/plans', (req, res) => {
  try {
    const planSettings = authService.updatePlanSettings(req.body);
    // If VIP ad-free bypass was changed, also sync with ad engine
    const vipPlan = planSettings.plans.find(p => p.id === 'vip_premium');
    if (vipPlan) {
      adEngineService.updateConfig({ vipAdFreeBypass: !vipPlan.adSupported });
    }
    res.json({ success: true, planSettings });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 3. List all registered users with their current plans
router.get('/users', (req, res) => {
  const users = authService.getAllUsers();
  res.json({ success: true, count: users.length, users });
});

// 4. Update a user's subscription tier (Free <-> VIP Premium)
router.patch('/users/:id/tier', (req, res) => {
  const { tier } = req.body;
  if (!tier || !['free', 'vip_premium'].includes(tier)) {
    return res.status(400).json({ success: false, message: 'Valid tier (free or vip_premium) is required' });
  }
  const user = authService.updateUserTier(req.params.id, tier);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.json({ success: true, message: `Successfully updated user plan to ${tier === 'vip_premium' ? 'Tubi+ VIP Premium' : 'TubiStream Free'}`, user });
});

// 5. Update a title's access tier (Free <-> VIP Exclusive)
router.patch('/catalog/:id/access', (req, res) => {
  const { accessTier } = req.body;
  if (!accessTier || !['free', 'vip_premium'].includes(accessTier)) {
    return res.status(400).json({ success: false, message: 'Valid accessTier (free or vip_premium) is required' });
  }
  const title = catalogService.updateTitleAccessTier(req.params.id, accessTier);
  if (!title) {
    return res.status(404).json({ success: false, message: 'Title not found' });
  }
  res.json({ success: true, message: `Title access set to ${accessTier}`, title });
});

// 6. Admin Create New FAST TV Channel
router.post('/fast/channels', (req, res) => {
  const { name, category, streamUrl } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Channel name is required' });
  }
  if (!streamUrl || !streamUrl.trim()) {
    return res.status(400).json({ success: false, message: 'Live HLS/DASH stream URL is required' });
  }

  const channel = fastLinearService.addChannel(req.body);
  res.status(201).json({
    success: true,
    message: `FAST Channel "${channel.name}" (CH ${channel.channelNumber}) created and broadcast live!`,
    channel
  });
});

// 7. Admin Update Existing FAST TV Channel
router.put('/fast/channels/:id', (req, res) => {
  const updated = fastLinearService.updateChannel(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'FAST Channel not found' });
  }
  res.json({
    success: true,
    message: `FAST Channel "${updated.name}" updated successfully`,
    channel: updated
  });
});

// 8. Admin Delete FAST TV Channel
router.delete('/fast/channels/:id', (req, res) => {
  const deleted = fastLinearService.deleteChannel(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'FAST Channel not found' });
  }
  res.json({
    success: true,
    message: 'FAST Channel decommissioned and deleted from live broadcast lineup'
  });
});

export default router;
