---
title: "Load Balancing and Scaling Long-Lived Connections in Kubernetes"
excerpt: "Understand how Kubernetes handles WebSockets, gRPC, and database connections—and learn how to properly scale and load balance persistent traffic."
date: "2025-07-30"
category: "Kubernetes"
author: "Arvind Rajpurohit"
---

# Load Balancing and Scaling Long-Lived Connections in Kubernetes

Kubernetes doesn’t natively load balance long-lived connections like **WebSockets**, **gRPC**, or **persistent database connections**. This can lead to uneven traffic distribution across Pods.

> To handle these use cases effectively, consider **client-side load balancing** or a proxy like **Envoy**, **HAProxy**, or **Istio**.

---

## Kubernetes Basics: Services and Deployments

Kubernetes provides two key abstractions for deploying and scaling applications:

- **Deployments** define what kind of application you’re running and how many Pods should be active.
- **Services** act as stable access points to those Pods and handle network routing.



While Kubernetes Services appear to load balance traffic, they don’t function like traditional load balancers. **kube-proxy** sets up routing rules using iptables, IPVS, or eBPF.

---

## The Problem: Long-Lived Connections Don't Load Balance Well

For persistent protocols like:

- HTTP/2
- WebSockets
- gRPC
- AMQP

Kubernetes **does not distribute traffic evenly**. Here’s what happens:

1. The client connects to a Service.
2. One Pod is selected.
3. That connection stays open indefinitely.
4. All requests flow to the same Pod.

> Result: One Pod handles everything, while others remain idle — defeating the purpose of scaling.


---

## How Kubernetes Handles Service Traffic

Under the hood:

- Services use **iptables**, **IPVS**, or **eBPF** to route connections.
- Each new connection gets assigned to a random Pod.
- Once established, **all traffic sticks to that Pod**.

Works great for stateless HTTP  
Fails for persistent TCP connections

---

## Real-World Impact Example

You have:

- One frontend Pod
- Three backend Pods
- Frontend uses HTTP Keep-Alive or gRPC

### What happens?

- Frontend opens a persistent connection
- kube-proxy selects one backend Pod
- All requests stay bound to that Pod
- The other backend Pods remain unused

---

## Client-Side Load Balancing to the Rescue

To solve this:

1. Use a **Headless Service** to get all backend Pod IPs
2. Implement logic in your app to:
   - Connect to each Pod
   - Rotate requests (round-robin, etc.)
   - Periodically refresh Pod list

> This requires effort but gives you **true load balancing for persistent connections**.

---

## What About Databases?

Yes same problem applies!

Using a Service to connect to **PostgreSQL** or **MySQL** with persistent connections leads to uneven traffic.

### Solutions:

- Use JDBC with built-in balancing:
  ```bash
  jdbc:postgresql://node1,node2,node3/db?loadBalanceHosts=true

This architecture helps avoid sticky connections to a single replica by offloading balancing to a dedicated proxy.

---

## Other Examples and Fixes

| **Protocol** | **Fix Option 1 (Client)**        | **Fix Option 2 (Proxy)**     |
|:-------------|:---------------------------------|:-----------------------------|
| HTTP/2       | Custom client logic              | Envoy                        |
| gRPC         | gRPC client with round-robin     | Envoy / Istio                |
| WebSockets   | Multiple open connections        | HAProxy / NGINX              |
| AMQP         | Client-side connection pool      | RabbitMQ Cluster             |

---

## The Role of Headless Services

**Headless Services** (`ClusterIP: None`) allow clients to:

- Discover all backend Pod IPs via DNS
- Implement manual or custom load-balancing logic
- Use DNS-based round-robin resolution

> Headless Services are the foundation of advanced service discovery in Kubernetes.

---

## Using Service Meshes

If writing custom load-balancing logic is too complex, use a **Service Mesh** like **Istio** or **Linkerd**.

They:

- Intercept and transparently route traffic
- Automatically balance persistent connections
- Dynamically refresh backend endpoint lists

> Keep in mind: service meshes introduce overhead and require thoughtful design. Use them wisely.

---

## What Happens If You Ignore This?

### Scenario 1: More Clients Than Servers

- 5 clients → 2 servers → OK-ish distribution
- Random selection by kube-proxy may achieve balance

### Scenario 2: More Servers Than Clients

- 2 clients → 5 servers → Only 2 servers are utilized
- Wasted resources
- Scaling doesn't improve performance

---

## Key Takeaways

- Kubernetes **does not** load balance long-lived connections by default.
- Persistent TCP connections (WebSockets, gRPC, DBs) stick to a single Pod.
- Use **client-side logic**, **Headless Services**, or **proxies** (Envoy, HAProxy).
- For scalable solutions, **consider service meshes** like Istio or Linkerd.

---

## Final Thought

Kubernetes is **great for short-lived, stateless HTTP traffic**.

But for **persistent connections**, it requires additional planning.

> Either let your app handle load balancing,  
> or delegate it to a proxy or service mesh.  
> Load balancing isn't automatic even in Kubernetes, you must **design for it**.
