import { Router } from 'express';
import { analyticsService } from '../services/analyticsService';
import { catalogService } from '../services/catalogService';
import { adEngineService } from '../services/adEngineService';
import { fastLinearService } from '../services/fastLinearService';
import { mlRecommender } from '../services/mlRecommender';

const router = Router();

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

export default router;
