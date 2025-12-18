---
title: "Troubleshooting Elasticsearch Unassigned"
excerpt: "Elasticsearch unassigned shards occur when a node is unable to assign shards properly, leading to reduced search performance and potential data loss."
date: "2025-06-05"
category: "Elasticsearch"
author: "Arvind Rajpurohit"
keywords: "Elasticsearch, unassigned shards, Kubernetes, troubleshooting Elasticsearch, cluster health, shard allocation, automated incident remediation, operational efficiency"
---


## Understanding Unassigned Shards

Unassigned shards are shards that should be allocated to nodes but aren't. This can happen for several reasons:

- **Node failures**: Nodes go down and shards cannot be allocated
- **Disk space**: Insufficient disk space on nodes
- **Memory pressure**: Nodes cannot allocate shards due to memory constraints
- **Configuration issues**: Shard allocation settings prevent assignment

## Common Causes

### 1. Disk Space Issues

**Symptoms:**
- "disk watermark exceeded" errors
- Nodes in read-only mode

**Solutions:**
- Free up disk space
- Increase node disk size
- Clean up old indices
- Adjust disk watermark settings

### 2. Node Failures

**Symptoms:**
- Nodes unavailable
- Shards stuck in unassigned state

**Solutions:**
- Restart failed nodes
- Check pod status
- Verify node connectivity
- Recover from snapshots if needed

### 3. Allocation Settings

**Symptoms:**
- Shards cannot be allocated
- Allocation explanation shows restrictions

**Solutions:**
- Check allocation filters
- Verify node attributes
- Review shard allocation awareness
- Adjust allocation settings

## Diagnosis

```bash
kubectl exec -it <elasticsearch-pod> -- curl -X GET "localhost:9200/_cat/shards?h=index,shard,prirep,state,unassigned.reason"

kubectl exec -it <elasticsearch-pod> -- curl -X GET "localhost:9200/_cluster/allocation/explain?pretty"

# Check cluster settings
kubectl exec -it <elasticsearch-pod> -- curl -X GET "localhost:9200/_cluster/settings?pretty"
```

## Solutions

### Force Allocation (Use with Caution)

```bash
# Reroute unassigned shards
kubectl exec -it <elasticsearch-pod> -- curl -X POST "localhost:9200/_cluster/reroute?retry_failed=true"
```

### Adjust Disk Watermark

```bash
# Update disk watermark settings
kubectl exec -it <elasticsearch-pod> -- curl -X PUT "localhost:9200/_cluster/settings" -H 'Content-Type: application/json' -d'
{
  "persistent": {
    "cluster.routing.allocation.disk.watermark.low": "85%",
    "cluster.routing.allocation.disk.watermark.high": "90%"
  }
}'
```

## Best Practices

1. **Monitor Shard Status**: Track unassigned shards continuously
2. **Disk Management**: Maintain adequate disk space
3. **Node Health**: Ensure all nodes are healthy
4. **Backup Strategy**: Regular snapshots for recovery
5. **Shard Sizing**: Keep shard sizes reasonable (20-50GB)

## Automated Remediation

AlertMend AI can automatically:
- Detect unassigned shards
- Diagnose root causes
- Free up disk space
- Reroute shards safely
- Scale cluster if needed

## Conclusion

Unassigned shards can impact cluster performance. With proper monitoring and automated remediation, you can maintain cluster health.

---

*Need help with Elasticsearch? [Learn about AlertMend's auto-remediation](/solutions/auto-remediation).*

