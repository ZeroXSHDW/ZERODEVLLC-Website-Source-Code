import { NextRequest, NextResponse } from 'next/server';

const canonicalHost = 'zerodevllc.eu';
const previewHost = 'zerodevllc-eu.michaelmorangeometri.chatgpt.site';

const securityHeaders: Record<string, string> = {
  'Content-Security-Policy':
    "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self' 'unsafe-inline'; script-src-attr 'none'; style-src 'self' 'unsafe-inline'; style-src-attr 'none'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; upgrade-insecure-requests",
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-Permitted-Cross-Domain-Policies': 'none',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Origin-Agent-Cluster': '?1',
  'X-DNS-Prefetch-Control': 'off',
};

function applySecurityHeaders(response: NextResponse) {
  for (const [name, value] of Object.entries(securityHeaders)) {
    response.headers.set(name, value);
  }
  return response;
}

function getHost(request: NextRequest) {
  const rawHost = request.headers.get('host') ?? request.nextUrl.hostname;
  return rawHost.startsWith('[')
    ? rawHost.slice(0, rawHost.indexOf(']') + 1).toLowerCase()
    : rawHost.split(':')[0].toLowerCase();
}

function hasExplicitPort(request: NextRequest) {
  const rawHost = request.headers.get('host') ?? request.nextUrl.host;
  if (rawHost.startsWith('[')) {
    const closingBracket = rawHost.indexOf(']');
    return closingBracket !== -1 && rawHost.slice(closingBracket + 1).startsWith(':');
  }
  return rawHost.includes(':');
}

function secureRedirect(url: URL) {
  const response = applySecurityHeaders(NextResponse.redirect(url, 308));
  response.headers.set('Cache-Control', 'no-store, max-age=0');
  return response;
}

function applyPreviewPrivacy(response: NextResponse) {
  response.headers.set('Cache-Control', 'no-store, max-age=0');
  response.headers.set('Referrer-Policy', 'no-referrer');
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  return response;
}

export function proxy(request: NextRequest) {
  const host = getHost(request);
  const isLocal = host === 'localhost' || host === '127.0.0.1' || host === '[::1]' || host === '::1';
  const forwardedProtoHeader = request.headers.get('x-forwarded-proto');
  const forwardedProto = forwardedProtoHeader === null
    ? request.nextUrl.protocol.replace(':', '').toLowerCase()
    : forwardedProtoHeader.trim().toLowerCase();
  const requestProtocol = request.nextUrl.protocol.replace(':', '').toLowerCase();
  const effectiveProto = requestProtocol === 'https'
    ? 'https'
    : forwardedProto === 'http' && requestProtocol === 'http' ? 'http' : 'http';
  const shouldCanonicalizeHost = (!isLocal && hasExplicitPort(request))
    || host === 'www.' + canonicalHost
    || (!isLocal && host !== canonicalHost && host !== previewHost);

  if (!isLocal && (effectiveProto !== 'https' || shouldCanonicalizeHost)) {
    const url = request.nextUrl.clone();
    url.protocol = 'https:';
    if (shouldCanonicalizeHost) url.hostname = canonicalHost;
    url.port = '';
    return secureRedirect(url);
  }

  const response = applySecurityHeaders(NextResponse.next());
  response.headers.set('Link', `<https://${canonicalHost}${request.nextUrl.pathname}>; rel="canonical"`);

  if (host === previewHost) {
    applyPreviewPrivacy(response);
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static).*)'],
};
