---
title: "Unhealthy Elasticsearch Nodes on Kubernetes"
excerpt: "Explore the causes of unhealthy Elasticsearch nodes and learn how to address them within a Kubernetes environment to maintain cluster stability."
date: "2025-05-18"
category: "Elasticsearch"
author: "Himanshu Bansal"
keywords: "Elasticsearch, Kubernetes, incident remediation, troubleshooting Elasticsearch, unhealthy nodes, cluster stability, automated incident management, diagnosing Elasticsearch issues"
---

Elasticsearch nodes can become unhealthy in Kubernetes due to various reasons. Here's how to diagnose and fix common issues.

## Common Causes

### 1. Resource Constraints

**Symptoms:**
- Nodes marked as unhealthy
- High memory usage
- CPU throttling

**Solutions:**
- Increase memory limits
- Adjust JVM heap size
- Scale up nodes
- Optimize Elasticsearch configuration

### 2. Disk Space Issues

**Symptoms:**
- Disk usage warnings
- Nodes going read-only
- Shard allocation failures

**Solutions:**
- Clean up old indices
- Increase disk size
- Implement index lifecycle management
- Monitor disk usage

### 3. Network Connectivity

**Symptoms:**
- Nodes cannot communicate
- Cluster split-brain scenarios
- Discovery failures

**Solutions:**
- Check network policies
- Verify service endpoints
- Test pod-to-pod connectivity
- Review DNS configuration

## Diagnosis Steps

```bash
kubectl exec -it <elasticsearch-pod> -- curl -X GET "localhost:9200/_cluster/health?pretty"

kubectl exec -it <elasticsearch-pod> -- curl -X GET "localhost:9200/_cat/nodes?v"

# View Elasticsearch logs
kubectl logs <elasticsearch-pod>
```

## Best Practices

1. **Resource Management**: Set appropriate requests and limits
2. **Monitoring**: Track cluster health continuously
3. **Backup Strategy**: Regular snapshots of indices
4. **Index Management**: Implement ILM policies
5. **Network Configuration**: Ensure proper connectivity

## Conclusion

Unhealthy Elasticsearch nodes require systematic troubleshooting. AlertMend AI can help monitor and automatically remediate common issues.

---

*Need help with Elasticsearch on Kubernetes? [Book a demo](/contact) to see AlertMend in action.*

