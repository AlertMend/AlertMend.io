---
title: "AlertMend: Fix Elasticsearch Yellow Clusters in Kubernetes"
excerpt: "Elasticsearch requires adequate virtual memory to run smoothly. If the system's virtual memory limit is too low, it can cause performance issues and failures."
date: "2025-06-08"
category: "Elasticsearch"
author: "Himanshu Bansal"
---

A yellow cluster status in Elasticsearch indicates that all primary shards are allocated, but replica shards are not. This is common in single-node clusters or when nodes are unavailable.

## Understanding Cluster Status

- **Green**: All shards (primary and replica) are allocated
- **Yellow**: All primary shards are allocated, but some replicas are not
- **Red**: Some primary shards are not allocated

## Common Causes

### 1. Insufficient Nodes

**Symptoms:**
- Yellow status in single-node cluster
- Replicas cannot be allocated

**Solutions:**
- Add more nodes to the cluster
- Reduce replica count temporarily
- Scale StatefulSet to multiple replicas

### 2. Resource Constraints

**Symptoms:**
- Nodes cannot allocate shards
- Memory or disk pressure

**Solutions:**
- Increase node resources
- Free up disk space
- Adjust shard allocation settings

### 3. Node Failures

**Symptoms:**
- Nodes unavailable
- Shards unassigned

**Solutions:**
- Restart failed nodes
- Check node health
- Verify pod status

## Troubleshooting

```bash
kubectl exec -it <elasticsearch-pod> -- curl -X GET "localhost:9200/_cluster/health?pretty"

kubectl exec -it <elasticsearch-pod> -- curl -X GET "localhost:9200/_cat/shards?h=index,shard,prirep,state,unassigned.reason"

# Force shard allocation (use with caution)
kubectl exec -it <elasticsearch-pod> -- curl -X POST "localhost:9200/_cluster/reroute?retry_failed=true"
```

## Prevention

1. **Multi-Node Setup**: Run at least 3 nodes for production
2. **Resource Monitoring**: Track node resources continuously
3. **Shard Management**: Limit shards per node
4. **Index Templates**: Use proper index settings
5. **Regular Health Checks**: Monitor cluster status

## Conclusion

Yellow cluster status is often a warning sign. With proper monitoring and automated remediation, you can prevent it from becoming red.

---

*Need help with Elasticsearch? [Learn about AlertMend's monitoring](/solutions/ai-monitoring).*

