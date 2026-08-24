# ZERODEVLLC.EU — design prompt

Design and build a polished, production-ready homepage for `ZERODEVLLC.EU`, an independent security engineering studio. The site is the public evidence layer for a portfolio of software: public repositories and safe demos explain the work; private repositories, customer data, live targets, and licensed software stay behind explicit access boundaries.

## Core idea

Use the phrase “Ship proof in public. Keep the edge private.” as the central positioning. The feeling should be calm, precise, technically credible, and slightly editorial — closer to a well-designed incident room than a generic hacker dashboard. Make the work feel high-quality through clarity, restraint, and working interfaces rather than alarmist language.

## Visual direction

- Background: warm mineral paper (`#F5F7F2`) with pale grid lines and soft green-gray borders.
- Ink: near-black green (`#09100F`). Accent: acid chartreuse (`#C7FF4A`). Secondary accent: deep teal (`#1C6559`).
- Typography: a modern grotesk for headlines and body copy, paired with a compact monospace for labels, telemetry, timestamps, and statuses.
- Layout: generous editorial whitespace, asymmetrical two-column hero, dense but legible console modules, strong section dividers, no decorative stock photography.
- Tone: “quiet confidence”; avoid skulls, red hacker clichés, fake command-line gibberish, and unverified claims.
- Motion: subtle hover states and live-feeling updates only. No distracting perpetual animation.
- Accessibility: keyboard-visible focus states, descriptive labels, readable contrast, reduced-motion support, and touch-friendly controls.

## Page structure

1. **Header and status strip**
   - Wordmark: `ZERO DEVLLC.EU` with a simple square `Z` mark.
   - Navigation anchors: Mission, Operations, Work, Access.
   - Persistent status strip: public console online, EU/UTC, evidence-layer version.

2. **Hero / Mission**
   - Headline: “Ship proof in public. Keep the edge private.”
   - Supporting copy should explain that the homepage demonstrates craft while private software and customer data remain gated.
   - Primary CTA: open the operations console.
   - Secondary CTA: view the build map.
   - Include three trust signals: public demos, private delivery, auditable intent.

3. **Operations console**
   - Prominent DEFCON tracker with a clear data-source badge: `DEMO` until a verified adapter is configured, `LIVE` only when a real adapter responds successfully.
   - Synthetic telemetry chart and a recon feed with severity markers.
   - Clearly display `READ-ONLY PUBLIC SURFACE` and `NO SENSITIVE TARGETS`.
   - Never imply that synthetic data is real network intelligence.

4. **Live evidence section**
   - DEFCON tracker: level, label, scale from 1–5, last checked time, adapter status.
   - Recon workbench: an abstract synthetic asset graph, safe-scope statement, and a `Run safe demo scan` interaction.
   - Observations table: signal, surface, observation, severity.
   - If live endpoints are configured, poll them conservatively, validate the response shape, and fall back to safe demo data if the adapter is unavailable.

5. **Build map / Projects**
   - Filter tabs: All systems, Public proof, Private access, Research.
   - Each project card includes title, short explanation, tags, status, visibility badge, and a GitHub/source action.
   - Public projects should link to canonical public GitHub repositories after they exist.
   - Private projects should not expose private repository URLs; use a `Request access` action.
   - Expandable project details should explain the delivery boundary.

6. **Private software access**
   - Explain the safe commercial path in four steps: Checkout → Verify → Entitle → Deliver.
   - Recommend Stripe-hosted checkout, a signed server-side webhook, an entitlement record with product/expiry, and either a least-privilege GitHub invitation or a short-lived Cloudflare R2 download link.
   - Do not collect or expose Stripe secrets in the browser.
   - Provide a contact/request-access CTA until the real checkout links and webhook are configured.

7. **Footer**
   - Studio email, copyright, and a note that public demo data is synthetic until a verified adapter is configured.

## Data and security constraints

- Treat all public UI as untrusted and read-only.
- Never put private repository URLs, Stripe secret keys, webhook signing secrets, customer names, target IPs, tokens, exploit output, or sensitive telemetry in client bundles, static JSON, public GitHub commits, or page metadata.
- Public GitHub pages describe software and link to the public homepage; private source remains in private GitHub repositories or a private artifact store.
- A successful payment is not authorization by itself. Authorization must be created by a verified webhook and checked at delivery time.
- Revocation must be possible after refund, dispute, expiry, or manual action.
- Prefer short-lived signed downloads, private GitHub invitations, and audit logs over permanent public links.
- Keep a visible “demo/simulation” state until the operator has configured and validated a real feed adapter.

## Acceptance criteria

- A first-time visitor understands what ZERODEVLLC.EU does within one viewport.
- The operations console is interactive, responsive, and honest about whether it is using demo or live data.
- Project visibility is obvious and private projects do not leak source links.
- The purchase-to-access model is understandable without revealing implementation secrets.
- The site feels like a credible security engineering portfolio, not a generic dashboard template.
- The homepage works on mobile, supports keyboard navigation, and respects reduced motion.
