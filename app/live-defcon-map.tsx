'use client';

import { useEffect, useState } from 'react';

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

  useEffect(() => {
    const update = () => setNow(Date.now());
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

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
    </div>
  );
}
