import { Router } from 'express';
import { agents } from '../data/mock.js';

const router = Router();

router.get('/', (req, res) => {
  const cluster = req.query.cluster as string | undefined;
  const status = req.query.status as string | undefined;
  let items = agents;
  if (cluster) items = items.filter((a) => a.cluster === cluster);
  if (status) items = items.filter((a) => a.status === status);
  res.json({
    items,
    total: items.length,
    counts: {
      healthy: agents.filter((a) => a.status === 'healthy').length,
      degraded: agents.filter((a) => a.status === 'degraded').length,
      unhealthy: agents.filter((a) => a.status === 'unhealthy').length,
    },
  });
});

export default router;
