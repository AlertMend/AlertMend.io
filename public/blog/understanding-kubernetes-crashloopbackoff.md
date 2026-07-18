---
title: "Understanding Kubernetes CrashLoopBackOff"
excerpt: "Understand Kubernetes CrashLoopBackOff, find the real cause with previous logs, exit codes, pod events, probes, resource limits, and safe fixes."
date: "2025-02-28"
category: "Kubernetes"
author: "Arvind Rajpurohit"
keywords: "understanding kubernetes crashloopbackoff, CrashLoopBackOff Kubernetes, Kubernetes CrashLoopBackOff fix, kubectl logs previous, OOMKilled Kubernetes, liveness probe CrashLoopBackOff, pod restart loop, Kubernetes pod crashing, exit code 137 Kubernetes, exit code 1 CrashLoopBackOff"
---

# Understanding Kubernetes CrashLoopBackOff

`CrashLoopBackOff` does not mean Kubernetes is broken. It means Kubernetes successfully started a container, the container exited, and Kubernetes is waiting before trying again.

That distinction matters. If the image cannot be pulled, you get `ImagePullBackOff`. If the pod cannot be scheduled, you get `Pending`. If the container starts and then dies repeatedly, Kubernetes shows `CrashLoopBackOff`.

The fix is usually not “delete the pod.” The fix is to read the last terminated container, understand why it exited, and change the thing that made it crash.

## The 10-second answer

Run these commands first:

```bash
NS=default
POD=<pod-name>

kubectl -n "$NS" describe pod "$POD"
kubectl -n "$NS" logs "$POD" --previous
kubectl -n "$NS" get pod "$POD" \
  -o jsonpath='{range .status.containerStatuses[*]}{.name}{" restart="}{.restartCount}{" waiting="}{.state.waiting.reason}{" lastExit="}{.lastState.terminated.exitCode}{" reason="}{.lastState.terminated.reason}{"\n"}{end}'
```

Then map what you see:

| Evidence | Likely cause | First fix |
|---|---|---|
| `lastExit=1` | Application startup error | Read `logs --previous`, fix the app error or missing config |
| `lastExit=126` | Entrypoint exists but cannot execute | Fix file permissions, shebang, architecture, or security context |
| `lastExit=127` | Command not found | Fix the image, command, PATH, or package install |
| `lastExit=137`, `reason=OOMKilled` | Container was killed for memory | Raise memory limit or fix memory usage |
| `lastExit=139` | Segmentation fault | Check native library, runtime, driver, or bad binary |
| `Liveness probe failed` | Probe is killing the container | Add a startup probe or fix probe timing/path |
| `CreateContainerConfigError` nearby | ConfigMap, Secret, env, or volume problem | Fix missing config before chasing app code |
| Crash started after rollout | Bad deploy, config, or image | Compare revision and rollback if needed |

## What CrashLoopBackOff actually means

Kubernetes tries to keep containers alive according to the pod restart policy. When a container exits, kubelet restarts it. If it exits again and again, kubelet waits longer between attempts. That waiting state is the “back off” part.

So the visible status is a timer, not the root cause.

The root cause is usually one of these:

- the app process exits because a required environment variable is missing
- the app cannot connect to a dependency during startup
- the container entrypoint is wrong or not executable
- memory limit is too low and the kernel kills the process
- a liveness probe is too aggressive and kills a slow-starting app
- a secret, config file, certificate, or mounted path is missing
- a new rollout introduced a bad image or config

![CrashLoopBackOff diagnostic flow: the container starts, exits, kubelet restarts it, then the backoff timer appears](/assets/understanding-kubernetes-crashloopbackoff/crashloop-diagnosis-flow.svg)

*The fastest path is previous logs, last terminated state, pod Events, and rollout history, in that order.*

## Step 1: confirm the pod and container

Start with the pod status:

```bash
kubectl -n "$NS" get pod "$POD" -o wide
```

For multi-container pods, find the container that is actually crashing:

```bash
kubectl -n "$NS" get pod "$POD" \
  -o jsonpath='{range .status.containerStatuses[*]}{.name}{" => restartCount="}{.restartCount}{" waiting="}{.state.waiting.reason}{"\n"}{end}'
```

Do not assume the main app container is the problem. Sidecars and init containers can also block a pod from becoming healthy.

## Step 2: read the previous logs

In CrashLoopBackOff, the current container may already be gone. That is why normal logs can look empty.

Use `--previous`:

```bash
kubectl -n "$NS" logs "$POD" --previous
```

If the pod has multiple containers:

```bash
kubectl -n "$NS" logs "$POD" -c <container-name> --previous
```

Look for the last useful line before the process exited:

```text
Error: DATABASE_URL is required
```

or:

```text
exec /app/start.sh: permission denied
```

or:

```text
JavaScript heap out of memory
```

That line usually beats every dashboard.

## Step 3: read the last terminated state

Exit code and termination reason tell you which path to take:

```bash
kubectl -n "$NS" get pod "$POD" \
  -o jsonpath='{range .status.containerStatuses[*]}{.name}{"\n"}{"  exitCode: "}{.lastState.terminated.exitCode}{"\n"}{"  reason: "}{.lastState.terminated.reason}{"\n"}{"  finishedAt: "}{.lastState.terminated.finishedAt}{"\n"}{end}'
```

Common signals:

- `exitCode: 1`: the application returned a general error
- `exitCode: 126`: Kubernetes found the command, but it could not execute it
- `exitCode: 127`: command not found inside the image
- `exitCode: 137`: killed by `SIGKILL`, commonly an OOM kill
- `exitCode: 139`: segmentation fault
- `reason: OOMKilled`: memory limit or memory spike

If the exit code is generic, the logs decide the fix. If the exit code is specific, use it to avoid guessing.

## Step 4: read pod events and probes

Events tell you whether Kubernetes itself killed the container:

```bash
kubectl -n "$NS" describe pod "$POD"
```

Look near the bottom:

```text
Warning  Unhealthy  kubelet  Liveness probe failed: HTTP probe failed with statuscode: 500
Normal   Killing    kubelet  Container app failed liveness probe, will be restarted
```

This is not the same as the app crashing by itself. Kubernetes killed it because the liveness probe failed.

If the app needs time to boot, add a startup probe:

```yaml
startupProbe:
  httpGet:
    path: /healthz
    port: 8080
  failureThreshold: 30
  periodSeconds: 10
livenessProbe:
  httpGet:
    path: /healthz
    port: 8080
  periodSeconds: 10
```

The startup probe gives the app time to initialize before liveness checks begin.

## Step 5: check what changed

CrashLoopBackOff often starts after a rollout:

```bash
kubectl -n "$NS" rollout history deployment/<deployment-name>
kubectl -n "$NS" describe deployment/<deployment-name>
```

Check for changes in:

- image tag
- command or args
- environment variables
- Secret or ConfigMap names
- mounted file paths
- resource limits
- probe paths and timings
- service account or permissions

If the crash started immediately after a deploy and the previous revision was healthy, rollback may be the safest production fix:

```bash
kubectl -n "$NS" rollout undo deployment/<deployment-name>
kubectl -n "$NS" rollout status deployment/<deployment-name>
```

Rollback first when users are impacted. Root-cause the bad revision after service is stable.

## Fix common CrashLoopBackOff causes

### OOMKilled

Evidence:

```text
reason: OOMKilled
exitCode: 137
```

Check limits:

```bash
kubectl -n "$NS" describe pod "$POD" | grep -A8 -E "Limits|Requests"
kubectl top pod -n "$NS" "$POD"
```

Fix:

- raise the memory limit if the app legitimately needs more memory
- reduce startup memory spike
- fix memory leaks
- right-size JVM, Node.js, Python, or Go runtime settings
- check whether a new rollout changed workload size

For Java, a common pattern is a container memory limit that is lower than the JVM heap plus native overhead.

### Missing environment variable or secret

Evidence:

```text
Error: DATABASE_URL is required
```

or:

```text
CreateContainerConfigError
secret "payments-db" not found
```

Check the pod spec:

```bash
kubectl -n "$NS" get pod "$POD" -o yaml
kubectl -n "$NS" get secret
kubectl -n "$NS" get configmap
```

Fix the missing Secret, ConfigMap, env var, or mount path. Then restart the owning Deployment so new pods start with the corrected configuration.

### Bad command, permissions, or image

Evidence:

```text
exec /app/start.sh: permission denied
```

or:

```text
sh: node: not found
```

Fix:

- ensure the executable exists inside the image
- make the entrypoint executable
- use the correct shell path
- avoid Windows line endings in shell scripts
- verify the image architecture matches the node architecture
- check that `command` and `args` override the image entrypoint correctly

Helpful local check:

```bash
docker run --rm -it <image> sh
```

### Liveness probe kills the app too early

Evidence:

```text
Liveness probe failed
Container failed liveness probe, will be restarted
```

Fix:

- add a `startupProbe`
- increase `initialDelaySeconds`, `failureThreshold`, or `timeoutSeconds`
- make readiness and liveness separate endpoints
- avoid making liveness depend on downstream services

Liveness should answer: “is this process wedged?” Readiness should answer: “should traffic be sent here?”

### Dependency failure during startup

Evidence:

```text
connection refused
database unavailable
failed to connect to redis
```

Fix:

- add retry with backoff inside the app
- do not exit forever because a dependency was unavailable for one second
- use readiness checks to keep traffic away until dependencies are ready
- use init containers only when startup must block on a dependency

If every service exits when one dependency is down, a small dependency incident becomes a cluster-wide crash loop.

## How to verify the fix

After applying the fix, create a new pod through the owning controller:

```bash
kubectl -n "$NS" rollout restart deployment/<deployment-name>
kubectl -n "$NS" rollout status deployment/<deployment-name>
kubectl -n "$NS" get pods -w
```

Then check the new pod:

```bash
NEW_POD=<new-pod-name>

kubectl -n "$NS" get pod "$NEW_POD"
kubectl -n "$NS" describe pod "$NEW_POD"
kubectl -n "$NS" logs "$NEW_POD"
```

You want:

- `STATUS` becomes `Running`
- `READY` becomes `1/1` or expected container count
- restart count stays stable
- no new `Unhealthy`, `Killing`, or `Back-off restarting failed container` events
- the application passes readiness and receives traffic normally

## Prevention checklist

Use this before the next deploy:

- Always check `kubectl logs --previous` in crash loops.
- Alert on restart count increases, not only pod status.
- Keep liveness probes simple and add startup probes for slow apps.
- Do not make liveness depend on database, queue, cache, or third-party APIs.
- Pin image tags or digests so rollbacks are predictable.
- Validate required environment variables during CI.
- Keep ConfigMap and Secret names stable across environments.
- Set memory requests and limits based on real usage, not guesses.
- Watch OOMKilled, exit codes, and deployment revisions together.
- Roll back quickly when a crash loop starts right after a rollout.

## How you can automate CrashLoopBackOff response

The painful part is not running `kubectl describe pod` once. The painful part is doing it at 2 a.m., across namespaces, while trying to guess whether the fix is rollback, memory, config, probes, or dependency recovery.

AlertMend can sit beside your Kubernetes monitoring and correlate:

- pod status and restart count
- previous container logs
- exit code and termination reason
- pod Events
- recent deployment changes
- resource pressure and OOM signals
- probe failures
- namespace, owner, service, and runbook context

For approved cases, it can route the incident to Slack, WhatsApp, or phone call escalation and prepare safe actions such as:

- rollback the last bad rollout
- restart a Deployment after a fixed Secret or ConfigMap
- attach the previous logs and exit code to the incident
- recommend memory right-sizing when `OOMKilled` repeats
- verify that replacement pods become `Ready`

The goal is simple: stop treating `CrashLoopBackOff` as a generic alert. Turn it into a short diagnosis, a known owner, and a safe recovery path.

[Book a Kubernetes crash loop automation review](https://calendly.com/hello-alertmend/30min?source=blog-post&blog_slug=understanding-kubernetes-crashloopbackoff)

## FAQ

### What does CrashLoopBackOff mean in Kubernetes?

It means a container started, exited, restarted, and then exited again. Kubernetes is waiting before the next restart attempt. The backoff is the symptom. The root cause is in previous logs, exit code, pod Events, or probe failures.

### How do I fix CrashLoopBackOff?

Run `kubectl describe pod`, `kubectl logs --previous`, and inspect `.status.containerStatuses[*].lastState.terminated`. Fix the specific cause: app error, missing config, OOMKilled, bad command, failed liveness probe, or bad rollout.

### Why are my logs empty during CrashLoopBackOff?

The current container may not be running long enough to produce current logs. Use `kubectl logs <pod> --previous` to read the logs from the last crashed container.

### Should I delete the pod to fix CrashLoopBackOff?

Deleting the pod usually just creates another crashing pod. Fix the root cause in the Deployment, Secret, ConfigMap, image, command, resource limit, or probe. Then restart the rollout.

### What is the difference between CrashLoopBackOff and ImagePullBackOff?

`ImagePullBackOff` means Kubernetes cannot pull the image, so the container never starts. `CrashLoopBackOff` means the image pulled successfully, but the container process exits repeatedly.

### What does exit code 137 mean in CrashLoopBackOff?

Exit code 137 usually means the process was killed with `SIGKILL`. In Kubernetes, the common reason is `OOMKilled`, where the container exceeded its memory limit.

### What if CrashLoopBackOff started after a deployment?

Check rollout history and recent changes. If users are impacted and the previous revision was healthy, roll back first, then investigate the bad image, config, probe, or resource setting.

### Can AlertMend automate CrashLoopBackOff recovery?

AlertMend can detect crash loops, attach previous logs and exit codes, correlate them with rollouts and resource pressure, route the right team, and trigger approved recovery runbooks such as rollback or rollout restart after a fixed config.
