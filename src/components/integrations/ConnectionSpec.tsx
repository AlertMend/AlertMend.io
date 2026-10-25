import { Link } from 'react-router-dom'
import { Activity, ScanSearch, Send, type LucideIcon } from 'lucide-react'
import BrandLogo from '../ui/BrandLogo'
import AlertMendIcon from '../ui/AlertMendIcon'
import {
  dataFlows,
  dataFlowOrder,
  findConnectionMethod,
  setupStepsFor,
  type DataFlow,
  type Integration,
} from '../../data/integrations'
import styles from './ConnectionSpec.module.css'

/**
 * "How it connects" for one integration: a lane diagram (tool ⇄ AlertMend,
 * one lane per data flow) and the spec a security reviewer asks for.
 * Shared by the /integrations details panel and /integrations/<slug>.
 */
export default function ConnectionSpec({
  integration,
  showSetup = true,
}: {
  integration: Integration
  showSetup?: boolean
}) {
  const method = findConnectionMethod(integration.connection)
  const flows = dataFlowOrder.filter((f) => integration.dataFlow.includes(f))

  return (
    <div className={styles.spec}>
      <FlowLanes integration={integration} flows={flows} />

      <dl className={styles.rows}>
        <Row label="Integration type">
          <span className={styles.flowBadges}>
            {flows.map((f) => (
              <FlowBadge key={f} flow={f} />
            ))}
          </span>
        </Row>
        <Row label="Connection method">
          <Link to={`/integrations#method-${method.id}`} className={styles.methodLink}>
            {method.name}
          </Link>
        </Row>
        <Row label="You provide">{integration.auth}</Row>
        <Row label="Over">{integration.transport}</Row>
        <Row label="When">{integration.cadence}</Row>
        <Row label="Network">{method.network}</Row>
        <Row label="AlertMend reads">
          {integration.reads && integration.reads.length > 0 ? (
            <ul className={styles.list}>
              {integration.reads.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          ) : (
            method.reads
          )}
        </Row>
        <Row label="Can it change anything?">
          {integration.acts
            ? `Yes, through remediation flows you build: ${method.changes.charAt(0).toLowerCase()}${method.changes.slice(1)}`
            : method.changes}
        </Row>
      </dl>

      {showSetup && (
        <div className={styles.setup}>
          <h4 className={styles.setupHead}>Set it up</h4>
          <ol className={styles.steps}>
            {setupStepsFor(integration).map((step, i) => (
              <li key={step}>
                <span className={styles.stepNum}>{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}

const FLOW_ICONS: Record<DataFlow, LucideIcon> = {
  read: ScanSearch,
  stream: Activity,
  notify: Send,
}

export function FlowIcon({ flow, size = 14 }: { flow: DataFlow; size?: number }) {
  const Icon = FLOW_ICONS[flow]
  return <Icon size={size} strokeWidth={1.9} aria-hidden="true" className={styles.glyph} />
}

export function FlowBadge({ flow }: { flow: DataFlow }) {
  const info = dataFlows[flow]
  return (
    <span className={styles.badge} title={`${info.title}. ${info.hint}`}>
      <FlowIcon flow={flow} size={13} />
      {info.label}
    </span>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.row}>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}

/** Tool on the left, AlertMend on the right, one lane per flow. Arrows show which
 *  way data moves; the caption says who opens the connection. */
function FlowLanes({ integration, flows }: { integration: Integration; flows: DataFlow[] }) {
  const lanes: { key: string; flow: DataFlow | 'acts'; dir: 'in' | 'out'; caption: string }[] = flows.map((f) => ({
    key: f,
    flow: f,
    dir: f === 'notify' ? 'out' : 'in',
    caption:
      f === 'read'
        ? `AlertMend reads from ${integration.name}`
        : f === 'stream'
          ? `${integration.name} sends events to AlertMend`
          : `AlertMend sends to ${integration.name}`,
  }))
  if (integration.acts && !flows.includes('notify')) {
    lanes.push({ key: 'acts', flow: 'acts', dir: 'out', caption: 'Only after approval, fully audited' })
  }

  return (
    <div className={styles.lanes} role="img" aria-label={lanes.map((l) => l.caption).join('. ')}>
      <div className={styles.node}>
        <span className={styles.nodeLogo}>
          <BrandLogo
            src={integration.logoSrc}
            slug={integration.iconSlug}
            tint={integration.logoTint}
            domain={integration.domain}
            alt=""
            className={styles.nodeImg}
          />
        </span>
        <span className={styles.nodeName}>{integration.name}</span>
        <span className={styles.nodeWhere}>Your environment</span>
      </div>

      <div className={styles.laneStack}>
        {lanes.map((l) => (
          <div key={l.key} className={`${styles.lane} ${styles[`lane_${l.flow}`]}`}>
            <span className={styles.laneLabel}>
              {l.flow === 'acts' ? 'Approved actions' : dataFlows[l.flow].label}
            </span>
            <span className={l.dir === 'in' ? styles.arrowIn : styles.arrowOut} />
            <span className={styles.laneCaption}>{l.caption}</span>
          </div>
        ))}
      </div>

      <div className={`${styles.node} ${styles.nodeAm}`}>
        <span className={styles.nodeLogo}>
          <AlertMendIcon className={styles.nodeImg} />
        </span>
        <span className={styles.nodeName}>AlertMend</span>
        <span className={styles.nodeWhere}>Checks · RCA · runbooks</span>
      </div>
    </div>
  )
}
