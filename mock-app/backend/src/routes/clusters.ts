import { Router } from 'express';
import { clusters } from '../data/mock.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ items: clusters, total: clusters.length });
});

router.get('/:id', (req, res) => {
  const cluster = clusters.find((c) => c.id === req.params.id);
  if (!cluster) return res.status(404).json({ error: 'cluster_not_found' });
  res.json(cluster);
});

export default router;
