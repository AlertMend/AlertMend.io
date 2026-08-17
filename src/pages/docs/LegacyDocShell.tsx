import type { ReactNode } from 'react'
import DocsLayout from '../../components/docs/DocsLayout'
import styles from '../../components/docs/DocArticle.module.css'
import legacy from './LegacyDocShell.module.css'

/** Wrap legacy how-to pages in the shared docs chrome. */
export default function LegacyDocShell({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <DocsLayout title={title}>
      <div className={`${styles.article} ${legacy.legacy}`}>{children}</div>
    </DocsLayout>
  )
}
