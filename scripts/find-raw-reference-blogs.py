#!/usr/bin/env python3
"""
Find all blog files containing raw reference content that needs to be rewritten.
"""

import os
import re
from pathlib import Path

# Patterns that indicate raw reference content
REFERENCE_PATTERNS = [
    r"REFERENCE CONTENT FROM TOP",
    r"SOURCE \d+:",
    r"================================================================================\s*SOURCE",
    r"This content is gathered from the top-ranking pages",
    r"utilize this information to comprehend the topic comprehensively",
    r"The following sections contain content from each source",
]

def check_file(file_path):
    """Check if a file contains raw reference content"""
    try:
        content = file_path.read_text(encoding='utf-8')
        content_upper = content.upper()
        
        # Check for patterns
        for pattern in REFERENCE_PATTERNS:
            if re.search(pattern, content_upper):
                return True
        
        # Also check for multiple "SOURCE X:" patterns
        source_count = len(re.findall(r"SOURCE \d+:", content_upper))
        has_long_separator = "====" in content or "================================================================================" in content
        
        if source_count >= 2 and has_long_separator:
            return True
        
        return False
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return False

def main():
    blog_dir = Path('public/blog')
    raw_reference_files = []
    
    md_files = list(blog_dir.glob('*.md'))
    print(f"Scanning {len(md_files)} blog files...\n")
    
    for md_file in sorted(md_files):
        if check_file(md_file):
            raw_reference_files.append(md_file.name)
            print(f"✓ Found: {md_file.name}")
    
    print(f"\n{'='*60}")
    print(f"Total files with raw reference content: {len(raw_reference_files)}")
    print(f"{'='*60}\n")
    
    if raw_reference_files:
        print("Files to rewrite:")
        for filename in raw_reference_files:
            print(f"  - {filename}")
        
        # Save to file
        output_file = Path('scripts/raw_reference_files.txt')
        output_file.write_text('\n'.join(raw_reference_files), encoding='utf-8')
        print(f"\n✓ List saved to {output_file}")

if __name__ == '__main__':
    main()

