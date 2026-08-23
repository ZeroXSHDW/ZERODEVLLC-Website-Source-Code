'use client';

import { useCallback, useEffect, useState } from 'react';

type PublicThreatEvent = {
  id: string;
  kind: 'known-exploited' | 'advisory' | 'ics-advisory';
  title: string;
  detail: string;
  source: string;
  observedAt: string;
  severity: number;
  url: string;
};

type ThreatFeed = {
  status: 'live' | 'degraded' | 'unavailable';
  observedAt: string;
  events: PublicThreatEvent[];
  errors: string[];
};

const mapNodes = [
  { name: 'NORTH AMERICA', x: 24, y: 42, tone: 'cyan', depth: 16 },
  { name: 'PACIFIC WATCH', x: 12, y: 59, tone: 'violet', depth: 6 },
  { name: 'EUROPE', x: 56, y: 34, tone: 'green', depth: 24 },
  { name: 'EU RESPONSE', x: 62, y: 45, tone: 'green', depth: 18 },
  { name: 'AFRICA', x: 51, y: 59, tone: 'amber', depth: 11 },
  { name: 'ASIA / PACIFIC', x: 76, y: 40, tone: 'cyan', depth: 4 },
  { name: 'OCEANIA', x: 82, y: 70, tone: 'violet', depth: -4 },
];

function formatUtc(timestamp: number) {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'UTC',
    hour12: false,
  }).format(timestamp);
}

export function LiveDefconMap() {
  const [now, setNow] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [feed, setFeed] = useState<ThreatFeed | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshFeed = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/attacks', { cache: 'no-store' });
      if (!response.ok) throw new Error('feed unavailable');
      setFeed(await response.json() as ThreatFeed);
    } catch {
      setFeed((current) => current ?? { status: 'unavailable', observedAt: new Date().toISOString(), events: [], errors: ['Live public threat feed unavailable'] });
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const update = () => setNow(Date.now());
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const initialTimer = window.setTimeout(() => void refreshFeed(), 0);
    const timer = window.setInterval(() => void refreshFeed(), 60_000);
    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(timer);
    };
  }, [refreshFeed]);

  return (
    <div className="defcon-map-card">
      <div className="defcon-map-topline">
        <div>
          <p className="eyebrow">{'// DEFCON SIGNAL FUSION'}</p>
          <h3>Live network map</h3>
        </div>
        <span className="map-live-badge"><i /> LIVE GATEWAY</span>
      </div>

      <div className={`defcon-map-stage${paused ? ' is-paused' : ''}`} aria-label="Three-dimensional preview of the DEFCON coordination network">
        <div className="map-orbit map-orbit-one" aria-hidden="true" />
        <div className="map-orbit map-orbit-two" aria-hidden="true" />
        <div className="map-globe" aria-hidden="true">
          <span className="map-latitude latitude-one" />
          <span className="map-latitude latitude-two" />
          <span className="map-longitude longitude-one" />
          <span className="map-longitude longitude-two" />
          <span className="map-globe-core" />
          {mapNodes.map((node) => (
            <span
              className={`map-signal map-signal-${node.tone}`}
              key={node.name}
              style={{ left: `${node.x}%`, top: `${node.y}%`, transform: `translate(-50%, -50%) translateZ(${node.depth}px)` }}
            >
              <i />
              <b>{node.name}</b>
            </span>
          ))}
        </div>
        <div className="map-scan" aria-hidden="true" />
        <div className="map-stage-label map-label-top">DEFCON / NETWORK TOPOLOGY</div>
        <div className="map-stage-label map-label-bottom">SOURCE-LINKED PUBLIC SIGNALS / READ ONLY</div>
      </div>

      <div className="defcon-map-footer">
        <div>
          <span>GATEWAY STATUS</span>
          <strong>EU / PROTECTED</strong>
        </div>
        <div>
          <span>UTC CLOCK</span>
          <strong>{now === null ? '--:--:--' : `${formatUtc(now)}Z`}</strong>
        </div>
        <button type="button" onClick={() => setPaused((value) => !value)} aria-pressed={paused}>
          {paused ? 'RESUME ROTATION' : 'PAUSE ROTATION'}
        </button>
      </div>

      <div className="threat-feed" aria-live="polite">
        <div className="threat-feed-heading">
          <div>
            <span>LIVE PUBLIC THREAT SIGNALS</span>
            <small>{feed ? `${feed.events.length} source-linked events` : 'Connecting to public sources…'}</small>
          </div>
          <button type="button" onClick={() => void refreshFeed()} disabled={isRefreshing}>
            {isRefreshing ? 'CHECKING…' : 'REFRESH'}
          </button>
        </div>
        <p className="threat-feed-notice">Public-source indicators only. Known exploitation or advisory activity is not confirmation of an attack against ZeroDev.</p>
        <div className="threat-event-list">
          {feed?.events.slice(0, 4).map((event) => (
            <a className="threat-event" href={event.url} key={event.id} target="_blank" rel="noreferrer">
              <span className={`threat-severity severity-${event.severity >= 75 ? 'high' : event.severity >= 60 ? 'watch' : 'info'}`} />
              <span className="threat-event-copy"><strong>{event.title}</strong><small>{event.source} · {event.kind === 'known-exploited' ? 'KNOWN EXPLOITED' : event.kind === 'ics-advisory' ? 'ICS ADVISORY' : 'ADVISORY'}</small></span>
              <span className="threat-event-arrow" aria-hidden="true">↗</span>
            </a>
          ))}
          {feed && feed.events.length === 0 && <span className="threat-feed-empty">No public threat events returned in this refresh.</span>}
          {!feed && <span className="threat-feed-empty">Waiting for the first source refresh.</span>}
        </div>
      </div>
    </div>
  );
}
