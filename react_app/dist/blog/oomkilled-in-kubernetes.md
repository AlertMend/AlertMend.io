---
title: "OOMKilled in Kubernetes"
excerpt: "In Kubernetes, applications run inside pods with limits on CPU and memory. If CPU goes high, Kubernetes throttles it. But if memory goes high, Kubernetes kills the pod."
date: "2025-07-01"
category: "Kubernetes"
author: "Arvind Rajpurohit"
---

# OOMKilled in Kubernetes

In Kubernetes, applications run inside pods with limits on CPU and memory. If CPU goes high, Kubernetes throttles it. But if memory goes high, Kubernetes kills the pod.

## Understanding OOMKilled

When a pod exceeds its memory limit, Kubernetes terminates it with the status `OOMKilled` (Out Of Memory Killed). This is a critical issue that can cause service disruptions and data loss.

## Common Causes

1. **Memory Limits Too Low**: Pods are allocated insufficient memory for their workload
2. **Memory Leaks**: Applications that gradually consume more memory over time
3. **Sudden Traffic Spikes**: Unexpected load causing memory usage to spike
4. **Inefficient Memory Usage**: Applications not properly managing memory resources

## How to Diagnose

```bash
# Check pod status
kubectl get pods

# Describe the pod to see OOMKilled status
kubectl describe pod <pod-name>

# Check container logs
kubectl logs <pod-name>
```

## Solutions

### 1. Increase Memory Limits

Update your deployment YAML to increase memory limits:

```yaml
resources:
  requests:
    memory: "512Mi"
  limits:
    memory: "1Gi"
```

### 2. Monitor Memory Usage

Use tools like Prometheus and Grafana to monitor memory usage patterns and identify trends.

### 3. Fix Memory Leaks

Review your application code for memory leaks and implement proper garbage collection strategies.

### 4. Implement Auto-Scaling

Use Horizontal Pod Autoscaler (HPA) to automatically scale pods based on memory usage.

## Best Practices

- Set appropriate memory requests and limits
- Monitor memory usage continuously
- Implement proper resource quotas
- Use memory-efficient application designs
- Test memory limits in staging environments

## Conclusion

OOMKilled errors can be prevented with proper resource management, monitoring, and application optimization. AlertMend AI can automatically detect and remediate OOMKilled incidents by adjusting resource limits and restarting pods.

---

*Want to automate OOMKilled remediation? [Learn more about AlertMend's auto-remediation features](/solutions/auto-remediation).*

