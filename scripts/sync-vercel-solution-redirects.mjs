import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

/**
 * Regenerates the `/solutions/*` redirects in vercel.json from
 * src/data/legacySolutionRedirects.json, which is the single source of truth
 * shared with the React fallback route in src/App.tsx.
 *
 * These lived in two hand-maintained lists that had already drifted:
 * `ai-monitoring-and-observability` was in the React map but missing from
 * vercel.json, so in production a catch-all sent it to `/` and the React map
 * never got a say — Vercel redirects resolve before the SPA loads.
 *
 * There is deliberately no catch-all for unknown `/solutions/*` slugs. A
 * permanent redirect of unrecognised URLs to the homepage is the soft-404
 * pattern; unknown slugs now fall through to the SPA and render NotFoundPage,
 * which is the honest status for a URL that was never a page.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const vercelPath = path.join(root, 'vercel.json')
const mapPath = path.join(root, 'src/data/legacySolutionRedirects.json')

const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'))
const config = JSON.parse(fs.readFileSync(vercelPath, 'utf8'))

const solutionRedirects = Object.entries(map)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([slug, destination]) => ({
    source: `/solutions/${slug}`,
    destination,
    permanent: true,
  }))

// Drop every existing /solutions/* rule, including any stale catch-all.
const others = (config.redirects ?? []).filter(
  (r) => !r.source?.startsWith('/solutions/'),
)

config.redirects = [...solutionRedirects, ...others]

fs.writeFileSync(vercelPath, JSON.stringify(config, null, 2) + '\n')
console.log(
  `✓ vercel.json: ${solutionRedirects.length} legacy /solutions redirect(s), no catch-all`,
)
