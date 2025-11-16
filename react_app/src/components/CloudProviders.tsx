import { useState } from 'react'
import { Container, Server } from 'lucide-react'

// Cloud provider logos - All logos are in public/logos/ directory
// Helper function to get logo path
const getLogoPath = (name: string): string => {
  return `/logos/${name}-logo.png` // All logos exist except vm-logo.png (uses icon fallback)
}

function ProviderBadge({ provider }: { provider: any }) {
  const [imageError, setImageError] = useState(false)
  const Icon = provider.icon
  
  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 ${provider.bg} rounded-lg border border-gray-200 hover:border-purple-300 transition-all group`}
    >
      {provider.logo && !imageError ? (
        <img 
          src={provider.logo} 
          alt={`${provider.name} logo`}
          className="w-6 h-6 object-contain group-hover:scale-110 transition-transform"
          onError={() => setImageError(true)}
        />
      ) : Icon ? (
        <Icon 
          className={`w-5 h-5 ${provider.color} group-hover:scale-110 transition-transform`}
        />
      ) : (
        <div className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center">
          <span className="text-xs font-bold text-gray-600">{provider.name.charAt(0)}</span>
        </div>
      )}
      <span className="text-sm font-semibold text-purple-800">{provider.name}</span>
    </div>
  )
}

export default function CloudProviders() {
  const providers = [
    { 
      name: 'Kubernetes', 
      logo: getLogoPath('kubernetes'), // ✓ Logo exists
      icon: null,
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      name: 'AWS', 
      logo: getLogoPath('aws'), // ✓ Logo exists
      icon: null,
      color: 'text-orange-600', 
      bg: 'bg-orange-50' 
    },
    { 
      name: 'GCP', 
      logo: getLogoPath('gcp'), // ✓ Logo exists
      icon: null,
      color: 'text-blue-500', 
      bg: 'bg-blue-50' 
    },
    { 
      name: 'Azure', 
      logo: getLogoPath('azure'), // ✓ Logo exists
      icon: null,
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      name: 'ECS', 
      logo: getLogoPath('ecs'), // ✓ Logo exists
      icon: Container,
      color: 'text-purple-600', 
      bg: 'bg-purple-50' 
    },
    { 
      name: 'VMs', 
      logo: getLogoPath('vm'), // ⚠ Placeholder: Uses icon fallback
      icon: Server,
      color: 'text-green-600', 
      bg: 'bg-green-50' 
    },
  ]

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
      {providers.map((provider, index) => (
        <ProviderBadge key={index} provider={provider} />
      ))}
    </div>
  )
}

