import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import SEO from '../../components/SEO'
import { ensureUniqueMetaDescription } from '../../utils/descriptionUtils'

export default function MSTeamsWebhookPage() {
  const baseDescription = "Learn how to create an incoming webhook URL in Microsoft Teams for AlertMend AI integration. Setup webhook notifications."
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'documentation', 'ms-teams-webhook')

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Create MS Teams Incoming Webhook | AlertMend AI Documentation"
        description={uniqueDescription}
        keywords="MS Teams webhook, Teams incoming webhook, webhook URL, AlertMend Teams webhook"
        canonical="/documentation/ms-teams-webhook"
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
                How to Create an Incoming Webhook URL in MS Teams
              </h1>
              <p className="text-xl text-gray-600">
                Step-by-step guide to create and configure incoming webhooks in Microsoft Teams
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              <div className="bg-purple-50 border-l-4 border-purple-600 p-6 mb-8 rounded-r-lg">
                <h3 className="text-purple-950 font-bold mb-2">What is an Incoming Webhook?</h3>
                <p className="text-gray-700">
                  An incoming webhook is a simple way for external services (like AlertMend AI) to send messages 
                  to a Microsoft Teams channel. It's a URL that accepts HTTP POST requests with message content.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">Step 1: Open Teams Channel</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>Open Microsoft Teams</li>
                <li>Navigate to the team and channel where you want to receive notifications</li>
                <li>Click the three dots (⋯) next to the channel name</li>
                <li>Select "Connectors" from the dropdown menu</li>
              </ol>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">Step 2: Add Incoming Webhook Connector</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>In the Connectors dialog, search for "Incoming Webhook"</li>
                <li>Click on "Incoming Webhook"</li>
                <li>Click "Add" or "Configure"</li>
              </ol>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">Step 3: Configure Webhook</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>Enter a name for your webhook (e.g., "AlertMend AI Notifications")</li>
                <li>Optionally, upload an image/icon for the webhook (recommended: AlertMend logo)</li>
                <li>Click "Create"</li>
              </ol>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">Step 4: Copy Webhook URL</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>After creating, a webhook URL will be displayed</li>
                <li>The URL format: <code className="bg-gray-100 px-2 py-1 rounded">https://outlook.office.com/webhook/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/IncomingWebhook/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx</code></li>
                <li><strong>Important:</strong> Copy this URL immediately and store it securely</li>
                <li>Click "Done" to close the dialog</li>
              </ol>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">Step 5: Configure in AlertMend AI</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>Log in to AlertMend AI dashboard</li>
                <li>Navigate to Settings → Integrations → Microsoft Teams</li>
                <li>Select "Webhook" as the integration method</li>
                <li>Paste the webhook URL in the "Webhook URL" field</li>
                <li>Click "Test Connection" to verify</li>
                <li>You should see a test message in your Teams channel</li>
                <li>Click "Save" to complete the configuration</li>
              </ol>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">Step 6: Customize Message Format (Optional)</h2>
              <p className="text-gray-700 mb-4">
                In AlertMend AI, you can customize how messages appear in Teams:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Message title and description</li>
                <li>Color coding by severity (red for critical, yellow for warning, etc.)</li>
                <li>Action buttons (for approvals)</li>
                <li>Rich text formatting</li>
                <li>Attachments and images</li>
              </ul>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">Webhook Message Format</h2>
              <p className="text-gray-700 mb-4">
                AlertMend AI sends messages in Microsoft Teams' Adaptive Card format. Example structure:
              </p>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "type": "message",
  "attachments": [{
    "contentType": "application/vnd.microsoft.card.adaptive",
    "content": {
      "type": "AdaptiveCard",
      "body": [
        {
          "type": "TextBlock",
          "text": "AlertMend AI Notification",
          "weight": "Bolder",
          "size": "Medium"
        },
        {
          "type": "TextBlock",
          "text": "Incident detected: [Description]",
          "wrap": true
        }
      ],
      "actions": [
        {
          "type": "Action.Submit",
          "title": "Approve",
          "data": { "action": "approve" }
        }
      ]
    }
  }]
}`}
              </pre>

              <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 mt-8 rounded-r-lg">
                <h3 className="text-yellow-950 font-bold mb-2">⚠️ Security Best Practices</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>Treat webhook URLs as secrets - never share them publicly</li>
                  <li>Store webhook URLs in secure environment variables or secret management systems</li>
                  <li>Rotate webhook URLs periodically (delete old, create new)</li>
                  <li>Use different webhooks for different environments (dev, staging, prod)</li>
                  <li>Monitor webhook usage and revoke unused webhooks</li>
                </ul>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mt-8 rounded-r-lg">
                <h3 className="text-blue-950 font-bold mb-2">💡 Tips</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>Create separate webhooks for different notification types (alerts, approvals, reports)</li>
                  <li>Use descriptive names for easy identification</li>
                  <li>Test webhook delivery before going live</li>
                  <li>Set up monitoring to detect webhook failures</li>
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

