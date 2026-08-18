#!/usr/bin/env node
/**
 * Builds the two logo *mask* assets the Brand / DocsLayout / mock components
 * paint with.
 *
 * Why masks instead of inline SVG: the components need the mark to follow
 * `currentColor` (the brand violet scores 1.8:1 on the dark footer and rail,
 * so each surface repaints it). Inlining the art into React bought that
 * `currentColor` behaviour but put the full path data into every prerendered
 * page — 80 KB of the homepage's 124 KB, re-sent uncached on all 785 routes.
 *
 * A CSS `mask-image` pointing at these files gets the same `currentColor`
 * theming from a single asset the browser caches once. The element paints
 * `background-color: currentColor` and the mask cuts the logo out of it.
 *
 * Because the mask keys off the alpha channel, two things matter here:
 *
 *   1. The source's full-bleed `<rect fill="transparent">` background MUST be
 *      dropped. Once fills are normalised to opaque black it would otherwise
 *      become a solid rectangle covering the whole viewBox — the mask would
 *      show a filled block instead of the mark.
 *   2. Every remaining shape is forced opaque, since only alpha is read. The
 *      source's per-path stroke/opacity styling is inert for a mask and is
 *      stripped rather than carried along.
 *
 * viewBox is preserved exactly, so the mask frames identically to the art it
 * replaces and the components' aspect ratios stay correct.
 *
 *   node scripts/build-logo-assets.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const TARGETS = [
  {
    src: 'public/alertmend-full-logo.svg',
    out: 'public/logos/alertmend-lockup-mask.svg',
    label: 'lockup',
  },
  {
    src: 'public/logos/alertmend-logo.svg',
    out: 'public/logos/alertmend-mark-mask.svg',
    label: 'mark',
  },
];

/** Round to 2dp — plenty for art that renders at 14-40px — and trim the
 *  trailing zeros `toFixed` leaves behind. Source coords carry up to 16
 *  significant digits, which is ~59% of the mark's bytes. */
const round = (svg) =>
  svg.replace(/-?\d+\.\d{3,}/g, (m) =>
    String(Number(Number(m).toFixed(2))),
  );

function buildMask(raw) {
  const viewBox = raw.match(/viewBox="([^"]+)"/)?.[1];
  if (!viewBox) throw new Error('source has no viewBox');

  let body = raw;

  // Editor cruft and anything that cannot contribute alpha.
  body = body.replace(/<\?xml[\s\S]*?\?>/g, '');
  body = body.replace(/<!--[\s\S]*?-->/g, '');
  for (const tag of ['metadata', 'defs', 'desc', 'style', 'sodipodi:namedview', 'title']) {
    body = body.replace(new RegExp(`<${tag}[\\s\\S]*?</${tag}>`, 'g'), '');
    body = body.replace(new RegExp(`<${tag}[^>]*/>`, 'g'), '');
  }

  // The full-bleed transparent background rect. See header note 1 — leaving
  // this in produces a solid block once fills are normalised.
  body = body.replace(/<rect[\s\S]*?\/>/g, '');

  // Keep only the drawing instructions. Per-path fill/stroke/opacity/style is
  // inert for an alpha mask; ids and editor namespaces are dead weight.
  const paths = [...body.matchAll(/<path\b[\s\S]*?\/>/g)].map((m) => {
    const d = m[0].match(/\bd="([^"]+)"/)?.[1];
    if (!d) return null;
    const transform = m[0].match(/\btransform="([^"]+)"/)?.[1];
    const rule = m[0].match(/fill-rule:\s*([a-z]+)/)?.[1];
    return (
      `<path d="${d}"` +
      (transform ? ` transform="${transform}"` : '') +
      (rule && rule !== 'nonzero' ? ` fill-rule="${rule}"` : '') +
      '/>'
    );
  }).filter(Boolean);

  if (!paths.length) throw new Error('no paths survived the strip');

  // Group transforms position the paths, so the <g> nesting has to be kept.
  // Re-emit the original tree with only <g transform> and the cleaned paths.
  const groups = [...body.matchAll(/<g\b[^>]*>|<\/g>|<path\b[\s\S]*?\/>/g)];
  let out = '';
  let pathIdx = 0;
  for (const tok of groups) {
    const t = tok[0];
    if (t.startsWith('</g')) out += '</g>';
    else if (t.startsWith('<g')) {
      const transform = t.match(/\btransform="([^"]+)"/)?.[1];
      out += transform ? `<g transform="${transform}">` : '<g>';
    } else {
      out += paths[pathIdx++] ?? '';
    }
  }

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="#000">` +
    out +
    '</svg>';

  return round(svg).replace(/\s+/g, ' ').replace(/> </g, '><').trim() + '\n';
}

let failed = false;
for (const { src, out, label } of TARGETS) {
  try {
    const raw = readFileSync(join(ROOT, src), 'utf8');
    const mask = buildMask(raw);
    writeFileSync(join(ROOT, out), mask);
    const pct = (100 - (100 * mask.length) / raw.length).toFixed(0);
    console.log(
      `✓ ${label.padEnd(7)} ${src} ${raw.length} B → ${out} ${mask.length} B (${pct}% smaller)`,
    );
  } catch (err) {
    failed = true;
    console.error(`✗ ${label}: ${err.message}`);
  }
}
process.exit(failed ? 1 : 0);
