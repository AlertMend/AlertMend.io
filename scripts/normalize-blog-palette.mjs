#!/usr/bin/env node
/**
 * One-shot Tailwind-class palette normalizer for the legacy blog pages.
 *
 * Re-skins `purple-*`, `fuchsia-*`, `blue-*` (link), and `gray-*`
 * (legacy body) Tailwind utilities to the new design-system palette:
 *
 *   purple/fuchsia (chromatic) -> violet (single accent) or zinc (neutral)
 *   blue link colors           -> violet (accent)
 *   gray body text             -> zinc (neutral)
 *
 * Only touches the files listed in TARGETS — does not crawl the repo.
 * Run via `node scripts/normalize-blog-palette.mjs`.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const TARGETS = [
  'src/pages/LegacyBlogPage.tsx',
  // The static HTML generator. Has its own inline <style> block plus an
  // injected Tailwind theme; we rewire both so blog HTML matches the
  // marketing palette.
  'scripts/build-blog-html.js',
];

/**
 * CSS hex literals (case-insensitive). Re-routes the legacy purple
 * shades to the new violet/zinc equivalents.
 *
 * The bulk of the work is done here: when the static blog HTML's
 * embedded Tailwind theme has its `purple.*` palette swapped to violet,
 * every `purple-*` Tailwind utility in the HTML automatically inherits
 * the new accent without rewriting any class.
 */
const HEX_SWAPS = {
  // Purple shades -> Violet equivalents (single-hue accent)
  '#faf5ff': '#fafafa', // purple-50  -> zinc-50  (barely tinted neutral)
  '#f3e8ff': '#ede9fe', // purple-100 -> violet-50
  '#e9d5ff': '#ddd6fe', // purple-200 -> violet-100
  '#d8b4fe': '#c4b5fd', // purple-300 -> violet-200
  '#c084fc': '#a78bfa', // purple-400 -> violet-300
  '#a855f7': '#7c3aed', // purple-500 -> violet-600
  '#9333ea': '#7c3aed', // purple-600 -> violet-600
  '#7e22ce': '#6d28d9', // purple-700 -> violet-700
  '#6b21a8': '#5b21b6', // purple-800 -> violet-800
  '#581c87': '#4c1d95', // purple-900 -> violet-900
  '#3b0764': '#09090b', // purple-950 (text) -> zinc-950 (near-black)
  // Fuchsia and indigo drift back onto the single violet
  '#c026d3': '#7c3aed',
  '#4f46e5': '#7c3aed',
  '#8b5cf6': '#7c3aed',
  '#7c3aed': '#7c3aed', // no-op (kept for clarity)
};

/**
 * Per-class string -> string replacements. The keys must be the literal
 * Tailwind class names found in the source (no glob, no regex), so the
 * map is deterministic and safe to re-run.
 */
const SWAPS = {
  // Text colors
  'text-purple-950': 'text-zinc-950',
  'text-purple-900': 'text-zinc-900',
  'text-purple-800': 'text-violet-700',
  'text-purple-700': 'text-violet-600',
  'text-purple-600': 'text-violet-600',
  'text-purple-500': 'text-violet-500',
  'text-purple-400': 'text-zinc-400',
  'text-purple-300': 'text-zinc-300',
  'text-fuchsia-700': 'text-violet-700',
  'text-fuchsia-600': 'text-violet-600',
  'text-fuchsia-500': 'text-violet-500',
  'text-blue-800': 'text-violet-700',
  'text-blue-700': 'text-violet-700',
  'text-blue-600': 'text-violet-600',
  'text-gray-900': 'text-zinc-900',
  'text-gray-800': 'text-zinc-700',
  'text-gray-700': 'text-zinc-700',
  'text-gray-600': 'text-zinc-500',
  'text-gray-500': 'text-zinc-500',

  // Background colors
  'bg-purple-50': 'bg-zinc-50',
  'bg-purple-100': 'bg-violet-50',
  'bg-purple-200': 'bg-violet-100',
  'bg-purple-900': 'bg-zinc-900',
  'bg-purple-950': 'bg-zinc-950',
  'bg-blue-100': 'bg-violet-50',
  'bg-gray-100': 'bg-zinc-100',
  'bg-gray-200': 'bg-zinc-200',
  'bg-gray-900': 'bg-zinc-950',

  // Border colors
  'border-purple-100': 'border-zinc-200',
  'border-purple-200': 'border-zinc-200',
  'border-purple-300': 'border-zinc-300',
  'border-purple-400': 'border-violet-300',
  'border-gray-200': 'border-zinc-200',
  'border-gray-300': 'border-zinc-300',

  // Focus / ring
  'focus:ring-purple-500': 'focus:ring-violet-500',
  'focus:border-purple-500': 'focus:border-violet-500',

  // Hover text
  'hover:text-purple-900': 'hover:text-violet-700',
  'hover:text-purple-800': 'hover:text-violet-700',
  'hover:text-purple-700': 'hover:text-violet-700',
  'hover:text-fuchsia-600': 'hover:text-violet-700',
  'hover:text-blue-800': 'hover:text-violet-700',
  'hover:bg-purple-100': 'hover:bg-zinc-100',
  'hover:bg-purple-50': 'hover:bg-zinc-50',
};

/**
 * Multi-class gradient swaps (whole gradient utility chains -> solid
 * background). Tailwind gradient classes can appear in any order, so we
 * normalize the whole "from-…-to-…" sequence to a solid near-black.
 */
const GRADIENT_SWAPS = [
  [
    /bg-gradient-to-[a-z]+\s+from-purple-(?:50|100|600|700|800|900|950)\s+to-(?:purple|fuchsia)-(?:50|100|400|500|600|700|800|900|950)/g,
    'bg-zinc-950',
  ],
  [
    /hover:from-purple-(?:50|100|600|700|800|900|950)\s+hover:to-(?:purple|fuchsia)-(?:50|100|400|500|600|700|800|900|950)/g,
    'hover:bg-zinc-900',
  ],
];

let touched = 0;
for (const rel of TARGETS) {
  const abs = join(ROOT, rel);
  let src;
  try {
    src = readFileSync(abs, 'utf8');
  } catch {
    console.warn(`skip (missing): ${rel}`);
    continue;
  }
  const before = src;

  // Class-level swaps. We use a regex with word boundaries on the
  // Tailwind class so we don't accidentally match e.g.
  // `text-purple-900-foo` (no such class, but defensive).
  for (const [from, to] of Object.entries(SWAPS)) {
    const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // (?<![\w-]) and (?![\w-]) act as Tailwind class boundaries.
    const re = new RegExp(`(?<![\\w-])${escaped}(?![\\w-])`, 'g');
    src = src.replace(re, to);
  }

  for (const [re, rep] of GRADIENT_SWAPS) {
    src = src.replace(re, rep);
  }

  // Hex literals (CSS values). Case-insensitive so #A855F7 and #a855f7
  // both match. Walk in sorted order so longer matches win first (not
  // strictly required since hex strings are fixed-width, but safe).
  for (const [from, to] of Object.entries(HEX_SWAPS)) {
    const re = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    src = src.replace(re, to);
  }

  if (src !== before) {
    writeFileSync(abs, src);
    touched += 1;
    console.log(`rewrote: ${rel}`);
  }
}

console.log(`\nDone. Updated ${touched} file(s).`);
