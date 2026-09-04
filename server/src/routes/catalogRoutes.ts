import { Router } from 'express';
import { catalogService, CatalogFilterOptions } from '../services/catalogService';

const router = Router();

router.get('/titles', (req, res) => {
  const options: CatalogFilterOptions = {
    genre: req.query.genre as string,
    type: req.query.type as any,
    query: req.query.q as string,
    rating: req.query.rating as string,
    sortBy: req.query.sortBy as any,
    isKidsOnly: req.query.kids === 'true',
    limit: req.query.limit ? parseInt(req.query.limit as string) : undefined
  };

  const titles = catalogService.filterTitles(options);
  res.json({ success: true, count: titles.length, titles });
});

router.get('/titles/:id', (req, res) => {
  const title = catalogService.getTitleById(req.params.id);
  if (!title) {
    return res.status(404).json({ success: false, message: 'Title not found' });
  }
  catalogService.incrementViews(title.id);
  res.json({ success: true, title });
});

router.get('/featured', (req, res) => {
  const titles = catalogService.getFeaturedTitles();
  res.json({ success: true, count: titles.length, titles });
});

router.get('/trending', (req, res) => {
  const titles = catalogService.getTrendingTitles();
  res.json({ success: true, count: titles.length, titles });
});

router.get('/top10', (req, res) => {
  const titles = catalogService.getTop10();
  res.json({ success: true, count: titles.length, titles });
});

router.get('/genres', (req, res) => {
  const genres = catalogService.getGenres();
  res.json({ success: true, genres });
});

export default router;
