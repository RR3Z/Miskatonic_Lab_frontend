# Testing Strategy

This frontend uses a layered test setup: Vitest for local unit/component checks, MSW for mocked backend contracts, and Playwright for browser scenarios.

Run every configured check and test:

```powershell
npm run test:all
```

`test:all` runs Biome, Vitest, production build, and Playwright E2E.

## Required Software

- Node.js and npm.
- Playwright browser binaries:
  ```powershell
  npx playwright install chromium
  ```
- A running backend is not required for normal unit/component tests because API traffic should be mocked with MSW.
- Live backend E2E is opt-in and requires `C:\Projects\Miskatonic_Lab_backend`, PostgreSQL, backend env vars, and real Clerk/session setup.

## Commands

- Run Biome checks:
  ```powershell
  npm run check
  ```
- Run unit and component tests once:
  ```powershell
  npm run test
  ```
- Run Vitest in watch mode:
  ```powershell
  npm run test:watch
  ```
- Run Vitest UI:
  ```powershell
  npm run test:ui
  ```
- Run browser E2E:
  ```powershell
  npm run test:e2e
  ```
- Run all configured verification:
  ```powershell
  npm run test:all
  ```

## Unit Tests

- Use Vitest.
- Put pure helper, validator, API transform, and store tests under `tests/unit`.
- Keep tests deterministic and independent of Next.js runtime when possible.
- Mock network with MSW instead of calling the backend.

## Component Tests

- Use Testing Library with jsdom.
- Put component tests under `tests/components`.
- Test accessible behavior: roles, labels, keyboard interaction, validation messages, loading/error/empty states.
- Avoid snapshot-first tests. Prefer user-visible assertions.
- For landing reusable pieces, test shared components directly and keep page tests focused on integration.

## API Mocking

- MSW server setup lives in `tests/setup.ts` and `tests/mocks`.
- Add shared handlers in `tests/mocks/handlers.ts` only when several tests use the same backend contract.
- Prefer per-test handler overrides for one-off error or edge cases.
- Unhandled requests should fail tests so accidental live backend calls are visible.

## End-To-End Tests

- Use Playwright.
- Put E2E specs under `tests/e2e`.
- `playwright.config.ts` starts the Next dev server on `127.0.0.1:3000` unless `PLAYWRIGHT_BASE_URL` points to an already running app.
- Keep E2E small and scenario-based: app shell, auth entry, character workflow, room open/join, chat, dice, and realtime updates.
- Do not make normal E2E depend on the live backend until the scenario explicitly needs it.

## Live Backend E2E

Live backend E2E should stay opt-in.

Before running live scenarios:

- Start the backend from `C:\Projects\Miskatonic_Lab_backend`.
- Start PostgreSQL and apply backend migrations.
- Configure frontend API and WebSocket base URLs.
- Provide real Clerk/session credentials required by the scenario.

Use separate Playwright projects or explicit env flags for live backend tests so local deterministic E2E remains fast.
