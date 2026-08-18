import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import SEO from '../SEO'
import DocsLayout from './DocsLayout'
import DocToc, { type TocHeading } from './DocToc'
import type { DocBlock, DocPage } from '../../data/docsPages'
import { DOCS_PAGES } from '../../data/docsPages'
import { DOCS_NAV } from '../../data/docsNav'
import styles from './DocArticle.module.css'

export function getDocBySlug(slug: string): DocPage | undefined {
  return DOCS_PAGES.find((d) => d.slug === slug)
}

export function allGeneratedDocPaths(): string[] {
  return DOCS_PAGES.map((d) => `/documentation/${d.slug}`)
}

function Block({ block }: { block: DocBlock }) {
  switch (block.type) {
    case 'p':
      return <p className={styles.p}>{block.text}</p>
    case 'h2':
      return (
        <h2 id={block.id} className={styles.h2}>
          {block.text}
        </h2>
      )
    case 'h3':
      return (
        <h3 id={block.id} className={styles.h3}>
          {block.text}
        </h3>
      )
    case 'ul':
      return (
        <ul className={styles.ul}>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )
    case 'ol':
      return (
        <ol className={styles.ol}>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      )
    case 'callout':
      return (
        <aside
          className={`${styles.callout} ${
            block.tone === 'warn'
              ? styles.calloutWarn
              : block.tone === 'tip'
                ? styles.calloutTip
                : styles.calloutInfo
          }`}
        >
          <div className={styles.calloutTitle}>{block.title}</div>
          {Array.isArray(block.body) ? (
            <ul className={styles.calloutList}>
              {block.body.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          ) : (
            <p className={styles.calloutBody}>{block.body}</p>
          )}
        </aside>
      )
    case 'code':
      return (
        <pre className={styles.pre}>
          <code>{block.code}</code>
        </pre>
      )
    case 'table':
      return (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                {block.headers.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row.join('|')}>
                  {row.map((cell, i) => (
                    <td key={`${row[0]}-${i}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case 'jsx':
      return <>{block.node}</>
    default:
      return null
  }
}

function DocPager({ slug }: { slug: string }) {
  const flat = DOCS_NAV.flatMap((s) => s.items)
  const idx = flat.findIndex((i) => i.href === `/documentation/${slug}`)
  if (idx < 0) return null
  const prev = flat[idx - 1]
  const next = flat[idx + 1]
  return (
    <nav className={styles.pager} aria-label="Adjacent documentation">
      {prev ? (
        <Link to={prev.href} className={styles.pagerLink}>
          <span className={styles.pagerLabel}>Previous</span>
          <span className={styles.pagerTitle}>{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link to={next.href} className={`${styles.pagerLink} ${styles.pagerNext}`}>
          <span className={styles.pagerLabel}>Next</span>
          <span className={styles.pagerTitle}>{next.title}</span>
        </Link>
      ) : null}
    </nav>
  )
}

function tocFromBlocks(blocks: DocBlock[]): TocHeading[] {
  return blocks.flatMap((block) =>
    (block.type === 'h2' || block.type === 'h3') && block.id
      ? [{ id: block.id, text: block.text, level: block.type === 'h2' ? 2 : 3 } as const]
      : [],
  )
}

export default function DocArticlePage({ slug }: { slug: string }) {
  const doc = getDocBySlug(slug)
  const headings = useMemo(() => tocFromBlocks(doc?.blocks ?? []), [doc])

  if (!doc) {
    return (
      <DocsLayout title="Not found">
        <article className={styles.article}>
          <h1 className={styles.h1}>Page not found</h1>
          <p className={styles.lead}>
            This documentation page does not exist yet.{' '}
            <Link to="/documentation">Back to documentation</Link>
          </p>
        </article>
      </DocsLayout>
    )
  }

  return (
    <DocsLayout title={doc.title}>
      <SEO
        title={`${doc.title} | AlertMend Docs`}
        description={doc.description}
        keywords={doc.keywords}
        canonical={`/documentation/${doc.slug}`}
      />
      <div className={styles.layout}>
        <article className={styles.article}>
          <p className={styles.crumb}>
            <Link to="/documentation">docs</Link>
            <span aria-hidden="true"> / </span>
            <span>{doc.slug}</span>
          </p>
          <h1 className={styles.h1}>{doc.title}</h1>
          <p className={styles.lead}>{doc.lead}</p>
          {doc.blocks.map((block, i) => (
            <Block key={i} block={block} />
          ))}
          <DocPager slug={doc.slug} />
        </article>
        <DocToc headings={headings} />
      </div>
    </DocsLayout>
  )
}
