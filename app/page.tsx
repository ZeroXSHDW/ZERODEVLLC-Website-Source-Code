'use client';

import { useEffect, useMemo, useState } from 'react';

type DataSource = 'demo' | 'live';
type Severity = 'low' | 'medium' | 'high';

type DefconState = {
  level: number;
  label: string;
  description: string;
  updatedAt: string;
  source: DataSource;
};

type FeedEvent = {
  id: string;
  time: string;
  kind: string;
  target: string;
  detail: string;
  severity: Severity;
};

type Project = {
  title: string;
  eyebrow: string;
  description: string;
  status: string;
  visibility: 'Public proof' | 'Private access' | 'Research';
  tags: string[];
  repoUrl?: string;
  repoLabel?: string;
  featured?: boolean;
};

const NAV_ITEMS = [
  { id: 'mission', label: 'Mission' },
  { id: 'operations', label: 'Operations' },
  { id: 'work', label: 'Work' },
  { id: 'access', label: 'Access' },
];

const DEMO_DEFCON: DefconState = {
  level: 5,
  label: 'NOMINAL',
  description: 'No elevated public posture detected in the demo adapter.',
  updatedAt: 'just now',
  source: 'demo',
};

const DEMO_EVENTS: FeedEvent[] = [
  {
    id: 'evt-01',
    time: '12:48:09',
    kind: 'PROBE',
    target: 'edge-eu-03',
    detail: 'rate-limit held · 184 req/s',
    severity: 'low',
  },
  {
    id: 'evt-02',
    time: '12:46:31',
    kind: 'AUTH',
    target: 'vault-api',
    detail: 'token replay rejected',
    severity: 'medium',
  },
  {
    id: 'evt-03',
    time: '12:43:17',
    kind: 'SCAN',
    target: 'sandbox-net',
    detail: '7 surfaces mapped · no escalation',
    severity: 'low',
  },
  {
    id: 'evt-04',
    time: '12:39:44',
    kind: 'SIGNAL',
    target: 'north-atlantic',
    detail: 'baseline variance · monitoring',
    severity: 'high',
  },
];

const PROJECTS: Project[] = [
  {
    title: 'Apache-Tomcat Password Security Audit',
    eyebrow: '01 / PUBLIC AUDIT',
    description:
      'A focused hardening project that turns password posture into an auditable, reviewable security surface.',
    status: 'PUBLIC REPO',
    visibility: 'Public proof',
    tags: ['Java', 'Hardening', 'Audit'],
    repoUrl: 'https://github.com/ZeroXSHDW/Apache-Tomcat-Password-Security-Audit',
    repoLabel: 'Open GitHub',
  },
  {
    title: 'DEFCON Signal Watch',
    eyebrow: '02 / GLOBAL POSTURE',
    description:
      'A readiness and telemetry surface for turning public indicators into a calm, inspectable operator view.',
    status: 'PRIVATE BUILD',
    visibility: 'Private access',
    tags: ['Next.js', 'Cloudflare', 'Telemetry'],
    featured: true,
  },
  {
    title: 'Autosnort AFPacket Network Bridge',
    eyebrow: '03 / NETWORK DEFENCE',
    description:
      'A network visibility component that provides a public proof point for defensive systems engineering.',
    status: 'PUBLIC REPO',
    visibility: 'Public proof',
    tags: ['Linux', 'AF_PACKET', 'IDS'],
    repoUrl: 'https://github.com/ZeroXSHDW/Autosnort_AFPacket_Network_Bridge',
    repoLabel: 'Open GitHub',
  },
  {
    title: 'Lockbox Relay',
    eyebrow: '04 / DELIVERY SYSTEM',
    description:
      'A purchase-to-entitlement flow for shipping licensed software through verified, revocable access.',
    status: 'RESEARCH',
    visibility: 'Research',
    tags: ['Stripe', 'GitHub', 'R2'],
  },
  {
    title: 'NIST NVD → XLSX Converter',
    eyebrow: '05 / SECURITY DATA',
    description:
      'A practical data pipeline for turning vulnerability intelligence into a portable, analyst-friendly workbook.',
    status: 'PUBLIC REPO',
    visibility: 'Public proof',
    tags: ['NVD 2.0', 'Python', 'XLSX'],
    repoUrl: 'https://github.com/ZeroXSHDW/NIST_NVD_2.0_Convertor_JSON_To_XSLX',
    repoLabel: 'Open GitHub',
  },
  {
    title: 'RECON Graph',
    eyebrow: '06 / ATTACK SURFACE',
    description:
      'A scoped recon workbench that maps assets, observations, and confidence without exposing private targets.',
    status: 'PRIVATE BUILD',
    visibility: 'Private access',
    tags: ['Graph data', 'Edge jobs', 'RBAC'],
  },
];

const FILTERS = ['All systems', 'Public proof', 'Private access', 'Research'];

function normalizeDefcon(payload: unknown): Omit<DefconState, 'source'> | null {
  if (!payload || typeof payload !== 'object') return null;

  const record = payload as Record<string, unknown>;
  const rawLevel = Number(record.level ?? record.defcon ?? 0);
  if (!Number.isInteger(rawLevel) || rawLevel < 1 || rawLevel > 5) return null;

  return {
    level: rawLevel,
    label: typeof record.label === 'string' ? record.label : `LEVEL ${rawLevel}`,
    description:
      typeof record.description === 'string'
        ? record.description
        : 'Live posture received from the configured adapter.',
    updatedAt: typeof record.updatedAt === 'string' ? record.updatedAt : 'just now',
  };
}

function normalizeRecon(payload: unknown): FeedEvent[] {
  if (!payload || typeof payload !== 'object') return [];

  const record = payload as Record<string, unknown>;
  const rawEvents = Array.isArray(payload) ? payload : record.events;
  if (!Array.isArray(rawEvents)) return [];

  return rawEvents.slice(0, 8).flatMap((item, index) => {
    if (!item || typeof item !== 'object') return [];
    const event = item as Record<string, unknown>;
    const severity = event.severity;
    const safeSeverity: Severity =
      severity === 'high' || severity === 'medium' || severity === 'low'
        ? severity
        : 'low';

    return [
      {
        id: typeof event.id === 'string' ? event.id : `live-${index}`,
        time: typeof event.time === 'string' ? event.time : 'now',
        kind: typeof event.kind === 'string' ? event.kind : 'EVENT',
        target: typeof event.target === 'string' ? event.target : 'unknown-surface',
        detail: typeof event.detail === 'string' ? event.detail : 'adapter event received',
        severity: safeSeverity,
      },
    ];
  });
}

export default function Home() {
  const [activeNav, setActiveNav] = useState('mission');
  const [defcon, setDefcon] = useState(DEMO_DEFCON);
  const [events, setEvents] = useState(DEMO_EVENTS);
  const [lastChecked, setLastChecked] = useState('just now');
  const [filter, setFilter] = useState('All systems');
  const [isRunningRecon, setIsRunningRecon] = useState(false);
  const [liveAvailable, setLiveAvailable] = useState(false);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  useEffect(() => {
    const defconUrl = process.env.NEXT_PUBLIC_DEFCON_FEED_URL;
    const reconUrl = process.env.NEXT_PUBLIC_RECON_FEED_URL;

    if (!defconUrl && !reconUrl) return;

    const controller = new AbortController();
    const syncLiveFeeds = async () => {
      try {
        if (defconUrl) {
          const response = await fetch(defconUrl, {
            signal: controller.signal,
            headers: { Accept: 'application/json' },
          });
          if (!response.ok) throw new Error('DEFCON adapter response failed');
          const nextDefcon = normalizeDefcon(await response.json());
          if (nextDefcon) setDefcon({ ...nextDefcon, source: 'live' });
        }

        if (reconUrl) {
          const response = await fetch(reconUrl, {
            signal: controller.signal,
            headers: { Accept: 'application/json' },
          });
          if (!response.ok) throw new Error('RECON adapter response failed');
          const nextEvents = normalizeRecon(await response.json());
          if (nextEvents.length > 0) setEvents(nextEvents);
        }

        setLiveAvailable(true);
        setLastChecked('just now');
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setLiveAvailable(false);
        setLastChecked('adapter offline');
      }
    };

    void syncLiveFeeds();
    const interval = setInterval(syncLiveFeeds, 60_000);

    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  const visibleProjects = useMemo(
    () =>
      PROJECTS.filter(
        (project) => filter === 'All systems' || project.visibility === filter,
      ),
    [filter],
  );

  const runReconDemo = () => {
    setIsRunningRecon(true);
    window.setTimeout(() => {
      setEvents([
        {
          id: 'scan-01',
          time: 'now',
          kind: 'ENUM',
          target: 'demo-scope',
          detail: '12 hosts observed · 0 credentials touched',
          severity: 'low',
        },
        {
          id: 'scan-02',
          time: 'now',
          kind: 'DIFF',
          target: 'edge-eu-03',
          detail: '2 new routes · review queue opened',
          severity: 'medium',
        },
        ...DEMO_EVENTS.slice(0, 2),
      ]);
      setIsRunningRecon(false);
      setLastChecked('just now');
    }, 1_500);
  };

  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="wordmark" href="#mission" onClick={() => setActiveNav('mission')}>
          <span className="wordmark-mark">Z</span>
          <span>
            ZERO<span className="wordmark-soft">DEVLLC</span>
            <small>.EU</small>
          </span>
        </a>

        <nav className="topnav" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => (
            <a
              className={activeNav === item.id ? 'active' : ''}
              href={`#${item.id}`}
              key={item.id}
              onClick={() => setActiveNav(item.id)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a className="topbar-cta" href="#access">
          Request private access <span aria-hidden="true">↗</span>
        </a>
      </header>

      <div className="status-strip" aria-label="System status">
        <span className="status-strip-item"><i className="status-dot" /> Public console online</span>
        <span className="status-strip-divider" />
        <span className="status-strip-item"><span className="status-mono">EU / UTC</span> Secure-by-default build surface</span>
        <span className="status-strip-spacer" />
        <span className="status-strip-item status-strip-muted">v0.1 / evidence layer</span>
      </div>

      <section className="hero-section section-grid" id="mission">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-mark">+</span> Independent security engineering</p>
          <h1>Ship <em>proof</em> in public. Keep the edge private.</h1>
          <p className="hero-lede">
            ZERODEVLLC.EU is the public evidence layer for disciplined software, defensive research,
            and carefully gated tools that earn their way into production.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#operations">Open operations console <span aria-hidden="true">↗</span></a>
            <a className="button button-quiet" href="#work">See the build map <span aria-hidden="true">↓</span></a>
          </div>
          <div className="hero-proof-row">
            <div className="proof-item"><span className="proof-number">01</span><span>Public demos</span></div>
            <div className="proof-item"><span className="proof-number">02</span><span>Private delivery</span></div>
            <div className="proof-item"><span className="proof-number">03</span><span>Auditable intent</span></div>
          </div>
        </div>

        <div className="hero-visual" aria-label="Operations console preview">
          <div className="console-glow" />
          <div className="ops-console">
            <div className="console-header">
              <div className="console-header-title"><span className="console-pulse" /> ZD / OPERATIONS CONSOLE</div>
              <span className="console-clock">12:48:09 UTC</span>
            </div>
            <div className="console-main-grid">
              <div className="defcon-card">
                <div className="console-label-row"><span>GLOBAL READINESS</span><span className={defcon.source === 'live' ? 'live-label' : 'demo-label'}>{defcon.source === 'live' ? 'LIVE' : 'DEMO'}</span></div>
                <div className="defcon-value-row">
                  <div>
                    <p className="defcon-word">DEFCON</p>
                    <p className="defcon-number">{defcon.level}</p>
                  </div>
                  <div className="signal-orb" aria-hidden="true"><span>{defcon.label.slice(0, 3)}</span></div>
                </div>
                <p className="defcon-status"><span className="status-dot" /> {defcon.label.toLowerCase()} posture</p>
                <p className="console-note">{defcon.description}</p>
              </div>

              <div className="telemetry-card">
                <div className="console-label-row"><span>TELEMETRY / 24H</span><span className="trend-label">+18.4%</span></div>
                <div className="telemetry-chart" aria-label="Telemetry activity trend">
                  {[42, 57, 48, 69, 61, 78, 66, 88, 73, 94, 86, 100].map((height, index) => (
                    <span key={index} style={{ height: `${height}%` }} />
                  ))}
                </div>
                <div className="telemetry-footer"><span>OBSERVED SIGNAL</span><strong>7.2k</strong></div>
              </div>
            </div>

            <div className="console-feed">
              <div className="console-label-row"><span>RECON FEED / SANDBOX SCOPE</span><span className={liveAvailable ? 'live-label' : 'demo-label'}>{liveAvailable ? 'CONNECTED' : 'SIMULATION'}</span></div>
              {events.slice(0, 3).map((event) => (
                <div className="feed-line" key={event.id}>
                  <span className={`severity-pip severity-${event.severity}`} />
                  <span className="feed-time">{event.time}</span>
                  <strong>{event.kind}</strong>
                  <span className="feed-target">{event.target}</span>
                  <span className="feed-detail">{event.detail}</span>
                </div>
              ))}
            </div>
            <div className="console-footer"><span>READ-ONLY PUBLIC SURFACE</span><span>NO SENSITIVE TARGETS</span></div>
          </div>
        </div>
      </section>

      <section className="statement-section" aria-label="Positioning statement">
        <p className="section-kicker">/ WHY THIS EXISTS</p>
        <div className="statement-copy">
          <p>Good security work should be inspectable.</p>
          <p className="statement-muted">The homepage is a calm, legible window into the craft — while licensed software, private targets, and customer data remain behind explicit boundaries.</p>
        </div>
      </section>

      <section className="operations-section" id="operations">
        <div className="section-heading-row">
          <div>
            <p className="section-kicker">/ 01 — LIVE EVIDENCE</p>
            <h2>Operations, without the theatre.</h2>
          </div>
          <p className="section-side-note">The public console is intentionally scoped. Connect a verified adapter to replace demo data with live telemetry.</p>
        </div>

        <div className="operations-grid">
          <div className="monitor-panel">
            <div className="panel-heading"><span><span className="panel-index">01</span> DEFCON tracker</span><span className="panel-state"><i className="status-dot" /> {defcon.source === 'live' ? 'LIVE ADAPTER' : 'DEMO ADAPTER'}</span></div>
            <div className="monitor-layout">
              <div className="monitor-level"><span className="monitor-label">CURRENT PUBLIC LEVEL</span><strong>{defcon.level}</strong><span className="monitor-level-name">{defcon.label}</span></div>
              <div className="level-scale" aria-label="DEFCON scale from 1 to 5">
                {[1, 2, 3, 4, 5].map((level) => <span className={level === defcon.level ? 'current' : level < defcon.level ? 'past' : ''} key={level}><b>{level}</b><small>{level === 1 ? 'critical' : level === 5 ? 'nominal' : 'elevated'}</small></span>)}
              </div>
            </div>
            <div className="panel-bottom-row"><span>{defcon.description}</span><span>Checked {lastChecked}</span></div>
          </div>

          <div className="recon-panel">
            <div className="panel-heading"><span><span className="panel-index">02</span> Recon workbench</span><span className="panel-state"><i className="status-dot status-dot-amber" /> SAFE SCOPE</span></div>
            <div className="recon-map" aria-label="Synthetic recon map">
              <div className="map-grid" />
              <span className="map-line line-one" /><span className="map-line line-two" /><span className="map-line line-three" />
              <span className="map-node node-one" /><span className="map-node node-two" /><span className="map-node node-three" /><span className="map-node node-four" />
              <div className="map-caption"><span className="caption-pip" /> synthetic scope / no live targets</div>
            </div>
            <div className="recon-footer"><span>12 assets / 0 credentials / 0 exploit actions</span><button className="text-button" disabled={isRunningRecon} onClick={runReconDemo}>{isRunningRecon ? 'Running scoped scan…' : 'Run safe demo scan ↗'}</button></div>
          </div>
        </div>

        <div className="event-table-wrap">
          <div className="table-heading"><span>Recent observations</span><span>{events.length} events / {liveAvailable ? 'live adapter' : 'synthetic data'}</span></div>
          <div className="event-table" role="table" aria-label="Recon observations">
            <div className="event-table-row event-table-head" role="row"><span>Signal</span><span>Surface</span><span>Observation</span><span>Severity</span></div>
            {events.map((event) => <div className="event-table-row" key={event.id} role="row"><span><span className={`severity-pip severity-${event.severity}`} /> {event.kind} <small>{event.time}</small></span><span>{event.target}</span><span>{event.detail}</span><span className={`severity-copy severity-copy-${event.severity}`}>{event.severity}</span></div>)}
          </div>
        </div>
      </section>

      <section className="work-section" id="work">
        <div className="section-heading-row">
          <div><p className="section-kicker">/ 02 — BUILD MAP</p><h2>Every project has a boundary.</h2></div>
          <p className="section-side-note">Public repositories explain the what. Private builds protect the how, the customer, and the target.</p>
        </div>

        <div className="filter-row" role="tablist" aria-label="Filter projects">
          {FILTERS.map((item) => <button className={filter === item ? 'filter-button active' : 'filter-button'} key={item} onClick={() => setFilter(item)} role="tab" aria-selected={filter === item}>{item}</button>)}
        </div>

        <div className="project-list">
          {visibleProjects.map((project, index) => {
            const isExpanded = expandedProject === project.title;
            return <article className={project.featured ? 'project-card featured' : 'project-card'} key={project.title}>
              <div className="project-index">0{index + 1}</div>
              <div className="project-main"><p className="project-eyebrow">{project.eyebrow}</p><h3>{project.title}</h3><p className="project-description">{project.description}</p><div className="tag-row">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
              <div className="project-meta"><span className={project.visibility === 'Private access' ? 'visibility-badge private' : 'visibility-badge'}>{project.visibility}</span><span className="project-status">{project.status}</span><div className="project-actions">{project.visibility === 'Private access' ? <a className="project-link" href="#access">Request access <span aria-hidden="true">↗</span></a> : project.repoUrl ? <a className="project-link" href={project.repoUrl} target="_blank" rel="noreferrer">{project.repoLabel ?? 'Open GitHub'} <span aria-hidden="true">↗</span></a> : <a className="project-link" href="#access">GitHub link pending <span aria-hidden="true">↗</span></a>}<button className="project-expand" onClick={() => setExpandedProject(isExpanded ? null : project.title)} aria-expanded={isExpanded}>{isExpanded ? 'Close details' : 'Inspect build'} <span aria-hidden="true">{isExpanded ? '↑' : '↓'}</span></button></div></div>
              {isExpanded && <div className="project-details"><span>Delivery note</span><p>{project.visibility === 'Private access' ? 'The source stays in a private repository. Paid access should create a verified entitlement, then issue a revocable GitHub invitation or short-lived Cloudflare R2 download link.' : 'The public surface is a narrative and demo layer. Add the canonical repository URL when the project is published; never put secrets or live target identifiers in a public commit.'}</p></div>}
            </article>;
          })}
        </div>
      </section>

      <section className="access-section" id="access">
        <div className="access-panel">
          <div className="access-copy"><p className="section-kicker">/ 03 — PRIVATE DELIVERY</p><h2>Purchase the outcome. Receive the right boundary.</h2><p>Stripe can handle checkout; a server-side webhook should handle entitlement. From there, choose the least-privilege delivery path: a private GitHub invitation for source access, or a short-lived signed artifact for product access.</p><a className="button button-primary" href="mailto:access@zerodevllc.eu?subject=Private%20software%20access">Start a private access request <span aria-hidden="true">↗</span></a></div>
          <div className="delivery-flow" aria-label="Private software delivery flow"><div className="flow-line" /><div className="flow-step"><span>01</span><strong>Checkout</strong><small>Stripe hosted payment</small></div><div className="flow-step"><span>02</span><strong>Verify</strong><small>Signed webhook event</small></div><div className="flow-step"><span>03</span><strong>Entitle</strong><small>Product + expiry recorded</small></div><div className="flow-step"><span>04</span><strong>Deliver</strong><small>GitHub invite or R2 link</small></div></div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-top"><a className="wordmark" href="#mission"><span className="wordmark-mark">Z</span><span>ZERO<span className="wordmark-soft">DEVLLC</span><small>.EU</small></span></a><p>Evidence-led software for a more legible security practice.</p><a className="footer-mail" href="mailto:hello@zerodevllc.eu">hello@zerodevllc.eu ↗</a></div>
        <div className="footer-bottom"><span>© 2026 ZERODEVLLC.EU</span><span>Public demo data is synthetic until an adapter is configured.</span><span>Built with deliberate edges.</span></div>
      </footer>
    </main>
  );
}
