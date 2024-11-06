
# 🚨 **Kubernetes Evicted Pods: Causes, Troubleshooting, and Best Practices**
![Kubernetes Evicted Pods](https://github.com/AlertMend/AlertMend.io/blob/main/blogs/images/evicted_pods.png?raw=true)

In Kubernetes, **evicted pods** occur when the node running the pods cannot meet their resource demands, leading to pod eviction as a result of resource pressure. Pod eviction is an automatic action taken by Kubernetes to free up resources on a node when it's running low on essential resources like memory, disk, or CPU. Pod evictions can have serious real-world impacts, including degraded application performance or service outages. This blog will guide you through the causes of pod eviction, how to troub...

---

## 🔍 **What are Kubernetes Evicted Pods?**

**Evicted pods** are pods that Kubernetes forcibly terminates when a node encounters resource constraints. When resources on a node become insufficient, Kubernetes evicts running pods to reclaim resources, ensuring the node remains operational.

### Common Causes of Eviction:
- **Memory pressure**: The node is running out of memory, and Kubernetes evicts pods to prevent the node from crashing.
- **Disk pressure**: Insufficient disk space forces Kubernetes to evict pods to maintain node performance.
- **Node resource limits**: When the node exceeds its CPU or memory limits, pods are evicted to alleviate the pressure.
- **Node taints**: When a node is tainted to repel certain pods that do not tolerate that taint.

---

## 🛠️ **Why Kubernetes Pods Get Evicted: Common Causes and Fixes**

### 1. **Memory Pressure**
Pods are evicted when the node experiences **memory pressure**. Kubernetes evicts low-priority or unprotected pods to reclaim memory for essential system processes. Adjusting memory limits or scaling nodes can help prevent these evictions.

### 2. **Disk Pressure**
Pods are evicted when there is **disk pressure** on a node. Insufficient disk space can prevent logging, cache storage, and essential operations from functioning, leading to pod evictions.

### 3. **CPU Exhaustion**
When a node’s CPU resources are overutilized, Kubernetes evicts pods to reduce the load. Ensuring proper CPU limits and scaling nodes can prevent this.

### 4. **Node Taints**
Pods may be evicted due to **node taints**. Nodes can be labeled with taints that repel certain pods unless they have tolerations configured.

### 5. **Priority and Preemption**
In clusters that use the **Pod Priority and Preemption** feature, Kubernetes may evict low-priority pods to make room for high-priority pods when resources are constrained.

---

## 🛠️ **Troubleshooting Kubernetes Evicted Pods**

### 1. **Check Pod Status**
Start by describing the evicted pod to get detailed information about why it was evicted:
```bash
kubectl describe pod <pod-name> -n <namespace>
```
In the output, look for reasons like `MemoryPressure`, `DiskPressure`, or `Evicted` under the status section. This will give you insights into the cause of the eviction.

### 2. **Check Node Conditions**
Inspect the node where the pod was evicted to identify resource pressures such as memory, CPU, or disk shortages:
```bash
kubectl describe node <node-name>
```
Review the node’s conditions, including `MemoryPressure`, `DiskPressure`, or `OutOfDisk`, to determine why the pod was evicted.

### 3. **Monitor Resource Usage**
Use **kubectl top** to check the resource usage of nodes and pods. This will help you identify if resource exhaustion led to the eviction:
```bash
kubectl top nodes
kubectl top pods --all-namespaces
```
Look for high CPU or memory usage that could have triggered pod eviction. Set alerts using Prometheus and Grafana to monitor these metrics.

### 4. **Check Eviction Thresholds**
Review the eviction thresholds configured for the nodes. This can be found in the kubelet configuration file, where thresholds for memory, disk, and inode usage are defined:
```bash
cat /var/lib/kubelet/config.yaml | grep eviction
```
For example, thresholds like `memory.available` or `nodefs.available` define when Kubernetes starts evicting pods. Adjusting these thresholds based on your cluster needs can help reduce evictions.

---

## 🛡️ **Best Practices to Avoid Kubernetes Pod Evictions**

### 1. **Set Appropriate Resource Requests and Limits**
Ensure that all pods have resource requests and limits defined for **CPU** and **memory**. This helps Kubernetes schedule pods more effectively and reduces the chance of resource overcommitment.

```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "200m"
  limits:
    memory: "512Mi"
    cpu: "400m"
```

### 2. **Use Node Affinity and Taints**
Use **Node Affinity** and **Taints and Tolerations** to ensure that pods are placed on appropriate nodes based on resource availability, preventing evictions due to resource constraints.

### 3. **Implement Pod Priority**
Leverage **Pod Priority and Preemption** to prioritize critical workloads. This ensures that low-priority pods are evicted before high-priority ones in case of resource shortages.

### 4. **Monitor Resource Utilization**
Use monitoring tools like **Prometheus** and **Grafana** to track resource utilization in real time. Set alerts for memory, CPU, and disk usage to detect resource bottlenecks before they result in pod evictions.

### 5. **Node Autoscaling**
Use **Cluster Autoscaler** to automatically scale the number of nodes in your cluster when resource limits are reached. This helps prevent evictions by ensuring sufficient capacity is always available.

### 6. **Use Vertical Pod Autoscaling (VPA)**
Implement **Vertical Pod Autoscaler (VPA)** to dynamically adjust a pod’s CPU and memory requests based on actual usage. VPA helps prevent resource exhaustion that leads to pod evictions.

---

## 🔄 **Common Issues and Fixes for Evicted Pods**

| **Issue**                             | **Cause**                                   | **Solution** |
|---------------------------------------|---------------------------------------------|--------------|
| Memory pressure eviction              | Node running out of memory                  | Adjust pod memory requests/limits, scale out nodes |
| Disk pressure eviction                | Insufficient disk space on node             | Increase node disk size or optimize disk usage |
| CPU resource exhaustion               | Node CPU overutilized                       | Scale up CPU resources or reduce pod CPU limits |
| Eviction due to node taints           | Node tainted to repel specific pods         | Ensure tolerations are configured for necessary pods |

---

## 🚀 **Conclusion**

Evicted pods in Kubernetes can disrupt workloads and reduce overall application availability. However, by understanding the common causes of pod evictions and following the best practices outlined in this guide, you can minimize the occurrence of evictions and ensure that your cluster resources are managed efficiently. Proper resource allocation, node autoscaling, vertical pod autoscaling, and proactive monitoring are critical to preventing pod evictions and keeping your applications running smoothly.
