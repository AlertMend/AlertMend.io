import { useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, type LucideIcon } from 'lucide-react'
import PlatformBoardMock from './mocks/PlatformBoardMock'
import PlatformBoardStage from './mocks/PlatformBoardStage'
import type { HomeProductId } from '../data/homeProducts'
import { withBrandLogo } from '../data/brandLogos'
import BrandLogo from './ui/BrandLogo'
import SEO from './SEO'
import styles from './SolutionPageTemplate.module.css'

/**
 * SolutionPageTemplate — the shared skeleton for the product pages.
 * White split hero: copy left, isometric product board right (same chrome
 * as the homepage, content focused on this product). Then a 3-step pipeline,
 * feature bento, dark scenario spotlight, and a CTA band.
 */

export type SolutionStep = {
  icon: LucideIcon
  title: string
  sub: string
  spec: string
}

export type SolutionFeature = {
  icon: LucideIcon
  title: string
  body: string
  chips: string[]
  big?: boolean
}

export type SolutionSpotlight = {
  tag: string
  title: string
  body: string
  steps: string[]
  linkTo: string
  linkLabel: string
  panel: ReactNode
}

export type SolutionWorksWithItem = {
  label: string
  /** Optional; omit when there is no /integrations/* page yet. */
  to?: string
}

export type SolutionWorksWith = {
  heading: string
  body: ReactNode
  items: SolutionWorksWithItem[]
}

export type SolutionPageProps = {
  seo: { title: string; description: string; keywords: string; canonical: string }
  badge: string
  /** Headline; wrap the accent words in <Accent> from this module. */
  headline: ReactNode
  sub: string
  signupUrl?: string
  checks: string[]
  /** HOME_PRODUCTS id — renders that product's isometric workspace in the hero. */
  highlightProduct: HomeProductId
  /** Optional prose band between hero and steps, for pages that need to define
   *  a term before selling the feature set. */
  explainer?: ReactNode
  stepsHeading: string
  stepsSub: string
  steps: SolutionStep[]
  featuresHeading: string
  featuresSub: string
  features: SolutionFeature[]
  /** Override the default infra “Works with” band (e.g. warehouse sources for Data). */
  worksWith?: SolutionWorksWith
  spotlight: SolutionSpotlight
  ctaHeading: string
  ctaSub: string
}

const DEMO_URL = 'https://calendly.com/hello-alertmend/30min'

const DEFAULT_WORKS_WITH: SolutionWorksWith = {
  heading: 'Runs on Kubernetes, AWS ECS, EC2 and plain VMs',
  body: (
    <>
      <p className="mt-3 text-[14px] leading-relaxed text-zinc-500">
        Containers or virtual machines, self-hosted or managed. AlertMend ingests the alerts you
        already have — Prometheus Alertmanager, Datadog, Grafana or a plain webhook — so SRE and
        DevOps teams cut MTTR without swapping out the stack or re-instrumenting anything.
      </p>
      <p className="mt-3 text-[14px] leading-relaxed text-zinc-500">
        One set of AI operations across the fleet: pair this with{' '}
        <Link
          to="/kubernetes-cost-optimization"
          className="font-medium text-violet-700 underline-offset-2 hover:underline"
        >
          Kubernetes cost optimization
        </Link>{' '}
        and{' '}
        <Link
          to="/gpu-mlops"
          className="font-medium text-violet-700 underline-offset-2 hover:underline"
        >
          GPU &amp; MLOps monitoring
        </Link>{' '}
        to cover spend and accelerators too.
      </p>
    </>
  ),
  items: [
    { label: 'Kubernetes', to: '/integrations/kubernetes' },
    { label: 'AWS ECS & EC2', to: '/integrations/aws' },
    { label: 'Prometheus', to: '/integrations/prometheus' },
    { label: 'Datadog', to: '/integrations/datadog' },
    { label: 'Grafana', to: '/integrations/grafana' },
    { label: 'Google Cloud', to: '/integrations/google-cloud' },
    { label: 'Azure', to: '/integrations/azure' },
    { label: 'Slack', to: '/integrations/slack' },
    { label: 'Microsoft Teams', to: '/integrations/ms-teams' },
  ],
}

/** Accent span for headline words. Violet-600 on the white hero. */
export function Accent({ children }: { children: ReactNode }) {
  return <span className="text-violet-600">{children}</span>
}

export default function SolutionPageTemplate(p: SolutionPageProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const worksWith = p.worksWith ?? DEFAULT_WORKS_WITH

  return (
    <div className="product-page bg-white text-zinc-900 font-sans">
      <SEO
        title={p.seo.title}
        description={p.seo.description}
        keywords={p.seo.keywords}
        canonical={p.seo.canonical}
      />

      {/* ============ Hero ============ */}
      <section className={styles.hero}>
        <div className={styles.wash} aria-hidden />
        <div className={styles.inner}>
          <div className={styles.copy}>
            <span className={styles.badge}>
              <span className={styles.badgeDot} />
              {p.badge}
            </span>
            <h1 className={styles.headline}>{p.headline}</h1>
            <p className={styles.sub}>{p.sub}</p>
            <div className={styles.actions}>
              <a
                href={DEMO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.primary}
              >
                Book a demo <ArrowRight className="h-4 w-4" />
              </a>
              <Link to="/contact" className={styles.secondary}>
                Talk with us
              </Link>
            </div>
            <div className={styles.checks}>
              {p.checks.map((t) => (
                <span key={t} className={styles.check}>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" strokeWidth={2} /> {t}
                </span>
              ))}
            </div>
          </div>
          <div className={styles.visual}>
            <PlatformBoardStage split>
              <PlatformBoardMock activeProduct={p.highlightProduct} />
            </PlatformBoardStage>
          </div>
        </div>
      </section>

      {/* ============ Explainer (optional) ============ */}
      {p.explainer ? (
        <section className="border-b border-zinc-100 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-16">{p.explainer}</div>
        </section>
      ) : null}

      {/* ============ Steps ============ */}
      <section className="border-b border-zinc-100 bg-zinc-50/70">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[1.65rem] font-bold tracking-tight text-zinc-950 md:text-3xl">
              {p.stepsHeading}
            </h2>
            <p className="mt-2.5 text-[15px] leading-relaxed text-zinc-500">{p.stepsSub}</p>
          </div>
          <div className="mt-10 grid gap-3 md:grid-cols-3">
            {p.steps.map((s, i) => (
              <div
                key={s.title}
                className="rounded-[10px] border border-zinc-200/80 bg-white p-5"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-violet-600/[0.08] text-violet-700">
                    <s.icon className="h-4 w-4" strokeWidth={1.7} />
                  </span>
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                      Step {i + 1}
                    </div>
                    <div className="text-[15px] font-semibold text-zinc-950">{s.title}</div>
                  </div>
                </div>
                <div className="mt-3 text-sm font-medium text-zinc-800">{s.sub}</div>
                <p className="mt-1 text-[13px] leading-relaxed text-zinc-500">{s.spec}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Feature bento ============ */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="py-14 md:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[1.65rem] font-bold tracking-tight text-zinc-950 md:text-3xl">
              {p.featuresHeading}
            </h2>
            <p className="mt-2.5 text-[15px] leading-relaxed text-zinc-500">{p.featuresSub}</p>
          </div>
          <div className="mt-10 grid gap-3 md:grid-cols-3">
            {p.features.map((f) => (
              <div
                key={f.title}
                className={`rounded-[10px] border border-zinc-200/80 bg-white p-5 transition hover:border-zinc-300 ${
                  f.big ? 'md:col-span-2' : ''
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-violet-600/[0.08] text-violet-700">
                    <f.icon className="h-4 w-4" strokeWidth={1.7} />
                  </span>
                  <h3 className="text-[15px] font-semibold text-zinc-950">{f.title}</h3>
                </div>
                <p className="mt-2.5 text-[13px] leading-relaxed text-zinc-500">{f.body}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {f.chips.map((c) => {
                    const brand = withBrandLogo({ label: c })
                    const hasLogo = Boolean(brand.logoSrc || brand.iconSlug)
                    return (
                      <span
                        key={c}
                        className="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] text-zinc-500"
                      >
                        {hasLogo && (
                          <BrandLogo
                            src={brand.logoSrc}
                            slug={brand.iconSlug}
                            tint={brand.logoTint}
                            domain={brand.domain}
                            alt=""
                            className="h-3 w-3 object-contain"
                          />
                        )}
                        {c}
                      </span>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Works with ============ */}
      <section className="border-t border-zinc-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12 md:py-14">
          <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-12">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-600">
                Works with
              </span>
              <h2 className="mt-3 text-[1.35rem] font-bold tracking-tight text-zinc-950">
                {worksWith.heading}
              </h2>
              {worksWith.body}
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {worksWith.items.map((raw) => {
                const i = withBrandLogo(raw)
                const cellClass =
                  'flex items-center gap-2.5 rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-[13px] font-medium text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-950'
                const logo = (
                  <BrandLogo
                    src={i.logoSrc}
                    slug={i.iconSlug}
                    tint={i.logoTint}
                    domain={i.domain}
                    alt=""
                    className="h-5 w-5 flex-none object-contain"
                  />
                )
                return i.to ? (
                  <Link key={i.label} to={i.to} className={cellClass}>
                    {logo}
                    <span className="min-w-0 truncate">{i.label}</span>
                  </Link>
                ) : (
                  <span key={i.label} className={cellClass}>
                    {logo}
                    <span className="min-w-0 truncate">{i.label}</span>
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============ Spotlight (dark scenario) ============ */}
      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-300">
                {p.spotlight.tag}
              </span>
              <h2 className="mt-3 text-[1.65rem] font-bold tracking-tight md:text-3xl">
                {p.spotlight.title}
              </h2>
              <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-zinc-400">
                {p.spotlight.body}
              </p>
              <ul className="mt-6 space-y-2.5">
                {p.spotlight.steps.map((t, i) => (
                  <li key={t} className="flex items-start gap-2.5 text-[13px] text-zinc-300">
                    <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-md bg-violet-600 text-[10px] font-bold text-white">
                      {i + 1}
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-7">
                <Link
                  to={p.spotlight.linkTo}
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold !text-zinc-950 transition hover:bg-zinc-100"
                >
                  {p.spotlight.linkLabel} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            {p.spotlight.panel}
          </div>
        </div>
      </section>

      {/* ============ CTA band ============ */}
      <section className="border-t border-zinc-100 bg-zinc-50/70">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center md:py-16">
          <h2 className="text-[1.65rem] font-bold tracking-tight text-zinc-950 md:text-3xl">
            {p.ctaHeading}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-zinc-500">
            {p.ctaSub}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-2.5">
            <a
              href={DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-950 px-5 py-2.5 text-sm font-semibold !text-white transition hover:bg-zinc-800"
            >
              Book a demo <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 transition hover:border-zinc-300"
            >
              Talk with us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Shared dark console chrome for the hero mocks                       */
/* ------------------------------------------------------------------ */
export function ConsoleFrame({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div
      className="overflow-hidden rounded-[10px] border border-zinc-200 shadow-[0_24px_60px_-28px_rgba(24,24,27,0.45)]"
      style={{
        background: 'linear-gradient(180deg, #121214 0%, #0c0c0e 100%)',
      }}
    >
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-3.5 py-2.5">
        <span className="h-2 w-2 rounded-full" style={{ background: '#ff5f57' }} />
        <span className="h-2 w-2 rounded-full" style={{ background: '#febc2e' }} />
        <span className="h-2 w-2 rounded-full" style={{ background: '#28c840' }} />
        <span className="ml-1.5 font-mono text-[11px] text-white/50">{title}</span>
        <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-400/90">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Live
        </span>
      </div>
      <div className="p-3.5 md:p-4">{children}</div>
    </div>
  )
}
