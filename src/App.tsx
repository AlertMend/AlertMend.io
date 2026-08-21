import { useEffect } from 'react'
import { Routes, Route, useLocation, Navigate, useParams } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import AmbientBackground from './components/layout/AmbientBackground'
import AnnounceBar from './components/layout/AnnounceBar'
import Nav from './components/layout/Nav'
import Footer from './components/layout/Footer'
import { useScrollReveal } from './hooks/useScrollReveal'
import HomePage from './pages/HomePage'
import CaseStudiesPage from './pages/CaseStudiesPage'
import CaseStudyDetailPage from './pages/CaseStudyDetailPage'
import KubernetesManagementPage from './pages/KubernetesManagementPage'
import OnCallManagementPage from './pages/OnCallManagementPage'
import KubernetesCostOptimizationPage from './pages/KubernetesCostOptimizationPage'
import LogManagementPage from './pages/LogManagementPage'
import GpuMlopsPage from './pages/GpuMlopsPage'
import ObservabilityPage from './pages/ObservabilityPage'
import DataObservabilityPage from './pages/DataObservabilityPage'
import AiRcaPage from './pages/AiRcaPage'
import AutoRemediationPage from './pages/AutoRemediationPage'
import IntegrationDetailPage from './pages/IntegrationDetailPage'
import PricingPage from './pages/PricingPage'
import DocumentationPage from './pages/DocumentationPage'
import DocArticlePage, { allGeneratedDocPaths } from './components/docs/DocArticle'
import SlackAppApprovalPage from './pages/docs/SlackAppApprovalPage'
import SlackTokenChannelPage from './pages/docs/SlackTokenChannelPage'
import SlackRCAChannelPage from './pages/docs/SlackRCAChannelPage'
import MSTeamsApprovalPage from './pages/docs/MSTeamsApprovalPage'
import MSTeamsRFPage from './pages/docs/MSTeamsRFPage'
import MSTeamsWebhookPage from './pages/docs/MSTeamsWebhookPage'
import DatadogWebhookPage from './pages/docs/DatadogWebhookPage'
import AlertMendVMActionsPage from './pages/docs/AlertMendVMActionsPage'
import AboutPage from './pages/AboutPage'
import BlogPage from './pages/BlogPage'
import BlogPostDetailPage from './pages/BlogPostDetailPage'
import CareersPage from './pages/CareersPage'
import ContactPage from './pages/ContactPage'
import PartnersPage from './pages/PartnersPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import SecurityPage from './pages/SecurityPage'
import CompliancePage from './pages/CompliancePage'
import HelpCenterPage from './pages/HelpCenterPage'
import CommunityPage from './pages/CommunityPage'
import TutorialsPage from './pages/TutorialsPage'
import WebinarsPage from './pages/WebinarsPage'
import NotFoundPage from './pages/NotFoundPage'
import LEGACY_SOLUTION_REDIRECTS from './data/legacySolutionRedirects.json'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
      return
    }

    /* Homepage (and any route) hash deep-links — e.g. /#integrations from the
       Platform mega-menu. Retry until the target mounts. */
    const id = hash.replace(/^#/, '')
    if (!id) return

    let cancelled = false
    let attempts = 0
    let timer = 0

    const tryScroll = () => {
      if (cancelled) return
      const el = document.getElementById(id)
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 70
        window.scrollTo({ top: Math.max(0, y), behavior: 'auto' })
        return
      }
      if (attempts++ < 40) timer = window.setTimeout(tryScroll, 100)
    }

    timer = window.setTimeout(tryScroll, 50)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [pathname, hash])
  return null
}

/** Old /solutions/:id marketing stack → current product routes.
 *
 *  Shared with vercel.json, which is regenerated from this same file by
 *  scripts/sync-vercel-solution-redirects.mjs. Vercel resolves its redirects
 *  before the SPA loads, so in production that layer wins; this route is the
 *  client-side equivalent for in-app navigation and `npm run dev`. Keeping one
 *  source of truth is what stops the two from drifting apart.
 *
 *  Unknown slugs deliberately fall through to NotFoundPage rather than
 *  redirecting to `/` — a permanent redirect to the homepage is a soft 404. */
function LegacySolutionRedirect() {
  const { id = '' } = useParams<{ id: string }>()
  const destination = (LEGACY_SOLUTION_REDIRECTS as Record<string, string>)[id]
  return destination ? <Navigate to={destination} replace /> : <NotFoundPage />
}

function App() {
  const { pathname } = useLocation()
  const isDocs = pathname.startsWith('/documentation')

  // Apply the dark theme to <body> for the entire app.
  useEffect(() => {
    document.body.classList.add('alertmend-dark')
    return () => {
      document.body.classList.remove('alertmend-dark')
    }
  }, [])

  // Re-trigger scroll-reveal on every route change so newly mounted sections animate in.
  useScrollReveal()

  return (
    <>
      {!isDocs && <AmbientBackground />}
      {!isDocs && <AnnounceBar />}
      {!isDocs && <Nav />}
      <ScrollToTop />
      <main className={isDocs ? 'docs-main' : undefined}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/case-studies" element={<CaseStudiesPage />} />
          <Route path="/case-studies/:slug" element={<CaseStudyDetailPage />} />
          <Route path="/solutions/:id" element={<LegacySolutionRedirect />} />
          <Route path="/integrations/:slug" element={<IntegrationDetailPage />} />
          <Route path="/auto-remediation" element={<AutoRemediationPage />} />
          <Route path="/kubernetes-management" element={<KubernetesManagementPage />} />
          <Route path="/on-call-management" element={<OnCallManagementPage />} />
          <Route path="/kubernetes-cost-optimization" element={<KubernetesCostOptimizationPage />} />
          <Route path="/observability" element={<ObservabilityPage />} />
          <Route path="/data-observability" element={<DataObservabilityPage />} />
          <Route path="/ai-rca" element={<AiRcaPage />} />
          <Route path="/log-management" element={<LogManagementPage />} />
          <Route path="/gpu-mlops" element={<GpuMlopsPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/documentation" element={<DocumentationPage />} />
          {allGeneratedDocPaths().map((path) => {
            const slug = path.replace('/documentation/', '')
            return (
              <Route
                key={path}
                path={path}
                element={<DocArticlePage slug={slug} />}
              />
            )
          })}
          <Route path="/documentation/slack-app-approval" element={<SlackAppApprovalPage />} />
          <Route path="/documentation/slack-token-channel" element={<SlackTokenChannelPage />} />
          <Route path="/documentation/slack-rca-channel" element={<SlackRCAChannelPage />} />
          <Route path="/documentation/ms-teams-approval" element={<MSTeamsApprovalPage />} />
          <Route path="/documentation/ms-teams-rf" element={<MSTeamsRFPage />} />
          <Route path="/documentation/ms-teams-webhook" element={<MSTeamsWebhookPage />} />
          <Route path="/documentation/datadog-webhook" element={<DatadogWebhookPage />} />
          <Route path="/documentation/alertmend-vm-actions" element={<AlertMendVMActionsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostDetailPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/compliance" element={<CompliancePage />} />
          <Route path="/help" element={<HelpCenterPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/tutorials" element={<TutorialsPage />} />
          <Route path="/webinars" element={<WebinarsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {!isDocs && <Footer />}
      <Analytics />
    </>
  )
}

export default App
