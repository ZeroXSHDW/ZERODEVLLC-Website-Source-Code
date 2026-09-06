'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import styles from './services/services.module.css';

export type SiteHeaderItem = {
  href: string;
  label: string;
};

export const secondaryNavigation = [
  { href: '/services', label: 'Services' },
  { href: '/engage', label: 'Engage' },
  { href: '/sectors', label: 'Sector fit' },
  { href: '/deliverables', label: 'Deliverables' },
  { href: '/assurance', label: 'Assurance' },
  { href: '/methodology', label: 'Methodology' },
  { href: '/frameworks', label: 'Frameworks' },
  { href: '/remediation', label: 'Remediation' },
  { href: '/privacy', label: 'Privacy' },
] as const;

type SiteHeaderProps = {
  navigation: readonly SiteHeaderItem[];
  current?: string;
  ariaLabel: string;
};

const navigationId = 'site-secondary-navigation';

export default function SiteHeader({ navigation, current, ariaLabel }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigationRef = useRef<HTMLElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const getLinks = () => Array.from(
      navigationRef.current?.querySelectorAll<HTMLElement>('a[href]') ?? [],
    );

    getLinks()[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        setMenuOpen(false);
        requestAnimationFrame(() => toggleRef.current?.focus());
        return;
      }

      if (event.key !== 'Tab') return;
      const links = getLinks();
      if (links.length < 2) return;

      const first = links[0];
      const last = links[links.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  return (
    <header className={styles.header} id="top">
      <Link className={styles.brand} href="/" aria-label="ZeroDev LLC home">
        <span className={styles.brandMark}>Z/</span>
        <span>ZERODEVLLC<span className={styles.brandDim}>.COM</span></span>
      </Link>
      <button
        ref={toggleRef}
        className={styles.headerMenuToggle}
        type="button"
        aria-expanded={menuOpen}
        aria-controls={navigationId}
        aria-label={menuOpen ? 'Close site navigation' : 'Open site navigation'}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
      <nav
        className={`${styles.headerNav}${menuOpen ? ` ${styles.headerNavOpen}` : ''}`}
        id={navigationId}
        ref={navigationRef}
        aria-label={ariaLabel}
      >
        {navigation.map((item) => (
          <Link
            href={item.href}
            key={item.href}
            aria-current={current === item.href ? 'page' : undefined}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
