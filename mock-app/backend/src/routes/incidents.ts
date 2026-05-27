import { Router } from 'express';
import { incidents, rcas, type IncidentStatus, type Severity } from '../data/mock.js';

const router = Router();

/* GET /api/incidents
 * Optional filters: ?status=firing|investigating|resolved
 *                   ?severity=P1|P2|P3
 *                   ?cluster=prod-us-east-1
 * Returns the full list when no filter is supplied. */
router.get('/', (req, res) => {
  const status = req.query.status as IncidentStatus | undefined;
  const severity = req.query.severity as Severity | undefined;
  const cluster = req.query.cluster as string | undefined;

  let items = incidents;
  if (status) items = items.filter((i) => i.status === status);
  if (severity) items = items.filter((i) => i.severity === severity);
  if (cluster) items = items.filter((i) => i.cluster === cluster);

  res.json({
    items,
    total: items.length,
    counts: {
      firing: incidents.filter((i) => i.status === 'firing').length,
      investigating: incidents.filter((i) => i.status === 'investigating').length,
      resolved: incidents.filter((i) => i.status === 'resolved').length,
    },
  });
});

router.get('/:id', (req, res) => {
  const incident = incidents.find((i) => i.id === req.params.id);
  if (!incident) return res.status(404).json({ error: 'incident_not_found' });
  res.json(incident);
});

router.get('/:id/rca', (req, res) => {
  const rca = rcas.find((r) => r.incidentId === req.params.id);
  if (!rca) return res.status(404).json({ error: 'rca_not_found' });
  res.json(rca);
});

export default router;
