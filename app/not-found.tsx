import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from './site-header';
import styles from './services/services.module.css';

export const metadata: Metadata = {
  title: 'Route not found // ZeroDev LLC',
  description: 'The requested ZeroDev LLC route could not be found.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className={styles.page}>
      <a className={styles.skipLink} href="#not-found-content">Skip to route status</a>
      <SiteHeader
        ariaLabel="Route recovery navigation"
        navigation={[
          { href: '/services', label: 'Services' },
          { href: '/engage', label: 'Engage' },
          { href: '/methodology', label: 'Methodology' },
          { href: '/privacy', label: 'Privacy' },
        ]}
      />

      <div className={styles.layout} id="not-found-content">
        <section className={styles.hero} aria-labelledby="not-found-heading">
          <div>
            <p className={styles.eyebrow}><span aria-hidden="true">&gt;_</span> 404 / ROUTE NOT FOUND</p>
            <h1 id="not-found-heading">Route not<br /><span>evidence.</span></h1>
          </div>
          <div className={styles.heroCopy}>
            <p>The requested path is not registered on this public surface. Nothing has been inferred from the missing route.</p>
            <p className={styles.heroBoundary}><strong>Safe recovery.</strong> Return to a known route, review the service boundaries, or start with a high-level question.</p>
            <p><Link className={styles.primaryLink} href="/">Return to the ZeroDev index <span aria-hidden="true">↗</span></Link></p>
            <p><Link className={styles.primaryLink} href="/services">Review security and resilience services <span aria-hidden="true">↗</span></Link></p>
            <p><Link className={styles.primaryLink} href="/engage">Prepare a safe first brief <span aria-hidden="true">↗</span></Link></p>
          </div>
        </section>
      </div>
    </main>
  );
}
