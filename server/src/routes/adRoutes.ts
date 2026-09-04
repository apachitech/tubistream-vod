import { Router } from 'express';
import { adEngineService } from '../services/adEngineService';

const router = Router();

// Get JSON ad breaks for title & user
router.get('/breaks/:titleId', (req, res) => {
  const userId = (req.headers['x-user-id'] as string) || (req.query.userId as string);
  const breaks = adEngineService.getAdBreaksForTitle(req.params.titleId, userId);
  res.json({ success: true, count: breaks.length, breaks });
});

// IAB VAST 4.2 XML Ad Tag
router.get('/vast', (req, res) => {
  const adId = req.query.adId as string;
  const xml = adEngineService.generateVast4Xml(adId);
  res.setHeader('Content-Type', 'application/xml');
  res.send(xml);
});

// IAB VMAP 1.0 XML Playlist
router.get('/vmap/:titleId', (req, res) => {
  const xml = adEngineService.generateVmapXml(req.params.titleId);
  res.setHeader('Content-Type', 'application/xml');
  res.send(xml);
});

// Tracking Beacons (GET or POST)
router.all('/track', (req, res) => {
  const event = (req.query.event || req.body?.event) as any;
  const adId = (req.query.adId || req.body?.adId) as string;
  const titleId = (req.query.titleId || req.body?.titleId) as string;
  const userId = (req.query.userId || req.body?.userId) as string;

  if (adId && event) {
    adEngineService.recordAdEvent(adId, event, titleId, userId);
  }

  // Return 1x1 transparent GIF pixel or JSON
  if (req.method === 'GET') {
    const transparentGif = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    res.setHeader('Content-Type', 'image/gif');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    return res.send(transparentGif);
  }

  res.json({ success: true, tracked: true });
});

router.get('/metrics', (req, res) => {
  const summary = adEngineService.getAdMetricsSummary();
  res.json({ success: true, summary });
});

export default router;
