'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useHomeStatus } from './home-status';

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
  stale?: boolean;
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

function formatFeedTime(value: string | undefined) {
  const timestamp = value ? Date.parse(value) : Number.NaN;
  return Number.isFinite(timestamp) ? `${formatUtc(timestamp)}Z` : '--:--:--';
}

function isThreatEvent(value: unknown): value is PublicThreatEvent {
  if (!value || typeof value !== 'object') return false;
  const event = value as Partial<PublicThreatEvent>;
  return typeof event.id === 'string'
    && typeof event.title === 'string'
    && typeof event.detail === 'string'
    && typeof event.source === 'string'
    && typeof event.observedAt === 'string'
    && typeof event.severity === 'number'
    && typeof event.url === 'string'
    && ['known-exploited', 'advisory', 'ics-advisory'].includes(event.kind ?? '');
}

function parseThreatFeed(value: unknown): ThreatFeed {
  if (!value || typeof value !== 'object') throw new Error('invalid threat feed');
  const feed = value as Partial<ThreatFeed>;
  if (!['live', 'degraded', 'unavailable'].includes(feed.status ?? '')) throw new Error('invalid threat feed status');
  return {
    status: feed.status as ThreatFeed['status'],
    observedAt: typeof feed.observedAt === 'string' ? feed.observedAt : new Date().toISOString(),
    events: Array.isArray(feed.events) ? feed.events.filter(isThreatEvent) : [],
    errors: Array.isArray(feed.errors) ? feed.errors.filter((error): error is string => typeof error === 'string') : [],
    stale: feed.stale === true,
  };
}

export function LiveDefconMap() {
  const [now, setNow] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [feed, setFeed] = useState<ThreatFeed | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshInFlight = useRef(false);
  const { setStatus } = useHomeStatus();

  const refreshFeed = useCallback(async (force = false) => {
    if (refreshInFlight.current) return;
    refreshInFlight.current = true;
    setIsRefreshing(true);
    try {
      const endpoint = force ? `/api/attacks?refresh=${Date.now()}` : '/api/attacks';
      const response = await fetch(endpoint, {
        cache: force ? 'no-store' : 'default',
        headers: { accept: 'application/json' },
      });
      if (!response.ok) throw new Error('feed unavailable');
      setFeed({ ...parseThreatFeed(await response.json()), stale: false });
    } catch {
      setFeed((current) => {
        const errors = [...new Set([...(current?.errors ?? []), 'Live public threat feed unavailable'])];
        return current
          ? { ...current, status: current.events.length > 0 ? 'degraded' : 'unavailable', stale: true, errors }
          : { status: 'unavailable', observedAt: new Date().toISOString(), events: [], errors, stale: true };
      });
    } finally {
      setIsRefreshing(false);
      refreshInFlight.current = false;
    }
  }, []);

  useEffect(() => {
    setStatus(feed?.status ?? 'connecting');
  }, [feed?.status, setStatus]);

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
        <a className="map-live-badge" href="https://zerodevllc.eu/defcon" aria-label="Open the live DEFCON EU gateway"><i /> EU GATEWAY / LIVE MAP ↗</a>
      </div>

      <div className={`defcon-map-stage${paused ? ' is-paused' : ''}`} role="img" aria-label="Three-dimensional preview of the DEFCON coordination network">
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

      <div className="threat-feed" aria-busy={isRefreshing}>
        <div className="threat-feed-heading">
          <div>
            <span>LIVE PUBLIC THREAT SIGNALS</span>
            <small>{feed ? `${feed.events.length} source-linked events · checked ${formatFeedTime(feed.observedAt)}${feed.stale ? ' · stale cache' : ''}` : 'Connecting to public sources…'}</small>
          </div>
          <div className="threat-feed-controls">
            <span className={`threat-feed-status threat-status-${feed?.status ?? 'connecting'}`} role="status" aria-live="polite"><i /> {feed?.status === 'live' ? 'LIVE' : feed?.status === 'degraded' ? 'DEGRADED' : feed?.status === 'unavailable' ? 'UNAVAILABLE' : 'CONNECTING'}</span>
            <button type="button" onClick={() => void refreshFeed(true)} disabled={isRefreshing} aria-label="Refresh public threat signals">
              {isRefreshing ? 'CHECKING…' : 'REFRESH'}
            </button>
          </div>
        </div>
        <p className="threat-feed-notice">Public-source indicators only. Known exploitation or advisory activity is not confirmation of an attack against ZeroDev.</p>
        {feed?.errors.length ? <p className="threat-feed-warning">Partial source outage: {feed.errors.join(' · ')}</p> : null}
        <div className="threat-event-list">
          {feed?.events.slice(0, 4).map((event) => (
            <a className="threat-event" href={event.url} key={event.id} target="_blank" rel="noopener noreferrer" aria-label={`${event.title} from ${event.source}; open source advisory`}>
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
