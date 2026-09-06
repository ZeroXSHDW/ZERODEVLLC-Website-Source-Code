'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { ThreatFeedStatus } from './feed-types';

type NavigationItem = {
  href: string;
  label: string;
};

type HomeStatusContextValue = {
  status: ThreatFeedStatus;
  setStatus: (status: ThreatFeedStatus) => void;
};

const HomeStatusContext = createContext<HomeStatusContextValue | null>(null);

function getStatusCopy(status: ThreatFeedStatus) {
  if (status === 'live') return { chip: 'UPLINK LIVE', short: 'LIVE', signal: 'SIGNAL: LIVE', terminal: 'live / source-linked' };
  if (status === 'degraded') return { chip: 'UPLINK DEGRADED', short: 'DEGRADED', signal: 'SIGNAL: DEGRADED', terminal: 'degraded / partial sources' };
  if (status === 'unavailable') return { chip: 'UPLINK UNAVAILABLE', short: 'NO FEED', signal: 'SIGNAL: UNAVAILABLE', terminal: 'unavailable / retrying' };
  return { chip: 'UPLINK CHECKING', short: 'CHECKING', signal: 'SIGNAL: CHECKING', terminal: 'checking / awaiting sources' };
}

export function HomeStatusProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<ThreatFeedStatus>('connecting');
  return <HomeStatusContext.Provider value={{ status, setStatus }}>{children}</HomeStatusContext.Provider>;
}

export function useHomeStatus() {
  const context = useContext(HomeStatusContext);
  if (!context) throw new Error('useHomeStatus must be used inside HomeStatusProvider');
  return context;
}

export function HomeHeader({ navigation, statusHref }: { navigation: readonly NavigationItem[]; statusHref: string }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#start');
  const headerRef = useRef<HTMLElement | null>(null);
  const navigationRef = useRef<HTMLElement | null>(null);
  const mobileMenuToggleRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const { status } = useHomeStatus();
  const copy = getStatusCopy(status);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    const sectionHrefs = navigation
      .map((item) => item.href)
      .filter((href) => href.startsWith('#'));
    const syncHash = () => {
      if (sectionHrefs.includes(window.location.hash)) setActiveSection(window.location.hash);
    };

    syncHash();
    window.addEventListener('hashchange', syncHash);

    const sectionTargets = navigation
      .map((item) => item.href)
      .filter((href) => sectionHrefs.includes(href))
      .map((href) => document.getElementById(href.slice(1)))
      .filter((target): target is HTMLElement => Boolean(target));

    if (!('IntersectionObserver' in window) || sectionTargets.length === 0) {
      return () => window.removeEventListener('hashchange', syncHash);
    }

    const visibility = new Map<string, number>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        visibility.set(`#${entry.target.id}`, entry.isIntersecting ? entry.intersectionRatio : 0);
      });

      const nextSection = sectionTargets
        .map((target) => ({ id: `#${target.id}`, ratio: visibility.get(`#${target.id}`) ?? 0 }))
        .sort((left, right) => right.ratio - left.ratio)
        .find((section) => section.ratio > 0);

      if (nextSection) setActiveSection(nextSection.id);
    }, { rootMargin: '-92px 0px -55% 0px', threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] });

    sectionTargets.forEach((target) => observer.observe(target));
    return () => {
      observer.disconnect();
      window.removeEventListener('hashchange', syncHash);
    };
  }, [navigation]);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const getLinks = () => Array.from(
      navigationRef.current?.querySelectorAll<HTMLElement>('a[href]') ?? [],
    );
    const firstLink = getLinks()[0];
    firstLink?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        setMobileMenuOpen(false);
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
    const closeOnPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    document.addEventListener('pointerdown', closeOnPointerDown);
    const mobileMenuToggle = mobileMenuToggleRef.current;
    return () => {
      window.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('pointerdown', closeOnPointerDown);
      document.body.style.overflow = previousBodyOverflow;
      const previouslyFocused = previouslyFocusedRef.current;
      if (previouslyFocused?.isConnected) previouslyFocused.focus({ preventScroll: true });
      else mobileMenuToggle?.focus({ preventScroll: true });
      if (!previouslyFocused?.isConnected && !mobileMenuToggle?.isConnected) {
        document.getElementById('top')?.focus({ preventScroll: true });
      }
    };
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    if (!mobileMenuOpen) {
      previouslyFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    }
    setMobileMenuOpen((open) => !open);
  };

  return (
    <header className="topbar" id="top" ref={headerRef} tabIndex={-1}>
      <a className="brand" href="#top" aria-label="ZeroDev LLC home">
        <span className="brand-mark">Z/</span>
        <span>ZERODEVLLC<span className="brand-dim">.COM</span></span>
      </a>
      <nav className={`nav${mobileMenuOpen ? ' is-open' : ''}`} id="primary-navigation" ref={navigationRef} aria-label="Primary navigation">
        {navigation.map((item) => <a href={item.href} key={item.href} aria-current={activeSection === item.href ? 'location' : undefined} onClick={closeMobileMenu}>{item.label}</a>)}
      </nav>
      <button
        ref={mobileMenuToggleRef}
        className="mobile-menu-toggle"
        type="button"
        aria-expanded={mobileMenuOpen}
        aria-controls="primary-navigation"
        aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        onClick={toggleMobileMenu}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
      <a className={`status-chip status-${status}`} href={statusHref} target="_blank" rel="noopener noreferrer" aria-label={`Open the DEFCON Signal Fusion EU gateway; opens in a new tab. Public signal status: ${copy.chip.toLowerCase()}`}>
        <span className="status-dot" aria-hidden="true" /> <span className="status-label">{copy.chip}</span><span className="status-label-short" aria-hidden="true">{copy.short}</span> <span className="status-arrow" aria-hidden="true">↗</span>
      </a>
    </header>
  );
}

export function HomeSignalReadout() {
  const { status } = useHomeStatus();
  const copy = getStatusCopy(status);
  return <span className={`signal-readout signal-${status}`} role="status" aria-live="polite"><i className="signal-bars" aria-hidden="true"><b /><b /><b /><b /></i> {copy.signal}</span>;
}

export function HomeTerminalStatus() {
  const { status } = useHomeStatus();
  const copy = getStatusCopy(status);
  const marker = status === 'live' ? 'OK' : status === 'degraded' || status === 'unavailable' ? '!!' : '..';
  return <p><span className={`terminal-state terminal-state-${status}`}>[{marker}]</span> signal_status <span className="terminal-muted">{copy.terminal}</span></p>;
}
