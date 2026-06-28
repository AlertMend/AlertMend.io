// Shared, deterministic CSS-module class-name generator.
//
// This MUST be used by BOTH sides of the build or the prerendered HTML will
// not match the compiled stylesheet (the classic flash-of-unstyled-content):
//   1. `vite build`  — via css.modules.generateScopedName in vite.config.ts
//   2. the prerender — via scripts/css-loader.mjs (the Node ESM loader hook)
//
// Vite's *default* scoped name is content-hash based, which the prerender
// loader cannot reproduce. By pinning both sides to this pure function of the
// file's project-relative path + local name, the names are byte-identical:
// stylesheet selector === prerendered class === client (hydration) class.
import path from 'node:path'

// Tiny, stable djb2 hash — same output in the Vite process and the loader.
function hash(str) {
  let h = 5381
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h + str.charCodeAt(i)) >>> 0
  }
  return h.toString(36).slice(0, 5)
}

// `local`    — the authored class name (e.g. "header")
// `filename` — absolute path to the .module.css file
export function scopedName(local, filename) {
  const rel = path
    .relative(process.cwd(), filename)
    .replace(/\\/g, '/')
    .split('?')[0]
  const base = path.basename(rel).replace(/\.module\.css$/, '').replace(/\.css$/, '')
  return `_${base}_${hash(rel)}_${local}`
}
