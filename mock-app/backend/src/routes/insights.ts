import { Router } from 'express';
import { insights } from '../data/mock.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ items: insights, total: insights.length, live: true });
});

router.get('/:id', (req, res) => {
  const insight = insights.find((i) => i.id === req.params.id);
  if (!insight) return res.status(404).json({ error: 'insight_not_found' });
  res.json(insight);
});

export default router;
