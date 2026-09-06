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
  checkedAt: string;
  refreshAfterSeconds: number;
  refreshCooldownSeconds: number;
  events: PublicThreatEvent[];
  errors: string[];
  stale?: boolean;
};

const CISA_HOSTS = new Set(['cisa.gov', 'www.cisa.gov']);
const MAX_EVENTS = 12;
const MAX_EVENT_ID_LENGTH = 160;
const MAX_EVENT_TITLE_LENGTH = 180;
const MAX_EVENT_DETAIL_LENGTH = 320;
const MAX_EVENT_SOURCE_LENGTH = 120;
const MAX_EVENT_URL_LENGTH = 2_048;
const MAX_ERRORS = 6;
const MAX_ERROR_LENGTH = 160;
const DEFAULT_REFRESH_AFTER_SECONDS = 60;
const DEFAULT_REFRESH_COOLDOWN_SECONDS = 15;
const DEFAULT_REQUEST_TIMEOUT_MS = 15_000;

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

function getEventKindLabel(kind: PublicThreatEvent['kind']) {
  return kind === 'known-exploited' ? 'known exploited' : kind === 'ics-advisory' ? 'ICS advisory' : 'advisory';
}

function getEventSeverity(value: number) {
  if (value >= 75) return { tone: 'high', label: 'HIGH' } as const;
  if (value >= 60) return { tone: 'watch', label: 'WATCH' } as const;
  return { tone: 'info', label: 'INFO' } as const;
}

function boundedText(value: unknown, maxLength: number): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength;
}

function boundedSeconds(value: unknown, fallback: number, maximum: number) {
  return typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= maximum ? value : fallback;
}

function isSafeCisaUrl(value: unknown): value is string {
  if (!boundedText(value, MAX_EVENT_URL_LENGTH)) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password && CISA_HOSTS.has(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}

function isThreatEvent(value: unknown): value is PublicThreatEvent {
  if (!value || typeof value !== 'object') return false;
  const event = value as Partial<PublicThreatEvent>;
  return boundedText(event.id, MAX_EVENT_ID_LENGTH)
    && boundedText(event.title, MAX_EVENT_TITLE_LENGTH)
    && boundedText(event.detail, MAX_EVENT_DETAIL_LENGTH)
    && boundedText(event.source, MAX_EVENT_SOURCE_LENGTH)
    && boundedText(event.observedAt, 64)
    && Number.isFinite(Date.parse(event.observedAt))
    && typeof event.severity === 'number'
    && Number.isInteger(event.severity)
    && event.severity >= 0
    && event.severity <= 100
    && ['known-exploited', 'advisory', 'ics-advisory'].includes(event.kind ?? '')
    && isSafeCisaUrl(event.url);
}

function parseThreatFeed(value: unknown): ThreatFeed {
  if (!value || typeof value !== 'object') throw new Error('invalid threat feed');
  const feed = value as Partial<ThreatFeed>;
  if (!['live', 'degraded', 'unavailable'].includes(feed.status ?? '')) throw new Error('invalid threat feed status');
  const now = new Date().toISOString();
  return {
    status: feed.status as ThreatFeed['status'],
    observedAt: boundedText(feed.observedAt, 64) && Number.isFinite(Date.parse(feed.observedAt)) ? feed.observedAt : now,
    checkedAt: boundedText(feed.checkedAt, 64) && Number.isFinite(Date.parse(feed.checkedAt)) ? feed.checkedAt : now,
    refreshAfterSeconds: boundedSeconds(feed.refreshAfterSeconds, DEFAULT_REFRESH_AFTER_SECONDS, 300),
    refreshCooldownSeconds: boundedSeconds(feed.refreshCooldownSeconds, DEFAULT_REFRESH_COOLDOWN_SECONDS, 60),
    events: Array.isArray(feed.events) ? feed.events.filter(isThreatEvent).slice(0, MAX_EVENTS) : [],
    errors: Array.isArray(feed.errors)
      ? feed.errors
        .filter((error): error is string => boundedText(error, MAX_ERROR_LENGTH))
        .slice(0, MAX_ERRORS)
      : [],
    stale: feed.stale === true,
  };
}

function getFeedStateCopy(feed: ThreatFeed | null, refreshWaitSeconds: number) {
  if (!feed) {
    return {
      label: 'CONNECTING',
      detail: 'Awaiting the first public-source response.',
    };
  }

  if (feed.stale) {
    return {
      label: 'STALE CACHE',
      detail: refreshWaitSeconds > 0
        ? `Last known events retained; manual refresh available in ${refreshWaitSeconds}s.`
        : 'Last known events retained; the current source response is not available.',
    };
  }

  if (feed.status === 'degraded') {
    return {
      label: 'PARTIAL RESPONSE',
      detail: 'Some public sources responded; coverage may be incomplete.',
    };
  }

  if (feed.status === 'unavailable') {
    return {
      label: 'NO CURRENT RESPONSE',
      detail: 'No public source response is available; no current event claim is made.',
    };
  }

  if (refreshWaitSeconds > 0) {
    return {
      label: 'LIVE / COOLDOWN',
      detail: `Current response is live; manual refresh available in ${refreshWaitSeconds}s.`,
    };
  }

  return {
    label: 'LIVE / FRESH RESPONSE',
    detail: 'All requested public-source feeds responded for this refresh.',
  };
}

export function LiveDefconMap() {
  const [now, setNow] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [feed, setFeed] = useState<ThreatFeed | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [nextManualRefreshAt, setNextManualRefreshAt] = useState(0);
  const refreshInFlight = useRef(false);
  const nextManualRefreshAtRef = useRef(0);
  const requestAbortRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);
  const { setStatus } = useHomeStatus();

  const refreshFeed = useCallback(async (force = false) => {
    if (refreshInFlight.current) return;
    const requestStartedAt = Date.now();
    if (force && requestStartedAt < nextManualRefreshAtRef.current) return;
    refreshInFlight.current = true;
    setIsRefreshing(true);
    if (force) {
      const localDeadline = requestStartedAt + DEFAULT_REFRESH_COOLDOWN_SECONDS * 1000;
      nextManualRefreshAtRef.current = localDeadline;
      setNextManualRefreshAt(localDeadline);
    }
    const controller = new AbortController();
    const requestTimer = window.setTimeout(() => controller.abort(), DEFAULT_REQUEST_TIMEOUT_MS);
    requestAbortRef.current = controller;
    try {
      const endpoint = force ? `/api/attacks?refresh=${Date.now()}` : '/api/attacks';
      const response = await fetch(endpoint, {
        cache: force ? 'no-store' : 'default',
        headers: { accept: 'application/json' },
        signal: controller.signal,
      });
      if (!response.ok) throw new Error('feed unavailable');
      const nextFeed = parseThreatFeed(await response.json());
      if (!mountedRef.current) return;
      setFeed(nextFeed);
      if (force) {
        const serverDeadline = Date.now() + nextFeed.refreshCooldownSeconds * 1000;
        nextManualRefreshAtRef.current = serverDeadline;
        setNextManualRefreshAt(serverDeadline);
      }
    } catch (error) {
      if (!mountedRef.current) return;
      const errorMessage = error instanceof Error && error.name === 'AbortError'
        ? 'Live public threat feed request timed out'
        : 'Live public threat feed unavailable';
      setFeed((current) => {
        const errors = [...new Set([...(current?.errors ?? []), errorMessage])];
        return current
          ? { ...current, status: current.events.length > 0 ? 'degraded' : 'unavailable', stale: true, errors }
          : { status: 'unavailable', observedAt: new Date().toISOString(), checkedAt: new Date().toISOString(), refreshAfterSeconds: DEFAULT_REFRESH_AFTER_SECONDS, refreshCooldownSeconds: DEFAULT_REFRESH_COOLDOWN_SECONDS, events: [], errors, stale: true };
      });
    } finally {
      window.clearTimeout(requestTimer);
      if (requestAbortRef.current === controller) requestAbortRef.current = null;
      if (mountedRef.current) setIsRefreshing(false);
      refreshInFlight.current = false;
    }
  }, []);

  const refreshWaitSeconds = now === null ? 0 : Math.max(0, Math.ceil((nextManualRefreshAt - now) / 1000));
  const feedState = getFeedStateCopy(feed, refreshWaitSeconds);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      requestAbortRef.current?.abort();
    };
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
    const refreshAfterMs = (feed?.refreshAfterSeconds ?? 0) * 1000;
    const refreshTimer = window.setTimeout(() => void refreshFeed(), refreshAfterMs);
    return () => window.clearTimeout(refreshTimer);
  }, [feed?.checkedAt, feed?.refreshAfterSeconds, feed?.status, feed?.stale, refreshFeed]);

  return (
    <div className="defcon-map-card">
      <div className="defcon-map-topline">
        <div>
          <p className="eyebrow">{'// DEFCON SIGNAL FUSION'}</p>
          <h3>Live network map</h3>
        </div>
        <a className="map-live-badge" href="https://zerodevllc.eu/defcon" target="_blank" rel="noopener noreferrer" aria-label="Open the live DEFCON EU gateway; opens in a new tab"><i /> EU GATEWAY / LIVE MAP ↗</a>
      </div>

      <div className={`defcon-map-stage${paused ? ' is-paused' : ''}`} role="img" aria-describedby="defcon-data-note" aria-label="Three-dimensional preview of the DEFCON coordination network">
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
          <strong>EU / PUBLIC GATEWAY</strong>
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
            <small>{feed ? <>{feed.events.length} source-linked events · observed <time dateTime={feed.observedAt}>{formatFeedTime(feed.observedAt)}</time> · checked <time dateTime={feed.checkedAt}>{formatFeedTime(feed.checkedAt)}</time> · auto-refresh {feed.refreshAfterSeconds}s{feed.stale ? ' · stale cache' : ''}{refreshWaitSeconds > 0 ? ` · manual refresh in ${refreshWaitSeconds}s` : ''}</> : 'Connecting to public sources…'}</small>
          </div>
          <div className="threat-feed-controls">
            <span className={`threat-feed-status threat-status-${feed?.status ?? 'connecting'}`} role="status" aria-live="polite" aria-atomic="true"><i /> {feed?.status === 'live' ? 'LIVE' : feed?.status === 'degraded' ? 'DEGRADED' : feed?.status === 'unavailable' ? 'UNAVAILABLE' : 'CONNECTING'}</span>
            <button type="button" onClick={() => void refreshFeed(true)} disabled={isRefreshing || refreshWaitSeconds > 0} aria-label={refreshWaitSeconds > 0 ? `Refresh public threat signals; available in ${refreshWaitSeconds} seconds` : 'Refresh public threat signals'}>
              {isRefreshing ? 'CHECKING…' : refreshWaitSeconds > 0 ? `WAIT ${refreshWaitSeconds}s` : 'REFRESH'}
            </button>
          </div>
        </div>
        <div className={`threat-feed-state threat-state-${feed?.status ?? 'connecting'}${feed?.stale ? ' threat-state-stale' : ''}`}>
          <span className="threat-feed-state-mark" aria-hidden="true" />
          <strong role="status" aria-live="polite" aria-atomic="true">{feedState.label}</strong>
          <span className="threat-feed-state-detail">{feedState.detail}</span>
        </div>
        <p className="threat-feed-notice">Public-source indicators only. Known exploitation or advisory activity is not confirmation of an attack against ZeroDev.</p>
        {feed?.errors.length ? <p className="threat-feed-warning" role="status" aria-live="polite" aria-atomic="true">Partial source outage: {feed.errors.join(' · ')}</p> : null}
        <div className="threat-event-list">
          {feed?.events.slice(0, 4).map((event) => (
            (() => {
              const severity = getEventSeverity(event.severity);
              return <a className="threat-event" href={event.url} key={event.id} target="_blank" rel="noopener noreferrer" aria-label={`${event.title} from ${event.source}; severity ${severity.label.toLowerCase()}; ${getEventKindLabel(event.kind)}; observed ${formatFeedTime(event.observedAt)}; open source advisory; opens in a new tab`}>
                <span className={`threat-severity severity-${severity.tone}`} aria-hidden="true" />
                <span className="threat-event-copy"><strong>{event.title}</strong><small><b className={`threat-severity-label severity-label-${severity.tone}`}>{severity.label}</b><b className="threat-source-badge">{event.source}</b> {getEventKindLabel(event.kind).toUpperCase()} · observed <time dateTime={event.observedAt}>{formatFeedTime(event.observedAt)}</time></small></span>
                <span className="threat-event-arrow" aria-hidden="true">↗</span>
              </a>;
            })()
          ))}
          {feed && feed.events.length === 0 && <span className="threat-feed-empty">No public threat events returned in this refresh.</span>}
          {!feed && <span className="threat-feed-empty">Waiting for the first source refresh.</span>}
        </div>
      </div>

      <details className="map-data-details">
        <summary>Read the source data</summary>
        <p id="defcon-data-note" className="map-data-note">Text alternative to the visual topology. Node labels describe this interface; event rows link to the original public advisory or catalogue entry.</p>
        <div className="map-data-grid">
          <div>
            <h4>NETWORK NODES</h4>
            <table>
              <caption className="sr-only">Network node labels and signal tones</caption>
              <thead><tr><th scope="col">Node</th><th scope="col">Signal</th></tr></thead>
              <tbody>
                {mapNodes.map((node) => <tr key={node.name}><th scope="row">{node.name}</th><td>{node.tone.toUpperCase()}</td></tr>)}
              </tbody>
            </table>
          </div>
          <div>
            <h4>PUBLIC EVENTS</h4>
            <table>
              <caption className="sr-only">Source-linked public threat events</caption>
              <thead><tr><th scope="col">Event</th><th scope="col">Severity</th><th scope="col">Source / observed</th></tr></thead>
              <tbody>
                {feed?.events.slice(0, 8).map((event) => (
                  <tr key={`data-${event.id}`}>
                    <th scope="row"><a href={event.url} target="_blank" rel="noopener noreferrer">{event.title} <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a></th>
                    <td>{getEventSeverity(event.severity).label}</td>
                    <td>{event.source}<br /><span><time dateTime={event.observedAt}>{formatFeedTime(event.observedAt)}</time></span></td>
                  </tr>
                ))}
                {feed?.events.length === 0 && <tr><td colSpan={3}>No events returned in this refresh.</td></tr>}
                {!feed && <tr><td colSpan={3}>Awaiting source refresh.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </details>
    </div>
  );
}
