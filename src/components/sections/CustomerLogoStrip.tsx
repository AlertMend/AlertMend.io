import styles from './CustomerLogoStrip.module.css'

const customers = [
  { name: 'Decklar', logoSrc: '/logos/decklar-logo.svg' },
  { name: 'WareFlex', logoSrc: '/logos/wareflex-logo.svg' },
  { name: 'Polymer Search', logoSrc: '/logos/polymer-logo.svg' },
]

export default function CustomerLogoStrip() {
  return (
    <section className={styles.section} aria-label="Companies using AlertMend">
      <div className="container">
        <ul className={styles.list}>
          {customers.map((c) => (
            <li key={c.name} className={styles.item}>
              <img
                src={c.logoSrc}
                alt={c.name}
                className={styles.logoImg}
                loading="lazy"
                decoding="async"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
