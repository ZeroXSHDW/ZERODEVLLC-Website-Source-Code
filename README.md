# ZERODEVLLC.EU

Public evidence layer for independent security engineering, defensive research, and carefully gated software.

## Run locally

```bash
npm install
npm run dev
```

The homepage intentionally starts with safe synthetic telemetry. Configure the optional public adapter URLs below only when the response is sanitized and contains no sensitive target data.

## Optional feed adapters

Copy `.env.example` to `.env.local` and set:

- `NEXT_PUBLIC_DEFCON_FEED_URL` — JSON endpoint returning `{ "level": 5, "label": "NOMINAL", "description": "...", "updatedAt": "..." }`.
- `NEXT_PUBLIC_RECON_FEED_URL` — JSON endpoint returning `{ "events": [{ "id": "...", "time": "...", "kind": "PROBE", "target": "sanitized-surface", "detail": "...", "severity": "low" }] }`.

These are browser-visible URLs. They must not require a secret key and must only return deliberately public, sanitized data. For real feeds, place the provider credentials and filtering logic in a server-side or Cloudflare Worker adapter, then expose only the safe response shape.

## GitHub and private delivery model

Use a public repository for the homepage and public project descriptions. Keep production source, private targets, customer data, and licensed software in private repositories or a private artifact store.

Recommended flow:

1. Send the visitor to a Stripe-hosted Checkout Session.
2. Verify the webhook signature server-side; never trust a browser redirect as proof of payment.
3. Create an entitlement record containing product, customer reference, expiry, and revocation state.
4. Deliver through a least-privilege GitHub invitation or a short-lived Cloudflare R2 signed URL.
5. Re-check entitlement when downloading, expire links quickly, and revoke access on refund/dispute/expiry.

The homepage links paid access to the existing `https://zerodevllc.store` storefront. Keep the actual Checkout Session, webhook verification, and delivery worker there or behind server-side hosting; the public EU homepage should only carry the user-facing link and safe status copy.

Do not place `STRIPE_SECRET_KEY`, webhook secrets, private GitHub tokens, private repository URLs, or customer data in this public repository.

## Domain

The intended public hostname is `ZERODEVLLC.EU`. Point the domain to the chosen hosting provider and keep the public homepage separate from private software delivery services. The homepage should remain safe to publish even if the private distribution system is temporarily offline.

## Project links

The public project cards point to the currently published `ZeroXSHDW` repositories for the audit, network bridge, and NVD converter examples. Private projects intentionally show `Request access` and do not expose private repository URLs. Add a new public URL directly to the project data only after the repository and its README are ready for public review.
