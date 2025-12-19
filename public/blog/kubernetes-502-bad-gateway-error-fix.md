---
title: "Kubernetes 502 Bad Gateway Error: Complete Fix Guide"
excerpt: "Complete troubleshooting guide for Kubernetes 502 Bad Gateway errors. Learn how to diagnose and fix issues with Ingress, services, load balancers, backend pods, and network configuration."
date: "2025-02-1"
category: "Kubernetes"
author: "Arvind Rajpurohit"
keywords: "502 Bad Gateway, Kubernetes troubleshooting, Ingress errors, service discovery, load balancer issues, backend health, Kubernetes networking, AlertMend AI"
---

# Kubernetes 502 Bad Gateway Error: Complete Fix Guide

A 502 Bad Gateway error is a common issue in Kubernetes environments, especially when dealing with services, Ingress controllers, and load balancers. This error indicates that the gateway or proxy server received an invalid response from the upstream server. Understanding the root causes and systematic troubleshooting approaches is essential for quick resolution.

## Understanding 502 Bad Gateway Errors

A 502 Bad Gateway error occurs when:
- The gateway/proxy cannot get a valid response from the upstream server
- The upstream server is unreachable or not responding
- The upstream server returns an invalid or malformed response
- Network connectivity issues prevent communication

In Kubernetes, this typically happens between:
- Client → Ingress Controller → Service → Pod
- Client → LoadBalancer → Service → Pod
- Service → Service (internal communication)

## Diagnostic Workflow

### Step 1: Identify Where 502 Occurs

```bash
# Check Ingress status
kubectl get ingress

# Check Ingress controller logs
kubectl logs -n ingress-nginx -l app.kubernetes.io/component=controller --tail=100

# Test direct service access (bypass Ingress)
kubectl port-forward service/<service-name> 8080:80
curl http://localhost:8080

# Test from within cluster
kubectl run -it --rm test --image=curlimages/curl --restart=Never -- curl http://<service-name>
```

### Step 2: Check Backend Health

```bash
# Check pod status
kubectl get pods -l app=<app-label>

# Check pod readiness
kubectl get pods -o wide

# Check service endpoints
kubectl get endpoints <service-name>

# Verify pods are ready
kubectl get pods -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.conditions[?(@.type=="Ready")].status}{"\n"}{end}'
```

### Step 3: Examine Logs

```bash
# Check Ingress controller logs for 502 errors
kubectl logs -n ingress-nginx -l app.kubernetes.io/component=controller | grep "502"

# Check backend pod logs
kubectl logs <pod-name>

# Check service proxy logs (if available)
kubectl logs -n kube-system -l k8s-app=kube-proxy --tail=50
```

## Common Causes and Solutions

### 1. Backend Pods Not Ready

**Symptoms:**
- Service has no endpoints
- Pods are in CrashLoopBackOff, Pending, or NotReady state
- Readiness probes failing

**Diagnosis:**

```bash
# Check pod status
kubectl get pods -l app=<app-label>

# Check why pods aren't ready
kubectl describe pod <pod-name> | grep -A 10 "Conditions\|Events"

# Check readiness probe
kubectl get pod <pod-name> -o jsonpath='{.spec.containers[0].readinessProbe}'

# Test readiness endpoint manually
kubectl exec <pod-name> -- curl http://localhost:8080/ready
```

**Solutions:**

**Fix Readiness Probe:**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-app
spec:
  containers:
  - name: app
    image: my-app:latest
    readinessProbe:
      httpGet:
        path: /ready
        port: 8080
      initialDelaySeconds: 10
      periodSeconds: 5
      timeoutSeconds: 3
      failureThreshold: 3
    livenessProbe:
      httpGet:
        path: /health
        port: 8080
      initialDelaySeconds: 30
      periodSeconds: 10
```

**Ensure Pods Are Running:**

```bash
# Check and fix pod issues
kubectl describe pod <pod-name>

# If pods are crashing, check logs
kubectl logs <pod-name> --previous

# Restart deployment if needed
kubectl rollout restart deployment/<deployment-name>
```

### 2. Service Has No Endpoints

**Symptoms:**
- Service exists but has no endpoints
- `kubectl get endpoints <service>` shows no addresses
- Pod labels don't match service selector

**Diagnosis:**

```bash
# Check service endpoints
kubectl get endpoints <service-name>

# Check service selector
kubectl get service <service-name> -o jsonpath='{.spec.selector}'

# Check pod labels
kubectl get pods --show-labels

# Verify selector matches
kubectl get pods -l <key>=<value>
```

**Solutions:**

**Fix Service Selector:**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: my-app  # Must match pod labels
    version: v1
  ports:
  - port: 80
    targetPort: 8080
```

**Fix Pod Labels:**

```bash
# Add missing labels to pods
kubectl label pods <pod-name> app=my-app version=v1

# Or update deployment to include labels
kubectl edit deployment <deployment-name>
# Add labels to pod template
```

### 3. Ingress Misconfiguration

**Symptoms:**
- Ingress exists but returns 502
- Backend service not found
- Incorrect paths or hostnames

**Diagnosis:**

```bash
# Check Ingress configuration
kubectl describe ingress <ingress-name>

# Check Ingress controller
kubectl get pods -n ingress-nginx

# View Ingress controller configuration
kubectl get ingress <ingress-name> -o yaml
```

**Solutions:**

**Fix Ingress Backend:**

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-app-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: my-service  # Must match service name
            port:
              number: 80  # Must match service port
```

**Verify Service Exists:**

```bash
# Ensure service exists and is accessible
kubectl get service <service-name>

# Test service directly
kubectl port-forward service/<service-name> 8080:80
curl http://localhost:8080
```

### 4. Port Mismatches

**Symptoms:**
- Service and pod ports don't match
- Ingress targets wrong port
- Container port misconfigured

**Diagnosis:**

```bash
# Check service port configuration
kubectl get service <service-name> -o yaml | grep -A 5 ports

# Check pod container ports
kubectl get pod <pod-name> -o jsonpath='{.spec.containers[0].ports}'

# Verify port mapping
kubectl describe service <service-name>
```

**Solutions:**

**Fix Service Port Configuration:**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: my-app
  ports:
  - name: http
    port: 80          # Service port (what clients connect to)
    targetPort: 8080  # Container port (must match container)
    protocol: TCP
```

**Verify Container Port:**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-app
spec:
  containers:
  - name: app
    image: my-app:latest
    ports:
    - containerPort: 8080  # Must match service targetPort
      name: http
      protocol: TCP
```

### 5. Network Policy Blocking Traffic

**Symptoms:**
- Pods are running but unreachable
- Network policies are configured
- Traffic blocked between namespaces

**Diagnosis:**

```bash
# List network policies
kubectl get networkpolicies --all-namespaces

# Check network policy rules
kubectl describe networkpolicy <policy-name> -n <namespace>

# Test connectivity
kubectl run -it --rm test --image=busybox --restart=Never -- wget -O- http://<service-name>
```

**Solutions:**

**Allow Ingress Traffic:**

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-ingress
  namespace: default
spec:
  podSelector:
    matchLabels:
      app: my-app
  policyTypes:
  - Ingress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
    ports:
    - protocol: TCP
      port: 8080
```

**Allow Service-to-Service Traffic:**

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-service-traffic
spec:
  podSelector:
    matchLabels:
      app: my-app
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector: {}  # Allow from all pods
    - namespaceSelector: {}  # Allow from all namespaces
```

### 6. DNS Resolution Issues

**Symptoms:**
- Service name doesn't resolve
- Connection timeouts
- DNS errors in logs

**Diagnosis:**

```bash
# Test DNS resolution
kubectl run -it --rm debug --image=busybox --restart=Never -- nslookup <service-name>

# Check CoreDNS
kubectl get pods -n kube-system -l k8s-app=kube-dns

# Test from application pod
kubectl exec <pod-name> -- nslookup <service-name>.default.svc.cluster.local
```

**Solutions:**

**Verify CoreDNS is Running:**

```bash
# Restart CoreDNS if needed
kubectl delete pod -n kube-system -l k8s-app=kube-dns

# Verify CoreDNS recovers
kubectl get pods -n kube-system -l k8s-app=kube-dns -w
```

**Use Full DNS Name:**

```yaml
# Use FQDN for service discovery
apiVersion: v1
kind: Pod
metadata:
  name: my-app
spec:
  containers:
  - name: app
    image: my-app:latest
    env:
    - name: DATABASE_URL
      value: "postgresql://db-service.default.svc.cluster.local:5432/mydb"
```

### 7. Resource Exhaustion

**Symptoms:**
- Pods are being throttled
- High CPU/memory usage
- Pods restart frequently

**Diagnosis:**

```bash
# Check resource usage
kubectl top pods

# Check resource limits
kubectl describe pod <pod-name> | grep -A 10 "Limits\|Requests"

# Check for throttling
kubectl describe node <node-name> | grep -i throttle
```

**Solutions:**

**Increase Resource Limits:**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-app
spec:
  containers:
  - name: app
    image: my-app:latest
    resources:
      requests:
        memory: "512Mi"
        cpu: "500m"
      limits:
        memory: "1Gi"
        cpu: "1000m"
```

### 8. TLS/SSL Certificate Issues

**Symptoms:**
- 502 errors with HTTPS
- Certificate errors in logs
- Ingress controller cannot validate certificates

**Diagnosis:**

```bash
# Check TLS secrets
kubectl get secret <tls-secret-name>

# Verify certificate
kubectl get secret <tls-secret-name> -o jsonpath='{.data.tls\.crt}' | base64 -d | openssl x509 -text -noout

# Check Ingress TLS configuration
kubectl get ingress <ingress-name> -o yaml | grep -A 10 tls
```

**Solutions:**

**Create TLS Secret:**

```bash
# Create TLS secret from certificate files
kubectl create secret tls <tls-secret-name> \
  --cert=path/to/cert.crt \
  --key=path/to/key.key

# Or use cert-manager for automatic certificates
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
```

**Configure Ingress TLS:**

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-app-ingress
spec:
  tls:
  - hosts:
    - myapp.example.com
    secretName: myapp-tls-secret
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: my-service
            port:
              number: 80
```

## Advanced Troubleshooting

### Using Debug Containers

```bash
# Create debug pod in same namespace
kubectl run -it --rm debug --image=nicolaka/netshoot --restart=Never

# Inside debug container:
# Test DNS
nslookup <service-name>

# Test HTTP connectivity
curl -v http://<service-name>:<port>

# Check routing
ip route
traceroute <service-ip>
```

### Testing Service Connectivity

```bash
# Test from inside cluster
kubectl run -it --rm test --image=curlimages/curl --restart=Never -- \
  curl -v http://<service-name>.<namespace>.svc.cluster.local

# Test with port-forward (bypasses Ingress)
kubectl port-forward service/<service-name> 8080:80
curl http://localhost:8080

# Test from specific pod
kubectl exec <pod-name> -- curl http://<service-name>
```

### Ingress Controller Debugging

```bash
# Check Ingress controller logs
kubectl logs -n ingress-nginx -l app.kubernetes.io/component=controller --tail=100

# Check Ingress controller configuration
kubectl get configmap -n ingress-nginx

# Test Ingress controller directly
kubectl port-forward -n ingress-nginx service/ingress-nginx-controller 8080:80
curl -H "Host: myapp.example.com" http://localhost:8080
```

## Prevention Best Practices

### 1. Implement Proper Health Checks

Always configure readiness and liveness probes:

```yaml
readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 5
livenessProbe:
  httpGet:
    path: /health
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 10
```

### 2. Use Service Mesh for Reliability

Consider implementing Istio or Linkerd for:
- Automatic retries
- Circuit breaking
- Timeout handling
- Load balancing

### 3. Monitor Service Health

```yaml
# Deploy service health monitoring
apiVersion: apps/v1
kind: Deployment
metadata:
  name: health-checker
spec:
  replicas: 1
  template:
    spec:
      containers:
      - name: checker
        image: curlimages/curl
        command: ["/bin/sh", "-c"]
        args:
        - |
          while true; do
            STATUS=$(curl -o /dev/null -s -w "%{http_code}" http://<service-name>)
            if [ "$STATUS" != "200" ]; then
              echo "Service returned $STATUS"
            fi
            sleep 60
          done
```

### 4. Set Resource Limits

Ensure pods have adequate resources to handle traffic:

```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

### 5. Validate Configuration Before Deployment

```bash
# Validate YAML
kubectl apply --dry-run=client -f ingress.yaml

# Check for common issues
kubectl get ingress -o yaml | grep -i "backend\|service"
```

## Automated Detection and Remediation

AlertMend AI can automatically:

- **Detect 502 Errors**: Monitor HTTP status codes and detect 502 errors in real-time
- **Identify Root Causes**: Analyze Ingress logs, service endpoints, and pod health to identify the specific issue
- **Automated Remediation**: Fix common issues like restarting unhealthy pods, correcting service selectors, or adjusting Ingress configuration
- **Alert on Patterns**: Identify trends like recurring 502s or service degradation
- **Health Dashboards**: Provide visibility into service health, endpoint availability, and error rates

### Integration Example

```yaml
# AlertMend monitors:
- HTTP status codes from Ingress controllers
- Service endpoint availability
- Pod readiness status
- Response times and latency
- Error rates and patterns
```

## Conclusion

502 Bad Gateway errors in Kubernetes can stem from various causes including unhealthy backend pods, service misconfiguration, Ingress issues, network policies, and resource constraints. By following a systematic diagnostic approach—checking pod health, verifying service endpoints, examining Ingress configuration, and testing connectivity—you can quickly identify and resolve 502 errors. Implementing proper health checks, monitoring, and automated remediation with AlertMend AI helps prevent these issues and maintains service reliability in your Kubernetes cluster.

---

*Need help troubleshooting Kubernetes networking issues? [Learn about AlertMend's automated incident remediation](/solutions/auto-remediation).*
