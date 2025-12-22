---
title: "Kubernetes DNS Configuration Guide"
excerpt: "Complete guide to Kubernetes DNS configuration, CoreDNS setup, troubleshooting DNS issues, and optimizing DNS performance for service discovery."
date: "2025-06-7"
category: "Kubernetes"
author: "Arvind Rajpurohit"
keywords: "Kubernetes, AlertMend AI, AIOps, DevOps, container orchestration, Kubernetes monitoring, Kubernetes troubleshooting, Kubernetes automation"
---


# Kubernetes DNS Configuration Guide
---

Kubernetes DNS plays a vital role in managing network communications within a cluster. It simplifies service discovery and ensures that all components—pods, services, and external systems—can communicate efficiently without relying on static IP addresses. This blog will explore the basics of Kubernetes DNS, how it works, and troubleshooting common DNS-related issues.

---

## 🔍 **What is Kubernetes DNS?**

Kubernetes DNS is a built-in service that provides name resolution for pods and services within the cluster. It automatically assigns DNS names to services and pods, allowing them to communicate using hostnames instead of IP addresses. This dynamic name resolution is critical in Kubernetes’ ever-changing environment where services and pods can be created or destroyed at any time.

### How Kubernetes DNS Works:
- **Services**: Kubernetes automatically creates DNS records for every service, allowing other services and pods to use the service's name to connect.
- **Pods**: Each pod gets a DNS name following the format `pod-name.namespace.pod.cluster.local`, enabling direct communication within the cluster.
- **DNS Resolution**: Services can be accessed via their DNS names, such as `service-name.namespace.svc.cluster.local`. The suffix `.svc.cluster.local` represents the default DNS zone for Kubernetes services.
- **External DNS Resolution**: CoreDNS forwards DNS requests for external services to an upstream DNS server (e.g., 8.8.8.8) when they cannot be resolved locally.

---

## 🔧 **Common DNS Issues and Troubleshooting**

DNS issues can cause serious disruptions in your Kubernetes environment, affecting service discovery and communication between pods. Let’s explore some common problems and how to troubleshoot them:

| **DNS Issue**           | **Description**                                                               | **Troubleshooting**                                                                                                 |
|-------------------------|-------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------|
| **DNS Resolution Failure** | Services or pods fail to resolve DNS queries, disrupting communication.        | Use `kubectl exec` for `nslookup`, check CoreDNS logs with `kubectl logs -n kube-system -l k8s-app=kube-dns`.       |
| **Misconfigured CoreDNS**  | CoreDNS may be overwhelmed or incorrectly configured, causing latency or failures.| Check CoreDNS ConfigMap, verify `Corefile`, and check resource allocation for CoreDNS using `kubectl get configmap`.|
| **Cluster-Wide DNS Downtime** | CoreDNS pods may be down or misconfigured, causing DNS to fail for the entire cluster.| Ensure CoreDNS pods are running with `kubectl get pods -n kube-system -l k8s-app=kube-dns`, and check resource allocation.|

### 1. **DNS Resolution Failure**
This occurs when services or pods fail to resolve DNS queries, leading to communication breakdowns.

**Solution**:
- Use `kubectl exec` to verify DNS resolution from inside a pod:
  ```bash
  kubectl exec -it <pod-name> -- nslookup <service-name>
  ```
- Check the CoreDNS logs with:
  ```bash
  kubectl logs -n kube-system -l k8s-app=kube-dns
  ```

### 2. **Misconfigured CoreDNS**
CoreDNS is the default DNS server in Kubernetes. If it's misconfigured or overwhelmed, you may experience high latency or failed DNS lookups.

**Solution**:
- Check the CoreDNS configuration using:
  ```bash
  kubectl get configmap coredns -n kube-system -o yaml
  ```
- Ensure that there are no issues with the `Corefile`, which defines DNS behavior.

### 3. **Cluster-Wide DNS Downtime**
If DNS is unavailable cluster-wide, it could indicate that the CoreDNS pods are down or misconfigured.

**Solution**:
- Confirm CoreDNS is running:
  ```bash
  kubectl get pods -n kube-system -l k8s-app=kube-dns
  ```
- Ensure sufficient resource allocation for CoreDNS to prevent bottlenecks under high traffic.

---

## 🛡️ **Best Practices for Optimizing Kubernetes DNS**

### 1. **Enable DNS Caching**
Enabling DNS caching in CoreDNS can reduce the load on DNS servers and improve resolution times. This is especially useful in large clusters with frequent DNS lookups.

### 2. **Use Custom DNS Entries**
For services with non-standard name resolution needs, you can configure custom DNS entries in CoreDNS, enabling flexible service discovery across external systems.

### 3. **Monitor DNS Performance**

Using tools like Prometheus, you can monitor the following key CoreDNS metrics:

| **Metric**                        | **Description**                                                                 |
|-----------------------------------|---------------------------------------------------------------------------------|
| **Query Response Time**           | Measures how quickly CoreDNS responds to DNS requests (e.g., `coredns_dns_request_duration_seconds`)|
| **Cache Hit/Miss Ratios**         | Tracks how often DNS queries are resolved from the cache, improving performance.|
| **Queries per Second (QPS)**      | Tracks the volume of DNS queries handled by CoreDNS, useful for capacity planning.|

### 4. **Implement NodeLocal DNS Cache**
Consider using **NodeLocal DNS Cache**, which runs a local DNS cache on each node. This improves DNS performance by resolving requests locally and reducing the load on CoreDNS.

### 5. **Ensure High Availability for CoreDNS**
Deploy CoreDNS on dedicated nodes or ensure it runs as a highly available service. This will prevent DNS outages in the event of node failures.

---

## Configuring CoreDNS for Optimal Performance

### Custom CoreDNS Configuration

You can customize CoreDNS behavior by modifying the ConfigMap:

```bash
# Edit CoreDNS ConfigMap
kubectl edit configmap coredns -n kube-system
```

Example Corefile configuration:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: coredns
  namespace: kube-system
data:
  Corefile: |
    .:53 {
        errors
        health {
           lameduck 5s
        }
        ready
        kubernetes cluster.local in-addr.arpa ip6.arpa {
           pods insecure
           fallthrough in-addr.arpa ip6.arpa
           ttl 30
        }
        prometheus :9153
        forward . /etc/resolv.conf {
           max_concurrent 1000
        }
        cache 30
        loop
        reload
        loadbalance
    }
```

### Key Configuration Options

- **`cache 30`**: Cache DNS responses for 30 seconds
- **`max_concurrent 1000`**: Limit concurrent upstream queries
- **`ttl 30`**: Set TTL for DNS records
- **`pods insecure`**: Enable pod DNS records (use `pods verified` for production)

### Resource Limits for CoreDNS

Ensure CoreDNS has adequate resources:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: coredns
  namespace: kube-system
spec:
  template:
    spec:
      containers:
      - name: coredns
        resources:
          requests:
            memory: "70Mi"
            cpu: "100m"
          limits:
            memory: "170Mi"
            cpu: "200m"
```

## Advanced DNS Configuration

### Custom DNS Entries

Add custom DNS entries for external services:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: coredns-custom
  namespace: kube-system
data:
  example.server: |
    example.com:53 {
        hosts {
            10.0.0.1 api.example.com
            10.0.0.2 db.example.com
            fallthrough
        }
    }
```

### Split-DNS Configuration

Configure different DNS behavior for internal and external queries:

```yaml
.:53 {
    kubernetes cluster.local {
        pods verified
    }
    forward . 8.8.8.8 8.8.4.4
}

internal.example.com:53 {
    hosts {
        192.168.1.10 internal-service
    }
}
```

### DNS Policies in Pod Specs

Configure DNS policy for pods:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: dns-example
spec:
  dnsPolicy: ClusterFirst  # Options: ClusterFirst, ClusterFirstWithHostNet, Default, None
  dnsConfig:
    nameservers:
      - 1.2.3.4
    searches:
      - ns1.svc.cluster.local
      - my.dns.search.suffix
    options:
      - name: ndots
        value: "2"
      - name: edns0
```

## Troubleshooting DNS Issues

### Complete DNS Diagnostic Checklist

1. **Verify CoreDNS Pods Are Running**
   ```bash
   kubectl get pods -n kube-system -l k8s-app=kube-dns
   ```

2. **Check CoreDNS Logs**
   ```bash
   kubectl logs -n kube-system -l k8s-app=kube-dns --tail=100
   ```

3. **Test DNS Resolution from Pod**
   ```bash
   kubectl run -it --rm debug --image=busybox --restart=Never -- nslookup kubernetes.default
   ```

4. **Verify Service Endpoints**
   ```bash
   kubectl get endpoints kube-dns -n kube-system
   ```

5. **Check DNS Configuration**
   ```bash
   kubectl get configmap coredns -n kube-system -o yaml
   ```

6. **Test from Application Pod**
   ```bash
   kubectl exec -it <pod-name> -- nslookup <service-name>
   kubectl exec -it <pod-name> -- dig <service-name>.default.svc.cluster.local
   ```

### Common DNS Problems and Solutions

**Problem**: DNS queries timing out

**Solutions**:
- Increase CoreDNS resource limits
- Check network policies blocking DNS traffic (port 53)
- Verify CoreDNS pods can reach upstream DNS servers
- Check for DNS loops in Corefile configuration

**Problem**: Intermittent DNS resolution failures

**Solutions**:
- Enable DNS caching in CoreDNS
- Implement NodeLocal DNS Cache
- Check for CoreDNS pod restarts
- Monitor DNS query rates and increase resources if needed

**Problem**: External DNS resolution not working

**Solutions**:
- Verify upstream DNS servers in Corefile
- Check firewall rules allowing DNS queries (port 53 UDP)
- Test upstream DNS servers: `kubectl exec -it coredns-xxx -n kube-system -- nslookup google.com 8.8.8.8`

## NodeLocal DNS Cache Implementation

NodeLocal DNS Cache improves DNS performance by caching DNS queries at the node level:

```bash
# Deploy NodeLocal DNS Cache
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dns/master/examples/node-local-dns/nodelocaldns.yaml
```

Configuration:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: nodelocaldns
  namespace: kube-system
data:
  Corefile: |
    cluster.local:53 {
        errors
        cache {
            success 9984 30
            denial 9984 5
        }
        reload
        loop
        bind 169.254.20.10
        forward . __PILLAR__CLUSTER__DNS__ {
            force_tcp
        }
        prometheus :9253
        health 169.254.20.10:8080
    }
    in-addr.arpa:53 {
        errors
        cache 30
        reload
        loop
        bind 169.254.20.10
        forward . __PILLAR__CLUSTER__DNS__ {
            force_tcp
        }
        prometheus :9253
    }
    ip6.arpa:53 {
        errors
        cache 30
        reload
        loop
        bind 169.254.20.10
        forward . __PILLAR__CLUSTER__DNS__ {
            force_tcp
        }
        prometheus :9253
    }
    .:53 {
        errors
        cache 30
        reload
        loop
        bind 169.254.20.10
        forward . __PILLAR__UPSTREAM__SERVERS__ {
            force_tcp
        }
        prometheus :9253
    }
```

## Monitoring DNS Performance

### Key Metrics to Monitor

- **DNS Query Latency**: `coredns_dns_request_duration_seconds`
- **Query Rate**: `coredns_dns_requests_total`
- **Cache Hit Rate**: `coredns_cache_hits_total` vs `coredns_cache_misses_total`
- **Error Rate**: `coredns_dns_responses_total{rcode!="NOERROR"}`
- **CoreDNS Memory Usage**: Container memory metrics

### Prometheus Queries

```promql
# Average DNS query latency
rate(coredns_dns_request_duration_seconds_sum[5m]) / rate(coredns_dns_request_duration_seconds_count[5m])

# DNS query rate
rate(coredns_dns_requests_total[5m])

# Cache hit ratio
rate(coredns_cache_hits_total[5m]) / (rate(coredns_cache_hits_total[5m]) + rate(coredns_cache_misses_total[5m]))

# Error rate by type
rate(coredns_dns_responses_total{rcode!="NOERROR"}[5m])
```

## Security Considerations

### DNS Security Best Practices

1. **Use Verified Pod DNS Records**: Set `pods verified` instead of `pods insecure`
2. **Restrict DNS Access**: Use NetworkPolicies to control DNS access
3. **Monitor DNS Queries**: Log and monitor DNS queries for security analysis
4. **Use DNS over TLS**: Configure upstream DNS servers with TLS when possible
5. **Regular Updates**: Keep CoreDNS updated to latest versions

Example NetworkPolicy for DNS:

```yaml
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

## 🚀 **Conclusion**

Kubernetes DNS is essential for efficient service discovery and communication within a Kubernetes cluster. By understanding how DNS works in Kubernetes, configuring CoreDNS optimally, and following best practices, you can prevent common DNS issues and ensure seamless cluster communication. Regularly monitor DNS performance, enable caching, implement NodeLocal DNS Cache for large clusters, and optimize CoreDNS configurations to keep your Kubernetes environment running smoothly.

For production environments, consider implementing automated DNS monitoring and alerting with AlertMend AI to quickly detect and resolve DNS-related issues before they impact your applications.
