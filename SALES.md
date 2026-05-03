# AlertMend — Sales Document

A two-part deck for buyer conversations. **Part 1** is the value-proposition narrative for execs / budget owners. **Part 2** is the technical deep-dive for platform engineers, SRE leads, and security reviewers.

---

## Cover · One-line positioning

> **AlertMend is the AIOps platform for everything in production.** One workspace that triages incidents in ~15 seconds, runs remediations across pods, VMs and GPU fleets, and cuts your Kubernetes, AWS and GPU bill in half.

| | |
| --- | --- |
| **Category** | AIOps · Incident response · Runbook automation · FinOps |
| **Surface** | Kubernetes · VMs (EC2 / GCP) · ECS / Lambda · GPU / MLOps |
| **Form factor** | SaaS or on-prem agents, BYOM (bring-your-own-model) for regulated workloads |
| **Time to value** | Live in 1 day. Read-only first scan in minutes. |
| **Backed by** | Antler |
| **Compliance** | SOC 2 Type II (in progress), ISO 27001 (in progress), GDPR-aligned |

---

# Part 1 — Value Proposition Deck

## 1. The problem we solve

> *"The bigger your cloud gets, the harder it is to run."*

Modern infra teams are drowning. More services, more clusters, more alerts — and every layer of scale lands on the same small platform team:

- **Observability is an afterthought.** Endpoints ship before anyone can see them. Logs, metrics, traces, and chat sit in different consoles.
- **Alert noise & paging fatigue.** Alertmanager, Datadog, custom webhooks all firing into one Slack channel with no correlation, no routing.
- **Kubernetes complexity outpaces the team.** Every CrashLoopBackOff / OOMKilled / scheduling failure becomes a `kubectl` scavenger hunt.
- **On-call burns out senior engineers.** No structured rotations, no escalation paths, no audit trail. Your best SRE *is* the human pager.
- **Cloud bills nobody can explain.** Over-provisioned requests, idle EC2, forgotten RDS — finance asks why spend doubled, infra has no answer.
- **Tribal knowledge in shell history.** Recovery steps live in someone’s terminal scrollback. New engineers re-learn every fire drill.
- **GPU fleets fly blind.** CUDA OOM, NCCL timeouts, MIG slices unaccounted for. Half the H100s idle, the other half throttle, nobody can prove it.
- **ML pipelines stall silently.** A Kubeflow DAG hangs at step 7. A vLLM replica drifts on p99. Nobody pages until a data scientist files a ticket.

**Net effect:** higher MTTR, ballooning cloud spend, on-call burnout, and a platform team that can’t scale with the business.

## 2. Who this is for (ICP)

| Buyer | Why they care |
| --- | --- |
| **VP / Director of Infrastructure** | Owns cloud bill, MTTR and platform headcount. Wants to scale ops without scaling team. |
| **Platform Engineering / SRE Lead** | Drowning in alert noise, owns the runbooks nobody updates, fights the toolchain. |
| **Head of ML Infra / MLOps** | Burning GPU hours on stalled training and idle nodes. Needs first-class signals for CUDA, NCCL, vLLM, Kubeflow. |
| **CTO at growth-stage SaaS / FinTech / Healthcare** | Past the “Datadog + PagerDuty + a Notion runbook” stage. Needs one operational surface. |
| **Security & GRC** | Wants SOC-style RBAC, audit trail, and BYOM for regulated / air-gapped data. |

**Sweet spot:** 50–500 engineers, ≥1 production Kubernetes cluster *or* a meaningful EC2/ECS fleet *or* a GPU training/inference footprint. Multi-cloud welcome.

## 3. The shift — what changes with AlertMend

| Today | With AlertMend |
| --- | --- |
| Alert lands in Slack with a stack trace | RCA lands in the Slack thread with **executive summary → evidence → conclusion → remediation** in ~15s |
| Senior SRE chases logs across kubectl + Datadog + Grafana | Single workspace: cluster overview → live incidents → SQL over logs → metrics → RCAs |
| Runbooks live in someone’s scrollback | Visual no-code runbooks with approvals, fan-out across pods or VM fleets, full audit |
| Right-sizing happens once a quarter, by hand | Continuous FinOps with one-click YAML apply across K8s, plus EC2/RDS/ELB/ECS savings |
| GPU utilization is a mystery | Per-GPU util, MIG slices, ECC, thermal — wired into the same incident system |
| Tools fight each other | One platform replaces 4: alerting + incident + on-call + runbooks |

## 4. Three pillars of value

### Pillar A — **Triage in seconds, not hours**
Every Kubernetes alert (and every proactively detected failure — restart storms, OOM loops, scheduling stalls) gets a structured root-cause report:
- **Executive summary → Evidence → Conclusion (with confidence) → Remediation steps**
- Auto-collected from pod YAML, container status, logs, node metrics, events
- Delivered straight into the Slack alert thread, with deep-links back to live pod metrics/logs
- Works for both alert-driven incidents *and* proactively-detected ones

### Pillar B — **Automate safely across your fleet**
Drag-and-drop runbooks that actually execute:
- **8 trigger sources** — alerts, cron, HealthPolicy, webhooks, chat slash-commands, custom integrations
- **∞ fleet fan-out** — same step on every connected VM, or every pod matching a label selector
- **3+ approval channels** — Slack, MS Teams, Email, in-product. Pause until the right humans confirm.
- **100% audited** — every step, approval, command and output recorded for compliance and break-glass review.

### Pillar C — **Cut cloud spend in half**
- **Kubernetes FinOps:** spend by namespace / workload / controller, requested vs used, **one-click YAML apply**.
- **AWS cost optimization:** EC2, RDS, ELB, ECS line items, per-resource `save $/mo`, idle-instance cleanup.
- **GPU FinOps:** idle GPU detection across H100/A100 fleets, MIG slice accounting, util-based right-sizing.

## 5. Proof — outcomes our customers actually saw

| Customer | Stack | Result |
| --- | --- | --- |
| **Polymer Search** (AI/SaaS, US, ECS + SQS + Lambda) | ECS + Datadog | **MTTR 45 min → <5 min (90% reduction)**, **100%** of known SQS stalls auto-resolved, **0** overnight escalations. **21× downtime avoided, 25 eng-hours saved, $2K eng cost + $3K revenue saved in month one**, **99% application uptime**. |
| **WareFlex** (Logistics, Vietnam → NA, GKE) | Kubernetes / GKE | **50% reduction in GKE costs**, 41% compute savings, 94% storage savings, **0% performance regression**. Compute $719/mo → $422/mo, storage $407/mo → $25/mo. |
| **Decklar** (IoT logistics, Silicon Valley HQ, K8s 3,000+ pods) | Kubernetes at scale | **3,000+ pods on one dashboard**, **70% reduction in investigation time**, **15–20 hours/week** saved in manual debugging. |
| **AIVOS** (Conversational AI, Vietnam, GCP VMs) | GCP VMs (no K8s) | **90%+ of recurring service failures auto-remediated**, **100%** recovery of stuck VMs, **0** overnight alerts for known failures. |

**What teams say after switching the lights on:**
- *“RCAs land in the Slack thread before the on-call engineer finishes opening their laptop. We’ve cut MTTR by an order of magnitude on Kubernetes incidents.”* — Platform Engineering Lead, B2B SaaS
- *“The right-sizing recommendations with one-click YAML apply paid for the platform in the first month. Our Kubernetes spend dropped 38%.”* — Director of Infrastructure, FinTech
- *“We replaced four tools with AlertMend and our team finally stopped fighting the toolchain.”* — Staff SRE, Healthcare

## 6. Why AlertMend, not the alternatives

| Alternative | What it gives you | What’s missing |
| --- | --- | --- |
| **Datadog / New Relic** | Dashboards & metrics | No remediation, no runbooks, no FinOps apply, generic LLM “co-pilot” |
| **PagerDuty / Opsgenie** | Paging & rotations | No RCA, no diagnosis, no auto-fix, no FinOps |
| **Robusta / k8sgpt** | Some K8s automation | Fragmented, no FinOps, no GPU/ML signals, weak audit |
| **Kubecost / CAST AI** | K8s cost numbers | No incident, no on-call, no auto-remediation |
| **Internal tooling** | Custom-fit | Hand-built, unmaintained, no audit, leaves on-call talent — *the SRE becomes the platform* |

**AlertMend is the one product that ties all four together** — observability, incident, FinOps, automation — with a Kubernetes-specialized model and first-class GPU/MLOps coverage.

## 7. Differentiators (the things competitors don’t say)

1. **Service-specialized AI, not generic LLM.** Failure-mode vocabulary trained per service: MySQL replication, PostgreSQL WAL, Kafka ISR, Redis eviction, etcd raft, Cassandra compaction, NVIDIA CUDA OOM, NCCL timeouts, vLLM KV-cache pressure, Kubeflow DAG fail, MLflow registry drift, vector DB recall drop, Argo workflows.
2. **Both alert-driven and proactively-detected RCAs.** We don’t just react — the platform discovers restart storms, OOM loops, scheduling stalls itself, and pages a structured RCA before anyone notices.
3. **First-class GPU & MLOps.** Per-GPU util, MIG slices, ECC, thermal, train-time signals from PyTorch DDP / Ray / Kubeflow / MLflow, inference health for vLLM & Triton with KV-cache pressure & p99 drift.
4. **Bring-your-own-model.** Point inference at a local or self-hosted model for air-gapped, regulated, data-residency-sensitive environments. No data leaves your VPC.
5. **Logs as SQL.** `SELECT * FROM logs` with namespace/pod/node fields, time-range presets, and stream selection. No new query language to learn.
6. **One-click apply** on FinOps recommendations — YAML preview, then cluster apply. Right-sizing isn’t a slide deck, it’s a button.
7. **Built-in audit trail.** Every page navigation, click, and apply captured with per-user filters and error-only views — for security reviews, break-glass checks, SoC-style separation of duties.
8. **Replaces 4 tools.** Alerting + incident + on-call rotations + runbooks → one workspace.

## 8. Pricing & packaging (positioning)

| Tier | Who it’s for |
| --- | --- |
| **SRE / DevOps Playground** (Free) | Individuals trying out the product. Unlimited remediation flows, integrations, AI RCAs. |
| **Startups** | Up to ~10 VMs / small K8s. Same feature set, hosted. |
| **Growth** *(most popular)* | >10 VMs or Kubernetes <100 pods. |
| **Enterprise / Custom** | Unlimited VMs & K8s, on-prem setup, BYOM, immediate support, custom SLAs. |

> **Positioning line:** AlertMend is priced to replace 4 line items (paging + RCA tooling + runbook tooling + cost tooling), so it pays for itself the first time it kills an idle GPU node or auto-restarts a stuck ECS task at 3am.

## 9. ROI framing for the buyer

Use these as anchors in a deal:

- **Engineer time saved:** at the case-study median (~15–25 hours/week of debugging recovered), one Staff SRE at $250k fully-loaded ≈ **$60k–100k/yr** of recovered capacity.
- **Cloud bill:** 30–50% reduction is the band we see on K8s + GPU. On a $300k/mo K8s + GPU spend, that’s **$1M+/yr** back.
- **Avoided downtime:** Polymer Search saved **21× downtime + $3k revenue in month one**. Map this to the customer’s own $/min-of-downtime number.
- **On-call retention:** the cost of one senior SRE leaving (recruit + ramp) is typically **$200–400k**. Sustainable paging is a retention lever.

## 10. Top objections — and our answers

| Objection | Response |
| --- | --- |
| *“We already have Datadog.”* | Keep it. We ingest from Alertmanager, Datadog, Victoria Metrics, custom webhooks. We add the diagnosis + remediation layer Datadog doesn’t have. |
| *“We can’t send our data to OpenAI.”* | BYOM. Point inference at a self-hosted model. Air-gapped deploy is a first-class option. |
| *“We have a homegrown runbook system.”* | We’ll plug into it via REST/webhooks. But our visual builder + fan-out + audit is usually a better long-term home. |
| *“GenAI hallucinates — we can’t auto-remediate.”* | Auto-remediation is gated by approvals, conditional logic, and a full audit trail. The default is *Recommend*, not *Execute*. |
| *“We’re too small.”* | The free tier covers individuals end to end. Time-to-first-RCA is minutes. |
| *“We’re too regulated.”* | RBAC is granular. Every action is audited. SOC 2 Type II and ISO 27001 are in progress. On-prem + BYOM is supported. |

## 11. The CTA

- **Free cluster health check.** A read-only scan of a live cluster. Output: prioritized list of OOM-trending workloads, restart-prone pods, misconfigured limits, over-provisioned spend, unowned alerts. No incident required, results in minutes.
- **Live in 1 day.** No tool replacement required, no credit card.
- **[Book a demo](https://calendly.com/hello-alertmend/30min)** · **[Try the playground](https://app.alertmend.io/playground?source=homepage)** · **[Sign up](https://app.alertmend.io/signup)**

---

# Part 2 — Technical Deck

For platform engineers, SRE leads, security reviewers, and architects.

## 1. End-to-end architecture (mental model)

```
                    ┌──────────────────────────────────────────────────┐
   YOUR ENV         │                 ALERTMEND CONTROL PLANE           │
                    │                                                  │
  ┌───────────┐     │   ┌────────────┐  ┌────────────┐  ┌────────────┐  │
  │ K8s API   │────▶│   │  Ingest    │  │ Diagnosis  │  │ Workspace  │  │
  │ Prometheus│     │   │  (alerts,  │─▶│ engine     │─▶│ API        │  │
  │ Datadog   │     │   │ logs,      │  │ (RCA · AI) │  │ (RBAC,     │  │
  │ VM agents │     │   │  metrics,  │  │            │  │  audit,    │  │
  │ GPU(NVML) │     │   │  events)   │  └─────┬──────┘  │  policies) │  │
  └───────────┘     │   └────────────┘        │         └─────┬──────┘  │
        ▲           │                         ▼               │         │
        │           │                  ┌────────────┐         │         │
  ┌───────────┐     │                  │ Runbooks / │◀────────┘         │
  │ Slack /   │◀────│──────────────────│ orchestrator│                  │
  │ Teams /   │     │                  │ (fan-out,  │                   │
  │ PagerDuty │     │                  │  approvals)│                   │
  │ Jira      │     │                  └─────┬──────┘                   │
  └───────────┘     │                        │                          │
                    │                        ▼                          │
                    │                  ┌────────────┐                   │
                    │                  │ Apply layer│  (YAML, kubectl,  │
                    │                  │            │   SSH, REST,      │
                    │                  │            │   cloud SDK)      │
                    │                  └────────────┘                   │
                    └──────────────────────────────────────────────────┘
```

**Three planes:**
1. **Data plane** — agents and connectors that observe (read-only by default) and execute (gated by RBAC + approvals).
2. **Control plane** — workspace API, RBAC, audit, policies, runbook orchestrator.
3. **Intelligence plane** — diagnosis engine (RCA + service-specialized models), with optional BYOM.

## 2. Connectors & data ingestion

| Surface | How we connect |
| --- | --- |
| **Kubernetes** | Cluster connect (in-cluster agent + read-only RBAC). Reads pods, nodes, deploys, events, PVCs, jobs. |
| **VMs (EC2 / GCP / on-prem)** | Lightweight agent over SSH / cloud-init. System logs, custom health scripts, in-VM process supervision. |
| **AWS** | Registered Agents for EC2 / ECS / CloudWatch / RDS / ELB / Lambda. |
| **GPU / NVML** | nvidia-smi / NVML for per-GPU util, mem, ECC, thermal, MIG. |
| **Existing alert sources** | Alertmanager, Datadog, Victoria Metrics, Prometheus, custom webhooks. |
| **Chat / paging** | Slack, MS Teams, PagerDuty, WhatsApp, Email, Phone, SendGrid. |
| **Tickets** | Jira. |
| **CI/CD** | GitHub Actions, GitLab CI, Jenkins. |

> **Default posture is read-only.** Mutating actions require an explicit policy + RBAC role.

## 3. The diagnosis engine (AI RCAs)

**The contract every RCA follows:**

```
1. Executive summary    — one paragraph the on-call can read on their phone
2. Evidence collected   — pod YAML, container status, last N restarts,
                          eviction msgs, recent logs, node metrics
3. Conclusion           — root cause + confidence level (high/med/low)
4. Remediation          — ordered steps, scoped to the right resource
```

**Worked example (real shape — log-ingester restart storm):**

- **Executive summary:** Pod is experiencing frequent restarts due to *ephemeral-storage pressure* on its node, disrupting log ingestion.
- **Evidence:** Pod YAML, eviction msg `"node low on ephemeral-storage"` · Container Status, 257 restarts, last reason: Error · Pod logs (didn’t live long enough to log) · Node metrics (no significant memory pressure).
- **Conclusion (confidence: high):** Ephemeral-storage exhaustion on the scheduling node is causing eviction loops on this workload.
- **Remediation:** (1) Set explicit `ephemeral-storage` requests & limits · (2) Reschedule onto a node with larger ephemeral storage · (3) Add cluster-wide ephemeral-storage monitoring.
- **Latency:** ~14.8s end-to-end on a real prod cluster.

**Two trigger modes:**
- **Alert-driven** — fired by Alertmanager, Datadog, etc. RCA posts into the Slack thread.
- **Proactively detected** — the platform’s own watchers detect restart storms, OOM loops, scheduling stalls, and emit an RCA even when no external alert fired.

**Bring-your-own-model.** Inference can be pointed at a local or self-hosted model (vLLM/Triton-served, internal endpoint, etc.) for air-gapped or regulated environments. **No prompt or evidence leaves your VPC** in BYOM mode.

## 4. Service-specialized intelligence

We don’t train one generic LLM and call it AIOps. Each service has its own failure-mode vocabulary baked in.

**Databases:** MySQL (replication, deadlocks, buffer-pool), PostgreSQL (WAL, autovacuum, lock contention, long-running tx), MongoDB (replica-set lag, oplog window, election storms, chunk imbalance), Cassandra (compaction, hint overload, tombstones, GC), CockroachDB.

**Caches & queues:** Redis (memory pressure, eviction, AOF/RDB), RabbitMQ (queue depth, channel churn, mem alarm, unack), Apache Kafka (consumer lag, ISR shrink, partition skew, broker disk).

**Search & control plane:** Elasticsearch / OpenSearch (heap, shard relocation, yellow/red), etcd (raft churn, slow apply, db-size, fsync latency), HAProxy, Nginx.

**GPU & MLOps:** NVIDIA (CUDA OOM, thermal throttling, ECC, MIG exhaust, idle GPUs), PyTorch DDP (NCCL timeout, NaN loss, gradient explode, dataloader stall), Ray (head-node OOM, actor restart loop, plasma full), Kubeflow (DAG fail, KFServing 5xx, notebook OOM, Katib timeout), MLflow (run write fail, registry drift, stale model), vLLM / Triton (p99 drift, KV-cache pressure, batch starvation), Argo Workflows, Pinecone / Weaviate / Milvus, Apache Airflow, Apache Spark.

## 5. Runbooks engine

**Node types** — Trigger · Command · Predefined · Delay · Condition (if/else) · Approval · Send Message · Declare Incident · REST API · Remediation · Closing summary.

**Capabilities:**
- **Triggers:** Alerts · Cron · HealthPolicy · Webhooks · Slash-commands · Custom integrations (8 sources).
- **Branching:** Conditional logic on container status, exit code, output regex, metric thresholds.
- **Fan-out:** Run the same step on every connected VM in a fleet, or every pod that matches a label selector.
- **Approvals:** Pause for human-in-the-loop on Slack, MS Teams, Email, or in-product, with timeouts.
- **Side-effects:** Apply YAML to cluster, run shell over SSH, call REST APIs, post to Slack/Teams, file Jira, archive logs to S3, declare incidents in PagerDuty.
- **Audit:** Every step, approval, command, output recorded — per-user filterable, exportable for security reviews.

**Worked example workflow** — *Auto-remediate CrashLoopBackOff*:
```
[Trigger]   alert · CrashLoopBackOff · prod cluster
   ↓
[Command]   kubectl describe + logs · last 5m
   ↓
[If/else]   restarts > 5 ?
   ├── yes ─▶ [Approval · Slack]  @oncall · 5 min timeout
   │              ↓
   │         [Remediation]  rollout restart · fan-out · all pods · label tier=api
   │              ↓
   │         [Closing summary] post to Slack: what ran, who approved, audit link
   └── no  ─▶ [Send Message]  Slack info post · #sre-ops · transient blip
```

## 6. Observability primitives

| Primitive | What it does |
| --- | --- |
| **Cluster overview** | Scope by cluster + duration. See active incidents (RESTART STORM, OOMKilled, ContainerCreation, rollout stuck). Open *View RCA* on any card. Cluster Copilot chat without leaving the page. |
| **AI Chat** | Ask cluster questions in plain language — grounded in your real inventory, events, logs, metrics. Not generic suggestions. |
| **Health rules** | Per-cluster monitors for pods, nodes, PVCs, jobs, deploys. Severity, live state, operational toggle, no YAML redeploy. |
| **Logs (SQL)** | `SELECT * FROM logs` with namespace/pod/node fields, time-range presets, stream selection. |
| **Metrics & dashboards** | Custom panels, data-source selectors, auto-refresh, persisted via Workspace API. |
| **API monitors** | Synthetic HTTP(S) checks with status, body or response-value rules. 90-day uptime ribbons. Wired into incidents & escalation paths. |
| **GPU / MLOps observability** | Per-GPU util, mem, ECC, thermal, MIG slices. Train-time signals (PyTorch DDP, Ray, Kubeflow, MLflow). Inference health for vLLM & Triton with KV-cache pressure and p99 drift. |
| **Kubernetes FinOps** | Spend by namespace / workload / controller, requested vs used, recommended fix with YAML preview & cluster apply. |
| **AWS cost optimization** | EC2 / RDS / ELB / ECS line items, per-resource `save $/mo`, idle-instance cleanup, environment-scoped views. |
| **On-call programs** | Schedules & rotations with timezones. Escalation chains: email → WhatsApp → phone with wait timers. |

## 7. Integrations (current)

**Cloud / runtime:** Kubernetes, AWS, Google Cloud, Azure.
**Observability:** Prometheus, Grafana, Datadog, Victoria Metrics, CloudWatch (soon), Azure Monitor (soon).
**Chat & paging:** Slack, Microsoft Teams, Google Meet, PagerDuty, WhatsApp, Email, SendGrid.
**Tickets & SCM:** Jira, GitHub, GitLab.
**CI/CD:** Jenkins, GitHub Actions, GitLab CI.
**Storage:** S3 (audit + log archive).
**Custom:** REST APIs and webhooks in either direction.

## 8. Security, RBAC & compliance

- **RBAC:** granular role-based access controls scope navigation, data, and *mutating* actions. Read-only by default.
- **Audit:** every page navigation, click, and apply captured with per-user filters and error-only views — for security reviews, break-glass checks, SoC-style separation of duties.
- **Approvals:** mutating runbooks gated by Slack / Teams / in-product approvals.
- **Data isolation:** workspace-level tenancy. Per-tenant encryption at rest.
- **BYOM:** point inference at a local or self-hosted model so prompts and evidence never leave your VPC.
- **Compliance roadmap:**
  - **SOC 2 Type II** — *in progress*
  - **ISO 27001** — *in progress*
  - **GDPR** — aligned (EU data residency on request)
- **Deployment options:** SaaS (default), on-prem (Enterprise tier), hybrid (control plane SaaS, data plane in your VPC).

## 9. Deployment & onboarding (4 stages)

| Stage | Day-N | What happens |
| --- | --- | --- |
| **1 · Connect** | Day 0–1 | Register Agents for EC2 / ECS / CloudWatch. Add VMs over SSH. Connect Kubernetes clusters. Invite teammates with RBAC. |
| **2 · Observe** | Day 1–7 | Cluster overview is live. Drill into pods, query logs in SQL, build metric dashboards, watch APIs with synthetic checks. |
| **3 · Respond** | Week 1–2 | Alerts → Incidents → On-call. Filter rules route signal to the right channel. AI RCAs land in the Slack thread automatically. |
| **4 · Automate & save** | Week 2+ | Runbooks run safe, approved fixes across pods or VM fleets. FinOps right-sizing applies YAML straight to the cluster. |

> **Time-to-first-RCA: minutes.** Time-to-first-auto-remediation: typically week 2 once approvals + rollback are wired up.

## 10. SLOs & operational posture

- **Default posture:** read-only. No mutation without explicit policy + RBAC + (typically) human approval.
- **Latency targets:**
  - AI RCA p50: ≤ 15 s · p99: ≤ 30 s on alert-driven incidents.
  - Synthetic API check granularity: 30 s.
  - Runbook step start latency: < 5 s on cached integrations.
- **Reliability:** redundant ingestion path; failures degrade to read-only observability rather than dropping signals.
- **Failure modes if AlertMend is down:** your existing Datadog / Prometheus / PagerDuty path keeps working unchanged. AlertMend sits *on top of* your stack, not in front of it.

## 11. Roadmap (selected)

- **Soon:** CloudWatch and Azure Monitor as first-class ingestion sources, deeper Grafana integration.
- **In progress:** SOC 2 Type II, ISO 27001 certifications.
- **Coming:** Vault, Consul, ClickHouse, CockroachDB, Temporal, Flink, Milvus, Feast, TensorFlow, JAX coverage in the service-specialized model catalog.

## 12. Technical evaluation checklist

For an evaluator running a 2-week pilot, target these signals:

- [ ] One Kubernetes cluster connected, full inventory visible within 1 hour.
- [ ] First AI RCA on a real incident within 24 hours.
- [ ] At least one proactively-detected RCA (no external alert) in the first week.
- [ ] One runbook built for your most-paged alert; first auto-remediation with approvals by end of week 1.
- [ ] FinOps right-sizing recommendations generated for ≥1 namespace; one YAML apply executed.
- [ ] Slack/Teams + PagerDuty + Jira fully wired.
- [ ] Audit trail reviewed by a security reviewer (export a per-user filter).
- [ ] If applicable: BYOM endpoint configured; verify no outbound calls to public model providers.

---

## Appendix A — Suggested narrative flow for a 30-min sales call

1. **(2 min)** Discover: clusters, cloud spend, on-call size, GPU footprint, pain ranking.
2. **(5 min)** Show the *Cluster overview → View RCA* path on the demo workspace. Land the “RCA in 15 seconds” moment.
3. **(5 min)** Show a runbook (CrashLoopBackOff auto-remediation) with approvals, fan-out, and the closing audit summary.
4. **(5 min)** FinOps: namespace spend → recommended fix → YAML preview → apply.
5. **(5 min)** GPU/MLOps board: GPU fleet + training run + vLLM inference. Land the “first-class for ML” point.
6. **(3 min)** Security: RBAC, audit, BYOM, on-prem.
7. **(5 min)** Pricing & next step: free cluster health check, then a 2-week pilot.

## Appendix B — One-paragraph pitch (paste into email)

> AlertMend is the AIOps platform for everything in production. Connect your Kubernetes clusters, VMs, and GPU fleets, and within a day you’ll get structured AI root-cause reports landing in your Slack threads in ~15 seconds, no-code runbooks that auto-remediate across pods or VM fleets with approvals and audit, and FinOps right-sizing that you apply with one click. Teams typically cut MTTR by an order of magnitude and Kubernetes/GPU spend in half — replacing alerting, incident, on-call, and runbook tooling in a single workspace. Bring-your-own-model is supported for regulated and air-gapped environments. SOC 2 Type II and ISO 27001 in progress; GDPR aligned. Backed by Antler.
