---
title: "Troubleshooting Elasticsearch Unassigned Shards in Kubernetes: Complete Guide"
excerpt: "Complete troubleshooting guide for Elasticsearch unassigned shards in Kubernetes. Learn how to diagnose and fix shard allocation failures caused by disk space, node failures, configuration issues, and memory constraints."
date: "2025-06-05"
category: "Elasticsearch"
author: "Arvind Rajpurohit"
keywords: "Elasticsearch, unassigned shards, Kubernetes, troubleshooting Elasticsearch, cluster health, shard allocation, automated incident remediation, operational efficiency"
---

# Troubleshooting Elasticsearch Unassigned Shards in Kubernetes: Complete Guide

Elasticsearch unassigned shards occur when shards cannot be allocated to nodes in the cluster. This leads to reduced search performance, potential data loss, and cluster instability. Understanding how to diagnose and resolve unassigned shards is crucial for maintaining a healthy Elasticsearch cluster in Kubernetes.

## Understanding Unassigned Shards

Unassigned shards are shards that should be allocated to nodes but aren't. Elasticsearch tries to allocate shards based on:
- Disk space availability
- Memory constraints
- Node health
- Allocation settings
- Cluster routing configuration

### Types of Shards

- **Primary Shards**: Original data shards (one per index)
- **Replica Shards**: Copies of primary shards for redundancy

### Shard States

- **STARTED**: Shard is active and serving requests
- **INITIALIZING**: Shard is being allocated to a node
- **RELOCATING**: Shard is being moved between nodes
- **UNASSIGNED**: Shard cannot be allocated (problem state)

## Diagnostic Workflow

### Step 1: Check Cluster Health

```bash
# Check overall cluster health
kubectl exec -it <elasticsearch-pod> -- curl -X GET "localhost:9200/_cluster/health?pretty"

# Health status meanings:
# GREEN: All shards allocated
# YELLOW: Primary shards allocated, some replicas unassigned
# RED: Some primary shards unassigned (CRITICAL)
```

**Health Status Analysis:**

```json
{
  "cluster_name" : "elasticsearch",
  "status" : "yellow",
  "timed_out" : false,
  "number_of_nodes" : 3,
  "number_of_data_nodes" : 3,
  "active_primary_shards" : 10,
  "active_shards" : 18,
  "relocating_shards" : 0,
  "initializing_shards" : 0,
  "unassigned_shards" : 2,  // Problem indicator
  "delayed_unassigned_shards" : 0,
  "number_of_pending_tasks" : 0,
  "number_of_in_flight_fetch" : 0
}
```

### Step 2: Identify Unassigned Shards

```bash
# List all unassigned shards with reasons
kubectl exec -it <elasticsearch-pod> -- curl -X GET "localhost:9200/_cat/shards?h=index,shard,prirep,state,unassigned.reason,unassigned.details&v" | grep UNASSIGNED

# Detailed shard allocation explanation
kubectl exec -it <elasticsearch-pod> -- curl -X GET "localhost:9200/_cluster/allocation/explain?pretty"
```

**Common Unassigned Reasons:**

- `ALLOCATION_FAILED`: Allocation attempt failed
- `CLUSTER_RECOVERED`: Cluster recovered but shard not allocated
- `DANGLING_INDEX_IMPORTED`: Index imported but shard not allocated
- `EXISTING_INDEX_RESTORED`: Index restored but shard not allocated
- `FORCED_EMPTY_PRIMARY`: Forced empty primary not allocated
- `INDEX_CLOSED`: Index is closed
- `INDEX_CREATED`: Index created but shard not allocated
- `NEW_INDEX_CREATED`: New index created
- `NODE_LEFT`: Node left cluster
- `REINITIALIZED`: Shard reinitialized
- `REPLICA_ADDED`: Replica added but not allocated

### Step 3: Check Node Status

```bash
# List all nodes
kubectl exec -it <elasticsearch-pod> -- curl -X GET "localhost:9200/_cat/nodes?v"

# Check node disk usage
kubectl exec -it <elasticsearch-pod> -- curl -X GET "localhost:9200/_cat/allocation?v"

# Check node stats
kubectl exec -it <elasticsearch-pod> -- curl -X GET "localhost:9200/_nodes/stats?pretty"
```

### Step 4: Check Allocation Explanation

```bash
# Get detailed explanation for unassigned shard
kubectl exec -it <elasticsearch-pod> -- curl -X GET "localhost:9200/_cluster/allocation/explain?pretty" -H 'Content-Type: application/json' -d'
{
  "index": "my-index",
  "shard": 0,
  "primary": true
}'
```

**Example Output:**

```json
{
  "index" : "my-index",
  "shard" : 0,
  "primary" : true,
  "current_state" : "unassigned",
  "unassigned_info" : {
    "reason" : "ALLOCATION_FAILED",
    "at" : "2025-01-15T10:00:00.000Z",
    "details" : "failed shard on node [node-1]: failed to create shard, failure IOException[failed to obtain in-memory shard lock]; nested: ShardLockObtainFailedException[[my-index][0]: obtaining shard lock timed out after 5000ms]",
    "last_allocation_status" : "no"
  },
  "can_allocate" : "no",
  "allocate_explanation" : "cannot allocate because allocation is not permitted to any of the nodes that hold an in-sync shard copy",
  "node_allocation_decisions" : [
    {
      "node_id" : "node-1",
      "node_name" : "elasticsearch-0",
      "transport_address" : "10.0.0.1:9300",
      "node_decision" : "no",
      "weight_ranking" : 1,
      "deciders" : [
        {
          "decider" : "disk_threshold",
          "decision" : "NO",
          "explanation" : "disk watermark [85%] exceeded on [node-1][/var/lib/elasticsearch] free: 10.2%"
        }
      ]
    }
  ]
}
```

## Common Causes and Solutions

### 1. Disk Space Issues

**Symptoms:**
- Error: "disk watermark exceeded"
- Nodes in read-only mode
- Shards cannot be allocated to nodes with low disk

**Diagnosis:**

```bash
# Check disk usage per node
kubectl exec -it <elasticsearch-pod> -- curl -X GET "localhost:9200/_cat/allocation?v"

# Check disk watermarks
kubectl exec -it <elasticsearch-pod> -- curl -X GET "localhost:9200/_cluster/settings?include_defaults=true&filter_path=**.disk*&pretty"
```

**Solutions:**

**Free Up Disk Space:**

```bash
# Delete old indices
kubectl exec -it <elasticsearch-pod> -- curl -X DELETE "localhost:9200/old-index-*"

# Delete old snapshots
kubectl exec -it <elasticsearch-pod> -- curl -X DELETE "localhost:9200/_snapshot/my-repo/snapshot-name"

# Force merge to reduce index size
kubectl exec -it <elasticsearch-pod> -- curl -X POST "localhost:9200/my-index/_forcemerge?max_num_segments=1"

# Clear cache
kubectl exec -it <elasticsearch-pod> -- curl -X POST "localhost:9200/_cache/clear"
```

**Adjust Disk Watermarks (Temporary):**

```bash
# Lower disk watermark thresholds (use carefully)
kubectl exec -it <elasticsearch-pod> -- curl -X PUT "localhost:9200/_cluster/settings" -H 'Content-Type: application/json' -d'
{
  "persistent": {
    "cluster.routing.allocation.disk.watermark.low": "90%",
    "cluster.routing.allocation.disk.watermark.high": "95%",
    "cluster.routing.allocation.disk.watermark.flood_stage": "97%"
  }
}'
```

**Increase Node Disk Size:**

```yaml
# Update StatefulSet to increase volume size
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: elasticsearch
spec:
  volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      resources:
        requests:
          storage: 200Gi  # Increased from 100Gi
```

### 2. Node Failures

**Symptoms:**
- Nodes marked as unavailable
- Primary shards unassigned after node failure
- Cluster health RED

**Diagnosis:**

```bash
# Check node status
kubectl exec -it <elasticsearch-pod> -- curl -X GET "localhost:9200/_cat/nodes?v"

# Check pod status in Kubernetes
kubectl get pods -l app=elasticsearch

# Check node events
kubectl describe pod <elasticsearch-pod>
```

**Solutions:**

**Restart Failed Node:**

```bash
# Restart Elasticsearch pod
kubectl delete pod <elasticsearch-pod>

# Or restart entire StatefulSet
kubectl rollout restart statefulset elasticsearch
```

**Wait for Automatic Recovery:**

If nodes come back online, Elasticsearch will automatically recover shards. Monitor recovery:

```bash
# Watch cluster recovery
watch -n 5 'kubectl exec -it <elasticsearch-pod> -- curl -s "localhost:9200/_cluster/health?pretty"'
```

**Force Allocation (Use with Caution):**

Only use if you're certain the node won't recover and you have replicas:

```bash
# Reroute unassigned shards
kubectl exec -it <elasticsearch-pod> -- curl -X POST "localhost:9200/_cluster/reroute?retry_failed=true" -H 'Content-Type: application/json' -d'
{
  "commands": [
    {
      "allocate_empty_primary": {
        "index": "my-index",
        "shard": 0,
        "node": "target-node-name",
        "accept_data_loss": true
      }
    }
  ]
}'
```

### 3. Allocation Settings

**Symptoms:**
- Shards cannot be allocated
- Allocation explanation shows restrictions
- Node attributes prevent allocation

**Diagnosis:**

```bash
# Check allocation settings
kubectl exec -it <elasticsearch-pod> -- curl -X GET "localhost:9200/_cluster/settings?include_defaults=true&filter_path=**.allocation*&pretty"

# Check node attributes
kubectl exec -it <elasticsearch-pod> -- curl -X GET "localhost:9200/_cat/nodeattrs?v"
```

**Solutions:**

**Disable Allocation Filters (Temporary):**

```bash
# Disable allocation filters
kubectl exec -it <elasticsearch-pod> -- curl -X PUT "localhost:9200/_cluster/settings" -H 'Content-Type: application/json' -d'
{
  "transient": {
    "cluster.routing.allocation.enable": "all"
  }
}'
```

**Adjust Allocation Awareness:**

```bash
# Configure allocation awareness
kubectl exec -it <elasticsearch-pod> -- curl -X PUT "localhost:9200/_cluster/settings" -H 'Content-Type: application/json' -d'
{
  "persistent": {
    "cluster.routing.allocation.awareness.attributes": "zone,rack"
  }
}'
```

**Enable Shard Allocation:**

```bash
# Enable allocation if disabled
kubectl exec -it <elasticsearch-pod> -- curl -X PUT "localhost:9200/_cluster/settings" -H 'Content-Type: application/json' -d'
{
  "persistent": {
    "cluster.routing.allocation.enable": "all"
  }
}'
```

### 4. Memory Pressure

**Symptoms:**
- Nodes cannot allocate shards due to memory
- High JVM heap usage
- GC pressure

**Diagnosis:**

```bash
# Check JVM heap usage
kubectl exec -it <elasticsearch-pod> -- curl -X GET "localhost:9200/_cat/nodes?v&h=name,heap.percent,heap.current,heap.max"

# Check node stats
kubectl exec -it <elasticsearch-pod> -- curl -X GET "localhost:9200/_nodes/stats/jvm?pretty"
```

**Solutions:**

**Increase Heap Size:**

```yaml
# Update Elasticsearch configuration
apiVersion: v1
kind: ConfigMap
metadata:
  name: elasticsearch-config
data:
  elasticsearch.yml: |
    -Xms4g
    -Xmx4g
```

**Reduce Shard Count:**

```bash
# Reduce number of replicas
kubectl exec -it <elasticsearch-pod> -- curl -X PUT "localhost:9200/my-index/_settings" -H 'Content-Type: application/json' -d'
{
  "index.number_of_replicas": 1
}'
```

### 5. Too Many Shards

**Symptoms:**
- High shard count per node
- Allocation failures
- Cluster instability

**Diagnosis:**

```bash
# Count shards per node
kubectl exec -it <elasticsearch-pod> -- curl -X GET "localhost:9200/_cat/allocation?v"

# List all indices with shard counts
kubectl exec -it <elasticsearch-pod> -- curl -X GET "localhost:9200/_cat/indices?v&h=index,pri,rep,docs.count,store.size"
```

**Solutions:**

**Reduce Replica Count:**

```bash
# Reduce replicas for all indices
kubectl exec -it <elasticsearch-pod> -- curl -X PUT "localhost:9200/_all/_settings" -H 'Content-Type: application/json' -d'
{
  "index.number_of_replicas": 1
}'
```

**Delete Unused Indices:**

```bash
# List old indices
kubectl exec -it <elasticsearch-pod> -- curl -X GET "localhost:9200/_cat/indices?v&s=creation.date"

# Delete old indices
kubectl exec -it <elasticsearch-pod> -- curl -X DELETE "localhost:9200/old-index-*"
```

**Shrink Indices:**

```bash
# Shrink index to reduce shard count
kubectl exec -it <elasticsearch-pod> -- curl -X PUT "localhost:9200/my-index/_settings" -H 'Content-Type: application/json' -d'
{
  "settings": {
    "index.number_of_shards": 1,
    "index.routing.allocation.require._name": "shrink-node"
  }
}'

# Then shrink
kubectl exec -it <elasticsearch-pod> -- curl -X POST "localhost:9200/my-index/_shrink/my-index-shrunk"
```

## Advanced Troubleshooting

### Force Allocation of Unassigned Shards

**⚠️ Use with extreme caution - can cause data loss**

```bash
# Force allocate primary shard (accepts data loss)
kubectl exec -it <elasticsearch-pod> -- curl -X POST "localhost:9200/_cluster/reroute" -H 'Content-Type: application/json' -d'
{
  "commands": [
    {
      "allocate_empty_primary": {
        "index": "my-index",
        "shard": 0,
        "node": "target-node-name",
        "accept_data_loss": true
      }
    }
  ]
}'

# Move shard to specific node
kubectl exec -it <elasticsearch-pod> -- curl -X POST "localhost:9200/_cluster/reroute" -H 'Content-Type: application/json' -d'
{
  "commands": [
    {
      "move": {
        "index": "my-index",
        "shard": 0,
        "from_node": "source-node",
        "to_node": "target-node"
      }
    }
  ]
}'
```

### Retry Failed Allocations

```bash
# Retry failed shard allocations
kubectl exec -it <elasticsearch-pod> -- curl -X POST "localhost:9200/_cluster/reroute?retry_failed=true"
```

### Cancel Ongoing Allocation

```bash
# Cancel shard allocation
kubectl exec -it <elasticsearch-pod> -- curl -X POST "localhost:9200/_cluster/reroute" -H 'Content-Type: application/json' -d'
{
  "commands": [
    {
      "cancel": {
        "index": "my-index",
        "shard": 0,
        "node": "node-name"
      }
    }
  ]
}'
```

## Prevention Best Practices

### 1. Monitor Cluster Health

```bash
# Continuous health monitoring
watch -n 30 'kubectl exec -it <elasticsearch-pod> -- curl -s "localhost:9200/_cluster/health?pretty"'

# Set up alerts for:
# - Cluster status RED
# - Unassigned shards > 0
# - Node failures
```

### 2. Maintain Adequate Disk Space

```yaml
# Configure disk watermarks appropriately
apiVersion: v1
kind: ConfigMap
metadata:
  name: elasticsearch-config
data:
  elasticsearch.yml: |
    cluster.routing.allocation.disk.watermark.low: 85%
    cluster.routing.allocation.disk.watermark.high: 90%
    cluster.routing.allocation.disk.watermark.flood_stage: 95%
```

### 3. Set Appropriate Shard Sizes

- Keep shard sizes between 20-50GB
- Monitor shard count per node (aim for < 20 shards per GB heap)
- Use index lifecycle management (ILM) to manage shard count

### 4. Regular Snapshots

```bash
# Create repository
kubectl exec -it <elasticsearch-pod> -- curl -X PUT "localhost:9200/_snapshot/my-backup" -H 'Content-Type: application/json' -d'
{
  "type": "s3",
  "settings": {
    "bucket": "my-elasticsearch-backups"
  }
}'

# Create snapshot
kubectl exec -it <elasticsearch-pod> -- curl -X PUT "localhost:9200/_snapshot/my-backup/snapshot-1?wait_for_completion=true"
```

### 5. Index Lifecycle Management (ILM)

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
      },
      "delete": {
        "min_age": "90d",
        "actions": {
          "delete": {}
        }
      }
    }
  }
}'
```

## Monitoring and Alerting

### Key Metrics to Monitor

- Unassigned shard count
- Cluster health status
- Disk usage per node
- JVM heap usage
- Shard allocation rate
- Node count and health

### Prometheus Queries

```promql
# Unassigned shards
elasticsearch_cluster_health_unassigned_shards

# Cluster status (0=green, 1=yellow, 2=red)
elasticsearch_cluster_health_status

# Disk usage percentage
elasticsearch_filesystem_data_used_percent

# JVM heap usage
elasticsearch_jvm_memory_used_bytes{area="heap"} / elasticsearch_jvm_memory_max_bytes{area="heap"}
```

## Automated Detection and Remediation

AlertMend AI can automatically:

- **Detect Unassigned Shards**: Monitor cluster health and identify unassigned shards
- **Diagnose Root Causes**: Analyze allocation explanations to identify specific issues
- **Automated Remediation**: Free up disk space, adjust watermarks, or reroute shards when safe
- **Prevent Issues**: Monitor disk usage and alert before watermarks are exceeded
- **Optimize Allocation**: Suggest shard allocation improvements

### Integration Example

```yaml
# AlertMend monitors:
- Cluster health status
- Unassigned shard count
- Disk usage per node
- Allocation failures
- Node health
- Shard distribution
```

## Conclusion

Unassigned shards in Elasticsearch can significantly impact cluster performance and availability. By understanding the common causes (disk space, node failures, allocation settings, memory pressure), following a systematic diagnostic approach, and implementing preventive measures, you can maintain a healthy Elasticsearch cluster. Regular monitoring, proper disk management, appropriate shard sizing, and automated remediation help prevent and quickly resolve unassigned shard issues.

Implementing automated monitoring and remediation with AlertMend AI helps ensure your Elasticsearch cluster remains healthy and performant.

---

*Need help with Elasticsearch troubleshooting? [Learn about AlertMend's auto-remediation](/solutions/auto-remediation).*
