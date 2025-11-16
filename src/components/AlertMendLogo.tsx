import { useState } from 'react'
import { Zap } from 'lucide-react'

interface AlertMendLogoProps {
  className?: string
  iconClassName?: string
  textClassName?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'full' | 'icon' // 'full' uses logo with text, 'icon' uses icon-only
}

export default function AlertMendLogo({ 
  className = '', 
  iconClassName = '',
  textClassName = '',
  showText = true,
  size = 'md',
  variant = 'full'
}: AlertMendLogoProps) {
  const [imageError, setImageError] = useState(false)
  
  const sizeClasses = {
    sm: { 
      icon: 'h-6', 
      full: 'h-6',
      text: 'text-sm' 
    },
    md: { 
      icon: 'h-8', 
      full: 'h-8',
      text: 'text-base' 
    },
    lg: { 
      icon: 'h-10', 
      full: 'h-10',
      text: 'text-lg' 
    }
  }
  
  const currentSize = sizeClasses[size]
  
  // Use full logo (with text) or icon-only based on variant and showText
  const useFullLogo = variant === 'full' && showText
  const logoPath = useFullLogo 
    ? '/logos/alertmend-logo.svg' // Full logo with text
    : '/logos/alertmend-icon.png' // Icon-only version

  // If using full logo, display it as a single image
  if (useFullLogo && !imageError) {
    return (
      <div className={`flex items-center ${className}`}>
        <img 
          src={logoPath} 
          alt="AlertMend Logo"
          className={`${currentSize.full} w-auto object-contain relative z-10 max-h-full`}
          style={{ 
            display: 'block',
            objectFit: 'contain',
            objectPosition: 'center',
            padding: 0,
            margin: 0,
            maxWidth: '100%',
            height: 'auto'
          }}
          onError={() => {
            console.error('Failed to load AlertMend full logo:', logoPath);
            setImageError(true);
          }}
        />
      </div>
    )
  }

  // Icon-only or fallback display
  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative flex-shrink-0">
        {logoPath && !imageError ? (
          <img 
            src={logoPath} 
            alt="AlertMend Icon"
            className={`${currentSize.icon} w-auto object-contain relative z-10`}
            style={{ display: 'block' }}
            onError={() => {
              console.error('Failed to load AlertMend icon:', logoPath);
              setImageError(true);
            }}
          />
        ) : (
          <Zap className={`${currentSize.icon} text-purple-600 relative z-10 ${iconClassName}`} />
        )}
      </div>
      {showText && !useFullLogo && (
        <span className={`font-bold bg-gradient-to-r from-purple-700 to-purple-600 bg-clip-text text-transparent ${currentSize.text} ml-3 ${textClassName}`}>
          AlertMend AI
        </span>
      )}
    </div>
  )
}

