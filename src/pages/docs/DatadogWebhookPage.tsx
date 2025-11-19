import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import SEO from '../../components/SEO'
import { ensureUniqueMetaDescription } from '../../utils/descriptionUtils'

export default function DatadogWebhookPage() {
  const baseDescription = "Learn how to setup custom webhook with Datadog monitors for AlertMend AI integration. Connect Datadog alerts to AlertMend."
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'documentation', 'datadog-webhook')

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="AlertMend AI: Datadog Webhook Setup for Incident Automation"
        description={uniqueDescription}
        keywords="Datadog webhook, Datadog integration, custom webhook, AlertMend Datadog setup"
        canonical="/documentation/datadog-webhook"
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
                How to Setup Custom Webhook with Datadog Monitors
              </h1>
              <p className="text-xl text-gray-600">
                Connect Datadog monitors to AlertMend AI using custom webhooks for automated incident management
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              <div className="bg-purple-50 border-l-4 border-purple-600 p-6 mb-8 rounded-r-lg">
                <h3 className="text-purple-950 font-bold mb-2">Prerequisites</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>Datadog account with admin or appropriate permissions</li>
                  <li>AlertMend AI account with webhook endpoint configured</li>
                  <li>Datadog monitors already created and configured</li>
                </ul>
              </div>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">Step 1: Get AlertMend Webhook URL</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>Log in to AlertMend AI dashboard</li>
                <li>Navigate to Settings → Integrations → Webhooks</li>
                <li>Click "Create New Webhook" or use existing webhook</li>
                <li>Copy the webhook URL (format: <code className="bg-gray-100 px-2 py-1 rounded">https://api.alertmend.ai/webhooks/datadog/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx</code>)</li>
                <li>Note the webhook secret/token if provided</li>
              </ol>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">Step 2: Configure Datadog Monitor Notification</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>Log in to your Datadog account</li>
                <li>Navigate to Monitors → Manage Monitors</li>
                <li>Select the monitor you want to connect to AlertMend AI</li>
                <li>Click "Edit" to modify the monitor</li>
                <li>Scroll to the "Say what's happening" section</li>
              </ol>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">Step 3: Add Webhook Notification</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>In the monitor notification settings, click "Add notification"</li>
                <li>Select "@webhook" from the notification options</li>
                <li>Enter a name for the webhook (e.g., "AlertMend AI")</li>
                <li>Paste the AlertMend webhook URL</li>
                <li>Click "Test" to verify the connection</li>
              </ol>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">Step 4: Configure Webhook Payload (Optional)</h2>
              <p className="text-gray-700 mb-4">
                You can customize the webhook payload to include specific information:
              </p>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>In Datadog, go to Integrations → Webhooks</li>
                <li>Click on your webhook or create a new one</li>
                <li>Configure the payload template:
                  <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm mt-2">
{`{
  "alert_title": "{{alert_title}}",
  "alert_message": "{{alert_message}}",
  "alert_status": "{{alert_status}}",
  "monitor_name": "{{monitor_name}}",
  "monitor_id": "{{monitor_id}}",
  "host": "{{host.name}}",
  "tags": "{{tags}}",
  "metric": "{{metric.name}}",
  "value": "{{metric.value}}"
}`}
                  </pre>
                </li>
                <li>Save the webhook configuration</li>
              </ol>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">Step 5: Set Notification Conditions</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>In your monitor settings, configure when to send notifications:
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>Alert: When monitor triggers</li>
                    <li>Warning: When monitor enters warning state</li>
                    <li>Recovery: When monitor recovers</li>
                    <li>No Data: When monitor has no data</li>
                  </ul>
                </li>
                <li>Set notification message template with relevant variables</li>
                <li>Save the monitor configuration</li>
              </ol>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">Step 6: Test the Integration</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>Trigger a test alert in Datadog (or wait for a real alert)</li>
                <li>Verify that the alert appears in AlertMend AI dashboard</li>
                <li>Check that all relevant information is captured:
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>Alert title and message</li>
                    <li>Monitor name and ID</li>
                    <li>Affected host/service</li>
                    <li>Metric values</li>
                    <li>Tags and metadata</li>
                  </ul>
                </li>
                <li>Verify that AlertMend AI can trigger remediation workflows based on the alert</li>
              </ol>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">Webhook Payload Format</h2>
              <p className="text-gray-700 mb-4">
                AlertMend AI expects webhook payloads in the following format:
              </p>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "alert_title": "Monitor Alert",
  "alert_message": "CPU usage is above threshold",
  "alert_status": "alert",
  "monitor_name": "High CPU Usage",
  "monitor_id": "12345678",
  "host": "web-server-01",
  "tags": ["env:production", "team:backend"],
  "metric": "system.cpu.usage",
  "value": 85.5,
  "timestamp": "2025-01-15T10:30:00Z"
}`}
              </pre>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mt-8 rounded-r-lg">
                <h3 className="text-blue-950 font-bold mb-2">💡 Best Practices</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>Use different webhooks for different environments (dev, staging, prod)</li>
                  <li>Include relevant tags in the payload for better filtering in AlertMend AI</li>
                  <li>Set up multiple monitors for the same metric with different thresholds</li>
                  <li>Use Datadog's notification routing to send only critical alerts to AlertMend AI</li>
                  <li>Monitor webhook delivery success rates in both Datadog and AlertMend AI</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 mt-8 rounded-r-lg">
                <h3 className="text-yellow-950 font-bold mb-2">⚠️ Troubleshooting</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>If alerts don't appear in AlertMend AI, check webhook URL is correct</li>
                  <li>Verify webhook secret/token matches if authentication is required</li>
                  <li>Check Datadog webhook delivery logs for errors</li>
                  <li>Ensure AlertMend AI webhook endpoint is accessible from Datadog</li>
                  <li>Validate payload format matches AlertMend AI expectations</li>
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

