---
title: "How to Rollback Kubernetes Deployments: Step-by-Step Guide"
excerpt: "Learn how to safely rollback Kubernetes deployments using kubectl, understand rollout history, and implement automated rollback strategies for production environments."
date: "2025-06-20"
category: "Kubernetes"
author: "Arvind Rajpurohit"
keywords: "Kubernetes rollback, deployment management, incident remediation, automated rollback, production risks, Kubernetes best practices, AlertMend AI, operational safety"
---

# How to Rollback Kubernetes Deployments: Step-by-Step Guide

Deployment rollbacks are a critical safety mechanism in Kubernetes that allows you to revert to a previous working version when issues occur. Understanding how to perform rollbacks safely and effectively is essential for maintaining production reliability.

## Understanding Kubernetes Deployment Rollouts

Kubernetes Deployments maintain a history of all revisions, automatically storing configuration changes and container image updates. This history enables you to rollback to any previous state when problems arise.

### How Rollout History Works

Every time you update a Deployment (change image, update environment variables, modify resource limits, etc.), Kubernetes creates a new revision. The rollout history tracks:

- **Container images**: Previous versions of your application
- **Configuration changes**: Environment variables, resource requests/limits
- **Replica counts**: Previous scaling configurations
- **Volume mounts**: Storage and configuration changes

### Revision Limits

By default, Kubernetes keeps revision history, but you can control how many revisions are retained:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  revisionHistoryLimit: 10  # Keep last 10 revisions
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: app
        image: my-app:v2.0
```

**Best Practice**: Set `revisionHistoryLimit` to 10-15 revisions. Too many revisions consume etcd storage, while too few limit rollback options.

## Performing Rollbacks with kubectl

### Viewing Rollout History

Before rolling back, examine the deployment history:

```bash
# View rollout history
kubectl rollout history deployment/my-app

# View detailed information about a specific revision
kubectl rollout history deployment/my-app --revision=3

# View history with change causes (requires --record flag during updates)
kubectl rollout history deployment/my-app
```

**Example Output**:
```
REVISION  CHANGE-CAUSE
1         <none>
2         kubectl set image deployment/my-app app=my-app:v1.1
3         kubectl set image deployment/my-app app=my-app:v2.0
```

### Rolling Back to Previous Revision

The simplest rollback returns to the immediately previous revision:

```bash
# Rollback to previous revision
kubectl rollout undo deployment/my-app

# Check rollout status
kubectl rollout status deployment/my-app

# Watch the rollback in real-time
kubectl get pods -l app=my-app -w
```

### Rolling Back to a Specific Revision

Rollback to a particular revision when you know the exact version you need:

```bash
# Rollback to revision 2
kubectl rollout undo deployment/my-app --to-revision=2

# Verify the rollback
kubectl describe deployment/my-app | grep Image
```

### Understanding Rollback Behavior

When you rollback a Deployment:

1. **New ReplicaSet Created**: Kubernetes creates a new ReplicaSet with the previous configuration
2. **Gradual Rollout**: Pods are rolled out using the same strategy (RollingUpdate or Recreate) as the original deployment
3. **Old Pods Terminated**: Once new pods are healthy, old pods are terminated
4. **Service Endpoints Updated**: The Service automatically updates to point to new pods

## Monitoring Rollbacks

### Watching Rollout Status

Monitor the rollback progress in real-time:

```bash
# Watch rollout status (blocks until complete)
kubectl rollout status deployment/my-app

# Check rollout history after rollback
kubectl rollout history deployment/my-app

# View current ReplicaSets
kubectl get replicasets -l app=my-app

# Check pod status
kubectl get pods -l app=my-app
```

### Verifying Rollback Success

After a rollback, verify the deployment is stable:

```bash
# Check deployment status
kubectl get deployment my-app

# View pod logs
kubectl logs -l app=my-app --tail=50

# Check service endpoints
kubectl get endpoints my-app-service

# Monitor application metrics
kubectl top pods -l app=my-app
```

## Advanced Rollback Strategies

### Using Deployment Annotations

Add annotations to track rollback reasons:

```bash
kubectl annotate deployment/my-app \
  deployment.kubernetes.io/revision-history-limit=10 \
  rollback-reason="High error rate detected" \
  rollback-time="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
```

### Conditional Rollbacks

Implement conditional rollbacks based on metrics:

```bash
# Check error rate before rolling back
ERROR_RATE=$(kubectl exec -it deployment/my-app -- \
  curl -s http://localhost:8080/metrics | grep http_requests_total | ...)

if [ "$ERROR_RATE" -gt "100" ]; then
  echo "Error rate too high, rolling back..."
  kubectl rollout undo deployment/my-app
fi
```

### Blue-Green Rollback Pattern

For critical applications, use a blue-green deployment strategy:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-app-service
spec:
  selector:
    version: v1  # Point to blue deployment
  ports:
  - port: 80
    targetPort: 8080
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app-blue
  labels:
    version: v1
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
      version: v1
  template:
    metadata:
      labels:
        app: my-app
        version: v1
    spec:
      containers:
      - name: app
        image: my-app:v1.0
```

To rollback, simply update the Service selector to point to the blue deployment.

## Common Rollback Issues and Solutions

### Issue 1: Data Incompatibility

**Problem**: New database schema changes may not be compatible with rolled-back code.

**Solution**: 
- Always make database migrations backward-compatible
- Implement database versioning
- Use feature flags to control new functionality

```bash
# Check database schema version before rollback
kubectl exec deployment/my-app -- \
  psql -U postgres -d mydb -c "SELECT version FROM schema_migrations ORDER BY version DESC LIMIT 1;"
```

### Issue 2: ConfigMap/Secret Changes

**Problem**: Rollback may not include configuration changes if ConfigMaps/Secrets were updated separately.

**Solution**: 
- Version your ConfigMaps and Secrets
- Include configuration in deployment annotations
- Use init containers to validate configuration compatibility

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: my-app-config-v2
  labels:
    version: "2"
data:
  app.conf: |
    # Configuration v2
```

### Issue 3: Persistent Volume Claims

**Problem**: Rolled-back pods may not have access to required persistent volumes.

**Solution**:
- Ensure PVC names are consistent across revisions
- Use StatefulSets for stateful applications
- Implement proper volume mount strategies

### Issue 4: Missing Revision History

**Problem**: Revision history is cleared or limited, preventing rollback.

**Solution**:
- Increase `revisionHistoryLimit` in deployment spec
- Document important revisions externally
- Use Git to track deployment configurations

## Best Practices for Safe Rollbacks

### 1. Test Rollbacks Regularly

Practice rollback procedures in staging environments:

```bash
# Test rollback procedure
kubectl set image deployment/my-app app=my-app:test-version
sleep 30
kubectl rollout undo deployment/my-app
kubectl rollout status deployment/my-app
```

### 2. Monitor During Rollback

Watch metrics and logs during rollback to catch issues early:

```bash
# Monitor in real-time
watch -n 1 'kubectl get pods -l app=my-app && kubectl top pods -l app=my-app'
```

### 3. Document Rollback Procedures

Maintain runbooks for common rollback scenarios:

- Emergency rollback procedures
- Data migration steps
- Service dependency considerations
- Communication protocols

### 4. Use Canary Deployments

Reduce rollback risk by using canary deployments:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app-canary
spec:
  replicas: 1  # Small canary instance
  selector:
    matchLabels:
      app: my-app
      track: canary
  template:
    metadata:
      labels:
        app: my-app
        track: canary
    spec:
      containers:
      - name: app
        image: my-app:v2.0-canary
```

### 5. Implement Health Checks

Ensure proper liveness and readiness probes to detect failed deployments quickly:

```yaml
spec:
  containers:
  - name: app
    image: my-app:v2.0
    livenessProbe:
      httpGet:
        path: /health
        port: 8080
      initialDelaySeconds: 30
      periodSeconds: 10
      failureThreshold: 3
    readinessProbe:
      httpGet:
        path: /ready
        port: 8080
      initialDelaySeconds: 5
      periodSeconds: 5
      failureThreshold: 3
```

### 6. Set Resource Limits

Prevent resource exhaustion that could cause deployment failures:

```yaml
spec:
  containers:
  - name: app
    image: my-app:v2.0
    resources:
      requests:
        memory: "256Mi"
        cpu: "250m"
      limits:
        memory: "512Mi"
        cpu: "500m"
```

## Automated Rollback Strategies

### Using Kubernetes HPA for Automatic Rollback

Configure Horizontal Pod Autoscaler to scale down on high error rates:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: my-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-app
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Pods
    pods:
      metric:
        name: http_requests_per_second
      target:
        type: AverageValue
        averageValue: "100"
```

### AlertMend AI Automated Rollback

AlertMend AI can automatically detect deployment issues and trigger rollbacks when:

- **Error Rate Thresholds**: Error rates exceed configured limits
- **Response Time Degradation**: P95/P99 latency increases significantly  
- **Health Check Failures**: Readiness probes fail repeatedly
- **Resource Exhaustion**: CPU or memory usage hits critical levels
- **Custom Metrics**: Business-specific metrics indicate problems

AlertMend monitors deployment health continuously and can initiate rollbacks within seconds of detecting issues, minimizing impact on users.

## Rollback Troubleshooting

### Rollback Stuck or Slow

If a rollback seems stuck:

```bash
# Check deployment status
kubectl describe deployment/my-app

# Check ReplicaSet status
kubectl get replicasets -l app=my-app

# Check pod events
kubectl describe pod -l app=my-app

# Check for resource constraints
kubectl top nodes
kubectl top pods -l app=my-app
```

### Partial Rollback

Sometimes only some pods rollback successfully:

```bash
# Check pod distribution across ReplicaSets
kubectl get pods -l app=my-app -o wide

# Force delete pods in old ReplicaSet
kubectl delete pod <pod-name> --force --grace-period=0

# Scale deployment to force complete rollback
kubectl scale deployment/my-app --replicas=0
kubectl scale deployment/my-app --replicas=3
```

## Conclusion

Kubernetes deployment rollbacks are a powerful tool for maintaining application reliability. By understanding rollout history, monitoring rollback progress, and implementing best practices, you can safely revert problematic deployments. Automated rollback solutions like AlertMend AI can further reduce risk by detecting issues early and initiating rollbacks automatically.

Remember to test rollback procedures regularly, maintain proper revision history, and document rollback strategies for your team. When used correctly, rollbacks can be a seamless part of your deployment strategy, enabling rapid recovery from production incidents.

---

*Want automated rollback capabilities? [Learn about AlertMend's auto-remediation](/solutions/auto-remediation).*
