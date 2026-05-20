import { useEffect, useRef, useState } from 'react';
import Icon from '../ui/Icon';
import BrandLogo, { simpleIconsUrl, svgPornUrl } from '../ui/BrandLogo';
import styles from './Hero.module.css';

const CALENDLY_URL = 'https://calendly.com/hello-alertmend/30min';
/** Self-serve sign-up entry. Drives the new "Start free" CTA so the hero
 *  offers both a high-touch path (Book a demo) and a low-touch path (free
 *  trial), the way Datadog/Linear/Vercel split traffic by intent. */
const SIGNUP_URL = 'https://app.alertmend.io/signup?source=homepage-hero';
const PLAYGROUND_URL = 'https://app.alertmend.io/playground?source=homepage';

/** Thin icon-rail navigation, modeled on the live AlertMend product
 *  Cluster Overview screen — a vertical strip of icons, no labels, with
 *  the dashboard ("bar") icon active because the surface we're showing is
 *  the cluster dashboard. The brand mark sits at the top, a user avatar at
 *  the bottom. */
type IconName = Parameters<typeof Icon>[0]['name'];
const RAIL_ICONS: { name: IconName; active?: boolean }[] = [
  { name: 'bar', active: true }, // dashboard / cluster overview
  { name: 'activity' },          // health
  { name: 'bolt' },              // incidents
  { name: 'workflow' },          // runbooks
  { name: 'cube' },              // resources
  { name: 'database' },          // logs
  { name: 'dollar' },            // FinOps
  { name: 'compass' },           // explore
  { name: 'message' },           // alerts
  { name: 'shield' },            // policies
];

/** "Restart Storm" insight cards rendered in the middle column.
 *  Numbers / pod names match the actual cluster overview screenshot so the
 *  surface reads as a real screenshot of `prod-us-east-1`, not a
 *  marketing illustration. The first card is the "live" one — its restart
 *  count cycles upward in a loop to make the surface feel alive. */
type Insight = {
  pod: string;
  namespace: string;
  count: number;
  ready: boolean;
  /** When true, this is the card that gets the live ticker + recent-arrival
   *  pulse. Only one card at a time should set this. */
  live?: boolean;
  /** A 4-step ramp the live card animates through (e.g. 47 → 50). Ignored
   *  when `live` is false. */
  liveRamp?: [number, number, number, number];
};

/* The first card is the "click target" — same pod that's referenced in
 * the Active Incidents row on the left and the RCA modal that opens
 * when it's clicked. Keeping the data unified across all three surfaces
 * means visitors read the demo as one coherent story: same pod, same
 * cluster (prod-us-east-1), same restart count, same fired time. */
const INSIGHTS: Insight[] = [
  {
    pod: 'log-ingester-7d9b4f8c5d-x2k7p',
    namespace: 'platform-logging',
    count: 47,
    ready: true,
    live: true,
    liveRamp: [47, 48, 49, 50],
  },
  {
    pod: 'am-dashboard-5486c48f54-nvwmg',
    namespace: 'default',
    count: 2062,
    ready: true,
  },
  {
    pod: 'istio-ingressgateway-675649c455-859m',
    namespace: 'istio-system',
    count: 11,
    ready: false,
  },
];

/** Suggestion prompts in the AI Copilot panel. The two cycle their "active"
 *  emphasis so the panel feels alive without anything actually being
 *  clickable in the marketing surface. */
const COPILOT_SUGGESTIONS = [
  'How many pods are active?',
  'List all healthy Nodes for this cluster.',
];

/** RCA evidence lines streamed in by the AlertMend AI agent inside the
 *  incident-detail modal. Wording mirrors what the live agent posts after
 *  it finishes an investigation — short, declarative, names the specific
 *  signals it inspected. */
const evidence = [
  <>Pulled <b>pod events, logs, metrics</b> from the last 15m</>,
  <>Cross-checked <b>cluster state</b> and <b>recent deploys</b></>,
  <>Matched failure pattern: <code>ephemeral-storage</code> eviction</>,
  <>Drafted fix and validated against <b>3 sibling pods</b></>,
];

/* Auto-demo cycle timings — the hero plays as a self-running screencast:
 * cluster overview loads → cursor glides to Active Incidents → presses →
 * modal opens with full RCA stream → cursor reappears inside modal,
 * glides to Generate PR → presses → PR created banner appears →
 * modal closes → cursor returns to rest → cycle repeats.
 */
const FIRST_DELAY_MS = 2200;          // wait after mount before cursor starts moving
const GLIDE_DURATION_MS = 1300;       // cursor travel time (matches CSS transition)
const PRESS_DURATION_MS = 320;        // press cue lingers before modal opens
const RCA_HOLD_MS = 9500;             // wait inside modal so RCA streams + resolves before PR click
const PR_GLIDE_DURATION_MS = 1100;    // cursor travel from incident to Generate PR
const PR_PRESS_DURATION_MS = 360;     // press on Generate PR before "PR created" appears
const PR_CREATED_HOLD_MS = 2600;      // hold the PR-created success state so it's readable
const RETURN_DELAY_MS = 700;          // gap after modal close before cursor glides home
const PAUSE_BETWEEN_MS = 4500;        // gap before next cycle starts

type CursorPhase =
  | 'idle'         // at rest position over AI Copilot
  | 'gliding'      // moving toward Active Incidents
  | 'pressing'     // at Active Incidents, click ring fires
  | 'hidden'       // invisible (during RCA stream and at end of cycle)
  | 'pr-gliding'   // moving toward Generate PR (inside modal)
  | 'pr-pressing'; // at Generate PR, click ring fires

/** Detects the user's reduced-motion preference at mount time. Reading
 *  this synchronously (not via a useEffect) keeps the very first render
 *  honest — we never spin up the auto-demo timer chain for visitors who
 *  have asked for less motion. */
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function Hero() {
  /** Modal state for the RCA detail view. Visitors can open it manually
   *  by clicking the Active Incidents row, but it also auto-opens on a
   *  loop as a self-running product demo (see `autoCycling` below). ESC
   *  + click-on-backdrop + close button all dismiss. Scroll is only
   *  locked when the modal is opened MANUALLY — locking during the
   *  auto-demo would freeze the page below the hero while the
   *  "screencast" plays, which felt like the site was hanging. */
  const [rcaOpen, setRcaOpen] = useState(false);

  /** Tracks whether the *current* open of the RCA modal was triggered
   *  by a real user click. Only manual opens lock scroll; auto-demo
   *  opens stay scroll-permissive so the visitor can keep moving down
   *  the page even while the screencast plays. */
  const [manuallyOpened, setManuallyOpened] = useState(false);

  /** When true, the hero auto-opens the RCA modal on a loop to play
   *  through the full product demo. Set to false the moment the visitor
   *  takes ANY manual action (manual open, manual close, ESC, backdrop
   *  click), or when the hero scrolls fully off-screen, or when the
   *  tab is hidden. Visitors with reduced-motion preferences never
   *  see the auto-demo at all. */
  const [autoCycling, setAutoCycling] = useState(() => !prefersReducedMotion());

  /** True when the hero mockup is intersecting the viewport. The auto-
   *  demo pauses when the hero is fully out of view so we're not
   *  spinning timers + mounting/unmounting the RCA modal off-screen.
   *  Defaults to `true` so the first cycle starts as soon as the page
   *  loads, before the observer fires its first callback. */
  const [heroVisible, setHeroVisible] = useState(true);

  /** True when the document tab is hidden. Pausing here keeps queued
   *  setTimeouts from piling up in the background and all firing at
   *  once when the visitor returns, which previously caused a
   *  multi-frame jank spike. */
  const [tabVisible, setTabVisible] = useState(() =>
    typeof document === 'undefined' ? true : !document.hidden
  );

  /** Brief "pressed" flag on the Active Incidents button — flips to
   *  true ~300ms before each auto-open so the visitor sees the row
   *  visually depress, then the modal pops up. Without this cue the
   *  modal would just appear out of nowhere and the visitor wouldn't
   *  link "this came from clicking the incident". */
  const [autoPressing, setAutoPressing] = useState(false);

  /** Animated cursor state. See `CursorPhase` for the phases. */
  const [cursorPhase, setCursorPhase] = useState<CursorPhase>('idle');

  /** Cursor pixel position relative to the .mockup container. Updated
   *  via refs whenever the phase changes — this is what makes the
   *  cursor land precisely on the Active Incidents row and the
   *  Generate PR button regardless of viewport size or layout shifts. */
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  /** "PR created" success state. Flips to true the moment the cursor
   *  presses Generate PR; stays true until the modal closes (then
   *  resets so the next cycle starts fresh). */
  const [prCreated, setPrCreated] = useState(false);

  /** Refs for the elements the cursor targets. Positions are read from
   *  these via getBoundingClientRect(), which means cursor placement
   *  is always pixel-accurate — no percentage-based hacks. */
  const mockupRef = useRef<HTMLDivElement>(null);
  const incidentBtnRef = useRef<HTMLButtonElement>(null);
  const generatePrBtnRef = useRef<HTMLButtonElement>(null);

  /** Reposition the cursor whenever its phase changes. For "rest" we
   *  use a percentage of the mockup (upper-right area, over AI Copilot
   *  in the cluster overview). For "incident" and "PR" we measure the
   *  actual button positions, so the cursor lands directly on them
   *  even after layout shifts. */
  useEffect(() => {
    const mockup = mockupRef.current;
    if (!mockup) return;
    const mr = mockup.getBoundingClientRect();

    const aim = (target: HTMLElement | null) => {
      if (!target) return;
      const tr = target.getBoundingClientRect();
      setCursorPos({
        x: tr.left + tr.width / 2 - mr.left,
        y: tr.top + tr.height / 2 - mr.top,
      });
    };

    switch (cursorPhase) {
      case 'idle':
        // Upper-right of the mockup, over the AI Copilot panel — visible
        // over an empty area before the cursor begins moving.
        setCursorPos({ x: mr.width * 0.84, y: mr.height * 0.32 });
        break;
      case 'gliding':
      case 'pressing':
        aim(incidentBtnRef.current);
        break;
      case 'pr-gliding':
      case 'pr-pressing':
        aim(generatePrBtnRef.current);
        break;
      case 'hidden':
        // Don't move — keep the cursor at its last position so when it
        // re-emerges (pr-gliding) it visibly travels from the previous
        // press point rather than teleporting.
        break;
    }
  }, [cursorPhase, rcaOpen]);

  /** Stops the auto-demo. Used by the close button, the backdrop click,
   *  ESC, and manual incident clicks. */
  const stopAutoCycle = () => setAutoCycling(false);

  /** Manual close (user hit ESC / clicked X / clicked backdrop). Disables
   *  the auto-cycle so we don't reopen on top of the user, and hides the
   *  fake cursor so it doesn't suddenly fly across the screen. */
  const handleClose = () => {
    stopAutoCycle();
    setRcaOpen(false);
    setManuallyOpened(false);
    setCursorPhase('hidden');
  };

  /** Manual open from the Active Incidents row. Also disables the
   *  auto-cycle so the modal stays open until the visitor closes it.
   *  Marks the open as `manuallyOpened` so the scroll-lock effect knows
   *  to engage (auto-demo opens deliberately leave scroll unlocked). */
  const handleManualOpen = () => {
    stopAutoCycle();
    setManuallyOpened(true);
    setRcaOpen(true);
    setCursorPhase('hidden');
  };

  // ESC is always honored — even during the auto-demo — so any
  // keyboard user can dismiss the screencast. Listener attaches whenever
  // the modal is open regardless of open-source.
  useEffect(() => {
    if (!rcaOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAutoCycling(false);
        setRcaOpen(false);
        setManuallyOpened(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
    };
  }, [rcaOpen]);

  // Scroll-lock ONLY for manual opens. The auto-demo deliberately
  // leaves scroll free so visitors can keep moving down the page while
  // the screencast plays in the hero. Previously the auto-demo locked
  // scroll on every cycle, which made the page feel like it was
  // hanging every ~23s while the "video" played.
  useEffect(() => {
    if (!rcaOpen || !manuallyOpened) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [rcaOpen, manuallyOpened]);

  // Pause the auto-demo when the hero scrolls fully off-screen. Saves
  // the CPU/GPU cycles we'd otherwise spend mounting & unmounting the
  // RCA modal and animating dozens of CSS keyframes in DOM the visitor
  // can't see, and prevents the chain of setTimeouts from continuing
  // to mutate React state for a section that's no longer in view.
  useEffect(() => {
    const target = mockupRef.current;
    if (!target || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  // Pause the auto-demo while the tab is in the background. Without
  // this, setTimeout chains keep firing on hidden tabs (or pile up
  // throttled), then snap forward when the visitor returns and produce
  // a multi-frame jank spike on the first paint.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const onVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  // Full auto-cycle: cursor glides → presses incident → modal opens →
  // RCA streams → cursor reappears, glides to Generate PR → presses →
  // PR-created banner shows → modal closes → cursor returns → repeat.
  // Runs only while ALL of these hold:
  //   * the visitor hasn't taken manual action (autoCycling)
  //   * the hero is currently in the viewport (heroVisible)
  //   * the tab is in the foreground (tabVisible)
  // Any flip resets the timer chain, so we always start the cycle from
  // a clean state instead of resuming mid-cycle in a stale phase.
  useEffect(() => {
    if (!autoCycling || !heroVisible || !tabVisible) return;

    /** All scheduled timeouts in this cycle. Tracked so we can cancel
     *  every one when the user takes manual action mid-cycle. */
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => {
      timers.push(setTimeout(fn, ms));
    };

    const cycle = (delay: number) => {
      // Cumulative timeline (relative to start of this cycle).
      const tGlideStart = delay;
      const tPress = tGlideStart + GLIDE_DURATION_MS;
      const tModalOpen = tPress + PRESS_DURATION_MS;
      const tPrGlideStart = tModalOpen + RCA_HOLD_MS;
      const tPrPress = tPrGlideStart + PR_GLIDE_DURATION_MS;
      const tPrCreatedHold = tPrPress + PR_PRESS_DURATION_MS;
      const tCursorHide = tPrCreatedHold + PR_CREATED_HOLD_MS;
      const tModalClose = tCursorHide + 320;
      const tCursorHome = tModalClose + RETURN_DELAY_MS;
      const tNextCycle = tCursorHome + PAUSE_BETWEEN_MS;

      // 1. Cursor begins gliding to the Active Incidents row.
      at(tGlideStart, () => setCursorPhase('gliding'));

      // 2. Cursor arrives at incident, presses (button gets the
      //    autoPressing visual treatment too).
      at(tPress, () => {
        setCursorPhase('pressing');
        setAutoPressing(true);
      });

      // 3. Modal opens; cursor hides so it doesn't sit on top of
      //    the modal that's about to open. PR-created state reset
      //    so the next cycle starts fresh.
      at(tModalOpen, () => {
        setAutoPressing(false);
        setCursorPhase('hidden');
        setRcaOpen(true);
        setPrCreated(false);
      });

      // 4. RCA has streamed + reached the resolved state. Cursor
      //    materialises and glides to the Generate PR button (inside
      //    the modal). The cursor's previous position was at the
      //    incident row, so this reads as the cursor traveling
      //    diagonally across the modal — natural screencast feel.
      at(tPrGlideStart, () => setCursorPhase('pr-gliding'));

      // 5. Cursor at Generate PR, press + flip the button to its
      //    "PR created" success state.
      at(tPrPress, () => {
        setCursorPhase('pr-pressing');
        setPrCreated(true);
      });

      // 6. Hide the cursor so the success state can be read cleanly.
      at(tCursorHide, () => setCursorPhase('hidden'));

      // 7. Modal closes.
      at(tModalClose, () => setRcaOpen(false));

      // 8. Cursor glides back to rest position over the cluster
      //    overview, ready for the next cycle.
      at(tCursorHome, () => setCursorPhase('idle'));

      // 9. Schedule next cycle.
      at(tNextCycle, () => cycle(0));
    };

    cycle(FIRST_DELAY_MS);

    return () => {
      timers.forEach(clearTimeout);
      // Reset any in-flight visuals so we don't leave the surface
      // stuck mid-frame (e.g. a half-opened modal or a "pressing"
      // button glow) when the cycle pauses for visibility/tab
      // reasons. Manual-cycle resets are handled separately by the
      // close/open handlers.
      setAutoPressing(false);
      // An auto-opened modal that hasn't been claimed manually should
      // close itself when the cycle pauses; otherwise it would sit
      // open indefinitely off-screen or in a hidden tab.
      setRcaOpen((prev) => (prev && !manuallyOpened ? false : prev));
    };
  }, [autoCycling, heroVisible, tabVisible, manuallyOpened]);

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

        {/* Tertiary text link for users who want to poke at the product without
            signing up — kept small so it doesn't compete with the two main CTAs. */}
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
          {/* "Auto-play demo" badge in the corner of the mockup, like a
              LIVE indicator on TV — tells the visitor up front that this
              is a self-running demo, not a static screenshot. */}
          <span className={styles.demoBadge}>
            <span className={styles.demoBadgeDot} aria-hidden="true" />
            Auto-play demo
          </span>
          <div className={styles.browser}>
            {/* ---- Browser chrome (Mac-style, full URL, tab strip) ---- */}
            <div className={styles.browserBar}>
              <div className={styles.dots}>
                <span /><span /><span />
              </div>
              <div className={styles.chromeBtns} aria-hidden="true">
                <span className={styles.chromeBtn}>‹</span>
                <span className={styles.chromeBtn}>›</span>
                <span className={styles.chromeBtn}>↻</span>
              </div>
              <div className={styles.url}>
                <span className={styles.urlLock} aria-hidden="true">
                  <Icon name="shield" size={11} strokeWidth={2.4} />
                </span>
                <span className={styles.urlHost}>app.alertmend.io</span>
                <span className={styles.urlPath}>/clusters/prod-us-east-1</span>
              </div>
              <div className={styles.chromeTrailing} aria-hidden="true">
                <span className={styles.chromeTrailingBtn}>
                  <Icon name="plus" size={11} strokeWidth={2.4} />
                </span>
              </div>
            </div>
            <div className={styles.tabStrip} aria-hidden="true">
              <div className={styles.activeTab}>
                <img
                  src="/logos/alertmend-logo.png"
                  alt=""
                  className={styles.tabIco}
                  loading="lazy"
                  decoding="async"
                />
                <span className={styles.tabTitle}>Cluster overview · prod-us-east-1</span>
                <span className={styles.tabClose}>
                  <Icon name="x" size={9} strokeWidth={2.4} />
                </span>
              </div>
              <div className={styles.tabPlus}>
                <Icon name="plus" size={11} strokeWidth={2.2} />
              </div>
            </div>

            {/* ---- App shell: thin icon rail + cluster overview workspace ---- */}
            <div className={styles.appShell}>
              <aside className={styles.iconRail} aria-label="AlertMend navigation">
                <span className={styles.brandMark}>
                  <img
                    src="/logos/alertmend-logo.png"
                    alt="AlertMend"
                    className={styles.brandMarkImg}
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <ul className={styles.railList}>
                  {RAIL_ICONS.map((r, i) => (
                    <li
                      key={i}
                      className={`${styles.railItem} ${r.active ? styles.railItemActive : ''}`}
                      aria-hidden="true"
                    >
                      <Icon name={r.name} size={14} strokeWidth={2.2} />
                    </li>
                  ))}
                </ul>
                <span className={styles.railUser} aria-hidden="true">A</span>
              </aside>

              <main className={styles.appMain}>
                {/* ---- Tab bar + cluster filters ---- */}
                <div className={styles.appBar}>
                  <div className={styles.appBarLeft}>
                    <span className={`${styles.subTab} ${styles.subTabActive}`}>
                      <Icon name="check" size={12} strokeWidth={2.6} />
                      Overview
                    </span>
                    <span className={styles.subTab}>
                      <Icon name="message" size={12} strokeWidth={2.4} />
                      Details
                    </span>
                  </div>
                  <div className={styles.appBarRight}>
                    <div className={styles.filter}>
                      <span className={styles.filterLabel}>Duration</span>
                      <span className={styles.filterValue}>
                        Last 24 hours
                        <span className={styles.filterChev} aria-hidden="true">▾</span>
                      </span>
                    </div>
                    <div className={styles.filter}>
                      <span className={styles.filterLabel}>Kubernetes Cluster</span>
                      <span className={styles.filterValue}>
                        prod-us-east-1
                        <span className={styles.filterChev} aria-hidden="true">▾</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* ---- Status banner (live: red pulse + ticking timestamp) ---- */}
                <div className={styles.statusBanner}>
                  <span className={styles.statusBannerLeft}>
                    <span className={styles.statusBannerDot} aria-hidden="true" />
                    <span>
                      <b>4 Agent(s)</b> Detected as Unhealthy
                    </span>
                  </span>
                  <span className={styles.statusUpdated}>
                    Last updated{' '}
                    {/* Stopwatch-style ticker: 0:02 → 0:05 → 0:08 → 0:11.
                        Same width per tick (4 chars) so the surrounding
                        layout stays rock-steady as the value rotates. */}
                    <span className={styles.tickerWrap}>
                      <span className={`${styles.tick} ${styles.tick1}`}>0:02</span>
                      <span className={`${styles.tick} ${styles.tick2}`}>0:05</span>
                      <span className={`${styles.tick} ${styles.tick3}`}>0:08</span>
                      <span className={`${styles.tick} ${styles.tick4}`}>0:11</span>
                    </span>{' '}
                    ago · IST
                    <span className={styles.statusUpdatedDot} aria-hidden="true" />
                  </span>
                </div>

                {/* ---- 3-column body ---- */}
                <div className={styles.body}>
                  {/* Left column: Active Incidents + Deployments */}
                  <div className={styles.col}>
                    <article className={styles.miniCard}>
                      <header className={styles.miniHead}>
                        <span className={styles.miniHeadLeft}>
                          <Icon name="bolt" size={12} strokeWidth={2.4} />
                          Active Incidents
                        </span>
                        <span className={`${styles.miniHeadCount} ${styles.miniHeadAlert}`}>
                          1/1
                        </span>
                      </header>
                      <div className={styles.miniBody}>
                        {/* Clickable row — opens the RCA modal. Looks and
                            feels like a real product list item, with a
                            small "View RCA →" affordance. */}
                        <button
                          ref={incidentBtnRef}
                          type="button"
                          className={[
                            styles.activeIncident,
                            autoCycling ? styles.activeIncidentAuto : '',
                            autoPressing ? styles.activeIncidentPressing : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          onClick={handleManualOpen}
                          aria-haspopup="dialog"
                          aria-expanded={rcaOpen}
                        >
                          <span className={styles.activeIncidentTop}>
                            <span className={styles.activeIncidentDot} aria-hidden="true" />
                            <span className={styles.activeIncidentName}>log-ingester</span>
                            <span className={styles.activeIncidentSev}>P1</span>
                          </span>
                          <span className={styles.activeIncidentMeta}>
                            <span className={styles.activeIncidentExit}>Exit 137</span>
                            <span className={styles.activeIncidentState}>
                              CrashLoopBackOff · 50 restarts
                            </span>
                          </span>
                          <span className={styles.activeIncidentFoot}>
                            <span className={styles.activeIncidentTime}>47m ago</span>
                            <span className={styles.activeIncidentRca}>
                              View RCA
                              <Icon name="arrow" size={10} strokeWidth={2.6} />
                            </span>
                          </span>
                        </button>
                      </div>
                    </article>

                    <article className={styles.miniCard}>
                      <header className={styles.miniHead}>
                        <span className={styles.miniHeadLeft}>
                          <Icon name="rotate" size={12} strokeWidth={2.4} />
                          Deployments
                        </span>
                        <span className={`${styles.miniHeadCount} ${styles.miniHeadOk}`}>1/1 ok</span>
                      </header>
                      <div className={styles.miniBody}>
                        <div className={styles.deployItem}>
                          <span className={styles.deployName}>azure-ip-masq-ag…</span>
                          <span className={styles.deployVer}>
                            v0.1.13-2 → v0.1.13-…
                          </span>
                          <span className={styles.deployRow}>
                            <span className={styles.deploySuccess}>SUCCESS</span>
                            <span className={styles.deployTime}>1h 30m ago</span>
                          </span>
                        </div>
                      </div>
                    </article>
                  </div>

                  {/* Middle column: Cluster Insights */}
                  <div className={`${styles.col} ${styles.colWide}`}>
                    <article className={styles.insightsCard}>
                      <header className={styles.insightsHead}>
                        <span className={styles.insightsTitle}>
                          <span className={styles.insightsIco}>
                            <Icon name="bolt" size={11} strokeWidth={2.6} />
                          </span>
                          Cluster Insights
                        </span>
                        <span className={styles.insightsLive}>
                          <span className={styles.insightsLiveDot} aria-hidden="true" />
                          Live
                        </span>
                      </header>
                      <ul className={styles.insightsList}>
                        {INSIGHTS.map((ins, i) => (
                          <li
                            key={ins.pod}
                            className={`${styles.insight} ${i === 0 ? styles.insightFresh : ''}`}
                          >
                            <div className={styles.insightHead}>
                              <span className={styles.insightBadge}>
                                <span className={styles.insightBadgeIco}>!</span>
                                RESTART STORM
                              </span>
                              <span className={styles.insightCount}>
                                {ins.live && ins.liveRamp ? (
                                  <span className={styles.tickerWrap}>
                                    <span className={`${styles.tick} ${styles.tick1}`}>{ins.liveRamp[0]}</span>
                                    <span className={`${styles.tick} ${styles.tick2}`}>{ins.liveRamp[1]}</span>
                                    <span className={`${styles.tick} ${styles.tick3}`}>{ins.liveRamp[2]}</span>
                                    <span className={`${styles.tick} ${styles.tick4}`}>{ins.liveRamp[3]}</span>
                                  </span>
                                ) : (
                                  ins.count.toLocaleString()
                                )}{' '}
                                restarts
                              </span>
                            </div>
                            <div className={styles.insightTitle}>
                              <span className={styles.insightTitleName}>{ins.pod}</span>
                              <span className={styles.insightTitleSep}>:</span>
                              <span className={styles.insightTitleCount}>
                                {ins.count.toLocaleString()} restarts
                              </span>
                            </div>
                            <p className={styles.insightDesc}>
                              Pod <code>{ins.namespace}/{ins.pod}</code> has restarted {ins.count.toLocaleString()} times.{' '}
                              Status: Running ({ins.ready ? 'Ready' : 'Not Ready'}).
                            </p>
                            <div className={styles.insightMeta}>
                              Resource: Pod / {ins.pod}
                            </div>
                            <div className={styles.insightFoot}>
                              <code className={styles.insightCode}>{ins.namespace}/{ins.pod}</code>
                              <span className={styles.insightRcaLink}>
                                View RCA
                                <Icon name="arrow" size={10} strokeWidth={2.6} />
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </article>
                  </div>

                  {/* Right column: AI Copilot */}
                  <div className={styles.col}>
                    <article className={styles.copilotCard}>
                      <header className={styles.copilotHead}>
                        <span className={styles.copilotIco}>
                          <img
                            src="/logos/alertmend-logo.png"
                            alt=""
                            className={styles.copilotIcoImg}
                            loading="lazy"
                            decoding="async"
                          />
                        </span>
                        AI Copilot
                      </header>
                      <div className={styles.copilotIntro}>
                        <span className={styles.copilotIntroAv}>
                          <Icon name="plus" size={9} strokeWidth={3} />
                        </span>
                        <span className={styles.copilotIntroText}>
                          I'm your cluster copilot. Ask about{' '}
                          <b>incidents</b>, <b>cost throttling</b>, or <b>how to fix</b> any issue.
                        </span>
                      </div>
                      <div className={styles.copilotSugs}>
                        {COPILOT_SUGGESTIONS.map((s, i) => (
                          <span
                            key={s}
                            className={`${styles.sug} ${i === 0 ? styles.sugA : styles.sugB}`}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                      <div className={styles.copilotInput}>
                        <span className={styles.copilotInputText}>Ask about your cluster…</span>
                        <span className={styles.copilotInputBtn} aria-hidden="true">
                          <Icon name="arrow" size={12} strokeWidth={2.6} />
                        </span>
                      </div>
                    </article>
                  </div>
                </div>
              </main>
            </div>
          </div>

          {/* Animated screencast cursor — position is set from
              `cursorPos` (computed from refs) so the cursor lands
              precisely on the Active Incidents row and the Generate PR
              button regardless of viewport size. CSS transitions
              animate the move; the inner `<svg>` handles scale + the
              click ripple based on phase. */}
          <span
            className={[
              styles.demoCursor,
              // CSS class lookup uses underscores so the key is plain ASCII —
              // safer across CSS-Modules configs than hyphens in keys.
              styles[`demoCursor_${cursorPhase.replace(/-/g, '_')}`],
            ].join(' ')}
            style={{
              transform: `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0)`,
            }}
            aria-hidden="true"
          >
            <span className={styles.demoCursorInner}>
              <svg width="22" height="22" viewBox="0 0 24 24">
                <path
                  d="M5.5 3 L5.5 18.4 L9.2 14.7 L11.7 20.7 L13.9 19.7 L11.4 14 L16.5 14 Z"
                  fill="#0f172a"
                  stroke="#ffffff"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </span>

          {/* ======================================================
              RCA detail modal — opens when a visitor clicks the
              Active Incidents row. Renders inside the mockup frame so
              the modal feels like an in-app drilldown rather than a
              page-level dialog. ESC + backdrop click + close button
              all dismiss. The keyframe animations on the steps,
              diff lines, root-cause block, confidence bar, and
              "Resolved in" timer pill restart from t=0 each time the
              modal mounts, so visitors always get the full RCA loop.
              ====================================================== */}
          {rcaOpen && (
            <div
              className={styles.rcaBackdrop}
              role="dialog"
              aria-modal="true"
              aria-label="log-ingester · RCA"
              onClick={handleClose}
            >
              <div
                className={styles.rcaModal}
                onClick={(e) => e.stopPropagation()}
              >
                <header className={styles.rcaModalHead}>
                  <span className={styles.rcaModalCrumb}>
                    <span className={styles.rcaModalCrumbDim}>Incidents</span>
                    <span className={styles.rcaModalCrumbSep}>/</span>
                    <span className={styles.rcaModalCrumbCur}>INC-08472</span>
                  </span>
                  <span className={styles.rcaModalSev}>
                    <span className={styles.rcaModalSevDot} aria-hidden="true" />
                    P1 · CRITICAL
                  </span>
                  <button
                    type="button"
                    className={styles.rcaModalClose}
                    onClick={handleClose}
                    aria-label="Close incident detail"
                  >
                    <Icon name="x" size={14} strokeWidth={2.4} />
                  </button>
                </header>

                <div className={styles.rcaStage}>
                  <div className={styles.rcaCard}>
                    <div className={styles.rcaCardHead}>
                      <span className={styles.rcaCardTitle}>INCIDENT #8472</span>
                      <span className={styles.rcaFiringPill}>
                        <span className={styles.rcaFiringDot} /> Firing
                      </span>
                    </div>
                    <h4 className={styles.rcaIncidentName}>log-ingester</h4>
                    {/* Full pod ID — same one shown in the Cluster Insights
                        list on the overview, so visitors can verify the
                        modal is opening the exact pod they clicked. */}
                    <div className={styles.rcaPodName}>
                      <Icon name="cube" size={10} strokeWidth={2.4} />
                      log-ingester-7d9b4f8c5d-x2k7p
                    </div>
                    <div className={styles.rcaIncidentState}>
                      CrashLoopBackOff · 50 restarts
                    </div>

                    <dl className={styles.rcaMeta}>
                      <dt>Cluster</dt>
                      <dd>
                        <BrandLogo slug="kubernetes" alt="" className={styles.rcaMetaLogo} />
                        <b>prod-us-east-1</b>
                      </dd>
                      <dt>Namespace</dt>
                      <dd>platform-logging</dd>
                      <dt>Repo</dt>
                      <dd>
                        <BrandLogo
                          src={simpleIconsUrl('github', '0f172a')}
                          alt=""
                          className={styles.rcaMetaLogo}
                        />
                        acme/cluster-manifests
                      </dd>
                      <dt>Source</dt>
                      <dd className={styles.rcaMetaSource}>
                        <span className={styles.rcaMetaSrcItem}>
                          <BrandLogo slug="datadog" alt="" className={styles.rcaMetaLogo} />
                          Datadog
                        </span>
                        <span className={styles.rcaMetaSep}>·</span>
                        <span className={styles.rcaMetaSrcItem}>
                          <BrandLogo slug="prometheus" alt="" className={styles.rcaMetaLogo} />
                          Prometheus
                        </span>
                      </dd>
                      <dt>Fired</dt>
                      <dd>47 min ago</dd>
                      <dt>On-call</dt>
                      <dd>@alex (auto-paged)</dd>
                    </dl>

                    <div className={styles.rcaTimeline}>
                      <div className={styles.rcaTimelineLabel}>Recent activity</div>
                      <ul className={styles.rcaTimelineList}>
                        <li>
                          <span className={styles.rcaTlDot} data-kind="warn" />
                          <span className={styles.rcaTlTime}>2m</span>
                          <span className={styles.rcaTlText}>
                            Pod evicted · ephemeral-storage
                          </span>
                        </li>
                        <li>
                          <span className={styles.rcaTlDot} data-kind="warn" />
                          <span className={styles.rcaTlTime}>9m</span>
                          <span className={styles.rcaTlText}>Restart attempt #49</span>
                        </li>
                        <li>
                          <span className={styles.rcaTlDot} data-kind="info" />
                          <span className={styles.rcaTlTime}>47m</span>
                          <span className={styles.rcaTlText}>
                            Deploy <code>v2.31.4</code>
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className={styles.rcaAgent}>
                    <div className={styles.rcaAgentHead}>
                      <span className={styles.rcaAiBadge}>
                        <img
                          src="/logos/alertmend-logo.png"
                          alt="AlertMend"
                          className={styles.rcaAiIco}
                          loading="lazy"
                          decoding="async"
                        />
                        AlertMend AI · RCA
                      </span>
                      <span className={styles.rcaTimer}>
                        <Icon name="check" size={11} strokeWidth={3} />
                        Resolved in 14.2s
                      </span>
                    </div>

                    <ul className={styles.rcaSteps}>
                      {evidence.map((e, i) => (
                        <li key={i} className={styles.rcaStep}>
                          <span className={styles.rcaCheckIco}>
                            <Icon name="check" size={11} strokeWidth={3.5} />
                          </span>
                          <span>{e}</span>
                        </li>
                      ))}
                    </ul>

                    <div className={styles.rcaDiff}>
                      <div className={styles.rcaDiffHead}>
                        <BrandLogo
                          src={simpleIconsUrl('github', '0f172a')}
                          alt=""
                          className={styles.rcaDiffIco}
                        />
                        <span className={styles.rcaDiffPath}>
                          deploy/log-ingester/values.yaml
                        </span>
                        {/* Live diff-stat counter — ticks up as each diff
                            line streams in below. +0 → +1 → +2 → +3 → +4
                            and −0 → −1, synced to the same 14s loop the
                            diff body uses. Each increment "pops" so the
                            badge feels like AlertMend AI is writing the
                            diff in real time. */}
                        <span className={styles.rcaDiffBadge}>
                          <span className={styles.rcaDiffGroup}>
                            <span className={`${styles.rcaDiffTick} ${styles.rcaDiffPlus0}`}>+0</span>
                            <span className={`${styles.rcaDiffTick} ${styles.rcaDiffPlus1}`}>+1</span>
                            <span className={`${styles.rcaDiffTick} ${styles.rcaDiffPlus2}`}>+2</span>
                            <span className={`${styles.rcaDiffTick} ${styles.rcaDiffPlus3}`}>+3</span>
                            <span className={`${styles.rcaDiffTick} ${styles.rcaDiffPlus4}`}>+4</span>
                          </span>
                          <span className={styles.rcaDiffBadgeSep}> </span>
                          <span className={styles.rcaDiffGroup}>
                            <span className={`${styles.rcaDiffTick} ${styles.rcaDiffMinus0}`}>−0</span>
                            <span className={`${styles.rcaDiffTick} ${styles.rcaDiffMinus1}`}>−1</span>
                          </span>
                        </span>
                      </div>
                      <pre className={styles.rcaDiffBody}>
                        <span className={styles.rcaDiffMinus}>- ephemeralStorage: 1Gi</span>
                        <span className={styles.rcaDiffPlus}>+ ephemeralStorage: 4Gi</span>
                        <span className={styles.rcaDiffPlus}>+ logRotation:</span>
                        <span className={styles.rcaDiffPlus}>+   maxSize: 100Mi</span>
                        <span className={styles.rcaDiffPlus}>+   keep: 5</span>
                      </pre>
                    </div>

                    <div className={styles.rcaResult}>
                      <div className={styles.rcaResultLabel}>Root cause</div>
                      <div className={styles.rcaResultText}>
                        Pod exceeded its <code>ephemeral-storage: 1Gi</code> limit due to log
                        buildup. Kubelet evicted the pod, triggering restart loop. Sibling pods
                        on the same node are trending toward the same threshold.
                      </div>
                      <div className={styles.rcaConf}>
                        Confidence
                        <span className={styles.rcaConfBar}>
                          <span />
                        </span>
                        <b>94%</b>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action row — Generate PR / Run runbook / Post to Slack.
                    The Generate PR button morphs into a green "PR created"
                    success state when the auto-demo cursor presses it; in
                    the live product these wire to the AlertMend automation
                    layer (open a real PR, fire a runbook, post to Slack). */}
                <div className={styles.rcaActions}>
                  <button
                    ref={generatePrBtnRef}
                    type="button"
                    className={[
                      styles.rcaActionBtn,
                      prCreated ? styles.rcaActionBtnDone : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    aria-live="polite"
                  >
                    <span
                      className={[
                        styles.rcaActionIco,
                        prCreated ? styles.rcaActionIcoDone : styles.rcaActionIcoGh,
                      ].join(' ')}
                    >
                      {prCreated ? (
                        <Icon name="check" size={11} strokeWidth={3.2} />
                      ) : (
                        <BrandLogo
                          src={simpleIconsUrl('github', '0f172a')}
                          alt=""
                          className={styles.rcaActionLogo}
                        />
                      )}
                    </span>
                    {prCreated ? (
                      <span className={styles.rcaActionDoneLabel}>
                        PR <code className={styles.rcaActionPrNum}>#142</code> created
                      </span>
                    ) : (
                      'Generate PR'
                    )}
                  </button>
                  <button type="button" className={styles.rcaActionBtn}>
                    <span className={`${styles.rcaActionIco} ${styles.rcaActionIcoPlay}`}>
                      <Icon name="play" size={10} strokeWidth={2.8} />
                    </span>
                    Run runbook
                  </button>
                  <button type="button" className={styles.rcaActionBtn}>
                    <span className={`${styles.rcaActionIco} ${styles.rcaActionIcoSlack}`}>
                      <BrandLogo
                        src={svgPornUrl('slack-icon')}
                        domain="slack.com"
                        alt=""
                        className={styles.rcaActionLogo}
                      />
                    </span>
                    Post to Slack
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
