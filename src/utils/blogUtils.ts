export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  author?: string
  content?: string
  tags?: string[]
}

// List of available blog posts
export const blogPosts: BlogPost[] = [
  {
    slug: 'oomkilled-in-kubernetes',
    title: 'How to Fix OOMKilled Errors in Kubernetes',
    excerpt: 'In Kubernetes, applications run inside pods with limits on CPU and memory. If CPU goes high, Kubernetes throttles it. But if memory goes high, Kubernetes kills the pod.',
    date: '2025-07-01',
    category: 'Kubernetes',
    author: 'Arvind Rajpurohit',
    tags: ['Kubernetes', 'Troubleshooting'],
  },
  {
    slug: 'graceful-shutdown-kubernetes',
    title: 'Graceful Shutdown in Kubernetes: Ensuring Safe Pod Termination',
    excerpt: 'Learn how to gracefully shut down Kubernetes Pods to prevent broken connections, dropped tasks, and data loss.',
    date: '2025-06-28',
    category: 'Kubernetes',
    author: 'Arvind Rajpurohit',
    tags: ['Kubernetes', 'Best Practices'],
  },
  {
    slug: 'load-balancing-long-lived-connections-kubernetes',
    title: 'Load Balancing and Scaling Long-Lived Connections in Kubernetes',
    excerpt: 'Understand how Kubernetes handles WebSockets, gRPC, and database connections—and learn how to properly load balance them.',
    date: '2025-06-25',
    category: 'Kubernetes',
    author: 'Arvind Rajpurohit',
    tags: ['Kubernetes', 'Best Practices'],
  },
  {
    slug: 'rollback-deployments-kubernetes',
    title: 'How to Roll Back Deployments in Kubernetes',
    excerpt: 'Understand how Kubernetes handles rollbacks, why it\'s risky in production, and best practices for safe rollbacks.',
    date: '2025-06-20',
    category: 'Kubernetes',
    author: 'Arvind Rajpurohit',
    tags: ['Kubernetes', 'Best Practices'],
  },
  {
    slug: '5-common-kubernetes-challenges',
    title: '5 Common Kubernetes Challenges: Scaling, Networking, GitOps & More',
    excerpt: 'Kubernetes Admission Webhooks play a critical role in controlling and managing the lifecycle of resources in your cluster.',
    date: '2025-06-15',
    category: 'Kubernetes',
    author: 'Arvind Rajpurohit',
    tags: ['Kubernetes', 'Best Practices'],
  },
  {
    slug: 'troubleshooting-networking-errors-kubernetes',
    title: 'Troubleshooting Networking Errors in Kubernetes',
    excerpt: 'Networking is one of the most critical components in any Kubernetes deployment, facilitating communication between pods, services, and external resources.',
    date: '2025-06-27',
    category: 'Kubernetes',
    author: 'Arvind Rajpurohit',
    tags: ['Kubernetes', 'Troubleshooting'],
  },
  {
    slug: 'debugging-kubernetes-admission-webhooks',
    title: 'Debugging Kubernetes Admission Webhooks: A Complete Guide',
    excerpt: 'Kubernetes Admission Webhooks play a critical role in controlling and managing the lifecycle of resources in your cluster.',
    date: '2025-06-14',
    category: 'Kubernetes',
    author: 'Arvind Rajpurohit',
    tags: ['Kubernetes', 'Troubleshooting'],
  },
  {
    slug: 'kubernetes-dns-guide',
    title: 'Kubernetes DNS: A Guide to Cluster Communication',
    excerpt: 'Kubernetes DNS plays a vital role in managing network communications within a cluster. It simplifies service discovery and enables pods to communicate using service names.',
    date: '2025-06-07',
    category: 'Kubernetes',
    author: 'Arvind Rajpurohit',
    tags: ['Kubernetes', 'Best Practices'],
  },
  {
    slug: 'kubernetes-node-not-ready-error',
    title: 'How to Troubleshoot and Fix Kubernetes Node Not Ready Error',
    excerpt: 'In Kubernetes clusters, the "Node Not Ready" error is a frequent issue that can disrupt the smooth operation of your workloads.',
    date: '2025-05-30',
    category: 'Kubernetes',
    author: 'Himanshu Bansal',
    tags: ['Kubernetes', 'Troubleshooting'],
  },
  {
    slug: 'imagepullbackoff-errimagepull-kubernetes',
    title: 'How to Troubleshoot and Fix ImagePullBackOff and ErrImagePull in Kubernetes',
    excerpt: 'In Kubernetes, container images are pulled from repositories when you deploy a pod. Occasionally, errors occur during this process.',
    date: '2025-05-21',
    category: 'Kubernetes',
    author: 'Himanshu Bansal',
    tags: ['Kubernetes', 'Troubleshooting'],
  },
  {
    slug: 'kubernetes-crashloopbackoff',
    title: 'Understanding and Troubleshooting Kubernetes CrashLoopBackOff',
    excerpt: 'The CrashLoopBackOff error in Kubernetes indicates that a pod is repeatedly crashing and Kubernetes is backing off from restarting it.',
    date: '2025-02-28',
    category: 'Kubernetes',
    author: 'Arvind Rajpurohit',
    tags: ['Kubernetes', 'Troubleshooting'],
  },
  {
    slug: 'kubernetes-evicted-pods',
    title: 'Kubernetes Evicted Pods: Causes, Troubleshooting, and Best Practices',
    excerpt: 'In Kubernetes, evicted pods occur when the node running the pods cannot meet the resource requirements, forcing Kubernetes to terminate them.',
    date: '2025-02-24',
    category: 'Kubernetes',
    author: 'Himanshu Bansal',
    tags: ['Kubernetes', 'Troubleshooting', 'Best Practices'],
  },
  {
    slug: 'kubernetes-502-bad-gateway',
    title: 'How to Troubleshoot and Fix Kubernetes 502 Bad Gateway Error',
    excerpt: 'A 502 Bad Gateway error is a common issue that users face when working with Kubernetes services and ingress controllers.',
    date: '2025-02-01',
    category: 'Kubernetes',
    author: 'Arvind Rajpurohit',
    tags: ['Kubernetes', 'Troubleshooting'],
  },
  {
    slug: '5-ways-aiops-transforming-infrastructure',
    title: '5 Ways AIOps is Transforming Infrastructure Management',
    excerpt: 'Discover how AI-powered operations are revolutionizing the way teams manage Kubernetes, VMs, and ECS.',
    date: '2024-03-15',
    category: 'AIOps',
    author: 'AlertMend Team',
    tags: ['AIOps', 'Best Practices'],
  },
  {
    slug: 'kubernetes-auto-remediation-best-practices',
    title: 'Kubernetes Auto-Remediation: Best Practices',
    excerpt: 'Learn how to set up effective auto-remediation workflows for your Kubernetes clusters.',
    date: '2024-03-10',
    category: 'Kubernetes',
    author: 'AlertMend Team',
    tags: ['Kubernetes', 'Best Practices'],
  },
  {
    slug: 'cost-optimization-multi-cloud',
    title: 'Cost Optimization Strategies for Multi-Cloud Infrastructure',
    excerpt: 'Reduce infrastructure costs by up to 50% with these proven optimization techniques.',
    date: '2024-03-05',
    category: 'Cost Optimization',
    author: 'AlertMend Team',
    tags: ['Cost Optimization', 'Best Practices'],
  },
  {
    slug: 'kubernetes-statefulset-volume-recovery-issues',
    title: 'Kubernetes StatefulSet Volume Recovery Issues: Troubleshooting and Best Practices',
    excerpt: 'Explore common challenges with StatefulSet volume recovery in Kubernetes and learn best practices for troubleshooting and preventing data loss.',
    date: '2025-06-10',
    category: 'Kubernetes',
    author: 'Arvind Rajpurohit',
    tags: ['Kubernetes', 'Troubleshooting', 'Best Practices'],
  },
  {
    slug: 'mastering-load-balancing-persistent-connections-kubernetes',
    title: 'Mastering Load Balancing for Persistent Connections in Kubernetes',
    excerpt: 'A deep dive into Kubernetes\' handling of long-lived connections and architectural strategies for building reliable, scalable solutions.',
    date: '2025-06-22',
    category: 'Kubernetes',
    author: 'Arvind Rajpurohit',
    tags: ['Kubernetes', 'Best Practices'],
  },
  {
    slug: 'troubleshooting-unhealthy-elasticsearch-nodes-kubernetes',
    title: 'Unhealthy Elasticsearch Nodes on Kubernetes',
    excerpt: 'Explore the causes of unhealthy Elasticsearch nodes and learn how to address them within a Kubernetes environment to maintain cluster stability.',
    date: '2025-05-18',
    category: 'Elasticsearch',
    author: 'Himanshu Bansal',
    tags: ['Elasticsearch', 'Kubernetes', 'Troubleshooting'],
  },
  {
    slug: 'understanding-privileged-containers-kubernetes',
    title: 'Privileged Containers in Kubernetes: Best Practices',
    excerpt: 'Learn about the security implications of running privileged containers in Kubernetes and discover best practices to mitigate associated risks.',
    date: '2025-05-08',
    category: 'Kubernetes',
    author: 'Arvind Rajpurohit',
    tags: ['Kubernetes', 'Best Practices'],
  },
  {
    slug: 'troubleshooting-elasticsearch-unassigned-shards-kubernetes',
    title: 'Elasticsearch Unassigned Shards on Kubernetes',
    excerpt: 'Explore the causes of unassigned shards in Elasticsearch running on Kubernetes and learn how to resolve these incidents effectively.',
    date: '2025-03-30',
    category: 'Elasticsearch',
    author: 'Arvind Rajpurohit',
    tags: ['Elasticsearch', 'Kubernetes', 'Troubleshooting'],
  },
  {
    slug: 'troubleshooting-kubeapidown',
    title: 'Troubleshooting KubeAPI Down: Causes and Recovery Steps',
    excerpt: 'Understand what happens when the Kubernetes API server goes down and learn how to diagnose and recover from API server failures.',
    date: '2025-03-25',
    category: 'Kubernetes',
    author: 'Arvind Rajpurohit',
    tags: ['Kubernetes', 'Troubleshooting'],
  },
]

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
      const match = line.match(/^(\w+):\s*["']?([^"']+)["']?$/)
      if (match) {
        const key = match[1]
        const value = match[2]
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

