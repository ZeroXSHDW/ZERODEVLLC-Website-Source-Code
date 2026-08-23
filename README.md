# ZeroDevLLC Website

ZeroDevLLC corporate site and interactive 3D model viewer, built with Next.js, React Three Fiber, and Three.js. Browse, interact with, and export 3D models directly in the browser.

## Features

- **High-Performance Rendering**: Optimized with WebGL, frustum culling, and adaptive quality.
- **Interactive Controls**: Pan, zoom, and rotate with mouse or touch gestures.
- **Model Support**: Load standard `.glb` and `.gltf` files.
- **Export Capabilities**: Capture and export high-resolution screenshots in PNG, JPEG, or WebP formats.
- **Accessibility**: ARIA-compliant, keyboard navigation, and screen reader support.
- **Responsive Design**: Fully responsive UI that works across desktop, tablet, and mobile devices.
- **XR Support**: Built-in support for Augmented Reality (AR) and Virtual Reality (VR) experiences.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/)
- **3D Engine**: [Three.js](https://threejs.org/)
- **React 3D Bridge**: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- **UI Components**: [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

## Getting Started

### Prerequisites

- The exact Node.js version in [`.node-version`](.node-version) (currently
  Node.js 22.23.1); the `engines` entry remains the minimum supported release
- npm or yarn
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ZeroXSHDW/ZERODEVLLC-Website-Source-Code.git
   cd ZERODEVLLC-Website-Source-Code
   ```

2. Install dependencies (prefer lockfile install):

   ```bash
   npm ci --ignore-scripts
   ```

   Or `npm install` if you are intentionally updating dependencies.

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Useful scripts

| Script               | Purpose                                                  |
| -------------------- | -------------------------------------------------------- |
| `npm run type-check` | TypeScript (`tsc --noEmit`) — used in CI                 |
| `npm test`           | Jest unit/component tests                                |
| `npm run lint`       | ESLint with the committed Next.js flat configuration     |
| `npm run build`      | Production build                                         |
| `npm run quality`    | Full type, lint, format, coverage, audit, and build gate |

The pull-request gate runs the canonical `npm run quality` command after a
locked `npm ci --ignore-scripts` install. It performs type checking, ESLint,
Prettier format validation, Jest coverage with a global 9.5% statements,
branches, and lines floor plus an 11% functions floor, a moderate-or-higher
dependency audit, a tracked-file secret-hygiene scan, and a production build.
The dependency audit is bounded to five minutes by default; set
`NPM_AUDIT_TIMEOUT_MS` to tune the limit. A timeout returns status 124 so a
network or registry stall cannot hang the release gate indefinitely.
Run it locally with:

```bash
npm ci --ignore-scripts
npm run quality
```

## Project Structure

- `app/`: Next.js App Router pages and layouts.
- `components/`:
  - `3d/`: Core 3D components (Scene, Model, Lighting, etc.).
  - `ui/`: Standard React UI components.
  - `ErrorBoundary/`: Error handling components.
- `lib/`:
  - `hooks/`: Custom React hooks for state and 3D logic.
  - `utils/`: Utility functions for performance and calculations.
  - `workers/`: Web Workers for off-main-thread processing.
- `public/`: Static assets including the default 3D model.

## Performance Optimizations

- **LOD (Level of Detail)**: Dynamically switches model complexity based on distance.
- **Worker-based Processing**: Offloads heavy geometry calculations to Web Workers.
- **Adaptive Resolution**: Automatically adjusts render resolution based on device performance.
- **Progressive Loading**: Shows granular progress during large model downloads.

## License

MIT — see [LICENSE](LICENSE)

## Contributing

Run `npm run quality` before review and keep the public site free of credentials and generated output. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Security

Report vulnerabilities privately using [SECURITY.md](SECURITY.md). Do not publish deployment tokens, customer data, or private environment values.

The edge proxy accepts only the configured `zerodevllc.com`, `zerodevllc.eu`, and
`zerodevllc.store` host families. It redirects HTTP and `www` aliases to the
HTTPS apex host, rejects unknown Host headers, and emits the shared strict
security profile. Set `ZERO_DEV_RELEASE` to the exact release fingerprint for
each production deployment so stale artifacts cannot present as current.

## Usage

Use the documented npm scripts for local development, quality checks, and the
production build. Keep public assets, environment configuration, and hosting
behavior consistent with the deployed site; do not edit generated output.

## Troubleshooting

Start with `npm ci --ignore-scripts`, then run the typecheck, lint, bounded audit,
test, and build gates in order. If a hosted deployment fails before a job starts, distinguish the
account or billing failure from a code failure and retain the local evidence.
