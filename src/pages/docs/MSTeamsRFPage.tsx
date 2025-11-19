import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import SEO from '../../components/SEO'
import { ensureUniqueMetaDescription } from '../../utils/descriptionUtils'

export default function MSTeamsRFPage() {
  const baseDescription = "Learn how to configure Microsoft Teams for Remediation Framework (RF) in AlertMend AI. Setup automated remediation workflows."
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'documentation', 'ms-teams-rf')

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Configure MS Teams in AlertMend AI RF: A Step-by-Step Guide"
        description={uniqueDescription}
        keywords="Microsoft Teams RF, remediation framework, MS Teams automation, AlertMend Teams RF"
        canonical="/documentation/ms-teams-rf"
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
                How to Configure MS Teams In RF
              </h1>
              <p className="text-xl text-gray-600">
                Configure Microsoft Teams integration for Remediation Framework (RF) workflows
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              <div className="bg-purple-50 border-l-4 border-purple-600 p-6 mb-8 rounded-r-lg">
                <h3 className="text-purple-950 font-bold mb-2">What is Remediation Framework (RF)?</h3>
                <p className="text-gray-700">
                  The Remediation Framework (RF) in AlertMend AI automates incident response and remediation actions. 
                  MS Teams integration allows you to receive notifications, approve actions, and track remediation progress.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">Step 1: Complete MS Teams Basic Setup</h2>
              <p className="text-gray-700 mb-4">
                First, ensure you have completed the basic MS Teams integration setup. If not, follow the 
                <a href="/documentation/ms-teams-approval" className="text-purple-600 hover:underline"> MS Teams Approval guide</a> first.
              </p>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">Step 2: Enable RF Notifications</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>Log in to AlertMend AI dashboard</li>
                <li>Navigate to Settings → Integrations → Microsoft Teams</li>
                <li>Find the "Remediation Framework" section</li>
                <li>Enable "Send RF Notifications" toggle</li>
                <li>Select the Teams channel for RF notifications</li>
              </ol>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">Step 3: Configure RF Workflow Settings</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>In the RF configuration, set notification preferences:
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>Notify on remediation start</li>
                    <li>Notify on remediation completion</li>
                    <li>Notify on remediation failure</li>
                    <li>Notify on manual intervention required</li>
                  </ul>
                </li>
                <li>Configure approval requirements:
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>Require approval for critical remediations</li>
                    <li>Auto-approve low-risk remediations</li>
                    <li>Set approval timeout (e.g., 30 minutes)</li>
                  </ul>
                </li>
                <li>Set notification format (summary or detailed)</li>
              </ol>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">Step 4: Create RF Workflow Templates</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>Go to Workflows → Remediation Framework</li>
                <li>Click "Create New Workflow"</li>
                <li>Define workflow triggers (e.g., specific alert types, severity levels)</li>
                <li>Configure remediation actions</li>
                <li>Set Teams notification preferences for this workflow</li>
                <li>Save the workflow template</li>
              </ol>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">Step 5: Test RF Integration</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>Create a test incident that matches your RF workflow trigger</li>
                <li>Verify that RF notification appears in Teams</li>
                <li>Check notification includes:
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>Incident details</li>
                    <li>Planned remediation actions</li>
                    <li>Approval buttons (if required)</li>
                    <li>Estimated completion time</li>
                  </ul>
                </li>
                <li>Test approval/rejection flow</li>
                <li>Verify remediation execution and completion notifications</li>
              </ol>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">RF Notification Format</h2>
              <p className="text-gray-700 mb-4">
                RF notifications in Teams include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Workflow Name:</strong> Name of the RF workflow</li>
                <li><strong>Incident ID:</strong> Unique identifier for tracking</li>
                <li><strong>Severity:</strong> Critical, High, Medium, or Low</li>
                <li><strong>Remediation Actions:</strong> List of actions to be executed</li>
                <li><strong>Status:</strong> Pending, In Progress, Completed, Failed</li>
                <li><strong>Progress:</strong> Percentage completion and current step</li>
                <li><strong>Actions:</strong> Approve, Reject, or View Details buttons</li>
              </ul>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mt-8 rounded-r-lg">
                <h3 className="text-blue-950 font-bold mb-2">💡 Best Practices</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>Use dedicated Teams channels for different severity levels</li>
                  <li>Set up @mentions for critical remediations requiring immediate attention</li>
                  <li>Create workflow templates for common incident types</li>
                  <li>Review and update RF workflows regularly based on incident patterns</li>
                  <li>Monitor RF success rates and adjust workflows accordingly</li>
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

