import { Router } from 'express';
import { watchPartyService } from '../services/watchPartyService';

const router = Router();

// Create Watch Party Room
router.post('/create', (req, res) => {
  const { hostUserId, userName, titleId, episodeId } = req.body;
  const room = watchPartyService.createRoom(
    hostUserId || 'usr-default-tubi-fan',
    userName || 'Host',
    titleId,
    episodeId
  );
  res.json({ success: true, room });
});

// Join Watch Party Room
router.post('/join', (req, res) => {
  const { roomId, userId, userName } = req.body;
  const result = watchPartyService.joinRoom(roomId, userId || 'usr-guest-attendee', userName || 'Attendee');
  res.json(result);
});

// Sync Playback State (Play/Pause/Seek)
router.post('/sync', (req, res) => {
  const { roomId, userId, action, currentTimeSeconds } = req.body;
  const room = watchPartyService.syncPlaybackState(roomId, userId, action, currentTimeSeconds);
  if (!room) {
    return res.status(404).json({ success: false, message: 'Room not found' });
  }
  res.json({ success: true, room });
});

// Send Chat Message
router.post('/chat', (req, res) => {
  const { roomId, userId, userName, text } = req.body;
  const msg = watchPartyService.sendChatMessage(roomId, userId, userName, text);
  if (!msg) {
    return res.status(404).json({ success: false, message: 'Room not found' });
  }
  res.json({ success: true, message: msg });
});

// Poll Room State
router.get('/poll/:roomId', (req, res) => {
  const room = watchPartyService.getRoom(req.params.roomId);
  if (!room) {
    return res.status(404).json({ success: false, message: 'Room not found' });
  }
  res.json({ success: true, room });
});

export default router;
