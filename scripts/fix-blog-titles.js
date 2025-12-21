import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Title case conversion function
function toTitleCase(str) {
  if (!str) return str
  
  // Words to keep lowercase (unless they're the first or last word)
  const lowerWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'nor', 'for', 'so', 'yet',
    'at', 'by', 'in', 'on', 'to', 'of', 'with', 'from', 'into', 'onto',
    'as', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must',
    'can', 'cannot', 'this', 'that', 'these', 'those', 'it', 'its', 'vs', 'v'
  ])
  
  // Technical terms to always capitalize
  const techTerms = new Set([
    'kubernetes', 'k8s', 'aws', 'azure', 'gcp', 'ecs', 'ec2', 's3', 'rds',
    'api', 'http', 'https', 'dns', 'tcp', 'udp', 'ssl', 'tls', 'json', 'yaml',
    'rest', 'graphql', 'oauth', 'jwt', 'ci', 'cd', 'devops', 'aiops', 'sre',
    'cicd', 'git', 'github', 'gitlab', 'jenkins', 'terraform', 'ansible',
    'docker', 'container', 'pod', 'node', 'cluster', 'namespace', 'deployment',
    'statefulset', 'daemonset', 'cronjob', 'job', 'service', 'ingress',
    'configmap', 'secret', 'pvc', 'pv', 'csi', 'cni', 'csi', 'hpa', 'vpa',
    'elasticsearch', 'kibana', 'logstash', 'prometheus', 'grafana', 'jaeger',
    'nginx', 'haproxy', 'istio', 'linkerd', 'envoy', 'calico', 'flannel',
    'helm', 'kubectl', 'kubelet', 'kube-proxy', 'etcd', 'kube-apiserver',
    'react', 'vue', 'angular', 'nodejs', 'python', 'go', 'java', 'javascript',
    'typescript', 'php', 'ruby', 'rust', 'swift', 'kotlin'
  ])
  
  // Split into words
  const words = str.trim().split(/\s+/)
  
  return words.map((word, index) => {
    // Clean word (remove punctuation for checking, but keep it)
    const cleanWord = word.replace(/[^\w]/g, '').toLowerCase()
    const isFirstWord = index === 0
    const isLastWord = index === words.length - 1
    
    // Always capitalize first and last word
    if (isFirstWord || isLastWord) {
      return capitalizeWord(word)
    }
    
    // Always capitalize tech terms
    if (techTerms.has(cleanWord)) {
      return capitalizeWord(word)
    }
    
    // Always capitalize words 4+ letters (even if they're prepositions)
    if (cleanWord.length >= 4) {
      return capitalizeWord(word)
    }
    
    // Lowercase common words in the middle
    if (lowerWords.has(cleanWord)) {
      return word.toLowerCase()
    }
    
    // Capitalize everything else
    return capitalizeWord(word)
  }).join(' ')
}

function capitalizeWord(word) {
  if (!word) return word
  // Handle special cases like numbers, URLs, etc.
  if (/^\d/.test(word)) return word
  if (/^https?:\/\//i.test(word)) return word
  
  // Capitalize first letter, preserve rest
  return word.charAt(0).toUpperCase() + word.slice(1)
}

// Fix titles in markdown files
const blogDir = path.join(__dirname, '../public/blog')
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'))

let updatedCount = 0

for (const file of files) {
  const filePath = path.join(blogDir, file)
  let content = fs.readFileSync(filePath, 'utf8')
  
  // Extract title from frontmatter
  const titleMatch = content.match(/^title:\s*["'](.+?)["']/m)
  if (!titleMatch) continue
  
  const oldTitle = titleMatch[1]
  const newTitle = toTitleCase(oldTitle)
  
  if (oldTitle !== newTitle) {
    content = content.replace(/^title:\s*["'].+?["']/m, `title: "${newTitle}"`)
    fs.writeFileSync(filePath, content, 'utf8')
    console.log(`✅ ${file}: "${oldTitle}" → "${newTitle}"`)
    updatedCount++
  }
}

console.log(`\n✅ Updated ${updatedCount} blog titles to title case`)

