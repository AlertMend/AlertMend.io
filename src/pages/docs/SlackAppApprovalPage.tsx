import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import SEO from '../../components/SEO'
import { ensureUniqueMetaDescription } from '../../utils/descriptionUtils'

export default function SlackAppApprovalPage() {
  const baseDescription = "Learn how to configure a Slack App for approval workflows in AlertMend AI. Step-by-step guide for setting up Slack integration."
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'documentation', 'slack-app-approval')

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="AlertMend AI: Configure Slack App for Approval Workflows"
        description={uniqueDescription}
        keywords="Slack integration, Slack app approval, AlertMend Slack setup, notification configuration"
        canonical="/documentation/slack-app-approval"
      />
      <Navbar />
      <main className="pt-24">
        <section className="py-12 md:py-16 container-padding">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <a href="/documentation" className="text-purple-600 hover:text-purple-800 text-sm font-medium mb-4 inline-block">
                ← Back to Documentation
              </a>
              <h1 className="text-4xl md:text-5xl font-black text-purple-950 mb-4">
                How to Configure a Slack App for Approval
              </h1>
              <p className="text-xl text-gray-600">
                Step-by-step guide to set up Slack App for approval workflows in AlertMend AI
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              <div className="bg-purple-50 border-l-4 border-purple-600 p-6 mb-8 rounded-r-lg">
                <h3 className="text-purple-950 font-bold mb-2">Prerequisites</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>Admin access to your Slack workspace</li>
                  <li>AlertMend AI account with appropriate permissions</li>
                  <li>Basic understanding of Slack app configuration</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">Step 1: Create a Slack App</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>Navigate to <a href="https://api.slack.com/apps" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">api.slack.com/apps</a></li>
                <li>Click "Create New App" and select "From scratch"</li>
                <li>Enter your app name (e.g., "AlertMend AI") and select your workspace</li>
                <li>Click "Create App" to proceed</li>
              </ol>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">Step 2: Configure App Permissions</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>In the app settings, navigate to "OAuth & Permissions"</li>
                <li>Scroll to "Scopes" section and add the following Bot Token Scopes:
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li><code className="bg-gray-100 px-2 py-1 rounded">chat:write</code> - Send messages</li>
                    <li><code className="bg-gray-100 px-2 py-1 rounded">channels:read</code> - View channel information</li>
                    <li><code className="bg-gray-100 px-2 py-1 rounded">users:read</code> - View user information</li>
                    <li><code className="bg-gray-100 px-2 py-1 rounded">reactions:write</code> - Add reactions</li>
                  </ul>
                </li>
                <li>Save the changes</li>
              </ol>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">Step 3: Install App to Workspace</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>Click "Install to Workspace" at the top of the OAuth & Permissions page</li>
                <li>Review the permissions and click "Allow"</li>
                <li>Copy the "Bot User OAuth Token" (starts with <code className="bg-gray-100 px-2 py-1 rounded">xoxb-</code>)</li>
              </ol>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">Step 4: Configure in AlertMend AI</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>Log in to your AlertMend AI dashboard</li>
                <li>Navigate to Settings → Integrations → Slack</li>
                <li>Paste the Bot User OAuth Token</li>
                <li>Select the channel where approval requests should be sent</li>
                <li>Click "Save" to complete the configuration</li>
              </ol>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">Step 5: Test the Integration</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>Create a test approval workflow in AlertMend AI</li>
                <li>Trigger the workflow and verify that approval requests appear in your Slack channel</li>
                <li>Test approving and rejecting requests from Slack</li>
              </ol>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mt-8 rounded-r-lg">
                <h3 className="text-blue-950 font-bold mb-2">💡 Tips</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>Keep your Bot Token secure and never share it publicly</li>
                  <li>Use a dedicated channel for approval requests to keep them organized</li>
                  <li>Set up notifications to ensure timely responses to approval requests</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

