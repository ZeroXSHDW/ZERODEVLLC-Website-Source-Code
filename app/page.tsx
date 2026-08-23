'use client';

import { useState } from 'react';

const canonicalDomains = Object.freeze({
  defcon: 'https://zerodevllc.eu/defcon',
  eu: 'https://zerodevllc.eu',
  store: 'https://zerodevllc.store',
});

const systems = [
  {
    code: '01',
    name: 'THREAT OPS',
    description: 'Read-only telemetry, route watch, and signal-led incident context.',
    href: 'https://zeroxshdw.michaelmorangeometri.chatgpt.site',
    tag: 'LIVE // MONITOR',
  },
  {
    code: '02',
    name: 'DEFCON FUSION',
    description: 'The official EU gateway to a transparent public-signal estimator for strategic risk coverage.',
    href: canonicalDomains.defcon,
    tag: 'EU GATEWAY // SIGNAL',
  },
  {
    code: '03',
    name: 'SOFTWARE / SERVICES',
    description: 'Deployable tools, architecture sprints, and private build support.',
    href: canonicalDomains.store,
    tag: 'STORE // READY',
  },
];

export default function Home() {
  const [uplinked, setUplinked] = useState(false);

  return (
    <main className="com-shell">
      <a className="skip-link" href="#systems">Skip to systems</a>
      <div className="noise" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />

      <header className="topbar">
        <a className="brand" href="#top" aria-label="ZeroDev LLC home">
          <span className="brand-mark">Z/</span>
          <span>ZERODEVLLC<span className="brand-dim">.COM</span></span>
        </a>
        <nav className="nav" aria-label="Primary navigation">
          <a href="#systems">Systems</a>
          <a href={canonicalDomains.defcon}>DEFCON</a>
          <a href="#signal">Signal</a>
          <a href={canonicalDomains.store}>Store</a>
        </nav>
        <span className="status-chip"><span className="status-dot" /> UPLINK READY</span>
      </header>

      <div id="top" className="hero-grid">
        <section className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-caret">&gt;_</span> NODE 00 / IRELAND / 2026</p>
          <h1>
            Build for the edge.
            <span>Operate beyond defaults.</span>
          </h1>
          <p className="hero-lede">
            ZeroDev builds the software layer between a sharp idea and a live system —
            from threat intelligence surfaces to resilient, high-signal interfaces.
          </p>
          <div className="hero-actions">
            <button className="button button-primary" type="button" onClick={() => setUplinked(true)}>
              {uplinked ? 'UPLINK ESTABLISHED' : 'INITIALIZE UPLINK'}
              <span aria-hidden="true">↗</span>
            </button>
            <a className="button button-ghost" href="#systems">Inspect systems <span aria-hidden="true">↓</span></a>
          </div>
          <div className="hero-meta" id="signal">
            <span><i className="signal-bars" aria-hidden="true"><b /><b /><b /><b /></i> SIGNAL: NOMINAL</span>
            <span>LAT 53.3498° N</span>
            <span>LON 6.2603° W</span>
          </div>
        </section>

        <aside className="terminal-card" aria-label="ZeroDev network status">
          <div className="terminal-topline">
            <span className="terminal-lights"><i /><i /><i /></span>
            <span>zerodev://root-index</span>
            <span className="terminal-lock">SECURE</span>
          </div>
          <div className="terminal-body">
            <p><span className="prompt">root@zerodev</span>:~$ ./check --systems</p>
            <p className="terminal-muted">scanning registered surfaces...</p>
            <p><span className="terminal-ok">[OK]</span> threat_ops <span className="terminal-muted">read-only / live</span></p>
            <p><span className="terminal-ok">[OK]</span> defcon_fusion <span className="terminal-muted">EU gateway / protected</span></p>
            <p><span className="terminal-warn">[--]</span> store_checkout <span className="terminal-muted">awaiting keys</span></p>
            <p className="terminal-spacer"> </p>
            <p><span className="prompt">root@zerodev</span>:~$ <span className="cursor" aria-hidden="true" /></p>
          </div>
          <div className="terminal-footer"><span>BUILD 0x00A7</span><span>NO TELEMETRY LEAVES THIS NODE</span></div>
        </aside>
      </div>

      <section className="system-section" id="systems">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{'// REGISTERED SURFACES'}</p>
            <h2>One network.<br /><span>Three operating modes.</span></h2>
          </div>
          <p className="section-note">Select a surface to open the live system. Every interface is built to make the next decision clearer.</p>
        </div>
        <div className="system-grid">
          {systems.map((system) => (
            <a
              className="system-card"
              href={system.href}
              key={system.code}
              aria-label={system.code === '02' ? 'Open the DEFCON Signal Fusion EU gateway' : `Open ${system.name} surface`}
            >
              <div className="card-topline"><span>{system.code} / 03</span><span className="card-tag">{system.tag}</span></div>
              <div className="card-icon" aria-hidden="true">{system.code === '01' ? '◉' : system.code === '02' ? '⌁' : '⊞'}</div>
              <h3>{system.name}</h3>
              <p>{system.description}</p>
              <span className="card-link">OPEN SURFACE <span aria-hidden="true">↗</span></span>
            </a>
          ))}
        </div>
      </section>

      <footer className="footer">
        <span>© 2026 ZERO DEV LLC</span>
        <span className="footer-center">MAKE USEFUL THINGS. KEEP THE SIGNAL CLEAN.</span>
        <span><a href={canonicalDomains.defcon}>DEFCON</a> / <a href={canonicalDomains.eu}>EU HUB</a> / <a href={canonicalDomains.store}>STORE</a></span>
      </footer>
    </main>
  );
}
