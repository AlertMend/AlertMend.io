import React, { useState } from 'react'
import { Linkedin, Mail } from 'lucide-react'
import AlertMendLogo from './AlertMendLogo'

function AntlerLogo() {
  const [imageError, setImageError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState('/logos/antler-logo.svg')

  // Try SVG first, then PNG
  const handleImageError = () => {
    if (currentSrc.endsWith('.svg')) {
      setCurrentSrc('/logos/antler-logo.png')
    } else {
      setImageError(true)
    }
  }

  return (
    <div className="flex items-center justify-center">
      {!imageError ? (
        <img 
          src={currentSrc}
          alt="Antler logo"
          className="h-8 md:h-10 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
          onError={handleImageError}
        />
      ) : (
        // Placeholder: Add Antler logo to public/logos/antler-logo.svg or public/logos/antler-logo.png
        <div className="h-8 md:h-10 px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg flex items-center justify-center">
          <span className="text-sm md:text-base font-bold text-gray-400 tracking-tight">
            ANTLER
          </span>
        </div>
      )}
    </div>
  )
}

export default function Footer() {
  const footerLinks = {
    Product: [
      'How It Works',
      'Solutions',
      'Benefits',
      'Pricing',
      'Documentation',
    ],
    Company: [
      'About Us',
      'Blog',
      'Careers',
      'Contact',
      'Partners',
    ],
    Resources: [
      'Legal',
      'Terms of Service',
      'Compliance',
      'Privacy Policy',
      'Security',
    ],
  }

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-gray-300 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-800/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid md:grid-cols-5 gap-6 lg:gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="mb-4 -ml-2">
              <AlertMendLogo 
                size="sm"
                className="h-8"
                iconClassName="text-purple-400"
                textClassName="bg-gradient-to-r from-white to-gray-300"
              />
            </div>
            <p className="text-gray-400 mb-4 max-w-md leading-relaxed text-sm">
              Autonomous AIOps platform that detects, analyzes, and resolves incidents across Kubernetes, VMs, and ECS. Stop firefighting. Cut costs by 50%.
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <a href="mailto:hello@alertmend.io" className="text-gray-400 text-sm hover:text-purple-400 transition-colors flex items-center gap-2">
                  <Mail className="h-4 w-4 text-purple-400" />
                  <span>hello@alertmend.io</span>
                </a>
                <a 
                  href="https://www.linkedin.com/company/alertmend/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-200"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
              <p className="text-gray-400 text-sm">
                32 Pekin Street, #05-01, Singapore 048762
              </p>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold mb-3 text-sm">{category}</h4>
                  {category === 'Resources' ? (
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                      {links.map((link, index) => {
                        const sectionMap: { [key: string]: string } = {
                          'How It Works': '/#how-it-works',
                          'Solutions': '/#solutions',
                          'Benefits': '/#benefits',
                          'Case Studies': '/case-studies',
                          'Pricing': '/pricing',
                          'Documentation': '/documentation',
                          'About Us': '/about',
                          'Blog': '/blog',
                          'Careers': '/careers',
                          'Contact': '/contact',
                          'Partners': '/partners',
                          'Help Center': '/help',
                          'Community': '/community',
                          'Tutorials': '/tutorials',
                          'Webinars': '/webinars',
                          'Legal': '#',
                          'Privacy Policy': '/privacy',
                          'Terms of Service': '/terms',
                          'Security': '/security',
                          'Compliance': '/compliance',
                        }
                        const href = sectionMap[link] || '#'
                        const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                          if (href.startsWith('/#')) {
                            e.preventDefault()
                            const hash = href.split('#')[1]
                            if (window.location.pathname !== '/') {
                              window.location.href = href
                            } else {
                              const element = document.getElementById(hash)
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                              }
                            }
                          }
                        }
                        return (
                          <React.Fragment key={link}>
                            <a
                              href={href}
                              onClick={handleClick}
                              className="text-gray-400 hover:text-purple-400 text-sm transition-colors duration-200 whitespace-nowrap"
                            >
                              {link}
                            </a>
                            {index < links.length - 1 && (
                              <span className="text-gray-500 text-xs">|</span>
                            )}
                          </React.Fragment>
                        )
                      })}
                    </div>
                  ) : (
                    <ul className="space-y-2.5">
                      {links.map((link) => {
                        const sectionMap: { [key: string]: string } = {
                          'How It Works': '/#how-it-works',
                          'Solutions': '/#solutions',
                          'Benefits': '/#benefits',
                          'Case Studies': '/case-studies',
                          'Pricing': '/pricing',
                          'Documentation': '/documentation',
                          'About Us': '/about',
                          'Blog': '/blog',
                          'Careers': '/careers',
                          'Contact': '/contact',
                          'Partners': '/partners',
                          'Help Center': '/help',
                          'Community': '/community',
                          'Tutorials': '/tutorials',
                          'Webinars': '/webinars',
                          'Privacy Policy': '/privacy',
                          'Terms of Service': '/terms',
                          'Security': '/security',
                          'Compliance': '/compliance',
                        }
                        const href = sectionMap[link] || '#'
                        const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                          if (href.startsWith('/#')) {
                            e.preventDefault()
                            const hash = href.split('#')[1]
                            if (window.location.pathname !== '/') {
                              window.location.href = href
                            } else {
                              const element = document.getElementById(hash)
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                              }
                            }
                          }
                        }
                        return (
                          <li key={link}>
                            <a
                              href={href}
                              onClick={handleClick}
                              className="text-gray-400 hover:text-purple-400 text-sm transition-colors duration-200"
                            >
                              {link}
                            </a>
                          </li>
                        )
                      })}
                    </ul>
                  )}
            </div>
          ))}
        </div>

          <div className="border-t border-gray-800/50 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} AlertMend AI. All rights reserved.
              </p>
              
              {/* Backed by Section */}
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2 font-semibold uppercase tracking-wide">Backed by</p>
                <AntlerLogo />
              </div>
              
              <div className="flex space-x-6">
                <a href="/privacy" className="text-gray-500 hover:text-purple-400 text-sm transition-colors">
                  Privacy
                </a>
                <a href="/terms" className="text-gray-500 hover:text-purple-400 text-sm transition-colors">
                  Terms
                </a>
                <a href="#" className="text-gray-500 hover:text-purple-400 text-sm transition-colors">
                  Cookies
                </a>
              </div>
            </div>
          </div>
      </div>
    </footer>
  )
}

