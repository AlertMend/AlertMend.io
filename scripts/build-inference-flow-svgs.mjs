/**
 * Generate AlertMend recovery-flow sequence SVGs for inference blog posts.
 * Adapts the Langfuse flow template (same layout as Ollama).
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const templatePath = path.join(
  root,
  'public/assets/monitor-langfuse-using-alertmend/langfuse-alertmend-recovery-flow.svg'
)

const langfuseHeaderRe = new RegExp(
  '  <rect x="80" y="72" width="200" height="80" rx="6" fill="#fff3e0" stroke="#f59e0b" stroke-width="1.5"/>[\\s\\S]*?<text x="180" y="140"[^>]*>Langfuse</text>'
)

function textHeader(name, subtitle, fill = '#3f3f46', stroke = '#a1a1aa', bg = '#f4f4f5') {
  return `  <rect x="80" y="72" width="200" height="80" rx="6" fill="${bg}" stroke="${stroke}" stroke-width="1.5"/>
  <text x="180" y="108" text-anchor="middle" fill="${fill}" font-family="system-ui,-apple-system,sans-serif" font-size="15" font-weight="700">${name}</text>
  <text x="180" y="140" text-anchor="middle" fill="${fill}" font-family="system-ui,-apple-system,sans-serif" font-size="11" font-weight="700">${subtitle}</text>`
}

function logoHeader(logoPath, subtitle, fill = '#3f3f46') {
  const b64 = fs.readFileSync(logoPath).toString('base64')
  return `  <rect x="80" y="72" width="200" height="80" rx="6" fill="#f4f4f5" stroke="#a1a1aa" stroke-width="1.5"/>
  <image href="data:image/svg+xml;base64,${b64}" x="109" y="82" width="142" height="36" preserveAspectRatio="xMidYMid meet" aria-hidden="true"/>
  <text x="180" y="140" text-anchor="middle" fill="${fill}" font-family="system-ui,-apple-system,sans-serif" font-size="11" font-weight="700">${subtitle}</text>`
}

function buildFlow({ slug, outName, header, replacements, ariaLabel }) {
  const assets = path.join(root, `public/assets/${slug}`)
  let svg = fs.readFileSync(templatePath, 'utf8')
  if (ariaLabel) {
    svg = svg.replace(/aria-label="[^"]*"/, `aria-label="${ariaLabel}"`)
  }
  svg = svg.replace(langfuseHeaderRe, header)
  for (const [from, to] of replacements) {
    svg = svg.split(from).join(to)
  }
  const out = path.join(assets, outName)
  fs.writeFileSync(out, svg)
  console.log('✓ Wrote', out)
}

const template = fs.readFileSync(templatePath, 'utf8')
void template

buildFlow({
  slug: 'monitor-litellm-using-alertmend',
  outName: 'litellm-alertmend-recovery-flow.svg',
  ariaLabel: 'Sequence diagram: LiteLLM readiness failure and AlertMend auto-recovery',
  header: textHeader('LiteLLM', 'Gateway · :4000', '#5b21b6', '#7c3aed', '#ede9fe'),
  replacements: [
    ['Langfuse failure detection', 'LiteLLM failure detection'],
    ['How to monitor Langfuse in production', 'How to monitor LiteLLM in production'],
    [
      'Ready check fails, AlertMend alerts Slack, restarts Langfuse, traces flow again',
      'Readiness fails, AlertMend alerts Slack, restarts gateway and backend, traffic flows',
    ],
    ['Serving trace ingestion', '200 OK on /health/readiness'],
    ['Langfuse database connection lost', 'Backend unreachable from gateway'],
    ['Database unreachable', 'Ollama or vLLM down'],
    ['Restart Langfuse', 'Restart backend + LiteLLM'],
    ['LLM apps keep tracing keeps moving', 'SDK traffic through gateway again'],
    [
      'Minutes of downtime, not hours of manual firefighting',
      'Typical AlertMend recovery in under a minute',
    ],
  ],
})

buildFlow({
  slug: 'monitor-vllm-using-alertmend',
  outName: 'vllm-alertmend-recovery-flow.svg',
  ariaLabel: 'Sequence diagram: vLLM inference failure and AlertMend auto-recovery',
  header: textHeader('vLLM', 'OpenAI API · :8000', '#1e3a5f', '#3b82f6', '#eff6ff'),
  replacements: [
    ['Langfuse failure detection', 'vLLM failure detection'],
    ['How to monitor Langfuse in production', 'How to monitor vLLM in production'],
    [
      'Ready check fails, AlertMend alerts Slack, restarts Langfuse, traces flow again',
      '/v1/models fails, AlertMend alerts Slack, restarts vLLM, inference resumes',
    ],
    ['Serving trace ingestion', '200 OK on /v1/models'],
    ['Langfuse database connection lost', 'vLLM OOMKilled exit 137'],
    ['Database unreachable', 'GPU pod killed · model evicted'],
    ['Restart Langfuse', 'Restart vLLM pod'],
    ['LLM apps keep tracing keeps moving', 'OpenAI-compatible traffic flows again'],
    [
      'Minutes of downtime, not hours of manual firefighting',
      'Typical AlertMend recovery in under a minute',
    ],
  ],
})

buildFlow({
  slug: 'monitor-open-webui-using-alertmend',
  outName: 'open-webui-alertmend-recovery-flow.svg',
  ariaLabel: 'Sequence diagram: Open WebUI up while Ollama backend fails, AlertMend auto-recovery',
  header: logoHeader(
    path.join(root, 'public/assets/monitor-ollama-using-alertmend/ollama-logo.svg'),
    'Open WebUI + Ollama backend'
  ),
  replacements: [
    ['Langfuse failure detection', 'Split-stack failure detection'],
    ['How to monitor Langfuse in production', 'How to monitor Open WebUI + Ollama'],
    [
      'Ready check fails, AlertMend alerts Slack, restarts Langfuse, traces flow again',
      'UI /health OK but /api/tags fails — AlertMend restarts Ollama, chat works again',
    ],
    ['Serving trace ingestion', 'WebUI /health 200 OK'],
    ['Langfuse database connection lost', 'Ollama /api/tags unreachable'],
    ['Database unreachable', 'Backend down · UI still loads'],
    ['Restart Langfuse', 'Restart Ollama backend'],
    ['LLM apps keep tracing keeps moving', 'Chat completions flow again'],
    [
      'Minutes of downtime, not hours of manual firefighting',
      'Typical AlertMend recovery in under a minute',
    ],
  ],
})
