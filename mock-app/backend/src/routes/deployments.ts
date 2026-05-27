import { Router } from 'express';
import { deployments } from '../data/mock.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ items: deployments, total: deployments.length });
});

export default router;
