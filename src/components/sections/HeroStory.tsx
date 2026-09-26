import { useEffect, useState } from 'react'
import Icon from '../ui/Icon'
import type { Audience } from '../../hooks/useAudience'
import styles from './HeroStory.module.css'

type Step = { label: string; detail: string; tone: 'crit' | 'info' | 'ok' }

type Story = { title: string; channel: string; steps: Step[] }

/** Each audience cycles through its stories, one full story per loop. */
const STORIES: Record<Audience, Story[]> = {
  data: [
    {
      title: 'Bad data at 06:12',
      channel: 'Teams',
      steps: [
        { label: 'Check failed', detail: 'Uniqueness · customer_accounts.account_id · 98.7%', tone: 'crit' },
        { label: 'Job linked', detail: 'ODI nightly_load · ORA-01400', tone: 'info' },
        { label: 'Reports flagged', detail: '3 Power BI reports read this table', tone: 'ok' },
      ],
    },
    {
      title: 'Late data at 07:40',
      channel: 'Teams',
      steps: [
        { label: 'Freshness failed', detail: 'loans.daily_balance · 3h late', tone: 'crit' },
        { label: 'Job linked', detail: 'Airflow load_loans · stuck in retry', tone: 'info' },
        { label: 'Owner alerted', detail: 'Report flagged before the 9am meeting', tone: 'ok' },
      ],
    },
  ],
  infra: [
    {
      title: 'Sev-2 at 03:02',
      channel: 'Slack',
      steps: [
        { label: 'Alert fired', detail: 'checkout p99 812ms · Alertmanager', tone: 'crit' },
        { label: 'Root cause · 94%', detail: 'db pool saturated after deploy v2.31.4', tone: 'info' },
        { label: 'Approved in Slack', detail: '@alex · scale pool 20 → 50 · verified', tone: 'ok' },
      ],
    },
    {
      title: 'Cost review',
      channel: 'Slack',
      steps: [
        { label: 'Over-provisioned', detail: 'payments-api requests 2 CPU, uses 0.7', tone: 'crit' },
        { label: 'Right-size previewed', detail: 'CPU 2000m → 750m · YAML diff', tone: 'info' },
        { label: 'Approved · −$412/mo', detail: 'Applied with rollback armed', tone: 'ok' },
      ],
    },
    {
      title: 'Idle GPU',
      channel: 'Slack',
      steps: [
        { label: 'GPU idle for 6h', detail: 'a100-node-06 at 0% utilisation', tone: 'crit' },
        { label: 'Cause found', detail: 'Kubeflow task never scheduled', tone: 'info' },
        { label: 'Drain approved', detail: 'Node reclaimed · −$214/mo', tone: 'ok' },
      ],
    },
  ],
}

const STEP_MS = 1700
const HOLD_MS = 3200

/**
 * Animated incident card over the hero preview. Prerender (and reduced
 * motion) shows the finished story; the loop starts after hydration.
 */
export default function HeroStory({ audience }: { audience: Audience }) {
  const stories = STORIES[audience]
  const total = 3
  const [storyIdx, setStoryIdx] = useState(0)
  const [step, setStep] = useState(total)
  const story = stories[storyIdx % stories.length]

  useEffect(() => {
    setStoryIdx(0)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStep(total)
      return
    }
    let current = 0
    let idx = 0
    setStep(0)
    let timer: number
    const tick = () => {
      if (current >= total) {
        // Story finished and held: move to the next story.
        idx = (idx + 1) % stories.length
        setStoryIdx(idx)
        current = 0
      } else {
        current += 1
      }
      setStep(current)
      timer = window.setTimeout(tick, current >= total ? HOLD_MS : STEP_MS)
    }
    timer = window.setTimeout(tick, 900)
    return () => window.clearTimeout(timer)
  }, [audience, stories.length])

  return (
    <div className={styles.card} aria-hidden="true">
      <div className={styles.head}>
        <span className={styles.live}>
          <i /> Live
        </span>
        <strong>{story.title}</strong>
        <em>{story.channel}</em>
      </div>
      <ol className={styles.steps}>
        {story.steps.map((s, i) => {
          const state = i < step ? 'done' : i === step ? 'active' : 'pending'
          return (
            <li key={s.label} className={`${styles.step} ${styles[state]} ${styles[s.tone]}`}>
              <span className={styles.dot}>
                {state === 'done' ? <Icon name="check" size={11} strokeWidth={3} /> : i + 1}
              </span>
              <div>
                <b>{s.label}</b>
                <small>{s.detail}</small>
              </div>
            </li>
          )
        })}
      </ol>
      <div className={styles.progress}>
        <i style={{ width: `${(Math.min(step, total) / total) * 100}%` }} />
      </div>
    </div>
  )
}
