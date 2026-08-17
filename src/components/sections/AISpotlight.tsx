import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../ui/Icon';
import styles from './AISpotlight.module.css';

const CALENDLY_URL = 'https://calendly.com/hello-alertmend/30min';

/** Detects reduced-motion so we can suppress autoplay. */
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const bullets: { html: React.ReactNode }[] = [
  {
    html: (
      <>
        <b>Evidence-backed RCA</b> — traces, logs, metrics, and changes cited in every report.
      </>
    ),
  },
  {
    html: (
      <>
        <b>Approved fixes</b> — PR suggestions and runbooks with an audit trail.
      </>
    ),
  },
];

type Props = {
  /** Product page mode: CTAs point at demo / remediation, and reveal starts visible. */
  standalone?: boolean;
};

/**
 * AI Spotlight — left copy + right pre-recorded RCA screencast
 * (`/media/aispotlight.{webm,mp4}`).
 */
export default function AISpotlight({ standalone = false }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  /* Always mark reveal nodes visible once mounted so route changes and
     late IntersectionObserver attach can't leave the section at opacity 0. */
  useEffect(() => {
    textRef.current?.classList.add('visible');
    visualRef.current?.classList.add('visible');
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const target = visualRef.current;
    if (!video || !target) return;

    if (prefersReducedMotion()) {
      video.pause();
      video.removeAttribute('autoplay');
      return;
    }

    let sectionVisible = true;
    let tabVisible = typeof document === 'undefined' ? true : !document.hidden;
    let canPlay = video.readyState >= 4;

    const updatePlayback = () => {
      if (sectionVisible && tabVisible && canPlay) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };

    const onCanPlayThrough = () => {
      canPlay = true;
      updatePlayback();
    };
    video.addEventListener('canplaythrough', onCanPlayThrough);
    const startFallback = window.setTimeout(onCanPlayThrough, 4000);

    const onVisibility = () => {
      tabVisible = !document.hidden;
      updatePlayback();
    };

    let io: IntersectionObserver | undefined;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        ([entry]) => {
          sectionVisible = entry.isIntersecting;
          updatePlayback();
        },
        { threshold: 0.1 },
      );
      io.observe(target);
    } else {
      updatePlayback();
    }

    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      io?.disconnect();
      window.clearTimeout(startFallback);
      video.removeEventListener('canplaythrough', onCanPlayThrough);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <section id="ai" className={`${styles.section} zone-dark`}>
      <div className="container">
        <div className={styles.spotlight}>
          <div ref={textRef} className={`${styles.text} reveal visible`}>
            <span className="sec-tag">AI RCA</span>
            <h2 className={styles.h2}>
              From alert to root cause — with evidence.
            </h2>
            <p className={styles.p}>
              AlertMend reads logs, metrics, traces, and Kubernetes events, then explains the
              likely cause with a confidence score and clear next steps.
            </p>
            <ul className={styles.list}>
              {bullets.map((b, i) => (
                <li key={i}>
                  <Icon name="check" size={16} strokeWidth={3} className={styles.checkIco} />
                  <div>{b.html}</div>
                </li>
              ))}
            </ul>
            <div className={styles.cta}>
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                See an RCA on your cluster
                <Icon name="arrow" size={14} className="arrow" strokeWidth={2.5} />
              </a>
              {standalone ? (
                <Link to="/auto-remediation" className="btn btn-ghost">
                  Remediation flows
                </Link>
              ) : (
                <Link to="/ai-rca" className="btn btn-ghost">
                  Learn more
                </Link>
              )}
            </div>
          </div>

          <div
            ref={visualRef}
            className={`${styles.visual} reveal visible`}
            data-capture="aispotlight-visual"
          >
            <video
              ref={videoRef}
              className={styles.video}
              poster="/media/aispotlight-poster.jpg"
              muted
              loop
              playsInline
              preload="auto"
              aria-label="AlertMend RCA screencast: collecting evidence, analyzing patterns, generating a remediation, and surfacing the root cause in about 15 seconds."
            >
              <source src="/media/aispotlight.webm" type="video/webm" />
              <source src="/media/aispotlight.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}
