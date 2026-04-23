import Icon from '../ui/Icon';
import styles from './MLOps.module.css';

type GPU = { name: string; util: number; mem: number; temp: number; status: 'ok' | 'warn' | 'crit' };

const gpus: GPU[] = [
  { name: 'h100-node-01', util: 96, mem: 76, temp: 71, status: 'ok' },
  { name: 'h100-node-02', util: 94, mem: 81, temp: 73, status: 'ok' },
  { name: 'h100-node-03', util: 12, mem: 18, temp: 42, status: 'warn' },
  { name: 'a100-node-04', util: 98, mem: 92, temp: 84, status: 'crit' },
  { name: 'a100-node-05', util: 88, mem: 64, temp: 68, status: 'ok' },
  { name: 'a100-node-06', util: 0, mem: 4, temp: 38, status: 'crit' },
];

const lossPath =
  'M 4 12 L 32 24 L 60 38 L 88 50 L 116 60 L 144 70 L 172 78 L 200 86 L 228 90 L 256 96 L 284 100 L 312 102 L 340 104';

const latencyBars = [12, 18, 32, 48, 62, 70, 64, 52, 38, 26, 16, 10, 6, 4, 3];

const failureModes = [
  { ico: 'cpu', label: 'GPU OOM', desc: 'CUDA OOM kills, MIG slice exhaustion, mem fragmentation' },
  { ico: 'thermometer', label: 'Thermal throttling', desc: 'SM clock drop, sustained >85°C, fan failures' },
  { ico: 'layers', label: 'NCCL collective fail', desc: 'AllReduce timeout, ring break, node disconnect' },
  { ico: 'trending', label: 'Training divergence', desc: 'NaN loss, vanishing/exploding grads, stuck epoch' },
  { ico: 'workflow', label: 'Pipeline DAG stuck', desc: 'Argo / Kubeflow / Airflow task retries, artifact loss' },
  { ico: 'gauge', label: 'Inference latency drift', desc: 'p99 spike, queue depth, dynamic batching off-target' },
  { ico: 'database', label: 'Vector index health', desc: 'Pinecone / Weaviate / Milvus shard rebuild, recall drop' },
  { ico: 'brain', label: 'Model registry drift', desc: 'Stale model in prod, A/B variant skew, schema mismatch' },
] as const;

function statusColor(s: GPU['status']) {
  if (s === 'crit') return styles.crit;
  if (s === 'warn') return styles.warn;
  return styles.ok;
}

export default function MLOps() {
  return (
    <section id="mlops" className={styles.section}>
      <div className="container">
        <div className="sec-head reveal">
          <span className="sec-tag">GPU &amp; ML pipelines</span>
          <h2>
            <span className="hero-h-accent">GPU clusters</span> and ML pipelines, observed
            end-to-end.
          </h2>
          <p>
            From CUDA OOM on an H100 node to a stuck Kubeflow DAG to a p99 latency drift on your
            vLLM inference fleet, AlertMend understands the failure modes that actually break ML
            in production, then triages and remediates them like the rest of your stack.
          </p>
        </div>

        <div className={`${styles.boards} reveal`}>
          {/* GPU FLEET */}
          <div className={styles.board}>
            <div className={styles.boardHead}>
              <div className={styles.boardTitleWrap}>
                <span className={styles.boardIco} style={{ background: 'rgba(168,85,247,0.18)', color: '#d8b4fe' }}>
                  <Icon name="cpu" size={16} strokeWidth={2.2} />
                </span>
                <div>
                  <div className={styles.boardTitle}>GPU fleet</div>
                  <div className={styles.boardSub}>NVIDIA H100 / A100 · live nvidia-smi</div>
                </div>
              </div>
              <span className={`${styles.pill} ${styles.pillCrit}`}>2 alerts</span>
            </div>

            <div className={styles.gpuList}>
              {gpus.map((g) => (
                <div key={g.name} className={styles.gpu}>
                  <div className={styles.gpuTop}>
                    <span className={styles.gpuName}>
                      <span className={`${styles.gpuDot} ${statusColor(g.status)}`} />
                      {g.name}
                    </span>
                    <span className={styles.gpuTemp}>{g.temp}°C</span>
                  </div>
                  <div className={styles.gpuBars}>
                    <div className={styles.gpuBarRow}>
                      <span className={styles.gpuBarLbl}>util</span>
                      <span className={styles.gpuBar}>
                        <span
                          className={`${styles.gpuBarFill} ${statusColor(g.status)}`}
                          style={{ width: `${g.util}%` }}
                        />
                      </span>
                      <span className={styles.gpuBarVal}>{g.util}%</span>
                    </div>
                    <div className={styles.gpuBarRow}>
                      <span className={styles.gpuBarLbl}>mem</span>
                      <span className={styles.gpuBar}>
                        <span
                          className={`${styles.gpuBarFill} ${statusColor(g.status)}`}
                          style={{ width: `${g.mem}%` }}
                        />
                      </span>
                      <span className={styles.gpuBarVal}>{g.mem}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.boardFoot}>
              <span>
                <b>$8,420</b> / hr · <b>87%</b> avg utilization
              </span>
              <span className={styles.foundLink}>4 idle GPUs found →</span>
            </div>
          </div>

          {/* TRAINING RUN */}
          <div className={styles.board}>
            <div className={styles.boardHead}>
              <div className={styles.boardTitleWrap}>
                <span className={styles.boardIco} style={{ background: 'rgba(99,102,241,0.18)', color: '#a5b4fc' }}>
                  <Icon name="trending" size={16} strokeWidth={2.2} />
                </span>
                <div>
                  <div className={styles.boardTitle}>Training run · llama-ft-7b</div>
                  <div className={styles.boardSub}>PyTorch DDP · 8× H100 · MLflow run #3194</div>
                </div>
              </div>
              <span className={`${styles.pill} ${styles.pillOk}`}>
                <span className={styles.pillDot} /> Running
              </span>
            </div>

            <div className={styles.trainGrid}>
              <div>
                <div className={styles.statLbl}>Step</div>
                <div className={styles.statVal}>
                  <span className={styles.statNum}>12,840</span>
                  <span className={styles.statSlash}>/ 25,000</span>
                </div>
              </div>
              <div>
                <div className={styles.statLbl}>Loss</div>
                <div className={styles.statVal}>
                  <span className={styles.statNum}>1.082</span>
                  <span className={styles.statTrend}>↓ 0.34</span>
                </div>
              </div>
              <div>
                <div className={styles.statLbl}>Tokens / s</div>
                <div className={styles.statVal}>
                  <span className={styles.statNum}>184k</span>
                  <span className={styles.statHint}>per GPU</span>
                </div>
              </div>
              <div>
                <div className={styles.statLbl}>ETA</div>
                <div className={styles.statVal}>
                  <span className={styles.statNum}>2h 14m</span>
                </div>
              </div>
            </div>

            <div className={styles.chart}>
              <div className={styles.chartLbl}>Training loss · last 12k steps</div>
              <svg viewBox="0 0 360 120" preserveAspectRatio="none" className={styles.chartSvg}>
                <defs>
                  <linearGradient id="lossfill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="lossstroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
                <path d={`${lossPath} L 340 120 L 4 120 Z`} fill="url(#lossfill)" />
                <path d={lossPath} fill="none" stroke="url(#lossstroke)" strokeWidth="2" />
              </svg>
            </div>

            <div className={styles.boardFoot}>
              <span>
                Last checkpoint <b>3 min ago</b> · streamed to S3
              </span>
              <span className={styles.foundLink}>View MLflow →</span>
            </div>
          </div>

          {/* INFERENCE */}
          <div className={styles.board}>
            <div className={styles.boardHead}>
              <div className={styles.boardTitleWrap}>
                <span className={styles.boardIco} style={{ background: 'rgba(52,211,153,0.16)', color: 'var(--green)' }}>
                  <Icon name="gauge" size={16} strokeWidth={2.2} />
                </span>
                <div>
                  <div className={styles.boardTitle}>Inference · vLLM serving</div>
                  <div className={styles.boardSub}>llama-3-70b-instruct · 4 replicas</div>
                </div>
              </div>
              <span className={`${styles.pill} ${styles.pillWarn}`}>p99 drift</span>
            </div>

            <div className={styles.infGrid}>
              <div className={styles.infCell}>
                <div className={styles.statLbl}>Throughput</div>
                <div className={styles.statNum}>1.4k</div>
                <div className={styles.statHint}>req / min</div>
              </div>
              <div className={styles.infCell}>
                <div className={styles.statLbl}>p50 latency</div>
                <div className={styles.statNum}>184<span className={styles.unit}>ms</span></div>
              </div>
              <div className={styles.infCell}>
                <div className={styles.statLbl}>p99 latency</div>
                <div className={`${styles.statNum} ${styles.statBad}`}>1.42<span className={styles.unit}>s</span></div>
              </div>
              <div className={styles.infCell}>
                <div className={styles.statLbl}>KV cache</div>
                <div className={styles.statNum}>78<span className={styles.unit}>%</span></div>
              </div>
            </div>

            <div className={styles.chart}>
              <div className={styles.chartLbl}>Latency distribution · last 5m</div>
              <div className={styles.histogram}>
                {latencyBars.map((h, i) => (
                  <span
                    key={i}
                    className={styles.histBar}
                    style={{ height: `${h}%` }}
                    data-bad={i >= 12 ? 'true' : undefined}
                  />
                ))}
              </div>
            </div>

            <div className={styles.boardFoot}>
              <span>
                <b>AI suggests:</b> long-context queries hitting cache evictions
              </span>
              <span className={styles.foundLink}>Open RCA →</span>
            </div>
          </div>
        </div>

        {/* Failure modes catalog */}
        <div className={`${styles.failures} reveal`}>
          <div className={styles.failuresHead}>
            <span className="sec-tag">What we catch</span>
            <h3>The ML failure-mode catalog, baked in.</h3>
            <p>
              Every signal is mapped to a known failure pattern across the GPU stack, distributed
              training frameworks, pipeline orchestrators, model serving, vector databases and the
              registry. So your on-call gets a real diagnosis, not a Datadog graph.
            </p>
          </div>
          <div className={styles.failGrid}>
            {failureModes.map((f) => (
              <div key={f.label} className={styles.failCard}>
                <span className={styles.failIco}>
                  <Icon name={f.ico as any} size={18} strokeWidth={2.2} />
                </span>
                <div>
                  <div className={styles.failTitle}>{f.label}</div>
                  <div className={styles.failDesc}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
