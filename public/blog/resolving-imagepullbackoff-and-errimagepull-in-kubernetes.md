---
title: "Resolving ImagePullBackOff and ErrImagePull Errors in Kubernetes"
excerpt: "Complete troubleshooting guide for Kubernetes ImagePullBackOff and ErrImagePull errors. Learn how to diagnose and fix image pull failures caused by authentication, network issues, rate limits, and registry problems."
date: "2025-05-21"
category: "Kubernetes"
author: "Himanshu Bansal"
keywords: "ImagePullBackOff, ErrImagePull, Kubernetes image pull errors, container registry, authentication, rate limits, image pull troubleshooting, AlertMend AI"
---

# Resolving ImagePullBackOff and ErrImagePull Errors in Kubernetes

In Kubernetes, container images are pulled from repositories when you deploy a pod. Occasionally, errors such as **ImagePullBackOff** and **ErrImagePull** may occur, preventing pods from starting. These issues are typically related to problems with fetching the container image and can disrupt application deployment. Understanding how to diagnose and resolve these errors is crucial for maintaining cluster reliability.

## Understanding Image Pull Errors

### ErrImagePull

This error occurs when Kubernetes fails to pull the container image from a container registry. It's the initial failure that triggers retry attempts.

### ImagePullBackOff

This is a follow-up error where Kubernetes retries pulling the image, but due to repeated failures, it backs off. The backoff delay increases exponentially (10s, 20s, 40s, etc.), preventing continuous failed attempts.

### ImagePullErr

A variant error indicating persistent image pull failures.

## How Kubernetes Pulls Container Images

When you deploy a pod in Kubernetes:

1. **kubelet** on the node receives the pod specification
2. Container runtime (containerd/Docker) attempts to pull the image
3. If image doesn't exist locally, it's fetched from the registry
4. Image layers are downloaded and cached
5. Container is started with the image

**Image Pull Process:**
- Images are pulled per-node (not centralized)
- Images are cached on nodes for reuse
- Pull happens during pod creation
- Pull failures prevent pod from starting

## Diagnostic Workflow

### Step 1: Identify the Problem

  ```bash
# Check pod status
kubectl get pods

# Get detailed pod information
  kubectl describe pod <pod-name>

# Check events (most important)
kubectl get events --field-selector involvedObject.name=<pod-name> --sort-by='.lastTimestamp'

# Check specific error messages
kubectl describe pod <pod-name> | grep -A 10 "Events\|Error\|Failed"
```

### Step 2: Examine Error Messages

Common error patterns in `kubectl describe pod` output:

```bash
# Authentication error
Error: ImagePullBackOff
Failed to pull image "registry.example.com/my-image:tag": 
rpc error: code = Unknown desc = failed to resolve reference 
"registry.example.com/my-image:tag": failed to authorize: 
failed to fetch anonymous token: unexpected status: 401 Unauthorized

# Image not found
Error: ImagePullBackOff
Failed to pull image "my-image:tag": 
rpc error: code = NotFound desc = failed to resolve reference 
"docker.io/library/my-image:tag": not found

# Network error
Error: ImagePullBackOff
Failed to pull image "my-image:tag": 
rpc error: code = Unknown desc = failed to pull and unpack image 
"docker.io/library/my-image:tag": failed to resolve source: 
failed to do request: Head "https://registry-1.docker.io/v2/...": 
dial tcp: lookup registry-1.docker.io: no such host
```

### Step 3: Check Node-Level Information

```bash
# Check which node the pod is on
kubectl get pod <pod-name> -o wide

# Check node logs (if accessible)
kubectl logs -n kube-system <node-name>

# Check container runtime logs (on the node)
ssh <node> sudo journalctl -u containerd -n 100
ssh <node> sudo journalctl -u docker -n 100
```

## Common Causes and Solutions

### 1. Incorrect Image Name or Tag

**Symptoms:**
- Error: "not found" or "manifest unknown"
- Pod status: ImagePullBackOff

**Diagnosis:**

```bash
# Check the image name in pod spec
kubectl get pod <pod-name> -o jsonpath='{.spec.containers[*].image}'

# Verify image exists in registry (if public)
docker pull <image-name>:<tag>

# Check available tags
curl -s https://registry.hub.docker.com/v2/repositories/<user>/<repo>/tags/ | jq '.results[].name'
```

**Solutions:**

**Fix Image Name:**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-app
spec:
  containers:
  - name: app
    image: nginx:1.21  # Use correct image name and tag
    # image: nginx:latest  # Avoid 'latest' in production
```

**Verify Image Format:**

```bash
# Correct formats:
# username/repository:tag
# registry.example.com/username/repository:tag
# repository:tag (uses Docker Hub)

# Test image pull manually
docker pull nginx:1.21
```

### 2. Image Doesn't Exist in Registry

**Symptoms:**
- Error: "manifest unknown" or "repository not found"
- Image name/tag combination doesn't exist

**Diagnosis:**

  ```bash
# Test if image exists (Docker Hub)
curl -s https://hub.docker.com/v2/repositories/library/nginx/tags/ | grep '"name"'

# For private registries, use registry API
curl -u username:password https://registry.example.com/v2/<repo>/tags/list

# Try pulling image manually
docker pull <image-name>:<tag>
```

**Solutions:**

**Verify Image Exists:**
- Check registry UI/API
- Verify tag exists (not just repository)
- Check if image was deleted
- Verify registry URL is correct

**Use Existing Image:**

```yaml
# Use a tag that exists
image: nginx:1.21-alpine  # Instead of nginx:1.99
```

### 3. Private Registry Authentication Issues

**Symptoms:**
- Error: "401 Unauthorized" or "authentication required"
- Works with public images, fails with private

**Diagnosis:**

```bash
# Check if imagePullSecrets are configured
kubectl get pod <pod-name> -o jsonpath='{.spec.imagePullSecrets[*].name}'

# Check if secret exists
kubectl get secrets

# Verify secret contents (base64 encoded)
kubectl get secret <secret-name> -o yaml
```

**Solutions:**

**Create Image Pull Secret:**

  ```bash
# Method 1: Using kubectl
kubectl create secret docker-registry regcred \
  --docker-server=registry.example.com \
  --docker-username=<username> \
  --docker-password=<password> \
  --docker-email=<email> \
  --namespace=<namespace>

# Method 2: From existing Docker config
kubectl create secret generic regcred \
  --from-file=.dockerconfigjson=$HOME/.docker/config.json \
  --type=kubernetes.io/dockerconfigjson

# Method 3: Manual YAML
kubectl create secret docker-registry regcred \
  --docker-server=registry.example.com \
  --docker-username=<username> \
  --docker-password=<password> \
  --dry-run=client -o yaml | kubectl apply -f -
```

**Reference Secret in Pod:**

  ```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-app
spec:
  imagePullSecrets:
  - name: regcred  # Must match secret name
  containers:
  - name: app
    image: registry.example.com/my-private-image:tag
```

**Reference Secret in Deployment:**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  template:
    spec:
      imagePullSecrets:
      - name: regcred
      containers:
      - name: app
        image: registry.example.com/my-private-image:tag
```

**Reference Secret in ServiceAccount (Recommended):**

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: my-serviceaccount
imagePullSecrets:
- name: regcred
---
apiVersion: v1
kind: Pod
metadata:
  name: my-app
spec:
  serviceAccountName: my-serviceaccount
  containers:
  - name: app
    image: registry.example.com/my-private-image:tag
```

**Verify Secret:**

```bash
# Test secret authentication
kubectl run test-pull --image=registry.example.com/my-private-image:tag \
  --image-pull-policy=Always --restart=Never \
  --overrides='{"spec":{"imagePullSecrets":[{"name":"regcred"}]}}'

# Clean up test pod
kubectl delete pod test-pull
```

### 4. Network Connectivity Issues

**Symptoms:**
- Error: "no such host" or "connection timeout"
- DNS resolution failures
- Network unreachable errors

**Diagnosis:**

```bash
# Test registry connectivity from node
kubectl debug node/<node-name> -it --image=busybox -- \
  wget -O- https://registry-1.docker.io/v2/

# Test DNS resolution
kubectl debug node/<node-name> -it --image=busybox -- \
  nslookup registry-1.docker.io

# Test from pod (if you can create one)
kubectl run -it --rm test --image=busybox --restart=Never -- \
  wget -O- https://registry-1.docker.io/v2/
```

**Solutions:**

**Fix DNS Resolution:**

```yaml
# Configure custom DNS in pod spec
apiVersion: v1
kind: Pod
metadata:
  name: my-app
spec:
  dnsPolicy: None
  dnsConfig:
    nameservers:
    - 8.8.8.8
    - 8.8.4.4
    searches:
    - default.svc.cluster.local
  containers:
  - name: app
    image: my-image:tag
```

**Configure Proxy (if behind corporate proxy):**

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: containerd-config
data:
  config.toml: |
    [plugins."io.containerd.grpc.v1.cri".registry]
      [plugins."io.containerd.grpc.v1.cri".registry.mirrors]
        [plugins."io.containerd.grpc.v1.cri".registry.mirrors."docker.io"]
          endpoint = ["https://registry-1.docker.io"]
      [plugins."io.containerd.grpc.v1.cri".registry.configs]
        [plugins."io.containerd.grpc.v1.cri".registry.configs."registry.example.com".tls]
          insecure_skip_verify = true
```

**Check Firewall Rules:**

```bash
# Verify ports are open (on node)
# HTTPS: 443
# HTTP: 80 (for registries that support it)
telnet registry-1.docker.io 443
```

### 5. Rate Limits on Public Registries

**Symptoms:**
- Error: "429 Too Many Requests" or "rate limit exceeded"
- Works initially, then fails
- More failures during high traffic periods

**Diagnosis:**

```bash
# Check Docker Hub rate limit status
curl -I https://registry-1.docker.io/v2/

# Look for rate limit headers:
# X-RateLimit-Limit: 200
# X-RateLimit-Remaining: 150

# Check how many pulls you've done
# Docker Hub: 100 pulls/6 hours (anonymous), 200 pulls/6 hours (authenticated)
```

**Solutions:**

**Use Authenticated Account:**

```bash
# Create secret with Docker Hub credentials
kubectl create secret docker-registry dockerhub-secret \
  --docker-server=docker.io \
  --docker-username=<dockerhub-username> \
  --docker-password=<dockerhub-password> \
  --docker-email=<email>
```

**Use Image Mirror/Proxy:**

```yaml
# Configure containerd to use mirror
apiVersion: v1
kind: ConfigMap
metadata:
  name: containerd-config
data:
  config.toml: |
    [plugins."io.containerd.grpc.v1.cri".registry.mirrors."docker.io"]
      endpoint = ["https://mirror.example.com"]
```

**Use Different Registry:**

```yaml
# Use alternative registries
image: gcr.io/my-project/my-image:tag
image: quay.io/my-org/my-image:tag
image: ghcr.io/my-org/my-image:tag
```

**Pre-pull Images on Nodes:**

```bash
# SSH to node and pull images
ssh <node> docker pull my-image:tag

# Or use DaemonSet to pre-pull
kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: image-puller
spec:
  selector:
    matchLabels:
      app: image-puller
  template:
    metadata:
      labels:
        app: image-puller
    spec:
      containers:
      - name: puller
        image: my-image:tag
        command: ["sleep", "infinity"]
EOF
```

### 6. TLS/SSL Certificate Issues

**Symptoms:**
- Error: "x509: certificate signed by unknown authority"
- Self-signed certificate errors
- Certificate validation failures

**Diagnosis:**

```bash
# Test certificate
openssl s_client -connect registry.example.com:443 -showcerts

# Check certificate chain
curl -v https://registry.example.com/v2/
```

**Solutions:**

**Accept Self-Signed Certificates (Development Only):**

```yaml
# Configure containerd to skip TLS verification
apiVersion: v1
kind: ConfigMap
metadata:
  name: containerd-config
data:
  config.toml: |
    [plugins."io.containerd.grpc.v1.cri".registry.configs."registry.example.com".tls]
      insecure_skip_verify = true
```

**Add CA Certificate:**

```bash
# Add CA certificate to node
sudo cp ca.crt /etc/ssl/certs/
sudo update-ca-certificates

# Or configure in containerd
apiVersion: v1
kind: ConfigMap
metadata:
  name: containerd-config
data:
  config.toml: |
    [plugins."io.containerd.grpc.v1.cri".registry.configs."registry.example.com".tls]
      ca_file = "/etc/ssl/certs/ca.crt"
```

### 7. Insufficient Disk Space

**Symptoms:**
- Error: "no space left on device"
- Pod creation fails after image pull starts
- Node disk usage is high

**Diagnosis:**

```bash
# Check node disk usage
kubectl describe node <node-name> | grep -i "disk"

# Check on node
df -h
docker system df  # If using Docker
crictl images  # If using containerd
```

**Solutions:**

**Clean Up Old Images:**

```bash
# On node, clean up unused images
docker system prune -a --volumes  # Docker
crictl rmi --prune  # containerd

# Configure image garbage collection
# In kubelet config:
# --image-gc-high-threshold=85
# --image-gc-low-threshold=80
```

**Increase Disk Space:**

  ```bash
# Resize disk (cloud provider specific)
# AWS: Resize EBS volume
# GCP: Resize persistent disk
# Azure: Resize managed disk
```

### 8. Image Pull Policy

**Symptoms:**
- Image not updating when tag changes
- Using cached/stale images

**Solutions:**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-app
spec:
  containers:
  - name: app
    image: my-image:latest
    imagePullPolicy: Always  # Always pull, even if cached
    # imagePullPolicy: IfNotPresent  # Pull only if not cached (default)
    # imagePullPolicy: Never  # Never pull, use cache only
```

**Pull Policy Rules:**
- `:latest` tag → Always pull
- Other tags → IfNotPresent (default)
- Digest → Never pull (always use exact image)

## Advanced Troubleshooting

### Testing Image Pull Manually

```bash
# Test from node directly
kubectl debug node/<node-name> -it --image=busybox -- sh

# Inside the debug container:
# Test registry connectivity
wget -O- https://registry-1.docker.io/v2/
curl -I https://registry.example.com/v2/

# Test with crictl (if containerd)
crictl pull my-image:tag

# Test with docker (if Docker)
docker pull my-image:tag
```

### Checking Container Runtime Configuration

```bash
# Check containerd config
cat /etc/containerd/config.toml

# Check Docker daemon config
cat /etc/docker/daemon.json

# Restart container runtime (if config changed)
sudo systemctl restart containerd
sudo systemctl restart docker
```

### Using Image Pull Jobs

```yaml
# Pre-pull images using Jobs
apiVersion: batch/v1
kind: Job
metadata:
  name: image-puller
spec:
  template:
    spec:
      containers:
      - name: puller
        image: my-image:tag
        command: ["sleep", "1"]
      restartPolicy: Never
```

## Prevention Best Practices

### 1. Use Specific Image Tags

```yaml
# Good: Specific version
image: nginx:1.21.6

# Avoid: Latest tag
image: nginx:latest
```

### 2. Use Image Digests for Production

```yaml
# Most reliable: Use digest
image: nginx@sha256:abc123def456...
```

### 3. Pre-pull Critical Images

```bash
# Create DaemonSet to pre-pull images on all nodes
kubectl apply -f image-puller-daemonset.yaml
```

### 4. Use Image Mirrors

Set up local image mirrors to:
- Reduce external dependencies
- Improve pull speeds
- Avoid rate limits
- Maintain offline capability

### 5. Monitor Image Pull Metrics

```promql
# Monitor image pull failures
rate(kubelet_runtime_operations_errors_total{operation_type="PullImage"}[5m])

# Monitor image pull duration
histogram_quantile(0.95, 
  rate(kubelet_runtime_operations_duration_seconds_bucket{operation_type="PullImage"}[5m])
)
```

### 6. Set Up Alerting

Alert on:
- High image pull failure rates
- Image pull timeouts
- Rate limit errors
- Authentication failures

## Automated Detection and Remediation

AlertMend AI can automatically:

- **Detect Image Pull Errors**: Monitor pod status and identify ImagePullBackOff errors
- **Diagnose Root Causes**: Analyze error messages to identify specific issues (authentication, network, rate limits)
- **Suggest Solutions**: Provide specific remediation steps based on error type
- **Automated Remediation**: Fix common issues like creating missing secrets or updating image pull policies
- **Prevent Issues**: Monitor registry connectivity and alert before failures occur

### Integration Example

```yaml
# AlertMend monitors:
- Pod status and events
- Image pull error rates
- Registry connectivity
- Authentication failures
- Rate limit usage
- Node disk space
```

## Conclusion

ImagePullBackOff and ErrImagePull errors in Kubernetes can stem from various causes including incorrect image names, authentication issues, network problems, rate limits, and certificate errors. By following a systematic diagnostic approach—checking pod events, verifying image existence, testing authentication, and examining network connectivity—you can quickly identify and resolve the root cause. Implementing proper image management practices, using specific tags, setting up authentication correctly, and monitoring image pull metrics helps prevent these issues and ensures reliable deployments.

For production environments, automated monitoring and remediation with AlertMend AI can help detect and resolve image pull errors before they significantly impact your applications.

---

*Need help troubleshooting Kubernetes issues? [Learn about AlertMend's automated incident remediation](/solutions/auto-remediation).*
