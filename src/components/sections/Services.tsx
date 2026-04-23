import Icon from '../ui/Icon';
import BrandLogo, { svgPornUrl } from '../ui/BrandLogo';
import styles from './Services.module.css';

type Svc = {
  name: string;
  tag: string;
  modes: string[];
  /** Direct logo URL override (used first) */
  src?: string;
  /** Simple Icons slug (https://simpleicons.org) */
  slug?: string;
  /** Fallback domain for favicon if Simple Icons doesn't have a slug */
  domain?: string;
  /** Force a hex tint (no #) when the brand color is too dark for our theme */
  tint?: string;
};

const services: Svc[] = [
  {
    name: 'MySQL',
    tag: 'Replication & query intelligence',
    modes: ['Replication lag', 'Slow queries', 'Deadlocks', 'Connection storms', 'Buffer pool pressure'],
    slug: 'mysql',
    domain: 'mysql.com',
  },
  {
    name: 'PostgreSQL',
    tag: 'WAL, vacuum, lock awareness',
    modes: ['Replication slot bloat', 'Autovacuum lag', 'Lock contention', 'Long-running tx', 'WAL exhaustion'],
    slug: 'postgresql',
    domain: 'postgresql.org',
  },
  {
    name: 'MongoDB',
    tag: 'Replica sets & sharding',
    modes: ['Replica set lag', 'Oplog window', 'Slow queries', 'Election storms', 'Chunk imbalance'],
    slug: 'mongodb',
    domain: 'mongodb.com',
  },
  {
    name: 'Apache Kafka',
    tag: 'Streaming & consumer health',
    modes: ['Consumer lag', 'ISR shrink', 'Partition skew', 'Offset commit fail', 'Broker disk pressure'],
    slug: 'apachekafka',
    domain: 'kafka.apache.org',
  },
  {
    name: 'Nginx',
    tag: 'Edge & upstream intelligence',
    modes: ['5xx spikes', 'Upstream errors', 'Worker exhaustion', 'TLS handshake fail', 'Conn-limit hit'],
    slug: 'nginx',
    domain: 'nginx.org',
  },
  {
    name: 'Redis',
    tag: 'Cache & persistence patterns',
    modes: ['Memory pressure', 'Eviction storms', 'AOF / RDB fail', 'Replication break', 'Slow commands'],
    slug: 'redis',
    domain: 'redis.io',
  },
  {
    name: 'Elasticsearch / OpenSearch',
    tag: 'Cluster, shard, query health',
    modes: ['Heap pressure', 'Shard relocation', 'Slow queries', 'Yellow / red status', 'Indexing throttling'],
    slug: 'elasticsearch',
    domain: 'elastic.co',
  },
  {
    name: 'RabbitMQ',
    tag: 'Queue depth & flow control',
    modes: ['Queue depth', 'Channel churn', 'Memory alarm', 'Disk-space alarm', 'Unack messages'],
    slug: 'rabbitmq',
    domain: 'rabbitmq.com',
  },
  {
    name: 'Cassandra',
    tag: 'Compaction & read-path',
    modes: ['Compaction backlog', 'Hint overload', 'Tombstone scans', 'Read repair storms', 'GC pauses'],
    slug: 'apachecassandra',
    domain: 'cassandra.apache.org',
  },
  {
    name: 'etcd',
    tag: 'Raft & control-plane safety',
    modes: ['Raft leader churn', 'Slow apply', 'DB size growth', 'Quota exceeded', 'Disk fsync latency'],
    slug: 'etcd',
    domain: 'etcd.io',
  },
  {
    name: 'HAProxy',
    tag: 'L4 / L7 load balancer health',
    modes: ['Backend down', 'Queue depth', 'Conn-limit hit', 'Health-check fail', 'SSL errors'],
    slug: 'haproxy',
    domain: 'haproxy.org',
  },
  {
    name: 'NVIDIA GPU',
    tag: 'CUDA, MIG & nvidia-smi',
    modes: ['CUDA OOM', 'Thermal throttling', 'ECC errors', 'MIG slice exhaust', 'Idle GPUs'],
    slug: 'nvidia',
    domain: 'nvidia.com',
  },
  {
    name: 'PyTorch DDP',
    tag: 'Distributed training & NCCL',
    modes: ['NCCL timeout', 'Loss NaN', 'Gradient explode', 'Dataloader stall', 'Checkpoint fail'],
    slug: 'pytorch',
    domain: 'pytorch.org',
  },
  {
    name: 'Ray',
    tag: 'Distributed compute & RLlib',
    modes: ['Head-node OOM', 'Actor restart loop', 'Object spill', 'Autoscaler stuck', 'Plasma full'],
    slug: 'ray',
    domain: 'ray.io',
  },
  {
    name: 'Kubeflow',
    tag: 'ML pipelines on Kubernetes',
    modes: ['Pipeline DAG fail', 'KFServing 5xx', 'Notebook OOM', 'Katib trial timeout', 'TFJob restart'],
    slug: 'kubeflow',
    domain: 'kubeflow.org',
  },
  {
    name: 'MLflow',
    tag: 'Experiment tracking & registry',
    modes: ['Run write fail', 'Artifact upload', 'Registry drift', 'Tracking server slow', 'Stale model'],
    slug: 'mlflow',
    domain: 'mlflow.org',
  },
  {
    name: 'vLLM / Triton',
    tag: 'LLM inference serving',
    modes: ['p99 latency drift', 'KV cache pressure', 'Batch starvation', 'Model load fail', 'OOM kill'],
    slug: 'nvidia',
    domain: 'nvidia.com',
  },
  {
    name: 'Argo Workflows',
    tag: 'Pipeline orchestration',
    modes: ['Workflow stuck', 'Pod retry storm', 'Artifact lost', 'Suspended step', 'Cron skip'],
    slug: 'argo',
    domain: 'argoproj.io',
  },
  {
    name: 'Pinecone / Weaviate',
    tag: 'Vector DB & retrieval',
    modes: ['Index rebuild', 'Recall drop', 'Query p99 spike', 'Shard imbalance', 'Embedding lag'],
    src: svgPornUrl('pinecone'),
    domain: 'pinecone.io',
  },
  {
    name: 'Apache Airflow',
    tag: 'Data & ML DAG scheduler',
    modes: ['Scheduler heartbeat', 'Task SLA miss', 'XCom oversize', 'DAG parse fail', 'Worker stall'],
    slug: 'apacheairflow',
    domain: 'airflow.apache.org',
  },
  {
    name: 'Apache Spark',
    tag: 'Batch & ML feature compute',
    modes: ['Executor OOM', 'Shuffle skew', 'Driver GC', 'Stage retry storm', 'Slow task'],
    slug: 'apachespark',
    domain: 'spark.apache.org',
  },
];

const more = ['Vault', 'Consul', 'ClickHouse', 'CockroachDB', 'Temporal', 'Flink', 'Milvus', 'Feast', 'TensorFlow', 'JAX'];

export default function Services() {
  return (
    <section id="services" className={styles.section}>
      <div className="container">
        <div className="sec-head reveal">
          <span className="sec-tag">Service-specialized AI</span>
          <h2>Not a generic LLM. Trained for the services you actually run.</h2>
          <p>
            Every service has its own failure-mode vocabulary. AlertMend ships purpose-built RCA
            models, runbook templates, and health rules for the databases, queues, proxies, caches,
            search engines, GPU fleets, distributed training frameworks, ML pipelines, and LLM
            inference servers that power production. So the AI knows what a CUDA OOM, a stuck
            Kubeflow DAG, a Mongo replica lag, and a Kafka ISR shrink each really mean.
          </p>
        </div>

        <div className={`${styles.grid} reveal`}>
          {services.map((s) => (
            <div key={s.name} className={styles.card}>
              <div className={styles.head}>
                <span className={styles.logoChip}>
                  <BrandLogo
                    src={s.src}
                    slug={s.slug}
                    domain={s.domain}
                    tint={s.tint}
                    alt={s.name}
                    className={styles.logoImg}
                  />
                </span>
                <div>
                  <div className={styles.name}>{s.name}</div>
                  <div className={styles.tag}>{s.tag}</div>
                </div>
              </div>
              <div className={styles.modes}>
                {s.modes.map((m) => (
                  <span key={m} className={styles.mode}>
                    {m}
                  </span>
                ))}
              </div>
            </div>
          ))}

          <div className={`${styles.card} ${styles.more}`}>
            <div className={styles.head}>
              <div className={styles.moreIco}>
                <Icon name="plus" size={22} />
              </div>
              <div>
                <div className={styles.name}>Your service here</div>
                <div className={styles.tag}>Custom training on request</div>
              </div>
            </div>
            <div className={styles.modes}>
              {more.map((m) => (
                <span key={m} className={styles.mode}>
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className={`${styles.foot} reveal`}>
          <div className={styles.footText}>
            Each service ships with its own <b>failure-mode catalog</b>, <b>health-rule presets</b>,{' '}
            <b>runbook templates</b>, and <b>RCA prompts</b> tuned to the way that service actually
            breaks in production.
          </div>
          <a href="#pricing" className="btn btn-ghost">
            Don't see your service? Tell us
            <Icon name="arrow" size={14} className="arrow" strokeWidth={2.5} />
          </a>
        </div>
      </div>
    </section>
  );
}
