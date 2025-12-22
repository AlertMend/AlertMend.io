#!/usr/bin/env python3
"""
AlertMend Blog Content Alignment Script

This script analyzes blog markdown files and ensures content is aligned with
AlertMend's core focus: AIOps, Kubernetes, DevOps, monitoring, and automated remediation.

Features:
- Checks if content is relevant to AlertMend's domain
- Rewrites content if not aligned
- Adds missing H1 headings
- Adds missing keywords
- Updates markdown files in place
"""

import os
import re
import sys
import json
import argparse
from pathlib import Path
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass

# AlertMend core topics and keywords
ALERTMEND_KEYWORDS = [
    "kubernetes", "k8s", "aiops", "devops", "monitoring", "observability",
    "elasticsearch", "incident", "remediation", "automation", "troubleshooting",
    "cluster", "pod", "container", "deployment", "scaling", "networking",
    "infrastructure", "microservices", "cicd", "gitops", "argo", "helm",
    "prometheus", "grafana", "logging", "metrics", "alerting", "root cause",
    "crashloopbackoff", "oomkilled", "performance", "optimization", "cost",
    "aws", "azure", "gcp", "ecs", "vm", "virtual machine", "cloud"
]

# Topics that should NOT be in AlertMend blogs (off-topic)
OFF_TOPIC_KEYWORDS = [
    "wordpress外贸建站", "telegram screenshot", "computer network access",
    "equipment uptime definition", "uptime careers", "upt jobs",
    "sms ping", "port tool", "domain robot", "bright server"
]

# Patterns that indicate raw reference content (needs rewriting)
REFERENCE_CONTENT_PATTERNS = [
    r"REFERENCE CONTENT FROM TOP",
    r"SOURCE \d+:",
    r"================================================================================\s*SOURCE",
    r"This content is gathered from the top-ranking pages",
    r"utilize this information to comprehend the topic comprehensively",
    r"The following sections contain content from each source",
]

@dataclass
class BlogAnalysis:
    """Analysis results for a blog post"""
    file_path: str
    has_h1: bool
    has_keywords: bool
    relevance_score: float
    is_aligned: bool
    issues: List[str]
    suggested_keywords: List[str]
    needs_rewrite: bool

def parse_frontmatter(content: str) -> Tuple[Dict[str, str], str]:
    """Parse YAML frontmatter from markdown content"""
    frontmatter_match = re.match(r'^---\n([\s\S]*?)\n---\n([\s\S]*)$', content)
    if not frontmatter_match:
        return {}, content
    
    frontmatter_text = frontmatter_match.group(1)
    markdown_content = frontmatter_match.group(2)
    
    metadata = {}
    for line in frontmatter_text.split('\n'):
        line = line.strip()
        if not line:
            continue
        
        # Handle keywords which may contain commas
        keywords_match = re.match(r'^keywords:\s*["\'](.+)["\']$', line)
        if keywords_match:
            metadata['keywords'] = keywords_match.group(1)
            continue
        
        # Handle other fields
        match = re.match(r'^(\w+):\s*(.+)$', line)
        if match:
            key = match.group(1)
            value = match.group(2).strip().strip('"\'')
            metadata[key] = value
    
    return metadata, markdown_content

def extract_h1(content: str) -> Optional[str]:
    """Extract H1 heading from markdown content"""
    h1_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
    if h1_match:
        return h1_match.group(1).strip()
    return None

def calculate_relevance_score(content: str, title: str, keywords: str = "") -> float:
    """
    Calculate relevance score (0-1) for AlertMend content
    
    Returns:
        float: Score between 0.0 (not relevant) and 1.0 (highly relevant)
    """
    text_to_analyze = f"{title} {keywords} {content}".lower()
    
    # Check for off-topic keywords (negative signal)
    off_topic_count = sum(1 for keyword in OFF_TOPIC_KEYWORDS if keyword.lower() in text_to_analyze)
    if off_topic_count > 0:
        return 0.0  # Completely off-topic
    
    # Count AlertMend-relevant keywords
    relevant_count = sum(1 for keyword in ALERTMEND_KEYWORDS if keyword.lower() in text_to_analyze)
    
    # Normalize score (more keywords = higher score, max at 10+ keywords)
    score = min(relevant_count / 10.0, 1.0)
    
    # Boost score if content mentions AlertMend
    if "alertmend" in text_to_analyze:
        score = min(score + 0.2, 1.0)
    
    return score

def suggest_keywords(title: str, content: str, category: str = "") -> List[str]:
    """Suggest relevant keywords based on title and content"""
    suggested = set()
    text_lower = f"{title} {content}".lower()
    
    # Add category if provided
    if category:
        suggested.add(category.lower())
    
    # Add relevant AlertMend keywords found in content
    for keyword in ALERTMEND_KEYWORDS:
        if keyword.lower() in text_lower:
            suggested.add(keyword)
    
    # Always add core keywords
    suggested.update(["AlertMend AI", "AIOps", "Kubernetes", "DevOps"])
    
    # Convert to list and format properly
    keyword_list = list(suggested)[:10]  # Limit to 10 keywords
    return keyword_list

def analyze_blog(file_path: Path) -> BlogAnalysis:
    """Analyze a blog markdown file for AlertMend alignment"""
    try:
        content = file_path.read_text(encoding='utf-8')
    except Exception as e:
        return BlogAnalysis(
            file_path=str(file_path),
            has_h1=False,
            has_keywords=False,
            relevance_score=0.0,
            is_aligned=False,
            issues=[f"Error reading file: {e}"],
            suggested_keywords=[],
            needs_rewrite=True
        )
    
    metadata, markdown_content = parse_frontmatter(content)
    title = metadata.get('title', '')
    keywords = metadata.get('keywords', '')
    category = metadata.get('category', '')
    
    # Check for H1 heading
    h1 = extract_h1(markdown_content)
    has_h1 = h1 is not None
    
    # Check for keywords in frontmatter
    has_keywords = bool(keywords.strip())
    
    # Calculate relevance score
    relevance_score = calculate_relevance_score(markdown_content, title, keywords)
    is_aligned = relevance_score >= 0.3  # Threshold for alignment
    
    # Collect issues
    issues = []
    if not has_h1:
        issues.append("Missing H1 heading")
    if not has_keywords:
        issues.append("Missing keywords in frontmatter")
    if relevance_score < 0.3:
        issues.append(f"Low relevance score: {relevance_score:.2f} (content may not be aligned with AlertMend)")
    
    # Suggest keywords
    suggested_keywords = suggest_keywords(title, markdown_content, category)
    
    # Determine if rewrite is needed
    is_raw_content = is_raw_reference_content(markdown_content)
    needs_rewrite = relevance_score < 0.3 or off_topic_detected(markdown_content, title) or is_raw_content
    
    return BlogAnalysis(
        file_path=str(file_path),
        has_h1=has_h1,
        has_keywords=has_keywords,
        relevance_score=relevance_score,
        is_aligned=is_aligned,
        issues=issues,
        suggested_keywords=suggested_keywords,
        needs_rewrite=needs_rewrite
    )

def off_topic_detected(content: str, title: str) -> bool:
    """Check if content is off-topic"""
    text_lower = f"{title} {content}".lower()
    return any(keyword.lower() in text_lower for keyword in OFF_TOPIC_KEYWORDS)

def is_raw_reference_content(content: str) -> bool:
    """Check if content is raw reference material that needs rewriting"""
    content_upper = content.upper()
    return any(re.search(pattern, content_upper) for pattern in REFERENCE_CONTENT_PATTERNS)

def add_h1_heading(content: str, title: str) -> str:
    """Add H1 heading to content if missing"""
    metadata, markdown_content = parse_frontmatter(content)
    
    # Check if H1 already exists
    if extract_h1(markdown_content):
        return content
    
    # Remove title from frontmatter for H1 (keep it in frontmatter too)
    h1_title = title.replace(" | AlertMend AI", "").strip()
    
    # Add H1 at the start of content
    new_content = f"{markdown_content.strip()}\n\n# {h1_title}\n\n{markdown_content.strip()}"
    
    # Actually, let's insert H1 right after frontmatter
    frontmatter_match = re.match(r'^(---\n[\s\S]*?\n---\n)([\s\S]*)$', content)
    if frontmatter_match:
        frontmatter = frontmatter_match.group(1)
        body = frontmatter_match.group(2).strip()
        
        # Add H1 if body doesn't start with H1
        if not body.startswith('#'):
            new_content = f"{frontmatter}# {h1_title}\n\n{body}"
        else:
            new_content = content
    else:
        new_content = f"# {h1_title}\n\n{content}"
    
    return new_content

def add_keywords_to_frontmatter(content: str, keywords: List[str]) -> str:
    """Add keywords to frontmatter if missing"""
    metadata, markdown_content = parse_frontmatter(content)
    
    if 'keywords' in metadata and metadata['keywords'].strip():
        return content  # Keywords already exist
    
    # Format keywords as comma-separated string
    keywords_str = ", ".join(keywords)
    
    # Find frontmatter section
    frontmatter_match = re.match(r'^(---\n)([\s\S]*?)(\n---\n)([\s\S]*)$', content)
    if not frontmatter_match:
        return content
    
    frontmatter_start = frontmatter_match.group(1)
    frontmatter_body = frontmatter_match.group(2)
    frontmatter_end = frontmatter_match.group(3)
    body = frontmatter_match.group(4)
    
    # Add keywords line
    keywords_line = f'keywords: "{keywords_str}"\n'
    new_frontmatter_body = f"{frontmatter_body}\n{keywords_line}"
    
    return f"{frontmatter_start}{new_frontmatter_body}{frontmatter_end}{body}"

def rewrite_content_with_llm(
    content: str, 
    title: str, 
    category: str, 
    azure_endpoint: Optional[str] = None,
    azure_api_key: Optional[str] = None,
    azure_deployment_name: Optional[str] = None,
    azure_api_version: str = "2024-02-15-preview",
    is_raw_reference: bool = False
) -> Optional[str]:
    """
    Rewrite content to align with AlertMend using Azure OpenAI API
    
    Args:
        content: Blog post content with frontmatter
        title: Blog post title
        category: Blog post category
        azure_endpoint: Azure OpenAI endpoint URL (e.g., https://<resource-name>.openai.azure.com/)
        azure_api_key: Azure OpenAI API key
        azure_deployment_name: Azure OpenAI deployment name (e.g., "gpt-4o-mini")
        azure_api_version: Azure OpenAI API version (default: "2024-02-15-preview")
        is_raw_reference: If True, content is raw reference/scraped content that needs complete rewrite
    
    Returns:
        Rewritten content with frontmatter, or None if API call fails
    """
    if not azure_endpoint or not azure_api_key or not azure_deployment_name:
        return None
    
    try:
        from openai import AzureOpenAI
        
        # Initialize Azure OpenAI client
        client = AzureOpenAI(
            azure_endpoint=azure_endpoint,
            api_key=azure_api_key,
            api_version=azure_api_version
        )
        
        metadata, markdown_content = parse_frontmatter(content)
        
        # Extract first 3000 chars of content for context (increase for raw content)
        content_preview = markdown_content[:3000] if not is_raw_reference else markdown_content[:5000]
        
        if is_raw_reference:
            # Special prompt for raw reference content
            prompt = f"""You are rewriting raw reference/scraped content into a comprehensive, original AlertMend AI blog post.

Current Title: {title}
Category: {category}

The content below contains raw reference material from multiple sources. Your task is to create completely original, comprehensive blog content that:
1. Synthesizes key insights from the reference material (but uses 100% original wording)
2. Aligns with AlertMend AI's focus on AIOps, Kubernetes, DevOps, monitoring, and automated incident remediation
3. Follows AlertMend's blog content standards

Reference Content (for context only - DO NOT copy directly):
{content_preview}...

CRITICAL REQUIREMENTS:

**Content Structure (400-550 lines total):**
1. Start with H1 heading matching the title (without "| AlertMend AI" suffix)
2. Introduction Section (2-3 paragraphs explaining the topic, why it matters, what problems it solves)
3. Understanding/Overview Section (explain key concepts, how things work, terminology)
4. Diagnostic Workflow Section (step-by-step diagnostic process with commands)
5. Common Causes and Solutions Section (5+ issues, each with Symptoms, Diagnosis, Solutions, Code Examples)
6. Advanced Troubleshooting Section (complex scenarios, edge cases)
7. Best Practices Section (prevention strategies, configuration recommendations, monitoring approaches)
8. Monitoring and Observability Section (key metrics, Prometheus queries if applicable, alert rules)
9. Automated Detection and Remediation Section (how AlertMend AI helps)
10. Conclusion Section (summary, next steps, call-to-action)

**Code Examples (10-15 required):**
- Include YAML examples (with comments)
- Include bash/command examples (with explanatory comments)
- Include curl commands for API calls (if applicable)
- Include relevant language examples (JavaScript, Python, Go, etc.)
- All examples must be functional, well-commented, and production-ready

**Content Quality:**
- 400-550 lines when complete
- All content must be 100% original (do not copy from reference material)
- Use proper markdown formatting (H2, H3 headings, code blocks, lists)
- Include practical, real-world examples
- Focus on Kubernetes/DevOps/AIOps context
- Integrate AlertMend AI naturally throughout

**Writing Style:**
- Professional but accessible
- Action-oriented and practical
- Active voice
- Define technical terms on first use

Return ONLY the markdown content (without frontmatter), starting with the H1 heading. Ensure the content is comprehensive (400-550 lines) and follows all requirements above."""
        else:
            # Standard rewrite prompt
            prompt = f"""Rewrite the following blog post to align with AlertMend AI's focus on AIOps, Kubernetes, DevOps, monitoring, and automated incident remediation.

Current Title: {title}
Category: {category}

Current Content:
{content_preview}...

Requirements:
1. Keep the same general topic but make it relevant to Kubernetes/DevOps/AIOps
2. Add practical examples related to Kubernetes, containers, monitoring, or infrastructure
3. Include how AlertMend AI could help solve related problems
4. Ensure content is comprehensive (400-550 lines when complete)
5. Include code examples (10-15 examples: YAML, bash, curl, and relevant languages)
6. Add troubleshooting sections with step-by-step diagnostic workflows
7. Include best practices and prevention strategies
8. Start with an H1 heading that matches the title (without "| AlertMend AI" suffix)
9. Use proper markdown formatting with H2, H3 headings
10. Include sections: Introduction, Understanding, Diagnostic Workflow, Common Causes & Solutions, Best Practices, Monitoring/Observability, AlertMend AI Integration, Conclusion

Return ONLY the markdown content (without frontmatter), starting with the H1 heading."""
        
        response = client.chat.completions.create(
            model=azure_deployment_name,
            messages=[
                {"role": "system", "content": "You are a technical writer specializing in Kubernetes, AIOps, and DevOps topics for AlertMend AI. You create comprehensive, original, well-structured blog content that follows industry best practices and SEO guidelines."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=8000  # Increase for comprehensive content
        )
        
        rewritten_content = response.choices[0].message.content.strip()
        
        # Combine with frontmatter (preserve existing frontmatter but may need to update excerpt)
        frontmatter_match = re.match(r'^(---\n[\s\S]*?\n---\n)([\s\S]*)$', content)
        if frontmatter_match:
            frontmatter = frontmatter_match.group(1)
            # Check if excerpt needs updating (if it's clearly bad)
            if is_raw_reference and 'excerpt:' in frontmatter.lower():
                # Generate a better excerpt (first 150 chars of rewritten content, cleaned)
                lines = rewritten_content.split('\n')
                first_paragraph = ' '.join([line.strip() for line in lines[:5] if line.strip() and not line.startswith('#')])
                if len(first_paragraph) > 160:
                    first_paragraph = first_paragraph[:157] + '...'
                # Update excerpt in frontmatter (this is a simple approach - could be more sophisticated)
                # For now, just return with original frontmatter - excerpt can be fixed separately
            return f"{frontmatter}{rewritten_content}"
        
        return rewritten_content
        
    except ImportError:
        print("Warning: openai package not installed. Install with: pip install openai")
        return None
    except Exception as e:
        print(f"Error calling Azure OpenAI API: {e}")
        return None

def fix_blog_file(
    file_path: Path, 
    add_h1: bool = True, 
    add_keywords: bool = True, 
    rewrite_content: bool = False, 
    azure_endpoint: Optional[str] = None,
    azure_api_key: Optional[str] = None,
    azure_deployment_name: Optional[str] = None,
    azure_api_version: str = "2024-02-15-preview"
) -> Tuple[bool, List[str]]:
    """Fix issues in a blog file"""
    analysis = analyze_blog(file_path)
    changes = []
    
    # Process file if it has issues OR if rewrite is requested
    if analysis.issues or rewrite_content:
        try:
            content = file_path.read_text(encoding='utf-8')
            metadata, markdown_content = parse_frontmatter(content)
            
            # Add H1 if missing
            if add_h1 and not analysis.has_h1:
                title = metadata.get('title', '')
                content = add_h1_heading(content, title)
                changes.append("Added H1 heading")
            
            # Add keywords if missing
            if add_keywords and not analysis.has_keywords and analysis.suggested_keywords:
                content = add_keywords_to_frontmatter(content, analysis.suggested_keywords)
                changes.append(f"Added keywords: {', '.join(analysis.suggested_keywords[:5])}")
            
            # Rewrite content if needed (check both rewrite_content flag and needs_rewrite)
            is_raw_content = is_raw_reference_content(markdown_content)
            if rewrite_content and (analysis.needs_rewrite or is_raw_content):
                title = metadata.get('title', '')
                category = metadata.get('category', 'Kubernetes')
                
                # Show progress for raw reference content
                if is_raw_content:
                    print(f"   🔄 Rewriting raw reference content: {file_path.name}...", flush=True)
                
                rewritten = rewrite_content_with_llm(
                    content, 
                    title, 
                    category, 
                    azure_endpoint=azure_endpoint,
                    azure_api_key=azure_api_key,
                    azure_deployment_name=azure_deployment_name,
                    azure_api_version=azure_api_version,
                    is_raw_reference=is_raw_content
                )
                if rewritten:
                    content = rewritten
                    if is_raw_content:
                        changes.append("Rewritten raw reference content into comprehensive blog post")
                    else:
                        changes.append("Rewritten content to align with AlertMend")
                else:
                    if is_raw_content:
                        changes.append("⚠️  Raw reference content needs rewrite (Azure OpenAI credentials not available)")
                    else:
                        changes.append("⚠️  Content needs manual rewrite (Azure OpenAI credentials not available)")
            
            if changes:
                file_path.write_text(content, encoding='utf-8')
                return True, changes
            
        except Exception as e:
            return False, [f"Error fixing file: {e}"]
    
    return False, []

def main():
    import os
    
    parser = argparse.ArgumentParser(
        description='Analyze and align blog content with AlertMend using Azure OpenAI',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Examples:
  # Analyze only
  python scripts/align-blog-content.py --analyze-only --output analysis.json

  # Fix H1 and keywords
  python scripts/align-blog-content.py --fix-h1 --fix-keywords

  # Rewrite content using Azure OpenAI (from environment variables)
  export AZURE_OPENAI_ENDPOINT="https://your-resource.openai.azure.com/"
  export AZURE_OPENAI_API_KEY="your-api-key"
  export AZURE_OPENAI_DEPLOYMENT="gpt-4o-mini"
  python scripts/align-blog-content.py --rewrite \\
    --azure-endpoint "$AZURE_OPENAI_ENDPOINT" \\
    --azure-api-key "$AZURE_OPENAI_API_KEY" \\
    --azure-deployment "$AZURE_OPENAI_DEPLOYMENT"
        '''
    )
    parser.add_argument('--blog-dir', type=str, default='public/blog',
                       help='Directory containing blog markdown files')
    parser.add_argument('--fix-h1', action='store_true',
                       help='Add missing H1 headings')
    parser.add_argument('--fix-keywords', action='store_true',
                       help='Add missing keywords')
    parser.add_argument('--rewrite', action='store_true',
                       help='Rewrite content if not aligned (requires Azure OpenAI credentials)')
    parser.add_argument('--azure-endpoint', type=str,
                       default=os.getenv('AZURE_OPENAI_ENDPOINT'),
                       help='Azure OpenAI endpoint URL (default: from AZURE_OPENAI_ENDPOINT env var)')
    parser.add_argument('--azure-api-key', type=str,
                       default=os.getenv('AZURE_OPENAI_API_KEY'),
                       help='Azure OpenAI API key (default: from AZURE_OPENAI_API_KEY env var)')
    parser.add_argument('--azure-deployment', type=str,
                       default=os.getenv('AZURE_OPENAI_DEPLOYMENT'),
                       help='Azure OpenAI deployment name (default: from AZURE_OPENAI_DEPLOYMENT env var)')
    parser.add_argument('--azure-api-version', type=str, 
                       default=os.getenv('AZURE_OPENAI_API_VERSION', '2024-02-15-preview'),
                       help='Azure OpenAI API version (default: 2024-02-15-preview or from env var)')
    parser.add_argument('--analyze-only', action='store_true',
                       help='Only analyze, do not fix')
    parser.add_argument('--output', type=str, help='Output JSON file for analysis results')
    
    args = parser.parse_args()
    
    blog_dir = Path(args.blog_dir)
    if not blog_dir.exists():
        print(f"Error: Blog directory not found: {blog_dir}")
        sys.exit(1)
    
    # Find all markdown files
    md_files = list(blog_dir.glob('*.md'))
    print(f"Found {len(md_files)} blog files\n")
    
    # Analyze all files
    analyses = []
    raw_reference_files = []
    for md_file in sorted(md_files):
        analysis = analyze_blog(md_file)
        analyses.append(analysis)
        
        # Check if it's raw reference content
        try:
            content = md_file.read_text(encoding='utf-8')
            _, markdown_content = parse_frontmatter(content)
            if is_raw_reference_content(markdown_content):
                raw_reference_files.append(md_file.name)
        except:
            pass
        
        # Show status - mark raw reference files specially
        is_raw_ref = md_file.name in raw_reference_files
        if is_raw_ref:
            status = "🔴"
        elif analysis.is_aligned and analysis.has_h1 and analysis.has_keywords and not analysis.needs_rewrite:
            status = "✅"
        else:
            status = "⚠️"
        
        print(f"{status} {md_file.name}")
        if is_raw_ref:
            print(f"   ⚠️  Contains raw reference content - needs rewrite")
        print(f"   Relevance: {analysis.relevance_score:.2f}")
        if analysis.issues:
            print(f"   Issues: {', '.join(analysis.issues)}")
        print()
    
    # Report raw reference files
    if raw_reference_files:
        print(f"\n{'='*60}")
        print(f"🔴 Found {len(raw_reference_files)} files with raw reference content:")
        print(f"{'='*60}")
        for filename in raw_reference_files:
            print(f"   - {filename}")
        print(f"\n💡 Tip: Use --rewrite with Azure OpenAI credentials to regenerate content")
        print(f"{'='*60}\n")
    
    # Output analysis results
    if args.output:
        results = {
            'analyses': [
                {
                    'file': a.file_path,
                    'has_h1': a.has_h1,
                    'has_keywords': a.has_keywords,
                    'relevance_score': a.relevance_score,
                    'is_aligned': a.is_aligned,
                    'issues': a.issues,
                    'suggested_keywords': a.suggested_keywords,
                    'needs_rewrite': a.needs_rewrite
                }
                for a in analyses
            ]
        }
        with open(args.output, 'w') as f:
            json.dump(results, f, indent=2)
        print(f"Analysis results saved to {args.output}\n")
    
    # Fix issues if requested
    if not args.analyze_only:
        # Validate Azure OpenAI credentials if rewrite is requested
        if args.rewrite:
            if not args.azure_endpoint or not args.azure_api_key or not args.azure_deployment:
                print("\n❌ Error: --rewrite requires --azure-endpoint, --azure-api-key, and --azure-deployment")
                print("Example: --rewrite --azure-endpoint https://your-resource.openai.azure.com/ --azure-api-key <key> --azure-deployment gpt-4o-mini")
                sys.exit(1)
        
        fixed_count = 0
        rewritten_count = 0
        for analysis in analyses:
            md_file = Path(analysis.file_path)
            is_raw_ref_file = md_file.name in raw_reference_files
            
            # Always rewrite raw reference files if --rewrite is set
            should_rewrite = args.rewrite and (analysis.needs_rewrite or is_raw_ref_file)
            
            # Fix if there are issues OR if we need to rewrite
            if analysis.issues or should_rewrite:
                success, changes = fix_blog_file(
                    md_file,
                    add_h1=args.fix_h1,
                    add_keywords=args.fix_keywords,
                    rewrite_content=should_rewrite,
                    azure_endpoint=args.azure_endpoint,
                    azure_api_key=args.azure_api_key,
                    azure_deployment_name=args.azure_deployment,
                    azure_api_version=args.azure_api_version
                )
                if success:
                    fixed_count += 1
                    if any("rewritten" in change.lower() or "rewrite" in change.lower() for change in changes):
                        rewritten_count += 1
                    print(f"✅ Fixed {md_file.name}: {', '.join(changes)}")
        
        if fixed_count > 0:
            print(f"\n✅ Fixed {fixed_count} files")
        else:
            print("\nNo files needed fixing")
    
    # Summary
    aligned_count = sum(1 for a in analyses if a.is_aligned)
    has_h1_count = sum(1 for a in analyses if a.has_h1)
    has_keywords_count = sum(1 for a in analyses if a.has_keywords)
    needs_rewrite_count = sum(1 for a in analyses if a.needs_rewrite)
    
    print(f"\n📊 Summary:")
    print(f"   Total files: {len(analyses)}")
    print(f"   Aligned with AlertMend: {aligned_count}/{len(analyses)}")
    print(f"   Has H1 heading: {has_h1_count}/{len(analyses)}")
    print(f"   Has keywords: {has_keywords_count}/{len(analyses)}")
    print(f"   Need rewrite: {needs_rewrite_count}/{len(analyses)}")

if __name__ == '__main__':
    main()

