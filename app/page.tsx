'use client';

import { LiveDefconMap } from './live-defcon-map';

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
    icon: '◉',
    detail: 'Network telemetry / incident context',
  },
  {
    code: '02',
    name: 'DEFCON FUSION',
    description: 'The official EU gateway to a transparent public-signal estimator for strategic risk coverage.',
    href: canonicalDomains.defcon,
    tag: 'EU GATEWAY // SIGNAL',
    icon: '⌁',
    detail: 'Public signals / source-linked evidence',
  },
  {
    code: '03',
    name: 'SOFTWARE / SERVICES',
    description: 'Deployable tools, architecture sprints, and private build support.',
    href: canonicalDomains.store,
    tag: 'STORE // READY',
    icon: '⊞',
    detail: 'Build support / fixed-scope delivery',
  },
];

const principles = [
  {
    number: '01',
    title: 'Source first',
    description: 'Keep the evidence, status, and next action close to the output so important decisions stay inspectable.',
  },
  {
    number: '02',
    title: 'Edge ready',
    description: 'Build browser-native surfaces that are responsive, resilient, and useful where the work actually happens.',
  },
  {
    number: '03',
    title: 'Decision shaped',
    description: 'Every interface should make the next move clearer: inspect, verify, export, or deploy.',
  },
];

export default function Home() {
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
          <a href="#defcon-map">Live map</a>
          <a href="#approach">Approach</a>
          <a href={canonicalDomains.defcon}>DEFCON</a>
          <a href={canonicalDomains.store}>Store</a>
        </nav>
        <a className="status-chip" href={canonicalDomains.defcon} aria-label="Open the DEFCON Signal Fusion EU gateway">
          <span className="status-dot" /> UPLINK READY <span className="status-arrow" aria-hidden="true">↗</span>
        </a>
      </header>

      <div id="top" className="hero-grid">
        <section className="hero-copy" aria-labelledby="hero-heading">
          <p className="eyebrow"><span className="eyebrow-caret">&gt;_</span> NODE 00 / IRELAND / 2026</p>
          <h1 id="hero-heading">
            Signal in.
            <span>Systems out.</span>
          </h1>
          <p className="hero-lede">
            ZeroDev builds the software layer between a sharp idea and a live system — from threat intelligence surfaces to resilient, high-signal interfaces.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href={canonicalDomains.defcon}>
              Explore DEFCON gateway <span aria-hidden="true">↗</span>
            </a>
            <a className="button button-ghost" href="#systems">
              Inspect systems <span aria-hidden="true">↓</span>
            </a>
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
            <p><span className="terminal-ok">[OK]</span> store_checkout <span className="terminal-muted">services / ready</span></p>
            <p className="terminal-spacer"> </p>
            <p><span className="prompt">root@zerodev</span>:~$ <span className="cursor" aria-hidden="true" /></p>
          </div>
          <div className="terminal-footer"><span>BUILD 0x00A7</span><span>NO TELEMETRY LEAVES THIS NODE</span></div>
        </aside>
      </div>

      <section className="signal-ribbon" aria-label="ZeroDev operating summary">
        <div><strong>03</strong><span>registered surfaces</span></div>
        <div><strong>01</strong><span>EU signal gateway</span></div>
        <div><strong>24/7</strong><span>designed for live systems</span></div>
        <div><strong>0</strong><span>claims of official DEFCON status</span></div>
      </section>

      <section className="system-section" id="systems" aria-labelledby="systems-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{'// REGISTERED SURFACES'}</p>
            <h2 id="systems-heading">One network.<br /><span>Three operating modes.</span></h2>
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
              <div className="card-icon" aria-hidden="true">{system.icon}</div>
              <h3>{system.name}</h3>
              <p>{system.description}</p>
              <span className="card-detail">{system.detail}</span>
              <span className="card-link">OPEN SURFACE <span aria-hidden="true">↗</span></span>
            </a>
          ))}
        </div>
      </section>

      <section className="map-section" id="defcon-map" aria-labelledby="defcon-map-heading">
        <div className="map-section-copy">
          <p className="eyebrow">{'// LIVE DEFCON SURFACE'}</p>
          <h2 id="defcon-map-heading">See the signal<br /><span>in motion.</span></h2>
          <p>A first-party 3D view of the DEFCON coordination topology, surfaced here as part of the ZeroDev operating system.</p>
          <a className="text-link" href={canonicalDomains.defcon}>Open protected DEFCON surface <span aria-hidden="true">↗</span></a>
          <small>Current evidence and source-linked readouts remain inside the protected EU gateway.</small>
        </div>
        <LiveDefconMap />
      </section>

      <section className="approach-section" id="approach" aria-labelledby="approach-heading">
        <div className="approach-copy">
          <p className="eyebrow">{'// OPERATING APPROACH'}</p>
          <h2 id="approach-heading">Make the signal<br /><span>worth acting on.</span></h2>
          <p>Useful software is not just a surface. It is a tighter loop between evidence, interpretation, and action.</p>
          <a className="text-link" href="mailto:hello@zerodevllc.com">Start a build conversation <span aria-hidden="true">↗</span></a>
        </div>
        <div className="principles-grid">
          {principles.map((principle) => (
            <article className="principle-card" key={principle.number}>
              <span className="principle-number">{principle.number}</span>
              <h3>{principle.title}</h3>
              <p>{principle.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contact-section" aria-labelledby="contact-heading">
        <div>
          <p className="eyebrow">{'// NEXT MOVE'}</p>
          <h2 id="contact-heading">Build something<br /><span>useful at the edge.</span></h2>
        </div>
        <div className="contact-actions">
          <p>Have a system that needs to become clearer, faster, or more resilient? Bring the problem. We will find the useful shape.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="mailto:hello@zerodevllc.com">Contact ZeroDev <span aria-hidden="true">↗</span></a>
            <a className="button button-ghost" href={canonicalDomains.store}>View software &amp; services <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <span>© 2026 ZERO DEV LLC / IRELAND</span>
        <span className="footer-center">MAKE USEFUL THINGS. KEEP THE SIGNAL CLEAN.</span>
        <span><a href={canonicalDomains.defcon}>DEFCON</a> / <a href={canonicalDomains.eu}>EU HUB</a> / <a href={canonicalDomains.store}>STORE</a></span>
      </footer>
    </main>
  );
}
