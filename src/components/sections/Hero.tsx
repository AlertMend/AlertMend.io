import { Play } from 'lucide-react'
import PlatformBoardMock from '../mocks/PlatformBoardMock'
import PlatformBoardStage from '../mocks/PlatformBoardStage'
import styles from './Hero.module.css'

const SIGNUP_URL = 'https://app.alertmend.io/signup?source=homepage-hero'
const PLAYGROUND_URL = 'https://demo.alertmend.io'

export default function Hero() {
  return (
    <section className={styles.hero} id="top">
      <div className="container">
        <h1 className={styles.h1}>
          From signal to <span className={styles.accent}>root cause</span>
          <br />
          to an <span className={styles.accent}>approved fix</span>
        </h1>
        <p className={styles.sub}>
          Metrics, logs, and traces on one timeline. AI RCA with evidence. Remediation gated by
          Slack or Teams approval.
        </p>

        <div className={styles.heroCta}>
          <a
            href={SIGNUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaPrimary}
          >
            Start free
          </a>
          <a
            href={PLAYGROUND_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaSecondary}
          >
            <Play size={13} strokeWidth={2.5} fill="currentColor" />
            Open playground
          </a>
        </div>

        <PlatformBoardStage spaced className={styles.stageHome}>
          <PlatformBoardMock />
        </PlatformBoardStage>
      </div>
    </section>
  )
}
