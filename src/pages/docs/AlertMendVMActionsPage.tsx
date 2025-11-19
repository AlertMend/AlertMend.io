import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import SEO from '../../components/SEO'
import { ensureUniqueMetaDescription } from '../../utils/descriptionUtils'

export default function AlertMendVMActionsPage() {
  const baseDescription = "Learn about pre-defined actions using AlertMend VM. Explore available remediation actions for virtual machine management."
  const uniqueDescription = ensureUniqueMetaDescription(baseDescription, 'documentation', 'alertmend-vm-actions')

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="AlertMend AI: Automate VM Remediation Actions in 2025"
        description={uniqueDescription}
        keywords="AlertMend VM, VM actions, virtual machine remediation, VM automation, pre-defined actions"
        canonical="/documentation/alertmend-vm-actions"
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
                Pre-Defined Actions Using AlertMend VM
              </h1>
              <p className="text-xl text-gray-600">
                Comprehensive guide to pre-defined remediation actions available for virtual machine management
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              <div className="bg-purple-50 border-l-4 border-purple-600 p-6 mb-8 rounded-r-lg">
                <h3 className="text-purple-950 font-bold mb-2">Overview</h3>
                <p className="text-gray-700">
                  AlertMend VM provides a comprehensive set of pre-defined actions for automated virtual machine 
                  remediation. These actions can be triggered automatically based on alerts or manually through the dashboard.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">Resource Management Actions</h2>
              
              <h3 className="text-xl font-bold text-purple-900 mt-6 mb-3">CPU Management</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Scale Up CPU:</strong> Increase CPU allocation when usage exceeds threshold</li>
                <li><strong>Scale Down CPU:</strong> Reduce CPU allocation during low usage periods</li>
                <li><strong>Restart High CPU Process:</strong> Automatically restart processes consuming excessive CPU</li>
                <li><strong>Migrate to Higher CPU Instance:</strong> Move VM to instance with more CPU resources</li>
              </ul>

              <h3 className="text-xl font-bold text-purple-900 mt-6 mb-3">Memory Management</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Increase Memory:</strong> Add more RAM when memory usage is high</li>
                <li><strong>Clear Memory Cache:</strong> Free up memory by clearing system caches</li>
                <li><strong>Restart Memory-Intensive Services:</strong> Restart services consuming excessive memory</li>
                <li><strong>Migrate to Higher Memory Instance:</strong> Move VM to instance with more RAM</li>
              </ul>

              <h3 className="text-xl font-bold text-purple-900 mt-6 mb-3">Disk Management</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Expand Disk:</strong> Increase disk size when storage is low</li>
                <li><strong>Clean Up Disk Space:</strong> Remove temporary files and logs</li>
                <li><strong>Archive Old Logs:</strong> Compress and archive old log files</li>
                <li><strong>Add Additional Disk:</strong> Attach new disk volume to VM</li>
              </ul>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">Service Management Actions</h2>
              
              <h3 className="text-xl font-bold text-purple-900 mt-6 mb-3">Service Operations</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Restart Service:</strong> Restart a specific service that has failed</li>
                <li><strong>Start Service:</strong> Start a stopped service</li>
                <li><strong>Stop Service:</strong> Gracefully stop a service</li>
                <li><strong>Reload Service Configuration:</strong> Reload service config without full restart</li>
              </ul>

              <h3 className="text-xl font-bold text-purple-900 mt-6 mb-3">Application Management</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Restart Application:</strong> Restart application processes</li>
                <li><strong>Clear Application Cache:</strong> Clear application-level caches</li>
                <li><strong>Rollback Application:</strong> Rollback to previous application version</li>
                <li><strong>Deploy Hotfix:</strong> Deploy emergency fixes automatically</li>
              </ul>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">Network Management Actions</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Restart Network Interface:</strong> Restart network adapter</li>
                <li><strong>Flush DNS Cache:</strong> Clear DNS resolver cache</li>
                <li><strong>Reset Network Configuration:</strong> Reset network settings to defaults</li>
                <li><strong>Change Network Route:</strong> Update routing tables</li>
              </ul>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">VM Lifecycle Actions</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Reboot VM:</strong> Gracefully reboot the virtual machine</li>
                <li><strong>Shutdown VM:</strong> Gracefully shutdown the VM</li>
                <li><strong>Start VM:</strong> Power on a stopped VM</li>
                <li><strong>Snapshot VM:</strong> Create a snapshot before remediation</li>
                <li><strong>Restore from Snapshot:</strong> Restore VM to previous state</li>
              </ul>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">Security Actions</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Block IP Address:</strong> Block malicious IP addresses</li>
                <li><strong>Update Firewall Rules:</strong> Modify firewall configurations</li>
                <li><strong>Rotate Credentials:</strong> Automatically rotate service credentials</li>
                <li><strong>Apply Security Patches:</strong> Install critical security updates</li>
              </ul>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">Using Pre-Defined Actions</h2>
              
              <h3 className="text-xl font-bold text-purple-900 mt-6 mb-3">Method 1: Automatic Remediation</h3>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>Create a remediation workflow in AlertMend AI</li>
                <li>Define trigger conditions (e.g., CPU &gt; 90% for 5 minutes)</li>
                <li>Select the appropriate pre-defined action</li>
                <li>Configure action parameters (e.g., CPU increase amount)</li>
                <li>Set approval requirements if needed</li>
                <li>Save and activate the workflow</li>
              </ol>

              <h3 className="text-xl font-bold text-purple-900 mt-6 mb-3">Method 2: Manual Execution</h3>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>Navigate to VMs → Select VM → Actions</li>
                <li>Choose the desired pre-defined action</li>
                <li>Review action parameters</li>
                <li>Click "Execute" to run the action</li>
                <li>Monitor action progress and results</li>
              </ol>

              <h2 className="text-2xl font-bold text-purple-950 mt-8 mb-4">Action Parameters</h2>
              <p className="text-gray-700 mb-4">
                Most actions support configurable parameters:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Timeout:</strong> Maximum time for action execution</li>
                <li><strong>Retry Count:</strong> Number of retry attempts on failure</li>
                <li><strong>Rollback on Failure:</strong> Automatically revert changes if action fails</li>
                <li><strong>Notification:</strong> Send notifications on action completion</li>
                <li><strong>Dry Run:</strong> Test action without making actual changes</li>
              </ul>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mt-8 rounded-r-lg">
                <h3 className="text-blue-950 font-bold mb-2">💡 Best Practices</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>Always test actions in a non-production environment first</li>
                  <li>Use dry-run mode to preview action effects</li>
                  <li>Set appropriate timeouts to prevent hanging actions</li>
                  <li>Enable rollback for critical actions</li>
                  <li>Monitor action execution logs for troubleshooting</li>
                  <li>Combine multiple actions in workflows for complex remediations</li>
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

