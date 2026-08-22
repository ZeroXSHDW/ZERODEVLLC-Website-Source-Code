# ZeroDev LLC — European Operations Index

The European operations surface for ZeroDev LLC, linking regional context to
the canonical DEFCON Signal Fusion and Threat Ops systems. The production host
is `https://zerodevllc.eu`; the Sites preview host is
`https://zerodevllc-eu.michaelmorangeometri.chatgpt.site`.

## Stack and layout

- React and Next-compatible App Router pages under `app/`.
- Vinext/Vite and the Cloudflare adapter for the Sites runtime.
- `proxy.ts` enforces HTTPS, canonical-host redirects, security headers, and
  `noindex` behavior on the preview host. Malformed forwarded-protocol headers
  fail closed to the canonical HTTPS host.
- `.openai/hosting.json` records the existing Sites project identity. Keep it
  unchanged when working on this project.

## Local development

```bash
npm ci
npm run dev
```

Use the local URL printed by Vinext. This site has no required local secrets;
store credentials and runtime values only in ignored `.env*` files or Sites
runtime settings.

## Quality gate

```bash
npm run typecheck
npm run lint
npm run build
npm audit --audit-level=high
```

CI runs the locked install, audit, type-check, lint, and production build on
pushes, pull requests, and manual dispatch. It does not deploy production or
call external systems.

## Deployment and security notes

Push the exact reviewed commit before saving or deploying a Sites version. Do
not commit `.env` files, credentials, customer data, or generated `.next`,
`.vinext`, `.wrangler`, `dist`, or `out` directories. Preview deployments are
marked `noindex`; the production origin remains the canonical public host.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Run `npm run quality` before saving or deploying a Sites version.

## Security

See [SECURITY.md](SECURITY.md). Report vulnerabilities privately and never commit runtime secrets.

## License

No license is declared for this private hosted project. Reuse requires written permission from the owner.

## Purpose

This is the public European ZeroDev LLC landing page and service-discovery
surface.

## Features

- Responsive public navigation, regional service summaries, canonical-domain
  controls, and preview crawler protection.

## Prerequisites

Use Node.js 22.13+ and npm. No local runtime secret is required for the
landing page.

## Usage

Run `npm run dev` for local development and use `npm run quality` for the
release gate. Production changes are saved through the approved Sites flow.
