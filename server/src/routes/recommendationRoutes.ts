import { Router } from 'express';
import { mlRecommender } from '../services/mlRecommender';

const router = Router();

router.get('/feed', (req, res) => {
  const userId = (req.headers['x-user-id'] as string) || (req.query.userId as string) || 'usr-default-tubi-fan';
  const feed = mlRecommender.getPersonalizedFeed(userId);
  res.json({ success: true, feed });
});

router.get('/similar/:titleId', (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 8;
  const similar = mlRecommender.getSimilarTitles(req.params.titleId, limit);
  res.json({ success: true, count: similar.length, recommendations: similar });
});

router.get('/diagnostics', (req, res) => {
  const diagnostics = mlRecommender.getModelDiagnostics();
  res.json({ success: true, diagnostics });
});

export default router;
