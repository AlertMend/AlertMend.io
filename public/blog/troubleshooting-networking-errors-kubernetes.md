---
title: "Troubleshooting Kubernetes Networking Issues: Common Problems and Solutions"
excerpt: "Complete guide to troubleshooting Kubernetes networking problems including pod-to-pod communication, service discovery, ingress issues, CNI problems, and network policy debugging."
date: "2025-06-27"
category: "Kubernetes"
author: "Arvind Rajpurohit"
keywords: "Kubernetes networking, troubleshooting Kubernetes, pod communication issues, service discovery problems, ingress troubleshooting, automated incident remediation, Kubernetes management solutions, AlertMend AI"
---

# Troubleshooting Kubernetes Networking Issues: Common Problems and Solutions

Networking is one of the most critical components in any Kubernetes deployment, facilitating communication between pods, services, and external resources. When networking issues occur, they can completely disrupt application functionality. This comprehensive guide covers common networking problems and their solutions.

## Understanding Kubernetes Networking Fundamentals

Before troubleshooting, it's essential to understand how Kubernetes networking works:

### Core Networking Concepts

- **Pod Network**: Each pod gets its own IP address from the cluster CIDR
- **Service Network**: Services provide stable endpoints for pod groups
- **CNI Plugins**: Container Network Interface plugins manage pod networking
- **kube-proxy**: Implements service networking and load balancing
- **DNS**: CoreDNS provides service discovery via DNS names

### Network Components to Monitor

- CNI plugin pods (e.g., Calico, Flannel, Weave Net)
- kube-proxy daemonset
- CoreDNS pods
- Ingress controller pods
- Network policy controllers

## Common Networking Issues and Solutions

### 1. Pod-to-Pod Communication Fails

**Symptoms:**
- Pods cannot reach each other using IP addresses
- Connection timeouts between pods
- "Network unreachable" or "No route to host" errors
- Intermittent connectivity issues

**Diagnosis Steps:**

```bash
# Test connectivity between pods
kubectl exec -it <pod-1-name> -- ping <pod-2-ip>

# Check pod IPs
kubectl get pods -o wide

# Verify CNI plugin is running
kubectl get pods -n kube-system | grep -E 'calico|flannel|weave|cilium'

# Check CNI plugin logs
kubectl logs -n kube-system -l k8s-app=calico-node --tail=50

# Verify node network configuration
ip addr show
ip route show

# Check if pods can reach nodes
kubectl exec -it <pod-name> -- ping <node-ip>

# Test DNS resolution
kubectl exec -it <pod-name> -- nslookup kubernetes.default
```

**Root Causes and Solutions:**

**Issue: CNI Plugin Not Installed or Not Running**

```bash
# Check CNI plugin status
kubectl get daemonset -n kube-system

# If missing, install CNI plugin (example for Calico)
kubectl apply -f https://docs.projectcalico.org/manifests/calico.yaml

# Verify installation
kubectl get pods -n kube-system -w
```

**Issue: Pod CIDR Misconfiguration**

Check cluster CIDR configuration:

```bash
# Check kube-controller-manager CIDR settings
kubectl get pod kube-controller-manager-<node> -n kube-system -o yaml | grep cluster-cidr

# Verify CNI plugin CIDR matches cluster CIDR
kubectl get configmap -n kube-system | grep -i cidr
```

**Issue: Network Policies Blocking Traffic**

```bash
# List network policies
kubectl get networkpolicies --all-namespaces

# Check if policies are blocking traffic
kubectl describe networkpolicy <policy-name> -n <namespace>

# Temporarily test by deleting policies (in non-production)
kubectl delete networkpolicy <policy-name> -n <namespace>
```

**Solution: Fix Network Policy Rules**

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-pod-to-pod
  namespace: default
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector: {}
    - namespaceSelector: {}
  egress:
  - to:
    - podSelector: {}
    - namespaceSelector: {}
  - to:
    - namespaceSelector: {}
      podSelector:
        matchLabels:
          k8s-app: kube-dns
    ports:
    - protocol: UDP
      port: 53
```

### 2. Service Discovery Issues

**Symptoms:**
- Services cannot be resolved by DNS name
- "Connection refused" errors when accessing services
- Services resolve but don't route to pods
- Intermittent service connectivity

**Diagnosis:**

```bash
# Test DNS resolution from pod
kubectl run -it --rm debug --image=busybox --restart=Never -- nslookup <service-name>

# Check service endpoints
kubectl get endpoints <service-name>

# Verify service selector matches pod labels
kubectl get service <service-name> -o yaml
kubectl get pods -l <label-selector>

# Check CoreDNS pods
kubectl get pods -n kube-system -l k8s-app=kube-dns

# View CoreDNS logs
kubectl logs -n kube-system -l k8s-app=kube-dns --tail=100

# Test CoreDNS connectivity
kubectl exec -it <pod-name> -- dig @<coredns-ip> <service-name>.default.svc.cluster.local
```

**Common Issues:**

**Issue: Service Has No Endpoints**

```bash
# Check if pods match service selector
kubectl get pods --show-labels
kubectl get service <service-name> -o jsonpath='{.spec.selector}'

# If labels don't match, update either pods or service
kubectl label pods <pod-name> <key>=<value>
# OR
kubectl edit service <service-name>
```

**Issue: CoreDNS Not Running**

```bash
# Check CoreDNS status
kubectl get pods -n kube-system -l k8s-app=kube-dns

# Restart CoreDNS if needed
kubectl delete pod -n kube-system -l k8s-app=kube-dns

# Verify CoreDNS recovers
kubectl get pods -n kube-system -l k8s-app=kube-dns -w
```

**Issue: DNS Queries Timing Out**

```bash
# Check CoreDNS resource limits
kubectl describe pod -n kube-system -l k8s-app=kube-dns | grep -A 5 Resources

# Increase CoreDNS resources if needed
kubectl edit deployment coredns -n kube-system
# Add/update:
# resources:
#   requests:
#     memory: "256Mi"
#     cpu: "250m"
#   limits:
#     memory: "512Mi"
#     cpu: "500m"
```

### 3. Ingress Not Working

**Symptoms:**
- External traffic cannot reach services
- 502 Bad Gateway errors
- 404 Not Found errors
- Ingress controller not responding
- TLS/SSL certificate errors

**Diagnosis:**

```bash
# Check ingress resource
kubectl get ingress
kubectl describe ingress <ingress-name>

# Verify ingress controller is running
kubectl get pods -n ingress-nginx  # or your ingress namespace

# Check ingress controller logs
kubectl logs -n ingress-nginx -l app.kubernetes.io/component=controller --tail=100

# Test backend service directly
kubectl port-forward service/<backend-service> 8080:80
curl http://localhost:8080

# Check ingress controller service
kubectl get service -n ingress-nginx

# Verify ingress controller can reach backend
kubectl exec -n ingress-nginx <ingress-controller-pod> -- wget -O- http://<backend-service>:<port>
```

**Common Issues:**

**Issue: Ingress Controller Not Installed**

Install NGINX Ingress Controller:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml

# Verify installation
kubectl get pods -n ingress-nginx -w
```

**Issue: Ingress Rules Misconfigured**

```yaml
# Correct ingress configuration
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
            name: my-app-service
            port:
              number: 80
  tls:
  - hosts:
    - myapp.example.com
    secretName: myapp-tls-secret
```

**Issue: Backend Service Not Accessible**

```bash
# Verify service exists and has endpoints
kubectl get service <backend-service>
kubectl get endpoints <backend-service>

# Check if service is in same namespace as ingress
kubectl get ingress <ingress-name> -o jsonpath='{.spec.rules[*].http.paths[*].backend.service.name}'
kubectl get service -n <namespace>
```

**Issue: TLS Certificate Problems**

```bash
# Check TLS secret exists
kubectl get secret <tls-secret-name>

# Verify certificate
kubectl get secret <tls-secret-name> -o jsonpath='{.data.tls\.crt}' | base64 -d | openssl x509 -text -noout

# Create TLS secret if missing
kubectl create secret tls <tls-secret-name> --cert=path/to/cert.crt --key=path/to/key.key
```

### 4. kube-proxy Issues

**Symptoms:**
- Services not load balancing correctly
- Service IPs not working
- Connection timeouts to services
- iptables rules incorrect

**Diagnosis:**

```bash
# Check kube-proxy pods
kubectl get pods -n kube-system -l k8s-app=kube-proxy

# View kube-proxy logs
kubectl logs -n kube-system -l k8s-app=kube-proxy --tail=100

# Check iptables rules (on node)
sudo iptables -t nat -L | grep <service-name>

# Verify kube-proxy mode
kubectl get configmap kube-proxy -n kube-system -o yaml | grep mode
```

**Common Issues:**

**Issue: kube-proxy Not Running**

```bash
# Restart kube-proxy daemonset
kubectl delete pod -n kube-system -l k8s-app=kube-proxy

# Verify recovery
kubectl get pods -n kube-system -l k8s-app=kube-proxy
```

**Issue: Wrong kube-proxy Mode**

```bash
# Check current mode
kubectl get configmap kube-proxy -n kube-system -o yaml

# For better performance, use IPVS mode
kubectl edit configmap kube-proxy -n kube-system
# Update mode: "ipvs"
# Then restart kube-proxy pods
```

### 5. Network Policy Problems

**Symptoms:**
- Unexpected traffic blocked
- Allowed traffic still blocked
- Policies not taking effect

**Diagnosis:**

```bash
# List all network policies
kubectl get networkpolicies --all-namespaces

# Describe specific policy
kubectl describe networkpolicy <policy-name> -n <namespace>

# Check if network policy controller is running (for CNI plugins)
kubectl get pods -n kube-system | grep -i policy
```

**Common Issues:**

**Issue: Default Deny Policy Too Restrictive**

```yaml
# Allow DNS traffic explicitly
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-dns
  namespace: default
spec:
  podSelector: {}
  policyTypes:
  - Egress
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: kube-system
    ports:
    - protocol: UDP
      port: 53
    - protocol: TCP
      port: 53
```

**Issue: Policy Selectors Don't Match**

```bash
# Verify pod labels match policy selectors
kubectl get pods --show-labels
kubectl get networkpolicy <policy-name> -o yaml | grep -A 10 selector
```

## Advanced Troubleshooting Techniques

### Network Diagnostics Pod

Create a diagnostic pod for network testing:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: network-diag
spec:
  containers:
  - name: tools
    image: nicolaka/netshoot
    command: ["/bin/bash"]
    args: ["-c", "sleep 3600"]
```

Use it for testing:

```bash
kubectl exec -it network-diag -- bash

# Inside the pod:
# Test DNS
nslookup <service-name>
dig <service-name>.default.svc.cluster.local

# Test connectivity
curl http://<service-name>:<port>
telnet <pod-ip> <port>

# Check routing
ip route
traceroute <destination>
```

### Network Monitoring

Monitor network metrics:

```bash
# Install network monitoring tools
kubectl apply -f https://raw.githubusercontent.com/cilium/cilium/v1.14/install/kubernetes/quick-install.yaml

# View network flows
cilium status
cilium connectivity test
```

### Packet Capture

Capture network traffic for analysis:

```bash
# On node, capture traffic
sudo tcpdump -i any -w capture.pcap

# Filter for specific service
sudo tcpdump -i any host <service-ip> -w service-traffic.pcap

# Analyze with Wireshark or tcpdump
tcpdump -r capture.pcap -A
```

## Best Practices for Kubernetes Networking

### 1. Use Network Policies

Implement network policies for security:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: production
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
```

### 2. Monitor Network Metrics

Track key network metrics:
- Network latency between pods
- Packet loss rates
- DNS query latency
- Service endpoint availability
- Ingress request rates and errors

### 3. Use Service Mesh for Advanced Networking

Consider service mesh solutions for:
- mTLS between services
- Advanced traffic management
- Observability
- Circuit breaking

### 4. Regular Network Testing

Implement automated network connectivity tests:

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: network-connectivity-test
spec:
  schedule: "*/5 * * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: test
            image: busybox
            command:
            - /bin/sh
            - -c
            - |
              for service in service1 service2 service3; do
                if ! nslookup $service; then
                  echo "DNS resolution failed for $service"
                  exit 1
                fi
              done
          restartPolicy: OnFailure
```

### 5. Document Network Architecture

Maintain documentation for:
- CNI plugin used
- Network CIDR ranges
- Service IP ranges
- Ingress controller configuration
- Network policy rules

## Automated Troubleshooting with AlertMend

AlertMend AI can automatically:

- **Detect Network Issues Early**: Monitor network metrics and detect anomalies before they impact users
- **Diagnose Root Causes**: Analyze network failures and identify whether issues are CNI-related, DNS-related, or service configuration problems
- **Remediate Common Problems**: Automatically fix common networking issues like restarting failed CNI pods or correcting misconfigured services
- **Network Health Dashboards**: Provide comprehensive views of network health across the cluster
- **Alert on Network Degradation**: Set intelligent alerts for network latency, packet loss, and connectivity issues

### Integration Examples

```yaml
# AlertMend monitors these network components automatically:
- CNI plugin pod health
- kube-proxy daemonset status
- CoreDNS availability and latency
- Service endpoint health
- Ingress controller metrics
- Network policy effectiveness
```

## Conclusion

Kubernetes networking issues can be complex, but systematic troubleshooting helps identify and resolve problems quickly. By understanding the networking stack, using proper diagnostic tools, and following best practices, you can maintain reliable network connectivity in your Kubernetes clusters. Automated monitoring and remediation with AlertMend AI can further reduce the impact of networking issues and improve overall cluster reliability.

---

*Need help with Kubernetes networking? [Learn about AlertMend's Kubernetes management solutions](/solutions/kubernetes-management).*
