import type { Metadata } from 'next';
import Link from 'next/link';

const liveSurfaceUrl = 'https://defcon-signal-fusion.michaelmorangeometri.chatgpt.site';

export const metadata: Metadata = {
  title: 'ZeroDev LLC // DEFCON Signal Fusion',
  description:
    'The official European gateway to ZeroDev DEFCON Signal Fusion, a transparent public-signal estimator for strategic risk and network coverage.',
  alternates: {
    canonical: 'https://zerodevllc.eu/defcon',
  },
  openGraph: {
    title: 'ZeroDev LLC // DEFCON Signal Fusion',
    description:
      'The official European gateway to ZeroDev DEFCON Signal Fusion.',
    type: 'website',
    url: 'https://zerodevllc.eu/defcon',
  },
  twitter: {
    card: 'summary',
    title: 'ZeroDev LLC // DEFCON Signal Fusion',
    description:
      'The official European gateway to ZeroDev DEFCON Signal Fusion.',
  },
};

const channelFeatures = [
  {
    eyebrow: '01 / LIVE INPUTS',
    title: 'Public signal fusion',
    description:
      'A multi-source view of public indicators across strategic, environmental, and cyber domains.',
  },
  {
    eyebrow: '02 / PROVENANCE',
    title: 'Source-bound evidence',
    description:
      'Evidence, feed health, and capture context stay visible so the readout can be audited.',
  },
  {
    eyebrow: '03 / MODEL READOUT',
    title: 'Uncertainty in the open',
    description:
      'The system labels coverage, freshness, and limitations instead of presenting a false official status.',
  },
];

export default function DefconGateway() {
  return (
    <main className="eu-shell defcon-entry">
      <a className="skip-link" href="#defcon-heading">
        Skip to DEFCON launch
      </a>
      <div className="eu-grid" aria-hidden="true" />

      <header className="eu-topbar">
        <Link className="eu-brand" href="/" aria-label="ZeroDevLLC EU index">
          <span>Z/</span> ZERODEVLLC <b>.EU</b>
        </Link>
        <nav aria-label="Primary navigation">
          <Link href="/">EU Index</Link>
          <a href="https://zerodevllc.com">Corporate</a>
        </nav>
        <span className="eu-status">
          <i /> CHANNEL 01 / READY
        </span>
      </header>

      <section className="defcon-hero" aria-labelledby="defcon-heading">
        <div className="defcon-hero-copy">
          <p className="eu-kicker">EUROPEAN OPERATIONS INDEX / CHANNEL 01</p>
          <h1 id="defcon-heading">
            DEFCON
            <br />
            <em>Signal Fusion.</em>
          </h1>
          <p className="defcon-intro">
            The official EU gateway to ZeroDev&apos;s transparent public-signal
            observatory. Open the protected live surface to inspect the current
            model, evidence, feed health, and uncertainty in one place.
          </p>
          <div className="defcon-actions">
            <a
              className="defcon-primary"
              href={liveSurfaceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open live surface <b>↗</b>
            </a>
            <Link className="defcon-secondary" href="/">
              Back to EU index
            </Link>
          </div>
          <p className="defcon-access-note">
            <span>ACCESS NOTE</span>
            The live operator surface is protected. If your account is
            authorized, the launch control will take you directly to it.
          </p>
        </div>

        <aside className="defcon-system-card" aria-label="DEFCON channel status">
          <div className="defcon-card-head">
            <span>CHANNEL STATUS</span>
            <strong>01 / EU</strong>
          </div>
          <div className="defcon-signal-mark" aria-hidden="true">
            <span className="defcon-signal-ring ring-one" />
            <span className="defcon-signal-ring ring-two" />
            <span className="defcon-signal-core">⌁</span>
          </div>
          <div className="defcon-card-list">
            <span>
              <i /> PUBLIC SIGNALS
            </span>
            <span>
              <i /> SOURCE LINKED
            </span>
            <span>
              <i /> UNCERTAINTY SHOWN
            </span>
          </div>
        </aside>
      </section>

      <section className="defcon-features" aria-labelledby="defcon-features-heading">
        <div className="defcon-section-head">
          <div>
            <p className="eu-kicker">{'// CHANNEL BRIEF'}</p>
            <h2 id="defcon-features-heading">A clear read on a noisy world</h2>
          </div>
          <span>PUBLIC PROXY / NOT OFFICIAL DEFCON</span>
        </div>
        <div className="defcon-feature-grid">
          {channelFeatures.map((feature) => (
            <article className="defcon-feature" key={feature.title}>
              <p>{feature.eyebrow}</p>
              <h3>{feature.title}</h3>
              <span>{feature.description}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="eu-bottom-band defcon-bottom-band">
        <p>
          <span>&gt;_</span> ZeroDev maintains the gateway. The source systems
          remain the authority.
        </p>
        <a href={liveSurfaceUrl} target="_blank" rel="noopener noreferrer">
          Launch protected channel <b>↗</b>
        </a>
      </section>

      <footer className="eu-footer">
        <span>© 2026 ZERO DEV LLC / IRELAND</span>
        <span>NO SIGNAL WITHOUT SOURCE</span>
        <span>
          <Link href="/">.EU INDEX</Link> /{' '}
          <a href="https://zerodevllc.com">.COM</a>
        </span>
      </footer>
    </main>
  );
}
