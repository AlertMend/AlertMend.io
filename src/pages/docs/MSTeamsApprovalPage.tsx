import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import SEO from '../../components/SEO'
import { ensureUniqueMetaDescription } from '../../utils/descriptionUtils'

export default function MSTeamsApprovalPage() {
  const baseDescription = "Learn how to configure Microsoft Teams for approval workflows in AlertMend AI. Step-by-step guide for MS Teams integration."
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'documentation', 'ms-teams-approval')

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="AlertMend AI: Configure MS Teams Approvals Easily"
        description={uniqueDescription}
        keywords="Microsoft Teams integration, MS Teams approval, AlertMend Teams setup, Teams notification"
        canonical="/documentation/ms-teams-approval"
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
                How to Configure MS Teams for Approval
              </h1>
              <p className="text-xl text-gray-600">
                Step-by-step guide to set up Microsoft Teams for approval workflows in AlertMend AI
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              <div className="bg-purple-50 border-l-4 border-purple-600 p-6 mb-8 rounded-r-lg">
                <h3 className="text-purple-950 font-bold mb-2">Prerequisites</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>Microsoft Teams admin access or appropriate permissions</li>
                  <li>AlertMend AI account with integration permissions</li>
                  <li>Access to Microsoft Azure AD (for app registration)</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">Step 1: Register App in Azure AD</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>Go to <a href="https://portal.azure.com" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">Azure Portal</a></li>
                <li>Navigate to "Azure Active Directory" → "App registrations"</li>
                <li>Click "New registration"</li>
                <li>Enter app name: "AlertMend AI"</li>
                <li>Select supported account types (usually "Accounts in this organizational directory only")</li>
                <li>Set redirect URI: <code className="bg-gray-100 px-2 py-1 rounded">https://alertmend.ai/auth/teams/callback</code></li>
                <li>Click "Register"</li>
              </ol>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">Step 2: Configure API Permissions</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>In your app registration, go to "API permissions"</li>
                <li>Click "Add a permission" → "Microsoft Graph" → "Delegated permissions"</li>
                <li>Add the following permissions:
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li><code className="bg-gray-100 px-2 py-1 rounded">ChannelMessage.Send</code></li>
                    <li><code className="bg-gray-100 px-2 py-1 rounded">Chat.ReadWrite</code></li>
                    <li><code className="bg-gray-100 px-2 py-1 rounded">Team.ReadBasic.All</code></li>
                    <li><code className="bg-gray-100 px-2 py-1 rounded">User.Read</code></li>
                  </ul>
                </li>
                <li>Click "Add permissions"</li>
                <li>Click "Grant admin consent" for your organization</li>
              </ol>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">Step 3: Create Client Secret</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>Go to "Certificates & secrets" in your app registration</li>
                <li>Click "New client secret"</li>
                <li>Add description: "AlertMend AI Integration"</li>
                <li>Set expiration (recommended: 24 months)</li>
                <li>Click "Add"</li>
                <li><strong>Important:</strong> Copy the secret value immediately (you won't be able to see it again)</li>
              </ol>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">Step 4: Get Application ID and Tenant ID</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>In your app registration overview, copy the "Application (client) ID"</li>
                <li>Copy the "Directory (tenant) ID"</li>
                <li>Save these values along with your client secret</li>
              </ol>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">Step 5: Configure in AlertMend AI</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>Log in to AlertMend AI dashboard</li>
                <li>Navigate to Settings → Integrations → Microsoft Teams</li>
                <li>Enter the following information:
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>Application (Client) ID</li>
                    <li>Client Secret</li>
                    <li>Tenant ID</li>
                  </ul>
                </li>
                <li>Click "Authorize" to connect your Teams account</li>
                <li>Select the team and channel for approval notifications</li>
                <li>Click "Save" to complete the configuration</li>
              </ol>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">Step 6: Test Approval Workflow</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>Create a test approval workflow in AlertMend AI</li>
                <li>Trigger the workflow</li>
                <li>Verify that approval requests appear in your Teams channel</li>
                <li>Test approving and rejecting requests from Teams</li>
                <li>Confirm that actions are reflected in AlertMend AI</li>
              </ol>

              <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 mt-8 rounded-r-lg">
                <h3 className="text-yellow-950 font-bold mb-2">⚠️ Security Notes</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>Store client secrets securely and never expose them in code</li>
                  <li>Rotate client secrets regularly</li>
                  <li>Use least-privilege permissions (only what's needed)</li>
                  <li>Monitor app usage in Azure AD audit logs</li>
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

