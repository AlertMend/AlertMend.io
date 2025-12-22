---
title: "Microsoft Teams Integration Guide"
excerpt: "Enhance your incident response workflow by integrating Microsoft Teams with Alertmend. This guide walks you through the step by step process of setting up..."
date: "2024-07-24"
category: "Blog"
author: "Arvind Rajpurohit"

---


Enhance your incident response workflow by integrating Microsoft Teams with Alertmend. This guide walks you through the step by step process of setting up an incoming webhook in Microsoft Teams and connecting it to Alertmend. Once configured, you'll receive real time alerts and notifications directly within your chosen Teams channel ensuring your team stays informed and can take immediate action. Whether you're monitoring Kubernetes pods, system resources, or cloud infrastructure, this integration ensures timely and collaborative incident resolution.

# Steps to Create an Incoming Webhook in Microsoft Teams

## 1. Open MS Teams



## 2. Click on Apps

After going to Apps, you will see the interface below:





## 3. In the search bar, type **Incoming Webhook**



## 4. Click on **Incoming Webhook**, and you'll see the interface below:



## 5. Choose the channel where you want to create the incoming webhook URL

In my case, I’m selecting `test_mukul`. Afterward, click the **Go** button to proceed to the next interface.



## 6. Copy Webhook URL

After that, you’ll see the following interface:

Here, you can copy the generated **webhook URL**. Once copied, click **Done**.



## 7. Finalize Integration in Alertmend

Enter an **Integration Name**, paste the copied **Webhook URL**, and click **Save**.  
Your Microsoft Teams integration is now connected.
