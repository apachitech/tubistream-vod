import { Router } from 'express';
import { streamService } from '../services/streamService';
import { catalogService } from '../services/catalogService';
import { analyticsService } from '../services/analyticsService';

const router = Router();

// HLS Master Playlist (.m3u8)
router.get('/:id/master.m3u8', (req, res) => {
  const title = catalogService.getTitleById(req.params.id);
  if (!title) {
    return res.status(404).send('#EXTM3U\n#EXT-X-ERROR: Title not found');
  }

  const manifest = streamService.generateHlsMasterPlaylist(title);
  res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
  res.send(manifest);
});

// MPEG-DASH Manifest (.mpd)
router.get('/:id/dash.mpd', (req, res) => {
  const title = catalogService.getTitleById(req.params.id);
  if (!title) {
    return res.status(404).send('<!-- Title not found -->');
  }

  const manifest = streamService.generateDashManifest(title);
  res.setHeader('Content-Type', 'application/dash+xml');
  res.send(manifest);
});

// ClearKey / Widevine DRM License Exchange
router.post('/drm/license', (req, res) => {
  const licenseResponse = streamService.handleDrmLicenseRequest(req.body);
  res.json(licenseResponse);
});

// Transcode pipeline diagnostics
router.get('/:id/transcode-status', (req, res) => {
  const status = streamService.simulateTranscodeStatus(req.params.id);
  res.json({ success: true, status });
});

// Stream QoS telemetry beacon
router.post('/telemetry/qos', (req, res) => {
  analyticsService.recordQosEvent(req.body);
  res.json({ success: true, received: true });
});

export default router;
