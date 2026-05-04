/**
 * Defensive normalisation for blog-post markdown.
 *
 * Many of the legacy `.md` source files in `public/blog/` were produced by an
 * upstream content pipeline that left them in a structurally broken state:
 *
 *   - Empty heading lines (`##` with nothing after it).
 *   - Headings that got split from their tail across two lines, e.g.
 *
 *         ## Understanding
 *         : The Fundamentals and Overhead Implications
 *
 *     Should be a single heading: `## Understanding: The Fundamentals and
 *     Overhead Implications`.
 *
 *   - Orphan numbered list markers on a line by themselves, e.g.
 *
 *         1.
 *         **Assess Infrastructure Needs:** ...
 *
 *     Should be: `1. **Assess Infrastructure Needs:** ...`.
 *
 *   - Inline code-fence opens, e.g. `...steps: ` + ` ```yaml` on the same
 *     line as prose, which throws ReactMarkdown's parser off and bleeds
 *     subsequent paragraphs into the code block.
 *
 * Rather than hand-editing every file, we repair these at render time.  The
 * transforms here are intentionally conservative – each one only fires on a
 * very specific, unambiguous pattern that has no plausible legitimate use in
 * normal markdown.
 */
/** Split an inline code-fence open off a prose line, e.g.
 *
 *     "...steps. ```yaml"  →  ["...steps.", "", "```yaml"]
 *
 * If the line doesn't end in an inline fence, returns it unchanged.
 * Returns an array of lines so callers can spread the result.
 */
function splitInlineFence(line: string): string[] {
  if (line.startsWith('```')) return [line]
  const m = line.match(/^(.+?\S)\s*```([A-Za-z0-9_-]*)\s*$/)
  if (!m) return [line]
  return [m[1], '', '```' + (m[2] || '')]
}

export function normalizeBlogMarkdown(content: string): string {
  if (!content) return content

  const lines = content.split('\n')
  const out: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // 1. Drop empty heading lines: `#`, `##`, `###`, etc. with no body.
    if (/^#{1,6}\s*$/.test(line)) {
      continue
    }

    // 2. Heading whose tail was split onto a `:`-prefixed continuation line.
    //    Merge them back into one heading.
    const headingMatch = line.match(/^(#{1,6})\s+(.+\S)\s*$/)
    if (headingMatch && i + 1 < lines.length) {
      const next = lines[i + 1]
      const colonContinuation = next.match(/^:\s*(.+\S)\s*$/)
      if (colonContinuation) {
        out.push(`${headingMatch[1]} ${headingMatch[2]}: ${colonContinuation[1]}`)
        i += 1
        continue
      }
    }

    // 3. Orphan ordered-list marker on its own line followed by real content.
    //    The merged result may itself end in an inline code-fence, so we
    //    immediately run the fence-split rule on the joined line.
    if (/^\s*\d+\.\s*$/.test(line) && i + 1 < lines.length) {
      const next = lines[i + 1]
      const trimmedNext = next.trim()
      const isContent =
        trimmedNext !== '' &&
        !/^#{1,6}\s/.test(trimmedNext) &&
        !trimmedNext.startsWith('```') &&
        !/^[-*+]\s/.test(trimmedNext) &&
        !/^\d+\.\s/.test(trimmedNext)
      if (isContent) {
        const merged = `${line.trim()} ${trimmedNext}`
        out.push(...splitInlineFence(merged))
        i += 1
        continue
      }
    }

    // 4. Inline code-fence open mid-line: split prose from the fence so the
    //    code block parses as its own block.
    out.push(...splitInlineFence(line))
  }

  return out.join('\n')
}
