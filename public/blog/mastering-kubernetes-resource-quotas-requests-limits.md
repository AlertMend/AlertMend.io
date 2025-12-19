---
title: "Kubernetes Resource Quotas Guide"
excerpt: "Complete guide to Kubernetes resource management including requests, limits, and resource quotas. Learn how to optimize allocation and reduce costs."
date: "2025-05-21"
category: "Kubernetes"
author: "Himanshu Bansal"
keywords: "Kubernetes resources, resource requests, resource limits, resource quotas, CPU throttling, memory limits, resource optimization, cost optimization, AlertMend AI"
---

# Kubernetes Resource Quotas Guide

Proper resource management is crucial for Kubernetes cluster performance, stability, and cost optimization. Understanding how to set resource requests, limits, and quotas helps ensure applications get the resources they need while preventing resource exhaustion and controlling costs.

## Understanding Kubernetes Resources

Kubernetes manages two types of compute resources:
- **CPU**: Measured in cores (1000m = 1 core)
- **Memory**: Measured in bytes (Mi, Gi, etc.)

For each resource, you can specify:
- **Requests**: Guaranteed minimum resources
- **Limits**: Maximum allowed resources

## Resource Requests

### What Are Requests?

Resource requests specify the minimum amount of CPU or memory that a container needs. Kubernetes uses requests for:
- **Scheduling decisions**: Pods are only scheduled on nodes with sufficient resources
- **Resource allocation**: Guaranteed minimum resources for the container
- **Quality of Service (QoS) classification**: Determines pod priority during resource contention

### CPU Requests

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-app
spec:
  containers:
  - name: app
    image: nginx:latest
    resources:
      requests:
        cpu: "500m"  # 0.5 cores (500 millicores)
        # cpu: "1"     # 1 full core
        # cpu: "2.5"   # 2.5 cores
```

**CPU Units:**
- `1` = 1 CPU core
- `1000m` = 1 CPU core (1000 millicores)
- `500m` = 0.5 CPU cores
- `0.5` = 0.5 CPU cores (equivalent to 500m)

### Memory Requests

```yaml
resources:
  requests:
    memory: "512Mi"   # 512 Mebibytes
    # memory: "1Gi"   # 1 Gibibyte (1024 Mi)
    # memory: "2G"    # 2 Gigabytes (decimal)
    # memory: "1000M" # 1000 Megabytes
```

**Memory Units:**
- `Mi` = Mebibyte (1024^2 bytes)
- `Gi` = Gibibyte (1024^3 bytes)
- `M` = Megabyte (1000^2 bytes)
- `G` = Gigabyte (1000^3 bytes)

**Best Practice**: Use binary units (Mi, Gi) for consistency with Kubernetes defaults.

### How Requests Work

1. **Scheduling**: Kubernetes scheduler ensures node has enough resources before scheduling
2. **Allocation**: Container is guaranteed at least the requested amount
3. **Burstable Usage**: Container can use more if available, up to limits

## Resource Limits

### What Are Limits?

Resource limits specify the maximum amount of CPU or memory a container can use. Exceeding limits causes:
- **CPU**: Throttling (CPU usage is capped)
- **Memory**: Pod termination (OOMKilled)

### CPU Limits

```yaml
resources:
  limits:
    cpu: "1000m"  # Maximum 1 core
```

**CPU Throttling:**
- When a container exceeds CPU limit, it's throttled
- Throttling means the container gets less CPU time
- Application performance degrades but container continues running

**Monitoring CPU Throttling:**

```bash
# Check for throttling in pod metrics
kubectl top pod <pod-name>

# View detailed CPU metrics
kubectl get --raw /api/v1/namespaces/default/pods/<pod-name>/proxy/metrics | grep cpu
```

### Memory Limits

```yaml
resources:
  limits:
    memory: "1Gi"  # Maximum 1 Gibibyte
```

**Memory Limits Behavior:**
- Container can use up to the limit
- Exceeding limit causes OOMKilled (Out Of Memory killed)
- Pod is terminated and restarted based on restart policy

**Check for OOMKills:**

```bash
# Check pod events for OOMKilled
kubectl describe pod <pod-name> | grep -i oom

# Check pod status
kubectl get pod <pod-name> -o jsonpath='{.status.containerStatuses[0].lastState.terminated.reason}'

# List all OOMKilled pods
kubectl get pods --all-namespaces --field-selector=status.phase=Failed -o json | \
  jq '.items[] | select(.status.containerStatuses[].lastState.terminated.reason=="OOMKilled")'
```

### Complete Resource Specification

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-app
spec:
  containers:
  - name: app
    image: nginx:latest
    resources:
      requests:
        cpu: "250m"      # Minimum guaranteed CPU
        memory: "256Mi"  # Minimum guaranteed memory
      limits:
        cpu: "500m"      # Maximum CPU (will throttle if exceeded)
        memory: "512Mi"  # Maximum memory (will be killed if exceeded)
```

## Quality of Service (QoS) Classes

Kubernetes assigns pods to QoS classes based on resource specifications:

### 1. Guaranteed

**Requirements:**
- All containers have CPU and memory requests and limits
- Requests equal limits for all containers

```yaml
resources:
  requests:
    cpu: "500m"
    memory: "512Mi"
  limits:
    cpu: "500m"      # Same as request
    memory: "512Mi"  # Same as request
```

**Characteristics:**
- Highest priority
- Cannot be evicted unless node is out of resources
- Guaranteed resources are always available

### 2. Burstable

**Requirements:**
- At least one container has CPU or memory request
- Requests don't equal limits (or limits not set)

```yaml
resources:
  requests:
    cpu: "250m"
    memory: "256Mi"
  limits:
    cpu: "1000m"     # Higher than request
    memory: "1Gi"    # Higher than request
```

**Characteristics:**
- Medium priority
- Can be evicted if node runs out of resources
- Can use resources beyond requests when available

### 3. BestEffort

**Requirements:**
- No containers have CPU or memory requests or limits

```yaml
# No resources specified
containers:
- name: app
  image: nginx:latest
```

**Characteristics:**
- Lowest priority
- First to be evicted during resource contention
- Can use any available resources

**Eviction Order:**
1. BestEffort pods (evicted first)
2. Burstable pods (evicted if needed)
3. Guaranteed pods (evicted last)

## Resource Quotas

### What Are Resource Quotas?

Resource quotas limit resource consumption per namespace. They help:
- Prevent resource exhaustion
- Control costs
- Enforce resource allocation policies
- Ensure fair resource distribution

### Creating Resource Quotas

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-quota
  namespace: production
spec:
  hard:
    # CPU and Memory
    requests.cpu: "10"           # Total CPU requests
    requests.memory: 20Gi        # Total memory requests
    limits.cpu: "20"             # Total CPU limits
    limits.memory: 40Gi          # Total memory limits
    
    # Object counts
    pods: "10"                   # Maximum pods
    persistentvolumeclaims: "10" # Maximum PVCs
    services: "5"                # Maximum services
    
    # Storage
    requests.storage: 100Gi      # Total storage requests
    
    # Extended resources (if configured)
    # nvidia.com/gpu: "4"
```

### Quota Scopes

Quotas can be scoped to specific pod states:

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: quota-scoped
spec:
  hard:
    pods: "10"
    requests.cpu: "10"
  scopes:
  - BestEffort      # Only count BestEffort pods
  # - NotBestEffort # Count all except BestEffort
  # - Terminating   # Count pods in Terminating state
  # - NotTerminating # Count pods not terminating
  # - PriorityClass # Count pods with specific priority class
```

### Checking Quota Usage

```bash
# List quotas in namespace
kubectl get resourcequota -n production

# Describe quota to see usage
kubectl describe resourcequota compute-quota -n production

# Output shows:
# Name:            compute-quota
# Namespace:       production
# Resource         Used  Hard
# --------         ----  ----
# limits.cpu       5     20
# limits.memory    10Gi  40Gi
# requests.cpu     3     10
# requests.memory  5Gi   20Gi
```

### Common Quota Errors

**Error: "exceeded quota"**

```bash
# Check which resource is exhausted
kubectl describe resourcequota <quota-name> -n <namespace>

# Solution: Increase quota or reduce resource usage
kubectl edit resourcequota <quota-name> -n <namespace>
```

## Limit Ranges

Limit ranges set default, min, and max resource constraints for pods in a namespace.

### Creating Limit Ranges

```yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: mem-limit-range
  namespace: production
spec:
  limits:
  - default:           # Default limits if not specified
      memory: "512Mi"
      cpu: "500m"
    defaultRequest:    # Default requests if not specified
      memory: "256Mi"
      cpu: "250m"
    max:               # Maximum allowed
      memory: "2Gi"
      cpu: "2000m"
    min:               # Minimum required
      memory: "128Mi"
      cpu: "100m"
    type: Container
```

**Benefits:**
- Enforces resource specifications
- Provides defaults for pods without resources
- Prevents resource abuse
- Ensures minimum resource allocation

## Best Practices

### 1. Always Set Requests

```yaml
# Good: Set requests for proper scheduling
resources:
  requests:
    cpu: "250m"
    memory: "256Mi"

# Bad: No requests makes scheduling unpredictable
# resources: {}
```

**Why:**
- Enables proper scheduling decisions
- Prevents resource contention
- Helps with capacity planning

### 2. Set Realistic Limits

```yaml
# Good: Limits are 2-3x requests
resources:
  requests:
    cpu: "250m"
    memory: "256Mi"
  limits:
    cpu: "500m"      # 2x request
    memory: "512Mi"  # 2x request

# Bad: Limits too close to requests (no burst capacity)
resources:
  requests:
    cpu: "500m"
    memory: "512Mi"
  limits:
    cpu: "510m"      # Too close to request
    memory: "520Mi"  # Too close to request
```

### 3. Monitor and Right-Size

**Collect Baseline Metrics:**

```bash
# Monitor resource usage over time
kubectl top pods --all-namespaces

# Use metrics-server API for historical data
kubectl get --raw /apis/metrics.k8s.io/v1beta1/namespaces/default/pods
```

**Analyze Usage Patterns:**

```promql
# Average CPU usage
avg(rate(container_cpu_usage_seconds_total[5m])) by (pod)

# Average memory usage
avg(container_memory_working_set_bytes) by (pod)

# CPU throttling
rate(container_cpu_cfs_throttled_seconds_total[5m])
```

**Right-Size Based on Data:**

```yaml
# Adjust resources based on actual usage
# If average CPU usage is 200m, set request to 250m
# If P95 CPU usage is 400m, set limit to 500m
resources:
  requests:
    cpu: "250m"      # Slightly above average
    memory: "256Mi"
  limits:
    cpu: "500m"      # Based on P95/P99 usage
    memory: "512Mi"
```

### 4. Use Vertical Pod Autoscaler (VPA)

VPA automatically adjusts pod resource requests and limits based on usage:

```yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: my-app-vpa
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-app
  updatePolicy:
    updateMode: "Auto"  # or "Initial", "Off", "Recreate"
  resourcePolicy:
    containerPolicies:
    - containerName: app
      minAllowed:
        cpu: 100m
        memory: 128Mi
      maxAllowed:
        cpu: 2
        memory: 4Gi
```

### 5. Set Namespace Quotas

```yaml
# Enforce quotas per namespace
apiVersion: v1
kind: ResourceQuota
metadata:
  name: team-quota
  namespace: team-a
spec:
  hard:
    requests.cpu: "10"
    requests.memory: 20Gi
    limits.cpu: "20"
    limits.memory: 40Gi
    pods: "50"
```

### 6. Use Limit Ranges for Defaults

```yaml
# Set sensible defaults for namespace
apiVersion: v1
kind: LimitRange
metadata:
  name: default-limits
spec:
  limits:
  - default:
      cpu: "500m"
      memory: "512Mi"
    defaultRequest:
      cpu: "250m"
      memory: "256Mi"
    type: Container
```

## Common Issues and Solutions

### Issue 1: Pods Pending - Insufficient Resources

**Symptoms:**
- Pods stuck in Pending state
- Error: "0/X nodes are available: X Insufficient cpu, X Insufficient memory"

**Diagnosis:**

```bash
# Check node resources
kubectl describe node <node-name>

# Check pod scheduling events
kubectl describe pod <pod-name> | grep -A 10 "Events"

# Check cluster capacity
kubectl top nodes
```

**Solutions:**

1. **Reduce Resource Requests:**
   ```yaml
   # Lower requests to fit available resources
   resources:
     requests:
       cpu: "100m"      # Reduced from 500m
       memory: "128Mi"  # Reduced from 512Mi
   ```

2. **Add More Nodes:**
   ```bash
   # Scale cluster (cloud provider specific)
   # AWS EKS: Update node group desired capacity
   # GKE: Resize node pool
   ```

3. **Free Up Resources:**
   ```bash
   # Delete unused pods
   kubectl delete pod <unused-pod>
   
   # Scale down other deployments
   kubectl scale deployment <deployment> --replicas=2
   ```

### Issue 2: CPU Throttling

**Symptoms:**
- Application performance degradation
- High CPU usage but application feels slow
- Metrics show throttling

**Diagnosis:**

```bash
# Check for CPU throttling
kubectl top pod <pod-name>

# View detailed CPU metrics
kubectl get --raw /api/v1/namespaces/default/pods/<pod-name>/proxy/metrics | grep cpu
```

**Solutions:**

1. **Increase CPU Limit:**
   ```yaml
   resources:
     limits:
       cpu: "2000m"  # Increased from 1000m
   ```

2. **Optimize Application:**
   - Profile application to identify CPU hotspots
   - Optimize algorithms
   - Reduce unnecessary processing

### Issue 3: OOMKilled Pods

**Symptoms:**
- Pods restarting frequently
- Exit code 137
- Error: "OOMKilled" in pod events

**Diagnosis:**

```bash
# Check for OOMKilled
kubectl describe pod <pod-name> | grep -i oom

# Check memory usage before kill
kubectl get pod <pod-name> -o jsonpath='{.status.containerStatuses[0].lastState.terminated}'
```

**Solutions:**

1. **Increase Memory Limit:**
   ```yaml
   resources:
     limits:
       memory: "2Gi"  # Increased from 1Gi
   ```

2. **Fix Memory Leaks:**
   - Profile application memory usage
   - Identify and fix leaks
   - Optimize data structures

3. **Add Memory Requests:**
   ```yaml
   resources:
     requests:
       memory: "1Gi"  # Ensures sufficient memory allocation
     limits:
       memory: "2Gi"
   ```

### Issue 4: Resource Quota Exceeded

**Symptoms:**
- Cannot create new pods
- Error: "exceeded quota"

**Diagnosis:**

```bash
# Check quota usage
kubectl describe resourcequota <quota-name> -n <namespace>
```

**Solutions:**

1. **Increase Quota:**
   ```bash
   kubectl edit resourcequota <quota-name> -n <namespace>
   ```

2. **Free Up Resources:**
   ```bash
   # Delete unused pods
   kubectl delete pod <unused-pod> -n <namespace>
   
   # Scale down deployments
   kubectl scale deployment <deployment> --replicas=1 -n <namespace>
   ```

3. **Move Pods to Different Namespace:**
   ```bash
   # Create pods in namespace with available quota
   kubectl create namespace <new-namespace>
   ```

## Monitoring Resource Usage

### Key Metrics to Track

- **CPU Usage vs Requests/Limits**: Identify over/under-provisioning
- **Memory Usage vs Requests/Limits**: Detect memory pressure
- **CPU Throttling Rate**: Indicates limit too low
- **OOMKill Rate**: Indicates memory limit too low
- **Resource Request Efficiency**: Requests vs actual usage
- **Quota Utilization**: Track quota usage per namespace

### Prometheus Queries

```promql
# CPU usage percentage of limit
(rate(container_cpu_usage_seconds_total[5m]) / container_spec_cpu_quota * 100)

# Memory usage percentage of limit
(container_memory_working_set_bytes / container_spec_memory_limit_bytes * 100)

# CPU throttling rate
rate(container_cpu_cfs_throttled_seconds_total[5m])

# OOM kills
rate(container_oom_events_total[5m])
```

## Cost Optimization

### Strategies

1. **Right-Size Resources**: Set requests based on actual usage (P50-P75)
2. **Use Spot Instances**: For non-critical workloads
3. **Implement Autoscaling**: Scale down during low usage
4. **Monitor Waste**: Identify over-provisioned pods
5. **Use Resource Quotas**: Prevent resource sprawl

### Calculate Savings

```bash
# Compare requests vs usage
# If request is 1 CPU but usage is 0.25 CPU:
# Waste = 0.75 CPU per pod
# With 100 pods: 75 CPUs wasted
# Cost savings = 75 CPUs * hourly_rate
```

## Automated Optimization with AlertMend

AlertMend AI can automatically:

- **Right-Size Resources**: Analyze usage patterns and recommend optimal requests/limits
- **Detect Over-Provisioning**: Identify pods with excessive resource requests
- **Prevent OOMKills**: Alert on memory pressure before OOMKills occur
- **Optimize Quotas**: Suggest quota adjustments based on usage
- **Cost Analysis**: Identify cost optimization opportunities

## Conclusion

Proper resource management in Kubernetes requires understanding requests, limits, and quotas. Setting appropriate resource specifications ensures applications get the resources they need while preventing resource exhaustion and controlling costs. By monitoring usage, right-sizing resources, and using quotas effectively, you can optimize cluster performance and reduce infrastructure costs.

Implementing automated monitoring and optimization with AlertMend AI helps continuously improve resource allocation and reduce waste.

---

*Want to optimize resource usage? [Learn about AlertMend's cost optimization](/solutions/cost-optimization).*
