import { Router } from 'express';
import { aiSearchService } from '../services/aiSearchService';

const router = Router();

router.post('/query', (req, res) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ success: false, message: 'Natural language prompt is required' });
  }

  const result = aiSearchService.parseAndSearch(prompt);
  res.json({ success: true, result });
});

export default router;
