import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import SEO from '../../components/SEO'
import { ensureUniqueMetaDescription } from '../../utils/descriptionUtils'

export default function SlackTokenChannelPage() {
  const baseDescription = "Learn how to get a Slack token and channel ID for AlertMend AI integration. Complete guide for Slack authentication setup."
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'documentation', 'slack-token-channel')

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Get Slack Token and Channel ID | AlertMend AI Documentation"
        description={uniqueDescription}
        keywords="Slack token, Slack channel ID, Slack authentication, AlertMend Slack setup"
        canonical="/documentation/slack-token-channel"
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
                How to Get a Slack Token and Channel ID
              </h1>
              <p className="text-xl text-gray-600">
                Complete guide to obtain Slack authentication tokens and channel identifiers
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">Getting Your Slack Bot Token</h2>
              
              <h3 className="text-xl font-bold text-purple-900 mt-6 mb-3">Method 1: Using Slack App (Recommended)</h3>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>Go to <a href="https://api.slack.com/apps" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">api.slack.com/apps</a></li>
                <li>Select your app or create a new one</li>
                <li>Navigate to "OAuth & Permissions" in the sidebar</li>
                <li>Scroll to "OAuth Tokens for Your Workspace"</li>
                <li>Copy the "Bot User OAuth Token" (format: <code className="bg-gray-100 px-2 py-1 rounded">xoxb-xxxxxxxxxxxx-xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx</code>)</li>
              </ol>

              <h3 className="text-xl font-bold text-purple-900 mt-6 mb-3">Method 2: Using Legacy Token (Not Recommended)</h3>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>Visit <a href="https://api.slack.com/custom-integrations/legacy-tokens" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">Legacy Token Generator</a></li>
                <li>Select your workspace</li>
                <li>Copy the generated token (format: <code className="bg-gray-100 px-2 py-1 rounded">xoxp-xxxxxxxxxxxx-xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx</code>)</li>
                <li className="text-orange-600 font-medium">⚠️ Note: Legacy tokens are deprecated and may stop working in the future</li>
              </ol>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">Getting Your Channel ID</h2>
              
              <h3 className="text-xl font-bold text-purple-900 mt-6 mb-3">Method 1: From Slack Desktop/Web App</h3>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>Open Slack and navigate to the channel</li>
                <li>Click on the channel name at the top</li>
                <li>Scroll down to "About" section</li>
                <li>Find "Channel ID" and copy it (format: <code className="bg-gray-100 px-2 py-1 rounded">C0123456789</code>)</li>
              </ol>

              <h3 className="text-xl font-bold text-purple-900 mt-6 mb-3">Method 2: Using Slack API</h3>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>Use the <code className="bg-gray-100 px-2 py-1 rounded">conversations.list</code> API endpoint</li>
                <li>Make a GET request: <code className="bg-gray-100 px-2 py-1 rounded">https://slack.com/api/conversations.list?token=YOUR_TOKEN</code></li>
                <li>Find your channel in the response and note its <code className="bg-gray-100 px-2 py-1 rounded">id</code> field</li>
              </ol>

              <h3 className="text-xl font-bold text-purple-900 mt-6 mb-3">Method 3: From Channel URL</h3>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>Open the channel in Slack web app</li>
                <li>Look at the URL: <code className="bg-gray-100 px-2 py-1 rounded">https://workspace.slack.com/archives/C0123456789</code></li>
                <li>The channel ID is the part after <code className="bg-gray-100 px-2 py-1 rounded">/archives/</code></li>
              </ol>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">Using in AlertMend AI</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>Log in to AlertMend AI dashboard</li>
                <li>Go to Settings → Integrations → Slack</li>
                <li>Paste your Bot Token in the "Slack Token" field</li>
                <li>Enter your Channel ID in the "Channel ID" field</li>
                <li>Click "Test Connection" to verify</li>
                <li>Save the configuration</li>
              </ol>

              <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 mt-8 rounded-r-lg">
                <h3 className="text-yellow-950 font-bold mb-2">⚠️ Security Best Practices</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>Never share your Slack token publicly or commit it to version control</li>
                  <li>Use environment variables or secure secret management</li>
                  <li>Rotate tokens regularly, especially if compromised</li>
                  <li>Use Bot tokens instead of User tokens when possible</li>
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

