import { useParams, Link, useNavigate } from 'react-router-dom';
import Icon from '../components/ui/Icon';
import BrandLogo from '../components/ui/BrandLogo';
import SEO from '../components/SEO';
import {
  findIntegrationBySlug,
  integrations,
  integrationCategories,
  type IntegrationCategory,
} from '../data/integrations';
import styles from './IntegrationDetailPage.module.css';

const CALENDLY_URL = 'https://calendly.com/hello-alertmend/30min';
const SIGNUP_URL = 'https://app.alertmend.io/signup?source=integration-detail';

export default function IntegrationDetailPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const integration = findIntegrationBySlug(slug);

  if (!integration) {
    return (
      <div className={styles.notFound}>
        <SEO
          title="Integration not found"
          description="This integration page doesn't exist."
          noindex={true}
        />
        <h1>Integration not found</h1>
        <p>We don't have a page for <code>/{slug}</code> yet.</p>
        <div className={styles.notFoundCta}>
          <Link to="/#integrations" className="btn btn-primary">
            See all integrations
          </Link>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-ghost"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  // Sibling integrations in the same category — surfaced in the related rail
  // at the bottom so users can browse laterally without bouncing back to the
  // homepage grid every time.
  const related = integrations
    .filter(
      (i) => i.category === integration.category && i.slug !== integration.slug,
    )
    .slice(0, 6);

  return (
    <>
      <SEO
        title={`${integration.name} integration | AlertMend AI`}
        description={`${integration.tagline} ${integration.description.split('. ')[0]}.`}
        canonical={`/integrations/${integration.slug}`}
        keywords={`${integration.name}, AlertMend integration, ${integration.category}, AIOps, observability, automation`}
      />

      <div className={styles.page}>
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className={styles.crumbSep}>/</span>
            <Link to="/#integrations">Integrations</Link>
            <span className={styles.crumbSep}>/</span>
            <span aria-current="page">{integration.name}</span>
          </nav>

          <header className={styles.header}>
            <span className={styles.logoChip}>
              <BrandLogo
                src={integration.logoSrc}
                slug={integration.iconSlug}
                tint={integration.logoTint}
                domain={integration.domain}
                alt={integration.name}
                className={styles.logoImg}
              />
            </span>
            <div className={styles.headerText}>
              <span className={styles.category}>{integration.category}</span>
              <h1 className={styles.h1}>
                AlertMend{' '}
                <span className="hero-h-accent">×</span>{' '}
                {integration.name}
              </h1>
              <p className={styles.tagline}>{integration.tagline}</p>
            </div>
          </header>

          <div className={styles.body}>
            <section className={styles.about}>
              <h2 className={styles.h2}>About this integration</h2>
              <p>{integration.description}</p>
            </section>

            <section className={styles.capabilities}>
              <h2 className={styles.h2}>What this unlocks</h2>
              <ul className={styles.capList}>
                {integration.capabilities.map((cap) => (
                  <li key={cap}>
                    <Icon
                      name="check"
                      size={14}
                      strokeWidth={3}
                      className={styles.capCheck}
                    />
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className={styles.cta}>
              <div>
                <h2 className={styles.h2}>Ship the integration this week</h2>
                <p className={styles.ctaSub}>
                  Most {integration.name} customers are live in a day. Bring your
                  own model for regulated environments — no source data leaves
                  your perimeter.
                </p>
              </div>
              <div className={styles.ctaBtns}>
                <a
                  href={SIGNUP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-lg"
                >
                  Start free
                  <Icon name="arrow" size={14} className="arrow" strokeWidth={2.5} />
                </a>
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost btn-lg"
                >
                  Book a demo
                </a>
                {integration.docsHref && (
                  <Link
                    to={integration.docsHref}
                    className={styles.docsLink}
                  >
                    Read setup docs
                    <Icon name="arrow" size={12} className="arrow" strokeWidth={2.5} />
                  </Link>
                )}
              </div>
            </section>
          </div>

          {related.length > 0 && (
            <section className={styles.related}>
              <h3 className={styles.relatedH}>
                More <span className={styles.relatedCat}>{integration.category}</span> integrations
              </h3>
              <ul className={styles.relatedList}>
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link to={`/integrations/${r.slug}`} className={styles.relatedItem}>
                      <span className={styles.relatedLogoChip}>
                        <BrandLogo
                          src={r.logoSrc}
                          slug={r.iconSlug}
                          tint={r.logoTint}
                          domain={r.domain}
                          alt={r.name}
                          className={styles.relatedLogoImg}
                        />
                      </span>
                      <span className={styles.relatedName}>{r.name}</span>
                      <Icon name="arrow" size={12} className="arrow" strokeWidth={2.5} />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <CategoryRail current={integration.category} />
        </div>
      </div>
    </>
  );
}

/** Footer-style category index — gives the page a clean exit ramp into any
 *  other integration without needing to scroll back to the homepage. */
function CategoryRail({ current }: { current: IntegrationCategory }) {
  return (
    <section className={styles.rail} aria-label="All integration categories">
      <h3 className={styles.relatedH}>Browse by category</h3>
      <div className={styles.railGrid}>
        {integrationCategories.map((cat) => {
          const items = integrations.filter((i) => i.category === cat);
          return (
            <div key={cat} className={styles.railCol}>
              <div className={styles.railColHead}>
                {cat}
                {cat === current && <span className={styles.railHere}>· current</span>}
              </div>
              <ul className={styles.railColList}>
                {items.map((i) => (
                  <li key={i.slug}>
                    <Link to={`/integrations/${i.slug}`}>{i.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
