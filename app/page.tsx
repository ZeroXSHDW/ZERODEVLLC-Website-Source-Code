import { HomeHeader, HomeSignalReadout, HomeStatusProvider, HomeTerminalStatus } from './home-status';
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
    description: 'A read-only monitoring lane is recorded, but its current provider route is not yet reconciled.',
    href: '#evidence',
    tag: 'ROUTE // HELD',
    icon: '◉',
    detail: 'External monitor / provenance pending',
    mode: 'READ ONLY',
    tone: 'cyan',
    audience: 'OPERATORS / BUILDERS',
    dataType: 'READ-ONLY TELEMETRY',
    owner: 'EXTERNAL SURFACE / UNVERIFIED',
    status: 'ROUTE / UNVERIFIED',
    freshness: 'Current provider link not recorded',
    limitation: 'The historical provider hostname is withheld until source and route ownership are reconciled.',
    detailHref: '#approach',
    external: false,
    actionLabel: 'VIEW STATUS',
  },
  {
    code: '02',
    name: 'DEFCON FUSION',
    description: 'An EU gateway to a transparent public-signal estimator for strategic risk coverage.',
    href: canonicalDomains.defcon,
    tag: 'EU GATEWAY // PUBLIC',
    icon: '⌁',
    detail: 'Public signals / source-linked evidence',
    mode: 'PUBLIC SIGNALS',
    tone: 'violet',
    audience: 'ANALYSTS / VISITORS',
    dataType: 'PUBLIC-SOURCE SIGNALS',
    owner: 'ZERODEVLLC.EU',
    status: 'PUBLIC / SOURCE-LINKED',
    freshness: 'Refresh state shown in feed',
    limitation: 'Indicators do not confirm an attack against ZeroDev.',
    detailHref: '#evidence',
    external: true,
    actionLabel: 'OPEN SURFACE',
  },
  {
    code: '03',
    name: 'SOFTWARE / SERVICES',
    description: 'Deployable tools, architecture sprints, and private build support.',
    href: canonicalDomains.store,
    tag: 'STORE // CATALOGUE',
    icon: '⊞',
    detail: 'Build support / fixed-scope delivery',
    mode: 'DELIVERY SURFACE',
    tone: 'green',
    audience: 'BUILDERS / OWNERS',
    dataType: 'SERVICES / CATALOGUE',
    owner: 'ZERODEVLLC.STORE',
    status: 'CATALOGUE / REVIEW',
    freshness: 'Scope confirmed directly',
    limitation: 'Payment, fulfilment, and provider state require separate review.',
    detailHref: '#services',
    external: true,
    actionLabel: 'OPEN SURFACE',
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

const evidenceCards = [
  {
    number: '01',
    title: 'Public-source boundary',
    description: 'The feed links to CISA catalogues and advisories. It is a public indicator layer, not private telemetry, an incident declaration, or a security guarantee.',
    tone: 'cyan',
  },
  {
    number: '02',
    title: 'Freshness is visible',
    description: 'Observed timestamps describe the source item. Checked timestamps describe the latest request. Live, degraded, unavailable, stale, and empty states stay distinct.',
    tone: 'green',
  },
  {
    number: '03',
    title: 'Local work stays reviewable',
    description: 'A local build or preview proves the candidate can run here. It does not prove source reconciliation, deployment approval, public acceptance, or provider configuration.',
    tone: 'amber',
  },
  {
    number: '04',
    title: 'Read-only privacy boundary',
    description: 'This .com candidate has no account, payment, or write workflow. It exposes public readouts and bounded refresh only; keep credentials, customer records, payment data, and sensitive incident evidence out of ordinary email.',
    tone: 'violet',
  },
  {
    number: '05',
    title: 'Report privately',
    description: 'For a suspected vulnerability, use hello@zerodevllc.com with the affected revision, reproduction, impact, and proposed mitigation. Do not publish credentials, private hosting configuration, or customer data.',
    tone: 'red',
  },
];

const deliveryPhases = [
  {
    number: '01',
    title: 'Frame',
    description: 'Turn the hard edge case into a bounded outcome and a route that someone can actually use.',
    output: 'A decision brief with scope, audience, and success measure.',
    decision: 'What must become clearer, safer, or more useful?',
    evidence: 'Authority, assumptions, exclusions, and the owner of the decision.',
  },
  {
    number: '02',
    title: 'Map',
    description: 'Make source, ownership, states, privacy boundaries, and release evidence visible before the build gets noisy.',
    output: 'A source map and operating model for the surface.',
    decision: 'Which signals and dependencies are actually in scope?',
    evidence: 'Source links, route owners, freshness rules, and known limitations.',
  },
  {
    number: '03',
    title: 'Build',
    description: 'Shape the interface, integration, or internal tool around the decision it needs to support.',
    output: 'A working interface or bounded system slice to review.',
    decision: 'Can the intended audience act on the information?',
    evidence: 'Implementation notes, states, content boundaries, and integration assumptions.',
  },
  {
    number: '04',
    title: 'Verify',
    description: 'Check responsive behavior, accessibility, security controls, source links, error paths, and handoff evidence.',
    output: 'A validation record with findings and remaining risks.',
    decision: 'What is ready for review, and what still needs an owner?',
    evidence: 'Quality checks, viewport review, security controls, errors, and unresolved gates.',
  },
  {
    number: '05',
    title: 'Handover',
    description: 'Leave behind a reviewable candidate, clear limitations, and an explicit list of owner-gated next actions.',
    output: 'A candidate release package and next-action register.',
    decision: 'Who approves, operates, deploys, or stops the next step?',
    evidence: 'Source identity, rollback reference, acceptance notes, and owner decisions.',
  },
] as const;

const missionLanes = [
  ['01', 'ASSESS', 'Authorized penetration testing and vulnerability assessment', 'Understand exposure and validate what the evidence actually shows.'],
  ['02', 'ASSURE', 'Risk management, due diligence, and compliance readiness', 'Give owners and procurement a defensible treatment and evidence path.'],
  ['03', 'RECOVER', 'Disaster recovery, BCP, and incident readiness', 'Keep critical services moving through tested decisions and known dependencies.'],
] as const;

const navigation = [
  { href: '#systems', label: 'Systems' },
  { href: '/services', label: 'Security services' },
  { href: '/engage', label: 'Prepare a brief' },
  { href: '#evidence', label: 'Evidence' },
  { href: '#services', label: 'Delivery model' },
  { href: '#defcon-map', label: 'Live map' },
  { href: '#approach', label: 'Approach' },
] as const;

export default function Home() {
  return (
    <HomeStatusProvider>
      <main className="com-shell">
        <a className="skip-link" href="#systems">Skip to systems</a>
        <div className="noise" aria-hidden="true" />
        <div className="scanlines" aria-hidden="true" />

        <HomeHeader navigation={navigation} statusHref={canonicalDomains.defcon} />

      <div id="top" className="hero-grid">
        <section className="hero-copy" aria-labelledby="hero-heading">
          <p className="eyebrow"><span className="eyebrow-caret">&gt;_</span> NODE 00 / IRELAND / SOURCE FIRST</p>
          <h1 id="hero-heading">
            Signal in.
            <span>Systems out.</span>
          </h1>
          <p className="hero-lede">
            ZeroDev builds the software layer between a sharp idea and a live system for operators, owners, and teams that need evidence and next action in the same frame.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="/services">
              Review security services <span aria-hidden="true">↗</span>
            </a>
            <a className="button button-ghost" href={canonicalDomains.defcon}>
              Open public-signal gateway <span aria-hidden="true">↗</span>
            </a>
          </div>
          <p className="hero-action-note"><span>FIRST MOVE</span> Start with a high-level objective. Authorized work begins with scope, authority, and a named decision owner.</p>
          <div className="hero-proof" aria-label="ZeroDev trust principles">
            <span><i aria-hidden="true" /> PUBLIC-SOURCE READOUTS</span>
            <span><i aria-hidden="true" /> READ-ONLY BY DEFAULT</span>
            <span><i aria-hidden="true" /> BUILT IN IRELAND</span>
          </div>
          <div className="hero-meta" id="signal">
            <HomeSignalReadout />
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
            <HomeTerminalStatus />
            <p><span className="terminal-ok">[LINK]</span> defcon_fusion <span className="terminal-muted">EU gateway / external</span></p>
            <p><span className="terminal-ok">[LINK]</span> store_catalogue <span className="terminal-muted">catalogue / contact first</span></p>
            <p className="terminal-spacer"> </p>
            <p><span className="prompt">root@zerodev</span>:~$ <span className="cursor" aria-hidden="true" /></p>
          </div>
          <div className="terminal-footer"><span>LOCAL BUILD / 0x00A7</span><span>NO USER TELEMETRY</span></div>
        </aside>
      </div>

      <section className="signal-ribbon" aria-label="ZeroDev operating summary">
        <div><strong>03</strong><span>connected surfaces</span></div>
        <div><strong>01</strong><span>EU signal gateway</span></div>
        <div><strong>RO</strong><span>read-only public signals</span></div>
        <div><strong>0</strong><span>invented security claims</span></div>
      </section>

      <section className="mission-brief" aria-labelledby="mission-heading">
        <div className="mission-brief-intro">
          <p className="eyebrow">{'// DEFENSIVE CYBER / RESILIENCE'}</p>
          <h2 id="mission-heading">Protect the mission.<br /><span>Keep the service moving.</span></h2>
          <p>ZeroDev helps public-sector programs, defense suppliers, essential services, and regulated-technology teams turn authorized security evidence into safer decisions, stronger controls, and tested recovery.</p>
          <p className="mission-boundary"><strong>Authority and evidence first.</strong> Scope, written authority, information handling, limitations, and owner decisions remain explicit before technical activity begins.</p>
          <div className="mission-links">
            <a className="text-link" href="/services">Review security and resilience services <span aria-hidden="true">↗</span></a>
            <a className="text-link" href="/sectors">Find your operating context <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div className="mission-lanes">
          {missionLanes.map(([number, title, description, outcome]) => (
            <article className="mission-lane" key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <div><p>{description}</p><small>{outcome}</small></div>
            </article>
          ))}
        </div>
      </section>

      <section className="system-section" id="systems" aria-labelledby="systems-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{'// REGISTERED SURFACES'}</p>
            <h2 id="systems-heading">One network.<br /><span>Three operating modes.</span></h2>
          </div>
          <p className="section-note">Each surface has a different job. Choose the route that matches the decision in front of you.</p>
        </div>
        <div className="system-grid">
          {systems.map((system) => (
            <article
              className={`system-card system-card-${system.tone}`}
              key={system.code}
            >
              <div className="card-topline"><span>{system.code} / 03</span><span className="card-tag">{system.tag}</span></div>
              <div className="card-icon" aria-hidden="true">{system.icon}</div>
              <h3>{system.name}</h3>
              <p>{system.description}</p>
              <span className="card-detail">{system.detail}</span>
              <dl className="system-card-facts">
                <div><dt>Audience</dt><dd>{system.audience}</dd></div>
                <div><dt>Data</dt><dd>{system.dataType}</dd></div>
                <div><dt>Route owner</dt><dd>{system.owner}</dd></div>
              </dl>
              <div className="system-card-status"><span>{system.status}</span><small>{system.freshness}</small></div>
              <p className="system-card-limit"><strong>Limit:</strong> {system.limitation}</p>
              <span className="card-mode">{system.mode}</span>
              <div className="card-actions">
                <a className="card-link" href={system.href} {...(system.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} aria-label={system.external ? (system.code === '02' ? 'Open the DEFCON Signal Fusion EU gateway' : `Open ${system.name} surface`) : `View ${system.name} route status`}>{system.actionLabel} <span aria-hidden="true">{system.external ? '↗' : '↓'}</span></a>
                <a className="card-detail-link" href={system.detailHref}>VIEW BRIEF <span aria-hidden="true">↓</span></a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="map-section" id="defcon-map" aria-labelledby="defcon-map-heading">
        <div className="map-section-copy">
          <p className="eyebrow">{'// LIVE DEFCON SURFACE'}</p>
          <h2 id="defcon-map-heading">See the signal<br /><span>without the noise.</span></h2>
          <p>A first-party preview of the DEFCON coordination topology, paired with public-source indicators and clear limits on what the data proves.</p>
          <a className="text-link" href={canonicalDomains.defcon}>Open live EU map <span aria-hidden="true">↗</span></a>
          <small>Canonical live route: zerodevllc.eu/defcon. Current evidence and source-linked readouts are presented through the public EU gateway.</small>
        </div>
        <LiveDefconMap />
      </section>

      <section className="evidence-section" id="evidence" aria-labelledby="evidence-heading">
        <div className="evidence-intro">
          <p className="eyebrow">{'// TRUST / METHODOLOGY'}</p>
          <h2 id="evidence-heading">Make the path<br /><span>inspectable.</span></h2>
          <p>Every useful signal has a chain behind it. ZeroDev makes that chain visible so a visitor can tell what came from a source, what the interface interpreted, and what still needs a human decision.</p>
          <div className="architecture-flow" aria-label="ZeroDev architecture story">
            {['Source', 'Signal', 'Interpretation', 'Interface', 'Decision'].map((step, index) => (
              <span key={step}><b>{String(index + 1).padStart(2, '0')}</b>{step}{index < 4 ? <i aria-hidden="true">→</i> : null}</span>
            ))}
          </div>
        </div>
        <div className="evidence-grid">
          {evidenceCards.map((card) => (
            <article className={`evidence-card evidence-card-${card.tone}`} key={card.number}>
              <span className="evidence-number">{card.number}</span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
          <p className="evidence-reporting">Security policy: <a href="mailto:hello@zerodevllc.com?subject=Private%20security%20report">report a concern privately ↗</a>. This route is for coordinated reporting, not a substitute for incident response or public authority.</p>
        </div>
      </section>

      <section className="approach-section" id="approach" aria-labelledby="approach-heading">
        <div className="approach-copy">
          <p className="eyebrow">{'// OPERATING APPROACH'}</p>
          <h2 id="approach-heading">Make the signal<br /><span>worth acting on.</span></h2>
          <p>Useful software keeps evidence, state, and next action in the same frame. That is how a surface earns trust.</p>
          <a className="text-link" href="/engage">Prepare a safe first brief <span aria-hidden="true">↗</span></a>
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

      <section className="services-section" id="services" aria-labelledby="services-heading">
        <div className="services-intro">
          <p className="eyebrow">{'// DEFENSIVE DELIVERY / REVIEWABLE OUTPUT'}</p>
          <h2 id="services-heading">From evidence<br /><span>to safer action.</span></h2>
          <p>Bring the security question, supplier decision, recovery concern, or evidence surface that needs to become clearer. The work stays authorized, bounded, source-aware, and reviewable.</p>
          <a className="text-link" href="/engage">Start with the safe brief <span aria-hidden="true">↗</span></a>
          <a className="text-link" href="/services">View security and resilience catalogue <span aria-hidden="true">↗</span></a>
        </div>
        <div className="services-detail">
          <div className="delivery-phases">
            {deliveryPhases.map((phase) => (
              <article className="delivery-phase" key={phase.number}>
                <div className="delivery-phase-name"><span>{phase.number}</span><h3>{phase.title}</h3></div>
                <p>{phase.description}</p>
                <dl className="delivery-phase-facts">
                  <div><dt>Client receives</dt><dd>{phase.output}</dd></div>
                  <div><dt>Decision supported</dt><dd>{phase.decision}</dd></div>
                  <div><dt>Evidence captured</dt><dd>{phase.evidence}</dd></div>
                </dl>
              </article>
            ))}
          </div>
          <aside className="services-boundary">
            <span className="eyebrow">{'// GOOD FIT / KEEP PRIVATE'}</span>
            <p>Good fit: authorized defensive assessments, vulnerability and cyber-risk reviews, technical and vendor due diligence, compliance readiness, recovery and BCP, incident exercises, and evidence-led web surfaces that make those decisions usable.</p>
            <p><strong>Typical deliverables:</strong> a scoped authority record, verified findings or supplier-risk view, control and evidence map, resilience exercise record, remediation and retest path, and reviewable release handoff evidence.</p>
            <p><strong>Out of scope by default:</strong> unauthorized access, live-target activity without written authority, certification or clearance claims, payment activation, customer-data exports, or provider/deployment changes without owner approval.</p>
            <p>Do not send credentials, customer records, payment details, private incident evidence, or secrets through ordinary email. Start with a high-level problem statement and we can establish a safer handoff path.</p>
          </aside>
        </div>
      </section>

      <section className="contact-section" aria-labelledby="contact-heading">
        <div>
          <p className="eyebrow">{'// NEXT MOVE'}</p>
          <h2 id="contact-heading">Make the next decision<br /><span>safer to act on.</span></h2>
        </div>
        <div className="contact-actions">
          <p>Have a security, supplier, recovery, or resilience question that needs a defensible next step? Bring the high-level objective and the owner who can confirm authority.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="/engage">Prepare a safe first brief <span aria-hidden="true">↗</span></a>
            <a className="button button-ghost" href="/services">Review security services <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <span>© 2026 ZERO DEV LLC / IRELAND</span>
        <span className="footer-center">MAKE USEFUL THINGS. KEEP THE SIGNAL CLEAN.</span>
        <span><a href={canonicalDomains.defcon}>DEFCON</a> / <a href={canonicalDomains.eu}>EU HUB</a> / <a href={canonicalDomains.store}>STORE</a> / <a href="/privacy">PRIVACY</a></span>
      </footer>
      </main>
    </HomeStatusProvider>
  );
}
