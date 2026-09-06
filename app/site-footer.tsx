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
      <div className={styles.siteFooterBottom}>
        <span>© 2026 ZERO DEV LLC / IRELAND</span>
        <span>NO USER TELEMETRY / READ-ONLY BY DEFAULT</span>
        <span><a href="mailto:hello@zerodevllc.com?subject=Private%20security%20report">Private security reporting</a> / <Link href="/privacy">Privacy</Link></span>
      </div>
    </footer>
  );
}
