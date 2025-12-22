---
title: "How to Roll Back Deployments in Kubernetes"
excerpt: "Understand how Kubernetes handles rollbacks, why it"
date: "2025-07-27"
category: "Kubernetes"
author: "Arvind Rajpurohit"
keywords: "Kubernetes, AlertMend AI, AIOps, DevOps, container orchestration, Kubernetes monitoring, Kubernetes troubleshooting, Kubernetes automation"
---

# How to Roll Back Deployments in Kubernetes

Kubernetes is built for safe, reliable software delivery — but even the best-planned deployments can introduce bugs into production. When this happens, rolling back to a previous working version becomes critical.

Let’s walk through how Kubernetes handles deployment rollbacks, the underlying mechanics, and why you should **think twice before using rollback features in production environments**.

---

## Rolling Updates: Kubernetes Default Strategy

When you update a Deployment in Kubernetes (like changing the container image), Kubernetes performs a **rolling update** by default. This means:

- Old Pods are gradually terminated  
- New Pods with the updated spec are created  
- Traffic remains uninterrupted  

For example:

If you update your container image from `v1.0.0` to `v1.1.0`, Kubernetes incrementally shifts traffic to the newer Pods while retiring the old ones.

> Rolling updates are ideal for zero-downtime deployments — as long as the new version is API-compatible.

---

## When Things Go Wrong: The Need for Rollback

Even with rolling updates, a deployment might break production due to:

- Regressions  
- Missing dependencies  
- Misconfigurations  

To recover, Kubernetes allows you to **roll back to an earlier working version** using its built-in revision tracking mechanism.

---

## Understanding ReplicaSets and Rollouts

Each time you update a Deployment, Kubernetes:

- Creates a new **ReplicaSet** with the new Pod template  
- Reduces the replica count of the old ReplicaSet  
- Retains old ReplicaSets with `replicas: 0`  

This design avoids version mixing and enables rollback by scaling the old ReplicaSet back up.

## Useful Commands

### Check your rollout history
```bash
kubectl rollout history deployment/my-app
```

### Roll back to a previous version
```bash
kubectl rollout undo deployment/my-app --to-revision=2
```

### Check internal revision number
```bash
kubectl get replicaset <replica-name> -o yaml
```

---

## Why You Should Avoid `rollout undo` in Production

While `kubectl rollout undo` works, it introduces **state drift** — your cluster becomes out of sync with your Git repository.

### Why This Is Dangerous

- Your Git repository still shows the newer YAML  
- Breaks GitOps pipelines (e.g., Argo CD, Flux)  
- Leads to confusion and unpredictable environments  

---

## What to Do Instead: Roll Forward

The recommended approach in modern environments is:

1. Revert the change in Git (`git revert` or manually update the YAML)  
2. Commit and push the updated YAML  
3. Let your CI/CD pipeline redeploy the reverted version  

> This ensures your **live cluster stays perfectly aligned** with your Git source — the foundation of true **Infrastructure as Code**.

---

## Summary: Roll Forward, Not Roll Back

| **Strategy**     | **Best For**                    | **Risk Level** |
|:----------------:|:-------------------------------:|:--------------:|
| `rollout undo`   | Emergency manual rollback        | ❌ High        |
| Git revert       | GitOps-compatible restoration    | ✅ Low         |
| YAML reapply     | Temporary manual/CI fix          | ⚠️ Medium      |

---

## Best Practices

- **Avoid** using `kubectl rollout undo` in production  
- **Always** revert your YAML in Git and redeploy via CI/CD  
- Keep Git and your live cluster perfectly in sync for reliable GitOps workflows
