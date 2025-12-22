#!/usr/bin/env python3
"""
AlertMend Content Alignment Script

This script analyzes blog markdown files and ensures content is aligned with AlertMend's 
AIOps platform positioning. It checks for:
1. Proper H1 heading at content start
2. AlertMend AI mentions and positioning
3. Automated remediation focus
4. AIOps and autonomous operation language
5. Cost optimization and zero-downtime value props

If content is not aligned, it enhances it appropriately while preserving structure.
"""

import re
import os
import sys
from pathlib import Path
from typing import Dict, Tuple, List, Optional
import yaml

# AlertMend positioning keywords and concepts
ALERTMEND_KEYWORDS = [
    'AlertMend AI',
    'AlertMend',
    'automated remediation',
    'auto-remediation',
    'automatically fixes',
    'automatically resolves',
    'autonomous',
    'AIOps',
    'AI-driven',
    'AI-powered',
    'zero-downtime',
    'cost optimization',
    'automatically detects',
    'automatically analyzes',
]

# AlertMend value propositions
VALUE_PROPOSITIONS = [
    'automatically detects, analyzes, and resolves incidents',
    'eliminates manual firefighting',
    'reduces infrastructure costs',
    'achieves zero downtime',
    'reduces manual operations work',
    'automated incident resolution',
    'AI-powered root cause analysis',
    'predictive issue detection',
]

# AlertMend features
ALERTMEND_FEATURES = [
    'Kubernetes',
    'VMs',
    'ECS',
    'CrashLoopBackOff',
    'OOMKilled',
    '5xx errors',
    'pod failures',
    'resource constraints',
    'network issues',
    'node pressure',
    'disk full',
    'cost inefficiencies',
]

def parse_markdown(file_path: Path) -> Tuple[Dict, str]:
    """Parse markdown file and return frontmatter and content."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            post = frontmatter.load(f)
            return post.metadata, post.content
    except Exception as e:
        print(f"Error parsing {file_path}: {e}")
        return {}, ""

def save_markdown(file_path: Path, metadata: Dict, content: str):
    """Save markdown file with frontmatter and content."""
    try:
        post = frontmatter.Post(content, **metadata)
        with open(file_path, 'w', encoding='utf-8') as f:
            frontmatter.dump(post, f)
    except Exception as e:
        print(f"Error saving {file_path}: {e}")

def has_h1_heading(content: str) -> bool:
    """Check if content starts with H1 heading."""
    lines = content.strip().split('\n')
    for line in lines[:10]:  # Check first 10 lines
        if line.strip().startswith('# '):
            return True
    return False

def extract_first_h1(content: str) -> str:
    """Extract the first H1 heading from content."""
    lines = content.strip().split('\n')
    for line in lines[:10]:
        if line.strip().startswith('# '):
            return line.strip()[2:].strip()
    return None

def count_alertmend_mentions(content: str) -> int:
    """Count mentions of AlertMend-related keywords."""
    content_lower = content.lower()
    count = 0
    for keyword in ALERTMEND_KEYWORDS:
        count += content_lower.count(keyword.lower())
    return count

def check_content_alignment(content: str) -> Dict:
    """Check if content is aligned with AlertMend positioning."""
    content_lower = content.lower()
    
    alignment_score = 0
    issues = []
    
    # Check for H1 heading
    if not has_h1_heading(content):
        issues.append("Missing H1 heading at content start")
    else:
        alignment_score += 1
    
    # Check for AlertMend mentions
    alertmend_mentions = count_alertmend_mentions(content)
    if alertmend_mentions == 0:
        issues.append("No AlertMend AI mentions found")
    elif alertmend_mentions < 2:
        issues.append(f"Low AlertMend mentions ({alertmend_mentions})")
    else:
        alignment_score += 1
    
    # Check for automation language
    has_automation = any(keyword in content_lower for keyword in [
        'automated', 'automatically', 'autonomous', 'aiops', 'ai-driven', 'ai-powered'
    ])
    if not has_automation:
        issues.append("Missing automation/AIOps language")
    else:
        alignment_score += 1
    
    # Check for value propositions
    has_value_props = any(prop.lower() in content_lower for prop in VALUE_PROPOSITIONS)
    if not has_value_props:
        issues.append("Missing AlertMend value propositions")
    else:
        alignment_score += 1
    
    # Determine alignment status
    is_aligned = alignment_score >= 3 and len(issues) == 0
    
    return {
        'score': alignment_score,
        'max_score': 4,
        'is_aligned': is_aligned,
        'issues': issues,
        'alertmend_mentions': alertmend_mentions
    }

def generate_h1_from_title(title: str) -> str:
    """Generate H1 heading from title."""
    # Remove " | AlertMend AI" suffix if present
    title = re.sub(r'\s*\|\s*AlertMend AI\s*$', '', title, flags=re.IGNORECASE)
    # Capitalize appropriately
    return f"# {title}"

def enhance_content_with_alertmend(content: str, title: str, category: str = "") -> str:
    """Enhance content to align with AlertMend positioning."""
    
    # Ensure H1 heading exists
    if not has_h1_heading(content):
        h1_title = generate_h1_from_title(title)
        content = f"{h1_title}\n\n{content}"
    
    # Check if content already has good AlertMend alignment
    alignment = check_content_alignment(content)
    if alignment['is_aligned']:
        return content
    
    # Extract existing H1
    existing_h1 = extract_first_h1(content)
    content_lines = content.split('\n')
    
    # Find where to insert AlertMend content
    # Look for conclusion or last section
    conclusion_idx = None
    for i, line in enumerate(reversed(content_lines)):
        if line.strip().startswith('##') and any(keyword in line.lower() for keyword in 
            ['conclusion', 'summary', 'takeaway', 'wrap', 'final', 'getting started']):
            conclusion_idx = len(content_lines) - i
            break
    
    # If no conclusion, add before the end
    if conclusion_idx is None:
        conclusion_idx = len(content_lines)
    
    # Generate AlertMend enhancement section
    enhancement_section = generate_alertmend_section(title, category, existing_h1)
    
    # Check if similar section already exists
    content_lower = content.lower()
    if any(keyword in content_lower for keyword in ['alertmend ai', 'how alertmend', 'alertmend helps', 'alertmend can']):
        # Already has AlertMend section, enhance existing mentions
        return enhance_existing_alertmend_mentions(content)
    
    # Insert AlertMend section before conclusion
    enhanced_content_lines = (
        content_lines[:conclusion_idx] + 
        [''] + 
        enhancement_section.split('\n') + 
        [''] + 
        content_lines[conclusion_idx:]
    )
    
    return '\n'.join(enhanced_content_lines)

def generate_alertmend_section(title: str, category: str, existing_h1: str = None) -> str:
    """Generate an AlertMend enhancement section."""
    
    # Determine focus based on category and title
    focus = "infrastructure"
    if "kubernetes" in category.lower() or "kubernetes" in title.lower():
        focus = "Kubernetes"
    elif "elasticsearch" in title.lower():
        focus = "Elasticsearch"
    elif "cost" in title.lower() or "optimization" in title.lower():
        focus = "cost optimization"
    elif "monitoring" in title.lower() or "observability" in title.lower():
        focus = "monitoring and observability"
    
    section = f"""## How AlertMend AI Simplifies {focus} Management

AlertMend AI is an autonomous AIOps platform that automatically detects, analyzes, and resolves incidents across {focus if focus != 'infrastructure' else 'Kubernetes, VMs, and ECS'}. Instead of manual firefighting, AlertMend AI:

- **Automated Remediation**: Automatically fixes common issues like pod failures, resource constraints, and network problems without human intervention
- **AI-Powered Root Cause Analysis**: Quickly identifies the root cause by correlating events across multiple systems
- **Predictive Issue Detection**: Uses machine learning to detect anomalies and predict problems before they impact users
- **Cost Optimization**: Continuously analyzes resource usage and provides recommendations to reduce infrastructure costs by up to 50%
- **Zero-Downtime Operations**: Ensures high availability and eliminates up to 90% of manual operations work

With AlertMend AI, teams achieve up to 99.97% uptime and reduce MTTR (Mean Time To Resolution) from hours to seconds for common issues."""
    
    return section

def enhance_existing_alertmend_mentions(content: str) -> str:
    """Enhance existing AlertMend mentions with more automation language."""
    
    # Replace generic mentions with more specific AlertMend AI features
    replacements = [
        (r'AlertMend\b(?!\s+AI)', 'AlertMend AI'),
        (r'manual monitoring', 'automated AIOps monitoring'),
        (r'manual troubleshooting', 'automated root cause analysis and remediation'),
        (r'fix issues', 'automatically detect and resolve incidents'),
    ]
    
    enhanced = content
    for pattern, replacement in replacements:
        enhanced = re.sub(pattern, replacement, enhanced, flags=re.IGNORECASE)
    
    return enhanced

def process_blog_file(file_path: Path, dry_run: bool = False) -> Dict:
    """Process a single blog file."""
    print(f"\n📄 Processing: {file_path.name}")
    
    metadata, content = parse_markdown(file_path)
    
    if not content:
        return {'status': 'error', 'message': 'Could not parse content'}
    
    title = metadata.get('title', '')
    
    # Check current alignment
    alignment = check_content_alignment(content)
    
    result = {
        'file': file_path.name,
        'title': title,
        'current_score': alignment['score'],
        'max_score': alignment['max_score'],
        'is_aligned': alignment['is_aligned'],
        'issues': alignment['issues'],
        'alertmend_mentions': alignment['alertmend_mentions'],
        'modified': False
    }
    
    if alignment['is_aligned']:
        print(f"  ✅ Already aligned (score: {alignment['score']}/{alignment['max_score']})")
        return result
    
    print(f"  ⚠️  Not aligned (score: {alignment['score']}/{alignment['max_score']})")
    print(f"  Issues: {', '.join(alignment['issues'])}")
    
    if not dry_run:
        # Enhance content
        category = metadata.get('category', '')
        enhanced_content = enhance_content_with_alertmend(content, title, category)
        
        # Save if changed
        if enhanced_content != content:
            save_markdown(file_path, metadata, enhanced_content)
            result['modified'] = True
            print(f"  ✏️  Content enhanced and saved")
        else:
            print(f"  ℹ️  No changes needed")
    else:
        print(f"  🔍 [DRY RUN] Would enhance content")
    
    return result

def main():
    """Main function."""
    import argparse
    
    parser = argparse.ArgumentParser(description='Align blog content with AlertMend positioning')
    parser.add_argument('--path', type=str, default='public/blog', 
                       help='Path to blog directory (default: public/blog)')
    parser.add_argument('--file', type=str, default=None,
                       help='Process a single file instead of all files')
    parser.add_argument('--dry-run', action='store_true',
                       help='Show what would be changed without modifying files')
    parser.add_argument('--min-score', type=int, default=3,
                       help='Minimum alignment score to consider aligned (default: 3)')
    
    args = parser.parse_args()
    
    blog_dir = Path(args.path)
    
    if not blog_dir.exists():
        print(f"❌ Directory not found: {blog_dir}")
        sys.exit(1)
    
    # Get files to process
    if args.file:
        files = [blog_dir / args.file]
        if not files[0].exists():
            print(f"❌ File not found: {files[0]}")
            sys.exit(1)
    else:
        files = list(blog_dir.glob('*.md'))
    
    if not files:
        print(f"❌ No markdown files found in {blog_dir}")
        sys.exit(1)
    
    print(f"🔍 Analyzing {len(files)} blog file(s)...")
    if args.dry_run:
        print("🔍 DRY RUN MODE - No files will be modified")
    
    results = []
    for file_path in sorted(files):
        try:
            result = process_blog_file(file_path, dry_run=args.dry_run)
            results.append(result)
        except Exception as e:
            print(f"  ❌ Error: {e}")
            results.append({'file': file_path.name, 'status': 'error', 'message': str(e)})
    
    # Summary
    print("\n" + "="*60)
    print("📊 SUMMARY")
    print("="*60)
    
    aligned = sum(1 for r in results if r.get('is_aligned', False))
    modified = sum(1 for r in results if r.get('modified', False))
    total = len(results)
    
    print(f"Total files: {total}")
    print(f"Aligned: {aligned}")
    print(f"Modified: {modified}")
    print(f"Needs attention: {total - aligned}")
    
    if total - aligned > 0:
        print("\n⚠️  Files needing attention:")
        for r in results:
            if not r.get('is_aligned', False):
                print(f"  - {r['file']}: {', '.join(r.get('issues', []))}")
    
    if args.dry_run:
        print("\n💡 Run without --dry-run to apply changes")

if __name__ == '__main__':
    main()
