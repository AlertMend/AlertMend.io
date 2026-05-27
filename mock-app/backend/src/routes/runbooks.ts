import { Router } from 'express';
import { runbooks } from '../data/mock.js';

const router = Router();

router.get('/', (req, res) => {
  const category = req.query.category as string | undefined;
  const items = category ? runbooks.filter((r) => r.category === category) : runbooks;
  res.json({ items, total: items.length });
});

router.get('/:id', (req, res) => {
  const runbook = runbooks.find((r) => r.id === req.params.id);
  if (!runbook) return res.status(404).json({ error: 'runbook_not_found' });
  res.json(runbook);
});

export default router;
