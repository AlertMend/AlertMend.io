---
title: "Kubernetes V1.35.0 Features Overview"
excerpt: "Kubernetes V1.35.0 Features Overview Generated on 2025-12-23 01:27:41  Navigating Kubernetes v1.35."
date: "2025-12-22"
category: "Kubernetes"
author: "AlertMend Team"
keywords: "AlertMend AI, Kubernetes, DevOps, Features, Overview"
---

# Kubernetes V1.35.0 Features Overview



## Navigating Kubernetes v1.35.0: Unlocking New Features for DevOps Excellence

In the rapidly evolving landscape of DevOps, staying updated with the latest Kubernetes releases is essential for maintaining efficient and robust systems. The **Kubernetes v1.35.0 features overview** is a critical update that provides numerous advancements for developers and system administrators alike. This release transforms Kubernetes into more than just a platform; it’s evolving into an essential system kernel, offering enhanced resource management capabilities and innovative scheduling features. Let’s explore how these advancements can optimize your system monitoring and alerting with alertmend.io.

## Enhancing Resource Management: In-Place Pod Resizing

One of the standout features in Kubernetes v1.35.0 is the transition of In-Place Pod Resizing to General Availability (GA). This development addresses the inefficiencies traditionally associated with resource management, often termed the “Restart Tax.” Previously, any changes to a pod’s CPU or memory limits necessitated a complete pod restart. With this update, you can adjust resource allocations without downtime, vastly improving the handling of stateful applications.

For example, using the command below, you can resize memory limits without restarting the pod:

```shell
kubectl patch pod my-app --subresource resize --type='merge' -p '{
  "requests": {"memory": "512Mi"},
  "limits": {"memory": "1Gi"}
}'
```

This method allows Kubernetes to handle asynchronous resource adjustments, providing a more flexible and efficient approach to scaling applications.

## Advancements in Scheduling: Gang Scheduling and Opportunistic Batching

Kubernetes v1.35.0 introduces significant scheduling enhancements that are especially beneficial for AI/ML workloads and batch processing. **Gang Scheduling**, currently in alpha, ensures that all components of a distributed job are scheduled simultaneously, reducing deadlocks and resource wastage. This feature is particularly advantageous for jobs requiring substantial computing resources, such as those involving machine learning training.

Similarly, **Opportunistic Batching** optimizes batch job scheduling by enabling the rapid execution of large-scale jobs, significantly enhancing processing speed for complex workloads. These scheduling improvements are invaluable for system operators aiming to maximize resource utilization and minimize job latency.

## Security and Modernization: Structured Auth Config and Breaking Changes

Security and modernization are at the forefront of Kubernetes v1.35.0. The introduction of **Structured Auth Config** and **Pod Certificates** strengthens security protocols, ensuring that your clusters are protected against unauthorized access. Additionally, support for cgroup v1 has been removed, marking a shift towards modern infrastructure. This modernization mandate is crucial for maintaining the integrity and performance of your Kubernetes environments.

As a system administrator, transitioning to these modern standards with the alertmend.io platform can help you manage legacy node fleets and modernize infrastructure effectively, ensuring compliance with the latest Kubernetes capabilities.

## Practical Application: Implementing Kubernetes v1.35.0 Features with alertmend.io

To leverage the full potential of Kubernetes v1.35.0, integrating these features into your DevOps practices is crucial. Alertmend.io provides robust monitoring and alerting solutions that complement these new capabilities. Here's a step-by-step guide to implementing these features:

1. **Enable In-Place Resizing:** Configure your Kubernetes environment to allow in-place resizing. This involves updating your deployment strategies to utilize the new resizing APIs.

2. **Adopt Advanced Scheduling:** Use alertmend.io's monitoring features to track resource utilization and optimize your use of Gang Scheduling and Opportunistic Batching, ensuring efficient job execution.

3. **Enhance Security Measures:** Implement Structured Auth Config to secure access to your Kubernetes clusters, using alertmend.io to monitor compliance and detect anomalies.

4. **Modernize Infrastructure:** Transition from deprecated features like cgroup v1 to newer standards. Use alertmend.io's alerting capabilities to ensure smooth migrations and minimal downtime.

By following these practical steps, you can ensure that your system management practices are aligned with the latest Kubernetes advancements, maximizing efficiency and security.

## Moving Forward with Kubernetes v1.35.0

The **Kubernetes v1.35.0 features overview** showcases significant advancements in resource management, scheduling, and security, marking a pivotal evolution in how we manage cloud-native environments. As you adopt these new features, alertmend.io stands as a valuable partner in optimizing your system monitoring and alerting processes.

Incorporating these enhancements into your workflows will not only improve operational efficiency but also empower your DevOps teams to manage resources more effectively, reduce downtime, and enhance security. Embrace these changes to stay ahead in the competitive landscape of system monitoring and management. Ready to take the next step? Start integrating these features with alertmend.io today and transform your system management strategies.