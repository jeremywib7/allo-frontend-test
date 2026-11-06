# Orbit — SpaceX Rocket Explorer

Allo Bank frontend solution by **jeremywib7**. React + TypeScript, React Router and Context. Original assignment preserved in [ASSIGNMENT.md](ASSIGNMENT.md); upstream Git history retained. Solution branch: `feat/allo-spacex`. No upstream PR or form submission made.

## Run

Node **22.18+** (native TypeScript test support), npm.

```sh
npm ci --include=dev
npm run dev -- --host 127.0.0.1
npm test
npm run build
npm run preview
```

Production static host must rewrite unknown paths to `index.html` for BrowserRouter direct routes. `dist/` is build output, not committed. No backend or API key required.

## Features

- `/`: remote rocket list with image, name, description; case-insensitive trimmed text filter over name, description and country.
- `/rockets/:id`: detail including cost (USD), country and first flight. Direct remote links fetch detail when necessary.
- Add rocket form with validated name/description, optional HTTP(S) image, cost, country and date. Added rockets exist in Context until refresh; IDs use `local-` + UUID and never collide with API numeric IDs.
- Loading, error/retry (including 429), success and no-results states. Nullable fields and failed images have explicit fallbacks; zero cost remains `$0`.
- Responsive cards/detail/form, labeled controls, keyboard focus, skip link, reduced motion.

## API and lifecycle

Uses Launch Library **2.2.0**, not 2.3.0:

```text
GET https://lldev.thespacedevs.com/2.2.0/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20
GET https://lldev.thespacedevs.com/2.2.0/config/launcher/:id/
```

One list request normally returns all 13 records. Unexpected pagination is followed only on the same origin/path with loop/20-page protection. Boundary normalization accepts nullable API fields without pretending request failures are successful data. Effects own AbortControllers and ignore stale/unmounted results. Context keeps local/remote arrays separate, so incoming/retried requests never overwrite user additions. Detail requests reuse catalog when available; a direct detail page can issue both background catalog and detail requests, favoring simple shared state over premature request-cache complexity.

The dev host has generous limits; no automatic retries/polling. Retry is explicit. External artwork URLs are browser-loaded HTTP(S) images, not fetched by a server. Browser CSP/security and image-source allowlists should be tightened before production use. No HTML injection, credentials or persistent user storage.

## Verification

`npm test`: Node test runner, normalization/missing data/zero cost, filter, local input validation/UUIDs, request URL and pagination, HTTP 429/500, malformed payload, foreign pagination, detail validation and abort propagation. `npm run build`: strict TypeScript + Vite production build.

Browser verified: real API returned 13 rockets; local add/detail/back/filter; direct Falcon 9 Block 5 detail; 390px viewport no overflow; intercepted 429 followed by successful Retry; sparse fixture displays zero cost and missing-value fallbacks. Runtime requests are not part of unit tests, keeping tests deterministic and offline.

## Trade-offs

React replaces the upstream Vue/Vuetify starter, matching the selected stack; no unnecessary state library. Context is enough for two screens and memory-only additions. No persistent cache, authentication, backend writes or elaborate design framework. No claim of ownership of API data; data credit: [The Space Devs](https://thespacedevs.com/llapi).
