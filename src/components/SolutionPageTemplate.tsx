import { useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, type LucideIcon } from 'lucide-react'
import SEO from './SEO'

/**
 * SolutionPageTemplate — the shared skeleton for the redesigned product
 * pages (/kubernetes-management, /on-call-management,
 * /kubernetes-cost-optimization). Mirrors the structure that already ships
 * on /observability: dark violet hero with a product console, a 3-step
 * pipeline, a 6-tile feature bento, a dark scenario spotlight, and a CTA
 * band. All violet brand + Inter, all honest copy — the page-specific
 * content (and the console / spotlight mocks) come in as props.
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

export type SolutionPageProps = {
  seo: { title: string; description: string; keywords: string; canonical: string }
  badge: string
  /** Headline; wrap the accent words in <Accent> from this module. */
  headline: ReactNode
  sub: string
  signupUrl: string
  checks: string[]
  console: ReactNode
  stepsHeading: string
  stepsSub: string
  steps: SolutionStep[]
  featuresHeading: string
  featuresSub: string
  features: SolutionFeature[]
  spotlight: SolutionSpotlight
  ctaHeading: string
  ctaSub: string
}

const DEMO_URL = 'https://calendly.com/hello-alertmend/30min'

/** Gradient accent span for headline words. */
export function Accent({ children }: { children: ReactNode }) {
  return <span className="text-violet-300">{children}</span>
}

export default function SolutionPageTemplate(p: SolutionPageProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return (
    <div className="product-page bg-white text-zinc-900 font-sans">
      <SEO
        title={p.seo.title}
        description={p.seo.description}
        keywords={p.seo.keywords}
        canonical={p.seo.canonical}
      />

      {/* ============ Hero ============ */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            'radial-gradient(70% 55% at 80% 10%, rgba(124, 58, 237, 0.18), transparent 55%), linear-gradient(180deg, #0a0a0b 0%, #0c0c0e 55%, #09090b 100%)',
        }}
      >
        <div className="relative mx-auto max-w-6xl px-6 pt-14 pb-16 md:pt-20 md:pb-20">
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:gap-12">
            <div className="lg:pt-2">
              <span className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-300">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                {p.badge}
              </span>
              <h1 className="mt-5 text-[2rem] font-bold leading-[1.12] tracking-tight text-white md:text-[2.65rem] [text-wrap:balance]">
                {p.headline}
              </h1>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-zinc-400 md:text-base">
                {p.sub}
              </p>
              <div className="mt-7 flex flex-wrap gap-2.5">
                <a
                  href={p.signupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold !text-zinc-950 transition hover:bg-zinc-100"
                >
                  Start free <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href={DEMO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-transparent px-5 py-2.5 text-sm font-semibold !text-white transition hover:border-white/30 hover:bg-white/[0.04]"
                >
                  Book a demo
                </a>
              </div>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-zinc-500">
                {p.checks.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400/90" strokeWidth={2} /> {t}
                  </span>
                ))}
              </div>
            </div>
            {p.console}
          </div>
        </div>
      </section>

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
                  {f.chips.map((c) => (
                    <span
                      key={c}
                      className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] text-zinc-500"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
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
              href={p.signupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-zinc-950 px-5 py-2.5 text-sm font-semibold !text-white transition hover:bg-zinc-800"
            >
              Start free <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 transition hover:border-zinc-300"
            >
              Book a demo
            </a>
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
      className="overflow-hidden rounded-[10px] border border-white/[0.08] shadow-[0_24px_80px_-24px_rgba(0,0,0,0.85)]"
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
