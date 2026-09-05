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
  if (status === 'live') return { chip: 'UPLINK LIVE', signal: 'SIGNAL: LIVE', terminal: 'live / source-linked' };
  if (status === 'degraded') return { chip: 'UPLINK DEGRADED', signal: 'SIGNAL: DEGRADED', terminal: 'degraded / partial sources' };
  if (status === 'unavailable') return { chip: 'UPLINK UNAVAILABLE', signal: 'SIGNAL: UNAVAILABLE', terminal: 'unavailable / retrying' };
  return { chip: 'UPLINK CHECKING', signal: 'SIGNAL: CHECKING', terminal: 'checking / awaiting sources' };
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
  const navigationRef = useRef<HTMLElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const { status } = useHomeStatus();
  const copy = getStatusCopy(status);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;
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
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      window.removeEventListener('keydown', closeOnEscape);
      const previouslyFocused = previouslyFocusedRef.current;
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
    };
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    if (!mobileMenuOpen) {
      previouslyFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    }
    setMobileMenuOpen((open) => !open);
  };

  return (
    <header className="topbar">
      <a className="brand" href="#top" aria-label="ZeroDev LLC home">
        <span className="brand-mark">Z/</span>
        <span>ZERODEVLLC<span className="brand-dim">.COM</span></span>
      </a>
      <nav className={`nav${mobileMenuOpen ? ' is-open' : ''}`} id="primary-navigation" ref={navigationRef} aria-label="Primary navigation">
        {navigation.map((item) => <a href={item.href} key={item.href} onClick={closeMobileMenu}>{item.label}</a>)}
      </nav>
      <button
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
      <a className={`status-chip status-${status}`} href={statusHref} aria-label={`Open the DEFCON Signal Fusion EU gateway. Feed status: ${copy.chip.toLowerCase()}`}>
        <span className="status-dot" aria-hidden="true" /> <span className="status-label">{copy.chip}</span> <span className="status-arrow" aria-hidden="true">↗</span>
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
