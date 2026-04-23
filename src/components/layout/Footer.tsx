import { Link } from 'react-router-dom';
import Brand from '../ui/Brand';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brandCol}>
            <Brand />
            <p>
              Production operations for Kubernetes &amp; AWS. Connect inventory, observe everything,
              automate the toil. AI-native. Works with your stack.
            </p>
          </div>
          <div className={styles.col}>
            <h5>Platform</h5>
            <ul>
              <li><a href="/#features">Kubernetes monitoring</a></li>
              <li><a href="/#ai">AI RCAs</a></li>
              <li><a href="/#mlops">GPU &amp; MLOps</a></li>
              <li><a href="/#features">On-call &amp; incidents</a></li>
              <li><a href="/#runbooks">Runbooks</a></li>
              <li><a href="/#features">FinOps</a></li>
            </ul>
          </div>
          <div className={styles.col}>
            <h5>Resources</h5>
            <ul>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/case-studies">Case studies</Link></li>
              <li><Link to="/documentation">Documentation</Link></li>
              <li><a href="/#how">How it works</a></li>
              <li><a href="/#integrations">Integrations</a></li>
            </ul>
          </div>
          <div className={styles.col}>
            <h5>Company</h5>
            <ul>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/privacy">Privacy</Link></li>
              <li><Link to="/terms">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className={styles.bottom}>
          <div>© {new Date().getFullYear()} AlertMend AI. All rights reserved.</div>
          <div>Built for engineers who'd rather ship than babysit dashboards.</div>
        </div>
      </div>
    </footer>
  );
}
