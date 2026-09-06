import Link from 'next/link';
import styles from './services/services.module.css';

const footerNavigation = [
  { href: '/services', label: 'Security services' },
  { href: '/engage', label: 'Prepare a brief' },
  { href: '/sectors', label: 'Sector fit' },
  { href: '/deliverables', label: 'Deliverables' },
  { href: '/assurance', label: 'Assurance' },
  { href: '/remediation', label: 'Remediation' },
  { href: '/methodology', label: 'Methodology' },
  { href: '/frameworks', label: 'Frameworks' },
  { href: '/privacy', label: 'Privacy boundary' },
] as const;

const externalSurfaces = [
  { href: 'https://zerodevllc.eu', label: 'EU / DEFCON gateway' },
  { href: 'https://zerodevllc.store', label: 'Store / service surface' },
] as const;

export default function SiteFooter() {
  return (
    <footer className={styles.siteFooter}>
      <div className={styles.siteFooterTop}>
        <div>
          <p className={styles.eyebrow}>{'// ZERO DEV / PUBLIC SURFACE'}</p>
          <p className={styles.siteFooterTitle}>Keep the signal<br /><span>clean.</span></p>
          <p className={styles.siteFooterCopy}>Move from a high-level question to bounded evidence, an owned decision, and a reviewable next step. This public surface does not collect accounts, payments, or sensitive records.</p>
        </div>
        <nav className={styles.siteFooterNav} aria-label="Footer navigation">
          {footerNavigation.map((item, index) => (
            <Link href={item.href} key={item.href}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              {item.label}
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </nav>
      </div>
      <section className={styles.siteFooterExternal} aria-labelledby="external-surfaces-heading">
        <div>
          <p className={styles.eyebrow} id="external-surfaces-heading">{'// SEPARATE EXTERNAL SURFACES'}</p>
          <p className={styles.siteFooterExternalCopy}>The `.eu` and `.store` routes are separate public surfaces. This `.com` site does not establish their provider, source, product, payment, or checkout status.</p>
        </div>
        <div className={styles.siteFooterExternalLinks}>
          {externalSurfaces.map((surface) => <a href={surface.href} key={surface.href} target="_blank" rel="noopener noreferrer" aria-label={`${surface.label}; opens in a new tab`}>{surface.label} <span aria-hidden="true">↗</span></a>)}
        </div>
      </section>
      <div className={styles.siteFooterBottom}>
        <span>© 2026 ZERO DEV LLC / IRELAND</span>
        <span>NO USER TELEMETRY / READ-ONLY BY DEFAULT</span>
        <a className={styles.siteFooterTopLink} href="#top">Back to top ↑</a>
        <span><a href="mailto:hello@zerodevllc.com?subject=Private%20security%20report">Private security reporting</a> / <Link href="/privacy">Privacy</Link></span>
      </div>
    </footer>
  );
}
