'use client';

import Link from 'next/link';
import SiteHeader, { secondaryNavigation } from './site-header';
import styles from './services/services.module.css';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ reset }: ErrorProps) {
  return (
    <main className={styles.page}>
      <a className={styles.skipLink} href="#error-content">Skip to recovery status</a>
      <SiteHeader
        ariaLabel="Error recovery navigation"
        navigation={secondaryNavigation}
      />

      <div className={styles.layout} id="error-content" tabIndex={-1}>
        <section className={styles.hero} aria-labelledby="error-heading">
          <div>
            <p className={styles.eyebrow}><span aria-hidden="true">!_</span> 500 / SURFACE DEGRADED</p>
            <h1 id="error-heading">Surface<br /><span>paused.</span></h1>
          </div>
          <div className={styles.heroCopy} role="alert">
            <p>Something prevented this route from rendering. No diagnostic details are exposed on the public recovery surface, including private runtime context.</p>
            <p className={styles.heroBoundary}><strong>Safe recovery.</strong> Retry once, return to a known route, or start with a high-level question. Do not send credentials, tokens, customer records, or incident evidence through ordinary email.</p>
            <div className={styles.recoveryActions}>
              <button className={styles.recoveryButton} type="button" onClick={() => reset()}>Retry route <span aria-hidden="true">↻</span></button>
              <Link className={styles.primaryLink} href="/">Return to the ZeroDev index <span aria-hidden="true">→</span></Link>
              <Link className={styles.primaryLink} href="/engage">Prepare a safe first brief <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
