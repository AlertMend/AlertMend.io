import { Link } from 'react-router-dom'
import { useAudience } from '../../hooks/useAudience'
import { HOME_FAQ } from '../../data/homeFaq'
import styles from './HomeFaq.module.css'

export default function HomeFaq() {
  const { audience } = useAudience()
  const items = HOME_FAQ[audience]

  return (
    <section className={styles.section} id="faq">
      <div className={`container ${styles.layout}`}>
        <div className={styles.side}>
          <span className="sec-tag">Questions</span>
          <h2 className={styles.h2}>What buyers ask us first.</h2>
          <p className={styles.p}>
            Something else? <Link to="/contact">Ask the team</Link> directly.
          </p>
          <p className={styles.p}>
            <Link to={audience === 'data' ? '/pricing#data' : '/pricing'}>
              {audience === 'data' ? 'See data pricing →' : 'See pricing →'}
            </Link>
          </p>
        </div>
        <div className={styles.list} key={audience}>
          {items.map((item, i) => (
            <details key={item.q} className={styles.item} open={i === 0}>
              <summary>
                <span>{item.q}</span>
                <i aria-hidden="true" />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
