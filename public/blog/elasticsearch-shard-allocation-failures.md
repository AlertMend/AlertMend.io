---
title: "Elasticsearch Shard Allocation Guide"
excerpt: "Troubleshooting guide for Elasticsearch shard allocation failures in Kubernetes. Diagnose and fix issues caused by disk space and node failures."
date: "2025-02-5"
category: "Elasticsearch"
author: "Arvind Rajpurohit"
keywords: "Elasticsearch, shard allocation, allocation failures, cluster health, shard distribution, Elasticsearch troubleshooting, Kubernetes, AlertMend AI"
---

# Elasticsearch Shard Allocation Guide

Elasticsearch relies on shard allocation to distribute data across the cluster efficiently. However, shard allocation failures can disrupt your cluster's functionality, leading to performance degradation, potential data loss, and search inefficiencies. Understanding how to diagnose and resolve these failures is crucial for maintaining a healthy Elasticsearch cluster.

## What is Shard Allocation in Elasticsearch?

In Elasticsearch, data is divided into smaller parts known as shards. These shards are then distributed across nodes in the cluster. This distribution allows Elasticsearch to:
- Balance load across nodes
- Replicate data for fault tolerance
- Handle large-scale data operations efficiently
- Improve search and indexing performance

When shard allocation fails, Elasticsearch cannot properly distribute shards, resulting in:
- Slow performance
- Unassigned shards
- Potential data loss
- Cluster instability

## Common Causes of Shard Allocation Failures

### 1. Insufficient Disk Space

When nodes run out of disk space, Elasticsearch cannot allocate new shards or relocate existing ones.

**Symptoms:**
- Error: "disk watermark exceeded"
- Nodes marked as read-only
- Shards stuck in INITIALIZING state

**Diagnosis:**

```bash
# Check disk usage per node
kubectl exec -it <elasticsearch-pod> -- curl -X GET "localhost:9200/_cat/allocation?v"

# Check disk watermarks
kubectl exec -it <elasticsearch-pod> -- curl -X GET "localhost:9200/_cluster/settings?include_defaults=true&filter_path=**.disk*&pretty"

# Check node stats
kubectl exec -it <elasticsearch-pod> -- curl -X GET "localhost:9200/_nodes/stats/fs?pretty"
```

**Solutions:**

```bash
# Free up disk space by deleting old indices
kubectl exec -it <elasticsearch-pod> -- curl -X DELETE "localhost:9200/old-index-*"

# Adjust disk watermarks temporarily
kubectl exec -it <elasticsearch-pod> -- curl -X PUT "localhost:9200/_cluster/settings" -H 'Content-Type: application/json' -d'
{
  "persistent": {
    "cluster.routing.allocation.disk.watermark.low": "90%",
    "cluster.routing.allocation.disk.watermark.high": "95%"
  }
}'
```

### 2. Misconfigured Cluster Settings

Incorrect allocation settings can prevent shard allocation.

**Symptoms:**
- Shards cannot be allocated despite available resources
- Allocation explanation shows restrictions

**Diagnosis:**

```bash
# Check allocation settings
kubectl exec -it <elasticsearch-pod> -- curl -X GET "localhost:9200/_cluster/settings?include_defaults=true&filter_path=**.allocation*&pretty"

# Get allocation explanation
kubectl exec -it <elasticsearch-pod> -- curl -X GET "localhost:9200/_cluster/allocation/explain?pretty"
```

**Solutions:**

```bash
# Enable allocation if disabled
kubectl exec -it <elasticsearch-pod> -- curl -X PUT "localhost:9200/_cluster/settings" -H 'Content-Type: application/json' -d'
{
  "persistent": {
    "cluster.routing.allocation.enable": "all"
  }
}'

# Remove allocation filters if causing issues
kubectl exec -it <elasticsearch-pod> -- curl -X PUT "localhost:9200/_cluster/settings" -H 'Content-Type: application/json' -d'
{
  "transient": {
    "cluster.routing.allocation.exclude._name": ""
  }
}'
```

### 3. Node Failures

When nodes fail or become unavailable, shards cannot be allocated.

**Symptoms:**
- Nodes marked as unavailable
- Primary shards unassigned
- Cluster health RED

**Diagnosis:**

```bash
# Check node status
kubectl exec -it <elasticsearch-pod> -- curl -X GET "localhost:9200/_cat/nodes?v"

# Check cluster health
kubectl exec -it <elasticsearch-pod> -- curl -X GET "localhost:9200/_cluster/health?pretty"

# Check pod status in Kubernetes
kubectl get pods -l app=elasticsearch
```

**Solutions:**

```bash
# Restart failed node
kubectl delete pod <elasticsearch-pod>

# Wait for automatic recovery
# Monitor with:
watch -n 5 'kubectl exec -it <elasticsearch-pod> -- curl -s "localhost:9200/_cluster/health?pretty"'
```

### 4. High Shard Count

Too many shards can overwhelm nodes and cause allocation failures.

**Symptoms:**
- High shard count per node
- Slow allocation
- Cluster instability

**Diagnosis:**

```bash
# Count shards per node
kubectl exec -it <elasticsearch-pod> -- curl -X GET "localhost:9200/_cat/allocation?v"

# List indices with shard counts
kubectl exec -it <elasticsearch-pod> -- curl -X GET "localhost:9200/_cat/indices?v&h=index,pri,rep"
```

**Solutions:**

```bash
# Reduce replica count
kubectl exec -it <elasticsearch-pod> -- curl -X PUT "localhost:9200/_all/_settings" -H 'Content-Type: application/json' -d'
{
  "index.number_of_replicas": 1
}'

# Delete unused indices
kubectl exec -it <elasticsearch-pod> -- curl -X DELETE "localhost:9200/unused-index-*"
```

### 5. Network Partitions

Poor connectivity between nodes can cause allocation failures.

**Symptoms:**
- Nodes unreachable
- Allocation timeouts
- Split-brain scenarios

**Diagnosis:**

```bash
# Check node connectivity
kubectl exec -it <elasticsearch-pod> -- curl -X GET "localhost:9200/_cat/nodes?v"

# Check cluster state
kubectl exec -it <elasticsearch-pod> -- curl -X GET "localhost:9200/_cluster/state?pretty"
```

**Solutions:**
- Fix network connectivity
- Restart affected nodes
- Check Kubernetes network policies

## Diagnostic Workflow

### Step 1: Check Cluster Health

```bash
kubectl exec -it <elasticsearch-pod> -- curl -X GET "localhost:9200/_cluster/health?pretty"
```

**Health Status:**
- **GREEN**: All shards allocated
- **YELLOW**: Some replica shards unassigned
- **RED**: Some primary shards unassigned (CRITICAL)

### Step 2: Identify Unassigned Shards

```bash
# List unassigned shards
kubectl exec -it <elasticsearch-pod> -- curl -X GET "localhost:9200/_cat/shards?h=index,shard,prirep,state,unassigned.reason&v" | grep UNASSIGNED

# Get allocation explanation
kubectl exec -it <elasticsearch-pod> -- curl -X GET "localhost:9200/_cluster/allocation/explain?pretty"
```

### Step 3: Check Node Status

```bash
# List all nodes
kubectl exec -it <elasticsearch-pod> -- curl -X GET "localhost:9200/_cat/nodes?v"

# Check node allocation
kubectl exec -it <elasticsearch-pod> -- curl -X GET "localhost:9200/_cat/allocation?v"
```

### Step 4: Review Allocation Settings

```bash
# Check current allocation settings
kubectl exec -it <elasticsearch-pod> -- curl -X GET "localhost:9200/_cluster/settings?include_defaults=true&filter_path=**.allocation*&pretty"
```

## Solutions

### Adjust Shard Allocation Settings

```bash
# Enable all allocation types
kubectl exec -it <elasticsearch-pod> -- curl -X PUT "localhost:9200/_cluster/settings" -H 'Content-Type: application/json' -d'
{
  "persistent": {
    "cluster.routing.allocation.enable": "all"
  }
}'

# Adjust concurrent recoveries
kubectl exec -it <elasticsearch-pod> -- curl -X PUT "localhost:9200/_cluster/settings" -H 'Content-Type: application/json' -d'
{
  "persistent": {
    "cluster.routing.allocation.node_concurrent_recoveries": 4
  }
}'
```

### Free Up Disk Space

```bash
# Delete old indices
kubectl exec -it <elasticsearch-pod> -- curl -X DELETE "localhost:9200/old-index-*"

# Force merge to reduce size
kubectl exec -it <elasticsearch-pod> -- curl -X POST "localhost:9200/my-index/_forcemerge?max_num_segments=1"
```

### Reduce Shard Count

```bash
# Reduce replicas
kubectl exec -it <elasticsearch-pod> -- curl -X PUT "localhost:9200/_all/_settings" -H 'Content-Type: application/json' -d'
{
  "index.number_of_replicas": 1
}'
```

### Rebalance Cluster

```bash
# Trigger cluster rebalancing
kubectl exec -it <elasticsearch-pod> -- curl -X POST "localhost:9200/_cluster/reroute?retry_failed=true"
```

### Increase Node Resources

```yaml
# Update StatefulSet resources
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: elasticsearch
spec:
  template:
    spec:
      containers:
      - name: elasticsearch
        resources:
          requests:
            memory: "8Gi"
            cpu: "4"
          limits:
            memory: "8Gi"
            cpu: "4"
```

## Best Practices

### 1. Monitor Cluster Health

```bash
# Continuous monitoring
watch -n 30 'kubectl exec -it <elasticsearch-pod> -- curl -s "localhost:9200/_cluster/health?pretty"'
```

### 2. Maintain Adequate Disk Space

- Keep disk usage below 85%
- Monitor disk usage per node
- Set up alerts for disk usage

### 3. Set Appropriate Shard Sizes

- Keep shard sizes between 20-50GB
- Monitor shard count per node
- Use index lifecycle management

### 4. Regular Snapshots

```bash
# Create snapshot repository
kubectl exec -it <elasticsearch-pod> -- curl -X PUT "localhost:9200/_snapshot/my-backup" -H 'Content-Type: application/json' -d'
{
  "type": "s3",
  "settings": {
    "bucket": "elasticsearch-backups"
  }
}'
```

### 5. Use Index Lifecycle Management

```bash
# Create ILM policy
kubectl exec -it <elasticsearch-pod> -- curl -X PUT "localhost:9200/_ilm/policy/my-policy" -H 'Content-Type: application/json' -d'
{
  "policy": {
    "phases": {
      "hot": {
        "actions": {
          "rollover": {
            "max_size": "50GB",
            "max_age": "30d"
          }
        }
      }
    }
  }
}'
```

## Automated Detection and Remediation

AlertMend AI can automatically:

- **Detect Allocation Failures**: Monitor cluster health and identify allocation failures
- **Diagnose Root Causes**: Analyze allocation explanations to identify specific issues
- **Automated Remediation**: Free up disk space, adjust settings, or reroute shards
- **Prevent Issues**: Monitor resources and alert before failures occur

## Conclusion

Elasticsearch shard allocation failures can significantly impact cluster performance and data accessibility. By understanding common causes, following systematic diagnostic approaches, and implementing preventive measures, you can maintain a healthy Elasticsearch cluster. Regular monitoring, proper resource management, and automated remediation help prevent and quickly resolve allocation failures.

---

*Need help with Elasticsearch troubleshooting? [Learn about AlertMend's auto-remediation](/solutions/auto-remediation).*
