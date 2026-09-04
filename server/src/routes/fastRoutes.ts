import { Router } from 'express';
import { fastLinearService } from '../services/fastLinearService';

const router = Router();

router.get('/channels', (req, res) => {
  const channels = fastLinearService.getChannels();
  res.json({ success: true, count: channels.length, channels });
});

router.get('/channels/:id', (req, res) => {
  const channel = fastLinearService.getChannelById(req.params.id);
  if (!channel) {
    return res.status(404).json({ success: false, message: 'Channel not found' });
  }
  res.json({ success: true, channel });
});

export default router;
