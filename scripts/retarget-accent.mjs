#!/usr/bin/env node
/**
 * Retargets the single violet accent across the whole repo.
 *
 * The design system standardises on one accent hue. That hue is spelled four
 * different ways in the tree, so changing it by hand means missing some:
 *
 *   1. `#7c3aed` hex literals            (CSS modules, inline tsx, blog HTML)
 *   2. `rgba(124, 58, 237, a)` values    (translucent borders, glows, tints)
 *   3. bare `124, 58, 237` triplets      (replacement targets in the palette
 *                                         normalizer's own tables)
 *   4. `brand.600` in tailwind.config.js (resolves ~123 utility classes)
 *
 * This script rewrites 1-3 and reports 4 so it can be set alongside. Alpha
 * channels and whitespace style are preserved: only the hue moves.
 *
 * Dry run (default):  node scripts/retarget-accent.mjs '#722ddd'
 * Write:              node scripts/retarget-accent.mjs '#722ddd' --apply
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const OLD_HEX = '#7c3aed';
const OLD_RGB = [124, 58, 237];

const [rawHex, ...flags] = process.argv.slice(2);
const APPLY = flags.includes('--apply');

if (!rawHex || !/^#?[0-9a-f]{6}$/i.test(rawHex)) {
  console.error('usage: node scripts/retarget-accent.mjs <#rrggbb> [--apply]');
  process.exit(1);
}
const NEW_HEX = (rawHex.startsWith('#') ? rawHex : `#${rawHex}`).toLowerCase();
const NEW_RGB = [1, 3, 5].map((i) => parseInt(NEW_HEX.slice(i, i + 2), 16));

/* Files we rewrite. Everything else (images, fonts, lockfiles) is skipped. */
const EXTS = new Set(['.css', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.html', '.md', '.svg']);
const SEARCH_DIRS = ['src', 'scripts', 'public'];
const EXTRA_FILES = ['index.html', 'AGENTS.md', 'CLAUDE.md'];
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', '.vite']);
/* This file carries the old value as a search pattern, so it must not be
   rewritten by its own sweep. */
const SKIP_FILES = new Set(['retarget-accent.mjs']);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const abs = join(dir, entry);
    const st = statSync(abs);
    if (st.isDirectory()) walk(abs, out);
    else if (EXTS.has(extname(entry)) && !SKIP_FILES.has(basename(entry))) out.push(abs);
  }
  return out;
}

const files = [
  ...SEARCH_DIRS.flatMap((d) => {
    try {
      return walk(join(ROOT, d));
    } catch {
      return [];
    }
  }),
  ...EXTRA_FILES.map((f) => join(ROOT, f)),
];

const [or, og, ob] = OLD_RGB;
const [nr, ng, nb] = NEW_RGB;

const rewrite = (src) => {
  let out = src;
  let n = 0;
  const sub = (re, rep) => {
    out = out.replace(re, (...args) => {
      n += 1;
      return typeof rep === 'function' ? rep(...args) : rep;
    });
  };

  sub(new RegExp(OLD_HEX, 'gi'), NEW_HEX);
  // rgb()/rgba(), comma or space separated, alpha preserved verbatim.
  sub(
    new RegExp(`(rgba?\\()\\s*${or}\\s*,\\s*${og}\\s*,\\s*${ob}\\s*(,|\\))`, 'g'),
    (_m, open, tail) => `${open}${nr}, ${ng}, ${nb}${tail}`,
  );
  sub(
    new RegExp(`(rgba?\\()\\s*${or}\\s+${og}\\s+${ob}`, 'g'),
    (_m, open) => `${open}${nr} ${ng} ${nb}`,
  );
  // Bare quoted triplet, e.g. the normalizer's own replacement tables.
  sub(
    new RegExp(`(['"\`])${or},\\s*${og},\\s*${ob}\\1`, 'g'),
    (_m, q) => `${q}${nr}, ${ng}, ${nb}${q}`,
  );

  return { out, n };
};

let touched = 0;
let total = 0;
for (const abs of files) {
  let src;
  try {
    src = readFileSync(abs, 'utf8');
  } catch {
    continue;
  }
  const { out, n } = rewrite(src);
  if (!n) continue;
  touched += 1;
  total += n;
  if (APPLY) writeFileSync(abs, out);
  console.log(`${APPLY ? 'rewrote' : 'would rewrite'} ${relative(ROOT, abs)} (${n})`);
}

console.log(
  `\n${APPLY ? 'Updated' : 'Would update'} ${total} occurrence(s) in ${touched} file(s): ${OLD_HEX} -> ${NEW_HEX}`,
);
console.log(
  `\nSet by hand as well:\n` +
    `  tailwind.config.js  brand.600  -> ${NEW_HEX}  (resolves the brand-600 utilities)\n` +
    `  src/styles/global.css  --accent-strong  -> hover/pressed shade of ${NEW_HEX}\n` +
    `  index.html  <meta name="theme-color">  (currently #9333ea, already off-palette)`,
);
if (!APPLY) console.log('\nDry run. Re-run with --apply to write.');
