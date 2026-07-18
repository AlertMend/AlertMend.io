---
title: "Resolve ImagePullBackOff and ErrImagePull"
excerpt: "Fix Kubernetes ImagePullBackOff and ErrImagePull with pod events, image tags, pull secrets, registry auth, rate limits, DNS, TLS, and node disk."
date: "2025-05-21"
category: "Kubernetes"
author: "Arvind Rajpurohit"
keywords: "resolving imagepullbackoff and errimagepull in kubernetes, ImagePullBackOff fix, ErrImagePull fix, Kubernetes image pull errors, failed to pull image, image pull secret kubernetes, registry authentication Kubernetes, Docker Hub rate limit Kubernetes, ECR ImagePullBackOff, GCR ImagePullBackOff, containerd pull image"
---

# Resolve ImagePullBackOff and ErrImagePull in Kubernetes

When a Kubernetes pod is stuck in `ErrImagePull` or `ImagePullBackOff`, the application has not started yet. Do not begin with app logs. There may be no app process to log from.

Start with the pod event. Kubernetes usually tells you the real cause in the `Failed to pull image` event: wrong tag, missing registry credentials, expired pull secret, Docker Hub rate limit, DNS failure, TLS certificate problem, blocked egress, or node disk pressure.

## The 10-second answer

Run this first:

```bash
NS=default
POD=<pod-name>

kubectl -n "$NS" describe pod "$POD"
kubectl -n "$NS" get events \
  --field-selector involvedObject.name="$POD" \
  --sort-by='.lastTimestamp'

kubectl -n "$NS" get pod "$POD" \
  -o jsonpath='{range .spec.containers[*]}{.name}{" => "}{.image}{"\n"}{end}'
```

Then resolve based on the exact event message:

| Event text contains | Most likely cause | First fix |
|---|---|---|
| `manifest unknown`, `not found` | Image name or tag does not exist | Correct the image reference and redeploy |
| `unauthorized`, `authentication required`, `denied` | Missing or wrong registry credentials | Fix `imagePullSecrets` in the same namespace |
| `FailedToRetrieveImagePullSecret` | Secret missing, typo, or wrong namespace | Create the secret where the pod runs |
| `toomanyrequests`, `rate limit` | Registry rate limit | Use authenticated pulls or a registry mirror |
| `no such host`, `i/o timeout`, `connection refused` | DNS, proxy, firewall, or registry network path | Test from the node and fix egress |
| `x509: certificate signed by unknown authority` | Registry certificate is not trusted by the node runtime | Install registry CA on nodes or fix the registry cert |
| `no space left on device` | Node image filesystem is full | Clean unused images or expand node disk |

![ImagePullBackOff diagnostic flow: pod status leads to Kubernetes Events, then to the exact fix path](/assets/resolving-imagepullbackoff-and-errimagepull-in-kubernetes/image-pull-fix-flow.svg)

*Use the status as the alert, but use the Event message as the diagnosis.*

## ErrImagePull vs ImagePullBackOff

`ErrImagePull` is the first pull failure. Kubernetes asked the node runtime to pull the image and the pull failed.

`ImagePullBackOff` is the retry state. Kubernetes keeps retrying the pull, but it backs off between attempts so the node does not hammer the registry forever.

In practice, you resolve both the same way: read the first `Failed to pull image` event and fix that root cause.

## Step 1: read the event, not the status

`kubectl get pods` shows the symptom:

```bash
kubectl -n "$NS" get pods
```

Example:

```text
NAME                         READY   STATUS             RESTARTS   AGE
payments-api-7f9d8c9f6-2ks8v 0/1     ImagePullBackOff   0          4m
```

The status alone is not enough. The useful evidence is in `describe`:

```bash
kubectl -n "$NS" describe pod "$POD"
```

Look at the `Events` section near the bottom:

```text
Warning  Failed  kubelet  Failed to pull image "registry.example.com/payments-api:v42":
rpc error: code = NotFound desc = failed to resolve reference:
manifest unknown
```

That line tells you what to fix. Do not reinstall Kubernetes, restart the whole cluster, or chase application logs before reading it.

## Step 2: confirm which image Kubernetes is pulling

A common mistake is checking the image you think you deployed, not the image Kubernetes is actually trying to pull.

```bash
kubectl -n "$NS" get pod "$POD" \
  -o jsonpath='{range .spec.containers[*]}{.name}{" => "}{.image}{"\n"}{end}'
```

For init containers:

```bash
kubectl -n "$NS" get pod "$POD" \
  -o jsonpath='{range .spec.initContainers[*]}{.name}{" => "}{.image}{"\n"}{end}'
```

If an init container cannot pull, the app container will never start. The pod may look like an app failure, but the broken image can be in `initContainers`.

## Fix 1: image name or tag does not exist

Typical event:

```text
manifest unknown
repository does not exist
not found
failed to resolve reference
```

Check the image in the pod:

```bash
kubectl -n "$NS" get pod "$POD" \
  -o jsonpath='{.spec.containers[*].image}{"\n"}'
```

Then verify the tag in your registry. The most common mistakes are:

- typo in registry hostname
- typo in repository name
- CI pushed `v1.2.3` but the manifest uses `v1.2.2`
- tag was deleted or overwritten
- multi-arch image is missing the node architecture
- deploying `latest` and assuming it changed everywhere

Fix the image in the Deployment:

```bash
kubectl -n "$NS" set image deployment/<deployment-name> \
  <container-name>=registry.example.com/team/payments-api:v1.2.3

kubectl -n "$NS" rollout status deployment/<deployment-name>
```

For production, prefer immutable tags or digests:

```yaml
image: registry.example.com/team/payments-api@sha256:<digest>
```

## Fix 2: private registry authentication is missing or wrong

Typical event:

```text
unauthorized: authentication required
pull access denied
failed to authorize
denied: requested access to the resource is denied
```

First check whether the pod references a pull secret:

```bash
kubectl -n "$NS" get pod "$POD" \
  -o jsonpath='{.spec.imagePullSecrets[*].name}{"\n"}'
```

Then check whether the secret exists in the same namespace:

```bash
kubectl -n "$NS" get secret
kubectl -n "$NS" describe secret <secret-name>
```

The namespace matters. An image pull secret in `default` does not help a pod in `payments`.

Create a registry secret:

```bash
kubectl -n "$NS" create secret docker-registry regcred \
  --docker-server=registry.example.com \
  --docker-username=<username> \
  --docker-password=<password>
```

Attach it to the Deployment:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: payments-api
spec:
  template:
    spec:
      imagePullSecrets:
        - name: regcred
      containers:
        - name: payments-api
          image: registry.example.com/team/payments-api:v1.2.3
```

Or attach it to the ServiceAccount used by the pod:

```bash
kubectl -n "$NS" patch serviceaccount <service-account-name> \
  -p '{"imagePullSecrets":[{"name":"regcred"}]}'
```

If the pod uses the default ServiceAccount:

```bash
kubectl -n "$NS" patch serviceaccount default \
  -p '{"imagePullSecrets":[{"name":"regcred"}]}'
```

Then restart the rollout so new pods pick up the fixed reference:

```bash
kubectl -n "$NS" rollout restart deployment/<deployment-name>
kubectl -n "$NS" rollout status deployment/<deployment-name>
```

## Fix 3: `FailedToRetrieveImagePullSecret`

Typical event:

```text
FailedToRetrieveImagePullSecret
Unable to retrieve some image pull secrets
```

This often means Kubernetes can see a secret name in the pod spec, but it cannot load that secret.

Check the pod spec:

```bash
kubectl -n "$NS" get pod "$POD" -o yaml | grep -A5 imagePullSecrets
```

Check the secret exists:

```bash
kubectl -n "$NS" get secret <secret-name>
```

Fix one of these:

- secret name typo
- secret created in the wrong namespace
- ServiceAccount references an old secret
- Helm values refer to a secret that was never created
- secret was rotated but not recreated in every namespace

## Fix 4: Docker Hub or registry rate limit

Typical event:

```text
toomanyrequests: You have reached your pull rate limit
429 Too Many Requests
```

Common fixes:

1. Use an authenticated Docker Hub pull secret.
2. Mirror public images into your own registry.
3. Pin images by tag or digest so you do not pull unnecessarily.
4. Avoid creating many new nodes that all pull the same public image anonymously.

Authenticated pull secret example:

```bash
kubectl -n "$NS" create secret docker-registry dockerhub \
  --docker-server=https://index.docker.io/v1/ \
  --docker-username=<dockerhub-user> \
  --docker-password=<dockerhub-token>
```

Attach it to the workload or ServiceAccount, then restart the rollout.

## Fix 5: registry DNS, proxy, firewall, or egress failure

Typical event:

```text
no such host
i/o timeout
connection refused
net/http: request canceled
failed to do request
```

This is a node-side problem. The kubelet and container runtime pull images from the node, not from inside your application container.

Find the node:

```bash
kubectl -n "$NS" get pod "$POD" -o wide
```

Check node events:

```bash
kubectl describe node <node-name>
```

If your cluster allows node debugging:

```bash
kubectl debug node/<node-name> -it --image=busybox -- chroot /host sh
```

From the node shell, test DNS and registry reachability:

```bash
nslookup registry-1.docker.io
wget -S --spider https://registry-1.docker.io/v2/
```

For containerd, check runtime logs:

```bash
journalctl -u containerd -n 200 --no-pager
```

Fix the real network path:

- DNS resolver on the node
- proxy configuration for containerd or Docker
- firewall rules
- NAT gateway or egress gateway
- private registry route
- network policy that blocks node egress
- corporate TLS interception

## Fix 6: TLS or x509 certificate failure

Typical event:

```text
x509: certificate signed by unknown authority
certificate has expired
tls: failed to verify certificate
```

This is almost always a registry trust issue on the node or container runtime. Installing a CA certificate inside your application image does not fix image pull. The image must be pulled before the app container exists.

Check the registry certificate:

```bash
openssl s_client -connect registry.example.com:443 -showcerts </dev/null
curl -v https://registry.example.com/v2/
```

Fix options:

- use a valid public certificate on the registry
- install the private CA on every node
- configure containerd registry CA settings
- avoid `insecure_skip_verify` except as a temporary development workaround

After changing node runtime trust, restart the runtime carefully according to your cluster operating model.

## Fix 7: node disk pressure or image filesystem full

Typical event:

```text
no space left on device
failed to extract layer
failed to unpack image
```

Check node pressure:

```bash
kubectl describe node <node-name> | grep -i -A5 "DiskPressure"
kubectl describe node <node-name> | grep -i -A8 "ephemeral-storage"
```

On the node:

```bash
df -h
crictl images
crictl rmi --prune
```

Fix options:

- remove unused images
- expand the node disk
- tune image garbage collection thresholds
- reduce huge image layers
- move build artifacts out of runtime images
- use smaller base images

Do not only delete the failing pod. If the node remains full, the replacement pod will fail again.

## Fix 8: wrong image pull policy

`imagePullPolicy` controls whether kubelet tries to pull an image.

```yaml
containers:
  - name: payments-api
    image: registry.example.com/team/payments-api:v1.2.3
    imagePullPolicy: IfNotPresent
```

Use:

- `IfNotPresent` when immutable version tags are used and node cache is acceptable
- `Always` when tags are reused and Kubernetes must pull every time
- image digests for the strongest production guarantee

If you use mutable tags, a node might run a cached image while another node pulls a newer one. That creates confusing rollouts. Use immutable tags or digests whenever possible.

## How to verify the fix

After fixing the cause, create a new pod through the owning controller.

For a Deployment:

```bash
kubectl -n "$NS" rollout restart deployment/<deployment-name>
kubectl -n "$NS" rollout status deployment/<deployment-name>
```

Watch the pod:

```bash
kubectl -n "$NS" get pods -w
```

Confirm the events changed:

```bash
kubectl -n "$NS" get events \
  --field-selector involvedObject.name=<new-pod-name> \
  --sort-by='.lastTimestamp'
```

You want to see the image pull succeed, then the container start:

```text
Normal  Pulled   Successfully pulled image
Normal  Created  Created container
Normal  Started  Started container
```

## Prevention checklist

Use this checklist before the next deploy:

- Use immutable tags or image digests in production.
- Verify the image exists before applying the manifest.
- Keep registry credentials in the same namespace as the workload.
- Prefer ServiceAccount-level `imagePullSecrets` for teams and namespaces.
- Monitor pull secret expiry and cloud registry token refresh.
- Mirror critical public images into a private registry.
- Avoid anonymous Docker Hub pulls in production.
- Check node disk pressure and image filesystem usage.
- Alert on Kubernetes Events containing `Failed`, `ErrImagePull`, and `ImagePullBackOff`.
- Verify pods reach `Running` after any image, secret, or registry change.

## Where AlertMend helps

Manual resolution is fine once. Repeated image pull failures become toil.

AlertMend can watch Kubernetes pod status, Events, node signals, and deployment context so the incident already arrives with the likely cause attached:

- bad tag or missing manifest
- expired or missing image pull secret
- registry authentication failure
- Docker Hub or registry rate limit
- node DNS or egress failure
- x509 certificate problem
- node disk pressure

For known safe cases, AlertMend can trigger approved runbooks such as:

- notify the owning team with the exact failing image and namespace
- verify whether the tag exists in the registry
- refresh or reapply an image pull secret
- restart a rollout after the secret is fixed
- check whether every new pod reaches `Running`

The goal is not just to say “ImagePullBackOff happened.” The goal is to turn the event into a clear fix path, route it to the right owner, and verify recovery.

[Book a Kubernetes image pull failure review](https://calendly.com/hello-alertmend/30min?source=blog-post&blog_slug=resolving-imagepullbackoff-and-errimagepull-in-kubernetes)

## FAQ

### What is the difference between ErrImagePull and ImagePullBackOff?

`ErrImagePull` is the immediate image pull failure. `ImagePullBackOff` is the retry state after Kubernetes has failed to pull the image and is waiting before trying again.

### How do I fix ImagePullBackOff in Kubernetes?

Run `kubectl describe pod`, read the `Failed to pull image` event, then fix the specific cause: image tag, registry credentials, pull secret namespace, rate limit, DNS, TLS certificate, or node disk space.

### Why does Kubernetes say ErrImagePull first and ImagePullBackOff later?

Kubernetes fails the pull first, then retries with a backoff delay. That prevents constant failed pulls against the registry.

### Can a wrong image tag cause ImagePullBackOff?

Yes. Wrong tags often show up as `manifest unknown`, `not found`, or `failed to resolve reference`. Correct the image tag or deploy by digest.

### Does the imagePullSecret need to be in the same namespace?

Yes. A pod can only use an image pull secret from its own namespace. A secret in `default` will not help a pod in another namespace.

### Why can I pull the image locally but Kubernetes cannot?

Your laptop may have different credentials, DNS, proxy settings, registry trust, or network access than the Kubernetes node. Image pulls happen from the node, so test from the node runtime path.

### Do I need to delete the pod after fixing the secret?

Usually, restart the owning controller instead of manually deleting random pods. For a Deployment, run `kubectl rollout restart deployment/<name>` and then watch `kubectl rollout status`.

### Can ImagePullBackOff resolve itself?

Sometimes, if the registry or network outage is temporary. But if the cause is a wrong tag, missing secret, expired token, or certificate problem, it will not resolve until you fix the configuration.

### How do I monitor ImagePullBackOff automatically?

Monitor Kubernetes Events and pod waiting reasons for `ErrImagePull` and `ImagePullBackOff`. AlertMend can correlate those events with deployment metadata, registry errors, node issues, and approved recovery runbooks.
