import { useEffect, useRef } from 'react';
import Icon from '../ui/Icon';
import styles from './Hero.module.css';

const CALENDLY_URL = 'https://calendly.com/hello-alertmend/30min';
/** Self-serve sign-up entry. Drives the "Start free" CTA so the hero
 *  offers both a high-touch path (Book a demo) and a low-touch path (free
 *  trial), the way Datadog/Linear/Vercel split traffic by intent. */
const SIGNUP_URL = 'https://app.alertmend.io/signup?source=homepage-hero';
const PLAYGROUND_URL = 'https://app.alertmend.io/playground?source=homepage';

/** Detects the user's reduced-motion preference so we can suppress
 *  autoplay for motion-sensitive visitors. They still get the poster
 *  (a still of the resolved RCA modal), which conveys the same end
 *  state the animation lands on anyway. */
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Hero section — copy/CTAs on top, then a pre-recorded video of the
 * "browser-in-a-browser" auto-demo (produced by
 * `scripts/capture-hero.mjs`).
 *
 * Why a video instead of the live React state machine
 * ---------------------------------------------------
 * The previous implementation orchestrated a JS state machine over a
 * dozen setTimeouts to walk a fake cursor from the cluster overview
 * to an incident card, open the RCA modal, stream in evidence, drive
 * the confidence bar, click "Generate PR", swap to a success state,
 * and finally close the modal — all while staying in lockstep with
 * many CSS keyframes. On slower devices, GC pauses, or during the
 * page's own hydration, those timeouts drift and the sequence
 * desyncs (cursor arrives after the press cue, modal pops before the
 * click ring lands, confidence bar lags the conclusion, etc.).
 *
 * Baking the entire cycle into a video file removes every source of
 * variance. The browser just decodes the captured frames at 25fps
 * in the order they were recorded. The shipped assets are well under
 * 1MB each (WebM/MP4), which is significantly cheaper than the React
 * subtree + CSS keyframes + cursor state machine the previous
 * implementation carried.
 *
 * Reduced-motion + offscreen behavior is still respected:
 *   * `prefers-reduced-motion: reduce` → video is paused, the poster
 *     (still of the RCA-resolved modal) carries the same message.
 *   * Section scrolled out of view → video pauses so we don't waste
 *     decode budget compositing offscreen pixels.
 *   * Tab hidden → video pauses (browsers usually do this automatically
 *     for muted videos, but we belt-and-suspenders it).
 */
export default function Hero() {
  /* Ref to the <video> element so the effects below can pause/play
   * it imperatively. Can't drive these via React props because the
   * browser doesn't re-evaluate <video autoPlay> after first mount. */
  const videoRef = useRef<HTMLVideoElement>(null);
  /* Ref to the .mockup wrapper that's observed by IntersectionObserver
   * to gate playback on viewport visibility. We observe the .mockup
   * and not the <video> so the observer survives any internal
   * re-renders (and so the bounding box is more stable). */
  const mockupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const target = mockupRef.current;
    if (!video || !target) return;

    /* Reduced-motion users see only the poster (a still of the fully
     * resolved RCA modal). They still get the same end-state message. */
    if (prefersReducedMotion()) {
      video.pause();
      video.removeAttribute('autoplay');
      return;
    }

    let sectionVisible = true; /* hero is above-the-fold by default */
    let tabVisible =
      typeof document === 'undefined' ? true : !document.hidden;

    const updatePlayback = () => {
      if (sectionVisible && tabVisible) {
        /* video.play() returns a promise that rejects when autoplay
         * is blocked by user settings even on muted videos. Swallow
         * the rejection — the poster covers the gap. */
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };

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
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <section className={styles.hero} id="top">
      <div className="container">
        <h1 className={styles.h1}>
          <span className={styles.row}>
            AI-Powered <span className={styles.accent}>Observability</span>
          </span>
          <br />
          <span className={styles.row}>
            &amp; <span className={styles.accent}>Automation</span>
          </span>
        </h1>
        <div className={styles.tagline}>Your DevOps from day one.</div>
        <p className={styles.sub}>
          One <b style={{ color: 'var(--text)' }}>AIOps platform</b> for every workload in production.
          Triage incidents in <b style={{ color: 'var(--text)' }}>~15 seconds</b>, run remediations
          across pods, VMs and <b style={{ color: 'var(--text)' }}>GPU fleets</b>, and cut your
          Kubernetes, AWS and GPU bill <b style={{ color: 'var(--text)' }}>in half</b>.
        </p>

        <div className={styles.heroCta}>
          {/* Self-serve free path is the headline CTA — it converts at a higher
              rate for product-led growth audiences (engineers landing from search
              or referral) than a calendar booking does. "Book a demo" stays
              alongside as the high-touch alternative for buying committees. */}
          <a
            href={SIGNUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-lg"
          >
            Start free
            <Icon name="arrow" size={16} className="arrow" strokeWidth={2.5} />
          </a>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-lg"
          >
            Book a demo
          </a>
        </div>

        <div className={styles.heroMeta}>
          <span>
            <Icon name="check" size={14} strokeWidth={3} className={styles.check} /> No credit card
          </span>
          <span>·</span>
          <span>
            <Icon name="check" size={14} strokeWidth={3} className={styles.check} /> Bring your own
            model (BYOM) for regulated environments
          </span>
          <span>·</span>
          <span>
            <Icon name="check" size={14} strokeWidth={3} className={styles.check} /> Live in 1 day
          </span>
        </div>

        <div className={styles.tertiaryCta}>
          <a
            href={PLAYGROUND_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.tertiaryLink}
          >
            Or try the live playground
            <Icon name="arrow" size={12} className="arrow" strokeWidth={2.5} />
          </a>
        </div>

        <div className={styles.mockup} ref={mockupRef}>
          {/* "Auto-play demo" badge — a LIVE-style indicator in the
              corner so visitors know up front this is a self-running
              demo, not a static screenshot. The video below cycles
              every 20.4s. */}
          <span className={styles.demoBadge}>
            <span className={styles.demoBadgeDot} aria-hidden="true" />
            Auto-play demo
          </span>
          {/* .browser keeps its existing styling (rounded corners,
              shadow, border) so the video sits inside the fake-browser
              chrome the same way the live demo used to. The <video>
              below is a pre-rendered capture of the cluster overview
              + cursor + RCA modal + Generate PR flow.

              Source files:
                /media/hero.webm    VP9, primary delivery
                /media/hero.mp4     H.264, Safari/iOS fallback
                /media/hero-poster.jpg  RCA-modal-open still

              Regenerate with: npm run capture:hero
              (it runs scripts/capture-hero.mjs against the dev server).

              Rolling back to the live React state machine demo means
              restoring this file from git history; the matching CSS
              keyframes are still in Hero.module.css for that exact
              case. */}
          <div
            className={styles.browser}
            data-capture="hero-demo"
          >
            <video
              ref={videoRef}
              className={styles.video}
              poster="/media/hero-poster.jpg"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-label="AlertMend product walkthrough: cluster overview detects a Kubernetes CrashLoopBackOff incident, the AI agent investigates, identifies an ephemeral-storage misconfiguration, and generates a fix in about 15 seconds."
            >
              <source src="/media/hero.webm" type="video/webm" />
              <source src="/media/hero.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}
