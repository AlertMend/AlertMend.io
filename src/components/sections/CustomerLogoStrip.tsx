import styles from './CustomerLogoStrip.module.css'

const customers: { name: string; logoSrc: string; wordmark?: boolean }[] = [
  { name: 'Decklar', logoSrc: '/logos/decklar-logo.svg' },
  { name: 'WareFlex', logoSrc: '/logos/wareflex-logo.svg' },
  { name: 'Polymer Search', logoSrc: '/logos/polymer-logo.svg' },
  // AIVOS only has a square mark, so it's paired with its name as a wordmark.
  { name: 'AIVOS', logoSrc: '/logos/avios-logo.svg', wordmark: true },
]

export default function CustomerLogoStrip() {
  return (
    <section className={styles.section} aria-label="Companies using AlertMend">
      <div className="container">
        <p className={styles.caption}>Running in production at</p>
        <ul className={styles.list}>
          {customers.map((c) => (
            <li key={c.name} className={styles.item}>
              <img
                src={c.logoSrc}
                alt={c.wordmark ? '' : c.name}
                className={c.wordmark ? `${styles.logoImg} ${styles.logoMark}` : styles.logoImg}
                loading="lazy"
                decoding="async"
              />
              {c.wordmark && <span className={styles.wordmark}>{c.name}</span>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
