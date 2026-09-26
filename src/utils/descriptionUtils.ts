/**
 * Generates a unique meta description for blog posts
 * Ensures descriptions are unique and within SEO best practices (50-160 characters)
 * 
 * @param title - The blog post title
 * @param excerpt - The blog post excerpt
 * @param content - The blog post content (optional)
 * @param category - The blog post category
 * @param maxLength - Maximum description length (default: 160)
 * @param minLength - Minimum description length (default: 50)
 * @returns Unique meta description
 */
export function generateUniqueMetaDescription(
  title: string,
  excerpt?: string,
  content?: string,
  category?: string,
  maxLength: number = 160,
  minLength: number = 50
): string {
  // Start with excerpt if available
  let description = excerpt || ''
  
  // If no excerpt or excerpt is too short, generate from content
  if (!description || description.length < minLength) {
    if (content) {
      // Extract first meaningful sentences from content
      const cleanContent = content
        .replace(/[#*`]/g, '') // Remove markdown formatting
        .replace(/\n+/g, ' ') // Replace newlines with spaces
        .trim()
      
      // Get first 200 characters and truncate at sentence boundary
      let text = cleanContent.substring(0, 200)
      const lastPeriod = text.lastIndexOf('.')
      if (lastPeriod > 100) {
        text = text.substring(0, lastPeriod + 1)
      }
      description = text.trim()
    }
  }
  
  // If still no description, create one from title and category
  if (!description || description.length < minLength) {
    const categoryText = category ? ` on ${category}` : ''
    description = `Learn how to ${title.toLowerCase()}${categoryText}. Expert tips and best practices from AlertMend.`
  }
  
  // (Removed: appending "Discover solutions for <keywords>." read as keyword
  // stuffing in search results.)

  // Truncate to max length on a sentence/word boundary, without "..."
  description = truncateDescription(description, maxLength, minLength)
  
  // Ensure minimum length
  if (description.length < minLength) {
    const padding = `Expert guide on ${category || 'Kubernetes'} troubleshooting.`
    description = description + ' ' + padding
    description = truncateDescription(description, maxLength, minLength)
  }
  
  return description.trim()
}

/**
 * Truncates a description to fit within SEO best practices
 */
export function truncateDescription(
  description: string,
  maxLength: number = 160,
  minLength: number = 50
): string {
  if (description.length <= maxLength && description.length >= minLength) {
    return description
  }
  
  if (description.length > maxLength) {
    // Prefer ending on a full sentence; otherwise cut at a word boundary.
    // Never append "..." — search results show it verbatim.
    const window = description.substring(0, maxLength)
    const lastSentence = Math.max(window.lastIndexOf('. '), window.lastIndexOf('! '), window.lastIndexOf('? '))
    if (lastSentence > maxLength * 0.5) {
      return window.substring(0, lastSentence + 1).trim()
    }
    let truncated = window
    const lastSpace = truncated.lastIndexOf(' ')
    if (lastSpace > maxLength * 0.7) {
      truncated = truncated.substring(0, lastSpace)
    }
    return truncated.replace(/[-–,;:\s]+$/, '').trim() + '.'
  }
  
  return description
}

/**
 * Ensures meta description is unique by adding page-specific context
 * This function adds unique identifiers based on the page type and key terms
 * 
 * @param description - The base description
 * @param pageType - The type of page (e.g., 'home', 'solution', 'blog', 'pricing')
 * @param pageIdentifier - Unique identifier for the page (e.g., solution ID, blog slug, page name)
 * @param maxLength - Maximum description length (default: 160)
 * @returns Unique meta description with page-specific context
 */
export function ensureUniqueMetaDescription(
  description: string,
  pageType: string,
  pageIdentifier?: string,
  maxLength: number = 160
): string {
  // Create unique suffix based on page type and identifier
  let uniqueSuffix = ''
  
  if (pageType === 'solution' && pageIdentifier) {
    // For solution pages, add solution-specific terms with more unique context
    const solutionTerms: Record<string, string> = {
      'auto-remediation': 'approved RF remediation with audit trails',
      'kubernetes-management': 'Kubernetes management with incidents and RCA',
      'on-call-management': 'on-call schedules, escalations, and AI triage',
      'kubernetes-cost-optimization': 'FinOps right-sizing and recoverable spend',
    }
    const term = solutionTerms[pageIdentifier] || pageIdentifier
    uniqueSuffix = ` Start using ${term} with AlertMend.`
  } else if (pageType === 'blog' && pageIdentifier) {
    // For blog pages, the title already makes it unique, just ensure it's in description
    if (!description.toLowerCase().includes(pageIdentifier.toLowerCase().substring(0, 20))) {
      // Extract key terms from slug
      const keyTerms = pageIdentifier.split('-').slice(0, 2).join(' ')
      uniqueSuffix = ` Learn about ${keyTerms} with AlertMend.`
    }
  } else if (pageType === 'case-study' && pageIdentifier) {
    uniqueSuffix = ` Read the full ${pageIdentifier} case study.`
  } else if (pageType === 'pricing') {
    uniqueSuffix = ` Free playground to start, then book a demo for production plans.`
  } else if (pageType === 'about') {
    uniqueSuffix = ` Meet the founders and advisors building signal-to-fix production ops.`
  } else if (pageType === 'contact') {
    uniqueSuffix = ` Get in touch for demos, support, or partnership opportunities.`
  } else if (pageType === 'careers') {
    uniqueSuffix = ` We're hiring engineers, product managers, and customer success professionals.`
  } else if (pageType === 'partners') {
    uniqueSuffix = ` Join our partner program for technology partners, resellers, and integrators.`
  } else if (pageType === 'documentation') {
    uniqueSuffix = ` Access setup guides, API docs, and tutorials for Kubernetes, VMs, and cloud.`
  } else if (pageType === 'security') {
    uniqueSuffix = ` Encryption, RBAC, audit logs, and compliance programs in progress.`
  } else if (pageType === 'compliance') {
    uniqueSuffix = ` SOC 2 Type II, ISO 27001, and GDPR alignment — certifications in progress.`
  } else if (pageType === 'privacy') {
    uniqueSuffix = ` Understand how we collect, use, and protect your data and information.`
  } else if (pageType === 'terms') {
    uniqueSuffix = ` Review our terms of service, usage policies, and legal agreements.`
  } else if (pageType === 'case-studies') {
    uniqueSuffix = ` See real results from Polymer Search, WareFlex, Decklar, and more.`
  } else if (pageType === 'blog-list') {
    uniqueSuffix = ` Explore articles on Kubernetes troubleshooting, AIOps best practices, and more.`
  }
  
  // Combine description with unique suffix
  let uniqueDescription = description.trim()
  
  // Add the suffix only when it fits whole. Never splice a cut-off
  // description and a suffix together with "..." (it showed up in Google
  // results as "...ship... Meet the founders...").
  if (uniqueSuffix && (uniqueDescription.length + uniqueSuffix.length) <= maxLength) {
    uniqueDescription = uniqueDescription + uniqueSuffix
  }
  
  // Final truncation if still too long
  if (uniqueDescription.length > maxLength) {
    uniqueDescription = truncateDescription(uniqueDescription, maxLength)
  }
  
  return uniqueDescription.trim()
}

