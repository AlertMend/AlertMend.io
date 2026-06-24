import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const assets = path.join(root, 'public/assets/monitor-ollama-using-alertmend')

const langfuse = fs.readFileSync(
  path.join(root, 'public/assets/monitor-langfuse-using-alertmend/langfuse-alertmend-recovery-flow.svg'),
  'utf8'
)
const ollamaB64 = fs.readFileSync(path.join(assets, 'ollama-logo.svg')).toString('base64')

const ollamaHeader = `  <rect x="80" y="72" width="200" height="80" rx="6" fill="#f4f4f5" stroke="#a1a1aa" stroke-width="1.5"/>
  <image href="data:image/svg+xml;base64,${ollamaB64}" x="109" y="82" width="142" height="36" preserveAspectRatio="xMidYMid meet" aria-hidden="true"/>
  <text x="180" y="140" text-anchor="middle" fill="#3f3f46" font-family="system-ui,-apple-system,sans-serif" font-size="11" font-weight="700">Ollama · :11434</text>`

let svg = langfuse
  .replace('Langfuse failure detection', 'Ollama failure detection')
  .replace('How to monitor Langfuse in production', 'How to monitor Ollama in production')
  .replace(
    'Ready check fails, AlertMend alerts Slack, restarts Langfuse, traces flow again',
    'Health check fails, AlertMend alerts Slack, restarts Ollama, inference resumes'
  )
  .replace(
    new RegExp(
      '  <rect x="80" y="72" width="200" height="80" rx="6" fill="#fff3e0" stroke="#f59e0b" stroke-width="1.5"/>[\\s\\S]*?<text x="180" y="140"[^>]*>Langfuse</text>'
    ),
    ollamaHeader
  )
  .replace('Serving trace ingestion', '200 OK on /api/tags')
  .replace('Langfuse database connection lost', 'Ollama OOMKilled exit 137')
  .replace('Database unreachable', 'Pod killed · VRAM limit')
  .replace('Restart Langfuse', 'Restart Ollama pod')
  .replace('LLM apps keep tracing keeps moving', 'Chat and RAG traffic flow again')
  .replace(
    'Minutes of downtime, not hours of manual firefighting',
    'Typical AlertMend recovery in under a minute'
  )

const out = path.join(assets, 'ollama-alertmend-recovery-flow.svg')
fs.writeFileSync(out, svg)
console.log('✓ Wrote', out)
