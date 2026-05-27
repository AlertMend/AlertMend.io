/**
 * AlertMend mock API.
 *
 * Read-only HTTP server that serves the same data shapes the marketing
 * Hero demo shows (clusters, incidents, RCA, restart-storm insights,
 * runbooks, agents, deployments, AI Copilot prompts). Everything is
 * served from in-memory seed data — there's no database, no clock,
 * no randomness — so the mock UI looks identical across reloads.
 *
 * Endpoint summary (all GET):
 *   GET /api/health
 *   GET /api/clusters
 *   GET /api/clusters/:id
 *   GET /api/incidents               ?status=&severity=&cluster=
 *   GET /api/incidents/:id
 *   GET /api/incidents/:id/rca
 *   GET /api/insights
 *   GET /api/insights/:id
 *   GET /api/runbooks                ?category=
 *   GET /api/runbooks/:id
 *   GET /api/agents                  ?cluster=&status=
 *   GET /api/deployments
 *   GET /api/copilot/suggestions
 */
import express from 'express';
import cors from 'cors';

import clusters from './routes/clusters.js';
import incidents from './routes/incidents.js';
import insights from './routes/insights.js';
import runbooks from './routes/runbooks.js';
import agents from './routes/agents.js';
import deployments from './routes/deployments.js';
import copilot from './routes/copilot.js';

const PORT = Number(process.env.PORT) || 4000;

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'alertmend-mock-backend', version: '0.1.0' });
});

app.use('/api/clusters', clusters);
app.use('/api/incidents', incidents);
app.use('/api/insights', insights);
app.use('/api/runbooks', runbooks);
app.use('/api/agents', agents);
app.use('/api/deployments', deployments);
app.use('/api/copilot', copilot);

/* Read-only mock: any method other than GET is rejected with 405 so it's
 * obvious from the network tab that this surface is intentionally
 * read-only and won't accept mutations. */
app.use('/api', (req, res, next) => {
  if (req.method === 'GET') return next();
  res.status(405).json({
    error: 'method_not_allowed',
    detail: 'This is a read-only mock. Only GET requests are supported.',
  });
});

app.use((_req, res) => {
  res.status(404).json({ error: 'not_found' });
});

app.listen(PORT, () => {
  /* eslint-disable-next-line no-console */
  console.log(`▶ AlertMend mock API listening on http://localhost:${PORT}`);
});
