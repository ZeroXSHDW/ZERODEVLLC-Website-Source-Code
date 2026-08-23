import { NextRequest, NextResponse } from "next/server";

function contentSecurityPolicy(nonce?: string) {
  const nonceSource = nonce ? ` 'nonce-${nonce}'` : "";
  return `default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; frame-src 'none'; child-src 'none'; object-src 'none'; script-src 'self'${nonceSource}; script-src-attr 'none'; style-src 'self' 'unsafe-inline'; style-src-attr 'none'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' https://www.gstatic.com; worker-src 'self' blob:; manifest-src 'self'; media-src 'self' blob:; upgrade-insecure-requests`;
}

function createNonce() {
  const bytes = new Uint8Array(18);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export function proxy(request: NextRequest) {
  const nonce = createNonce();
  const csp = contentSecurityPolicy(nonce);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("content-security-policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static).*)"],
};
