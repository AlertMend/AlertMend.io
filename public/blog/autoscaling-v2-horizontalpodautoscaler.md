---
title: "Kubernetes HPA V2: Complete HPA Guide"
excerpt: "Complete guide to Kubernetes HorizontalPodAutoscaler (HPA) v2 with configuration examples, custom metrics, scaling strategies, and production best practices."
date: "2025-12-18"
category: "Kubernetes"
author: "AlertMend Team"
keywords: "horizontalpodautoscaler, HPA v2, kubernetes autoscaling, pod autoscaling, custom metrics autoscaling, kubernetes scaling, resource-based scaling, AlertMend AI, AIOps, DevOps, cloud native"
---

# Kubernetes HPA V2: Complete HorizontalPodAutoscaler Guide

## Introduction: Understanding HorizontalPodAutoscaler V2

The **HorizontalPodAutoscaler (HPA) V2** is one of Kubernetes' most powerful features for automatically scaling workloads based on observed metrics. Unlike vertical pod autoscaling, which adjusts resource requests and limits, HPA scales the number of pod replicas horizontally to match demand. This capability is essential for modern cloud-native applications that experience variable traffic patterns, enabling organizations to optimize costs while maintaining performance.

In this comprehensive guide, we'll explore HPA V2 in depth, covering its architecture, configuration options, metrics types, best practices, and troubleshooting techniques. Whether you're new to Kubernetes autoscaling or looking to optimize your existing HPA configurations, this guide provides the knowledge you need to implement effective autoscaling strategies.

## What is HorizontalPodAutoscaler?

**HorizontalPodAutoscaler (HPA)** is a Kubernetes resource that automatically adjusts the number of pod replicas in a deployment, replica set, or stateful set based on observed metrics. The "horizontal" aspect refers to scaling out (adding more pods) or scaling in (removing pods), as opposed to vertical scaling (increasing/decreasing resources per pod).

### HPA V1 vs V2

**HPA V1** (autoscaling/v1):
- Only supported CPU and memory metrics
- Single metric per HPA
- Limited flexibility

**HPA V2** (autoscaling/v2):
- Supports multiple metrics (CPU, memory, custom, external)
- Can combine multiple metrics for scaling decisions
- More granular control with behavior configuration
- Better support for scaling behaviors and stabilization

### How HPA Works

HPA operates through a control loop:
1. **Metrics Collection**: HPA controller queries metrics from Metrics API
2. **Desired Replicas Calculation**: Calculates desired replica count based on current metrics and targets
3. **Scaling Decision**: Compares desired replicas with current replicas
4. **Replica Adjustment**: Updates the target resource (Deployment, ReplicaSet, etc.) to match desired replicas

## HPA V2 Architecture and Components

### HPA Controller

The HPA controller runs as part of the Kubernetes controller manager and:
- Periodically polls the Metrics API (default: every 15 seconds)
- Queries current metrics for pods
- Calculates desired replica count
- Updates the target resource's replica count

### Metrics API

HPA V2 relies on the Metrics API to gather metrics:

1. **Resource Metrics API**: CPU and memory metrics (via metrics-server)
2. **Custom Metrics API**: Application-specific metrics
3. **External Metrics API**: Metrics from external systems

### Metrics Server

Metrics Server is a cluster-wide aggregator of resource usage data. It:
- Collects metrics from kubelets via Summary API
- Exposes Resource Metrics API
- Enables HPA and VPA to make scaling decisions

Install metrics-server:
```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

## Configuring HPA V2

### Basic HPA Configuration

**Simple CPU-based HPA**:
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: my-app-hpa
  namespace: default
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 50
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
      - type: Percent
        value: 100
        periodSeconds: 15
      - type: Pods
        value: 4
        periodSeconds: 15
      selectPolicy: Max
```

### Multi-Metric HPA

HPA V2 supports multiple metrics with different weightings:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: multi-metric-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-app
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  - type: Pods
    pods:
      metric:
        name: http_requests_per_second
      target:
        type: AverageValue
        averageValue: "100"
```

### HPA with Custom Metrics

To use custom metrics, you need to install the Custom Metrics API adapter:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: custom-metric-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-app
  minReplicas: 2
  maxReplicas: 50
  metrics:
  - type: Pods
    pods:
      metric:
        name: requests_per_second
      target:
        type: AverageValue
        averageValue: "200"
  - type: Object
    object:
      metric:
        name: queue_depth
      describedObject:
        apiVersion: v1
        kind: Service
        name: my-queue
      target:
        type: Value
        value: "100"
```

## Metrics Types in HPA V2

### 1. Resource Metrics

Resource metrics include CPU and memory usage:

```yaml
metrics:
- type: Resource
  resource:
    name: cpu
    target:
      type: Utilization
      averageUtilization: 70
- type: Resource
  resource:
    name: memory
    target:
      type: AverageValue
      averageValue: "500Mi"
```

**Target Types**:
- `Utilization`: Percentage-based target (0-100)
- `AverageValue`: Absolute value target

### 2. Pod Metrics

Pod metrics are aggregated across all pods:

```yaml
metrics:
- type: Pods
  pods:
    metric:
      name: packets-per-second
    target:
      type: AverageValue
      averageValue: "1k"
```

### 3. Object Metrics

Object metrics reference a single Kubernetes object:

```yaml
metrics:
- type: Object
  object:
    metric:
      name: requests-per-second
    describedObject:
      apiVersion: networking.k8s.io/v1
      kind: Ingress
      name: main-route
    target:
      type: Value
      value: "2k"
```

### 4. External Metrics

External metrics come from systems outside Kubernetes:

```yaml
metrics:
- type: External
  external:
    metric:
      name: queue_messages
      selector:
        matchLabels:
          queue: "worker_tasks"
    target:
      type: AverageValue
      averageValue: "30"
```

## HPA Behavior Configuration

HPA V2 allows fine-grained control over scaling behavior:

### Scale Down Behavior

```yaml
behavior:
  scaleDown:
    stabilizationWindowSeconds: 300  # Wait 5 minutes before scaling down
    policies:
    - type: Percent
      value: 50  # Scale down by max 50% at a time
      periodSeconds: 60  # Every minute
    - type: Pods
      value: 2  # Or remove max 2 pods at a time
      periodSeconds: 60
    selectPolicy: Min  # Use the most conservative policy
```

### Scale Up Behavior

```yaml
behavior:
  scaleUp:
    stabilizationWindowSeconds: 0  # Scale up immediately
    policies:
    - type: Percent
      value: 100  # Double replicas
      periodSeconds: 15
    - type: Pods
      value: 4  # Or add 4 pods
      periodSeconds: 15
    selectPolicy: Max  # Use the most aggressive policy
```

### Select Policy

- `Min`: Use the most conservative policy (slower scaling)
- `Max`: Use the most aggressive policy (faster scaling)

## Best Practices for HPA Configuration

### 1. Set Appropriate Min and Max Replicas

```yaml
minReplicas: 2  # Always have at least 2 for availability
maxReplicas: 50  # Cap scaling to prevent resource exhaustion
```

**Considerations**:
- Set min replicas based on availability requirements
- Set max replicas based on cluster capacity and cost constraints
- Consider pod disruption budgets when setting minimums

### 2. Use Multiple Metrics for Better Scaling

Relying on a single metric can lead to poor scaling decisions:

```yaml
metrics:
- type: Resource
  resource:
    name: cpu
    target:
      type: Utilization
      averageUtilization: 70
- type: Resource
  resource:
    name: memory
    target:
      type: Utilization
      averageUtilization: 80
- type: Pods
  pods:
    metric:
      name: requests_per_second
    target:
      type: AverageValue
      averageValue: "100"
```

### 3. Configure Appropriate Target Values

**CPU Targets**:
- **Conservative**: 50-60% for applications with variable loads
- **Standard**: 70-80% for most applications
- **Aggressive**: 80-90% for predictable, steady workloads

**Memory Targets**:
- Usually 70-80% to account for memory spikes
- Consider garbage collection patterns

### 4. Use Stabilization Windows

Stabilization windows prevent rapid scaling oscillations:

```yaml
behavior:
  scaleDown:
    stabilizationWindowSeconds: 300  # Wait 5 minutes before scaling down
  scaleUp:
    stabilizationWindowSeconds: 0  # Scale up immediately
```

### 5. Configure Scaling Policies

Control scaling rate to prevent sudden changes:

```yaml
behavior:
  scaleUp:
    policies:
    - type: Percent
      value: 100  # Can double replicas
      periodSeconds: 15
  scaleDown:
    policies:
    - type: Percent
      value: 50  # Can halve replicas
      periodSeconds: 60
```

### 6. Ensure Proper Resource Requests

HPA requires resource requests to calculate utilization:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  template:
    spec:
      containers:
      - name: app
        resources:
          requests:
            cpu: "100m"
            memory: "128Mi"
          limits:
            cpu: "500m"
            memory: "512Mi"
```

## Advanced HPA Scenarios

### Scenario 1: Scaling Based on Queue Depth

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: queue-worker-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: queue-worker
  minReplicas: 1
  maxReplicas: 20
  metrics:
  - type: External
    external:
      metric:
        name: queue_messages
        selector:
          matchLabels:
            queue: "tasks"
      target:
        type: AverageValue
        averageValue: "10"  # 1 pod per 10 messages
```

### Scenario 2: Predictive Scaling with Custom Metrics

Combine multiple metrics for intelligent scaling:

```yaml
metrics:
- type: Resource
  resource:
    name: cpu
    target:
      type: Utilization
      averageUtilization: 70
- type: Pods
  pods:
    metric:
      name: http_request_rate
    target:
      type: AverageValue
      averageValue: "100"
- type: Object
  object:
    metric:
      name: active_connections
    describedObject:
      apiVersion: v1
      kind: Service
      name: my-service
    target:
      type: Value
      value: "500"
```

### Scenario 3: Time-Based Scaling

While HPA doesn't support time-based scaling directly, you can combine it with CronJobs or use external metrics that vary by time.

## Troubleshooting HPA Issues

### HPA Not Scaling

**Check HPA Status**:
```bash
kubectl get hpa <hpa-name>
kubectl describe hpa <hpa-name>
```

**Common Issues**:
1. **Metrics not available**: Check if metrics-server is running
   ```bash
   kubectl get pods -n kube-system | grep metrics-server
   kubectl logs -n kube-system <metrics-server-pod>
   ```

2. **No resource requests**: HPA requires resource requests
   ```bash
   kubectl describe deployment <deployment-name> | grep -A 5 Resources
   ```

3. **Target already met**: Current metrics are at target
   ```bash
   kubectl get hpa <hpa-name> -o yaml | grep -A 10 status
   ```

### HPA Scaling Too Aggressively

**Symptoms**: Rapid scaling up and down (thrashing)

**Solutions**:
- Increase stabilization window
- Adjust scaling policies to be more conservative
- Review target values
- Check for metric fluctuations

```yaml
behavior:
  scaleDown:
    stabilizationWindowSeconds: 600  # Increase to 10 minutes
    policies:
    - type: Percent
      value: 25  # More conservative scaling
      periodSeconds: 120
```

### HPA Not Scaling Down

**Common Causes**:
- Stabilization window too long
- Scaling policies too conservative
- Minimum replicas set too high
- Metrics consistently above target

```bash
# Check current metrics
kubectl get --raw "/apis/metrics.k8s.io/v1beta1/namespaces/default/pods" | jq

# Check HPA status
kubectl describe hpa <hpa-name>
```

## Monitoring HPA with AlertMend.io

AlertMend.io provides comprehensive HPA monitoring:

### 1. HPA Status Monitoring

- Track HPA scaling decisions
- Monitor desired vs current replicas
- Alert on scaling failures

### 2. Metric Monitoring

- Monitor CPU and memory utilization
- Track custom metrics
- Identify scaling triggers

### 3. Cost Optimization

- Track pod replica counts over time
- Identify over-provisioning
- Optimize HPA configurations for cost

### 4. Performance Monitoring

- Monitor application performance during scaling
- Track scaling latency
- Identify scaling bottlenecks

## HPA Best Practices Summary

1. **Always Set Resource Requests**: HPA requires requests to calculate utilization
2. **Use Multiple Metrics**: Combine CPU, memory, and custom metrics
3. **Configure Behavior**: Set appropriate stabilization windows and policies
4. **Test Scaling**: Validate HPA behavior in staging before production
5. **Monitor Continuously**: Track HPA decisions and their impact
6. **Set Reasonable Limits**: Use min and max replicas to prevent over/under scaling
7. **Review Regularly**: Adjust targets and policies based on observed behavior

## Common HPA Patterns

### Pattern 1: CPU-Only Scaling

Simple CPU-based scaling for stateless applications:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: cpu-only-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: web-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### Pattern 2: CPU + Memory Scaling

Scaling based on both CPU and memory:

```yaml
metrics:
- type: Resource
  resource:
    name: cpu
    target:
      type: Utilization
      averageUtilization: 70
- type: Resource
  resource:
    name: memory
    target:
      type: Utilization
      averageUtilization: 80
```

### Pattern 3: Request-Based Scaling

Scale based on request rate:

```yaml
metrics:
- type: Pods
  pods:
    metric:
      name: http_requests_per_second
    target:
      type: AverageValue
      averageValue: "100"
```

## Conclusion: Mastering HPA V2

HorizontalPodAutoscaler V2 is a powerful tool for automatically managing application scale based on demand. By understanding its architecture, configuration options, and best practices, you can create effective autoscaling strategies that optimize both performance and cost.

Key takeaways:
- HPA V2 supports multiple metric types (resource, pod, object, external)
- Behavior configuration provides fine-grained control over scaling
- Proper resource requests are essential for HPA to work
- Monitoring and tuning are crucial for optimal performance

Remember to:
- Start with conservative targets and adjust based on observed behavior
- Use multiple metrics for better scaling decisions
- Configure stabilization windows to prevent oscillations
- Monitor HPA decisions and their impact on application performance

For comprehensive monitoring, alerting, and optimization of your HPA configurations, consider implementing AlertMend.io's AIOps platform. It provides real-time visibility into scaling decisions, helps identify optimization opportunities, and ensures your applications scale efficiently while maintaining performance and controlling costs.
