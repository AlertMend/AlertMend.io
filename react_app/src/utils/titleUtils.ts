/**
 * Truncates a blog post title to fit within SEO best practices (30-60 characters)
 * Includes the site suffix in the character count
 * 
 * @param title - The blog post title
 * @param suffix - The suffix to append (default: " | AlertMend AI")
 * @param minLength - Minimum title length (default: 30)
 * @param maxLength - Maximum title length including suffix (default: 60)
 * @returns Truncated title with suffix
 */
export function truncateBlogTitle(
  title: string,
  suffix: string = ' | AlertMend AI',
  minLength: number = 30,
  maxLength: number = 60
): string {
  // If title with suffix fits within max length, return as is
  if (title.length + suffix.length <= maxLength) {
    // Ensure it meets minimum length requirement
    if (title.length + suffix.length >= minLength) {
      return title + suffix
    }
    // If too short, pad with the title (but this shouldn't happen often)
    return title + suffix
  }
  
  // Calculate how many characters we can use for the title
  // Leave space for suffix and ellipsis if needed
  const availableLength = maxLength - suffix.length - 3 // -3 for "..."
  
  // Truncate title to fit
  let truncatedTitle = title.substring(0, availableLength)
  
  // Try to truncate at a word boundary (space) if possible
  const lastSpaceIndex = truncatedTitle.lastIndexOf(' ')
  if (lastSpaceIndex > availableLength * 0.7) {
    // Only use word boundary if it's not too short
    truncatedTitle = truncatedTitle.substring(0, lastSpaceIndex)
  }
  
  // Remove trailing punctuation and whitespace
  truncatedTitle = truncatedTitle.replace(/[.,;:!?\-—–\s]+$/, '').trim()
  
  return truncatedTitle + '...' + suffix
}

/**
 * Gets the optimal title length for SEO
 * Ensures title is between 30-60 characters including suffix
 */
export function getOptimalTitleLength(title: string, suffix: string = ' | AlertMend AI'): number {
  const totalLength = title.length + suffix.length
  if (totalLength >= 30 && totalLength <= 60) {
    return totalLength
  }
  return 60 // Default to max length
}

/**
 * Truncates H2 headings to fit within SEO best practices (50-70 characters)
 * H2 headings should be visible on web pages and extractable by search engines
 * 
 * @param heading - The H2 heading text
 * @param minLength - Minimum heading length (default: 50)
 * @param maxLength - Maximum heading length (default: 70)
 * @returns Truncated heading text
 */
export function truncateH2Heading(
  heading: string,
  minLength: number = 50,
  maxLength: number = 70
): string {
  // If heading is within the desired range, return as is
  if (heading.length >= minLength && heading.length <= maxLength) {
    return heading
  }
  
  // If heading is too short, try to expand it (but this is rare)
  if (heading.length < minLength) {
    // Just return as is - better to have a shorter heading than to pad artificially
    return heading
  }
  
  // If heading is too long, truncate it
  if (heading.length > maxLength) {
    let truncated = heading.substring(0, maxLength - 3) // -3 for "..."
    
    // Try to truncate at a word boundary (space) if possible
    const lastSpaceIndex = truncated.lastIndexOf(' ')
    if (lastSpaceIndex > maxLength * 0.7) {
      // Only use word boundary if it's not too short
      truncated = truncated.substring(0, lastSpaceIndex)
    }
    
    // Remove trailing punctuation and whitespace
    truncated = truncated.replace(/[.,;:!?\-—–\s]+$/, '').trim()
    
    // Only add ellipsis if we actually truncated
    if (truncated.length < heading.length) {
      return truncated + '...'
    }
    
    return truncated
  }
  
  return heading
}

