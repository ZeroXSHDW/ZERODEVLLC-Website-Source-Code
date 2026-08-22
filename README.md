# ZeroDev LLC — public index

The canonical public landing page for ZeroDev LLC. It provides a concise
service-discovery surface for Threat Ops, DEFCON Signal Fusion, European
operations, and the store.

- Production: <https://zerodevllc.com>
- Sites preview: <https://zerodevllc-com.michaelmorangeometri.chatgpt.site>

## Project shape

- `app/` contains the App Router pages, metadata, robots policy, and sitemap.
- `proxy.ts` enforces HTTPS, the canonical host, security headers, and
  cross-origin isolation, plus preview `noindex` behavior. Its CSP explicitly
  denies frames and child browsing contexts, while Permissions-Policy disables
  unused device and sensor capabilities, including clipboard reads; malformed
  forwarded-protocol headers fail closed. Each response carries the exact
  source-controlled `strict-2026-08` security profile used by the live monitor.
- `scripts/security-check.mjs` verifies the security contract in CI.
- `.openai/hosting.json` identifies the existing Sites project and must remain
  unchanged.

The application uses React, Next-compatible routing, Vinext/Vite, and the
Cloudflare adapter. The landing page has no required runtime secret.

## Local development

Requirements: Node.js 22.13 or newer and npm.

```bash
npm ci
npm run dev
```

Use the local URL printed by Vinext. Keep runtime values in ignored `.env*`
files or Sites settings; do not commit them.

## Verification

Run the release gate before review:

```bash
npm run quality
```

This runs the security contract, TypeScript checks, ESLint, a production
build, and a moderate-severity dependency audit. The same gate runs in
`.github/workflows/quality.yml` for pushes to `main`, pull requests, and
manual dispatch. CI has read-only repository permissions and never deploys.

## Troubleshooting

- If `npm ci` fails, use Node.js 22.13 or newer and rerun it from this
  directory so the checked-in lockfile is used.
- If `npm run quality` fails, fix the first failing stage and rerun the full
  command; the landing page does not require runtime secrets.
- A Vinext notice about route classification is informational when the build
  completes successfully; it reflects static-analysis limits around dynamic
  request APIs.

## Domains, previews, and deployment

The production origin is `https://zerodevllc.com`. Preview deployments are
marked `noindex` and must not be treated as production. Save or deploy only
the exact commit that passed review. Do not commit `.next`, `.vinext`,
`.wrangler`, `dist`, `out`, credentials, customer data, or generated output.

## Contributing and security

See [CONTRIBUTING.md](CONTRIBUTING.md) for the review contract and
[SECURITY.md](SECURITY.md) for private vulnerability reporting. The project
is private and has no declared open-source license; reuse requires written
permission from the owner.
