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

It provides the future browser interface for investigators, character sheets, dice rolls, rooms, room events, and room WebSocket chat. Next.js owns routing and rendering, Tailwind CSS and shadcn/ui own the component layer, TanStack Query owns server state, Zustand owns local UI/realtime state, and the Go backend owns persistence and authentication enforcement.

## Features

- Next.js App Router scaffold with TypeScript strict mode.
- Tailwind CSS v4 theme groundwork and shadcn/ui component setup.
- Prepared feature folders for characters, rooms, layout, API, WebSocket, validators, stores, and shared types.
- Vitest, Testing Library, MSW, and Playwright test foundation.
- Motion installed for final animation polish, but intentionally unused in early implementation stages.

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

Required once Clerk frontend auth is wired:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

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

- `src/app` - Next.js App Router routes and layouts.
- `src/components` - shadcn/ui plus future character, room, and layout components.
- `src/lib/api` - future typed API client and TanStack Query integration.
- `src/lib/ws` - future room WebSocket client and hooks.
- `src/stores` - future Zustand stores.
- `tests` - Vitest, Testing Library, MSW, and Playwright tests.

## Animation Policy

Motion is installed as the planned React animation library. Do not use it in early feature work. Keep initial screens functional and accessible first; apply Motion during the final polish/animation stage for deliberate transitions, layout animation, gestures, and micro-interactions.

## Backend

The backend lives in `C:\Projects\Miskatonic_Lab_backend`.

Useful backend references:

- `docs/testing.md`
- `docs/room-realtime.md`
- `docs/errors/`

More frontend detail lives in [FRONTEND_STACK.md](FRONTEND_STACK.md), [AGENTS.md](AGENTS.md), and [docs/testing.md](docs/testing.md).
