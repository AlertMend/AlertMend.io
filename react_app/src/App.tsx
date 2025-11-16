import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CaseStudiesPage from './pages/CaseStudiesPage'
import CaseStudyDetailPage from './pages/CaseStudyDetailPage'
import SolutionDetailPage from './pages/SolutionDetailPage'
import PricingPage from './pages/PricingPage'
import DocumentationPage from './pages/DocumentationPage'
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/case-studies" element={<CaseStudiesPage />} />
      <Route path="/case-studies/:slug" element={<CaseStudyDetailPage />} />
      <Route path="/solutions/:id" element={<SolutionDetailPage />} />
      <Route path="/auto-remediation" element={<SolutionDetailPage />} />
      <Route path="/kubernetes-management" element={<SolutionDetailPage />} />
      <Route path="/on-call-management" element={<SolutionDetailPage />} />
      <Route path="/kubernetes-cost-optimization" element={<SolutionDetailPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/documentation" element={<DocumentationPage />} />
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
  )
}

export default App

