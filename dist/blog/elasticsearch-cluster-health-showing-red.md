---
title: "Elasticsearch Cluster Health Showing Red"
excerpt: "A 502 Bad Gateway error is a common issue that users face when working with Kubernetes, especially when dealing with services and load balancers."
date: "2025-02-4"
category: "Elasticsearch"
author: "Arvind Rajpurohit"
keywords: "Elasticsearch, AlertMend AI, Kubernetes, search engine, log management, data analytics, cluster management, performance optimization"
---

# 🚨 **Elasticsearch Cluster Health Showing Red: Causes, Troubleshooting, and Solutions**
---

When your **Elasticsearch cluster health status** turns **red**, it indicates critical issues that must be addressed immediately. A red health status means some primary shards are unassigned, which could cause data loss or make your cluster unstable. This guide will help you understand the causes of a red cluster health status, how to troubleshoot the issues, and what steps to take to restore your cluster’s functionality.

---

## 🔍 **What Causes a Red Cluster Health Status?**

Several factors can lead to a red cluster health status in Elasticsearch:
- **Unassigned Shards**: One of the most common reasons for red cluster health is that primary shards remain unassigned.
- **Node Failures**: If one or more nodes in the cluster fail, the cluster may turn red, especially if those nodes contain primary shards.
- **Disk Space Issues**: Insufficient disk space on nodes can prevent shards from being allocated properly.
- **Network Failures**: Poor network connectivity between nodes can disrupt data replication or recovery.
- **Corrupted Indices**: Software bugs or misconfiguration may cause index corruption, affecting shard assignment.

---

## 🛠️ **How to Troubleshoot Elasticsearch Red Cluster Health**

### 1. **Check Elasticsearch Service Status**
Ensure that the Elasticsearch service is up and running:
```bash
sudo systemctl status elasticsearch
```
If the service is down, try restarting it:
```bash
sudo systemctl restart elasticsearch
```

### 2. **Check Cluster Health**
Start by checking the current health of the cluster to get a high-level view:
```bash
curl -X GET ${ELASTICSEARCH_URL}/_cluster/health
```
This will return the overall health, unassigned shards, and node availability. Investigate further if the status is red or yellow.

### 3. **Inspect Shard Allocation**
Check for any unassigned shards that could be causing the red health status:
```bash
curl -X GET ${ELASTICSEARCH_URL}/_cluster/allocation/explain?pretty
```
This command will explain why the shards are not allocated and suggest potential fixes. Ensure that any node failure, storage issue, or allocation settings are correctly managed.

### 4. **Check Node Status and Logs**
Ensure that all nodes are active and communicating:
```bash
curl -X GET ${ELASTICSEARCH_URL}/_cat/nodes?v
```
Investigate the logs for any errors, particularly focusing on memory, disk, or network failures:
```bash
sudo grep -i "error" ${ELASTICSEARCH_LOG_FILE_PATH}
```
Check for entries related to memory pressure, disk space issues, or unresponsive nodes.

### 5. **Check Disk Usage and Free Up Space**
Check the disk usage on all nodes to ensure that there is sufficient space for shard allocation:
```bash
df -h ${ELASTICSEARCH_DATA_DIRECTORY}
```
Free up space, delete old indices using **Elasticsearch Curator**, or add additional storage if necessary. Also, verify that **node-level disk watermarks** are properly configured to prevent future disk-related issues:
```bash
curl -X PUT ${ELASTICSEARCH_URL}/_cluster/settings -H 'Content-Type: application/json' -d'
{
  "persistent": {
    "cluster.routing.allocation.disk.watermark.low": "85%",
    "cluster.routing.allocation.disk.watermark.high": "90%",
    "cluster.routing.allocation.disk.watermark.flood_stage": "95%"
  }
}'
```

### 6. **Investigate Shard Reallocation and Recovery**
If the primary shards are unassigned due to node failure or disk space issues, you can trigger shard reallocation:
```bash
curl -X POST ${ELASTICSEARCH_URL}/_cluster/reroute?retry_failed
```
This command forces Elasticsearch to reassign unallocated shards. Additionally, check the current allocation settings:
```bash
curl -X GET ${ELASTICSEARCH_URL}/_cluster/settings
```
This will help you confirm that the allocation rules are configured correctly.

---

## 🛡️ **Best Practices for Preventing Red Cluster Health in Elasticsearch**

### 1. **Monitor Disk Space and Node Health**
Ensure that you have real-time monitoring of disk space, node health, and memory usage using tools like **Prometheus** and **Grafana**. Set alerts to prevent disk exhaustion. Regularly monitor **node-to-node communication** and **network latency** as these can lead to cluster-wide issues.

### 2. **Use Replication for Data Redundancy**
Always configure your cluster with sufficient replication. This way, if a node fails, the replica shards can take over:
```yaml
index.number_of_replicas: 1
```
Ensure your system has sufficient resources to accommodate both primary and replica shards.

### 3. **Use Curator for Index Management**
Use the **Elasticsearch Curator** to manage indices and delete older data to prevent overloading storage:
```bash
curator_cli delete_indices --filter_list '{"filtertype":"age","source":"creation_date","direction":"older","unit":"days","unit_count":30}'
```

### 4. **Increase Cluster Resilience by Scaling Nodes**
Add more nodes to the cluster to distribute the load and reduce the risk of primary shards becoming unavailable due to node failure. Adjust **recovery and allocation settings** for improved resilience:
```bash
curl -X PUT ${ELASTICSEARCH_URL}/_cluster/settings -H 'Content-Type: application/json' -d'
{
  "persistent": {
    "cluster.routing.allocation.node_concurrent_recoveries": 5
  }
}'
```
This helps the cluster recover faster during shard reallocation after node failure.

### 5. **Shard Management and Optimal Resource Allocation**
Optimize the number of shards per index based on your node resources. Avoid oversharding as it increases overhead. Use a balanced number of **primary and replica shards**:
```bash
curl -X PUT "${ELASTICSEARCH_URL}/<index-name>/_settings" -H 'Content-Type: application/json' -d'
{
  "index" : {
    "number_of_shards" : 3,
    "number_of_replicas" : 2
  }
}'
```
Also, regularly monitor and adjust the **refresh interval** for high-throughput clusters.

---

## 🔄 **Common Issues and Fixes for Red Cluster Health**

| **Issue**                              | **Cause**                                    | **Solution**                                      |
|----------------------------------------|----------------------------------------------|---------------------------------------------------|
| Unassigned primary shards               | Node failure or insufficient resources       | Check node health, free up disk space, and reroute |
| Disk space exhaustion                   | Full disk on a node                          | Add more disk space or clean up old indices       |
| Cluster health red after node restart   | Shards failed to reallocate                  | Use `reroute` command to reassign shards          |
| Network issues between nodes            | Network latency or disconnection             | Resolve network issues, monitor node-to-node connectivity, and restart affected nodes  |

---

## 🚀 **Conclusion**

A red cluster health status in Elasticsearch indicates severe issues that need immediate attention to avoid data loss or service disruption. By following the troubleshooting steps outlined in this guide and applying best practices like monitoring, shard management, and disk space management, you can quickly resolve these issues and maintain a healthy Elasticsearch cluster. Regular monitoring and proactive node management are crucial for preventing critical health issues in Elasticsearch.
