---
title: "npm Local Issuer Certificate Fix"
excerpt: "Fix npm unable to get local issuer certificate safely: diagnose corporate proxies, private registries, cafile, NODE_EXTRA_CA_CERTS, and strict-ssl."
date: "2026-01-10"
category: "Security"
author: "Dinesh Agrawal"
keywords: "unable to get local issuer certificate npm, npm unable to get local issuer certificate, npm unable to get issuer cert locally, npm install unable to get local issuer certificate, NODE_EXTRA_CA_CERTS npm, npm cafile, npm strict-ssl"
---

# npm “Unable to Get Local Issuer Certificate”: Fix It Without Disabling SSL

The safe fix is not `npm config set strict-ssl false`.

This error means npm or a Node process could not build a trusted TLS certificate chain for the registry it is contacting. Confirm the registry, check proxy/private-registry settings, add the correct trusted CA with `cafile` or `NODE_EXTRA_CA_CERTS`, keep `strict-ssl=true`, and verify with `npm ping` before rerunning `npm install` or `npm ci`.

This article is served as a rich standalone page at `/blog/unable-to-get-local-issuer-certificate-npm`.
