const canonicalDomains = Object.freeze({
  com: 'https://zerodevllc.com',
  store: 'https://zerodevllc.store',
});

const surfaces = [
  {
    label: '01 / SIGNAL FUSION',
    title: 'DEFCON',
    description: 'The official EU entry point for a transparent public-signal estimator covering strategic risk and global response-network coverage.',
    status: 'EU GATEWAY / ACCESS REQUIRED',
    href: '/defcon',
    glyph: '⌁',
  },
  {
    label: '02 / THREAT INTELLIGENCE',
    title: 'THREAT OPS',
    description: 'Read-only network telemetry, route watch, source-attributed incidents, and operator context.',
    status: 'LIVE / READ ONLY',
    href: 'https://zeroxshdw.michaelmorangeometri.chatgpt.site',
    glyph: '◉',
  },
];

export default function Home() {
  return (
    <main className="eu-shell">
      <a className="skip-link" href="#surface-heading">Skip to live surfaces</a>
      <div className="eu-grid" aria-hidden="true" />
      <header className="eu-topbar">
        <a className="eu-brand" href={canonicalDomains.com}><span>Z/</span> ZERODEVLLC <b>.EU</b></a>
        <nav aria-label="Primary navigation">
          <a href={canonicalDomains.com}>Corporate</a>
          <a href={canonicalDomains.store}>Store</a>
        </nav>
        <span className="eu-status"><i /> NETWORK INDEX / ONLINE</span>
      </header>

      <section className="eu-hero">
        <div className="eu-hero-copy">
          <p className="eu-kicker">EUROPEAN OPERATIONS INDEX / NODE 01</p>
          <h1>Two live views.<br /><em>One clean signal.</em></h1>
          <p className="eu-intro">The European edge for ZeroDev&apos;s public-signal and threat-intelligence systems. Choose a surface and enter the live feed.</p>
          <div className="eu-rule"><span /> <small>AUTHORIZED PUBLIC SURFACES</small></div>
        </div>
        <div className="eu-index-card" aria-label="Network index status">
          <div className="eu-card-head"><span>INDEX STATUS</span><strong>0xEU</strong></div>
          <div className="eu-radar"><span className="radar-crosshair" /><span className="radar-ping ping-one" /><span className="radar-ping ping-two" /><span className="radar-center">Z</span></div>
          <div className="eu-card-foot"><span>53.3498° N / 6.2603° W</span><span>UTC +01:00</span></div>
        </div>
      </section>

      <section className="eu-surfaces" aria-labelledby="surface-heading">
        <div className="eu-section-head"><p className="eu-kicker">{'// OPEN CHANNELS'}</p><h2 id="surface-heading">Select a live surface</h2><span>02 AVAILABLE</span></div>
        <div className="surface-grid">
          {surfaces.map((surface) => (
            <a className="surface-card" href={surface.href} key={surface.title} aria-label={`Open ${surface.title} live surface`}>
              <div className="surface-meta"><span>{surface.label}</span><span className="surface-status"><i /> {surface.status}</span></div>
              <div className="surface-glyph" aria-hidden="true">{surface.glyph}</div>
              <h3>{surface.title}</h3>
              <p>{surface.description}</p>
              <span className="surface-open">OPEN CHANNEL <b>↗</b></span>
            </a>
          ))}
        </div>
      </section>

      <section className="eu-bottom-band">
        <p><span>&gt;_</span> ZeroDev maintains the index. The source systems remain the authority.</p>
        <a href={canonicalDomains.com}>Return to root index <b>↗</b></a>
      </section>

      <footer className="eu-footer"><span>© 2026 ZERO DEV LLC / IRELAND</span><span>NO SIGNAL WITHOUT SOURCE</span><span><a href={canonicalDomains.com}>.COM</a> / <a href={canonicalDomains.store}>.STORE</a></span></footer>
    </main>
  );
}
