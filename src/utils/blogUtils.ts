import blogListData from './blogList.json'

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  author?: string
  content?: string
  tags?: string[]
  keywords?: string
}

// List of available blog posts - automatically generated from markdown files
export const blogPosts: BlogPost[] = blogListData as BlogPost[]

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`/blog/${slug}.md`)
    if (!response.ok) {
      return null
    }
    const markdown = await response.text()
    
    // Parse frontmatter
    const frontmatterMatch = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
    if (!frontmatterMatch) {
      return null
    }
    
    const frontmatter = frontmatterMatch[1]
    const content = frontmatterMatch[2]
    
    const post: BlogPost = {
      slug,
      title: '',
      excerpt: '',
      date: '',
      category: '',
      content,
    }
    
    // Parse frontmatter fields
    frontmatter.split('\n').forEach((line) => {
      const trimmed = line.trim()
      if (!trimmed) return
      
      // Handle keywords which may contain commas and quotes
      const keywordsMatch = trimmed.match(/^keywords:\s*["'](.+)["']$/)
      if (keywordsMatch) {
        post.keywords = keywordsMatch[1]
        return
      }
      
      // Match double-quoted strings (allows single quotes inside)
      const doubleQuotedMatch = trimmed.match(/^(\w+):\s*"([^"]*)"$/)
      // Match single-quoted strings (allows double quotes inside)
      const singleQuotedMatch = trimmed.match(/^(\w+):\s*'([^']*)'$/)
      // Match unquoted values
      const unquotedMatch = trimmed.match(/^(\w+):\s*(.+)$/)
      
      if (doubleQuotedMatch) {
        const key = doubleQuotedMatch[1]
        const value = doubleQuotedMatch[2]
        if (key === 'title') post.title = value
        if (key === 'excerpt') post.excerpt = value
        if (key === 'date') post.date = value
        if (key === 'category') post.category = value
        if (key === 'author') post.author = value
      } else if (singleQuotedMatch) {
        const key = singleQuotedMatch[1]
        const value = singleQuotedMatch[2]
        if (key === 'title') post.title = value
        if (key === 'excerpt') post.excerpt = value
        if (key === 'date') post.date = value
        if (key === 'category') post.category = value
        if (key === 'author') post.author = value
      } else if (unquotedMatch) {
        const key = unquotedMatch[1]
        const value = unquotedMatch[2].trim()
        if (key === 'title') post.title = value
        if (key === 'excerpt') post.excerpt = value
        if (key === 'date') post.date = value
        if (key === 'category') post.category = value
        if (key === 'author') post.author = value
      }
    })
    
    return post
  } catch (error) {
    console.error('Error loading blog post:', error)
    return null
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

