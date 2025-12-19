---
title: "Kubernetes Node Not Ready: Diagnostic Guide"
excerpt: "Troubleshooting guide for Kubernetes Node Not Ready errors. Diagnose and fix node issues including resource exhaustion and network problems."
date: "2025-05-30"
category: "Kubernetes"
author: "Himanshu Bansal"
keywords: "Kubernetes node not ready, node troubleshooting, kubelet issues, node health, Kubernetes diagnostics, node recovery, cluster management, AlertMend AI"
---

# Kubernetes Node Not Ready: Diagnostic Guide

In Kubernetes clusters, the "Node Not Ready" error is a frequent issue that can disrupt the smooth operation of your applications. This error occurs when a node becomes unresponsive or unavailable for scheduling new pods. Understanding the root causes and effective resolution strategies is crucial for maintaining a healthy Kubernetes environment.

## Understanding Kubernetes Node States

Kubernetes nodes can exist in several states that indicate their health and availability:

### Node States

1. **Ready**: The node is functioning correctly and available to schedule pods
2. **Not Ready**: The node is not functioning properly and cannot schedule new pods
3. **SchedulingDisabled**: The node is available but marked as unschedulable (won't accept new pods)
4. **Unknown**: The node's status cannot be determined, usually due to loss of communication

### Node Conditions

Kubernetes tracks several conditions for each node:

- **Ready**: Node is healthy and ready to accept pods
- **MemoryPressure**: Available memory is low
- **DiskPressure**: Available disk space is low
- **PIDPressure**: Available process IDs are low
- **NetworkUnavailable**: Network is not properly configured

## Diagnostic Workflow

### Step 1: Identify the Problem

```bash
# Check node status
kubectl get nodes

# Get detailed node information
kubectl describe node <node-name>

# Check node conditions
kubectl get node <node-name> -o yaml | grep -A 10 conditions
```

### Step 2: Analyze Node Conditions

```bash
# View all node conditions in readable format
kubectl get node <node-name> -o jsonpath='{range .status.conditions[*]}{.type}{"\t"}{.status}{"\t"}{.reason}{"\t"}{.message}{"\n"}{end}'
```

Example output analysis:
- `Ready=False` - Node is not ready
- `MemoryPressure=True` - Node is out of memory
- `DiskPressure=True` - Node is out of disk space
- `NetworkUnavailable=True` - Network configuration issue

## Common Causes and Solutions

### 1. Resource Exhaustion (CPU/Memory)

**Symptoms:**
- Node shows `MemoryPressure=True` or high CPU usage
- Pods are evicted frequently
- Node becomes unresponsive
- OOMKilled errors in pod logs

**Diagnosis:**

```bash
# Check node resource usage
kubectl top node <node-name>

# View node resource capacity and allocation
kubectl describe node <node-name> | grep -A 10 "Allocated resources"

# Check for OOMKilled pods
kubectl get pods --all-namespaces --field-selector=status.phase=Failed | grep OOMKilled

# Check system memory (on the node)
ssh <node> free -h
ssh <node> df -h

# Check for memory pressure events
kubectl get events --field-selector involvedObject.name=<node-name> --sort-by='.lastTimestamp'
```

**Solutions:**

**Immediate Actions:**
```bash
# Evict pods from the node
kubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data

# After freeing resources, uncordon the node
kubectl uncordon <node-name>
```

**Long-term Solutions:**

1. **Add Resource Limits to Pods:**
   ```yaml
   apiVersion: v1
   kind: Pod
   spec:
     containers:
     - name: app
       resources:
         requests:
           memory: "128Mi"
           cpu: "100m"
         limits:
           memory: "256Mi"
           cpu: "200m"
   ```

2. **Scale the Cluster:**
   ```bash
   # Add more nodes to distribute load
   # For cloud providers, use autoscaling groups
   ```

3. **Optimize Application Resource Usage:**
   - Profile applications to identify memory leaks
   - Optimize container images
   - Implement resource quotas

### 2. Network Connectivity Issues

**Symptoms:**
- Node shows `NetworkUnavailable=True`
- Cannot ping node from control plane
- Node cannot reach API server
- Pods cannot communicate with each other

**Diagnosis:**

```bash
# Check if node can reach API server
kubectl get node <node-name> -o yaml | grep -A 5 addresses

# Test connectivity from control plane to node
ping <node-ip>

# Check node network interfaces (on the node)
ssh <node> ip addr show

# Check routing table (on the node)
ssh <node> ip route show

# Verify CNI plugin is running
kubectl get pods -n kube-system | grep -E 'calico|flannel|weave|cilium'

# Check CNI plugin logs
kubectl logs -n kube-system -l k8s-app=calico-node --tail=50

# Test DNS resolution
kubectl debug node/<node-name> -it --image=busybox -- nslookup kubernetes.default
```

**Solutions:**

**Issue: CNI Plugin Not Running**

```bash
# Check CNI plugin daemonset
kubectl get daemonset -n kube-system

# Restart CNI plugin pods
kubectl delete pod -n kube-system -l k8s-app=calico-node

# Verify recovery
kubectl get pods -n kube-system -l k8s-app=calico-node
```

**Issue: Firewall Blocking Traffic**

```bash
# On the node, check firewall rules
ssh <node> sudo iptables -L -n

# Check if ports are blocked
ssh <node> sudo netstat -tuln | grep -E '10250|10255|30000-32767'

# Configure firewall to allow Kubernetes ports
# TCP 10250 (kubelet API)
# TCP 10255 (read-only kubelet)
# TCP 30000-32767 (NodePort services)
# TCP 10251 (kube-scheduler)
# TCP 10252 (kube-controller-manager)
```

**Issue: Network Configuration**

```bash
# Check network interface configuration
ssh <node> cat /etc/netplan/50-cloud-init.yaml  # Ubuntu
ssh <node> cat /etc/sysconfig/network-scripts/ifcfg-eth0  # RHEL/CentOS

# Restart network service (if needed)
ssh <node> sudo systemctl restart network
```

### 3. Disk Pressure

**Symptoms:**
- Node shows `DiskPressure=True`
- Pods cannot be created
- Container images cannot be pulled
- Log writes fail

**Diagnosis:**

```bash
# Check disk usage on node
kubectl describe node <node-name> | grep -i disk

# Check disk usage (on the node)
ssh <node> df -h

# Check specific directories
ssh <node> du -sh /var/lib/docker/*
ssh <node> du -sh /var/lib/kubelet/*
ssh <node> du -sh /var/log/*

# Check inode usage
ssh <node> df -i

# List large files
ssh <node> find /var/lib/docker -type f -size +100M -exec ls -lh {} \;
```

**Solutions:**

**Clean Up Docker/Container Runtime:**

```bash
# On the node, clean up unused images and containers
ssh <node> docker system prune -a --volumes -f

# For containerd
ssh <node> crictl images
ssh <node> crictl rmi <image-id>
```

**Clean Up kubelet:**

```bash
# Clean up unused pod logs
ssh <node> sudo journalctl --vacuum-time=7d

# Clean up unused volumes
kubectl get pv
kubectl delete pv <unused-pv>

# Configure kubelet garbage collection
# Edit kubelet configuration:
# --image-gc-high-threshold=85
# --image-gc-low-threshold=80
# --eviction-hard=memory.available<100Mi,nodefs.available<10%
```

**Configure Disk Pressure Eviction:**

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
evictionHard:
  memory.available: "200Mi"
  nodefs.available: "10%"
  nodefs.inodesFree: "5%"
evictionSoft:
  memory.available: "300Mi"
  nodefs.available: "15%"
evictionSoftGracePeriod:
  memory.available: "30s"
  nodefs.available: "1m"
```

### 4. kubelet Service Issues

**Symptoms:**
- kubelet process not running
- Node cannot communicate with API server
- Pods cannot be scheduled or started

**Diagnosis:**

```bash
# Check kubelet status (on the node)
ssh <node> sudo systemctl status kubelet

# Check kubelet logs
ssh <node> sudo journalctl -u kubelet -n 100 --no-pager

# Check kubelet configuration
ssh <node> cat /var/lib/kubelet/config.yaml

# Verify kubelet can access kubeconfig
ssh <node> sudo cat /var/lib/kubelet/kubeconfig

# Check kubelet certificates
ssh <node> sudo ls -la /var/lib/kubelet/pki/
```

**Solutions:**

**Issue: kubelet Not Running**

```bash
# Start kubelet service
ssh <node> sudo systemctl start kubelet

# Enable kubelet to start on boot
ssh <node> sudo systemctl enable kubelet

# Check status
ssh <node> sudo systemctl status kubelet
```

**Issue: kubelet Certificate Problems**

```bash
# Check certificate expiration
ssh <node> sudo openssl x509 -in /var/lib/kubelet/pki/kubelet-client-current.pem -noout -dates

# If expired, delete and let kubelet regenerate
ssh <node> sudo rm /var/lib/kubelet/pki/kubelet-client-*.pem
ssh <node> sudo systemctl restart kubelet
```

**Issue: kubelet Configuration Errors**

```bash
# Validate kubelet configuration
ssh <node> sudo kubelet --config=/var/lib/kubelet/config.yaml --validate

# Check for configuration syntax errors
ssh <node> sudo cat /var/lib/kubelet/config.yaml | yamllint
```

### 5. Container Runtime Issues

**Symptoms:**
- Pods stuck in ContainerCreating state
- Image pull errors
- Container runtime errors in logs

**Diagnosis:**

```bash
# Check container runtime status (Docker)
ssh <node> sudo systemctl status docker

# Check container runtime status (containerd)
ssh <node> sudo systemctl status containerd

# Check runtime logs
ssh <node> sudo journalctl -u docker -n 100
ssh <node> sudo journalctl -u containerd -n 100

# Test container runtime
ssh <node> docker ps
ssh <node> crictl ps

# Check for image pull errors
kubectl describe pod <pod-name> | grep -A 10 Events
```

**Solutions:**

**Issue: Docker/Containerd Not Running**

```bash
# Restart container runtime
ssh <node> sudo systemctl restart docker
# OR
ssh <node> sudo systemctl restart containerd

# Verify it's running
ssh <node> sudo systemctl status docker
```

**Issue: Image Pull Failures**

```bash
# Check image pull secrets
kubectl get secrets --all-namespaces | grep docker-registry

# Test manual image pull (on node)
ssh <node> docker pull <image-name>
ssh <node> crictl pull <image-name>

# Check registry connectivity
ssh <node> curl -I https://registry.example.com/v2/
```

### 6. API Server Connectivity Issues

**Symptoms:**
- Node cannot reach API server
- Node status shows Unknown
- kubelet logs show connection errors

**Diagnosis:**

```bash
# Test API server connectivity from node
ssh <node> curl -k https://<api-server-ip>:6443/healthz

# Check kubelet API server configuration
ssh <node> cat /var/lib/kubelet/kubeconfig

# Test with kubectl from node
ssh <node> kubectl get nodes

# Check network connectivity
ssh <node> ping <api-server-ip>
ssh <node> telnet <api-server-ip> 6443
```

**Solutions:**

**Issue: API Server Certificate Problems**

  ```bash
# Update kubeconfig on node
# Copy kubeconfig from control plane or regenerate
ssh <node> sudo mkdir -p /var/lib/kubelet
ssh <node> sudo cp <new-kubeconfig> /var/lib/kubelet/kubeconfig
ssh <node> sudo systemctl restart kubelet
```

**Issue: Network Routing Problems**

  ```bash
# Check routing to API server
ssh <node> ip route get <api-server-ip>

# Verify DNS resolution
ssh <node> nslookup <api-server-hostname>

# Check for network policies blocking traffic
kubectl get networkpolicies --all-namespaces
```

## Advanced Troubleshooting

### Using Node Debug Container

Kubernetes provides a debug container feature for troubleshooting:

  ```bash
# Create debug pod on the node
kubectl debug node/<node-name> -it --image=busybox

# Inside the debug container, you can:
# - Check network connectivity
# - Test DNS resolution
# - Inspect filesystem
# - Check processes
```

### Collecting Diagnostic Information

```bash
# Collect comprehensive node information
kubectl get node <node-name> -o yaml > node-status.yaml

# Collect events
kubectl get events --field-selector involvedObject.name=<node-name> > node-events.yaml

# Collect kubelet logs
ssh <node> sudo journalctl -u kubelet --since "1 hour ago" > kubelet-logs.txt

# Collect system information
ssh <node> dmesg > dmesg.log
ssh <node> /proc/meminfo > meminfo.txt
ssh <node> /proc/cpuinfo > cpuinfo.txt
```

### Node Recovery Procedures

**Cordon and Drain:**

```bash
# Mark node as unschedulable
kubectl cordon <node-name>

# Evict all pods gracefully
kubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data --force --grace-period=300

# After fixing issues, uncordon the node
kubectl uncordon <node-name>
```

**Node Reset (Last Resort):**

```bash
# On the node, reset kubelet
ssh <node> sudo kubeadm reset

# Clean up
ssh <node> sudo rm -rf /etc/cni/net.d
ssh <node> sudo rm -rf /var/lib/etcd
ssh <node> sudo rm -rf /var/lib/kubelet

# Rejoin cluster (get join command from control plane)
kubectl get nodes  # Verify rejoin
```

## Prevention and Best Practices

### 1. Implement Resource Monitoring

```yaml
# Deploy node exporter for monitoring
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: node-exporter
spec:
  selector:
    matchLabels:
      app: node-exporter
  template:
    metadata:
      labels:
        app: node-exporter
    spec:
      containers:
      - name: node-exporter
        image: prom/node-exporter:latest
        ports:
        - containerPort: 9100
        volumeMounts:
        - name: proc
          mountPath: /host/proc
        - name: sys
          mountPath: /host/sys
      volumes:
      - name: proc
        hostPath:
          path: /proc
      - name: sys
        hostPath:
          path: /sys
```

### 2. Configure Resource Quotas

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-quota
  namespace: production
spec:
  hard:
    requests.cpu: "10"
    requests.memory: 20Gi
    limits.cpu: "20"
    limits.memory: 40Gi
```

### 3. Set Up Health Checks

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: node-health-check
spec:
  hostNetwork: true
  containers:
  - name: health-check
    image: busybox
    command: ["/bin/sh", "-c"]
    args:
    - |
      while true; do
        if ! ping -c 1 <api-server-ip>; then
          echo "API server unreachable"
          exit 1
        fi
        sleep 60
      done
```

### 4. Implement Node Autoscaling

Configure cluster autoscaling to automatically add nodes when resources are low:

```yaml
# For cloud providers, configure node groups with autoscaling
# Example for AWS EKS:
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig
metadata:
  name: my-cluster
nodeGroups:
  - name: ng-1
    desiredCapacity: 2
    minSize: 1
    maxSize: 10
    volumeSize: 100
    instanceType: m5.large
```

## Automated Detection and Remediation

AlertMend AI can automatically:

- **Monitor Node Health**: Continuously monitor node conditions and resource usage
- **Detect Issues Early**: Identify nodes approaching Not Ready state before they fail
- **Diagnose Root Causes**: Analyze node failures and identify specific problems (memory, disk, network, kubelet)
- **Automated Remediation**: Automatically drain nodes, clean up resources, or restart services
- **Alert on Patterns**: Identify patterns like recurring node failures or resource exhaustion trends

### Integration Example

```yaml
# AlertMend monitors these node metrics:
- Node condition status (Ready, MemoryPressure, DiskPressure)
- kubelet health and response time
- Resource usage (CPU, memory, disk)
- Network connectivity to API server
- Container runtime health
- Pod eviction events
```

## Conclusion

Kubernetes Node Not Ready errors can have various causes, from resource exhaustion to network issues to kubelet failures. By following a systematic diagnostic approach, checking node conditions, and applying appropriate solutions, you can quickly restore nodes to a Ready state. Implementing monitoring, resource quotas, and automated remediation with AlertMend AI helps prevent and quickly resolve node issues, maintaining cluster reliability and availability.

---

*Need help with Kubernetes node management? [Learn about AlertMend's Kubernetes management solutions](/solutions/kubernetes-management).*
