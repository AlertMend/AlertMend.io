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
    description = `Learn how to ${title.toLowerCase()}${categoryText}. Expert tips and best practices from AlertMend AI.`
  }
  
  // Ensure uniqueness by including key terms from title
  // Add title keywords if description doesn't contain them
  const titleWords = title.toLowerCase().split(/\s+/).filter(word => word.length > 4)
  const descriptionLower = description.toLowerCase()
  const missingKeywords = titleWords.filter(word => !descriptionLower.includes(word))
  
  if (missingKeywords.length > 0 && description.length < maxLength - 30) {
    const keywordsToAdd = missingKeywords.slice(0, 2).join(', ')
    description = `${description} Discover solutions for ${keywordsToAdd}.`
  }
  
  // Truncate to max length at word boundary
  if (description.length > maxLength) {
    let truncated = description.substring(0, maxLength - 3)
    const lastSpace = truncated.lastIndexOf(' ')
    if (lastSpace > maxLength * 0.7) {
      truncated = truncated.substring(0, lastSpace)
    }
    // Remove trailing punctuation
    truncated = truncated.replace(/[.,;:!?\-—–\s]+$/, '').trim()
    description = truncated + '...'
  }
  
  // Ensure minimum length
  if (description.length < minLength) {
    const padding = `Expert guide on ${category || 'Kubernetes'} troubleshooting.`
    description = description + ' ' + padding
    if (description.length > maxLength) {
      description = description.substring(0, maxLength - 3) + '...'
    }
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
    let truncated = description.substring(0, maxLength - 3)
    const lastSpace = truncated.lastIndexOf(' ')
    if (lastSpace > maxLength * 0.7) {
      truncated = truncated.substring(0, lastSpace)
    }
    truncated = truncated.replace(/[.,;:!?\-—–\s]+$/, '').trim()
    return truncated + '...'
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
      'auto-remediation': 'automated incident remediation and self-healing infrastructure',
      'kubernetes-management': 'AI-powered Kubernetes cluster management and operations',
      'on-call-management': 'on-call management and multi-channel incident alerts',
      'kubernetes-cost-optimization': 'Kubernetes cost optimization and resource management',
    }
    const term = solutionTerms[pageIdentifier] || pageIdentifier
    uniqueSuffix = ` Start using ${term} with AlertMend AI.`
  } else if (pageType === 'blog' && pageIdentifier) {
    // For blog pages, the title already makes it unique, just ensure it's in description
    if (!description.toLowerCase().includes(pageIdentifier.toLowerCase().substring(0, 20))) {
      // Extract key terms from slug
      const keyTerms = pageIdentifier.split('-').slice(0, 2).join(' ')
      uniqueSuffix = ` Learn about ${keyTerms} with AlertMend AI.`
    }
  } else if (pageType === 'case-study' && pageIdentifier) {
    uniqueSuffix = ` Read the full ${pageIdentifier} case study.`
  } else if (pageType === 'pricing') {
    uniqueSuffix = ` Choose from flexible pricing plans. Start free or contact for enterprise pricing.`
  } else if (pageType === 'about') {
    uniqueSuffix = ` Meet our founders, advisors, and the team building autonomous AIOps solutions.`
  } else if (pageType === 'contact') {
    uniqueSuffix = ` Get in touch for demos, support, or partnership opportunities.`
  } else if (pageType === 'careers') {
    uniqueSuffix = ` We're hiring engineers, product managers, and customer success professionals.`
  } else if (pageType === 'partners') {
    uniqueSuffix = ` Join our partner program for technology partners, resellers, and integrators.`
  } else if (pageType === 'documentation') {
    uniqueSuffix = ` Access setup guides, API docs, and tutorials for Kubernetes, VMs, and ECS.`
  } else if (pageType === 'security') {
    uniqueSuffix = ` Enterprise-grade security with SOC 2, ISO 27001, and GDPR compliance.`
  } else if (pageType === 'compliance') {
    uniqueSuffix = ` We follow industry best practices and maintain highest compliance standards.`
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
  
  // Add suffix if it fits within max length
  if (uniqueSuffix && (uniqueDescription.length + uniqueSuffix.length) <= maxLength) {
    uniqueDescription = uniqueDescription + uniqueSuffix
  } else if (uniqueSuffix) {
    // If suffix doesn't fit, truncate description to make room
    const availableLength = maxLength - uniqueSuffix.length - 3 // -3 for "..."
    if (availableLength > 50) {
      let truncated = uniqueDescription.substring(0, availableLength)
      const lastSpace = truncated.lastIndexOf(' ')
      if (lastSpace > availableLength * 0.7) {
        truncated = truncated.substring(0, lastSpace)
      }
      truncated = truncated.replace(/[.,;:!?\-—–\s]+$/, '').trim()
      uniqueDescription = truncated + '...' + uniqueSuffix
    } else {
      // If not enough room, just truncate description
      uniqueDescription = truncateDescription(uniqueDescription, maxLength)
    }
  }
  
  // Final truncation if still too long
  if (uniqueDescription.length > maxLength) {
    uniqueDescription = truncateDescription(uniqueDescription, maxLength)
  }
  
  return uniqueDescription.trim()
}

