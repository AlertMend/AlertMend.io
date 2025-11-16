import { useState } from 'react'

function ToolBadge({ tool }: { tool: any }) {
  const [imageError, setImageError] = useState(false)
  const Icon = tool.icon
  
  return (
    <div
      className="group relative flex items-center justify-center"
      title={tool.name}
    >
      {tool.logo && !imageError ? (
        <div className="flex items-center justify-center px-3 py-2 rounded-lg bg-gray-50/50 border border-gray-200/50 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 group-hover:shadow-sm">
          <img 
            src={tool.logo} 
            alt={`${tool.name} logo`}
            className="h-5 w-auto max-w-[75px] object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-200"
            onError={() => setImageError(true)}
          />
        </div>
      ) : Icon ? (
        <div className={`flex items-center justify-center w-9 h-9 rounded-lg ${tool.bg} border border-gray-200/50 group-hover:border-gray-300 group-hover:shadow-sm transition-all duration-200`}>
          <Icon 
            className={`${tool.color} w-4 h-4`}
          />
        </div>
      ) : (
        <div className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200/50 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200">
          <span className="text-xs font-medium text-gray-500">{tool.name}</span>
        </div>
      )}
    </div>
  )
}

export default function ToolLogos({ tools }: { tools: any[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5">
      {tools.map((tool, index) => (
        <ToolBadge key={index} tool={tool} />
      ))}
    </div>
  )
}

