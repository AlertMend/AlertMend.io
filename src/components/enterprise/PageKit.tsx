import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import styles from './Enterprise.module.css'
import kit from './PageKit.module.css'

/* Shared building blocks for company, support and legal pages, so every
   page on the site uses the same hero, section heads, grids and CTA band. */

type Action = { label: string; href: string; external?: boolean }

export function ActionLink({ action, variant }: { action: Action; variant: 'primary' | 'secondary' | 'text' }) {
  const cls = variant === 'primary' ? styles.btnPrimary : variant === 'secondary' ? styles.btnSecondary : kit.textLink
  const external = action.external ?? /^(https?:|mailto:)/.test(action.href)
  const content = (
    <>
      {action.label}
      {variant === 'text' && <ArrowRight size={15} aria-hidden="true" />}
    </>
  )
  if (external) {
    const isHttp = action.href.startsWith('http')
    return (
      <a href={action.href} className={cls} {...(isHttp ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {content}
      </a>
    )
  }
  return (
    <Link to={action.href} className={cls}>
      {content}
    </Link>
  )
}

export function PageHero({
  eyebrow,
  title,
  lede,
  primary,
  secondary,
  meta,
  children,
}: {
  eyebrow: string
  title: string
  lede?: ReactNode
  primary?: Action
  secondary?: Action
  meta?: ReactNode
  children?: ReactNode
}) {
  return (
    <section className={styles.pageHero}>
      <div className={styles.wrap}>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <h1 className={styles.h1}>{title}</h1>
        {lede && <p className={styles.lede}>{lede}</p>}
        {meta && <p className={kit.meta}>{meta}</p>}
        {(primary || secondary) && (
          <div className={styles.heroCtas}>
            {primary && <ActionLink action={primary} variant="primary" />}
            {secondary && <ActionLink action={secondary} variant="secondary" />}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}

export function Section({
  eyebrow,
  title,
  lede,
  alt,
  id,
  children,
}: {
  eyebrow?: string
  title?: string
  lede?: ReactNode
  alt?: boolean
  id?: string
  children: ReactNode
}) {
  return (
    <section id={id} className={alt ? styles.sectionAlt : styles.section}>
      <div className={styles.wrap}>
        {title && (
          <div className={styles.head}>
            <div>
              {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
              <h2 className={styles.h2}>{title}</h2>
            </div>
            {lede && <p className={styles.lede}>{lede}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}

export type CellItem = {
  icon?: LucideIcon
  title: string
  body?: ReactNode
  tag?: string
  action?: Action
  children?: ReactNode
}

export function CellGrid({ items, cols = 3 }: { items: CellItem[]; cols?: 2 | 3 | 4 }) {
  const grid = cols === 2 ? styles.grid2 : cols === 4 ? styles.grid4 : styles.grid3
  return (
    <div className={grid}>
      {items.map((item) => {
        const Icon = item.icon
        return (
          <div key={item.title} className={styles.cell}>
            {Icon && (
              <span className={styles.icon}>
                <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
              </span>
            )}
            <h3 className={styles.cellTitle}>{item.title}</h3>
            {item.body && <p className={styles.cellBody}>{item.body}</p>}
            {item.children}
            {item.tag && <span className={styles.tag}>{item.tag}</span>}
            {item.action && (
              <div className={kit.cellAction}>
                <ActionLink action={item.action} variant="text" />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export function CtaBand({
  title,
  lede,
  primary,
  secondary,
}: {
  title: string
  lede?: string
  primary: Action
  secondary?: Action
}) {
  return (
    <section className={styles.cta}>
      <div className={`${styles.wrap} ${styles.ctaInner}`}>
        <div>
          <h2 className={styles.h2}>{title}</h2>
          {lede && <p className={styles.lede}>{lede}</p>}
        </div>
        <div className={styles.heroCtas}>
          <ActionLink action={primary} variant="primary" />
          {secondary && <ActionLink action={secondary} variant="secondary" />}
        </div>
      </div>
    </section>
  )
}
