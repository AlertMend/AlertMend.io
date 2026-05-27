import { Router } from 'express';
import { copilotSuggestions } from '../data/mock.js';

const router = Router();

router.get('/suggestions', (_req, res) => {
  res.json({ items: copilotSuggestions, total: copilotSuggestions.length });
});

export default router;
