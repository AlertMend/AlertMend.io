# Blog Content Alignment Script

This Python script analyzes blog markdown files and ensures content is aligned with AlertMend's core focus: AIOps, Kubernetes, DevOps, monitoring, and automated remediation.

## Features

- **Content Analysis**: Checks if blog content is relevant to AlertMend's domain
- **Relevance Scoring**: Calculates a relevance score (0-1) based on AlertMend keywords
- **H1 Heading Detection**: Identifies missing H1 headings
- **Keywords Detection**: Checks for missing keywords in frontmatter
- **Raw Reference Detection**: Detects files containing raw reference material from search results
- **Content Rewriting**: Rewrites content using Azure OpenAI API to align with AlertMend topics
  - Handles raw reference content by creating comprehensive, original blog posts
  - Rewrites existing content to better align with AlertMend's focus

## Installation

```bash
# Install Python dependencies (required for content rewriting feature)
pip install openai
```

## Azure OpenAI Setup

This script uses Azure OpenAI for content rewriting. You'll need:

1. **Azure OpenAI Resource**: Create an Azure OpenAI resource in your Azure subscription
2. **Deployment**: Create a model deployment (e.g., gpt-4o-mini, gpt-4, gpt-35-turbo)
3. **Credentials**: Get your endpoint URL and API key from Azure portal

### Getting Azure OpenAI Credentials

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your Azure OpenAI resource
3. Go to "Keys and Endpoint" section
4. Copy:
   - **Endpoint**: `https://<your-resource-name>.openai.azure.com/`
   - **API Key**: One of the two keys provided
   - **Deployment Name**: The name of your model deployment (e.g., "gpt-4o-mini")

## Usage

### Analyze Only (No Changes)

```bash
python scripts/align-blog-content.py --analyze-only --output analysis.json
```

This will:
- Analyze all blog files in `public/blog/`
- Output analysis results to JSON file
- Show summary statistics

### Fix H1 Headings

```bash
python scripts/align-blog-content.py --fix-h1
```

Adds missing H1 headings to blog posts.

### Fix Keywords

```bash
python scripts/align-blog-content.py --fix-keywords
```

Adds relevant keywords to frontmatter if missing.

### Rewrite Content (Requires Azure OpenAI Credentials)

**Option 1: Using environment variables (Recommended)**

The script automatically reads from environment variables if they're set:

```bash
export AZURE_OPENAI_ENDPOINT="https://your-resource.openai.azure.com/"
export AZURE_OPENAI_API_KEY="your-api-key"
export AZURE_OPENAI_DEPLOYMENT="gpt-4o-mini"

# Script will automatically use environment variables
python scripts/align-blog-content.py --rewrite
```

**Option 2: Using command-line arguments**

```bash
python scripts/align-blog-content.py --rewrite \
  --azure-endpoint "https://your-resource.openai.azure.com/" \
  --azure-api-key "your-api-key" \
  --azure-deployment "gpt-4o-mini"
```

**Option 3: Mix of environment variables and command-line**

Command-line arguments override environment variables:

```bash
export AZURE_OPENAI_ENDPOINT="https://your-resource.openai.azure.com/"
export AZURE_OPENAI_API_KEY="your-api-key"

# Only specify deployment via command line
python scripts/align-blog-content.py --rewrite --azure-deployment "gpt-4o-mini"
```

Rewrites content that is not aligned with AlertMend's focus areas. This uses Azure OpenAI (GPT-4o-mini or other deployed models) to:
- Keep the same general topic but make it relevant to Kubernetes/DevOps/AIOps
- Add practical examples related to Kubernetes, containers, monitoring, or infrastructure
- Include how AlertMend AI could help solve related problems
- Ensure comprehensive content (400-550 lines)

### Combine Options

```bash
python scripts/align-blog-content.py --fix-h1 --fix-keywords --rewrite \
  --azure-endpoint "https://your-resource.openai.azure.com/" \
  --azure-api-key "your-api-key" \
  --azure-deployment "gpt-4o-mini"
```

## AlertMend Core Topics

The script checks for relevance to these topics:
- Kubernetes (k8s, pods, deployments, services, etc.)
- AIOps (automated remediation, incident management, root cause analysis)
- DevOps (CI/CD, GitOps, infrastructure automation)
- Monitoring & Observability (Prometheus, Grafana, logging, metrics)
- Elasticsearch (cluster management, performance optimization)
- Cloud Infrastructure (AWS, Azure, GCP, ECS, VMs)

## Off-Topic Detection

The script identifies and flags content that is off-topic (e.g., WordPress外贸建站, Telegram screenshots, equipment uptime definitions).

## Output

The script provides:
- Per-file analysis with relevance scores
- List of issues for each file
- Suggested keywords
- Summary statistics (aligned files, files with H1, files with keywords, files needing rewrite)

## Examples

### Example: Analyze specific directory

```bash
python scripts/align-blog-content.py --blog-dir public/blog --analyze-only --output results.json
```

### Example: Fix all issues

```bash
python scripts/align-blog-content.py --fix-h1 --fix-keywords
```

## Notes

- The script reads all `.md` files from the specified blog directory
- Content rewriting requires Azure OpenAI credentials (endpoint, API key, deployment name) and `openai` package
- The script preserves existing frontmatter and only adds missing fields
- Keywords are generated based on title, category, and content analysis
- Default Azure API version is `2024-02-15-preview` (can be changed with `--azure-api-version`)

## Related Scripts

- `fix-h1-and-keywords.js`: Node.js script for quick H1 and keywords fixes (used for the current fixes)
- `validate-blogs.js`: Validates blog files for SEO compliance

