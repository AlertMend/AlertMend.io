import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import SEO from '../../components/SEO'
import { ensureUniqueMetaDescription } from '../../utils/descriptionUtils'

export default function SlackRCAChannelPage() {
  const baseDescription = "Learn how to set up a Slack channel for Root Cause Analysis (RCA) notifications in AlertMend AI. Configure RCA alerts and notifications."
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'documentation', 'slack-rca-channel')

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Setup Slack Channel for RCA | AlertMend AI Documentation"
        description={uniqueDescription}
        keywords="Slack RCA, root cause analysis, Slack notifications, AlertMend RCA setup"
        canonical="/documentation/slack-rca-channel"
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
                How to Setup Slack Channel for RCA
              </h1>
              <p className="text-xl text-gray-600">
                Configure Slack to receive Root Cause Analysis reports and notifications from AlertMend AI
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              <div className="bg-purple-50 border-l-4 border-purple-600 p-6 mb-8 rounded-r-lg">
                <h3 className="text-purple-950 font-bold mb-2">What is RCA?</h3>
                <p className="text-gray-700">
                  Root Cause Analysis (RCA) is AlertMend AI's automated analysis that identifies the underlying cause of incidents. 
                  RCA reports are sent to Slack channels for team visibility and follow-up actions.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">Step 1: Create a Dedicated Slack Channel</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>Open Slack and click the "+" icon next to "Channels"</li>
                <li>Name your channel (e.g., <code className="bg-gray-100 px-2 py-1 rounded">#alertmend-rca</code> or <code className="bg-gray-100 px-2 py-1 rounded">#incident-analysis</code>)</li>
                <li>Set the channel as private or public based on your team's needs</li>
                <li>Add relevant team members who should receive RCA notifications</li>
                <li>Click "Create"</li>
              </ol>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">Step 2: Invite AlertMend Bot</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>In the channel, type <code className="bg-gray-100 px-2 py-1 rounded">/invite @AlertMend</code></li>
                <li>Or click the channel name → "Integrations" → "Add apps" → Search for "AlertMend"</li>
                <li>Ensure the bot has permission to post messages in the channel</li>
              </ol>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">Step 3: Get Channel ID</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>Click on the channel name at the top</li>
                <li>Scroll to "About" section</li>
                <li>Copy the "Channel ID" (format: <code className="bg-gray-100 px-2 py-1 rounded">C0123456789</code>)</li>
                <li>Alternatively, check the URL: <code className="bg-gray-100 px-2 py-1 rounded">https://workspace.slack.com/archives/C0123456789</code></li>
              </ol>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">Step 4: Configure in AlertMend AI</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>Log in to AlertMend AI dashboard</li>
                <li>Navigate to Settings → Notifications → Slack</li>
                <li>Find the "RCA Channel" section</li>
                <li>Paste the Channel ID you copied</li>
                <li>Enable "Send RCA Reports" toggle</li>
                <li>Configure notification preferences:
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>Send RCA for all incidents</li>
                    <li>Send RCA only for critical incidents</li>
                    <li>Include remediation suggestions</li>
                    <li>Include historical context</li>
                  </ul>
                </li>
                <li>Click "Save" to apply changes</li>
              </ol>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">Step 5: Test RCA Notifications</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>Create a test incident in AlertMend AI</li>
                <li>Wait for the RCA analysis to complete</li>
                <li>Verify that the RCA report appears in your Slack channel</li>
                <li>Check that the report includes:
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>Incident summary</li>
                    <li>Root cause identification</li>
                    <li>Affected resources</li>
                    <li>Recommended actions</li>
                    <li>Timeline of events</li>
                  </ul>
                </li>
              </ol>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">RCA Report Format</h2>
              <p className="text-gray-700 mb-4">
                RCA reports in Slack include the following information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Incident Title:</strong> Brief description of the incident</li>
                <li><strong>Severity:</strong> Critical, High, Medium, or Low</li>
                <li><strong>Root Cause:</strong> Identified underlying cause</li>
                <li><strong>Affected Resources:</strong> List of impacted systems or services</li>
                <li><strong>Timeline:</strong> Sequence of events leading to the incident</li>
                <li><strong>Remediation Steps:</strong> Recommended actions to resolve and prevent</li>
                <li><strong>Related Incidents:</strong> Links to similar past incidents</li>
              </ul>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mt-8 rounded-r-lg">
                <h3 className="text-blue-950 font-bold mb-2">💡 Best Practices</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>Use a dedicated channel for RCA to keep incident analysis organized</li>
                  <li>Set up Slack notifications to alert team members of new RCA reports</li>
                  <li>Pin important RCA reports for easy reference</li>
                  <li>Use Slack threads for follow-up discussions on specific incidents</li>
                  <li>Archive resolved incidents periodically to keep the channel clean</li>
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

