import Link from 'next/link';
import SiteHeader, { secondaryNavigation } from './site-header';
import styles from './services/services.module.css';

export default function Loading() {
  return (
    <main className={styles.page} aria-busy="true">
      <a className={styles.skipLink} href="#loading-content">Skip to loading status</a>
      <SiteHeader
        ariaLabel="Loading state navigation"
        navigation={secondaryNavigation}
      />

      <div className={styles.layout} id="loading-content" tabIndex={-1}>
        <section className={styles.hero} aria-labelledby="loading-heading">
          <div>
            <p className={styles.eyebrow}><span aria-hidden="true">&gt;_</span> TRANSITION / LOADING</p>
            <h1 id="loading-heading">Surface<br /><span>syncing.</span></h1>
          </div>
          <div className={styles.heroCopy} role="status" aria-live="polite">
            <p>Preparing the next reviewable route and its evidence boundary.</p>
            <div className={styles.loadingPulse} aria-hidden="true"><span /><span /><span /><span /></div>
            <p className={styles.heroBoundary}><strong>Public boundary.</strong> This transition does not request credentials, payment details, or private incident evidence.</p>
            <p><Link className={styles.primaryLink} href="/">Return to the ZeroDev index <span aria-hidden="true">→</span></Link></p>
          </div>
        </section>
      </div>
    </main>
  );
}
