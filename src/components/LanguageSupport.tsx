import { useState } from 'react'
import { Globe, Users } from 'lucide-react'

function LanguageCard({ language }: { language: any }) {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="group flex flex-col items-center gap-4 p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 cursor-pointer min-w-[140px]">
      {/* Logo placeholder - Replace with actual logo image */}
      <div className="w-16 h-16 rounded-lg bg-white/20 flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform duration-300">
        {language.logo && !imageError ? (
          <img 
            src={language.logo} 
            alt={`${language.name} logo`}
            className="w-full h-full object-contain p-2"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="text-3xl">
            {language.flag}
          </div>
        )}
      </div>
      <span className="text-base font-semibold text-white">
        {language.name}
      </span>
    </div>
  )
}

export default function LanguageSupport() {
  const languages = [
    { name: 'Vietnamese', flag: '🇻🇳', code: 'vi', logo: '/logos/vietnamese-logo.png' }, // Placeholder: Add logo to public/logos/vietnamese-logo.png
    { name: 'Japanese', flag: '🇯🇵', code: 'ja', logo: '/logos/japanese-logo.png' }, // Placeholder: Add logo to public/logos/japanese-logo.png
    { name: 'English', flag: '🇺🇸', code: 'en', logo: '/logos/english-logo.png' }, // Placeholder: Add logo to public/logos/english-logo.png
  ]

  return (
    <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900 text-white">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-700/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-700/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Language Support Section */}
        <div className="text-center mb-24 md:mb-32">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
            <Globe className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
            Available in Your Language
          </h2>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-12">
            AlertMend AI supports multiple languages including Vietnamese, Japanese, and more so you can use the app in the language you're most comfortable with.
          </p>
          
          {/* Language Flags */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            {languages.map((language, index) => (
              <LanguageCard key={index} language={language} />
            ))}
          </div>
        </div>

        {/* Community Section */}
        <div className="text-center pt-16 border-t border-white/20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
            Loved by Engineers. Built for Impact.
          </h2>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            AlertMend AI powers the people behind today's most reliable systems.
          </p>
        </div>
      </div>
    </section>
  )
}

