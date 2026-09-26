import { Link } from 'react-router-dom'
import PlatformBoardMock from '../mocks/PlatformBoardMock'
import PlatformBoardStage from '../mocks/PlatformBoardStage'
import { useAudience, type Audience } from '../../hooks/useAudience'
import HeroStory from './HeroStory'
import { trackHomeCta } from '../../utils/analytics'
import styles from './Hero.module.css'
import { calendlyUrl } from '../../lib/calendly'


type Cta = { label: string; href: string; internal?: boolean; id: string }

const HERO_COPY: Record<
  Audience,
  { sub: string; primary: Cta; secondary: Cta; proof: string[]; signup: string }
> = {
  data: {
    sub: 'Turn your data quality policy into live checks on Snowflake and Oracle. When a check fails, see the job that caused it and the reports it affects, before anyone opens them.',
    primary: { id: 'hero_primary', label: 'See data observability', href: '/data-observability', internal: true },
    secondary: { id: 'hero_demo', label: 'Book the data demo', href: calendlyUrl('home-data-hero-demo') },
    proof: ['Read-only agent in your network', 'Checks cite your policy', 'Live in minutes'],
    signup: 'https://app.alertmend.io/signup?service=data-observability&source=homepage-hero',
  },
  infra: {
    sub: 'One timeline for Kubernetes, VMs, cloud and GPU fleets. Root cause in about 15 seconds, automated fixes that run the moment you approve them, and savings on your Kubernetes, AWS and GPU bill.',
    primary: { id: 'hero_health_check', label: 'Get a free health check', href: calendlyUrl('home-infra-hero-health-check') },
    secondary: { id: 'hero_explore', label: 'See how it works', href: '/observability', internal: true },
    proof: ['Read-only scan', 'Results in minutes', 'Prioritized fix and savings list'],
    signup: 'https://app.alertmend.io/signup?source=homepage-hero',
  },
}

const OPTIONS: { id: Audience; label: string; hint: string }[] = [
  { id: 'data', label: 'Data teams', hint: 'Warehouse data quality' },
  { id: 'infra', label: 'Platform & SRE', hint: 'Kubernetes, VMs, cloud, GPUs' },
]

function CtaLink({ cta, className, audience }: { cta: Cta; className: string; audience: Audience }) {
  const onClick = () => trackHomeCta(audience, cta.id, cta.href)
  return cta.internal ? (
    <Link to={cta.href} className={className} onClick={onClick}>
      {cta.label}
    </Link>
  ) : (
    <a href={cta.href} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick}>
      {cta.label}
    </a>
  )
}

/**
 * Homepage hero — one shared promise, a toggle for the two buyers.
 * The headline stays constant; subline, CTAs and the product mock follow the
 * selected audience (see hooks/useAudience).
 */
export default function Hero() {
  const { audience, setAudience } = useAudience()
  const copy = HERO_COPY[audience]

  return (
    <section className={styles.hero} id="top">
      <div className="container">
        <p className={styles.doorsTag}>Data observability · AI observability for Kubernetes and cloud</p>
        <h1 className={styles.h1}>
          Know what&apos;s broken{' '}
          <span className={styles.accent}>before the business does</span>
        </h1>

        <div className={styles.toggle} role="group" aria-label="Show AlertMend for">
          {OPTIONS.map((o) => (
            <button
              key={o.id}
              type="button"
              aria-pressed={audience === o.id}
              className={audience === o.id ? styles.toggleOn : styles.toggleBtn}
              onClick={() => setAudience(o.id)}
            >
              <strong>{o.label}</strong>
              <span>{o.hint}</span>
            </button>
          ))}
        </div>

        <p className={styles.sub} aria-live="polite">
          {copy.sub}
        </p>

        <div className={styles.heroCta}>
          <CtaLink cta={copy.primary} className={styles.ctaPrimary} audience={audience} />
          <CtaLink cta={copy.secondary} className={styles.ctaSecondary} audience={audience} />
        </div>
        <ul className={styles.proof}>
          {copy.proof.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <div className={styles.heroAlt}>
          <a
            href={copy.signup}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackHomeCta(audience, 'hero_start_free', copy.signup)}
          >
            Start free
          </a>
        </div>

        <div className={styles.stageWrap}>
          <PlatformBoardStage spaced className={styles.stageHome} key={audience}>
            {audience === 'data' ? <PlatformBoardMock dataOverview /> : <PlatformBoardMock />}
          </PlatformBoardStage>
          <HeroStory audience={audience} />
        </div>
      </div>
    </section>
  )
}
