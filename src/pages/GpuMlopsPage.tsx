import {
  Cpu, Thermometer, Layers, TrendingDown, Workflow, Gauge, Database, Brain,
} from 'lucide-react'
import SolutionPageTemplate, { Accent } from '../components/SolutionPageTemplate'

/**
 * /gpu-mlops — GPU fleets and ML pipelines.
 *
 * Replaces the old homepage `/#mlops` anchor with a real route. Every claim
 * here is carried over from the shipped MLOps section component rather than
 * written fresh, so the page stays honest about what the product does: the
 * GPU fleet view, the eight ML failure modes it recognises, and the same
 * suggest → approve → execute gating the rest of the platform uses.
 */

const SIGNUP_URL = 'https://app.alertmend.io/signup?service=gpu-mlops'

function SpotlightPanel() {
  const gpus = [
    { name: 'h100-node-01', util: 96, temp: 71, tone: 'ok' as const },
    { name: 'h100-node-03', util: 12, temp: 42, tone: 'warn' as const },
    { name: 'a100-node-04', util: 98, temp: 84, tone: 'crit' as const },
    { name: 'a100-node-06', util: 0, temp: 38, tone: 'crit' as const },
  ]
  const dot = {
    ok: 'bg-emerald-400',
    warn: 'bg-amber-400',
    crit: 'bg-rose-400',
  }
  const bar = {
    ok: 'bg-emerald-400/70',
    warn: 'bg-amber-400/70',
    crit: 'bg-rose-400/70',
  }

  return (
    <div className="rounded-[10px] border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-white/55">GPU fleet · live nvidia-smi</span>
        <span className="rounded-md border border-rose-400/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-300">
          2 alerts
        </span>
      </div>
      <div className="mt-4 space-y-2">
        {gpus.map((g) => (
          <div
            key={g.name}
            className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2"
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-mono text-[11px] text-zinc-200">
                <span className={`h-1.5 w-1.5 rounded-full ${dot[g.tone]}`} />
                {g.name}
              </span>
              <span className="font-mono text-[11px] text-white/45">{g.temp}°C</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="w-6 font-mono text-[10px] text-white/40">util</span>
              <span className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                <span
                  className={`block h-full rounded-full ${bar[g.tone]}`}
                  style={{ width: `${g.util}%` }}
                />
              </span>
              <span className="w-8 text-right font-mono text-[10px] text-white/55">{g.util}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function GpuMlopsPage() {
  return (
    <SolutionPageTemplate
      seo={{
        title: 'GPU & MLOps Monitoring for H100 Fleets | AlertMend AI',
        description:
          'Monitor NVIDIA H100 and A100 GPU fleets and ML pipelines: CUDA OOM, thermal throttling, NCCL failures, stuck Kubeflow DAGs and vLLM latency drift.',
        keywords:
          'GPU monitoring, MLOps, GPU MLOps, ML pipeline monitoring, NVIDIA H100, A100, CUDA OOM, NCCL, Kubeflow, Airflow, vLLM, inference latency, GPU cluster monitoring, AIOps, Kubernetes',
        canonical: '/gpu-mlops',
      }}
      badge="GPU & MLOps"
      headline={
        <>
          <Accent>GPU clusters</Accent> and ML pipelines, observed end-to-end
        </>
      }
      sub="From CUDA OOM on an H100 node to a stuck Kubeflow DAG to p99 latency drift on your vLLM inference fleet — AlertMend understands the failure modes that actually break ML in production, then triages and remediates them like the rest of your stack."
      signupUrl={SIGNUP_URL}
      checks={['Live nvidia-smi telemetry', 'ML-specific failure modes', 'Approval-gated remediation']}
      highlightProduct="mlops"
      stepsHeading="From GPU telemetry to a fix you approved"
      stepsSub="The same pipeline as the rest of the platform, with the failure modes that are specific to training and inference."
      steps={[
        {
          icon: Cpu,
          title: 'Observe',
          sub: 'Fleet-wide GPU telemetry',
          spec: 'utilisation · memory · temperature · MIG slices, per node from live nvidia-smi',
        },
        {
          icon: Brain,
          title: 'Diagnose',
          sub: 'ML-aware root cause',
          spec: 'CUDA OOM vs thermal throttle vs NCCL ring break, told apart with cited evidence',
        },
        {
          icon: Workflow,
          title: 'Remediate',
          sub: 'Approved, then executed',
          spec: 'drain a node · restart a DAG task · roll back a model, gated by Slack or Teams',
        },
      ]}
      featuresHeading="The failure modes that actually break ML"
      featuresSub="Generic infrastructure monitoring sees a busy node. These are the conditions that stall a training run or blow out inference latency."
      features={[
        {
          icon: Cpu,
          title: 'GPU OOM & memory pressure',
          body: 'CUDA OOM kills, MIG slice exhaustion and memory fragmentation, attributed to the job and node that caused them.',
          chips: ['CUDA OOM', 'MIG'],
          big: true,
        },
        {
          icon: Thermometer,
          title: 'Thermal throttling',
          body: 'SM clock drop, sustained temperatures above 85°C and fan failures, caught before they quietly halve your throughput.',
          chips: ['SM clock', '>85°C'],
        },
        {
          icon: Layers,
          title: 'NCCL collective failures',
          body: 'AllReduce timeouts, ring breaks and node disconnects across a distributed training job, traced to the rank that dropped.',
          chips: ['AllReduce', 'ring break'],
        },
        {
          icon: TrendingDown,
          title: 'Training divergence',
          body: 'NaN loss, vanishing or exploding gradients and stuck epochs surfaced as incidents rather than found the next morning.',
          chips: ['NaN loss', 'stuck epoch'],
        },
        {
          icon: Workflow,
          title: 'Pipeline DAG stalls',
          body: 'Argo, Kubeflow and Airflow task retries and artifact loss, with the failing task and its upstream dependency named.',
          chips: ['Kubeflow', 'Airflow'],
        },
        {
          icon: Gauge,
          title: 'Inference latency drift',
          body: 'p99 spikes, queue depth growth and dynamic batching drifting off target across a vLLM serving fleet.',
          chips: ['p99', 'vLLM'],
        },
        {
          icon: Database,
          title: 'Vector index health',
          body: 'Pinecone, Weaviate and Milvus shard rebuilds and recall drops, watched like any other production dependency.',
          chips: ['recall', 'shards'],
        },
        {
          icon: Brain,
          title: 'Model registry drift',
          body: 'Stale models still serving in production, A/B variant skew and schema mismatch between training and serving.',
          chips: ['drift', 'A/B skew'],
        },
      ]}
      spotlight={{
        tag: 'One idle GPU is real money',
        title: 'A100 node at 0% for six hours, caught and costed',
        body: 'AlertMend watches utilisation alongside spend, so an idle or wedged accelerator shows up as both an incident and a recoverable cost line — with the same right-sizing preview and rollback the FinOps surface uses.',
        steps: [
          'Node flagged: a100-node-06 at 0% utilisation',
          'Correlated with the DAG task that never scheduled',
          'Root cause cited from scheduler events and logs',
          'Drain or reschedule proposed for approval in Slack',
        ],
        linkTo: '/kubernetes-cost-optimization',
        linkLabel: 'See FinOps right-sizing',
        panel: <SpotlightPanel />,
      }}
      ctaHeading="Point AlertMend at your GPU fleet"
      ctaSub="Connect a cluster and see utilisation, thermals and pipeline health on the same timeline as the rest of your infrastructure."
    />
  )
}
