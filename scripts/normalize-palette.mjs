#!/usr/bin/env node
/**
 * One-shot palette normalizer for the marketing pages.
 *
 * Walks the section CSS files (and a few .tsx files with inline color
 * literals) and rewrites every hardcoded purple/indigo/fuchsia/pink
 * literal to the single restrained violet that the new design system
 * standardises on (`#7c3aed`, violet-600). Alpha channels are
 * preserved so existing translucency stays put — only the hue changes.
 *
 * Run via:  node scripts/normalize-palette.mjs
 *
 * This is a non-destructive normalizer: it only touches the listed
 * hue families (purple-700/800/950, fuchsia-600, indigo-500/600,
 * pink-500, and the explicit hex literals). It does NOT touch reds,
 * greens, ambers, zincs, blacks, whites, status colors, or any other
 * non-accent palette.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const TARGETS = [
  'src/components/sections/Hero.module.css',
  'src/components/sections/Pains.module.css',
  'src/components/sections/Features.module.css',
  'src/components/sections/MLOps.module.css',
  'src/components/sections/Services.module.css',
  'src/components/sections/Runbooks.module.css',
  'src/components/sections/HowItWorks.module.css',
  'src/components/sections/AISpotlight.module.css',
  'src/components/sections/Outcomes.module.css',
  'src/components/sections/Integrations.module.css',
  'src/components/sections/CustomerLogoStrip.module.css',
  // Inline color literals in .tsx files (SVG gradient stops etc.)
  'src/components/sections/Features.tsx',
  'src/components/sections/MLOps.tsx',
  'src/components/sections/Runbooks.tsx',
];

// Map of "old RGB triplet" -> "new RGB triplet" for rgba(...) values.
// We preserve the alpha channel ($1 capture).
const RGBA_TRIPLETS = [
  ['126, 34, 206',  '124, 58, 237'], // purple-700  -> violet-600
  ['76, 29, 149',   '109, 40, 217'], // purple-800  -> violet-700
  ['168, 85, 247',  '124, 58, 237'], // purple-500  -> violet-600
  ['192, 38, 211',  '124, 58, 237'], // fuchsia-600 -> violet-600
  ['99, 102, 241',  '124, 58, 237'], // indigo-500  -> violet-600
  ['79, 70, 229',   '109, 40, 217'], // indigo-600  -> violet-700
  ['236, 72, 153',  '124, 58, 237'], // pink-500    -> violet-600
  ['107, 33, 168',  '109, 40, 217'], // purple-800 alt
  ['107, 70, 193',  '124, 58, 237'], // purple-ish
  ['139, 92, 246',  '124, 58, 237'], // violet-500  -> violet-600 (single hue)
];

// Hex literals.
const HEX_MAP = {
  '#7e22ce': '#7c3aed', // purple-700  -> violet-600
  '#6b21a8': '#6d28d9', // purple-800  -> violet-700
  '#3b0764': '#09090b', // purple-950 text -> zinc-950 text
  '#c026d3': '#7c3aed', // fuchsia-600 -> violet-600
  '#4f46e5': '#7c3aed', // indigo-600  -> violet-600
  '#8b5cf6': '#7c3aed', // violet-500  -> violet-600
  '#a855f7': '#7c3aed', // purple-500  -> violet-600
  '#581c87': '#6d28d9', // purple-900  -> violet-700
};

let totalChanges = 0;
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

  for (const [oldT, newT] of RGBA_TRIPLETS) {
    // Match `rgba(<old>, <alpha>)` — alpha can be a float, integer, or
    // percent. We keep whitespace + alpha intact. Also accept the
    // non-spaced form `rgba(168,85,247,X)` used in some inline tsx
    // literals.
    const oldSpaced = oldT.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const oldNoSpace = oldT.replace(/\s+/g, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const newNoSpace = newT.replace(/\s+/g, '');
    src = src.replace(
      new RegExp(`rgba\\(${oldSpaced}\\s*,\\s*([^)]+)\\)`, 'g'),
      `rgba(${newT}, $1)`,
    );
    src = src.replace(
      new RegExp(`rgba\\(${oldNoSpace},([^)]+)\\)`, 'g'),
      `rgba(${newNoSpace},$1)`,
    );
  }
  for (const [hex, rep] of Object.entries(HEX_MAP)) {
    src = src.replaceAll(hex, rep);
    // Also accept upper-case variants.
    src = src.replaceAll(hex.toUpperCase(), rep);
  }

  if (src !== before) {
    writeFileSync(abs, src);
    totalChanges += 1;
    console.log(`rewrote: ${rel}`);
  }
}
console.log(`\nDone. Updated ${totalChanges} file(s).`);
