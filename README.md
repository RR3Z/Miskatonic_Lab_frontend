<p align="center">
  <img src="assets/readme-logo-esoteric.webp" alt="Miskatonic Lab" width="720">
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16.2.10-000000?logo=nextdotjs&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react&logoColor=111111">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white">
  <img alt="shadcn/ui" src="https://img.shields.io/badge/UI-shadcn%2Fui-111111">
  <img alt="Motion" src="https://img.shields.io/badge/Animation-Motion-FFF312?logo=framer&logoColor=111111">
  <img alt="Vitest" src="https://img.shields.io/badge/Tests-Vitest-6E9F18?logo=vitest&logoColor=white">
  <img alt="Playwright" src="https://img.shields.io/badge/E2E-Playwright-2EAD33?logo=playwright&logoColor=white">
</p>

# Miskatonic Lab Frontend

Frontend for a Call of Cthulhu character and room-management app.

It provides the browser interface for investigators and the future room, dice, event, and WebSocket features. Next.js owns routing and rendering, Tailwind CSS and shadcn/ui own the component layer, TanStack Query owns server state, local component state owns current UI flows, and the Go backend owns persistence and final authorization enforcement. Zustand is reserved for shared local or realtime state when that state is introduced.

## Features

- Next.js App Router with TypeScript strict mode and server-side protection for authenticated routes.
- Clerk modal authentication with Russian localization and return-to-route intent.
- Character list, creation, portrait upload, deletion, and per-user TanStack Query cache isolation.
- Tailwind CSS v4 theme and manually maintained shadcn/ui component layer.
- Vitest, Testing Library, MSW, and Playwright test foundation.
- Motion powers restrained landing reveals, character-list layout transitions, and the reduced-motion policy.

## Requirements

- Node.js and npm.
- Playwright browser binaries for E2E:
  ```powershell
  npx playwright install chromium
  ```
- Running backend only for live API/E2E scenarios:
  `C:\Projects\Miskatonic_Lab_backend`

## Setup

```powershell
cp .env.example .env
npm install
npm run dev
```

The dev server listens on `http://localhost:3000` by default.

## Environment

See [.env.example](.env.example) for the local template.

Required for local API integration:

- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_WS_BASE_URL`

Required for Clerk authentication:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

Optional for Playwright:

- `PLAYWRIGHT_BASE_URL`
- `PLAYWRIGHT_PORT`

## Scripts

```powershell
npm run dev        # start the Next.js dev server
npm run build      # build production output
npm run start      # serve production output after build
npm run check      # run Biome checks
npm run format     # format code with Biome
npm run test       # run Vitest unit/component tests
npm run test:e2e   # run Playwright E2E tests
npm run test:all   # run Biome, Vitest, build, and Playwright
```

## Project Surface

- `src/app` - Next.js App Router routes, layouts, route guards, and root providers.
- `src/components` - feature composition plus shared layout, auth, motion, and UI components.
- `src/dto` - Zod schemas, raw form input types, and validated DTO types.
- `src/lib/api` - authenticated API transport, query keys, TanStack Query hooks, and cache lifecycle.
- `src/lib/clerk` - shared Clerk server configuration and visual configuration.
- `src/types` - backend response and normalized frontend data shapes.
- `tests` - unit, component, API-mocked, and browser tests plus shared fixtures and render helpers.

## Form Policy

- Build form markup from manually maintained shadcn/ui components in `src/components/ui`.
- Use React Hook Form and `Controller` for form state and controlled components such as `Select`.
- Define validation and normalization once in a Zod schema under `src/dto/<feature>`.
- Export separate `z.input` and `z.output` types when schema transforms raw field values into an API-ready DTO.
- Pass only validated DTO output to TanStack Query mutations. Backend validation remains authoritative.

## Animation Policy

Use Motion only where animation communicates appearance, removal, or layout change. The root `MotionProvider` uses `reducedMotion="user"`; custom timer-based effects must also check `useReducedMotion` because they are outside Motion's automatic policy. Keep shadcn transitions for Sidebar, Sheet, Dialog, Dropdown Menu, and Tooltip instead of layering duplicate Motion animations over them.



Architecture boundaries live in [docs/architecture.md](docs/architecture.md). UI and test conventions live in [docs/ui.md](docs/ui.md) and [docs/testing.md](docs/testing.md). Planned cleanup is tracked in [docs/future-plans.md](docs/future-plans.md).
