import { useEffect, useRef } from 'react';
import Icon from '../ui/Icon';
import styles from './AISpotlight.module.css';

/** Detects the user's reduced-motion preference so we can suppress
 *  autoplay for motion-sensitive visitors. They still get the poster
 *  (a still of the fully resolved RCA), which is the same final state
 *  they would have seen at the end of the animation anyway. */
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const bullets: { html: React.ReactNode }[] = [
  {
    html: (
      <>
        <b>Executive summary → Evidence → Conclusion → Remediation</b>. Every report follows the
        same readable contract.
      </>
    ),
  },
  {
    html: (
      <>
        <b>Bring your own model</b>. Point inference at a local or self-hosted model for
        air-gapped, regulated or data-residency-sensitive environments.
      </>
    ),
  },
  {
    html: (
      <>
        <b>Slack-native delivery + cluster-overview View RCA</b>. Works for both alert-driven and
        proactively-detected incidents.
      </>
    ),
  },
  {
    html: (
      <>
        <b>Deep links</b> back into Pod metrics, Pod logs and resource details, so the responder
        jumps from narrative to live evidence.
      </>
    ),
  },
];

/**
 * AI Spotlight — the right-side panel is a pre-recorded video of the
 * RCA screencast (produced by `scripts/capture-aispotlight.mjs`).
 *
 * Why a video instead of live CSS animations
 * ------------------------------------------
 * The previous implementation was 100+ CSS keyframe animations driven
 * by a JS loop that remounted the .rca subtree every 11.5s. On slower
 * devices, background tabs, or when the page is mid-hydration, those
 * animations would desync — the evidence chips would flip green out of
 * order, the conclusion box would arrive before its supporting
 * evidence, the deep-link tags would land before the remediation
 * steps. The timing was emergent, not authored.
 *
 * Baking the animation into a video file removes every source of
 * timing variance: the browser just plays back the frames at 30fps in
 * the order they were captured. No GPU pressure from running dozens
 * of compositor animations, no JS interval driving a React remount,
 * no race between the IntersectionObserver and the
 * `prefers-reduced-motion` check. The on-disk asset is ~1.1MB WebM /
 * ~990KB MP4 — well under the cost of the React+CSS code path it
 * replaces, and orders of magnitude more reliable.
 *
 * Reduced motion + offscreen handling are still respected:
 *   * `prefers-reduced-motion: reduce` → video is paused at frame 0
 *     and the poster (a still of the fully resolved RCA) is shown.
 *   * Section scrolled out of view → video pauses so we don't waste
 *     decode budget compositing offscreen pixels.
 *   * Tab hidden → video pauses (this happens automatically in most
 *     browsers but we belt-and-suspenders it).
 */
export default function AISpotlight() {
  /* Ref to the <video> element so the effects below can pause/play
   * it imperatively. We can't drive these via React props because the
   * browser does not re-evaluate <video autoPlay> after first mount. */
  const videoRef = useRef<HTMLVideoElement>(null);
  /* Ref to the .visual wrapper that's observed by IntersectionObserver
   * to gate playback on viewport visibility. */
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const target = visualRef.current;
    if (!video || !target) return;

    /* Reduced-motion users see only the poster, frozen at frame 0.
     * The poster is a still of the resolved RCA, so they still see
     * the final outcome — they just don't see the build-up. */
    if (prefersReducedMotion()) {
      video.pause();
      video.removeAttribute('autoplay');
      return;
    }

    let sectionVisible = false;
    let tabVisible =
      typeof document === 'undefined' ? true : !document.hidden;

    const updatePlayback = () => {
      if (sectionVisible && tabVisible) {
        /* video.play() returns a promise that rejects if autoplay was
         * blocked (which happens when a user has explicitly disabled
         * autoplay in their browser settings even with muted videos).
         * We swallow the rejection — there is nothing useful we can
         * do, and an uncaught promise rejection would noise up the
         * console. The poster is visible regardless. */
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
      sectionVisible = true;
      updatePlayback();
    }

    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      io?.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <section id="ai" className={`${styles.section} zone-dark`}>
      <div className="container">
        <div className={styles.spotlight}>
          <div className={`${styles.text} reveal`}>
            <span className="sec-tag">Flagship · AI RCA's</span>
            <h2 className={styles.h2}>
              From paged to root cause in <span className="hero-h-accent">15 seconds</span>.
            </h2>
            <p className={styles.p}>
              In about 15 seconds, AlertMend reads live logs and metrics, spots patterns that look
              like failure before your graphs turn red, explains the likely cause{' '}
              <b style={{ color: 'var(--text)' }}>with a confidence score</b>, and posts clear next
              steps in Slack, Teams, or wherever your team already works. Think early warnings, not
              after action reports: a GPU job trending toward a stuck training run while spend keeps
              climbing, disk or quota pressure building before requests fail, or memory use creeping
              toward an out-of-memory kill before your paging rule ever fires.
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
              <a href="#pricing" className="btn btn-primary">
                See an RCA on your cluster
                <Icon name="arrow" size={14} className="arrow" strokeWidth={2.5} />
              </a>
              <a href="#features" className="btn btn-ghost">
                Learn more
              </a>
            </div>
          </div>

          <div
            ref={visualRef}
            className={`${styles.visual} reveal`}
            /* Stable hook used by scripts/capture-aispotlight.mjs when
             * the asset needs to be regenerated. The script restarts
             * the live CSS animation via a feature-flagged code path
             * (see the rollback note below) and captures the result. */
            data-capture="aispotlight-visual"
          >
            {/* The video below is a pre-rendered capture of the live
                CSS animation. Source files:
                  - /media/aispotlight.webm  (VP9, primary, ~1.1MB)
                  - /media/aispotlight.mp4   (H.264, Safari/iOS, ~990KB)
                  - /media/aispotlight-poster.jpg (still of resolved RCA)
                Regenerate with: npm run capture:aispotlight
                (which is just `node scripts/capture-aispotlight.mjs`
                against a locally running dev server).

                If you ever need to roll back to the live CSS-driven
                animation, restore the .rca subtree from git history
                — the CSS keyframes that drive it are still in
                AISpotlight.module.css for that exact case. */}
            <video
              ref={videoRef}
              className={styles.video}
              poster="/media/aispotlight-poster.jpg"
              autoPlay
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
