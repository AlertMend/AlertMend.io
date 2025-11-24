---
title: "How to Troubleshoot and Fix Kubernetes 502 Bad Gateway Error"
excerpt: "A 502 Bad Gateway error is a common issue that users face when working with Kubernetes services and ingress controllers."
date: "2025-02-01"
category: "Kubernetes"
author: "Arvind Rajpurohit"
---

## Understanding 502 Bad Gateway

A 502 error occurs when a gateway or proxy server receives an invalid response from an upstream server. In Kubernetes, this typically happens between:

- Ingress Controller and Service
- Service and Pods
- Load Balancer and Ingress

## Common Causes

### 1. No Healthy Backend Pods

**Symptoms:**
- Service has no endpoints
- All pods are unhealthy

**Diagnosis:**
```bash
kubectl get endpoints <service-name>

kubectl get pods -l app=<app-label>

# Check readiness probes
kubectl describe pod <pod-name>
```

**Solutions:**
- Fix pod health issues
- Adjust readiness probes
- Ensure pods are running
- Check application logs

### 2. Readiness Probe Failures

**Symptoms:**
- Pods are running but not ready
- Endpoints list is empty

**Solutions:**
- Fix readiness probe configuration
- Ensure probe endpoint is accessible
- Adjust probe timeouts
- Test probe manually

### 3. Network Issues

**Symptoms:**
- Pods cannot communicate
- Connection refused errors

**Solutions:**
- Check network policies
- Verify service selectors
- Test pod connectivity
- Review firewall rules

### 4. Ingress Configuration Issues

**Symptoms:**
- Ingress routes incorrectly
- Backend service not found

**Solutions:**
- Verify ingress rules
- Check service names
- Ensure paths match
- Review ingress annotations

## Troubleshooting Steps

### Step 1: Check Ingress Status

```bash
kubectl get ingress
kubectl describe ingress <ingress-name>
```

### Step 2: Verify Service Endpoints

```bash
kubectl get endpoints <service-name>
kubectl describe service <service-name>
```

### Step 3: Check Pod Health

```bash
kubectl get pods
kubectl logs <pod-name>
```

### Step 4: Test Connectivity

```bash
# From within cluster
kubectl run -it --rm debug --image=busybox --restart=Never -- wget -O- http://<service-name>
```

## Best Practices

1. **Health Checks**: Implement proper readiness and liveness probes
2. **Service Discovery**: Use service names for communication
3. **Monitoring**: Track 502 error rates
4. **Graceful Degradation**: Handle backend failures gracefully
5. **Load Balancing**: Ensure proper load balancing configuration

## Automated Resolution

AlertMend AI can automatically:
- Detect 502 errors in real-time
- Identify root causes
- Restart unhealthy pods
- Update service configurations
- Scale services if needed

## Conclusion

502 Bad Gateway errors can be complex, but with systematic troubleshooting and automated remediation, you can maintain service reliability.

---

*Need help with Kubernetes errors? [Book a demo](/contact) to see AlertMend in action.*

