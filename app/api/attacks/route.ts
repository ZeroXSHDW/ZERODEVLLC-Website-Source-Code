const FEED_URLS = {
  kev: 'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json',
  advisories: 'https://www.cisa.gov/cybersecurity-advisories/all.xml',
  ics: 'https://www.cisa.gov/cybersecurity-advisories/ics-advisories.xml',
} as const;

const MAX_FEED_BYTES = 3 * 1024 * 1024;
const MAX_EVENTS = 12;
const CISA_HOSTS = new Set(['cisa.gov', 'www.cisa.gov']);

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

function text(value: unknown, fallback = '') {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function decodeXml(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#(\d+);/g, (_, code) => {
      const point = Number(code);
      return Number.isSafeInteger(point) && point > 0 ? String.fromCodePoint(point) : ' ';
    })
    .replace(/\s+/g, ' ')
    .trim();
}

function rssField(item: string, name: string) {
  const match = item.match(new RegExp(`<${name}\\b[^>]*>([\\s\\S]*?)</${name}>`, 'i'));
  return match ? decodeXml(match[1]) : '';
}

function safeCisaUrl(value: string, fallback: string) {
  try {
    const url = new URL(value || fallback);
    return url.protocol === 'https:' && CISA_HOSTS.has(url.hostname.toLowerCase()) ? url.href : fallback;
  } catch {
    return fallback;
  }
}

function shorten(value: string, length = 240) {
  const compact = value.replace(/\s+/g, ' ').trim();
  return compact.length > length ? `${compact.slice(0, length - 1)}…` : compact;
}

function recentIso(value: string, fallback: string) {
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : fallback;
}

async function fetchText(url: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);
  try {
    const response = await fetch(url, {
      headers: { accept: 'application/json, application/rss+xml, text/xml' },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const body = await response.text();
    if (new TextEncoder().encode(body).byteLength > MAX_FEED_BYTES) throw new Error('response too large');
    return body;
  } finally {
    clearTimeout(timer);
  }
}

function parseRssEvents(xml: string, kind: 'advisory' | 'ics-advisory', source: string, now: string): PublicThreatEvent[] {
  return [...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)]
    .map((match, index) => {
      const item = match[1];
      const title = shorten(rssField(item, 'title') || `${source} update`, 150);
      const publishedAt = recentIso(rssField(item, 'pubDate') || rssField(item, 'published') || rssField(item, 'updated'), now);
      const link = safeCisaUrl(rssField(item, 'link') || rssField(item, 'guid'), FEED_URLS[kind === 'ics-advisory' ? 'ics' : 'advisories']);
      return {
        id: `${kind}-${publishedAt}-${index}`,
        kind,
        title,
        detail: shorten(decodeXml(rssField(item, 'description')) || 'Source-linked CISA publication.', 220),
        source,
        observedAt: publishedAt,
        severity: kind === 'ics-advisory' ? 68 : 48,
        url: link,
      };
    })
    .filter((event) => event.title.length > 0);
}

function parseKevEvents(json: string, now: string): PublicThreatEvent[] {
  const payload = JSON.parse(json) as { vulnerabilities?: Array<Record<string, unknown>> };
  return (Array.isArray(payload.vulnerabilities) ? payload.vulnerabilities : [])
    .sort((a, b) => Date.parse(text(b.dateAdded)) - Date.parse(text(a.dateAdded)))
    .slice(0, 8)
    .map((vulnerability, index) => {
      const cve = text(vulnerability.cveID, `KEV-${index + 1}`);
      const vendor = text(vulnerability.vendorProject, 'Unknown vendor');
      const product = text(vulnerability.product, 'Unknown product');
      const ransomware = text(vulnerability.knownRansomwareCampaignUse).toLowerCase() === 'known';
      return {
        id: `known-exploited-${cve}`,
        kind: 'known-exploited' as const,
        title: `${cve} — ${shorten(text(vulnerability.vulnerabilityName, product), 135)}`,
        detail: shorten(`${vendor} / ${product}. ${text(vulnerability.shortDescription, 'CISA marks this vulnerability as known exploited.')}`, 220),
        source: ransomware ? 'CISA KEV / ransomware noted' : 'CISA KEV catalog',
        observedAt: recentIso(text(vulnerability.dateAdded), now),
        severity: ransomware ? 82 : 62,
        url: safeCisaUrl(`https://www.cisa.gov/known-exploited-vulnerabilities-catalog?search_api_fulltext=${encodeURIComponent(cve)}`, FEED_URLS.kev),
      };
    });
}

export async function GET() {
  const now = new Date().toISOString();
  const results = await Promise.allSettled([
    fetchText(FEED_URLS.kev),
    fetchText(FEED_URLS.advisories),
    fetchText(FEED_URLS.ics),
  ]);
  const events: PublicThreatEvent[] = [];
  const errors: string[] = [];
  const [kev, advisories, ics] = results;
  if (kev.status === 'fulfilled') {
    try { events.push(...parseKevEvents(kev.value, now)); } catch { errors.push('CISA KEV'); }
  } else errors.push('CISA KEV');
  if (advisories.status === 'fulfilled') events.push(...parseRssEvents(advisories.value, 'advisory', 'CISA advisories', now));
  else errors.push('CISA advisories');
  if (ics.status === 'fulfilled') events.push(...parseRssEvents(ics.value, 'ics-advisory', 'CISA ICS advisories', now));
  else errors.push('CISA ICS advisories');

  const ordered = events
    .sort((a, b) => Date.parse(b.observedAt) - Date.parse(a.observedAt))
    .slice(0, MAX_EVENTS);
  return Response.json({
    status: errors.length === 0 ? 'live' : ordered.length > 0 ? 'degraded' : 'unavailable',
    observedAt: now,
    refreshAfterSeconds: 60,
    events: ordered,
    sources: ['CISA Known Exploited Vulnerabilities', 'CISA Cybersecurity Advisories', 'CISA ICS Advisories'],
    errors,
  }, { headers: { 'Cache-Control': 'no-store, max-age=0' } });
}
