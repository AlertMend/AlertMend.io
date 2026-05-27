# AlertMend mock app

A self-contained mock of the AlertMend product UI, themed identically to the marketing site (zinc + violet, same radii, same shadows). Mounted in its own `mock-app/` folder so it never collides with the marketing site's build pipeline.

- **Frontend** — Vite + React + TypeScript + CSS Modules
- **Backend** — Express + TypeScript, in-memory seed data
- **All endpoints are GET** — this is intentionally a read-only mock. POST/PUT/DELETE return `405 Method Not Allowed`.

```
mock-app/
├── backend/      Express API (port 4000)
├── frontend/     Vite app (port 5174)
└── package.json  Root scripts (concurrently runs both)
```

## Quick start

```bash
cd mock-app
npm run install:all     # one-time: installs root + backend + frontend
npm run dev             # boots backend on :4000 and frontend on :5174
```

Then open **http://localhost:5174**.

You can also run each side independently:

```bash
npm run dev:backend     # just the API on :4000
npm run dev:frontend    # just the UI on :5174 (proxies /api → :4000)
```

The Vite dev server proxies `/api/*` to the backend, so the frontend has no CORS surface in dev and you can deploy them on the same origin in production.

## Screens

| Route                | What it shows                                                                                  |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| `/`                  | Dashboard — cluster overview with active incidents, deployments, cluster insights, AI Copilot. |
| `/incidents`         | Sortable incident list with status filters (firing / investigating / resolved).                |
| `/incidents/:id`     | Incident detail with RCA panel: AI checks, code diff, root cause, confidence, footer actions.  |
| `/runbooks`          | Pre-approved runbooks grouped by category.                                                     |
| `/agents`            | Agent inventory by cluster, version, uptime, health.                                           |

## API endpoints (all GET)

| Method | Path                                | Notes                                                                     |
| ------ | ----------------------------------- | ------------------------------------------------------------------------- |
| GET    | `/api/health`                       | Liveness probe.                                                           |
| GET    | `/api/clusters`                     | List clusters with agent counts.                                          |
| GET    | `/api/clusters/:id`                 | Single cluster detail.                                                    |
| GET    | `/api/incidents`                    | Optional filters: `?status=firing\|investigating\|resolved`, `?severity=P1\|P2\|P3`, `?cluster=…`. |
| GET    | `/api/incidents/:id`                | Single incident.                                                          |
| GET    | `/api/incidents/:id/rca`            | AI-generated RCA: checks, diff, root cause, confidence, recent activity.  |
| GET    | `/api/insights`                     | Cluster insights (restart storms etc.).                                   |
| GET    | `/api/insights/:id`                 | Single insight.                                                           |
| GET    | `/api/runbooks`                     | Optional `?category=kubernetes\|ingress\|storage\|observability`.         |
| GET    | `/api/runbooks/:id`                 | Single runbook.                                                           |
| GET    | `/api/agents`                       | Optional `?cluster=…&status=healthy\|degraded\|unhealthy`.                |
| GET    | `/api/deployments`                  | Recent deployments per service.                                           |
| GET    | `/api/copilot/suggestions`          | Suggested copilot prompts.                                                |

Try a few:

```bash
curl http://localhost:4000/api/health
curl 'http://localhost:4000/api/incidents?status=firing'
curl http://localhost:4000/api/incidents/INC-08472/rca | jq
```

## Design system

The mock app deliberately re-uses the marketing site's token vocabulary. `mock-app/frontend/src/styles/tokens.css` is kept in lock-step with `src/styles/global.css`:

- `--accent: #7c3aed` (violet-600) — single restrained accent.
- `--text: #09090b`, `--text-dim: #3f3f46`, `--muted: #71717a` — near-black + zinc text scale.
- `--radius-sm: 6px`, `--radius: 8px`, `--radius-lg: 10px` — tight radii.
- `--shadow-card`, `--shadow-card-strong` — neutral, no purple-tinted glow.

When you update the marketing site's palette, mirror it into `tokens.css` here too.

## Adding new mock data

All seed data lives in **`backend/src/data/mock.ts`** as plain TypeScript arrays. Add a row, restart the backend (or let `tsx watch` reload), and it shows up in the UI.

## Why GET-only?

This is a marketing/demo surface — it needs to look real without ever mutating state. Keeping the API GET-only means:

1. Demos are 100% reproducible (no order-of-operations footguns).
2. The HTTP surface can be cached aggressively or served from a static JSON snapshot in production.
3. Any accidental mutation attempt fails loudly with `405 Method Not Allowed`.

## File layout (frontend)

```
src/
├── App.tsx                   Router config
├── main.tsx                  Entry point
├── styles/
│   ├── tokens.css            Mirror of the marketing site's tokens
│   └── global.css            Resets, body styles, loading bar
├── lib/
│   ├── api.ts                Typed fetch wrapper over /api/*
│   └── useFetch.ts           Tiny data hook
├── components/
│   ├── Layout.tsx            Sidebar + topbar shell
│   ├── Card.tsx              Card with header / trailing slot
│   ├── StatusPill.tsx        Color-coded pill (violet/green/amber/red/neutral)
│   └── PageHeader.tsx        Eyebrow + H1 + description + trailing slot
└── pages/
    ├── DashboardPage.tsx
    ├── IncidentsPage.tsx
    ├── IncidentDetailPage.tsx
    ├── RunbooksPage.tsx
    └── AgentsPage.tsx
```
