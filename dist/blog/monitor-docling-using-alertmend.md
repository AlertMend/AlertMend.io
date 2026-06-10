---
title: "How to Monitor DocLing Using AlertMend"
excerpt: "Monitor DocLing every way it runs—Python library, CLI, Docling Serve API, Docker, Kubernetes, or MCP—with AlertMend health checks and auto-remediation."
date: "2026-06-06"
category: "AIOps"
author: "AlertMend Team"
keywords: "DocLing monitoring, docling-serve, DocLing CLI, document parsing, RAG pipeline, MCP, AlertMend, Kubernetes"
---

# How to Monitor DocLing Using AlertMend

![DocLing monitoring architecture — PDF to JSON pipeline with AlertMend health checks](/media/blog/docling-hero.svg)

[DocLing](https://github.com/docling-project/docling) is an open-source toolkit for parsing PDFs, Office documents, and other formats into structured data. **It does not run one way**—teams embed it as a Python library, batch-convert from the CLI, expose it via [Docling Serve](https://github.com/docling-project/docling-serve), deploy on Kubernetes, or connect AI agents through [MCP](https://docling-project.github.io/docling/usage/mcp/).

This guide shows how to monitor DocLing with **AlertMend** for each deployment pattern.

## Ways DocLing runs in production

| Mode | How it works | Primary AlertMend check |
|------|--------------|------------------------|
| **Python library** | `pip install docling`, call `DocumentConverter` in your app | Log alerts + conversion duration metrics |
| **CLI & batch jobs** | `docling file.pdf` via CronJob, Airflow, or CI | Job failure alerts + duration SLAs |
| **Docling Serve** | FastAPI REST API (`docling-serve run` or Docker on port 5001) | URL `/health` + `/v1/convert/*` latency SLOs |
| **Kubernetes** | docling-serve containers behind a Service/Ingress | URL checks + pod OOM/restart auto-remediation |
| **MCP server** | Document tools for LangChain, CrewAI, and agents | Tool timeout alerts + backend health |

## What to monitor (every mode)

- **Availability** — HTTP `/health` for Serve, job success for CLI, process uptime for embedded runs
- **Latency** — p95 conversion time; spikes often precede OOM kills on large PDFs
- **Error rate** — HTTP 5xx, non-zero CLI exit codes, or logged conversion exceptions
- **Resource pressure** — Memory and CPU; OCR/VLM models can exhaust smaller instances
- **Async queue depth** — For docling-serve task mode, alert when backlog outpaces workers

## Monitoring Docling Serve (Docker / VM / K8s)

Docling Serve is the most common production API. Default port is **5001**:

```bash
# Health check
curl -sf http://localhost:5001/health

# Synchronous conversion
curl -sf -X POST http://localhost:5001/v1/convert/file \
  -F "files=@sample.pdf" -w "%{http_code}"
```

For **async** jobs, use `/v1/convert/source` and poll `/v1/status/{task_id}`. Alert when tasks stay pending too long.

On Kubernetes, combine URL monitoring with pod restart and OOMKilled alerts. Enable auto-remediation to restart unhealthy replicas.

## Monitoring the Python library & CLI

When DocLing runs in-process or as a batch job, HTTP probes do not apply:

- **Library:** Emit metrics on `convert()` duration and exceptions; alert on error rate spikes in logs
- **CLI / CronJob:** Alert on non-zero exit codes and missed schedule windows; watch job duration trends
- **Kubernetes CronJobs:** Use AlertMend Kubernetes alerts on Job failure events

## Mode comparison: AlertMend coverage

| Signal | Library / CLI | Docling Serve | Kubernetes |
|--------|---------------|---------------|------------|
| Process / job down | Log + job alerts | URL `/health` | URL + pod events |
| Slow conversions | App metrics | Latency SLOs | Latency + HPA metrics |
| OOM / crashes | Host/pod memory | Container alerts | Auto-remediation |
| Bad output | Synthetic sample doc | `/v1/convert/file` check | Same via Ingress |

## Frequently asked questions

### What are the different ways to run DocLing?

DocLing can run as a Python library, CLI, Docling Serve REST API (pip or Docker), on Kubernetes, or as an MCP server for AI agents. Each mode needs a slightly different monitoring playbook.

### How do I monitor Docling Serve specifically?

Use GET `/health` on port 5001, latency SLOs on `/v1/convert/file`, and task-status polling for async jobs. Pin Docker images explicitly—GPU variants (`docling-serve-cu*`) use version tags only.

### Can AlertMend monitor DocLing without Kubernetes?

Yes. For Docker or VM deployments, use URL monitoring and host alerts. For library or CLI setups, use log-based alerts and job failure notifications.

DocLing is only useful when documents convert reliably—regardless of how you deploy it. AlertMend adapts to your setup.

Ready to set this up? [Book a demo](https://calendly.com/hello-alertmend/30min).
